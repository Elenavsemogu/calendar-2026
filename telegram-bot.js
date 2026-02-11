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
  CALENDAR_URL: 'https://elenavsemogu.github.io/calendar-2026/'
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
  
  // Handle contact sharing
  if (message.contact) {
    handleContactShared(message);
    return;
  }
  
  // Handle /start command
  if (text.startsWith('/start')) {
    sendWelcomeMessage(chatId, message.from);
    return;
  }
}

// Send welcome message with contact request
function sendWelcomeMessage(chatId, user) {
  const firstName = user.first_name || 'друг';
  
  sendMessage(chatId,
    `👋 *Привет, ${firstName}!*\n\n` +
    '🗓 Добро пожаловать в *Secret Room Calendar*!\n\n' +
    'Здесь ты найдешь все главные iGaming конференции 2026 года.\n\n' +
    '📱 Чтобы продолжить, поделись своим контактом — это займет 1 секунду!',
    {
      reply_markup: {
        keyboard: [[
          { text: '✅ Да, поделиться контактом', request_contact: true }
        ]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    }
  );
}

// Handle contact shared
function handleContactShared(message) {
  const chatId = message.chat.id;
  const userId = message.contact.user_id || message.from.id;
  const contact = message.contact;
  
  // Save user with contact info
  saveUser({
    telegram_id: userId,
    first_name: contact.first_name,
    last_name: contact.last_name || '',
    username: message.from.username || '',
    phone: contact.phone_number || '',
    timestamp: new Date().toISOString()
  });
  
  // Check subscription and reply
  checkSubscriptionAndReply(chatId, userId, contact.first_name);
}

// Handle callback buttons
function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const data = callback.data;
  const firstName = callback.from.first_name;
  
  if (data === 'check_subscription') {
    const isSubscribed = checkChannelSubscription(userId);
    
    if (isSubscribed) {
      // Generate token and send calendar link
      const token = generateToken(userId);
      const calendarLink = CONFIG.CALENDAR_URL + '?auth=' + token;
      
      sendMessage(chatId,
        `🎉 *Отлично, ${firstName}!*\n\n` +
        '✅ Подписка подтверждена!\n\n' +
        '🗓 Открывай календарь — он уже ждет тебя:',
        {
          reply_markup: {
            inline_keyboard: [[
              { text: '🗓 Открыть календарь', url: calendarLink }
            ]]
          }
        }
      );
      
      answerCallback(callback.id, '✅ Подписка подтверждена!');
    } else {
      answerCallback(callback.id, '⚠️ Подписка не найдена. Подпишись на канал и попробуй снова.');
    }
  }
}

// Check subscription and send appropriate message
function checkSubscriptionAndReply(chatId, userId, firstName) {
  const name = firstName || 'друг';
  const isSubscribed = checkChannelSubscription(userId);
  
  if (isSubscribed) {
    // Generate access token
    const token = generateToken(userId);
    const calendarLink = CONFIG.CALENDAR_URL + '?auth=' + token;
    
    sendMessage(chatId, 
      `🎉 *Отлично, ${name}!*\n\n` +
      '✅ Ты уже подписан на *Secret Room*\n\n' +
      '🗓 Открывай календарь всех главных iGaming конференций 2026:\n\n' +
      '• Даты и локации\n' +
      '• Визовые требования\n' +
      '• Промокоды на билеты\n' +
      '• Гид по ресторанам\n\n' +
      '👇 Жми на кнопку ниже',
      {
        reply_markup: {
          inline_keyboard: [[
            { text: '🗓 Открыть календарь', url: calendarLink }
          ]],
          remove_keyboard: true
        }
      }
    );
  } else {
    sendMessage(chatId,
      `👋 *Спасибо, ${name}!*\n\n` +
      '📢 Теперь подпишись на канал *Secret Room*, чтобы получить доступ к календарю!\n\n' +
      '💎 В канале ты найдешь:\n' +
      '• Анонсы всех ивентов\n' +
      '• Эксклюзивные промокоды\n' +
      '• Закрытые сайд-ивенты\n' +
      '• Инсайды из индустрии\n\n' +
      '👇 Подписывайся и получай доступ к календарю:',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📢 Подписаться на Secret Room', url: 'https://t.me/secreetroommedia' }],
            [{ text: '✅ Я подписался! Открыть календарь', callback_data: 'check_subscription' }]
          ],
          remove_keyboard: true
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
        'Phone',
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
      data.phone || '',
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
