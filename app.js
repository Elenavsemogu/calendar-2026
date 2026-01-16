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
// Visa rules (MVP)
// ------------------------------
// Важно: это черновой словарь. Позже заменишь на JSON/таблицу/источник.
// Статусы: "no" | "yes" | "unknown"
const VISA_RULES = {
  RU: {
    AE: "no",
    AM: "no",
    BR: "no",
    ES: "yes",
    PT: "yes",
    MT: "yes",
    NL: "yes",
    US: "yes",
    PH: "yes",
    ZA: "yes",
    GE: "no",
    HU: "yes",
    MX: "unknown",
    TH: "no",
    RU: "no"
  },
  KZ: {
    AE: "no",
    AM: "no",
    BR: "unknown",
    ES: "yes",
    PT: "yes",
    MT: "yes",
    NL: "yes",
    US: "yes",
    PH: "unknown",
    ZA: "yes",
    GE: "no",
    HU: "yes",
    MX: "unknown",
    TH: "unknown",
    RU: "no"
  }
};

function getVisaStatus(citizenship, country) {
  const c = (citizenship || "").toUpperCase();
  const cc = (country || "").toUpperCase();
  return VISA_RULES?.[c]?.[cc] || "unknown";
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
    const status = getVisaStatus(currentCitizenship, cc);
    applyVisaTag(tag, status, cc);
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
  "sigma-eurasia": {
    title: "SiGMA Eurasia",
    country: "AE",
    city: "Dubai",
    datesLabel: "25–27 Фев 2026",
    heroImg: "static/sigma_dubai.jpg",
    attendeesLabel: "14k+",
    badgeType: "MAJOR EVENT",
    // Для ICS нужны ISO-датЫ. Если пока нет — оставь null.
    startISO: null,
    endISO: null,
    description: "Affiliate / Marketing focus"
  },
  "mac-yerevan": {
    title: "MAC Yerevan",
    country: "AM",
    city: "Yerevan",
    datesLabel: "Май 2026",
    heroImg: "static/MAC_Yerevan.jpeg",
    attendeesLabel: "3.5k+",
    badgeType: "MAJOR EVENT",
    startISO: null,
    endISO: null,
    description: "CIS community"
  }
};

function populateModal(eventId) {
  const ev = EVENTS[eventId];
  if (!ev) return;

  currentEventId = eventId;

  const hero = qs("#modalHeroImg");
  const title = qs("#modalTitle");
  const loc = qs("#modalLocationLine");
  const statAtt = qs("#modalStatAttendees");
  const badgeType = qs("#modalBadgeType");
  const badgeVisa = qs("#modalBadgeVisa");

  if (hero) hero.src = ev.heroImg || "";
  if (title) title.textContent = ev.title || "";
  if (loc) loc.textContent = `📍 ${ev.country}, ${ev.city} • ${ev.datesLabel}`;
  if (statAtt) statAtt.textContent = ev.attendeesLabel || "";

  if (badgeType) badgeType.textContent = ev.badgeType || "EVENT";

  if (badgeVisa) {
    const status = getVisaStatus(currentCitizenship, ev.country);
    if (status === "no") {
      badgeVisa.textContent = "Без визы";
      badgeVisa.className = "bg-green-500/20 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/30";
    } else if (status === "yes") {
      badgeVisa.textContent = "Нужна виза";
      badgeVisa.className = "bg-red-500/20 text-red-300 text-[10px] font-bold px-3 py-1 rounded-full border border-red-500/30";
    } else {
      badgeVisa.textContent = "Уточнить визу";
      badgeVisa.className = "bg-yellow-500/20 text-yellow-300 text-[10px] font-bold px-3 py-1 rounded-full border border-yellow-500/30";
    }
  }

  // таб по умолчанию
  setActiveTab("guide");
}

// ------------------------------
// ICS generation (минимальная версия)
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

function downloadICSForCurrentEvent() {
  if (!currentEventId || !EVENTS[currentEventId]) {
    alert("Открой событие, и добавляй его в календарь из модалки.");
    return;
  }

  const ev = EVENTS[currentEventId];

  if (!ev.startISO || !ev.endISO) {
    alert("Пока нет точных дат/времени (TBD). Как только появятся — добавим .ics.");
    return;
  }

  const dtStart = toICSDateTime(ev.startISO);
  const dtEnd = toICSDateTime(ev.endISO);

  if (!dtStart || !dtEnd) {
    alert("Ошибка в датах события. Проверь startISO/endISO.");
    return;
  }

  const uid = `${currentEventId}@secretroom-calendar`;
  const now = toICSDateTime(new Date().toISOString());

  const ics =
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Secretroom//iGaming Calendar//RU
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${escapeICS(ev.title)}
LOCATION:${escapeICS(`${ev.city}, ${ev.country}`)}
DESCRIPTION:${escapeICS(ev.description || "")}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentEventId}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
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
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Tabs
  qsa("[data-tab-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab-btn");
      if (tab) setActiveTab(tab);
    });
  });

  // Add to calendar button (header)
  qs("#addToCalendarBtn")?.addEventListener("click", downloadICSForCurrentEvent);
});
