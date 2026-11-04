const CONTENT = window.GAME_CONTENT;
const SAVE_KEY = "world-end-store-chapter-one-v5";
const SETTINGS_KEY = "world-end-store-settings-v1";
const DEFAULT_SETTINGS = {
  master: 0.8,
  bgm: 0.55,
  sfx: 0.7,
  muted: false,
  textSpeed: "normal"
};
const SHIFT_LENGTH = CONTENT.shiftLength;
const products = CONTENT.products;
const fallbackShelf = ["umbrella", "coffee", "lunchbox"];
const emptyStock = Object.fromEntries(Object.keys(products).map((key) => [key, 0]));
const dialogIds = [
  "intro-dialog",
  "finale-dialog",
  "trade-dialog",
  "interlude-dialog",
  "item-dialog",
  "closing-dialog",
  "summary-dialog",
  "memory-dialog",
  "nav-dialog",
  "new-game-dialog",
  "help-dialog",
  "achievement-dialog"
];

let toastTimer;
let audioUnlocked = false;
let state = loadState();
let settings = loadSettings();
let prologueIndex = 0;
let prologueBranch = null;
let typeTimer;
let typeComplete = false;
let currentPrologueText = "";
let prologueLines = [];
let prologueLineIndex = 0;
let finaleSteps = [];
let finaleIndex = 0;
let finaleChoice = null;
let finaleMode = "finale";
let finaleTimer;
let finaleTypeComplete = false;
let finaleCurrentText = "";
const vnHistory = [];

const elements = {
  titleScreen: document.querySelector("#title-screen"),
  newGameButton: document.querySelector("#new-game-button"),
  newGameMeta: document.querySelector("#new-game-meta"),
  continueGameButton: document.querySelector("#continue-game-button"),
  continueGameLabel: document.querySelector("#continue-game-label"),
  continueGameMeta: document.querySelector("#continue-game-meta"),
  vnStage: document.querySelector("#vn-stage"),
  vnSceneLabel: document.querySelector("#vn-scene-label"),
  vnCharacter: document.querySelector("#vn-character"),
  vnCharacterInitial: document.querySelector("#vn-character-initial"),
  vnCharacterRole: document.querySelector("#vn-character-role"),
  vnCharacterPortrait: document.querySelector("#vn-character-portrait"),
  vnSpeaker: document.querySelector("#vn-speaker"),
  vnHint: document.querySelector("#vn-hint"),
  vnText: document.querySelector("#vn-text"),
  vnNext: document.querySelector("#vn-next"),
  vnTips: document.querySelector("#vn-tips"),
  vnChoices: document.querySelector("#vn-choices"),
  vnDialogue: document.querySelector("#vn-dialogue"),
  vnHistory: document.querySelector("#vn-history"),
  vnSettings: document.querySelector("#vn-settings"),
  vnSkip: document.querySelector("#vn-skip"),
  startShift: document.querySelector("#start-shift"),
  finaleDialog: document.querySelector("#finale-dialog"),
  finaleDialogue: document.querySelector("#finale-dialogue"),
  finaleStage: document.querySelector("#finale-stage"),
  finaleSpeaker: document.querySelector("#finale-speaker"),
  finaleHint: document.querySelector("#finale-hint"),
  finaleText: document.querySelector("#finale-text"),
  finaleNext: document.querySelector("#finale-next"),
  finaleContinue: document.querySelector("#finale-continue"),
  finaleCharacter: document.querySelector("#finale-character"),
  finaleCharacterInitial: document.querySelector("#finale-character-initial"),
  finaleCharacterRole: document.querySelector("#finale-character-role"),
  finaleCharacterPortrait: document.querySelector("#finale-character-portrait"),
  finaleSceneLabel: document.querySelector("#finale-scene-label"),
  interludeDialog: document.querySelector("#interlude-dialog"),
  interludeTitle: document.querySelector("#interlude-title"),
  interludeBody: document.querySelector("#interlude-body"),
  historyDialog: document.querySelector("#history-dialog"),
  historyList: document.querySelector("#history-list"),
  characterDialog: document.querySelector("#character-dialog"),
  characterList: document.querySelector("#character-list"),
  characterNavCount: document.querySelector("#character-nav-count"),
  settingsDialog: document.querySelector("#settings-dialog"),
  settingMaster: document.querySelector("#setting-master"),
  settingMasterValue: document.querySelector("#setting-master-value"),
  settingBgm: document.querySelector("#setting-bgm"),
  settingBgmValue: document.querySelector("#setting-bgm-value"),
  settingSfx: document.querySelector("#setting-sfx"),
  settingSfxValue: document.querySelector("#setting-sfx-value"),
  settingMuted: document.querySelector("#setting-muted"),
  pageTitle: document.querySelector("#page-title"),
  pageSubtitle: document.querySelector("#page-subtitle"),
  goalProgress: document.querySelector("#goal-progress"),
  goalRoute: document.querySelector("#goal-route"),
  topbarScope: document.querySelector("#topbar-scope"),
  topbarStatus: document.querySelector("#topbar-status-text"),
  sideNight: document.querySelector("#side-night"),
  sideNightDetail: document.querySelector("#side-night-detail"),
  routeNavLabel: document.querySelector("#route-nav-label"),
  routeNavNote: document.querySelector("#route-nav-note"),
  mobileRouteNav: document.querySelector("#mobile-route-nav"),
  navTitle: document.querySelector("#nav-title"),
  shopPlace: document.querySelector("#shop-place"),
  shopWeather: document.querySelector("#shop-weather"),
  timeLamps: document.querySelector("#time-lamps"),
  timeCopy: document.querySelector("#time-copy"),
  nightProgressFill: document.querySelector("#night-progress-fill"),
  cash: document.querySelector("#cash-value"),
  tickets: document.querySelector("#ticket-value"),
  ticketHint: document.querySelector("#ticket-hint"),
  memoryCount: document.querySelector("#memory-count"),
  memoryNavCount: document.querySelector("#memory-nav-count"),
  shelfGrid: document.querySelector("#shelf-grid"),
  customerScene: document.querySelector("#customer-scene"),
  customerActions: document.querySelector("#customer-actions"),
  counterClock: document.querySelector("#counter-clock"),
  taskList: document.querySelector("#task-list"),
  memoryPreview: document.querySelector("#memory-preview"),
  shopStatus: document.querySelector("#shop-status"),
  closingTitle: document.querySelector("#closing-title"),
  closingIntro: document.querySelector("#closing-intro"),
  toast: document.querySelector("#toast")
};

function createInitialState() {
  const firstNight = CONTENT.firstNight;
  return {
    version: 5,
    nightIndex: 0,
    route: null,
    time: SHIFT_LENGTH,
    cash: CONTENT.startingCash,
    tickets: CONTENT.startingTickets,
    suppliesCost: 0,
    stock: { ...emptyStock, ...CONTENT.startingStock },
    introducedProducts: Object.keys(CONTENT.startingStock),
    introSeen: false,
    stage: firstNight.cast[0].id,
    served: {},
    memories: [],
    transactions: [],
    flags: {},
    achievements: [],
    keptItems: [],
    metCharacters: [],
    awardedTicketNights: [],
    interludeReturnStage: null,
    interludesSeen: [],
    openedNights: [],
    skippedGuest: null,
    skippedGuests: [],
    closingChoice: null,
    nightClosed: false,
    finished: false
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (
      saved &&
      saved.version === 5 &&
      Number.isInteger(saved.nightIndex) &&
      saved.nightIndex >= 0 &&
      saved.nightIndex <= 7 &&
      Number.isInteger(saved.time) &&
      saved.stock &&
      saved.flags
    ) {
      Object.keys(products).forEach((key) => {
        saved.stock[key] ??= 0;
      });
      saved.introducedProducts ||= Object.keys(saved.stock).filter((key) => saved.stock[key] > 0);
      saved.introSeen ??= false;
      if (
        !saved.introSeen &&
        (
          saved.nightIndex > 0 ||
          saved.time < SHIFT_LENGTH ||
          (saved.memories?.length || 0) > 0 ||
          (saved.transactions?.length || 0) > 0
        )
      ) {
        saved.introSeen = true;
      }
      saved.skippedGuest ??= null;
      saved.skippedGuests ||= [];
      saved.keptItems ||= [];
      saved.achievements ||= [];
      saved.metCharacters ||= [];
      saved.awardedTicketNights ||= [];
      saved.interludeReturnStage ??= null;
      saved.interludesSeen ||= [];
      saved.openedNights ||= [];
      if (saved.stage === "interlude") {
        saved.stage = saved.interludeReturnStage || "end";
        saved.interludeReturnStage = null;
      }
      return saved;
    }
  } catch (error) {
    console.warn("未能读取本地进度，将开始新的一夜。", error);
  }
  return createInitialState();
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("未能保存本地进度。", error);
  }
}

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (!saved || typeof saved !== "object") {
      return { ...DEFAULT_SETTINGS };
    }
    const textSpeed = ["slow", "normal", "fast"].includes(saved.textSpeed)
      ? saved.textSpeed
      : DEFAULT_SETTINGS.textSpeed;
    return {
      master: clampVolume(saved.master, DEFAULT_SETTINGS.master),
      bgm: clampVolume(saved.bgm, DEFAULT_SETTINGS.bgm),
      sfx: clampVolume(saved.sfx, DEFAULT_SETTINGS.sfx),
      muted: Boolean(saved.muted),
      textSpeed
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function clampVolume(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(1, Math.max(0, number));
}

function applyAudioSettings() {
  window.GameAudio?.setVolumes({
    master: settings.master,
    bgm: settings.bgm,
    sfx: settings.sfx,
    muted: settings.muted
  });
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn("未能保存声音设置。", error);
  }
  applyAudioSettings();
}

function playSfx(name) {
  if (!audioUnlocked) {
    return;
  }
  window.GameAudio?.playSfx(name);
}

function commit() {
  saveState();
  render();
}

function achievementDefinition(id) {
  return CONTENT.achievements.find((achievement) => achievement.id === id) || null;
}

function unlockAchievement(id) {
  const achievement = achievementDefinition(id);
  if (!achievement || state.achievements.includes(id)) {
    return false;
  }
  state.achievements.push(id);
  saveState();
  showToast(`成就解锁：${achievement.name}`);
  playSfx("success");
  return true;
}

function renderAchievements() {
  const list = document.querySelector("#achievement-list");
  const count = document.querySelector("#achievement-count");
  if (!list || !count) {
    return;
  }
  count.textContent = `${state.achievements.length} / ${CONTENT.achievements.length}`;
  list.replaceChildren();
  CONTENT.achievements.forEach((achievement) => {
    const unlocked = state.achievements.includes(achievement.id);
    const item = document.createElement("div");
    item.className = `achievement-row${unlocked ? " is-unlocked" : ""}`;
    item.innerHTML = `
      <span class="achievement-mark">${unlocked ? "已解锁" : "未解锁"}</span>
      <span>
        <strong>${achievement.name}</strong>
        <small>${achievement.description}</small>
      </span>
    `;
    list.append(item);
  });
}

function readSavedState() {
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY));
  } catch {
    return null;
  }
}

function hasPlayableSave(saved = readSavedState()) {
  if (!saved || saved.version !== 5) {
    return false;
  }
  if (saved.nightIndex > 0 && !CONTENT.routes[saved.route]) {
    return false;
  }
  return Boolean(
    saved.introSeen ||
    saved.nightIndex > 0 ||
    saved.nightClosed ||
    saved.finished ||
    saved.time < SHIFT_LENGTH ||
    (saved.memories?.length || 0) > 0 ||
    (saved.transactions?.length || 0) > 0
  );
}

function renderTitleScreen() {
  const saved = readSavedState();
  const playable = hasPlayableSave(saved);
  elements.continueGameButton.disabled = !playable;
  elements.newGameMeta.textContent = playable ? "会覆盖当前进度" : "从第一夜开始";

  if (!playable) {
    elements.continueGameLabel.textContent = "继续游戏";
    elements.continueGameMeta.textContent = "暂无存档";
    return;
  }

  const night = nightAtIndex(saved.nightIndex, saved.route);
  elements.continueGameLabel.textContent = saved.finished ? "查看结局" : "继续游戏";
  elements.continueGameMeta.textContent = saved.finished
    ? `第 8 夜 · ${night.place}`
    : `第 ${night.number} 夜 · ${night.place}`;
  renderAchievements();
}

function showTitleScreen() {
  dialogIds.forEach((id) => closeDialog(document.querySelector(`#${id}`)));
  closeDialog(elements.characterDialog);
  closeDialog(elements.historyDialog);
  closeDialog(elements.settingsDialog);
  window.GameAudio?.restoreAmbience();
  document.body.classList.remove("finale-active");
  document.body.classList.remove("intro-active");
  document.body.classList.add("title-active");
  elements.titleScreen.hidden = false;
  renderTitleScreen();
}

function continueGame() {
  if (!hasPlayableSave()) {
    return;
  }
  state = loadState();
  closeDialog(document.querySelector("#intro-dialog"));
  elements.titleScreen.hidden = true;
  document.body.classList.remove("title-active", "intro-active");
  render();
  if (state.finished || state.nightClosed) {
    showSummary();
  } else if (!state.introSeen) {
    openIntroDialog();
  } else if (!state.openedNights.includes(currentNight().number)) {
    startNightOpening();
  } else {
    elements.customerActions.querySelector("button")?.focus({ preventScroll: true });
  }
}

