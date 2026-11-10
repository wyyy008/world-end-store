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
  const badgeClue = "第三位客人穿着上一班店员的围裙。工牌上写着 07，右下角有一道半月形白痕。";
  const times = { "03": "00:03", "17": "00:17", "41": "00:41" };
  const views = ["arrange", "bottles", "scanner", "recorder", "waybill", "timetable", "bag", "book", "identity"];
  const validKey = (table, key) => typeof key === "string" && Object.hasOwn(table, key);

  function createState() {
    return {
      scene: "overview", panel: "", placed: [], held: "", bottle: "", frame: "",
      ticket: false, guestDone: false, shelfChanged: false, soda: false, receipt: false,
      mounted: [], solved: false, parcelRead: false, boardRead: false
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
  const reduced = () => document.body.classList.contains("reduce-motion") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const artwork = [];
  function preload() {
    if (artwork.length) return;
    ["store-wide", "ex-shelf", "ex-till", "ex-door", "ex-cctv", "ex-parcel"].forEach(name => {
      const image = new Image();
      image.decoding = "async";
      image.src = "assets/scenes/" + name + ".jpg";
      artwork.push(image);
    });
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
    arrange: ["把交班箱里的三件商品归架", "上一班把售价记在每件货的包装上。", "临窗货架下层有三条价格签。", "点货架的「价签与周转箱」。依次拿起纸袋、咖啡、雨伞，分别放到 4、6、10 元的价签后面。", "shelf"],
    guest: ["去收银台接待等伞的阿澄", "第二声门铃过去好一会儿了，那把湿伞还滴着水。", "阿澄在收银台等你。", "回店内全景，进收银台，点阿澄的身影。听完她的话，完成这笔交易。", "till"],
    bottles: ["找出票背上寄存的那瓶汽水", "车票背面还有一行铅笔字。", "十七号格就在临窗货架上层。今晚是 11 月 08 日。", "回到货架，点「十七号饮料格」。翻看橘子汽水的日期，把 11 月 09 日生产的那瓶取下来。", "shelf"],
    scanner: ["把异常汽水带到收银台扫码", "瓶底的条码在灯下泛白。", "收银台右侧有一道红色的扫描光。", "进入收银台，点「扫码器」，再把背包里的橘子汽水放上去。", "till"],
    recorder: ["到监控室，用两张纸核对录像", "票面和小票上都印着时间。", "收银台后面通向监控室，把两张纸压在回放台旁。", "在监控室点「回放台」，放上旧车票和未来收据。选两者共有的 00:17 录像，再查看胸牌。", "cctv"],
    continue: ["带着工牌线索，去听第三次门铃", "门上的铃铛轻轻摆了一下。", "门口有人等着。", "点线索下方的「去听第三次门铃」，或进店门近景，点门外的人。", "door"]
  };
  const targetActions = { arrange: "arrange", guest: "guest", bottles: "bottles", scanner: "scanner", recorder: "recorder", continue: "continue" };
  function nextAction(m) {
    if (ctx.revisit) return { action: "continue", label: "回到值班" };
    const step = phase(m);
    const destination = tasks[step][4];
    if (step === "continue") return { action: "continue", label: "去听第三次门铃" };
    if (m.scene !== destination) {
      const action = hintTarget(m);
      const labels = {
        "go-shelf": "去货架", "go-till": "去收银台", "go-cctv": "去监控室",
        back: "返回上一处"
      };
      return { action, label: labels[action] || "前往目标位置" };
    }
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
    return { action: "inspect-badge", label: "查看画面里的工牌" };
  }
  function nextInstruction(m) {
    const step = phase(m);
    if (ctx.revisit) return "背包和线索册都在画面上方。看完后回到值班。";
    if (m.scene !== tasks[step][4] && step !== "continue") {
      return "先到" + rooms[tasks[step][4]].title + "。画面里发亮的圆点可以点，近景可返回。";
    }
    if (step === "arrange") return m.held
      ? "包装上的售价是 ¥" + goods[m.held].price + "。把它放到相同的价签。"
      : "先从周转箱拿起一件货。点商品后会看到包装上的售价。";
    if (step === "guest") return "点击阿澄，选择怎么卖伞，再读完她的回应。";
    if (step === "bottles") return "票背写着十七号格。今晚是 11 月 08 日，找生产日期晚于今晚的汽水。";
    if (step === "scanner") return "瓶子已经在背包里。打开扫码器，把条码对准红光。";
    if (step === "recorder") return "把旧票与未来收据夹在屏幕旁，找两张纸上相同的时间。";
    return "你已经认出门外那人的工牌。现在可以回到门铃响起的剧情。";
  }
  function hintTarget(m) {
    const step = phase(m);
    const destination = tasks[step][4];
    if (m.scene === destination) return targetActions[step];
    if (m.scene === "till" && destination === "cctv") return "go-cctv";
    if (m.scene === "overview") return "go-" + (destination === "cctv" ? "till" : destination);
    return "back";
  }
  function updateHint() {
    if (!ctx) return;
    const node = ctx.root.querySelector(".ex-hint");
    if (!node) return;
    const text = hintLevel && !ctx.revisit ? tasks[phase(ctx.model)][hintLevel] : "";
    if (node.textContent !== text) node.textContent = text;
    node.hidden = !text;
    const target = hintTarget(ctx.model);
    ctx.root.querySelectorAll("[data-scene-action]").forEach(el => {
      el.classList.toggle("is-hinted", !ctx.revisit && hintLevel >= 2 && el.dataset.sceneAction === target);
    });
  }
  function tick() {
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
            body += '<span class="ex-evidence-line">00:17　玻璃里的人正要转身，围裙上的工牌闪了一下。</span>';
            buttons += btn("inspect-badge", "暂停画面，查看胸牌");
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
      (p === "scanner" && m.receipt);
    const next = finishedHere ? nextAction(m) : null;
    return `<section class="ex-detail" aria-labelledby="ex-detail-title"><header><h3 id="ex-detail-title" tabindex="-1">${title}</h3>${btn("detail-close", "收起", 'class="ex-dismiss"')}</header><p>${body}</p>
      ${message ? `<p class="ex-detail-feedback">${message}</p>` : ""}
      ${buttons ? '<div class="ex-choices">'+buttons+'</div>' : ""}
      ${next ? `<div class="ex-detail-next"><span>下一步</span>${btn(next.action, next.label)}</div>` : ""}
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
    const next = nextAction(m);
    const milestones = [
      ["整理货架", m.ticket],
      ["接待阿澄", m.guestDone],
      ["异常收银", m.receipt],
      ["监控时间", m.solved]
    ];
    root.innerHTML = `<div class="ex-shell" data-scene="${m.scene}" data-anomaly="${m.scene === "shelf" && m.shelfChanged}" data-soda="${m.soda}" data-receipt="${m.receipt}" data-frame="${m.frame}">
      <header class="ex-header"><div><small class="ex-kicker">第一夜 · 雾港公交站</small><h2 class="ex-title" tabindex="-1">${room.title}</h2></div>
      <nav class="ex-tools" aria-label="调查记录">${btn("bag", "背包", selected(m.panel === "bag"))}${btn("book", "线索册", selected(m.panel === "book"))}${ctx.revisit ? btn("continue", "回到值班") : ""}</nav></header>
      <div class="ex-layout">
        <div class="ex-main">
          <div class="ex-stage"><div class="ex-art" aria-hidden="true"></div><div class="ex-effects" aria-hidden="true"></div><div class="ex-prop" aria-hidden="true"></div>${hotspots}</div>
          <div class="ex-footer">${room.parent ? btn("back", "‹ 返回" + rooms[room.parent].title, 'class="ex-back"') : ""}<span class="ex-caption">${caption}</span></div>
          ${detail(m)}
        </div>
        <aside class="ex-rail" aria-label="第一夜任务栏">
          <small class="ex-rail-kicker">今晚要查的事</small>
          <ol class="ex-progress">${milestones.map(([label, done], index) =>
            `<li class="${done ? "is-done" : index === milestones.findIndex(([, complete]) => !complete) ? "is-current" : ""}"><span aria-hidden="true">${done ? "✓" : index + 1}</span>${label}</li>`).join("")}</ol>
          <div class="ex-current"><small>当前目标</small><strong>${ctx.revisit ? "查看已找到的线索" : tasks[phase(m)][0]}</strong><p>${nextInstruction(m)}</p>
            ${btn(next.action, next.label, 'class="ex-next-button"')}
          </div>
          <p class="ex-notice" role="status"${message ? "" : " hidden"}>${message}</p>
          <p class="ex-hint" aria-live="polite" hidden></p>
        </aside>
      </div></div>`;
    updateHint();
    if (focus) root.querySelector(focus)?.focus({ preventScroll: false });
    else if (active) root.querySelector(`[data-scene-action="${active}"]:not([disabled])`)?.focus({ preventScroll: true });
  }

  function render(context) {
    if (!context?.root || !context.model) { deactivate(); return; }
    const fresh = !ctx || ctx.model !== context.model || ctx.root !== context.root;
    if (fresh) deactivate();
    ctx = context;
    if (fresh) {
      preload();
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
    const changeScene = () => {
      m.scene = next;
      m.panel = "";
      message = "";
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
    if (action === "waybill") m.parcelRead = true;
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
    } else if (action === "inspect-badge" && m.mounted.length === 2 && m.frame === "17") {
      m.solved = true;
      m.panel = "identity";
      finish("identity", "你记下了第三位客人的工牌特征。", "success", true);
      ctx.root.querySelector("#ex-detail-title")?.focus();
    }
  }
  window.SceneManager = Object.freeze({ createState, normalize, render, deactivate });
})();
