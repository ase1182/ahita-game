const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 520;
const BGM_VOLUME = 0.25;
const SFX_VOLUME_BASE = 0.52;
const APP_VERSION = "v0.3.14"; // index.html の #build-version と合わせる
const STORAGE_KEYS = {
  balance: "ahita.cookies.balance",
  lastGrantRunId: "ahita.cookies.lastGrantRunId",
  version: "ahita.cookies.version",
  currentRunId: "ahita.ahita.currentRunId",
  resultReachedAt: "ahita.ahita.resultReachedAt",
  recommendationsFromResult: "ahita.recommendations.fromResult",
  recommendationsBgmWasPlaying: "ahita.recommendations.bgmWasPlaying",
  recommendationsBgmTime: "ahita.recommendations.bgmTime"
};

console.info("また明日も会うきみへ version:", APP_VERSION);

const PAYOFF_TABLE = {
  [`${SHARE}_${SHARE}`]: { player: 3, opponent: 3 },
  [`${TAKE}_${SHARE}`]: { player: 5, opponent: 0 },
  [`${SHARE}_${TAKE}`]: { player: 0, opponent: 5 },
  [`${TAKE}_${TAKE}`]: { player: 1, opponent: 1 }
};

const REACTION_MESSAGES = {
  bothShare: [
    "+3枚。広場の空気が、少しやわらぎました。",
    "+3枚。半分ずつの選択が、静かに残りました。",
    "+3枚。相手の影が、少しだけ近く見えました。",
    "+3枚。森の風が、ほんの少し軽くなりました。",
    "+3枚。冷たい沈黙は、今日は残りませんでした。",
    "+3枚。分けたあとも、明日の余白が残っていました。",
    "+3枚。相手は、少し長くこちらを見ていました。",
    "+3枚。クッキーの間に、静かな時間が流れました。",
    "+3枚。ふたりの距離が、少しだけ近く感じられました。",
    "+3枚。昨日までの空気が、少しほどけたようでした。",
    "+3枚。相手は離れず、広場に残っていました。",
    "+3枚。森の奥で、風が小さく向きを変えました。",
    "+3枚。分けたことが、今日の明るさになりました。",
    "+3枚。相手の気配が、少しやわらかくなりました。",
    "+3枚。明日もここに来られそうな空気でした。",
    "+3枚。広場の真ん中に、小さな余白ができました。",
    "+3枚。今日のことは、静かにしまわれたようでした。",
    "+3枚。分けるという選択が、道を少し明るくしました。",
    "+3枚。多くはなくても、何かは残りました。",
    "+3枚。明日の広場が、少し近く見えました。"
  ],
  youShareOpponentTakes: [
    "0枚。差し出したぶんは、今日は戻ってきませんでした。",
    "0枚。広場に、少し冷たい間ができました。",
    "0枚。分けるつもりだった手が、少し止まりました。",
    "0枚。相手は何も言わず、向こうに残っていました。",
    "0枚。信じたぶんだけ、広場が広く見えました。",
    "0枚。森の空気が、少し固くなりました。",
    "0枚。差し出した選択だけが、静かに残りました。",
    "0枚。明日のことを考えるには、少し静かすぎる広場でした。",
    "0枚。空になった手元に、風だけが触れました。",
    "0枚。相手の沈黙が、昨日より長く感じられました。",
    "0枚。分けた気持ちは、すぐには返ってきませんでした。",
    "0枚。広場の向こうで、気配だけが揺れました。",
    "0枚。今日は、同じ重さでは返りませんでした。",
    "0枚。手元の空白が、少しだけ目立ちました。",
    "0枚。相手は近づいたようで、まだ遠いままでした。",
    "0枚。森の影が、ほんの少し濃く見えました。",
    "0枚。差し出したことは、相手の中にしまわれたようでした。",
    "0枚。報われるには、少し早かったのかもしれません。",
    "0枚。広場には、空っぽの場所だけが残りました。",
    "0枚。それでも、明日はまだ残っています。"
  ],
  youTakeOpponentShares: [
    "+5枚。今日だけなら、それは得に見えました。",
    "+5枚。広場は、少し静かになりました。",
    "+5枚。相手は何も持たず、こちらを見ていました。",
    "+5枚。甘さのあとに、少しの距離が残りました。",
    "+5枚。相手の影が、少し遠くなったようでした。",
    "+5枚。森の奥で、空気が細くなりました。",
    "+5枚。多く取ったぶん、真ん中の余白が広がりました。",
    "+5枚。相手の沈黙が、今日のことを覚えているようでした。",
    "+5枚。甘いものと、静けさが同時に残りました。",
    "+5枚。その選択は、すぐには誰にも責められませんでした。",
    "+5枚。相手との間に、少しだけ線が引かれたようでした。",
    "+5枚。広場の向こうで、気配が小さく揺れました。",
    "+5枚。明日の空気は、まだ分かりません。",
    "+5枚。相手は何かを言いかけて、黙りました。",
    "+5枚。得をしたはずなのに、広場は少し冷たく感じられました。",
    "+5枚。今日の多さが、明日に残るかもしれません。",
    "+5枚。手元は満ち、広場は少し遠くなりました。",
    "+5枚。相手の前に、静かな空白が残りました。",
    "+5枚。森は、その選び方も覚えているようでした。",
    "+5枚。甘さの向こうで、次の日が待っていました。"
  ],
  bothTake: [
    "+1枚。ふたりとも、自分の分だけを守りました。",
    "+1枚。広場の真ん中に、冷たい沈黙が残りました。",
    "+1枚。今日は、どちらの手も前に出ませんでした。",
    "+1枚。距離は、あまり縮まりませんでした。",
    "+1枚。守ったはずなのに、あたたかさは少しだけでした。",
    "+1枚。相手も動かず、広場も静かなままでした。",
    "+1枚。誰も差し出さなかったので、何も戻ってきませんでした。",
    "+1枚。森の空気が、少し暗くなったようでした。",
    "+1枚。昨日よりかたい静けさがありました。",
    "+1枚。失わないようにして、少しずつ失ったようでした。",
    "+1枚。ふたりの影は、同じ場所から動きませんでした。",
    "+1枚。広場には、小さなおやつと長い沈黙が残りました。",
    "+1枚。次の一歩を待つような空気でした。",
    "+1枚。明日の広場が、少し遠く感じられました。",
    "+1枚。お互いの選択が、同じ冷たさで並びました。",
    "+1枚。今日は、誰も先に信じませんでした。",
    "+1枚。残った距離のほうが、少し目立ちました。",
    "+1枚。沈黙だけが、少し長く残りました。",
    "+1枚。守る選択が、広場を静かにしました。",
    "+1枚。次の日が、少し重たく見えました。"
  ]
};

const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const dayLabel = document.getElementById("day-label");
const dayNote = document.getElementById("day-note");
const progressBar = document.getElementById("progress-bar");
const snackIcon = document.getElementById("snack-icon");
const message = document.getElementById("message");
const turnResultLine = document.getElementById("turn-result-line");
const turnClueLine = document.getElementById("turn-clue-line");
const opponentName = document.getElementById("opponent-name");
const playerTrack = document.getElementById("player-track");
const opponentTrack = document.getElementById("opponent-track");
const resultPlayerTrack = document.getElementById("result-player-track");
const resultOpponentTrack = document.getElementById("result-opponent-track");
const forestStage = document.getElementById("forest-stage");
const playerCard = document.getElementById("player-card");
const opponentImage = document.getElementById("opponent-image");
const opponentFallback = document.getElementById("opponent-fallback");
const resultOpponentImage = document.getElementById("result-opponent-image");
const resultOpponentFallback = document.getElementById("result-opponent-fallback");

const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const resultStory = document.getElementById("result-story");
const snackResult = document.getElementById("snack-result");
const relationshipEnding = document.getElementById("relationship-ending");
const opponentReveal = document.getElementById("opponent-reveal");
const opponentText = document.getElementById("opponent-text");
const opponentProfile = document.getElementById("opponent-profile");
const opponentProfileTemperament = document.getElementById("opponent-profile-temperament");
const opponentProfileHabit = document.getElementById("opponent-profile-habit");
const opponentProfileMemory = document.getElementById("opponent-profile-memory");
const forestCookieBalance = document.getElementById("forest-cookie-balance");
const grantCookiesButton = document.getElementById("grant-cookies-button");
const grantCookiesMessage = document.getElementById("grant-cookies-message");
const resultCookiesPanel = document.querySelector(".result-cookies-panel");
const resultCookieNotice = document.querySelector(".result-cookie-notice");
const dayMotionTargets = [dayLabel, dayNote, playerTrack, opponentTrack, message];

const startButton = document.getElementById("start-button");
const shareButton = document.getElementById("share-button");
const takeButton = document.getElementById("take-button");
const retryButton = document.getElementById("retry-button");
const shareResultButton = document.getElementById("share-result-button");
const recommendationsLink = document.querySelector(".result-recommend-link");
const recommendationsOverlay = document.getElementById("recommendations-overlay");
const closeRecommendationsOverlayButton = document.getElementById("close-recommendations-overlay");
const recommendationsFrame = document.getElementById("recommendations-frame");
const newOpponentButton = document.getElementById("new-opponent-button");
const continueButton = document.getElementById("continue-button");
const bgm = document.getElementById("bgm");
const soundToggleButton = document.getElementById("sound-toggle");
const cardFlipSe = document.getElementById("se-card-flip");
const shareSnackSe = document.getElementById("se-share-snack");
const bushRustleSe = document.getElementById("se-bush-rustle");
const woodDropSe = document.getElementById("se-wood-drop");
const buildVersionElement = document.getElementById("build-version");

if (buildVersionElement) {
  buildVersionElement.textContent = APP_VERSION;
}


