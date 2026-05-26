const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 520;
const BUILD_VERSION = "f5e4a2c";
const STORAGE_KEYS = {
  balance: "ahita.cookies.balance",
  lastGrantRunId: "ahita.cookies.lastGrantRunId",
  version: "ahita.cookies.version",
  currentRunId: "ahita.ahita.currentRunId",
  resultReachedAt: "ahita.ahita.resultReachedAt"
};

console.info("また明日も会うきみへ build:", BUILD_VERSION);

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
const opponentName = document.getElementById("opponent-name");
const playerTrack = document.getElementById("player-track");
const opponentTrack = document.getElementById("opponent-track");
const resultPlayerTrack = document.getElementById("result-player-track");
const resultOpponentTrack = document.getElementById("result-opponent-track");
const forestStage = document.getElementById("forest-stage");
const playerCard = document.getElementById("player-card");
const endingScene = document.getElementById("ending-scene");
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
const dayMotionTargets = [dayLabel, dayNote, playerTrack, opponentTrack, message];

const startButton = document.getElementById("start-button");
const shareButton = document.getElementById("share-button");
const takeButton = document.getElementById("take-button");
const retryButton = document.getElementById("retry-button");
const shareResultButton = document.getElementById("share-result-button");
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
  buildVersionElement.textContent = `build ${BUILD_VERSION}`;
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
  { id: "tanuki", name: "まねっこタヌキ", emoji: "🦝", mask: "⬛", image: "assets/tanuki.webp", description: "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。", strategyKey: "mirrorYesterday", spawnWeight: 1, profile: { temperament: "相手のしたことをよく見て、次の日にそっと返す子です。", habit: "信じてもらえた日は信じ返し、ひとりじめされた日は少し身を守ります。", memory: "あなたの選び方が、そのままこの子の明日の表情になっていました。" } },
  { id: "crow", name: "疑い深いカラス", emoji: "🐦‍⬛", mask: "⬛", image: "assets/crow.webp", description: "最初は距離を置く。あなたが分けた日が重なるほど、少しずつ手を伸ばす子でした。", strategyKey: "cautiousCrow", spawnWeight: 1, profile: { temperament: "高い枝の上から、相手の動きをよく見ている子です。", habit: "すぐには近づかず、自分のおやつを守るように選びます。", memory: "近づきすぎず、離れすぎず、最後まであなたの出方を見ていました。" } },
  { id: "porcupine", name: "しばらく覚えるやまあらし", emoji: "🦔", mask: "⬛", image: "assets/porcupine.webp", description: "こわかったことを少しの間だけ覚えて、しばらく身を守る相手でした。", strategyKey: "remembersForTwoDays", spawnWeight: 0.25, profile: { temperament: "近づきたい気持ちはありますが、すぐには針をしまえない子です。", habit: "こわかった日のことが近くにあるうちは、少し距離を置きます。", memory: "安心できる日が続くと、また少しずつ広場へ戻ってきました。" } },
  { id: "raven", name: "多く持つ方を見るからす", emoji: "🐦‍⬛", mask: "⬛", image: "assets/raven.webp", description: "前の日にどちらが多く持っていたかを見て、次の日の距離を変える相手でした。", strategyKey: "followsRichSide", spawnWeight: 0.25, profile: { temperament: "高いところから、広場のおやつの行方をよく見ている子です。", habit: "前の日に多く持っていた方を見て、次の日の近づき方を変えます。", memory: "おやつの偏りを、黒い目で静かに覚えていました。" } },
  { id: "turtle", name: "三日目から変わるかめ", emoji: "🐢", mask: "⬛", image: "assets/turtle.webp", description: "はじめはゆっくり分けながら、途中からこれまでの様子を見て変わる相手でした。", strategyKey: "changesAfterThree", spawnWeight: 0.25, profile: { temperament: "すぐには決めず、ゆっくり広場に慣れていく子です。", habit: "はじめの数日は分けながら、途中から足あとを見て選びます。", memory: "遅い歩みの中に、あなたの7日間が少しずつ残っていました。" } },
  { id: "sheep", name: "まれに手を伸ばすひつじ", emoji: "🐑", mask: "⬛", image: "assets/sheep.webp", description: "ふだんは分けようとするけれど、まれに自分の分へ手を伸ばす相手でした。", strategyKey: "rareTaker", spawnWeight: 0.25, profile: { temperament: "穏やかに見えて、心の中に小さな揺れを持つ子です。", habit: "多くの日は分けますが、ときどき自分の分を先に抱えます。", memory: "静かな足あとに、ふと違う向きの日が混ざっていました。" } },
  { id: "rabbit", name: "忘れっぽいウサギ", emoji: "🐰", mask: "⬛", image: "assets/rabbit.webp", description: "ふだんはわける。でも、続けて傷つくと少しだけ身を守る。けれど、戻るのも早い子でした。", strategyKey: "forgetfulRabbit", spawnWeight: 1, profile: { temperament: "こわかったことも、時間がたつと少し薄れていく子です。", habit: "昨日のことを全部は抱えきれないので、また分けるほうへ戻りやすくなります。", memory: "何度も迷いながら、それでも次の日には広場へ来てくれました。" } },
  { id: "squirrel", name: "分けつづけるりす", emoji: "🐿️", mask: "⬛", image: "assets/squirrel.webp", description: "いつも分けようとする、疑うことを知らない相手でした。", strategyKey: "alwaysCooperate", spawnWeight: 1, profile: { temperament: "小さなおやつでも、誰かと分けることを先に考える子です。", habit: "疑うよりも、まず差し出してみることを選びます。", memory: "あなたがどう選んでも、最後まで同じように広場に立っていました。" } },
  { id: "wolf", name: "忘れないおおかみ", emoji: "🐺", mask: "⬛", image: "assets/wolf.webp", description: "最初は分けようとするけれど、一度裏切られると最後まで忘れない相手でした。", strategyKey: "grimTrigger", spawnWeight: 1, profile: { temperament: "最初は静かに分けようとしますが、一度のことを深く覚える子です。", habit: "傷ついたあとは、もう同じ距離では近づけなくなります。", memory: "最初の信頼が続くかどうかを、最後まで見ていました。" } },
  { id: "fox", name: "様子を見るきつね", emoji: "🦊", mask: "⬛", image: "assets/fox.webp", description: "うまくいった日は同じように、うまくいかなかった日は少し選び方を変える相手でした。", strategyKey: "pavlovLike", spawnWeight: 1, profile: { temperament: "相手の声や広場の空気を、じっと見ている子です。", habit: "うまくいった日は同じ道を選び、うまくいかなかった日は少し足を止めます。", memory: "あなたとの7日間で、近づく日と離れる日を何度も測っていました。" } },
  { id: "deer", name: "ゆるしてくれるしか", emoji: "🦌", mask: "⬛", image: "assets/deer.webp", description: "されたことを覚えていても、また分けるほうへ戻ろうとする相手でした。", strategyKey: "generousMirror", spawnWeight: 1, profile: { temperament: "こわかった日があっても、すぐに背を向けきれない子です。", habit: "傷ついたあとでも、ときどきもう一度だけ分けるほうを選びます。", memory: "あなたの選び方を覚えながら、それでも広場に戻る理由を探していました。" } },
  { id: "cat", name: "気まぐれなねこ", emoji: "🐱", mask: "⬛", image: "assets/cat.webp", description: "その日の気分で、近づいたり離れたりする相手でした。", strategyKey: "randomMood", spawnWeight: 1, profile: { temperament: "近くに来たかと思うと、ふいに別の方を向く子です。", habit: "毎日同じようには選ばず、その日の気分で広場に立ちます。", memory: "あなたのそばにいた日も、少し離れて見ていた日もありました。" } },
  { id: "hedgehog", name: "疑い深いはりねずみ", emoji: "🦔", mask: "⬛", image: "assets/hedgehog.webp", description: "最初は少し身を守り、そのあとは前の日のあなたをよく見て返す相手でした。", strategyKey: "suspiciousMirror", spawnWeight: 0.45, profile: { temperament: "近づきたい気持ちと、こわがる気持ちを両方持っている子です。", habit: "最初は少し距離を置き、そのあとはあなたの前の日をそっと返します。", memory: "安心できる足あとが続くと、少しずつ針をおろしていました。" } },
  { id: "owl", name: "試してくるふくろう", emoji: "🦉", mask: "⬛", image: "assets/owl.webp", description: "静かに見ているだけでなく、ときどき相手の出方を確かめる相手でした。", strategyKey: "testerOwl", spawnWeight: 0.45, profile: { temperament: "高い枝の上から、広場の小さな変化を見ている子です。", habit: "ただ待つだけではなく、ときどき一歩だけ相手の出方を確かめます。", memory: "あなたがどう返すのかを、静かな目で覚えていました。" } },
  { id: "woodpecker", name: "交互に選ぶきつつき", emoji: "🐦", mask: "⬛", image: "assets/woodpecker.webp", description: "同じ場所をつつくように、分ける日とひとりじめの日を繰り返す相手でした。", strategyKey: "alternator", spawnWeight: 0.45, profile: { temperament: "森の幹をたたく音のように、決まった調子を持つ子です。", habit: "近づく日と離れる日を、ひとつずつ繰り返します。", memory: "あなたとの7日間にも、不思議なリズムが残っていました。" } },
  { id: "boar", name: "いつもひとりじめするいのしし", emoji: "🐗", mask: "⬛", image: "assets/boar.webp", description: "毎日まっすぐにおやつへ向かい、分けることをほとんど考えない相手でした。", strategyKey: "alwaysTake", spawnWeight: 0.45, profile: { temperament: "目の前のおやつを見ると、まっすぐ走り出す子です。", habit: "分けることよりも、まず自分の手に抱えることを選びます。", memory: "広場には、勢いのある足あとと、少し遠い距離が残っていました。" } },
  { id: "bear", name: "二度まで待つくま", emoji: "🐻", mask: "⬛", image: "assets/bear.webp", description: "一度だけなら待ってくれるけれど、続くと静かに身を守る相手でした。", strategyKey: "twoWarnings", spawnWeight: 0.45, profile: { temperament: "大きな体で、すぐには動かずに相手を見ている子です。", habit: "一度のことでは離れませんが、続くと少し距離を置きます。", memory: "待ってくれた日のあとに、あなたがどうするかを見ていました。" } },
  { id: "monkey", name: "多いほうへ寄るさる", emoji: "🐒", mask: "⬛", image: "assets/monkey.webp", description: "前の日だけでなく、これまでのあなたの選び方を見て寄ってくる相手でした。", strategyKey: "majorityFollower", spawnWeight: 0.45, profile: { temperament: "枝から枝へ渡るように、まわりの流れをよく見ている子です。", habit: "一日だけで決めず、これまで多かったほうへ少しずつ寄っていきます。", memory: "あなたが重ねた選び方を、森の上から眺めていました。" } }
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
if (bgm) bgm.volume = 0.25;
updateSoundToggleLabel();
document.addEventListener("click", tryPlayBgm, { once: true });
document.addEventListener("touchend", tryPlayBgm, { once: true, passive: true });

