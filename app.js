// app.js

// ------------------------------
// Utils
// ------------------------------
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function formatK(n) {
  if (!Number.isFinite(n)) return "";
  if (n >= 1000) return (Math.round(n / 100) / 10).toString() + "k";
  return String(n);
}

// ------------------------------
// State
// ------------------------------
let currentCitizenship = "RU";

// Для кнопки "Добавить в календарь": будем помнить, какое событие открыто в модалке
let currentEventId = null;

// ------------------------------
// Visa Matrix (расширенная версия из Excel)
// ------------------------------
// Структура: citizenship -> destination -> {required, type, notes}
const VISA_MATRIX = {
  'RU': {
    'GB': { required: 'да', type: 'Виза', notes: 'Требуется Standard Visitor visa' },
    'BR': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'US': { required: 'да', type: 'Виза B1/B2', notes: 'Подача в Астане или Варшаве' },
    'PT': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза €90' },
    'AE': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'AM': { required: 'нет', type: 'Безвиз', notes: '180 дней, ЕАЭС' },
    'PL': { required: 'запрет', type: 'Въезд запрещён', notes: 'С 2022 для туризма/бизнеса' },
    'UA': { required: 'да', type: 'Виза', notes: 'Визовый режим с 2022' },
    'CY': { required: 'да', type: 'Про-виза', notes: 'Про-виза онлайн или шенген' },
    'RU': { required: 'нет', type: 'Своя страна', notes: '' },
    'GE': { required: 'нет', type: 'Безвиз', notes: '1 год без визы' },
    'ES': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'MX': { required: 'эл.разреш.', type: 'SAE', notes: 'Электронное разрешение, только авиа' },
  },
  'UA': {
    'GB': { required: 'нет', type: 'Безвиз', notes: '6 месяцев без визы' },
    'BR': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'US': { required: 'да', type: 'Виза B1/B2', notes: 'Подача в Варшаве/Кракове' },
    'PT': { required: 'нет', type: 'Безвиз', notes: 'Шенген безвиз' },
    'AE': { required: 'нет', type: 'Безвиз', notes: '30 дней без визы' },
    'AM': { required: 'нет', type: 'Безвиз', notes: '180 дней без визы' },
    'PL': { required: 'нет', type: 'Безвиз', notes: 'Шенген безвиз' },
    'UA': { required: 'нет', type: 'Своя страна', notes: '' },
    'CY': { required: 'нет', type: 'Безвиз', notes: 'Шенген безвиз' },
    'RU': { required: 'да', type: 'Виза', notes: 'Визовый режим' },
    'GE': { required: 'нет', type: 'Безвиз', notes: '1 год без визы' },
    'ES': { required: 'нет', type: 'Безвиз', notes: 'Шенген безвиз' },
    'MX': { required: 'эл.разреш.', type: 'SAE', notes: 'Электронное разрешение' },
  },
  'BY': {
    'GB': { required: 'да', type: 'Виза', notes: 'UK Visitor visa' },
    'BR': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'US': { required: 'да', type: 'Виза B1/B2', notes: 'Подача в Варшаве' },
    'PT': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'AE': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'AM': { required: 'нет', type: 'Безвиз', notes: '30 дней без визы' },
    'PL': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'UA': { required: 'да', type: 'Виза', notes: 'Визовый режим' },
    'CY': { required: 'да', type: 'Про-виза', notes: 'Про-виза онлайн' },
    'RU': { required: 'нет', type: 'Безвиз', notes: 'Союзное государство' },
    'GE': { required: 'нет', type: 'Безвиз', notes: '1 год без визы' },
    'ES': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'MX': { required: 'эл.разреш.', type: 'SAE', notes: 'Электронное разрешение' },
  },
  'KZ': {
    'GB': { required: 'да', type: 'Виза', notes: 'UK Visitor visa' },
    'BR': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'US': { required: 'да', type: 'Виза B1/B2', notes: 'Подача в Астане' },
    'PT': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'AE': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'AM': { required: 'нет', type: 'Безвиз', notes: '180 дней, ЕАЭС' },
    'PL': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'UA': { required: 'нет', type: 'Безвиз', notes: '90 дней без визы' },
    'CY': { required: 'да', type: 'Про-виза', notes: 'Про-виза онлайн' },
    'RU': { required: 'нет', type: 'Безвиз', notes: 'ЕАЭС' },
    'GE': { required: 'нет', type: 'Безвиз', notes: '1 год без визы' },
    'ES': { required: 'да', type: 'Шенген', notes: 'Шенгенская виза' },
    'MX': { required: 'эл.разреш.', type: 'SAE', notes: 'Электронное разрешение' },
  },
};

// Маппинг conf_id -> country_code (для визовой логики)
const CONF_COUNTRIES = {
  'igb_live_2026_london': 'GB',
  'sbc_rio_2026': 'BR',
  'sbc_americas_2026': 'US',
  'sbc_lisbon_2026': 'PT',
  'affiliate_world_dubai_2026': 'AE',
  'mac_yerevan_2026': 'AM',
  'conversion_warsaw_2026': 'PL',
  'conversion_kyiv_2026': 'UA',
  'conversion_cyprus_2026': 'CY',
  'broconf_sochi_2026': 'RU',
  'ggate_tbilisi_2026': 'GE',
  'affpapa_madrid_2026': 'ES',
  'affpapa_cancun_2026': 'MX',
  'g2e_las_vegas_2026': 'US',
};

// Старая функция для обратной совместимости (deprecated)
const VISA_RULES = {};
Object.keys(VISA_MATRIX).forEach(citizenship => {
  VISA_RULES[citizenship] = {};
  Object.keys(VISA_MATRIX[citizenship]).forEach(country => {
    const info = VISA_MATRIX[citizenship][country];
    VISA_RULES[citizenship][country] = info.required === 'нет' ? 'no' :
                                        info.required === 'да' ? 'yes' :
                                        'unknown';
  });
});

// Старая функция (для обратной совместимости)
function getVisaStatus(citizenship, country) {
  const c = (citizenship || "").toUpperCase();
  const cc = (country || "").toUpperCase();
  return VISA_RULES?.[c]?.[cc] || "unknown";
}

// Новая функция для расширенной визовой информации
function getVisaInfo(citizenship, country) {
  const c = (citizenship || "").toUpperCase();
  const cc = (country || "").toUpperCase();
  return VISA_MATRIX?.[c]?.[cc] || null;
}

// Генерация HTML для визового тега
function getVisaTagHTML(visaInfo) {
  if (!visaInfo) {
    return '<span class="px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400" title="Информация уточняется">? Уточнить</span>';
  }

  const colorClasses = {
    'нет': 'bg-green-500/20 text-green-400 border-green-500/30',
    'да': 'bg-red-500/20 text-red-400 border-red-500/30',
    'запрет': 'bg-red-700/30 text-red-300 border-red-700/40',
    'эл.разреш.': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  const labels = {
    'нет': '✓ Без визы',
    'да': '⚠ Виза',
    'запрет': '✕ Въезд запрещён',
    'эл.разреш.': '⚡ Эл. разрешение',
  };

  const colorClass = colorClasses[visaInfo.required] || 'bg-gray-500/20 text-gray-400';
  const label = labels[visaInfo.required] || visaInfo.type;
  const title = visaInfo.notes || visaInfo.type;

  return `<span class="px-2 py-1 rounded-full text-xs border ${colorClass}" title="${title}">${label}</span>`;
}

function applyVisaTag(el, status, countryCode) {
  // el — это span с data-visa-tag="XX"
  el.classList.remove("tag-visa", "tag-no-visa");
  const flag = countryCode ? ` ${countryCode}` : "";

  if (status === "no") {
    el.classList.add("tag-no-visa");
    // оставим твой текстовый паттерн "No Visa ..."
    // если там уже есть эмодзи флага — не трогаем, иначе можно простым текстом
    if (!el.textContent.toLowerCase().includes("no visa")) el.textContent = `No Visa${flag}`;
  } else if (status === "yes") {
    el.classList.add("tag-visa");
    if (!el.textContent.toLowerCase().includes("visa")) el.textContent = `Visa${flag}`;
  } else {
    el.classList.add("tag-visa");
    el.textContent = "Check visa";
  }
}

function updateAllVisaTags() {
  qsa("[data-visa-tag]").forEach((tag) => {
    const cc = tag.getAttribute("data-visa-tag");

    // Попробовать использовать новую визовую матрицу
    const visaInfo = getVisaInfo(currentCitizenship, cc);
    if (visaInfo) {
      // Сохранить data-visa-tag атрибут
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = getVisaTagHTML(visaInfo);
      const newTag = tempDiv.firstChild;

      // Добавить data-visa-tag обратно
      newTag.setAttribute('data-visa-tag', cc);

      // Заменить элемент
      tag.parentNode.replaceChild(newTag, tag);
    } else {
      // Fallback на старую логику
      const status = getVisaStatus(currentCitizenship, cc);
      applyVisaTag(tag, status, cc);
    }
  });
}

// ------------------------------
// Filters
// ------------------------------
const TIER_FILTERS = [
  { key: "any", label: "Все" },
  { key: "mega", label: "20k+" },
  { key: "large", label: "8k+" },
  { key: "mid", label: "<8k" }
];

const VISA_FILTERS = [
  { key: "any", label: "Не важно" },
  { key: "no", label: "Только без визы" },
  { key: "yes", label: "Только с визой" },
  { key: "unknown", label: "Уточнить" }
];

let tierFilterIndex = 0; // any
let visaFilterIndex = 0; // any

function updateFilterLabels() {
  const sizeBtn = qs("#filterSizeBtn");
  const visaBtn = qs("#filterVisaBtn");
  if (sizeBtn) sizeBtn.textContent = `Размер: ${TIER_FILTERS[tierFilterIndex].label}`;
  if (visaBtn) visaBtn.textContent = `Виза: ${VISA_FILTERS[visaFilterIndex].label}`;
}

function applyFilters() {
  const tierKey = TIER_FILTERS[tierFilterIndex].key;
  const visaKey = VISA_FILTERS[visaFilterIndex].key;

  qsa('[data-filterable="1"]').forEach((el) => {
    const elTier = (el.getAttribute("data-tier") || "").toLowerCase();
    const elCountry = (el.getAttribute("data-country") || "").toUpperCase();

    let tierOk = true;
    if (tierKey !== "any") tierOk = (elTier === tierKey);

    let visaOk = true;
    if (visaKey !== "any") {
      if (!elCountry) {
        // если страна не задана — не ломаем, оставляем видимым
        visaOk = true;
      } else {
        const status = getVisaStatus(currentCitizenship, elCountry);
        visaOk = (status === visaKey);
      }
    }

    if (tierOk && visaOk) el.classList.remove("hidden");
    else el.classList.add("hidden");
  });

  // Update button UI after filter change
  if (typeof updateButtonUI === 'function') {
    updateButtonUI();
  }
}

// ------------------------------
// Modal open/close + tabs
// ------------------------------
function openModal() {
  const overlay = qs("#modalOverlay");
  const bg = qs("#modalBg");
  const panel = qs("#modalPanel");
  if (!overlay || !bg || !panel) return;

  overlay.classList.remove("hidden");
  setTimeout(() => {
    bg.classList.remove("opacity-0");
    panel.classList.remove("translate-x-full");
  }, 10);

  document.body.classList.add("modal-open");
}

function closeModal() {
  const overlay = qs("#modalOverlay");
  const bg = qs("#modalBg");
  const panel = qs("#modalPanel");
  if (!overlay || !bg || !panel) return;

  bg.classList.add("opacity-0");
  panel.classList.add("translate-x-full");

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 300);

  document.body.classList.remove("modal-open");
  currentEventId = null; // сброс "текущего события"
}