const RESULT_LINES = {
  ss: "ふたりで分けました。あなたに3枚届きました。",
  ts: "あなたは多く持ち帰りました。手元に5枚残りました。",
  st: "相手が多く持ち帰りました。あなたには1枚届きました。",
  tt: "ふたりとも手元を守りました。あなたに届いたのは1枚だけでした。"
};

function compactClueLine(line) {
  if (typeof line !== "string") return "";
  const trimmed = line.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 40) return trimmed;

  const sentence = trimmed.split(/[。！？!?]/u)[0]?.trim() || trimmed;
  if (sentence.length <= 34) return sentence;

  const shortCut = sentence.slice(0, 34);
  const boundary = Math.max(
    shortCut.lastIndexOf("、"),
    shortCut.lastIndexOf(" "),
    shortCut.lastIndexOf("　")
  );
  const safeCut = (boundary >= 18 ? shortCut.slice(0, boundary) : shortCut).replace(/[、\s　]+$/u, "");
  return `${safeCut}…`;
}

function setTurnMessage(resultLine, clueLine = "") {
  if (turnResultLine && turnClueLine) {
    turnResultLine.textContent = resultLine;
    turnClueLine.textContent = clueLine;
    turnClueLine.hidden = clueLine.length === 0;
    return;
  }
  message.textContent = clueLine ? `${resultLine}
${clueLine}` : resultLine;
}
const state = { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, currentOpponent: null, isProcessingTurn: false, isFinished: false, resultTypeTitle: "", turnResolved: false, decisionTimes: [], turnStartedAt: 0 };
let safeStorage = null;

function initializeStorage() {
  try {
    if (!window || !window.localStorage) return null;
    const testKey = "__ahita_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (_error) {
    return null;
  }
}

function readNumber(key, fallback) {
  if (!safeStorage) return fallback;
  const raw = safeStorage.getItem(key);
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    safeStorage.setItem(key, String(fallback));
    return fallback;
  }
  return value;
}

function readString(key, fallback) {
  if (!safeStorage) return fallback;
  const raw = safeStorage.getItem(key);
  if (typeof raw !== "string" || raw.length === 0) {
    safeStorage.setItem(key, fallback);
    return fallback;
  }
  return raw;
}

function ensureCookieStorageDefaults() {
  const version = readNumber(STORAGE_KEYS.version, 1);
  if (version !== 1 && safeStorage) safeStorage.setItem(STORAGE_KEYS.version, "1");
  readNumber(STORAGE_KEYS.balance, 0);
  readString(STORAGE_KEYS.lastGrantRunId, "");
  readString(STORAGE_KEYS.currentRunId, "");
  readString(STORAGE_KEYS.resultReachedAt, "");
}

function getCurrentRunId() {
  return readString(STORAGE_KEYS.currentRunId, "");
}

function setCurrentRunId(runId) {
  if (!safeStorage) return;
  safeStorage.setItem(STORAGE_KEYS.currentRunId, runId);
}

function issueNewRunId() {
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  setCurrentRunId(runId);
}

function hideForestCookieUi() {
  if (resultCookiesPanel) {
    resultCookiesPanel.hidden = true;
    resultCookiesPanel.setAttribute("aria-hidden", "true");
  }
  if (resultCookieNotice) {
    resultCookieNotice.hidden = true;
    resultCookieNotice.setAttribute("aria-hidden", "true");
  }
}

function updateCookieGrantUi() {
  if (!forestCookieBalance || !grantCookiesButton || !grantCookiesMessage) return;
  const balance = readNumber(STORAGE_KEYS.balance, 0);
  forestCookieBalance.textContent = `残高: ${balance}`;
  const currentRunId = getCurrentRunId();
  const lastGrantRunId = readString(STORAGE_KEYS.lastGrantRunId, "");
  const grantAmount = Math.max(0, Math.floor(state.playerScore));
  const canGrant = Boolean(currentRunId) && lastGrantRunId !== currentRunId && grantAmount > 0;
  grantCookiesButton.disabled = !canGrant;
  grantCookiesButton.textContent = `フォレストクッキーを受け取る（+${grantAmount}）`;
  grantCookiesMessage.textContent = canGrant
    ? `この森で得た ${grantAmount} クッキーを受け取れます。`
    : grantAmount > 0
      ? "このプレイ分は受け取り済みです。"
      : "このプレイでは受け取れるフォレストクッキーがありません。";
}

function grantForestCookies() {
  if (!safeStorage) {
    if (grantCookiesMessage) grantCookiesMessage.textContent = "このブラウザでは保存機能が使えないため受け取れません。";
    return;
  }
  const currentRunId = getCurrentRunId();
  const lastGrantRunId = readString(STORAGE_KEYS.lastGrantRunId, "");
  if (!currentRunId || lastGrantRunId === currentRunId) {
    updateCookieGrantUi();
    return;
  }
  const grantAmount = Math.max(0, Math.floor(state.playerScore));
  if (grantAmount <= 0) {
    updateCookieGrantUi();
    return;
  }
  const balance = readNumber(STORAGE_KEYS.balance, 0);
  safeStorage.setItem(STORAGE_KEYS.balance, String(balance + grantAmount));
  safeStorage.setItem(STORAGE_KEYS.lastGrantRunId, currentRunId);
  if (grantCookiesMessage) grantCookiesMessage.textContent = `${grantAmount} フォレストクッキーを受け取りました。`;
  updateCookieGrantUi();
}

// Character image assets are loaded from /assets relative to index.html

const getLastRoundScores = ({ playerHistory, opponentHistory }) => {
  if (!playerHistory.length || !opponentHistory.length) return null;
  const lastPlayerMove = playerHistory[playerHistory.length - 1];
  const lastOpponentMove = opponentHistory[opponentHistory.length - 1];
  return PAYOFF_TABLE[`${lastPlayerMove}_${lastOpponentMove}`] || null;
};

const strategies = {
  mirrorYesterday: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory[playerHistory.length - 1]),
  cautiousCrow: ({ day, playerHistory }) => (day === 1 ? TAKE : playerHistory.filter((m) => m === SHARE).length >= 3 ? SHARE : TAKE),
  forgetfulRabbit: ({ playerHistory }) => (playerHistory.slice(-2).every((m) => m === TAKE) && playerHistory.length >= 2 ? TAKE : SHARE),
  alwaysCooperate: () => SHARE,
  grimTrigger: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory.includes(TAKE) ? TAKE : SHARE),
  pavlovLike: ({ day, playerHistory, opponentHistory }) => {
    if (day === 1 || playerHistory.length === 0 || opponentHistory.length === 0) return SHARE;
    const lastOpponentMove = opponentHistory[opponentHistory.length - 1];
    const lastResult = getLastRoundScores({ playerHistory, opponentHistory });
    if (!lastResult) return SHARE;
    return lastResult.opponent >= 3 ? lastOpponentMove : (lastOpponentMove === SHARE ? TAKE : SHARE);
  },
  generousMirror: ({ day, playerHistory }) => {
    if (day === 1 || playerHistory.length === 0) return SHARE;
    const lastPlayerMove = playerHistory[playerHistory.length - 1];
    if (lastPlayerMove === SHARE) return SHARE;
    return day % 2 === 0 ? SHARE : TAKE;
  },
  randomMood: () => (Math.random() < 0.5 ? SHARE : TAKE),
  suspiciousMirror: ({ day, playerHistory }) => (day === 1 ? TAKE : playerHistory[playerHistory.length - 1]),
  testerOwl: ({ day, playerHistory }) => {
    if (day === 1) return SHARE;
    if (day === 2) return TAKE;
    const hasTakeHistory = playerHistory.includes(TAKE);
    if (hasTakeHistory) return SHARE;
    return day % 2 === 0 ? TAKE : SHARE;
  },
  alternator: ({ day }) => (day % 2 === 0 ? TAKE : SHARE),
  alwaysTake: () => TAKE,
  twoWarnings: ({ day, playerHistory }) => {
    if (day === 1 || playerHistory.length < 2) return SHARE;
    const lastTwoMoves = playerHistory.slice(-2);
    return lastTwoMoves.every((move) => move === TAKE) ? TAKE : SHARE;
  },
  majorityFollower: ({ day, playerHistory }) => {
    if (day === 1) return SHARE;
    const takeCount = playerHistory.filter((move) => move === TAKE).length;
    const shareCount = playerHistory.length - takeCount;
    return takeCount > shareCount ? TAKE : SHARE;
  } ,
  remembersForTwoDays: ({ day, playerHistory }) => {
    if (day === 1) return SHARE;
    return playerHistory.slice(-2).includes(TAKE) ? TAKE : SHARE;
  },
  followsRichSide: ({ day, playerHistory, opponentHistory }) => {
    if (day === 1) return SHARE;
    const lastResult = getLastRoundScores({ playerHistory, opponentHistory });
    if (!lastResult) return SHARE;
    return lastResult.player > lastResult.opponent ? TAKE : SHARE;
  },
  changesAfterThree: ({ day, playerHistory }) => {
    if (day <= 2) return SHARE;
    return playerHistory.filter((move) => move === TAKE).length >= 2 ? TAKE : SHARE;
  },
  rareTaker: ({ day }) => (day === 3 || day === 6 ? TAKE : SHARE)

};

