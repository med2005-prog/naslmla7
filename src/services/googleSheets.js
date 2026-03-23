const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcWdk6ZKbiD2eEmhiSNQt4mHxB_rp8w7nfqgcObQ7mclGIJpEjP3XLRCFbsOieK6Zn/exec';

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 إرسال البيانات إلى Google Sheets...');

    const dataToSend = {
      productName:  orderData.productName  || '',
      totalPrice:   orderData.productPrice || 0,
      customerName: orderData.fullName     || '',
      phone:        orderData.phone        || '',
      address:      orderData.address      || ''
    };

    console.log('📋 البيانات المرسلة:', dataToSend);

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:   JSON.stringify(dataToSend)
    });

    console.log('✅ تم الإرسال بنجاح!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    return { success: false, error: error.message };
  }
};
