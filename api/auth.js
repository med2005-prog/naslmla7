import jwt from 'jsonwebtoken';

// Admin credentials (hardcoded for simplicity)
const ADMIN_EMAIL = 'mohammedelmalki2005@gmail.com';
const ADMIN_PASSWORD = '20052005';

// API Handler
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only POST method allowed
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Check credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          email: email, 
          role: 'admin',
          id: 'admin-001' 
        },
        process.env.JWT_SECRET || 'naslmla7_super_secret_key_2026',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );
      
      return res.status(200).json({
        success: true,
        token: token,
        user: { 
          email: email, 
          role: 'admin',
          name: 'Admin' 
        },
        message: 'Login successful'
      });
    }
    
    // Invalid credentials
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
    
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Server error during authentication' 
    });
  }
}
