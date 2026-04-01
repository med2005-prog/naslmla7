const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyv8k4HxKLDzZ16Pd-7iav3_7C01yHbM3b9KwyHdB4o2WuU9029YJKvcnGNgWdEJpYb/exec';

// إعدادات الكونط الثاني (الجديد) ديال تيليجرام
const TELEGRAM_BOT_TOKEN_2 = '8009216263:AAEfYklk0ZB4R3ds98npZS18vjqfpIunfmk';
const TELEGRAM_CHAT_ID_2 = '1762866588';

const sendTelegramNotificationToSecondAccount = async (dataToSend) => {
  try {
    const message = `🛍️ *طلب جديد من المتجر!*\n\n` +
                    `📦 *المنتج:* ${dataToSend.productName}\n` +
                    `💰 *السعر:* ${dataToSend.productPrice} MAD\n\n` +
                    `👤 *الزبون:* ${dataToSend.customerName}\n` +
                    `📱 *الهاتف:* [${dataToSend.phone}](tel:${dataToSend.phone})\n` +
                    `📍 *العنوان:* ${dataToSend.address}\n\n` +
                    `⏰ *التاريخ:* ${dataToSend.timestamp}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN_2}/sendMessage`;
    
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID_2,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    console.log('✅ تم إرسال الإشعار للكونط الثاني بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار تيليجرام للكونط الثاني:', error.message);
  }
};

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 إرسال البيانات إلى Google Sheets...');

    // Mapping values to match what the Apps Script doPost(e) expects
    const price = Number(orderData.productPrice || 0);
    const dataToSend = {
      timestamp: new Date().toLocaleString('ar-MA', { 
        timeZone: 'Africa/Casablanca',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      productName:  String(orderData.productName || 'منتج غير معروف'),
      Prix:         price,        // الاسم الصحيح اللي كيستعملو السكريبت الجديد
      productPrice: price,        // fallback
      totalPrice:   price,        // fallback
      customerName: String(orderData.fullName || 'عميل مجهول'),
      fullName:     String(orderData.fullName || 'عميل مجهول'),
      phone:        String(orderData.phone || ''),
      address:      String(orderData.address || '')
    };

    console.log('📋 البيانات النهائية الصادرة:', dataToSend);

    // 1️⃣ إرسال للكونط الثاني ديال تيليجرام (من الكود مباشرة)
    sendTelegramNotificationToSecondAccount(dataToSend);

    // 2️⃣ إرسال للـ Google Sheets (وهو براسو راه غادي يصيفط للكونط القديم اللي كاين في Apps Script)
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body:   JSON.stringify(dataToSend)
    });

    console.log('✅ تم إرسال الطلب بنجاح إلى Google Sheets!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات:', error.message);
    return { success: false, error: error.message };
  }
};

