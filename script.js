const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 780;

const PAYOFF_TABLE = {
  [`${SHARE}_${SHARE}`]: { player: 3, opponent: 3 },
  [`${TAKE}_${SHARE}`]: { player: 5, opponent: 0 },
  [`${SHARE}_${TAKE}`]: { player: 0, opponent: 5 },
  [`${TAKE}_${TAKE}`]: { player: 1, opponent: 1 }
};

const TURN_MESSAGES = {
  [`${SHARE}_${SHARE}`]: ["ふたりで半分こした。広場の空気が、少しだけゆるんだ。"],
  [`${TAKE}_${SHARE}`]: ["あなたが先に手を伸ばした。相手は一瞬、止まって見ていた。"],
  [`${SHARE}_${TAKE}`]: ["相手が先に持っていった。あなたの手は、少し遅れて止まった。"],
  [`${TAKE}_${TAKE}`]: ["ふたりの手がぶつかった。おやつのかけらが、土に落ちた。"]
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

const state = { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, currentOpponent: null, isProcessingTurn: false, isFinished: false, resultTypeTitle: "" };

const opponents = [
  { name: "まねっこタヌキ", emoji: "🦝", mask: "⬛", image: "assets/tanuki.webp", description: "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。", decideMove: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory[playerHistory.length - 1]) },
  { name: "疑い深いカラス", emoji: "🐦‍⬛", mask: "⬛", image: "assets/crow.webp", description: "最初は距離を置く。あなたが分けた日が重なるほど、少しずつ手を伸ばす子でした。", decideMove: ({ day, playerHistory }) => (day === 1 ? TAKE : playerHistory.filter((m) => m === SHARE).length >= 3 ? SHARE : TAKE) },
  { name: "忘れっぽいウサギ", emoji: "🐰", mask: "⬛", image: "assets/rabbit.webp", description: "ふだんはわける。でも、続けて傷つくと少しだけ身を守る。けれど、戻るのも早い子でした。", decideMove: ({ playerHistory }) => (playerHistory.slice(-2).every((m) => m === TAKE) && playerHistory.length >= 2 ? TAKE : SHARE) }
];

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", () => resetGame(true));
shareButton.addEventListener("click", () => playTurn(SHARE));
takeButton.addEventListener("click", () => playTurn(TAKE));
shareResultButton.addEventListener("click", shareResult);

function startGame() { resetGame(true); }

function resetGame(newOpponent) {
  Object.assign(state, { day: 1, playerHistory: [], opponentHistory: [], playerScore: 0, opponentScore: 0, isProcessingTurn: false, isFinished: false, resultTypeTitle: "" });
  if (newOpponent || !state.currentOpponent) state.currentOpponent = opponents[Math.floor(Math.random() * opponents.length)];
  startScreen.hidden = true; gameScreen.hidden = false; resultScreen.hidden = true;
  setChoiceDisabled(false); updateScreen(); renderTracks();
}

function playTurn(playerMove) {
  if (state.isProcessingTurn || state.isFinished || state.day > MAX_DAYS) return;
  state.isProcessingTurn = true; setChoiceDisabled(true);
  const opponentMove = state.currentOpponent.decideMove({ day: state.day, playerHistory: state.playerHistory, opponentHistory: state.opponentHistory });
  state.playerHistory.push(playerMove); state.opponentHistory.push(opponentMove);
  const payoff = PAYOFF_TABLE[`${playerMove}_${opponentMove}`]; state.playerScore += payoff.player; state.opponentScore += payoff.opponent;

  const turnKey = `${playerMove === SHARE ? "s" : "t"}${opponentMove === SHARE ? "s" : "t"}`;
  gameScreen.className = `card turn-${turnKey}`;
  forestStage.classList.add("pulse");
  playerCard.classList.add("nod");
  message.textContent = TURN_MESSAGES[`${playerMove}_${opponentMove}`][0];
  renderTracks();

  setTimeout(() => {
    forestStage.classList.remove("pulse");
    playerCard.classList.remove("nod");
    if (state.day >= MAX_DAYS) { state.isFinished = true; message.textContent = "7日目が終わりました。森は、あなたたちの選び方を覚えていました。"; showResult(); return; }
    state.day += 1; state.isProcessingTurn = false; setChoiceDisabled(false); updateScreen();
  }, TURN_DELAY_MS);
}

function updateScreen() {
  dayLabel.textContent = `${state.day}日目`;
  dayNote.textContent = state.day === 1 ? "相手は、昨日のことを覚えています。" : "明日も、この広場で会います。";
  progressBar.style.width = `${(state.day / MAX_DAYS) * 100}%`;
  document.body.setAttribute("data-phase", `day-${state.day}`);
  setupOpponentShadow();
  message.textContent = "まだ、相手の正体はわかりません。";
}

function setupOpponentShadow() {
  const shadowImage = "assets/character-shadow.webp";
  opponentImage.hidden = false;
  opponentImage.alt = "正体のわからない相手";
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
  gameScreen.hidden = true; resultScreen.hidden = false;
  const result = getResultType(); state.resultTypeTitle = result.title;
  resultTitle.textContent = `あなたの記録：${result.title}`; resultText.textContent = result.text;
  opponentReveal.textContent = `相手の正体：${state.currentOpponent.name} ${state.currentOpponent.emoji}`; opponentText.textContent = state.currentOpponent.description;
  renderResultOpponent();
  snackResult.textContent = `あなたのおやつ ${state.playerScore} / 相手のおやつ ${state.opponentScore}`;
  relationshipEnding.textContent = `関係の結末：${getRelationshipEnding()}`;
  renderEndingScene();
}

function renderResultOpponent() {
  const { name, image, emoji } = state.currentOpponent;
  resultOpponentImage.hidden = false;
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
  endingScene.innerHTML = `<span class="left">🙂</span><span class="middle">🍪</span><span class="right">${state.currentOpponent.emoji}</span>`;
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

function shareResult() {
  const text = `「また明日も会うきみへ」で遊びました。私の記録は「${state.resultTypeTitle}」でした。森では、昨日のことをみんな覚えています。`;
  const url = `${window.location.origin}${window.location.pathname}`;
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank", "noopener,noreferrer");
}

function setChoiceDisabled(disabled) { shareButton.disabled = disabled; takeButton.disabled = disabled; }
