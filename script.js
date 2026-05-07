/* ===== FIREBASE CONFIG ===== */
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae",
  storageBucket: "tic-tac-toe-a19ae.firebasestorage.app",
  messagingSenderId: "353669749306",
  appId: "1:353669749306:web:158045cfc536ed324df303"
};

/* ===== CONSTANTS ===== */
const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6]              // diagonals
];

const AI_MOVE_DELAY_MS = 420; // brief pause so AI feels more natural
const BATTLE_SEARCH_TIMEOUT_MS = 3000; // fall back to bot after this many ms
const QUEUE_ENTRY_MAX_AGE_MS = 30000; // queue entries older than 30s are stale
const PROFILE_CACHE_MS = 60000; // cache user profile for 1 minute

// Referral system configuration
const REFERRAL_BOT_USERNAME = 'Tictocgame22_bot';
const REFERRAL_COIN_TIERS = [50, 70, 100]; // coins for 1st, 2nd, 3rd+ referral
const DEFAULT_WALLPAPER_BACKGROUND = 'linear-gradient(135deg, #1e40af, #2563eb)';
// Backend endpoint that returns { invoiceUrl } for Telegram Stars purchases.
// Configure it globally as window.__TG_STARS_INVOICE_ENDPOINT__ before loading script.js.
const TELEGRAM_STARS_INVOICE_ENDPOINT = window.__TG_STARS_INVOICE_ENDPOINT__ || '';
const versionedAssetUrl = window.versionedAsset || function(url) {
  if (!url) return url;
  const fallbackVersion = String(window.__APP_ASSET_VERSION__ || '10');
  return url + (url.includes('?') ? '&' : '?') + 'v=' + fallbackVersion;
};
const wallpaperAsset = filename => versionedAssetUrl(`assets/${filename}`);

const AVATAR_COLORS = [
  '#7c3aed', '#4f46e5', '#818cf8', '#6d28d9',
  '#5b21b6', '#4338ca', '#3730a3', '#312e81'
];

const BOT_NAMES = [
  'Alex K.', 'Maria S.', 'Chen W.', 'Sofia L.', 'Lucas M.',
  'Aisha O.', 'Ivan P.', 'Yuki T.', 'Emma R.', 'Omar H.',
  'Nina B.', 'Carlos V.', 'Priya N.', 'Jake D.', 'Zoe F.'
];

const BOT_COUNTRIES = [
  'US', 'GB', 'DE', 'FR', 'JP', 'BR', 'IN', 'RU',
  'ES', 'IT', 'KR', 'AU', 'CA', 'MX', 'TR', 'PL', 'UA', 'NL'
];

const WALLPAPERS = [
  {
    id: 'none',
    name: 'Simple Blue',
    priceType: 'free',
    price: 0,
    thumbnail: null,
    fullImage: null
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-galaxy.jpg'),
    fullImage: wallpaperAsset('wp-galaxy.jpg')
  },
  {
    id: 'sakura',
    name: 'Sakura',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-sakura.jpg'),
    fullImage: wallpaperAsset('wp-sakura.jpg')
  },
  {
    id: 'ocean',
    name: 'Ocean',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-ocean.jpg'),
    fullImage: wallpaperAsset('wp-ocean.jpg')
  },
  {
    id: 'forest',
    name: 'Forest',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-forest.jpg'),
    fullImage: wallpaperAsset('wp-forest.jpg')
  },
  {
    id: 'fire',
    name: 'Fire',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-fire.jpg'),
    fullImage: wallpaperAsset('wp-fire.jpg')
  },
  {
    id: 'aurora',
    name: 'Aurora',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-aurora.jpg'),
    fullImage: wallpaperAsset('wp-aurora.jpg')
  },
  {
    id: 'samurai',
    name: 'Samurai',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-samurai.jpg'),
    fullImage: wallpaperAsset('wp-samurai.jpg')
  },
  {
    id: 'moonlight',
    name: 'Moonlight',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-moonlight.jpg'),
    fullImage: wallpaperAsset('wp-moonlight.jpg')
  },
  {
    id: 'meadow',
    name: 'Meadow',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-meadow.jpg'),
    fullImage: wallpaperAsset('wp-meadow.jpg')
  },
  {
    id: 'castle',
    name: 'Dark Castle',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-castle.jpg'),
    fullImage: wallpaperAsset('wp-castle.jpg')
  },
  {
    id: 'neon',
    name: 'Neon City',
    priceType: 'stars',
    price: 35,
    thumbnail: wallpaperAsset('wp-neon.jpg'),
    fullImage: wallpaperAsset('wp-neon.jpg')
  }
];

/* ===== LISTENER REGISTRY ===== */
const activeListeners = {};

function attachListener(key, ref, event, fn) {
  if (activeListeners[key]) {
    activeListeners[key].ref.off(
      activeListeners[key].event,
      activeListeners[key].fn
    );
    delete activeListeners[key];
  }
  ref.on(event, fn);
  activeListeners[key] = { ref, event, fn };
}

function detachListener(key) {
  if (!activeListeners[key]) return;
  activeListeners[key].ref.off(
    activeListeners[key].event,
    activeListeners[key].fn
  );
  delete activeListeners[key];
}

function detachAllListeners() {
  Object.keys(activeListeners).forEach(key => {
    detachListener(key);
  });
}

/* ===== USER PROFILE CACHE ===== */
let cachedUserProfile = null;
let cachedUserProfileTime = 0;
let cachedUserProfileUid = null;

async function getUserProfile(uid) {
  const now = Date.now();
  if (
    cachedUserProfile &&
    cachedUserProfileUid === uid &&
    now - cachedUserProfileTime < PROFILE_CACHE_MS
  ) {
    return cachedUserProfile;
  }
  const snap = await db.ref('users/' + uid).once('value');
  cachedUserProfile = snap.val() || {};
  cachedUserProfileTime = now;
  cachedUserProfileUid = uid;
  return cachedUserProfile;
}

function invalidateProfileCache() {
  cachedUserProfile = null;
  cachedUserProfileTime = 0;
  cachedUserProfileUid = null;
}

/* ===== STATE ===== */
let db = null;

let currentUser = {
  id: null,
  name: 'Player',
  xp: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  games: 0,
  xpBoostExpiry: 0,
  country: ''
};

// Game state
let gameMode    = null; // 'ai' | 'online'
let aiDifficulty = 'medium';
let board        = Array(9).fill('');
let currentTurn  = 'X';
let gameOver     = false;
let playerMark   = 'X';  // current user's mark in online
let playerXWins  = 0;
let playerOWins  = 0;
let xpAwarded    = false;
let roomFirstTurn = 'X'; // tracks who starts each round in online mode

// Firebase refs
let roomId         = null;
let roomListenerRef = null;
let chatListenerRef = null;
let queueRef        = null;

// Battle state
let battleTimer    = null;
let battleCancelled = false;
let dotsInterval   = null;
let inBattleQueue  = false; // true while waiting in Firebase queue

// Settings state
let settingsStatsRef = null;

// Wallpaper state
let currentWallpaper = 'none';
// Populated from Firebase after login; never persisted in localStorage
let purchasedWallpapers = [];
let previewingWallpaper = null;

// Language
const SUPPORTED_LANGS = ['en', 'ru', 'es', 'fr', 'de', 'ar', 'zh'];
let lang = 'en';
// Migrate old 'language' key to 'lang'
if (!localStorage.getItem('lang') && localStorage.getItem('language')) {
  try {
    localStorage.setItem('lang', localStorage.getItem('language'));
    localStorage.removeItem('language');
  } catch (e) {}
}

// Telegram photo URL (in-memory only, not persisted)
let tgPhotoUrl = null;

// Online: waiting for second player to join
let waitingForOpponent = false;

// Battle bot name (set when playing against a named bot, null for normal AI)
let battleBotName = null;

// Coin / referral state
let userCoins = 0;
let userReferralCount = 0;

/* ===== TRANSLATIONS ===== */
const TRANSLATIONS = {
  en: {
    home: 'Home', battle: 'Battle', leaderboard: 'Leaderboard', settings: 'Settings',
    playAI: 'Play with Computer', playFriends: 'Play with Friends',
    yourTurn: 'Your Turn', aiThinking: 'Computer is thinking...',
    waitingFriend: 'Waiting for friend...', opponentTurn: "Opponent's Turn",
    cancelBattle: 'Cancel', cancelWait: 'Cancel',
    searchingOpponent: 'Searching for opponent...',
    yourName: 'Your Name', language: 'Language', backToHome: 'Back to Home',
    leaderboardTitle: 'Leaderboard', msgPlaceholder: 'Message...',
    shareLink: 'Share Link', send: 'Send', nameInputPlaceholder: 'Enter your name'
  },
  ru: {
    home: 'Главная', battle: 'Битва', leaderboard: 'Рейтинг', settings: 'Настройки',
    playAI: 'Против компьютера', playFriends: 'Играть с другом',
    yourTurn: 'Ваш ход', aiThinking: 'Компьютер думает...',
    waitingFriend: 'Ожидание друга...', opponentTurn: 'Ход соперника',
    cancelBattle: 'Отмена', cancelWait: 'Отмена',
    searchingOpponent: 'Поиск соперника...',
    yourName: 'Ваше имя', language: 'Язык', backToHome: 'На главную',
    leaderboardTitle: 'Рейтинг', msgPlaceholder: 'Сообщение...',
    shareLink: 'Поделиться', send: 'Отправить', nameInputPlaceholder: 'Введите имя'
  },
  es: {
    home: 'Inicio', battle: 'Batalla', leaderboard: 'Clasificación', settings: 'Ajustes',
    playAI: 'Jugar con la IA', playFriends: 'Jugar con amigos',
    yourTurn: 'Tu turno', aiThinking: 'La computadora está pensando...',
    waitingFriend: 'Esperando al amigo...', opponentTurn: 'Turno del rival',
    cancelBattle: 'Cancelar', cancelWait: 'Cancelar',
    searchingOpponent: 'Buscando rival...',
    yourName: 'Tu nombre', language: 'Idioma', backToHome: 'Volver al inicio',
    leaderboardTitle: 'Clasificación', msgPlaceholder: 'Mensaje...',
    shareLink: 'Compartir enlace', send: 'Enviar', nameInputPlaceholder: 'Ingresa tu nombre'
  },
  fr: {
    home: 'Accueil', battle: 'Bataille', leaderboard: 'Classement', settings: 'Paramètres',
    playAI: "Jouer contre l'IA", playFriends: 'Jouer avec des amis',
    yourTurn: 'Votre tour', aiThinking: "L'ordinateur réfléchit...",
    waitingFriend: "En attente de l'ami...", opponentTurn: "Tour de l'adversaire",
    cancelBattle: 'Annuler', cancelWait: 'Annuler',
    searchingOpponent: "Recherche d'adversaire...",
    yourName: 'Votre nom', language: 'Langue', backToHome: "Retour à l'accueil",
    leaderboardTitle: 'Classement', msgPlaceholder: 'Message...',
    shareLink: 'Partager le lien', send: 'Envoyer', nameInputPlaceholder: 'Entrez votre nom'
  },
  de: {
    home: 'Startseite', battle: 'Kampf', leaderboard: 'Rangliste', settings: 'Einstellungen',
    playAI: 'Gegen KI spielen', playFriends: 'Mit Freunden spielen',
    yourTurn: 'Dein Zug', aiThinking: 'Computer denkt...',
    waitingFriend: 'Warte auf Freund...', opponentTurn: 'Zug des Gegners',
    cancelBattle: 'Abbrechen', cancelWait: 'Abbrechen',
    searchingOpponent: 'Suche Gegner...',
    yourName: 'Dein Name', language: 'Sprache', backToHome: 'Zur Startseite',
    leaderboardTitle: 'Rangliste', msgPlaceholder: 'Nachricht...',
    shareLink: 'Link teilen', send: 'Senden', nameInputPlaceholder: 'Namen eingeben'
  },
  ar: {
    home: 'الرئيسية', battle: 'معركة', leaderboard: 'المتصدرون', settings: 'الإعدادات',
    playAI: 'العب مع الكمبيوتر', playFriends: 'العب مع أصدقاء',
    yourTurn: 'دورك', aiThinking: 'الكمبيوتر يفكر...',
    waitingFriend: 'بانتظار الصديق...', opponentTurn: 'دور الخصم',
    cancelBattle: 'إلغاء', cancelWait: 'إلغاء',
    searchingOpponent: 'البحث عن خصم...',
    yourName: 'اسمك', language: 'اللغة', backToHome: 'العودة للرئيسية',
    leaderboardTitle: 'المتصدرون', msgPlaceholder: 'رسالة...',
    shareLink: 'مشاركة الرابط', send: 'إرسال', nameInputPlaceholder: 'أدخل اسمك'
  },
  zh: {
    home: '首页', battle: '对战', leaderboard: '排行榜', settings: '设置',
    playAI: '与电脑对战', playFriends: '与朋友对战',
    yourTurn: '你的回合', aiThinking: '电脑思考中...',
    waitingFriend: '等待朋友...', opponentTurn: '对手回合',
    cancelBattle: '取消', cancelWait: '取消',
    searchingOpponent: '正在寻找对手...',
    yourName: '您的名字', language: '语言', backToHome: '返回首页',
    leaderboardTitle: '排行榜', msgPlaceholder: '消息...',
    shareLink: '分享链接', send: '发送', nameInputPlaceholder: '输入您的名字'
  }
};

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', async () => {
  initTelegram();
  initFirebase();
  setupEventListeners();
  await identifyUser();
  await loadUserLanguage();
  renderRulesDefault(); // render default rules immediately
  checkUrlParams();
  applyTranslations();
  loadSavedWallpaper();
  showScreen('home');
  handleReferralOnStart();
});

