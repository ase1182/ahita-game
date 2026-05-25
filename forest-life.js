const STORAGE_KEYS = {
  balance: "ahita.cookies.balance",
  sessionId: "ahita.forestlife.sessionId",
  broughtIn: "ahita.forestlife.broughtIn",
  spent: "ahita.forestlife.spent",
  state: "ahita.forestlife.state"
};

const SNACK_COST_PER_ANIMAL = 1;
const ACTIONS_PER_DAY = 2;

const PLANS = {
  lend: [
    { id: "lend-small", unlockDay: 1, cost: 3, dueDays: 2, returnAmount: 4, label: "3枚あずける / 2日後に4枚" },
    { id: "lend-mid", unlockDay: 5, cost: 5, dueDays: 5, returnAmount: 8, label: "5枚あずける / 5日後に8枚" },
    { id: "lend-large", unlockDay: 10, cost: 8, dueDays: 10, returnAmount: 15, label: "8枚あずける / 10日後に15枚" }
  ],
  borrow: [
    { id: "borrow-small", unlockDay: 1, gain: 4, dueDays: 2, repayAmount: 5, label: "今すぐ4枚 / 2日後に5枚返す" },
    { id: "borrow-mid", unlockDay: 5, gain: 7, dueDays: 5, repayAmount: 10, label: "今すぐ7枚 / 5日後に10枚返す" },
    { id: "borrow-large", unlockDay: 10, gain: 12, dueDays: 10, repayAmount: 19, label: "今すぐ12枚 / 10日後に19枚返す" }
  ],
  invest: [
    { id: "invest-field", unlockDay: 1, type: "instant", cost: 4, label: "小さな畑 / 4枚使う / 55%で7枚、45%で0枚" },
    { id: "invest-safe", unlockDay: 5, type: "delayed", cost: 5, dueDays: 3, returnAmount: 6, label: "堅いどんぐり箱 / 5枚使う / 3日後に6枚" },
    { id: "invest-expand", unlockDay: 10, type: "instant", cost: 6, label: "森の畑を広げる / 6枚使う / 45%で12枚、55%で2枚" }
  ]
};

