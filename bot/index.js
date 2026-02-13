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
// SEND-MULTI-ICS: бот отправляет один .ics с несколькими событиями
// Один файл = все события добавляются в календарь одним нажатием
// =====================================================
app.post('/send-multi-ics', async (req, res) => {
  try {
    const { chat_id, events } = req.body;

    if (!chat_id || !events || !events.length) {
      return res.status(400).json({ ok: false, error: 'chat_id and events required' });
    }

    // Генерируем ICS с несколькими VEVENT
    const vevents = events.map(ev => [
      'BEGIN:VEVENT',
      'UID:' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '@secretroom',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:' + (ev.start || ''),
      'DTEND:' + (ev.end || ''),
      'SUMMARY:' + (ev.title || 'Event'),
      'LOCATION:' + (ev.location || ''),
      'DESCRIPTION:' + (ev.description || ''),
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    ].join('\r\n')).join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Secretroom//Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      vevents,
      'END:VCALENDAR'
    ].join('\r\n');

    const count = events.length;

    // Отправляем файл через бота
    const form = new FormData();
    form.append('chat_id', String(chat_id));
    form.append('document', Buffer.from(icsContent, 'utf-8'), {
      filename: `SecretRoom_${count}_events.ics`,
      contentType: 'text/calendar'
    });
    form.append('caption', `📅 ${count} ${count === 1 ? 'событие' : count < 5 ? 'события' : 'событий'}. Нажмите на файл чтобы добавить все в календарь.`);

    const tgRes = await fetch(`${TG}/sendDocument`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const tgData = await tgRes.json();
    console.log('sendMultiICS result:', tgData.ok ? `OK (${count} events)` : tgData.description);

    res.json({ ok: tgData.ok });
  } catch (err) {
    console.error('send-multi-ics error:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// =====================================================
// ICS-MULTI: один ICS файл с несколькими событиями (GET)
// Safari откроет и покажет нативный диалог Calendar
// =====================================================
app.get('/ics-multi', (req, res) => {
  try {
    const eventsStr = decodeURIComponent(req.query.events || '');
    const eventParts = eventsStr.split(';;').filter(Boolean);

    const vevents = eventParts.map(part => {
      const [title, location, start, end] = part.split('|').map(s => decodeURIComponent(s || ''));
      const lines = [
        'BEGIN:VEVENT',
        'UID:' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '@secretroom',
        'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      ];
      // All-day если дата 8 символов (YYYYMMDD)
      if (start && start.length === 8) {
        lines.push('DTSTART;VALUE=DATE:' + start);
        lines.push('DTEND;VALUE=DATE:' + (end || start));
      } else {
        lines.push('DTSTART:' + (start || ''));
        lines.push('DTEND:' + (end || ''));
      }
      lines.push(
        'SUMMARY:' + (title || 'Event'),
        'LOCATION:' + (location || ''),
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
      return lines.join('\r\n');
    }).join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Secretroom//Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      vevents,
      'END:VCALENDAR'
    ].join('\r\n');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="secretroom-calendar.ics"');
    res.send(icsContent);
  } catch (err) {
    console.error('ics-multi error:', err.message);
    res.status(500).send('Error generating ICS');
  }
});

// =====================================================
// ICS ENDPOINT (GET) - одно событие
// =====================================================
app.get('/ics', (req, res) => {
  const { title, location, description, start, end, allday } = req.query;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Secretroom//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '@secretroom',
    'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
  ];
  
  // All-day события (VALUE=DATE) vs timed
  if (allday === '1' && start && start.length === 8) {
    lines.push('DTSTART;VALUE=DATE:' + start);
    lines.push('DTEND;VALUE=DATE:' + (end || start));
  } else {
    lines.push('DTSTART:' + (start || ''));
    lines.push('DTEND:' + (end || ''));
  }
  
  lines.push(
    'SUMMARY:' + decodeURIComponent(title || 'Event'),
    'LOCATION:' + decodeURIComponent(location || ''),
    'DESCRIPTION:' + decodeURIComponent(description || ''),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'END:VEVENT',
    'END:VCALENDAR'
  );

  const icsContent = lines.join('\r\n');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="event.ics"');
  res.send(icsContent);
});

// =====================================================
// АНКЕТА: состояния пользователей в памяти
// =====================================================
// Шаги: waiting_name → waiting_position → waiting_open_to_jobs →
//        (если Да) waiting_experience → waiting_age → done
const userStates = new Map();

function getUserState(chatId) {
  return userStates.get(chatId) || null;
}

function setUserState(chatId, state) {
  userStates.set(chatId, state);
}

function clearUserState(chatId) {
  userStates.delete(chatId);
}

// =====================================================
// MESSAGE HANDLERS
// =====================================================
async function handleMessage(message) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  
  if (text.startsWith('/start')) {
    clearUserState(chatId);
    handleStart(message);
    return;
  }
  
  // Проверяем, есть ли активная анкета
  const state = getUserState(chatId);
  if (state) {
    await handleQuestionnaireText(chatId, message.from, text, state);
    return;
  }
}

// =====================================================
// /START
// =====================================================
async function handleStart(message) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const user = message.from;
  
  // Парсим UTM метки из /start параметра
  const parts = message.text.split(' ');
  const utmParam = parts[1] || '';
  
  // Сохраняем базовые данные пользователя
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
    // Подписан → начинаем анкету
    await tg('sendMessage', {
      chat_id: chatId,
      text: `👋 *Привет, ${user.first_name}!*\n\n✅ Ты подписан на *Secret Room*\n\nПрежде чем открыть календарь, расскажи немного о себе. Это займёт буквально минуту.\n\n*Как тебя зовут?*`,
      parse_mode: 'Markdown'
    });
    setUserState(chatId, { step: 'waiting_name', data: { telegram_id: userId, tg_username: user.username || '' } });
  } else {
    await tg('sendMessage', {
      chat_id: chatId,
      text: `👋 *Привет, ${user.first_name}!*\n\n📢 Подпишись на канал *Secret Room* чтобы получить доступ к календарю!\n\n💎 В канале:\n• Анонсы всех ивентов\n• Эксклюзивные промокоды\n• Закрытые сайд-ивенты\n• Инсайды из индустрии\n\n👇 Подписывайся:`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📢 Подписаться на Secret Room', url: 'https://t.me/secreetroommedia' }],
          [{ text: '✅ Я подписался!', callback_data: 'check_subscription' }]
        ]
      }
    });
  }
}

