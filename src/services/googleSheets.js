const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwZ1p7IQ8agOeW0BzSr3xDyDzRIrDePfkoqo8KN3JHyKz_IHPhQMIeXwvBmJco3Yh2x/exec';

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 إرسال البيانات إلى Google Sheets...');

    // Build URL params (GET request - most reliable with Google Apps Script)
    const params = new URLSearchParams({
      productName: orderData.productName || '',
      totalPrice:  orderData.productPrice || 0,
      customerName: orderData.fullName || '',
      phone:        orderData.phone || '',
      address:      orderData.address || ''
    });

    const url = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
    console.log('📋 URL المرسلة:', url);

    await fetch(url, {
      method: 'GET',
      mode:   'no-cors',
    });

    console.log('✅ تم الإرسال بنجاح!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    return { success: false, error: error.message };
  }
};

