// =====================================================
// SECRET ROOM CALENDAR — TELEGRAM AUTH BACKEND
// Google Apps Script для проверки подписки и авторизации
// =====================================================

// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
// 1. Открой https://script.google.com/
// 2. Создай новый проект "SecretRoom Auth"
// 3. Скопируй весь этот код
// 4. Настрой константы ниже
// 5. Deploy → New deployment → Web app
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Скопируй URL и вставь в app.js в AUTH_CONFIG.scriptUrl

const CONFIG = {
  BOT_TOKEN: '8191206268:AAEYjnXVO9q7kBGBzvir5ntPedoMQO7IrM',
  CHANNEL_ID: '@secreetroommedia',
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID', // ⬅️ ЗАМЕНИТЬ на ID вашей существующей таблицы
  SHEET_NAME: 'Telegram Auth' // Лист для Telegram авторизации (создастся автоматически)
};

// Main handler
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Validate Telegram data
    if (!data.telegram_id || !data.hash) {
      return jsonResponse({ success: false, message: 'Invalid data' });
    }
    
    // Check subscription
    const isSubscribed = checkChannelSubscription(data.telegram_id);
    
    if (!isSubscribed) {
      return jsonResponse({ 
        success: false, 
        isSubscribed: false,
        message: 'Not subscribed to channel' 
      });
    }
    
    // Save to Google Sheets
    saveToSheet(data);
    
    // Generate access token
    const token = generateToken(data.telegram_id);
    
    return jsonResponse({ 
      success: true, 
      isSubscribed: true,
      token: token 
    });
    
  } catch (error) {
    Logger.log('Error: ' + error);
    return jsonResponse({ success: false, message: error.toString() });
  }
}

// Check if user subscribed to channel
function checkChannelSubscription(telegramId) {
  try {
    const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/getChatMember`;
    const payload = {
      chat_id: CONFIG.CHANNEL_ID,
      user_id: telegramId
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.ok) {
      const status = result.result.status;
      // Valid statuses: creator, administrator, member
      return ['creator', 'administrator', 'member'].includes(status);
    }
    
    return false;
  } catch (error) {
    Logger.log('Subscription check error: ' + error);
    return false;
  }
}

// Save user data to Google Sheets
function saveToSheet(data) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    // Create sheet if doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Telegram ID',
        'First Name',
        'Last Name',
        'Username',
        'Profession',
        'Photo URL',
        'Auth Date'
      ]);
    }
    
    // Check if user already exists (update row)
    const values = sheet.getDataRange().getValues();
    let existingRow = -1;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] == data.telegram_id) {
        existingRow = i + 1;
        break;
      }
    }
    
    const rowData = [
      new Date().toISOString(),
      data.telegram_id,
      data.first_name,
      data.last_name,
      data.username,
      data.profession,
      data.photo_url,
      data.auth_date
    ];
    
    if (existingRow > 0) {
      // Update existing row
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Add new row
      sheet.appendRow(rowData);
    }
    
  } catch (error) {
    Logger.log('Sheet save error: ' + error);
    throw error;
  }
}

// Generate simple access token
function generateToken(telegramId) {
  const timestamp = new Date().getTime();
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    telegramId + ':' + timestamp + ':secretroom'
  );
  return Utilities.base64Encode(hash).substring(0, 32);
}

// Return JSON response
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function
function testSubscriptionCheck() {
  // Replace with real Telegram ID for testing
  const testId = 123456789;
  const result = checkChannelSubscription(testId);
  Logger.log('Subscription check result: ' + result);
}