// OPPONENT_SCHEMA
// - id: 内部キー（一意・英小文字推奨）
// - name: 表示名
// - emoji: fallback表示や演出用
// - image: 結果画面の画像パス
// - description: 結果画面の説明文
// - strategyKey: strategies のキー
// - spawnWeight: 相手抽選時の重み（selectWeightedOpponent で使用）
// - mask: 現状未使用（将来の正体隠し演出向けに保持）
const opponents = [
  { id: "tanuki", name: "まねっこタヌキ", emoji: "🦝", mask: "⬛", image: "assets/tanuki.webp", description: "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。", strategyKey: "mirrorYesterday", spawnWeight: 1, profile: { temperament: "相手のしたことをよく見て、次の日にそっと返す子です。", habit: "信じてもらえた日は信じ返し、ひとりじめされた日は少し身を守ります。", memory: "あなたの選び方が、そのままこの子の明日の表情になっていました。" }, clueLines: { early: ["草むらの向こうで、こちらの手元をじっと見ていた。", "まだ距離はあるのに、動きだけはよく似て見えた。", "こちらが手を動かすと、少し遅れて同じしぐさが返ってきた。"], mid: ["昨日のしぐさを、そっと返してくる気配があった。", "あなたの選び方を映すように、相手も手を動かした。", "真似るような間合いで、同じ広場に立っていた。"], late: ["去り際、丸い影がこちらの歩幅をなぞっていった。", "低い足音が重なり、同じ調子のまま夕暮れへ消えた。", "ふさふさした影が、あなたの足あとを追うように揺れた。"] } },
  { id: "crow", name: "疑い深いカラス", emoji: "🐦‍⬛", mask: "⬛", image: "assets/crow.webp", description: "最初は距離を置く。あなたが分けた日が重なるほど、少しずつ手を伸ばす子でした。", strategyKey: "cautiousCrow", spawnWeight: 1, profile: { temperament: "高い枝の上から、相手の動きをよく見ている子です。", habit: "すぐには近づかず、自分のおやつを守るように選びます。", memory: "近づきすぎず、離れすぎず、最後まであなたの出方を見ていました。" }, clueLines: { early: ["少し高い場所から、こちらを試すような視線があった。", "すぐには降りてこず、距離だけを測っているようだった。", "枝の間で気配だけが揺れ、まだ近づいてはこなかった。"], mid: ["警戒は残したまま、昨日より半歩だけ近づいてきた。", "こちらの出方を見定めるように、動きが慎重だった。", "気を許すかどうかを、枝の影から決めているようだった。"], late: ["頭上で気配が揺れ、視線だけがそっと通り過ぎた。", "遠い場所で足を止め、最後までこちらを見ていた。", "去り際に枝先が揺れ、暗い気配だけが空へ残った。"] } },
  { id: "porcupine", name: "しばらく覚えるやまあらし", emoji: "🦔", mask: "⬛", image: "assets/porcupine.webp", description: "こわかったことを少しの間だけ覚えて、しばらく身を守る相手でした。", strategyKey: "remembersForTwoDays", spawnWeight: 0.25, profile: { temperament: "近づきたい気持ちはありますが、すぐには針をしまえない子です。", habit: "こわかった日のことが近くにあるうちは、少し距離を置きます。", memory: "安心できる日が続くと、また少しずつ広場へ戻ってきました。" }, clueLines: { early: ["相手は少し離れたまま、こちらの手元を見ていた。", "近づきかけては、すぐに身を丸める気配があった。", "草の影で小さく止まり、様子だけをうかがっていた。"], mid: ["昨日の空気を覚えたまま、今日は半歩だけ寄ってきた。", "安心しきる前に、また距離を取り直すしぐさがあった。", "近づきたい気持ちと身を守る気持ちが、交互に見えた。"], late: ["土の上に小さく丸い跡が残り、すぐ草むらへ戻っていった。", "夕方の影がふくらんで、触れない距離を静かに保っていた。", "去り際に短い足音だけが残り、気配はすぐ薄れた。"] } },
  { id: "raven", name: "多く持つ方を見るからす", emoji: "🐦‍⬛", mask: "⬛", image: "assets/raven.webp", description: "前の日にどちらが多く持っていたかを見て、次の日の距離を変える相手でした。", strategyKey: "followsRichSide", spawnWeight: 0.25, profile: { temperament: "高いところから、広場のおやつの行方をよく見ている子です。", habit: "前の日に多く持っていた方を見て、次の日の近づき方を変えます。", memory: "おやつの偏りを、黒い目で静かに覚えていました。" }, clueLines: { early: ["離れた枝の奥で、重たい静けさがこちらを見ていた。", "近づかず、広場の真ん中だけをじっと確かめていた。", "黒い気配が高い場所で動かずにいた。"], mid: ["昨日の多い少ないを量るように、目線が左右へ流れた。", "相手は一歩も急がず、結果だけを覚えているようだった。", "枝影の中で、確かめる間だけが長く続いた。"], late: ["気配が一度だけ揺れて、頭上を静かに渡っていった。", "去り際、濃い気配が幹のそばへ降りて静かに消えた。", "最後まで声はなく、重たい気配だけが残った。"] } },
  { id: "turtle", name: "三日目から変わるかめ", emoji: "🐢", mask: "⬛", image: "assets/turtle.webp", description: "はじめはゆっくり分けながら、途中からこれまでの様子を見て変わる相手でした。", strategyKey: "changesAfterThree", spawnWeight: 0.25, profile: { temperament: "すぐには決めず、ゆっくり広場に慣れていく子です。", habit: "はじめの数日は分けながら、途中から足あとを見て選びます。", memory: "遅い歩みの中に、あなたの7日間が少しずつ残っていました。" }, clueLines: { early: ["相手はゆっくり近づき、広場の端で静かに止まった。", "急がない足どりが、土の上に短い跡を残した。", "こちらを見るまでに、少し間があった。"], mid: ["昨日のことを遅れて受け取るように、反応が一拍遅かった。", "ぶれない歩幅で、同じ場所へ戻ってきた。", "静かなままでも、選び方には迷いが見えなかった。"], late: ["低い影が夕日の中をまっすぐ進み、土に細い線を残した。", "去り際の足音は小さいのに、跡だけは長く続いていた。", "最後の日も、同じ速さで広場を離れていった。"] } },
  { id: "sheep", name: "まれに手を伸ばすひつじ", emoji: "🐑", mask: "⬛", image: "assets/sheep.webp", description: "ふだんは分けようとするけれど、まれに自分の分へ手を伸ばす相手でした。", strategyKey: "rareTaker", spawnWeight: 0.25, profile: { temperament: "穏やかに見えて、心の中に小さな揺れを持つ子です。", habit: "多くの日は分けますが、ときどき自分の分を先に抱えます。", memory: "静かな足あとに、ふと違う向きの日が混ざっていました。" }, clueLines: { early: ["やわらかな気配が、相手の空気をうかがっていた。", "少し離れて立ちながら、こちらの手元に視線を寄せていた。", "風に流されるように、立つ位置がふわりと変わった。"], mid: ["広場の空気がやわらぐと、相手もすぐ近くまで来た。", "昨日の雰囲気をそのまままとって、選び方が揺れていた。", "安心できる日は、足どりまで軽く見えた。"], late: ["夕方に淡い影が重なり、静かな足音が草へ消えた。", "去り際の気配はやさしく、広場にやわらかな余韻が残った。", "最後まで、相手の空気に寄り添うような間合いだった。"] } },
  { id: "rabbit", name: "忘れっぽいウサギ", emoji: "🐰", mask: "⬛", image: "assets/rabbit.webp", description: "ふだんはわける。でも、続けて傷つくと少しだけ身を守る。けれど、戻るのも早い子でした。", strategyKey: "forgetfulRabbit", spawnWeight: 1, profile: { temperament: "こわかったことも、時間がたつと少し薄れていく子です。", habit: "昨日のことを全部は抱えきれないので、また分けるほうへ戻りやすくなります。", memory: "何度も迷いながら、それでも次の日には広場へ来てくれました。" }, clueLines: { early: ["軽い足音が近づいたかと思うと、また草むらに消えた。", "さっきの緊張を忘れたように、ふいに距離が縮まった。", "小さな影が行き過ぎて、またすぐ戻ってきた。"], mid: ["こわがっていたのに、次の日にはまた顔を見せていた。", "昨日の重さを置いてきたように、動きが少し軽かった。", "身を守る日があっても、戻る速さは思ったより早かった。"], late: ["夕方の草の間で、軽い気配が小さく揺れた。", "細かな足跡が途切れながらも、また広場へ戻ってきた。", "去り際の足音は軽く、次の朝にはもう近くにいた。"] } },
  { id: "squirrel", name: "分けつづけるりす", emoji: "🐿️", mask: "⬛", image: "assets/squirrel.webp", description: "いつも分けようとする、疑うことを知らない相手でした。", strategyKey: "alwaysCooperate", spawnWeight: 1, profile: { temperament: "小さなおやつでも、誰かと分けることを先に考える子です。", habit: "疑うよりも、まず差し出してみることを選びます。", memory: "あなたがどう選んでも、最後まで同じように広場に立っていました。" }, clueLines: { early: ["こちらが迷う前に、小さくうなずく気配があった。", "木の根元で、ためらいのない手つきが先に見えた。", "こぼれたおやつのそばで、先に分けるしぐさを見せていた。"], mid: ["分けるしぐさだけは、毎日ぶれずに残っていた。", "広場の空気が重くても、相手の動きはやわらかかった。", "疑うより先に差し出すような、素直な間があった。"], late: ["木陰で小さな動きが続き、すぐにまた戻ってきた。", "細い爪あとが幹に残り、同じ場所へ戻っていた。", "小さな影は幹を回って、また広場へ戻ってきた。"] } },
  { id: "wolf", name: "忘れないおおかみ", emoji: "🐺", mask: "⬛", image: "assets/wolf.webp", description: "最初は分けようとするけれど、一度裏切られると最後まで忘れない相手でした。", strategyKey: "grimTrigger", spawnWeight: 1, profile: { temperament: "最初は静かに分けようとしますが、一度のことを深く覚える子です。", habit: "傷ついたあとは、もう同じ距離では近づけなくなります。", memory: "最初の信頼が続くかどうかを、最後まで見ていました。" }, clueLines: { early: ["静かな気配は近いのに、足取りには慎重さが残っていた。", "一度決めた距離を、簡単には崩さない目をしていた。", "近づく前に止まり、空気の変化だけを確かめていた。"], mid: ["昨日のことを置かずに、同じ警戒を持って現れた。", "一度できた溝を測るように、歩幅がずっと一定だった。", "信じる日と守る日を、はっきり分けているようだった。"], late: ["低い空気が通り、広場には深い間だけが残った。", "濃い気配は離れず、最後まで距離を守っていた。", "土に残った深い足あとが、消えずに夕暮れへ伸びていた。"] } },
  { id: "fox", name: "様子を見るきつね", emoji: "🦊", mask: "⬛", image: "assets/fox.webp", description: "うまくいった日は同じように、うまくいかなかった日は少し選び方を変える相手でした。", strategyKey: "pavlovLike", spawnWeight: 1, profile: { temperament: "相手の声や広場の空気を、じっと見ている子です。", habit: "うまくいった日は同じ道を選び、うまくいかなかった日は少し足を止めます。", memory: "あなたとの7日間で、近づく日と離れる日を何度も測っていました。" }, clueLines: { early: ["相手はすぐ動かず、広場の空気だけを先に読んでいた。", "細い目線が、こちらの選び方を静かに追っていた。", "一度近づきかけて、また様子を見る位置へ戻っていった。"], mid: ["うまくいった日の次は、同じ歩幅で近づいてきた。", "昨日と違った日は、相手も少しだけ手を変えていた。", "試すように半歩寄って、すぐに様子を見る間があった。"], late: ["夕日に長い気配が伸び、去り際まで様子を見ていた。", "鼻先をかすめる風とともに、軽い足音が遠のいた。", "去り際、細い影が振り向き、すぐに草の奥へ消えた。"] } },
  { id: "deer", name: "ゆるしてくれるしか", emoji: "🦌", mask: "⬛", image: "assets/deer.webp", description: "されたことを覚えていても、また分けるほうへ戻ろうとする相手でした。", strategyKey: "generousMirror", spawnWeight: 1, profile: { temperament: "こわかった日があっても、すぐに背を向けきれない子です。", habit: "傷ついたあとでも、ときどきもう一度だけ分けるほうを選びます。", memory: "あなたの選び方を覚えながら、それでも広場に戻る理由を探していました。" }, clueLines: { early: ["少し離れて立ちながらも、視線だけは戻ってきていた。", "警戒のあとに、やわらかな間を残して近づいてきた。", "静かな足音が止まり、こちらを待つ時間が長かった。"], mid: ["距離ができた次の日でも、また広場に足音があった。", "ためらいを抱えたまま、もう一度だけ手を伸ばしてきた。", "こわさを知っていても、背を向けきらない気配があった。"], late: ["細い跡が重なり、静かな間で夕風を確かめていた。", "長い影は一度離れても、また同じ広場へ戻ってきた。", "木漏れ日の下に残る足あとが、ゆるすように並んでいた。"] } },
  { id: "cat", name: "気まぐれなねこ", emoji: "🐱", mask: "⬛", image: "assets/cat.webp", description: "その日の気分で、近づいたり離れたりする相手でした。", strategyKey: "randomMood", spawnWeight: 1, profile: { temperament: "近くに来たかと思うと、ふいに別の方を向く子です。", habit: "毎日同じようには選ばず、その日の気分で広場に立ちます。", memory: "あなたのそばにいた日も、少し離れて見ていた日もありました。" }, clueLines: { early: ["近づいたと思えば、次の瞬間には目線を外していた。", "気配は近いのに、気分しだいで距離が揺れていた。", "足音は軽いのに、立つ場所だけが毎回違っていた。"], mid: ["昨日と同じにはならず、今日は別の向きで立っていた。", "すぐそばまで来てから、ふいに草影へ戻っていった。", "機嫌を測るような間があり、手つきが毎日変わっていた。"], late: ["やわらかな気配が月明かりで細く伸びた。", "しなる線が揺れ、音もなく遠ざかっていった。", "静かな気配が石の上を渡り、ふいに振り向いて消えた。"] } },
  { id: "hedgehog", name: "疑い深いはりねずみ", emoji: "🦔", mask: "⬛", image: "assets/hedgehog.webp", description: "最初は少し身を守り、そのあとは前の日のあなたをよく見て返す相手でした。", strategyKey: "suspiciousMirror", spawnWeight: 0.45, profile: { temperament: "近づきたい気持ちと、こわがる気持ちを両方持っている子です。", habit: "最初は少し距離を置き、そのあとはあなたの前の日をそっと返します。", memory: "安心できる足あとが続くと、少しずつ針をおろしていました。" }, clueLines: { early: ["小さな気配が止まって、こちらの様子を見ていた。", "近づきたいのに、すぐ身を守るように距離を取った。", "足音は短く、草むらの縁で何度も止まった。"], mid: ["昨日のことを確かめるように、同じ場所で立ち止まった。", "安心した瞬間だけ、そっと半歩近づいてきた。", "身構えるしぐさの奥に、寄ってきたい気配もあった。"], late: ["土の上に途切れる跡を残し、気配が小さく揺れた。", "去り際に丸い影が縮み、また静かにほどけていった。", "最後まで距離は守りつつ、視線だけは近くに残っていた。"] } },
  { id: "owl", name: "試してくるふくろう", emoji: "🦉", mask: "⬛", image: "assets/owl.webp", description: "静かに見ているだけでなく、ときどき相手の出方を確かめる相手でした。", strategyKey: "testerOwl", spawnWeight: 0.45, profile: { temperament: "高い枝の上から、広場の小さな変化を見ている子です。", habit: "ただ待つだけではなく、ときどき一歩だけ相手の出方を確かめます。", memory: "あなたがどう返すのかを、静かな目で覚えていました。" }, clueLines: { early: ["少し高い枝から、静かな視線だけが降りてきた。", "こちらの動きにすぐは応じず、夜の空気のように落ち着いていた。", "気配はあるのに、足音はほとんど聞こえなかった。"], mid: ["一拍遅れて手を動かし、昨日のことを確かめているようだった。", "枝影の中で待つ時間が長く、急ぐ様子はなかった。", "相手は言葉の代わりに、視線だけで返してきた。"], late: ["暮れかけた枝先で影が身じろぎし、静かな風が落ちた。", "低い羽音が一度だけして、気配は夜へほどけた。", "最後の日も高い場所から、落ち着いた目線が残った。"] } },
  { id: "woodpecker", name: "交互に選ぶきつつき", emoji: "🐦", mask: "⬛", image: "assets/woodpecker.webp", description: "同じ場所をつつくように、分ける日とひとりじめの日を繰り返す相手でした。", strategyKey: "alternator", spawnWeight: 0.45, profile: { temperament: "森の幹をたたく音のように、決まった調子を持つ子です。", habit: "近づく日と離れる日を、ひとつずつ繰り返します。", memory: "あなたとの7日間にも、不思議なリズムが残っていました。" }, clueLines: { early: ["遠くで小さな合図が、一定の間で続いていた。", "せわしない気配が枝から幹へと移っていった。", "相手は短い間を刻むように動いていた。"], mid: ["昨日と違う日でも、同じリズムだけは崩れなかった。", "こちらの様子を見ながら、合図のような音を残していた。", "せかされるような足どりで、広場を行き来していた。"], late: ["乾いた合図が響き、気配はまっすぐ奥へ消えた。", "去り際に木肌へ短い跡を残し、気配だけが上へ抜けた。", "最後の日も、一定の調子で森の奥へ戻っていった。"] } },
  { id: "boar", name: "いつもひとりじめするいのしし", emoji: "🐗", mask: "⬛", image: "assets/boar.webp", description: "毎日まっすぐにおやつへ向かい、分けることをほとんど考えない相手でした。", strategyKey: "alwaysTake", spawnWeight: 0.45, profile: { temperament: "目の前のおやつを見ると、まっすぐ走り出す子です。", habit: "分けることよりも、まず自分の手に抱えることを選びます。", memory: "広場には、勢いのある足あとと、少し遠い距離が残っていました。" }, clueLines: { early: ["土を押す強い気配が、まっすぐ近づいてきた。", "迷いのない気配が、広場の真ん中を横切った。", "草むらが大きく揺れ、相手は勢いのまま現れた。"], mid: ["昨日のことより、目の前へ進む力が先に見えた。", "荒い足どりでも、ためらいはほとんどなかった。", "距離を測るより先に、土を強く踏みしめていた。"], late: ["地面に深めの跡を残し、低い影が夕暮れへ進んでいった。", "去り際の足音は重く、森の奥まで長く響いた。", "最後の日も、まっすぐな気配だけが広場に残った。"] } },
  { id: "bear", name: "二度まで待つくま", emoji: "🐻", mask: "⬛", image: "assets/bear.webp", description: "一度だけなら待ってくれるけれど、続くと静かに身を守る相手でした。", strategyKey: "twoWarnings", spawnWeight: 0.45, profile: { temperament: "大きな体で、すぐには動かずに相手を見ている子です。", habit: "一度のことでは離れませんが、続くと少し距離を置きます。", memory: "待ってくれた日のあとに、あなたがどうするかを見ていました。" }, clueLines: { early: ["大きな気配が、急がずに広場の端で止まっていた。", "こちらを見る目は静かで、すぐには動かなかった。", "重たい気配が一度だけ寄り、また沈黙に戻った。"], mid: ["少し待ってから手を動かし、昨日の空気を確かめていた。", "ゆっくりでも、食べものへの視線はまっすぐだった。", "許す日と守る日を、落ち着いた間で決めているようだった。"], late: ["重い気配が土を鳴らし、影はゆっくり森へ戻っていった。", "夕方の広場に大きな余韻だけが残った。", "最後まで急がず、確かな歩幅で去っていった。"] } },
  { id: "monkey", name: "多いほうへ寄るさる", emoji: "🐒", mask: "⬛", image: "assets/monkey.webp", description: "前の日だけでなく、これまでのあなたの選び方を見て寄ってくる相手でした。", strategyKey: "majorityFollower", spawnWeight: 0.45, profile: { temperament: "枝から枝へ渡るように、まわりの流れをよく見ている子です。", habit: "一日だけで決めず、これまで多かったほうへ少しずつ寄っていきます。", memory: "あなたが重ねた選び方を、森の上から眺めていました。" }, clueLines: { early: ["高い場所で小さな影が揺れ、こちらのしぐさを見ていた。", "一度まねしてから、すぐ別の動きに変えてみせた。", "試すような気配が枝の上を行き来していた。"], mid: ["昨日うまくいった手つきを、いたずらっぽく繰り返していた。", "相手は反応を待ちながら、次の手をすぐ試してきた。", "高い場所から降りては戻る、落ち着かない間合いだった。"], late: ["枝先が大きく揺れ、軽い気配が頭上を渡っていった。", "去り際、細い影が幹を蹴ってすっと消えた。", "最後の日も、真似と試しの気配が交互に残っていた。"] } }
];

