import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('🔌 DB Connected');

    // 1. Clean up existing data (Products & Orders only, keep Users to avoid locking out)
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing Products and Orders');

    // 2. Get Admins
    const admins = await User.find({ role: 'admin' });
    if (admins.length === 0) {
      console.log('❌ No admins found. Please run seedUsers.js first.');
      process.exit(1);
    }
    console.log(`👨‍💼 Found ${admins.length} admins`);

    // 3. Create Products for each admin
    const products = [];
    const categories = ['منتجات زيادة الوزن', 'منتجات الشعر', 'منتجات العناية بالبشرة', 'منتجات انقاص الوزن'];

    for (const admin of admins) {
      // Create 3-8 products per admin
      const numProducts = Math.floor(Math.random() * 6) + 3;
      
      for (let i = 0; i < numProducts; i++) {
        const product = await Product.create({
          name: `منتج ${i + 1} - ${admin.name.split(' ')[0]}`,
          price: Math.floor(Math.random() * 400) + 100, // 100 - 500
          description: 'وصف تجريبي للمنتج يوضح تفاصيل ومميزات هذا المنتج الرائع.',
          category: categories[Math.floor(Math.random() * categories.length)],
          createdBy: admin._id,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
          numReviews: Math.floor(Math.random() * 50)
        });
        products.push(product);
      }
    }
    console.log(`📦 Created ${products.length} products`);

    // 4. Create Orders
    const orders = [];
    // Create 30 random orders
    for (let i = 0; i < 30; i++) {
      // Pick random products for the order
      const orderItems = [];
      const numItems = Math.floor(Math.random() * 3) + 1;
      let total = 0;

      for (let j = 0; j < numItems; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        
        orderItems.push({
          product: product._id,
          name: product.name,
          quantity: qty,
          price: product.price,
          image: 'https://via.placeholder.com/150'
        });
        total += product.price * qty;
      }

      // Assign to random user (or just generic logic)
      // Since we don't have customer users seeded yet effectively, we can reuse an admin ID or nullable if schema allowed. 
      // But Order schema requires 'user'. I'll use the first admin as the 'customer' for simplicity
      const customer = admins[0];

      const order = await Order.create({
        user: customer._id,
        orderItems: orderItems,
        totalPrice: total,
        isPaid: true, // Mark as paid to count in sales
        paidAt: new Date(),
        isDelivered: Math.random() > 0.5
      });
      orders.push(order);
    }
    console.log(`🛒 Created ${orders.length} orders`);

    console.log('\n✅ Data Seeding Completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
