// Google Apps Script للصق في Google Sheets
// Extensions > Apps Script

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
        "العنوان الكامل",
        "الإجراء" // عمود جديد للحذف
      ]);
      
      // تنسيق العناوين
      var headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setBackground("#1e293b")
                 .setFontColor("white")
                 .setFontWeight("bold")
                 .setHorizontalAlignment("center");
                 
      // التحكم في عرض الأمدة
      sheet.setColumnWidth(1, 150); // التاريخ
      sheet.setColumnWidth(7, 100); // الحذف
    }
    
    // تحويل البيانات من JSON
    var data = JSON.parse(e.postData.contents);
    
    // إضافة صف جديد مع البيانات
    var newRow = [
      data.timestamp,           // التاريخ والوقت
      data.productName,         // اسم المنتج
      data.productPrice + " MAD", // السعر مع العملة
      data.customerName,         // اسم الزبون
      "'" + data.phone,         // رقم الهاتف (مع الصفر)
      data.address,              // العنوان
      "حذف"                      // نص زر الحذف
    ];
    
    sheet.appendRow(newRow);
    var lastRow = sheet.getLastRow();
    
    // تنسيق زر الحذف
    var deleteCell = sheet.getRange(lastRow, 7);
    deleteCell.setBackground("#ef4444")
              .setFontColor("white")
              .setFontWeight("bold")
              .setHorizontalAlignment("center");
    
    // محاذاة البيانات للمركز
    sheet.getRange(lastRow, 1, 1, 7).setHorizontalAlignment("center");
    
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

// وظيفة لحذف الصف عند النقر على خلية الحذف
function onSelectionChange(e) {
  var range = e.range;
  var sheet = range.getSheet();
  
  // التأكد أننا في الورقة النشطة وفي عمود الحذف (العمود 7) وليس في العنوان
  if (range.getColumn() == 7 && range.getRow() > 1) {
    var val = range.getValue();
    if (val == "حذف") {
      var ui = SpreadsheetApp.getUi();
      var response = ui.alert('تأكيد الحذف', 'هل أنت متأكد من حذف هذا الطلب نهائياً؟', ui.ButtonSet.YES_NO);
      
      if (response == ui.Button.YES) {
        sheet.deleteRow(range.getRow());
      }
    }
  }
}
