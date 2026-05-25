const STORAGE_KEYS = {
  balance: "ahita.cookies.balance",
  sessionId: "ahita.forestlife.sessionId",
  broughtIn: "ahita.forestlife.broughtIn",
  spent: "ahita.forestlife.spent",
  state: "ahita.forestlife.state"
};

const SNACK_COST_PER_ANIMAL = 1;
const ACTIONS_PER_DAY = 2;
const WORK_PLANS = [{ id: "gather_leaves", unlockDay: 1, label: "落ち葉を集める", rewardAmount: 2, display: "+2 / すぐ受け取る" }];

const PLANS = {
  lend: [
    { id: "lend-small", unlockDay: 1, cost: 3, dueDays: 2, returnAmount: 4, shortLabel: "短くあずける", detailLabel: "-3 / 2日後 +4" },
    { id: "lend-mid", unlockDay: 5, cost: 5, dueDays: 5, returnAmount: 8, shortLabel: "しばらくあずける", detailLabel: "-5 / 5日後 +8" },
    { id: "lend-large", unlockDay: 10, cost: 8, dueDays: 10, returnAmount: 15, shortLabel: "長くあずける", detailLabel: "-8 / 10日後 +15" }
  ],
  borrow: [
    { id: "borrow-small", unlockDay: 1, gain: 4, dueDays: 2, repayAmount: 5, shortLabel: "少し前借り", detailLabel: "+4 / 2日後 -5" },
    { id: "borrow-mid", unlockDay: 5, gain: 7, dueDays: 5, repayAmount: 10, shortLabel: "しばらく前借り", detailLabel: "+7 / 5日後 -10" },
    { id: "borrow-large", unlockDay: 10, gain: 12, dueDays: 10, repayAmount: 18, shortLabel: "長く前借り", detailLabel: "+12 / 10日後 -18" }
  ],
  invest: [
    { id: "invest-small", type: "instant_risk", unlockDay: 1, cost: 2, successRate: 0.6, successReturn: 4, failReturn: 0, shortLabel: "小さな話", detailLabel: "-2 / 60%で +4" },
    { id: "invest-mid", type: "instant_risk", unlockDay: 1, cost: 4, successRate: 0.5, successReturn: 8, failReturn: 1, shortLabel: "うまそうな話", detailLabel: "-4 / 50%で +8" },
    { id: "invest-large", type: "instant_risk", unlockDay: 1, cost: 6, successRate: 0.4, successReturn: 14, failReturn: 2, shortLabel: "大きな話", detailLabel: "-6 / 40%で +14" },
    { id: "dividend-panda", type: "dividend_like", unlockDay: 5, cost: 6, dailyDividend: 2, bankruptcyRate: 0.18, shortLabel: "パンダ組合の話", detailLabel: "-6 / 毎日 +2 / 倒産しやすい" },
    { id: "dividend-koguma", type: "dividend_like", unlockDay: 5, cost: 5, dailyDividend: 1, bankruptcyRate: 0.05, shortLabel: "コグマ商会の話", detailLabel: "-5 / 毎日 +1 / 倒産しにくい" }
  ]
};

