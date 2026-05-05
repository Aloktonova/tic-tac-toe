// ─── Telegram ───────────────────────────────────────────────
const tg = window.Telegram?.WebApp;
if (tg && typeof tg.expand === "function") tg.expand();

// ─── Constants ──────────────────────────────────────────────
const DEVELOPER_TELEGRAM_URL = "https://t.me/alokmaurya22";
const DEFAULT_LANGUAGE = "en";
const DEFAULT_AI_MODE = "easy";
const SUPPORTED_LANGS = ["en","hi","ar","ru","ko","ja"];
const RTL_LANGS = ["ar"];
const AI_MODE_STORAGE_KEY = "aiMode";
const AI_WINS_STORAGE_KEY = "aiWins";
const PLAYER_WINS_STORAGE_KEY = "playerWins";
const COMPUTER_WINS_STORAGE_KEY = "computerWins";
const UNKNOWN_LOCATION_VALUE = "Unknown";
const LOCATION_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
const DIFFICULTY_CHANGE_ANIMATION_DELAY_MS = 350;
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
const AUTO_RESTART_DELAY_MS = 1500;
const ROOM_EXPIRE_MS = 24 * 60 * 60 * 1000;
const ROOM_EXPIRED_REDIRECT_DELAY_MS = 2000;
const LOCAL_MATCH_ID = 1;
const XP_PER_LEVEL = 100;
const XP_GAIN_WIN = 10;
const XP_GAIN_DRAW = 7;
const XP_GAIN_LOSS = 5;
const MAX_MESSAGE_LENGTH = 500;
const BATTLE_MATCHMAKING_WINDOW_MS = 3000;
const OPPONENT_QUEUE_CLEANUP_DELAY_MS = 2000;
const PLAYER_O_ROOM_WAIT_TIMEOUT_MS = 10000;
const POST_GAME_RESTART_LABEL = "🔁 Play Again";
const POST_GAME_INVITE_LABEL = "📩 Invite Friend";

// ─── Translations ────────────────────────────────────────────
const translations = {
  en: {
    appTitle:"Tic Tac Toe",playFriend:"Play with Friend",playAI:"Play with Computer",
    invite:"Invite",restart:"Restart",home:"Home",send:"Send",settings:"Settings",
    language:"Language",aiMode:"AI Mode",difficulty:"Difficulty",
    aiMode_easy:"Easy",aiMode_medium:"Medium",aiMode_hard:"Hard",aiMode_adaptive:"Adaptive AI",
    about:"About",developer:"Developer: Alok Maurya",telegram:"Telegram:",
    backHome:"Back to Home",close:"Close",yourTurn:"Your Turn",
    win:"You Win 🎉",draw:"Draw 🤝",opponentWins:"Opponent Wins",
    opponentWinsAI:"Computer Wins 🤖",aiThinking:"AI Thinking…",
    loadingRoom:"Loading room...",waitingOpponent:"Waiting for Opponent...",
    opponentTurn:"Opponent Turn",turnOf:"{player}'s Turn",symbolWins:"{symbol} Wins 🎉",
    labelYou:"You",labelFriend:"Friend",labelComputer:"Computer",
    playerX:"Player X",playerO:"Player O",waiting:"Waiting...",
    guestPlayer:"Guest Player",winsLabel:"Wins",typeMessage:"Type message...",
    chatDisabledAIPlaceholder:"Chat is disabled in AI mode",
    chatDisabledAI:"Chat disabled in AI mode",noMessagesYet:"No messages yet",
    unableVerifyIdentity:"Unable to verify identity",
    failedCreateRoom:"Failed to create room. Try again.",
    youAreSpectating:"You are spectating",notYourTurn:"Not your turn",
    moveFailed:"Move failed. Please try again.",
    onlyPlayersRestart:"Only players can restart",restartFailed:"Restart failed. Try again.",
    failedSendMessage:"Failed to send message.",gameNotFound:"Game not found",
    gameExpired:"This game has expired ⏳",roomFull:"Room Full",
    inviteShareText:"🎮 I challenge you in Tic Tac Toe!\nCan you beat me? 😏\n\n👉 Play instantly:\n",
    navHome:"Home",navBattle:"Battle",navSettings:"Settings",battle:"Battle",
    searchingOpponent:"Searching for opponent...",cancelSearch:"Cancel",
    opponentFound:"Opponent found! Starting game...",
    noPlayersFoundBot:"No players found, starting bot match…"
  },
  hi: {
    appTitle:"टिक टैक टो",playFriend:"दोस्त के साथ खेलें",playAI:"कंप्यूटर के साथ खेलें",
    invite:"निमंत्रण",restart:"फिर से शुरू",home:"होम",send:"भेजें",settings:"सेटिंग्स",
    language:"भाषा",aiMode:"AI मोड",about:"परिचय",developer:"डेवलपर: Alok Maurya",
    telegram:"टेलीग्राम:",backHome:"होम पर वापस",close:"बंद करें",yourTurn:"आपकी बारी",
    win:"आप जीते 🎉",draw:"ड्रॉ 🤝",opponentWins:"प्रतिद्वंदी जीता",
    opponentWinsAI:"कंप्यूटर जीता 🤖",aiThinking:"कंप्यूटर सोच रहा है…",
    loadingRoom:"रूम लोड हो रहा है...",waitingOpponent:"प्रतिद्वंदी का इंतज़ार...",
    opponentTurn:"प्रतिद्वंदी की बारी",turnOf:"{player} की बारी",
    labelYou:"आप",labelFriend:"दोस्त",labelComputer:"कंप्यूटर",
    playerX:"प्लेयर X",playerO:"प्लेयर O",waiting:"इंतज़ार...",
    guestPlayer:"गेस्ट प्लेयर",winsLabel:"जीत",typeMessage:"संदेश लिखें...",
    chatDisabledAIPlaceholder:"AI मोड में चैट बंद है",chatDisabledAI:"AI मोड में चैट बंद है",
    noMessagesYet:"अभी तक कोई संदेश नहीं",unableVerifyIdentity:"पहचान सत्यापित नहीं हो सकी",
    failedCreateRoom:"रूम नहीं बन पाया। फिर से कोशिश करें।",youAreSpectating:"आप दर्शक हैं",
    notYourTurn:"यह आपकी बारी नहीं है",moveFailed:"चाल असफल रही। फिर प्रयास करें।",
    onlyPlayersRestart:"केवल खिलाड़ी रीस्टार्ट कर सकते हैं",restartFailed:"रीस्टार्ट असफल रहा।",
    failedSendMessage:"संदेश भेजने में विफल।",gameNotFound:"गेम नहीं मिला",
    gameExpired:"यह गेम समाप्त हो गया ⏳",roomFull:"रूम भरा हुआ है",
    inviteShareText:"🎮 मैं तुम्हें Tic Tac Toe में चुनौती देता हूँ!\n\n👉 तुरंत खेलो:\n",
    navHome:"होम",navBattle:"युद्ध",navSettings:"सेटिंग्स",battle:"युद्ध",
    searchingOpponent:"प्रतिद्वंदी खोजा जा रहा है...",cancelSearch:"रद्द करें",
    opponentFound:"प्रतिद्वंदी मिला!",noPlayersFoundBot:"कोई खिलाड़ी नहीं मिला, बॉट से खेल शुरू…",
    aiMode_easy:"आसान",aiMode_medium:"मध्यम",aiMode_hard:"कठिन",aiMode_adaptive:"अनुकूली AI"
  },
  ar: {
    appTitle:"تيك تاك تو",playFriend:"العب مع صديق",playAI:"العب مع الكمبيوتر",
    invite:"دعوة",restart:"إعادة",home:"الرئيسية",send:"إرسال",settings:"الإعدادات",
    language:"اللغة",aiMode:"وضع الذكاء",about:"حول",developer:"المطور: Alok Maurya",
    telegram:"تيليجرام:",backHome:"العودة للرئيسية",close:"إغلاق",yourTurn:"دورك",
    win:"لقد فزت 🎉",draw:"تعادل 🤝",opponentWins:"الخصم فاز",
    opponentWinsAI:"الكمبيوتر فاز 🤖",aiThinking:"الكمبيوتر يفكر…",
    loadingRoom:"جاري تحميل الغرفة...",waitingOpponent:"بانتظار الخصم...",
    opponentTurn:"دور الخصم",turnOf:"دور {player}",
    labelYou:"أنت",labelFriend:"صديق",labelComputer:"الكمبيوتر",
    playerX:"اللاعب X",playerO:"اللاعب O",waiting:"بانتظار...",
    guestPlayer:"لاعب ضيف",winsLabel:"الانتصارات",typeMessage:"اكتب رسالة...",
    chatDisabledAIPlaceholder:"الدردشة معطلة",chatDisabledAI:"الدردشة معطلة",
    noMessagesYet:"لا توجد رسائل بعد",unableVerifyIdentity:"تعذر التحقق من الهوية",
    failedCreateRoom:"فشل إنشاء الغرفة.",youAreSpectating:"أنت متفرج",
    notYourTurn:"ليس دورك",moveFailed:"فشلت الحركة.",
    onlyPlayersRestart:"فقط اللاعبون يمكنهم إعادة اللعبة",restartFailed:"فشلت الإعادة.",
    failedSendMessage:"فشل إرسال الرسالة.",gameNotFound:"اللعبة غير موجودة",
    gameExpired:"انتهت صلاحية هذه اللعبة ⏳",roomFull:"الغرفة ممتلئة",
    inviteShareText:"🎮 أتحداك في تيك تاك تو!\n\n👉 العب الآن:\n",
    navHome:"الرئيسية",navBattle:"المعركة",navSettings:"الإعدادات",battle:"المعركة",
    searchingOpponent:"جارٍ البحث عن خصم...",cancelSearch:"إلغاء",
    opponentFound:"تم العثور على خصم!",noPlayersFoundBot:"لم يتم العثور على لاعبين، بدء مباراة البوت…",
    aiMode_easy:"سهل",aiMode_medium:"متوسط",aiMode_hard:"صعب",aiMode_adaptive:"ذكاء متكيف"
  },
  ru: {
    appTitle:"Крестики-нолики",playFriend:"Играть с другом",playAI:"Играть с компьютером",
    invite:"Пригласить",restart:"Рестарт",home:"Домой",send:"Отправить",settings:"Настройки",
    language:"Язык",aiMode:"Режим ИИ",about:"О приложении",developer:"Разработчик: Alok Maurya",
    telegram:"Телеграм:",backHome:"Назад домой",close:"Закрыть",yourTurn:"Ваш ход",
    win:"Вы выиграли 🎉",draw:"Ничья 🤝",opponentWins:"Соперник победил",
    opponentWinsAI:"Компьютер победил 🤖",aiThinking:"Компьютер думает…",
    loadingRoom:"Загрузка комнаты...",waitingOpponent:"Ожидание соперника...",
    opponentTurn:"Ход соперника",turnOf:"Ход: {player}",
    labelYou:"Вы",labelFriend:"Друг",labelComputer:"Компьютер",
    playerX:"Игрок X",playerO:"Игрок O",waiting:"Ожидание...",
    guestPlayer:"Гость",winsLabel:"Победы",typeMessage:"Введите сообщение...",
    chatDisabledAIPlaceholder:"Чат отключен в режиме ИИ",chatDisabledAI:"Чат отключен в режиме ИИ",
    noMessagesYet:"Пока нет сообщений",unableVerifyIdentity:"Не удалось проверить личность",
    failedCreateRoom:"Не удалось создать комнату.",youAreSpectating:"Вы наблюдатель",
    notYourTurn:"Сейчас не ваш ход",moveFailed:"Ход не выполнен.",
    onlyPlayersRestart:"Только игроки могут перезапустить",restartFailed:"Перезапуск не удался.",
    failedSendMessage:"Не удалось отправить сообщение.",gameNotFound:"Игра не найдена",
    gameExpired:"Срок игры истёк ⏳",roomFull:"Комната заполнена",
    inviteShareText:"🎮 Вызываю тебя в Крестики-нолики!\n\n👉 Играй прямо сейчас:\n",
    navHome:"Домой",navBattle:"Битва",navSettings:"Настройки",battle:"Битва",
    searchingOpponent:"Ищем соперника...",cancelSearch:"Отмена",
    opponentFound:"Соперник найден!",noPlayersFoundBot:"Игроки не найдены, начинаем с ботом…",
    aiMode_easy:"Лёгкий",aiMode_medium:"Средний",aiMode_hard:"Сложный",aiMode_adaptive:"Адаптивный ИИ"
  },
  ko: {
    appTitle:"틱택토",playFriend:"친구와 플레이",playAI:"컴퓨터와 플레이",
    invite:"초대",restart:"다시 시작",home:"홈",send:"보내기",settings:"설정",
    language:"언어",aiMode:"AI 모드",about:"정보",developer:"개발자: Alok Maurya",
    telegram:"텔레그램:",backHome:"홈으로",close:"닫기",yourTurn:"당신 차례",
    win:"당신이 이겼어요 🎉",draw:"무승부 🤝",opponentWins:"상대가 이겼어요",
    opponentWinsAI:"컴퓨터가 이겼어요 🤖",aiThinking:"컴퓨터 생각 중…",
    loadingRoom:"방 불러오는 중...",waitingOpponent:"상대를 기다리는 중...",
    opponentTurn:"상대 차례",turnOf:"{player}의 차례",
    labelYou:"나",labelFriend:"친구",labelComputer:"컴퓨터",
    playerX:"플레이어 X",playerO:"플레이어 O",waiting:"대기 중...",
    guestPlayer:"게스트 플레이어",winsLabel:"승리",typeMessage:"메시지를 입력하세요...",
    chatDisabledAIPlaceholder:"AI 모드에서는 채팅이 비활성화됩니다",chatDisabledAI:"채팅 비활성화",
    noMessagesYet:"아직 메시지가 없습니다",unableVerifyIdentity:"사용자 확인에 실패했습니다",
    failedCreateRoom:"방 생성에 실패했습니다.",youAreSpectating:"관전 중입니다",
    notYourTurn:"당신 차례가 아닙니다",moveFailed:"수를 둘 수 없습니다.",
    onlyPlayersRestart:"플레이어만 다시 시작할 수 있습니다",restartFailed:"다시 시작에 실패했습니다.",
    failedSendMessage:"메시지 전송 실패.",gameNotFound:"게임을 찾을 수 없음",
    gameExpired:"이 게임은 만료되었습니다 ⏳",roomFull:"방이 가득 찼습니다",
    inviteShareText:"🎮 틱택토 한판 해요!\n\n👉 지금 바로 플레이:\n",
    navHome:"홈",navBattle:"배틀",navSettings:"설정",battle:"배틀",
    searchingOpponent:"상대를 찾는 중...",cancelSearch:"취소",
    opponentFound:"상대를 찾았어요!",noPlayersFoundBot:"플레이어를 찾지 못했습니다, 봇 매치 시작…",
    aiMode_easy:"쉬움",aiMode_medium:"보통",aiMode_hard:"어려움",aiMode_adaptive:"적응형 AI"
  },
  ja: {
    appTitle:"三目並べ",playFriend:"友達と遊ぶ",playAI:"コンピューターと遊ぶ",
    invite:"招待",restart:"再スタート",home:"ホーム",send:"送信",settings:"設定",
    language:"言語",aiMode:"AIモード",about:"このアプリについて",developer:"開発者: Alok Maurya",
    telegram:"Telegram:",backHome:"ホームに戻る",close:"閉じる",yourTurn:"あなたの番",
    win:"あなたの勝ち 🎉",draw:"引き分け 🤝",opponentWins:"相手の勝ち",
    opponentWinsAI:"コンピューターの勝ち 🤖",aiThinking:"コンピューターが考え中…",
    loadingRoom:"ルームを読み込み中...",waitingOpponent:"対戦相手を待っています...",
    opponentTurn:"相手の番",turnOf:"{player}の番",
    labelYou:"あなた",labelFriend:"友達",labelComputer:"コンピューター",
    playerX:"プレイヤーX",playerO:"プレイヤーO",waiting:"待機中...",
    guestPlayer:"ゲストプレイヤー",winsLabel:"勝利",typeMessage:"メッセージを入力...",
    chatDisabledAIPlaceholder:"AIモードではチャットできません",chatDisabledAI:"チャット無効",
    noMessagesYet:"まだメッセージがありません",unableVerifyIdentity:"ユーザー確認ができませんでした",
    failedCreateRoom:"ルーム作成に失敗しました。",youAreSpectating:"観戦中です",
    notYourTurn:"あなたの番ではありません",moveFailed:"操作に失敗しました。",
    onlyPlayersRestart:"プレイヤーのみ再スタートできます",restartFailed:"再スタートに失敗しました。",
    failedSendMessage:"メッセージ送信に失敗しました。",gameNotFound:"ゲームが見つかりません",
    gameExpired:"このゲームは期限切れです ⏳",roomFull:"ルームが満員です",
    inviteShareText:"🎮 三目並べで勝負しよう！\n\n👉 今すぐプレイ:\n",
    navHome:"ホーム",navBattle:"バトル",navSettings:"設定",battle:"バトル",
    searchingOpponent:"対戦相手を探しています...",cancelSearch:"キャンセル",
    opponentFound:"対戦相手が見つかりました！",noPlayersFoundBot:"プレイヤーが見つかりません、ボット戦を開始…",
    aiMode_easy:"かんたん",aiMode_medium:"ふつう",aiMode_hard:"むずかしい",aiMode_adaptive:"適応型AI"
  }
};