function startNewGameFromTitle() {
  vnHistory.length = 0;
  window.GameAudio?.restoreAmbience();
  state = createInitialState();
  dialogIds.forEach((id) => closeDialog(document.querySelector(`#${id}`)));
  elements.titleScreen.hidden = true;
  document.body.classList.remove("finale-active");
  document.body.classList.remove("title-active");
  render();
  openIntroDialog();
}

function requestNewGame() {
  if (hasPlayableSave()) {
    openDialog(document.querySelector("#new-game-dialog"));
    return;
  }
  startNewGameFromTitle();
}

function nightAtIndex(index, routeId = state.route) {
  if (index === 0 || !routeId) {
    return CONTENT.firstNight;
  }
  if (index <= 2) {
    return CONTENT.routes[routeId].nights[index - 1];
  }
  if (index === 5 && CONTENT.finalArc.routeSix?.[routeId]) {
    return CONTENT.finalArc.routeSix[routeId];
  }
  return CONTENT.finalArc.nights[index - 3];
}

function currentNight() {
  return nightAtIndex(state.nightIndex, state.route);
}

function currentRoute() {
  return state.route ? CONTENT.routes[state.route] : null;
}

function characterArcEntries() {
  return Object.entries(CONTENT.characterArcs).map(([id, arc]) => ({ id, ...arc }));
}

function resolvedCharacterArcs() {
  return characterArcEntries().filter((arc) => state.flags[arc.closureFlag]);
}

function unresolvedCharacterArcs() {
  return characterArcEntries().filter((arc) => !state.flags[arc.closureFlag]);
}

function hasAnyFlag(flags) {
  return flags.some((flag) => Boolean(state.flags[flag]));
}

function nightPassRequirement(night = currentNight()) {
  const routeId = currentRoute()?.id || null;
  const number = night.number;

  if (number === 1) {
    return {
      id: "first-keepsake",
      label: "在柜台留下第一件不属于货架的东西",
      detail: "让阿澄把伞留下、让沈伯留下第二罐咖啡，或把保温饭盒搬到柜台旁。",
      channel: "收银台下的旧票机",
      met: hasAnyFlag(["doorUmbrella", "unopenedCoffee", "featuredLunchbox"])
    };
  }

  if (number === 2 && routeId === "station") {
    return {
      id: "station-clock",
      label: "让停摆的钟重新映出店里的灯",
      detail: "擦亮那只钟，或让 0217 / 沈伯留下一样能证明今夜发生过的东西。",
      channel: "停摆的钟后面",
      met: hasAnyFlag(["clockClean", "wageCoin", "shenReunion"])
    };
  }

  if (number === 2) {
    return {
      id: "summer-window",
      label: "让门外先出现一点能看见的晴天",
      detail: "擦掉玻璃上的雨，或让 小满 / 阿澄把天气与照片留下来。",
      channel: "擦干净的玻璃",
      met: hasAnyFlag(["clearGlass", "sunnyPromise", "honestRain", "oldPhoto"])
    };
  }

  if (number === 3 && routeId === "station") {
    return {
      id: "station-parcel",
      label: "让包裹或一位客人的话在打烊前留在柜台上",
      detail: "把包裹放上柜台，或让 0217 / 沈伯把今晚的话说完。",
      channel: "包裹的夹层",
      met: hasAnyFlag([
        "parcelOnCounter",
        "clerkLunchbox",
        "clerkNote",
        "clerkRested",
        "shenClosed",
        "blankSign",
        "xiaomanCameo"
      ])
    };
  }

  if (number === 3) {
    return {
      id: "summer-postcard",
      label: "让明信片或一位客人的选择指向明天",
      detail: "翻过明信片，或让小满 / 阿澄带走一个不再等待的理由。",
      channel: "明信片的背面",
      met: hasAnyFlag([
        "postcardRead",
        "warmMeal",
        "lightOutside",
        "tomorrowAccepted",
        "achengLetGo",
        "shenCameo"
      ])
    };
  }

  if (number === 4) {
    return {
      id: "road-direction",
      label: "在无名公路上留下一个方向",
      detail: "把车灯转向没有名字的地方，或让任意一位客人在路上留下标记。",
      channel: "车灯照出的路标",
      met: hasAnyFlag([
        "roadLight",
        "travelerPostcard",
        "achengRoad",
        "candleRoad",
        "saltRoad",
        "clerkRoadRest",
        "umbrellaMended",
        "brokenUmbrellaKept",
        "roadsideLight",
        "counterLight"
      ])
    };
  }

  if (number === 5) {
    return {
      id: "tunnel-machine",
      label: "让自动售货机吐出一样能带走的东西",
      detail: "把明信片塞进投币口，或让客人从隧道里带走 / 留下一样东西。",
      channel: "自动售货机的投币口",
      met: hasAnyFlag([
        "ticketFound",
        "travelerVoice",
        "bottleWaiting",
        "xiaomanRadio",
        "sunnyChannel",
        "quietRadio",
        "clerkPayslip",
        "clerkTunnel",
        "clerkSlept",
        "machineTicketBack",
        "machineTicketKept"
      ])
    };
  }

  if (number === 6) {
    if (routeId === "summer") {
      return {
        id: "summer-six-light",
        label: "让夏天停在最后一个下午",
        detail: "把最后一段阳光装进玻璃瓶，或让小满 / 阿澄把花与围巾留下。",
        channel: "玻璃瓶里的夕阳",
        met: hasAnyFlag([
          "summerSunBottle",
          "summerFlowerBottle",
          "summerFlowerCounter",
          "summerAccepted",
          "xiaomanSummerSix",
          "achengSummerSix",
          "flowerInBottle",
          "flowerOnCounter",
          "catFound",
          "catTrail"
        ])
      };
    }
    return {
      id: "clock-minute",
      label: "让停摆的钟再走一分钟",
      detail: "把钟拨回一分钟，或让沈伯 / 0217 交出最后一件值班证明。",
      channel: "停摆的钟里",
      met: hasAnyFlag([
        "clockRewound",
        "shenClosedLoop",
        "shenHasTicket",
        "shenSits",
        "clerkBadge",
        "clerkOffDuty",
        "clerkLeaves",
        "catFound",
        "catTrail",
        "flowerInBottle",
        "flowerOnCounter"
      ])
    };
  }

  if (number === 7) {
    return {
      id: "summer-light",
      label: "让柜台的灯照到门外",
      detail: "把灯挪向门外，或让任意一位客人在夏天结束前带走自己的答案。",
      channel: "门外的灯",
      met: hasAnyFlag([
        "lightOutsideFinal",
        "achengForward",
        "achengLetter",
        "shenTicketLit",
        "shenPostcard",
        "xiaomanWarmFinal",
        "lastWeather",
        "summerBottle",
        "extraMinuteGiven",
        "extraMinuteKept"
      ])
    };
  }

  return {
    id: "final-parcel",
    label: "把没有收件人的包裹放上柜台",
    detail: "只有包裹在柜台上，才能决定拆开它，或重新封存。",
    channel: "柜台中央",
    met: Boolean(state.flags.parcelOnCounter)
  };
}

function ticketAwardedForNight(number) {
  return (state.awardedTicketNights || []).includes(number);
}

function awardPassTicket() {
  const night = currentNight();
  if (night.number === 8) {
    return false;
  }
  const requirement = nightPassRequirement(night);
  state.awardedTicketNights ||= [];
  if (!requirement.met || state.awardedTicketNights.includes(night.number)) {
    return false;
  }
  state.awardedTicketNights.push(night.number);
  state.tickets += 1;
  addMemory(`通行条件已达成。${requirement.channel}给了你一张通往下一夜的车票。`);
  return true;
}

function introduceLocalStock(night = currentNight()) {
  Object.entries(night.localStock || {}).forEach(([key, amount]) => {
    if (!state.introducedProducts.includes(key)) {
      state.stock[key] = Math.max(state.stock[key] || 0, amount);
      state.introducedProducts.push(key);
    }
  });
}

function currentGuest() {
  if (state.nightClosed || state.finished || state.stage === "end") {
    return null;
  }
  return currentNight().cast.find((guest) => guest.id === state.stage) || null;
}

function counterPair(night = currentNight()) {
  if (!night.simultaneous) {
    return [];
  }
  return night.cast.filter((guest) => guest.mode !== "quick").slice(0, 2);
}

function counterGuests() {
  const night = currentNight();
  if (state.nightClosed || state.finished || state.stage === "end") {
    return [];
  }
  if (night.simultaneous && !state.nightClosed && !state.finished) {
    const waiting = counterPair(night).filter((guest) => !state.served[guest.id]);
    if (waiting.length > 0) {
      return waiting;
    }
  }
  const guest = currentGuest();
  return guest ? [guest] : [];
}

function guestLine(guest) {
  const pair = counterPair();
  const partnerServed = pair.some((partner) => partner.id !== guest.id && state.served[partner.id]);
  return partnerServed && guest.waitedLine ? guest.waitedLine : guest.line;
}