const dom = {
  startScreen: document.getElementById("forest-life-start-screen"), gameScreen: document.getElementById("forest-life-game-screen"), resultScreen: document.getElementById("forest-life-result-screen"),
  balanceEl: document.getElementById("forest-balance"), broughtInInput: document.getElementById("brought-in-input"), startButton: document.getElementById("start-forest-session"),
  dayEl: document.getElementById("forest-day"), statusEl: document.getElementById("forest-session-status"), snackCostEl: document.getElementById("forest-snack-cost"), actionsLeftEl: document.getElementById("forest-actions-left"), animalsEl: document.getElementById("forest-animals"), dayStatusEl: document.getElementById("forest-day-status"),
  lendButton: document.getElementById("forest-lend-button"), borrowButton: document.getElementById("forest-borrow-button"), investButton: document.getElementById("forest-invest-button"), nextDayButton: document.getElementById("forest-next-day-button"), finishButton: document.getElementById("finish-forest-session"),
  lendList: document.getElementById("forest-lend-list"), borrowList: document.getElementById("forest-borrow-list"), investLog: document.getElementById("forest-invest-log"), actionLog: document.getElementById("forest-action-log"),
  actionPlanPanel: document.getElementById("forest-action-plan-panel"), actionPlanTitle: document.getElementById("forest-action-plan-title"), actionPlanList: document.getElementById("forest-action-plan-list"), closePlanPanelButton: document.getElementById("forest-close-plan-panel"),
  resultTitle: document.getElementById("forest-result-title"), resultBroughtIn: document.getElementById("forest-result-brought-in"), resultDay: document.getElementById("forest-result-day"), resultBalance: document.getElementById("forest-result-balance"), resultLending: document.getElementById("forest-result-lending"), resultBorrowing: document.getElementById("forest-result-borrowing"), retryButton: document.getElementById("forest-retry-button")
};
let safeStorage = null, forestLifeBgm = null, forestLifeBgmToggle = null, selectedActionCategory = null;
const safeInt=(v,f=0)=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.floor(n)):f;};
const initStorage=()=>{try{localStorage.setItem("__k","1");localStorage.removeItem("__k");return localStorage;}catch{return null;}};
const loadCookieBalance=()=>safeStorage?safeInt(safeStorage.getItem(STORAGE_KEYS.balance),0):0;
const saveCookieBalance=(v)=>safeStorage&&safeStorage.setItem(STORAGE_KEYS.balance,String(safeInt(v,0)));
const getDailySnackCost=(state)=>Math.max(1,safeInt(state?.animals,3))*SNACK_COST_PER_ANIMAL;
const getTodayIncomingAmount=(state)=>[...state.lends,...state.investReturns].filter((x)=>x.day===state.day).reduce((a,b)=>a+safeInt(b.amount,0),0);
const newState=()=>({status:"idle",day:0,broughtIn:0,hand:0,totalSnackPaid:0,actionsLeft:ACTIONS_PER_DAY,animals:3,lends:[],borrows:[],investReturns:[],investResults:[],actionLogs:[],tired:false,lastDayIncoming:0});
function loadForestLifeState(){if(!safeStorage)return newState();let p=null;try{p=JSON.parse(safeStorage.getItem(STORAGE_KEYS.state)||"null");}catch{}const b=newState();if(!p||typeof p!=="object")return b;Object.assign(b,{status:["playing","ended"].includes(p.status)?p.status:"idle",day:safeInt(p.day,0),broughtIn:safeInt(p.broughtIn,0),hand:safeInt(p.hand,0),totalSnackPaid:safeInt(p.totalSnackPaid,0),actionsLeft:Math.min(ACTIONS_PER_DAY,safeInt(p.actionsLeft,ACTIONS_PER_DAY)),animals:Math.max(1,safeInt(p.animals,3)),tired:Boolean(p.tired),lastDayIncoming:safeInt(p.lastDayIncoming,0)});
 b.lends=Array.isArray(p.lends)?p.lends.map(x=>({day:safeInt(x.day,0),amount:safeInt(x.amount,0)})).filter(x=>x.day>0&&x.amount>0):[];
 b.borrows=Array.isArray(p.borrows)?p.borrows.map(x=>({day:safeInt(x.day,0),amount:safeInt(x.amount,0)})).filter(x=>x.day>0&&x.amount>0):[];
 b.investReturns=Array.isArray(p.investReturns)?p.investReturns.map(x=>({day:safeInt(x.day,0),amount:safeInt(x.amount,0)})).filter(x=>x.day>0&&x.amount>0):[];
 b.investResults=Array.isArray(p.investResults)?p.investResults.slice(-30):[]; b.actionLogs=Array.isArray(p.actionLogs)?p.actionLogs.slice(-40):[]; return b; }
const saveForestLifeState=(s)=>{if(!safeStorage)return;safeStorage.setItem(STORAGE_KEYS.state,JSON.stringify(s));safeStorage.setItem(STORAGE_KEYS.broughtIn,String(safeInt(s.broughtIn,0)));safeStorage.setItem(STORAGE_KEYS.spent,String(safeInt(s.totalSnackPaid,0)));};
const appendLog=(s,m)=>{s.actionLogs.unshift(`Day${s.day}: ${m}`);s.actionLogs=s.actionLogs.slice(0,40);};
function beginDay(s){if(s.status!=="playing")return; s.day+=1;s.actionsLeft=ACTIONS_PER_DAY;s.tired=false;s.lastDayIncoming=getTodayIncomingAmount(s); s.lends=s.lends.filter(i=>i.day!==s.day||(s.hand+=i.amount,appendLog(s,`仲間から ${i.amount}枚 返ってきた。`),false)); s.investReturns=s.investReturns.filter(i=>i.day!==s.day||(s.hand+=i.amount,appendLog(s,`投資の実りで ${i.amount}枚 返ってきた。`),false)); let repay=0;s.borrows=s.borrows.filter(i=>i.day!==s.day||(repay+=i.amount,false)); if(repay){s.hand-=repay;appendLog(s,`倉庫へ ${repay}枚 返した。`);} const snack=getDailySnackCost(s); s.hand-=snack;s.totalSnackPaid+=snack;appendLog(s,`動物たちのおやつ代として ${snack}枚 支払った。`); if(s.hand<=0){s.status="ended";s.tired=true;appendLog(s,"クッキーが尽きた。静かな夜が来る。");return;} appendLog(s,"今日もなんとか朝を迎えた。"); }
const consumeAction=(s)=>{s.actionsLeft=Math.max(0,s.actionsLeft-1);if(s.actionsLeft===0)s.tired=true;};
const getUnlockedPlans=(cat,state)=>PLANS[cat].filter((p)=>state.day>=p.unlockDay);
function doLend(s,id){const p=getUnlockedPlans("lend",s).find(x=>x.id===id);if(!p||s.actionsLeft<=0||s.hand<p.cost)return; s.hand-=p.cost;s.lends.push({day:s.day+p.dueDays,amount:p.returnAmount});appendLog(s,`貸付: ${p.label}`);consumeAction(s);}
function doBorrow(s,id){const p=getUnlockedPlans("borrow",s).find(x=>x.id===id);if(!p||s.actionsLeft<=0)return; s.hand+=p.gain;s.borrows.push({day:s.day+p.dueDays,amount:p.repayAmount});appendLog(s,`前借り: ${p.label}`);consumeAction(s);}
function doInvest(s,id){const p=getUnlockedPlans("invest",s).find(x=>x.id===id);if(!p||s.actionsLeft<=0||s.hand<p.cost)return; s.hand-=p.cost; let msg=""; if(p.id==="invest-field"){const gain=Math.random()<0.55?7:0;s.hand+=gain;msg=`小さな畑の結果: ${gain}枚。`;}
 else if(p.id==="invest-expand"){const gain=Math.random()<0.45?12:2;s.hand+=gain;msg=`森の畑を広げる結果: ${gain}枚。`;}
 else {s.investReturns.push({day:s.day+p.dueDays,amount:p.returnAmount});msg="堅いどんぐり箱に預けた。";} s.investResults.unshift(`Day${s.day}: ${msg}`);s.investResults=s.investResults.slice(0,30);appendLog(s,`投資: ${msg}`);consumeAction(s);}
