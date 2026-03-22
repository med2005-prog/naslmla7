const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJ8DCp29GlHyBYPrVp8YWYI12KF8zCBPdZD7VB0QNl6wP0mr45TzBwzeKdADiB0Dq4/exec';
export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 بدء إرسال البيانات إلى Google Sheets...');
    console.log('📦 البيانات المرسلة:', orderData);
    const dataToSend = {
      timestamp: new Date().toLocaleString('ar-MA', { 
        timeZone: 'Africa/Casablanca',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      productName: orderData.productName,
      productPrice: orderData.productPrice,
      customerName: orderData.fullName,
      phone: orderData.phone,
      address: orderData.address
    };
    console.log('📋 البيانات النهائية:', dataToSend);
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });
    console.log('✅ تم إرسال البيانات بنجاح!');
    console.log('🔗 الرابط المستخدم:', GOOGLE_SCRIPT_URL);
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات إلى Google Sheets:', error);
    console.error('📝 تفاصيل الخطأ:', error.message);
    return { success: false, error: error.message };
  }
};