// ─── Utils ───────────────────────────────────────────────────
function t(key, vars) {
  const d = translations[lang] || translations.en;
  let v = d[key] ?? translations.en[key] ?? key;
  if (vars) Object.keys(vars).forEach(k => { v = v.replace(new RegExp(`\\{${k}\\}`,"g"), String(vars[k])); });
  return v;
}
function normalizeLangCode(c) {
  if (!c || typeof c !== "string") return null;
  const n = c.toLowerCase().split("-")[0];
  return SUPPORTED_LANGS.includes(n) ? n : null;
}
function normalizeAIMode(m) {
  const n = typeof m === "string" ? m.toLowerCase().trim() : "";
  return ["easy","medium","hard","adaptive"].includes(n) ? n : DEFAULT_AI_MODE;
}
function normalizeWins(v)  { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0; }
function normalizeLosses(v){ const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0; }
function normalizeDraws(v) { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0; }
function normalizeGames(v) { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0; }
function normalizeXp(v)    { const n = Number(v); return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0; }
function normalizePlayerId(id) { return (id === null || id === undefined) ? null : String(id); }
function normalizeLocationValue(v) { if (typeof v !== "string") return UNKNOWN_LOCATION_VALUE; return v.trim() || UNKNOWN_LOCATION_VALUE; }
function getCurrentMatchId(d) { const m = Number(d?.stats?.matchId); return Number.isFinite(m) && m >= 1 ? Math.floor(m) : 1; }
function getAwardKey(rid, mid) { return rid ? `${rid}:${mid}` : null; }
function generateRoomId() {
  if (window.crypto?.getRandomValues) { const b = new Uint8Array(4); window.crypto.getRandomValues(b); return Array.from(b, x => x.toString(16).padStart(2,"0")).join(""); }
  return Date.now().toString(36).slice(-8);
}
function generateFallbackUserId() {
  if (window.crypto?.randomUUID) return "user_" + window.crypto.randomUUID().replace(/-/g,"");
  return "user_" + Date.now().toString(36);
}
function getDisplayName(u) {
  if (!u || typeof u !== "object") return t("guestPlayer");
  const fn = typeof u.first_name === "string" ? u.first_name.trim() : "";
  const ln = typeof u.last_name === "string" ? u.last_name.trim() : "";
  return [fn,ln].filter(Boolean).join(" ") || t("guestPlayer");
}
function getMessageUserId(d) {
  if (d?.userId != null) return String(d.userId);
  if (d?.senderId != null) return String(d.senderId);
  return "";
}
function shouldRefreshUserCountry(ud, now) {
  const c = typeof ud?.country === "string" ? ud.country.trim() : "";
  const hasC = c.length > 0 && c.toLowerCase() !== UNKNOWN_LOCATION_VALUE.toLowerCase();
  const lu = Number(ud?.lastLocationUpdate);
  return !hasC || !Number.isFinite(lu) || (now - lu) >= LOCATION_REFRESH_INTERVAL_MS;
}
function isRoomExpired(d) {
  const ca = Number(d?.createdAt);
  if (!Number.isFinite(ca) || ca <= 0) return false;
  return Date.now() - ca > ROOM_EXPIRE_MS;
}
function getRoomIdFromLocation() {
  const h = window.location.hash;
  if (!h.startsWith("#room=")) return null;
  return h.replace("#room=","").trim() || null;
}
function isRunningInsideTelegramWebApp() {
  return !!(tg && typeof tg.openTelegramLink === "function" && tg.initData !== undefined);
}
function createEmptyPlayerStats() { return { centerFirst:0, cornerMoves:0, blockMoves:0, totalMoves:0 }; }