function renderList(el,rows,empty){el.innerHTML="";if(!rows.length){const li=document.createElement("li");li.textContent=empty;el.appendChild(li);return;}rows.forEach(r=>{const li=document.createElement("li");li.textContent=r;el.appendChild(li);});}
function renderActionPlanPanel(state){if(!dom.actionPlanPanel)return;const disabled=state.actionsLeft<=0||state.status!=="playing";if(!selectedActionCategory||disabled){dom.actionPlanPanel.hidden=true;return;}const titleMap={lend:"どこにあずけますか？",borrow:"どの約束で前借りしますか？",invest:"どこにクッキーを使いますか？"};dom.actionPlanTitle.textContent=titleMap[selectedActionCategory];dom.actionPlanList.innerHTML="";getUnlockedPlans(selectedActionCategory,state).forEach((plan)=>{const b=document.createElement("button");b.type="button";b.textContent=plan.label;b.disabled=disabled||((plan.cost||0)>state.hand);b.addEventListener("click",()=>{const s=loadForestLifeState();if(selectedActionCategory==="lend")doLend(s,plan.id);if(selectedActionCategory==="borrow")doBorrow(s,plan.id);if(selectedActionCategory==="invest")doInvest(s,plan.id);selectedActionCategory=null;if(s.status==="playing"&&s.hand<=0){s.status="ended";s.tired=true;appendLog(s,"クッキーが尽きた。静かな夜が来る。");}saveForestLifeState(s);renderForestLife();});dom.actionPlanList.appendChild(b);});dom.actionPlanPanel.hidden=false;}
function renderForestLife(){const s=loadForestLifeState();dom.balanceEl.textContent=`現在のフォレストクッキー残高: ${loadCookieBalance()}`;dom.startScreen.hidden=s.status!=="idle";dom.gameScreen.hidden=s.status!=="playing";dom.resultScreen.hidden=s.status!=="ended";
if(s.status==="playing"){const snack=getDailySnackCost(s);dom.dayEl.textContent=`現在の日数: ${s.day}日目`;dom.statusEl.textContent=`手持ちクッキー: ${Math.max(0,s.hand)}（今日受け取ったクッキー: +${safeInt(s.lastDayIncoming,0)}）`;dom.snackCostEl.textContent=`今日のおやつ代: ${snack}枚（固定支出予定 / 動物${s.animals}匹 × ${SNACK_COST_PER_ANIMAL}枚）`;dom.actionsLeftEl.textContent=`今日の残り行動回数: ${s.actionsLeft}回`;dom.animalsEl.textContent=`おやつを待つ動物たち: ${s.animals}匹`;dom.dayStatusEl.textContent=s.actionsLeft===0?"今日はもうくたくたです。明日にしましょう。":"森は静かです。次の行動を選んでください。";
const dis=s.actionsLeft<=0;dom.lendButton.disabled=dis||getUnlockedPlans("lend",s).every((p)=>(p.cost||0)>s.hand);dom.borrowButton.disabled=dis;dom.investButton.disabled=dis||getUnlockedPlans("invest",s).every((p)=>(p.cost||0)>s.hand);dom.nextDayButton.disabled=!s.tired;
renderList(dom.lendList,s.lends.map(x=>`${x.day}日目に ${x.amount}枚 返却予定${x.day===s.day?"（今日返ってくる）":`（あと${x.day-s.day}日）`}`),"予約中の貸付はありません。");
renderList(dom.borrowList,s.borrows.map(x=>`${x.day}日目に ${x.amount}枚 返済予定${x.day===s.day?"（今日返す）":`（あと${x.day-s.day}日）`}`),"返済予定の借り入れはありません。");
renderList(dom.investLog,s.investResults,"投資ログはまだありません。");renderList(dom.actionLog,s.actionLogs,"行動ログはまだありません。");renderActionPlanPanel(s);} 
if(s.status==="ended"){dom.resultTitle.textContent=`森で${s.day}日分のおやつをまかなえました`;dom.resultBroughtIn.textContent=`持ち込んだクッキー数: ${s.broughtIn}`;dom.resultDay.textContent=`最終日数: ${s.day}`;dom.resultBalance.textContent=`最後の手持ちクッキー: ${Math.max(0,s.hand)}`;dom.resultLending.textContent=`貸付中だったクッキー数: ${s.lends.reduce((a,b)=>a+b.amount,0)+s.investReturns.reduce((a,b)=>a+b.amount,0)}`;dom.resultBorrowing.textContent=`返済予定だったクッキー数: ${s.borrows.reduce((a,b)=>a+b.amount,0)}`;}}
function startForestLifeGame(){const bal=loadCookieBalance(),inb=safeInt(dom.broughtInInput.value,0);if(inb<=0||inb>bal)return;const s=newState();s.status="playing";s.broughtIn=inb;s.hand=inb;saveCookieBalance(bal-inb);safeStorage&&safeStorage.setItem(STORAGE_KEYS.sessionId,`${Date.now()}-${Math.random().toString(36).slice(2,10)}`);beginDay(s);saveForestLifeState(s);renderForestLife();}
function resetForestLifeGame(){selectedActionCategory=null;const s=newState();saveForestLifeState(s);safeStorage&&safeStorage.setItem(STORAGE_KEYS.sessionId,"");renderForestLife();}
safeStorage=initStorage();if(safeStorage&&!safeStorage.getItem(STORAGE_KEYS.state))saveForestLifeState(newState());renderForestLife();
dom.startButton.addEventListener("click",startForestLifeGame);
dom.lendButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory="lend";renderForestLife();});
dom.borrowButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory="borrow";renderForestLife();});
dom.investButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory="invest";renderForestLife();});
dom.closePlanPanelButton.addEventListener("click",()=>{selectedActionCategory=null;renderForestLife();});
dom.nextDayButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.status!=="playing"||!s.tired)return;selectedActionCategory=null;beginDay(s);saveForestLifeState(s);renderForestLife();});
dom.retryButton.addEventListener("click",resetForestLifeGame);dom.finishButton.addEventListener("click",()=>{window.location.href="index.html"});
forestLifeBgm=document.getElementById("forest-life-bgm");forestLifeBgmToggle=document.getElementById("forest-life-bgm-toggle");if(forestLifeBgm)forestLifeBgm.volume=.35;
function stopForestLifeBgm(){if(!forestLifeBgm||!forestLifeBgmToggle)return;forestLifeBgm.pause();forestLifeBgmToggle.textContent="BGMを流す";forestLifeBgmToggle.setAttribute("aria-pressed","false");}
function syncForestLifeBgmButton(){if(!forestLifeBgm||!forestLifeBgmToggle)return;forestLifeBgmToggle.textContent=forestLifeBgm.paused?"BGMを流す":"BGMを止める";forestLifeBgmToggle.setAttribute("aria-pressed",forestLifeBgm.paused?"false":"true");}
async function toggleForestLifeBgm(){if(!forestLifeBgm||!forestLifeBgmToggle)return;if(forestLifeBgm.paused){try{await forestLifeBgm.play();}catch{}syncForestLifeBgmButton();return;}stopForestLifeBgm();}
forestLifeBgmToggle&&forestLifeBgmToggle.addEventListener("click",toggleForestLifeBgm);syncForestLifeBgmButton();