function validateOpponents() {
  const requiredFields = ["id", "name", "emoji", "image", "description", "strategyKey"];
  const seenIds = new Set();

  opponents.forEach((opponent, index) => {
    requiredFields.forEach((field) => {
      if (!opponent[field]) {
        console.warn(`[opponents] Missing required field "${field}" at index ${index}.`, opponent);
      }
    });

    if (opponent.id) {
      if (seenIds.has(opponent.id)) {
        console.warn(`[opponents] Duplicate id "${opponent.id}" detected.`, opponent);
      }
      seenIds.add(opponent.id);
    }

    if (opponent.strategyKey && !strategies[opponent.strategyKey]) {
      console.warn(`[opponents] Unknown strategyKey "${opponent.strategyKey}" for id "${opponent.id || `index-${index}`}".`, opponent);
    }

    if (Object.prototype.hasOwnProperty.call(opponent, "spawnWeight")) {
      if (typeof opponent.spawnWeight !== "number" || opponent.spawnWeight <= 0) {
        console.warn(`[opponents] spawnWeight must be a positive number for id "${opponent.id || `index-${index}`}".`, opponent);
      }
    }

    if (Object.prototype.hasOwnProperty.call(opponent, "profile") && opponent.profile != null) {
      const profileKeys = ["temperament", "habit", "memory"];
      if (typeof opponent.profile !== "object" || Array.isArray(opponent.profile)) {
        console.warn(`[opponents] profile must be an object for id "${opponent.id || `index-${index}`}".`, opponent);
      } else {
        profileKeys.forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(opponent.profile, key) && typeof opponent.profile[key] !== "string") {
            console.warn(`[opponents] profile.${key} must be a string for id "${opponent.id || `index-${index}`}".`, opponent);
          }
        });
      }
    }

    if (Object.prototype.hasOwnProperty.call(opponent, "clueLines") && opponent.clueLines != null) {
      const cluePhases = ["early", "mid", "late"];
      if (typeof opponent.clueLines !== "object" || Array.isArray(opponent.clueLines)) {
        console.warn(`[opponents] clueLines must be an object for id "${opponent.id || `index-${index}`}".`, opponent);
      } else {
        cluePhases.forEach((phase) => {
          if (!Object.prototype.hasOwnProperty.call(opponent.clueLines, phase)) return;
          const lines = opponent.clueLines[phase];
          if (!Array.isArray(lines)) {
            console.warn(`[opponents] clueLines.${phase} must be an array for id "${opponent.id || `index-${index}`}".`, opponent);
            return;
          }
          lines.forEach((line, lineIndex) => {
            if (typeof line !== "string") {
              console.warn(`[opponents] clueLines.${phase}[${lineIndex}] must be a string for id "${opponent.id || `index-${index}`}".`, opponent);
            }
          });
        });
      }
    }
  });
}

