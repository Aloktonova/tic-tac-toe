// 📱 Telegram
const tg = window.Telegram?.WebApp;
if (tg && typeof tg.expand === "function") tg.expand();
const DEVELOPER_TELEGRAM_URL = "https://t.me/alokmaurya22";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_AI_MODE = "easy";
const DIFFICULTY_CHANGE_ANIMATION_DELAY_MS = 350;
const UNKNOWN_LOCATION_VALUE = "Unknown";
const LOCATION_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
const AI_MODE_STORAGE_KEY = "aiMode";
const AI_WINS_STORAGE_KEY = "aiWins";
const PLAYER_WINS_STORAGE_KEY = "playerWins";
const COMPUTER_WINS_STORAGE_KEY = "computerWins";
const SUPPORTED_LANGS = ["en", "hi", "ar", "ru", "ko", "ja"];
const RTL_LANGS = ["ar"];

const translations = {
  en: {
    appTitle: "Tic Tac Toe",
    playFriend: "Play with Friend",
    playAI: "Play with Computer",
    invite: "Invite",
    restart: "Restart",
    home: "Home",
    send: "Send",
    settings: "Settings",
    language: "Language",
    aiMode: "AI Mode",
    difficulty: "Difficulty",
    difficultyButton: "Difficulty",
    changeDifficulty: "Change Difficulty",
    aiMode_easy: "Easy",
    aiMode_medium: "Medium",
    aiMode_hard: "Hard",
    aiMode_adaptive: "Adaptive AI",
    about: "About",
    developer: "Developer: Alok Maurya",
    telegram: "Telegram:",
    backHome: "Back to Home",
    close: "Close",
    yourTurn: "Your Turn",
    win: "You Win 🎉",
    draw: "Draw 🤝",
    opponentWins: "Opponent Wins",
    opponentWinsAI: "Computer Wins 🤖",
    aiThinking: "AI Thinking…",
    loadingRoom: "Loading room...",
    waitingOpponent: "Waiting for Opponent...",
    opponentTurn: "Opponent Turn",
    turnOf: "{player}'s Turn",
    symbolWins: "{symbol} Wins 🎉",
    playerVs: "❌ {x} vs ⭕ {o}",
    labelYou: "You",
    labelFriend: "Friend",
    labelComputer: "Computer",
    playerX: "Player X",
    playerO: "Player O",
    waiting: "Waiting...",
    guestPlayer: "Guest Player",
    winsLabel: "Wins",
    typeMessage: "Type message...",
    chatUnavailable: "Chat unavailable",
    chatDisabledAIPlaceholder: "Chat is disabled in AI mode",
    chatDisabledAI: "Chat disabled in AI mode",
    noMessagesYet: "No messages yet",
    unableVerifyIdentity: "Unable to verify identity",
    failedCreateRoom: "Failed to create room. Try again.",
    noUsernameAvailable: "No username available",
    youAreSpectating: "You are spectating",
    notYourTurn: "Not your turn",
    moveFailed: "Move failed. Please try again.",
    onlyPlayersRestart: "Only players can restart",
    restartFailed: "Restart failed. Try again.",
    failedSendMessage: "Failed to send message.",
    gameNotFound: "Game not found",
    gameExpired: "This game has expired ⏳",
    roomFull: "Room Full",
    inviteShareText: "🎮 I challenge you in Tic Tac Toe!\nCan you beat me? 😏\n\n👉 Play instantly:\n",
    navHome: "Home",
    navBattle: "Battle",
    navSettings: "Settings",
    battle: "Battle",
    searchingOpponent: "Searching for opponent...",
    cancelSearch: "Cancel",
    opponentFound: "Opponent found! Starting game...",
    noPlayersFoundBot: "No players found, starting bot match\u2026"
  },
  hi: {
    appTitle: "टिक टैक टो",
    playFriend: "दोस्त के साथ खेलें",
    playAI: "कंप्यूटर के साथ खेलें",
    invite: "निमंत्रण",
    restart: "फिर से शुरू",
    home: "होम",
    send: "भेजें",
    settings: "सेटिंग्स",
    language: "भाषा",
    about: "परिचय",
    developer: "डेवलपर: Alok Maurya",
    telegram: "टेलीग्राम:",
    backHome: "होम पर वापस",
    close: "बंद करें",
    yourTurn: "आपकी बारी",
    win: "आप जीते 🎉",
    draw: "ड्रॉ 🤝",
    opponentWins: "प्रतिद्वंदी जीता",
    opponentWinsAI: "कंप्यूटर जीता 🤖",
    aiThinking: "कंप्यूटर सोच रहा है…",
    loadingRoom: "रूम लोड हो रहा है...",
    waitingOpponent: "प्रतिद्वंदी का इंतज़ार...",
    opponentTurn: "प्रतिद्वंदी की बारी",
    turnOf: "{player} की बारी",
    playerVs: "❌ {x} विरुद्ध ⭕ {o}",
    playerX: "प्लेयर X",
    playerO: "प्लेयर O",
    waiting: "इंतज़ार...",
    guestPlayer: "गेस्ट प्लेयर",
    winsLabel: "जीत",
    typeMessage: "संदेश लिखें...",
    chatUnavailable: "चैट उपलब्ध नहीं",
    chatDisabledAIPlaceholder: "AI मोड में चैट बंद है",
    chatDisabledAI: "AI मोड में चैट बंद है",
    noMessagesYet: "अभी तक कोई संदेश नहीं",
    unableVerifyIdentity: "पहचान सत्यापित नहीं हो सकी",
    failedCreateRoom: "रूम नहीं बन पाया। फिर से कोशिश करें।",
    noUsernameAvailable: "यूज़रनेम उपलब्ध नहीं है",
    youAreSpectating: "आप दर्शक हैं",
    notYourTurn: "यह आपकी बारी नहीं है",
    moveFailed: "चाल असफल रही। फिर प्रयास करें।",
    onlyPlayersRestart: "केवल खिलाड़ी रीस्टार्ट कर सकते हैं",
    restartFailed: "रीस्टार्ट असफल रहा। फिर प्रयास करें।",
    failedSendMessage: "संदेश भेजने में विफल।"
  },
  ar: {
    appTitle: "تيك تاك تو",
    playFriend: "العب مع صديق",
    playAI: "العب مع الكمبيوتر",
    invite: "دعوة",
    restart: "إعادة",
    home: "الرئيسية",
    send: "إرسال",
    settings: "الإعدادات",
    language: "اللغة",
    about: "حول",
    developer: "المطور: Alok Maurya",
    telegram: "تيليجرام:",
    backHome: "العودة للرئيسية",
    close: "إغلاق",
    yourTurn: "دورك",
    win: "لقد فزت 🎉",
    draw: "تعادل 🤝",
    opponentWins: "الخصم فاز",
    opponentWinsAI: "الكمبيوتر فاز 🤖",
    aiThinking: "الكمبيوتر يفكر…",
    loadingRoom: "جاري تحميل الغرفة...",
    waitingOpponent: "بانتظار الخصم...",
    opponentTurn: "دور الخصم",
    turnOf: "دور {player}",
    playerVs: "❌ {x} ضد ⭕ {o}",
    playerX: "اللاعب X",
    playerO: "اللاعب O",
    waiting: "بانتظار...",
    guestPlayer: "لاعب ضيف",
    winsLabel: "الانتصارات",
    typeMessage: "اكتب رسالة...",
    chatUnavailable: "الدردشة غير متاحة",
    chatDisabledAIPlaceholder: "الدردشة معطلة في وضع الذكاء الاصطناعي",
    chatDisabledAI: "الدردشة معطلة في وضع الذكاء الاصطناعي",
    noMessagesYet: "لا توجد رسائل بعد",
    unableVerifyIdentity: "تعذر التحقق من الهوية",
    failedCreateRoom: "فشل إنشاء الغرفة. حاول مرة أخرى.",
    noUsernameAvailable: "اسم المستخدم غير متوفر",
    youAreSpectating: "أنت متفرج",
    notYourTurn: "ليس دورك",
    moveFailed: "فشلت الحركة. حاول مرة أخرى.",
    onlyPlayersRestart: "فقط اللاعبون يمكنهم إعادة اللعبة",
    restartFailed: "فشلت الإعادة. حاول مرة أخرى.",
    failedSendMessage: "فشل إرسال الرسالة."
  },
  ru: {
    appTitle: "Крестики-нолики",
    playFriend: "Играть с другом",
    playAI: "Играть с компьютером",
    invite: "Пригласить",
    restart: "Рестарт",
    home: "Домой",
    send: "Отправить",
    settings: "Настройки",
    language: "Язык",
    about: "О приложении",
    developer: "Разработчик: Alok Maurya",
    telegram: "Телеграм:",
    backHome: "Назад домой",
    close: "Закрыть",
    yourTurn: "Ваш ход",
    win: "Вы выиграли 🎉",
    draw: "Ничья 🤝",
    opponentWins: "Соперник победил",
    opponentWinsAI: "Компьютер победил 🤖",
    aiThinking: "Компьютер думает…",
    loadingRoom: "Загрузка комнаты...",
    waitingOpponent: "Ожидание соперника...",
    opponentTurn: "Ход соперника",
    turnOf: "Ход: {player}",
    playerVs: "❌ {x} против ⭕ {o}",
    playerX: "Игрок X",
    playerO: "Игрок O",
    waiting: "Ожидание...",
    guestPlayer: "Гость",
    winsLabel: "Победы",
    typeMessage: "Введите сообщение...",
    chatUnavailable: "Чат недоступен",
    chatDisabledAIPlaceholder: "Чат отключен в режиме ИИ",
    chatDisabledAI: "Чат отключен в режиме ИИ",
    noMessagesYet: "Пока нет сообщений",
    unableVerifyIdentity: "Не удалось проверить личность",
    failedCreateRoom: "Не удалось создать комнату. Попробуйте снова.",
    noUsernameAvailable: "Имя пользователя недоступно",
    youAreSpectating: "Вы наблюдатель",
    notYourTurn: "Сейчас не ваш ход",
    moveFailed: "Ход не выполнен. Попробуйте снова.",
    onlyPlayersRestart: "Только игроки могут перезапустить",
    restartFailed: "Перезапуск не удался. Попробуйте снова.",
    failedSendMessage: "Не удалось отправить сообщение."
  },
  ko: {
    appTitle: "틱택토",
    playFriend: "친구와 플레이",
    playAI: "컴퓨터와 플레이",
    invite: "초대",
    restart: "다시 시작",
    home: "홈",
    send: "보내기",
    settings: "설정",
    language: "언어",
    about: "정보",
    developer: "개발자: Alok Maurya",
    telegram: "텔레그램:",
    backHome: "홈으로",
    close: "닫기",
    yourTurn: "당신 차례",
    win: "당신이 이겼어요 🎉",
    draw: "무승부 🤝",
    opponentWins: "상대가 이겼어요",
    opponentWinsAI: "컴퓨터가 이겼어요 🤖",
    aiThinking: "컴퓨터 생각 중…",
    loadingRoom: "방 불러오는 중...",
    waitingOpponent: "상대를 기다리는 중...",
    opponentTurn: "상대 차례",
    turnOf: "{player}의 차례",
    playerVs: "❌ {x} vs ⭕ {o}",
    playerX: "플레이어 X",
    playerO: "플레이어 O",
    waiting: "대기 중...",
    guestPlayer: "게스트 플레이어",
    winsLabel: "승리",
    typeMessage: "메시지를 입력하세요...",
    chatUnavailable: "채팅을 사용할 수 없음",
    chatDisabledAIPlaceholder: "AI 모드에서는 채팅이 비활성화됩니다",
    chatDisabledAI: "AI 모드에서는 채팅이 비활성화됩니다",
    noMessagesYet: "아직 메시지가 없습니다",
    unableVerifyIdentity: "사용자 확인에 실패했습니다",
    failedCreateRoom: "방 생성에 실패했습니다. 다시 시도하세요.",
    noUsernameAvailable: "사용자 이름이 없습니다",
    youAreSpectating: "관전 중입니다",
    notYourTurn: "당신 차례가 아닙니다",
    moveFailed: "수를 둘 수 없습니다. 다시 시도하세요.",
    onlyPlayersRestart: "플레이어만 다시 시작할 수 있습니다",
    restartFailed: "다시 시작에 실패했습니다. 다시 시도하세요.",
    failedSendMessage: "메시지 전송 실패."
  },
  ja: {
    appTitle: "三目並べ",
    playFriend: "友達と遊ぶ",
    playAI: "コンピューターと遊ぶ",
    invite: "招待",
    restart: "再スタート",
    home: "ホーム",
    send: "送信",
    settings: "設定",
    language: "言語",
    about: "このアプリについて",
    developer: "開発者: Alok Maurya",
    telegram: "Telegram:",
    backHome: "ホームに戻る",
    close: "閉じる",
    yourTurn: "あなたの番",
    win: "あなたの勝ち 🎉",
    draw: "引き分け 🤝",
    opponentWins: "相手の勝ち",
    opponentWinsAI: "コンピューターの勝ち 🤖",
    aiThinking: "コンピューターが考え中…",
    loadingRoom: "ルームを読み込み中...",
    waitingOpponent: "対戦相手を待っています...",
    opponentTurn: "相手の番",
    turnOf: "{player}の番",
    playerVs: "❌ {x} vs ⭕ {o}",
    playerX: "プレイヤーX",
    playerO: "プレイヤーO",
    waiting: "待機中...",
    guestPlayer: "ゲストプレイヤー",
    winsLabel: "勝利",
    typeMessage: "メッセージを入力...",
    chatUnavailable: "チャットは利用できません",
    chatDisabledAIPlaceholder: "AIモードではチャットできません",
    chatDisabledAI: "AIモードではチャットできません",
    noMessagesYet: "まだメッセージがありません",
    unableVerifyIdentity: "ユーザー確認ができませんでした",
    failedCreateRoom: "ルーム作成に失敗しました。再試行してください。",
    noUsernameAvailable: "ユーザー名がありません",
    youAreSpectating: "観戦中です",
    notYourTurn: "あなたの番ではありません",
    moveFailed: "操作に失敗しました。再試行してください。",
    onlyPlayersRestart: "プレイヤーのみ再スタートできます",
    restartFailed: "再スタートに失敗しました。再試行してください。",
    failedSendMessage: "メッセージ送信に失敗しました。"
  }
};

