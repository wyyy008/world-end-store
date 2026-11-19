(() => {
  "use strict";

  const dialog = document.querySelector("#opening-film");
  const skip = document.querySelector("#opening-skip");
  const begin = document.querySelector("#opening-start");
  const sound = document.querySelector("#opening-sound");
  const replay = document.querySelector("#replay-opening");
  let timers = [];
  let closing = false;

  function reducedMotion() {
    let saved = false;
    try { saved = JSON.parse(localStorage.getItem("world-end-store-settings-v1"))?.reducedMotion === true; }
    catch { /* The saved setting may be absent or invalid. */ }
    return saved || matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function clearTimeline() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function close(startGame = false) {
    if (closing || !dialog.open) return;
    closing = true;
    clearTimeline();
    dialog.classList.add("is-exiting");
    setTimeout(() => {
      dialog.close();
      dialog.classList.remove("is-exiting");
      closing = false;
      if (startGame) requestNewGame();
      else document.querySelector("#new-game-button")?.focus({ preventScroll: true });
    }, reducedMotion() ? 0 : 220);
  }

  function show() {
    if (dialog.open || document.querySelector("#title-screen")?.hidden !== false) return;
    closing = false;
    clearTimeline();
    dialog.dataset.phase = "rain";
    dialog.dataset.lights = "0";
    skip.hidden = false;
    begin.hidden = true;
    sound.hidden = reducedMotion();
    dialog.showModal();
    skip.focus({ preventScroll: true });
    if (reducedMotion()) {
      dialog.dataset.phase = "title";
      dialog.dataset.lights = "6";
      begin.hidden = false;
      begin.focus({ preventScroll: true });
      return;
    }
    timers.push(setTimeout(() => {
      dialog.dataset.phase = "first";
      window.GameAudio?.playSfx("door");
    }, 2000));
    timers.push(setTimeout(() => { dialog.dataset.phase = "second"; }, 5000));
    for (let index = 1; index <= 6; index += 1) {
      timers.push(setTimeout(() => { dialog.dataset.lights = String(index); }, 7600 + index * 245));
    }
    timers.push(setTimeout(() => {
      dialog.dataset.phase = "title";
      begin.hidden = false;
      begin.focus({ preventScroll: true });
    }, 9350));
  }

  skip.addEventListener("click", () => close());
  sound.addEventListener("click", () => {
    window.GameAudio?.unlock();
    sound.hidden = true;
  });
  begin.addEventListener("click", () => close(true));
  replay.addEventListener("click", show);
  dialog.addEventListener("cancel", event => {
    event.preventDefault();
    close();
  });

  if (!new URLSearchParams(location.search).has("preview")) show();
})();
