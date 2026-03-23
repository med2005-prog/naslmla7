const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypQ7WC5y-d5OvZtG8SRtBb1C_dj2gc8q_NFaH6xuqCQH4S_Qg8gdZ_L6X2i38-2BI4/exec';

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