function startGameFromButtonInteraction(event) {
  if (event && event.type === "touchend") event.preventDefault();
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

function playSoundElement(audioElement, volume = 0.45) {
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
  playSoundElement(cardFlipSe, 0.4);
}

function playRoundResultSound(playerChoice, opponentChoice) {
  if (playerChoice === SHARE && opponentChoice === SHARE) playSoundElement(shareSnackSe, 0.45);
  else if (playerChoice === TAKE && opponentChoice === TAKE) playSoundElement(woodDropSe, 0.4);
  else playSoundElement(bushRustleSe, 0.45);
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
  message.textContent = pickReactionMessage(playerMove, opponentMove);
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

function updateScreen() {
  const dayNotes = {
    1: "まだ、相手のことを何も知りません。",
    2: "昨日のことが、少しだけ残っています。",
    3: "相手は、あなたの手元を覚えています。",
    4: "同じ広場に、また戻ってきました。",
    5: "選び方に、癖が出はじめています。",
    6: "明日も、この広場で会います。",
    7: "最後の日です。相手は、昨日までのあなたを覚えています。"
  };
  dayLabel.textContent = `${state.day}日目`;
  dayNote.textContent = dayNotes[state.day] || dayNotes[1];
  progressBar.style.width = `${(state.day / MAX_DAYS) * 100}%`;
  document.body.setAttribute("data-phase", `day-${state.day}`);
  setupOpponentShadow();
  message.textContent = "まだ、相手の正体はわかりません。";
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

function pickReactionMessage(playerMove, opponentMove) {
  let candidates = REACTION_MESSAGES.bothTake;
  if (playerMove === SHARE && opponentMove === SHARE) candidates = REACTION_MESSAGES.bothShare;
  else if (playerMove === SHARE && opponentMove === TAKE) candidates = REACTION_MESSAGES.youShareOpponentTakes;
  else if (playerMove === TAKE && opponentMove === SHARE) candidates = REACTION_MESSAGES.youTakeOpponentShares;
  return candidates[Math.floor(Math.random() * candidates.length)];
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
  snackResult.innerHTML = `<span class="result-chip">あなたのおやつ ${state.playerScore}</span><span class="result-chip">相手のおやつ ${state.opponentScore}</span><span class="result-chip">だれにも届かなかったおやつ ${wastedCookies}</span>`;
  relationshipEnding.textContent = `関係の結末：${getRelationshipEnding()}`;
  renderResultTracks();
  renderEndingScene();
  const resultItems = resultScreen.querySelectorAll(".result-panel, .result-stats, .ending-scene, .result-buttons");
  resultItems.forEach((item, index) => {
    item.style.animationDelay = `${Math.min(index * 0.05, 0.25)}s`;
    triggerMotion(item, "motion-result");
  });
}

safeStorage = initializeStorage();
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

function renderEndingScene() {
  const coop = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === SHARE).length;
  const clash = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === TAKE).length;
  const recover = state.playerHistory.some((m, i) => i > 0 && m === SHARE && state.playerHistory[i - 1] === TAKE);
  let tone = "far";
  if (coop >= 4) tone = "close"; else if (clash >= 3) tone = "tense"; else if (recover) tone = "repair";
  endingScene.className = `ending-scene ${tone}`;
  endingScene.innerHTML = `<span class="left">◯</span><span class="middle">🍪</span><span class="right">${state.currentOpponent.emoji}</span>`;
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
  const shareCount = state.playerHistory.filter((m) => m === SHARE).length;
  const takeCount = state.playerHistory.filter((m) => m === TAKE).length;
  const coop = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === SHARE).length;
  const clash = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === TAKE).length;
  const mismatch = state.playerHistory.filter((m, i) => m !== state.opponentHistory[i]).length;
  const playerOnlyTake = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === SHARE).length;
  const opponentOnlyTake = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === TAKE).length;
  const opponentTookFromPlayer = opponentOnlyTake * 5;
  const playerOnlyTakeCookies = playerOnlyTake * 5;
  const mutualShareCookies = coop * 3;
  const mutualTakeCookies = clash * 1;

  let recover = 0;
  let forgive = 0;
  let alternating = 0;
  for (let i = 1; i < state.playerHistory.length; i += 1) {
    if (state.playerHistory[i - 1] === TAKE && state.playerHistory[i] === SHARE) recover += 1;
    if (state.opponentHistory[i - 1] === TAKE && state.playerHistory[i] === SHARE) forgive += 1;
    if (state.playerHistory[i - 1] !== state.playerHistory[i]) alternating += 1;
  }

  const earlyMoves = state.playerHistory.slice(0, 3);
  const lateMoves = state.playerHistory.slice(-3);
  const earlyShares = earlyMoves.filter((m) => m === SHARE).length;
  const lateShares = lateMoves.filter((m) => m === SHARE).length;
  const earlyTakes = earlyMoves.filter((m) => m === TAKE).length;
  const lateTakes = lateMoves.filter((m) => m === TAKE).length;

  const decisionTimes = state.decisionTimes.slice(0, state.playerHistory.length);
  const decisionTotal = decisionTimes.reduce((sum, sec) => sum + sec, 0);
  const averageDecisionTime = decisionTimes.length > 0 ? decisionTotal / decisionTimes.length : 0;
  const maxDecisionTime = decisionTimes.length > 0 ? Math.max(...decisionTimes) : 0;
  const quickDecisions = decisionTimes.filter((sec) => sec < 2).length;
  const slowDecisions = decisionTimes.filter((sec) => sec >= 6).length;

  const resultTypes = [
    { when: shareCount === MAX_DAYS, title: "最後まで分けた人", text: "7日間、分けることを続けました。相手がどう動いても、その手つきは変わりませんでした。" },
    { when: takeCount === MAX_DAYS, title: "最後まで守った人", text: "7日間、自分の分を守り続けました。手元には多く残り、広場には距離も残りました。" },
    { when: shareCount >= 5 && averageDecisionTime < 2.5, title: "すばやく信じた人", text: "あまり迷わず、分ける道を選びました。その早さにも、ひとつの信じ方がありました。" },
    { when: takeCount >= 5 && averageDecisionTime < 2.5, title: "すばやく取りにいく人", text: "目の前のクッキーを、すばやく選び取りました。迷いの少なさも、森には残っています。" },
    { when: shareCount >= 5 && averageDecisionTime >= 6, title: "立ち止まって分ける人", text: "あなたは考えてから、分ける道を選びました。迷った時間ごと、広場に残っています。" },
    { when: takeCount >= 5 && averageDecisionTime >= 6, title: "立ち止まって守る人", text: "あなたは考えてから、自分の分を守りました。急がない選択にも、理由があったのかもしれません。" },
    { when: forgive > 0, title: "それでも差し出す人", text: "受け取れない日があっても、もう一度差し出しました。その選択は、すぐに報われなくても残ります。" },
    { when: recover > 0, title: "仲直りを試す人", text: "一度離れたあとも、もう一度分ける道を選びました。戻ろうとする選択も、森には残ります。" },
    { when: lateShares > earlyShares && lateShares >= 2, title: "静かに信じ直す人", text: "後半のあなたは、少しずつ分けるほうへ戻っていきました。広場の空気も、少しだけやわらいでいます。" },
    { when: lateTakes > earlyTakes && lateTakes >= 2, title: "距離を測る人", text: "後半のあなたは、少し距離を置く選び方をしました。守ることにも、理由があったのかもしれません。" },
    { when: coop >= 4, title: "同じ歩幅の人", text: "あなたと相手は、何度も同じ選び方で並びました。分け合った日の静けさが、広場に残っています。" },
    { when: clash >= 3, title: "針をしまえない人", text: "身を守る選択が重なりました。そのぶん、広場には近づききれない空気も残りました。" },
    { when: mismatch >= 4, title: "すれ違いを抱えた人", text: "あなたと相手の選び方は、何度もすれ違いました。それでも7日間、同じ広場に戻ってきました。" },
    { when: mutualShareCookies >= 12, title: "分け合いを積んだ人", text: "分け合えた日は、クッキーだけでなく空気もやわらげました。積み重ねは、数字より先に広場へ残ります。" },
    { when: mutualTakeCookies >= 4, title: "守りを重ねた人", text: "おたがいに身を守る日が続きました。近づききれない距離も、7日間の記録のひとつです。" },
    { when: state.playerScore >= 24, title: "多くを持ち帰る人", text: "手元には、たくさんのクッキーが残りました。その多さの向こうに、明日の空気も並んでいます。" },
    { when: state.playerScore <= 12 && shareCount >= 4, title: "少なくても残した人", text: "手元のクッキーは多くありませんでした。それでも、分けた日の記憶は広場に残っています。" },
    { when: opponentTookFromPlayer >= 10 && shareCount >= 4, title: "差し出し続けた人", text: "差し出しても戻らない日がありました。それでも、あなたの手は何度か前に出ました。" },
    { when: opponentTookFromPlayer >= 10 && playerOnlyTakeCookies >= 10, title: "行き来の多い人", text: "差し出した日と受け取った日、その両方が目立ちました。やり取りの濃さも、広場に残る記録です。" },
    { when: playerOnlyTake >= 3, title: "甘さを集めた人", text: "クッキーはあなたの側に多く集まりました。今日の甘さと、少しの距離が残っています。" },
    { when: alternating >= 4 && averageDecisionTime >= 4, title: "慎重に変える人", text: "あなたは何度も立ち止まり、選び方を変えました。迷いも、この森ではひとつの記録です。" },
    { when: alternating >= 4, title: "風に揺れる人", text: "あなたの選び方は、何度か揺れました。広場の空気を見ながら、手を変えていきました。" },
    { when: quickDecisions >= 5, title: "早足の人", text: "あなたの選択は、迷いなく早く積もりました。森は、その速さも覚えています。" },
    { when: slowDecisions >= 4, title: "長く考える人", text: "あなたは何度も長く考えてから選びました。その間も、相手は広場で待っていました。" },
    { when: maxDecisionTime >= 9, title: "深呼吸して決める人", text: "ときどき長く立ち止まり、深呼吸してから手を選びました。その間の沈黙も、森は覚えています。" },
    { when: state.playerScore >= 20 && shareCount >= 2 && takeCount >= 2, title: "今日と明日の間にいる人", text: "あなたは得ることと関係を残すことの間で選びました。今日の多さと、明日の空気が並んでいます。" },
    { when: shareCount >= 5, title: "明日を信じる人", text: "迷いながらも、分け合う道を多く選びました。明日がある場所では、その選び方が静かに残ります。" },
    { when: takeCount >= 5, title: "今日を取りにいく人", text: "目の前のクッキーを取りこぼしませんでした。ただ、相手も昨日のことを覚えています。" },
    { when: shareCount >= 3 && takeCount >= 3, title: "様子を見る人", text: "あなたは相手の出方を見ながら、選び方を変えました。広場では、迷いもひとつの記録です。" },
    { when: true, title: "迷いながら選ぶ人", text: "信じることと守ることの間で、何度も立ち止まりました。森は、その揺れも覚えています。" }
  ];

  const matched = resultTypes.find((result) => result.when);
  if (!matched) {
    return { title: "迷いながら選ぶ人", text: "信じることと守ることの間で、何度も立ち止まりました。森は、その揺れも覚えています。" };
  }

  return { title: matched.title, text: matched.text };
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
  const coop = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === SHARE).length;
  const clash = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === TAKE).length;
  const youTakeOnly = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === SHARE).length;
  const opponentTakeOnly = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === TAKE).length;
  const sameChoices = state.playerHistory.filter((m, i) => m === state.opponentHistory[i]).length;
  const lastIndex = state.playerHistory.length - 1;
  const lastSame = lastIndex >= 0 && state.playerHistory[lastIndex] === state.opponentHistory[lastIndex];
  const lastBothShare = lastIndex >= 0 && state.playerHistory[lastIndex] === SHARE && state.opponentHistory[lastIndex] === SHARE;
  const lastBothTake = lastIndex >= 0 && state.playerHistory[lastIndex] === TAKE && state.opponentHistory[lastIndex] === TAKE;

  let category = "quiet";
  if (coop >= 4) {
    category = "close";
  } else if (clash >= 3) {
    category = "guarded";
  } else if (youTakeOnly >= 3) {
    category = "oneSidedYou";
  } else if (opponentTakeOnly >= 3) {
    category = "oneSidedOpponent";
  } else if (sameChoices <= 2) {
    category = "uncertain";
  }

  const endings = {
    close: [
      "また会えそうな距離まで、少し近づきました。",
      "次に会う日も、広場へ向かえそうです。",
      "ふたりの足あとが、しばらく同じ方へ続いていました。",
      "おやつを分けた日の空気が、帰り道にも残っていました。",
      "明日も同じ広場で会えそうな、やわらかい距離です。",
      "言葉にしなくても、次の日の約束が少し見えました。",
      "ふたりのあいだに、急がなくても消えない近さが残りました。",
      "森を出るころ、相手の足音はまだ近くにありました。"
    ],
    guarded: [
      "ふたりとも、少し距離を置いたまま森を出ました。",
      "近づきたい気持ちより、身を守る気持ちが強く残りました。",
      "広場には、言葉にしない警戒だけが少し残りました。",
      "おやつの数よりも、互いの目線が少し遠くなりました。",
      "足あとは残りましたが、並んではいませんでした。",
      "次に会うなら、少し離れた場所から始まりそうです。",
      "森の帰り道で、ふたりは別々の音を聞いていました。",
      "近づく前に、まず身を守る気持ちが立っていました。"
    ],
    oneSidedYou: [
      "おやつは多く手に入りましたが、相手の足音は少し遠くなりました。",
      "たくさん抱えたぶん、広場には静かな距離が残りました。",
      "手の中のおやつと引き換えに、相手の目線は少し離れました。",
      "あなたの手は満ちていて、相手の足もとは少し後ろにありました。",
      "多くを持ち帰った帰り道に、少しだけ沈黙が混ざりました。",
      "おやつは残りましたが、次の日の近さは少し薄くなりました。",
      "相手は何も言わず、広場の端で立ち止まっていました。",
      "手にしたものの重さが、ふたりの距離にも少し乗りました。"
    ],
    oneSidedOpponent: [
      "相手の足もとは近く、あなたの手もとは少し軽いままでした。",
      "分けようとした気持ちは、相手に届ききらない日もありました。",
      "広場に立つあなたのそばを、少し冷たい風が通りました。",
      "差し出した手の先で、おやつは別の方へ運ばれました。",
      "あなたの足あとだけが、少し長く広場に残っていました。",
      "近づこうとした分だけ、帰り道が少し静かになりました。",
      "相手の手にはおやつがあり、あなたの中には問いが残りました。",
      "分けたかった気持ちは、森の奥で少しだけ揺れていました。"
    ],
    uncertain: [
      "近づいた日も、離れた日もあり、まだ名前のつかない距離です。",
      "ふたりの足あとには、同じ向きと違う向きが混ざっていました。",
      "次に会えば、また違う距離から始まりそうです。",
      "広場には、近さとも遠さとも言えない空気が残りました。",
      "どの日が本当だったのか、森だけが静かに覚えています。",
      "ふたりのあいだには、まだ決まらない余白がありました。",
      "近づきかけては立ち止まる、そんな7日間でした。",
      "もう一度会えば、違う足あとが残るかもしれません。"
    ],
    quiet: [
      "近づききらず、離れきらず、静かな距離が残りました。",
      "森の出口で、ふたりは少しだけ振り返りました。",
      "まだ言葉にならないまま、次の日の余白が残りました。",
      "はっきりした答えは出ないまま、広場の音だけが残りました。",
      "ふたりの距離は、大きく変わらず、少しだけ揺れていました。",
      "また会うかどうかを、森の風だけが知っていました。",
      "帰り道には、近さよりも静けさが残っていました。",
      "ふたりはそれぞれの歩幅で、森をあとにしました。"
    ]
  };


  const candidates = endings[category] || endings.quiet;
  const seed = getRelationshipEndingSeed();
  return candidates[seed % candidates.length];
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
