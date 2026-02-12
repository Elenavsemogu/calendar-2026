const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
app.use(express.json());

// CORS для запросов из Mini App
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

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
// SEND-ICS: бот отправляет .ics файл в чат пользователю
// Пользователь нажимает на файл → iOS Calendar открывается
// Всё внутри Telegram, без Safari, без вкладок
// =====================================================
app.post('/send-ics', async (req, res) => {
  try {
    const { chat_id, title, location, description, start, end } = req.body;

    if (!chat_id) return res.status(400).json({ ok: false, error: 'chat_id required' });

    // Генерируем ICS
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Secretroom//Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '@secretroom',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:' + (start || ''),
      'DTEND:' + (end || ''),
      'SUMMARY:' + (title || 'Event'),
      'LOCATION:' + (location || ''),
      'DESCRIPTION:' + (description || ''),
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    // Чистим название для файла
    const safeTitle = (title || 'event').replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s-]/g, '').replace(/\s+/g, '_').substring(0, 50);

    // Отправляем как документ через Telegram Bot API
    const form = new FormData();
    form.append('chat_id', String(chat_id));
    form.append('document', Buffer.from(icsContent, 'utf-8'), {
      filename: safeTitle + '.ics',
      contentType: 'text/calendar'
    });
    form.append('caption', '📅 Нажмите на файл чтобы добавить в календарь');

    const tgRes = await fetch(`${TG}/sendDocument`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const tgData = await tgRes.json();
    console.log('sendDocument result:', tgData.ok ? 'OK' : tgData.description);

    res.json({ ok: tgData.ok });
  } catch (err) {
    console.error('send-ics error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// =====================================================
// ICS ENDPOINT (GET) - fallback для прямого скачивания
// =====================================================
app.get('/ics', (req, res) => {
  const { title, location, description, start, end } = req.query;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Secretroom//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '@secretroom',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
    'DTSTART:' + (start || ''),
    'DTEND:' + (end || ''),
    'SUMMARY:' + decodeURIComponent(title || 'Event'),
    'LOCATION:' + decodeURIComponent(location || ''),
    'DESCRIPTION:' + decodeURIComponent(description || ''),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // CORS — чтобы iframe из Mini App мог загружать
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="event.ics"');
  res.send(icsContent);
});

// =====================================================
// MESSAGE HANDLERS
// =====================================================
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = message.text || '';
  
  if (text.startsWith('/start')) {
    handleStart(message);
    return;
  }
}

async function handleStart(message) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const user = message.from;
  
  // Парсим UTM метки из /start параметра
  const parts = message.text.split(' ');
  const utmParam = parts[1] || '';
  
  // Сохраняем данные пользователя
  await saveToSheet({
    telegram_id: userId,
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    language_code: user.language_code || '',
    is_premium: user.is_premium ? 'Да' : 'Нет',
    utm_source: utmParam || 'Прямой переход'
  });
  
  // Проверяем подписку сразу
  const isSubscribed = await checkChannelSubscription(userId);
  
  if (isSubscribed) {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `👋 *Привет, ${user.first_name}!*\n\n✅ Ты подписан на *Secret Room*\n\n🗓 Открывай календарь всех главных iGaming конференций 2026:\n\n• Даты и локации\n• Визовые требования\n• Промокоды на билеты\n• Гид по ресторанам\n\n👇 Жми на кнопку:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🗓 Открыть календарь', web_app: { url: CONFIG.CALENDAR_URL } }
        ]]
      }
    });
  } else {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `👋 *Привет, ${user.first_name}!*\n\n📢 Подпишись на канал *Secret Room* чтобы получить доступ к календарю!\n\n💎 В канале:\n• Анонсы всех ивентов\n• Эксклюзивные промокоды\n• Закрытые сайд-ивенты\n• Инсайды из индустрии\n\n👇 Подписывайся:`,
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

async function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const firstName = callback.from.first_name || '';
  
  if (callback.data === 'check_subscription') {
    const isSubscribed = await checkChannelSubscription(userId);
    
    if (isSubscribed) {
      await tg('sendMessage', {
        chat_id: chatId,
        text: `🎉 *Отлично, ${firstName}!*\n\n✅ Подписка подтверждена!\n\n🗓 Открывай календарь:`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[
            { text: '🗓 Открыть календарь', web_app: { url: CONFIG.CALENDAR_URL } }
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
      language_code: data.language_code || '',
      is_premium: data.is_premium || '',
      utm_source: data.utm_source || '',
      timestamp: new Date().toISOString()
    });
    
    const url = CONFIG.GAS_URL + '?' + params.toString();
    console.log('Saving to GAS URL:', url.substring(0, 80) + '...');
    const res = await fetch(url, { redirect: 'follow' });
    const text = await res.text();
    console.log('GAS response status:', res.status, 'body:', text.substring(0, 200));
  } catch (err) {
    console.error('Sheet save error:', err.message);
  }
}

// Test endpoint - вызвать: https://sr-calendar-bot.onrender.com/test-save
app.get('/test-save', async (req, res) => {
  await saveToSheet({
    telegram_id: '88888',
    first_name: 'RenderTest',
    last_name: 'Direct',
    username: 'rendertest',
    phone: '+70009999999'
  });
  res.json({ done: true });
});

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
