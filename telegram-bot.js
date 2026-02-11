// =====================================================
// SECRET ROOM CALENDAR — TELEGRAM BOT
// Google Apps Script для бота с проверкой подписки
// =====================================================

// ✅ ВСЕ ДАННЫЕ УЖЕ НАСТРОЕНЫ!
const CONFIG = {
  BOT_TOKEN: '8191206268:AAEYjnXVO9q7kBGBzvir5ntPedoMQO7IrM',
  CHANNEL_ID: '@secreetroommedia',
  SPREADSHEET_ID: '1kwiWTnsfaxy-iNA9rXTHeMKalRS4Q42mgsezzTQLZJY',
  SHEET_NAME: 'Bot Users',
  CALENDAR_URL: 'https://elenavsemogu.github.io/calendar-2026/' // ⬅️ ЗАМЕНИТЬ на свой домен!
};

// Webhook handler
function doPost(e) {
  try {
    const update = JSON.parse(e.postData.contents);
    
    if (update.message) {
      handleMessage(update.message);
    } else if (update.callback_query) {
      handleCallback(update.callback_query);
    }
    
    return ContentService.createTextOutput('ok');
  } catch (error) {
    Logger.log('Error: ' + error);
    return ContentService.createTextOutput('error');
  }
}

// Handle incoming messages
function handleMessage(message) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text || '';
  
  // Save user to sheet
  saveUser({
    telegram_id: userId,
    first_name: message.from.first_name,
    last_name: message.from.last_name || '',
    username: message.from.username || '',
    timestamp: new Date().toISOString()
  });
  
  // Handle /start command
  if (text.startsWith('/start')) {
    checkSubscriptionAndReply(chatId, userId);
  }
}

// Handle callback buttons
function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const data = callback.data;
  
  if (data === 'check_subscription') {
    checkSubscriptionAndReply(chatId, userId);
  }
  
  // Answer callback to remove "loading" state
  answerCallback(callback.id);
}

// Check subscription and send appropriate message
function checkSubscriptionAndReply(chatId, userId) {
  const isSubscribed = checkChannelSubscription(userId);
  
  if (isSubscribed) {
    // Generate access token
    const token = generateToken(userId);
    const calendarLink = CONFIG.CALENDAR_URL + '?auth=' + token;
    
    sendMessage(chatId, 
      '✅ *Отлично!*\n\n' +
      'Вы подписаны на канал Secret Room.\n' +
      'Откройте календарь iGaming конференций 2026:\n\n' +
      '👇 Нажмите кнопку ниже',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🗓 Открыть календарь', url: calendarLink }
          ]]
        }
      }
    );
  } else {
    sendMessage(chatId,
      '⚠️ *Нужна подписка*\n\n' +
      'Чтобы получить доступ к календарю, подпишитесь на наш канал:\n\n' +
      '👉 @secreetroommedia\n\n' +
      'После подписки нажмите кнопку "Проверить"',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Подписаться', url: 'https://t.me/secreetroommedia' }],
            [{ text: '✅ Проверить подписку', callback_data: 'check_subscription' }]
          ]
        }
      }
    );
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
      return ['creator', 'administrator', 'member'].includes(status);
    }
    
    return false;
  } catch (error) {
    Logger.log('Subscription check error: ' + error);
    return false;
  }
}

// Send message to user
function sendMessage(chatId, text, options = {}) {
  const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    ...options
  };
  
  const params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, params);
}

// Answer callback query
function answerCallback(callbackId, text = '') {
  const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/answerCallbackQuery`;
  
  const payload = {
    callback_query_id: callbackId,
    text: text
  };
  
  const params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  UrlFetchApp.fetch(url, params);
}

// Save user to Google Sheets
function saveUser(data) {
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
        'Last Visit'
      ]);
    }
    
    // Check if user exists
    const values = sheet.getDataRange().getValues();
    let existingRow = -1;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] == data.telegram_id) {
        existingRow = i + 1;
        break;
      }
    }
    
    const rowData = [
      data.timestamp,
      data.telegram_id,
      data.first_name,
      data.last_name,
      data.username,
      new Date().toISOString()
    ];
    
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
  } catch (error) {
    Logger.log('Save user error: ' + error);
  }
}

// Generate access token
function generateToken(telegramId) {
  const timestamp = new Date().getTime();
  const hash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    telegramId + ':' + timestamp + ':secretroom'
  );
  return Utilities.base64Encode(hash).substring(0, 32);
}

// =====================================================
// SETUP FUNCTIONS (run once manually)
// =====================================================

// Set webhook (run this function once after deploy)
function setWebhook() {
  const webAppUrl = 'YOUR_WEB_APP_URL'; // ⬅️ Вставить URL после deploy
  const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/setWebhook?url=${webAppUrl}`;
  
  const response = UrlFetchApp.fetch(url);
  const result = JSON.parse(response.getContentText());
  
  Logger.log('Webhook result: ' + JSON.stringify(result));
  return result;
}

// Get webhook info (for debugging)
function getWebhookInfo() {
  const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/getWebhookInfo`;
  const response = UrlFetchApp.fetch(url);
  const result = JSON.parse(response.getContentText());
  
  Logger.log('Webhook info: ' + JSON.stringify(result));
  return result;
}

// Test subscription check
function testSubscription() {
  const testUserId = 123456789; // ⬅️ Вставить свой Telegram ID для теста
  const isSubscribed = checkChannelSubscription(testUserId);
  Logger.log('Test user subscribed: ' + isSubscribed);
}