function initTelegram() {
  try {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser?.photo_url) {
        tgPhotoUrl = tgUser.photo_url;
      }
    }
  } catch (e) {
    console.warn('Telegram init:', e);
  }
}

function initFirebase() {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.database();
  } catch (e) {
    console.warn('Firebase init failed — AI-only mode:', e);
    db = null;
  }
}

/* ===== TRANSLATIONS ===== */
function applyTranslations() {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Nav labels (all instances in every screen)
  document.querySelectorAll('.nav-btn[data-screen="home"] .nav-label').forEach(el => { el.textContent = t.home; });
  document.querySelectorAll('.nav-btn[data-screen="battle"] .nav-label').forEach(el => { el.textContent = t.battle; });
  document.querySelectorAll('.nav-btn[data-screen="leaderboard"] .nav-label').forEach(el => { el.textContent = t.leaderboard; });
  document.querySelectorAll('.nav-btn[data-screen="settings"] .nav-label').forEach(el => { el.textContent = t.settings; });

  // Home screen buttons
  const btnPlayAI = document.getElementById('btn-play-ai');
  if (btnPlayAI) btnPlayAI.textContent = t.playAI;
  const btnPlayOnline = document.getElementById('btn-play-online');
  if (btnPlayOnline) btnPlayOnline.textContent = t.playFriends;

  // Battle modal
  const battleSubtitle = document.querySelector('.battle-subtitle');
  if (battleSubtitle) battleSubtitle.textContent = t.searchingOpponent;
  const cancelBattleBtn = document.getElementById('btn-cancel-battle');
  if (cancelBattleBtn) cancelBattleBtn.textContent = t.cancelBattle;

  // Waiting screen cancel
  const cancelWaitBtn = document.getElementById('btn-cancel-wait');
  if (cancelWaitBtn) cancelWaitBtn.textContent = t.cancelWait;

  // Settings modal labels
  const yourNameLabel = document.querySelector('label[for="settings-name-input"]');
  if (yourNameLabel) yourNameLabel.textContent = t.yourName;
  const langLabel = document.querySelector('label[for="settings-language"]');
  if (langLabel) langLabel.textContent = t.language;
  const settingsHomeBtn = document.getElementById('btn-settings-home');
  if (settingsHomeBtn) settingsHomeBtn.textContent = t.backToHome;

  // Input placeholders
  const nameInput = document.getElementById('settings-name-input');
  if (nameInput) nameInput.placeholder = t.nameInputPlaceholder;
  const chatInput = document.getElementById('chat-input');
  if (chatInput) chatInput.placeholder = t.msgPlaceholder;

  // Game screen buttons
  const inviteBtn = document.getElementById('btn-invite');
  if (inviteBtn) inviteBtn.textContent = t.shareLink;
  const sendBtn = document.getElementById('btn-send-chat');
  if (sendBtn) sendBtn.textContent = t.send;
}

/* ===== LANGUAGE HELPERS ===== */
function normalizeLangCode(code) {
  if (!code) return null;
  const lower = String(code).toLowerCase().split('-')[0].split('_')[0];
  if (SUPPORTED_LANGS.includes(lower)) return lower;
  return null;
}

function ensureNormalizedUserId() {
  return currentUser.id || null;
}

function saveLanguage(langCode) {
  // Save to localStorage (device-specific)
  try {
    localStorage.setItem("lang", langCode);
  } catch(e) {}

  // Save to this user's own Firebase document only
  const uid = ensureNormalizedUserId();
  if (uid && db) {
    db.ref("users/" + uid + "/language")
      .set(langCode)
      .catch(e => console.error("saveLanguage Firebase error:", e));
  }
}

function setLanguage(langCode, persist = true) {
  const normalized = normalizeLangCode(langCode) || "en";
  lang = normalized;
  document.documentElement.lang = normalized;
  document.documentElement.dir = normalized === "ar" ? "rtl" : "ltr";
  applyTranslations();
  if (persist) {
    saveLanguage(normalized);
  }
}

async function loadUserLanguage() {
  // Priority 1: localStorage (instant, device-local)
  try {
    const stored = localStorage.getItem("lang");
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      setLanguage(stored, false);
      return;
    }
  } catch(e) {}

  // Priority 2: user's own Firebase document
  const uid = ensureNormalizedUserId();
  if (uid && db) {
    try {
      const snap = await db
        .ref("users/" + uid + "/language")
        .once("value");
      const fbLang = snap.val();
      if (fbLang && SUPPORTED_LANGS.includes(fbLang)) {
        setLanguage(fbLang, false);
        try {
          localStorage.setItem("lang", fbLang);
        } catch(e) {}
        return;
      }
    } catch(e) {
      console.error("loadUserLanguage Firebase:", e);
    }
  }

  // Priority 3: Telegram user language code
  const tgLang = normalizeLangCode(
    window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code
  );
  if (tgLang) {
    setLanguage(tgLang, false);
    return;
  }

  // Priority 4: default to English
  setLanguage("en", false);
}

/* ===== SHARE GAME LINK ===== */
function shareGameLink(rId) {
  const url = window.location.origin + window.location.pathname + '#room=' + rId;
  const text = 'Join my Tic Tac Toe game! Can you beat me? 🎮';
  const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);

  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, '_blank');
  }
}

/* ===== DEVELOPER TELEGRAM ===== */
function openDeveloperTelegram() {
  const url = 'https://t.me/alokmaurya22';
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
}

/* ===== COUNTRY FLAG (name or code → emoji) ===== */
function getCountryFlag(countryValue) {
  if (!countryValue) return '';

  const nameToCode = {
    'India': 'IN', 'United States': 'US', 'Russia': 'RU', 'Brazil': 'BR',
    'Germany': 'DE', 'France': 'FR', 'Japan': 'JP', 'South Korea': 'KR',
    'United Kingdom': 'GB', 'Australia': 'AU', 'Canada': 'CA', 'Mexico': 'MX',
    'Italy': 'IT', 'Spain': 'ES', 'Netherlands': 'NL', 'Turkey': 'TR',
    'Argentina': 'AR', 'Poland': 'PL', 'Sweden': 'SE', 'Nigeria': 'NG',
    'Indonesia': 'ID', 'Pakistan': 'PK', 'Bangladesh': 'BD', 'Philippines': 'PH',
    'Vietnam': 'VN', 'Thailand': 'TH', 'Egypt': 'EG', 'Iran': 'IR',
    'Saudi Arabia': 'SA', 'United Arab Emirates': 'AE', 'China': 'CN',
    'Ukraine': 'UA', 'Romania': 'RO', 'Czech Republic': 'CZ',
    'Portugal': 'PT', 'Greece': 'GR'
  };

  const code = nameToCode[countryValue] || countryValue.toUpperCase().slice(0, 2);
  if (code.length < 2) return '';

  // Convert A-Z to regional indicator symbols (🇦-🇿):
  // Unicode regional indicator A = 0x1F1E6 = 127462, ASCII 'A' = 65, offset = 127397
  return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

/* ===== USER IDENTITY ===== */
async function identifyUser() {
  try {
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    if (tgUser?.id) {
      currentUser.id = String(tgUser.id);
      const parts = [tgUser.first_name];
      if (tgUser.last_name) parts.push(tgUser.last_name);
      currentUser.name = parts.join(' ').trim() || tgUser.username || 'Player';
    } else {
      let fid = localStorage.getItem('fallbackId');
      if (!fid) {
        fid = 'u_' + Math.random().toString(36).slice(2, 11);
        localStorage.setItem('fallbackId', fid);
      }
      currentUser.id = fid;
      const storedName = localStorage.getItem('fallbackName');
      currentUser.name = storedName || ('Player ' + fid.slice(-4));
    }

    updateHomeUI();

    if (!db) return;

    // Load existing user data
    const snap = await db.ref('users/' + currentUser.id).once('value');
    if (snap.exists()) {
      const d = snap.val();
      currentUser.xp             = d.xp             || 0;
      currentUser.wins           = d.wins            || 0;
      currentUser.losses         = d.losses          || 0;
      currentUser.draws          = d.draws           || 0;
      currentUser.games          = d.games           || 0;
      currentUser.xpBoostExpiry  = d.xpBoostExpiry   || 0;
      currentUser.country        = d.country         || '';
      userCoins                  = d.coins           || 0;
      userReferralCount          = d.referralCount   || 0;

      // Load per-user purchased wallpapers from Firebase.
      // Backward compatible with older path `unlockedWallpapers`.
      const wpData = d.ownedWallpapers || d.unlockedWallpapers || {};
      purchasedWallpapers = Object.keys(wpData).filter(k => wpData[k] === true);

      // Load per-user selected wallpaper from Firebase (fallback to localStorage then 'none')
      if (d.selectedWallpaper) {
        currentWallpaper = d.selectedWallpaper;
      } else {
        try {
          currentWallpaper = localStorage.getItem('wallpaper') || 'none';
        } catch (e) {
          currentWallpaper = 'none';
        }
      }
    }

    // Real-time coins listener so UI updates instantly when coins are awarded
    db.ref('users/' + currentUser.id + '/coins').on('value', snap => {
      userCoins = snap.val() || 0;
      updateCoinsDisplay();
    });

    // Update / create user doc
    const updates = { name: currentUser.name, lastActive: Date.now() };
    if (!snap.exists()) updates.createdAt = Date.now();
    await db.ref('users/' + currentUser.id).update(updates);

    // Fetch country (once per day)
    const today        = new Date().toDateString();
    const lastFetch    = localStorage.getItem('countryFetchDate');
    const storedCountry = localStorage.getItem('userCountry');
    if (storedCountry && lastFetch === today) {
      currentUser.country = storedCountry;
    } else {
      fetchCountry(); // non-blocking
    }

  } catch (e) {
    console.warn('User init error:', e);
  }
}

async function fetchCountry() {
  try {
    const res  = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    if (data.country_code) {
      currentUser.country = data.country_code;
      localStorage.setItem('userCountry',    data.country_code);
      localStorage.setItem('countryFetchDate', new Date().toDateString());
      if (db) {
        await db.ref('users/' + currentUser.id).update({ country: data.country_code });
      }
    }
  } catch (e) {
    console.warn('Country fetch:', e);
  }
}

function countryToFlag(code) {
  if (!code || code.length !== 2) return '🌍';
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map(c => 0x1F1E0 - 65 + c.charCodeAt(0))
  );
}