function clockLabel() {
  const night = currentNight();
  const [startHour, startMinute] = night.clockStart.split(":").map(Number);
  const totalMinutes = startHour * 60 + startMinute + (SHIFT_LENGTH - state.time) * 10;
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`; /* taste-skill-ignore numbering */
}

function addMemory(text) {
  state.memories.push({
    text,
    time: clockLabel(),
    night: currentNight().number,
    place: currentNight().place
  });
  pulseElement(elements.memoryCount);
  pulseElement(elements.memoryNavCount);
}

function pulseElement(element) {
  if (!element) {
    return;
  }
  element.classList.remove("is-pulsing");
  void element.offsetWidth;
  element.classList.add("is-pulsing");
  window.setTimeout(() => element.classList.remove("is-pulsing"), 480);
}

function addFlags(flagsOn = [], flagsOff = []) {
  flagsOn.forEach((flag) => {
    state.flags[flag] = true;
  });
  flagsOff.forEach((flag) => {
    state.flags[flag] = false;
  });
}

function spendTime(amount = 1) {
  state.time = Math.max(0, state.time - amount);
}

function addTransaction(transaction, customer) {
  if (!transaction) {
    return;
  }
  state.transactions.push({
    label: transaction.label,
    amount: Number(transaction.amount) || 0,
    customer,
    night: currentNight().number
  });
  pulseElement(elements.cash);
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2600);
}

function restockBlockedReason(key, amount = 1) {
  const product = products[key];
  if (!product) {
    return "没有这种商品";
  }
  if (product.restockable === false) {
    return "这件东西补不到";
  }
  if (state.nightClosed || state.finished) {
    return "已经打烊";
  }
  if (state.stock[key] + amount > 9) {
    return amount === 1 ? "库存已满" : "库房放不下这么多";
  }
  if (state.time < amount) {
    return amount === 1 ? "今晚没有时间了" : `只剩 ${state.time} 格时间`;
  }
  if (state.cash < product.cost * amount) {
    return amount === 1 ? "现金不足" : `现金不够补 ${amount} 件`;
  }
  return "";
}

function render() {
  renderShell();
  renderShift();
  renderShelf();
  renderCustomer();
  renderTasks();
  renderMemoryPreview();
  renderCharacterCount();
  document.body.classList.toggle("is-finished", state.finished);
  document.body.classList.toggle("is-night-closed", state.nightClosed);
}

function renderShell() {
  const night = currentNight();
  const route = currentRoute();
  const nightLabel = `第 ${night.number} 夜 · ${night.place}`;

  document.title = `世界尽头的便利店 · 第 ${night.number} 夜`;
  elements.pageTitle.textContent = night.title;
  elements.pageSubtitle.textContent = night.subtitle;
  elements.topbarScope.textContent = night.scope;
  elements.sideNight.textContent = nightLabel;
  elements.sideNightDetail.textContent = `${night.weather}，${clockLabel()}`;
  elements.navTitle.textContent = `世界尽头的便利店 · 第 ${night.number} 夜`;
  elements.shopPlace.textContent = night.windowTitle;
  elements.shopWeather.textContent = night.weather;
  elements.closingTitle.textContent = night.closingTitle;
  elements.closingIntro.textContent = night.closingIntro;
  const resolvedCount = resolvedCharacterArcs().length;
  elements.goalProgress.textContent = night.number === 8
    ? `第一班车今夜到站 · 已经记住 ${resolvedCount}/5 个人`
    : `离第一班车还有 ${8 - night.number} 夜 · 已经记住 ${resolvedCount}/5 个人`;
  elements.goalRoute.textContent = state.finished
    ? "包裹已经找到去处"
    : route
      ? `当前路线：${route.name}`
      : "包裹还没有地址";

  if (state.finished) {
    elements.routeNavLabel.textContent = "首章终点";
    elements.routeNavNote.textContent = "已经抵达";
    elements.mobileRouteNav.textContent = "首章终点 · 已经抵达";
  } else if (route) {
    elements.routeNavLabel.textContent = route.name;
    elements.routeNavNote.textContent = `第 ${night.number} / 8 夜`;
    elements.mobileRouteNav.textContent = `路线：${route.name}`;
  } else {
    elements.routeNavLabel.textContent = "明日路线";
    elements.routeNavNote.textContent = state.nightClosed ? "打烊后可选" : "打烊后";
    elements.mobileRouteNav.textContent = "明日路线 · 打烊后";
  }
}

function renderShift() {
  elements.timeLamps.replaceChildren();
  for (let index = 0; index < SHIFT_LENGTH; index += 1) {
    const lamp = document.createElement("span");
    const isCurrent = state.time > 0 && index === state.time - 1;
    lamp.className = `time-lamp${index >= state.time ? " is-off" : ""}${isCurrent ? " is-current" : ""}`;
    elements.timeLamps.append(lamp);
  }
  elements.nightProgressFill.style.width = `${(state.time / SHIFT_LENGTH) * 100}%`;

  elements.timeLamps.setAttribute("aria-label", `剩余 ${state.time} 个营业时间格`);
  elements.timeCopy.textContent = `${state.time} 件事`;
  elements.cash.textContent = state.cash;
  elements.tickets.textContent = state.tickets;
  const ticketRequirement = nightPassRequirement();
  elements.ticketHint.textContent = state.tickets > 0
    ? `还能再坐 ${state.tickets} 次车`
    : currentNight().number === 8
      ? "已经抵达首章终点"
      : ticketRequirement.met
        ? "通行条件已达成，打烊后会得到车票"
        : "完成今晚的上车条件，旧票机才会吐出车票";
  elements.memoryCount.textContent = state.memories.length;
  elements.memoryNavCount.textContent = state.memories.length;
  elements.counterClock.textContent = clockLabel();

  const counterIsQuiet = state.stage === "end";
  const isClosed = state.nightClosed || state.finished;
  elements.shopStatus.textContent = isClosed
    ? "已经打烊"
    : counterIsQuiet
      ? "等候打烊"
      : "营业中";
  elements.shopStatus.classList.toggle("is-closed", isClosed || counterIsQuiet);
  elements.topbarStatus.textContent = isClosed
    ? "今夜已打烊"
    : counterIsQuiet
      ? "准备打烊"
      : state.time <= 0
        ? "柜台收尾中"
        : "正在营业";
}

function renderShelf() {
  elements.shelfGrid.replaceChildren();
  const productKeys = [...(currentNight().shelf || fallbackShelf)];
  while (productKeys.length < 6) {
    productKeys.push(null);
  }

  productKeys.forEach((key) => {
    if (!key) {
      const empty = document.createElement("div");
      empty.className = "shelf-item is-empty";
      empty.setAttribute("aria-hidden", "true");
      empty.innerHTML = `
        <span class="empty-slot-line"></span>
        <span class="empty-slot-copy">空位</span>
        <span class="empty-slot-hint">可补货</span>
      `;
      elements.shelfGrid.append(empty);
      return;
    }

    const product = products[key];
    const stock = state.stock[key];
    const blockedReason = restockBlockedReason(key);
    const priceLabel = product.price > 0 ? `¥${product.price}` : "不标价";
    const item = document.createElement("article");
    item.className = "shelf-item";
    item.dataset.product = key;
    if (key === "lunchbox" && state.flags.featuredLunchbox) {
      item.classList.add("is-featured");
    }
    if (stock <= 0) {
      item.classList.add("is-sold-out");
    }
    item.innerHTML = `
      <button class="shelf-main" type="button" aria-label="查看${product.name}，还剩 ${stock} 件">
        <span class="product-topline">
          <span class="product-icon">${product.icon}</span>
          <span class="product-stock">${stock > 0 ? `剩 ${stock}` : "售完"}</span>
        </span>
        <span>
          <span class="product-name">${product.name}</span>
          <span class="product-meta">
            <span>${key === "lunchbox" && state.flags.featuredLunchbox ? "柜台旁" : "货架"}</span>
            <span class="num">${priceLabel}</span>
          </span>
        </span>
      </button>
      <span class="shelf-actions">
        <button class="shelf-action" type="button" data-shelf-action="details">说明</button>
        <button
          class="shelf-action shelf-restock"
          type="button"
          data-shelf-action="restock"
          title="${blockedReason || `补进一件${product.name}，消耗 1 格时间`}"
          ${blockedReason ? "disabled" : ""}
        >${blockedReason || `补 +1 · ¥${product.cost}`}</button>
      </span>
    `;
    item.querySelector('[data-shelf-action="details"]').addEventListener("click", () => openItemDialog(key));
    item.querySelector(".shelf-main").addEventListener("click", () => openItemDialog(key));
    item.querySelector('[data-shelf-action="restock"]').addEventListener("click", () => restockProduct(key));
    elements.shelfGrid.append(item);
  });
}

function openGuestFlow(guest) {
  if (currentNight().simultaneous && state.stage !== guest.id) {
    state.stage = guest.id;
  }
  if (guest.mode === "quick") {
    serveQuickCustomer(guest);
  } else if (guest.mode === "special") {
    openSpecialDialog(guest);
  } else {
    openTradeDialog(guest);
  }
}

function renderCustomer() {
  const guests = counterGuests();
  elements.customerScene.replaceChildren();
  elements.customerActions.replaceChildren();

  if (guests.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-counter";
    const isClosed = state.nightClosed || state.finished;
    empty.innerHTML = `
      <span class="empty-slot-line"></span>
      <h3>${isClosed ? `第 ${currentNight().number} 夜已经结束` : "柜台安静下来"}</h3>
      <p>${isClosed
        ? "收据和没说完的话都收好了。"
        : state.time > 0
          ? "外面还有声音。可以补货、做一件小事，也可以准备打烊。"
          : "六件事都用完了。今晚不会再有新的客人进来，准备好时再打烊。"}</p>
    `;
    elements.customerScene.append(empty);
    return;
  }

  if (guests.length === 1) {
    const guest = guests[0];
    const person = document.createElement("div");
    person.className = "customer-person";
    person.innerHTML = `
      ${portraitSvg(guest.name, "customer-portrait")}
      <div class="customer-person-copy">
        <h3></h3>
        <p class="customer-arrival"></p>
      </div>
    `;
    person.querySelector("h3").textContent = guest.name;
    person.querySelector(".customer-arrival").textContent = guest.arrival;

    const line = document.createElement("p");
    line.className = "customer-line";
    line.textContent = guestLine(guest);

    const note = document.createElement("p");
    note.className = "customer-note";
    note.textContent = guest.note;

    elements.customerScene.append(person, line, note);

    const action = document.createElement("button");
    action.type = "button";
    action.className = "primary-button";
    action.textContent = guest.action;
    action.addEventListener("click", () => openGuestFlow(guest));

    const cost = document.createElement("span");
    cost.className = "action-cost";
    if (state.time <= 0 && guest.mode !== "quick") {
      cost.textContent = "时间已用完；只剩柜台前这一位可以收尾，后面的人不会再来";
    } else if (state.stock[guest.product] < (guest.quantity || 1) && guest.mode !== "special") {
      cost.textContent = `${products[guest.product].name}库存不够，点开后可在柜台补货`;
    } else {
      cost.textContent = guest.cost;
    }

    elements.customerActions.append(action, cost);
    return;
  }

  const hint = document.createElement("p");
  hint.className = "customer-pair-hint";
  hint.textContent = "两个人同时站在柜台前。先接待谁，另一个人的话会变。";

  const pair = document.createElement("div");
  pair.className = "customer-pair";
  guests.forEach((guest) => {
    const card = document.createElement("section");
    card.className = "counter-person";

    const portrait = document.createElement("div");
    portrait.innerHTML = portraitSvg(guest.name, "counter-person-portrait");

    const name = document.createElement("h3");
    name.textContent = guest.name;

    const arrival = document.createElement("p");
    arrival.className = "customer-arrival";
    arrival.textContent = guest.arrival;

    const line = document.createElement("p");
    line.className = "customer-line";
    line.textContent = guestLine(guest);

    const note = document.createElement("p");
    note.className = "customer-note";
    note.textContent = guest.note;

    const action = document.createElement("button");
    action.type = "button";
    action.className = "primary-button";
    action.textContent = guest.action;
    action.addEventListener("click", () => openGuestFlow(guest));

    card.append(portrait.firstElementChild, name, arrival, line, note, action);
    pair.append(card);
  });

  elements.customerScene.append(hint, pair);
  const pairCost = document.createElement("span");
  pairCost.className = "action-cost";
  pairCost.textContent = state.time <= 0
    ? "时间已用完；只能收尾其中一位，另一位今晚不会再来"
    : "接待其中一位 · 各花 1 个营业时间格";
  elements.customerActions.append(pairCost);
}

function renderTasks() {
  elements.taskList.replaceChildren();
  const task = currentNight().task;
  const done = task.flagsOn?.some((flag) => state.flags[flag]);
  const requirement = nightPassRequirement();
  const ticketEarned = ticketAwardedForNight(currentNight().number);
  const passCard = document.createElement("div");
  passCard.className = `pass-card${requirement.met ? " is-met" : ""}`;
  passCard.innerHTML = `
    <div class="pass-head">
      <strong>今晚怎样才能上车</strong>
      <span>${requirement.met ? "可以上车" : "还不能上车"}</span>
    </div>
    <p>${requirement.label}</p>
    <small>${requirement.detail}</small>
    <small class="pass-channel">${
      currentNight().number === 8
        ? requirement.channel
        : ticketEarned
          ? `已获得车票 · ${requirement.channel}`
          : `做到之后，${requirement.channel}会吐出一张车票`
    }</small>
  `;
  elements.taskList.append(passCard);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "task-button";
  button.disabled = (state.time <= 0 && !task.free) || state.nightClosed || state.finished || done;
  button.innerHTML = `
    <span class="task-copy">
      <span class="task-name">${done ? task.doneLabel : task.name}</span>
      <span class="task-detail">${done ? task.doneDetail : task.detail}</span>
    </span>
    <span class="task-cost">${done ? "完成" : task.cost}</span>
  `;
  button.addEventListener("click", () => performTask(task));
  elements.taskList.append(button);

  const note = document.createElement("p");
  note.className = "task-note";
  note.textContent = "小事、客人留下的东西和商品的新用途，都会算进今晚的上车条件。";
  elements.taskList.append(note);
}

function renderMemoryPreview() {
  elements.memoryPreview.replaceChildren();
  if (state.memories.length === 0) {
    const empty = document.createElement("p");
    empty.className = "memory-empty";
    empty.textContent = "还没有。今晚的第一件事会被写在这里。";
    elements.memoryPreview.append(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "memory-preview-list";
  state.memories.slice(-3).forEach((memory) => {
    const item = document.createElement("li");
    item.textContent = memory.text;
    list.append(item);
  });
  elements.memoryPreview.append(list);
}

function restockProduct(key, amount = 1) {
  const product = products[key];
  const quantity = Math.max(1, Math.floor(amount));
  const blockedReason = restockBlockedReason(key, quantity);
  if (blockedReason) {
    showToast(`${product?.name || "商品"}：${blockedReason}。`);
    return false;
  }

  spendTime(quantity);
  state.cash -= product.cost * quantity;
  state.stock[key] += quantity;
  state.suppliesCost += product.cost * quantity;
  unlockAchievement("first-restock");
  commit();
  showToast(`补进 ${quantity} 件${product.name}，还剩 ${state.stock[key]} 件。`);
  return true;
}

function guestStockShortage(guest) {
  if (!guest?.product) {
    return 0;
  }
  return Math.max(0, (guest.quantity || 1) - state.stock[guest.product]);
}

function reopenGuestFlow(guest) {
  if (guest.mode === "quick") {
    serveQuickCustomer(guest);
  } else if (guest.mode === "special") {
    openSpecialDialog(guest);
  } else {
    openTradeDialog(guest);
  }
}

function openStockShortageDialog(guest) {
  if (!guest?.product || state.nightClosed || state.finished) {
    return;
  }

  const shortage = guestStockShortage(guest);
  if (shortage <= 0) {
    reopenGuestFlow(guest);
    return;
  }

  const product = products[guest.product];
  const quantity = guest.quantity || 1;
  const restockCost = product.cost * shortage;
  const blockedReason = restockBlockedReason(guest.product, shortage);
  const dialog = document.querySelector("#trade-dialog");
  dialog.classList.remove("is-vn");
  document.querySelector("#trade-title").textContent = `柜台前：${guest.name}`;
  const body = document.querySelector("#trade-body");
  body.innerHTML = `
    <div class="trade-scene">
      <p>${guest.name}还站在柜台前，需要${quantity}件${product.name}。</p>
      <p>货架现在只有 ${state.stock[guest.product]} 件，还缺 ${shortage} 件。补齐后，刚才没做完的事可以直接接上。</p>
    </div>
    <div class="item-restock stock-shortage">
      <div>
        <strong>一次补足 ${shortage} 件${product.name}</strong>
        <span>进价 ¥${restockCost} · 消耗 ${shortage} 格时间</span>
      </div>
      <button
        class="primary-button"
        id="shortage-restock"
        type="button"
        ${blockedReason ? "disabled" : ""}
      >
        ${blockedReason ? blockedReason : `补足 · ¥${restockCost}`}
      </button>
    </div>
    <div class="trade-result-actions dialog-secondary-action">
      <button class="text-button" type="button" id="shortage-cancel">先回柜台</button>
    </div>
  `;
  document.querySelector("#shortage-restock").addEventListener("click", () => {
    if (!restockProduct(guest.product, shortage)) {
      return;
    }
    if (guestStockShortage(guest) === 0) {
      if (guest.mode === "quick") {
        closeDialog(dialog);
      }
      reopenGuestFlow(guest);
    } else {
      openStockShortageDialog(guest);
    }
  });
  document.querySelector("#shortage-cancel").addEventListener("click", () => {
    closeDialog(dialog);
  });
  openDialog(dialog);
}

function performTask(task) {
  if ((state.time <= 0 && !task.free) || state.nightClosed || state.finished) {
    return;
  }
  if (task.flagsOn?.some((flag) => state.flags[flag])) {
    return;
  }

  if (!task.free) {
    spendTime(1);
  }
  addFlags(task.flagsOn || [], task.flagsOff || []);
  addMemory(task.memory);
  commit();
  showToast(task.toast);
}

function serveQuickCustomer(guest) {
  if (state.stage !== guest.id || state.nightClosed || state.finished) {
    return;
  }

  const quantity = guest.quantity || 1;
  if (state.stock[guest.product] < quantity) {
    openStockShortageDialog(guest);
    playSfx("blocked");
    return;
  }

  playSfx("coin");
  state.stock[guest.product] -= quantity;
  state.cash += guest.amount;
  addTransaction(
    {
      label: `${products[guest.product].name} ×${quantity}`,
      amount: guest.amount
    },
    guest.name
  );
  state.served[guest.id] = true;
  if (currentNight().interlude && !state.interludesSeen.includes(currentNight().number)) {
    state.flags.pendingInterlude = true;
  }
  markCharacterMet(guest.name);
  unlockAchievement("first-trade");
  addMemory(guest.memory);
  advanceStage();
  commit();
  showToast(guest.toast);
  if (state.flags.pendingInterlude) {
    openInterlude();
  }
}

function guestVnShell(guest, innerHtml) {
  const night = currentNight();
  const scene = guest.avatarClass || "counter";
  const portraitClass = portraitIdForName(guest.name);
  return `
    <div class="vn-shell">
      <div class="vn-stage" data-scene="${scene}">
        <div class="vn-rain" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
        <div class="vn-window" aria-hidden="true"><span>${night.place}</span></div>
        <div class="vn-shelves" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
        <div class="vn-counter" aria-hidden="true"></div>
        <div class="vn-door" aria-hidden="true"></div>
        <div class="vn-character portrait-${portraitClass}">
          ${portraitSvg(guest.name, "vn-portrait")}
          <div class="vn-character-copy">
            <span>${guest.initial}</span>
            <small>${guest.name}</small>
          </div>
        </div>
        <div class="vn-scene-label">${night.place}</div>
      </div>
      <div class="vn-dialogue">
        <div class="vn-dialogue-head">
          <strong>${guest.name}</strong>
          <span class="vn-dialogue-meta">
            <span>${guest.arrival}</span>
            <button class="text-button" type="button" data-vn-history>历史</button>
          </span>
        </div>
        ${innerHtml}
      </div>
    </div>`;
}

const PORTRAIT_IDS = {
  "阿澄": "acheng",
  "沈伯": "shen",
  "0217": "clerk",
  "小满": "xiaoman",
  "无名旅人": "traveler"
};

function portraitIdForName(name) {
  return PORTRAIT_IDS[name] || "generic";
}

function portraitSvg(name, className = "") {
  const id = portraitIdForName(name);
  return `
    <div class="portrait-frame portrait-${id} ${className}">
      <svg class="portrait-svg" viewBox="0 0 120 160" aria-hidden="true">
        <use href="#portrait-${id}"></use>
      </svg>
    </div>
  `;
}

function keptEchoForGuest(guest) {
  const kept = state.keptItems || [];
  if (guest.name === "阿澄" && kept.includes("coffee")) {
    return "<p class=\"kept-echo\">她看了一眼柜台上的那罐咖啡，没有问是谁留下的。</p>";
  }
  if (guest.name === "沈伯" && kept.includes("umbrella")) {
    return "<p class=\"kept-echo\">他看了一眼门边的伞，问阿澄今天有没有来。</p>";
  }
  if (guest.name === "沈伯" && kept.includes("scarf")) {
    return "<p class=\"kept-echo\">他认出了那条红围巾，说阿澄母亲也戴过这个颜色。</p>";
  }
  if (guest.name === "小满" && kept.includes("lunchbox")) {
    return "<p class=\"kept-echo\">她看见柜台上的保温饭盒，问是不是还给明天留着。</p>";
  }
  if (guest.name === "0217" && kept.includes("coin")) {
    return "<p class=\"kept-echo\">她看见收银盒下面的旧工资币，没有伸手去拿。</p>";
  }
  if (guest.name === "无名旅人" && kept.includes("postcard")) {
    return "<p class=\"kept-echo\">他看见那张明信片，像看见一个已经写过的地址。</p>";
  }
  return "";
}

function openTradeDialog(guest) {
  if (state.nightClosed || state.finished) {
    return;
  }

  const quantity = guest.quantity || 1;
  if (state.stock[guest.product] < quantity) {
    openStockShortageDialog(guest);
    return;
  }

  const dialog = document.querySelector("#trade-dialog");
  const title = document.querySelector("#trade-title");
  const body = document.querySelector("#trade-body");
  title.textContent = `柜台前：${guest.name}`;

  const normalPrice = guest.prices.normal;
  const priceNote = (amount) => {
    const difference = amount - normalPrice;
    if (difference < 0) {
      return `少收 ¥${Math.abs(difference)}`;
    }
    if (difference > 0) {
      return `多收 ¥${difference}`;
    }
    return "照常收钱";
  };

  body.innerHTML = guestVnShell(guest, `
    <div class="trade-scene">
      ${keptEchoForGuest(guest)}
      ${guest.scene.map((line) => `<p>${line}</p>`).join("")}
    </div>
    <div class="price-options">
      ${priceButton(guest.prices.low, "按低价卖出", priceNote(guest.prices.low), "low")}
      ${priceButton(guest.prices.normal, "按原价卖出", priceNote(guest.prices.normal), "normal")}
      ${priceButton(guest.prices.high, "按高价卖出", priceNote(guest.prices.high), "high")}
      <button class="price-button" type="button" data-trade-price="gift">
        <strong>不收钱，送给客人</strong>
        <span>交易会变成一件被记住的事</span>
      </button>
    </div>
    <div id="trade-result"></div>
  `);
  dialog.classList.add("is-vn");
  guest.scene.forEach((line) => logVnLine(guest.name, line, currentNight().place));
  body.querySelector("[data-vn-history]")?.addEventListener("click", openHistoryDialog);

  body.querySelectorAll("[data-trade-price]").forEach((button) => {
    button.addEventListener("click", () => {
      completePurchase(guest, button.dataset.tradePrice);
    });
  });

  openDialog(dialog);
}

function priceButton(amount, title, note, option) {
  return `
    <button class="price-button" type="button" data-trade-price="${option}" data-amount="${amount}">
      <strong>${title}</strong>
      <span>¥${amount} · ${note}</span>
    </button>
  `;
}

function completePurchase(guest, option) {
  if (state.stage !== guest.id || state.nightClosed || state.finished) {
    return;
  }

  const quantity = guest.quantity || 1;
  if (state.stock[guest.product] < quantity) {
    showToast("货架上的商品不够了。");
    playSfx("blocked");
    return;
  }

  playSfx(option === "gift" ? "gift" : "coin");
  const priceChoiceLabels = {
    low: "按低价卖出",
    normal: "按原价卖出",
    high: "按高价卖出",
    gift: "不收钱，送给客人"
  };
  logVnChoice(priceChoiceLabels[option] || "完成交易");
  const amount = option === "gift" ? 0 : guest.prices[option];
  state.stock[guest.product] -= quantity;
  state.cash += amount;
  spendTime(1);
  addTransaction(
    {
      label: `${products[guest.product].name} ×${quantity}`,
      amount
    },
    guest.name
  );
  state.served[guest.id] = true;
  if (currentNight().interlude && !state.interludesSeen.includes(currentNight().number)) {
    state.flags.pendingInterlude = true;
  }
  markCharacterMet(guest.name);
  unlockAchievement("first-trade");
  if (option === "gift") {
    unlockAchievement("first-gift");
  }
  applyFlags(guest.effect?.[option === "gift" ? "gift" : "paid"]);
  let purchaseMemory = guest.memory[option === "gift" ? "gift" : "paid"];
  if (option === "low") {
    purchaseMemory = `${purchaseMemory} ${guest.name}把找零数了两遍，才把钱放进柜台。`;
  }
  if (option === "high") {
    purchaseMemory = `${purchaseMemory} ${guest.name}把硬币一枚一枚放在柜台上，没有还价。`;
  }
  addMemory(purchaseMemory);
  advanceStage();
  commit();
  renderPurchaseResult(guest, amount, option);
}

function applyFlags(effect) {
  if (!effect) {
    return;
  }
  addFlags(effect.flagsOn || [], effect.flagsOff || []);
}

function renderPurchaseResult(guest, amount, option) {
  const result = document.querySelector("#trade-result");
  const priceOptions = document.querySelector("#trade-body .price-options");
  if (!result) {
    return;
  }
  if (priceOptions) {
    priceOptions.hidden = true;
  }

  const resultText = guest.result[option === "gift" ? "gift" : "paid"];
  const quoteKey = option === "gift" ? "gift" : option === "low" || option === "high" ? option : "paid";
  const quote = guest.quote[quoteKey] || guest.quote[option === "gift" ? "gift" : "paid"];
  const nextGuest = currentNight().cast.find((item) => item.id === state.stage);
  const continueLabel = nextGuest ? "继续营业 · 下一位" : "回店里收尾";
  result.innerHTML = `
    <div class="trade-result">
      <p>${resultText}</p>
      <blockquote>${quote}</blockquote>
      <div class="trade-result-actions">
        ${characterArcIdForName(guest.name) ? `<button class="secondary-button" type="button" id="trade-character">人物前史</button>` : ""}
        <button class="primary-button" type="button" id="trade-continue">${continueLabel}</button>
      </div>
    </div>
  `;
  const characterButton = document.querySelector("#trade-character");
  if (characterButton) {
    characterButton.addEventListener("click", () => openCharacterDialog(characterArcIdForName(guest.name)));
  }
  document.querySelector("#trade-continue").addEventListener("click", () => {
    closeDialog(document.querySelector("#trade-dialog"));
    if (state.flags.pendingInterlude) {
      openInterlude();
      return;
    }
    showToast(amount > 0 ? `${guest.name}的交易记进了今晚的收据。` : `你把东西送给了${guest.name}。`);
  });
}

function specialChoiceState(choice) {
  if (choice.requiresFlag && !state.flags[choice.requiresFlag]) {
    return { available: false, reason: choice.unavailable || "还缺少一件留下的事" };
  }
  if (choice.requiresStock) {
    const unavailableKey = Object.keys(choice.requiresStock).find(
      (key) => state.stock[key] < choice.requiresStock[key]
    );
    if (unavailableKey) {
      return { available: false, reason: choice.unavailable || "货架库存不够" };
    }
  }
  return { available: true, reason: "" };
}

function specialStockNeeds(guest) {
  const needs = new Map();
  guest.choices.forEach((choice) => {
    Object.entries(choice.requiresStock || {}).forEach(([key, required]) => {
      const shortage = required - state.stock[key];
      if (shortage > 0) {
        needs.set(key, Math.max(needs.get(key) || 0, shortage));
      }
    });
  });
  return [...needs.entries()].map(([key, shortage]) => ({ key, shortage }));
}

function openSpecialDialog(guest) {
  if (state.nightClosed || state.finished) {
    return;
  }

  const dialog = document.querySelector("#trade-dialog");
  document.querySelector("#trade-title").textContent = `柜台前：${guest.name}`;
  const body = document.querySelector("#trade-body");
  const stockNeeds = specialStockNeeds(guest);
  const eventInner = `
    <div class="trade-scene">
      ${keptEchoForGuest(guest)}
      <p>${guestLine(guest)}</p>
      <p>${guest.note}</p>
    </div>
    <div class="special-options">
      ${guest.choices.map((choice) => {
        const availability = specialChoiceState(choice);
        return `
          <button
            class="keepsake-button"
            type="button"
            data-special-choice="${choice.id}"
            ${availability.available ? "" : "disabled"}
          >
            <span>
              <strong>${choice.label}</strong>
              <span>${availability.available ? choice.detail : availability.reason}</span>
            </span>
          </button>
        `;
      }).join("")}
    </div>
    ${stockNeeds.length > 0 ? `
      <div class="special-restock-list">
        <p>货架缺货时，可以在柜台直接补齐；相关选择会自动出现。</p>
        ${stockNeeds.map(({ key, shortage }) => {
          const product = products[key];
          const restockCost = product.cost * shortage;
          const blockedReason = restockBlockedReason(key, shortage);
          return `
            <div class="item-restock special-restock">
              <div>
                <strong>${product.name}还缺 ${shortage} 件</strong>
                <span>补足 ¥${restockCost} · 消耗 ${shortage} 格时间</span>
              </div>
              <button
                class="secondary-button"
                type="button"
                data-special-restock="${key}"
                ${blockedReason ? "disabled" : ""}
              >${blockedReason || `补足 ${shortage} 件 · ¥${restockCost}`}</button>
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}
    <div id="trade-result"></div>
  `;
  body.innerHTML = guestVnShell(guest, eventInner);
  dialog.classList.add("is-vn");
  logVnLine(guest.name, guestLine(guest), currentNight().place);
  logVnLine(guest.name, guest.note, currentNight().place);
  body.querySelector("[data-vn-history]")?.addEventListener("click", openHistoryDialog);

  body.querySelectorAll("[data-special-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = guest.choices.find((item) => item.id === button.dataset.specialChoice);
      completeSpecialChoice(guest, choice);
    });
  });
  body.querySelectorAll("[data-special-restock]").forEach((button) => {
    button.addEventListener("click", () => {
      const need = stockNeeds.find((item) => item.key === button.dataset.specialRestock);
      if (restockProduct(button.dataset.specialRestock, need?.shortage || 1)) {
        openSpecialDialog(guest);
      }
    });
  });
  openDialog(dialog);
}

function completeSpecialChoice(guest, choice) {
  if (!choice || state.stage !== guest.id || state.nightClosed || state.finished) {
    return;
  }

  const availability = specialChoiceState(choice);
  if (!availability.available) {
    showToast(availability.reason);
    playSfx("blocked");
    return;
  }

  playSfx("success");
  logVnChoice(choice.label);
  const effect = choice.effect || {};
  if (Number.isFinite(effect.time)) {
    spendTime(effect.time);
  }
  if (effect.stock) {
    Object.entries(effect.stock).forEach(([key, delta]) => {
      state.stock[key] += delta;
    });
  }
  if (Number.isFinite(effect.cash)) {
    state.cash += effect.cash;
  }
  addFlags(effect.flagsOn || [], effect.flagsOff || []);
  addTransaction(effect.transaction, guest.name);
  if (effect.memory) {
    addMemory(effect.memory);
  }
  state.served[guest.id] = true;
  if (currentNight().interlude && !state.interludesSeen.includes(currentNight().number)) {
    state.flags.pendingInterlude = true;
  }
  markCharacterMet(guest.name);
  unlockAchievement("first-trade");
  advanceStage();
  commit();
  renderSpecialResult(guest, choice);
}

function renderSpecialResult(guest, choice) {
  const result = document.querySelector("#trade-result");
  const specialOptions = document.querySelector("#trade-body .special-options");
  if (!result) {
    return;
  }
  if (specialOptions) {
    specialOptions.hidden = true;
  }
  const memory = choice.effect?.memory || `${guest.name}离开了柜台。`;
  const nextGuest = currentNight().cast.find((item) => item.id === state.stage);
  const continueLabel = nextGuest ? "继续营业 · 下一位" : "回店里收尾";
  result.innerHTML = `
    <div class="trade-result">
      <p>${memory}</p>
      ${choice.quote ? `<blockquote>${choice.quote}</blockquote>` : ""}
      <div class="trade-result-actions">
        ${characterArcIdForName(guest.name) ? `<button class="secondary-button" type="button" id="trade-character">人物前史</button>` : ""}
        <button class="primary-button" type="button" id="trade-continue">${continueLabel}</button>
      </div>
    </div>
  `;
  const characterButton = document.querySelector("#trade-character");
  if (characterButton) {
    characterButton.addEventListener("click", () => openCharacterDialog(characterArcIdForName(guest.name)));
  }
  document.querySelector("#trade-continue").addEventListener("click", () => {
    closeDialog(document.querySelector("#trade-dialog"));
    if (state.flags.pendingInterlude) {
      openInterlude();
      return;
    }
    showToast(choice.effect?.toast || `${guest.name}离开了柜台。`);
  });
}

function openInterlude() {
  const data = currentNight().interlude;
  if (!data) {
    return;
  }
  if (state.stage !== "interlude") {
    state.interludeReturnStage = state.stage;
    state.stage = "interlude";
    saveState();
    render();
  }
  elements.interludeTitle.textContent = data.title;
  elements.interludeBody.innerHTML = `
    <p class="interlude-text">${data.text}</p>
    <div class="interlude-choices">
      ${data.choices.map((choice) => `
        <button class="keepsake-button" type="button" data-interlude-choice="${choice.id}">
          <span>
            <strong>${choice.label}</strong>
            <span>${choice.detail}</span>
          </span>
        </button>
      `).join("")}
    </div>
  `;
  elements.interludeBody.querySelectorAll("[data-interlude-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = data.choices.find((item) => item.id === button.dataset.interludeChoice);
      completeInterlude(choice);
    });
  });
  openDialog(elements.interludeDialog);
}

function completeInterlude(choice) {
  if (!choice) {
    return;
  }
  addFlags(choice.flagsOn || [], choice.flagsOff || []);
  state.flags.interludeDone = true;
  state.interludesSeen ||= [];
  if (!state.interludesSeen.includes(currentNight().number)) {
    state.interludesSeen.push(currentNight().number);
  }
  state.flags.pendingInterlude = false;
  state.stage = state.interludeReturnStage || "end";
  state.interludeReturnStage = null;
  if (choice.memory) {
    addMemory(choice.memory);
  }
  commit();
  closeDialog(elements.interludeDialog);
  playSfx("page");
  if (choice.toast) {
    showToast(choice.toast);
  }
}

function advanceStage() {
  const night = currentNight();
  const cast = night.cast;
  const pair = counterPair(night);
  if (pair.length === 2) {
    const waitingPair = pair.filter((guest) => !state.served[guest.id]);
    if (state.time <= 0) {
      waitingPair.forEach(markGuestSkipped);
      cast
        .filter((guest) => !pair.includes(guest))
        .forEach(markGuestSkipped);
      state.stage = "end";
      return;
    }
    if (waitingPair.length > 0) {
      state.stage = waitingPair[0].id;
      return;
    }
    const next = cast.find((guest) => !pair.includes(guest) && !state.served[guest.id]);
    state.stage = next ? next.id : "end";
    return;
  }

  const index = cast.findIndex((guest) => guest.id === state.stage);
  if (state.time <= 0 && index >= 0 && index < cast.length - 1) {
    cast.slice(index + 1).forEach(markGuestSkipped);
    state.stage = "end";
    return;
  }
  state.stage = index >= 0 && index < cast.length - 1 ? cast[index + 1].id : "end";
}

function markGuestSkipped(guest) {
  if (!state.served[guest.id] && !state.skippedGuests.includes(guest.name)) {
    state.skippedGuests.push(guest.name);
  }
}

function openItemDialog(key) {
  const product = products[key];
  const dialog = document.querySelector("#item-dialog");
  const blockedReason = restockBlockedReason(key);
  const priceLabel = product.price > 0 ? `标价 ¥${product.price}` : "不标价";
  document.querySelector("#item-title").textContent = product.name;
  document.querySelector("#item-body").innerHTML = `
    <div class="item-detail">
      <div class="item-summary">
        <span class="product-icon">${product.icon}</span>
        <span>
          <strong>${product.name} · 剩 ${state.stock[key]} 件</strong>
          <span>${priceLabel} · ${product.origin}</span>
        </span>
      </div>
      <div class="item-notes">
        <div class="item-note">
          <span>普通用途</span>
          <p>${product.commonUse}</p>
        </div>
        <div class="item-note">
          <span>在这里的用途</span>
          <p>${product.specialUse}</p>
        </div>
        <div class="item-note">
          <span>营业提示</span>
          <p>查看商品不耗时间。需要补货时，可以从这里补一件，也可以直接点货架卡片右下角的“补 +1”。</p>
        </div>
      </div>
      <div class="item-restock">
        <div>
          <strong>补进一件${product.name}</strong>
          <span>进价 ¥${product.cost} · 消耗 1 格时间</span>
        </div>
        <button
          class="primary-button"
          id="restock-item"
          type="button"
          ${blockedReason ? "disabled" : ""}
        >
          ${blockedReason || `补一件 · ¥${product.cost}`}
        </button>
      </div>
    </div>
  `;
  document.querySelector("#restock-item").addEventListener("click", () => {
    if (restockProduct(key)) {
      openItemDialog(key);
    }
  });
  openDialog(dialog);
}

function closingChoices() {
  const choices = [];
  if (state.flags.doorUmbrella) {
    choices.push({
      id: "umbrella",
      title: "把阿澄的伞收回门内",
      detail: "下一站也许会有人来找它"
    });
  }
  if (state.flags.unopenedCoffee) {
    choices.push({
      id: "coffee",
      title: "收好沈伯没打开的咖啡",
      detail: "在罐底写下一个模糊的日期"
    });
  }
  if (state.flags.featuredLunchbox) {
    choices.push({
      id: "lunchbox",
      title: "把保温饭盒留在亮处",
      detail: "像替一句话留着位置"
    });
  }
  if (state.flags.wageCoin) {
    choices.push({
      id: "coin",
      title: "把 0217 的旧工资币收进收银盒",
      detail: "那枚硬币没有年份，也没有找零"
    });
  }
  if (state.flags.oldPhoto) {
    choices.push({
      id: "photo",
      title: "把旧照片留在柜台玻璃下",
      detail: "让照片里的雨慢慢干"
    });
  }
  if (state.flags.roadScarf) {
    choices.push({
      id: "scarf",
      title: "把阿澄戴过的红围巾折好",
      detail: "围巾里还留着无名公路的风"
    });
  }
  if (state.flags.travelerPostcard) {
    choices.push({
      id: "postcard",
      title: "收好无名旅人的明信片",
      detail: "字已经消失，收件人的名字还在"
    });
  }
  if (state.flags.travelerVoice) {
    choices.push({
      id: "bottle",
      title: "把玻璃瓶盖紧",
      detail: "里面留着一句已经到达的话"
    });
  }
  if (state.flags.clerkBadge) {
    choices.push({
      id: "badge",
      title: "收好 0217 的旧工牌",
      detail: "她不再只是四个数字"
    });
  }
  if (state.flags.shenTicketLit) {
    choices.push({
      id: "ticket",
      title: "把旧车票夹进记忆册",
      detail: "背面的字只有火光能看见"
    });
  }
  if (state.flags.brokenUmbrellaKept) {
    choices.push({
      id: "brokenUmbrella",
      title: "把断骨的伞留在门边",
      detail: "它撑不开，却替一个人占着位置"
    });
  }
  if (state.flags.flowerInBottle || state.flags.flowerOnCounter) {
    choices.push({
      id: "flower",
      title: "把白花留在柜台上",
      detail: "花不需要地址，只需要有人看见"
    });
  }
  if (state.flags.catFound || state.flags.catTrail) {
    choices.push({
      id: "catTrail",
      title: "把盐粒小路留在钟座下",
      detail: "猫记得自己走过的路"
    });
  }
  if (state.flags.summerSunBottle) {
    choices.push({
      id: "summerBottle",
      title: "把装着夕阳的玻璃瓶留在柜台上",
      detail: "让夏天有一个可以带走的下午"
    });
  }
  if (state.flags.summerFlowerBottle) {
    choices.push({
      id: "summerFlower",
      title: "把最后一束花留在瓶里",
      detail: "花不需要地址，也能在灯下多开一晚"
    });
  }
  if (state.flags.achengSummerScarf) {
    choices.push({
      id: "summerScarf",
      title: "把红围巾折好，留在柜台",
      detail: "有些颜色带走了也不会褪"
    });
  }
  choices.push({
    id: "receipt",
    title: "把今晚的收据夹进记忆册",
    detail: "证明这一夜确实发生过"
  });
  choices.push({
    id: "nothing",
    title: "什么也不特别留下",
    detail: "让门上的灯一盏一盏暗下去"
  });
  return choices;
}

function openClosingDialog(config = {}) {
  if (state.nightClosed || state.finished) {
    showSummary();
    return;
  }

  playSfx("page");
  const dialog = document.querySelector("#closing-dialog");
  const list = document.querySelector("#keepsake-list");
  const waitingGuest = currentGuest();

  if (waitingGuest && config.force !== true) {
    document.querySelector("#closing-title").textContent = "还有人站在柜台前";
    document.querySelector("#closing-intro").textContent =
      `${waitingGuest.name}还没离开。现在关灯，会直接错过这次相遇。`;
    list.replaceChildren();

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.className = "keepsake-button is-primary-choice";
    backButton.innerHTML = `
      <span>
        <strong>回到柜台，先接待${waitingGuest.name}</strong>
        <span>刚才看见的事还来得及回应</span>
      </span>
    `;
    backButton.addEventListener("click", () => {
      closeDialog(dialog);
      elements.customerActions.querySelector("button")?.focus({ preventScroll: true });
      elements.customerScene.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    const forceButton = document.createElement("button");
    forceButton.type = "button";
    forceButton.className = "keepsake-button";
    forceButton.innerHTML = `
      <span>
        <strong>仍然打烊</strong>
        <span>这一夜会少接待一个人，收据也会留下这件事</span>
      </span>
    `;
    forceButton.addEventListener("click", () => openClosingDialog({ force: true }));
    list.append(backButton, forceButton);
    openDialog(dialog);
    return;
  }

  document.querySelector("#closing-title").textContent = currentNight().closingTitle;
  document.querySelector("#closing-intro").textContent = currentNight().closingIntro;
  list.replaceChildren();

  const isFinalNight = currentNight().number === 8;
  const unresolvedArcs = unresolvedCharacterArcs();
  if (isFinalNight) {
    const keptLabels = {
      umbrella: "阿澄的伞",
      coffee: "沈伯的咖啡",
      lunchbox: "保温饭盒",
      coin: "旧工资币",
      photo: "旧照片",
      scarf: "红围巾",
      postcard: "明信片",
      bottle: "玻璃瓶",
      badge: "旧工牌",
      ticket: "旧车票",
      brokenUmbrella: "断骨的伞",
      flower: "白花",
      catTrail: "猫的盐粒小路",
      summerBottle: "装着夕阳的玻璃瓶",
      summerFlower: "最后一束花",
      summerScarf: "红围巾"
    };
    const keptText = state.keptItems.length > 0
      ? ` 跟着店留下的：${state.keptItems.map((id) => keptLabels[id] || id).join("、")}。`
      : " 没有前夜留下物跟着店来到这里。";
    const regretText = unresolvedArcs.length > 0
      ? ` 仍保留遗憾：${unresolvedArcs.map((arc) => arc.name).join("、")}。`
      : " 所有人都已经给出自己的回答。";
    document.querySelector("#closing-intro").textContent =
      `${currentNight().closingIntro}${keptText}${regretText}`;
  }
  const choices = isFinalNight
    ? [
        {
          id: "openParcel",
          title: "拆开包裹，把里面的五页交给他们",
          detail: state.flags.parcelOnCounter
            ? "五种遗憾会被摊开，也会被各自收下"
            : "包裹还压在柜台下。先完成今夜的小事，把它放上柜台。",
          disabled: !state.flags.parcelOnCounter
        },
        {
          id: "sealParcel",
          title: "重新封好包裹，让店继续上路",
          detail: "遗憾会继续跟着店，去往下一段夜路"
        }
      ]
    : closingChoices();

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "keepsake-button";
    button.disabled = Boolean(choice.disabled);
    button.innerHTML = `
      <span>
        <strong>${choice.title}</strong>
        <span>${choice.detail}</span>
      </span>
    `;
    button.addEventListener("click", () => finishShift(choice.id));
    list.append(button);
  });
  openDialog(dialog);
}

function finishShift(choice) {
  if (choice === "openParcel" && !state.flags.parcelOnCounter) {
    showToast("包裹还压在柜台下。先把它放上柜台。");
    playSfx("blocked");
    return;
  }
  const skippedGuest = currentGuest();
  if (skippedGuest) {
    state.skippedGuest = skippedGuest.name;
    if (!state.skippedGuests.includes(skippedGuest.name)) {
      state.skippedGuests.push(skippedGuest.name);
    }
    addMemory(`打烊时，${skippedGuest.name}还站在柜台前。你没有听完这一晚的话。`);
  }
  state.closingChoice = choice;
  if (
    currentNight().number < 8 &&
    !["receipt", "nothing"].includes(choice) &&
    !state.keptItems.includes(choice)
  ) {
    state.keptItems.push(choice);
  }
  state.nightClosed = true;
  awardPassTicket();
  addMemory(CONTENT.closingMemories[choice] || "你在打烊前留下了一件小事。");
  state.finished = currentNight().number === 8;
  if (currentNight().number === 1) {
    unlockAchievement("first-night");
  }
  if (currentNight().number === 8) {
    if (resolvedCharacterArcs().length === 5) {
      unlockAchievement("all-arcs");
    }
    unlockAchievement(choice === "openParcel" ? "opened-parcel" : "sealed-parcel");
  }
  commit();
  closeDialog(document.querySelector("#closing-dialog"));
  if (currentNight().number === 8) {
    startFinale(choice);
  } else {
    showSummary();
  }
}

function receiptRows() {
  const rows = [];
  if (state.flags.lostDrift) {
    rows.push(["来路", "无票漂移 · 收银台少了 ¥5"]);
  }
  if (state.flags.doorUmbrella) {
    rows.push(["阿澄的伞", "留在门边"]);
  }
  if (state.flags.unopenedCoffee) {
    rows.push(["沈伯的咖啡", "还有一罐未开封"]);
  }
  if (state.flags.wageCoin) {
    rows.push(["0217 的工资币", "在收银盒里"]);
  }
  if (state.flags.oldPhoto) {
    rows.push(["旧照片", "压在玻璃下"]);
  }
  if (state.flags.parcelOnCounter) {
    rows.push(["没有收件人的包裹", "在柜台中央"]);
  }
  if (state.flags.roadScarf) {
    rows.push(["阿澄的红围巾", "留在店里"]);
  }
  if (state.flags.travelerVoice) {
    rows.push(["玻璃瓶里的声音", "还没有散"]);
  }
  if (state.flags.clerkBadge) {
    rows.push(["0217 的旧工牌", "在收银盒里"]);
  }
  if (state.flags.shenTicketLit) {
    rows.push(["旧车票", "被火光照过"]);
  }
  if (currentNight().number === 8) {
    unresolvedCharacterArcs().forEach((arc) => {
      rows.push([`仍保留遗憾 · ${arc.name}`, arc.incomplete]);
    });
  }
  if (state.skippedGuests.length > 0) {
    rows.push(["没接待的人", state.skippedGuests.join("、")]);
  }
  return rows;
}

function overallFinaleData(choice) {
  const unresolved = unresolvedCharacterArcs();
  if (choice === "sealParcel") {
    if (unresolved.length === 0) {
      return CONTENT.finale.overall.sealParcelFull;
    }
    if (unresolved.length === 5) {
      return CONTENT.finale.overall.sealParcel;
    }
    return CONTENT.finale.overall.sealParcelPartial;
  }
  if (unresolved.length === 0) {
    return CONTENT.finale.overall.openParcel.full;
  }
  if (unresolved.length === 5) {
    return CONTENT.finale.overall.openParcel.none;
  }
  return CONTENT.finale.overall.openParcel.partial;
}

function buildNightOpeningSteps() {
  const night = currentNight();
  const first = night.cast[0];
  const arc = characterArcEntries().find((item) => item.name === first.name);
  const sceneByArc = {
    acheng: "counter",
    shen: "shen",
    clerk: "clerk",
    xiaoman: "xiaoman",
    traveler: "traveler"
  };
  const steps = [
    {
      speaker: "旁白",
      text: `第 ${night.number} 夜，${night.place}。${night.weather}。店里的六盏灯一盏一盏亮起来。`,
      scene: "rain",
      sceneLabel: `第 ${night.number} 夜 · ${night.place}`
    },
    {
      speaker: "旁白",
      text: "柜台下的包裹轻轻动了一下。里面有一页信，认出了门外的人。",
      scene: "counter",
      sceneLabel: "包裹 · 一页信"
    }
  ];

  if (arc) {
    steps.push({
      speaker: arc.name,
      text: arc.waiting,
      character: arc.initial,
      portrait: arc.id,
      role: arc.role,
      scene: sceneByArc[arc.id] || "counter",
      sceneLabel: `门外 · ${arc.name}`
    });
  } else {
    steps.push({
      speaker: first.name,
      text: first.line,
      character: first.initial,
      portrait: portraitIdForName(first.name),
      role: first.arrival,
      scene: first.avatarClass || "counter",
      sceneLabel: `门外 · ${first.name}`
    });
  }

  steps.push({
    speaker: "旁白",
    text: night.number === 1
      ? "五个人都在等第一班车。包裹里有五封没有送出的信；这间店，是他们最后的地址。"
      : "他们还在等同一班车。只是每个人等的，不是同一件东西。",
    scene: "door",
    sceneLabel: "同一班车"
  });
  return steps;
}

function startNightOpening() {
  if (state.nightClosed || state.finished) {
    return;
  }
  finaleMode = "night-open";
  finaleSteps = buildNightOpeningSteps();
  finaleIndex = 0;
  document.body.classList.add("finale-active");
  if (!elements.finaleDialog.open) {
    elements.finaleDialog.showModal();
  }
  showFinaleStep();
}

function buildFinaleSteps(choice) {
  const data = CONTENT.finale;
  const sceneByArc = {
    acheng: "counter",
    shen: "shen",
    clerk: "clerk",
    xiaoman: "xiaoman",
    traveler: "traveler"
  };
  const steps = [
    {
      speaker: "旁白",
      text: data.opening[0],
      scene: "rain",
      sceneLabel: "终章 · 第一班车"
    },
    {
      speaker: "旁白",
      text: data.opening[1],
      scene: "counter",
      sceneLabel: "终章 · 柜台中央"
    }
  ];

  ["acheng", "shen", "clerk", "xiaoman", "traveler"].forEach((id) => {
    const arc = CONTENT.characterArcs[id];
    const resolved = Boolean(state.flags[arc.closureFlag]);
    const ending = data.characters[id][resolved ? "resolved" : "unresolved"];
    steps.push({
      speaker: arc.name,
      text: ending.text,
      title: ending.title,
      character: arc.initial,
      portrait: id,
      role: arc.role,
      scene: sceneByArc[id] || "counter",
      sceneLabel: `终章 · ${arc.name}`
    });
  });

  const overall = overallFinaleData(choice);
  steps.push({
    speaker: "旁白",
    text: overall.text,
    title: overall.title,
    scene: choice === "sealParcel" ? "door" : "counter",
    sceneLabel: "终章 · 总体结局"
  });

  const unresolved = unresolvedCharacterArcs();
  if (choice === "openParcel" && unresolved.length > 0 && unresolved.length < 5) {
    steps.push({
      speaker: "旁白",
      text: `还没读到自己的那一页：${unresolved.map((arc) => arc.name).join("、")}。`,
      scene: "counter",
      sceneLabel: "终章 · 没有读完的页"
    });
  }

  steps.push({
    speaker: "旁白",
    text: data.closing,
    scene: "rain",
    sceneLabel: "终章 · 店又向前走了一夜"
  });
  return steps;
}

function startFinale(choice) {
  finaleMode = "finale";
  finaleChoice = choice;
  finaleSteps = buildFinaleSteps(choice);
  finaleIndex = 0;
  document.body.classList.add("finale-active");
  if (!elements.finaleDialog.open) {
    elements.finaleDialog.showModal();
  }
  showFinaleStep();
}

function showFinaleStep() {
  const step = finaleSteps[finaleIndex];
  if (!step) {
    finishFinale();
    return;
  }
  clearTimeout(finaleTimer);
  finaleTypeComplete = false;
  finaleCurrentText = step.text || "";
  elements.finaleStage.dataset.scene = step.scene || "rain";
  elements.finaleSceneLabel.textContent = step.sceneLabel || "终章 · 第一班车";
  elements.finaleSpeaker.textContent = step.speaker || "旁白";
  elements.finaleCharacter.hidden = !step.character;
  elements.finaleCharacterInitial.textContent = step.character || "";
  elements.finaleCharacterRole.textContent = step.role || step.speaker || "";
  const portraitName = step.portrait && CONTENT.characterArcs[step.portrait]
    ? CONTENT.characterArcs[step.portrait].name
    : step.speaker;
  elements.finaleCharacterPortrait.innerHTML = step.character ? portraitSvg(portraitName) : "";
  elements.finaleNext.hidden = true;
  elements.finaleHint.textContent = "点击或按空格继续";
  elements.finaleContinue.textContent = finaleIndex >= finaleSteps.length - 1
    ? (finaleMode === "night-open" ? "开门营业" : "查看收据与结局")
    : "继续";
  logVnLine(step.speaker, finaleCurrentText, step.sceneLabel || "终章");
  typeFinaleText(finaleCurrentText);
}

function typeFinaleText(text) {
  elements.finaleText.textContent = "";
  elements.finaleNext.hidden = true;
  const characters = Array.from(text);
  if (characters.length === 0) {
    completeFinaleText();
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.finaleText.textContent = text;
    completeFinaleText();
    return;
  }

  let index = 0;
  const tick = () => {
    const character = characters[index];
    if (index % 3 === 0 && !"。！？，、；：".includes(character)) {
      playSfx("type");
    }
    const glyph = document.createElement("span");
    glyph.className = "vn-char";
    glyph.textContent = character;
    elements.finaleText.append(glyph);
    index += 1;
    if (index >= characters.length) {
      completeFinaleText();
      return;
    }
    finaleTimer = window.setTimeout(tick, characterRevealDelay(character));
  };
  tick();
}

function completeFinaleText() {
  clearTimeout(finaleTimer);
  if (elements.finaleText.textContent !== finaleCurrentText) {
    elements.finaleText.textContent = finaleCurrentText;
  }
  finaleTypeComplete = true;
  elements.finaleNext.hidden = false;
  elements.finaleHint.textContent = finaleIndex >= finaleSteps.length - 1
    ? (finaleMode === "night-open" ? "准备好后开门" : "准备好后结束终章")
    : "点击或按空格继续";
}

function advanceFinale() {
  if (!elements.finaleDialog.open) {
    return;
  }
  if (!finaleTypeComplete) {
    completeFinaleText();
    playSfx("advance");
    return;
  }
  if (finaleIndex >= finaleSteps.length - 1) {
    finishFinale();
    return;
  }
  finaleIndex += 1;
  showFinaleStep();
  playSfx("advance");
}

function finishFinale() {
  clearTimeout(finaleTimer);
  closeDialog(elements.finaleDialog);
  document.body.classList.remove("finale-active");
  if (finaleMode === "night-open") {
    state.openedNights ||= [];
    if (!state.openedNights.includes(currentNight().number)) {
      state.openedNights.push(currentNight().number);
    }
    saveState();
    render();
    playSfx("door");
    elements.customerActions.querySelector("button")?.focus({ preventScroll: true });
    return;
  }
  showSummary();
  playSfx("page");
}

function showSummary() {
  const night = currentNight();
  if (night.number === 8) {
    playSfx("door");
    window.GameAudio?.fadeAmbience();
  } else {
    playSfx("success");
  }
  const route = currentRoute();
  const requirement = nightPassRequirement(night);
  const ticketEarned = ticketAwardedForNight(night.number);
  const dialog = document.querySelector("#summary-dialog");
  const body = document.querySelector("#summary-body");
  const transactions = state.transactions.filter((item) => item.night === night.number);
  const total = transactions.reduce((sum, item) => sum + item.amount, 0);
  const closingMemory = state.memories.at(-1)?.text || "今晚没有留下记忆。";
  const servedNames = night.cast
    .filter((guest) => state.served[guest.id])
    .map((guest) => guest.name)
    .join("、") || "无";
  const transactionRows = transactions.length > 0
    ? transactions.map((item) => `
        <li>
          <span>${item.customer} · ${item.label}</span>
          <span>¥${item.amount}</span>
        </li>
      `).join("")
    : `<li><span>今晚没有完成交易</span><span>¥0</span></li>`;
  const detailRows = receiptRows()
    .map(([label, value]) => `<li><span>${label}</span><span>${value}</span></li>`)
    .join("");

  let actions = "";
  let ending = "";
  let finaleRecap = "";
  const ticketCostLabel = state.tickets > 0 ? "1 张车票" : "无票漂流 · -¥5";
  const passCopy = requirement.met
    ? `通行条件已达成。${requirement.channel}给了你一张车票。`
    : "通行条件未达成。没有拿到车票，出发时店会无票漂流，并损失 ¥5。";
  if (night.number === 1) {
    actions = `
      <p class="receipt-route-copy">${passCopy} 咖啡罐上的站名和伞尖的温水指向两个方向。下一站只能先去一个地方。</p>
      <div class="route-choices">
        <button class="keepsake-button" type="button" data-next-route="station">
          <span>
            <strong>前往无眠车站</strong>
            <span>${CONTENT.routes.station.clue}</span>
          </span>
          <span class="route-cost">${ticketCostLabel}</span>
        </button>
        <button class="keepsake-button" type="button" data-next-route="summer">
          <span>
            <strong>前往倒着走的夏天</strong>
            <span>${CONTENT.routes.summer.clue}</span>
          </span>
          <span class="route-cost">${ticketCostLabel}</span>
        </button>
      </div>
    `;
  } else if (night.number < 8) {
    const nextNight = nightAtIndex(state.nightIndex + 1);
    const routeCopy = state.tickets <= 0
      ? `${passCopy} 店会放弃方向，被动漂移到下一处。`
      : night.number === 2
        ? `${route.summary} 明天，店会再向里走一夜。`
        : night.number === 3
          ? "两条线索在前方短暂汇合。导航失效后，店会停在没有名字的公路边。"
          : `门外还有${nextNight.weather}。第 ${nextNight.number} 夜会从${nextNight.place}重新亮灯。`;
    actions = `
      <p class="receipt-route-copy">${passCopy} ${routeCopy}</p>
      <button class="primary-button" type="button" id="next-night">${state.tickets <= 0 ? `无票漂流 · 第 ${nextNight.number} 夜 · -¥5` : `前往第 ${nextNight.number} 夜 · ${nextNight.place}`}</button>
    `;
  } else {
    const unresolved = unresolvedCharacterArcs();
    const overall = overallFinaleData(state.closingChoice);
    const recapRows = ["acheng", "shen", "clerk", "xiaoman", "traveler"].map((id) => {
      const arc = CONTENT.characterArcs[id];
      const resolved = Boolean(state.flags[arc.closureFlag]);
      const item = CONTENT.finale.characters[id][resolved ? "resolved" : "unresolved"];
      return `
        <div class="finale-recap-row">
          <div>
            <strong>${arc.name}</strong>
            <span>${item.title}</span>
          </div>
          <p>${item.text}</p>
        </div>
      `;
    }).join("");
    finaleRecap = `
      <section class="finale-recap">
        <h3>终章 · 人物结局</h3>
        ${recapRows}
      </section>
    `;
    ending = `
      <div class="ending-card">
        <span>${overall.title}</span>
        <p>${overall.text}</p>
      </div>
    `;
    actions = `
      <button class="secondary-button" type="button" id="replay-finale">重看终章</button>
      <button class="secondary-button" type="button" id="summary-characters">查看人物档案</button>
      <button class="primary-button" type="button" id="restart-night">从第一夜重新开始</button>
    `;
  }

  body.innerHTML = `
    <div class="receipt">
      <div class="receipt-brand">
        <span>WORLD'S END · 营业收据</span>
        <h2 id="summary-title">第 ${night.number} 夜，打烊了</h2>
        <span>${night.place} · ${clockLabel()}</span>
      </div>
      <div class="receipt-rule"></div>
      <ul class="receipt-list">
        ${transactionRows}
        ${state.suppliesCost > 0 ? `<li><span>补货支出</span><span>-¥${state.suppliesCost}</span></li>` : ""}
        ${detailRows}
        <li><span>上车条件</span><span>${requirement.met ? "已达成" : "未达成"}</span></li>
        <li><span>拿到的车票</span><span>${night.number === 8 ? "最后一夜" : ticketEarned ? "获得 1 张" : "没有获得"}</span></li>
        <li><span>手上的车票</span><span>${state.tickets} 张</span></li>
        <li><span>今晚回来的人</span><span>${servedNames}</span></li>
        <li><span>今晚记住的事</span><span>${state.memories.filter((item) => item.night === night.number).length} 件</span></li>
      </ul>
      <div class="receipt-total">
        <span>今晚收入</span>
        <strong>¥${total}</strong>
      </div>
      <div class="receipt-cash">
        <span>打烊时现金</span>
        <span>¥${state.cash}</span>
      </div>
      <div class="receipt-rule"></div>
      <div class="receipt-memory">
        <span>最后留下</span>
        ${closingMemory}
      </div>
      ${finaleRecap}
      ${ending}
      <div class="receipt-actions receipt-actions-stack">
        ${actions}
        ${night.number < 8 ? '<button class="text-button" type="button" id="restart-night">重新走完首章</button>' : ""}
      </div>
    </div>
  `;

  body.querySelectorAll("[data-next-route]").forEach((button) => {
    button.addEventListener("click", () => startNextNight(button.dataset.nextRoute));
  });
  body.querySelector("#next-night")?.addEventListener("click", () => startNextNight());
  body.querySelector("#summary-characters")?.addEventListener("click", () => {
    closeDialog(dialog);
    openCharacterDialog();
  });
  body.querySelector("#replay-finale")?.addEventListener("click", () => {
    closeDialog(dialog);
    startFinale(state.closingChoice);
  });
  body.querySelector("#restart-night")?.addEventListener("click", resetGame);
  openDialog(dialog);
}

function startNextNight(routeId = null) {
  if (state.nightIndex >= 7) {
    return;
  }

  if (state.nightIndex === 0) {
    if (!routeId || !CONTENT.routes[routeId]) {
      return;
    }
    state.route = routeId;
    unlockAchievement(routeId === "station" ? "station-route" : "summer-route");
  }
  playSfx("door");
  window.GameAudio?.restoreAmbience();

  const hasTicket = state.tickets > 0;
  if (hasTicket) {
    state.tickets -= 1;
  } else {
    state.flags.lostDrift = true;
    state.cash = Math.max(0, state.cash - 5);
  }
  state.nightIndex += 1;
  state.time = SHIFT_LENGTH;
  introduceLocalStock(currentNight());
  state.stage = currentNight().cast[0].id;
  state.served = {};
  state.suppliesCost = 0;
  state.skippedGuest = null;
  state.skippedGuests = [];
  state.closingChoice = null;
  state.nightClosed = false;
  state.finished = false;
  addMemory(
    hasTicket
      ? `店在${currentNight().place}重新亮起了六盏灯。`
      : "没有车票。店没有按你选的方向走，被雾推进下一处，收银台少了 ¥5。"
  );
  closeDialog(document.querySelector("#summary-dialog"));
  commit();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (!state.openedNights.includes(currentNight().number)) {
    startNightOpening();
  } else {
    showToast(hasTicket
      ? `第 ${currentNight().number} 夜：${currentNight().place}`
      : "没有车票，店被动漂移，损失 ¥5。");
  }
}

function startPrologue() {
  prologueIndex = 0;
  prologueBranch = null;
  renderPrologueStep();
}

function openIntroDialog() {
  document.body.classList.add("intro-active");
  startPrologue();
  openDialog(document.querySelector("#intro-dialog"));
}

function renderPrologueStep() {
  const step = CONTENT.prologue.steps[prologueIndex];
  if (!step) {
    return;
  }

  clearTimeout(typeTimer);
  const text = step.branch ? step.branch[prologueBranch] : step.text;
  prologueLines = splitVnLines(text || "");
  prologueLineIndex = 0;
  typeComplete = false;

  elements.vnStage.dataset.scene = step.scene || "counter";
  elements.vnSceneLabel.textContent = step.sceneLabel;
  elements.vnSpeaker.textContent = step.speaker;
  elements.vnCharacter.hidden = !step.character;
  elements.vnCharacterInitial.textContent = step.character || "";
  elements.vnCharacterRole.textContent = step.speaker;
  elements.vnCharacterPortrait.innerHTML = step.character ? portraitSvg(step.speaker) : "";
  elements.vnChoices.replaceChildren();
  elements.vnChoices.hidden = true;
  elements.vnTips.replaceChildren();
  elements.vnTips.hidden = true;
  elements.startShift.hidden = true;
  elements.vnNext.hidden = true;
  elements.vnSkip.hidden = Boolean(step.finish);
  elements.vnHint.textContent = "点击或按空格继续";

  if (step.choices) {
    step.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "vn-choice";
      button.innerHTML = `
        <strong>${choice.label}</strong>
        <span>${choice.detail}</span>
      `;
      button.addEventListener("click", () => choosePrologueOption(choice));
      elements.vnChoices.append(button);
    });
  }

  showPrologueLine();
}

function splitVnLines(text) {
  const raw = Array.from(text.matchAll(/[^。！？；\n]+[。！？；]?[”』"’]?/g))
    .map((match) => match[0].trim())
    .filter(Boolean);
  const lines = [];
  raw.forEach((line) => {
    const previous = lines[lines.length - 1];
    const canMerge = previous &&
      previous.length < 12 &&
      !/[？！]$/.test(previous) &&
      previous.length + line.length <= 34;
    if (canMerge) {
      lines[lines.length - 1] = previous + line;
    } else {
      lines.push(line);
    }
  });
  return lines;
}

function showPrologueLine() {
  const step = CONTENT.prologue.steps[prologueIndex];
  const line = prologueLines[prologueLineIndex] || "";
  currentPrologueText = line;
  typeComplete = false;
  logVnLine(step.speaker, line, step.sceneLabel);
  typePrologueText(line);
}

function typePrologueText(text) {
  elements.vnText.textContent = "";
  elements.vnNext.hidden = true;
  const characters = Array.from(text);
  if (characters.length === 0) {
    completePrologueText();
    return;
  }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.vnText.textContent = text;
    completePrologueText();
    return;
  }

  let index = 0;
  const tick = () => {
    const character = characters[index];
    if (index % 3 === 0 && !"。！？，、；：".includes(character)) {
      playSfx("type");
    }
    const glyph = document.createElement("span");
    glyph.className = "vn-char";
    glyph.textContent = character;
    elements.vnText.append(glyph);
    index += 1;
    if (index >= characters.length) {
      completePrologueText();
      return;
    }
    typeTimer = window.setTimeout(tick, characterRevealDelay(character));
  };
  tick();
}

function characterRevealDelay(character) {
  const speedFactor = settings.textSpeed === "slow" ? 1.7 : settings.textSpeed === "fast" ? 0.5 : 1;
  let base = 26;
  if ("。！？".includes(character)) {
    base = 190;
  } else if ("，、；：".includes(character)) {
    base = 95;
  } else if (character === "…") {
    base = 160;
  } else if ("”』」".includes(character)) {
    base = 70;
  }
  return Math.max(9, Math.round(base * speedFactor));
}

function completePrologueText() {
  clearTimeout(typeTimer);
  if (elements.vnText.textContent !== currentPrologueText) {
    elements.vnText.textContent = currentPrologueText;
  }
  typeComplete = true;
  const step = CONTENT.prologue.steps[prologueIndex];
  const onLastLine = prologueLineIndex >= prologueLines.length - 1;

  if (onLastLine && step.tips) {
    elements.vnTips.replaceChildren();
    step.tips.forEach((tip) => {
      const item = document.createElement("li");
      item.textContent = tip;
      elements.vnTips.append(item);
    });
  }
  elements.vnTips.hidden = !(onLastLine && step.tips);
  elements.vnChoices.hidden = !(onLastLine && step.choices);
  elements.startShift.hidden = !(onLastLine && step.finish);
  elements.vnNext.hidden = onLastLine && (step.choices || step.finish);

  if (onLastLine && step.choices) {
    elements.vnHint.textContent = "选择一个回应";
  } else if (onLastLine && step.finish) {
    elements.vnHint.textContent = "准备好后打开店门";
  } else {
    elements.vnHint.textContent = "点击或按空格继续";
  }
}

function advancePrologue() {
  const step = CONTENT.prologue.steps[prologueIndex];
  if (!step) {
    return;
  }
  if (!typeComplete) {
    completePrologueText();
    playSfx("advance");
    return;
  }
  if (prologueLineIndex < prologueLines.length - 1) {
    prologueLineIndex += 1;
    showPrologueLine();
    playSfx("advance");
    return;
  }
  if (step.choices || step.finish) {
    return;
  }
  prologueIndex += 1;
  playSfx("page");
  renderPrologueStep();
}

function choosePrologueOption(choice) {
  prologueBranch = choice.id;
  state.flags[choice.flag] = true;
  logVnChoice(choice.label);
  playSfx("page");
  prologueIndex += 1;
  renderPrologueStep();
}

function finishPrologue() {
  clearTimeout(typeTimer);
  playSfx("door");
  const prologueMemories = {
    shelf: "你醒来后先检查了货架，发现商品在这里似乎不只有一种用途。",
    door: "你醒来后先听见了门外的呼吸。第一夜还没有开始，已经有人在等。",
    hands: "你醒来后先看了看自己的手。你想不起过去，但这双手知道怎样把灯打开。"
  };
  if (prologueBranch && !state.flags.prologueMemoryWritten) {
    addMemory(prologueMemories[prologueBranch]);
    state.flags.prologueMemoryWritten = true;
  }
  state.introSeen = true;
  state.openedNights ||= [];
  if (!state.openedNights.includes(1)) {
    state.openedNights.push(1);
  }
  saveState();
  closeDialog(document.querySelector("#intro-dialog"));
  document.body.classList.remove("intro-active");
  render();
  elements.customerActions.querySelector("button")?.focus({ preventScroll: true });
}

function logVnLine(speaker, text, sceneLabel) {
  if (!text) {
    return;
  }
  vnHistory.push({ type: "line", speaker, text, sceneLabel });
  if (vnHistory.length > 300) {
    vnHistory.splice(0, vnHistory.length - 300);
  }
}

function logVnChoice(label) {
  if (!label) {
    return;
  }
  vnHistory.push({ type: "choice", speaker: "你", text: label });
  if (vnHistory.length > 300) {
    vnHistory.splice(0, vnHistory.length - 300);
  }
}

function openHistoryDialog() {
  renderHistory();
  const dialog = elements.historyDialog;
  if (!dialog.open) {
    dialog.showModal();
  }
}

function renderHistory() {
  const list = elements.historyList;
  list.replaceChildren();
  if (vnHistory.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "还没有说过的话。序章与柜台前的对话会记在这里。";
    list.append(empty);
    return;
  }

  vnHistory.forEach((entry) => {
    const item = document.createElement("div");
    item.className = `history-entry${entry.type === "choice" ? " is-choice" : ""}`;
    item.innerHTML = `
      <div class="history-entry-head">
        <strong>${entry.speaker}</strong>
        <span>${entry.sceneLabel || ""}</span>
      </div>
      <p>${entry.text}</p>
    `;
    list.append(item);
  });
  list.scrollTop = list.scrollHeight;
}

function characterArcIdForName(name) {
  const entry = Object.entries(CONTENT.characterArcs).find(([, arc]) => arc.name === name);
  return entry ? entry[0] : null;
}

function markCharacterMet(name) {
  const id = characterArcIdForName(name);
  if (!id) {
    return false;
  }
  state.metCharacters ||= [];
  if (state.metCharacters.includes(id)) {
    return false;
  }
  state.metCharacters.push(id);
  return true;
}

function renderCharacterCount() {
  if (!elements.characterNavCount) {
    return;
  }
  const total = Object.keys(CONTENT.characterArcs).length;
  const met = (state.metCharacters || []).length;
  elements.characterNavCount.textContent = `${met} / ${total}`;
}

function openCharacterDialog(expandId) {
  renderCharacters(expandId);
  if (!elements.characterDialog.open) {
    elements.characterDialog.showModal();
  }
}

function openSettingsDialog() {
  renderSettings();
  if (!elements.settingsDialog.open) {
    elements.settingsDialog.showModal();
  }
}

function renderSettings() {
  const master = Math.round(settings.master * 100);
  const bgm = Math.round(settings.bgm * 100);
  const sfx = Math.round(settings.sfx * 100);
  elements.settingMaster.value = String(master);
  elements.settingBgm.value = String(bgm);
  elements.settingSfx.value = String(sfx);
  elements.settingMasterValue.textContent = `${master}%`;
  elements.settingBgmValue.textContent = `${bgm}%`;
  elements.settingSfxValue.textContent = `${sfx}%`;
  elements.settingMuted.checked = settings.muted;
  document.querySelectorAll("[data-text-speed]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.textSpeed === settings.textSpeed);
  });
}

function renderCharacters(expandId) {
  const list = elements.characterList;
  if (!list) {
    return;
  }
  list.replaceChildren();
  const met = state.metCharacters || [];
  const finalReveal = Boolean(state.finished && state.closingChoice === "openParcel");

  Object.entries(CONTENT.characterArcs).forEach(([id, arc]) => {
    const unlocked = met.includes(id) || finalReveal;
    const card = document.createElement("article");
    card.className = `character-card${unlocked ? " is-unlocked" : " is-locked"}`;
    card.dataset.characterId = id;

    if (!unlocked) {
      card.innerHTML = `
        <div class="character-card-head">
          <span class="character-avatar">${arc.initial || "?"}</span>
          <span class="character-summary">
            <strong>${arc.name}</strong>
            <span>还没有接待过</span>
          </span>
        </div>
        <p class="character-locked-note">${arc.lockedHint || "在柜台前接待这个人，才能读到完整前史。"}</p>
      `;
      list.append(card);
      return;
    }

    const letterUnlocked = finalReveal;
    card.innerHTML = `
      <details>
        <summary class="character-card-head">
          <span class="character-avatar">${arc.initial || arc.name.slice(0, 1)}</span>
          <span class="character-summary">
            <strong>${arc.name}${arc.realName ? ` · ${arc.realName}` : ""}</strong>
            <span>${arc.role || ""}</span>
          </span>
          <span class="character-question">${arc.question}</span>
        </summary>
        <div class="character-body">
          <p class="character-summary-line">${arc.summary || ""}</p>
          ${arc.innerVoice ? `<blockquote class="character-self-voice">${arc.innerVoice}</blockquote>` : ""}
          ${(arc.past || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
          <div class="character-note">
            <strong>在等什么</strong>
            <p>${arc.waiting || ""}</p>
          </div>
          <div class="character-note">
            <strong>留下的东西</strong>
            <p>${arc.keepsake || ""}</p>
          </div>
          <div class="character-note">
            <strong>说话方式</strong>
            <p>${arc.voice || ""}</p>
          </div>
          ${letterUnlocked ? `
            <blockquote class="character-letter">
              <span>包裹里的那一页</span>
              <p>${arc.letter || ""}</p>
            </blockquote>
          ` : `
            <div class="character-note">
              <strong>包裹里的那一页</strong>
              <p>还压在包裹最底下。只有真正拆开包裹之后，才能读到。</p>
            </div>
          `}
        </div>
      </details>
    `;
    if (id === expandId) {
      card.querySelector("details").open = true;
    }
    list.append(card);
  });
}

function openMemoryDialog() {
  const dialog = document.querySelector("#memory-dialog");
  const list = document.querySelector("#memory-list");
  const intro = document.querySelector("#memory-intro");
  const wrapper = document.createElement("div");
  wrapper.className = "memory-list";

  if (state.memories.length === 0) {
    wrapper.innerHTML = `
      <div class="memory-empty-large">
        还没有记录。接待一位常客，或者让一件商品离开货架。
      </div>
    `;
  } else {
    state.memories.forEach((memory, index) => {
      const entry = document.createElement("div");
      entry.className = "memory-entry";
      entry.innerHTML = `
        <div>
          <p>${memory.text}</p>
          <time>第 ${memory.night || 1} 夜 · ${memory.place || "雾港公交站"} · ${memory.time}</time>
        </div>
      `;
      wrapper.append(entry);
      console.assert(entry.textContent.length > 0, `Memory ${index} must have text`);
    });
  }

  list.replaceChildren(wrapper);
  intro.hidden = state.memories.length > 0;
  openDialog(dialog);
}

function openDialog(dialog) {
  dialogIds.forEach((id) => {
    const other = document.querySelector(`#${id}`);
    if (other !== dialog && other.open) {
      other.close();
    }
  });
  if (!dialog.open) {
    dialog.showModal();
  }
}

