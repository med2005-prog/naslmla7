/**
 * Force Create Admin Script
 * Run: node scripts/forceCreateAdmin.js
 * This script creates an admin user with hashed password
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// HARDCODED MongoDB URI - Change this to your actual URI
const MONGODB_URI = 'mongodb+srv://naslmla7:U8SO6180i8mIcCjK@cluster0.0dxmwqg.mongodb.net/naslmla7?retryWrites=true&w=majority';

// Admin credentials
const ADMIN_EMAIL = 'admin@naslmla7.store';
const ADMIN_PASSWORD = 'Admin123456';
const ADMIN_NAME = 'Admin';

async function forceCreateAdmin() {
  console.log('='.repeat(50));
  console.log('🚀 FORCE CREATE ADMIN SCRIPT');
  console.log('='.repeat(50));
  
  try {
    console.log('\n📡 Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB successfully!\n');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check if admin exists
    console.log('🔍 Checking for existing admin...');
    const existingAdmin = await usersCollection.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists! Deleting and recreating...');
      await usersCollection.deleteOne({ email: ADMIN_EMAIL });
      console.log('🗑️  Old admin deleted.');
    }

    // Hash password
    console.log('\n🔐 Hashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
    console.log('✅ Password hashed successfully!');

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

    console.log('\n📝 Creating admin user...');
    const result = await usersCollection.insertOne(adminUser);

    console.log('\n' + '='.repeat(50));
    console.log('🎉 ADMIN CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log('📧 Email:', ADMIN_EMAIL);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('🆔 ID:', result.insertedId);
    console.log('='.repeat(50));
    console.log('\n🔗 Login at: https://naslmla7.store/admin');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('\n💡 TIP: Check your internet connection');
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.error('\n💡 TIP: Check your MongoDB username/password');
    } else if (error.message.includes('whitelist') || error.message.includes('IP')) {
      console.error('\n💡 TIP: Add 0.0.0.0/0 to MongoDB Atlas IP Whitelist');
      console.error('   Go to: MongoDB Atlas > Network Access > Add IP Address > Allow Access from Anywhere');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 TIP: MongoDB Atlas IP whitelist may be blocking you');
      console.error('   Wait for 0.0.0.0/0 to become "Active" in MongoDB Atlas');
    }
    
    console.error('\nFull error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📴 Disconnected from MongoDB');
    process.exit(0);
  }
}

forceCreateAdmin();
