// ------------------------------
// 0) Мини-база событий (пока в коде)
// Позже можно вынести в events.json и грузить через fetch()
// ------------------------------
const EVENTS = {
  "mac-yerevan": {
    id: "mac-yerevan",
    title: "MAC Yerevan",
    country: "AM",
    locationLine: "📍 Armenia, Yerevan • Май 2026",
    heroImg: "static/MAC_Yerevan.jpeg",
    attendeesLabel: "3.5k",
    entryLabel: "Easy",
    promoLabel: "-15%",
    typeBadge: "MAJOR EVENT",

    // Для add-to-calendar: когда появятся точные даты — заполни ISO
    // startISO: "2026-05-12T10:00:00+04:00",
    // endISO: "2026-05-14T18:00:00+04:00",
    startISO: null,
    endISO: null
  },
  "sigma-eurasia": {
    id: "sigma-eurasia",
    title: "SiGMA Eurasia",
    country: "AE",
    locationLine: "📍 UAE, Dubai • 25–27 Фев 2026",
    heroImg: "static/sigma_dubai.jpg",
    attendeesLabel: "10k+",
    entryLabel: "Standard",
    promoLabel: "—",
    typeBadge: "MAJOR EVENT",
    startISO: "2026-02-25T10:00:00+04:00",
    endISO: "2026-02-27T18:00:00+04:00"
  }
};

// ------------------------------
// 1) Визовые правила (черновик).
// ВАЖНО: это не “юридически точная база”, а заготовка логики.
// Позже можно заменить на events.json + отдельную таблицу.
// ------------------------------
const VISA_RULES = {
  // citizenship -> country -> "no" | "yes" | "unknown"
  RU: {
    AM: "no",
    AE: "no",
    BR: "unknown",
    ES: "yes",
    NL: "yes",
    MT: "yes",
    TH: "unknown",
    US: "yes",
    RU: "no",
    PT: "yes"
  },
  KZ: {
    AM: "no",
    AE: "no",
    BR: "unknown",
    ES: "yes",
    NL: "yes",
    MT: "yes",
    TH: "unknown",
    US: "yes",
    RU: "unknown",
    PT: "yes"
  }
};

let currentCitizenship = "RU";
let currentEventIdInModal = null;

// ------------------------------
// Helpers
// ------------------------------
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

function getVisaStatus(citizenship, countryCode) {
  const row = VISA_RULES[citizenship] || {};
  return row[countryCode] || "unknown";
}

function formatVisaLabel(status, countryCode) {
  if (status === "no") return `No Visa 🇦🇪`.replace("🇦🇪", countryFlag(countryCode));
  if (status === "yes") return `Visa ${countryFlag(countryCode)}`;
  return `Check ${countryFlag(countryCode)}`;
}

function countryFlag(code) {
  // Минимально: можно расширять. Если неизвестно — просто код.
  const FLAGS = {
    AE: "🇦🇪",
    AM: "🇦🇲",
    BR: "🇧🇷",
    ES: "🇪🇸",
    NL: "🇳🇱",
    MT: "🇲🇹",
    TH: "🇹🇭",
    US: "🇺🇸",
    RU: "🇷🇺",
    PT: "🇵🇹"
  };
  return FLAGS[code] || `(${code})`;
}

// ------------------------------
// 2) Модалка
// ------------------------------
function openModal(eventId) {
  const overlay = qs('#modalOverlay');
  const bg = qs('#modalBg');
  const panel = qs('#modalPanel');

  const ev = EVENTS[eventId];
  if (!ev) {
    console.warn("Event not found:", eventId);
    return;
  }

  currentEventIdInModal = eventId;

  // Заполнение данных (минимально, без перестройки дизайна)
  qs('#modalHeroImg').src = ev.heroImg;
  qs('#modalHeroImg').alt = ev.title;

  qs('#modalTitle').textContent = ev.title;
  qs('#modalLocationLine').textContent = ev.locationLine;

  qs('#modalStatAttendees').textContent = ev.attendeesLabel;
  qs('#modalStatEntry').textContent = ev.entryLabel;
  qs('#modalStatPromo').textContent = ev.promoLabel;
  qs('#modalBadgeType').textContent = ev.typeBadge;

  // Visa badge в модалке — зависит от гражданства
  updateModalVisaBadge(ev.country);

  // Показ
  overlay.classList.remove('hidden');
  setTimeout(() => {
    bg.classList.remove('opacity-0');
    panel.classList.remove('translate-x-full');
  }, 10);

  document.body.classList.add('modal-open');
}

function closeModal() {
  const overlay = qs('#modalOverlay');
  const bg = qs('#modalBg');
  const panel = qs('#modalPanel');

  bg.classList.add('opacity-0');
  panel.classList.add('translate-x-full');

  setTimeout(() => { overlay.classList.add('hidden'); }, 300);
  document.body.classList.remove('modal-open');

  currentEventIdInModal = null;
}

