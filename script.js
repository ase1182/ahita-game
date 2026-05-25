const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 520;
const BUILD_VERSION = "f5e4a2c";

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
const dayMotionTargets = [dayLabel, dayNote, playerTrack, opponentTrack, message];

const startButton = document.getElementById("start-button");
const shareButton = document.getElementById("share-button");
const takeButton = document.getElementById("take-button");
const retryButton = document.getElementById("retry-button");
const shareResultButton = document.getElementById("share-result-button");
const newOpponentButton = document.getElementById("new-opponent-button");
const continueButton = document.getElementById("continue-button");
const bgm = document.getElementById("bgm");
const bgmToggleButton =
  document.getElementById("bgm-toggle-button") ||
  document.getElementById("bgm-toggle");
const buildVersionElement = document.getElementById("build-version");

if (buildVersionElement) {
  buildVersionElement.textContent = `build ${BUILD_VERSION}`;
}

const state = { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, currentOpponent: null, isProcessingTurn: false, isFinished: false, resultTypeTitle: "", turnResolved: false, decisionTimes: [], turnStartedAt: 0 };

// Character image assets are loaded from /assets relative to index.html
const strategies = {
  mirrorYesterday: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory[playerHistory.length - 1]),
  cautiousCrow: ({ day, playerHistory }) => (day === 1 ? TAKE : playerHistory.filter((m) => m === SHARE).length >= 3 ? SHARE : TAKE),
  forgetfulRabbit: ({ playerHistory }) => (playerHistory.slice(-2).every((m) => m === TAKE) && playerHistory.length >= 2 ? TAKE : SHARE),
  alwaysCooperate: () => SHARE,
  grimTrigger: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory.includes(TAKE) ? TAKE : SHARE)
};

// OPPONENT_SCHEMA
// - id: 内部キー（一意・英小文字推奨）
// - name: 表示名
// - emoji: fallback表示や演出用
// - image: 結果画面の画像パス
// - description: 結果画面の説明文
// - strategyKey: strategies のキー
// - spawnWeight: 将来の出現率調整用（現時点では抽選に未使用）
// - mask: 現状未使用（将来の正体隠し演出向けに保持）
const opponents = [
  { id: "tanuki", name: "まねっこタヌキ", emoji: "🦝", mask: "⬛", image: "assets/tanuki.webp", description: "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。", strategyKey: "mirrorYesterday", spawnWeight: 1, profile: { temperament: "相手のしたことをよく見て、次の日にそっと返す子です。", habit: "信じてもらえた日は信じ返し、ひとりじめされた日は少し身を守ります。", memory: "あなたの選び方が、そのままこの子の明日の表情になっていました。" } },
  { id: "crow", name: "疑い深いカラス", emoji: "🐦‍⬛", mask: "⬛", image: "assets/crow.webp", description: "最初は距離を置く。あなたが分けた日が重なるほど、少しずつ手を伸ばす子でした。", strategyKey: "cautiousCrow", spawnWeight: 1, profile: { temperament: "高い枝の上から、相手の動きをよく見ている子です。", habit: "すぐには近づかず、自分のおやつを守るように選びます。", memory: "近づきすぎず、離れすぎず、最後まであなたの出方を見ていました。" } },
  { id: "rabbit", name: "忘れっぽいウサギ", emoji: "🐰", mask: "⬛", image: "assets/rabbit.webp", description: "ふだんはわける。でも、続けて傷つくと少しだけ身を守る。けれど、戻るのも早い子でした。", strategyKey: "forgetfulRabbit", spawnWeight: 1, profile: { temperament: "こわかったことも、時間がたつと少し薄れていく子です。", habit: "昨日のことを全部は抱えきれないので、また分けるほうへ戻りやすくなります。", memory: "何度も迷いながら、それでも次の日には広場へ来てくれました。" } },
  { id: "squirrel", name: "分けつづけるりす", emoji: "🐿️", mask: "⬛", image: "assets/squirrel.webp", description: "いつも分けようとする、疑うことを知らない相手でした。", strategyKey: "alwaysCooperate", spawnWeight: 1, profile: { temperament: "小さなおやつでも、誰かと分けることを先に考える子です。", habit: "疑うよりも、まず差し出してみることを選びます。", memory: "あなたがどう選んでも、最後まで同じように広場に立っていました。" } },
  { id: "wolf", name: "忘れないおおかみ", emoji: "🐺", mask: "⬛", image: "assets/wolf.webp", description: "最初は分けようとするけれど、一度裏切られると最後まで忘れない相手でした。", strategyKey: "grimTrigger", spawnWeight: 1, profile: { temperament: "最初は静かに分けようとしますが、一度のことを深く覚える子です。", habit: "傷ついたあとは、もう同じ距離では近づけなくなります。", memory: "最初の信頼が続くかどうかを、最後まで見ていました。" } }
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
if (bgmToggleButton) {
  bgmToggleButton.addEventListener("click", toggleBgm);
}

let isBgmOn = false;

if (bgm && bgmToggleButton) {
  bgm.volume = 0.25;
  bgm.addEventListener("error", () => {
    isBgmOn = false;
    bgmToggleButton.textContent = "音をつける";
    bgmToggleButton.setAttribute("aria-pressed", "false");
  });
}

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

function toggleBgm() {
  if (!bgm || !bgmToggleButton) return;

  if (isBgmOn) {
    bgm.pause();
    bgm.currentTime = 0;
    isBgmOn = false;
    bgmToggleButton.textContent = "音をつける";
    bgmToggleButton.setAttribute("aria-pressed", "false");
    return;
  }

  const playPromise = bgm.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      isBgmOn = false;
      bgmToggleButton.textContent = "音をつける";
      bgmToggleButton.setAttribute("aria-pressed", "false");
    });
  }
  isBgmOn = true;
  bgmToggleButton.textContent = "音を消す";
  bgmToggleButton.setAttribute("aria-pressed", "true");
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
  if (newOpponent || !state.currentOpponent) state.currentOpponent = chooseRandomOpponent();
  showGameScreen();
  setChoiceDisabled(false); updateScreen(); renderTracks();
}

