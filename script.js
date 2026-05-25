const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 520;
const BUILD_VERSION = "d33b57b";

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
const snackResult = document.getElementById("snack-result");
const relationshipEnding = document.getElementById("relationship-ending");
const opponentReveal = document.getElementById("opponent-reveal");
const opponentText = document.getElementById("opponent-text");
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

const state = { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, currentOpponent: null, isProcessingTurn: false, isFinished: false, resultTypeTitle: "", turnResolved: false };

// Character image assets are loaded from /assets relative to index.html
const opponents = [
  { name: "まねっこタヌキ", emoji: "🦝", mask: "⬛", image: "assets/tanuki.webp", description: "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。", decideMove: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory[playerHistory.length - 1]) },
  { name: "疑い深いカラス", emoji: "🐦‍⬛", mask: "⬛", image: "assets/crow.webp", description: "最初は距離を置く。あなたが分けた日が重なるほど、少しずつ手を伸ばす子でした。", decideMove: ({ day, playerHistory }) => (day === 1 ? TAKE : playerHistory.filter((m) => m === SHARE).length >= 3 ? SHARE : TAKE) },
  { name: "忘れっぽいウサギ", emoji: "🐰", mask: "⬛", image: "assets/rabbit.webp", description: "ふだんはわける。でも、続けて傷つくと少しだけ身を守る。けれど、戻るのも早い子でした。", decideMove: ({ playerHistory }) => (playerHistory.slice(-2).every((m) => m === TAKE) && playerHistory.length >= 2 ? TAKE : SHARE) }
];

startButton.addEventListener("click", startGame);
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
  triggerMotion(gameScreen, "motion-enter");
}

function showResultScreen() {
  gameScreen.hidden = true;
  resultScreen.hidden = false;
  triggerMotion(resultScreen, "motion-enter");
}

function resetGame(newOpponent) {
  Object.assign(state, { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, isProcessingTurn: false, isFinished: false, resultTypeTitle: "", turnResolved: false });
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
  opponentReveal.textContent = `相手の正体：${state.currentOpponent.name} ${state.currentOpponent.emoji}`; opponentText.textContent = state.currentOpponent.description;
  renderResultOpponent();
  snackResult.innerHTML = `<span class="result-chip">あなたのおやつ ${state.playerScore}</span><span class="result-chip">相手のおやつ ${state.opponentScore}</span>`;
  relationshipEnding.textContent = `関係の結末：${getRelationshipEnding()}`;
  renderResultTracks();
  renderEndingScene();
  const resultItems = resultScreen.querySelectorAll(".result-panel, .result-stats, .ending-scene, .result-buttons");
  resultItems.forEach((item, index) => {
    item.style.animationDelay = `${Math.min(index * 0.05, 0.25)}s`;
    triggerMotion(item, "motion-result");
  });
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

function getResultType() {
  const shareCount = state.playerHistory.filter((m) => m === SHARE).length;
  const takeCount = state.playerHistory.filter((m) => m === TAKE).length;
  const coop = state.playerHistory.filter((m, i) => m === SHARE && state.opponentHistory[i] === SHARE).length;
  const clash = state.playerHistory.filter((m, i) => m === TAKE && state.opponentHistory[i] === TAKE).length;
  const mismatch = state.playerHistory.filter((m, i) => m !== state.opponentHistory[i]).length;
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

  if (shareCount === MAX_DAYS) return { title: "最後まで分けた人", text: "あなたは7日間、分けることを続けました。相手がどう動いても、その手つきは変わりませんでした。" };
  if (takeCount === MAX_DAYS) return { title: "最後まで守った人", text: "あなたは7日間、自分の分を守り続けました。広場には、得たものと残った距離の両方がありました。" };
  if (forgive > 0) return { title: "それでも差し出す人", text: "受け取れない日があっても、あなたはもう一度差し出しました。その選択は、すぐに報われなくても残ります。" };
  if (recover > 0) return { title: "仲直りを試す人", text: "一度離れたあとも、あなたはもう一度分ける道を選びました。戻ろうとする選択も、森には残ります。" };
  if (lateShares > earlyShares && lateShares >= 2) return { title: "静かに信じ直す人", text: "後半のあなたは、少しずつ分けるほうへ戻っていきました。広場の空気も、少しだけやわらいでいます。" };
  if (lateTakes > earlyTakes && lateTakes >= 2) return { title: "距離を測る人", text: "後半のあなたは、少し距離を置く選び方をしました。守ることにも、理由があったのかもしれません。" };
  if (coop >= 4) return { title: "同じ歩幅の人", text: "あなたと相手は、何度も同じ選び方で並びました。広場には、分け合った日の静けさが残っています。" };
  if (clash >= 3) return { title: "針をしまえない人", text: "あなたは身を守る選択を多く取りました。そのぶん、広場には近づききれない空気も残りました。" };
  if (mismatch >= 4) return { title: "すれ違いを抱えた人", text: "あなたと相手の選び方は、何度もすれ違いました。それでも7日間、同じ広場に戻ってきました。" };
  if (state.playerScore >= 22 && shareCount >= 2 && takeCount >= 2) return { title: "今日と明日の間にいる人", text: "あなたは得ることと関係を残すことの間で選びました。今日の多さと、明日の空気が並んでいます。" };
  if (alternating >= 4) return { title: "様子を見る人", text: "あなたは相手の出方を見ながら、何度も選び方を変えました。広場では、迷いもひとつの記録です。" };
  if (shareCount >= 5) return { title: "明日を信じる人", text: "あなたは、迷いながらも分け合う道を選びました。明日がある場所では、その選び方が静かに残ります。" };
  if (takeCount >= 5) return { title: "今日を取りにいく人", text: "あなたは、目の前のクッキーを取りこぼしませんでした。ただ、相手も昨日のことを覚えています。" };
  return { title: "迷いながら選ぶ人", text: "信じることと守ることの間で、あなたは何度も立ち止まりました。森は、その揺れも覚えています。" };
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
