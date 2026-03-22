import mongoose from 'mongoose';

// MongoDB Connection with caching
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }
  
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  cachedDb = db;
  console.log('MongoDB Connected');
  return db;
}

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  fullDescription: String,
  images: [String],
  videoUrl: String,
  hasPromotion: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// API Handler
export default async function handler(req, res) {
  // CORS Headers (set first)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Connect to database with error handling
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({
        success: false,
        error: 'MONGODB_URI environment variable is not set',
        note: 'Please add MONGODB_URI in Vercel Dashboard -> Settings -> Environment Variables'
      });
    }
    await connectDB();
  } catch (dbError) {
    console.error('MongoDB Connection Error:', dbError.message);
    return res.status(500).json({
      success: false,
      error: dbError.message,
      errorType: dbError.name,
      note: 'MongoDB connection failed. Check: 1) MONGODB_URI is correct, 2) IP 0.0.0.0/0 is whitelisted in MongoDB Atlas'
    });
  }
  
  try {
    // GET - Get all products
    if (req.method === 'GET') {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.status(200).json({ 
        success: true, 
        data: products,
        count: products.length 
      });
    }
    
    // POST - Add new product
    if (req.method === 'POST') {
      console.log('[API DEBUG] Creating product:', Object.keys(req.body));
      const product = await Product.create(req.body);
      console.log('[API DEBUG] Product created:', product._id);
      return res.status(201).json({ 
        success: true, 
        data: product,
        message: 'Product saved to MongoDB Atlas' 
      });
    }
    
    // PUT - Update product
    if (req.method === 'PUT') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Product ID is required' 
        });
      }
      
      const product = await Product.findByIdAndUpdate(id, req.body, { 
        new: true,
        runValidators: true 
      });
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        data: product,
        message: 'Product updated successfully' 
      });
    }
    
    // DELETE - Delete product
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ 
          success: false, 
          message: 'Product ID is required' 
        });
      }
      
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: 'Product deleted successfully' 
      });
    }
    
    // Method not allowed
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Server error' 
    });
  }
}
