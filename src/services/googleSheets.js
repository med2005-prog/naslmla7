const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf7JdsEdJc0OrKYhUtMrT2U9zO4V2bvV6UL3XNAUMNx7esCa6i4L--kURXlTwIu78Y/exec';

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 بدء إرسال البيانات إلى Google Sheets...');
    
    // Split fullName into firstName and lastName
    const nameParts = (orderData.fullName || '').trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Convert productName to cartItems (Array)
    let cartItems = [];
    if (typeof orderData.productName === 'string') {
      cartItems = orderData.productName.split(' + ');
    } else if (Array.isArray(orderData.productName)) {
      cartItems = orderData.productName;
    }

    const dataToSend = {
      firstName: firstName,
      lastName: lastName,
      phone: orderData.phone || "",
      address: orderData.address || "",
      city: orderData.address || "", // Currently mapped to address as requested
      totalPrice: orderData.productPrice || 0,
      cartItems: cartItems
    };

    console.log('📋 البيانات النهائية المرسلة:', dataToSend);
    
    // Use no-cors mode to bypass CORS issues with Google Apps Script
    // Returns an opaque response (status 0), which we treat as success
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });
    
    console.log('✅ تم إرسال الطلب بنجاح (Opaque Response)!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في إرسال البيانات:', error.message);
    return { success: false, error: error.message };
  }
};
