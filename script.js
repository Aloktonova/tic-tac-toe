// 📱 Telegram
const tg = window.Telegram?.WebApp;
if (tg && typeof tg.expand === "function") tg.expand();
const DEVELOPER_TELEGRAM_URL = "https://t.me/alokmaurya22";
const DEFAULT_LANGUAGE = "en";
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
    symbolWins: "{symbol} Wins 🎉",
    playerVs: "❌ {x} vs ⭕ {o}",
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
    failedSendMessage: "Failed to send message."
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

function ensurePlayerProfileForCurrentUser() {
  if (!db) return Promise.resolve();
  const resolvedUserId = ensureNormalizedUserId();
  if (!resolvedUserId) return Promise.resolve();
  const playerName = currentUserName || t("guestPlayer");
  const userRef = db.ref("users/" + resolvedUserId);
  const legacyRef = db.ref("players/" + resolvedUserId);

  return Promise.all([userRef.once("value"), legacyRef.once("value")])
    .then(([, legacySnapshot]) => {
      const legacyWins = normalizeWins(legacySnapshot.val()?.wins);

      return userRef.transaction((current) => {
        if (!current || typeof current !== "object") {
          return {
            name: playerName,
            wins: legacyWins,
            losses: 0,
            draws: 0,
            games: 0,
            xp: 0
          };
        }

        const next = { ...current };
        next.name = playerName;
        if (typeof next.wins !== "number" || !Number.isFinite(next.wins) || next.wins < 0) {
          next.wins = legacyWins;
        } else {
          next.wins = Math.max(normalizeWins(next.wins), legacyWins);
        }
        if (typeof next.games !== "number" || !Number.isFinite(next.games) || next.games < 0) {
          next.games = 0;
        }
        if (typeof next.losses !== "number" || !Number.isFinite(next.losses) || next.losses < 0) {
          next.losses = 0;
        }
        if (typeof next.draws !== "number" || !Number.isFinite(next.draws) || next.draws < 0) {
          next.draws = 0;
        }
        if (typeof next.xp !== "number" || !Number.isFinite(next.xp) || next.xp < 0) {
          next.xp = 0;
        }
        return next;
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
let isWinAwardInFlight = false;
let lastProcessedAwardKey = null;

const MAX_MESSAGE_LENGTH = 500;
const XP_PER_LEVEL = 100;
const XP_GAIN_WIN = 10;
const XP_GAIN_DRAW = 7;
const XP_GAIN_LOSS = 5;
const AUTO_RESTART_DELAY_MS = 2000;
const LOCAL_MATCH_ID = 1;

// 🎯 UI ELEMENTS
let userInfo, boardDiv, statusText, playersDiv;
let homeScreen, gameScreen;
let messagesDiv, chatInputEl, sendBtnEl, chatBoxEl;
let inviteBtn, restartBtn, homeBtn;
let settingsModal;
let profileModal, closeProfileBtn, profileNameValue, profileWinsValue, profileLossesValue, profileDrawsValue, profileGamesValue, profileLevelValue, profileXpValue, profileXpBarFill, profileXpPercentValue;
let autoRestartTimer = null;
let lastAutoRestartKey = "";

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
  const homeButton = document.getElementById("homeBtn");
  const sendButton = document.getElementById("sendBtn");
  const settingsTitle = document.getElementById("settingsTitle");
  const languageLabel = document.getElementById("languageLabel");
  const aboutTitle = document.getElementById("aboutTitle");
  const developerText = document.getElementById("developerText");
  const telegramLabel = document.getElementById("telegramLabel");
  const backHomeButton = document.getElementById("backHomeBtn");
  const closeSettingsButton = document.getElementById("closeSettingsBtn");

  if (createBtn) createBtn.innerText = t("playFriend");
  if (aiBtn) aiBtn.innerText = t("playAI");
  if (inviteButton) inviteButton.innerText = t("invite");
  if (restartButton) restartButton.innerText = t("restart");
  if (homeButton) homeButton.innerText = t("home");
  if (sendButton) sendButton.innerText = t("send");
  if (settingsTitle) settingsTitle.innerText = t("settings");
  if (languageLabel) languageLabel.innerText = t("language");
  if (aboutTitle) aboutTitle.innerText = t("about");
  if (developerText) developerText.innerText = t("developer");
  if (telegramLabel) telegramLabel.innerText = t("telegram");
  if (backHomeButton) backHomeButton.innerText = t("backHome");
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
    stats: {
      matchId: getCurrentMatchId(raw),
      awardedKey: typeof raw.stats?.awardedKey === "string" ? raw.stats.awardedKey : null
    },
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
  homeBtn = document.getElementById("homeBtn");
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
  const footerDeveloperLink = document.getElementById("footerDeveloperLink");
  const aboutTelegramLink = document.getElementById("aboutTelegramLink");

  // 🔥 BUTTON FIX (IMPORTANT)
  createBtn.addEventListener("click", createGame);
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
  closeProfileBtn?.addEventListener("click", closeCurrentUserProfile);
  profileModal?.addEventListener("click", (event) => {
    if (event.target === profileModal) closeCurrentUserProfile();
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
  if (!db) return;
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
    board: ["","","","","","","","",""],
    turn: "X",
    winner: null,
    winningCells: [],
    stats: {
      matchId: 1,
      awardedKey: null
    },
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
function startAIGame() {
  console.log("AI CLICKED");

  stopRoomListener();
  stopChatListener();
  roomId = null;
  roomRef = null;
  window.currentRoomData = null;

  gameMode = "ai";
  aiResultAwarded = false;

  board = ["","","","","","","","",""];
  currentPlayer = "X";
  winner = null;
  winningCells = [];
  lastAutoRestartKey = "";
  if (autoRestartTimer) {
    clearTimeout(autoRestartTimer);
    autoRestartTimer = null;
  }
  showGame();

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
  inviteBtn.style.display = isOnlineMode ? "" : "none";
  if (isOnlineMode && chatBoxEl) chatBoxEl.style.display = "";
  setChatVisibility(isOnlineMode);
}

function updatePlayersText() {
  if (!playersDiv) return;
  const data = window.currentRoomData;
  const x = data?.players?.X?.name || t("playerX");
  const o = data?.players?.O?.name || t("waiting");
  const xId = normalizePlayerId(data?.players?.X?.id);
  const oId = normalizePlayerId(data?.players?.O?.id);
  const xWins = xId ? normalizeWins(playerStatsByUserId[xId]?.wins) : 0;
  const oWins = oId ? normalizeWins(playerStatsByUserId[oId]?.wins) : 0;

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
    board[i] = "X";

    let res = checkWinner(board);
    if (res) {
      winner = res.winner;
      winningCells = res.cells;
      maybeAwardAIMatchStats();
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
    maybeAwardAIMatchStats();
  } else {
    currentPlayer = "X";
  }

  updateStatus();
  renderBoard();
}

function maybeAwardAIMatchStats() {
  if (gameMode !== "ai" || aiResultAwarded) return;
  if (winner !== "X" && winner !== "O" && winner !== "draw") return;
  if (!db) return;

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
  if (homeScreen) homeScreen.style.display = "none";
  if (gameScreen) gameScreen.style.display = "flex";
  document.body.classList.add("game-active");
  window.scrollTo(0, 0);
}

function goHome() {
  closeCurrentUserProfile();
  stopRoomListener();
  stopChatListener();
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