function updateModalVisaBadge(countryCode) {
  const status = getVisaStatus(currentCitizenship, countryCode);
  const badge = qs('#modalBadgeVisa');

  // Стили под статус
  badge.classList.remove(
    "bg-green-500/20", "text-green-400", "border-green-500/30",
    "bg-white/10", "text-gray-300", "border-white/20",
    "bg-red-500/20", "text-red-300", "border-red-500/30"
  );

  if (status === "no") {
    badge.textContent = `Без визы (${currentCitizenship})`;
    badge.classList.add("bg-green-500/20", "text-green-400", "border-green-500/30");
  } else if (status === "yes") {
    badge.textContent = `Нужна виза (${currentCitizenship})`;
    badge.classList.add("bg-red-500/20", "text-red-300", "border-red-500/30");
  } else {
    badge.textContent = `Уточнить визовый режим (${currentCitizenship})`;
    badge.classList.add("bg-white/10", "text-gray-300", "border-white/20");
  }
}

// ------------------------------
// 3) Tabs (без inline onclick)
// ------------------------------
function setActiveTab(tabId, btnEl) {
  qsa('.tab-content').forEach(el => el.classList.remove('active'));
  qsa('.tab-btn').forEach(el => el.classList.remove('active'));

  const tab = qs(`#${tabId}`);
  if (tab) tab.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
}

// ------------------------------
// 4) Обновление визовых бейджей на карточках (по data-visa-tag)
// ------------------------------
function updateAllVisaTags() {
  qsa('[data-visa-tag]').forEach(el => {
    const country = el.getAttribute('data-visa-tag');
    const status = getVisaStatus(currentCitizenship, country);

    // Текст
    el.textContent = formatVisaLabel(status, country);

    // Классы (сохраняем твою систему tag-visa / tag-no-visa)
    el.classList.remove('tag-visa', 'tag-no-visa');
    if (status === "no") el.classList.add('tag-no-visa');
    else if (status === "yes") el.classList.add('tag-visa');
    else {
      // unknown: визуально нейтрально, но заметно
      el.classList.add('tag-visa');
    }
  });

  // Если модалка открыта — обновим и там
  if (currentEventIdInModal && EVENTS[currentEventIdInModal]) {
    updateModalVisaBadge(EVENTS[currentEventIdInModal].country);
  }
}

// ------------------------------
// 5) Add to calendar (ICS)
// ------------------------------
function downloadICSForCurrentEvent() {
  if (!currentEventIdInModal) {
    alert("Открой карточку события (модалку), и затем нажми «Добавить в календарь».");
    return;
  }

  const ev = EVENTS[currentEventIdInModal];
  if (!ev || !ev.startISO || !ev.endISO) {
    alert("Для этого события пока нет точных дат (TBD). Когда появятся даты — добавление в календарь заработает.");
    return;
  }

  const ics = buildICS({
    title: ev.title,
    startISO: ev.startISO,
    endISO: ev.endISO,
    location: ev.locationLine.replace(/^📍\s*/, ''),
    description: `Secretroom Calendar 2026 — ${ev.title}`
  });

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ev.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function toICSDate(isoString) {
  // Приводим к UTC "YYYYMMDDTHHMMSSZ"
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function buildICS({ title, startISO, endISO, location, description }) {
  const dtStart = toICSDate(startISO);
  const dtEnd = toICSDate(endISO);
  const dtStamp = toICSDate(new Date().toISOString());
  const uid = `${Math.random().toString(36).slice(2)}@secretroom-calendar`;

  // Минимальный валидный ICS
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Secretroom//iGaming Calendar 2026//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeICSText(title)}`,
    `LOCATION:${escapeICSText(location || "")}`,
    `DESCRIPTION:${escapeICSText(description || "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
    ""
  ].join("\r\n");
}

function escapeICSText(s) {
  return String(s)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

// ------------------------------
// 6) Инициализация
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Клик по карточкам, у которых есть data-event-id
  qsa('[data-event-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-event-id');
      openModal(id);
    });
  });

  // Закрытие модалки
  qs('#modalBg')?.addEventListener('click', closeModal);
  qs('#modalCloseBtn')?.addEventListener('click', closeModal);

  // Esc закрывает модалку
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      const overlay = qs('#modalOverlay');
      if (overlay && !overlay.classList.contains('hidden')) closeModal();
    }
  });

  // Табы
  qsa('[data-tab-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab-btn');
      setActiveTab(tabId, btn);
    });
  });

  // Гражданство
  const citizenshipSelect = qs('#citizenshipSelect');
  if (citizenshipSelect) {
    currentCitizenship = citizenshipSelect.value || "RU";
    citizenshipSelect.addEventListener('change', () => {
      currentCitizenship = citizenshipSelect.value;
      updateAllVisaTags();
    });
  }

  // Add to calendar
  qs('#addToCalendarBtn')?.addEventListener('click', downloadICSForCurrentEvent);

  // Первичный пересчёт визовых бейджей на странице
  updateAllVisaTags();
});