const dom = {
  startScreen: document.getElementById("forest-life-start-screen"), gameScreen: document.getElementById("forest-life-game-screen"), resultScreen: document.getElementById("forest-life-result-screen"),
  balanceEl: document.getElementById("forest-balance"), broughtInInput: document.getElementById("brought-in-input"), startButton: document.getElementById("start-forest-session"),
  dayEl: document.getElementById("forest-day"), statusEl: document.getElementById("forest-session-status"), snackCostEl: document.getElementById("forest-snack-cost"), actionsLeftEl: document.getElementById("forest-actions-left"), animalsEl: document.getElementById("forest-animals"), dayStatusEl: document.getElementById("forest-day-status"),
  workButton: document.getElementById("forest-work-button"), lendButton: document.getElementById("forest-lend-button"), borrowButton: document.getElementById("forest-borrow-button"), investButton: document.getElementById("forest-invest-button"), nextDayButton: document.getElementById("forest-next-day-button"), finishButton: document.getElementById("finish-forest-session"),
  blackMarketHint: document.getElementById("forest-black-market-hint"), blackMarketButton: document.getElementById("forest-black-market-button"),
  lendList: document.getElementById("forest-lend-list"), borrowList: document.getElementById("forest-borrow-list"), dividendList: document.getElementById("forest-dividend-list"), investLog: document.getElementById("forest-invest-log"), actionLog: document.getElementById("forest-action-log"),
  actionPlanPanel: document.getElementById("forest-action-plan-panel"), actionPlanTitle: document.getElementById("forest-action-plan-title"), actionPlanList: document.getElementById("forest-action-plan-list"), closePlanPanelButton: document.getElementById("forest-close-plan-panel"),
  resultTitle: document.getElementById("forest-result-title"), resultBroughtIn: document.getElementById("forest-result-brought-in"), resultDay: document.getElementById("forest-result-day"), resultBalance: document.getElementById("forest-result-balance"), resultLending: document.getElementById("forest-result-lending"), resultBorrowing: document.getElementById("forest-result-borrowing"), retryButton: document.getElementById("forest-retry-button")
};
let safeStorage = null, forestLifeBgm = null, forestLifeBgmToggle = null, selectedActionCategory = null;
const safeInt=(v,f=0)=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.floor(n)):f;};
const initStorage=()=>{try{localStorage.setItem("__k","1");localStorage.removeItem("__k");return localStorage;}catch{return null;}};
const loadCookieBalance=()=>safeStorage?safeInt(safeStorage.getItem(STORAGE_KEYS.balance),0):0;
const saveCookieBalance=(v)=>safeStorage&&safeStorage.setItem(STORAGE_KEYS.balance,String(safeInt(v,0)));
const getAnimalsForDay=(day)=>Math.max(1,1+Math.floor((Math.max(1,safeInt(day,1))-1)/3));
const getDailySnackCost=(state)=>getAnimalsForDay(state?.day)*SNACK_COST_PER_ANIMAL;
const getTodayIncomingAmount=(state)=>[...state.lends,...state.investReturns].filter((x)=>x.day===state.day).reduce((a,b)=>a+safeInt(b.amount,0),0);
const getTodayRepaymentAmount=(state)=>state.borrows.filter((x)=>x.day===state.day).reduce((a,b)=>a+safeInt(b.amount,0),0);
const getExpectedDividendIncome=(state)=>Array.isArray(state?.dividendInvestments)?state.dividendInvestments.reduce((sum,x)=>sum+safeInt(x.dailyDividend,0),0):0;
const newState=()=>({version:2,status:"idle",day:0,broughtIn:0,hand:0,totalSnackPaid:0,actionsLeft:ACTIONS_PER_DAY,animals:1,lends:[],borrows:[],investReturns:[],dividendInvestments:[],investResults:[],actionLogs:[],tired:false,lastDayIncoming:0,lastDayRepay:0});
function loadForestLifeState(){if(!safeStorage)return newState();let p=null;try{p=JSON.parse(safeStorage.getItem(STORAGE_KEYS.state)||"null");}catch{}const b=newState();if(!p||typeof p!=="object")return b;Object.assign(b,{version:2,status:["playing","ended"].includes(p.status)?p.status:"idle",day:safeInt(p.day,0),broughtIn:safeInt(p.broughtIn,0),hand:safeInt(p.hand,0),totalSnackPaid:safeInt(p.totalSnackPaid,0),actionsLeft:Math.min(ACTIONS_PER_DAY,safeInt(p.actionsLeft,ACTIONS_PER_DAY)),tired:Boolean(p.tired),lastDayIncoming:safeInt(p.lastDayIncoming,0),lastDayRepay:safeInt(p.lastDayRepay,0)});
 b.animals=getAnimalsForDay(Math.max(1,b.day||1));
 b.lends=Array.isArray(p.lends)?p.lends.map(x=>({day:safeInt(x.day,0),amount:safeInt(x.amount,0)})).filter(x=>x.day>0&&x.amount>0):[];
 b.borrows=Array.isArray(p.borrows)?p.borrows.map(x=>({day:safeInt(x.day,0),amount:safeInt(x.amount,0)})).filter(x=>x.day>0&&x.amount>0):[];
 b.investReturns=Array.isArray(p.investReturns)?p.investReturns.map(x=>({day:safeInt(x.day,0),amount:safeInt(x.amount,0)})).filter(x=>x.day>0&&x.amount>0):[];
 b.dividendInvestments=Array.isArray(p.dividendInvestments)?p.dividendInvestments.map(x=>({id:String(x.id||""),label:String(x.label||""),dailyDividend:safeInt(x.dailyDividend,0),bankruptcyRate:Number(x.bankruptcyRate)||0,riskLabel:String(x.riskLabel||"")})).filter(x=>x.id&&x.dailyDividend>0):[];
 b.investResults=Array.isArray(p.investResults)?p.investResults.slice(-30):[]; b.actionLogs=Array.isArray(p.actionLogs)?p.actionLogs.slice(-40):[]; return b; }