function chooseRandomOpponent() {
  return opponents[Math.floor(Math.random() * opponents.length)];
}

function selectNewOpponent() {
  if (opponents.length <= 1) {
    state.currentOpponent = chooseRandomOpponent();
    return;
  }

  let nextOpponent = chooseRandomOpponent();
  while (nextOpponent === state.currentOpponent) {
    nextOpponent = chooseRandomOpponent();
  }
  state.currentOpponent = nextOpponent;
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

function getRelationshipEnding() {
  const coop = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === SHARE).length;
  const clash = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === TAKE).length;
  if (coop >= 4) return "7日目のあと、ふたりは同じ切り株のそばに残っていました。";
  if (clash >= 3) return "7日目のあと、ふたりのあいだには少し固い空気が残りました。";
  return "7日目のあと、少し離れたまま、どちらも広場を振り返っていました。";
}

function buildShareText(resultTypeTitle, opponentName) {
  const lingeringLines = [
    "この森では、昨日のことをみんな覚えています。",
    "今日だけなら、ひとりじめは得だったかもしれない。",
    "明日も会うなら、選び方は少し変わる。",
    "信じることも、疑うことも、ちゃんと残っていました。"
  ];
  const line = lingeringLines[(state.playerScore + state.opponentScore) % lingeringLines.length];
  return [
    "「また明日も会うきみへ」で遊びました。",
    `私の記録は「${resultTypeTitle}」。`,
    `相手は「${opponentName}」でした。`,
    line
  ].join("\n");
}

function shareResult() {
  const resultTypeTitle = state.resultTypeTitle || getResultType().title;
  const opponentName = state.currentOpponent?.name || "正体不明の相手";
  const text = buildShareText(resultTypeTitle, opponentName);
  const url = window.location.href;
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
