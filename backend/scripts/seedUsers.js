import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

// Load env vars
dotenv.config();

/**
 * Seed initial administrative user
 */
const seedUsers = async () => {
  try {
    await connectDB();

    // Admin users to create
    const adminUsers = [
      {
        name: process.env.ADMIN_NAME || 'Admin Main',
        email: process.env.ADMIN_EMAIL || 'admin@naslmla7.com',
        password: process.env.ADMIN_PASS || 'changeme123',
        role: 'admin'
      }
    ];

    // Create admin users
    for (const userData of adminUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists. Skipping.`);
      } else {
        const user = await User.create(userData);
        console.log(`✅ Admin created: ${user.email}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!\n');
    console.log('📝 Credentials Updated:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email: mohammedelmalki2005@gmail.com');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedUsers();