let user = {};
let userId = null;
let normalizedUserId = null;
let currentUserName = "";
let currentUserPhotoUrl = "";
let currentTelegramUsername = "";
let lang = DEFAULT_LANGUAGE;
let currentMessages = [];
let currentChatPlaceholderKey = "chatDisabledAIPlaceholder";
let profileStatsByUserId = {};
let userStatsRef = null;
let userStatsListener = null;
let aiResultAwarded = false;
let aiMode = DEFAULT_AI_MODE;
let aiModeSelectEl = null;
let difficultyControlEl = null;
let difficultyTriggerEl = null;
let difficultyDropdownEl = null;
let aiThreatCellsBeforePlayerMove = [];
let playerStats = createEmptyPlayerStats();
let aiWins = getInitialAIWins();
let aiWinAwarded = false;

function createEmptyPlayerStats() {
  return {
    centerFirst: 0,
    cornerMoves: 0,
    blockMoves: 0,
    totalMoves: 0
  };
}

function normalizeLangCode(code) {
  if (!code || typeof code !== "string") return null;
  const normalized = code.toLowerCase().split("-")[0];
  return SUPPORTED_LANGS.includes(normalized) ? normalized : null;
}

function normalizeAIMode(mode) {
  const normalized = typeof mode === "string" ? mode.toLowerCase().trim() : "";
  if (normalized === "easy" || normalized === "medium" || normalized === "hard" || normalized === "adaptive") {
    return normalized;
  }
  return DEFAULT_AI_MODE;
}

function getInitialAIMode() {
  let storedMode = null;
  try {
    storedMode = localStorage.getItem(AI_MODE_STORAGE_KEY);
  } catch (err) {
    console.warn("Unable to read aiMode from localStorage:", err);
  }
  return normalizeAIMode(storedMode);
}

function setAIMode(nextMode, persist = true) {
  const normalizedMode = normalizeAIMode(nextMode);
  const changed = normalizedMode !== aiMode;
  aiMode = normalizedMode;
  if (aiModeSelectEl) {
    aiModeSelectEl.value = aiMode;
  }
  if (persist) {
    try {
      localStorage.setItem(AI_MODE_STORAGE_KEY, aiMode);
    } catch (err) {
      console.warn("Unable to persist aiMode:", err);
    }
  }
  updateDifficultyUI();
  return changed;
}

function getInitialAIWins() {
  const initial = { player: 0, computer: 0 };
  try {
    const raw = localStorage.getItem(AI_WINS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const playerRaw = localStorage.getItem(PLAYER_WINS_STORAGE_KEY);
    const computerRaw = localStorage.getItem(COMPUTER_WINS_STORAGE_KEY);
    const legacyPlayerParsed = playerRaw === null ? null : Number(playerRaw);
    const legacyComputerParsed = computerRaw === null ? null : Number(computerRaw);
    const legacyPlayerWins = Number.isFinite(legacyPlayerParsed) ? legacyPlayerParsed : null;
    const legacyComputerWins = Number.isFinite(legacyComputerParsed) ? legacyComputerParsed : null;
    return {
      player: normalizeWins(legacyPlayerWins ?? parsed?.player),
      computer: normalizeWins(legacyComputerWins ?? parsed?.computer)
    };
  } catch (err) {
    console.warn("Unable to read ai wins:", err);
    return initial;
  }
}

function persistAIWins() {
  try {
    localStorage.setItem(AI_WINS_STORAGE_KEY, JSON.stringify(aiWins));
    localStorage.setItem(PLAYER_WINS_STORAGE_KEY, String(normalizeWins(aiWins.player)));
    localStorage.setItem(COMPUTER_WINS_STORAGE_KEY, String(normalizeWins(aiWins.computer)));
  } catch (err) {
    console.warn("Unable to persist ai wins:", err);
  }
}

function getInitialLanguage() {
  let storedLanguage = null;
  try {
    storedLanguage = localStorage.getItem("lang");
  } catch (err) {
    console.warn("Unable to read lang from localStorage:", err);
  }
  return normalizeLangCode(storedLanguage) || normalizeLangCode(tg?.initDataUnsafe?.user?.language_code) || DEFAULT_LANGUAGE;
}

function t(key, vars) {
  const dictionary = translations[lang] || translations.en;
  let value = dictionary[key] ?? translations.en[key] ?? key;
  if (vars && typeof value === "string") {
    Object.keys(vars).forEach((varKey) => {
      value = value.replace(new RegExp(`\\{${varKey}\\}`, "g"), String(vars[varKey]));
    });
  }
  return value;
}

function getDisplayName(rawUser) {
  if (!rawUser || typeof rawUser !== "object") return t("guestPlayer");
  const firstName = typeof rawUser.first_name === "string" ? rawUser.first_name.trim() : "";
  const lastName = typeof rawUser.last_name === "string" ? rawUser.last_name.trim() : "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  return fullName || t("guestPlayer");
}

function setLanguage(nextLanguage, persist = true) {
  const normalized = normalizeLangCode(nextLanguage) || DEFAULT_LANGUAGE;
  lang = normalized;
  if (persist) {
    try {
      localStorage.setItem("lang", normalized);
    } catch (err) {
      console.warn("Unable to persist lang:", err);
    }
  }
  document.documentElement.lang = normalized;
  document.documentElement.dir = RTL_LANGS.includes(normalized) ? "rtl" : "ltr";
  applyTranslations();
}

function syncTelegramUserContext() {
  user = tg?.initDataUnsafe?.user || {};
  userId = user.id ?? null;
  let fallbackId = null;
  try {
    fallbackId = localStorage.getItem("fallbackId");
  } catch (err) {
    console.warn("Unable to read fallbackId:", err);
  }
  if (!fallbackId) {
    fallbackId = generateFallbackUserId();
    try {
      localStorage.setItem("fallbackId", fallbackId);
    } catch (err) {
      console.warn("Unable to persist fallbackId:", err);
    }
  }
  normalizedUserId = userId === null ? fallbackId : String(userId);
  currentUserName = getDisplayName(user);
  currentUserPhotoUrl = typeof user.photo_url === "string" ? user.photo_url : "";
  currentTelegramUsername = typeof user.username === "string" ? user.username.trim() : "";
}

function ensureNormalizedUserId() {
  if (normalizedUserId) return normalizedUserId;
  syncTelegramUserContext();
  if (normalizedUserId) return normalizedUserId;

  const fallbackId = generateFallbackUserId();
  normalizedUserId = fallbackId;
  try {
    localStorage.setItem("fallbackId", fallbackId);
  } catch (err) {
    console.warn("Unable to persist fallbackId:", err);
  }
  return normalizedUserId;
}

function generateFallbackUserId() {
  if (window.crypto?.randomUUID) {
    return "user_" + window.crypto.randomUUID().replace(/-/g, "");
  }
  let counter = 0;
  try {
    counter = Number(localStorage.getItem("fallbackIdCounter") || "0") + 1;
    localStorage.setItem("fallbackIdCounter", String(counter));
  } catch (err) {
    counter = Date.now();
  }
  return "user_" + Date.now().toString(36) + "_" + counter.toString(36);
}

function generateRoomId() {
  if (window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(4);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  }
  return Date.now().toString(36).slice(-8);
}

function getMessageUserId(messageData) {
  if (messageData?.userId !== null && messageData?.userId !== undefined) return String(messageData.userId);
  if (messageData?.senderId !== null && messageData?.senderId !== undefined) return String(messageData.senderId);
  return "";
}

function normalizeWins(rawWins) {
  const wins = Number(rawWins);
  if (!Number.isFinite(wins) || wins < 0) return 0;
  return Math.floor(wins);
}

function normalizeLosses(rawLosses) {
  const losses = Number(rawLosses);
  if (!Number.isFinite(losses) || losses < 0) return 0;
  return Math.floor(losses);
}

function normalizeDraws(rawDraws) {
  const draws = Number(rawDraws);
  if (!Number.isFinite(draws) || draws < 0) return 0;
  return Math.floor(draws);
}

function normalizeGames(rawGames) {
  const games = Number(rawGames);
  if (!Number.isFinite(games) || games < 0) return 0;
  return Math.floor(games);
}

function normalizeXp(rawXp) {
  const xp = Number(rawXp);
  if (!Number.isFinite(xp) || xp < 0) return 0;
  return Math.floor(xp);
}

function getCurrentMatchId(roomData) {
  const matchId = Number(roomData?.stats?.matchId);
  if (!Number.isFinite(matchId) || matchId < 1) return 1;
  return Math.floor(matchId);
}

function getAwardKey(roomIdValue, matchId) {
  if (!roomIdValue) return null;
  return `${roomIdValue}:${matchId}`;
}

function normalizeLocationValue(value) {
  if (typeof value !== "string") return UNKNOWN_LOCATION_VALUE;
  const normalized = value.trim();
  return normalized || UNKNOWN_LOCATION_VALUE;
}

function shouldRefreshUserCountry(userData, now) {
  const normalizedCountry = typeof userData?.country === "string" ? userData.country.trim() : "";
  const hasCountry = normalizedCountry.length > 0 && normalizedCountry.toLowerCase() !== UNKNOWN_LOCATION_VALUE.toLowerCase();
  const lastLocationUpdate = Number(userData?.lastLocationUpdate);
  const hasRecentLocationUpdate = Number.isFinite(lastLocationUpdate) && (now - lastLocationUpdate) < LOCATION_REFRESH_INTERVAL_MS;
  return !hasCountry || !hasRecentLocationUpdate;
}

async function fetchUserLocationFromIpApi() {
  if (typeof fetch !== "function") {
    return null;
  }

  try {
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`ipapi request failed with status ${response.status}`);
    }

    const data = await response.json();
    return {
      country: normalizeLocationValue(data?.country_name || data?.country),
      city: normalizeLocationValue(data?.city)
    };
  } catch (error) {
    console.warn("Failed fetching IP-based location:", error);
    return null;
  }
}