// ─── User identity ───────────────────────────────────────────
let user = {}, userId = null, normalizedUserId = null;
let currentUserName = "", currentUserPhotoUrl = "", currentTelegramUsername = "";
let lang = DEFAULT_LANGUAGE;

function syncTelegramUserContext() {
  user = tg?.initDataUnsafe?.user || {};
  userId = user.id ?? null;
  let fbId = null;
  try { fbId = localStorage.getItem("fallbackId"); } catch(e) {}
  if (!fbId) { fbId = generateFallbackUserId(); try { localStorage.setItem("fallbackId", fbId); } catch(e) {} }
  normalizedUserId = userId === null ? fbId : String(userId);
  currentUserName = getDisplayName(user);
  currentUserPhotoUrl = typeof user.photo_url === "string" ? user.photo_url : "";
  currentTelegramUsername = typeof user.username === "string" ? user.username.trim() : "";
}
function ensureNormalizedUserId() {
  if (normalizedUserId) return normalizedUserId;
  syncTelegramUserContext();
  if (normalizedUserId) return normalizedUserId;
  const fb = generateFallbackUserId();
  normalizedUserId = fb;
  try { localStorage.setItem("fallbackId", fb); } catch(e) {}
  return normalizedUserId;
}
function getInitialLanguage() {
  let s = null; try { s = localStorage.getItem("lang"); } catch(e) {}
  return normalizeLangCode(s) || normalizeLangCode(tg?.initDataUnsafe?.user?.language_code) || DEFAULT_LANGUAGE;
}
function getInitialAIMode() {
  let s = null; try { s = localStorage.getItem(AI_MODE_STORAGE_KEY); } catch(e) {}
  return normalizeAIMode(s);
}
function getInitialAIWins() {
  try {
    const raw = localStorage.getItem(AI_WINS_STORAGE_KEY);
    const p = raw ? JSON.parse(raw) : {};
    const pw = localStorage.getItem(PLAYER_WINS_STORAGE_KEY);
    const cw = localStorage.getItem(COMPUTER_WINS_STORAGE_KEY);
    const lp = pw === null ? null : Number(pw);
    const lc = cw === null ? null : Number(cw);
    return { player: normalizeWins((Number.isFinite(lp) ? lp : null) ?? p?.player), computer: normalizeWins((Number.isFinite(lc) ? lc : null) ?? p?.computer) };
  } catch(e) { return { player:0, computer:0 }; }
}
function persistAIWins() {
  try {
    localStorage.setItem(AI_WINS_STORAGE_KEY, JSON.stringify(aiWins));
    localStorage.setItem(PLAYER_WINS_STORAGE_KEY, String(normalizeWins(aiWins.player)));
    localStorage.setItem(COMPUTER_WINS_STORAGE_KEY, String(normalizeWins(aiWins.computer)));
  } catch(e) {}
}

syncTelegramUserContext();
lang = getInitialLanguage();

// ─── Firebase ────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyB-voWV6lb7JK_gSs_XyzHqpWD78PcMBZk",
  authDomain: "tic-tac-toe-a19ae.firebaseapp.com",
  databaseURL: "https://tic-tac-toe-a19ae-default-rtdb.firebaseio.com",
  projectId: "tic-tac-toe-a19ae"
};
let db = null;
try {
  const fc = window.firebase;
  if (fc && typeof fc.initializeApp === "function" && typeof fc.database === "function") {
    if (!Array.isArray(fc.apps) || fc.apps.length === 0) fc.initializeApp(firebaseConfig);
    db = fc.database();
  }
} catch(e) { console.error("Firebase init failed:", e); }

// ─── Game state ───────────────────────────────────────────────
let board = Array(9).fill("");
let currentPlayer = "X", winner = null, winningCells = [];
let gameMode = "online";
let roomId = null, roomRef = null, roomValueListener = null;
let chatMessagesRef = null;
let playerStatsSubscriptions = [], subscribedPlayerStatsKey = "", playerStatsByUserId = {};
let chatEnabled = false, roomLoaded = false, myRole = null;
let hasAttemptedJoin = false, isJoinAttemptInFlight = false;
let hasShownRoomFullToast = false, isWinAwardInFlight = false, lastProcessedAwardKey = null;
let roomExpiryRedirectTimer = null, autoRestartTimer = null, lastAutoRestartKey = "";
let aiResultAwarded = false, aiWinAwarded = false;
let aiMode = DEFAULT_AI_MODE, aiModeSelectEl = null;
let difficultyControlEl = null, difficultyTriggerEl = null, difficultyDropdownEl = null;
let aiThreatCellsBeforePlayerMove = [];
let aiWins = getInitialAIWins();
let playerStats = createEmptyPlayerStats();
let currentMessages = [], currentChatPlaceholderKey = "chatDisabledAIPlaceholder";
let userStatsRef = null, userStatsListener = null;

// ─── BATTLE STATE ─────────────────────────────────────────────
let battleQueueRef = null, battleQueueListenerRef = null, battleQueueListenerFn = null;
let battleFallbackTimer = null, inBattleQueue = false;
let battleRoomSearchRef = null, battleRoomSearchTimeout = null, battleRoomPlayerOListener = null;
let battleBotOverlayTimer = null, battleBotStartTimer = null;

// KEY FIX: battleBotName persists across all render cycles
// Set by handleBattleBotFallback, cleared only when user goes home
// Read by updatePlayersText on every render
let battleBotName = null;

// ─── DOM refs ─────────────────────────────────────────────────
let homeScreen, gameScreen, boardDiv, statusText, playersDiv;
let messagesDiv, chatInputEl, sendBtnEl, chatBoxEl, inviteBtn, restartBtn;
let settingsModal, profileModal, closeProfileBtn;

// ─── Toast ────────────────────────────────────────────────────
function showToast(msg, dur) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.innerText = msg; el.style.display = "block";
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.display = "none"; }, dur || 2500);
}

// ─── Language ─────────────────────────────────────────────────
function setLanguage(next, persist = true) {
  lang = normalizeLangCode(next) || DEFAULT_LANGUAGE;
  if (persist) try { localStorage.setItem("lang", lang); } catch(e) {}
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  applyTranslations();
}

function applyTranslations() {
  const s = (id, k) => { const el = document.getElementById(id); if (el) el.innerText = t(k); };
  s("navHomeLbl","navHome"); s("navBattleLbl","navBattle"); s("navSettingsLbl","navSettings");
  s("settingsTitle","settings"); s("languageLabel","language"); s("aiModeLabel","aiMode");
  s("aboutTitle","about"); s("developerText","developer"); s("telegramLabel","telegram");
  s("backHomeBtn","backHome"); s("closeSettingsBtn","close");
  s("cancelBattleBtn","cancelSearch");
  if (inviteBtn) inviteBtn.innerText = t("invite");
  if (restartBtn) restartBtn.innerText = t("restart");
  if (sendBtnEl) sendBtnEl.innerText = t("send");
  if (chatInputEl) chatInputEl.placeholder = t(currentChatPlaceholderKey);
  updateDifficultyUI();
}

// ─── Difficulty ───────────────────────────────────────────────
function setAIMode(m, persist = true) {
  aiMode = normalizeAIMode(m);
  if (aiModeSelectEl) aiModeSelectEl.value = aiMode;
  if (persist) try { localStorage.setItem(AI_MODE_STORAGE_KEY, aiMode); } catch(e) {}
  updateDifficultyUI();
}
function updateDifficultyUI() {
  if (!difficultyTriggerEl || !difficultyDropdownEl) return;
  const labels = { easy:t("aiMode_easy"), medium:t("aiMode_medium"), hard:t("aiMode_hard"), adaptive:t("aiMode_adaptive") };
  const tt = document.getElementById("difficultyTriggerText");
  if (tt) tt.innerText = labels[aiMode] || t("difficulty");
  difficultyDropdownEl.querySelectorAll(".difficulty-option").forEach(o => {
    o.classList.toggle("active", o.dataset.value === aiMode);
  });
}
function openDifficultyDropdown() {
  if (!difficultyDropdownEl || !difficultyTriggerEl) return;
  difficultyDropdownEl.classList.add("open");
  difficultyTriggerEl.setAttribute("aria-expanded","true");
}
function closeDifficultyDropdown() {
  if (!difficultyDropdownEl || !difficultyTriggerEl) return;
  difficultyDropdownEl.classList.remove("open");
  difficultyTriggerEl.setAttribute("aria-expanded","false");
}

// ─── User profile ─────────────────────────────────────────────
function showCurrentUserProfile() {
  const pid = ensureNormalizedUserId();
  if (!pid || !db) return;
  const modal = document.getElementById("profileModal");
  if (!modal) return;
  userStatsRef = db.ref("users/" + pid);
  userStatsListener = userStatsRef.on("value", snap => {
    const d = snap.val() || {};
    const wins = normalizeWins(d.wins), losses = normalizeLosses(d.losses);
    const draws = normalizeDraws(d.draws), games = normalizeGames(d.games);
    const xp = normalizeXp(d.xp), level = Math.floor(xp / XP_PER_LEVEL);
    const pct = Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100);
    const set = (id,v) => { const el = document.getElementById(id); if (el) el.innerText = v; };
    set("profileNameValue", d.name || currentUserName || t("guestPlayer"));
    set("profileWinsValue", wins); set("profileLossesValue", losses);
    set("profileDrawsValue", draws); set("profileGamesValue", games);
    set("profileLevelValue", level); set("profileXpValue", xp);
    set("profileXpPercentValue", pct + "%");
    const fill = document.getElementById("profileXpBarFill");
    if (fill) fill.style.width = pct + "%";
  });
  modal.classList.remove("hidden");
}
function closeCurrentUserProfile() {
  const modal = document.getElementById("profileModal");
  if (modal) modal.classList.add("hidden");
  if (userStatsRef && userStatsListener) { userStatsRef.off("value", userStatsListener); userStatsListener = null; userStatsRef = null; }
}