/* ===== SCREEN MANAGEMENT ===== */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById('screen-' + name)?.classList.remove('hidden');
}

/* ===== HOME UI ===== */
function updateHomeUI() {
  const avatarEl   = document.getElementById('home-avatar');
  const usernameEl = document.getElementById('home-username');
  usernameEl.textContent = currentUser.name;
  applyAvatarToEl(avatarEl, currentUser.name);
}

function applyAvatarToEl(el, name) {
  if (tgPhotoUrl) {
    el.style.backgroundImage = 'url(' + tgPhotoUrl + ')';
    el.style.backgroundSize  = 'cover';
    el.style.backgroundPosition = 'center';
    el.textContent = '';
  } else {
    el.textContent = name.charAt(0).toUpperCase();
    el.style.backgroundImage = '';
    setAvatarColor(el, name);
  }
}

function setAvatarColor(el, name) {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  el.style.background = AVATAR_COLORS[idx];
}

/* ===== URL PARAMS (invite link) ===== */
function checkUrlParams() {
  try {
    // Support ?room= (legacy) and #room= (new share format)
    const params     = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const inviteRoom = params.get('room') || hashParams.get('room');
    if (inviteRoom) joinRoomAsO(inviteRoom);
  } catch (e) {
    console.warn('URL params:', e);
  }
}

/* ===== EVENT LISTENERS ===== */
function setupEventListeners() {
  // Home — avatar opens profile screen, not settings
  document.getElementById('user-avatar-btn').addEventListener('click', openProfile);
  document.getElementById('btn-play-ai').addEventListener('click', startAIGame);
  document.getElementById('btn-play-online').addEventListener('click', startFriendsGame);

  // Developer Telegram link in about section
  const devLinkBtn = document.getElementById('dev-link-btn');
  if (devLinkBtn) devLinkBtn.addEventListener('click', openDeveloperTelegram);

  // Profile screen back button
  document.getElementById('btn-profile-back').addEventListener('click', () => {
    showScreen('home');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === 'home');
    });
  });

  // Game
  document.getElementById('btn-back').addEventListener('click', leaveGame);
  document.getElementById('btn-play-again').addEventListener('click', playAgain);
  document.getElementById('btn-invite').addEventListener('click', handleInvite);
  document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Difficulty dropdown
  const diffBtn  = document.getElementById('difficulty-btn');
  const diffMenu = document.getElementById('difficulty-menu');

  diffBtn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !diffMenu.classList.contains('hidden');
    diffMenu.classList.toggle('hidden', isOpen);
    diffBtn.classList.toggle('open', !isOpen);
  });

  document.querySelectorAll('.difficulty-option').forEach(opt => {
    opt.addEventListener('click', () => {
      aiDifficulty = opt.dataset.value;
      document.getElementById('difficulty-label').textContent = opt.textContent.trim();
      diffMenu.classList.add('hidden');
      diffBtn.classList.remove('open');
      document.querySelectorAll('.difficulty-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  document.addEventListener('click', () => {
    diffMenu.classList.add('hidden');
    diffBtn.classList.remove('open');
  });

  // Board clicks and keyboard
  const boardEl = document.getElementById('game-board');
  boardEl.addEventListener('click', e => {
    const cell = e.target.closest('.cell');
    if (cell) handleCellClick(parseInt(cell.dataset.index, 10));
  });
  boardEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const cell = e.target.closest('.cell');
      if (cell) handleCellClick(parseInt(cell.dataset.index, 10));
    }
  });

  // Waiting (old online screen)
  document.getElementById('btn-cancel-wait').addEventListener('click', cancelWaiting);

  // Battle modal cancel
  document.getElementById('btn-cancel-battle').addEventListener('click', cancelBattleSearch);

  // Leaderboard tabs
  document.querySelectorAll('.lb-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lb-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadLeaderboard(tab.dataset.tab);
    });
  });

  // Leaderboard help modal
  document.getElementById('leaderboardHelpBtn')
    ?.addEventListener('click', () => {
      document.getElementById('leaderboardHelpModal')?.classList.remove('hidden');
    });
  document.getElementById('closeHelpBtn')
    ?.addEventListener('click', () => {
      document.getElementById('leaderboardHelpModal')?.classList.add('hidden');
    });
  document.getElementById('leaderboardHelpModal')
    ?.addEventListener('click', (e) => {
      if (e.target.id === 'leaderboardHelpModal') {
        e.target.classList.add('hidden');
      }
    });

  // Bottom nav (all nav instances)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;

      if (screen === 'battle') {
        startBattleSearch();
        return;
      }

      if (screen === 'settings') {
        openSettings();
        return;
      }

      if (screen === 'leaderboard') {
        const activeTab = document.querySelector('.lb-tab.active')?.dataset.tab || 'lifetime';
        loadLeaderboard(activeTab);
      }
      showScreen(screen);
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.screen === screen);
      });
    });
  });

  // Settings modal
  document.getElementById('settings-close').addEventListener('click', closeSettings);
  document.getElementById('modal-settings').addEventListener('click', e => {
    if (e.target.id === 'modal-settings') closeSettings();
  });
  document.getElementById('btn-settings-home').addEventListener('click', () => {
    closeSettings();
    showScreen('home');
    document.querySelectorAll('.nav-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === 'home');
    });
  });
  document.getElementById('btn-save-name').addEventListener('click', saveName);
  document.getElementById('settings-language').addEventListener('change', e => {
    setLanguage(e.target.value, true);
  });

  // Wallpaper preview modal
  document.getElementById('closeWpPreviewBtn')
    ?.addEventListener('click', closeWallpaperPreview);
  document.getElementById('wallpaperPreviewModal')
    ?.addEventListener('click', (e) => {
      if (e.target.id === 'wallpaperPreviewModal') {
        closeWallpaperPreview();
      }
    });

  // Wallpaper purchase modal
  document.getElementById('wp-purchase-close')
    ?.addEventListener('click', closePurchaseModal);
  document.getElementById('wp-purchase-cancel')
    ?.addEventListener('click', closePurchaseModal);
  document.getElementById('modal-wp-purchase')
    ?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-wp-purchase') {
        closePurchaseModal();
      }
    });
}

/* ===== AI GAME ===== */
function startAIGame() {
  gameMode     = 'ai';
  xpAwarded    = false;
  playerMark   = 'X';
  playerXWins  = 0;
  playerOWins  = 0;
  board        = Array(9).fill('');
  currentTurn  = 'X';
  gameOver     = false;
  battleBotName = null;

  document.getElementById('difficulty-container').classList.remove('hidden');
  document.getElementById('btn-invite').classList.add('hidden');
  document.getElementById('chat-container').classList.add('hidden');
  document.getElementById('result-overlay').classList.add('hidden');

  document.getElementById('player-x-name').textContent = currentUser.name;
  document.getElementById('player-o-name').textContent = 'AI (' + aiDifficulty + ')';
  document.getElementById('player-x-wins').textContent = '0';
  document.getElementById('player-o-wins').textContent = '0';

  renderBoard();
  setStatus('Your Turn');
  updateActiveTurn();
  showScreen('game');
}

/* ===== PLAY WITH FRIENDS (private room) ===== */
async function startFriendsGame() {
  if (!db) {
    alert('Online play requires an internet connection. Try "Play with Computer" for offline play.');
    return;
  }

  try {
    // Create a new room with only playerX filled in
    const roomRef   = db.ref('rooms').push();
    const newRoomId = roomRef.key;

    await roomRef.set({
      playerX: currentUser.id,
      playerO: null,
      board:   Array(9).fill(''),
      turn:    'X',
      winner:  null,
      winningCells: null,
      playerXWins: 0,
      playerOWins: 0,
      createdAt: Date.now(),
      players: {
        X: { id: currentUser.id, name: currentUser.name }
      },
      stats: { matchId: Date.now(), awardedKey: null }
    });

    waitingForOpponent = true;
    joinRoom(newRoomId, 'X');
    shareGameLink(newRoomId);
  } catch (e) {
    console.warn('startFriendsGame error:', e);
    alert('Could not create room. Please try again.');
  }
}

/* ===== ONLINE MATCHMAKING ===== */
async function startOnlineMatchmaking() {
  if (!db) {
    alert('Online play requires an internet connection. Try "Play with Computer" for offline play.');
    return;
  }

  showScreen('waiting');

  try {
    // Look for a waiting player (not ourselves)
    const queueSnap = await db.ref('queue')
      .orderByChild('status').equalTo('waiting').once('value');

    let matchMade = false;

    if (queueSnap.exists()) {
      const entries = queueSnap.val();
      const candidates = Object.entries(entries).filter(([uid]) => uid !== currentUser.id);

      for (const [opponentId] of candidates) {
        // Atomic claim via transaction
        const opRef = db.ref('queue/' + opponentId);
        const txResult = await opRef.transaction(data => {
          if (data && data.status === 'waiting') {
            return { ...data, status: 'taken' };
          }
          return undefined; // abort
        });

        if (!txResult.committed) continue;

        // Create the room
        const opUserSnap = await db.ref('users/' + opponentId).once('value');
        const opUser     = opUserSnap.val() || {};

        const roomRef  = db.ref('rooms').push();
        const newRoomId = roomRef.key;
        const emptyBoard = Array(9).fill('');

        await roomRef.set({
          playerX: opponentId,
          playerO: currentUser.id,
          board:   emptyBoard,
          turn:    'X',
          winner:  null,
          winningCells: null,
          playerXWins: 0,
          playerOWins: 0,
          createdAt: Date.now(),
          players: {
            X: { id: opponentId, name: opUser.name || 'Player' },
            O: { id: currentUser.id, name: currentUser.name }
          },
          stats: { matchId: Date.now(), awardedKey: null }
        });

        // Notify opponent
        await opRef.update({ status: 'matched', roomId: newRoomId });

        matchMade = true;
        joinRoom(newRoomId, 'O');
        break;
      }
    }

    if (!matchMade) {
      // Add self to queue and wait
      await db.ref('queue/' + currentUser.id).set({
        userId:    currentUser.id,
        timestamp: Date.now(),
        status:    'waiting'
      });
      listenForMatch();
    }

  } catch (e) {
    console.warn('Matchmaking error:', e);
    showScreen('home');
  }
}

