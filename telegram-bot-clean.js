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
    
    // Создаём красивую шапку
    sheet.appendRow(['📅 Дата', '🆔 Telegram ID', '👤 Имя', '👤 Фамилия', '📱 Username', '🌍 Язык', '⭐ Premium', '📊 Источник', '🔄 Статус']);
    
    // Форматируем шапку
    var headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setBackground('#1B1B1B');
    headerRange.setFontColor('#F5DA0F');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    headerRange.setHorizontalAlignment('center');
    
    // Замораживаем шапку
    sheet.setFrozenRows(1);
    
    // Автоширина колонок
    for (var i = 1; i <= 9; i++) {
      sheet.autoResizeColumn(i);
    }
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

  // Форматируем дату: дд/мм/гггг чч:мм
  var timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
  var day = ('0' + timestamp.getDate()).slice(-2);
  var month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
  var year = timestamp.getFullYear();
  var hours = ('0' + timestamp.getHours()).slice(-2);
  var minutes = ('0' + timestamp.getMinutes()).slice(-2);
  var formattedDate = day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;

  // Всегда добавляем новую строку
  var newRow = [
    formattedDate,
    data.telegram_id,
    data.first_name || '',
    data.last_name || '',
    data.username ? '@' + data.username : 'Нет username',
    data.language_code || '',
    data.is_premium || 'Нет',
    data.utm_source || 'Прямой переход',
    isReturning ? '🔄 Повторный' : '🆕 Новый'
  ];
  
  sheet.appendRow(newRow);
  
  // Форматируем новую строку
  var lastRow = sheet.getLastRow();
  var rowRange = sheet.getRange(lastRow, 1, 1, 9);
  
  if (isReturning) {
    rowRange.setBackground('#FFF9E6'); // Светло-жёлтый для повторных
  } else {
    rowRange.setBackground('#E6F9E6'); // Светло-зелёный для новых
  }
}