// ─── Player stats ─────────────────────────────────────────────
function stopPlayerStatsListeners() {
  playerStatsSubscriptions.forEach(({ref,listener}) => ref.off("value",listener));
  playerStatsSubscriptions = []; subscribedPlayerStatsKey = ""; playerStatsByUserId = {};
}
function subscribeToPlayerStats(nd) {
  if (!db) return;
  const xId = normalizePlayerId(nd?.players?.X?.id);
  const oId = normalizePlayerId(nd?.players?.O?.id);
  const key = `${xId||""}|${oId||""}`;
  if (key === subscribedPlayerStatsKey) return;
  stopPlayerStatsListeners(); subscribedPlayerStatsKey = key;
  [xId,oId].forEach(pid => {
    if (!pid) return;
    const ref = db.ref("users/" + pid);
    const listener = snap => {
      if (!snap.exists()) {
        db.ref("players/" + pid).once("value").then(ls => {
          playerStatsByUserId[pid] = { wins: normalizeWins(ls.val()?.wins), losses:0, draws:0, games:0, xp:0 };
          updatePlayersText();
        }).catch(() => {});
        return;
      }
      const d = snap.val() || {};
      playerStatsByUserId[pid] = { wins:normalizeWins(d.wins), losses:normalizeLosses(d.losses), draws:normalizeDraws(d.draws), games:normalizeGames(d.games), xp:normalizeXp(d.xp) };
      updatePlayersText();
    };
    ref.on("value", listener);
    playerStatsSubscriptions.push({ref, listener});
  });
}
function incrementUserMatchStats(uid, uname, outcome, awardKey) {
  if (!db || !uid || !awardKey) return;
  const ref = db.ref("users/" + uid);
  const didWin = outcome === "win", didDraw = outcome === "draw", didLose = outcome === "loss";
  const xp = didWin ? XP_GAIN_WIN : (didDraw ? XP_GAIN_DRAW : XP_GAIN_LOSS);
  ref.transaction(cur => {
    const ex = (cur && typeof cur === "object") ? cur : {};
    if (ex.lastAwardedKey === awardKey) return undefined;
    return { ...ex, name: ex.name?.trim() || uname || t("guestPlayer"), wins: normalizeWins(ex.wins)+(didWin?1:0), losses: normalizeLosses(ex.losses)+(didLose?1:0), draws: normalizeDraws(ex.draws)+(didDraw?1:0), games: normalizeGames(ex.games)+1, xp: normalizeXp(ex.xp)+xp, lastWinRoomId: roomId||null, lastAwardedKey: awardKey };
  }).catch(e => console.error("incrementUserMatchStats:", e));
}
function maybeAwardMatchStats(nd) {
  if (gameMode !== "online" || !roomRef || !roomId || isWinAwardInFlight) return;
  const rw = nd?.winner;
  if (rw !== "X" && rw !== "O" && rw !== "draw") return;
  const matchId = getCurrentMatchId(nd), awardKey = getAwardKey(roomId, matchId);
  const currentKey = typeof nd?.stats?.awardedKey === "string" ? nd.stats.awardedKey : null;
  if (!awardKey) return;
  const xP = nd?.players?.X, oP = nd?.players?.O;
  const parts = [
    { symbol:"X", id: normalizePlayerId(xP?.id), name: xP?.name?.trim() || "" },
    { symbol:"O", id: normalizePlayerId(oP?.id), name: oP?.name?.trim() || "" }
  ].filter(p => !!p.id);
  if (!parts.length) return;
  const apply = () => {
    if (lastProcessedAwardKey === awardKey) return;
    lastProcessedAwardKey = awardKey;
    parts.forEach(p => {
      const outcome = rw === "draw" ? "draw" : (rw === p.symbol ? "win" : "loss");
      incrementUserMatchStats(p.id, p.name, outcome, awardKey);
    });
  };
  if (currentKey === awardKey) { apply(); return; }
  if (currentKey && currentKey !== awardKey) return;
  isWinAwardInFlight = true;
  roomRef.child("stats/awardedKey").transaction(ex => { if (ex) return undefined; return awardKey; }, (err, committed) => {
    isWinAwardInFlight = false;
    if (!err && committed) apply();
  });
}

async function fetchUserLocationFromIpApi() {
  if (typeof fetch !== "function") return null;
  try {
    const r = await fetch("https://ipapi.co/json/", { method:"GET", cache:"no-store" });
    if (!r.ok) return null;
    const d = await r.json();
    return { country: normalizeLocationValue(d?.country_name || d?.country), city: normalizeLocationValue(d?.city) };
  } catch(e) { return null; }
}

function ensurePlayerProfileForCurrentUser() {
  if (!db) return Promise.resolve();
  const uid = ensureNormalizedUserId();
  if (!uid) return Promise.resolve();
  const name = currentUserName || t("guestPlayer");
  const uRef = db.ref("users/" + uid);
  const lRef = db.ref("players/" + uid);
  return Promise.all([uRef.once("value"), lRef.once("value")]).then(async ([uSnap, lSnap]) => {
    const now = Date.now();
    if (uSnap.exists()) {
      const ud = uSnap.val() || {};
      if (!shouldRefreshUserCountry(ud, now)) { await uRef.child("lastActive").set(now); return; }
      const loc = await fetchUserLocationFromIpApi();
      if (!loc) { await uRef.child("lastActive").set(now); return; }
      await uRef.transaction(cur => { if (cur && typeof cur === "object") return { ...cur, country:loc.country, lastLocationUpdate:now, lastActive:now }; return cur; });
      return;
    }
    const lw = normalizeWins(lSnap.val()?.wins);
    const loc = await fetchUserLocationFromIpApi();
    return uRef.transaction(cur => {
      if (cur && typeof cur === "object") return { ...cur, lastActive:now };
      return { name, country: normalizeLocationValue(loc?.country), city: normalizeLocationValue(loc?.city), ...(loc ? {lastLocationUpdate:now} : {}), createdAt:now, lastActive:now, wins:lw, losses:0, draws:0, games:0, xp:0 };
    });
  }).catch(e => console.error("ensurePlayerProfile:", e));
}

// ─── AI logic ─────────────────────────────────────────────────
function checkWinner(b) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,bb,c] of lines) { if (b[a] && b[a] === b[bb] && b[a] === b[c]) return { winner:b[a], cells:[a,bb,c] }; }
  if (b.every(x => x !== "")) return { winner:"draw", cells:[] };
  return null;
}
function getEmptyCells(b) { return b.map((v,i) => v===""?i:null).filter(i => i!==null); }
function findWinningMove(sym, b) {
  for (let i = 0; i < b.length; i++) {
    if (b[i] !== "") continue;
    const tb = [...b]; tb[i] = sym;
    const r = checkWinner(tb);
    if (r?.winner === sym) return i;
  }
  return null;
}
function getRandomMove(b) { const e = getEmptyCells(b); return e.length ? e[Math.floor(Math.random()*e.length)] : null; }
function getSmartPositionMove(b) {
  if (b[4]==="" && Math.random() < CENTER_PREFERENCE_RATE) return 4;
  const corners = [0,2,6,8].filter(i => b[i]==="");
  if (corners.length && Math.random() < CORNER_PREFERENCE_RATE) return corners[Math.floor(Math.random()*corners.length)];
  return getRandomMove(b);
}
function minimax(b, depth, isMax, alpha, beta) {
  const r = checkWinner(b);
  if (r?.winner === "O") return 10 - depth;
  if (r?.winner === "X") return depth - 10;
  if (r?.winner === "draw") return 0;
  if (isMax) {
    let best = -Infinity;
    for (const i of getEmptyCells(b)) { b[i]="O"; const s=minimax(b,depth+1,false,alpha,beta); b[i]=""; best=Math.max(best,s); alpha=Math.max(alpha,s); if (beta<=alpha) break; }
    return best;
  }
  let best = Infinity;
  for (const i of getEmptyCells(b)) { b[i]="X"; const s=minimax(b,depth+1,true,alpha,beta); b[i]=""; best=Math.min(best,s); beta=Math.min(beta,s); if (beta<=alpha) break; }
  return best;
}
function getMinimaxMove(b) {
  const e = getEmptyCells(b); if (!e.length) return null;
  let best=-Infinity, move=e[0];
  for (const i of e) { const tb=[...b]; tb[i]="O"; const s=minimax(tb,0,false,-Infinity,Infinity); if (s>best){best=s;move=i;} }
  return move;
}
function getEasyMove(b)  { return Math.random()<EASY_MISTAKE_RATE ? getRandomMove(b) : getMediumMove(b); }
function getMediumMove(b) {
  const win=findWinningMove("O",b); if (win!==null) return win;
  const blk=findWinningMove("X",b); if (blk!==null && Math.random()>=MEDIUM_BLOCK_SKIP_RATE) return blk;
  if (Math.random()<MEDIUM_RANDOM_RATE) return getRandomMove(b);
  return getSmartPositionMove(b);
}
function getHardMove(b)  { return Math.random()<HARD_MISTAKE_RATE ? getMediumMove(b) : getMinimaxMove(b); }
function getAdaptiveMove(b) {
  const cr = playerStats.cornerMoves/Math.max(playerStats.totalMoves,1);
  const br = playerStats.blockMoves/Math.max(playerStats.totalMoves,1);
  const style = (playerStats.blockMoves>=MIN_BLOCKS_FOR_DEFENSIVE && br>=DEFENSIVE_BLOCK_RATE) ? "defensive" : (playerStats.centerFirst>0||cr>=AGGRESSIVE_CORNER_RATE) ? "aggressive" : "random";
  const win=findWinningMove("O",b), blk=findWinningMove("X",b);
  if (style==="aggressive") { if (blk!==null) return blk; if (win!==null) return win; return getHardMove(b); }
  if (style==="defensive")  { if (win!==null) return win; const s=getSmartPositionMove(b); if (s!==null) return s; if (blk!==null) return blk; return getHardMove(b); }
  return getMediumMove(b);
}
function getAIMove(b) {
  const m = normalizeAIMode(aiMode);
  if (m==="easy") return getEasyMove(b);
  if (m==="medium") return getMediumMove(b);
  if (m==="hard") return getHardMove(b);
  return getAdaptiveMove(b);
}
function getAIMoveDelayMs() { return AI_DELAY_MIN_MS + Math.round(Math.random()*(AI_DELAY_MAX_MS-AI_DELAY_MIN_MS)); }
function trackPlayerMove(i) {
  if (gameMode!=="ai") return;
  playerStats.totalMoves++;
  if (playerStats.totalMoves===1 && i===4) playerStats.centerFirst++;
  if ([0,2,6,8].includes(i)) playerStats.cornerMoves++;
  if (aiThreatCellsBeforePlayerMove.includes(i)) playerStats.blockMoves++;
  aiThreatCellsBeforePlayerMove = [];
}
function aiMove() {
  if (gameMode!=="ai" || currentPlayer!=="O" || winner) return;
  const move = getAIMove(board);
  if (move===null) return;
  board[move] = "O";
  const res = checkWinner(board);
  if (res) { winner=res.winner; winningCells=res.cells; maybeAwardAIMatchStats(); }
  else currentPlayer = "X";
  updateStatus(); renderBoard();
}
function updateAIWinsForWinner(w) {
  aiWins.player = normalizeWins(aiWins.player); aiWins.computer = normalizeWins(aiWins.computer);
  if (w==="X") aiWins.player++;
  else if (w==="O") aiWins.computer++;
  else { updatePlayersText(); return; }
  persistAIWins(); updatePlayersText();
}
function maybeAwardAIMatchStats() {
  if (gameMode!=="ai" || (winner!=="X"&&winner!=="O"&&winner!=="draw")) return;
  if (!aiWinAwarded) { updateAIWinsForWinner(winner); aiWinAwarded=true; }
  if (aiResultAwarded || !db) return;
  const uid = ensureNormalizedUserId(); if (!uid) return;
  aiResultAwarded = true;
  const key = `ai:${Date.now().toString(36)}_${generateRoomId()}`;
  const outcome = winner==="draw"?"draw":(winner==="X"?"win":"loss");
  incrementUserMatchStats(uid, currentUserName||t("guestPlayer"), outcome, key);
}

