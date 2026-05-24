const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 520;

const PAYOFF_TABLE = {
  [`${SHARE}_${SHARE}`]: { player: 3, opponent: 3 },
  [`${TAKE}_${SHARE}`]: { player: 5, opponent: 0 },
  [`${SHARE}_${TAKE}`]: { player: 0, opponent: 5 },
  [`${TAKE}_${TAKE}`]: { player: 1, opponent: 1 }
};

const REACTION_MESSAGES = {
  bothShare: [
    "ふたりの前に、おやつが半分ずつ残りました。",
    "広場の空気が、ほんの少しやわらぎました。",
    "相手の影が、少しだけ近くに見えました。",
    "分けたおやつの間に、静かな時間が流れました。",
    "ふたりとも、何も言わずに同じだけ受け取りました。",
    "今日の広場には、冷たい沈黙は残りませんでした。",
    "相手は少しだけ、こちらを見る時間を長くしました。",
    "おやつは減ったのに、広場は少し満ちたようでした。",
    "ふたりの手元に、同じくらいのあたたかさが残りました。",
    "昨日までの空気が、少しだけほどけたようでした。",
    "相手はすぐには近づきませんでしたが、離れもしませんでした。",
    "森の奥で、風が小さく向きを変えました。",
    "半分ずつのおやつが、今日の広場を静かに保ちました。",
    "相手の気配が、少しだけやわらかくなりました。",
    "ふたりの間に、まだ明日が残っているようでした。",
    "おやつを分けたあと、広場の真ん中に小さな余白ができました。",
    "相手は、今日のことをしまっておくように黙っていました。",
    "分けるという選択が、少しだけ道を明るくしました。",
    "ふたりとも多くは取りませんでした。それでも、何かは残りました。",
    "明日もここに来られそうな空気が、少しだけありました。"
  ],
  youShareOpponentTakes: [
    "あなたの前のおやつは、空っぽになりました。",
    "分けるつもりだった手が、少しだけ止まりました。",
    "相手は何も言わず、広場の向こうに残っていました。",
    "あなたが差し出した分は、戻ってきませんでした。",
    "広場の真ん中に、少しだけ冷たい間ができました。",
    "相手の影は、近づいたようで、まだ遠いままでした。",
    "あなたの選択だけが、静かに広場に残りました。",
    "分けようとした気持ちは、森の空気にゆっくり沈みました。",
    "相手は受け取ったあと、すぐにはこちらを見ませんでした。",
    "明日のことを考えるには、少し静かすぎる広場でした。",
    "あなたの前に残ったのは、空になった場所だけでした。",
    "信じたぶんだけ、広場が少し広く見えました。",
    "差し出したおやつの向こうで、相手の気配が揺れました。",
    "相手は迷っていたのかもしれません。ただ、今日は返ってきませんでした。",
    "あなたは分けました。けれど、同じ重さでは返りませんでした。",
    "森の空気が、少しだけ固くなりました。",
    "相手の沈黙が、昨日より長く感じられました。",
    "空っぽの手元に、明日のことだけが残りました。",
    "あなたの選択は、相手の中にしまわれたようでした。",
    "分けたことが、すぐに報われるとは限りませんでした。"
  ],
  youTakeOpponentShares: [
    "あなたのおやつは増えました。相手の前には、何も残りませんでした。",
    "今日だけなら、それは得に見えました。",
    "相手は止まって、こちらを見ていました。",
    "広場の空気が、少しだけ重くなりました。",
    "あなたの手元には多く残りましたが、間の距離も残りました。",
    "相手が差し出した分は、あなたの側に集まりました。",
    "相手の影が、少しだけ遠くなったようでした。",
    "おやつは増えました。けれど、広場は少し静かになりました。",
    "あなたの選択のあと、相手はすぐには動きませんでした。",
    "森の奥で、さっきまでの空気が細くなりました。",
    "多く取ったぶんだけ、真ん中の余白が広がりました。",
    "相手の沈黙が、今日のことを覚えているようでした。",
    "あなたの前には甘いものが残り、向こうには静けさが残りました。",
    "その選択は、すぐには誰にも責められませんでした。",
    "ただ、相手との間に少しだけ線が引かれたようでした。",
    "広場の向こうで、相手の気配が小さく揺れました。",
    "あなたは多く受け取りました。明日は、まだ分かりません。",
    "相手は何かを言いかけたように見えて、黙りました。",
    "得をしたはずなのに、広場は少し冷たく感じられました。",
    "今日の多さが、明日の空気に残るかもしれません。"
  ],
  bothTake: [
    "ふたりとも、自分の分だけを守りました。",
    "広場の真ん中に、冷たい沈黙が残りました。",
    "今日は、どちらも近づきませんでした。",
    "おやつは少しだけ残り、距離はそのままでした。",
    "ふたりの手元に残ったものは、あまり多くありませんでした。",
    "相手もあなたも、同じように広場を見ていました。",
    "誰も差し出さなかったので、何も戻ってきませんでした。",
    "森の空気が、少しだけ暗くなったようでした。",
    "ふたりの間に、昨日よりかたい静けさがありました。",
    "守ったはずなのに、あたたかさはあまり残りませんでした。",
    "相手の影も、あなたの影も、同じ場所から動きませんでした。",
    "広場には、小さなおやつと長い沈黙だけが残りました。",
    "今日は、どちらの手も前に出ませんでした。",
    "ふたりとも失わないようにして、少しずつ失ったようでした。",
    "相手は何も言わず、あなたも何も言いませんでした。",
    "明日の広場が、少し遠く感じられました。",
    "お互いの選択が、同じ冷たさで並びました。",
    "その日は、誰も先に信じませんでした。",
    "残ったおやつの少なさより、残った距離のほうが目立ちました。",
    "ふたりの間に、次の一歩を待つような沈黙がありました。"
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

const startButton = document.getElementById("start-button");
const shareButton = document.getElementById("share-button");
const takeButton = document.getElementById("take-button");
const retryButton = document.getElementById("retry-button");
const shareResultButton = document.getElementById("share-result-button");
const newOpponentButton = document.getElementById("new-opponent-button");
const continueButton = document.getElementById("continue-button");
const bgm = document.getElementById("bgm");
const bgmToggleButton = document.getElementById("bgm-toggle") || document.getElementById("bgm-toggle-button");

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
}

function showResultScreen() {
  gameScreen.hidden = true;
  resultScreen.hidden = false;
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
  renderTracks();
  updateContinueButton();

  setTimeout(() => {
    forestStage.classList.remove("pulse");
    playerCard.classList.remove("nod");
    state.isProcessingTurn = false;
    state.turnResolved = true;
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
  updateContinueButton();
}

function updateContinueButton() {
  const ready = state.turnResolved && !state.isProcessingTurn;
  continueButton.hidden = !ready;
  continueButton.disabled = !ready;
  continueButton.textContent = state.day >= MAX_DAYS ? "結果を見る" : "次の日へ";
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
  if (shareCount >= 5) return { title: "明日を信じる人", text: "あなたは、迷いながらも分け合う道を選びました。明日がある場所では、その選び方が静かに残ります。" };
  if (takeCount >= 5) return { title: "今日を取りにいく人", text: "あなたは、目の前のぶんを取りこぼしませんでした。ただ、相手も昨日のことを覚えています。" };
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

function setChoiceDisabled(disabled) { shareButton.disabled = disabled; takeButton.disabled = disabled; }