function ensurePlayerProfileForCurrentUser() {
  if (!db) return Promise.resolve();
  const resolvedUserId = ensureNormalizedUserId();
  if (!resolvedUserId) return Promise.resolve();
  const playerName = currentUserName || t("guestPlayer");
  const userRef = db.ref("users/" + resolvedUserId);
  const legacyRef = db.ref("players/" + resolvedUserId);

  return Promise.all([userRef.once("value"), legacyRef.once("value")])
    .then(async ([userSnapshot, legacySnapshot]) => {
      const now = Date.now();
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val() || {};
        if (!shouldRefreshUserCountry(userData, now)) {
          await userRef.child("lastActive").set(now);
          return;
        }

        const location = await fetchUserLocationFromIpApi();
        if (!location) {
          await userRef.child("lastActive").set(now);
          return;
        }
        await userRef.transaction((current) => {
          if (current && typeof current === "object") {
            return {
              ...current,
              country: location.country,
              lastLocationUpdate: now,
              lastActive: now
            };
          }
          return current;
        });
        return;
      }

      const legacyWins = normalizeWins(legacySnapshot.val()?.wins);
      const location = await fetchUserLocationFromIpApi();
      const resolvedCountry = normalizeLocationValue(location?.country);
      const resolvedCity = normalizeLocationValue(location?.city);
      return userRef.transaction((current) => {
        if (current && typeof current === "object") {
          return {
            ...current,
            lastActive: now
          };
        }

        return {
          name: playerName,
          country: resolvedCountry,
          city: resolvedCity,
          ...(location ? { lastLocationUpdate: now } : {}),
          createdAt: now,
          lastActive: now,
          wins: legacyWins,
          losses: 0,
          draws: 0,
          games: 0,
          xp: 0
        };
      });
    })
    .catch((error) => {
      console.error("Failed ensuring player profile:", error);
    });
}

function stopPlayerStatsListeners() {
  playerStatsSubscriptions.forEach(({ ref, listener }) => {
    ref.off("value", listener);
  });
  playerStatsSubscriptions = [];
  subscribedPlayerStatsKey = "";
  playerStatsByUserId = {};
}

function subscribeToPlayerStats(normalizedData) {
  if (!db) return;
  const xId = normalizePlayerId(normalizedData?.players?.X?.id);
  const oId = normalizePlayerId(normalizedData?.players?.O?.id);
  const subscriptionKey = `${xId || ""}|${oId || ""}`;
  if (subscriptionKey === subscribedPlayerStatsKey) return;

  stopPlayerStatsListeners();
  subscribedPlayerStatsKey = subscriptionKey;

  [xId, oId].forEach((playerId) => {
    if (!playerId) return;
    const ref = db.ref("users/" + playerId);
    const listener = (snapshot) => {
      const data = snapshot.val() || {};
      if (!snapshot.exists()) {
        db.ref("players/" + playerId).once("value").then((legacySnapshot) => {
          const legacyData = legacySnapshot.val() || {};
          playerStatsByUserId[playerId] = {
            wins: normalizeWins(legacyData.wins),
            losses: 0,
            draws: 0,
            games: 0,
            xp: 0
          };
          updatePlayersText();
        }).catch((error) => {
          console.error("Failed loading legacy player stats:", error);
        });
        return;
      }
      playerStatsByUserId[playerId] = {
        wins: normalizeWins(data.wins),
        losses: normalizeLosses(data.losses),
        draws: normalizeDraws(data.draws),
        games: normalizeGames(data.games),
        xp: normalizeXp(data.xp)
      };
      updatePlayersText();
    };
    ref.on("value", listener);
    playerStatsSubscriptions.push({ ref, listener });
  });
}

function incrementUserMatchStats(userIdValue, userNameValue, resultOutcome, roomAwardKey) {
  if (!db) return;
  if (!userIdValue || !roomAwardKey) return;
  const playerStatsRef = db.ref("users/" + userIdValue);
  const relatedRoomId = roomId || null;
  const didWin = resultOutcome === "win";
  const didDraw = resultOutcome === "draw";
  const didLose = resultOutcome === "loss";
  const xpGain = didWin ? XP_GAIN_WIN : (didDraw ? XP_GAIN_DRAW : XP_GAIN_LOSS);
  playerStatsRef.transaction((current) => {
    const existing = current && typeof current === "object" ? current : {};
    if (existing.lastAwardedKey === roomAwardKey) return undefined;
    const existingName = typeof existing.name === "string" ? existing.name.trim() : "";

    return {
      ...existing,
      name: existingName || userNameValue || t("guestPlayer"),
      wins: normalizeWins(existing.wins) + (didWin ? 1 : 0),
      losses: normalizeLosses(existing.losses) + (didLose ? 1 : 0),
      draws: normalizeDraws(existing.draws) + (didDraw ? 1 : 0),
      games: normalizeGames(existing.games) + 1,
      xp: normalizeXp(existing.xp) + xpGain,
      lastWinRoomId: relatedRoomId,
      lastAwardedKey: roomAwardKey
    };
  }).catch((error) => {
    console.error("Failed incrementing user match stats:", error);
  });
}

function maybeAwardMatchStats(normalizedData) {
  if (gameMode !== "online" || !roomRef || !roomId || isWinAwardInFlight) return;

  const roomWinner = normalizedData?.winner;
  if (roomWinner !== "X" && roomWinner !== "O" && roomWinner !== "draw") return;

  const matchId = getCurrentMatchId(normalizedData);
  const roomAwardKey = getAwardKey(roomId, matchId);
  const currentAwardedKey = typeof normalizedData?.stats?.awardedKey === "string" ? normalizedData.stats.awardedKey : null;
  if (!roomAwardKey) return;

  const xPlayer = normalizedData?.players?.X;
  const oPlayer = normalizedData?.players?.O;
  const participants = [
    { symbol: "X", id: normalizePlayerId(xPlayer?.id), name: typeof xPlayer?.name === "string" ? xPlayer.name.trim() : "" },
    { symbol: "O", id: normalizePlayerId(oPlayer?.id), name: typeof oPlayer?.name === "string" ? oPlayer.name.trim() : "" }
  ].filter((entry) => !!entry.id);
  if (!participants.length) return;

  const applyAward = () => {
    if (lastProcessedAwardKey === roomAwardKey) return;
    lastProcessedAwardKey = roomAwardKey;
    participants.forEach((participant) => {
      let outcome = "loss";
      if (roomWinner === "draw") outcome = "draw";
      else if (roomWinner === participant.symbol) outcome = "win";
      incrementUserMatchStats(
        participant.id,
        participant.name,
        outcome,
        roomAwardKey
      );
    });
  };

  if (currentAwardedKey === roomAwardKey) {
    applyAward();
    return;
  }

  if (currentAwardedKey && currentAwardedKey !== roomAwardKey) return;

  isWinAwardInFlight = true;
  roomRef.child("stats/awardedKey").transaction((existingKey) => {
    if (existingKey) return undefined;
    return roomAwardKey;
  }, (error, committed) => {
    isWinAwardInFlight = false;
    if (error) {
      console.error("Failed claiming room award key:", error);
      return;
    }
    if (!committed) return;
    applyAward();
  });
}

syncTelegramUserContext();
lang = getInitialLanguage();

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};

let db = null;
try {
  const firebaseClient = window.firebase;
  if (firebaseClient && typeof firebaseClient.initializeApp === "function" && typeof firebaseClient.database === "function") {
    if (!Array.isArray(firebaseClient.apps) || firebaseClient.apps.length === 0) {
      firebaseClient.initializeApp(firebaseConfig);
    }
    db = firebaseClient.database();
  } else {
    console.warn("Firebase SDK unavailable; online mode disabled.");
  }
} catch (error) {
  console.error("Firebase init failed; online mode disabled:", error);
  db = null;
}

// 🎯 GLOBAL STATE
let board = ["","","","","","","","",""];
let currentPlayer = "X";
let winner = null;
let winningCells = [];
let gameMode = "online";

let roomId = null;
let roomRef = null;
let roomValueListener = null;
let chatMessagesRef = null;
let playerStatsSubscriptions = [];
let subscribedPlayerStatsKey = "";
let playerStatsByUserId = {};
let chatEnabled = false;

// Tracks room readiness and the current user's role
let roomLoaded = false;
let myRole = null;        // "X", "O", or null (spectator)
let hasAttemptedJoin = false;
let isJoinAttemptInFlight = false;
let hasShownRoomFullToast = false;
let isWinAwardInFlight = false;
let lastProcessedAwardKey = null;

const MAX_MESSAGE_LENGTH = 500;
const XP_PER_LEVEL = 100;
const XP_GAIN_WIN = 10;
const XP_GAIN_DRAW = 7;
const XP_GAIN_LOSS = 5;
const AUTO_RESTART_DELAY_MS = 1500;
const ROOM_EXPIRE_MS = 24 * 60 * 60 * 1000;
const ROOM_EXPIRED_REDIRECT_DELAY_MS = 2000;
const LOCAL_MATCH_ID = 1;
const FIRST_TIME_EXPERIENCE_KEY = "hasSeenFirstGameExperience";
const POST_GAME_RESTART_LABEL = "🔁 Play Again";
const POST_GAME_INVITE_LABEL = "📩 Invite Friend";
const AI_DELAY_MIN_MS = 300;
const AI_DELAY_MAX_MS = 800;
const CENTER_PREFERENCE_RATE = 0.8;
const CORNER_PREFERENCE_RATE = 0.8;
const EASY_MISTAKE_RATE = 0.38;
const MEDIUM_BLOCK_SKIP_RATE = 0.2;
const MEDIUM_RANDOM_RATE = 0.35;
const HARD_MISTAKE_RATE = 0.08;
const MIN_BLOCKS_FOR_DEFENSIVE = 2;
const DEFENSIVE_BLOCK_RATE = 0.4;
const AGGRESSIVE_CORNER_RATE = 0.6;
const BATTLE_MATCHMAKING_WINDOW_MS = 2000;      // Window to find a real player before bot fallback
const OPPONENT_QUEUE_CLEANUP_DELAY_MS = 2000;   // Delay before removing opponent's queue entry (gives Player O time to read roomId)
const PLAYER_O_ROOM_WAIT_TIMEOUT_MS = 10000;    // Max time Player O waits for Player X to create room

// 🎯 UI ELEMENTS
let userInfo, boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
let messagesDiv, chatInputEl, sendBtnEl, chatBoxEl;
let inviteBtn, restartBtn;
let settingsModal;
let profileModal, closeProfileBtn, profileNameValue, profileWinsValue, profileLossesValue, profileDrawsValue, profileGamesValue, profileLevelValue, profileXpValue, profileXpBarFill, profileXpPercentValue;
let autoRestartTimer = null;
let lastAutoRestartKey = "";

// ⚔️ BATTLE MATCHMAKING STATE
let battleMatchmakingRef = null;
let battleRoomPlayerOListener = null;
let roomExpiryRedirectTimer = null;
let battleQueueRef = null;          // Ref to own queue/{userId} entry
let battleQueueListenerRef = null;  // Ref for the general queue watcher
let battleQueueListenerFn = null;   // General queue listener callback
let battleFallbackTimer = null;     // 3-second bot fallback timer
let inBattleQueue = false;          // Whether the user is currently in queue
let battleRoomSearchRef = null;     // Ref watched by Player O while waiting for room
let battleRoomSearchTimeout = null; // Timeout guard for Player O room-wait
let battleBotName = null;

// =======================
// 🔔 TOAST
// =======================
function showToast(msg, duration) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = msg;
  toast.style.display = "block";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.display = "none"; }, duration || 2500);
}

function isRunningInsideTelegramWebApp() {
  return tg && typeof tg.openTelegramLink === "function" && tg.initData !== undefined;
}

function openDeveloperTelegram(event) {
  if (!isRunningInsideTelegramWebApp()) return;
  event.preventDefault();
  tg.openTelegramLink(DEVELOPER_TELEGRAM_URL);
}

function getProfileStatsForUser(playerId) {
  if (!playerId) {
    return {
      name: currentUserName || t("guestPlayer"),
      wins: 0,
      losses: 0,
      draws: 0,
      games: 0,
      xp: 0
    };
  }

  const data = profileStatsByUserId[playerId] || {};
  return {
    name: (typeof data.name === "string" && data.name.trim()) ? data.name.trim() : (currentUserName || t("guestPlayer")),
    wins: normalizeWins(data.wins),
    losses: normalizeLosses(data.losses),
    draws: normalizeDraws(data.draws),
    games: normalizeGames(data.games),
    xp: normalizeXp(data.xp)
  };
}

function updateProfileModalContent(playerId) {
  if (!profileNameValue || !profileWinsValue || !profileLossesValue || !profileDrawsValue || !profileGamesValue || !profileLevelValue || !profileXpValue || !profileXpBarFill || !profileXpPercentValue) return;
  const stats = getProfileStatsForUser(playerId || ensureNormalizedUserId());
  const level = Math.floor(stats.xp / XP_PER_LEVEL);
  const xpInCurrentLevel = stats.xp % XP_PER_LEVEL;
  const xpProgressPercent = Math.floor((xpInCurrentLevel / XP_PER_LEVEL) * 100);
  profileNameValue.innerText = stats.name;
  profileWinsValue.innerText = String(stats.wins);
  profileLossesValue.innerText = String(stats.losses);
  profileDrawsValue.innerText = String(stats.draws);
  profileGamesValue.innerText = String(stats.games);
  profileLevelValue.innerText = String(level);
  profileXpValue.innerText = String(stats.xp);
  profileXpBarFill.style.width = `${xpProgressPercent}%`;
  profileXpPercentValue.innerText = `${xpProgressPercent}%`;
}