// ─── Render ───────────────────────────────────────────────────
function renderBoard() {
  if (!boardDiv) return;
  boardDiv.innerHTML = "";
  board.forEach((cell, i) => {
    const btn = document.createElement("button");
    btn.className = "cell"; btn.innerText = cell;
    if (winningCells.includes(i)) btn.classList.add("winning");
    const disabled = gameMode==="ai"
      ? !!(cell || winner || currentPlayer==="O")
      : !!(cell || winner || !roomLoaded || !myRole || myRole!==currentPlayer);
    btn.disabled = disabled;
    btn.onclick = () => {
      // KEY FIX: if dropdown is open, close it and cancel this tap
      if (difficultyDropdownEl && difficultyDropdownEl.classList.contains("open")) {
        closeDifficultyDropdown(); return;
      }
      makeMove(i);
    };
    boardDiv.appendChild(btn);
  });
}

function updatePlayersText() {
  if (!playersDiv) return;
  const nd = window.currentRoomData;
  const isAI = gameMode==="ai";
  const curUid = ensureNormalizedUserId();
  const xId = normalizePlayerId(nd?.playerX ?? nd?.players?.X?.id);
  const oId = normalizePlayerId(nd?.playerO ?? nd?.players?.O?.id);
  const dup = !!(xId && oId && xId===oId);
  const x = isAI ? t("labelYou") : (xId ? `${xId===curUid?t("labelYou"):t("labelFriend")} (X)` : t("playerX"));
  // KEY FIX: battleBotName is read every render — never gets overwritten by "Computer"
  const o = isAI
    ? (battleBotName || t("labelComputer"))
    : (oId && !dup ? `${oId===curUid?t("labelYou"):t("labelFriend")} (O)` : t("waiting"));
  const xW = isAI ? aiWins.player  : normalizeWins(nd?.playerXWins);
  const oW = isAI ? aiWins.computer: normalizeWins(nd?.playerOWins);
  playersDiv.innerHTML = "";
  const mk = (sym, name, wins) => {
    const b = document.createElement("div"); b.className = "player-stat-block";
    const n = document.createElement("div"); n.className = "player-name-line"; n.innerText = `${sym} ${name}`;
    const w = document.createElement("div"); w.className = "player-wins-line"; w.innerText = `${t("winsLabel")}: ${wins}`;
    b.appendChild(n); b.appendChild(w); return b;
  };
  playersDiv.appendChild(mk("❌", x, xW));
  playersDiv.appendChild(mk("⭕", o, oW));
}

function updateStatus() {
  if (!statusText) return;
  if (gameMode==="ai") {
    if (winner==="draw") statusText.innerText = t("draw");
    else if (winner) statusText.innerText = winner==="X" ? t("win") : t("opponentWinsAI");
    else statusText.innerText = currentPlayer==="X" ? t("yourTurn") : t("aiThinking");
    updatePlayersText(); updatePostGameActionLabels(); setInviteButtonState(); scheduleAutoRestartIfNeeded();
    return;
  }
  const nd = window.currentRoomData;
  if (!nd || !nd.players) { statusText.innerText = t("loadingRoom"); return; }
  if (!nd.players.O) { statusText.innerText = t("waitingOpponent"); return; }
  if (winner==="draw") statusText.innerText = t("draw");
  else if (winner && myRole) statusText.innerText = winner===myRole ? t("win") : t("opponentWins");
  else if (winner) statusText.innerText = t("symbolWins",{symbol:winner});
  else if (!myRole) statusText.innerText = t("turnOf",{player:currentPlayer});
  else if (myRole===currentPlayer) statusText.innerText = t("yourTurn");
  else statusText.innerText = t("opponentTurn");
  updatePostGameActionLabels(); setInviteButtonState(); scheduleAutoRestartIfNeeded();
}

function scheduleAutoRestartIfNeeded() {
  if (winner!=="X" && winner!=="O" && winner!=="draw") {
    lastAutoRestartKey = "";
    if (autoRestartTimer) { clearTimeout(autoRestartTimer); autoRestartTimer=null; }
    return;
  }
  const matchId = gameMode==="online" ? getCurrentMatchId(window.currentRoomData) : LOCAL_MATCH_ID;
  const key = `${gameMode}:${roomId||"local"}:${matchId}:${winner}`;
  if (lastAutoRestartKey===key || autoRestartTimer) return;
  lastAutoRestartKey = key;
  autoRestartTimer = setTimeout(() => { autoRestartTimer=null; restartGame(); }, AUTO_RESTART_DELAY_MS);
}

function updatePostGameActionLabels() {
  if (!inviteBtn || !restartBtn) return;
  const ended = !!winner;
  if (gameMode==="ai") { restartBtn.innerText=ended?POST_GAME_RESTART_LABEL:t("restart"); inviteBtn.style.display="none"; return; }
  restartBtn.innerText = ended?POST_GAME_RESTART_LABEL:t("restart");
  inviteBtn.innerText = ended?POST_GAME_INVITE_LABEL:t("invite");
}
function setInviteButtonState() {
  if (!inviteBtn) return;
  inviteBtn.style.display = gameMode==="ai" ? "none" : "";
}
function updateActionButtons() {
  if (!inviteBtn || !restartBtn) return;
  restartBtn.style.display = !!(myRole && roomLoaded) ? "" : "none";
  setInviteButtonState();
}

// ─── Move ─────────────────────────────────────────────────────
function makeMove(i) {
  if (board[i]!=="" || winner) return;
  if (gameMode==="ai") {
    aiThreatCellsBeforePlayerMove = [];
    for (let j=0; j<board.length; j++) {
      if (board[j]!=="") continue;
      const tb=[...board]; tb[j]="O";
      if (checkWinner(tb)?.winner==="O") aiThreatCellsBeforePlayerMove.push(j);
    }
    board[i]="X"; trackPlayerMove(i);
    const res=checkWinner(board);
    if (res) { winner=res.winner; winningCells=res.cells; maybeAwardAIMatchStats(); }
    else { currentPlayer="O"; setTimeout(aiMove, getAIMoveDelayMs()); }
    updateStatus(); renderBoard(); return;
  }
  if (!roomLoaded || !roomRef) return;
  if (!myRole) { showToast(t("youAreSpectating")); return; }
  if (myRole!==currentPlayer) { showToast(t("notYourTurn")); return; }
  const nb=[...board]; nb[i]=myRole;
  const res=checkWinner(nb);
  if (res) {
    const fi = window.firebase?.database?.ServerValue?.increment;
    const wk = res.winner==="X"?"playerXWins":(res.winner==="O"?"playerOWins":null);
    const upd = { board:nb, winner:res.winner, winningCells:res.cells, turn:null };
    if (wk && typeof fi==="function") upd[wk]=fi(1);
    roomRef.update(upd).catch(e => { console.error(e); showToast(t("moveFailed")); });
  } else {
    roomRef.update({ board:nb, turn:myRole==="X"?"O":"X" }).catch(e => { console.error(e); showToast(t("moveFailed")); });
  }
}

// ─── Restart ──────────────────────────────────────────────────
function restartGame() {
  if (autoRestartTimer) { clearTimeout(autoRestartTimer); autoRestartTimer=null; }
  lastAutoRestartKey = "";
  if (gameMode==="ai") {
    aiResultAwarded=false; aiWinAwarded=false;
    board=Array(9).fill(""); currentPlayer="X"; winner=null; winningCells=[];
    playerStats=createEmptyPlayerStats(); aiThreatCellsBeforePlayerMove=[];
    updateStatus(); renderBoard(); return;
  }
  if (!myRole || !roomLoaded) { showToast(t("onlyPlayersRestart")); return; }
  const nextId = getCurrentMatchId(window.currentRoomData)+1;
  lastProcessedAwardKey=null;
  roomRef.update({ board:Array(9).fill(""), turn:"X", winner:null, winningCells:[], stats:{matchId:nextId,awardedKey:null} })
    .catch(e => { console.error(e); showToast(t("restartFailed")); });
}

