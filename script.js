// 定数定義
const SHARE = "わける";
const TAKE = "ひとりじめ";
const MAX_DAYS = 7;
const TURN_DELAY_MS = 700;

const PAYOFF_TABLE = {
  [`${SHARE}_${SHARE}`]: { player: 3, opponent: 3 },
  [`${TAKE}_${SHARE}`]: { player: 5, opponent: 0 },
  [`${SHARE}_${TAKE}`]: { player: 0, opponent: 5 },
  [`${TAKE}_${TAKE}`]: { player: 1, opponent: 1 }
};

const TURN_MESSAGES = {
  [`${SHARE}_${SHARE}`]: [
    "ふたりで半分こした。広場は、少しだけあたたかかった。",
    "半分こしたおやつを見て、相手は少し笑った。"
  ],
  [`${TAKE}_${SHARE}`]: [
    "今日は、あなたがたくさん食べた。相手は何も言わなかった。ただ、見ていた。",
    "あなたが先に手を伸ばした。相手は黙っていた。"
  ],
  [`${SHARE}_${TAKE}`]: [
    "相手が全部持っていった。あなたは笑ったままでいられなかった。",
    "あなたが差し出したぶんまで、相手が持っていった。"
  ],
  [`${TAKE}_${TAKE}`]: [
    "ふたりの手が同時にぶつかった。おやつは少しだけ、土の上に落ちた。",
    "同時に手を伸ばして、少し気まずい沈黙が残った。"
  ]
};

// DOM取得
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const dayLabel = document.getElementById("day-label");
const message = document.getElementById("message");
const opponentName = document.getElementById("opponent-name");
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

// 状態管理
const state = {
  day: 1,
  playerHistory: [],
  opponentHistory: [],
  playerScore: 0,
  opponentScore: 0,
  currentOpponent: null,
  isProcessingTurn: false,
  isFinished: false,
  resultTypeTitle: ""
};

// opponents 配列
const opponents = [
  {
    id: "tanuki",
    name: "まねっこタヌキ",
    emoji: "🦝",
    description: "最初はわける。次の日から、あなたの昨日の行動を返してくる子でした。",
    decideMove: ({ day, playerHistory }) => (day === 1 ? SHARE : playerHistory[playerHistory.length - 1])
  },
  {
    id: "crow",
    name: "疑い深いカラス",
    emoji: "🐦‍⬛",
    description: "最初は距離を置く。あなたが分けた日が重なるほど、少しずつ手を伸ばす子でした。",
    decideMove: ({ day, playerHistory }) => {
      if (day === 1) return TAKE;
      const shareCount = playerHistory.filter((move) => move === SHARE).length;
      return shareCount >= 3 ? SHARE : TAKE;
    }
  },
  {
    id: "rabbit",
    name: "忘れっぽいウサギ",
    emoji: "🐇",
    description: "ふだんはわける。でも、続けて傷つくと少しだけ身を守る。けれど、戻るのも早い子でした。",
    decideMove: ({ playerHistory }) => {
      const recent = playerHistory.slice(-2);
      return recent.length === 2 && recent.every((move) => move === TAKE) ? TAKE : SHARE;
    }
  }
];

startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", () => resetGame({ newOpponent: true }));
shareButton.addEventListener("click", () => playTurn(SHARE));
takeButton.addEventListener("click", () => playTurn(TAKE));
shareResultButton.addEventListener("click", shareResult);

function startGame() {
  resetGame({ newOpponent: true });
}

function resetGame({ newOpponent }) {
  state.day = 1;
  state.playerHistory = [];
  state.opponentHistory = [];
  state.playerScore = 0;
  state.opponentScore = 0;
  state.isProcessingTurn = false;
  state.isFinished = false;
  state.resultTypeTitle = "";
  if (newOpponent || !state.currentOpponent) {
    state.currentOpponent = opponents[Math.floor(Math.random() * opponents.length)];
  }

  startScreen.hidden = true;
  gameScreen.hidden = false;
  resultScreen.hidden = true;

  setChoiceDisabled(false);
  updateScreen();
}

function playTurn(playerMove) {
  if (state.isProcessingTurn || state.isFinished || state.day > MAX_DAYS) return;
  state.isProcessingTurn = true;
  setChoiceDisabled(true);

  const opponentMove = state.currentOpponent.decideMove({
    day: state.day,
    playerHistory: state.playerHistory,
    opponentHistory: state.opponentHistory
  });

  state.playerHistory.push(playerMove);
  state.opponentHistory.push(opponentMove);

  const payoff = getPayoff(playerMove, opponentMove);
  state.playerScore += payoff.player;
  state.opponentScore += payoff.opponent;

  message.textContent = getTurnMessage(playerMove, opponentMove);

  const isLastDay = state.day >= MAX_DAYS;
  window.setTimeout(() => {
    if (isLastDay) {
      state.isFinished = true;
      showResult();
      return;
    }

    state.day += 1;
    state.isProcessingTurn = false;
    setChoiceDisabled(false);
    updateScreen();
  }, TURN_DELAY_MS);
}

function getPayoff(playerMove, opponentMove) {
  return PAYOFF_TABLE[`${playerMove}_${opponentMove}`];
}

function getTurnMessage(playerMove, opponentMove) {
  const candidates = TURN_MESSAGES[`${playerMove}_${opponentMove}`];
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index];
}

