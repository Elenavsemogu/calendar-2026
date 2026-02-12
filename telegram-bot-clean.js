// =====================================================
// SECRET ROOM CALENDAR — DATA SAVER
// Сохраняет данные пользователей в Google Sheets
// Бот работает на Render, сюда приходят данные
// =====================================================

var CONFIG = {
  SPREADSHEET_ID: '1kwiWTnsfaxy-iNA9rXTHeMKalRS4Q42mgsezzTQLZJY',
  SHEET_NAME: 'Bot Users'
};

function doGet(e) {
  try {
    var data = e.parameter;
    
    if (data.telegram_id) {
      saveUser(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error: ' + err);
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    if (data.telegram_id) {
      saveUser(data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('Error: ' + err);
    return ContentService.createTextOutput(JSON.stringify({success: false}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveUser(data) {
  var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Telegram ID', 'First Name', 'Last Name', 'Username', 'Phone', 'Статус']);
  }

  // Проверяем был ли уже этот пользователь
  var values = sheet.getDataRange().getValues();
  var isReturning = false;

  for (var i = 1; i < values.length; i++) {
    if (values[i][1] == data.telegram_id) {
      isReturning = true;
      break;
    }
  }

  // Всегда добавляем новую строку
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.telegram_id,
    data.first_name || '',
    data.last_name || '',
    data.username || '',
    data.phone || '',
    isReturning ? 'Повторный визит' : 'Новый'
  ]);
}