function listenForMatch() {
  if (!db) return;
  queueRef = db.ref('queue/' + currentUser.id);
  const matchListenerFn = async snap => {
    if (!snap.exists()) return;
    const data = snap.val();
    if (data.status === 'matched' && data.roomId) {
      detachListener('queue');
      joinRoom(data.roomId, 'X');
    }
  };
  attachListener('queue', queueRef, 'value', matchListenerFn);
}

function cleanupQueueListener() {
  detachListener('queue');
  queueRef = null;
}

function cancelWaiting() {
  cleanupQueueListener();
  if (db) {
    db.ref('queue/' + currentUser.id).remove().catch(() => {});
  }
  showScreen('home');
}

/* ===== ROOM MANAGEMENT ===== */
function updateShareButtonVisibility() {
  const show = waitingForOpponent && playerMark === 'X';
  document.getElementById('btn-invite').classList.toggle('hidden', !show);
}

function joinRoom(rId, mark) {
  roomId      = rId;
  playerMark  = mark;
  gameMode    = 'online';
  xpAwarded   = false;
  playerXWins = 0;
  playerOWins = 0;
  board       = Array(9).fill('');
  currentTurn = 'X';
  gameOver    = false;
  roomFirstTurn = 'X';

  document.getElementById('difficulty-container').classList.add('hidden');
  updateShareButtonVisibility();
  document.getElementById('chat-container').classList.remove('hidden');
  document.getElementById('result-overlay').classList.add('hidden');
  document.getElementById('chat-messages').innerHTML = '';

  showScreen('game');
  listenToRoom();
}

async function joinRoomAsO(rId) {
  if (!db) return;
  try {
    const snap = await db.ref('rooms/' + rId).once('value');
    if (!snap.exists()) return;
    const room = snap.val();

    // Determine our mark
    const mark = (room.players?.X?.id === currentUser.id) ? 'X' : 'O';

    // Register as O if slot is free
    if (!room.players?.O && mark === 'O') {
      await db.ref('rooms/' + rId).update({
        playerO: currentUser.id,
        'players/O': { id: currentUser.id, name: currentUser.name }
      });
    }

    joinRoom(rId, mark);
  } catch (e) {
    console.warn('joinRoomAsO:', e);
  }
}

function listenToRoom() {
  if (!db || !roomId) return;
  cleanupRoomListener();

  const roomRef = db.ref('rooms/' + roomId);
  const roomValueListener = snap => {
    if (!snap.exists()) return;
    renderOnlineRoom(snap.val());
  };
  attachListener('room', roomRef, 'value', roomValueListener);

  const chatRef = db.ref('rooms/' + roomId + '/messages').limitToLast(50);
  const chatChildListener = snap => appendChatMessage(snap.val());
  attachListener('chat', chatRef, 'child_added', chatChildListener);
}

function cleanupRoomListener() {
  detachListener('room');
  detachListener('chat');
}

function renderOnlineRoom(room) {
  board = normalizeBoard(room.board);
  currentTurn  = room.turn || 'X';
  playerXWins  = room.playerXWins || 0;
  playerOWins  = room.playerOWins || 0;

  const pX = room.players?.X || {};
  const pO = room.players?.O || {};

  document.getElementById('player-x-name').textContent = pX.name || 'Player X';
  document.getElementById('player-o-name').textContent = pO.name || 'Waiting...';
  document.getElementById('player-x-wins').textContent = playerXWins;
  document.getElementById('player-o-wins').textContent = playerOWins;

  const winCells = normalizeArrayField(room.winningCells);

  // Friend joined — stop showing share button, clear waiting state
  if (waitingForOpponent && room.playerO) {
    waitingForOpponent = false;
    updateShareButtonVisibility();
  }

  if (room.winner) {
    gameOver = true;
    renderBoard(winCells);

    let outcome;
    if (room.winner === 'draw')         outcome = 'draw';
    else if (room.winner === playerMark) outcome = 'win';
    else                                 outcome = 'lose';

    setStatus({ win: 'You Win! 🎉', lose: 'You Lose! 😔', draw: "It's a Draw! 🤝" }[outcome]);
    showResultOverlay(outcome);

    if (!xpAwarded) {
      xpAwarded = true;
      awardXP(outcome);
      setTimeout(() => detachListener('room'), 3000);
    }
  } else {
    gameOver = false;
    renderBoard();

    if (!room.players?.O || !room.playerO) {
      setStatus('Waiting for friend...');
    } else if (currentTurn === playerMark) {
      setStatus('Your Turn');
    } else {
      setStatus("Opponent's Turn");
    }
    updateActiveTurn();
    document.getElementById('result-overlay').classList.add('hidden');
  }
}

/* ===== BOARD RENDERING ===== */
function renderBoard(winCells) {
  const cells = document.querySelectorAll('.cell');

  const shouldDisable = gameOver
    || (gameMode === 'ai'     && currentTurn === 'O')
    || (gameMode === 'online' && currentTurn !== playerMark);

  cells.forEach((cell, i) => {
    cell.className = 'cell';
    const val = board[i];

    if (val === 'X') {
      cell.textContent = '✕';
      cell.classList.add('x-cell', 'taken', 'disabled');
    } else if (val === 'O') {
      cell.textContent = '○';
      cell.classList.add('o-cell', 'taken', 'disabled');
    } else {
      cell.textContent = '';
      if (shouldDisable) cell.classList.add('disabled');
    }

    if (winCells && winCells.includes(i)) cell.classList.add('winning');
  });
}

function updateActiveTurn() {
  document.getElementById('player-x-info').classList.toggle('active-turn', currentTurn === 'X');
  document.getElementById('player-o-info').classList.toggle('active-turn', currentTurn === 'O');
}

function setStatus(text) {
  document.getElementById('game-status').textContent = text;
}

/* ===== CELL CLICK ===== */
function handleCellClick(index) {
  if (gameOver || board[index] !== '') return;

  if (gameMode === 'ai') {
    if (currentTurn !== 'X') return;
    processAIGameMove(index, 'X');
  } else if (gameMode === 'online') {
    if (currentTurn !== playerMark) return;
    makeOnlineMove(index);
  }
}

/* ===== AI GAME LOGIC ===== */
function processAIGameMove(index, mark) {
  if (board[index] !== '') return;

  board[index] = mark;
  const result = checkWinner(board);

  if (result) {
    gameOver = true;
    currentTurn = mark; // keep for renderBoard disabled logic
    renderBoard(result.cells);
    updateActiveTurn();

    let outcome;
    if (result.winner === 'draw') {
      outcome = 'draw';
      setStatus("It's a Draw! 🤝");
    } else if (result.winner === playerMark) {
      outcome = 'win';
      playerXWins++;
      document.getElementById('player-x-wins').textContent = playerXWins;
      setStatus('You Win! 🎉');
    } else {
      outcome = 'lose';
      playerOWins++;
      document.getElementById('player-o-wins').textContent = playerOWins;
      setStatus('AI Wins! 🤖');
    }

    showResultOverlay(outcome);
    if (!xpAwarded) { xpAwarded = true; awardXP(outcome); }
    return;
  }

  currentTurn = mark === 'X' ? 'O' : 'X';
  renderBoard();
  updateActiveTurn();

  if (mark === 'X') {
    const thinkingText = battleBotName
      ? battleBotName + ' is thinking...'
      : 'Computer is thinking...';
    setStatus(thinkingText);
    setTimeout(doAITurn, AI_MOVE_DELAY_MS);
  } else {
    setStatus('Your Turn');
  }
}

function doAITurn() {
  if (gameOver || gameMode !== 'ai') return;
  const idx = getAIMove(board);
  if (idx !== null && idx !== undefined) {
    processAIGameMove(idx, 'O');
  }
}

/* ===== AI MOVE SELECTION ===== */
function getAIMove(b) {
  if (aiDifficulty === 'easy') {
    return randomMove(b);
  } else if (aiDifficulty === 'medium') {
    return Math.random() < 0.5 ? minimaxMove(b) : randomMove(b);
  } else {
    return minimaxMove(b);
  }
}

function randomMove(b) {
  const empties = b.map((v, i) => v === '' ? i : -1).filter(v => v >= 0);
  return empties.length ? empties[Math.floor(Math.random() * empties.length)] : null;
}

function minimaxMove(b) {
  let bestScore = -Infinity;
  let bestMove  = null;

  for (let i = 0; i < 9; i++) {
    if (b[i] === '') {
      b[i] = 'O';
      const score = minimax(b, 0, false, -Infinity, Infinity);
      b[i] = '';
      if (score > bestScore) { bestScore = score; bestMove = i; }
    }
  }
  return bestMove;
}