// =====================================================
// АНКЕТА: обработка текстовых ответов
// =====================================================
async function handleQuestionnaireText(chatId, user, text, state) {
  const { step, data } = state;
  
  switch (step) {
    case 'waiting_name':
      data.name = text;
      await tg('sendMessage', {
        chat_id: chatId,
        text: `Приятно познакомиться, *${text}*! 🤝\n\n*Твоя должность и компания?*\n\nНапример: _CMO, BetCompany_`,
        parse_mode: 'Markdown'
      });
      setUserState(chatId, { step: 'waiting_position', data });
      break;
      
    case 'waiting_position':
      data.position = text;
      await tg('sendMessage', {
        chat_id: chatId,
        text: `*Открыт(а) ли ты к входящим предложениям о работе?*`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Да, открыт(а)', callback_data: 'jobs_yes' },
              { text: '🚫 Нет', callback_data: 'jobs_no' }
            ]
          ]
        }
      });
      setUserState(chatId, { step: 'waiting_open_to_jobs', data });
      break;
      
    case 'waiting_experience':
      data.experience = text;
      await tg('sendMessage', {
        chat_id: chatId,
        text: `*Сколько тебе лет?*`,
        parse_mode: 'Markdown'
      });
      setUserState(chatId, { step: 'waiting_age', data });
      break;
      
    case 'waiting_age':
      data.age = text;
      // Анкета завершена — сохраняем и показываем календарь
      await finishQuestionnaire(chatId, data);
      break;
      
    default:
      break;
  }
}

