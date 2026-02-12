const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

// =====================================================
// CONFIG
// =====================================================
const CONFIG = {
  BOT_TOKEN: process.env.BOT_TOKEN || '8191206268:AAEYjnXVO9q7kBGBzvir5ntXPedoMQO7IrM',
  CHANNEL_ID: '@secreetroommedia',
  SPREADSHEET_ID: '1kwiWTnsfaxy-iNA9rXTHeMKalRS4Q42mgsezzTQLZJY',
  CALENDAR_URL: 'https://elenavsemogu.github.io/calendar-2026/',
  GAS_URL: 'https://script.google.com/macros/s/AKfycbwGehuSOvyX3tWyq9oKGqMS4TkMb3h24zZuShJVjpPptee9E2w-qDbbGJ2J0tkmhZmi/exec',
  PORT: process.env.PORT || 3000,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || 'secretroom2026'
};

const TG = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}`;

// =====================================================
// TELEGRAM API HELPER
// =====================================================
async function tg(method, body) {
  try {
    const res = await fetch(`${TG}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.ok) console.error(`TG ${method} error:`, data.description);
    return data;
  } catch (err) {
    console.error(`TG ${method} fetch error:`, err.message);
    return { ok: false };
  }
}

// =====================================================
// WEBHOOK ENDPOINT
// =====================================================
app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // Мгновенный ответ Telegram!
  
  const update = req.body;
  
  try {
    if (update.message) {
      await handleMessage(update.message);
    } else if (update.callback_query) {
      await handleCallback(update.callback_query);
    }
  } catch (err) {
    console.error('Webhook error:', err.message);
  }
});

// Health check для Render
app.get('/', (req, res) => {
  res.json({ status: 'ok', bot: 'Secret Room Calendar Bot' });
});

// =====================================================
// MESSAGE HANDLERS
// =====================================================
async function handleMessage(message) {
  const chatId = message.chat.id;
  
  if (message.contact) {
    await handleContactShared(message);
    return;
  }
  
  if (message.text && message.text.startsWith('/start')) {
    await sendWelcomeMessage(chatId, message.from);
    return;
  }
}

async function sendWelcomeMessage(chatId, user) {
  const firstName = user.first_name || 'друг';
  
  await tg('sendMessage', {
    chat_id: chatId,
    text: `👋 *Привет, ${firstName}!*\n\n🗓 Добро пожаловать в *Secret Room Calendar*!\n\nЗдесь ты найдешь все главные iGaming конференции 2026 года.\n\n📱 Чтобы продолжить, поделись своим контактом:`,
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [[
        { text: '✅ Да, поделиться контактом', request_contact: true }
      ]],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
}

async function handleContactShared(message) {
  const chatId = message.chat.id;
  const userId = message.contact.user_id || message.from.id;
  const contact = message.contact;
  
  // Сохраняем пользователя в Google Sheets
  await saveToSheet({
    telegram_id: userId,
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    username: message.from.username || '',
    phone: contact.phone_number || ''
  });
  
  await checkSubscriptionAndReply(chatId, userId, contact.first_name);
}

async function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const firstName = callback.from.first_name || '';
  
  if (callback.data === 'check_subscription') {
    const isSubscribed = await checkChannelSubscription(userId);
    
    if (isSubscribed) {
      const token = generateToken(userId);
      const calendarLink = `${CONFIG.CALENDAR_URL}?auth=${token}`;
      
      await tg('sendMessage', {
        chat_id: chatId,
        text: `🎉 *Отлично, ${firstName}!*\n\n✅ Подписка подтверждена!\n\n🗓 Открывай календарь:`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🗓 Открыть календарь', url: calendarLink }
          ]]
        }
      });
      
      await tg('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: '✅ Подписка подтверждена!'
      });
    } else {
      await tg('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: '⚠️ Подписка не найдена. Подпишись на канал и попробуй снова.'
      });
    }
  }
}

// =====================================================
// SUBSCRIPTION CHECK
// =====================================================
async function checkSubscriptionAndReply(chatId, userId, firstName) {
  const name = firstName || 'друг';
  const isSubscribed = await checkChannelSubscription(userId);
  
  if (isSubscribed) {
    const token = generateToken(userId);
    const calendarLink = `${CONFIG.CALENDAR_URL}?auth=${token}`;
    
    await tg('sendMessage', {
      chat_id: chatId,
      text: `🎉 *Отлично, ${name}!*\n\n✅ Ты подписан на *Secret Room*\n\n🗓 Жми кнопку — календарь ждет тебя:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🗓 Открыть календарь', url: calendarLink }
        ]]
      }
    });
  } else {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `👋 *Спасибо, ${name}!*\n\n📢 Подпишись на канал *Secret Room* чтобы получить доступ к календарю!\n\n💎 Эксклюзивные промокоды, анонсы ивентов и инсайды индустрии`,
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

async function checkChannelSubscription(telegramId) {
  try {
    const result = await tg('getChatMember', {
      chat_id: CONFIG.CHANNEL_ID,
      user_id: telegramId
    });
    
    if (result.ok) {
      const status = result.result.status;
      return ['creator', 'administrator', 'member'].includes(status);
    }
    return false;
  } catch (err) {
    console.error('Subscription check error:', err.message);
    return false;
  }
}

// =====================================================
// SAVE TO GOOGLE SHEETS (via Google Apps Script GET)
// =====================================================
async function saveToSheet(data) {
  try {
    const params = new URLSearchParams({
      telegram_id: data.telegram_id || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      username: data.username || '',
      phone: data.phone || '',
      timestamp: new Date().toISOString()
    });
    
    const url = CONFIG.GAS_URL + '?' + params.toString();
    const res = await fetch(url, { redirect: 'follow' });
    console.log('Saved to sheet:', data.telegram_id, data.first_name, data.username);
  } catch (err) {
    console.error('Sheet save error:', err.message);
  }
}

// =====================================================
// TOKEN GENERATION
// =====================================================
const crypto = require('crypto');

function generateToken(telegramId) {
  const timestamp = Date.now();
  const hash = crypto.createHash('sha256')
    .update(`${telegramId}:${timestamp}:secretroom`)
    .digest('base64')
    .substring(0, 32);
  return hash;
}

// =====================================================
// SETUP WEBHOOK (called on startup)
// =====================================================
async function setupWebhook() {
  const webhookUrl = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL}/webhook`
    : `http://localhost:${CONFIG.PORT}/webhook`;
  
  // Удаляем старый webhook
  await tg('deleteWebhook', { drop_pending_updates: true });
  
  // Устанавливаем новый
  const result = await tg('setWebhook', {
    url: webhookUrl,
    drop_pending_updates: true
  });
  
  console.log(`Webhook set to: ${webhookUrl}`);
  console.log('Result:', result);
}

// =====================================================
// START SERVER
// =====================================================
app.listen(CONFIG.PORT, async () => {
  console.log(`🚀 Bot server running on port ${CONFIG.PORT}`);
  await setupWebhook();
});
