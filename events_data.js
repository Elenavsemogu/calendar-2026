// Полный объект EVENTS для всех 14 конференций
const EVENTS_FULL = {
  "igb_live_2026_london": {
    title: "iGB L!VE", description: "Крупнейшая iGaming выставка Европы",
    city: "London", country: "GB", countryName: "Великобритания",
    dates: "1-2 июля 2026", attendees: "15,000+", promo: "-15%",
    weather: { temp: "18-22°C", description: "Тёплое лето, возможны дожди" },
    heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
    startISO: "2026-07-01T09:00:00Z", endISO: "2026-07-02T18:00:00Z",
    restaurants: [
      { name: "Plateau Canary Wharf", vibe: "посидеть", avgCheck: "$100-300", description: "Французский ресторан в Canary Wharf", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Boisdale Canary Wharf", vibe: "громко", avgCheck: "$100-300", description: "Шотландский ресторан с живым джазом", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Electric Shuffle", vibe: "потанцевать", avgCheck: "$50-100", description: "Бар с активной атмосферой и коктейлями", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "The Oiler Bar", vibe: "посидеть", avgCheck: "$60-120", description: "Коктейльный бар в Docklands", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Hawksmoor", vibe: "тихо", avgCheck: "$120-250", description: "Премиум стейкхаус", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "3-5 марта 2026", attendees: "15,000+", promo: "-15%",
    weather: { temp: "28-32°C", description: "Жарко и влажно, сезон дождей заканчивается" },
    heroImage: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80",
    startISO: "2026-03-03T09:00:00Z", endISO: "2026-03-05T18:00:00Z",
    restaurants: [
      { name: "Shiso", vibe: "тихо", avgCheck: "$80-200", description: "Японский ресторан высокого класса", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Zaza Bistro", vibe: "посидеть", avgCheck: "$60-150", description: "Bistro с органическими блюдами в Ipanema", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Giuseppe Grill", vibe: "громко", avgCheck: "$100-250", description: "Премиальный стейкхаус", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Braseiro da Gávea", vibe: "громко", avgCheck: "$40-80", description: "Традиционная бразильская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Confeitaria Colombo", vibe: "посидеть", avgCheck: "$30-60", description: "Историческое кафе 1894 года", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "29 сент - 1 окт 2026", attendees: "25,000+", promo: "-15%",
    weather: { temp: "20-25°C", description: "Тёплая осень, солнечно" },
    heroImage: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
    startISO: "2026-09-29T09:00:00Z", endISO: "2026-10-01T18:00:00Z",
    restaurants: [
      { name: "Monte Mar Lisboa", vibe: "посидеть", avgCheck: "$80-180", description: "Морепродукты с видом на Тежу", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "JNcQUOI Avenida", vibe: "громко", avgCheck: "$100-250", description: "Элитный ресторан португальской кухни", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Zambeze", vibe: "потанцевать", avgCheck: "$60-140", description: "Панорамный вид, терраса 300м²", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Doca Peixe", vibe: "посидеть", avgCheck: "$50-120", description: "Лучший рыбный ресторан, вид на марину", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Belcanto", vibe: "тихо", avgCheck: "$180-400", description: "2 звезды Мишлен от José Avillez", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "4-5 марта 2026", attendees: "5,000+", promo: null,
    weather: { temp: "24-28°C", description: "Приятно тепло, низкая влажность" },
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    startISO: "2026-03-04T09:00:00Z", endISO: "2026-03-05T18:00:00Z",
    restaurants: [
      { name: "Zuma Dubai", vibe: "громко", avgCheck: "$150-350", description: "Японский ресторан мирового класса", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "La Petite Maison", vibe: "тихо", avgCheck: "$120-280", description: "Французская кухня Ривьеры", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Nobu Dubai", vibe: "тихо", avgCheck: "$150-400", description: "Японо-перуанский премиум", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Coya Dubai", vibe: "потанцевать", avgCheck: "$100-250", description: "Перуанская кухня, живая музыка", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Tresind Studio", vibe: "тихо", avgCheck: "$200-400", description: "Индийская haute cuisine, 1 звезда Мишлен", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "25-27 мая 2026", attendees: "2,500+", promo: null,
    weather: { temp: "22-28°C", description: "Тёплая весна, солнечно" },
    heroImage: "https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?w=800&q=80",
    startISO: "2026-05-25T09:00:00Z", endISO: "2026-05-27T18:00:00Z",
    restaurants: [
      { name: "Dolmama", vibe: "посидеть", avgCheck: "$40-80", description: "Традиционная армянская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "The Club", vibe: "громко", avgCheck: "$60-120", description: "Живая музыка, популярен у экспатов", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Sherep", vibe: "посидеть", avgCheck: "$50-100", description: "Авторская армянская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Pandok Yerevan", vibe: "громко", avgCheck: "$30-70", description: "Традиционный ресторан с шоу", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Lavash", vibe: "посидеть", avgCheck: "$40-90", description: "Армянская кухня, вид на Арарат", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "25-27 июня 2026", attendees: "2,000+", promo: null,
    weather: { temp: "26-32°C", description: "Жаркое лето, сухо" },
    heroImage: "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80",
    startISO: "2026-06-26T09:00:00Z", endISO: "2026-06-27T18:00:00Z",
    restaurants: [
      { name: "Funicular Complex", vibe: "потанцевать", avgCheck: "$50-120", description: "Панорамный вид на город", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Barbarestan", vibe: "тихо", avgCheck: "$60-140", description: "Исторические рецепты XIX века", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Café Stamba", vibe: "посидеть", avgCheck: "$40-90", description: "Модное место в дизайн-отеле", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Keto and Kote", vibe: "громко", avgCheck: "$30-70", description: "Современная грузинская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Shavi Lomi", vibe: "громко", avgCheck: "$40-90", description: "Инстаграмное место, авторская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "25-26 апреля 2026", attendees: "4,000+", promo: "-15%",
    weather: { temp: "16-22°C", description: "Тёплая весна, возможны дожди" },
    heroImage: "https://images.unsplash.com/photo-1578763363228-6e8428de69b2?w=800&q=80",
    startISO: "2026-04-25T09:00:00Z", endISO: "2026-04-26T18:00:00Z",
    restaurants: [
      { name: "Хмели & Сунели", vibe: "громко", avgCheck: "$40-100", description: "Грузинский ресторан", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Sanremo", vibe: "посидеть", avgCheck: "$80-200", description: "Итальянская кухня, вид на море", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "White Rabbit Sochi", vibe: "тихо", avgCheck: "$100-250", description: "Авторская русская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Krasnaya Polyana", vibe: "посидеть", avgCheck: "$60-140", description: "Ресторан в горах", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Barashka", vibe: "громко", avgCheck: "$50-120", description: "Кавказская кухня, вид на море", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "29 сент - 1 окт 2026", attendees: "25,000+", promo: null,
    weather: { temp: "22-32°C", description: "Жарко днём, прохладно ночью" },
    heroImage: "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=800&q=80",
    startISO: "2026-09-29T09:00:00Z", endISO: "2026-10-01T18:00:00Z",
    restaurants: [
      { name: "TAO Asian Bistro", vibe: "громко", avgCheck: "$80-200", description: "Легендарный азиатский в Venetian", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "CUT by Wolfgang Puck", vibe: "тихо", avgCheck: "$120-300", description: "Премиум стейкхаус", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Carnevino", vibe: "посидеть", avgCheck: "$100-250", description: "Итальянский стейкхаус в Palazzo", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Buddakan", vibe: "потанцевать", avgCheck: "$70-150", description: "Азиатский фьюжн, впечатляющий интерьер", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Bazaar Meat", vibe: "громко", avgCheck: "$100-280", description: "Стейкхаус от José Andrés", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "12-14 мая 2026", attendees: "5,000+", promo: "-10%",
    weather: { temp: "28-33°C", description: "Жарко и влажно" },
    heroImage: "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80",
    startISO: "2026-05-12T09:00:00Z", endISO: "2026-05-14T18:00:00Z",
    restaurants: [
      { name: "Steak 954", vibe: "тихо", avgCheck: "$100-250", description: "Премиум стейкхаус в W Hotel, вид на океан", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Timpano", vibe: "посидеть", avgCheck: "$70-150", description: "Итальянский с приватными комнатами", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Shooters Waterfront", vibe: "громко", avgCheck: "$50-100", description: "Ресторан на воде, живая музыка", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Louie Bossi's", vibe: "громко", avgCheck: "$60-140", description: "Итальянский с большой террасой", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Mastro's Ocean Club", vibe: "тихо", avgCheck: "$100-280", description: "Премиум стейки и морепродукты", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "31 марта - 1 апреля 2026", attendees: "2,000+", promo: null,
    weather: { temp: "8-14°C", description: "Прохладная весна" },
    heroImage: "https://images.unsplash.com/photo-1519197924294-4ba991a11128?w=800&q=80",
    startISO: "2026-03-31T09:00:00Z", endISO: "2026-04-01T18:00:00Z",
    restaurants: [
      { name: "Belvedere", vibe: "тихо", avgCheck: "$80-180", description: "В оранжерее парка Łazienki", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Warszawa Wschodnia", vibe: "громко", avgCheck: "$50-120", description: "Модный район Praga", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Stary Dom", vibe: "посидеть", avgCheck: "$40-90", description: "Традиционная польская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Atelier Amaro", vibe: "тихо", avgCheck: "$150-350", description: "Первый Мишлен в Польше", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "U Kucharzy", vibe: "посидеть", avgCheck: "$60-140", description: "Открытая кухня, польская классика", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "22-24 июля 2026", attendees: "1,500+", promo: null,
    weather: { temp: "28-32°C", description: "Жаркое средиземноморское лето" },
    heroImage: "https://images.unsplash.com/photo-1581889470536-467bdbe30cd0?w=800&q=80",
    startISO: "2026-07-22T09:00:00Z", endISO: "2026-07-24T18:00:00Z",
    restaurants: [
      { name: "Pier One", vibe: "потанцевать", avgCheck: "$60-140", description: "На пляже, закаты", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Meze Taverna", vibe: "громко", avgCheck: "$40-80", description: "Традиционное мезе 20+ блюд", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Epsilon", vibe: "посидеть", avgCheck: "$50-120", description: "Современный европейский", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Kipriakon", vibe: "посидеть", avgCheck: "$40-90", description: "Кипрская таверна, мезе 25 блюд", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Sailor's Rest", vibe: "потанцевать", avgCheck: "$60-140", description: "Лаунж на пляже", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "18-20 мая 2026", attendees: "500+", promo: null,
    weather: { temp: "20-26°C", description: "Тёплая весна, солнечно" },
    heroImage: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
    startISO: "2026-05-18T09:00:00Z", endISO: "2026-05-20T18:00:00Z",
    restaurants: [
      { name: "Sobrino de Botín", vibe: "посидеть", avgCheck: "$60-140", description: "Старейший ресторан мира (с 1725)", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Streetxo", vibe: "громко", avgCheck: "$50-100", description: "Азиатский стритфуд от DiverXO", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Lateral", vibe: "посидеть", avgCheck: "$40-90", description: "Современная испанская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Casa Lucio", vibe: "посидеть", avgCheck: "$50-120", description: "Легендарные huevos rotos", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Ramón Freixa Madrid", vibe: "тихо", avgCheck: "$150-350", description: "2 звезды Мишлен", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "23-25 ноября 2026", attendees: "500+", promo: null,
    weather: { temp: "26-30°C", description: "Тепло, конец сезона дождей" },
    heroImage: "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800&q=80",
    startISO: "2026-11-23T09:00:00Z", endISO: "2026-11-25T18:00:00Z",
    restaurants: [
      { name: "Harry's Prime Steakhouse", vibe: "тихо", avgCheck: "$100-250", description: "Премиальный стейкхаус", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Puerto Madero", vibe: "посидеть", avgCheck: "$70-160", description: "Морепродукты с видом на лагуну", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Lorenzillo's", vibe: "громко", avgCheck: "$60-140", description: "Легендарные морепродукты", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "La Habichuela Sunset", vibe: "посидеть", avgCheck: "$80-180", description: "Мексиканская кухня, сад с пальмами", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Tacos Rigo", vibe: "громко", avgCheck: "$15-40", description: "Аутентичные тако, лучшая цена", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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
    dates: "TBA 2026", attendees: "1,500+", promo: null,
    weather: { temp: "—", description: "Даты уточняются" },
    heroImage: "https://images.unsplash.com/photo-1561542320-9a18cd340469?w=800&q=80",
    startISO: "2026-06-01T09:00:00Z", endISO: "2026-06-02T18:00:00Z",
    restaurants: [
      { name: "Kanapa", vibe: "посидеть", avgCheck: "$40-100", description: "Современная украинская кухня", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Beef", vibe: "тихо", avgCheck: "$50-120", description: "Стейкхаус премиум класса", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Очень Хорошо", vibe: "громко", avgCheck: "$30-70", description: "Модный ресторан, коктейли", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "100 років тому вперед", vibe: "посидеть", avgCheck: "$35-80", description: "Ретро-атмосфера", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" },
      { name: "Ostannya Barykada", vibe: "громко", avgCheck: "$40-90", description: "Культовый бар на Майдане", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=200&auto=format&fit=crop" }
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

// Копировать этот объект в EVENTS в app.js