opponents.forEach((opponent) => {
  opponent.decideMove = (turnState) => {
    const strategy = strategies[opponent.strategyKey];
    if (!strategy) {
      console.warn(`[opponents] Fallback strategy used because strategyKey "${opponent.strategyKey}" is missing.`);
      return SHARE;
    }
    return strategy(turnState, opponent);
  };
});

validateOpponents();

startButton.addEventListener("click", startGameFromButtonInteraction);
startButton.addEventListener("touchend", startGameFromButtonInteraction, { passive: false });
retryButton.addEventListener("click", restartWithSameOpponent);
newOpponentButton.addEventListener("click", restartWithDifferentOpponent);
shareButton.addEventListener("click", () => playTurn(SHARE));
takeButton.addEventListener("click", () => playTurn(TAKE));
continueButton.addEventListener("click", proceedToNextDay);
shareResultButton.addEventListener("click", shareResult);
if (grantCookiesButton) {
  let grantTriggered = false;
  const onGrantCookies = (event) => {
    if (event && event.type === "touchend") event.preventDefault();
    if (grantTriggered) return;
    grantTriggered = true;
    grantForestCookies();
    window.setTimeout(() => {
      grantTriggered = false;
    }, 120);
  };
  grantCookiesButton.addEventListener("click", onGrantCookies);
  grantCookiesButton.addEventListener("touchend", onGrantCookies, { passive: false });
}
if (soundToggleButton) soundToggleButton.addEventListener("click", handleSoundToggle);

function openRecommendationsOverlay() {
  if (!recommendationsOverlay || !recommendationsFrame) return;
  recommendationsOverlay.hidden = false;
  recommendationsOverlay.setAttribute("aria-hidden", "false");
  recommendationsFrame.src = "recommendations.html?from=result&mode=overlay&embedded=1";
}

function closeRecommendationsOverlay() {
  if (!recommendationsOverlay || !recommendationsFrame) return;
  recommendationsOverlay.hidden = true;
  recommendationsOverlay.setAttribute("aria-hidden", "true");
  recommendationsFrame.src = "about:blank";
}

if (recommendationsLink) {
  recommendationsLink.addEventListener("click", (event) => {
    if (event) event.preventDefault();
    if (safeStorage) {
      safeStorage.setItem(STORAGE_KEYS.recommendationsFromResult, "true");
      const bgmWasPlaying = Boolean(bgm && !bgm.paused && isSoundEnabled());
      safeStorage.setItem(STORAGE_KEYS.recommendationsBgmWasPlaying, bgmWasPlaying ? "true" : "false");
      if (bgm) safeStorage.setItem(STORAGE_KEYS.recommendationsBgmTime, String(bgm.currentTime || 0));
    }
    openRecommendationsOverlay();
  });
}

if (closeRecommendationsOverlayButton) {
  closeRecommendationsOverlayButton.addEventListener("click", closeRecommendationsOverlay);
}
if (recommendationsOverlay) {
  recommendationsOverlay.addEventListener("click", (event) => {
    const closeTrigger = event.target instanceof HTMLElement && event.target.dataset.closeOverlay === "true";
    if (closeTrigger) closeRecommendationsOverlay();
  });
}
window.addEventListener("message", (event) => {
  if (event.origin !== window.location.origin) return;
  if (event.data === "ahita.closeRecommendationsOverlay") closeRecommendationsOverlay();
});

if (bgm) bgm.volume = BGM_VOLUME;
updateSoundToggleLabel();
document.addEventListener("click", tryPlayBgm, { once: true });
document.addEventListener("touchend", tryPlayBgm, { once: true, passive: true });

function startGameFromButtonInteraction(event) {
  if (event && event.type === "touchend") event.preventDefault();
  playCardFlipSound();
  startGame();
}

function startGame() { resetGame(true); }

function restartWithSameOpponent() {
  resetGame(false);
}

function restartWithDifferentOpponent() {
  selectNewOpponent();
  resetGame(false);
}

function isSoundEnabled() {
  if (!safeStorage) return true;
  const stored = safeStorage.getItem("ahita.sound.enabled");
  return stored === null ? true : stored === "true";
}

function setSoundEnabled(enabled) {
  if (!safeStorage) return;
  safeStorage.setItem("ahita.sound.enabled", enabled ? "true" : "false");
}

function updateSoundToggleLabel() {
  if (!soundToggleButton) return;
  soundToggleButton.textContent = isSoundEnabled() ? "音を消す" : "音を出す";
}

function tryPlayBgm() {
  if (!bgm || !isSoundEnabled()) return;
  const playPromise = bgm.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch((error) => console.warn("BGMを再生できませんでした:", error));
  }
}

function stopBgm() {
  if (!bgm) return;
  bgm.pause();
  bgm.currentTime = 0;
}

function playSoundElement(audioElement, volume = SFX_VOLUME_BASE) {
  if (!isSoundEnabled() || !audioElement) return;
  try {
    audioElement.currentTime = 0;
    audioElement.volume = volume;
    const playPromise = audioElement.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error) => console.warn("音声を再生できませんでした:", error));
    }
  } catch (error) {
    console.warn("音声を再生できませんでした:", error);
  }
}

function handleSoundToggle() {
  const nextEnabled = !isSoundEnabled();
  setSoundEnabled(nextEnabled);
  if (nextEnabled) tryPlayBgm();
  else stopBgm();
  updateSoundToggleLabel();
}

function playCardFlipSound() {
  playSoundElement(cardFlipSe, 0.48);
}

function playRoundResultSound(playerChoice, opponentChoice) {
  if (playerChoice === SHARE && opponentChoice === SHARE) playSoundElement(shareSnackSe, 0.52);
  else if (playerChoice === TAKE && opponentChoice === TAKE) playSoundElement(woodDropSe, 0.48);
  else playSoundElement(bushRustleSe, 0.52);
}

function showGameScreen() {
  startScreen.hidden = true;
  gameScreen.hidden = false;
  resultScreen.hidden = true;
  window.scrollTo(0, 0);
  triggerMotion(gameScreen, "motion-enter");
}

function showResultScreen() {
  gameScreen.hidden = true;
  resultScreen.hidden = false;
  triggerMotion(resultScreen, "motion-enter");
}

