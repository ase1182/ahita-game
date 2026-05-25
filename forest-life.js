const STORAGE_KEYS = {
  balance: "ahita.cookies.balance",
  sessionId: "ahita.forestlife.sessionId",
  broughtIn: "ahita.forestlife.broughtIn",
  spent: "ahita.forestlife.spent",
  state: "ahita.forestlife.state"
};

const DAILY_SNACK_COST = 3;
const ACTIONS_PER_DAY = 2;

const dom = {
  startScreen: document.getElementById("forest-life-start-screen"),
  gameScreen: document.getElementById("forest-life-game-screen"),
  resultScreen: document.getElementById("forest-life-result-screen"),
  balanceEl: document.getElementById("forest-balance"),
  broughtInInput: document.getElementById("brought-in-input"),
  startButton: document.getElementById("start-forest-session"),
  dayEl: document.getElementById("forest-day"),
  statusEl: document.getElementById("forest-session-status"),
  snackCostEl: document.getElementById("forest-snack-cost"),
  actionsLeftEl: document.getElementById("forest-actions-left"),
  animalsEl: document.getElementById("forest-animals"),
  dayStatusEl: document.getElementById("forest-day-status"),
  lendButton: document.getElementById("forest-lend-button"),
  borrowButton: document.getElementById("forest-borrow-button"),
  investButton: document.getElementById("forest-invest-button"),
  nextDayButton: document.getElementById("forest-next-day-button"),
  finishButton: document.getElementById("finish-forest-session"),
  lendList: document.getElementById("forest-lend-list"),
  borrowList: document.getElementById("forest-borrow-list"),
  investLog: document.getElementById("forest-invest-log"),
  actionLog: document.getElementById("forest-action-log"),
  resultTitle: document.getElementById("forest-result-title"),
  resultBroughtIn: document.getElementById("forest-result-brought-in"),
  resultDay: document.getElementById("forest-result-day"),
  resultBalance: document.getElementById("forest-result-balance"),
  resultLending: document.getElementById("forest-result-lending"),
  resultBorrowing: document.getElementById("forest-result-borrowing"),
  retryButton: document.getElementById("forest-retry-button")
};

let safeStorage = null;
let forestLifeBgm = null;
let forestLifeBgmToggle = null;

function safeInt(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.max(0, Math.floor(num)) : fallback;
}

function initStorage() {
  try {
    const k = "__forest_storage_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return localStorage;
  } catch (_e) {
    return null;
  }
}

function loadCookieBalance() {
  if (!safeStorage) return 0;
  return safeInt(safeStorage.getItem(STORAGE_KEYS.balance), 0);
}

function saveCookieBalance(value) {
  if (!safeStorage) return;
  safeStorage.setItem(STORAGE_KEYS.balance, String(safeInt(value, 0)));
}

function newState() {
  return {
    status: "idle",
    day: 0,
    broughtIn: 0,
    hand: 0,
    totalSnackPaid: 0,
    actionsLeft: ACTIONS_PER_DAY,
    snackCost: DAILY_SNACK_COST,
    animals: 3,
    lends: [],
    borrows: [],
    investResults: [],
    actionLogs: [],
    tired: false
  };
}

function loadForestLifeState() {
  if (!safeStorage) return newState();
  let parsed = null;
  try {
    parsed = JSON.parse(safeStorage.getItem(STORAGE_KEYS.state) || "null");
  } catch (_e) { parsed = null; }
  const base = newState();
  if (!parsed || typeof parsed !== "object") return base;
  base.status = parsed.status === "playing" || parsed.status === "ended" ? parsed.status : "idle";
  base.day = safeInt(parsed.day, 0);
  base.broughtIn = safeInt(parsed.broughtIn, 0);
  base.hand = safeInt(parsed.hand, 0);
  base.totalSnackPaid = safeInt(parsed.totalSnackPaid, 0);
  base.actionsLeft = Math.min(ACTIONS_PER_DAY, safeInt(parsed.actionsLeft, ACTIONS_PER_DAY));
  base.snackCost = DAILY_SNACK_COST;
  base.animals = Math.max(1, safeInt(parsed.animals, 3));
  base.lends = Array.isArray(parsed.lends) ? parsed.lends.map((x) => ({ day: safeInt(x.day, 0), amount: safeInt(x.amount, 0) })).filter((x) => x.day > 0 && x.amount > 0) : [];
  base.borrows = Array.isArray(parsed.borrows) ? parsed.borrows.map((x) => ({ day: safeInt(x.day, 0), amount: safeInt(x.amount, 0) })).filter((x) => x.day > 0 && x.amount > 0) : [];
  base.investResults = Array.isArray(parsed.investResults) ? parsed.investResults.slice(-30) : [];
  base.actionLogs = Array.isArray(parsed.actionLogs) ? parsed.actionLogs.slice(-40) : [];
  base.tired = Boolean(parsed.tired);
  return base;
}

