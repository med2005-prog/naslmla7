// Google Apps Script للصق في Google Sheets
// Extensions > Apps Script

// ==========================================
// إعدادات تيليجرام (Telegram Settings)
// ==========================================
// ضع التوكن الخاص بالبوت الذي بإنشائه من @BotFather
var TELEGRAM_BOT_TOKEN = "8746458811:AAElA2laUu_gtFwXC1F-ZvII1LnZJlfEM1g"; 
// ضع معرّف المحادثة الخاص بك (عن طريق @userinfobot)
var TELEGRAM_CHAT_ID = "5545563502"; 

function sendTelegramNotification(orderData) {
  if (TELEGRAM_BOT_TOKEN === "ضع_التوكن_هنا" || TELEGRAM_CHAT_ID === "ضع_رقم_الـ_ID_هنا") {
    // لم يتم إعداد التيليجرام بعد، يتم التجاهل.
    return;
  }
  
  var message = "🛍️ *طلب جديد من المتجر!*\n\n" +
                "📦 *المنتج:* " + orderData.productName + "\n" +
                "💰 *السعر:* " + orderData.productPrice + " MAD\n\n" +
                "👤 *الزبون:* " + orderData.customerName + "\n" +
                "📱 *الهاتف:* [" + orderData.phone + "](tel:" + orderData.phone + ")\n" +
                "📍 *العنوان:* " + orderData.address + "\n\n" +
                "⏰ *التاريخ:* " + orderData.timestamp;

  var telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
  
  var payload = {
    "chat_id": TELEGRAM_CHAT_ID,
    "text": message,
    "parse_mode": "Markdown"
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(telegramUrl, options);
  } catch (e) {
    Logger.log("فشل إرسال إشعار تيليجرام: " + e.message);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // ضبط اتجاه الصفحة من اليمين لليسار إذا كانت جديدة
    sheet.setRightToLeft(true);
    
    // إضافة العناوين بالعربية إذا كانت الورقة فارغة
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "التاريخ والوقت",
        "اسم المنتج",
        "السعر الإجمالي",
        "اسم الزبون",
        "رقم الهاتف",
        "العنوان الكامل"
      ]);
      
      // تنسيق العناوين
      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setBackground("#1e293b")
                 .setFontColor("white")
                 .setFontWeight("bold")
                 .setHorizontalAlignment("center");
                 
      // التحكم في عرض الأعمدة
      sheet.setColumnWidth(1, 150); // التاريخ
    }
    
    // تحويل البيانات من JSON
    var data = JSON.parse(e.postData.contents);
    
    // إضافة صف جديد مع البيانات بدون زر الحذف
    var newRow = [
      data.timestamp,           // التاريخ والوقت
      data.productName,         // اسم المنتج
      data.productPrice + " MAD", // السعر مع العملة
      data.customerName,         // اسم الزبون
      "'" + data.phone,         // رقم الهاتف (مع الصفر)
      data.address              // العنوان
    ];
    
    sheet.appendRow(newRow);
    var lastRow = sheet.getLastRow();
    
    // إرسال رسالة إلى تيليجرام
    sendTelegramNotification(data);
    
    // محاذاة البيانات للمركز
    sheet.getRange(lastRow, 1, 1, 6).setHorizontalAlignment("center");
    
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'تم استلام الطلب بنجاح'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
