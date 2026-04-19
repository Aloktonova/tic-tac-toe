// 📱 Telegram
const tg = window.Telegram?.WebApp;
if (tg && typeof tg.expand === "function") tg.expand();
const DEVELOPER_TELEGRAM_URL = "https://t.me/alokmaurya22";
const DEFAULT_LANGUAGE = "en";
const SUPPORTED_LANGS = ["en", "hi", "ar", "ru", "ko", "ja"];
const RTL_LANGS = ["ar"];

const translations = {
  en: {
    appTitle: "Tic Tac Toe 🎮",
    playFriend: "Play with Friend",
    playAI: "Play with Computer",
    invite: "Invite",
    restart: "Restart",
    home: "Home",
    send: "Send",
    settings: "Settings",
    language: "Language",
    about: "About",
    developer: "Developer: Alok Maurya",
    telegram: "Telegram:",
    backHome: "Back to Home",
    close: "Close",
    yourTurn: "Your Turn",
    win: "You Win 🎉",
    draw: "Draw 🤝",
    opponentWins: "Opponent Wins",
    opponentWinsAI: "Opponent Wins 🤖",
    aiThinking: "AI Thinking…",
    loadingRoom: "Loading room...",
    waitingOpponent: "Waiting for Opponent...",
    opponentTurn: "Opponent Turn",
    turnOf: "{player}'s Turn",
    symbolWins: "{symbol} Wins! 🎉",
    playerVs: "❌ {x} vs ⭕ {o}",
    playerX: "Player X",
    playerO: "Player O",
    waiting: "Waiting...",
    guestPlayer: "Guest Player",
    typeMessage: "Type message...",
    chatUnavailable: "Chat unavailable",
    chatDisabledAIPlaceholder: "Chat is disabled in AI mode",
    chatDisabledAI: "Chat disabled in AI mode",
    noMessagesYet: "No messages yet",
    unableVerifyIdentity: "Unable to verify identity",
    failedCreateRoom: "Failed to create room. Try again.",
    youAreSpectating: "You are spectating",
    notYourTurn: "Not your turn",
    moveFailed: "Move failed. Please try again.",
    onlyPlayersRestart: "Only players can restart",
    restartFailed: "Restart failed. Try again.",
    failedSendMessage: "Failed to send message."
  },
  hi: {
    appTitle: "टिक टैक टो 🎮",
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
    playerVs: "❌ {x} बनाम ⭕ {o}",
    playerX: "प्लेयर X",
    playerO: "प्लेयर O",
    waiting: "इंतज़ार...",
    guestPlayer: "गेस्ट प्लेयर",
    typeMessage: "संदेश लिखें...",
    chatUnavailable: "चैट उपलब्ध नहीं",
    chatDisabledAIPlaceholder: "AI मोड में चैट बंद है",
    chatDisabledAI: "AI मोड में चैट बंद है",
    noMessagesYet: "अभी तक कोई संदेश नहीं",
    unableVerifyIdentity: "पहचान सत्यापित नहीं हो सकी",
    failedCreateRoom: "रूम नहीं बन पाया। फिर से कोशिश करें।",
    youAreSpectating: "आप दर्शक हैं",
    notYourTurn: "यह आपकी बारी नहीं है",
    moveFailed: "चाल असफल रही। फिर प्रयास करें।",
    onlyPlayersRestart: "केवल खिलाड़ी रीस्टार्ट कर सकते हैं",
    restartFailed: "रीस्टार्ट असफल रहा। फिर प्रयास करें।",
    failedSendMessage: "संदेश भेजने में विफल।"
  },
  ar: {
    appTitle: "تيك تاك تو 🎮",
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
    typeMessage: "اكتب رسالة...",
    chatUnavailable: "الدردشة غير متاحة",
    chatDisabledAIPlaceholder: "الدردشة معطلة في وضع الذكاء الاصطناعي",
    chatDisabledAI: "الدردشة معطلة في وضع الذكاء الاصطناعي",
    noMessagesYet: "لا توجد رسائل بعد",
    unableVerifyIdentity: "تعذر التحقق من الهوية",
    failedCreateRoom: "فشل إنشاء الغرفة. حاول مرة أخرى.",
    youAreSpectating: "أنت متفرج",
    notYourTurn: "ليس دورك",
    moveFailed: "فشلت الحركة. حاول مرة أخرى.",
    onlyPlayersRestart: "فقط اللاعبون يمكنهم إعادة اللعبة",
    restartFailed: "فشلت الإعادة. حاول مرة أخرى.",
    failedSendMessage: "فشل إرسال الرسالة."
  },
  ru: {
    appTitle: "Крестики-нолики 🎮",
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
    playerVs: "❌ {x} vs ⭕ {o}",
    playerX: "Игрок X",
    playerO: "Игрок O",
    waiting: "Ожидание...",
    guestPlayer: "Гость",
    typeMessage: "Введите сообщение...",
    chatUnavailable: "Чат недоступен",
    chatDisabledAIPlaceholder: "Чат отключен в режиме ИИ",
    chatDisabledAI: "Чат отключен в режиме ИИ",
    noMessagesYet: "Пока нет сообщений",
    unableVerifyIdentity: "Не удалось проверить личность",
    failedCreateRoom: "Не удалось создать комнату. Попробуйте снова.",
    youAreSpectating: "Вы наблюдатель",
    notYourTurn: "Сейчас не ваш ход",
    moveFailed: "Ход не выполнен. Попробуйте снова.",
    onlyPlayersRestart: "Только игроки могут перезапустить",
    restartFailed: "Перезапуск не удался. Попробуйте снова.",
    failedSendMessage: "Не удалось отправить сообщение."
  },
  ko: {
    appTitle: "틱택토 🎮",
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
    typeMessage: "메시지를 입력하세요...",
    chatUnavailable: "채팅을 사용할 수 없음",
    chatDisabledAIPlaceholder: "AI 모드에서는 채팅이 비활성화됩니다",
    chatDisabledAI: "AI 모드에서는 채팅이 비활성화됩니다",
    noMessagesYet: "아직 메시지가 없습니다",
    unableVerifyIdentity: "사용자 확인에 실패했습니다",
    failedCreateRoom: "방 생성에 실패했습니다. 다시 시도하세요.",
    youAreSpectating: "관전 중입니다",
    notYourTurn: "당신 차례가 아닙니다",
    moveFailed: "수를 둘 수 없습니다. 다시 시도하세요.",
    onlyPlayersRestart: "플레이어만 다시 시작할 수 있습니다",
    restartFailed: "다시 시작에 실패했습니다. 다시 시도하세요.",
    failedSendMessage: "메시지 전송 실패."
  },
  ja: {
    appTitle: "三目並べ 🎮",
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
    typeMessage: "メッセージを入力...",
    chatUnavailable: "チャットは利用できません",
    chatDisabledAIPlaceholder: "AIモードではチャットできません",
    chatDisabledAI: "AIモードではチャットできません",
    noMessagesYet: "まだメッセージがありません",
    unableVerifyIdentity: "ユーザー確認ができませんでした",
    failedCreateRoom: "ルーム作成に失敗しました。再試行してください。",
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
let lang = DEFAULT_LANGUAGE;
let currentMessages = [];
let currentChatPlaceholderKey = "chatDisabledAIPlaceholder";

function normalizeLangCode(code) {
  if (!code || typeof code !== "string") return null;
  const normalized = code.toLowerCase().split("-")[0];
  return SUPPORTED_LANGS.includes(normalized) ? normalized : null;
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
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
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
  user = tg.initDataUnsafe?.user || {};
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

syncTelegramUserContext();
lang = getInitialLanguage();

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

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
let chatEnabled = false;

// Tracks room readiness and the current user's role
let roomLoaded = false;
let myRole = null;        // "X", "O", or null (spectator)
let hasAttemptedJoin = false;
let isJoinAttemptInFlight = false;

const MAX_MESSAGE_LENGTH = 500;

// 🎯 UI ELEMENTS
let userInfo, boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
let messagesDiv, chatInputEl, sendBtnEl;
let inviteBtn, restartBtn, homeBtn;
let settingsModal;

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
    avatarFallback.innerText = (currentUserName || t("guestPlayer")).charAt(0).toUpperCase();
    profile.appendChild(avatarFallback);
  }

  const fullName = document.createElement("span");
  fullName.className = "user-name";
  fullName.innerText = currentUserName || t("guestPlayer");
  profile.appendChild(fullName);

  userInfo.appendChild(profile);
}

function applyTranslations() {
  document.title = t("appTitle");
  const homeTitle = document.getElementById("homeTitle");
  const topTitle = document.getElementById("topTitle");
  const createBtn = document.getElementById("createGame");
  const aiBtn = document.getElementById("playAI");
  const inviteButton = document.getElementById("inviteBtn");
  const restartButton = document.getElementById("restartBtn");
  const homeButton = document.getElementById("homeBtn");
  const sendButton = document.getElementById("sendBtn");
  const settingsTitle = document.getElementById("settingsTitle");
  const languageLabel = document.getElementById("languageLabel");
  const aboutTitle = document.getElementById("aboutTitle");
  const developerText = document.getElementById("developerText");
  const telegramLabel = document.getElementById("telegramLabel");
  const backHomeButton = document.getElementById("backHomeBtn");
  const closeSettingsButton = document.getElementById("closeSettingsBtn");

  if (homeTitle) homeTitle.innerText = t("appTitle");
  if (topTitle) topTitle.innerText = t("appTitle");
  if (createBtn) createBtn.innerText = `👥 ${t("playFriend")}`;
  if (aiBtn) aiBtn.innerText = `🤖 ${t("playAI")}`;
  if (inviteButton) inviteButton.innerText = `📩 ${t("invite")}`;
  if (restartButton) restartButton.innerText = `🔁 ${t("restart")}`;
  if (homeButton) homeButton.innerText = `🏠 ${t("home")}`;
  if (sendButton) sendButton.innerText = t("send");
  if (settingsTitle) settingsTitle.innerText = t("settings");
  if (languageLabel) languageLabel.innerText = t("language");
  if (aboutTitle) aboutTitle.innerText = t("about");
  if (developerText) developerText.innerText = t("developer");
  if (telegramLabel) telegramLabel.innerText = t("telegram");
  if (backHomeButton) backHomeButton.innerText = `🏠 ${t("backHome")}`;
  if (closeSettingsButton) closeSettingsButton.innerText = t("close");

  if (chatInputEl) {
    chatInputEl.placeholder = t(currentChatPlaceholderKey);
  }

  renderUserProfile();
  updateStatus();
  updatePlayersText();
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
  return {
    board,
    turn: raw.turn || null,
    winner: raw.winner || null,
    winningCells: Array.isArray(raw.winningCells) ? raw.winningCells : [],
    players: {
      X: raw.players?.X || null,
      O: raw.players?.O || null
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

// =======================
// 🚀 INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
  syncTelegramUserContext();

  console.log("App Loaded ✅");

  // UI
  userInfo = document.getElementById("userInfo");
  boardDiv = document.getElementById("board");
  statusText = document.getElementById("statusText");
  playersDiv = document.getElementById("players");

  homeScreen = document.getElementById("homeScreen");
  gameScreen = document.getElementById("gameScreen");
  messagesDiv = document.getElementById("messages");
  chatInputEl = document.getElementById("chatInput");
  sendBtnEl = document.getElementById("sendBtn");

  const createBtn = document.getElementById("createGame");
  const aiBtn = document.getElementById("playAI");
  inviteBtn = document.getElementById("inviteBtn");
  restartBtn = document.getElementById("restartBtn");
  homeBtn = document.getElementById("homeBtn");
  settingsModal = document.getElementById("settingsModal");
  const settingsBtn = document.getElementById("settingsBtn");
  const closeSettingsBtn = document.getElementById("closeSettingsBtn");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const languageSelect = document.getElementById("languageSelect");
  const footerDeveloperLink = document.getElementById("footerDeveloperLink");
  const aboutTelegramLink = document.getElementById("aboutTelegramLink");

  // 🔥 BUTTON FIX (IMPORTANT)
  createBtn.addEventListener("click", createGame);
  aiBtn.addEventListener("click", playAI);
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
  homeBtn.addEventListener("click", goHome);
  settingsBtn?.addEventListener("click", () => settingsModal?.classList.remove("hidden"));
  closeSettingsBtn?.addEventListener("click", () => settingsModal?.classList.add("hidden"));
  backHomeBtn?.addEventListener("click", () => {
    settingsModal?.classList.add("hidden");
    goHome();
  });
  settingsModal?.addEventListener("click", (event) => {
    if (event.target === settingsModal) settingsModal.classList.add("hidden");
  });
  footerDeveloperLink?.addEventListener("click", openDeveloperTelegram);
  aboutTelegramLink?.addEventListener("click", openDeveloperTelegram);
  languageSelect?.addEventListener("change", (event) => {
    setLanguage(event.target.value);
  });

  if (languageSelect) {
    languageSelect.value = lang;
  }
  setLanguage(lang, false);

  autoJoinRoomFromLocation();
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

function autoJoinRoomFromLocation() {
  const detectedRoomId = getRoomIdFromLocation();
  if (!detectedRoomId) return;
  if (roomId === detectedRoomId && roomRef) return;

  stopRoomListener();
  stopChatListener();

  roomId = detectedRoomId;
  roomRef = db.ref("rooms/" + roomId);
  gameMode = "online";

  showGame();
  setInviteButtonState();
  listenRoom();

  console.log("Joined Room:", roomId);
}

// =======================
// 🎮 CREATE GAME
// =======================
function createGame() {
  if (!normalizedUserId) {
    showToast(t("unableVerifyIdentity"));
    return;
  }

  console.log("Create Game Clicked");

  gameMode = "online";

  roomId = generateRoomId();
  roomRef = db.ref("rooms/" + roomId);

  roomRef.set({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: [],
    players: {
      X: {
        id: normalizedUserId,
        name: currentUserName
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
function playAI() {
  console.log("AI Mode");

  gameMode = "ai";

  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];

  showGame();
  disableChatForAI();
  setInviteButtonState();
  updateStatus();
  renderBoard();
}

// 📩 Invite visibility
function setInviteButtonState() {
  if (!inviteBtn) return;
  const isOnlineMode = gameMode === "online";
  inviteBtn.style.display = isOnlineMode ? "" : "none";
}

function updatePlayersText() {
  if (!playersDiv) return;
  const data = window.currentRoomData;
  const x = data?.players?.X?.name || t("playerX");
  const o = data?.players?.O?.name || t("waiting");
  playersDiv.innerText = t("playerVs", { x, o });
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
    if (!data) return;

    const resolvedUserId = ensureNormalizedUserId();

    // 🔥 FIX: Assign Player O properly
    if (
      data.players &&
      data.players.X &&
      String(data.players.X.id) !== resolvedUserId &&
      !data.players.O
    ) {
      if (!hasAttemptedJoin && !isJoinAttemptInFlight) {
        isJoinAttemptInFlight = true;
        roomRef.child("players/O").transaction(currentO => {
          if (currentO?.id) return undefined;
          return {
            id: resolvedUserId,
            name: currentUserName || t("playerO")
          };
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
// 🎮 RENDER
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
    board[i] = "X";

    let res = checkWinner(board);
    if (res) {
      winner = res.winner;
      winningCells = res.cells;
    } else {
      currentPlayer = "O";
      setTimeout(aiMove, 400);
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
    roomRef.update({
      board: newBoard,
      winner: res.winner,
      winningCells: res.cells,
      turn: null
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
function aiMove() {

  // 🎲 40% chance to play RANDOM (to make it beatable)
  if (Math.random() < 0.4) {
    playRandom();
    return;
  }

  // 1️⃣ Try to WIN
  let move = findBestMove("O");
  if (move !== null) {
    makeAIMove(move);
    return;
  }

  // 🎲 30% chance to IGNORE blocking (intentional mistake)
  if (Math.random() < 0.3) {
    playSmartPosition();
    return;
  }

  // 2️⃣ Block player WIN
  move = findBestMove("X");
  if (move !== null) {
    makeAIMove(move);
    return;
  }

  // 3️⃣ Smart positioning
  playSmartPosition();
}

function findBestMove(symbol) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== "") continue;
    const testBoard = [...board];
    testBoard[i] = symbol;
    const result = checkWinner(testBoard);
    if (result?.winner === symbol) return i;
  }
  return null;
}

function makeAIMove(i) {
  if (i === null || i === undefined || board[i] !== "" || winner) return;

  board[i] = "O";
  const res = checkWinner(board);

  if (res) {
    winner = res.winner;
    winningCells = res.cells;
  } else {
    currentPlayer = "X";
  }

  updateStatus();
  renderBoard();
}

// 🎯 Smart positioning (not perfect)
function playSmartPosition() {

  // Take center sometimes
  if (board[4] === "" && Math.random() < 0.7) {
    makeAIMove(4);
    return;
  }

  // Take corner sometimes
  const corners = [0,2,6,8].filter(i => board[i] === "");
  if (corners.length && Math.random() < 0.7) {
    const move = corners[Math.floor(Math.random() * corners.length)];
    makeAIMove(move);
    return;
  }

  // Otherwise random
  playRandom();
}

// 🎲 Random move
function playRandom() {
  const empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  const move = empty[Math.floor(Math.random()*empty.length)];
  makeAIMove(move);
}

// =======================
// 📊 STATUS
// =======================
function updateStatus() {
  if (gameMode === "ai") {
    if (winner === "draw") return statusText.innerText = t("draw");
    if (winner) return statusText.innerText = winner === "X" ? t("win") : t("opponentWinsAI");
    return statusText.innerText = currentPlayer === "X" ? t("yourTurn") : t("aiThinking");
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
}

// =======================
// 🔁 RESTART
// =======================
function restartGame() {
  if (gameMode === "ai") {
    board = ["","","","","","","","",""];
    currentPlayer = "X";
    winner = null;
    winningCells = [];
    updateStatus();
    renderBoard();
    return;
  }

  if (!canWrite() || !myRole) {
    showToast(t("onlyPlayersRestart"));
    return;
  }

  roomRef.update({
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: []
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
    console.warn("Invite is only available in online mode with a valid room.");
    return;
  }

  const link = `${window.location.origin}${window.location.pathname}#room=${roomId}`;

  if (isRunningInsideTelegramWebApp()) {
    tg.openTelegramLink(
      "https://t.me/share/url?url=" + encodeURIComponent(link)
    );
  } else {
    window.open(
      "https://t.me/share/url?url=" + encodeURIComponent(link),
      "_blank",
      "noopener,noreferrer"
    );
  }
}

// =======================
// 🏠 NAV
// =======================
function showGame() {
  homeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

function goHome() {
  stopRoomListener();
  stopChatListener();
  roomId = null;
  roomRef = null;
  setChatEnabled(false, "chatDisabledAIPlaceholder");
  gameScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
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
}