function saveForestLifeState(state) {
  if (!safeStorage) return;
  safeStorage.setItem(STORAGE_KEYS.state, JSON.stringify(state));
  safeStorage.setItem(STORAGE_KEYS.broughtIn, String(safeInt(state.broughtIn, 0)));
  safeStorage.setItem(STORAGE_KEYS.spent, String(safeInt(state.totalSnackPaid, 0)));
}

function appendLog(state, message) {
  state.actionLogs.unshift(`Day${state.day}: ${message}`);
  state.actionLogs = state.actionLogs.slice(0, 40);
}

function applyDueLendReturns(state) {
  let returned = 0;
  state.lends = state.lends.filter((item) => {
    if (item.day === state.day) {
      returned += item.amount;
      return false;
    }
    return true;
  });
  if (returned > 0) {
    state.hand += returned;
    appendLog(state, `仲間から ${returned}枚 返ってきた（お礼ぶん込み）。`);
  }
}

function applyDueBorrowRepayments(state) {
  let repay = 0;
  state.borrows = state.borrows.filter((item) => {
    if (item.day === state.day) {
      repay += item.amount;
      return false;
    }
    return true;
  });
  if (repay > 0) {
    state.hand -= repay;
    appendLog(state, `倉庫へ ${repay}枚 返した（返す約束）。`);
  }
}

function applyDailySnackCost(state) {
  state.hand -= state.snackCost;
  state.totalSnackPaid += state.snackCost;
  appendLog(state, `動物たちのおやつ代として ${state.snackCost}枚 支払った。`);
}

function endForestLifeGame(state, reason) {
  state.status = "ended";
  state.tired = true;
  appendLog(state, reason);
  saveForestLifeState(state);
}

function beginDay(state) {
  if (state.status !== "playing") return;
  state.day += 1;
  state.actionsLeft = ACTIONS_PER_DAY;
  state.tired = false;
  applyDueLendReturns(state);
  applyDueBorrowRepayments(state);
  applyDailySnackCost(state);
  if (state.hand <= 0) {
    endForestLifeGame(state, "クッキーが尽きた。静かな夜が来る。");
    return;
  }
  appendLog(state, "今日もなんとか朝を迎えた。");
}

function consumeAction(state) {
  state.actionsLeft = Math.max(0, state.actionsLeft - 1);
  endDayIfExhausted(state);
}

function doLend(state) {
  if (state.hand < 3 || state.status !== "playing" || state.actionsLeft <= 0) return;
  state.hand -= 3;
  state.lends.push({ day: state.day + 2, amount: 4 });
  appendLog(state, "仲間に3枚あずけた。2日後に4枚戻る約束。");
  consumeAction(state);
}

function doBorrow(state) {
  if (state.status !== "playing" || state.actionsLeft <= 0) return;
  state.hand += 5;
  state.borrows.push({ day: state.day + 1, amount: 6 });
  appendLog(state, "倉庫から5枚前借り。明日6枚返す約束。");
  consumeAction(state);
}

function doInvest(state) {
  if (state.hand < 4 || state.status !== "playing" || state.actionsLeft <= 0) return;
  state.hand -= 4;
  const success = Math.random() < 0.55;
  const gain = success ? 7 : 0;
  state.hand += gain;
  const msg = success ? "畑が実った。7枚になった。" : "畑は沈黙した。戻りは0枚。";
  state.investResults.unshift(`Day${state.day}: ${msg}`);
  state.investResults = state.investResults.slice(0, 30);
  appendLog(state, `投資: ${msg}`);
  consumeAction(state);
}

function endDayIfExhausted(state) {
  if (state.actionsLeft === 0) {
    state.tired = true;
  }
}

function renderList(listEl, rows, emptyText) {
  listEl.innerHTML = "";
  if (rows.length === 0) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    listEl.appendChild(li);
    return;
  }
  rows.forEach((row) => {
    const li = document.createElement("li");
    li.textContent = row;
    listEl.appendChild(li);
  });
}