function minimax(b, depth, isMax, alpha, beta) {
  const res = checkWinner(b);
  if (res) {
    if (res.winner === 'O')    return 10 - depth;
    if (res.winner === 'X')    return depth - 10;
    return 0;
  }

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === '') {
        b[i] = 'O';
        best = Math.max(best, minimax(b, depth + 1, false, alpha, beta));
        b[i] = '';
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (b[i] === '') {
        b[i] = 'X';
        best = Math.min(best, minimax(b, depth + 1, true, alpha, beta));
        b[i] = '';
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
}

/* ===== WIN DETECTION ===== */
function checkWinner(b) {
  for (const combo of WINNING_COMBOS) {
    const [i0, i1, i2] = combo;
    if (b[i0] && b[i0] === b[i1] && b[i0] === b[i2]) {
      return { winner: b[i0], cells: combo };
    }
  }
  if (b.every(v => v !== '')) return { winner: 'draw', cells: [] };
  return null;
}

/* ===== ONLINE MOVE ===== */
async function makeOnlineMove(index) {
  if (!db || !roomId || gameOver || board[index] !== '') return;

  const newBoard = [...board];
  newBoard[index] = playerMark;
  const result   = checkWinner(newBoard);
  const nextTurn = playerMark === 'X' ? 'O' : 'X';

  let update;
  if (!result) {
    // Normal move — write only what changed
    update = { board: newBoard, turn: nextTurn };
  } else if (result.winner === 'draw') {
    update = { board: newBoard, winner: 'draw', turn: null };
  } else {
    // Winning move
    update = {
      board:        newBoard,
      winner:       result.winner,
      winningCells: result.cells,
      turn:         null
    };
    if (result.winner === 'X') {
      update.playerXWins = firebase.database.ServerValue.increment(1);
    } else {
      update.playerOWins = firebase.database.ServerValue.increment(1);
    }
  }

  try {
    await db.ref('rooms/' + roomId).update(update);
  } catch (e) {
    console.warn('Online move error:', e);
  }
}

/* ===== RESULT OVERLAY ===== */
function showResultOverlay(outcome) {
  const emojiMap  = { win: '🎉', lose: '😔', draw: '🤝' };
  const textMap   = { win: 'You Win!', lose: 'You Lose!', draw: "It's a Draw!" };
  const colorMap  = { win: 'var(--accent-green)', lose: 'var(--accent-red)', draw: 'var(--accent-orange)' };

  document.getElementById('result-emoji').textContent = emojiMap[outcome];
  const textEl = document.getElementById('result-text');
  textEl.textContent  = textMap[outcome];
  textEl.style.color  = colorMap[outcome];

  const boost    = Date.now() < (currentUser.xpBoostExpiry || 0);
  const xpAmounts = { win: boost ? 20 : 10, draw: boost ? 14 : 7, lose: boost ? 10 : 5 };
  document.getElementById('result-xp').textContent =
    '+' + xpAmounts[outcome] + ' XP' + (boost ? ' ⚡ 2x Boost' : '');

  document.getElementById('result-overlay').classList.remove('hidden');
}

/* ===== PLAY AGAIN ===== */
function playAgain() {
  if (gameMode === 'ai') {
    board       = Array(9).fill('');
    currentTurn = 'X';
    gameOver    = false;
    xpAwarded   = false;
    renderBoard();
    setStatus('Your Turn');
    updateActiveTurn();
    document.getElementById('result-overlay').classList.add('hidden');
  } else if (gameMode === 'online' && db && roomId) {
    // Alternate who goes first each round
    roomFirstTurn = roomFirstTurn === 'X' ? 'O' : 'X';
    xpAwarded = false; // reset for the new round
    const newMatchId = Date.now();
    db.ref('rooms/' + roomId).update({
      board:              Array(9).fill(''),
      turn:               roomFirstTurn,
      winner:             null,
      winningCells:       [],
      'stats/matchId':    newMatchId,
      'stats/awardedKey': null
    }).catch(e => console.warn('Play again error:', e));
  }
}

/* ===== LEAVE GAME ===== */
function leaveGame() {
  cleanupRoomListener();
  cleanupQueueListener();
  roomId             = null;
  gameMode           = null;
  gameOver           = false;
  board              = Array(9).fill('');
  waitingForOpponent = false;
  showScreen('home');
}

/* ===== XP SYSTEM ===== */
async function awardXP(outcome) {
  const boost = Date.now() < (currentUser.xpBoostExpiry || 0);
  const xpMap = { win: boost ? 20 : 10, draw: boost ? 14 : 7, lose: boost ? 10 : 5 };
  const xpGain = xpMap[outcome] || 0;

  currentUser.xp     = (currentUser.xp     || 0) + xpGain;
  currentUser.games  = (currentUser.games   || 0) + 1;
  if (outcome === 'win')  currentUser.wins   = (currentUser.wins   || 0) + 1;
  if (outcome === 'lose') currentUser.losses = (currentUser.losses  || 0) + 1;
  if (outcome === 'draw') currentUser.draws  = (currentUser.draws   || 0) + 1;

  if (!db) return;
  try {
    await db.ref('users/' + currentUser.id).update({
      xp:         currentUser.xp,
      wins:       currentUser.wins,
      losses:     currentUser.losses,
      draws:      currentUser.draws,
      games:      currentUser.games,
      lastActive: Date.now()
    });
    invalidateProfileCache();
  } catch (e) {
    console.warn('XP update error:', e);
  }
}

/* ===== INVITE / SHARE ===== */
function handleInvite() {
  if (!roomId) return;
  shareGameLink(roomId);
}

/* ===== CHAT ===== */
async function sendChatMessage() {
  if (!db || !roomId) return;
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';

  try {
    await db.ref('rooms/' + roomId + '/messages').push({
      userId: currentUser.id,
      name:   currentUser.name,
      text:   text,
      time:   Date.now()
    });
  } catch (e) {
    console.warn('Chat send error:', e);
  }
}

function appendChatMessage(msg) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg';

  const senderSpan = document.createElement('span');
  senderSpan.className = 'msg-sender';
  senderSpan.textContent = (msg.name || 'Player') + ':';

  const textSpan = document.createElement('span');
  textSpan.className = 'msg-text';
  textSpan.textContent = ' ' + (msg.text || '');

  div.appendChild(senderSpan);
  div.appendChild(textSpan);
  container.appendChild(div);

  // Cap at 50 messages
  while (container.children.length > 50) {
    container.removeChild(container.firstChild);
  }
  container.scrollTop = container.scrollHeight;
}

/* ===== AVATAR COLOR ===== */
function getAvatarColor(name) {
  const colors = [
    '#7c3aed', '#4f46e5', '#0891b2',
    '#059669', '#d97706', '#dc2626',
    '#db2777', '#a21caf', '#2563eb'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + hash;
  }
  return colors[Math.abs(hash) % colors.length];
}

/* ===== LEADERBOARD ===== */

const MONTHLY_MS = 2592000000; // 30 days in ms
const WEEKLY_MS  =  604800000; // 7 days in ms

function calculatePoints(userData) {
  const wins   = userData.wins        || 0;
  const draws  = userData.draws       || 0;
  const losses = userData.losses      || 0;
  const streak = userData.best_streak || 0;

  // Base points
  const base = (wins * 100) + (draws * 40) - (losses * 10);

  // Streak bonus (one-time best streak reward)
  let streakBonus = 0;
  if (streak >= 10) streakBonus = 75;
  else if (streak >= 5) streakBonus = 30;
  else if (streak >= 3) streakBonus = 15;

  // Tie-breaker: wins/games ratio multiplied by 10
  const games = wins + draws + losses;
  const ratio = games > 0 ? Math.round((wins / games) * 10) : 0;

  return Math.max(0, base + streakBonus + ratio);
}

function makeLetterAvatar(name, size) {
  const letter = (name || '?').trim().charAt(0).toUpperCase();
  const bg = getLetterAvatarBg(name);
  const div = document.createElement('div');
  div.className = 'letter-avatar';
  div.style.width           = size + 'px';
  div.style.height          = size + 'px';
  div.style.background      = bg;
  div.style.borderRadius    = '50%';
  div.style.display         = 'flex';
  div.style.alignItems      = 'center';
  div.style.justifyContent  = 'center';
  div.style.fontSize        = Math.round(size * 0.4) + 'px';
  div.style.fontWeight      = '800';
  div.style.color           = '#fff';
  div.style.flexShrink      = '0';
  div.innerText = letter;
  return div;
}

function getLetterAvatarBg(name) {
  const colors = [
    '#7c3aed', '#4f46e5', '#0891b2',
    '#059669', '#d97706', '#dc2626',
    '#db2777', '#2563eb', '#0f766e'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash += (name || '').charCodeAt(i);
  }
  return colors[hash % colors.length];
}

async function loadLeaderboard(tab) {
  tab = tab || 'lifetime';

  const podiumEl = document.getElementById('lb-podium');
  const listEl   = document.getElementById('lb-list');
  if (!podiumEl || !listEl) return;

  podiumEl.innerHTML = '<div class="loading-text">Loading...</div>';
  listEl.innerHTML   = '';

  if (!db) {
    podiumEl.innerHTML = '<div class="loading-text">Leaderboard requires an internet connection.</div>';
    return;
  }

  try {
    const snap = await db.ref('users').orderByChild('wins').limitToLast(50).once('value');
    let users = [];
    snap.forEach(child => {
      const d = child.val();
      if (d) users.push({ id: child.key, ...d });
    });

    // Filter for monthly / weekly tabs by lastActive timestamp
    if (tab === 'monthly') {
      users = users.filter(u => u.lastActive && (Date.now() - u.lastActive < MONTHLY_MS));
    } else if (tab === 'weekly') {
      users = users.filter(u => u.lastActive && (Date.now() - u.lastActive < WEEKLY_MS));
    }

    users.sort((a, b) => calculatePoints(b) - calculatePoints(a));

    if (!users.length) {
      podiumEl.innerHTML = '';
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-leaderboard-msg';
      emptyMsg.innerHTML =
        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<polyline points="6 9 6 2 18 2 18 9"/>' +
          '<path d="M4 9a2 2 0 0 0 0 4h2a6 6 0 0 0 12 0h2a2 2 0 0 0 0-4"/>' +
          '<line x1="9" y1="17" x2="9" y2="22"/><line x1="15" y1="17" x2="15" y2="22"/>' +
          '<line x1="7" y1="22" x2="17" y2="22"/>' +
        '</svg>' +
        '<p>No players active this period yet.<br>Play a game to appear here!</p>';
      podiumEl.appendChild(emptyMsg);
      listEl.innerHTML = '';
      updateLbProfileCard([]);
      return;
    }

    updateLbProfileCard(users);

    // Build podium (top 3)
    podiumEl.innerHTML = '';
    const podiumOrder  = [1, 0, 2]; // [#2, #1, #3] display order
    const podiumColors = [
      { border: '#f59e0b', glow: 'rgba(245,158,11,0.5)',  label: '🥇' },
      { border: '#94a3b8', glow: 'rgba(148,163,184,0.4)', label: '🥈' },
      { border: '#b45309', glow: 'rgba(180,83,9,0.4)',    label: '🥉' }
    ];
    const top3 = users.slice(0, 3);

    const podiumWrap = document.createElement('div');
    podiumWrap.className = 'lb-podium-inner';

    podiumOrder.forEach(rankIdx => {
      if (rankIdx >= top3.length) {
        const empty = document.createElement('div');
        empty.className = 'lb-podium-slot empty';
        podiumWrap.appendChild(empty);
        return;
      }
      const user  = top3[rankIdx];
      const rank  = rankIdx + 1;
      const color = podiumColors[rankIdx];
      const isMe  = user.id === currentUser.id;
      const score = calculatePoints(user);

      const slot = document.createElement('div');
      slot.className = 'lb-podium-slot rank-' + rank + (isMe ? ' me' : '');
      slot.style.setProperty('--pod-border', color.border);
      slot.style.setProperty('--pod-glow',   color.glow);

      const rankDiv = document.createElement('div');
      rankDiv.className   = 'pod-rank';
      rankDiv.textContent = color.label;

      const avatarDiv = makeLetterAvatar(user.name || 'Player', 64);
      avatarDiv.classList.add('pod-avatar');

      const nameDiv = document.createElement('div');
      nameDiv.className   = 'pod-name';
      nameDiv.textContent = user.name || 'Player';

      const scoreDiv = document.createElement('div');
      scoreDiv.className   = 'pod-score';
      scoreDiv.textContent = score + ' pts';

      slot.appendChild(rankDiv);
      slot.appendChild(avatarDiv);
      slot.appendChild(nameDiv);
      slot.appendChild(scoreDiv);
      podiumWrap.appendChild(slot);
    });
    podiumEl.appendChild(podiumWrap);

    // Build scrollable list (rank 4+)
    listEl.innerHTML = '';
    users.slice(3).forEach((user, i) => {
      const rank  = i + 4;
      const isMe  = user.id === currentUser.id;
      const score = calculatePoints(user);
      const flag  = getCountryFlag(user.country || '');

      const row = document.createElement('div');
      row.className = 'lb-row' + (isMe ? ' lb-row-me' : '');
      row.setAttribute('role', 'listitem');

      const rankDiv = document.createElement('div');
      rankDiv.className   = 'lb-row-rank';
      rankDiv.textContent = rank;

      const avatarDiv = makeLetterAvatar(user.name || 'Player', 48);
      avatarDiv.classList.add('lb-row-avatar');

      const nameDiv = document.createElement('div');
      nameDiv.className = 'lb-row-name';
      if (flag) {
        const flagSpan = document.createElement('span');
        flagSpan.className   = 'lb-flag';
        flagSpan.textContent = flag;
        nameDiv.appendChild(flagSpan);
      }
      nameDiv.appendChild(document.createTextNode(user.name || 'Player'));

      const scoreDiv = document.createElement('div');
      scoreDiv.className   = 'lb-row-score';
      scoreDiv.textContent = score + ' pts';

      row.appendChild(rankDiv);
      row.appendChild(avatarDiv);
      row.appendChild(nameDiv);
      row.appendChild(scoreDiv);
      listEl.appendChild(row);
    });

  } catch (e) {
    console.warn('Leaderboard error:', e);
    podiumEl.innerHTML = '<div class="loading-text">Failed to load leaderboard.</div>';
  }
}