// ─── Share ────────────────────────────────────────────────────
function shareGame() {
  if (gameMode!=="online" || !roomId) { if (!db) { showToast(t("failedCreateRoom")); return; } createGame(); return; }
  const link = `${window.location.origin}${window.location.pathname}#room=${roomId}`;
  const url = "https://t.me/share/url?url="+encodeURIComponent(link)+"&text="+encodeURIComponent(t("inviteShareText"));
  if (isRunningInsideTelegramWebApp()) tg.openTelegramLink(url);
  else window.open(url,"_blank","noopener,noreferrer");
}
function openDeveloperTelegram(e) {
  if (!isRunningInsideTelegramWebApp()) return;
  e.preventDefault(); tg.openTelegramLink(DEVELOPER_TELEGRAM_URL);
}

// ─── Navigation ───────────────────────────────────────────────
function showGame() {
  if (homeScreen) { homeScreen.classList.add("hidden"); homeScreen.style.display="none"; }
  if (gameScreen) { gameScreen.classList.remove("hidden"); gameScreen.style.display="flex"; }
  document.body.classList.add("game-active");
  setBottomNavActive("home"); window.scrollTo(0,0);
}

// KEY FIX: goHome restores all pointer events and clears battleBotName
function goHome() {
  battleBotName = null;                          // clear bot name on home
  document.body.style.pointerEvents = "auto";   // always restore taps
  closeCurrentUserProfile();
  closeDifficultyDropdown();
  if (roomExpiryRedirectTimer) { clearTimeout(roomExpiryRedirectTimer); roomExpiryRedirectTimer=null; }
  stopRoomListener(); stopChatListener();
  cleanupBattleMatchmaking();
  hideBattleOverlay();
  // Hide all modals — reset inline pointerEvents to CSS default (not "none")
  document.querySelectorAll(".modal,.overlay").forEach(el => {
    el.classList.add("hidden");
    el.style.pointerEvents = "";   // empty string = use CSS rule
  });
  roomId=null; roomRef=null; aiResultAwarded=false; lastAutoRestartKey="";
  if (autoRestartTimer) { clearTimeout(autoRestartTimer); autoRestartTimer=null; }
  setChatEnabled(false,"chatDisabledAIPlaceholder");
  setChatVisibility(true);
  if (gameScreen) { gameScreen.classList.add("hidden"); gameScreen.style.display="none"; }
  if (homeScreen) { homeScreen.classList.remove("hidden"); homeScreen.style.display="flex"; }
  document.body.classList.remove("game-active","ai-mode");
  setBottomNavActive("home"); window.scrollTo(0,0);
}

function setBottomNavActive(tab) {
  ["navHomeBtn","navBattleBtn","navSettingsBtn"].forEach(id => {
    document.getElementById(id)?.classList.remove("nav-btn-active");
  });
  const map = {home:"navHomeBtn",battle:"navBattleBtn",settings:"navSettingsBtn"};
  if (map[tab]) document.getElementById(map[tab])?.classList.add("nav-btn-active");
}

function handleRoomUnavailable(msg, delay=0) {
  showToast(msg);
  if (delay>0) roomExpiryRedirectTimer=setTimeout(goHome,delay);
  else goHome();
}

// ─── AI Game ─────────────────────────────────────────────────
// KEY FIX: fromBotFallback=true prevents clearing battleBotName
function startAIGame(fromBotFallback = false) {
  if (!fromBotFallback) battleBotName = null;  // only clear for normal AI game
  stopRoomListener(); stopChatListener(); cleanupBattleMatchmaking(); hideBattleOverlay();
  roomId=null; roomRef=null; gameMode="ai";
  board=Array(9).fill(""); currentPlayer="X"; winner=null; winningCells=[];
  aiResultAwarded=false; aiWinAwarded=false;
  playerStats=createEmptyPlayerStats(); aiThreatCellsBeforePlayerMove=[];
  lastAutoRestartKey="";
  if (autoRestartTimer) { clearTimeout(autoRestartTimer); autoRestartTimer=null; }
  window.currentRoomData=null;
  document.body.classList.add("ai-mode");
  if (difficultyControlEl) difficultyControlEl.classList.remove("hidden");
  disableChatForAI();
  showGame(); updateDifficultyUI(); updateStatus(); renderBoard();
}

// ─── Online Game ──────────────────────────────────────────────
function normalizeRoomData(data) {
  return {
    playerX: normalizePlayerId(data.playerX ?? data.players?.X?.id),
    playerO: normalizePlayerId(data.playerO ?? data.players?.O?.id),
    board: Array.isArray(data.board) ? data.board.map(c=>c||"") : Array(9).fill(""),
    turn: data.turn||"X", winner: data.winner||null,
    winningCells: Array.isArray(data.winningCells)?data.winningCells:[],
    playerXWins: normalizeWins(data.playerXWins), playerOWins: normalizeWins(data.playerOWins),
    createdAt: data.createdAt||0, stats: data.stats||{matchId:1,awardedKey:null},
    players: { X: data.players?.X||null, O: data.players?.O||null }
  };
}

function createGame() {
  if (!db) { showToast(t("failedCreateRoom")); return; }
  if (!normalizedUserId) { showToast(t("unableVerifyIdentity")); return; }
  gameMode="online"; roomId=generateRoomId(); roomRef=db.ref("rooms/"+roomId);
  roomRef.set({
    playerX:normalizedUserId, playerO:null,
    board:Array(9).fill(""), turn:"X", winner:null, winningCells:[],
    playerXWins:0, playerOWins:0, createdAt:Date.now(),
    stats:{matchId:1,awardedKey:null},
    players:{X:{id:normalizedUserId,name:currentUserName||t("guestPlayer")},O:null}
  }).then(() => {
    if (difficultyControlEl) difficultyControlEl.classList.add("hidden");
    document.body.classList.remove("ai-mode");
    showGame(); setChatEnabled(true,"typeMessage"); setChatVisibility(true); listenRoom(); setInviteButtonState();
    window.history.replaceState(null,"",window.location.pathname+"#room="+roomId);
  }).catch(e => { console.error(e); showToast(t("failedCreateRoom")); });
}

function listenRoom() {
  if (!roomRef) return;
  if (roomValueListener) roomRef.off("value",roomValueListener);
  hasAttemptedJoin=false; isJoinAttemptInFlight=false;
  roomValueListener = snap => {
    const data=snap.val();
    if (!data) { handleRoomUnavailable(t("gameNotFound")); return; }
    if (isRoomExpired(data)) { handleRoomUnavailable(t("gameExpired"),ROOM_EXPIRED_REDIRECT_DELAY_MS); roomRef?.remove().catch(()=>{}); return; }
    const uid=ensureNormalizedUserId();
    const xId=normalizePlayerId(data.playerX??data.players?.X?.id);
    const oId=normalizePlayerId(data.playerO??data.players?.O?.id);
    const isCreator=xId===uid, isOpponent=oId===uid, isKnown=isCreator||isOpponent, isFull=!!(xId&&oId);
    if (!isFull||isKnown) hasShownRoomFullToast=false;
    if (!oId&&xId&&!isCreator&&!isOpponent&&!hasAttemptedJoin&&!isJoinAttemptInFlight) {
      isJoinAttemptInFlight=true;
      roomRef.transaction(cur => {
        if (!cur?.players?.X) return cur;
        const cXId=normalizePlayerId(cur.playerX??cur.players?.X?.id);
        const cOId=normalizePlayerId(cur.playerO??cur.players?.O?.id);
        if (!cXId||cXId===uid||cOId) return cur;
        return { ...cur, playerX:cXId, playerO:uid, players:{...(cur.players||{}), X:cur.players.X||{id:cXId,name:t("playerX")}, O:{id:uid,name:currentUserName||t("playerO")} } };
      }, (err,committed) => { isJoinAttemptInFlight=false; hasAttemptedJoin=true; });
      return;
    }
    if (isFull&&!isKnown&&!hasShownRoomFullToast) { hasShownRoomFullToast=true; showToast(t("roomFull")); }
    const nd=normalizeRoomData(data);
    window.currentRoomData=nd; roomLoaded=true;
    board=nd.board; currentPlayer=nd.turn; winner=nd.winner; winningCells=nd.winningCells;
    const nxId=normalizePlayerId(nd.players.X?.id), noId=normalizePlayerId(nd.players.O?.id);
    if (nxId&&nxId===uid) myRole="X"; else if (noId&&noId===uid) myRole="O"; else myRole=null;
    subscribeToPlayerStats(nd); maybeAwardMatchStats(nd);
    updatePlayersText(); updateStatus(); renderBoard(); updateActionButtons();
  };
  roomRef.on("value",roomValueListener);
  startChatListener(); setChatEnabled(true,"typeMessage");
}

function stopRoomListener() {
  if (roomRef&&roomValueListener) roomRef.off("value",roomValueListener);
  roomValueListener=null; roomLoaded=false; myRole=null;
  hasAttemptedJoin=false; isJoinAttemptInFlight=false;
  isWinAwardInFlight=false; lastProcessedAwardKey=null;
  stopPlayerStatsListeners(); window.currentRoomData=null;
}