function setActiveTab(tabId) {
  qsa(".tab-content").forEach((el) => el.classList.remove("active"));
  qsa(".tab-btn").forEach((el) => el.classList.remove("active"));

  const tab = qs(`#${tabId}`);
  const btn = qs(`[data-tab-btn="${tabId}"]`);

  if (tab) tab.classList.add("active");
  if (btn) btn.classList.add("active");
}

// ------------------------------
// Event data (MVP только для тех, кто открывается в модалке)
// ------------------------------
// Ты сейчас открываешь модалку только для карточек с data-event-id.
// Давай держать минимум данных тут. Позже вынесем в events.json.
const EVENTS = {
  "igb_live_2026_london": {
    title: "iGB L!VE", description: "Крупнейшая iGaming выставка Европы",
    city: "London", country: "GB", countryName: "Великобритания",
    dates: "1-2 июля 2026", attendees: "15,000", promo: "-15%",
    weather: { temp: "18-22°C", description: "Тёплое лето, возможны дожди" },
    heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    startISO: "2026-07-01T09:00:00Z", endISO: "2026-07-02T18:00:00Z",
    restaurants: [
      { name: "Roka Canary Wharf", vibe: "посидеть", avgCheck: "$100-300", description: "Японский ресторан с robata грилем", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Boisdale Canary Wharf", vibe: "громко", avgCheck: "$100-300", description: "Шотландский ресторан с живым джазом", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Electric Shuffle", vibe: "потанцевать", avgCheck: "$50-100", description: "Бар с активной атмосферой и коктейлями", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" },
      { name: "The Oiler Bar", vibe: "посидеть", avgCheck: "$60-120", description: "Коктейльный бар в Docklands", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Hawksmoor", vibe: "тихо", avgCheck: "$120-250", description: "Премиум стейкхаус", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" }
    ],
    brands: [
      { name: "CoolAffs", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=CA&background=7C3AED&color=fff" },
      { name: "EcoPayz", category: "Платежи", logo: "https://logo.clearbit.com/ecopayz.com" },
      { name: "Betsson Group", category: "Оператор", logo: "https://logo.clearbit.com/betsson.com" },
      { name: "Evolution Gaming", category: "Провайдер", logo: "https://logo.clearbit.com/evolution.com" },
      { name: "Pragmatic Play", category: "Провайдер", logo: "https://logo.clearbit.com/pragmaticplay.com" },
      { name: "Melbet", category: "Оператор", logo: "https://logo.clearbit.com/melbet.com" },
      { name: "1Bet", category: "Оператор", logo: "https://logo.clearbit.com/1bet.com" },
      { name: "22Bet Partners", category: "Партнёрка", logo: "https://logo.clearbit.com/22bet.com" },
      { name: "Sportradar", category: "Технологии", logo: "https://logo.clearbit.com/sportradar.com" },
      { name: "Playtech", category: "Провайдер", logo: "https://logo.clearbit.com/playtech.com" }
    ],
    sideEvents: [
      { title: "iGB Affiliate Awards", date: "1 июля", location: "ExCeL London", type: "awards" },
      { title: "Opening Night Party", date: "1 июля", location: "TBA", type: "party" },
      { title: "Affiliate Networking Drinks", date: "1 июля", location: "The Gun Docklands", type: "meetup" }
    ]
  },

  "sbc_rio_2026": {
    title: "SBC Summit Rio", description: "Крупнейшее событие в латиноамериканской индустрии iGaming",
    city: "Rio de Janeiro", country: "BR", countryName: "Бразилия",
    dates: "3-5 марта 2026", attendees: "15,000", promo: "-15%",
    weather: { temp: "28-32°C", description: "Жарко и влажно, сезон дождей заканчивается" },
    heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    startISO: "2026-03-03T09:00:00Z", endISO: "2026-03-05T18:00:00Z",
    restaurants: [
      { name: "Shiso", vibe: "тихо", avgCheck: "$80-200", description: "Японский ресторан высокого класса", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Zaza Bistro", vibe: "посидеть", avgCheck: "$60-150", description: "Bistro с органическими блюдами в Ipanema", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Giuseppe Grill", vibe: "громко", avgCheck: "$100-250", description: "Премиальный стейкхаус", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Braseiro da Gávea", vibe: "громко", avgCheck: "$40-80", description: "Традиционная бразильская кухня", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Confeitaria Colombo", vibe: "посидеть", avgCheck: "$30-60", description: "Историческое кафе 1894 года", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" }
    ],
    brands: [
      { name: "Betsson Group", category: "Оператор", logo: "https://logo.clearbit.com/betsson.com" },
      { name: "Betway", category: "Оператор", logo: "https://logo.clearbit.com/betway.com" },
      { name: "Pragmatic Play", category: "Провайдер", logo: "https://logo.clearbit.com/pragmaticplay.com" },
      { name: "Evolution Gaming", category: "Провайдер", logo: "https://logo.clearbit.com/evolution.com" },
      { name: "Stake", category: "Оператор", logo: "https://logo.clearbit.com/stake.com" },
      { name: "Sportradar", category: "Технологии", logo: "https://logo.clearbit.com/sportradar.com" },
      { name: "Betano", category: "Оператор", logo: "https://logo.clearbit.com/betano.com" },
      { name: "Superbet", category: "Оператор", logo: "https://logo.clearbit.com/superbet.com" },
      { name: "Aposta Ganha", category: "Оператор", logo: "https://ui-avatars.com/api/?name=AG&background=22C55E&color=fff" },
      { name: "PixBet", category: "Оператор", logo: "https://ui-avatars.com/api/?name=PB&background=06B6D4&color=fff" }
    ],
    sideEvents: [
      { title: "SBC Awards Latin America", date: "4 марта", location: "Riocentro", type: "awards" },
      { title: "Beach Party", date: "4 марта", location: "Copacabana", type: "party" }
    ]
  },

  "sbc_lisbon_2026": {
    title: "SBC Summit", description: "Главный саммит беттинг и iGaming индустрии",
    city: "Lisbon", country: "PT", countryName: "Португалия",
    dates: "29 сент - 1 окт 2026", attendees: "25,000", promo: "-15%",
    weather: { temp: "20-25°C", description: "Тёплая осень, солнечно" },
    heroImage: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
    startISO: "2026-09-29T09:00:00Z", endISO: "2026-10-01T18:00:00Z",
    restaurants: [
      { name: "Monte Mar Lisboa", vibe: "посидеть", avgCheck: "$80-180", description: "Морепродукты с видом на Тежу", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "JNcQUOI Avenida", vibe: "громко", avgCheck: "$100-250", description: "Элитный ресторан португальской кухни", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Zambeze", vibe: "потанцевать", avgCheck: "$60-140", description: "Панорамный вид, терраса 300м²", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" },
      { name: "Doca Peixe", vibe: "посидеть", avgCheck: "$50-120", description: "Лучший рыбный ресторан, вид на марину", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Belcanto", vibe: "тихо", avgCheck: "$180-400", description: "2 звезды Мишлен от José Avillez", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" }
    ],
    brands: [
      { name: "Betsson Group", category: "Оператор", logo: "https://logo.clearbit.com/betsson.com" },
      { name: "Flutter Entertainment", category: "Оператор", logo: "https://logo.clearbit.com/flutter.com" },
      { name: "Entain", category: "Оператор", logo: "https://logo.clearbit.com/entain.com" },
      { name: "Evolution Gaming", category: "Провайдер", logo: "https://logo.clearbit.com/evolution.com" },
      { name: "Pragmatic Play", category: "Провайдер", logo: "https://logo.clearbit.com/pragmaticplay.com" },
      { name: "Playtech", category: "Провайдер", logo: "https://logo.clearbit.com/playtech.com" },
      { name: "Sportradar", category: "Технологии", logo: "https://logo.clearbit.com/sportradar.com" },
      { name: "Kambi", category: "Технологии", logo: "https://logo.clearbit.com/kambi.com" },
      { name: "SoftSwiss", category: "Технологии", logo: "https://logo.clearbit.com/softswiss.com" },
      { name: "Nuvei", category: "Платежи", logo: "https://logo.clearbit.com/nuvei.com" }
    ],
    sideEvents: [
      { title: "SBC Awards", date: "30 сентября", location: "MEO Arena", type: "awards" },
      { title: "Sunset Networking", date: "29 сентября", location: "LX Factory", type: "meetup" }
    ]
  },

  "affiliate_world_dubai_2026": {
    title: "Affiliate World Dubai", description: "Глобальная конференция аффилиатов и маркетологов",
    city: "Dubai", country: "AE", countryName: "ОАЭ",
    dates: "4-5 марта 2026", attendees: "6,000", promo: null,
    weather: { temp: "24-28°C", description: "Приятно тепло, низкая влажность" },
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    startISO: "2026-03-04T09:00:00Z", endISO: "2026-03-05T18:00:00Z",
    restaurants: [
      { name: "Zuma Dubai", vibe: "громко", avgCheck: "$150-350", description: "Японский ресторан мирового класса", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "La Petite Maison", vibe: "тихо", avgCheck: "$120-280", description: "Французская кухня Ривьеры", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Nobu Dubai", vibe: "тихо", avgCheck: "$150-400", description: "Японо-перуанский премиум", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Coya Dubai", vibe: "потанцевать", avgCheck: "$100-250", description: "Перуанская кухня, живая музыка", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" },
      { name: "Tresind Studio", vibe: "тихо", avgCheck: "$200-400", description: "Индийская haute cuisine, 1 звезда Мишлен", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" }
    ],
    brands: [
      { name: "Clickbank", category: "Партнёрка", logo: "https://logo.clearbit.com/clickbank.com" },
      { name: "MaxBounty", category: "Партнёрка", logo: "https://logo.clearbit.com/maxbounty.com" },
      { name: "PropellerAds", category: "Технологии", logo: "https://logo.clearbit.com/propellerads.com" },
      { name: "Adsterra", category: "Технологии", logo: "https://logo.clearbit.com/adsterra.com" },
      { name: "Voluum", category: "Технологии", logo: "https://logo.clearbit.com/voluum.com" },
      { name: "Keitaro", category: "Технологии", logo: "https://logo.clearbit.com/keitaro.io" },
      { name: "Binom", category: "Технологии", logo: "https://logo.clearbit.com/binom.org" },
      { name: "RedTrack", category: "Технологии", logo: "https://logo.clearbit.com/redtrack.io" },
      { name: "ClickDealer", category: "Партнёрка", logo: "https://logo.clearbit.com/clickdealer.com" },
      { name: "Mobidea", category: "Партнёрка", logo: "https://logo.clearbit.com/mobidea.com" }
    ],
    sideEvents: [
      { title: "Opening Party", date: "4 марта", location: "TBA", type: "party" },
      { title: "Yacht Networking", date: "5 марта", location: "Dubai Marina", type: "meetup" }
    ]
  },

  "mac_yerevan_2026": {
    title: "MAC Yerevan", description: "СНГ конференция по партнёрскому маркетингу",
    city: "Yerevan", country: "AM", countryName: "Армения",
    dates: "25-27 мая 2026", attendees: "3,000", promo: null,
    weather: { temp: "22-28°C", description: "Тёплая весна, солнечно" },
    heroImage: "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=800&q=80",
    startISO: "2026-05-25T09:00:00Z", endISO: "2026-05-27T18:00:00Z",
    restaurants: [
      { name: "Dolmama", vibe: "посидеть", avgCheck: "$40-80", description: "Традиционная армянская кухня", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "The Club", vibe: "громко", avgCheck: "$60-120", description: "Живая музыка, популярен у экспатов", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Sherep", vibe: "посидеть", avgCheck: "$50-100", description: "Авторская армянская кухня", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Pandok Yerevan", vibe: "громко", avgCheck: "$30-70", description: "Традиционный ресторан с шоу", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Lavash", vibe: "посидеть", avgCheck: "$40-90", description: "Армянская кухня, вид на Арарат", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" }
    ],
    brands: [
      { name: "Pin-Up Partners", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=PU&background=EF4444&color=fff" },
      { name: "1xBet Partners", category: "Партнёрка", logo: "https://logo.clearbit.com/1xbet.com" },
      { name: "Lucky Partners", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=LP&background=22C55E&color=fff" },
      { name: "Mostbet Partners", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=MB&background=F97316&color=fff" },
      { name: "Gambling.pro", category: "Медиа", logo: "https://ui-avatars.com/api/?name=GP&background=7C3AED&color=fff" },
      { name: "CPA Life", category: "Медиа", logo: "https://ui-avatars.com/api/?name=CL&background=3B82F6&color=fff" },
      { name: "Leadgid", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=LG&background=10B981&color=fff" },
      { name: "Affstar", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=AS&background=F97316&color=fff" },
      { name: "MetaCPA", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=MC&background=8B5CF6&color=fff" },
      { name: "Mobidea", category: "Партнёрка", logo: "https://logo.clearbit.com/mobidea.com" }
    ],
    sideEvents: [
      { title: "CIS Affiliates Meetup", date: "25 мая", location: "Meridian Expo", type: "meetup" },
      { title: "Closing Party", date: "27 мая", location: "TBA", type: "party" }
    ]
  },

  "ggate_tbilisi_2026": {
    title: "G Gate Tbilisi", description: "Восточноевропейский iGaming форум",
    city: "Tbilisi", country: "GE", countryName: "Грузия",
    dates: "25-27 июня 2026", attendees: "2,500", promo: null,
    weather: { temp: "26-32°C", description: "Жаркое лето, сухо" },
    heroImage: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
    startISO: "2026-06-26T09:00:00Z", endISO: "2026-06-27T18:00:00Z",
    restaurants: [
      { name: "Funicular Complex", vibe: "потанцевать", avgCheck: "$50-120", description: "Панорамный вид на город", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" },
      { name: "Barbarestan", vibe: "тихо", avgCheck: "$60-140", description: "Исторические рецепты XIX века", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Café Stamba", vibe: "посидеть", avgCheck: "$40-90", description: "Модное место в дизайн-отеле", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Keto and Kote", vibe: "громко", avgCheck: "$30-70", description: "Современная грузинская кухня", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Shavi Lomi", vibe: "громко", avgCheck: "$40-90", description: "Инстаграмное место, авторская кухня", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" }
    ],
    brands: [
      { name: "Gambling.pro", category: "Медиа", logo: "https://ui-avatars.com/api/?name=GP&background=7C3AED&color=fff" },
      { name: "Traffic Cardinals", category: "Медиа", logo: "https://ui-avatars.com/api/?name=TC&background=EF4444&color=fff" },
      { name: "Conversion", category: "Медиа", logo: "https://logo.clearbit.com/conversion.im" },
      { name: "SoftSwiss", category: "Технологии", logo: "https://logo.clearbit.com/softswiss.com" },
      { name: "BetConstruct", category: "Провайдер", logo: "https://logo.clearbit.com/betconstruct.com" },
      { name: "Digitain", category: "Провайдер", logo: "https://logo.clearbit.com/digitain.com" },
      { name: "Spribe", category: "Провайдер", logo: "https://logo.clearbit.com/spribe.co" },
      { name: "Slotegrator", category: "Технологии", logo: "https://logo.clearbit.com/slotegrator.com" },
      { name: "Endorphina", category: "Провайдер", logo: "https://logo.clearbit.com/endorphina.com" },
      { name: "Upgaming", category: "Провайдер", logo: "https://logo.clearbit.com/upgaming.com" }
    ],
    sideEvents: [
      { title: "Wine Tasting & Networking", date: "26 июня", location: "TBA", type: "dinner" },
      { title: "Closing Party", date: "27 июня", location: "TBA", type: "party" }
    ]
  },

  "broconf_sochi_2026": {
    title: "Broconf", description: "Главная конференция по арбитражу трафика в СНГ",
    city: "Sochi", country: "RU", countryName: "Россия",
    dates: "25-26 апреля 2026", attendees: "4,500", promo: "-15%",
    weather: { temp: "16-22°C", description: "Тёплая весна, возможны дожди" },
    heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    startISO: "2026-04-25T09:00:00Z", endISO: "2026-04-26T18:00:00Z",
    restaurants: [
      { name: "Хмели & Сунели", vibe: "громко", avgCheck: "$40-100", description: "Грузинский ресторан", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Sanremo", vibe: "посидеть", avgCheck: "$80-200", description: "Итальянская кухня, вид на море", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "White Rabbit Sochi", vibe: "тихо", avgCheck: "$100-250", description: "Авторская русская кухня", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Krasnaya Polyana", vibe: "посидеть", avgCheck: "$60-140", description: "Ресторан в горах", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Barashka", vibe: "громко", avgCheck: "$50-120", description: "Кавказская кухня, вид на море", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" }
    ],
    brands: [
      { name: "Партнёркин", category: "Медиа", logo: "https://ui-avatars.com/api/?name=PK&background=7C3AED&color=fff" },
      { name: "Conversion", category: "Медиа", logo: "https://logo.clearbit.com/conversion.im" },
      { name: "Кинза", category: "Медиа", logo: "https://ui-avatars.com/api/?name=K&background=22C55E&color=fff" },
      { name: "Трафик Кардинал", category: "Медиа", logo: "https://ui-avatars.com/api/?name=TC&background=EF4444&color=fff" },
      { name: "CPA.Club", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=CPA&background=3B82F6&color=fff" },
      { name: "Leadbit", category: "Партнёрка", logo: "https://logo.clearbit.com/leadbit.com" },
      { name: "Alfaleads", category: "Партнёрка", logo: "https://logo.clearbit.com/alfaleads.net" },
      { name: "Dr.Cash", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=DC&background=10B981&color=fff" },
      { name: "Everad", category: "Партнёрка", logo: "https://logo.clearbit.com/everad.com" },
      { name: "MetaCPA", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=MC&background=8B5CF6&color=fff" }
    ],
    sideEvents: [
      { title: "Broconf Party", date: "25 апреля", location: "Red Arena", type: "party" },
      { title: "Горный нетворкинг", date: "26 апреля", location: "Красная Поляна", type: "meetup" }
    ]
  },

  "g2e_las_vegas_2026": {
    title: "G2E Las Vegas", description: "Крупнейшая выставка казино индустрии",
    city: "Las Vegas", country: "US", countryName: "США",
    dates: "29 сент - 1 окт 2026", attendees: "27,000", promo: null,
    weather: { temp: "22-32°C", description: "Жарко днём, прохладно ночью" },
    heroImage: "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=800&q=80",
    startISO: "2026-09-29T09:00:00Z", endISO: "2026-10-01T18:00:00Z",
    restaurants: [
      { name: "TAO Asian Bistro", vibe: "громко", avgCheck: "$80-200", description: "Легендарный азиатский в Venetian", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "CUT by Wolfgang Puck", vibe: "тихо", avgCheck: "$120-300", description: "Премиум стейкхаус", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Carnevino", vibe: "посидеть", avgCheck: "$100-250", description: "Итальянский стейкхаус в Palazzo", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Buddakan", vibe: "потанцевать", avgCheck: "$70-150", description: "Азиатский фьюжн, впечатляющий интерьер", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" },
      { name: "Bazaar Meat", vibe: "громко", avgCheck: "$100-280", description: "Стейкхаус от José Andrés", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" }
    ],
    brands: [
      { name: "IGT", category: "Провайдер", logo: "https://logo.clearbit.com/igt.com" },
      { name: "Aristocrat", category: "Провайдер", logo: "https://logo.clearbit.com/aristocrat.com" },
      { name: "Light & Wonder", category: "Провайдер", logo: "https://logo.clearbit.com/lnw.com" },
      { name: "Konami Gaming", category: "Провайдер", logo: "https://logo.clearbit.com/konami.com" },
      { name: "Everi", category: "Технологии", logo: "https://logo.clearbit.com/everi.com" },
      { name: "AGS", category: "Провайдер", logo: "https://logo.clearbit.com/playags.com" },
      { name: "Ainsworth", category: "Провайдер", logo: "https://logo.clearbit.com/ainsworth.com" },
      { name: "JCM Global", category: "Технологии", logo: "https://logo.clearbit.com/jcmglobal.com" },
      { name: "Interblock", category: "Провайдер", logo: "https://logo.clearbit.com/interblockgaming.com" },
      { name: "Aruze Gaming", category: "Провайдер", logo: "https://logo.clearbit.com/aruzegaming.com" }
    ],
    sideEvents: [
      { title: "G2E Networking Reception", date: "29 сентября", location: "The Venetian", type: "meetup" },
      { title: "Casino Night", date: "30 сентября", location: "TBA", type: "party" }
    ]
  },

  "sbc_americas_2026": {
    title: "SBC Summit Americas", description: "Американский беттинг саммит",
    city: "Fort Lauderdale", country: "US", countryName: "США",
    dates: "12-14 мая 2026", attendees: "6,000", promo: "-10%",
    weather: { temp: "28-33°C", description: "Жарко и влажно" },
    heroImage: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80",
    startISO: "2026-05-12T09:00:00Z", endISO: "2026-05-14T18:00:00Z",
    restaurants: [
      { name: "Steak 954", vibe: "тихо", avgCheck: "$100-250", description: "Премиум стейкхаус в W Hotel, вид на океан", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Timpano", vibe: "посидеть", avgCheck: "$70-150", description: "Итальянский с приватными комнатами", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Shooters Waterfront", vibe: "громко", avgCheck: "$50-100", description: "Ресторан на воде, живая музыка", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Louie Bossi's", vibe: "громко", avgCheck: "$60-140", description: "Итальянский с большой террасой", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Mastro's Ocean Club", vibe: "тихо", avgCheck: "$100-280", description: "Премиум стейки и морепродукты", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" }
    ],
    brands: [
      { name: "DraftKings", category: "Оператор", logo: "https://logo.clearbit.com/draftkings.com" },
      { name: "FanDuel", category: "Оператор", logo: "https://logo.clearbit.com/fanduel.com" },
      { name: "BetMGM", category: "Оператор", logo: "https://logo.clearbit.com/betmgm.com" },
      { name: "Caesars Sportsbook", category: "Оператор", logo: "https://logo.clearbit.com/caesars.com" },
      { name: "Penn Entertainment", category: "Оператор", logo: "https://logo.clearbit.com/pennentertainment.com" },
      { name: "Genius Sports", category: "Технологии", logo: "https://logo.clearbit.com/geniussports.com" },
      { name: "Sportradar", category: "Технологии", logo: "https://logo.clearbit.com/sportradar.com" },
      { name: "IGT", category: "Провайдер", logo: "https://logo.clearbit.com/igt.com" },
      { name: "Light & Wonder", category: "Провайдер", logo: "https://logo.clearbit.com/lnw.com" },
      { name: "Paysafe", category: "Платежи", logo: "https://logo.clearbit.com/paysafe.com" }
    ],
    sideEvents: []
  },

  "conversion_warsaw_2026": {
    title: "Conversion Conf", description: "Конференция по лидогенерации и affiliate маркетингу",
    city: "Warsaw", country: "PL", countryName: "Польша",
    dates: "31 марта - 1 апреля 2026", attendees: "2,500", promo: null,
    weather: { temp: "8-14°C", description: "Прохладная весна" },
    heroImage: "https://images.unsplash.com/photo-1581916468984-839e6c00fad0?w=800&q=80",
    startISO: "2026-03-31T09:00:00Z", endISO: "2026-04-01T18:00:00Z",
    restaurants: [
      { name: "Belvedere", vibe: "тихо", avgCheck: "$80-180", description: "В оранжерее парка Łazienki", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Warszawa Wschodnia", vibe: "громко", avgCheck: "$50-120", description: "Модный район Praga", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Stary Dom", vibe: "посидеть", avgCheck: "$40-90", description: "Традиционная польская кухня", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Atelier Amaro", vibe: "тихо", avgCheck: "$150-350", description: "Первый Мишлен в Польше", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "U Kucharzy", vibe: "посидеть", avgCheck: "$60-140", description: "Открытая кухня, польская классика", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" }
    ],
    brands: [
      { name: "PropellerAds", category: "Технологии", logo: "https://logo.clearbit.com/propellerads.com" },
      { name: "Adsterra", category: "Технологии", logo: "https://logo.clearbit.com/adsterra.com" },
      { name: "RichAds", category: "Технологии", logo: "https://logo.clearbit.com/richads.com" },
      { name: "Binom", category: "Технологии", logo: "https://logo.clearbit.com/binom.org" },
      { name: "Keitaro", category: "Технологии", logo: "https://logo.clearbit.com/keitaro.io" },
      { name: "Zeydoo", category: "Партнёрка", logo: "https://logo.clearbit.com/zeydoo.com" },
      { name: "Mobidea", category: "Партнёрка", logo: "https://logo.clearbit.com/mobidea.com" },
      { name: "Clickadu", category: "Технологии", logo: "https://logo.clearbit.com/clickadu.com" },
      { name: "TrafficStars", category: "Технологии", logo: "https://logo.clearbit.com/trafficstars.com" },
      { name: "JEWIN", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=JW&background=F97316&color=fff" }
    ],
    sideEvents: [
      { title: "Pre-Party", date: "31 марта", location: "TBA", type: "party" }
    ]
  },

  "conversion_cyprus_2026": {
    title: "Conversion Conf", description: "Летняя конференция аффилиатов на Кипре",
    city: "Limassol", country: "CY", countryName: "Кипр",
    dates: "22-24 июля 2026", attendees: "2,000", promo: null,
    weather: { temp: "28-32°C", description: "Жаркое средиземноморское лето" },
    heroImage: "https://images.unsplash.com/photo-1598890777032-4e8f2de8c6dc?w=800&q=80",
    startISO: "2026-07-22T09:00:00Z", endISO: "2026-07-24T18:00:00Z",
    restaurants: [
      { name: "Pier One", vibe: "потанцевать", avgCheck: "$60-140", description: "На пляже, закаты", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" },
      { name: "Meze Taverna", vibe: "громко", avgCheck: "$40-80", description: "Традиционное мезе 20+ блюд", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Epsilon", vibe: "посидеть", avgCheck: "$50-120", description: "Современный европейский", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Kipriakon", vibe: "посидеть", avgCheck: "$40-90", description: "Кипрская таверна, мезе 25 блюд", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Sailor's Rest", vibe: "потанцевать", avgCheck: "$60-140", description: "Лаунж на пляже", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=200&q=80" }
    ],
    brands: [
      { name: "PropellerAds", category: "Технологии", logo: "https://logo.clearbit.com/propellerads.com" },
      { name: "Exoclick", category: "Технологии", logo: "https://logo.clearbit.com/exoclick.com" },
      { name: "TwinRed", category: "Технологии", logo: "https://logo.clearbit.com/twinred.com" },
      { name: "Binom", category: "Технологии", logo: "https://logo.clearbit.com/binom.org" },
      { name: "Voluum", category: "Технологии", logo: "https://logo.clearbit.com/voluum.com" },
      { name: "Leadbit", category: "Партнёрка", logo: "https://logo.clearbit.com/leadbit.com" },
      { name: "Alfaleads", category: "Партнёрка", logo: "https://logo.clearbit.com/alfaleads.net" },
      { name: "Traffic Company", category: "Партнёрка", logo: "https://logo.clearbit.com/trafficcompany.com" }
    ],
    sideEvents: [
      { title: "Beach Party", date: "23 июля", location: "Limassol Beach", type: "party" }
    ]
  },

  "affpapa_madrid_2026": {
    title: "AffPapa iGaming Club", description: "Клубная встреча iGaming аффилиатов",
    city: "Madrid", country: "ES", countryName: "Испания",
    dates: "18-20 мая 2026", attendees: "600", promo: null,
    weather: { temp: "20-26°C", description: "Тёплая весна, солнечно" },
    heroImage: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
    startISO: "2026-05-18T09:00:00Z", endISO: "2026-05-20T18:00:00Z",
    restaurants: [
      { name: "Sobrino de Botín", vibe: "посидеть", avgCheck: "$60-140", description: "Старейший ресторан мира (с 1725)", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Streetxo", vibe: "громко", avgCheck: "$50-100", description: "Азиатский стритфуд от DiverXO", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "Lateral", vibe: "посидеть", avgCheck: "$40-90", description: "Современная испанская кухня", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Casa Lucio", vibe: "посидеть", avgCheck: "$50-120", description: "Легендарные huevos rotos", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Ramón Freixa Madrid", vibe: "тихо", avgCheck: "$150-350", description: "2 звезды Мишлен", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" }
    ],
    brands: [
      { name: "AffPapa", category: "Медиа", logo: "https://logo.clearbit.com/affpapa.com" },
      { name: "Soft2Bet", category: "Оператор", logo: "https://logo.clearbit.com/soft2bet.com" },
      { name: "Digitain", category: "Провайдер", logo: "https://logo.clearbit.com/digitain.com" },
      { name: "Income Access", category: "Технологии", logo: "https://logo.clearbit.com/incomeaccess.com" },
      { name: "Affilka", category: "Технологии", logo: "https://logo.clearbit.com/affilka.com" },
      { name: "SOFTSWISS", category: "Технологии", logo: "https://logo.clearbit.com/softswiss.com" },
      { name: "BetConstruct", category: "Провайдер", logo: "https://logo.clearbit.com/betconstruct.com" },
      { name: "SiGMA", category: "Медиа", logo: "https://logo.clearbit.com/sigma.world" }
    ],
    sideEvents: [
      { title: "Tapas & Networking", date: "18 мая", location: "TBA", type: "dinner" },
      { title: "Rooftop Party", date: "19 мая", location: "TBA", type: "party" }
    ]
  },

  "affpapa_cancun_2026": {
    title: "AffPapa iGaming Club", description: "Клубная встреча аффилиатов в Мексике",
    city: "Cancun", country: "MX", countryName: "Мексика",
    dates: "23-25 ноября 2026", attendees: "600", promo: null,
    weather: { temp: "26-30°C", description: "Тепло, конец сезона дождей" },
    heroImage: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80",
    startISO: "2026-11-23T09:00:00Z", endISO: "2026-11-25T18:00:00Z",
    restaurants: [
      { name: "Harry's Prime Steakhouse", vibe: "тихо", avgCheck: "$100-250", description: "Премиальный стейкхаус", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Puerto Madero", vibe: "посидеть", avgCheck: "$70-160", description: "Морепродукты с видом на лагуну", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Lorenzillo's", vibe: "громко", avgCheck: "$60-140", description: "Легендарные морепродукты", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "La Habichuela Sunset", vibe: "посидеть", avgCheck: "$80-180", description: "Мексиканская кухня, сад с пальмами", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Tacos Rigo", vibe: "громко", avgCheck: "$15-40", description: "Аутентичные тако, лучшая цена", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" }
    ],
    brands: [
      { name: "AffPapa", category: "Медиа", logo: "https://logo.clearbit.com/affpapa.com" },
      { name: "Stake", category: "Оператор", logo: "https://logo.clearbit.com/stake.com" },
      { name: "Betway", category: "Оператор", logo: "https://logo.clearbit.com/betway.com" },
      { name: "Bitcasino", category: "Оператор", logo: "https://logo.clearbit.com/bitcasino.io" },
      { name: "Sportsbet.io", category: "Оператор", logo: "https://logo.clearbit.com/sportsbet.io" },
      { name: "Cloudbet", category: "Оператор", logo: "https://logo.clearbit.com/cloudbet.com" },
      { name: "Rollbit", category: "Оператор", logo: "https://logo.clearbit.com/rollbit.com" },
      { name: "Duelbits", category: "Оператор", logo: "https://logo.clearbit.com/duelbits.com" }
    ],
    sideEvents: [
      { title: "Welcome Party", date: "23 ноября", location: "Hotel Zone", type: "party" },
      { title: "Beach Club Day", date: "24 ноября", location: "TBA", type: "party" }
    ]
  },

  "conversion_kyiv_2026": {
    title: "Conversion Conf", description: "Украинская affiliate конференция",
    city: "Kyiv", country: "UA", countryName: "Украина",
    dates: "TBA 2026", attendees: "2,000", promo: null,
    weather: { temp: "—", description: "Даты уточняются" },
    heroImage: "https://images.unsplash.com/photo-1561542320-9a18cd340469?w=800&q=80",
    startISO: "2026-06-01T09:00:00Z", endISO: "2026-06-02T18:00:00Z",
    restaurants: [
      { name: "Kanapa", vibe: "посидеть", avgCheck: "$40-100", description: "Современная украинская кухня", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Beef", vibe: "тихо", avgCheck: "$50-120", description: "Стейкхаус премиум класса", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=80" },
      { name: "Очень Хорошо", vibe: "громко", avgCheck: "$30-70", description: "Модный ресторан, коктейли", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" },
      { name: "100 років тому вперед", vibe: "посидеть", avgCheck: "$35-80", description: "Ретро-атмосфера", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80" },
      { name: "Ostannya Barykada", vibe: "громко", avgCheck: "$40-90", description: "Культовый бар на Майдане", img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80" }
    ],
    brands: [
      { name: "Conversion", category: "Медиа", logo: "https://logo.clearbit.com/conversion.im" },
      { name: "Revenuelab", category: "Партнёрка", logo: "https://logo.clearbit.com/revenuelab.co" },
      { name: "Clickdealer", category: "Партнёрка", logo: "https://logo.clearbit.com/clickdealer.com" },
      { name: "AdCombo", category: "Партнёрка", logo: "https://logo.clearbit.com/adcombo.com" },
      { name: "Yellana", category: "Партнёрка", logo: "https://logo.clearbit.com/yellana.com" },
      { name: "JEWIN", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=JW&background=F97316&color=fff" },
      { name: "CPAMafia", category: "Партнёрка", logo: "https://ui-avatars.com/api/?name=CM&background=111827&color=fff" },
      { name: "Golden Goose", category: "Партнёрка", logo: "https://logo.clearbit.com/goldengoose.com" }
    ],
    sideEvents: []
  }
};


function populateModal(eventId) {
  const event = EVENTS[eventId];
  if (!event) return;

  currentEventId = eventId;

  // === HERO с погодой ===
  const heroEl = qs("#modalHero");
  if (heroEl) {
    const weatherHTML = event.weather && event.weather.temp !== '—' ? `
      <div class="weather-overlay">
        <div class="temp">🌡️ ${event.weather.temp}</div>
        <div>${event.weather.description}</div>
      </div>
    ` : '';

    heroEl.innerHTML = `
      <div class="modal-hero" style="background-image: linear-gradient(to bottom, transparent 40%, rgba(22,24,29,0.95)), url('${event.heroImage || ''}')">
        <button class="modal-close-btn" onclick="closeModal()" type="button">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        ${weatherHTML}
      </div>
    `;
  }

  // === INFO: название, место, даты, описание (БЕЗ тегов) ===
  const infoEl = qs("#modalInfo");
  if (infoEl) {
    infoEl.innerHTML = `
      <h2 class="modal-title">${event.title}</h2>
      <p class="modal-location">
        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
        ${event.countryName}, ${event.city}
      </p>
      <p class="modal-dates">
        <svg class="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        ${event.dates}
      </p>
      <p class="modal-description">${event.description}</p>
    `;
  }

  // === ТРИ КАРТОЧКИ: участники, виза, промо ===
  const statsEl = qs("#modalStats");
  if (statsEl) {
    // Виза
    const visaInfo = getVisaInfo(currentCitizenship, event.country);
    let visaValue, visaClass;

    if (visaInfo) {
      if (visaInfo.required === 'нет') {
        visaValue = 'Без визы';
        visaClass = 'visa-free';
      } else if (visaInfo.required === 'да') {
        visaValue = 'Нужна виза';
        visaClass = 'visa-required';
      } else if (visaInfo.required === 'запрет') {
        visaValue = 'Закрыт';
        visaClass = 'visa-banned';
      } else if (visaInfo.required === 'эл.разреш.') {
        visaValue = 'Эл. виза';
        visaClass = 'visa-free';
      } else {
        visaValue = 'Уточняется';
        visaClass = 'no-promo';
      }
    } else {
      visaValue = 'Уточняется';
      visaClass = 'no-promo';
    }

    // Промо
    const promoValue = event.promo || 'Скоро';
    const promoClass = event.promo ? 'promo' : 'no-promo';

    statsEl.innerHTML = `
      <div class="stat-card">
        <div class="stat-value attendees">${event.attendees}</div>
        <div class="stat-label">участников</div>
      </div>
      <div class="stat-card">
        <div class="stat-value ${visaClass}">${visaValue}</div>
        <div class="stat-label">виза</div>
      </div>
      <div class="stat-card">
        <div class="stat-value ${promoClass}">${promoValue}</div>
        <div class="stat-label">промо</div>
      </div>
    `;
  }

  // Populate tabs
  populateRestaurantsTab(event.restaurants || []);
  populateSideEventsTab(event.sideEvents || []);
  populateBrandsTab(event.brands || []);

  // Update tab button labels with counts
  const eventsBtn = qs('[data-tab-btn="events"]');
  const brandsBtn = qs('[data-tab-btn="brands"]');

  if (eventsBtn) {
    const count = (event.sideEvents || []).length;
    eventsBtn.textContent = count > 0 ? `Сайд-ивенты (${count})` : "Сайд-ивенты";
  }

  if (brandsBtn) {
    const count = (event.brands || []).length;
    brandsBtn.textContent = count > 0 ? `Бренды (${count})` : "Бренды";
  }

  // Default tab
  setActiveTab("guide");
}

function populateRestaurantsTab(restaurants) {
  const container = qs("#guide");
  if (!container) return;

  if (!restaurants || restaurants.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <p class="text-sm">Скоро добавим рекомендации ближе к датам конференции</p>
      </div>
    `;
    return;
  }

  const vibeMap = {
    'тихо': { label: '🤫 Тихо', class: 'vibe-tag-quiet' },
    'посидеть': { label: '☕ Посидеть', class: 'vibe-tag-sit' },
    'громко': { label: '🎵 Громко', class: 'vibe-tag-loud' },
    'потанцевать': { label: '💃 Потанцевать', class: 'vibe-tag-dance' }
  };

  let html = `
    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4" style="margin-top: 24px;">
      Рестораны для встреч
    </h3>
  `;

  restaurants.forEach(r => {
    const vibeInfo = vibeMap[r.vibe] || { label: r.vibe, class: 'vibe-tag-sit' };
    html += `
      <div class="restaurant-card relative flex gap-4 p-4 rounded-xl border border-[#2A2E37] bg-[#0F1115] mb-3 cursor-pointer">
        ${r.avgCheck ? `<div class="absolute top-3 right-3"><span class="restaurant-check-pill">${r.avgCheck}</span></div>` : ''}
        <img src="${r.img || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop'}" class="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-lg" alt="${r.name}" loading="lazy" decoding="async">
        <div class="flex-1 flex flex-col min-w-0">
          <div class="font-bold text-white text-[16px] mb-1.5">${r.name}</div>
          ${vibeInfo.label ? `<span class="vibe-tag ${vibeInfo.class} mb-2">${vibeInfo.label}</span>` : ''}
          <div class="restaurant-description text-xs text-gray-400 leading-relaxed mt-auto">${r.description || ''}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function populateSideEventsTab(sideEvents) {
  const container = qs("#events");
  if (!container) return;

  if (!sideEvents || sideEvents.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <p class="text-sm">Скоро добавим информацию о side events и afterparty</p>
      </div>
    `;
    return;
  }

  let html = '';
  sideEvents.forEach(e => {
    html += `
      <div class="side-event-card bg-gradient-to-br from-gray-900 to-black dark:from-darkbg dark:to-darksurface text-white p-6 rounded-2xl relative overflow-hidden shadow-lg group mb-4">
        <div class="relative z-10 flex justify-between items-start">
          <div>
            <div class="flex gap-2 mb-3">
              <span class="uni-tag uni-tag-accent">${e.badge || '🎉 EVENT'}</span>
            </div>
            <h3 class="text-2xl font-extrabold mb-2">${e.title}</h3>
            <p class="text-sm text-gray-300 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              ${e.location || ''}
            </p>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function createBrandCard(brand) {
  const initials = brand.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return `
    <div class="brand-card">
      <img
        src="${brand.logo}"
        alt="${brand.name}"
        class="brand-logo"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      >
      <div class="brand-icon-fallback" style="display: none;">${initials}</div>
      <div class="brand-name">${brand.name}</div>
      <div class="brand-category">${brand.category}</div>
    </div>
  `;
}

function populateBrandsTab(brands) {
  const container = qs("#brands");
  if (!container) return;

  if (!brands || brands.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-400">
        <p class="text-sm">Скоро добавим список участников и брендов</p>
      </div>
    `;
    return;
  }

  let html = '<div class="brands-grid">';

  brands.forEach(brand => {
    html += createBrandCard(brand);
  });

  html += '</div>';

  container.innerHTML = html;
}

// ------------------------------
// ICS generation
// ------------------------------
function escapeICS(text) {
  return String(text || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toICSDateTime(iso) {
  // ожидаем "2026-02-25T09:00:00Z" или без Z
  // конвертируем в формат YYYYMMDDTHHMMSSZ
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  const pad = (n) => String(n).padStart(2, "0");
  const YYYY = d.getUTCFullYear();
  const MM = pad(d.getUTCMonth() + 1);
  const DD = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${YYYY}${MM}${DD}T${hh}${mm}${ss}Z`;
}

// ------------------------------
// Init
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Citizenship
  const citizenshipSelect = qs("#citizenshipSelect");
  if (citizenshipSelect) {
    currentCitizenship = citizenshipSelect.value || "RU";
    citizenshipSelect.addEventListener("change", () => {
      currentCitizenship = citizenshipSelect.value || "RU";
      updateAllVisaTags();
      applyFilters();
      // если модалка открыта — обновим бейдж в ней
      if (currentEventId) populateModal(currentEventId);
    });
  }

  // Visa tags initial
  updateAllVisaTags();

  // Filters
  qs("#filterSizeBtn")?.addEventListener("click", () => {
    tierFilterIndex = (tierFilterIndex + 1) % TIER_FILTERS.length;
    updateFilterLabels();
    applyFilters();
  });

  qs("#filterVisaBtn")?.addEventListener("click", () => {
    visaFilterIndex = (visaFilterIndex + 1) % VISA_FILTERS.length;
    updateFilterLabels();
    applyFilters();
  });

  updateFilterLabels();
  applyFilters();

  // Modal open: bind all clickable event cards
  qsa(".event-card[data-event-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-event-id");
      if (!id) return;
      populateModal(id);
      openModal();
    });
  });

  // Modal close
  qs("#modalCloseBtn")?.addEventListener("click", closeModal);
  qs("#modalBg")?.addEventListener("click", closeModal);

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Tabs
  qsa("[data-tab-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab-btn");
      if (tab) setActiveTab(tab);
    });
  });

  // ------------------------------
  // Calendar Export Logic
  // ------------------------------
  initCalendarExport();

  // ------------------------------
  // Access Modal (Lead Capture)
  // ------------------------------
  initAccessModal();
});

// ------------------------------
// Calendar Export Logic
// ------------------------------
const MONTH_MAP_EN = {
  'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
  'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
  'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
};

const MONTH_MAP_RU = {
  'янв': '01', 'фев': '02', 'мар': '03', 'апр': '04',
  'май': '05', 'июн': '06', 'июл': '07', 'авг': '08',
  'сен': '09', 'окт': '10', 'ноя': '11', 'дек': '12'
};

function getVisibleEvents() {
  const allCards = qsa('[data-filterable="1"]');
  return allCards.filter(card => {
    // Check if visible
    if (card.offsetParent === null) return false;
    const style = window.getComputedStyle(card);
    if (style.display === 'none') return false;
    if (card.classList.contains('hidden')) return false;
    return true;
  });
}

function initCalendarExport() {
  const addBtn = qs("#addToCalendarBtn");
  const modalAddBtn = qs("#modalAddToCalendarBtn");

  // Main button: smart behavior (mobile = modal list, desktop = ICS file)
  addBtn?.addEventListener("click", () => {
    const visibleCards = getVisibleEvents();

    if (visibleCards.length === 0) return;

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: show modal with event list
      showMultiEventModal(visibleCards);
    } else {
      // Desktop: download ICS file
      const conferences = visibleCards.map(card => extractConferenceData(card));
      const icsData = generateMultiEventICS(conferences);
      if (icsData) {
        downloadICSFile(icsData, "secretroom-calendar-2026");
      }
    }
  });

  // Modal button: add current event - smart device detection
  modalAddBtn?.addEventListener("click", () => {
    if (!currentEventId) return;

    const ev = EVENTS[currentEventId];
    if (!ev) return;

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Mobile: Use ICS file to open native calendar app
      const icsContent = buildICS(ev);
      downloadICSFile(icsContent, ev.title.replace(/\s+/g, '_'));
    } else {
      // Desktop: Open Google Calendar in browser
      const links = generateCalendarLinks(ev);
      window.open(links.google, '_blank');
    }
  });

  // Modal promo button
  const modalPromoBtn = qs("#modalPromoBtn");
  modalPromoBtn?.addEventListener("click", () => {
    if (!currentEventId) return;
    const ev = EVENTS[currentEventId];
    if (!ev) return;

    if (ev.promo) {
      showPromoToast(ev.promo);
    } else {
      showPromoToast("СКОРО");
    }
  });
}

// Promo Toast Functions
function showPromoToast(promoCode) {
  const toast = qs("#promoToast");
  const codeValue = qs("#promoCodeValue");
  const copyBtn = qs("#promoCopyBtn");

  if (!toast || !codeValue) return;

  codeValue.textContent = promoCode;
  copyBtn.classList.remove("copied");
  copyBtn.textContent = "📋 Скопировать";

  toast.classList.add("show");

  // Auto hide after 10 seconds
  setTimeout(() => {
    hidePromoToast();
  }, 10000);
}

function hidePromoToast() {
  const toast = qs("#promoToast");
  if (toast) {
    toast.classList.remove("show");
  }
}

function copyPromoCode() {
  const codeValue = qs("#promoCodeValue");
  const copyBtn = qs("#promoCopyBtn");

  if (!codeValue) return;

  const code = codeValue.textContent;

  // Copy to clipboard
  navigator.clipboard.writeText(code).then(() => {
    copyBtn.classList.add("copied");
    copyBtn.textContent = "✓ Скопировано!";

    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtn.textContent = "📋 Скопировать";
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Multi-Event Modal Functions (for mobile)
function showMultiEventModal(visibleCards) {
  const modal = qs("#multiEventModal");
  const eventList = qs("#multiEventList");

  if (!modal || !eventList) return;

  // Clear previous content
  eventList.innerHTML = '';

  // Create event items
  visibleCards.forEach(card => {
    const eventId = card.dataset.eventId;
    const event = EVENTS[eventId];

    if (!event) return;

    const eventItem = document.createElement('div');
    eventItem.className = 'multi-event-item';

    const title = document.createElement('div');
    title.className = 'multi-event-title';
    title.textContent = event.title;

    const dates = document.createElement('div');
    dates.className = 'multi-event-dates';
    dates.innerHTML = `📅 ${event.dates}`;

    const addButton = document.createElement('button');
    addButton.className = 'multi-event-add-btn';
    addButton.textContent = 'Добавить в календарь';
    addButton.addEventListener('click', () => {
      // Use ICS file to open native calendar app
      const icsContent = buildICS(event);
      downloadICSFile(icsContent, event.title.replace(/\s+/g, '_'));

      // Visual feedback
      addButton.textContent = '✓ Добавлено';
      addButton.classList.add('added');
    });

    eventItem.appendChild(title);
    eventItem.appendChild(dates);
    eventItem.appendChild(addButton);

    eventList.appendChild(eventItem);
  });

  // Show modal
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

function hideMultiEventModal() {
  const modal = qs("#multiEventModal");
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.style.display = 'none', 300);
  }
}

// Init multi-event modal close button
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = qs("#closeMultiEventModal");
  const modal = qs("#multiEventModal");

  closeBtn?.addEventListener("click", hideMultiEventModal);

  // Close on overlay click
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideMultiEventModal();
    }
  });
});

function extractConferenceData(card) {
  const data = {
    title: "",
    location: "",
    country: card.getAttribute("data-country") || "",
    startDate: null,
    endDate: null,
    isTBD: false,
    description: ""
  };

  // Extract title
  const titleEl = card.querySelector("h3, .text-sm.font-bold, .font-bold");
  if (titleEl) data.title = titleEl.textContent.trim();

  // Extract location
  const locationEl = card.querySelector("p.text-xs, .text-\\[11px\\]");
  if (locationEl) {
    const locationText = locationEl.textContent.trim();
    data.location = locationText.split("•")[0].trim();
  }

  // Extract dates
  const dataStart = card.getAttribute("data-start");
  const dataEnd = card.getAttribute("data-end");

  if (dataStart && dataEnd) {
    data.startDate = dataStart;
    data.endDate = dataEnd;
  } else {
    // Try to parse from text
    const dateEl = card.querySelector("span.tag");
    if (dateEl) {
      const dateText = dateEl.textContent.trim();
      const parsed = parseDateText(dateText, card);
      data.startDate = parsed.start;
      data.endDate = parsed.end;
      data.isTBD = parsed.isTBD;
    }
  }

  return data;
}

function parseDateText(text, card) {
  const result = { start: null, end: null, isTBD: false };

  // Check for "DD–DD Month" format (Russian)
  const ruMatch = text.match(/(\d+)[–-](\d+)\s+(\S+)/);
  if (ruMatch) {
    const [, startDay, endDay, monthRu] = ruMatch;
    const monthLower = monthRu.toLowerCase().substring(0, 3);
    const month = MONTH_MAP_RU[monthLower];
    if (month) {
      result.start = `2026-${month}-${startDay.padStart(2, '0')}`;
      result.end = `2026-${month}-${endDay.padStart(2, '0')}`;
      return result;
    }
  }

  // Check for TBD format
  if (text.includes("TBD") || text.includes("Даты TBD")) {
    result.isTBD = true;

    // Try to extract month from text
    const monthMatch = text.match(/TBD\s+(\w+)/i);
    let month = null;

    if (monthMatch) {
      const monthStr = monthMatch[1].toLowerCase();
      month = MONTH_MAP_EN[monthStr];
    }

    // Fallback: get month from parent cell
    if (!month) {
      const cell = card.closest(".cell");
      if (cell) {
        const monthNum = cell.querySelector(".month-num");
        if (monthNum) {
          month = monthNum.textContent.trim().padStart(2, '0');
        }
      }
    }

    if (month) {
      result.start = `2026-${month}-01`;
      result.end = `2026-${month}-02`;
    }
  }

  return result;
}

function generateMultiEventICS(conferences) {
  if (!conferences || conferences.length === 0) return null;

  const now = toICSDateTime(new Date().toISOString());
  const events = conferences.map((conf, idx) => {
    if (!conf.startDate || !conf.endDate) return null;

    const uid = `${Date.now()}-${idx}@secretroom-calendar`;
    const dtStart = conf.startDate.replace(/-/g, '');
    const dtEnd = conf.endDate.replace(/-/g, '');

    let description = conf.description || "";
    if (conf.isTBD) {
      description = "⚠️ Дата ориентировочная (TBD). Уточните перед поездкой.\n\n" + description;
    }

    return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART;VALUE=DATE:${dtStart}
DTEND;VALUE=DATE:${dtEnd}
SUMMARY:${escapeICS(conf.title)}
LOCATION:${escapeICS(conf.location)}
DESCRIPTION:${escapeICS(description)}
END:VEVENT`;
  }).filter(Boolean);

  if (events.length === 0) return null;

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Secretroom//iGaming Calendar//RU
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events.join('\n')}
END:VCALENDAR`;

  return ics;
}


function downloadICSFile(icsContent, basename) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${basename || 'event'}.ics`;

  if (isIOS) {
    // iOS: Use target blank to trigger calendar app
    link.target = '_blank';
  }

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();

  // Clean up after a short delay
  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);
}

// ------------------------------
// Calendar Integration Functions
// ------------------------------

/**
 * Генерирует ICS контент для одного события
 */
function buildICS(event) {
  const conf = {
    title: event.title,
    location: `${event.city}, ${event.countryName || event.country}`,
    country: event.country,
    startDate: event.startISO ? event.startISO.split('T')[0] : null,
    endDate: event.endISO ? event.endISO.split('T')[0] : null,
    isTBD: false,
    description: event.description || ""
  };

  return generateMultiEventICS([conf]);
}

/**
 * Генерирует ссылки для добавления события в разные календари
 */
function generateCalendarLinks(event) {
  const title = event.title;
  const location = `${event.city}, ${event.countryName}`;
  const description = event.description || '';
  const startDate = event.startISO;
  const endDate = event.endISO;

  // Форматирование дат для разных сервисов
  const formatDateForGoogle = (isoDate) => {
    return isoDate.replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateForYahoo = (isoDate) => {
    return isoDate.replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateForOutlook = (isoDate) => {
    return isoDate;
  };

  // Google Calendar
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // Outlook/Office 365
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${formatDateForOutlook(startDate)}&enddt=${formatDateForOutlook(endDate)}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}&path=/calendar/action/compose&rru=addevent`;

  // Yahoo Calendar
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(title)}&st=${formatDateForYahoo(startDate)}&et=${formatDateForYahoo(endDate)}&desc=${encodeURIComponent(description)}&in_loc=${encodeURIComponent(location)}`;

  // Office 365
  const office365Url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${formatDateForOutlook(startDate)}&enddt=${formatDateForOutlook(endDate)}&location=${encodeURIComponent(location)}&body=${encodeURIComponent(description)}&path=/calendar/action/compose&rru=addevent`;

  return {
    google: googleUrl,
    outlook: outlookUrl,
    yahoo: yahooUrl,
    office365: office365Url
  };
}

/**
 * Показывает модальное окно выбора календаря
 */
function showCalendarPicker(event) {
  const links = generateCalendarLinks(event);
  const icsContent = buildICS(event);

  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.id = 'calendarPickerModal';
  modal.className = 'calendar-picker-modal';
  modal.innerHTML = `
    <div class="calendar-picker-overlay"></div>
    <div class="calendar-picker-content">
      <div class="calendar-picker-header">
        <h3>Добавить в календарь</h3>
        <button class="calendar-picker-close">&times;</button>
      </div>
      <div class="calendar-picker-body">
        <button class="calendar-option" data-type="google">
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Google Calendar</span>
        </button>

        <button class="calendar-option" data-type="outlook">
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Outlook Calendar</span>
        </button>

        <button class="calendar-option" data-type="office365">
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Office 365 Calendar</span>
        </button>

        <button class="calendar-option" data-type="yahoo">
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Yahoo Calendar</span>
        </button>

        <button class="calendar-option" data-type="apple">
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Apple Calendar (iCal)</span>
        </button>

        <button class="calendar-option" data-type="ics">
          <svg class="calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Скачать ICS файл</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Анимация появления
  setTimeout(() => modal.classList.add('show'), 10);

  // Обработчики закрытия
  const closeBtn = modal.querySelector('.calendar-picker-close');
  const overlay = modal.querySelector('.calendar-picker-overlay');

  const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Обработчики выбора календаря
  modal.querySelectorAll('.calendar-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;

      switch(type) {
        case 'google':
          window.open(links.google, '_blank');
          break;
        case 'outlook':
          window.open(links.outlook, '_blank');
          break;
        case 'office365':
          window.open(links.office365, '_blank');
          break;
        case 'yahoo':
          window.open(links.yahoo, '_blank');
          break;
        case 'apple':
          // Apple Calendar через data URL
          const dataUrl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(icsContent);
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
          if (isIOS) {
            window.location.href = dataUrl;
          } else {
            window.open(dataUrl, '_blank');
          }
          break;
        case 'ics':
          // Скачать ICS файл
          downloadICSFile(icsContent, event.title.replace(/\s+/g, '_'));
          break;
      }

      closeModal();
    });
  });
}

// ------------------------------
// Access Modal Logic
// ------------------------------
const STORAGE_KEY = "igcal_user";
const BOT_USERNAME = "YOUR_TELEGRAM_BOT_USERNAME"; // Replace with your bot username

function normalizeTelegram(input) {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

function checkAccess() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const data = JSON.parse(stored);
    return !!(data && data.telegram);
  } catch {
    return false;
  }
}

function saveAccess(name, telegram, createdAtISO) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, telegram, createdAtISO }));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

function showAccessModal() {
  const overlay = qs("#accessModalOverlay");
  if (!overlay) return;
  overlay.classList.remove("hidden");
}

function hideAccessModal() {
  const overlay = qs("#accessModalOverlay");
  if (!overlay) return;
  overlay.classList.add("hidden");
}

function showError(message) {
  const el = qs("#accessError");
  if (!el) return;
  el.textContent = message;
  el.classList.remove("hidden");
}

function hideError() {
  const el = qs("#accessError");
  if (!el) return;
  el.classList.add("hidden");
}

function showSuccess() {
  const el = qs("#accessSuccess");
  if (!el) return;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 2000);
}

function setLoading(isLoading) {
  const btn = qs("#accessSubmitBtn");
  const spinner = qs("#accessBtnSpinner");
  const text = qs("#accessBtnText");
  if (!btn) return;

  if (isLoading) {
    btn.disabled = true;
    spinner?.classList.remove("hidden");
    text?.classList.add("hidden");
  } else {
    btn.disabled = false;
    spinner?.classList.add("hidden");
    text?.classList.remove("hidden");
  }
}

function initTelegramWidget() {
  // Check if bot username is configured
  if (BOT_USERNAME === "YOUR_TELEGRAM_BOT_USERNAME") {
    // Not configured, leave placeholder
    return;
  }

  // Hide placeholder
  const placeholder = qs("#telegramWidgetPlaceholder");
  if (placeholder) placeholder.style.display = "none";

  // Load Telegram Widget script
  const container = qs("#telegramLoginContainer");
  if (!container) return;

  const script = document.createElement("script");
  script.src = "https://telegram.org/js/telegram-widget.js?22";
  script.setAttribute("data-telegram-login", BOT_USERNAME);
  script.setAttribute("data-size", "medium");
  script.setAttribute("data-radius", "12");
  script.setAttribute("data-onauth", "onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  script.async = true;

  container.appendChild(script);
}

// Callback for Telegram Widget
window.onTelegramAuth = function(user) {
  if (!user) return;

  const nameInput = qs("#accessName");
  const telegramInput = qs("#accessTelegram");

  // Prefill fields
  if (user.username && telegramInput) {
    telegramInput.value = normalizeTelegram(user.username);
  }

  if (user.first_name && nameInput) {
    const lastName = user.last_name || "";
    nameInput.value = `${user.first_name} ${lastName}`.trim();
  }

  // Note: We don't auto-check consent, user must do it manually
};

function initAccessModal() {
  // Check if user already has access
  if (checkAccess()) {
    return; // Don't show modal
  }

  // Show modal
  showAccessModal();

  // Initialize Telegram Widget
  initTelegramWidget();

  // Handle form submission
  const accessForm = qs("#accessForm");
  accessForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    hideError();

    const nameInput = qs("#accessName");
    const telegramInput = qs("#accessTelegram");
    const consentInput = qs("#accessConsent");
    const createdAtInput = qs("#accessCreatedAt");
    const userAgentInput = qs("#accessUserAgent");

    const name = nameInput?.value || "";
    const telegram = telegramInput?.value || "";

    // Validation
    if (!name.trim()) {
      showError("Пожалуйста, введите ваше имя");
      return;
    }

    if (!telegram.trim()) {
      showError("Пожалуйста, введите ваш Telegram");
      return;
    }

    if (!consentInput?.checked) {
      showError("Необходимо согласие на обработку данных");
      return;
    }

    // Normalize telegram
    const normalizedTg = normalizeTelegram(telegram);
    if (telegramInput) telegramInput.value = normalizedTg;

    // Fill hidden fields
    const now = new Date().toISOString();
    if (createdAtInput) createdAtInput.value = now;
    if (userAgentInput) userAgentInput.value = navigator.userAgent;

    // Show loading
    setLoading(true);

    // Save to localStorage
    saveAccess(name.trim(), normalizedTg, now);

    // Submit form to iframe
    accessForm.submit();

    // Close modal after short delay
    setTimeout(() => {
      showSuccess();
      setTimeout(() => {
        hideAccessModal();
        setLoading(false);
      }, 1000);
    }, 500);
  });
}
