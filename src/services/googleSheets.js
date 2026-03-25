const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbXXCHVuRF_4SOD-Ma1Jt5FcDlWXe6de87fd2wvVeeoW4I1cVfBUfwjymUiFDAJzTryA/exec';

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 إرسال البيانات إلى Google Sheets...');

    // Mapping every value explicitly to avoid undefined keys
    const dataToSend = {
      productName:  String(orderData.productName || 'منتج غير معروف'),
      totalPrice:   Number(orderData.productPrice || 0),
      customerName: String(orderData.fullName || 'عميل مجهول'),
      phone:        String(orderData.phone || ''),
      address:      String(orderData.address || '')
    };

    console.log('📋 البيانات الصادرة (Final Check):', dataToSend);

    // Send as plain text to ensure Google's no-cors accepts it properly in e.postData.contents
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body:   JSON.stringify(dataToSend)
    });

    console.log('✅ تم إرسال الطلب بنجاح (Opaque Response)!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات:', error.message);
    return { success: false, error: error.message };
  }
};
