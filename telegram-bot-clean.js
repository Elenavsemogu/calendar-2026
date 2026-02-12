// =====================================================
// SECRET ROOM CALENDAR — TELEGRAM BOT
// Google Apps Script — только webhook, без polling
// =====================================================

var CONFIG = {
  BOT_TOKEN: '8191206268:AAEYjnXVO9q7kBGBzvir5ntXPedoMQO7IrM',
  CHANNEL_ID: '@secreetroommedia',
  SPREADSHEET_ID: '1kwiWTnsfaxy-iNA9rXTHeMKalRS4Q42mgsezzTQLZJY',
  SHEET_NAME: 'Bot Users',
  CALENDAR_URL: 'https://elenavsemogu.github.io/calendar-2026/'
};

// =====================================================
// WEBHOOK HANDLER
// =====================================================
function doPost(e) {
  var update = JSON.parse(e.postData.contents);
  
  // Защита от дублей
  var updateId = update.update_id;
  var cache = CacheService.getScriptCache();
  if (cache.get('upd_' + updateId)) {
    return ContentService.createTextOutput('ok');
  }
  cache.put('upd_' + updateId, '1', 120);
  
  try {
    if (update.message) {
      handleMessage(update.message);
    } else if (update.callback_query) {
      handleCallback(update.callback_query);
    }
  } catch (err) {
    Logger.log('Error: ' + err);
  }
  
  return ContentService.createTextOutput('ok');
}

// =====================================================
// MESSAGE HANDLERS
// =====================================================

function handleMessage(message) {
  var chatId = message.chat.id;
  var text = message.text || '';
  
  if (message.contact) {
    handleContactShared(message);
    return;
  }
  
  if (text.indexOf('/start') === 0) {
    sendWelcomeMessage(chatId, message.from);
    return;
  }
}

function sendWelcomeMessage(chatId, user) {
  var firstName = user.first_name || 'друг';
  
  var text = '👋 *Привет, ' + firstName + '!*\n\n' +
    '🗓 Добро пожаловать в *Secret Room Calendar*!\n\n' +
    'Здесь ты найдешь все главные iGaming конференции 2026 года.\n\n' +
    '📱 Чтобы продолжить, поделись своим контактом:';
  
  var payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [[
        { text: '✅ Да, поделиться контактом', request_contact: true }
      ]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  };
  
  callTelegram('sendMessage', payload);
}

function handleContactShared(message) {
  var chatId = message.chat.id;
  var userId = message.contact.user_id || message.from.id;
  var contact = message.contact;
  
  saveUser({
    telegram_id: userId,
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    username: message.from.username || '',
    phone: contact.phone_number || '',
    timestamp: new Date().toISOString()
  });
  
  checkSubscriptionAndReply(chatId, userId, contact.first_name);
}

function handleCallback(callback) {
  var chatId = callback.message.chat.id;
  var userId = callback.from.id;
  var firstName = callback.from.first_name || '';
  
  if (callback.data === 'check_subscription') {
    var isSubscribed = checkChannelSubscription(userId);
    
    if (isSubscribed) {
      var token = generateToken(userId);
      var calendarLink = CONFIG.CALENDAR_URL + '?auth=' + token;
      
      callTelegram('sendMessage', {
        chat_id: chatId,
        text: '🎉 *Отлично, ' + firstName + '!*\n\n✅ Подписка подтверждена!\n\n🗓 Открывай календарь:',
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🗓 Открыть календарь', url: calendarLink }
          ]]
        }
      });
      
      callTelegram('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: '✅ Подписка подтверждена!'
      });
    } else {
      callTelegram('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: '⚠️ Подписка не найдена. Подпишись и попробуй снова.'
      });
    }
  }
}

// =====================================================
// SUBSCRIPTION CHECK
// =====================================================

function checkSubscriptionAndReply(chatId, userId, firstName) {
  var name = firstName || 'друг';
  var isSubscribed = checkChannelSubscription(userId);
  
  if (isSubscribed) {
    var token = generateToken(userId);
    var calendarLink = CONFIG.CALENDAR_URL + '?auth=' + token;
    
    callTelegram('sendMessage', {
      chat_id: chatId,
      text: '🎉 *Отлично, ' + name + '!*\n\n✅ Ты подписан на *Secret Room*\n\n🗓 Жми кнопку — календарь ждет тебя:',
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🗓 Открыть календарь', url: calendarLink }
        ]]
      }
    });
  } else {
    callTelegram('sendMessage', {
      chat_id: chatId,
      text: '👋 *Спасибо, ' + name + '!*\n\n📢 Подпишись на канал *Secret Room* чтобы получить доступ к календарю:\n\n💎 Эксклюзивные промокоды, анонсы ивентов и инсайды индустрии',
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 Подписаться на Secret Room', url: 'https://t.me/secreetroommedia' }],
          [{ text: '✅ Я подписался! Открыть календарь', callback_data: 'check_subscription' }]
        ]
      }
    });
  }
}

function checkChannelSubscription(telegramId) {
  try {
    var result = callTelegram('getChatMember', {
      chat_id: CONFIG.CHANNEL_ID,
      user_id: telegramId
    });
    
    if (result && result.ok) {
      var status = result.result.status;
      return status === 'creator' || status === 'administrator' || status === 'member';
    }
    return false;
  } catch (error) {
    Logger.log('Sub check error: ' + error);
    return false;
  }
}

// =====================================================
// TELEGRAM API (one function for all calls)
// =====================================================

function callTelegram(method, payload) {
  var url = 'https://api.telegram.org/bot' + CONFIG.BOT_TOKEN + '/' + method;
  
  var params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  var response = UrlFetchApp.fetch(url, params);
  var result = JSON.parse(response.getContentText());
  
  if (!result.ok) {
    Logger.log(method + ' error: ' + response.getContentText());
  }
  
  return result;
}

// =====================================================
// GOOGLE SHEETS
// =====================================================

function saveUser(data) {
  try {
    var ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Telegram ID', 'First Name', 'Last Name', 'Username', 'Phone', 'Last Visit']);
    }
    
    var values = sheet.getDataRange().getValues();
    var existingRow = -1;
    
    for (var i = 1; i < values.length; i++) {
      if (values[i][1] == data.telegram_id) {
        existingRow = i + 1;
        break;
      }
    }
    
    var rowData = [data.timestamp, data.telegram_id, data.first_name, data.last_name, data.username, data.phone || '', new Date().toISOString()];
    
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
  } catch (error) {
    Logger.log('Save error: ' + error);
  }
}

function generateToken(telegramId) {
  var timestamp = new Date().getTime();
  var hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, telegramId + ':' + timestamp + ':secretroom');
  return Utilities.base64Encode(hash).substring(0, 32);
}

// =====================================================
// SETUP (run once)
// =====================================================

// Удалить все старые триггеры
function cleanup() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  Logger.log('Deleted ' + triggers.length + ' triggers');
}