// ─── Battle matchmaking ───────────────────────────────────────
function startBattleMatchmaking() {
  if (!db) { showToast(t("failedCreateRoom")); return; }
  const uid = ensureNormalizedUserId();
  if (!uid) { showToast(t("unableVerifyIdentity")); return; }
  setBottomNavActive("battle");
  showBattleOverlay();
  cleanupBattleMatchmaking();
  inBattleQueue=true;
  battleQueueRef = db.ref("queue/"+uid);
  battleQueueRef.onDisconnect().remove().catch(()=>{});
  battleQueueRef.set({userId:uid,timestamp:Date.now(),status:"waiting"}).then(() => {
    battleQueueListenerFn = snap => {
      const candidates=[];
      snap.forEach(child => {
        const d=child.val();
        if (!d||d.userId===uid||d.status!=="waiting") return;
        candidates.push({ref:child.ref,data:d,key:child.key});
      });
      if (candidates.length>0) {
        if (battleFallbackTimer) { clearTimeout(battleFallbackTimer); battleFallbackTimer=null; }
        if (battleQueueListenerRef&&battleQueueListenerFn) { battleQueueListenerRef.off("value",battleQueueListenerFn); battleQueueListenerFn=null; }
        battleQueueListenerRef=null;
        tryMatchWithCandidates(candidates,0,uid);
      }
    };
    battleQueueListenerRef = db.ref("queue");
    battleQueueListenerRef.on("value",battleQueueListenerFn);
    battleFallbackTimer = setTimeout(() => {
      battleFallbackTimer=null;
      handleBattleBotFallback(uid);
    }, BATTLE_MATCHMAKING_WINDOW_MS);
  }).catch(e => { console.error(e); inBattleQueue=false; hideBattleOverlay(); showToast(t("failedCreateRoom")); });
}

function tryMatchWithCandidates(candidates, index, myUid) {
  if (index>=candidates.length) { createAndWaitForBattleOpponent(myUid); return; }
  const candidate=candidates[index];
  candidate.ref.transaction(cur => {
    if (!cur||cur.status!=="waiting") return cur;
    return {...cur,status:"taken"};
  }, (err,committed,snap) => {
    if (err||!committed) { tryMatchWithCandidates(candidates,index+1,myUid); return; }
    const opponentId=snap?.val()?.userId;
    if (!opponentId) { tryMatchWithCandidates(candidates,index+1,myUid); return; }
    const newRoomId=generateRoomId(), newRoomRef=db.ref("rooms/"+newRoomId);
    newRoomRef.set({
      playerX:myUid,playerO:opponentId,
      board:Array(9).fill(""),turn:"X",winner:null,winningCells:[],
      playerXWins:0,playerOWins:0,createdAt:Date.now(),
      stats:{matchId:1,awardedKey:null},
      players:{X:{id:myUid,name:currentUserName||t("guestPlayer")},O:{id:opponentId,name:t("playerO")}}
    }).then(() => {
      const upd={}; upd["queue/"+opponentId+"/status"]="matched"; upd["queue/"+opponentId+"/roomId"]=newRoomId;
      return db.ref().update(upd);
    }).then(() => {
      if (battleQueueRef) { battleQueueRef.cancelOnDisconnect().catch(()=>{}); battleQueueRef.remove().catch(()=>{}); battleQueueRef=null; }
      setTimeout(()=>{db.ref("queue/"+opponentId).remove().catch(()=>{});},OPPONENT_QUEUE_CLEANUP_DELAY_MS);
      hideBattleOverlay();
      roomId=newRoomId; roomRef=newRoomRef; gameMode="online";
      board=Array(9).fill(""); currentPlayer="X"; winner=null; winningCells=[];
      roomLoaded=false; myRole=null; hasShownRoomFullToast=false; window.currentRoomData=null;
      if (difficultyControlEl) difficultyControlEl.classList.add("hidden");
      document.body.classList.remove("ai-mode");
      showGame(); setInviteButtonState(); listenRoom();
    }).catch(e => { console.error(e); hideBattleOverlay(); setBottomNavActive("home"); showToast(t("failedCreateRoom")); });
  });
}

function createAndWaitForBattleOpponent(myUid) {
  if (battleQueueRef) battleQueueRef.update({status:"matched_waiting"}).catch(()=>{});
  const myQRef=db.ref("queue/"+myUid);
  battleRoomSearchTimeout=setTimeout(()=>{
    if (battleRoomSearchRef&&battleRoomPlayerOListener) { battleRoomSearchRef.off("value",battleRoomPlayerOListener); battleRoomPlayerOListener=null; }
    battleRoomSearchRef=null; battleRoomSearchTimeout=null;
    if (battleQueueRef) { battleQueueRef.remove().catch(()=>{}); battleQueueRef=null; }
    hideBattleOverlay(); setBottomNavActive("home"); showToast(t("failedCreateRoom"));
  },PLAYER_O_ROOM_WAIT_TIMEOUT_MS);
  battleRoomPlayerOListener=snap=>{
    const d=snap.val();
    if (!d||!d.roomId) return;
    clearTimeout(battleRoomSearchTimeout); battleRoomSearchTimeout=null;
    myQRef.off("value",battleRoomPlayerOListener); battleRoomPlayerOListener=null; battleRoomSearchRef=null;
    const fRoomId=String(d.roomId);
    myQRef.remove().catch(()=>{});
    if (battleQueueRef) { battleQueueRef.cancelOnDisconnect().catch(()=>{}); battleQueueRef=null; }
    hideBattleOverlay();
    roomId=fRoomId; roomRef=db.ref("rooms/"+fRoomId); gameMode="online";
    board=Array(9).fill(""); currentPlayer="X"; winner=null; winningCells=[];
    roomLoaded=false; myRole=null; hasShownRoomFullToast=false; window.currentRoomData=null;
    if (difficultyControlEl) difficultyControlEl.classList.add("hidden");
    document.body.classList.remove("ai-mode");
    showGame(); setInviteButtonState(); listenRoom();
  };
  battleRoomSearchRef=myQRef;
  myQRef.on("value",battleRoomPlayerOListener);
}

// KEY FIX: Bot fallback — sets battleBotName BEFORE calling startAIGame(true)
// battleBotName is read by updatePlayersText on every render cycle
function handleBattleBotFallback(resolvedUserId) {
  inBattleQueue=false;
  if (battleQueueRef) { battleQueueRef.cancelOnDisconnect().catch(()=>{}); battleQueueRef.remove().catch(()=>{}); battleQueueRef=null; }
  if (battleQueueListenerRef&&battleQueueListenerFn) { battleQueueListenerRef.off("value",battleQueueListenerFn); battleQueueListenerFn=null; }
  battleQueueListenerRef=null;
  // Generate bot identity
  const names=["Alex","Mia","Luca","Sara","Omar","Yuki","Priya","Tom","Elena","Kai","Zara","Finn","Leila","Marco","Aiko","Ryan","Nora","Diego","Hana","James"];
  const countries={US:"🇺🇸",GB:"🇬🇧",DE:"🇩🇪",FR:"🇫🇷",JP:"🇯🇵",BR:"🇧🇷",IN:"🇮🇳",AU:"🇦🇺",CA:"🇨🇦",KR:"🇰🇷",MX:"🇲🇽",IT:"🇮🇹",ES:"🇪🇸",NL:"🇳🇱",TR:"🇹🇷",AR:"🇦🇷",PL:"🇵🇱",SE:"🇸🇪",ZA:"🇿🇦",NG:"🇳🇬"};
  const codes=Object.keys(countries);
  const name=names[Math.floor(Math.random()*names.length)];
  const code=codes[Math.floor(Math.random()*codes.length)];
  // Set battleBotName — this is read by updatePlayersText on every render
  battleBotName = name + " " + countries[code];
  // Update overlay status text
  const statusEl=document.getElementById("battleStatusText");
  if (statusEl) statusEl.innerText=t("noPlayersFoundBot");
  // Step 1: hide overlay after 600ms
  battleBotOverlayTimer=setTimeout(()=>{ battleBotOverlayTimer=null; hideBattleOverlay(); },600);
  // Step 2: start AI game — fromBotFallback=true so battleBotName is NOT cleared
  battleBotStartTimer=setTimeout(()=>{ battleBotStartTimer=null; startAIGame(true); },1100);
}

// KEY FIX: cleanupBattleMatchmaking clears ALL timers including bot timers
function cleanupBattleMatchmaking() {
  if (battleFallbackTimer) { clearTimeout(battleFallbackTimer); battleFallbackTimer=null; }
  if (battleBotOverlayTimer) { clearTimeout(battleBotOverlayTimer); battleBotOverlayTimer=null; }
  if (battleBotStartTimer) { clearTimeout(battleBotStartTimer); battleBotStartTimer=null; }
  if (battleQueueListenerRef&&battleQueueListenerFn) { battleQueueListenerRef.off("value",battleQueueListenerFn); battleQueueListenerFn=null; }
  battleQueueListenerRef=null;
  if (battleRoomSearchRef&&battleRoomPlayerOListener) { battleRoomSearchRef.off("value",battleRoomPlayerOListener); battleRoomPlayerOListener=null; }
  battleRoomSearchRef=null;
  if (battleRoomSearchTimeout) { clearTimeout(battleRoomSearchTimeout); battleRoomSearchTimeout=null; }
  if (inBattleQueue&&battleQueueRef) { battleQueueRef.cancelOnDisconnect().catch(()=>{}); battleQueueRef.remove().catch(()=>{}); }
  battleQueueRef=null; inBattleQueue=false;
}

function showBattleOverlay() {
  const modal=document.getElementById("battleModal");
  if (modal) { modal.classList.remove("hidden"); modal.style.pointerEvents="auto"; }
  const st=document.getElementById("battleStatusText");
  if (st) st.innerText=t("searchingOpponent");
}
function hideBattleOverlay() {
  const modal=document.getElementById("battleModal");
  if (modal) { modal.classList.add("hidden"); modal.style.pointerEvents=""; }
}

// KEY FIX: cancelBattleSearch — simple, clean, no double execution
function cancelBattleSearch() {
  cleanupBattleMatchmaking();
  hideBattleOverlay();
  document.body.style.pointerEvents="auto";
  goHome();
}