function updateScreen() {
  dayLabel.textContent = `${state.day}日目`;
  opponentName.textContent = "？？？";
  message.textContent = "どうしますか？";
}

function showResult() {
  gameScreen.hidden = true;
  resultScreen.hidden = false;
  state.isProcessingTurn = false;

  const result = getResultType();
  state.resultTypeTitle = result.title;
  resultTitle.textContent = `あなたの記録：${result.title}`;
  resultText.textContent = result.text;

  snackResult.textContent = `あなたのおやつ ${state.playerScore} / 相手のおやつ ${state.opponentScore}`;
  relationshipEnding.textContent = `関係の結末：${getRelationshipEnding()}`;

  opponentReveal.textContent = `相手の正体：${state.currentOpponent.name} ${state.currentOpponent.emoji}`;
  opponentText.textContent = state.currentOpponent.description;
}

function getResultType() {
  const player = state.playerHistory;
  const opponent = state.opponentHistory;
  const shareCount = player.filter((m) => m === SHARE).length;
  const takeCount = player.filter((m) => m === TAKE).length;

  const hadRetaliationRun = opponent.some((opMove, i) => opMove === TAKE && player[i] === SHARE)
    && player.slice(-3).every((m) => m === TAKE);

  const hadReconcile = player.some((move, i) => {
    if (i < 2 || move !== SHARE) return false;
    return player[i - 1] === TAKE && opponent[i - 1] === TAKE;
  });

  const earlyTakeCount = player.slice(0, 3).filter((m) => m === TAKE).length;
  const lateShareCount = player.slice(4).filter((m) => m === SHARE).length;

  if (shareCount >= 5) {
    return {
      title: "明日を信じる人",
      text: "あなたは、何度か迷いながらも、分け合う道を選びました。この森では、それは一番すばやく得をする方法ではありません。でも、明日も誰かと会うなら、悪くない選び方です。"
    };
  }

  if (takeCount >= 5) {
    return {
      title: "今日を取りにいく人",
      text: "あなたは、目の前のおやつを逃しませんでした。何度か、それは正しい選択でした。ただ、相手もまた、昨日のあなたを覚えています。"
    };
  }

  if (hadRetaliationRun) {
    return {
      title: "針をしまえない人",
      text: "あなたは、一度のことを簡単には忘れませんでした。それは身を守る力でもあります。でも、ときどき、仲直りの合図まで見落としてしまいます。"
    };
  }

  if (hadReconcile) {
    return {
      title: "仲直りを試す人",
      text: "あなたは、こじれたあとでも、もう一度だけ手を差し出しました。うまくいくとは限りません。それでも、森はその一度を覚えています。"
    };
  }

  if (earlyTakeCount >= 2 && lateShareCount >= 2) {
    return {
      title: "様子を見る人",
      text: "あなたは、最初からすべてを信じることはしませんでした。相手を見て、少しずつ選び方を変えていきました。この森では、慎重さもまた、ひとつのやさしさです。"
    };
  }

  return {
    title: "迷いながら選ぶ人",
    text: "あなたは、信じることと守ることの間で揺れていました。この森では、その迷いもまた、ひとつの記録として残ります。"
  };
}

function getRelationshipEnding() {
  const pairHistory = state.playerHistory.map((playerMove, i) => `${playerMove}_${state.opponentHistory[i]}`);
  const coopCount = pairHistory.filter((pair) => pair === `${SHARE}_${SHARE}`).length;
  const exploitCount = pairHistory.filter((pair) => pair.includes(`${TAKE}`) && !pair.endsWith(`_${TAKE}`) || pair.startsWith(`${SHARE}_`)).length;
  const clashCount = pairHistory.filter((pair) => pair === `${TAKE}_${TAKE}`).length;

  const recovered = state.playerHistory.some((move, i) => i > 0 && move === SHARE && state.playerHistory[i - 1] === TAKE);

  if (recovered && clashCount >= 1) {
    return "ぎこちなさは残ったまま。それでも、7日目のあとにもう一度だけ手を伸ばす気配がありました。";
  }

  if (clashCount >= 3) {
    return `7日目のあと、${state.currentOpponent.name.replace("疑い深い", "").replace("忘れっぽい", "")}は少し距離を置いたまま、広場を見ていました。`;
  }

  if (coopCount >= 4) {
    return `次の日も、${state.currentOpponent.name.replace("疑い深い", "").replace("忘れっぽい", "")}は広場に来ました。少し笑っていました。`;
  }

  if (exploitCount >= 3) {
    return `7日目のあと、${state.currentOpponent.name.replace("疑い深い", "").replace("忘れっぽい", "")}は何も言わず、少し離れた木のそばにいました。`;
  }

  return "関係はまだ決まっていません。明日、また会えば、記録は少しずつ変わっていきます。";
}

function shareResult() {
  const text = `「また明日も会うきみへ」で遊びました。私の記録は「${state.resultTypeTitle}」でした。森では、昨日のことをみんな覚えています。`;
  const url = `${window.location.origin}${window.location.pathname}`;
  const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareUrl, "_blank", "noopener,noreferrer");
}

function setChoiceDisabled(isDisabled) {
  shareButton.disabled = isDisabled;
  takeButton.disabled = isDisabled;
}
