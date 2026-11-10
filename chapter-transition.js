(() => {
  let active = null;

  const routes = {
    station: {
      name: "无眠车站",
      title: "没有钟的车站",
      broadcast: "列车即将进站。下一站，无眠车站。",
      change: "雨棚下的长椅还在。它旁边，又亮起了第二盏、第三盏站台灯。"
    },
    summer: {
      name: "倒着走的夏天",
      title: "有人先说了再见",
      broadcast: "雨声里，有一只蝉先叫了一声。",
      change: "长椅上的水印一圈圈收小。西边的太阳沿着电线，慢慢往回爬。"
    }
  };

  function scenePicture(scene, className) {
    const portrait = scene === "first-sale" ? "" :
      `<source media="(orientation: portrait)" srcset="assets/scenes/${scene}-portrait.jpg">`;
    return `<picture class="passage-shot ${className}" aria-hidden="true">${portrait}
      <img src="assets/scenes/${scene}-wide.jpg" alt="" decoding="async"></picture>`;
  }

  function stop() {
    if (!active) return;
    const {timers, dialog, root, listeners} = active;
    active = null;
    timers.forEach(clearTimeout);
    listeners.abort();
    window.GameAudio?.stopChapterAnnouncement();
    window.GameAudio?.restoreAmbience();
    if (dialog.open) dialog.close();
    root.hidden = true;
    root.replaceChildren();
    root.classList.remove("passage-screen");
    delete root.dataset.beat;
  }

  function play({root, route, soundEnabled = true, onFinish}) {
    if (!root || !Object.hasOwn(routes, route)) return;
    if (active?.root === root && active.route === route) return;
    stop();
    const info = routes[route];
    const dialog = root.tagName === "DIALOG" ? root : document.createElement("dialog");
    if (dialog !== root) root.replaceChildren(dialog);
    dialog.classList.add("passage-screen");
    dialog.setAttribute("aria-label", "第一夜收班");
    dialog.innerHTML = `
      <div class="passage-frame">
        ${scenePicture("road", "passage-road")}
        ${scenePicture(route, "passage-destination")}
        ${scenePicture("first-sale", "passage-till")}
        <div class="passage-shading" aria-hidden="true"></div>
        <div class="passage-lcd" aria-hidden="true"><small>收银机</small><b>打 烊</b></div>
        <div class="passage-slip" aria-hidden="true">
          <span>世界尽头的便利店</span><i>第一夜 · 交班凭条</i>
          <strong>下一站：${info.name}</strong><small>请随店到站</small>
        </div>
        <div class="passage-narration" aria-live="polite" aria-atomic="true">
          <p class="passage-caption"></p>
        </div>
        <div class="passage-title" hidden>
          <p>第二夜 <span>／</span> ${info.name}</p><h2>${info.title}</h2>
        </div>
        <button type="button" class="passage-control" data-chapter-skip>跳过演出</button>
      </div>`;
    const listeners = new AbortController();
    const run = {root, dialog, route, timers: [], listeners};
    active = run;
    const button = dialog.querySelector(".passage-control");
    const caption = dialog.querySelector(".passage-caption");
    const finish = () => {
      if (active !== run) return;
      stop();
      onFinish();
    };
    button.addEventListener("click", finish, {signal: listeners.signal});
    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      finish();
    }, {signal: listeners.signal});
    // The game has document-level dialogue shortcuts. The modal owns its keys.
    dialog.addEventListener("keydown", event => event.stopPropagation(), {signal: listeners.signal});
    dialog.dataset.beat = "close";
    root.hidden = false;
    if (!dialog.open) dialog.showModal();
    button.focus({preventScroll: true});
    caption.textContent = "你按下打烊键。绿字熄了，钱箱咔哒落锁。";
    if (soundEnabled) {
      window.GameAudio?.playSfx("till-close");
      if (route === "station") window.GameAudio?.playChapterAnnouncement();
    }
    function schedule(delay, beat, captionText, after) {
      run.timers.push(setTimeout(() => {
        if (active !== run) return;
        dialog.dataset.beat = beat;
        caption.textContent = captionText;
        after?.();
      }, delay));
    }
    schedule(1300, "print", `收银机又吐出一截纸。下一站：${info.name}。`, () => {
      if (soundEnabled) window.GameAudio?.playSfx("printer");
    });
    schedule(3500, "window", "玻璃门外，末班公交的站牌已经熄灯。", () => {
      window.GameAudio?.fadeAmbience(2.3);
    });
    schedule(5000, "arrival", info.broadcast, () => {
      if (soundEnabled && route === "summer") window.GameAudio?.playSfx("cicada");
    });
    schedule(route === "station" ? 9450 : 6700, "platform", info.change);
    schedule(route === "station" ? 11900 : 9200, "title", `第二夜。${info.name}。${info.title}。`, () => {
      dialog.querySelector(".passage-title").hidden = false;
      dialog.setAttribute("aria-label", "第二夜");
      button.textContent = "进入第二夜";
      delete button.dataset.chapterSkip;
      button.dataset.chapterEnter = "";
    });
  }

  window.ChapterTransition = {play, stop};
})();