function startCurrentUserStatsListener() {
  if (!db) return;
  const playerId = ensureNormalizedUserId();
  if (!playerId) return;
  if (userStatsRef && userStatsListener) return;

  userStatsRef = db.ref("users/" + playerId);
  userStatsListener = (snapshot) => {
    const data = snapshot.val() || {};
    profileStatsByUserId[playerId] = {
      name: typeof data.name === "string" ? data.name : currentUserName,
      wins: normalizeWins(data.wins),
      losses: normalizeLosses(data.losses),
      draws: normalizeDraws(data.draws),
      games: normalizeGames(data.games),
      xp: normalizeXp(data.xp)
    };
    updateProfileModalContent(playerId);
  };
  userStatsRef.on("value", userStatsListener);
}

function openCurrentUserProfile(event) {
  event?.preventDefault?.();
  ensurePlayerProfileForCurrentUser();
  startCurrentUserStatsListener();
  updateProfileModalContent();
  profileModal?.classList.remove("hidden");
}

function closeCurrentUserProfile() {
  profileModal?.classList.add("hidden");
}

function renderUserProfile() {
  if (!userInfo) return;
  userInfo.innerHTML = "";

  const profile = document.createElement("div");
  profile.className = "user-profile";

  if (currentUserPhotoUrl) {
    const avatar = document.createElement("img");
    avatar.className = "user-avatar";
    avatar.src = currentUserPhotoUrl;
    avatar.alt = currentUserName;
    profile.appendChild(avatar);
  } else {
    const avatarFallback = document.createElement("div");
    avatarFallback.className = "user-avatar user-avatar-fallback";
    avatarFallback.innerText = (Array.from(currentUserName || t("guestPlayer"))[0] || "G").toUpperCase();
    profile.appendChild(avatarFallback);
  }

  const fullName = document.createElement("button");
  fullName.type = "button";
  fullName.className = "user-name user-name-link";
  fullName.innerText = currentUserName || t("guestPlayer");
  fullName.setAttribute("aria-label", "Open player profile");
  fullName.addEventListener("click", openCurrentUserProfile);
  profile.appendChild(fullName);

  userInfo.appendChild(profile);
}

function applyTranslations() {
  document.title = t("appTitle");
  const createBtn = document.getElementById("createGame");
  const aiBtn = document.getElementById("playAI");
  const inviteButton = document.getElementById("inviteBtn");
  const restartButton = document.getElementById("restartBtn");
  const sendButton = document.getElementById("sendBtn");
  const settingsTitle = document.getElementById("settingsTitle");
  const languageLabel = document.getElementById("languageLabel");
  const aiModeLabel = document.getElementById("aiModeLabel");
  const aiModeSelect = document.getElementById("aiModeSelect");
  const difficultyLabel = document.getElementById("difficultyLabel");
  const difficultySelectOptions = document.querySelectorAll("#difficultySelect option");
  const aboutTitle = document.getElementById("aboutTitle");
  const developerText = document.getElementById("developerText");
  const telegramLabel = document.getElementById("telegramLabel");
  const backHomeButton = document.getElementById("backHomeBtn");
  const closeSettingsButton = document.getElementById("closeSettingsBtn");

  if (createBtn) createBtn.innerText = t("playFriend");
  if (aiBtn) aiBtn.innerText = t("playAI");
  if (inviteButton) inviteButton.innerText = t("invite");
  if (restartButton) restartButton.innerText = t("restart");
  if (sendButton) sendButton.innerText = t("send");
  if (settingsTitle) settingsTitle.innerText = t("settings");
  if (languageLabel) languageLabel.innerText = t("language");
  if (aiModeLabel) aiModeLabel.innerText = t("aiMode");
  if (aiModeSelect) {
    Array.from(aiModeSelect.options).forEach((option) => {
      option.text = t(`aiMode_${option.value}`);
    });
  }
  if (difficultyLabel) difficultyLabel.innerText = t("difficulty");
  if (difficultySelectOptions.length) {
    difficultySelectOptions.forEach((option) => {
      option.text = t(`aiMode_${option.value}`);
    });
  }
  // Update custom difficulty dropdown option labels
  if (difficultyDropdownEl) {
    difficultyDropdownEl.querySelectorAll(".difficulty-option").forEach((opt) => {
      opt.textContent = t(`aiMode_${opt.dataset.value}`);
    });
  }
  // Re-sync trigger text after language change
  updateDifficultyUI();
  if (aboutTitle) aboutTitle.innerText = t("about");
  if (developerText) developerText.innerText = t("developer");
  if (telegramLabel) telegramLabel.innerText = t("telegram");
  if (backHomeButton) backHomeButton.innerText = t("backHome");
  if (closeSettingsButton) closeSettingsButton.innerText = t("close");

  const navHomeLbl = document.getElementById("navHomeLbl");
  const navBattleLbl = document.getElementById("navBattleLbl");
  const navSettingsLbl = document.getElementById("navSettingsLbl");
  if (navHomeLbl) navHomeLbl.innerText = t("navHome");
  if (navBattleLbl) navBattleLbl.innerText = t("navBattle");
  if (navSettingsLbl) navSettingsLbl.innerText = t("navSettings");

  const battleStatusEl = document.getElementById("battleStatusText");
  if (battleStatusEl) battleStatusEl.innerText = t("searchingOpponent");
  const cancelBattleEl = document.getElementById("cancelBattleBtn");
  if (cancelBattleEl) cancelBattleEl.innerText = t("cancelSearch");

  if (chatInputEl) {
    chatInputEl.placeholder = t(currentChatPlaceholderKey);
  }

  renderUserProfile();
  updateStatus();
  updatePlayersText();
  updateDifficultyUI();
  if (messagesDiv) {
    if (!chatEnabled && gameMode === "ai") setChatEnabled(false, "chatDisabledAIPlaceholder");
    else renderMessages(currentMessages);
  }
}

// =======================
// 🧹 NORMALIZE ROOM DATA
// =======================
function normalizeRoomData(raw) {
  let board = ["","","","","","","","",""];
  if (Array.isArray(raw.board)) {
    board = raw.board;
  } else if (raw.board && typeof raw.board === "object") {
    board = Array.from({ length: 9 }, (_, i) => String(raw.board[i] || ""));
  }
  const normalizedPlayerXId = normalizePlayerId(raw.playerX ?? raw.players?.X?.id);
  const normalizedPlayerOId = normalizePlayerId(raw.playerO ?? raw.players?.O?.id);
  const normalizedPlayerXName = raw.players?.X?.name || t("playerX");
  const normalizedPlayerOName = raw.players?.O?.name || t("playerO");
  return {
    board,
    turn: raw.turn || null,
    winner: raw.winner || null,
    winningCells: Array.isArray(raw.winningCells) ? raw.winningCells : [],
    playerXWins: normalizeWins(raw.playerXWins),
    playerOWins: normalizeWins(raw.playerOWins),
    stats: {
      matchId: getCurrentMatchId(raw),
      awardedKey: typeof raw.stats?.awardedKey === "string" ? raw.stats.awardedKey : null
    },
    playerX: normalizedPlayerXId,
    playerO: normalizedPlayerOId,
    players: {
      X: normalizedPlayerXId ? {
        id: normalizedPlayerXId,
        name: normalizedPlayerXName
      } : null,
      O: normalizedPlayerOId ? {
        id: normalizedPlayerOId,
        name: normalizedPlayerOName
      } : null
    }
  };
}

// =======================
// 🔒 WRITE GUARD
// =======================
function canWrite() {
  return gameMode === "online" && !!roomRef && roomLoaded;
}

// =======================
// 🎛️ ACTION BUTTONS STATE
// =======================
function updateActionButtons() {
  if (!restartBtn) return;
  restartBtn.style.display = gameMode === "ai" ? "none" : "";
  if (gameMode === "online") {
    restartBtn.disabled = !roomLoaded || !myRole;
    // Chat is available for everyone in online rooms
    if (chatInputEl && sendBtnEl) {
      const canChat = !!roomLoaded;
      chatEnabled = canChat;
      chatInputEl.disabled = !canChat;
      sendBtnEl.disabled = !canChat;
      currentChatPlaceholderKey = canChat ? "typeMessage" : "chatUnavailable";
      chatInputEl.placeholder = t(currentChatPlaceholderKey);
    }
  } else {
    restartBtn.disabled = false;
  }
}

function openDifficultyDropdown() {
  if (!difficultyDropdownEl || !difficultyTriggerEl) return;
  difficultyDropdownEl.classList.add("open");
  difficultyTriggerEl.setAttribute("aria-expanded", "true");
}

function closeDifficultyDropdown() {
  if (!difficultyDropdownEl || !difficultyTriggerEl) return;
  difficultyDropdownEl.classList.remove("open");
  difficultyTriggerEl.setAttribute("aria-expanded", "false");
}

function updateDifficultyUI() {
  if (aiModeSelectEl) {
    aiModeSelectEl.value = normalizeAIMode(aiMode);
  }
  const normalizedMode = normalizeAIMode(aiMode);
  if (difficultyTriggerEl) {
    const label = t(`aiMode_${normalizedMode}`);
    const triggerText = difficultyTriggerEl.querySelector("#difficultyTriggerText");
    if (triggerText) triggerText.textContent = `${t("difficulty")}: ${label}`;
  }
  if (difficultyDropdownEl) {
    difficultyDropdownEl.querySelectorAll(".difficulty-option").forEach((opt) => {
      opt.classList.toggle("active", opt.dataset.value === normalizedMode);
      opt.setAttribute("aria-selected", opt.dataset.value === normalizedMode ? "true" : "false");
    });
  }
}

function resetAIGameBoardPreservingWins() {
  if (gameMode !== "ai") return;
  if (autoRestartTimer) {
    clearTimeout(autoRestartTimer);
    autoRestartTimer = null;
  }
  lastAutoRestartKey = "";
  aiResultAwarded = false;
  aiWinAwarded = false;
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];
  playerStats = createEmptyPlayerStats();
  aiThreatCellsBeforePlayerMove = [];
  updatePlayersText();
  updateStatus();
  renderBoard();
}

function changeAIMode(nextMode) {
  setAIMode(nextMode);
  if (gameMode === "ai") {
    resetAIGameBoardPreservingWins();
  }
}

