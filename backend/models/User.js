import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * User Schema
 * Defines the structure for admin users with role-based access
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم'],
    trim: true,
    maxlength: [50, 'الاسم يجب أن لا يتجاوز 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'الرجاء إدخال البريد الإلكتروني'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'الرجاء إدخال بريد إلكتروني صحيح'
    ]
  },
  password: {
    type: String,
    required: [true, 'الرجاء إدخال كلمة المرور'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
    select: false // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: {
      values: ['admin'],
      message: 'الدور يجب أن يكون admin'
    },
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// ============================================
// INDEXES for better query performance
// ============================================
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// ============================================
// VIRTUAL PROPERTIES
// ============================================
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ============================================
// MIDDLEWARE - Hash password before saving
// ============================================
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// INSTANCE METHODS
// ============================================

/**
 * Compare entered password with hashed password in database
 * @param {String} enteredPassword - Password to check
 * @returns {Boolean} - True if passwords match
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT token for user
 * @returns {String} - JWT token
 */
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

/**
 * Increment login attempts
 */
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }
  
  // Otherwise increment
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock the account after 5 failed attempts for 2 hours
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.updateOne(updates);
};

/**
 * Reset login attempts after successful login
 */
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { 
      loginAttempts: 0,
      lastLogin: Date.now()
    },
    $unset: { lockUntil: 1 }
  });
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Get user by email with password field
 * @param {String} email - User email
 * @returns {Object} - User object
 */
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email }).select('+password');
};

/**
 * Check if user has specific permission
 * @param {String} userId - User ID
 * @param {String} permission - Permission to check
 * @returns {Boolean} - True if user has permission
 */
userSchema.statics.hasPermission = async function(userId, permission) {
  const user = await this.findById(userId);
  if (!user) return false;
  
  // Define admin permissions
  const adminPermissions = [
    'view_products',
    'edit_products',
    'view_orders'
  ];
  
  return adminPermissions.includes(permission);
};

const User = mongoose.model('User', userSchema);

export default User;