function updateLbProfileCard(users) {
  const nameEl   = document.getElementById('lb-my-name');
  const pointsEl = document.getElementById('lb-my-points');
  const rankEl   = document.getElementById('lb-my-rank');
  const avatarEl = document.getElementById('lb-my-avatar');
  if (!nameEl) return;

  nameEl.textContent = currentUser.name || 'Player';

  // Letter avatar only — no profile photos in leaderboard
  const name   = currentUser.name || 'P';
  const letter = name.trim().charAt(0).toUpperCase();
  avatarEl.style.background      = getLetterAvatarBg(name);
  avatarEl.style.backgroundImage = '';
  avatarEl.textContent           = letter;

  const myIdx = users.findIndex(u => u.id === currentUser.id);
  if (myIdx >= 0) {
    pointsEl.textContent = calculatePoints(users[myIdx]) + ' pts';
    rankEl.textContent   = '#' + (myIdx + 1);
  } else {
    pointsEl.textContent = calculatePoints(currentUser) + ' pts';
    rankEl.textContent   = '#–';
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ===== WALLPAPER SYSTEM ===== */
function isWallpaperUnlocked(id) {
  const wp = WALLPAPERS.find(w => w.id === id);
  if (!wp) return false;
  if (wp.priceType === 'free') return true;
  return purchasedWallpapers.includes(id);
}

function renderWallpaperPicker() {
  const carousel = document.getElementById('wallpaperCarousel');
  if (!carousel) return;
  carousel.innerHTML = '';

  WALLPAPERS.forEach(wp => {
    const card = document.createElement('div');
    card.className = 'wallpaper-card';
    const unlocked = isWallpaperUnlocked(wp.id);

    if (!unlocked) card.classList.add('locked');
    if (currentWallpaper === wp.id) {
      card.classList.add('selected');
    }

    // Thumbnail image (lazy loaded)
    if (wp.thumbnail) {
      const img = document.createElement('img');
      img.className = 'wp-thumb';
      img.alt = wp.name;
      img.loading = 'lazy';
      img.src = wp.thumbnail;
      card.appendChild(img);
    } else {
      // Default "None" card — no image
      card.classList.add('wp-none');
    }

    // Overlay with name and price
    const overlay = document.createElement('div');
    overlay.className = 'wallpaper-card-overlay';

    const nameEl = document.createElement('div');
    nameEl.className = 'wallpaper-card-name';
    nameEl.innerText = wp.name;
    overlay.appendChild(nameEl);

    if (!unlocked && wp.price > 0) {
      const priceEl = document.createElement('div');
      priceEl.className = 'wallpaper-card-price';
      if (wp.priceType === 'coins') {
        priceEl.innerText = wp.price + ' coins';
      } else {
        priceEl.innerText = wp.price + ' ⭐';
      }
      overlay.appendChild(priceEl);
    }
    card.appendChild(overlay);

    // Lock icon for locked wallpapers
    if (!unlocked) {
      const lockEl = document.createElement('div');
      lockEl.className = 'wallpaper-lock-icon';
      lockEl.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
      card.appendChild(lockEl);
    }

    // Checkmark badge for selected wallpaper
    if (currentWallpaper === wp.id) {
      const badge = document.createElement('div');
      badge.className = 'wallpaper-selected-badge';
      badge.innerText = '✓';
      card.appendChild(badge);
    }

    // Tap handler
    card.onclick = () => {
      openWallpaperPreview(wp);
    };

    carousel.appendChild(card);
  });
}

function openWallpaperPreview(wp) {
  previewingWallpaper = wp;
  const modal = document.getElementById('wallpaperPreviewModal');
  const img = document.getElementById('wpPreviewImg');
  const nameEl = document.getElementById('wpPreviewName');
  const priceEl = document.getElementById('wpPreviewPrice');
  const actionBtn = document.getElementById('wpActionBtn');
  if (!modal) return;
  const unlocked = isWallpaperUnlocked(wp.id);

  // Load full image on demand
  if (img && wp.fullImage) {
    img.src = wp.fullImage;
    img.classList.toggle('blurred', !unlocked);
  } else if (img) {
    img.src = '';
  }

  if (nameEl) nameEl.innerText = wp.name;

  if (priceEl) {
    if (!unlocked && wp.price > 0) {
      if (wp.priceType === 'coins') {
        priceEl.innerText = wp.price + ' coins';
      } else {
        priceEl.innerText = wp.price + ' ⭐ Stars';
      }
      priceEl.classList.remove('hidden');
    } else {
      priceEl.classList.add('hidden');
    }
  }

  if (actionBtn) {
    if (unlocked) {
      actionBtn.innerText = currentWallpaper === wp.id ? 'Applied ✓' : 'Apply';
      actionBtn.className = 'wp-action-btn btn-apply';
      actionBtn.onclick = () => {
        applyWallpaper(wp.id);
        closeWallpaperPreview();
        renderWallpaperPicker();
      };
    } else if (wp.priceType === 'coins') {
      actionBtn.innerText = 'Buy for ' + wp.price + ' coins';
      actionBtn.className = 'wp-action-btn btn-unlock';
      actionBtn.onclick = () => {
        closeWallpaperPreview();
        purchaseWithCoins(wp);
      };
    } else {
      actionBtn.innerText = 'Unlock for ' + wp.price + ' ⭐';
      actionBtn.className = 'wp-action-btn btn-unlock';
      actionBtn.onclick = () => {
        closeWallpaperPreview();
        showPurchaseModal(wp);
      };
    }
  }

  modal.classList.remove('hidden');
}

function closeWallpaperPreview() {
  const modal = document.getElementById('wallpaperPreviewModal');
  if (modal) modal.classList.add('hidden');
  previewingWallpaper = null;
}

function showPurchaseModal(wp) {
  const modal = document.getElementById('modal-wp-purchase');
  if (!modal) return;
  const titleEl = document.getElementById('wp-purchase-title');
  const priceEl = document.getElementById('wp-purchase-price');
  const confirmBtn = document.getElementById('wp-purchase-confirm');
  if (titleEl) titleEl.innerText = 'Unlock ' + wp.name;
  if (priceEl) priceEl.innerText = wp.price + ' ⭐ Stars';
  if (confirmBtn) {
    confirmBtn.textContent = 'Pay with Stars ⭐';
    confirmBtn.onclick = () => {
      closePurchaseModal();
      processPurchase(wp);
    };
  }
  modal.classList.remove('hidden');
}

function closePurchaseModal() {
  const modal = document.getElementById('modal-wp-purchase');
  if (modal) modal.classList.add('hidden');
}

async function getTelegramStarsInvoiceUrl(wp) {
  if (!TELEGRAM_STARS_INVOICE_ENDPOINT) {
    throw new Error('Missing window.__TG_STARS_INVOICE_ENDPOINT__');
  }

  const tg = window.Telegram?.WebApp;
  const uid = ensureNormalizedUserId();
  if (!uid) {
    throw new Error('Missing Telegram user id');
  }
  const res = await fetch(TELEGRAM_STARS_INVOICE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      telegramUserId: uid,
      itemType: 'wallpaper',
      wallpaperId: wp.id,
      starsAmount: wp.price,
      initData: tg?.initData || ''
    })
  });

  if (!res.ok) {
    throw new Error('Invoice endpoint failed with status ' + res.status);
  }

  const data = await res.json();
  return typeof data?.invoiceUrl === 'string' ? data.invoiceUrl.trim() : '';
}

async function processPurchase(wp) {
  const confirmBtn = document.getElementById('wp-purchase-confirm');
  const originalText = confirmBtn?.textContent || 'Pay with Stars ⭐';

  const setLoading = (loading) => {
    if (!confirmBtn) return;
    confirmBtn.disabled = loading;
    confirmBtn.textContent = loading ? 'Opening payment…' : originalText;
  };

  try {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.openInvoice) {
      showToast('Telegram payment is only available inside Telegram.');
      return;
    }

    setLoading(true);
    const invoiceUrl = await getTelegramStarsInvoiceUrl(wp);
    setLoading(false);

    if (!invoiceUrl) {
      showToast('Telegram Stars payment is not configured yet.');
      return;
    }

    tg.openInvoice(invoiceUrl, (status) => {
      if (status === 'paid') {
        unlockWallpaper(wp.id)
          .then(() => {
            showToast(wp.name + ' wallpaper unlocked! 🎉');
          })
          .catch((err) => {
            console.error('unlockWallpaper after paid:', err);
            showToast('Payment succeeded, but unlock failed. Please reopen app.');
          });
      } else if (status === 'failed') {
        showToast('Payment failed. Please try again.');
      } else if (status !== 'cancelled') {
        showToast('Payment not completed.');
      }
    });
  } catch (e) {
    setLoading(false);
    console.error('processPurchase:', e);
    showToast('Failed to open Telegram Stars payment.');
  }
}

async function unlockWallpaper(id) {
  const uid = ensureNormalizedUserId();
  if (!uid || !db) {
    throw new Error('User or database unavailable');
  }

  if (!purchasedWallpapers.includes(id)) {
    await db.ref('users/' + uid + '/ownedWallpapers/' + id).set(true);
    purchasedWallpapers.push(id);
  }
  applyWallpaper(id);
  renderWallpaperPicker();
}

async function handlePurchaseSuccess(id) {
  await unlockWallpaper(id);
  closeWallpaperPreview();
  closePurchaseModal();
}