// =======================
// 🚀 INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  syncTelegramUserContext();
  ensurePlayerProfileForCurrentUser();

  console.log("App Loaded ✅");

  // UI
  userInfo = document.getElementById("userInfo");
  boardDiv = document.getElementById("board");
  statusText = document.getElementById("statusText");
  playersDiv = document.getElementById("players");

  homeScreen = document.getElementById("homeScreen");
  gameScreen = document.getElementById("gameScreen");
  chatBoxEl = document.getElementById("chatBox");
  messagesDiv = document.getElementById("messages");
  chatInputEl = document.getElementById("chatInput");
  sendBtnEl = document.getElementById("sendBtn");

  const createBtn = document.getElementById("createGame");
  const aiBtn = document.getElementById("playAI");
  inviteBtn = document.getElementById("inviteBtn");
  restartBtn = document.getElementById("restartBtn");
  settingsModal = document.getElementById("settingsModal");
  profileModal = document.getElementById("profileModal");
  closeProfileBtn = document.getElementById("closeProfileBtn");
  profileNameValue = document.getElementById("profileNameValue");
  profileWinsValue = document.getElementById("profileWinsValue");
  profileLossesValue = document.getElementById("profileLossesValue");
  profileDrawsValue = document.getElementById("profileDrawsValue");
  profileGamesValue = document.getElementById("profileGamesValue");
  profileLevelValue = document.getElementById("profileLevelValue");
  profileXpValue = document.getElementById("profileXpValue");
  profileXpBarFill = document.getElementById("profileXpBarFill");
  profileXpPercentValue = document.getElementById("profileXpPercentValue");
  const settingsBtn = document.getElementById("settingsBtn");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const languageSelect = document.getElementById("languageSelect");
  aiModeSelectEl = document.getElementById("aiModeSelect");
  difficultyControlEl = document.getElementById("difficultyControl");
  difficultyTriggerEl = document.getElementById("difficultyTrigger");
  difficultyDropdownEl = document.getElementById("difficultyDropdown");
  const footerDeveloperLink = document.getElementById("footerDeveloperLink");
  const aboutTelegramLink = document.getElementById("aboutTelegramLink");

  // Bottom nav buttons
  const navHomeBtnEl = document.getElementById("navHomeBtn");
  const navBattleBtnEl = document.getElementById("navBattleBtn");
  const navSettingsBtnEl = document.getElementById("navSettingsBtn");
  // 🔥 BUTTON FIX (IMPORTANT)
  if (createBtn) createBtn.addEventListener("click", createGame);
  if (aiBtn) {
    aiBtn.onclick = startAIGame;
  }
  sendBtnEl.addEventListener("click", sendChatMessage);
  chatInputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChatMessage();
    }
  });
  setChatEnabled(false, "chatDisabledAIPlaceholder");
  inviteBtn.addEventListener("click", shareGame);
  restartBtn.addEventListener("click", restartGame);
  settingsBtn?.addEventListener("click", () => settingsModal?.classList.remove("hidden"));
  closeSettingsBtn?.addEventListener("click", () => settingsModal?.classList.add("hidden"));
  backHomeBtn?.addEventListener("click", () => {
    settingsModal?.classList.add("hidden");
    goHome();
  });
  closeProfileBtn?.addEventListener("click", closeCurrentUserProfile);
  profileModal?.addEventListener("click", (event) => {
    if (event.target === profileModal) closeCurrentUserProfile();
  });
  footerDeveloperLink?.addEventListener("click", openDeveloperTelegram);
  aboutTelegramLink?.addEventListener("click", openDeveloperTelegram);
  languageSelect?.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });
  aiModeSelectEl?.addEventListener("change", (event) => {
    changeAIMode(event.target.value);
  });
  difficultyTriggerEl?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = difficultyDropdownEl?.classList.contains("open");
    if (isOpen) {
      closeDifficultyDropdown();
    } else {
      openDifficultyDropdown();
    }
  });
  difficultyDropdownEl?.querySelectorAll(".difficulty-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      const selectedValue = opt.dataset.value;
      setAIMode(selectedValue);
      closeDifficultyDropdown();
      if (gameMode === "ai") {
        setTimeout(resetAIGameBoardPreservingWins, DIFFICULTY_CHANGE_ANIMATION_DELAY_MS);
      }
    });
  });
  document.addEventListener("click", (event) => {
    if (
      difficultyDropdownEl?.classList.contains("open") &&
      difficultyControlEl &&
      !difficultyControlEl.contains(event.target)
    ) {
      closeDifficultyDropdown();
    }
  });

  // 🧭 Bottom nav
  navHomeBtnEl?.addEventListener("click", () => {
    hideBattleOverlay();
    goHome();
  });
  navBattleBtnEl?.addEventListener("click", startBattleMatchmaking);
  navSettingsBtnEl?.addEventListener("click", () => {
    setBottomNavActive("settings");
    settingsModal?.classList.remove("hidden");
  });
  settingsModal?.addEventListener("click", (event) => {
    if (event.target === settingsModal) {
      settingsModal.classList.add("hidden");
      setBottomNavActive(gameScreen && gameScreen.style.display !== "none" ? "home" : "home");
    }
  });
  const cancelBattleBtnEl = document.getElementById("cancelBattleBtn");
  if (cancelBattleBtnEl) {
    cancelBattleBtnEl.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      cancelBattleSearch();
    }, { capture: true });
  }

  if (languageSelect) {
    languageSelect.value = lang;
  }
  setAIMode(getInitialAIMode(), false);
  setLanguage(lang, false);

  const initialRoomId = getRoomIdFromLocation();
  autoJoinRoomFromLocation(initialRoomId);
  maybeStartFirstGameExperience(initialRoomId);
  window.addEventListener("hashchange", autoJoinRoomFromLocation);
});

function getRoomIdFromLocation() {
  const hash = window.location.hash || "";
  const hashMatch = hash.match(/(?:^#|[?&])room=([^&]+)/);
  if (hashMatch && hashMatch[1]) return decodeURIComponent(hashMatch[1]);

  const roomFromQuery = new URLSearchParams(window.location.search).get("room");
  if (roomFromQuery) return roomFromQuery;

  return null;
}

function autoJoinRoomFromLocation(prefetchedRoomId) {
  if (!db) return;
  const detectedRoomId = prefetchedRoomId || getRoomIdFromLocation();
  if (!detectedRoomId) return;
  if (roomId === detectedRoomId && roomRef) return;

  stopRoomListener();
  stopChatListener();

  roomId = detectedRoomId;
  roomRef = db.ref("rooms/" + roomId);
  gameMode = "online";
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];
  roomLoaded = false;
  myRole = null;
  hasShownRoomFullToast = false;
  window.currentRoomData = null;

  showGame();
  setInviteButtonState();
  listenRoom();

  console.log("Joined Room:", roomId);
}

function maybeStartFirstGameExperience(prefetchedRoomId) {
  if (prefetchedRoomId || getRoomIdFromLocation()) return;
  let hasSeenFirstGame;
  try {
    hasSeenFirstGame = localStorage.getItem(FIRST_TIME_EXPERIENCE_KEY) === "true";
  } catch (err) {
    hasSeenFirstGame = false;
  }
  if (hasSeenFirstGame) return;
  try {
    localStorage.setItem(FIRST_TIME_EXPERIENCE_KEY, "true");
  } catch (err) {
    console.warn("Unable to persist first-time experience key:", err);
  }
  startAIGame();
}

function clearRoomExpiryRedirectTimer() {
  if (!roomExpiryRedirectTimer) return;
  clearTimeout(roomExpiryRedirectTimer);
  roomExpiryRedirectTimer = null;
}

function isRoomExpired(roomData) {
  const createdAt = Number(roomData?.createdAt);
  if (!Number.isFinite(createdAt)) return false; // Allow old rooms without createdAt
  return Date.now() - createdAt > ROOM_EXPIRE_MS;
}

function handleRoomUnavailable(message, delayMs = 0) {
  stopRoomListener();
  stopChatListener();
  showToast(message);
  clearRoomExpiryRedirectTimer();
  if (delayMs > 0) {
    roomExpiryRedirectTimer = setTimeout(() => {
      goHome();
    }, delayMs);
    return;
  }
  goHome();
}

// =======================
// 🧭 BOTTOM NAV
// =======================
function setBottomNavActive(tab) {
  const homeBtn2 = document.getElementById("navHomeBtn");
  const battleBtn = document.getElementById("navBattleBtn");
  const settingsBtn2 = document.getElementById("navSettingsBtn");
  [homeBtn2, battleBtn, settingsBtn2].forEach((btn) => {
    if (btn) btn.classList.remove("nav-btn-active");
  });
  if (tab === "home" && homeBtn2) homeBtn2.classList.add("nav-btn-active");
  if (tab === "battle" && battleBtn) battleBtn.classList.add("nav-btn-active");
  if (tab === "settings" && settingsBtn2) settingsBtn2.classList.add("nav-btn-active");
}

// =======================
// ⚔️ JOIN ROOM BY ID
// =======================
function joinRoomById(id) {
  if (!db || !id) return;
  stopRoomListener();
  stopChatListener();
  roomId = id;
  roomRef = db.ref("rooms/" + roomId);
  gameMode = "online";
  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];
  roomLoaded = false;
  myRole = null;
  hasShownRoomFullToast = false;
  window.currentRoomData = null;
  showGame();
  setInviteButtonState();
  listenRoom();
}

// =======================
// ⚔️ BATTLE MATCHMAKING
// =======================
function showBattleOverlay() {
  const modal = document.getElementById("battleModal");
  if (modal) modal.classList.remove("hidden");
  setBottomNavActive("battle");
  const statusEl = document.getElementById("battleStatusText");
  if (statusEl) statusEl.innerText = t("searchingOpponent");
  const subEl = document.getElementById("battleSubText");
  if (subEl) subEl.innerText = "Finding a random player for you";
  const cancelBtn = document.getElementById("cancelBattleBtn");
  if (cancelBtn) cancelBtn.innerText = t("cancelSearch");
}

function hideBattleOverlay() {
  const modal = document.getElementById("battleModal");
  if (modal) modal.classList.add("hidden");
}

function cleanupBattleMatchmaking() {
  inBattleQueue = false;

  // Cancel 3-second fallback timer
  if (battleFallbackTimer) {
    clearTimeout(battleFallbackTimer);
    battleFallbackTimer = null;
  }

  // Cancel Player O room-search timeout
  if (battleRoomSearchTimeout) {
    clearTimeout(battleRoomSearchTimeout);
    battleRoomSearchTimeout = null;
  }

  // Stop general queue listener
  if (battleQueueListenerRef && battleQueueListenerFn) {
    battleQueueListenerRef.off("value", battleQueueListenerFn);
    battleQueueListenerFn = null;
  }
  battleQueueListenerRef = null;

  // Stop Player O room-search listener
  if (battleRoomSearchRef && battleRoomPlayerOListener) {
    battleRoomSearchRef.off("value", battleRoomPlayerOListener);
    battleRoomPlayerOListener = null;
  }
  battleRoomSearchRef = null;

  // Remove own queue entry
  if (battleQueueRef) {
    battleQueueRef.cancelOnDisconnect().catch(() => {});
    battleQueueRef.remove().catch((err) => {
      console.warn("Failed removing queue entry:", err);
    });
    battleQueueRef = null;
  }

  // Legacy matchmaking entry cleanup (kept for any in-flight legacy ops)
  if (battleMatchmakingRef) {
    battleMatchmakingRef.remove().catch((err) => {
      console.warn("Failed removing matchmaking entry:", err);
    });
    battleMatchmakingRef = null;
  }
}

function cancelBattleSearch() {
  cleanupBattleMatchmaking();
  hideBattleOverlay();
  setTimeout(goHome, 80);
}

function tryMatchWithCandidates(candidates, index, resolvedUserId) {
  if (index >= candidates.length) {
    createAndWaitForBattleOpponent(resolvedUserId);
    return;
  }
  const candidate = candidates[index];
  candidate.ref.transaction((current) => {
    if (current === null) return;
    return null;
  }, (err, committed, snapshot) => {
    if (err || !committed) {
      tryMatchWithCandidates(candidates, index + 1, resolvedUserId);
      return;
    }
    const opponentRoomId = (snapshot && snapshot.val()?.roomId) || candidate.val.roomId;
    if (!opponentRoomId) {
      tryMatchWithCandidates(candidates, index + 1, resolvedUserId);
      return;
    }
    hideBattleOverlay();
    joinRoomById(opponentRoomId);
  });
}

function createAndWaitForBattleOpponent(resolvedUserId) {
  const newRoomId = generateRoomId();
  const newRoomRef = db.ref("rooms/" + newRoomId);

  newRoomRef.set({
    playerX: resolvedUserId,
    playerO: null,
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: [],
    playerXWins: 0,
    playerOWins: 0,
    createdAt: Date.now(),
    stats: { matchId: 1, awardedKey: null },
    players: {
      X: { id: resolvedUserId, name: currentUserName || t("guestPlayer") },
      O: null
    }
  }).then(() => {
    battleMatchmakingRef = db.ref("matchmaking/" + resolvedUserId);
    return battleMatchmakingRef.set({ roomId: newRoomId, ts: Date.now() });
  }).then(() => {
    roomId = newRoomId;
    roomRef = newRoomRef;
    battleRoomPlayerOListener = newRoomRef.child("playerO").on("value", (snap) => {
      if (snap.val()) {
        newRoomRef.child("playerO").off("value", battleRoomPlayerOListener);
        battleRoomPlayerOListener = null;
        cleanupBattleMatchmaking();
        hideBattleOverlay();
        gameMode = "online";
        board = ["","","","","","","","",""];
        currentPlayer = "X";
        winner = null;
        winningCells = [];
        roomLoaded = false;
        myRole = null;
        hasShownRoomFullToast = false;
        window.currentRoomData = null;
        showGame();
        setInviteButtonState();
        listenRoom();
      }
    });
  }).catch((err) => {
    console.error("Battle room creation failed:", err);
    hideBattleOverlay();
    setBottomNavActive("home");
    showToast(t("failedCreateRoom"));
  });
}

