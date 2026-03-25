const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwE3wBb3vbScCBDIxCjQJQWYchhMr7gYfBHe7nlUEzv27_LNyS2Skd-6xlInn9gL8Ca/exec';

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 إرسال البيانات إلى Google Sheets...');

    // Mapping values to match what the Apps Script doPost(e) expects
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
      productPrice: Number(orderData.productPrice || 0),
      customerName: String(orderData.fullName || 'عميل مجهول'),
      phone:        String(orderData.phone || ''),
      address:      String(orderData.address || '')
    };

    console.log('📋 البيانات النهائية الصادرة:', dataToSend);

    // Send as plain text with UTF-8 encoding to ensure Arabic characters work correctly In Google Apps Script
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