function resetGame(newOpponent) {
  Object.assign(state, { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, isProcessingTurn: false, isFinished: false, resultTypeTitle: "", turnResolved: false, decisionTimes: [], turnStartedAt: 0 });
  issueNewRunId();
  if (newOpponent || !state.currentOpponent) state.currentOpponent = selectWeightedOpponent();
  showGameScreen();
  setChoiceDisabled(false); updateScreen(); renderTracks();
}

function selectWeightedOpponent(excludeOpponentId) {
  const buildCandidates = (excludedId) => opponents
    .filter((opponent) => opponent.id !== excludedId)
    .map((opponent) => ({
      opponent,
      weight: typeof opponent.spawnWeight === "number" ? opponent.spawnWeight : 1
    }))
    .filter((entry) => entry.weight > 0);

  let candidates = buildCandidates(excludeOpponentId);
  if (candidates.length === 0) candidates = buildCandidates();
  if (candidates.length === 0) return opponents[0];

  const totalWeight = candidates.reduce((sum, entry) => sum + entry.weight, 0);
  if (!(totalWeight > 0)) return candidates[0].opponent;

  let roll = Math.random() * totalWeight;
  for (let i = 0; i < candidates.length; i += 1) {
    roll -= candidates[i].weight;
    if (roll < 0) return candidates[i].opponent;
  }
  return candidates[candidates.length - 1].opponent;
}

function selectNewOpponent() {
  const currentId = state.currentOpponent ? state.currentOpponent.id : undefined;
  state.currentOpponent = selectWeightedOpponent(currentId);
}


function scrollMessageIntoViewOnMobile() {
  if (!window.matchMedia("(max-width: 600px)").matches) return;
  const target = document.getElementById("message");
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const messageVisible = rect.top >= 0 && rect.bottom <= viewportHeight;
  if (messageVisible) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "nearest"
  });
}

function playTurn(playerMove) {
  if (state.isProcessingTurn || state.isFinished || state.day > MAX_DAYS) return;
  const now = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  const decisionSeconds = state.turnStartedAt
    ? Math.max(0, (now - state.turnStartedAt) / 1000)
    : 0;
  state.decisionTimes.push(decisionSeconds);
  state.turnStartedAt = 0;
  state.isProcessingTurn = true;
  state.turnResolved = false;
  setChoiceDisabled(true);
  const opponentMove = state.currentOpponent.decideMove({ day: state.day, playerHistory: state.playerHistory, opponentHistory: state.opponentHistory });
  state.playerHistory.push(playerMove); state.opponentHistory.push(opponentMove);
  const payoff = PAYOFF_TABLE[`${playerMove}_${opponentMove}`]; state.playerScore += payoff.player; state.opponentScore += payoff.opponent;
  playRoundResultSound(playerMove, opponentMove);

  const turnKey = `${playerMove === SHARE ? "s" : "t"}${opponentMove === SHARE ? "s" : "t"}`;
  gameScreen.className = `card turn-${turnKey}`;
  forestStage.classList.add("pulse");
  playerCard.classList.add("nod");
  const turnMessage = pickReactionMessage(playerMove, opponentMove, state.currentOpponent, state.day);
  setTurnMessage(turnMessage.resultLine, turnMessage.clueLine);
  triggerMotion(message, "motion-message");
  triggerMotion(message, "motion-trace");
  triggerMotion(snackIcon, "motion-pop");
  triggerMotion(opponentName, "motion-approach");
  renderTracks();
  triggerMotion(playerTrack, "motion-refresh");
  triggerMotion(opponentTrack, "motion-refresh");
  updateContinueButton();
  scrollMessageIntoViewOnMobile();

  setTimeout(() => {
    forestStage.classList.remove("pulse");
    playerCard.classList.remove("nod");
    state.isProcessingTurn = false;
    state.turnResolved = true;
    setChoiceDisabled(true);
    updateContinueButton();
  }, TURN_DELAY_MS);
}

function proceedToNextDay() {
  if (!state.turnResolved || state.isProcessingTurn) return;
  playCardFlipSound();
  if (state.day >= MAX_DAYS) {
    state.isFinished = true;
    showResult();
    return;
  }
  state.day += 1;
  state.turnResolved = false;
  setChoiceDisabled(false);
  updateContinueButton();
  updateScreen();
}


function getDayNote(currentState) {
  if (!currentState || typeof currentState !== "object") return "まだ、何も決まっていません。";
  const pools = {
    early: [
      "まだ、何も決まっていません。",
      "最初の選び方が残ります。",
      "相手はまだ遠くにいます。",
      "手がかりは、まだ少しだけです。",
      "今日の一手が、はじまりです。"
    ],
    mid: [
      "昨日の選び方が残っています。",
      "同じ選び方で、よいのでしょうか。",
      "少しずつ、距離が変わっています。",
      "相手も、あなたを見ています。",
      "こぼれたものも、残っています。",
      "近づくか、離れるかの途中です。"
    ],
    late: [
      "最後の選び方が近づいています。",
      "もう少しで、正体が見えます。",
      "関係は、静かに固まりつつあります。",
      "今日の選び方も、最後に残ります。",
      "取り戻せないものもあります。",
      "それでも、まだ選べます。"
    ]
  };

  const safeDay = Number.parseInt(currentState.day, 10);
  const phase = safeDay <= 2 ? "early" : safeDay <= 5 ? "mid" : "late";
  const notes = pools[phase] || pools.mid;
  const history = Array.isArray(currentState.playerHistory) ? currentState.playerHistory : [];
  const shareCount = history.filter((move) => move === SHARE).length;
  const takeCount = history.filter((move) => move === TAKE).length;
  const idSeed = String(currentState.currentOpponent?.id || "unknown")
    .split("")
    .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const seed = (safeDay * 17) + (shareCount * 11) + (takeCount * 13) + idSeed;
  const note = notes[Math.abs(seed) % notes.length];
  return note || "まだ、何も決まっていません。";
}

function updateScreen() {
  dayLabel.textContent = `${state.day}日目`;
  dayNote.textContent = getDayNote(state);
  progressBar.style.width = `${(state.day / MAX_DAYS) * 100}%`;
  document.body.setAttribute("data-phase", `day-${state.day}`);
  setupOpponentShadow();
  setTurnMessage("まだ、相手の正体はわかりません。", "");
  dayMotionTargets.forEach((target) => triggerMotion(target, "motion-refresh"));
  updateContinueButton();
  const now = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
  state.turnStartedAt = now;
}

function updateContinueButton() {
  const ready = state.turnResolved && !state.isProcessingTurn;
  continueButton.hidden = !ready;
  continueButton.disabled = !ready;
  continueButton.textContent = state.day >= MAX_DAYS ? "結果を見る" : "次の日へ";
  if (ready) triggerMotion(continueButton, "motion-advance");
}

function getCluePhase(day) {
  const safeDay = Number.isFinite(day) ? day : Number.parseInt(day, 10);
  if (!(safeDay > 0)) return "early";
  if (safeDay <= 2) return "early";
  if (safeDay <= 5) return "mid";
  return "late";
}

function pickOpponentClue(opponent, day) {
  const phase = getCluePhase(day);
  const lines = opponent?.clueLines?.[phase];
  if (!Array.isArray(lines) || lines.length === 0) return "";
  const safeDay = Number.isFinite(day) ? day : Number.parseInt(day, 10);
  const dayIndex = Math.max(1, safeDay || 1) - 1;
  const filtered = lines.filter((line) => typeof line === "string" && line.trim().length > 0);
  if (filtered.length === 0) return "";
  return compactClueLine(filtered[dayIndex % filtered.length]);
}

function pickReactionMessage(playerMove, opponentMove, opponent, day) {
  const turnKey = `${playerMove === SHARE ? "s" : "t"}${opponentMove === SHARE ? "s" : "t"}`;
  return {
    resultLine: RESULT_LINES[turnKey] || "結果を受け取りました。",
    clueLine: pickOpponentClue(opponent, day)
  };
}

function setupOpponentShadow() {
  const shadowImage = "assets/character-shadow.webp";
  opponentImage.hidden = false;
  opponentFallback.hidden = true;
  opponentImage.alt = "正体のわからない相手";
  opponentImage.classList.add("unknown-character-image");
  opponentImage.src = shadowImage;
  opponentImage.onerror = () => {
    opponentImage.hidden = true;
    opponentFallback.hidden = false;
  };
  opponentImage.onload = () => {
    opponentFallback.hidden = true;
  };
  if (!opponentImage.complete) {
    opponentFallback.hidden = false;
  }
  opponentName.querySelector("small").textContent = "？？？";
}

function renderTracks() {
  playerTrack.innerHTML = ""; opponentTrack.innerHTML = "";
  for (let i = 0; i < MAX_DAYS; i += 1) {
    playerTrack.appendChild(makeStep(state.playerHistory[i], `あなた ${i + 1}日目`));
    opponentTrack.appendChild(makeStep(state.opponentHistory[i], `相手 ${i + 1}日目`));
  }
}

function makeStep(move, label) {
  const span = document.createElement("span");
  span.className = `step ${move === SHARE ? "share" : move === TAKE ? "take" : "unknown"}`;
  span.setAttribute("aria-label", `${label} ${move || "未選択"}`);
  return span;
}