function startBattleMatchmaking() {
  if (!db) {
    showToast(t("failedCreateRoom"));
    return;
  }
  const resolvedUserId = ensureNormalizedUserId();
  if (!resolvedUserId) {
    showToast(t("unableVerifyIdentity"));
    return;
  }

  // Detach all existing listeners and clean up prior battle state
  cleanupBattleMatchmaking();
  stopRoomListener();
  stopChatListener();

  inBattleQueue = true;

  // Write own entry to queue/{userId}
  battleQueueRef = db.ref("queue/" + resolvedUserId);
  const serverTs = window.firebase?.database?.ServerValue?.TIMESTAMP || Date.now();
  battleQueueRef.set({
    userId: resolvedUserId,
    country: "unknown",
    timestamp: serverTs,
    status: "waiting"
  }).catch((err) => {
    console.warn("Failed writing queue entry:", err);
  });

  // Automatically remove on disconnect/reload
  battleQueueRef.onDisconnect().remove();

  // Show "Searching for opponent…" overlay
  showBattleOverlay();
  const statusEl = document.getElementById("battleStatusText");
  if (statusEl) statusEl.innerText = t("searchingOpponent");

  // 3-second bot fallback timer (EXACTLY BATTLE_MATCHMAKING_WINDOW_MS)
  battleFallbackTimer = setTimeout(() => {
    battleFallbackTimer = null;
    if (!inBattleQueue) return;
    handleBattleBotFallback(resolvedUserId);
  }, BATTLE_MATCHMAKING_WINDOW_MS);

  // Real-time queue listener — look for a waiting opponent
  battleQueueListenerRef = db.ref("queue").orderByChild("timestamp").limitToFirst(20);
  battleQueueListenerFn = (snapshot) => {
    if (!inBattleQueue) return;
    let found = false;
    snapshot.forEach((child) => {
      if (found || !inBattleQueue) return;
      const entry = child.val();
      if (!entry) return;
      const entryUserId = String(entry.userId || child.key);
      if (entryUserId === resolvedUserId) return;
      if (entry.status !== "waiting") return;
      // Opponent found before 3 seconds!
      found = true;
      inBattleQueue = false;
      if (battleFallbackTimer) {
        clearTimeout(battleFallbackTimer);
        battleFallbackTimer = null;
      }
      if (battleQueueListenerRef && battleQueueListenerFn) {
        battleQueueListenerRef.off("value", battleQueueListenerFn);
        battleQueueListenerFn = null;
      }
      battleQueueListenerRef = null;
      handleBattleMatchFound(resolvedUserId, entryUserId);
    });
  };
  battleQueueListenerRef.on("value", battleQueueListenerFn);
}

// ---------------------------------------------------------------------------
// Handle a real-player match being found in the queue
// Role: smaller userId string = Player X (room creator); larger = Player O
// ---------------------------------------------------------------------------
function handleBattleMatchFound(myUserId, opponentId) {
  const iAmPlayerX = myUserId < opponentId;

  if (iAmPlayerX) {
    // ── PLAYER X: create the room and signal Player O via their queue entry ──
    const newRoomId = generateRoomId();
    const newRoomRef = db.ref("rooms/" + newRoomId);

    newRoomRef.set({
      playerX: myUserId,
      playerO: opponentId,
      board: ["","","","","","","","",""],
      turn: "X",
      winner: null,
      winningCells: [],
      playerXWins: 0,
      playerOWins: 0,
      createdAt: Date.now(),
      stats: { matchId: 1, awardedKey: null },
      players: {
        X: { id: myUserId, name: currentUserName || t("guestPlayer") },
        O: { id: opponentId, name: t("playerO") }
      }
    }).then(() => {
      // Write roomId into opponent's queue entry so Player O can find the room
      const updates = {};
      updates["queue/" + opponentId + "/status"] = "matched";
      updates["queue/" + opponentId + "/roomId"] = newRoomId;
      return db.ref().update(updates);
    }).then(() => {
      // Remove own queue entry immediately
      if (battleQueueRef) {
        battleQueueRef.cancelOnDisconnect().catch(() => {});
        battleQueueRef.remove().catch(() => {});
        battleQueueRef = null;
      }
      // Remove opponent's queue entry after a short delay (gives Player O time to read roomId)
      setTimeout(() => {
        db.ref("queue/" + opponentId).remove().catch(() => {});
      }, OPPONENT_QUEUE_CLEANUP_DELAY_MS);

      hideBattleOverlay();
      roomId = newRoomId;
      roomRef = newRoomRef;
      gameMode = "online";
      board = ["","","","","","","","",""];
      currentPlayer = "X";
      winner = null;
      winningCells = [];
      roomLoaded = false;
      myRole = null;
      hasShownRoomFullToast = false;
      window.currentRoomData = null;
      showGame();
      setInviteButtonState();
      listenRoom();
    }).catch((err) => {
      console.error("Battle room creation failed:", err);
      hideBattleOverlay();
      setBottomNavActive("home");
      showToast(t("failedCreateRoom"));
    });

  } else {
    // ── PLAYER O: mark own queue entry and wait for Player X to signal roomId ──
    if (battleQueueRef) {
      battleQueueRef.update({ status: "matched_waiting" }).catch(() => {});
    }

    const myQueueRef = db.ref("queue/" + myUserId);

    // Guard: if Player X never creates the room within PLAYER_O_ROOM_WAIT_TIMEOUT_MS
    battleRoomSearchTimeout = setTimeout(() => {
      if (battleRoomSearchRef && battleRoomPlayerOListener) {
        battleRoomSearchRef.off("value", battleRoomPlayerOListener);
        battleRoomPlayerOListener = null;
      }
      battleRoomSearchRef = null;
      battleRoomSearchTimeout = null;
      if (battleQueueRef) {
        battleQueueRef.remove().catch(() => {});
        battleQueueRef = null;
      }
      hideBattleOverlay();
      setBottomNavActive("home");
      showToast(t("failedCreateRoom"));
    }, PLAYER_O_ROOM_WAIT_TIMEOUT_MS);

    battleRoomPlayerOListener = (snap) => {
      const data = snap.val();
      if (!data || !data.roomId) return;

      // Room found — clean up watchers
      clearTimeout(battleRoomSearchTimeout);
      battleRoomSearchTimeout = null;
      myQueueRef.off("value", battleRoomPlayerOListener);
      battleRoomPlayerOListener = null;
      battleRoomSearchRef = null;

      const foundRoomId = String(data.roomId);

      // Remove own queue entry
      myQueueRef.remove().catch(() => {});
      if (battleQueueRef) {
        battleQueueRef.cancelOnDisconnect().catch(() => {});
        battleQueueRef = null;
      }

      hideBattleOverlay();
      roomId = foundRoomId;
      roomRef = db.ref("rooms/" + foundRoomId);
      gameMode = "online";
      board = ["","","","","","","","",""];
      currentPlayer = "X";
      winner = null;
      winningCells = [];
      roomLoaded = false;
      myRole = null;
      hasShownRoomFullToast = false;
      window.currentRoomData = null;
      showGame();
      setInviteButtonState();
      listenRoom();
    };

    battleRoomSearchRef = myQueueRef;
    myQueueRef.on("value", battleRoomPlayerOListener);
  }
}

// ---------------------------------------------------------------------------
// Bot fallback — triggered when no real opponent appears within 3 seconds
// ---------------------------------------------------------------------------
function handleBattleBotFallback(resolvedUserId) {
  inBattleQueue = false;

  // Clean up queue entry and listeners
  if (battleQueueRef) {
    battleQueueRef.cancelOnDisconnect().catch(() => {});
    battleQueueRef.remove().catch(() => {});
    battleQueueRef = null;
  }
  if (battleQueueListenerRef && battleQueueListenerFn) {
    battleQueueListenerRef.off("value", battleQueueListenerFn);
    battleQueueListenerFn = null;
  }
  battleQueueListenerRef = null;

  // Generate bot identity
  const botNames = [
    "Alex","Mia","Luca","Sara","Omar","Yuki","Priya",
    "Tom","Elena","Kai","Zara","Finn","Leila","Marco",
    "Aiko","Ryan","Nora","Diego","Hana","James"
  ];
  const botCountries = {
    US:"🇺🇸", GB:"🇬🇧", DE:"🇩🇪", FR:"🇫🇷", JP:"🇯🇵",
    BR:"🇧🇷", IN:"🇮🇳", AU:"🇦🇺", CA:"🇨🇦", KR:"🇰🇷",
    MX:"🇲🇽", IT:"🇮🇹", ES:"🇪🇸", NL:"🇳🇱", TR:"🇹🇷",
    AR:"🇦🇷", PL:"🇵🇱", SE:"🇸🇪", ZA:"🇿🇦", NG:"🇳🇬"
  };
  const botName = botNames[Math.floor(Math.random() * botNames.length)];
  const allCodes = Object.keys(botCountries);
  const botCode = allCodes[Math.floor(Math.random() * allCodes.length)];
  const botFlag = botCountries[botCode];
  battleBotName = botName + " " + botFlag;
  window._battleBotName = battleBotName;

  // Step 1 (0ms): Update status text
  const statusEl = document.getElementById("battleStatusText");
  if (statusEl) statusEl.innerText = t("noPlayersFoundBot");

  // Step 2 (600ms): Hide overlay, start AI game
  setTimeout(() => {
    hideBattleOverlay();
  }, 600);

  setTimeout(() => {
    startAIGame();
  }, 1100);
}

// =======================
// CREATE GAME
// =======================
function createGame() {
  if (!db) {
    showToast(t("failedCreateRoom"));
    console.warn("Online mode unavailable because Firebase is not initialized.");
    return;
  }
  if (!normalizedUserId) {
    showToast(t("unableVerifyIdentity"));
    return;
  }

  console.log("Create Game Clicked");

  gameMode = "online";

  roomId = generateRoomId();
  roomRef = db.ref("rooms/" + roomId);

  roomRef.set({
    playerX: normalizedUserId,
    playerO: null,
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: [],
    playerXWins: 0,
    playerOWins: 0,
    createdAt: Date.now(),
    stats: {
      matchId: 1,
      awardedKey: null
    },
    players: {
      X: {
        id: normalizedUserId,
        name: currentUserName || t("guestPlayer")
      },
      O: null
    }
  }).catch(err => {
    console.error("Create game failed:", err);
    showToast(t("failedCreateRoom"));
  });

  showGame();
  setInviteButtonState();
  listenRoom();
  shareGame();
}

// =======================
// 🤖 AI MODE
// =======================
function startAIGame() {
  // Do not clear battleBotName here — bot fallback sets it before calling us
  console.log("AI CLICKED");

  stopRoomListener();
  stopChatListener();
  roomId = null;
  roomRef = null;
  window.currentRoomData = null;

  gameMode = "ai";
  if (!battleBotName) setAIMode("easy");
  aiResultAwarded = false;
  aiWinAwarded = false;

  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];
  playerStats = createEmptyPlayerStats();
  aiThreatCellsBeforePlayerMove = [];
  lastAutoRestartKey = "";
  if (autoRestartTimer) {
    clearTimeout(autoRestartTimer);
    autoRestartTimer = null;
  }
  showGame();
  document.body.classList.add("ai-mode");

  const chat = document.getElementById("chatBox");
  if (chat) chat.style.display = "none";

  setChatEnabled(false, "chatDisabledAIPlaceholder");
  setChatVisibility(false);
  setInviteButtonState();
  updatePlayersText();
  updateActionButtons();
  updateStatus();
  renderBoard();
}

window.startAIGame = startAIGame;

// 📩 Invite visibility
function setInviteButtonState() {
  if (!inviteBtn) return;
  const isOnlineMode = gameMode === "online";
  const isAIMode = gameMode === "ai";
  inviteBtn.style.display = isOnlineMode ? "" : "none";
  if (chatBoxEl) chatBoxEl.style.display = isOnlineMode ? "" : "none";
  if (difficultyControlEl) {
    difficultyControlEl.classList.toggle("hidden", !isAIMode);
  }
  updateDifficultyUI();
  setChatVisibility(isOnlineMode);
  updatePostGameActionLabels();
}

function hasGameEnded() {
  return winner === "X" || winner === "O" || winner === "draw";
}

function updatePostGameActionLabels() {
  if (restartBtn) restartBtn.innerText = t("restart");
  if (inviteBtn) inviteBtn.innerText = t("invite");
}

