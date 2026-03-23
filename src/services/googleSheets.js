const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbypQ7WC5y-d5OvZtG8SRtBb1C_dj2gc8q_NFaH6xuqCQH4S_Qg8gdZ_L6X2i38-2BI4/exec';

export const sendOrderToGoogleSheets = async (orderData) => {
  try {
    console.log('🚀 بدء إرسال البيانات إلى Google Sheets...');
    
    const dataToSend = {
      productName: orderData.productName,
      totalPrice: orderData.productPrice,
      customerName: orderData.fullName,
      phone: orderData.phone,
      address: orderData.address
    };

    console.log('📋 البيانات الصادرة:', dataToSend);

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(dataToSend)
    });

    console.log('✅ تم إرسال البيانات بنجاح!');
    return { success: true };
  } catch (error) {
    console.error('❌ خطأ في الإرسال:', error.message);
    return { success: false, error: error.message };
  }
};

