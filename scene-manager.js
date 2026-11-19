(() => {
  "use strict";

  const rooms = {
    overview: { title: "雾港便利店", caption: "门口的地垫湿了一半。货架边有一只没来得及拆的周转箱。", parent: null },
    shelf: { title: "临窗货架", caption: "冷柜轻轻震着，价签在塑料槽里发出细小的响声。", parent: "overview" },
    till: { title: "收银台", caption: "台面磨得发亮，柜角贴着当班日期：11 月 08 日。", parent: "overview" },
    door: { title: "店门与公交站", caption: "门框底下漏进一道水。玻璃对面的站牌被路灯照得发白。", parent: "overview" },
    cctv: { title: "监控室", caption: "椅背还挂着一条擦屏布。回放键上的白漆被指腹磨掉了。", parent: "till" },
    parcel: { title: "柜台下的包裹", caption: "麻绳绕过纸盒，结打在底下。收件人一栏被擦过很多遍。", parent: "till" }
  };
  const goods = {
    bag: { name: "防雨纸袋", price: 4, mark: "翻开袋底，蓝色圆章盖着「零售 4 元」。" },
    coffee: { name: "罐装咖啡", price: 6, mark: "罐身的接缝压住半个字，价钱还看得清：6 元。" },
    umbrella: { name: "透明雨伞", price: 10, mark: "展开伞柄的吊牌，背面写着「10 元，借用请登记」。" }
  };
  const bottles = {
    green: { name: "青柠汽水", date: "11 月 05 日", note: "绿盖上有一圈灰。生产日期早于当班日。" },
    amber: { name: "橘子汽水", date: "11 月 09 日", note: "橘色瓶盖结着水，生产日期比今晚还晚一天。票背上的人点的正是它。" },
    clear: { name: "盐汽水", date: "11 月 08 日", note: "白盖干燥得很。瓶上的日期和当班日相同。" }
  };
  const papers = {
    ticket: { name: "旧车票", text: "雾港末班车　00:17　｜　验票孔 07。翻到背面，铅笔写着「十七号格，那瓶橘子汽水替我留着」。" },
    receipt: { name: "未来收据", text: "交易时间　11 月 09 日 00:17　｜　橘子汽水 ×1　｜　当班 07。店里的值班簿还停在 11 月 08 日。" }
  };
  const badgeClue = "第三位客人穿着上一班店员的围裙。工牌上写着 07，右下角有一道半月形白痕。它与随箱单的落款和纸角磨痕对上了。";
  const times = { "03": "00:03", "17": "00:17", "41": "00:41" };
  const views = ["arrange", "bottles", "scanner", "recorder", "waybill", "timetable", "bag", "book", "identity", "tidy", "label", "umbrella"];
  const validKey = (table, key) => typeof key === "string" && Object.hasOwn(table, key);

  function createState() {
    return {
      scene: "overview", panel: "", placed: [], held: "", bottle: "", frame: "",
      ticket: false, guestDone: false, shelfChanged: false, soda: false, receipt: false,
      mounted: [], sortedGoods: [], solved: false, parcelRead: false, boardRead: false
    };
  }

  function normalize(raw) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const result = createState();
    if (validKey(rooms, raw.scene)) result.scene = raw.scene;
    if (views.includes(raw.panel)) result.panel = raw.panel;
    ["ticket", "guestDone", "shelfChanged", "soda", "receipt", "solved", "parcelRead", "boardRead"]
      .forEach(key => { result[key] = raw[key] === true; });
    const known = (list, table) => Array.isArray(list) ? [...new Set(list.filter(key => validKey(table, key)))] : [];
    result.placed = known(raw.placed, goods);
    result.mounted = known(raw.mounted, papers);
    result.sortedGoods = Array.isArray(raw.sortedGoods)
      ? [...new Set(raw.sortedGoods.filter(key => key === "umbrella" || key === "lunchbox"))] : [];
    if (validKey(goods, raw.held) && !result.placed.includes(raw.held)) result.held = raw.held;
    if (validKey(bottles, raw.bottle)) result.bottle = raw.bottle;
    if (validKey(times, raw.frame)) result.frame = raw.frame;
    // Later milestones imply their prerequisites even in a partially migrated save.
    if (result.solved) { result.receipt = true; result.mounted = ["ticket", "receipt"]; result.frame = "17"; }
    if (result.receipt) result.soda = true;
    if (result.soda) { result.guestDone = true; result.shelfChanged = true; }
    if (result.guestDone || result.placed.length === 3) result.ticket = true;
    if (result.ticket) { result.placed = Object.keys(goods); result.held = ""; }
    result.mounted = result.mounted.filter(key => result[key]);
    return result;
  }

  // Only one game board is mounted, including when the player imports a new save.
  let ctx = null;
  let timer = 0;
  let animation = 0;
  let busy = false;
  let elapsed = 0;
  let tickAt = 0;
  let hintLevel = 0;
  let previousGuest = false;
  let message = "";
  let selectedClues = [];
  const reduced = () => document.body.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const roomArt = {
    overview: "store-wide", shelf: "ex-shelf", till: "ex-till",
    door: "ex-door", cctv: "ex-cctv", parcel: "ex-parcel"
  };
  const requestedArt = new Map();
  const queuedArt = [];
  let activeArt = 0;

  function pumpArtwork() {
    while (activeArt < 2 && queuedArt.length) {
      const request = queuedArt.shift();
      const image = request.image = new Image();
      activeArt++;
      image.decoding = "async";
      image.fetchPriority = request.priority ? "auto" : "low";
      const done = () => {
        image.onload = image.onerror = null;
        request.image = null;
        activeArt--;
        pumpArtwork();
      };
      image.onload = () => {
        if (image.decode) image.decode().then(done, done);
        else done();
      };
      image.onerror = done;
      image.src = request.path;
    }
  }

  function preloadArt(paths, priority = false) {
    if (navigator.connection?.saveData && !priority) return;
    for (const path of paths) {
      const existing = requestedArt.get(path);
      if (existing) {
        if (priority && !existing.priority) {
          existing.priority = true;
          if (existing.image) existing.image.fetchPriority = "auto";
          else {
            const index = queuedArt.indexOf(existing);
            if (index >= 0) queuedArt.unshift(queuedArt.splice(index, 1)[0]);
          }
        }
        continue;
      }
      const request = {path, priority, image: null};
      requestedArt.set(path, request);
      if (priority) queuedArt.unshift(request);
      else queuedArt.push(request);
    }
    pumpArtwork();
  }

  function prepareRooms(names, priority) {
    preloadArt(names.map(name => "assets/scenes/" + roomArt[name] + ".jpg"), priority);
  }

  function prepareNearby(m) {
    prepareRooms([m.scene], true);
    // Start with the task route. Optional side rooms are warmed while their entry is visible.
    const nearby = {
      overview: ctx.nightSix?.phase === "shelf" ? ["shelf", "door", "till"] : ["door", "till", "shelf"],
      shelf: ["overview", "door"],
      till: ["cctv", "overview", "parcel"],
      door: ["overview"],
      cctv: ["till"],
      parcel: ["till"]
    };
    prepareRooms(nearby[m.scene]);
    if (m.scene === "door" || m.scene === "cctv") preloadArt(["assets/scenes/third-visitor-wide.jpg"]);
  }
  function save(event) { ctx.onSave(event); }
  function sound(name) { ctx.sound?.(name); }
  function progress() { elapsed = 0; hintLevel = 0; tickAt = Date.now(); }
  function cancelAnimation() {
    clearTimeout(animation);
    animation = 0;
    busy = false;
  }
  function deactivate() {
    clearInterval(timer);
    cancelAnimation();
    if (ctx) {
      ctx.root.removeEventListener("click", handleClick);
      ctx.root.removeEventListener("keydown", handleKey);
    }
    timer = 0;
    ctx = null;
    message = "";
    selectedClues = [];
  }

  function phase(m) {
    if (!m.ticket) return "arrange";
    if (!m.guestDone) return "guest";
    if (!m.soda) return "bottles";
    if (!m.receipt) return "scanner";
    if (!m.solved) return "recorder";
    return "continue";
  }
  const tasks = {
    arrange: ["先把这三件货摆好", "售价都印在包装上。", "临窗货架下层有三条价格签。", "点货架的「价签与周转箱」。纸袋放到 4 元、咖啡放到 6 元、雨伞放到 10 元的价签后面。", "shelf"],
    guest: ["阿澄还在柜台等伞", "她把湿伞换了只手，站着没动。", "阿澄在收银台等你。", "回店内全景，进收银台，点阿澄。听完她的话，再决定这把伞怎么卖。", "till"],
    bottles: ["票背提到了十七号格", "车票背面还有一行铅笔字。", "十七号格就在临窗货架上层。今晚是 11 月 08 日。", "回到货架，点「十七号饮料格」。翻看橘子汽水的日期，把 11 月 09 日生产的那瓶取下来。", "shelf"],
    scanner: ["扫一下这瓶汽水", "瓶底还有条码。", "收银台右侧有一道红色的扫描光。", "进入收银台，点「扫码器」，再扫描背包里的橘子汽水。", "till"],
    recorder: ["去监控里找这个时间", "车票和小票上都写着 00:17。", "监控室在收银台后面，回放台上有两枚磁夹。", "放上旧车票和未来收据，调到 00:17。再对照柜下随箱单的落款与画面里的工牌。", "cctv"],
    continue: ["第三声门铃响了", "门上的铃铛还在晃。", "门口有人等着。", "点「去听第三次门铃」，或进店门近景，点门外的人。", "door"]
  };
  const targetActions = { arrange: "arrange", guest: "guest", bottles: "bottles", scanner: "scanner", recorder: "recorder", continue: "continue" };
  function destination(m, step) {
    return step === "recorder" && m.frame === "17" && !m.parcelRead ? "parcel" : tasks[step][4];
  }
  function toward(m, room) {
    if (m.scene === "overview") return "go-" + (room === "cctv" || room === "parcel" ? "till" : room);
    if (m.scene === "till" && (room === "cctv" || room === "parcel")) return "go-" + room;
    if ((m.scene === "cctv" && room === "parcel") || (m.scene === "parcel" && room === "cctv")) return "go-" + room;
    return "back";
  }
  function towardNightOne(m, room, action, label) {
    if (m.scene === room) return {action, label};
    const move = toward(m, room);
    const target = move === "back" ? rooms[m.scene].parent : move.slice(3);
    return {action: move, label: move === "back" ? "回" + rooms[target].title : "去" + rooms[target].title};
  }

  function nightOneGuide(m, night) {
    if (ctx.revisit) return {action: "continue", label: "回到值班", title: "值班记录", text: "刚才记下的东西还在本子上。"};
    if (night.pair) return {
      ...towardNightOne(m, "door", "continue", "看看门外"),
      title: "门边有响动", text: "铃响了一下，店门还关着。"
    };
    if (night.phase === "shelf") return {
      ...towardNightOne(m, "shelf", "tidy", "整理陈列"),
      title: "理一理临窗货架", text: "扎好散开的伞带，把饭盒的标签转过来。"
    };
    const canPair = Object.keys(night.pairs).some(key => key.split("+").every(id => night.clues.includes(id)));
    if (canPair) return {
      action: m.panel === "book" ? "book-focus" : "book", label: m.panel === "book" ? "选择线索" : "打开记忆册",
      title: "把两条线索放在一起", text: "看看它们记的是不是同一趟末班车。"
    };
    return {
      ...towardNightOne(m, "door", "timetable", "看末班车站牌"),
      title: "查查末班车", text: "阿澄把伞朝着站牌。也可以从收银台后面进监控室。"
    };
  }
  function nextAction(m) {
    if (ctx.revisit) return { action: "continue", label: "回到值班" };
    const step = phase(m);
    const target = destination(m, step);
    if (step === "continue") return { action: "continue", label: "去听第三次门铃" };
    if (m.scene !== target) {
      const action = hintTarget(m);
      const labels = {
        "go-shelf": "去货架", "go-till": "去收银台", "go-cctv": "去监控室", "go-parcel": "查看柜下随箱单",
        back: rooms[m.scene].parent === "till" ? "回收银台" : "回到店里"
      };
      return { action, label: labels[action] || "前往目标位置" };
    }
    if (step === "recorder" && target === "parcel") return { action: "waybill", label: "翻看随箱单" };
    if (step === "guest") return { action: "guest", label: "接待阿澄" };
    if (m.panel !== targetActions[step]) {
      const labels = { arrange: "查看价签与周转箱", bottles: "查看十七号饮料格", scanner: "查看扫码器", recorder: "查看回放台" };
      return { action: targetActions[step], label: labels[step] };
    }
    if (step === "arrange") {
      if (m.held) return { action: "slot-" + goods[m.held].price, label: "放到 ¥" + goods[m.held].price + " 价签" };
      const remaining = ["bag", "coffee", "umbrella"].find(id => !m.placed.includes(id));
      return { action: "item-" + remaining, label: "拿起" + goods[remaining].name };
    }
    if (step === "bottles") {
      if (m.bottle === "amber") return { action: "take-soda", label: "把异常汽水装进背包" };
      return { action: "bottle-amber", label: "翻看橘子汽水" };
    }
    if (step === "scanner") return { action: "scan-soda", label: "扫描背包里的汽水" };
    if (!m.mounted.includes("ticket")) return { action: "mount-ticket", label: "放上旧车票" };
    if (!m.mounted.includes("receipt")) return { action: "mount-receipt", label: "放上未来收据" };
    if (m.frame !== "17") return { action: "frame-17", label: "调到 00:17" };
    return { action: "deduce-clerk", label: "对照工牌与随箱单" };
  }
  function nextInstruction(m) {
    const step = phase(m);
    if (ctx.revisit) return "背包和线索册都在画面上方。看完后回到值班。";
    if (m.scene !== destination(m, step) && step !== "continue") {
      return "先去" + rooms[destination(m, step)].title + "。点画面里的标记就能过去。";
    }
    if (step === "arrange") return m.held
      ? "手里拿着" + goods[m.held].name + "，标价 ¥" + goods[m.held].price + "。找一张相同的价签。"
      : "拿起一件货，看看包装上卖多少钱。";
    if (step === "guest") return "她有话想说。点她，先听听。";
    if (step === "bottles") return "票背写着十七号格。今晚是 11 月 08 日，找生产日期晚于今晚的汽水。";
    if (step === "scanner") return "瓶子已经在背包里。打开扫码器，把条码对准红光。";
    if (step === "recorder") return m.frame === "17" && !m.parcelRead
      ? "画面里的 07 和半月白痕似曾见过。去柜下翻看随箱单。"
      : m.frame === "17" ? "把工牌上的 07 与白痕，同随箱单的落款和纸角对照。"
      : "把旧票与未来收据夹在屏幕旁，找两张纸上相同的时间。";
    return "记下工牌上的白痕。门外那个人还没走。";
  }
  function hintTarget(m) {
    const step = phase(m);
    const target = destination(m, step);
    if (m.scene === target) return step === "recorder" && target === "parcel" ? "waybill" : targetActions[step];
    return toward(m, target);
  }
  function updateHint() {
    if (!ctx) return;
    const node = ctx.root.querySelector(".ex-hint");
    if (!node) return;
    if (ctx.nightSix) {
      const hints = ctx.nightSix.phase === "shelf"
        ? ["阿澄走前看了一眼临窗货架。", "查看货架上的雨伞和饭盒。", "在货架点「整理陈列」，分别归位纸盒和雨伞，再确认。"]
        : ["想想小票上的时间在哪里出现过。", "到门边看站牌，或进监控室看回放。", "打开记忆册，选收据与站牌，或收据与监控，再点「关联」】【。"];
      const copy = hints[hintLevel - 1] || "";
      node.textContent = copy;
      node.hidden = !copy;
      return;
    }
    const text = hintLevel && !ctx.revisit ? tasks[phase(ctx.model)][hintLevel] : "";
    if (node.textContent !== text) node.textContent = text;
    node.hidden = !text;
    const target = hintTarget(ctx.model);
    ctx.root.querySelectorAll("[data-scene-action]").forEach(el => {
      el.classList.toggle("is-hinted", !ctx.revisit && hintLevel >= 2 && el.dataset.sceneAction === target);
    });
  }
  function tick() {
    if (ctx.nightSix) return;
    const now = Date.now();
    // Store menus and guest conversations suspend the player's exploration clock.
    if (!document.hidden && !ctx.root.closest("[hidden]") && !document.querySelector("dialog[open]")) elapsed += now - tickAt;
    tickAt = now;
    const next = Math.min(3, Math.floor(elapsed / 30000));
    if (next !== hintLevel) { hintLevel = next; updateHint(); }
  }

  const btn = (id, label, attrs = "") => `<button type="button" data-scene-action="${id}" ${attrs}>${label}</button>`;
  const selected = value => `class="${value ? "is-selected" : ""}" aria-pressed="${!!value}"`;
  function spots(m) {
    if (ctx.nightSix) {
      if (m.scene === "shelf") return [["tidy", "整理陈列", 48, 81], ["label", "饭盒标签", 52, 39]];
      if (m.scene === "door") {
        const row = [["timetable", "末班车站牌", 32, 38], ["umbrella", "阿澄的伞", 63, 75]];
        if (ctx.nightSix.pair && !ctx.revisit) row.push(["continue", "玻璃门", 61, 41]);
        return row;
      }
    }
    switch (m.scene) {
      case "overview": return [["go-shelf", "货架", 17, 39], ["go-till", "收银台", 11, 80], ["go-door", "店门", 65, 49]];
      case "shelf": return [["arrange", "价签与周转箱", 48, 86], ["bottles", "十七号饮料格", 50, 20]];
      case "till": {
        const row = [["scanner", "扫码器", 43, 51], ["go-parcel", "柜下包裹", 16, 86], ["go-cctv", "监控室", 86, 32]];
        if (m.ticket && !m.guestDone) row.push(["guest", "阿澄", 63, 48]);
        return row;
      }
      case "cctv": return [["recorder", "回放台", 53, 40]];
      case "parcel": return [["waybill", "翻看随箱单", 63, 63]];
      case "door": {
        const row = [["timetable", "末班车站牌", 32, 38]];
        if (m.solved && !ctx.revisit) row.push(["continue", "门外的人", 62, 54]);
        return row;
      }
    }
  }
  function detail(m) {
    const p = m.panel;
    let title, body, buttons = "";
    if (ctx.nightSix) {
      const night = ctx.nightSix;
      if (p === "tidy") {
        title = "整理临窗货架";
        body = night.phase === "shelf" ? "伞带垂在货架外面，饭盒的标签朝里。"
          : '伞已经扎好，饭盒的标签终于露出来了。';
        if (night.phase === "shelf") {
          buttons = btn("sort-umbrella", m.sortedGoods.includes("umbrella") ? "✓ 雨伞已归位" : "收好雨伞", selected(m.sortedGoods.includes("umbrella"))) +
            btn("sort-lunchbox", m.sortedGoods.includes("lunchbox") ? "✓ 饭盒已摆正" : "摆正饭盒", selected(m.sortedGoods.includes("lunchbox"))) +
            btn("commit-tidy", night.time > 0 ? "确认整理 · 1 格" : "确认整理", m.sortedGoods.length === 2 ? "" : "disabled");
        } else buttons = btn("label", "看看饭盒标签");
      } else if (p === "book" || p === "bag") {
        title = "值班记忆册";
        body = night.pair ? "这两条记录已经夹在同一页。" : "圈出两条证据，再试着关联。";
        const pairedIds = night.pair?.split("+") || [];
        const cards = night.clues.map(id => {
          const clue = night.definitions[id];
          const contents = `<strong>${clue.name}</strong><span>${clue.result}</span>`;
          if (night.pair) return `<div class="ex-clue-entry ${pairedIds.includes(id) ? "is-linked" : ""}">${contents}</div>`;
          return btn("select-" + id, contents, `class="ex-clue-entry ${selectedClues.includes(id) ? "is-selected" : ""}" aria-pressed="${selectedClues.includes(id)}"`);
        });
        buttons = `<div class="ex-clue-entries">${cards.join("")}</div>`;
        if (night.pair) buttons += `<p class="ex-link-result" role="status">${night.pairs[night.pair]}</p>`;
        else buttons += btn("connect", `关联线索 · ${selectedClues.length}/2`, selectedClues.length === 2 ? "" : "disabled");
      } else if (p === "scanner") {
        title = "收银机的副联";
        body = night.definitions.receipt.result;
      } else if (p === "recorder") {
        title = "门口摄像头 · 00:17";
        body = night.clues.includes("camera") ? night.definitions.camera.result
          + '<span class="ex-clock-pair"><span>录像时间 <b>00:17:00</b></span><span>店里时钟 <b>00:16:43</b></span></span>'
          : "门外空着。屏幕的玻璃上却多了一道影子。";
        if (!night.clues.includes("camera") && night.phase === "investigate") buttons = btn("camera-compare", "对照录像和门外");
      } else if (p === "timetable") {
        title = "雾港站 · 末班到站";
        body = night.definitions.timetable.result;
      } else if (p === "label") {
        title = "一张没到取货日的标签";
        body = "「小满，明天吃。」笔画干了，标签却和新贴的一样平整。";
      } else if (p === "umbrella") {
        title = "门边的透明雨伞";
        body = "伞尖朝向站牌。阿澄特意让它立在玻璃旁，从外面看也认得出来。";
      }
      if (title) return `<section class="ex-detail" aria-labelledby="ex-detail-title"><header><h3 id="ex-detail-title" tabindex="-1">${title}</h3>${btn("detail-close", "收起")}</header><p>${body}</p>
        ${message ? `<p class="ex-detail-feedback" role="status">${message}</p>` : ""}
        ${buttons ? `<div class="ex-choices">${buttons}</div>` : ""}</section>`;
    }
    switch (p) {
      case "arrange": {
        title = m.ticket ? "价签槽里掉出一张旧票" : "把三件货放回价签后面";
        if (m.ticket) { body = papers.ticket.text; break; }
        body = m.held ? goods[m.held].mark + " 现在选一张相符的价签。" : "先拿起一件货，翻看包装的售价，再点它该放的价签。";
        buttons = '<div class="ex-choice-row"><small>周转箱</small>' + ["coffee", "umbrella", "bag"].map(id =>
          btn("item-" + id, goods[id].name, m.placed.includes(id) ? 'disabled class="is-filled"' : selected(m.held === id))).join("") + "</div>";
        buttons += '<div class="ex-choice-row"><small>价签</small>' + ["bag", "coffee", "umbrella"].map(id =>
          btn("slot-" + goods[id].price, "¥" + goods[id].price + (m.placed.includes(id) ? " · " + goods[id].name : ""), m.placed.includes(id) ? 'disabled class="is-filled"' : "")).join("") + "</div>";
        break;
      }
      case "bottles":
        title = "十七号饮料格";
        if (!m.shelfChanged) { body = "三排玻璃瓶贴着格挡。检货纸上写着：当班 11 月 08 日。"; break; }
        if (m.soda) { body = "橘子汽水留下一个圆形水印。水印恰好盖住「寄存」两个字。"; break; }
        body = m.bottle ? bottles[m.bottle].name + "　生产日期 · " + bottles[m.bottle].date + "。 " + bottles[m.bottle].note : "橘色瓶盖原先在最后一排。现在它贴着柜门，周围的水汽全往里淌。对照票背和当班日期，翻看瓶底。";
        buttons = Object.keys(bottles).map(id => btn("bottle-" + id, bottles[id].name, selected(m.bottle === id))).join("");
        if (m.bottle) buttons += btn("take-soda", "把这瓶装进背包");
        break;
      case "scanner":
        title = m.receipt ? "还带着热气的小票" : "把瓶底对准红光";
        body = m.receipt ? papers.receipt.text : m.soda ? "瓶身的水在台面留了一道印。扫码器等着读它的条码。" : "扫描窗只映出顶灯。机身边上贴着值班簿，日期是 11 月 08 日。";
        if (m.soda && !m.receipt) buttons = btn("scan-soda", "扫描背包里的橘子汽水");
        break;
      case "recorder": {
        title = "门口摄像头 · 回放台";
        if (m.solved) { body = badgeClue; buttons = ctx.revisit ? "" : btn("continue", "去听第三次门铃"); break; }
        const both = m.mounted.length === 2;
        body = both ? "两份凭证都在这里。调出它们共同指向的那一段门口录像。" : "屏幕下面有两枚磁夹。把旧票和收银记录放在一起，才能在一夜的录像里找到那个人。";
        buttons = Object.keys(papers).map(id => btn("mount-" + id, (m.mounted.includes(id) ? "已夹好 · " : "放上") + papers[id].name, !m[id] || m.mounted.includes(id) ? "disabled" : "")).join("");
        body += m.mounted.map(id => `<span class="ex-evidence-line"><b>${papers[id].name}</b>　${papers[id].text}</span>`).join("");
        if (both) {
          buttons += '<div class="ex-choice-row"><small>门口回放</small>' + ["03","17","41"].map(id => btn("frame-" + id, times[id], selected(m.frame === id))).join("") + "</div>";
          if (m.frame === "17") {
            body += '<span class="ex-evidence-line"><b>00:17 的画面</b>　门外的人身上有旧围裙。胸牌写着 07，右下角有一道半月形白痕。</span>';
            if (m.parcelRead) {
              body += '<span class="ex-evidence-line"><b>柜下随箱单</b>　「交给下一班。」落款 07，纸角也有一道半月形磨痕。</span>';
              buttons += '<div class="ex-deduction"><strong>这两处 07 与白痕说明了什么？</strong>' +
                btn("deduce-passenger", "只是末班车的验票乘客") +
                btn("deduce-bottle", "来拿十七号格汽水的客人") +
                btn("deduce-clerk", "她用过上一班店员的工牌和随箱单") + '</div>';
            } else {
              buttons += btn("go-parcel", "去柜下核对随箱单");
            }
          }
        }
        break;
      }
      case "identity":
        title = "第三位客人的胸牌";
        body = badgeClue + " 她用拇指擦了擦那道白痕，和你把旧票放进夹子时的动作一模一样。门外的铃铛响了。";
        buttons = ctx.revisit ? "" : btn("continue", "去听第三次门铃");
        break;
      case "timetable":
        title = "雾港站 · 手写时刻表";
        body = "前两列时间被雨浸成两团墨，末班一行还看得清：00:17。有人用指甲在下面划了一横。";
        break;
      case "waybill":
        title = "一张没撕干净的随箱单";
        body = "「交给下一班。」落款只有一个 07。麻绳从封条上面绕过，纸角留着一个半月形磨痕。";
        break;
      case "bag": {
        title = "随身背包";
        const contents = [];
        if (m.ticket) contents.push(itemLine("旧车票", papers.ticket.text));
        if (m.soda) contents.push(itemLine("橘子汽水", m.receipt ? "11 月 09 日生产。条码已经扫过，瓶身上贴着小票的副联。" : "11 月 09 日生产。瓶底的条码还等着扫描。"));
        if (m.receipt) contents.push(itemLine("未来收据", papers.receipt.text));
        body = contents.join("") || "袋底只有一串店门钥匙。找到的随身物品会收进这里。";
        break;
      }
      case "book": {
        title = "值班线索册";
        const clues = [];
        if (m.boardRead) clues.push(itemLine("站牌", "最后一班车在 00:17。"));
        if (m.parcelRead) clues.push(itemLine("随箱单", "交给下一班。落款 07，纸角有半月形磨痕。"));
        if (m.ticket) clues.push(itemLine("票背留言", "「十七号格，那瓶橘子汽水替我留着。」票上是 00:17，验票孔 07。"));
        if (m.soda) clues.push(itemLine("生产日期", "晚于今晚一天的橘子汽水，从最后一排挪到了柜门边。"));
        if (m.receipt) clues.push(itemLine("收银记录", "明天 00:17 的交易已经打印，当班工号是 07。"));
        if (m.solved) clues.push(itemLine("第三位客人", badgeClue));
        body = clues.join("") || "扉页上有人写过一句话：看见什么，就照原样记下来。";
        break;
      }
      default: return "";
    }
    const finishedHere = (p === "arrange" && m.ticket) || (p === "bottles" && m.soda) ||
      (p === "scanner" && m.receipt) || (p === "waybill" && m.frame === "17" && !m.solved);
    const next = finishedHere ? nextAction(m) : null;
    return `<section class="ex-detail" aria-labelledby="ex-detail-title"><header><h3 id="ex-detail-title" tabindex="-1">${title}</h3>${btn("detail-close", "收起", 'class="ex-dismiss"')}</header><p>${body}</p>
      ${message ? `<p class="ex-detail-feedback" role="status" aria-atomic="true">${message}</p>` : ""}
      ${buttons ? '<div class="ex-choices">'+buttons+'</div>' : ""}
      ${next ? `<div class="ex-detail-next">${btn(next.action, next.label)}</div>` : ""}
    </section>`;
  }
  function itemLine(title, text) { return `<span class="ex-evidence-line"><b>${title}</b>　${text}</span>`; }

  function draw(focus) {
    const m = ctx.model;
    const root = ctx.root;
    const active = root.contains(document.activeElement) ? document.activeElement.dataset.sceneAction : null;
    const room = rooms[m.scene];
    const hotspots = spots(m).map(([action, label, x, y]) => btn(action,
      `<span class="ex-pin" aria-hidden="true"></span><span class="ex-hotspot-label">${label}</span>`,
      `class="ex-hotspot" style="left:${x}%;top:${y}%"`)).join("");
    const caption = m.scene === "shelf" && m.shelfChanged ? "刚才背光的瓶子已经靠到柜门。地板干着，几个橘色瓶盖却在滴水。" : room.caption;
    const night = ctx.nightSix;
    const next = night ? nightOneGuide(m, night) : nextAction(m);
    const milestones = night ? [
      ["小票已收好", "收好小票", true],
      ["阿澄的伞", "接待阿澄", true],
      ["陈列已整理", "整理货架", night.phase !== "shelf"],
      ["已关联线索", "比对线索", Boolean(night.pair)]
    ] : [
      ["货摆好了", "整理货架", m.ticket],
      ["阿澄的伞", "接待阿澄", m.guestDone],
      ["收好小票", "核对汽水", m.receipt],
      ["记下工牌", "查看录像", m.solved]
    ];
    root.innerHTML = `<div class="ex-shell" data-scene="${m.scene}" data-night-six="${Boolean(night)}" data-anomaly="${m.scene === "shelf" && m.shelfChanged}" data-soda="${m.soda}" data-receipt="${m.receipt}" data-frame="${m.frame}">
      <header class="ex-header"><div><small class="ex-kicker">十一月八日 · 夜班</small><h2 class="ex-title" tabindex="-1">${room.title}</h2></div>
      <nav class="ex-tools" aria-label="调查记录">${night ? "" : btn("bag", "背包", selected(m.panel === "bag"))}${btn("book", night ? "记忆册" : "线索册", selected(m.panel === "book"))}${ctx.revisit ? btn("continue", "回到值班") : ""}</nav></header>
      <div class="ex-layout">
        <div class="ex-main">
          <div class="ex-stage"><div class="ex-art" aria-hidden="true"></div><div class="ex-effects" aria-hidden="true"></div><div class="ex-prop" aria-hidden="true"></div>
            ${night && m.scene === "cctv" && m.panel === "recorder" && night.clues.includes("camera") ? '<div class="ex-camera-frame" aria-hidden="true"><span>CAM 01 · 00:17</span></div>' : ""}${hotspots}</div>
          <div class="ex-footer">${room.parent ? btn("back", "‹ 返回" + rooms[room.parent].title, 'class="ex-back"') : ""}<span class="ex-caption">${caption}</span></div>
          ${detail(m)}
        </div>
        <aside class="ex-rail" aria-label="第一夜任务栏">
          <div class="ex-note-heading"><span class="ex-rail-kicker">值班手记</span><small>${night?.phase === "shelf" ? `剩余 ${night.time} 格` : "雾港 · 11/08"}</small></div>
          <ol class="ex-progress">${milestones.map(([finished, pending, done], index) =>
            `<li class="${done ? "is-done" : index === milestones.findIndex(([, , complete]) => !complete) ? "is-current" : ""}"${!done && index === milestones.findIndex(([, , complete]) => !complete) ? ' aria-current="step"' : ""}><span aria-hidden="true">${done ? "✓" : ""}</span>${done ? finished : pending}</li>`).join("")}</ol>
          <div class="ex-current"><strong>${night ? next.title : ctx.revisit ? "翻翻之前记下的事" : tasks[phase(m)][0]}</strong><p>${night ? next.text : nextInstruction(m)}</p>
            ${btn(next.action, next.label, 'class="ex-next-button"')}
            ${night && !night.pair ? btn("hint", hintLevel === 0 ? "提示" : hintLevel < 3 ? "下一条提示" : "收起提示", 'class="ex-hint-button"') : ""}
          </div>
          <p class="ex-notice" role="status"${message && !m.panel ? "" : " hidden"}>${m.panel ? "" : message}</p>
          <p class="ex-hint" aria-live="polite" hidden></p>
        </aside>
      </div></div>`;
    updateHint();
    if (focus) root.querySelector(focus)?.focus({ preventScroll: false });
    else if (active) {
      const replacement = root.querySelector(`[data-scene-action="${active}"]:not([disabled])`)
        || root.querySelector(`[data-scene-action="${next.action}"]:not([disabled])`)
        || root.querySelector("#ex-detail-title")
        || root.querySelector(".ex-title");
      replacement?.focus({ preventScroll: true });
    }
  }

  function render(context) {
    if (!context?.root || !context.model) { deactivate(); return; }
    const fresh = !ctx || ctx.model !== context.model || ctx.root !== context.root;
    if (fresh) deactivate();
    ctx = context;
    if (fresh) {
      prepareNearby(ctx.model);
      ctx.root.addEventListener("click", handleClick);
      ctx.root.addEventListener("keydown", handleKey);
      previousGuest = ctx.model.guestDone;
      progress();
      timer = setInterval(tick, 1000);
    } else if (ctx.model.guestDone !== previousGuest) {
      previousGuest = ctx.model.guestDone;
      progress();
    }
    if (!busy) draw();
  }
  function navigate(next) {
    const m = ctx.model;
    prepareRooms([next], true);
    const changeScene = () => {
      m.scene = next;
      m.panel = "";
      message = "";
      prepareNearby(m);
      if (next === "shelf" && m.guestDone && !m.shelfChanged) {
        m.shelfChanged = true;
        message = "冷柜的灯从左端一盏盏暗下去。刚才还在最后一排的橘色瓶子贴到了玻璃上。";
        sound("door");
      }
      save("scene");
      draw(".ex-title");
      busy = false;
      animation = 0;
      if (!reduced()) ctx.root.querySelector(".ex-stage").classList.add("ex-enter");
    };
    sound("advance");
    if (reduced()) { changeScene(); return; }
    busy = true;
    ctx.root.querySelector(".ex-stage").classList.add("ex-leave");
    animation = setTimeout(changeScene, 120);
  }
  function investigate(action, trigger) {
    const m = ctx.model;
    m.panel = action;
    message = "";
    if (action === "waybill") {
      m.parcelRead = true;
      if (m.frame === "17" && !m.solved) progress();
    }
    if (action === "timetable") m.boardRead = true;
    save("inspect");
    sound("page");
    const x = trigger.style.left || "50%";
    const y = trigger.style.top || "50%";
    draw("#ex-detail-title");
    if (reduced()) return;
    const stage = ctx.root.querySelector(".ex-stage");
    stage.style.setProperty("--ex-origin-x", x);
    stage.style.setProperty("--ex-origin-y", y);
    stage.classList.add("ex-investigate");
    // The view is already interactive while the camera settles.
  }
  function finish(event, feedback, cue, madeProgress = false) {
    message = feedback;
    if (madeProgress) progress();
    save(event);
    sound(cue);
    draw();
  }
  function handleKey(e) {
    if (e.key !== "Escape" || busy || !ctx.model.panel) return;
    e.preventDefault();
    closeDetail();
  }
  function closeDetail() {
    const panel = ctx.model.panel;
    ctx.model.panel = "";
    message = "";
    save("inspect");
    draw();
    const target = ctx.root.querySelector(`[data-scene-action="${panel}"]`) || ctx.root.querySelector(".ex-title");
    target?.focus({ preventScroll: false });
  }
  function handleClick(event) {
    const trigger = event.target.closest("button[data-scene-action]");
    if (!trigger || !ctx.root.contains(trigger) || trigger.disabled || busy) return;
    const action = trigger.dataset.sceneAction;
    const m = ctx.model;
    if (ctx.nightSix) {
      const night = ctx.nightSix;
      if (action === "hint") { hintLevel = (hintLevel + 1) % 4; draw(); return; }
      if (action === "continue" && ((night.pair && m.scene === "door") || ctx.revisit)) { ctx.onComplete(); return; }
      if (action === "book-focus") {
        ctx.root.querySelector(".ex-clue-entry[aria-pressed]")?.focus();
        return;
      }
      if (action === "timetable") {
        investigate(action, trigger);
        night.onClue("timetable");
        return;
      }
      if (action === "umbrella") { investigate(action, trigger); night.onClue("umbrella"); return; }
      if (action === "camera-compare") {
        night.onClue("camera");
        ctx.root.querySelector("#ex-detail-title")?.focus({preventScroll: true});
        return;
      }
      if (action === "label") { investigate(action, trigger); night.onLabel(); return; }
      if (action.startsWith("sort-") && night.phase === "shelf" && m.panel === "tidy") {
        const id = action.slice(5);
        if (m.sortedGoods.includes(id)) return;
        m.sortedGoods.push(id);
        finish("tidy-draft", id === "umbrella" ? "你把伞带绕紧，货架前空出了一点地方。" : "饭盒转了半圈。标签上有一行手写字。", "ui");
        return;
      }
      if (action === "commit-tidy" && m.panel === "tidy" && m.sortedGoods.length === 2) {
        message = "货架整理好了。";
        night.onTidy();
        sound("success");
        return;
      }
      if (action.startsWith("select-")) {
        const id = action.slice(7);
        if (!night.clues.includes(id)) return;
        if (selectedClues.length === 2 && !selectedClues.includes(id)) {
          message = "先取消一条已圈出的线索，再选另一条。";
        } else {
          selectedClues = selectedClues.includes(id) ? selectedClues.filter(key => key !== id) : [...selectedClues, id];
          message = "";
        }
        draw();
        return;
      }
      if (action === "connect") {
        if (selectedClues.length !== 2) return;
        message = "";
        night.onPair(selectedClues);
        if (ctx?.nightSix && !ctx.nightSix.pair) {
          message = "这两条记录没有共同的时间。找一件能核对 00:17 的东西。";
          sound("blocked");
          draw();
        }
        return;
      }
    }
    if (action === "back") { if (rooms[m.scene].parent) navigate(rooms[m.scene].parent); return; }
    if (action.startsWith("go-")) { navigate(action.slice(3)); return; }
    if (action === "guest" && !m.guestDone && m.ticket) { ctx.onGuest(); return; }
    if (action === "continue" && m.solved) { ctx.onComplete(); return; }
    if (action === "detail-close" || ((action === "bag" || action === "book") && m.panel === action)) { closeDetail(); return; }
    if (views.includes(action)) { investigate(action, trigger); return; }
    if (m.panel === "arrange" && !m.ticket) {
      if (action.startsWith("item-")) {
        const key = action.slice(5);
        if (validKey(goods, key) && !m.placed.includes(key)) {
          m.held = key;
          finish("inspect", "拿起了" + goods[key].name + "。", "page");
        }
        return;
      }
      if (action.startsWith("slot-")) {
        if (!m.held) { finish("inspect", "先从周转箱拿起一件货，看看包装的售价。", "ui"); return; }
        const item = goods[m.held];
        if (item.price !== Number(action.slice(5))) { finish("inspect", item.name + "的标价是 " + item.price + " 元。你把它留在手里，重新看了一眼价签。", "blocked"); return; }
        if (!m.placed.includes(m.held)) m.placed.push(m.held);
        m.held = "";
        m.ticket = m.placed.length === 3;
        finish(m.ticket ? "ticket" : "placed", m.ticket ? "最后一件货滑进格子，旧车票从价签后掉了下来。你把它收进背包。柜台那边，阿澄把一把湿伞换到了左手。" : item.name + "归位了。还剩 " + (3 - m.placed.length) + " 件货。", m.ticket ? "gift" : "ui", true);
      }
      return;
    }
    if (m.panel === "bottles" && m.shelfChanged && !m.soda) {
      if (action.startsWith("bottle-") && validKey(bottles, action.slice(7))) {
        m.bottle = action.slice(7); finish("inspect", "你把瓶子转了半圈，看到了生产日期。", "ui"); return;
      }
      if (action === "take-soda") {
        if (m.bottle !== "amber") { finish("inspect", "这瓶的日期没有问题。你按票背的留言把它放回原位。", "blocked"); return; }
        m.soda = true;
        finish("soda", "你用袖口擦干瓶底，条码露了出来。橘子汽水已收入背包。", "gift", true);
      }
      return;
    }
    if (action === "scan-soda" && m.panel === "scanner" && m.soda && !m.receipt) {
      m.receipt = true;
      finish("receipt", "嘀。没有人付钱，打印机却吐出一张明天的收据。你沿锯齿撕下它，柜台后传来了录像机倒带的声音。", "scan", true);
      return;
    }
    if (m.panel !== "recorder" || m.solved) return;
    if (action.startsWith("mount-")) {
      const id = action.slice(6);
      if (!validKey(papers, id) || !m[id] || m.mounted.includes(id)) return;
      m.mounted.push(id);
      finish("mount", papers[id].name + "夹在了屏幕边上。", "page", true);
    } else if (action.startsWith("frame-") && m.mounted.length === 2) {
      const id = action.slice(6);
      if (!validKey(times, id)) return;
      const advanced = id === "17" && m.frame !== "17";
      m.frame = id;
      const footage = { "03": "00:03，只有一辆空公交驶过，车门没有开。", "17": "00:17，进度条停住。门外的人抬起手，胸前反出一道白光。", "41": "00:41，雨水漫过门槛。画面里一个人也没有。" };
      finish("frame", footage[id], "ui", advanced);
    } else if (action.startsWith("deduce-") && m.mounted.length === 2 && m.frame === "17" && m.parcelRead) {
      if (action !== "deduce-clerk") {
        finish("inference", action === "deduce-passenger"
          ? "车票的 07 是验票孔；随箱单的 07 却是落款。纸角和工牌的白痕也对得上。再想想是谁用过它们。"
          : "十七号格写的是汽水的位置；随箱单和工牌上的 07 指向当班的人。再对照那道半月形磨痕。", "blocked");
        return;
      }
      m.solved = true;
      m.panel = "identity";
      finish("identity", "你把工牌和随箱单对上了。第三位客人用过上一班店员的东西。", "success", true);
      ctx.root.querySelector("#ex-detail-title")?.focus();
    }
  }
  window.SceneManager = Object.freeze({ createState, normalize, render, deactivate, preloadArt, prepareRooms });
})();