function updatePlayersText() {
  if (!playersDiv) return;
  const data = window.currentRoomData;
  const isAIMode = gameMode === "ai";
  const currentUserId = ensureNormalizedUserId();
  const xId = normalizePlayerId(data?.playerX ?? data?.players?.X?.id);
  const oId = normalizePlayerId(data?.playerO ?? data?.players?.O?.id);
  const hasDuplicateIdentity = !!(xId && oId && xId === oId);
  const x = isAIMode
    ? t("labelYou")
    : (xId
      ? `${xId === currentUserId ? t("labelYou") : t("labelFriend")} (X)`
      : t("playerX"));
  const o = isAIMode
    ? (battleBotName || t("labelComputer"))
    : (oId && !hasDuplicateIdentity
      ? `${oId === currentUserId ? t("labelYou") : t("labelFriend")} (O)`
      : t("waiting"));
  const xWins = isAIMode ? aiWins.player : normalizeWins(data?.playerXWins);
  const oWins = isAIMode ? aiWins.computer : normalizeWins(data?.playerOWins);

  playersDiv.innerHTML = "";

  const xBlock = document.createElement("div");
  xBlock.className = "player-stat-block";
  const xName = document.createElement("div");
  xName.className = "player-name-line";
  xName.innerText = `❌ ${x}`;
  const xWinsText = document.createElement("div");
  xWinsText.className = "player-wins-line";
  xWinsText.innerText = `${t("winsLabel")}: ${xWins}`;
  xBlock.appendChild(xName);
  xBlock.appendChild(xWinsText);

  const oBlock = document.createElement("div");
  oBlock.className = "player-stat-block";
  const oName = document.createElement("div");
  oName.className = "player-name-line";
  oName.innerText = `⭕ ${o}`;
  const oWinsText = document.createElement("div");
  oWinsText.className = "player-wins-line";
  oWinsText.innerText = `${t("winsLabel")}: ${oWins}`;
  oBlock.appendChild(oName);
  oBlock.appendChild(oWinsText);

  playersDiv.appendChild(xBlock);
  playersDiv.appendChild(oBlock);
}

// =======================
// 👀 LISTEN ROOM
// =======================
function listenRoom() {
  if (!roomRef) return;

  if (roomValueListener) {
    roomRef.off("value", roomValueListener);
  }

  hasAttemptedJoin = false;
  isJoinAttemptInFlight = false;

  roomValueListener = (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      handleRoomUnavailable(t("gameNotFound"));
      return;
    }

    if (isRoomExpired(data)) {
      handleRoomUnavailable(t("gameExpired"), ROOM_EXPIRED_REDIRECT_DELAY_MS);
      if (roomRef) {
        roomRef.remove().catch((error) => {
          console.warn("Failed to remove expired room:", error);
        });
      }
      return;
    }

    const resolvedUserId = ensureNormalizedUserId();
    const resolvedPlayerXId = normalizePlayerId(data.playerX ?? data.players?.X?.id);
    const resolvedPlayerOId = normalizePlayerId(data.playerO ?? data.players?.O?.id);

    const rootNeedsSync = normalizePlayerId(data.playerX) !== resolvedPlayerXId
      || normalizePlayerId(data.playerO) !== resolvedPlayerOId;
    if (rootNeedsSync && resolvedPlayerXId) {
      roomRef.update({
        playerX: resolvedPlayerXId,
        playerO: resolvedPlayerOId || null
      }).catch((error) => {
        console.warn("Failed syncing room identity fields:", error);
      });
    }

    const isCreator = resolvedPlayerXId === resolvedUserId;
    const isOpponent = resolvedPlayerOId === resolvedUserId;
    const isKnownPlayer = isCreator || isOpponent;
    const isRoomFull = !!(resolvedPlayerXId && resolvedPlayerOId);

    if (!isRoomFull || isKnownPlayer) {
      hasShownRoomFullToast = false;
    }

    // Assign Player O only to a different user when slot is empty
    if (!resolvedPlayerOId && resolvedPlayerXId && !isCreator && !isOpponent) {
      if (!hasAttemptedJoin && !isJoinAttemptInFlight) {
        isJoinAttemptInFlight = true;
        roomRef.transaction((currentRoom) => {
          if (!currentRoom?.players?.X) return currentRoom;
          const currentPlayerXId = normalizePlayerId(currentRoom.playerX ?? currentRoom.players?.X?.id);
          const currentPlayerOId = normalizePlayerId(currentRoom.playerO ?? currentRoom.players?.O?.id);
          // Defensive re-check inside transaction for race safety across concurrent joiners.
          if (!currentPlayerXId || currentPlayerXId === resolvedUserId || currentPlayerOId) {
            return currentRoom;
          }
          const nextRoom = { ...currentRoom };
          nextRoom.playerX = currentPlayerXId;
          nextRoom.playerO = resolvedUserId;
          nextRoom.players = { ...(currentRoom.players || {}) };
          nextRoom.players.X = currentRoom.players.X || {
            id: currentPlayerXId,
            name: t("playerX")
          };
          nextRoom.players.O = {
            id: resolvedUserId,
            name: currentUserName || t("playerO")
          };
          return nextRoom;
        }, (err, committed) => {
          isJoinAttemptInFlight = false;
          hasAttemptedJoin = true;
          if (err) {
            console.error("Failed assigning Player O:", err);
            return;
          }
          if (committed) {
            console.log("Successfully assigned Player O:", resolvedUserId);
          }
        });
      }

      return; // ⛔ wait for next update after transaction completes
    }

    if (isRoomFull && !isKnownPlayer && !hasShownRoomFullToast) {
      hasShownRoomFullToast = true;
      showToast(t("roomFull"));
    }

    // ✅ NORMAL GAME FLOW
    const normalizedData = normalizeRoomData(data);
    window.currentRoomData = normalizedData;
    roomLoaded = true;

    board = normalizedData.board;
    currentPlayer = normalizedData.turn;
    winner = normalizedData.winner;
    winningCells = normalizedData.winningCells;

    // Derive this user's role from room data
    const currentUserId = resolvedUserId;
    const xId = normalizePlayerId(normalizedData.players.X?.id);
    const oId = normalizePlayerId(normalizedData.players.O?.id);
    if (xId && xId === currentUserId) myRole = "X";
    else if (oId && oId === currentUserId) myRole = "O";
    else myRole = null;

    console.log("join debug: userId =", currentUserId);
    console.log("join debug: players.X.id =", xId);
    console.log("join debug: players.O.id =", oId);

    subscribeToPlayerStats(normalizedData);
    maybeAwardMatchStats(normalizedData);
    updatePlayersText();

    updateStatus();
    renderBoard();
    updateActionButtons();
  };

  roomRef.on("value", roomValueListener);

  startChatListener();
  setChatEnabled(true, "typeMessage");
}

// =======================
// 🎯 GAME LOGIC
// =======================
function checkWinner(b) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let combo of wins) {
    const [a,b1,c] = combo;
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return { winner: b[a], cells: combo };
    }
  }

  if (b.every(x => x !== "")) return { winner: "draw", cells: [] };

  return null;
}

// =======================
// RENDER
// =======================
function renderBoard() {
  boardDiv.innerHTML = "";

  board.forEach((cell, i) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.innerText = cell;

    if (winningCells.includes(i)) {
      btn.classList.add("winning");
    }

    let disabled;
    if (gameMode === "ai") {
      // Disable when cell is filled, game over, or AI is thinking
      disabled = !!(cell || winner || currentPlayer === "O");
    } else {
      // Disable when: cell filled, game over, room not ready, spectator, or wrong turn
      disabled = !!(cell || winner || !roomLoaded || !myRole || myRole !== currentPlayer);
    }

    btn.disabled = disabled;
    btn.onclick = () => makeMove(i);

    boardDiv.appendChild(btn);
  });
}

// =======================
// ✍️ MOVE
// =======================
function makeMove(i) {
  if (board[i] !== "" || winner) return;

  if (gameMode === "ai") {
    aiThreatCellsBeforePlayerMove = getImmediateWinningMoves("O");
    board[i] = "X";
    trackPlayerMove(i);

    let res = checkWinner(board);
    if (res) {
      winner = res.winner;
      winningCells = res.cells;
      maybeAwardAIMatchStats();
    } else {
      currentPlayer = "O";
      setTimeout(aiMove, getAIMoveDelayMs());
    }

    updateStatus();
    renderBoard();
    return;
  }

  // Online mode guards
  if (!roomLoaded || !roomRef) return;
  if (!myRole) { showToast(t("youAreSpectating")); return; }
  if (myRole !== currentPlayer) { showToast(t("notYourTurn")); return; }
  if (winner) return;

  const newBoard = [...board];
  newBoard[i] = myRole;

  const res = checkWinner(newBoard);

  if (res) {
    const firebaseIncrement = window.firebase?.database?.ServerValue?.increment;
    const winnerCounterKey = res.winner === "X"
      ? "playerXWins"
      : (res.winner === "O" ? "playerOWins" : null);
    const winnerCounterUpdate = {};
    if (winnerCounterKey && typeof firebaseIncrement === "function") {
      winnerCounterUpdate[winnerCounterKey] = firebaseIncrement(1);
    }
    roomRef.update({
      board: newBoard,
      winner: res.winner,
      winningCells: res.cells,
      turn: null,
      ...winnerCounterUpdate
    }).then(() => {
      if (!winnerCounterKey || typeof firebaseIncrement === "function") return null;
      return roomRef.child(winnerCounterKey).transaction((value) => normalizeWins(value) + 1);
    }).catch(err => {
      console.error("Move failed:", err);
      showToast(t("moveFailed"));
    });
  } else {
    roomRef.update({
      board: newBoard,
      turn: myRole === "X" ? "O" : "X"
    }).catch(err => {
      console.error("Move failed:", err);
      showToast(t("moveFailed"));
    });
  }
}

function getPlayerSymbol() {
  const data = window.currentRoomData;
  if (!data || !data.players) return null;
  const xId = normalizePlayerId(data.players.X?.id);
  const oId = normalizePlayerId(data.players.O?.id);
  if (xId && xId === normalizedUserId) return "X";
  if (oId && oId === normalizedUserId) return "O";
  return null;
}

function normalizePlayerId(id) {
  if (id === null || id === undefined) return null;
  return String(id);
}

// 🤖 AI MOVE
function getAIMoveDelayMs() {
  return AI_DELAY_MIN_MS + Math.round(Math.random() * (AI_DELAY_MAX_MS - AI_DELAY_MIN_MS));
}

function getEmptyCells(boardState = board) {
  return boardState
    .map((value, index) => (value === "" ? index : null))
    .filter((index) => index !== null);
}

function getImmediateWinningMoves(symbol, boardState = board) {
  const wins = [];
  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] !== "") continue;
    const testBoard = [...boardState];
    testBoard[i] = symbol;
    const result = checkWinner(testBoard);
    if (result?.winner === symbol) wins.push(i);
  }
  return wins;
}

function findBestMove(symbol, boardState = board) {
  const wins = getImmediateWinningMoves(symbol, boardState);
  return wins.length ? wins[0] : null;
}

function getRandomMove(boardState = board) {
  const empty = getEmptyCells(boardState);
  if (!empty.length) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function getSmartPositionMove(boardState = board) {
  if (boardState[4] === "" && Math.random() < CENTER_PREFERENCE_RATE) return 4;
  const corners = [0, 2, 6, 8].filter((index) => boardState[index] === "");
  if (corners.length && Math.random() < CORNER_PREFERENCE_RATE) {
    return corners[Math.floor(Math.random() * corners.length)];
  }
  return getRandomMove(boardState);
}

function minimax(boardState, depth, isMaximizing, alpha, beta) {
  const result = checkWinner(boardState);
  if (result?.winner === "O") return 10 - depth;
  if (result?.winner === "X") return depth - 10;
  if (result?.winner === "draw") return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const index of getEmptyCells(boardState)) {
      boardState[index] = "O";
      const evalScore = minimax(boardState, depth + 1, false, alpha, beta);
      boardState[index] = "";
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  }

  let minEval = Infinity;
  for (const index of getEmptyCells(boardState)) {
    boardState[index] = "X";
    const evalScore = minimax(boardState, depth + 1, true, alpha, beta);
    boardState[index] = "";
    minEval = Math.min(minEval, evalScore);
    beta = Math.min(beta, evalScore);
    if (beta <= alpha) break;
  }
  return minEval;
}

