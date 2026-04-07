import Groq from 'groq-sdk';
import mongoose from 'mongoose';

// MongoDB connection caching for serverless
let cachedDb = null;
let Product = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI missing');
  }

  const db = await mongoose.connect(process.env.MONGODB_URI);
  cachedDb = db;
  
  const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    category: String,
  });
  
  Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  return db;
}


export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
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
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // In Vercel, this must be set in the Environment Variables of the project
    if (!process.env.GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY');
      return res.status(500).json({ 
        error: 'API key not configured',
        reply: 'عذرا، الـ API Key غير موجود في إعدادات السيرفر أو Vercel.' 
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    let catalog = 'لم يتم جلب المنتجات بعد.';
    try {
      await connectDB();
      const products = await Product.find({});
      if (products.length > 0) {
        catalog = products.map(p => 
          `- اسم المنتج: ${p.name}\n  الثمن: ${p.price} درهم\n  الوصف: ${p.description || 'لا يوجد'}`
        ).join('\n\n');
      } else {
        catalog = 'حاليا لا توجد منتجات مسجلة في المتجر.';
      }
    } catch (dbErr) {
      console.error('Failed to connect to DB for catalog:', dbErr);
    }

    const systemInstruction = `أنت المساعد الذكي الرسمي لمتجر naslmla7.store.

قائمة الخدمات والمنتجات المتوفرة حالياً فقط:

1. خدمة خاصة: صنع المواقع الإلكترونية الاحترافية (Web Development)
   - الوصف: كنصاوبو مواقع متكاملة، عصرية وسريعة (React, Node.js).
   - الثمن: كيبدا من 3000 درهم (على حسب المتطلبات).

2. المنتجات المتوفرة في المتجر (من قاعدة البيانات):
${catalog}

القواعد الصارمة:
- تحدث بالدارجة المغربية فقط (أسلوب مهني وودي).
- أجب فقط عن "صنع المواقع" وعن "المنتجات" الموجودة في القائمة أعلاه.
- أي خدمة أخرى (مونتاج، أتمتة، إلخ) قل أنها "غير متوفرة حالياً في ناس الملاح".
- إذا سألك الزبون عن شيء غير موجود، اعتذر بلباقة ووجهه للمنتجات المتوفرة.
- شجع الزبون على التواصل معنا لإتمام الطلب أو الاستفسار عن تفاصيل المواقع.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 500
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'لا يوجد رد';

    return res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {
    console.error('Chat Serverless Logic Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message,
      reply: 'عذرا، وقع خطأ في معالجة طلبك.'
    });
  }
}