// ─── Chat ─────────────────────────────────────────────────────
function startChatListener() {
  if (!roomRef) return;
  stopChatListener();
  chatMessagesRef=roomRef.child("messages");
  chatMessagesRef.orderByChild("time").on("value", snap => {
    const msgs=[];
    snap.forEach(child => {
      const d=child.val()||{};
      const txt=typeof d.text==="string"?d.text.trim():"";
      if (!txt) return;
      msgs.push({ userId:getMessageUserId(d), name:(typeof d.name==="string"&&d.name.trim())||t("guestPlayer"), text:txt, time:typeof d.time==="number"?d.time:0 });
    });
    currentMessages=msgs; renderMessages(msgs);
  });
}
function stopChatListener() { if (chatMessagesRef) { chatMessagesRef.off(); chatMessagesRef=null; } }
function sendChatMessage() {
  if (!roomRef||!chatInputEl) return;
  const txt=chatInputEl.value.trim();
  if (!txt||txt.length>MAX_MESSAGE_LENGTH) return;
  const sid=ensureNormalizedUserId(); if (!sid) return;
  roomRef.child("messages").push({userId:sid,name:currentUserName||t("guestPlayer"),text:txt,time:Date.now()})
    .then(()=>{ chatInputEl.value=""; chatInputEl.focus(); })
    .catch(e=>{ console.error(e); showToast(t("failedSendMessage")); });
}
function renderMessages(msgs) {
  if (!messagesDiv) return;
  messagesDiv.innerHTML="";
  if (!msgs.length) {
    const el=document.createElement("div"); el.className="empty-message"; el.innerText=t("noMessagesYet");
    messagesDiv.appendChild(el); return;
  }
  msgs.forEach(msg => {
    const item=document.createElement("div"); item.className="message-item";
    if (msg.userId===normalizedUserId) item.classList.add("mine");
    const sn=document.createElement("div"); sn.className="message-sender"; sn.innerText=msg.name;
    const tx=document.createElement("div"); tx.className="message-text"; tx.innerText=msg.text;
    item.appendChild(sn); item.appendChild(tx); messagesDiv.appendChild(item);
  });
  if (messagesDiv) messagesDiv.scrollTop=messagesDiv.scrollHeight;
}
function setChatEnabled(enabled, placeholder) {
  chatEnabled=enabled;
  if (!chatInputEl||!sendBtnEl) return;
  currentChatPlaceholderKey=placeholder||"typeMessage";
  chatInputEl.disabled=!enabled; sendBtnEl.disabled=!enabled;
  chatInputEl.placeholder=t(currentChatPlaceholderKey);
  if (!enabled&&messagesDiv) {
    chatInputEl.value=""; messagesDiv.innerHTML="";
    const el=document.createElement("div"); el.className="empty-message"; el.innerText=t("chatDisabledAI");
    messagesDiv.appendChild(el);
  }
}
function disableChatForAI() { stopChatListener(); setChatEnabled(false,"chatDisabledAIPlaceholder"); setChatVisibility(false); }
function setChatVisibility(v) { if (chatBoxEl) chatBoxEl.classList.toggle("hidden",!v); }

// ─── User info bar ────────────────────────────────────────────
function renderUserInfo() {
  const el=document.getElementById("userInfo"); if (!el) return;
  const name=currentUserName||t("guestPlayer");
  el.innerHTML=`<div class="user-info-bar" id="userInfoBar" style="cursor:pointer">
    <div class="user-avatar">${currentUserPhotoUrl?`<img src="${currentUserPhotoUrl}" alt=""/>`:`<span>${name.charAt(0).toUpperCase()}</span>`}</div>
    <div class="user-name">${name}</div>
  </div>`;
  document.getElementById("userInfoBar")?.addEventListener("click",showCurrentUserProfile);
}

// ─── DOMContentLoaded ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  homeScreen = document.getElementById("homeScreen");
  gameScreen = document.getElementById("gameScreen");
  boardDiv = document.getElementById("board");
  statusText = document.getElementById("statusText");
  playersDiv = document.getElementById("players");
  messagesDiv = document.getElementById("messages");
  chatInputEl = document.getElementById("chatInput");
  sendBtnEl = document.getElementById("sendBtn");
  chatBoxEl = document.getElementById("chatBox");
  inviteBtn = document.getElementById("inviteBtn");
  restartBtn = document.getElementById("restartBtn");
  settingsModal = document.getElementById("settingsModal");
  profileModal = document.getElementById("profileModal");
  closeProfileBtn = document.getElementById("closeProfileBtn");
  difficultyControlEl = document.getElementById("difficultyControl");
  difficultyTriggerEl = document.getElementById("difficultyTrigger");
  difficultyDropdownEl = document.getElementById("difficultyDropdown");
  aiModeSelectEl = document.getElementById("aiModeSelect");
  const languageSelect = document.getElementById("languageSelect");

  setAIMode(getInitialAIMode(), false);
  setLanguage(lang, false);
  if (languageSelect) languageSelect.value=lang;
  renderUserInfo();
  ensurePlayerProfileForCurrentUser().catch(e=>console.error(e));

  // ── Bottom nav ──
  document.getElementById("navHomeBtn")?.addEventListener("click",()=>{ hideBattleOverlay(); goHome(); });
  document.getElementById("navBattleBtn")?.addEventListener("click",startBattleMatchmaking);
  document.getElementById("navSettingsBtn")?.addEventListener("click",()=>{ setBottomNavActive("settings"); settingsModal?.classList.remove("hidden"); });

  // KEY FIX: Settings buttons restore pointerEvents
  document.getElementById("backHomeBtn")?.addEventListener("click",()=>{
    settingsModal?.classList.add("hidden");
    document.body.style.pointerEvents="auto";
    goHome();
  });
  document.getElementById("closeSettingsBtn")?.addEventListener("click",()=>{
    settingsModal?.classList.add("hidden");
    document.body.style.pointerEvents="auto";
  });
  settingsModal?.addEventListener("click",e=>{
    if (e.target===settingsModal) { settingsModal.classList.add("hidden"); document.body.style.pointerEvents="auto"; }
  });
  languageSelect?.addEventListener("change",e=>setLanguage(e.target.value));
  aiModeSelectEl?.addEventListener("change",e=>{ setAIMode(e.target.value); if (gameMode==="ai") setTimeout(resetAIGameBoardPreservingWins,DIFFICULTY_CHANGE_ANIMATION_DELAY_MS); });
  document.getElementById("aboutTelegramLink")?.addEventListener("click",openDeveloperTelegram);

  // Profile
  closeProfileBtn?.addEventListener("click",closeCurrentUserProfile);
  profileModal?.addEventListener("click",e=>{ if (e.target===profileModal) closeCurrentUserProfile(); });

  // Game actions
  inviteBtn?.addEventListener("click",shareGame);
  restartBtn?.addEventListener("click",restartGame);
  sendBtnEl?.addEventListener("click",sendChatMessage);
  chatInputEl?.addEventListener("keydown",e=>{ if (e.key==="Enter") sendChatMessage(); });

  // Difficulty dropdown
  difficultyTriggerEl?.addEventListener("click",e=>{
    e.stopPropagation();
    difficultyDropdownEl?.classList.contains("open") ? closeDifficultyDropdown() : openDifficultyDropdown();
  });
  difficultyDropdownEl?.addEventListener("click",e=>e.stopPropagation());
  difficultyDropdownEl?.querySelectorAll(".difficulty-option").forEach(opt=>{
    opt.addEventListener("click",()=>{
      setAIMode(opt.dataset.value); closeDifficultyDropdown();
      if (gameMode==="ai") setTimeout(resetAIGameBoardPreservingWins,DIFFICULTY_CHANGE_ANIMATION_DELAY_MS);
    });
  });

  // KEY FIX: close dropdown using getBoundingClientRect — works on Android WebView
  // contains() fails for position:fixed elements on Android
  document.addEventListener("click",e=>{
    if (!difficultyDropdownEl?.classList.contains("open")) return;
    const dr=difficultyDropdownEl.getBoundingClientRect();
    const tr=difficultyTriggerEl?.getBoundingClientRect();
    const inD=e.clientX>=dr.left&&e.clientX<=dr.right&&e.clientY>=dr.top&&e.clientY<=dr.bottom;
    const inT=tr&&e.clientX>=tr.left&&e.clientX<=tr.right&&e.clientY>=tr.top&&e.clientY<=tr.bottom;
    if (!inD&&!inT) closeDifficultyDropdown();
  },true);

  document.addEventListener("touchstart",e=>{
    if (!difficultyDropdownEl?.classList.contains("open")) return;
    const touch=e.touches[0]; if (!touch) return;
    const dr=difficultyDropdownEl.getBoundingClientRect();
    const tr=difficultyTriggerEl?.getBoundingClientRect();
    const inD=touch.clientX>=dr.left&&touch.clientX<=dr.right&&touch.clientY>=dr.top&&touch.clientY<=dr.bottom;
    const inT=tr&&touch.clientX>=tr.left&&touch.clientX<=tr.right&&touch.clientY>=tr.top&&touch.clientY<=tr.bottom;
    if (!inD&&!inT) closeDifficultyDropdown();
  },{capture:true,passive:true});

  // KEY FIX: Cancel button — onclick= is reliable on Android, addEventListener is not
  const cancelBtn=document.getElementById("cancelBattleBtn");
  if (cancelBtn) {
    cancelBtn.onclick=e=>{ e.preventDefault(); e.stopPropagation(); cancelBattleSearch(); };
  }

  // Join from URL
  const initialRoomId=getRoomIdFromLocation();
  if (initialRoomId&&db) {
    gameMode="online"; roomId=initialRoomId; roomRef=db.ref("rooms/"+initialRoomId);
    if (difficultyControlEl) difficultyControlEl.classList.add("hidden");
    document.body.classList.remove("ai-mode");
    showGame(); setChatEnabled(true,"typeMessage"); setChatVisibility(true); listenRoom(); setInviteButtonState();
  }

  // Queue cleanup on page close
  window.addEventListener("beforeunload",()=>{
    if (inBattleQueue&&battleQueueRef) battleQueueRef.remove().catch(()=>{});
  });
});

// ─── Reset board (keep session score) ────────────────────────
function resetAIGameBoardPreservingWins() {
  if (gameMode!=="ai") return;
  if (autoRestartTimer) { clearTimeout(autoRestartTimer); autoRestartTimer=null; }
  lastAutoRestartKey=""; aiResultAwarded=false; aiWinAwarded=false;
  board=Array(9).fill(""); currentPlayer="X"; winner=null; winningCells=[];
  playerStats=createEmptyPlayerStats(); aiThreatCellsBeforePlayerMove=[];
  updatePlayersText(); updateStatus(); renderBoard();
}