// =====================================================
// АНКЕТА: завершение и сохранение
// =====================================================
async function finishQuestionnaire(chatId, data) {
  clearUserState(chatId);
  
  // Сохраняем анкету в таблицу
  await saveProfileToSheet(data);
  
  await tg('sendMessage', {
    chat_id: chatId,
    text: `🎉 *Спасибо, всё записали!*\n\n📅 Теперь открывай календарь всех главных iGaming конференций 2026:\n\n• Даты и локации\n• Визовые требования\n• Промокоды на билеты\n• Гид по ресторанам\n\n👇 Жми на кнопку:`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[
        { text: '📅 Открыть календарь конференций', web_app: { url: CONFIG.CALENDAR_URL } }
      ]]
    }
  });
}

// =====================================================
// CALLBACK HANDLERS
// =====================================================
async function handleCallback(callback) {
  const chatId = callback.message.chat.id;
  const userId = callback.from.id;
  const user = callback.from;
  const firstName = user.first_name || '';
  
  // Проверка подписки
  if (callback.data === 'check_subscription') {
    const isSubscribed = await checkChannelSubscription(userId);
    
    if (isSubscribed) {
      await tg('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: '✅ Подписка подтверждена!'
      });
      
      // Начинаем анкету
      await tg('sendMessage', {
        chat_id: chatId,
        text: `🎉 *Отлично, ${firstName}!*\n\n✅ Подписка подтверждена!\n\nПрежде чем открыть календарь, расскажи немного о себе. Это займёт буквально минуту.\n\n*Как тебя зовут?*`,
        parse_mode: 'Markdown'
      });
      setUserState(chatId, { step: 'waiting_name', data: { telegram_id: userId, tg_username: user.username || '' } });
    } else {
      await tg('answerCallbackQuery', {
        callback_query_id: callback.id,
        text: '⚠️ Подписка не найдена. Подпишись на канал и попробуй снова.'
      });
    }
    return;
  }
  
  // Ответ на вопрос "Открыт к предложениям о работе?"
  if (callback.data === 'jobs_yes' || callback.data === 'jobs_no') {
    const state = getUserState(chatId);
    if (!state || state.step !== 'waiting_open_to_jobs') {
      await tg('answerCallbackQuery', { callback_query_id: callback.id });
      return;
    }
    
    await tg('answerCallbackQuery', { callback_query_id: callback.id });
    
    const { data } = state;
    data.open_to_jobs = callback.data === 'jobs_yes' ? 'Да' : 'Нет';
    
    if (callback.data === 'jobs_yes') {
      // Задаём доп. вопросы
      await tg('sendMessage', {
        chat_id: chatId,
        text: `*Какой у тебя опыт на рынке?*\n\nНапример: _5 лет в iGaming, affiliate marketing_`,
        parse_mode: 'Markdown'
      });
      setUserState(chatId, { step: 'waiting_experience', data });
    } else {
      // Анкета завершена без доп. вопросов
      data.experience = '';
      data.age = '';
      await finishQuestionnaire(chatId, data);
    }
    return;
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

// =====================================================
// SAVE PROFILE (анкета) TO GOOGLE SHEETS
// =====================================================
async function saveProfileToSheet(data) {
  try {
    const params = new URLSearchParams({
      type: 'profile',
      telegram_id: data.telegram_id || '',
      tg_username: data.tg_username || '',
      name: data.name || '',
      position: data.position || '',
      open_to_jobs: data.open_to_jobs || '',
      experience: data.experience || '',
      age: data.age || '',
      timestamp: new Date().toISOString()
    });
    
    const url = CONFIG.GAS_URL + '?' + params.toString();
    console.log('Saving profile to GAS:', url.substring(0, 80) + '...');
    const res = await fetch(url, { redirect: 'follow' });
    const text = await res.text();
    console.log('GAS profile response:', res.status, text.substring(0, 200));
  } catch (err) {
    console.error('Profile save error:', err.message);
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
  
  // Настраиваем Menu Button (кнопка внизу чата)
  const menuResult = await tg('setChatMenuButton', {
    menu_button: {
      type: 'web_app',
      text: '📅 Календарь конференций',
      web_app: { url: CONFIG.CALENDAR_URL }
    }
  });
  console.log('Menu button set:', menuResult.ok ? 'OK' : menuResult.description);
}

// =====================================================
// START SERVER
// =====================================================
app.listen(CONFIG.PORT, async () => {
  console.log(`🚀 Bot server running on port ${CONFIG.PORT}`);
  await setupWebhook();
});