function applyWallpaper(wallpaperId) {
  currentWallpaper = wallpaperId;

  // Cache in localStorage for instant startup before Firebase loads
  try {
    localStorage.setItem('wallpaper', wallpaperId);
  } catch (e) {}

  // Save per-user selected wallpaper to Firebase
  const uid = ensureNormalizedUserId();
  if (uid && db) {
    db.ref('users/' + uid + '/selectedWallpaper')
      .set(wallpaperId)
      .catch(e => console.error('applyWallpaper Firebase:', e));
  }

  const wp = WALLPAPERS.find(w => w.id === wallpaperId);
  const el = document.getElementById('globalWallpaper');
  if (!el) return;

  if (!wp || !wp.fullImage) {
    el.style.backgroundImage = 'none';
    el.style.background = DEFAULT_WALLPAPER_BACKGROUND;
  } else {
    // Sanitize path: fullImage values come from the WALLPAPERS constant but we escape
    // single quotes defensively before embedding in the CSS url() value.
    const safePath = wp.fullImage.replace(/'/g, '%27');
    el.style.backgroundImage = "url('" + safePath + "')";
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
  }
}

function loadSavedWallpaper() {
  // currentWallpaper is already set by identifyUser() from Firebase.
  // Fall back to localStorage cache if Firebase data was unavailable (offline / no db).
  if (!db || !currentUser.id) {
    try {
      currentWallpaper = localStorage.getItem('wallpaper') || 'none';
    } catch (e) {
      currentWallpaper = 'none';
    }
  }
  applyWallpaper(currentWallpaper);
}

/* ===== RULES ===== */
function renderRulesDefault() {
  const defaultSections = [
    {
      title: 'Objective',
      content: 'Be the first player to get 3 of your marks in a row — horizontally, vertically, or diagonally.'
    },
    {
      title: 'How to Play',
      items: [
        'The game is played on a 3×3 grid.',
        'Player X always goes first.',
        'Players take turns placing their mark (X or O) on an empty cell.',
        'The first player to align 3 marks wins the game.',
        'If all 9 cells are filled with no winner, the game is a draw.'
      ]
    },
    {
      title: 'Game Modes',
      items: [
        '🤖 Play with Computer – Challenge the AI at Easy, Medium, or Hard difficulty.',
        '🌐 Play with Friends – Match with a random opponent online, or send an invite link.'
      ]
    },
    {
      title: 'XP & Levels',
      items: [
        'Win: +10 XP  (20 XP with 2× Boost)',
        'Draw: +7 XP  (14 XP with 2× Boost)',
        'Loss: +5 XP  (10 XP with 2× Boost)',
        'Level up every 100 XP.',
        'Purchase a 7-day 2× XP Boost via your profile.'
      ]
    },
    {
      title: 'Tips',
      items: [
        'Control the center cell for the best strategic position.',
        'Watch out for opponent forks — two winning threats at once.',
        'A draw is always possible with perfect play from both sides.'
      ]
    }
  ];

  const container = document.getElementById('rules-content');
  container.innerHTML = '';

  defaultSections.forEach(sec => {
    const section = document.createElement('div');
    section.className = 'rules-section';
    if (sec.title) {
      const h = document.createElement('h3');
      h.textContent = sec.title;
      section.appendChild(h);
    }
    if (sec.content) {
      const p = document.createElement('p');
      p.textContent = sec.content;
      section.appendChild(p);
    }
    if (sec.items) {
      const ul = document.createElement('ul');
      sec.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      section.appendChild(ul);
    }
    container.appendChild(section);
  });
}

/* ===== BATTLE TAB ===== */
function startBattleSearch() {
  battleCancelled = false;
  document.getElementById('modal-battle').classList.remove('hidden');
  document.body.style.pointerEvents = 'none';
  document.getElementById('modal-battle').style.pointerEvents = 'auto';
  startDotsAnimation();

  if (!db) {
    battleTimer = setTimeout(() => {
      if (!battleCancelled) startBotGame();
    }, BATTLE_SEARCH_TIMEOUT_MS);
    return;
  }

  // Add to Firebase queue (with future tournament fields)
  db.ref('queue/' + currentUser.id).set({
    userId:     currentUser.id,
    timestamp:  Date.now(),
    status:     'waiting',
    entry_paid: false // future: paid tournament entry flag
  }).then(() => {
    inBattleQueue = true;
    db.ref('queue/' + currentUser.id).onDisconnect().remove();
    searchBattleOpponent();
  }).catch(e => {
    console.warn('Battle queue error:', e);
    battleTimer = setTimeout(() => {
      if (!battleCancelled) startBotGame();
    }, BATTLE_SEARCH_TIMEOUT_MS);
  });

  // Timeout → bot fallback
  battleTimer = setTimeout(() => {
    if (!battleCancelled) {
      detachListener('queue');
      inBattleQueue = false;
      if (db) db.ref('queue/' + currentUser.id).remove().catch(() => {});
      startBotGame();
    }
  }, BATTLE_SEARCH_TIMEOUT_MS);
}

async function searchBattleOpponent() {
  if (!db || battleCancelled) return;
  try {
    const queueSnap = await db.ref('queue')
      .orderByChild('status').equalTo('waiting').once('value');

    if (battleCancelled) return;

    if (queueSnap.exists()) {
      const entries = queueSnap.val();
      const now = Date.now();
      const candidates = [];

      Object.entries(entries).forEach(([uid, d]) => {
        if (uid === currentUser.id) return;
        if (!d || d.status !== 'waiting') return;
        const age = now - (d.timestamp || 0);
        if (age > QUEUE_ENTRY_MAX_AGE_MS) {
          // Delete stale entry silently
          db.ref('queue/' + uid).remove().catch(() => {});
          return;
        }
        candidates.push({ uid, data: d });
      });

      for (const { uid: opponentId } of candidates) {
        const opRef = db.ref('queue/' + opponentId);
        const txResult = await opRef.transaction(data => {
          if (data && data.status === 'waiting') {
            return { ...data, status: 'taken' };
          }
          return undefined;
        });

        if (!txResult.committed || battleCancelled) continue;

        clearTimeout(battleTimer);
        inBattleQueue = false;
        detachListener('queue');

        const opUserSnap = await db.ref('users/' + opponentId).once('value');
        const opUser     = opUserSnap.val() || {};

        const roomRef   = db.ref('rooms').push();
        const newRoomId = roomRef.key;

        await roomRef.set({
          playerX: opponentId,
          playerO: currentUser.id,
          board:   Array(9).fill(''),
          turn:    'X',
          winner:  null,
          winningCells: null,
          playerXWins: 0,
          playerOWins: 0,
          createdAt: Date.now(),
          tournament_id: null, // future: weekly tournament identifier (snake_case per DB schema)
          players: {
            X: { id: opponentId, name: opUser.name || 'Player' },
            O: { id: currentUser.id, name: currentUser.name }
          },
          stats: { matchId: Date.now(), awardedKey: null }
        });

        await opRef.update({ status: 'matched', roomId: newRoomId });

        hideBattleModal();
        joinRoom(newRoomId, 'O');
        return;
      }
    }

    // No immediate opponent — listen for match signal
    listenForBattleMatch();

  } catch (e) {
    console.warn('Battle search error:', e);
  }
}

function listenForBattleMatch() {
  if (!db || battleCancelled) return;
  queueRef = db.ref('queue/' + currentUser.id);
  const battleQueueListenerFn = snap => {
    if (!snap.exists() || battleCancelled) return;
    const data = snap.val();
    if (data.status === 'matched' && data.roomId) {
      clearTimeout(battleTimer);
      inBattleQueue = false;
      detachListener('queue');
      hideBattleModal();
      joinRoom(data.roomId, 'X');
    }
  };
  attachListener('queue', queueRef, 'value', battleQueueListenerFn);
}

function cancelBattleSearch() {
  battleCancelled = true;
  clearTimeout(battleTimer);
  stopDotsAnimation();
  detachListener('queue');
  inBattleQueue = false;
  if (db) db.ref('queue/' + currentUser.id).remove().catch(() => {});
  hideBattleModal();
  showScreen('home');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === 'home');
  });
}

function startBotGame() {
  hideBattleModal();

  const botIdx      = Math.floor(Math.random() * BOT_NAMES.length);
  const countryIdx  = Math.floor(Math.random() * BOT_COUNTRIES.length);
  const botName     = countryToFlag(BOT_COUNTRIES[countryIdx]) + ' ' + BOT_NAMES[botIdx];

  gameMode     = 'ai';
  xpAwarded    = false;
  playerMark   = 'X';
  playerXWins  = 0;
  playerOWins  = 0;
  board        = Array(9).fill('');
  currentTurn  = 'X';
  gameOver     = false;
  aiDifficulty = 'medium';
  battleBotName = botName;

  document.getElementById('difficulty-container').classList.add('hidden');
  document.getElementById('btn-invite').classList.add('hidden');
  document.getElementById('chat-container').classList.add('hidden');
  document.getElementById('result-overlay').classList.add('hidden');

  document.getElementById('player-x-name').textContent = currentUser.name;
  document.getElementById('player-o-name').textContent = botName;
  document.getElementById('player-x-wins').textContent = '0';
  document.getElementById('player-o-wins').textContent = '0';

  renderBoard();
  setStatus('Your Turn');
  updateActiveTurn();
  showScreen('game');
}

function hideBattleModal() {
  document.getElementById('modal-battle').classList.add('hidden');
  document.body.style.pointerEvents = 'auto';
  stopDotsAnimation();
}

function startDotsAnimation() {
  stopDotsAnimation();
  const spans = document.querySelectorAll('.dots-animation span');
  let step = 0;
  dotsInterval = setInterval(() => {
    spans.forEach((s, i) => {
      s.style.opacity = (i === step % 3) ? '1' : '0.3';
      s.style.transform = (i === step % 3) ? 'scale(1.2)' : 'scale(0.8)';
    });
    step++;
  }, 350);
}

function stopDotsAnimation() {
  if (dotsInterval) {
    clearInterval(dotsInterval);
    dotsInterval = null;
  }
}

/* ===== SETTINGS MODAL ===== */
function openSettings() {
  document.getElementById('settings-name-input').value = currentUser.name;

  const langSelect = document.getElementById('settings-language');
  if (langSelect) langSelect.value = lang;

  populateSettingsStats();

  if (db) {
    db.ref('users/' + currentUser.id).once('value').then(snap => {
      if (!snap.exists()) return;
      const d = snap.val();
      currentUser.xp     = d.xp     || currentUser.xp;
      currentUser.wins   = d.wins   || currentUser.wins;
      currentUser.losses = d.losses || currentUser.losses;
      currentUser.draws  = d.draws  || currentUser.draws;
      currentUser.games  = d.games  || currentUser.games;
      populateSettingsStats();
    }).catch(e => console.warn('Settings stats error:', e));
  }

  document.getElementById('modal-settings').classList.remove('hidden');
  document.body.style.pointerEvents = 'auto';
  renderWallpaperPicker();
}

function populateSettingsStats() {
  const xp       = currentUser.xp || 0;
  const level    = Math.floor(xp / 100);
  const progress = xp % 100;

  document.getElementById('settings-level').textContent   = level;
  document.getElementById('settings-xp-text').textContent = progress + ' / 100 XP';
  const bar = document.getElementById('settings-xp-bar');
  bar.style.width = progress + '%';
  bar.parentElement.setAttribute('aria-valuenow', progress);

  document.getElementById('settings-wins').textContent   = currentUser.wins   || 0;
  document.getElementById('settings-losses').textContent = currentUser.losses  || 0;
  document.getElementById('settings-draws').textContent  = currentUser.draws   || 0;
}

function closeSettings() {
  document.getElementById('modal-settings').classList.add('hidden');
  document.body.style.pointerEvents = 'auto';
}

function detachSettingsListener() {
  if (settingsStatsRef) {
    settingsStatsRef.off('value');
    settingsStatsRef = null;
  }
}

