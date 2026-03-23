const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwOJALO2WDk9zqwxGaQ5a6Jk-UyiLJ5jCkIgiYvUbO_dw6ak5WNy5VCT7CXiFoH6EdL/exec';
export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 بدء إرسال البيانات إلى Google Sheets...');
    console.log('📦 البيانات المرسلة:', orderData);
    
    // Split fullName into firstName and lastName
    const nameParts = (orderData.fullName || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Convert productName string to an array for cartItems if it's a string
    let cartItems = [];
    if (typeof orderData.productName === 'string') {
      cartItems = orderData.productName.split(' + ');
    } else if (Array.isArray(orderData.productName)) {
      cartItems = orderData.productName;
    }

    const dataToSend = {
      firstName: firstName,
      lastName: lastName,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.address, // mapping address as city for now as requested
      totalPrice: orderData.productPrice,
      cartItems: cartItems
    };
    console.log('📋 البيانات النهائية:', dataToSend);
    
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });
    
    console.log('✅ تم إرسال البيانات بنجاح!');
    console.log('🔗 الرابط المستخدم:', GOOGLE_SCRIPT_URL);
    console.log('📡 Response status:', response.status, response.statusText);
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات إلى Google Sheets:', error);
    console.error('📝 تفاصيل الخطأ:', error.message);
    return { success: false, error: error.message };
  }
};