function showResult() {
  showResultScreen();
  hideForestCookieUi();
  if (safeStorage) safeStorage.setItem(STORAGE_KEYS.resultReachedAt, new Date().toISOString());
  updateCookieGrantUi();
  const result = getResultType(); state.resultTypeTitle = result.title;
  resultTitle.textContent = `あなたの記録：${result.title}`; resultText.textContent = result.text;
  if (resultStory) resultStory.textContent = generateSevenDayStory(result);
  opponentReveal.textContent = `相手の正体：${state.currentOpponent.name} ${state.currentOpponent.emoji}`; opponentText.textContent = state.currentOpponent.description;
  renderOpponentProfile(state.currentOpponent.profile);
  renderResultOpponent();
  const totalCookies = MAX_DAYS * 6;
  const wastedCookies = totalCookies - state.playerScore - state.opponentScore;
  snackResult.innerHTML = `<span class="result-chip"><span>あなたのおやつ</span><strong>${state.playerScore}<span class="result-unit">枚</span></strong></span><span class="result-chip"><span>相手のおやつ</span><strong>${state.opponentScore}<span class="result-unit">枚</span></strong></span><span class="result-chip"><span>こぼれたおやつ</span><strong>${wastedCookies}<span class="result-unit">枚</span></strong></span>`;
  relationshipEnding.textContent = `関係の結末：${getRelationshipEnding()}`;
  renderResultTracks();
  const resultItems = resultScreen.querySelectorAll(".result-panel, .result-stats, .result-buttons");
  resultItems.forEach((item, index) => {
    item.style.animationDelay = `${Math.min(index * 0.05, 0.25)}s`;
    triggerMotion(item, "motion-result");
  });
}

safeStorage = initializeStorage();
hideForestCookieUi();
ensureCookieStorageDefaults();
updateSoundToggleLabel();

function renderOpponentProfile(profile) {
  if (!opponentProfile || !opponentProfileTemperament || !opponentProfileHabit || !opponentProfileMemory) return;
  const hasCompleteProfile = profile
    && typeof profile.temperament === "string"
    && typeof profile.habit === "string"
    && typeof profile.memory === "string";
  if (!hasCompleteProfile) {
    opponentProfile.hidden = true;
    opponentProfile.open = false;
    opponentProfileTemperament.textContent = "";
    opponentProfileHabit.textContent = "";
    opponentProfileMemory.textContent = "";
    return;
  }
  opponentProfile.hidden = false;
  opponentProfile.open = false;
  opponentProfileTemperament.textContent = profile.temperament;
  opponentProfileHabit.textContent = profile.habit;
  opponentProfileMemory.textContent = profile.memory;
}

function renderResultTracks() {
  if (!resultPlayerTrack || !resultOpponentTrack) return;
  resultPlayerTrack.innerHTML = "";
  resultOpponentTrack.innerHTML = "";
  for (let i = 0; i < MAX_DAYS; i += 1) {
    resultPlayerTrack.appendChild(makeStep(state.playerHistory[i], `結果 あなた ${i + 1}日目`));
    resultOpponentTrack.appendChild(makeStep(state.opponentHistory[i], `結果 相手 ${i + 1}日目`));
  }
}


function renderResultOpponent() {
  const { name, image, emoji } = state.currentOpponent;
  resultOpponentImage.hidden = false;
  resultOpponentFallback.hidden = true;
  resultOpponentImage.alt = name;
  resultOpponentImage.src = image || "";
  resultOpponentImage.onerror = () => {
    resultOpponentImage.hidden = true;
    resultOpponentFallback.hidden = false;
    resultOpponentFallback.textContent = emoji;
  };
  resultOpponentImage.onload = () => {
    resultOpponentFallback.hidden = true;
  };
  if (!image) {
    resultOpponentImage.hidden = true;
    resultOpponentFallback.hidden = false;
    resultOpponentFallback.textContent = emoji;
  }
}

function getMostHesitatedDay(decisionTimes) {
  if (!decisionTimes.length) return 0;
  let max = decisionTimes[0];
  let day = 1;
  for (let i = 1; i < decisionTimes.length; i += 1) {
    if (decisionTimes[i] > max) {
      max = decisionTimes[i];
      day = i + 1;
    }
  }
  return day;
}

function countStreak(history, move) {
  let best = 0;
  let current = 0;
  history.forEach((item) => {
    if (item === move) {
      current += 1;
      best = Math.max(best, current);
      return;
    }
    current = 0;
  });
  return best;
}

function countSwitches(history) {
  let switches = 0;
  for (let i = 1; i < history.length; i += 1) {
    if (history[i] !== history[i - 1]) switches += 1;
  }
  return switches;
}

function addUniqueLine(lines, line, maxLines) {
  if (!line || lines.includes(line) || lines.length >= maxLines) return false;
  lines.push(line);
  return true;
}

function getStoryMetrics() {
  const history = state.playerHistory.slice();
  const opponentHistory = state.opponentHistory.slice();
  const decisionTimes = state.decisionTimes.slice(0, history.length);
  const firstMove = history[0] || SHARE;
  const lastMove = history[history.length - 1] || SHARE;
  const shareCount = history.filter((m) => m === SHARE).length;
  const takeCount = history.filter((m) => m === TAKE).length;
  const coop = history.filter((m, i) => m === SHARE && opponentHistory[i] === SHARE).length;
  const clash = history.filter((m, i) => m === TAKE && opponentHistory[i] === TAKE).length;
  const mismatch = history.filter((m, i) => m !== opponentHistory[i]).length;
  const playerOnlyTake = history.filter((m, i) => m === TAKE && opponentHistory[i] === SHARE).length;
  const opponentOnlyTake = history.filter((m, i) => m === SHARE && opponentHistory[i] === TAKE).length;

  let recover = 0;
  let forgive = 0;
  let retaliate = 0;
  let afterTakingReturn = 0;
  let afterTakingContinue = 0;
  for (let i = 1; i < history.length; i += 1) {
    if (history[i - 1] === TAKE && history[i] === SHARE) recover += 1;
    if (opponentHistory[i - 1] === TAKE && history[i] === SHARE) forgive += 1;
    if (history[i - 1] === SHARE && opponentHistory[i - 1] === TAKE && history[i] === TAKE) retaliate += 1;
    if (history[i - 1] === TAKE && history[i] === SHARE) afterTakingReturn += 1;
    if (history[i - 1] === TAKE && history[i] === TAKE) afterTakingContinue += 1;
  }

  const totalCookies = state.playerScore + state.opponentScore;
  const lostPotential = (MAX_DAYS * 6) - totalCookies;
  const decisionTotal = decisionTimes.reduce((sum, sec) => sum + sec, 0);
  const averageDecisionTime = decisionTimes.length ? decisionTotal / decisionTimes.length : 0;
  const maxDecisionTime = decisionTimes.length ? Math.max(...decisionTimes) : 0;

  return {
    firstMove, lastMove, shareCount, takeCount, playerScore: state.playerScore, opponentScore: state.opponentScore,
    decisionTimes, averageDecisionTime, maxDecisionTime, mostHesitatedDay: getMostHesitatedDay(decisionTimes),
    quickDecisions: decisionTimes.filter((sec) => sec < 2).length, slowDecisions: decisionTimes.filter((sec) => sec >= 6).length,
    coop, clash, mismatch, playerOnlyTake, opponentOnlyTake, opponentTookFromPlayer: opponentOnlyTake * 5,
    playerOnlyTakeCookies: playerOnlyTake * 5, mutualShareCookies: coop * 3, mutualTakeCookies: clash, totalCookies,
    lostPotential, scoreDiff: state.playerScore - state.opponentScore, switchCount: countSwitches(history),
    longestShareStreak: countStreak(history, SHARE), longestTakeStreak: countStreak(history, TAKE),
    recover, forgive, retaliate, afterTakingReturn, afterTakingContinue,
    lastDayChanged: history.length >= 2 && history[history.length - 1] !== history[history.length - 2]
  };
}

function generateSevenDayStory(result) {
  const metrics = getStoryMetrics();
  const lines = [];
  const maxLines = 6;

  if (metrics.firstMove === SHARE) {
    lines.push("正体のわからない相手と出会った1日目、あなたは最初に手をひらきました。");
  } else {
    lines.push("正体のわからない相手と出会った1日目、あなたはまず自分の分を守りました。");
  }

  const mixedPlay = (metrics.coop >= 2 && metrics.clash >= 2)
    || (metrics.coop >= 2 && metrics.mismatch >= 3)
    || (metrics.clash >= 2 && metrics.mismatch >= 3);

  if (mixedPlay) addUniqueLine(lines, "分け合えた日も、守り合った日もありました。", maxLines);
  else if (metrics.coop >= 4) addUniqueLine(lines, "分け合えた日が重なり、広場にはやわらかい時間が残りました。", maxLines);
  else if (metrics.clash >= 3) addUniqueLine(lines, "守る選択が重なり、広場にはかたい沈黙が残りました。", maxLines);
  else if (metrics.mismatch >= 4) addUniqueLine(lines, "同じ広場にいながら、選び方が反対になる日が多くありました。", maxLines);

  if (metrics.switchCount >= 5) addUniqueLine(lines, "選び方は一つに定まらず、広場の空気に合わせて揺れました。", maxLines);
  else if (metrics.switchCount >= 4) addUniqueLine(lines, "信じる日と守る日が交互に現れ、あなたは様子を見ながら進みました。", maxLines);

  if (metrics.recover >= 2) addUniqueLine(lines, "一度離れたあとも、あなたは何度か分ける道へ戻りました。", maxLines);
  else if (metrics.forgive > 0) addUniqueLine(lines, "受け取れなかった次の日にも、あなたの手は前に出ました。", maxLines);
  else if (metrics.recover > 0) addUniqueLine(lines, "一度距離ができたあと、あなたはもう一度分ける道を選びました。", maxLines);
  else if (metrics.retaliate > 0) addUniqueLine(lines, "戻ってこない日のあと、あなたは次の日に自分の分を守りました。", maxLines);
  else if (metrics.lastDayChanged) addUniqueLine(lines, "最後の日、あなたの手はそれまでと違うほうへ動きました。", maxLines);

  const cookieLines = [];
  if (metrics.lostPotential >= 12) cookieLines.push("残せたかもしれないクッキーも、いくつか森にこぼれていきました。");
  if (metrics.totalCookies >= 34) cookieLines.push("ふたりで残したクッキーは多く、広場には実りがありました。");
  if (metrics.playerScore >= 24) cookieLines.push("7日間で、あなたの手元には多くのクッキーが残りました。");
  if (metrics.playerScore <= 10) cookieLines.push("7日間で、手元に残ったクッキーは多くありませんでした。");
  if (metrics.scoreDiff >= 8) cookieLines.push("手元の多さは、相手との距離も少し映していました。");
  if (metrics.scoreDiff <= -8) cookieLines.push("手元の少なさは、差し出した日の数も映していました。");

  cookieLines.slice(0, 2).forEach((line) => addUniqueLine(lines, line, maxLines));

  if (lines.length < maxLines && metrics.maxDecisionTime >= 8) addUniqueLine(lines, metrics.mostHesitatedDay === 7
    ? "最後の日、あなたは少し長く立ち止まりました。"
    : "いちばん長く迷った日、あなたの手はすぐには動きませんでした。", maxLines);
  else if (metrics.averageDecisionTime < 2.5) addUniqueLine(lines, "選択は早く、迷いはあまり長く残りませんでした。", maxLines);
  else if (metrics.averageDecisionTime >= 6) addUniqueLine(lines, "あなたは何度も考えてから、手を動かしました。", maxLines);

  while (lines.length > maxLines - 1) lines.pop();
  while (lines.length < 4) {
    if (!addUniqueLine(lines, "同じ7日間でも、選び方の重さは毎日少しずつ変わっていきました。", maxLines)) break;
  }

  lines[lines.length - 1] = `森はその7日間を、「${result.title}」として覚えています。`;
  return lines.join(" ");
}