async function saveName() {
  const input   = document.getElementById('settings-name-input');
  const newName = input.value.trim();
  if (!newName) return;

  currentUser.name = newName;
  localStorage.setItem('fallbackName', newName);
  updateHomeUI();

  if (db) {
    try {
      await db.ref('users/' + currentUser.id).update({ name: newName });
      invalidateProfileCache();
      showToast('Name saved!');
    } catch (e) {
      console.warn('Save name error:', e);
      showToast('Name updated locally.');
    }
  } else {
    showToast('Name saved!');
  }
}

/* ===== HELPERS ===== */
function normalizeBoard(raw) {
  const arr = Array(9).fill('');
  if (!raw) return arr;
  for (let i = 0; i < 9; i++) {
    arr[i] = raw[i] || '';
  }
  return arr;
}

function normalizeArrayField(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw;
  // Firebase may return an object with numeric string keys
  return Object.keys(raw).sort((a, b) => Number(a) - Number(b)).map(k => raw[k]);
}

let toastTimer = null;
function showToast(msg) {
  let toast = document.getElementById('toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-msg';
    toast.style.cssText = [
      'position:fixed', 'bottom:80px', 'left:50%', 'transform:translateX(-50%)',
      'background:#333', 'color:#fff', 'padding:10px 20px', 'border-radius:20px',
      'font-size:14px', 'z-index:9999', 'pointer-events:none',
      'transition:opacity 0.3s', 'max-width:320px', 'text-align:center'
    ].join(';');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

/* ===== PROFILE SCREEN ===== */
function openProfile() {
  showScreen('profile');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  loadProfile();
}

async function loadProfile() {
  // Show current in-memory data immediately
  renderProfileUI(currentUser, null);

  if (!db) return;
  try {
    const snap = await db.ref('users/' + currentUser.id).once('value');
    const d    = snap.exists() ? snap.val() : {};

    const merged = {
      name:           d.name           || currentUser.name,
      xp:             d.xp             || currentUser.xp             || 0,
      wins:           d.wins           || currentUser.wins           || 0,
      losses:         d.losses         || currentUser.losses         || 0,
      draws:          d.draws          || currentUser.draws          || 0,
      games:          d.games          || currentUser.games          || 0,
      best_streak:    d.best_streak    || 0,
      current_streak: d.current_streak || 0,
      coins:          d.coins          || 0
    };

    const achievements = d.achievements || {};
    renderProfileUI(merged, achievements);

    // Load referral stats
    db.ref('users/' + currentUser.id + '/referralCount')
      .once('value')
      .then(refSnap => {
        const count = refSnap.val() || 0;
        userReferralCount = count;
        const countEl = document.getElementById('referralCount');
        if (countEl) countEl.innerText = count;

        // Calculate total coins earned from referrals using tier table
        let totalCoins = 0;
        for (let i = 1; i <= count; i++) {
          totalCoins += REFERRAL_COIN_TIERS[Math.min(i - 1, REFERRAL_COIN_TIERS.length - 1)];
        }
        const coinsEl = document.getElementById('referralCoinsEarned');
        if (coinsEl) coinsEl.innerText = totalCoins;
      });
  } catch (e) {
    console.warn('loadProfile error:', e);
  }
}

function renderProfileUI(data, achievements) {
  // Avatar
  const avatarEl = document.getElementById('profile-avatar');
  applyAvatarToEl(avatarEl, data.name || 'P');

  // Name
  document.getElementById('profile-name').textContent = data.name || 'Player';

  // Level & XP
  const xp       = data.xp || 0;
  const level    = Math.floor(xp / 100);
  const xpInLevel = xp % 100;
  const xpNeeded = 100;

  document.getElementById('profile-level-badge').textContent = 'Level ' + level;
  document.getElementById('profile-xp-text').textContent     = xpInLevel + ' / ' + xpNeeded + ' XP';
  const bar = document.getElementById('profile-xp-bar');
  bar.style.width = (xpInLevel / xpNeeded * 100) + '%';
  bar.parentElement.setAttribute('aria-valuenow', xpInLevel);

  // Stats
  const wins    = data.wins   || 0;
  const losses  = data.losses || 0;
  const draws   = data.draws  || 0;
  const games   = data.games  || 0;
  const winRate = games > 0 ? Math.round(wins / games * 100) : 0;
  const streak  = data.best_streak || 0;

  document.getElementById('profile-wins').textContent    = wins;
  document.getElementById('profile-losses').textContent  = losses;
  document.getElementById('profile-draws').textContent   = draws;
  document.getElementById('profile-games').textContent   = games;
  document.getElementById('profile-winrate').textContent = winRate + '%';
  document.getElementById('profile-streak').textContent  = streak;

  // Coins — sync in-memory value then update all display elements
  userCoins = data.coins || userCoins;
  updateCoinsDisplay();

  // Achievements
  renderAchievements(achievements, wins, streak);
}

function renderAchievements(ach, wins, bestStreak) {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';

  const defs = [
    {
      id:      'first_win',
      name:    'First Win',
      desc:    'Win your first game',
      iconCls: 'icon-star',
      unlocked: wins >= 1
    },
    {
      id:      'streak3',
      name:    'Win Streak x3',
      desc:    'Win 3 games in a row',
      iconCls: 'icon-fire',
      unlocked: bestStreak >= 3
    },
    {
      id:      'invited_friend',
      name:    'Invite a Friend',
      desc:    'Invite a friend to play',
      note:    'Earn coins when friend joins',
      iconCls: 'icon-person-add',
      unlocked: !!(ach && ach.invited_friend)
    },
    {
      id:      'hard_mode_win',
      name:    'Hard Mode Winner',
      desc:    'Beat Hard AI difficulty',
      iconCls: 'icon-shield',
      unlocked: !!(ach && ach.hard_mode_win)
    },
    {
      id:      'battle_win',
      name:    'Battle Champion',
      desc:    'Win a Battle match',
      iconCls: 'icon-trophy',
      unlocked: !!(ach && ach.battle_win)
    },
    {
      id:      'daily_streak_7',
      name:    'Daily Player',
      desc:    'Play 7 days in a row',
      iconCls: 'icon-calendar',
      unlocked: !!(ach && ach.daily_streak_7)
    }
  ];

  defs.forEach(def => {
    const card = document.createElement('div');
    card.className = 'achievement-card ' + (def.unlocked ? 'unlocked' : 'locked');
    card.setAttribute('aria-label', def.unlocked ? def.name : 'Locked achievement');

    const iconWrap = document.createElement('div');
    iconWrap.className = 'achievement-icon';
    const iconDiv = document.createElement('div');
    iconDiv.style.cssText = 'width:100%;height:100%';
    iconDiv.className = def.iconCls;
    iconWrap.appendChild(iconDiv);

    const nameEl = document.createElement('div');
    nameEl.className = 'achievement-name';
    nameEl.textContent = def.unlocked ? def.name : '???';

    const descEl = document.createElement('div');
    descEl.className = 'achievement-desc';
    descEl.textContent = def.unlocked ? def.desc : '';

    card.appendChild(iconWrap);
    card.appendChild(nameEl);
    card.appendChild(descEl);

    if (def.unlocked && def.note) {
      const noteEl = document.createElement('div');
      noteEl.className = 'achievement-note';
      noteEl.textContent = def.note;
      card.appendChild(noteEl);
    }

    grid.appendChild(card);
  });
}

/* ===== COIN SYSTEM ===== */
function updateCoinsDisplay() {
  const els = document.querySelectorAll('.coins-display');
  els.forEach(el => {
    el.innerText = userCoins + ' coins';
  });
}

async function awardCoins(uid, amount, reason) {
  if (!db || !uid || amount <= 0) return;
  try {
    await db.ref('users/' + uid + '/coins')
      .transaction(current => {
        return (current || 0) + amount;
      });
    showToast('+' + amount + ' coins! ' + reason);
  } catch (e) {
    console.error('awardCoins failed:', e);
  }
}

/* ===== COIN WALLPAPER PURCHASE ===== */
async function purchaseWithCoins(wallpaper) {
  const uid = ensureNormalizedUserId();
  if (!uid || !db) return;

  if (userCoins < wallpaper.price) {
    showToast('Not enough coins. Invite friends to earn more!');
    return;
  }

  try {
    const result = await db
      .ref('users/' + uid + '/coins')
      .transaction(current => {
        const c = current || 0;
        if (c < wallpaper.price) {
          return undefined; // returning undefined aborts the transaction without writing
        }
        return c - wallpaper.price;
      });

    if (!result.committed) {
      showToast('Not enough coins.');
      return;
    }

    await handlePurchaseSuccess(wallpaper.id);

  } catch (e) {
    console.error('purchaseWithCoins:', e);
    showToast('Purchase failed. Try again.');
  }
}

/* ===== REFERRAL SYSTEM ===== */
function getReferralLink() {
  const uid = ensureNormalizedUserId();
  if (!uid) return null;
  return 'https://t.me/' + REFERRAL_BOT_USERNAME + '?startapp=ref_' + uid;
}

function shareReferralLink() {
  const link = getReferralLink();
  if (!link) return;

  const text = 'Play Tic Tac Toe with me! Join and we both get coins!';
  const shareUrl = 'https://t.me/share/url?url='
    + encodeURIComponent(link)
    + '&text=' + encodeURIComponent(text);

  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    navigator.clipboard.writeText(link)
      .then(() => showToast('Referral link copied!'))
      .catch(() => showToast(link));
  }
}

async function handleReferralOnStart() {
  const uid = ensureNormalizedUserId();
  if (!uid || !db) return;

  const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
  if (!startParam || !startParam.startsWith('ref_')) return;

  const referrerId = startParam.replace('ref_', '');

  // Block self-referral
  if (referrerId === uid) return;

  // Check if this user was already referred
  const userSnap = await db.ref('users/' + uid).once('value');
  const userData = userSnap.val() || {};
  if (userData.referredBy) return;

  // Check referrer exists
  const referrerSnap = await db.ref('users/' + referrerId).once('value');
  if (!referrerSnap.exists()) return;

  // Record referredBy on new user
  await db.ref('users/' + uid + '/referredBy').set(referrerId);

  // Add this user to referrer's referrals list
  await db.ref('users/' + referrerId + '/referrals/' + uid).set(Date.now());

  // Increment referrer's referral count atomically and award tiered coins
  const refCountSnap = await db
    .ref('users/' + referrerId + '/referralCount')
    .transaction(current => (current || 0) + 1);

  const newCount = refCountSnap.snapshot.val() || 1;

  // REFERRAL_COIN_TIERS: index 0 = 1st referral, 1 = 2nd, 2+ = 3rd and beyond
  const coinsToAward = REFERRAL_COIN_TIERS[Math.min(newCount - 1, REFERRAL_COIN_TIERS.length - 1)];

  await awardCoins(referrerId, coinsToAward, 'Friend joined via your link!');
}

/* ===== PAGE UNLOAD CLEANUP ===== */
window.addEventListener('beforeunload', () => {
  // Remove from queue if waiting
  if (inBattleQueue && queueRef) {
    queueRef.remove().catch(() => {});
  }
  // Detach all Firebase listeners
  detachAllListeners();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    if (inBattleQueue && queueRef) {
      queueRef.remove().catch(() => {});
      inBattleQueue = false;
    }
  }
});
