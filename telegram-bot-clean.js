// =====================================================
// SECRET ROOM CALENDAR — DATA SAVER
// Google Apps Script — только сохранение данных в таблицу
// Бот работает на Render, сюда приходят данные для записи
// =====================================================

var CONFIG = {
  SPREADSHEET_ID: '1kwiWTnsfaxy-iNA9rXTHeMKalRS4Q42mgsezzTQLZJY',
  SHEET_NAME: 'Bot Users'
};

// Принимаем данные от бота на Render
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    saveUser(data);
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error: ' + err);
    return ContentService.createTextOutput(JSON.stringify({success: false}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Сохраняем пользователя в таблицу
function saveUser(data) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Telegram ID', 'First Name', 'Last Name', 'Username', 'Phone']);
  }

  // Проверяем есть ли уже пользователь
  var values = sheet.getDataRange().getValues();
  var existingRow = -1;

  for (var i = 1; i < values.length; i++) {
    if (values[i][1] == data.telegram_id) {
      existingRow = i + 1;
      break;
    }
  }

  var rowData = [
    data.timestamp || new Date().toISOString(),
    data.telegram_id,
    data.first_name || '',
    data.last_name || '',
    data.username || '',
    data.phone || ''
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}