function closeDialog(dialog) {
  if (dialog?.open) {
    dialog.close();
  }
}

function resetGame() {
  vnHistory.length = 0;
  window.GameAudio?.restoreAmbience();
  state = createInitialState();
  dialogIds.forEach((id) => closeDialog(document.querySelector(`#${id}`)));
  closeDialog(elements.characterDialog);
  closeDialog(elements.historyDialog);
  closeDialog(elements.settingsDialog);
  document.body.classList.remove("finale-active");
  saveState();
  render();
  if (!state.introSeen) {
    openIntroDialog();
  } else {
    showToast("首章从第一夜重新开始了。");
  }
}

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    closeDialog(document.querySelector(`#${button.dataset.close}`));
  });
});

dialogIds.forEach((id) => {
  const dialog = document.querySelector(`#${id}`);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && id !== "intro-dialog" && id !== "interlude-dialog" && id !== "finale-dialog") {
      dialog.close();
    }
  });
});

document.querySelector("#intro-dialog").addEventListener("cancel", (event) => {
  event.preventDefault();
});
elements.interludeDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});
elements.finaleDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
});
elements.finaleDialogue.addEventListener("click", (event) => {
  if (!event.target.closest("button")) {
    advanceFinale();
  }
});
elements.finaleStage.addEventListener("click", advanceFinale);
elements.finaleContinue.addEventListener("click", advanceFinale);
elements.vnDialogue.addEventListener("click", (event) => {
  if (!event.target.closest("button")) {
    advancePrologue();
  }
});
elements.vnStage.addEventListener("click", advancePrologue);
elements.vnHistory.addEventListener("click", openHistoryDialog);
elements.vnSettings.addEventListener("click", openSettingsDialog);
elements.vnSkip.addEventListener("click", finishPrologue);
elements.startShift.addEventListener("click", finishPrologue);
elements.historyDialog.addEventListener("click", (event) => {
  if (event.target === elements.historyDialog) {
    elements.historyDialog.close();
  }
});
elements.characterDialog.addEventListener("click", (event) => {
  if (event.target === elements.characterDialog) {
    elements.characterDialog.close();
  }
});
elements.settingsDialog.addEventListener("click", (event) => {
  if (event.target === elements.settingsDialog) {
    elements.settingsDialog.close();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key !== " " && event.key !== "Enter") {
    return;
  }
  if (event.target instanceof Element && event.target.closest("button")) {
    return;
  }
  if (elements.finaleDialog.open) {
    event.preventDefault();
    advanceFinale();
    return;
  }
  if (!document.querySelector("#intro-dialog").open) {
    return;
  }
  event.preventDefault();
  advancePrologue();
});
document.querySelector("#new-game-button").addEventListener("click", requestNewGame);
document.querySelector("#continue-game-button").addEventListener("click", continueGame);
document.querySelector("#confirm-new-game").addEventListener("click", startNewGameFromTitle);
document.querySelector("#open-help").addEventListener("click", () => openDialog(document.querySelector("#help-dialog")));
document.querySelector("#open-achievements").addEventListener("click", () => {
  renderAchievements();
  openDialog(document.querySelector("#achievement-dialog"));
});
document.querySelector("#open-settings").addEventListener("click", openSettingsDialog);
document.querySelector("#open-settings-nav").addEventListener("click", openSettingsDialog);
document.querySelector("#brand-home").addEventListener("click", (event) => {
  event.preventDefault();
  showTitleScreen();
});
document.querySelector("#open-closing").addEventListener("click", openClosingDialog);
document.querySelector("#open-memory").addEventListener("click", openMemoryDialog);
document.querySelector("#open-characters").addEventListener("click", () => openCharacterDialog());
document.querySelector("#open-memory-secondary").addEventListener("click", openMemoryDialog);
document.querySelector("#open-nav").addEventListener("click", () => openDialog(document.querySelector("#nav-dialog")));
document.querySelector("#mobile-memory").addEventListener("click", () => {
  closeDialog(document.querySelector("#nav-dialog"));
  openMemoryDialog();
});
document.querySelector("#mobile-characters").addEventListener("click", () => {
  closeDialog(document.querySelector("#nav-dialog"));
  openCharacterDialog();
});
document.querySelector("#mobile-settings").addEventListener("click", () => {
  closeDialog(document.querySelector("#nav-dialog"));
  openSettingsDialog();
});
document.querySelector("#reset-side").addEventListener("click", resetGame);

