const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-button");
const shareButton = document.getElementById("share-button");
const takeButton = document.getElementById("take-button");
const retryButton = document.getElementById("retry-button");

const dayLabel = document.getElementById("day-label");
const message = document.getElementById("message");
const opponentName = document.getElementById("opponent-name");

const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const opponentReveal = document.getElementById("opponent-reveal");
const opponentText = document.getElementById("opponent-text");

let day = 1;
let maxDays = 7;
let playerHistory = [];
let opponentHistory = [];

const SHARE = "わける";
const TAKE = "ひとりじめ";

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", resetGame);

shareButton.addEventListener("click", () => playTurn(SHARE));
takeButton.addEventListener("click", () => playTurn(TAKE));

function startGame() {
  startScreen.hidden = true;
  gameScreen.hidden = false;
  resultScreen.hidden = true;

  day = 1;
  playerHistory = [];
  opponentHistory = [];

  updateDay();
}

function resetGame() {
  startGame();
}

function updateDay() {
  dayLabel.textContent = `${day}日目`;
  opponentName.textContent = "？？？";
  message.textContent = "どうしますか？";
}

function getOpponentMove() {
  // まねっこタヌキ：
  // 1日目はわける。2日目以降は、あなたの昨日の行動をまねする。
  if (day === 1) {
    return SHARE;
  }

  return playerHistory[playerHistory.length - 1];
}

function playTurn(playerMove) {
  const opponentMove = getOpponentMove();

  playerHistory.push(playerMove);
  opponentHistory.push(opponentMove);

  message.textContent = getTurnMessage(playerMove, opponentMove);

  if (day >= maxDays) {
    setTimeout(showResult, 900);
    return;
  }

  day += 1;

  setTimeout(updateDay, 900);
}

function getTurnMessage(player, opponent) {
  if (player === SHARE && opponent === SHARE) {
    return "ふたりで半分こした。広場は、少しだけあたたかかった。";
  }

  if (player === TAKE && opponent === SHARE) {
    return "今日は、あなたがたくさん食べた。相手は何も言わなかった。ただ、見ていた。";
  }

  if (player === SHARE && opponent === TAKE) {
    return "相手が全部持っていった。あなたは笑ったままでいられなかった。";
  }

  return "ふたりの手が同時にぶつかった。おやつは少しだけ、土の上に落ちた。";
}

function showResult() {
  gameScreen.hidden = true;
  resultScreen.hidden = false;

  const shareCount = playerHistory.filter(move => move === SHARE).length;
  const takeCount = playerHistory.filter(move => move === TAKE).length;

  if (shareCount >= 5) {
    resultTitle.textContent = "あなたの記録：明日を信じる人";
    resultText.textContent =
      "あなたは、何度か迷いながらも、分け合う道を選びました。この森では、それは一番すばやく得をする方法ではありません。でも、明日も誰かと会うなら、悪くない選び方です。";
  } else if (takeCount >= 5) {
    resultTitle.textContent = "あなたの記録：今日を取りにいく人";
    resultText.textContent =
      "あなたは、目の前のおやつを逃しませんでした。何度か、それは正しい選択でした。ただ、相手もまた、昨日のあなたを覚えています。";
  } else {
    resultTitle.textContent = "あなたの記録：迷いながら選ぶ人";
    resultText.textContent =
      "あなたは、信じることと守ることの間で揺れていました。この森では、その迷いもまた、ひとつの記録として残ります。";
  }

  opponentReveal.textContent = "相手の正体：まねっこタヌキ";
  opponentText.textContent =
    "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。";
}