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
        catalog = products.map(p => {
          let priceStr = `${p.price} درهم`;
          if (p.hasPromo && p.promoPrice) {
            priceStr = `${p.promoPrice} درهم (تخفيض من ${p.price})`;
          }
          return `- ${p.name} : ${priceStr}`;
        }).join('\n');
      } else {
        catalog = 'حاليا لا توجد منتجات مسجلة في المتجر.';
      }
    } catch (dbErr) {
      console.error('Failed to connect to DB for catalog:', dbErr);
    }

    const systemInstruction = `أنت المساعد الذكي الرسمي لمتجر naslmla7.store. 

قائمة الخدمات والمنتجات المتوفرة حالياً:

1. خدمة خاصة: صنع المواقع الإلكترونية الاحترافية (Web Development)
   - الوصف: مواقع عصرية، سريعة وآمنة (React, Node.js).
   - الثمن: كيبدا من 3000 درهم (على حسب الخدمة).

2. قائمة المنتجات المتوفرة (من قاعدة البيانات):
${catalog}

قواعد الإجابة الصارمة:
- هضر بالدارجة المغربية فقط وبأسلوب محترم ومهني وعملي.
- إذا سأل الزبون "شنو عندكم؟" أو طلب قائمة المنتجات، اعطيه القائمة باختصار (كل منتج وثمنه في سطر واحد كما هو موضح أعلاه) بدون إطالة.
- أي خدمة أخرى (مونتاج، أتمتة) قل أنها غير متوفرة حالياً.
- **مهم جداً:** لا تقم بإعطاء روابط التواصل الاجتماعي الخاصة بالموقع أبداً إلا إذا سألك المستخدم صراحة وأراد التواصل (مثلا: "عطوني الفيسبوك" أو "كيفاش نتواصل معاكم؟").

روابط التواصل الاجتماعي (للإجابة فقط عند الطلب):
- الواتساب (WhatsApp) للطلب: https://wa.me/212709277659
- الفيسبوك (Facebook): https://www.facebook.com/share/1ERmQ7cdY1/
- تيك توك (TikTok): https://tiktok.com/@nas.lmla7
- الإنستغرام (Instagram): https://www.instagram.com/nas.lmla7?igsh=OWhzemhyaWZmczE=
- اليوتوب (YouTube): https://youtube.com/@naslmla7?si=pSVaUPYj3L3Jx_l8`;

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