const volumeBindings = [
  ["master", elements.settingMaster, elements.settingMasterValue],
  ["bgm", elements.settingBgm, elements.settingBgmValue],
  ["sfx", elements.settingSfx, elements.settingSfxValue]
];
volumeBindings.forEach(([key, input, output]) => {
  input.addEventListener("input", () => {
    settings[key] = Number(input.value) / 100;
    output.textContent = `${input.value}%`;
    saveSettings();
  });
});
elements.settingMuted.addEventListener("change", () => {
  settings.muted = elements.settingMuted.checked;
  saveSettings();
});
document.querySelectorAll("[data-text-speed]").forEach((button) => {
  button.addEventListener("click", () => {
    settings.textSpeed = button.dataset.textSpeed;
    saveSettings();
    renderSettings();
  });
});
document.querySelector("#setting-test-sound").addEventListener("click", () => {
  playSfx("success");
});
document.addEventListener("click", (event) => {
  if (event.target.closest("button")) {
    playSfx("ui");
  }
});
window.addEventListener("pointerdown", () => {
  audioUnlocked = true;
}, { once: true });
window.addEventListener("keydown", () => {
  audioUnlocked = true;
}, { once: true });
applyAudioSettings();

render();
showTitleScreen();

const previewMode = new URLSearchParams(window.location.search).get("preview");
if (previewMode === "night") {
  document.querySelector(".title-main h1")?.remove();
  state = createInitialState();
  state.introSeen = true;
  state.memories = [
    {
      text: "阿澄把透明雨伞留在门边，说明天再来拿。",
      time: "22:40",
      night: 1,
      place: "雾港公交站"
    }
  ];
  elements.titleScreen.hidden = true;
  document.body.classList.remove("title-active");
  render();
}
if (previewMode === "finale") {
  state.route = "station";
  state.nightIndex = 7;
  state.finished = true;
  state.closingChoice = "openParcel";
  state.flags = {
    parcelOnCounter: true,
    achengClosure: true,
    xiaomanClosure: true
  };
  elements.titleScreen.hidden = true;
  document.body.classList.remove("title-active");
  startFinale("openParcel");
}
