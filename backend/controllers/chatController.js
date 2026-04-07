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
