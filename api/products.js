// Vercel Serverless API for Products - ES Modules
import mongoose from 'mongoose';

// MongoDB Connection with caching
let cachedDb = null;
let Product = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  const db = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = db;
  
  // Define schema inside function to avoid issues
  const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    fullDescription: String,
    category: String,
    image: String,
    images: [String],
    videoUrl: String,
    hasPromo: { type: Boolean, default: false },
    promoPrice: Number,
    promoEndDate: Date,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  
  return db;
}

// API Handler
export default async function handler(req, res) {
  // CORS Headers (set first - before any other code)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check MONGODB_URI before connecting
  if (!process.env.MONGODB_URI) {
    return res.status(500).json({
      success: false,
      error: 'MONGODB_URI environment variable is not set',
      note: 'Add MONGODB_URI in Vercel Dashboard -> Settings -> Environment Variables',
      availableEnvVars: Object.keys(process.env).filter(k => k.includes('MONGO') || k.includes('DB'))
    });
  }

  // Connect to database with error handling
  try {
    await connectDB();
  } catch (dbError) {
    console.error('MongoDB Connection Error:', dbError);
    return res.status(500).json({
      success: false,
      error: dbError.message,
      errorType: dbError.name,
      note: 'MongoDB connection failed. Check: 1) MONGODB_URI is correct, 2) IP 0.0.0.0/0 is whitelisted in MongoDB Atlas'
    });
  }
  
  try {
    // GET - Get all products or single product by ID
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid product ID format',
            message: 'The provided ID is not a valid MongoDB ObjectId'
          });
        }
        
        // Get single product by ID
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: 'Product not found',
            message: `No product found with ID: ${id}`
          });
        }
        return res.status(200).json({
          success: true,
          data: product
        });
      }
      
      // Get all products
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
      
      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID format',
          message: 'The provided ID is not a valid MongoDB ObjectId'
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
      
      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid product ID format',
          message: 'The provided ID is not a valid MongoDB ObjectId'
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