const saveForestLifeState=(s)=>{if(!safeStorage)return;safeStorage.setItem(STORAGE_KEYS.state,JSON.stringify(s));safeStorage.setItem(STORAGE_KEYS.broughtIn,String(safeInt(s.broughtIn,0)));safeStorage.setItem(STORAGE_KEYS.spent,String(safeInt(s.totalSnackPaid,0)));};
const appendLog=(s,m)=>{s.actionLogs.unshift(`Day${s.day}: ${m}`);s.actionLogs=s.actionLogs.slice(0,40);};
function applyDividendInvestments(s){if(!Array.isArray(s.dividendInvestments))s.dividendInvestments=[];s.dividendInvestments=s.dividendInvestments.filter((inv)=>{if(Math.random()<Number(inv.bankruptcyRate||0)){appendLog(s,`${inv.label}は${inv.id==="dividend-panda"?"朝にはもう看板を下ろしていました":"静かに店じまいしていました"}。配当は止まりました。`);return false;}s.hand+=safeInt(inv.dailyDividend,0);appendLog(s,`${inv.label}から配当として${safeInt(inv.dailyDividend,0)}枚届きました。`);return true;});}
function beginDay(s){if(s.status!=="playing")return; s.day+=1;s.actionsLeft=ACTIONS_PER_DAY;s.tired=false;const beforeAnimals=s.animals;s.animals=getAnimalsForDay(s.day);s.lastDayIncoming=getTodayIncomingAmount(s)+getExpectedDividendIncome(s);s.lastDayRepay=getTodayRepaymentAmount(s);if(beforeAnimals>0&&s.animals>beforeAnimals)appendLog(s,`おやつを待つ動物が増えました。今日から${s.animals}匹です。`); s.lends=s.lends.filter(i=>i.day!==s.day||(s.hand+=i.amount,appendLog(s,`今日受け取った: +${i.amount}`),false)); let repay=0;s.borrows=s.borrows.filter(i=>i.day!==s.day||(repay+=i.amount,false)); if(repay){s.hand-=repay;appendLog(s,`今日返した: -${repay}`);} s.investReturns=s.investReturns.filter(i=>i.day!==s.day||(s.hand+=i.amount,appendLog(s,`今日受け取った: +${i.amount}`),false)); applyDividendInvestments(s); const snack=getDailySnackCost(s); s.hand-=snack;s.totalSnackPaid+=snack;appendLog(s,`今日のおやつ代として${snack}枚使いました。`); if(s.hand<=0){s.status="ended";s.tired=true;appendLog(s,"クッキーが尽きた。静かな夜が来る。");return;} if(s.day===5)appendLog(s,"新しい投資の話が増えました。"); if(s.day===10)appendLog(s,"森の奥に、夜だけ開く市場があるらしい。"); appendLog(s,"今日もなんとか朝を迎えた。"); }
const consumeAction=(s)=>{s.actionsLeft=Math.max(0,s.actionsLeft-1);if(s.actionsLeft===0)s.tired=true;};
const getUnlockedPlans=(cat,state)=>PLANS[cat].filter((p)=>state.day>=p.unlockDay);
const getUnlockedWorkPlans=(state)=>WORK_PLANS.filter((p)=>state.day>=p.unlockDay);
function doWork(s){const plan=getUnlockedWorkPlans(s)[0];if(!plan||s.actionsLeft<=0)return; s.hand+=plan.rewardAmount;appendLog(s,"森で働いて、クッキーを2枚受け取りました。");consumeAction(s);}
function doLend(s,id){const p=getUnlockedPlans("lend",s).find(x=>x.id===id);if(!p||s.actionsLeft<=0||s.hand<p.cost)return; s.hand-=p.cost;s.lends.push({day:s.day+p.dueDays,amount:p.returnAmount});appendLog(s,`${p.cost}枚を森の仲間にあずけました。${p.dueDays}日後に${p.returnAmount}枚で返ってきます。`);consumeAction(s);}
function doBorrow(s,id){const p=getUnlockedPlans("borrow",s).find(x=>x.id===id);if(!p||s.actionsLeft<=0)return; s.hand+=p.gain;s.borrows.push({day:s.day+p.dueDays,amount:p.repayAmount});appendLog(s,`森の倉庫から${p.gain}枚を前借りしました。${p.dueDays}日後に${p.repayAmount}枚返します。`);consumeAction(s);}
function doDividendInvestment(s,id){const p=getUnlockedPlans("invest",s).find(x=>x.id===id&&x.type==="dividend_like");if(!p||s.actionsLeft<=0||s.hand<p.cost)return; s.hand-=p.cost;s.dividendInvestments.push({id:p.id,label:p.shortLabel.replace("の話",""),dailyDividend:p.dailyDividend,bankruptcyRate:p.bankruptcyRate,riskLabel:p.id==="dividend-panda"?"倒産しやすい":"倒産しにくい"});appendLog(s,p.id==="dividend-panda"?"パンダ組合の話に6枚使いました。続くかぎり、毎日2枚の配当があります。":"コグマ商会の話に5枚使いました。続くかぎり、毎日1枚の配当があります。");consumeAction(s);}
function doInvest(s,id){const p=getUnlockedPlans("invest",s).find(x=>x.id===id);if(!p||s.actionsLeft<=0||s.hand<p.cost)return; if(p.type==="dividend_like"){doDividendInvestment(s,id);return;} s.hand-=p.cost;const success=Math.random()<p.successRate;const gain=success?p.successReturn:p.failReturn;s.hand+=gain;let msg="";if(success){msg=`あやしいクマさんの話は当たりでした。${p.cost}枚が${gain}枚になりました。`;}else if(gain>0){msg=`あやしいクマさんの話は外れましたが、${gain}枚だけ戻ってきました。`;}else{msg=`あやしいクマさんの話は外れました。${p.cost}枚は戻ってきませんでした。`;} s.investResults.unshift(`Day${s.day}: ${msg}`);s.investResults=s.investResults.slice(0,30);appendLog(s,msg);consumeAction(s);}
function renderDividendInvestments(s){const grouped=s.dividendInvestments.reduce((acc,x)=>{acc[x.id]=acc[x.id]||{label:x.label,count:0,daily:0,risk:x.riskLabel};acc[x.id].count+=1;acc[x.id].daily+=safeInt(x.dailyDividend,0);return acc;},{});const rows=Object.values(grouped).map((g)=>`${g.label} ×${g.count}: 毎日 +${g.daily} / ${g.risk}`);renderList(dom.dividendList,rows,"配当中の話はありません。");}
function handleBlackMarketClick(){const s=loadForestLifeState();appendLog(s,"入口は見えますが、今日はまだ入れません。");saveForestLifeState(s);renderForestLife();}
function renderBlackMarketHint(s){if(!dom.blackMarketHint)return;dom.blackMarketHint.hidden=s.day<10||s.status!=="playing";}
function renderList(el,rows,empty){el.innerHTML="";if(!rows.length){const li=document.createElement("li");li.textContent=empty;el.appendChild(li);return;}rows.forEach(r=>{const li=document.createElement("li");li.textContent=r;el.appendChild(li);});}
function renderActionPlanPanel(state){if(!dom.actionPlanPanel)return;const disabled=state.actionsLeft<=0||state.status!=="playing";if(!selectedActionCategory||disabled){dom.actionPlanPanel.hidden=true;return;}const titleMap={lend:"森の仲間にあずける（貸付）",borrow:"森の倉庫から前借りする（借り入れ）",invest:"あやしいクマさんの話を聞く（投資）"};dom.actionPlanTitle.textContent=titleMap[selectedActionCategory];dom.actionPlanList.innerHTML="";getUnlockedPlans(selectedActionCategory,state).forEach((plan)=>{const b=document.createElement("button");b.type="button";b.innerHTML=`<span class="label-main">${plan.shortLabel}</span><span class="label-sub">${plan.detailLabel}</span>`;b.disabled=disabled||((plan.cost||0)>state.hand);b.addEventListener("click",()=>{const s=loadForestLifeState();if(selectedActionCategory==="lend")doLend(s,plan.id);if(selectedActionCategory==="borrow")doBorrow(s,plan.id);if(selectedActionCategory==="invest")doInvest(s,plan.id);selectedActionCategory=null;if(s.status==="playing"&&s.hand<=0){s.status="ended";s.tired=true;appendLog(s,"クッキーが尽きた。静かな夜が来る。");}saveForestLifeState(s);renderForestLife();});dom.actionPlanList.appendChild(b);});dom.actionPlanPanel.hidden=false;}
function renderForestLife(){const s=loadForestLifeState();dom.balanceEl.textContent=`現在のフォレストクッキー残高: ${loadCookieBalance()}`;dom.startScreen.hidden=s.status!=="idle";dom.gameScreen.hidden=s.status!=="playing";dom.resultScreen.hidden=s.status!=="ended";
if(s.status==="playing"){if(!Array.isArray(s.dividendInvestments))s.dividendInvestments=[];s.animals=getAnimalsForDay(s.day);const snack=getDailySnackCost(s),todayIncome=getTodayIncomingAmount(s)+getExpectedDividendIncome(s),todayRepay=getTodayRepaymentAmount(s);dom.dayEl.textContent=`現在の日数: ${s.day}日目`;dom.statusEl.textContent=`手持ちクッキー: ${Math.max(0,s.hand)}（今日の収入予定: +${todayIncome}予定 / 今日の返済予定: -${todayRepay}）`;dom.snackCostEl.textContent=`今日のおやつ代: ${snack}枚（動物${s.animals}匹 × ${SNACK_COST_PER_ANIMAL}枚）`;dom.actionsLeftEl.textContent=`今日の残り行動回数: ${s.actionsLeft}回`;dom.animalsEl.textContent=`おやつを待つ動物たち: ${s.animals}匹`;dom.dayStatusEl.textContent=s.actionsLeft===0?"今日はもうくたくたです。明日にしましょう。":"森は静かです。次の行動を選んでください。";
const dis=s.actionsLeft<=0;dom.workButton.disabled=dis||getUnlockedWorkPlans(s).length===0;dom.lendButton.disabled=dis||getUnlockedPlans("lend",s).every((p)=>(p.cost||0)>s.hand);dom.borrowButton.disabled=dis;dom.investButton.disabled=dis||getUnlockedPlans("invest",s).every((p)=>(p.cost||0)>s.hand);dom.nextDayButton.disabled=!s.tired;
renderList(dom.lendList,s.lends.map(x=>`${x.day}日目に ${x.amount}枚 返却予定${x.day===s.day?"（今日返ってくる）":`（あと${x.day-s.day}日）`}`),"予約中の貸付はありません。");
renderList(dom.borrowList,s.borrows.map(x=>`${x.day}日目に ${x.amount}枚 返済予定${x.day===s.day?"（今日返す）":`（あと${x.day-s.day}日）`}`),"返済予定の借り入れはありません。");
renderDividendInvestments(s);renderBlackMarketHint(s);
renderList(dom.investLog,s.investResults,"投資ログはまだありません。");renderList(dom.actionLog,s.actionLogs,"行動ログはまだありません。");renderActionPlanPanel(s);} 
if(s.status==="ended"){dom.resultTitle.textContent=`森で${s.day}日分のおやつをまかなえました`;dom.resultBroughtIn.textContent=`持ち込んだクッキー数: ${s.broughtIn}`;dom.resultDay.textContent=`最終日数: ${s.day}`;dom.resultBalance.textContent=`最後の手持ちクッキー: ${Math.max(0,s.hand)}`;dom.resultLending.textContent=`貸付中だったクッキー数: ${s.lends.reduce((a,b)=>a+b.amount,0)+s.investReturns.reduce((a,b)=>a+b.amount,0)}`;dom.resultBorrowing.textContent=`返済予定だったクッキー数: ${s.borrows.reduce((a,b)=>a+b.amount,0)}`;}}
function startForestLifeGame(){const bal=loadCookieBalance(),inb=safeInt(dom.broughtInInput.value,0);if(inb<=0||inb>bal)return;const s=newState();s.status="playing";s.broughtIn=inb;s.hand=inb;saveCookieBalance(bal-inb);safeStorage&&safeStorage.setItem(STORAGE_KEYS.sessionId,`${Date.now()}-${Math.random().toString(36).slice(2,10)}`);beginDay(s);saveForestLifeState(s);renderForestLife();}
function resetForestLifeGame(){selectedActionCategory=null;const s=newState();saveForestLifeState(s);safeStorage&&safeStorage.setItem(STORAGE_KEYS.sessionId,"");renderForestLife();}
safeStorage=initStorage();if(safeStorage&&!safeStorage.getItem(STORAGE_KEYS.state))saveForestLifeState(newState());renderForestLife();
dom.startButton.addEventListener("click",startForestLifeGame);
dom.workButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory=null;doWork(s);if(s.status==="playing"&&s.hand<=0){s.status="ended";s.tired=true;appendLog(s,"クッキーが尽きた。静かな夜が来る。");}saveForestLifeState(s);renderForestLife();});
dom.lendButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory="lend";renderForestLife();});
dom.borrowButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory="borrow";renderForestLife();});
dom.investButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.actionsLeft<=0)return;selectedActionCategory="invest";renderForestLife();});
dom.closePlanPanelButton.addEventListener("click",()=>{selectedActionCategory=null;renderForestLife();});
dom.blackMarketButton&&dom.blackMarketButton.addEventListener("click",handleBlackMarketClick);
dom.nextDayButton.addEventListener("click",()=>{const s=loadForestLifeState();if(s.status!=="playing"||!s.tired)return;selectedActionCategory=null;beginDay(s);saveForestLifeState(s);renderForestLife();});
dom.retryButton.addEventListener("click",resetForestLifeGame);dom.finishButton.addEventListener("click",()=>{window.location.href="index.html"});
forestLifeBgm=document.getElementById("forest-life-bgm");forestLifeBgmToggle=document.getElementById("forest-life-bgm-toggle");if(forestLifeBgm)forestLifeBgm.volume=.35;
function stopForestLifeBgm(){if(!forestLifeBgm||!forestLifeBgmToggle)return;forestLifeBgm.pause();forestLifeBgmToggle.textContent="BGMを流す";forestLifeBgmToggle.setAttribute("aria-pressed","false");}
function syncForestLifeBgmButton(){if(!forestLifeBgm||!forestLifeBgmToggle)return;forestLifeBgmToggle.textContent=forestLifeBgm.paused?"BGMを流す":"BGMを止める";forestLifeBgmToggle.setAttribute("aria-pressed",forestLifeBgm.paused?"false":"true");}
async function toggleForestLifeBgm(){if(!forestLifeBgm||!forestLifeBgmToggle)return;if(forestLifeBgm.paused){try{await forestLifeBgm.play();}catch{}syncForestLifeBgmButton();return;}stopForestLifeBgm();}
forestLifeBgmToggle&&forestLifeBgmToggle.addEventListener("click",toggleForestLifeBgm);syncForestLifeBgmButton();