function getMinimaxMove(boardState = board) {
  const empty = getEmptyCells(boardState);
  if (!empty.length) return null;

  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const index of empty) {
    const testBoard = [...boardState];
    testBoard[index] = "O";
    const score = minimax(testBoard, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}

function getMediumMove(boardState = board) {
  const winMove = findBestMove("O", boardState);
  if (winMove !== null) return winMove;

  const blockMove = findBestMove("X", boardState);
  if (blockMove !== null && Math.random() >= MEDIUM_BLOCK_SKIP_RATE) return blockMove;

  if (Math.random() < MEDIUM_RANDOM_RATE) return getRandomMove(boardState);
  return getSmartPositionMove(boardState);
}

function getEasyMove(boardState = board) {
  if (Math.random() < EASY_MISTAKE_RATE) {
    return getRandomMove(boardState);
  }
  return getMediumMove(boardState);
}

function getHardMove(boardState = board) {
  if (Math.random() < HARD_MISTAKE_RATE) {
    return getMediumMove(boardState);
  }
  return getMinimaxMove(boardState);
}

function trackPlayerMove(index) {
  if (gameMode !== "ai") return;
  playerStats.totalMoves += 1;
  if (playerStats.totalMoves === 1 && index === 4) {
    playerStats.centerFirst += 1;
  }
  if ([0, 2, 6, 8].includes(index)) {
    playerStats.cornerMoves += 1;
  }
  if (aiThreatCellsBeforePlayerMove.includes(index)) {
    playerStats.blockMoves += 1;
  }
  aiThreatCellsBeforePlayerMove = [];
}

function detectStyle(stats) {
  if (stats.totalMoves < 3) return "random";
  const totalMoves = stats.totalMoves;
  const cornerRate = stats.cornerMoves / totalMoves;
  const blockRate = stats.blockMoves / totalMoves;
  if (stats.blockMoves >= MIN_BLOCKS_FOR_DEFENSIVE && blockRate >= DEFENSIVE_BLOCK_RATE) return "defensive";
  if (stats.centerFirst > 0 || cornerRate >= AGGRESSIVE_CORNER_RATE) return "aggressive";
  return "random";
}

function getAdaptiveMove(boardState = board) {
  const style = detectStyle(playerStats);
  const winMove = findBestMove("O", boardState);
  const blockMove = findBestMove("X", boardState);

  if (style === "aggressive") {
    if (blockMove !== null) return blockMove;
    if (winMove !== null) return winMove;
    return getHardMove(boardState);
  }

  if (style === "defensive") {
    if (winMove !== null) return winMove;
    const strategicMove = getSmartPositionMove(boardState);
    if (strategicMove !== null) return strategicMove;
    if (blockMove !== null) return blockMove;
    return getHardMove(boardState);
  }

  return getMediumMove(boardState);
}

function getAIMove(boardState = board) {
  const mode = normalizeAIMode(aiMode);
  if (mode === "easy") return getEasyMove(boardState);
  if (mode === "medium") return getMediumMove(boardState);
  if (mode === "hard") return getHardMove(boardState);
  return getAdaptiveMove(boardState);
}

function aiMove() {
  if (gameMode !== "ai" || currentPlayer !== "O" || winner) return;
  const move = getAIMove(board);
  if (move === null) return;
  makeAIMove(move);
}

function makeAIMove(i) {
  if (i === null || i === undefined || board[i] !== "" || winner) return;

  board[i] = "O";
  const res = checkWinner(board);

  if (res) {
    winner = res.winner;
    winningCells = res.cells;
    maybeAwardAIMatchStats();
  } else {
    currentPlayer = "X";
  }

  updateStatus();
  renderBoard();
}

function updateAIWinsForWinner(resolvedWinner) {
  aiWins.player = normalizeWins(aiWins.player);
  aiWins.computer = normalizeWins(aiWins.computer);
  if (resolvedWinner === "X") {
    aiWins.player += 1;
  } else if (resolvedWinner === "O") {
    aiWins.computer += 1;
  } else {
    updatePlayersText();
    return;
  }
  persistAIWins();
  updatePlayersText();
}

function maybeAwardAIMatchStats() {
  if (gameMode !== "ai") return;
  if (winner !== "X" && winner !== "O" && winner !== "draw") return;

  if (!aiWinAwarded) {
    updateAIWinsForWinner(winner);
    aiWinAwarded = true;
  }

  if (aiResultAwarded || !db) return;

  const resolvedUserId = ensureNormalizedUserId();
  if (!resolvedUserId) return;
  aiResultAwarded = true;
  const uniquePart = db.ref("users").push().key || `${Date.now().toString(36)}_${generateRoomId()}`;
  const aiAwardKey = `ai:${uniquePart}`;
  const outcome = winner === "draw" ? "draw" : (winner === "X" ? "win" : "loss");
  incrementUserMatchStats(
    resolvedUserId,
    currentUserName || t("guestPlayer"),
    outcome,
    aiAwardKey
  );
}

function scheduleAutoRestartIfNeeded() {
  if (winner !== "X" && winner !== "O" && winner !== "draw") {
    lastAutoRestartKey = "";
    if (autoRestartTimer) {
      clearTimeout(autoRestartTimer);
      autoRestartTimer = null;
    }
    return;
  }

  const matchId = gameMode === "online" ? getCurrentMatchId(window.currentRoomData) : LOCAL_MATCH_ID;
  const restartKey = `${gameMode}:${roomId || "local"}:${matchId}:${winner}`;
  if (lastAutoRestartKey === restartKey || autoRestartTimer) return;
  lastAutoRestartKey = restartKey;
  autoRestartTimer = setTimeout(() => {
    autoRestartTimer = null;
    restartGame();
  }, AUTO_RESTART_DELAY_MS);
}

// =======================
// 📊 STATUS
// =======================
function updateStatus() {
  if (gameMode === "ai") {
    if (winner === "draw") statusText.innerText = t("draw");
    else if (winner) statusText.innerText = winner === "X" ? t("win") : t("opponentWinsAI");
    else statusText.innerText = currentPlayer === "X" ? t("yourTurn") : t("aiThinking");
    updatePlayersText();
    updatePostGameActionLabels();
    setInviteButtonState();
    scheduleAutoRestartIfNeeded();
    return;
  }

  const data = window.currentRoomData;
  if (!data || !data.players) {
    statusText.innerText = t("loadingRoom");
    return;
  }

  if (!data.players.O) {
    statusText.innerText = t("waitingOpponent");
    return;
  }

  if (winner === "draw") statusText.innerText = t("draw");
  else if (winner && myRole) statusText.innerText = winner === myRole ? t("win") : t("opponentWins");
  else if (winner) statusText.innerText = t("symbolWins", { symbol: winner });
  else if (!myRole) statusText.innerText = t("turnOf", { player: currentPlayer });
  else if (myRole === currentPlayer) statusText.innerText = t("yourTurn");
  else statusText.innerText = t("opponentTurn");

  updatePostGameActionLabels();
  setInviteButtonState();
  scheduleAutoRestartIfNeeded();
}

// =======================
// 🔁 RESTART
// =======================
function restartGame() {
  if (autoRestartTimer) {
    clearTimeout(autoRestartTimer);
    autoRestartTimer = null;
  }
  lastAutoRestartKey = "";
  if (gameMode === "ai") {
    aiResultAwarded = false;
    aiWinAwarded = false;
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    winner = null;
    winningCells = [];
    playerStats = createEmptyPlayerStats();
    aiThreatCellsBeforePlayerMove = [];
    updateStatus();
    renderBoard();
    return;
  }

  if (!canWrite() || !myRole) {
    showToast(t("onlyPlayersRestart"));
    return;
  }

  const nextMatchId = getCurrentMatchId(window.currentRoomData) + 1;
  lastProcessedAwardKey = null;

  roomRef.update({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: [],
    stats: {
      matchId: nextMatchId,
      awardedKey: null
    }
  }).catch(err => {
    console.error("Restart failed:", err);
    showToast(t("restartFailed"));
  });
}

// =======================
// 📩 SHARE (FIXED)
// =======================
function shareGame() {
  if (gameMode !== "online" || !roomId) {
    if (!db) {
      showToast(t("failedCreateRoom"));
      return;
    }
    createGame();
    return;
  }

  const link = `${window.location.origin}${window.location.pathname}#room=${roomId}`;
  const inviteText = t("inviteShareText");
  const shareUrl = "https://t.me/share/url?url="
    + encodeURIComponent(link)
    + "&text="
    + encodeURIComponent(inviteText);

  if (isRunningInsideTelegramWebApp()) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
}

// =======================
// 🏠 NAV
// =======================
function showGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  if (homeScreen) homeScreen.style.display = "none";
  if (gameScreen) gameScreen.style.display = "flex";
  document.body.classList.add("game-active");
  setBottomNavActive("home");
  window.scrollTo(0, 0);
}

function goHome() {
  battleBotName = null;
  closeCurrentUserProfile();
  closeDifficultyDropdown();
  clearRoomExpiryRedirectTimer();
  stopRoomListener();
  stopChatListener();
  cleanupBattleMatchmaking();
  hideBattleOverlay();
  roomId = null;
  roomRef = null;
  aiResultAwarded = false;
  lastAutoRestartKey = "";
  if (autoRestartTimer) {
    clearTimeout(autoRestartTimer);
    autoRestartTimer = null;
  }
  if (chatBoxEl) chatBoxEl.style.display = "";
  setChatEnabled(false, "chatDisabledAIPlaceholder");
  setChatVisibility(true);
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
  if (gameScreen) gameScreen.style.display = "none";
  if (homeScreen) homeScreen.style.display = "flex";
  document.body.classList.remove("game-active");
  document.body.classList.remove("ai-mode");
  setBottomNavActive("home");
  window.scrollTo(0, 0);
}

function stopRoomListener() {
  if (roomRef && roomValueListener) {
    roomRef.off("value", roomValueListener);
  }
  roomValueListener = null;
  roomLoaded = false;
  myRole = null;
  hasAttemptedJoin = false;
  isJoinAttemptInFlight = false;
  isWinAwardInFlight = false;
  lastProcessedAwardKey = null;
  stopPlayerStatsListeners();
  window.currentRoomData = null;
}

function startChatListener() {
  if (!roomRef) return;

  stopChatListener();
  chatMessagesRef = roomRef.child("messages");

  chatMessagesRef.orderByChild("time").on("value", snap => {
    const messages = [];

    snap.forEach(child => {
      const data = child.val() || {};
      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!text) return;

      messages.push({
        userId: getMessageUserId(data),
        name: (typeof data.name === "string" && data.name.trim())
          ? data.name.trim()
          : ((typeof data.senderName === "string" && data.senderName.trim()) ? data.senderName.trim() : t("guestPlayer")),
        text,
        time: typeof data.time === "number" ? data.time : (typeof data.timestamp === "number" ? data.timestamp : 0)
      });
    });

    currentMessages = messages;
    renderMessages(messages);
  });
}

function stopChatListener() {
  if (chatMessagesRef) {
    chatMessagesRef.off();
    chatMessagesRef = null;
  }
}

function sendChatMessage() {
  if (!roomRef || !chatInputEl) return;
  const text = chatInputEl.value.trim();
  if (!text || text.length > MAX_MESSAGE_LENGTH) return;
  const senderId = ensureNormalizedUserId();
  if (!senderId) return;
  const senderName = currentUserName || t("guestPlayer");

  roomRef.child("messages").push({
    userId: senderId,
    name: senderName,
    text,
    time: Date.now()
  }).then(() => {
    chatInputEl.value = "";
    chatInputEl.focus();
  }).catch((error) => {
    console.error("Send message failed:", error);
    showToast(t("failedSendMessage"));
  });
}

function renderMessages(messages) {
  if (!messagesDiv) return;

  messagesDiv.innerHTML = "";

  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-message";
    empty.innerText = t("noMessagesYet");
    messagesDiv.appendChild(empty);
    return;
  }

  messages.forEach((msg) => {
    const item = document.createElement("div");
    item.className = "message-item";
    if (msg.userId === normalizedUserId) item.classList.add("mine");

    const sender = document.createElement("div");
    sender.className = "message-sender";
    sender.innerText = msg.name;

    const text = document.createElement("div");
    text.className = "message-text";
    text.innerText = msg.text;

    item.appendChild(sender);
    item.appendChild(text);
    messagesDiv.appendChild(item);
  });

  autoScrollMessages();
}

function autoScrollMessages() {
  if (!messagesDiv) return;
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function setChatEnabled(enabled, placeholderText) {
  chatEnabled = enabled;
  if (!chatInputEl || !sendBtnEl) return;
  currentChatPlaceholderKey = placeholderText || "typeMessage";

  chatInputEl.disabled = !enabled;
  sendBtnEl.disabled = !enabled;
  chatInputEl.placeholder = t(currentChatPlaceholderKey);

  if (!enabled) {
    chatInputEl.value = "";
    if (messagesDiv) {
      messagesDiv.innerHTML = "";
      const disabledNote = document.createElement("div");
      disabledNote.className = "empty-message";
      disabledNote.innerText = t("chatDisabledAI");
      messagesDiv.appendChild(disabledNote);
    }
  }
}

function disableChatForAI() {
  stopChatListener();
  setChatEnabled(false, "chatDisabledAIPlaceholder");
  setChatVisibility(false);
}

function setChatVisibility(visible) {
  if (!chatBoxEl) return;
  chatBoxEl.classList.toggle("hidden", !visible);
}
