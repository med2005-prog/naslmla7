const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcWdk6ZKbiD2eEmhiSNQt4mHxB_rp8w7nfqgcObQ7mclGIJpEjP3XLRCFbsOieK6Zn/exec';

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

    console.log('📋 البيانات النهائية المرسلة:', dataToSend);

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body:   JSON.stringify(dataToSend)
    });

    console.log('✅ تم إرسال الطلب بنجاح (Opaque Response)!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات:', error.message);
    return { success: false, error: error.message };
  }
};