function getResultType() {
  const metrics = getRelationshipMetrics();

  const resultTypes = [
    {
      when: metrics.lostTotal >= 16,
      title: "こぼれたものを見送った人",
      text: "7日間で、だれにも届かなかったおやつがいくつもありました。あなたの選び方は、得たものだけでなく、こぼれたものの多さも残しました。"
    },
    {
      when: metrics.playerTotal >= 22,
      title: "たくさん持ち帰った人",
      text: "あなたの手元には、たくさんのおやつが残りました。7日間の選び方は、まず自分を守ることに向いていたようです。"
    },
    {
      when: metrics.lostTotal <= 8 && metrics.sharedDays >= 4 && metrics.shareCount >= 4,
      title: "森を見ていた人",
      text: "あなたは、自分の手元だけでなく、ふたりに届くおやつの行き先も気にしていました。森の広場には、こぼれずに渡ったものが多く残りました。"
    },
    {
      when: (metrics.opponentTotal - metrics.playerTotal) >= 8 && metrics.shareCount >= 4,
      title: "相手に差し出した人",
      text: "あなたは、何度も相手へおやつを差し出しました。手元に残った数は多くなくても、広場の向こうにはやわらかな気配が残りました。"
    },
    {
      when: metrics.takeCount >= 5 && metrics.playerTotal < 22,
      title: "手元を守った人",
      text: "あなたは、何度も自分の手元を守ろうとしました。広場に残った距離は、その選び方の静かな跡のようでした。"
    },
    {
      when: metrics.shareCount >= 5 && metrics.lostTotal > 8,
      title: "近づこうとした人",
      text: "あなたは、何度も近づこうとしました。けれど、おやつがうまく届かない日もあり、そのたびに広場には少しだけ静けさが残りました。"
    },
    {
      when: metrics.shareCount >= 2 && metrics.takeCount >= 2 && metrics.scoreDiff <= 6 && metrics.lostTotal < 16,
      title: "迷いながら選んだ人",
      text: "あなたは、分ける日も、持ち帰る日もありました。はっきりとは決めきらないまま、それでも7日間、相手を見つづけていました。"
    },
    {
      when: true,
      title: "7日間を見つづけた人",
      text: "あなたは、毎日の反応を確かめながら手を選びました。7日間の選び方は、手元と相手と広場の空気に、静かに残っています。"
    }
  ];

  const matched = resultTypes.find((result) => result.when);
  return { title: matched.title, text: matched.text };
}

function getRelationshipMetrics() {
  const playerTotal = state.playerScore;
  const opponentTotal = state.opponentScore;
  const lostTotal = (MAX_DAYS * 6) - playerTotal - opponentTotal;
  const sharedDays = state.playerHistory.filter((move, i) => move === SHARE && state.opponentHistory[i] === SHARE).length;
  const playerOnlyTakeDays = state.playerHistory.filter((move, i) => move === TAKE && state.opponentHistory[i] === SHARE).length;
  const opponentOnlyTakeDays = state.playerHistory.filter((move, i) => move === SHARE && state.opponentHistory[i] === TAKE).length;
  const mutualTakeDays = state.playerHistory.filter((move, i) => move === TAKE && state.opponentHistory[i] === TAKE).length;
  const conflictDays = playerOnlyTakeDays + opponentOnlyTakeDays;
  const scoreDiff = Math.abs(playerTotal - opponentTotal);
  const shareCount = state.playerHistory.filter((move) => move === SHARE).length;
  const takeCount = state.playerHistory.filter((move) => move === TAKE).length;

  return {
    playerTotal,
    opponentTotal,
    lostTotal,
    sharedDays,
    conflictDays,
    mutualTakeDays,
    playerOnlyTakeDays,
    opponentOnlyTakeDays,
    scoreDiff,
    shareCount,
    takeCount
  };
}

function getRelationshipEndingSeed() {
  const historyKey = [
    state.currentOpponent?.id || "unknown",
    state.playerHistory.join(""),
    state.opponentHistory.join("")
  ].join("|");

  let hash = 0;
  for (let i = 0; i < historyKey.length; i += 1) {
    hash = (hash * 31 + historyKey.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function getRelationshipEnding() {
  const metrics = getRelationshipMetrics();
  const endings = [
    {
      when: metrics.lostTotal >= 18,
      text: "【森にこぼれた7日間】7日間で、たくさんのおやつが誰にも届かないまま、森にこぼれていきました。得たものよりも、届かなかったものの気配が、最後まで広場に残りました。"
    },
    {
      when: metrics.playerTotal >= 22 && metrics.opponentTotal <= 10,
      text: "【たくさん持ち帰ったけれど】あなたの手元には、たくさんのおやつが残りました。けれど、広場の向こうには、少し長い沈黙も残っていました。"
    },
    {
      when: metrics.playerTotal >= 14 && metrics.opponentTotal >= 14 && metrics.lostTotal <= 8 && metrics.sharedDays >= 4,
      text: "【あたたかな分け合い】おやつは、ふたりの間を何度も行き来しました。多くは失われず、最後には、相手もあなたのそばにいることを怖がらなくなっていました。"
    },
    {
      when: metrics.scoreDiff >= 10,
      text: "【片側に傾いた関係】7日間のあいだに、おやつはどちらか一方へ大きく傾いていきました。近づいたようで、ふたりの距離は少し斜めのままでした。"
    },
    {
      when: metrics.lostTotal >= 14 && metrics.sharedDays <= 2,
      text: "【静かなすれ違い】何度か、おやつは誰の手にも届かず、森の土の上に静かに残りました。ふたりは出会っていたのに、少しずつすれ違っていたのかもしれません。"
    },
    {
      when: metrics.scoreDiff <= 2 && metrics.sharedDays >= 2 && metrics.mutualTakeDays <= 2,
      text: "【不思議な均衡】多すぎも少なすぎもせず、ふたりの間には不思議な釣り合いが残りました。近すぎないまま、それでも7日間は途切れませんでした。"
    },
    {
      when: metrics.mutualTakeDays >= 3 && metrics.conflictDays <= 2,
      text: "【守られた距離】ふたりは何度も、自分のぶんを守ろうとしました。近づきすぎない距離のまま、それでも同じ広場に来つづけた7日間でした。"
    }
  ];

  const matched = endings.find((ending) => ending.when);
  if (matched) return matched.text;

  const fallback = [
    "近づききらず、離れきらず、静かな距離が残りました。",
    "森の出口で、ふたりは少しだけ振り返りました。",
    "まだ言葉にならないまま、次の日の余白が残りました。",
    "はっきりした答えは出ないまま、広場の音だけが残りました。",
    "ふたりの距離は、大きく変わらず、少しだけ揺れていました。",
    "また会うかどうかを、森の風だけが知っていました。",
    "帰り道には、近さよりも静けさが残っていました。",
    "ふたりはそれぞれの歩幅で、森をあとにしました。"
  ];

  const seed = getRelationshipEndingSeed();
  return fallback[seed % fallback.length];
}

function buildShareText(opponentName, resultTitle) {
  const title = "また明日も会うきみへ";
  const hashtag = "#また明日も会うきみへ";
  const shortResultTitle = (resultTitle || "").trim();

  if (shortResultTitle && shortResultTitle.length <= 24) {
    return [
      title,
      "",
      `${opponentName}と、7日間。`,
      `結末は「${shortResultTitle}」でした。`,
      "",
      hashtag
    ].join("\n");
  }

  return [
    title,
    "",
    `${opponentName}と、7日間を過ごしました。`,
    "また明日、どう選ぶかを考えたくなる森でした。",
    "",
    hashtag
  ].join("\n");
}

function shareResult() {
  const opponentName = state.currentOpponent?.name || "正体不明の相手";
  const text = buildShareText(opponentName, state.resultTypeTitle);
  const url = `${window.location.origin}${window.location.pathname}`;
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
}

function setChoiceDisabled(disabled) {
  shareButton.disabled = disabled;
  takeButton.disabled = disabled;
  const hideChoices = disabled && state.turnResolved;
  shareButton.hidden = hideChoices;
  takeButton.hidden = hideChoices;
}

function triggerMotion(element, className) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  const cleanup = () => {
    element.classList.remove(className);
    element.removeEventListener("animationend", cleanup);
  };
  element.addEventListener("animationend", cleanup);
}
