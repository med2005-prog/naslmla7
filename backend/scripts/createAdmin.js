import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://naslmla7:U8SO6180i8mIcCjK@cluster0.0dxmwqg.mongodb.net/?appName=Cluster0';

// Admin credentials - CHANGE THESE!
const ADMIN_EMAIL = 'admin@naslmla7.store';
const ADMIN_PASSWORD = 'Admin123456';
const ADMIN_NAME = 'Admin';

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    // Check if admin already exists
    const existingAdmin = await mongoose.connection.db.collection('users').findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Deleting old admin and creating new one...');
      await mongoose.connection.db.collection('users').deleteOne({ email: ADMIN_EMAIL });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user
    const adminUser = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      loginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await mongoose.connection.db.collection('users').insertOne(adminUser);

    console.log('\n========================================');
    console.log('✅ Admin user created successfully!');
    console.log('========================================');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    console.log('ID:', result.insertedId);
    console.log('========================================');
    console.log('\n🔐 Use these credentials to login at:');
    console.log('https://naslmla7.store/admin');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();