function renderForestLife() {
  const state = loadForestLifeState();
  const balance = loadCookieBalance();
  dom.balanceEl.textContent = `現在のフォレストクッキー残高: ${balance}`;

  dom.startScreen.hidden = state.status !== "idle";
  dom.gameScreen.hidden = state.status !== "playing";
  dom.resultScreen.hidden = state.status !== "ended";

  if (state.status === "playing") {
    dom.dayEl.textContent = `現在の日数: ${state.day}日目`;
    dom.statusEl.textContent = `手持ちクッキー: ${Math.max(0, state.hand)}`;
    dom.snackCostEl.textContent = `今日のおやつ代: ${state.snackCost}枚`;
    dom.actionsLeftEl.textContent = `今日の残り行動回数: ${state.actionsLeft}回`;
    dom.animalsEl.textContent = `おやつを待つ動物たち: ${state.animals}匹`;
    dom.dayStatusEl.textContent = state.actionsLeft === 0
      ? "今日はもうくたくたです。明日にしましょう。"
      : "森は静かです。次の行動を選んでください。";
    const disabledByTurn = state.actionsLeft <= 0;
    dom.lendButton.disabled = disabledByTurn || state.hand < 3;
    dom.borrowButton.disabled = disabledByTurn;
    dom.investButton.disabled = disabledByTurn || state.hand < 4;
    dom.nextDayButton.disabled = !state.tired;

    renderList(dom.lendList, state.lends.map((x) => `${x.day}日目に ${x.amount}枚 返却予定`), "予約中の貸付はありません。");
    renderList(dom.borrowList, state.borrows.map((x) => `${x.day}日目に ${x.amount}枚 返済予定`), "返済予定の借り入れはありません。");
    renderList(dom.investLog, state.investResults, "投資ログはまだありません。");
    renderList(dom.actionLog, state.actionLogs, "行動ログはまだありません。");
  }

  if (state.status === "ended") {
    const lendSum = state.lends.reduce((a, b) => a + b.amount, 0);
    const borrowSum = state.borrows.reduce((a, b) => a + b.amount, 0);
    dom.resultTitle.textContent = `森で${state.day}日分のおやつをまかなえました`;
    dom.resultBroughtIn.textContent = `持ち込んだクッキー数: ${state.broughtIn}`;
    dom.resultDay.textContent = `最終日数: ${state.day}`;
    dom.resultBalance.textContent = `最後の手持ちクッキー: ${Math.max(0, state.hand)}`;
    dom.resultLending.textContent = `貸付中だったクッキー数: ${lendSum}`;
    dom.resultBorrowing.textContent = `返済予定だったクッキー数: ${borrowSum}`;
  }
}

function startForestLifeGame() {
  const balance = loadCookieBalance();
  const broughtIn = safeInt(dom.broughtInInput.value, 0);
  if (broughtIn <= 0 || broughtIn > balance) return;
  const state = newState();
  state.status = "playing";
  state.broughtIn = broughtIn;
  state.hand = broughtIn;
  saveCookieBalance(balance - broughtIn);
  if (safeStorage) safeStorage.setItem(STORAGE_KEYS.sessionId, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  beginDay(state);
  saveForestLifeState(state);
  renderForestLife();
}

function resetForestLifeGame() {
  const state = newState();
  saveForestLifeState(state);
  if (safeStorage) safeStorage.setItem(STORAGE_KEYS.sessionId, "");
  renderForestLife();
}

function bindAction(fn) {
  return () => {
    const state = loadForestLifeState();
    fn(state);
    if (state.status === "playing" && state.hand <= 0) {
      endForestLifeGame(state, "クッキーが尽きた。静かな夜が来る。");
    }
    saveForestLifeState(state);
    renderForestLife();
  };
}

function stopForestLifeBgm() { if (!forestLifeBgm || !forestLifeBgmToggle) return; forestLifeBgm.pause(); forestLifeBgmToggle.textContent = "BGMを流す"; forestLifeBgmToggle.setAttribute("aria-pressed", "false"); }
function syncForestLifeBgmButton() { if (!forestLifeBgm || !forestLifeBgmToggle) return; forestLifeBgmToggle.textContent = forestLifeBgm.paused ? "BGMを流す" : "BGMを止める"; forestLifeBgmToggle.setAttribute("aria-pressed", forestLifeBgm.paused ? "false" : "true"); }
async function toggleForestLifeBgm() { if (!forestLifeBgm || !forestLifeBgmToggle) return; if (forestLifeBgm.paused) { try { await forestLifeBgm.play(); } catch (_e) {} syncForestLifeBgmButton(); return; } stopForestLifeBgm(); }

safeStorage = initStorage();
if (safeStorage && !safeStorage.getItem(STORAGE_KEYS.state)) saveForestLifeState(newState());
renderForestLife();

dom.startButton.addEventListener("click", startForestLifeGame);
dom.lendButton.addEventListener("click", bindAction(doLend));
dom.borrowButton.addEventListener("click", bindAction(doBorrow));
dom.investButton.addEventListener("click", bindAction(doInvest));
dom.nextDayButton.addEventListener("click", () => { const state = loadForestLifeState(); if (state.status !== "playing" || !state.tired) return; beginDay(state); saveForestLifeState(state); renderForestLife(); });
dom.retryButton.addEventListener("click", resetForestLifeGame);
dom.finishButton.addEventListener("click", () => { window.location.href = "index.html"; });

forestLifeBgm = document.getElementById("forest-life-bgm");
forestLifeBgmToggle = document.getElementById("forest-life-bgm-toggle");
if (forestLifeBgm) forestLifeBgm.volume = 0.35;
if (forestLifeBgmToggle) { forestLifeBgmToggle.addEventListener("click", toggleForestLifeBgm); syncForestLifeBgmButton(); }
