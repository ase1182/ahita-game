const STORAGE_KEYS = {
  balance: "ahita.cookies.balance",
  version: "ahita.cookies.version",
  sessionId: "ahita.forestlife.sessionId",
  broughtIn: "ahita.forestlife.broughtIn",
  spent: "ahita.forestlife.spent",
  state: "ahita.forestlife.state"
};

const balanceEl = document.getElementById("forest-balance");
const broughtInInput = document.getElementById("brought-in-input");
const startButton = document.getElementById("start-forest-session");
const statusEl = document.getElementById("forest-session-status");
const spendButton = document.getElementById("spend-one-cookie");
const finishButton = document.getElementById("finish-forest-session");
const backLink = document.getElementById("back-to-ahita-link");

let safeStorage = null;

function initStorage() {
  try {
    const k = "__forest_storage_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return window.localStorage;
  } catch (_e) {
    return null;
  }
}

function readNumber(key, fallback) {
  if (!safeStorage) return fallback;
  const n = Number(safeStorage.getItem(key));
  if (!Number.isFinite(n) || n < 0) {
    safeStorage.setItem(key, String(fallback));
    return fallback;
  }
  return n;
}

function readState() {
  if (!safeStorage) return "aborted";
  const state = safeStorage.getItem(STORAGE_KEYS.state);
  if (state === "active" || state === "finished" || state === "aborted") return state;
  safeStorage.setItem(STORAGE_KEYS.state, "aborted");
  return "aborted";
}

function writeNumber(key, value) { if (safeStorage) safeStorage.setItem(key, String(value)); }

function getSession() {
  return {
    sessionId: safeStorage ? (safeStorage.getItem(STORAGE_KEYS.sessionId) || "") : "",
    broughtIn: readNumber(STORAGE_KEYS.broughtIn, 0),
    spent: readNumber(STORAGE_KEYS.spent, 0),
    state: readState()
  };
}

function updateView() {
  const balance = readNumber(STORAGE_KEYS.balance, 0);
  const session = getSession();
  const hand = Math.max(0, session.broughtIn - session.spent);
  balanceEl.textContent = `現在のフォレストクッキー残高: ${balance}`;
  statusEl.textContent = `現在の手元クッキー: ${hand}（状態: ${session.state}）`;
  const active = session.state === "active";
  spendButton.disabled = !active || hand <= 0;
  startButton.disabled = active;
}

function ensureDefaults() {
  if (!safeStorage) return;
  readNumber(STORAGE_KEYS.version, 1);
  readNumber(STORAGE_KEYS.balance, 0);
  readNumber(STORAGE_KEYS.broughtIn, 0);
  readNumber(STORAGE_KEYS.spent, 0);
  readState();
  if (!safeStorage.getItem(STORAGE_KEYS.sessionId)) safeStorage.setItem(STORAGE_KEYS.sessionId, "");
}

function startSession() {
  if (!safeStorage) return;
  const session = getSession();
  if (session.state === "active") return;
  const balance = readNumber(STORAGE_KEYS.balance, 0);
  const broughtIn = Math.floor(Number(broughtInInput.value));
  if (!Number.isFinite(broughtIn) || broughtIn <= 0 || broughtIn > balance) return;
  writeNumber(STORAGE_KEYS.balance, balance - broughtIn);
  safeStorage.setItem(STORAGE_KEYS.sessionId, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);
  writeNumber(STORAGE_KEYS.broughtIn, broughtIn);
  writeNumber(STORAGE_KEYS.spent, 0);
  safeStorage.setItem(STORAGE_KEYS.state, "active");
  updateView();
}

function spendOne() {
  if (!safeStorage) return;
  const session = getSession();
  if (session.state !== "active") return;
  const nextSpent = Math.min(session.broughtIn, session.spent + 1);
  writeNumber(STORAGE_KEYS.spent, nextSpent);
  if (nextSpent >= session.broughtIn) finishSession();
  updateView();
}

function finishSession() {
  if (!safeStorage) return;
  const session = getSession();
  if (session.state !== "active") return;
  const hand = Math.max(0, session.broughtIn - session.spent);
  const balance = readNumber(STORAGE_KEYS.balance, 0);
  writeNumber(STORAGE_KEYS.balance, balance + hand);
  safeStorage.setItem(STORAGE_KEYS.state, "finished");
  backLink.classList.add("forest-life-back-strong");
  updateView();
}

safeStorage = initStorage();
ensureDefaults();
updateView();
startButton.addEventListener("click", startSession);
spendButton.addEventListener("click", spendOne);
finishButton.addEventListener("click", finishSession);
