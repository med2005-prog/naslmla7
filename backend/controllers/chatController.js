import Groq from 'groq-sdk';
import fs from 'fs';
import Product from '../models/Product.js';

// Controller for chat endpoint using Groq
export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY');
      return res.status(500).json({ 
        error: 'API key not configured',
        reply: 'عذرا، خدمة المحادثة غير متوفرة حاليا. المرجو المحاولة لاحقا.' 
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    let catalog = 'لم يتم جلب المنتجات بعد.';
    try {
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

قائمة الخدمات والمنتجات المتوفرة حالياً:

1. خدمة خاصة: صنع المواقع الإلكترونية الاحترافية (Web Development)
   - الوصف: مواقع عصرية، سريعة وآمنة (React, Node.js).
   - الثمن: كيبدا من 3000 درهم (على حسب الخدمة).

2. قائمة المنتجات المتوفرة (من قاعدة البيانات):
${catalog}

قواعد الإجابة الصارمة:
- هضر بالدارجة المغربية فقط وبأسلوب محترم ومهني.
- إذا سأل الزبون "شنو عندكم؟" أو طلب قائمة، اعرض الخدمات والمنتجات في **قائمة منظمة بـ Bullet points**.
- أي خدمة أخرى (مونتاج، أتمتة) قل أنها غير متوفرة حالياً.

روابط التواصل الاجتماعي لـ ناس الملاح (naslmla7):
- الواتساب (WhatsApp): https://wa.me/212709277659
- الفيسبوك (Facebook): https://www.facebook.com/share/1ERmQ7cdY1/
- تيك توك (TikTok): https://tiktok.com/@nas.lmla7
- الإنستغرام (Instagram): https://www.instagram.com/nas.lmla7?igsh=OWhzemhyaWZmczE=
- اليوتوب (YouTube): https://youtube.com/@naslmla7?si=pSVaUPYj3L3Jx_l8

دائماً في نهاية الحوار، شجع الزبون يتابعنا فالسوشل ميديا (TikTok و Facebook خاصة) باش يوصلو الجديد، أو يتواصل معنا فواتساب باش يبدا الطلب ديالو.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: message }
      ],
      // llama3-70b-8192 or llama3-8b-8192 is amazingly fast
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 500
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'System Error/لا يوجد رد';

    res.status(200).json({
      success: true,
      reply: reply
    });

  } catch (error) {
    // fs.writeFileSync('chat_error.txt', JSON.stringify({ message: error.message, stack: error.stack }, null, 2));
    console.error('Chat controller error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process chat message',
      reply: 'عذرا، وقع خطأ في معالجة طلبك.'
    });
  }
};
