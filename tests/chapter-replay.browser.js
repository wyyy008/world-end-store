async (page) => {
  const assert = (condition, msg) => { if (!condition) throw new Error(msg); };
  const click = s => page.locator(s).first().click({ timeout: 4000 });
  const original = () => page.evaluate(() => localStorage.getItem("world-end-store-chapter-one-v6"));
  async function story() {
    for (let i = 0; i < 60 && await page.locator("#finale-dialog[open]").count(); i++) await click("#finale-continue");
  }
  async function scene(a) { await click(`[data-scene-action="${a}"]`); }
  await page.setViewportSize({width:390,height:844});
  await page.goto("http://127.0.0.1:8765/index.html?preview=1");
  await page.emulateMedia({reducedMotion:"reduce"});
  await click("#continue-game-button");
  await click("#open-closing");
  const earlyClosing = page.getByRole("button", {name:/仍然打烊/});
  if (await earlyClosing.isVisible()) await earlyClosing.click();
  await click("#keepsake-list button");
  assert(JSON.parse(await original()).nightClosed, "first night did not close");
  await click('[data-next-route="station"]');
  if (await page.locator("[data-chapter-skip]").count()) await click("[data-chapter-skip]");
  await story();
  assert(JSON.parse(await original()).nightIndex === 1, "transition did not reach night 2");
  await click("[data-night-two-trace]");
  const base = await original();
  assert(JSON.parse(base).flags.doorTraceRead, "trace not stored");
  await page.evaluate(() => document.querySelector("#open-settings-nav").click());
  await click("#open-chapter-replay");
  await page.getByRole("button",{name:/重玩第 1 夜/}).click();
  await story();
  await click("#counter-stage [data-v6-register]");
  for (const id of ["umbrella","coffee","bag"]) await click(`[data-first-scan="${id}"]`);
  await click('[data-first-change="30"]');
  await click("#inspect-first-receipt");
  await page.getByRole("button", {name:"接待阿澄", exact:true}).first().click();
  await click('[data-v6-umbrella="leave"]');
  await click('[data-trade-price="gift"]');
  await click("#trade-continue");
  await story();
  await scene("go-shelf"); await scene("tidy"); await scene("sort-umbrella"); await scene("sort-lunchbox"); await scene("commit-tidy");
  await scene("back"); await scene("go-till"); await scene("go-cctv"); await scene("recorder"); await scene("camera-compare");
  await scene("book"); await scene("select-camera"); await scene("select-receipt"); await scene("connect");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "mobile overflow");
  assert(await page.locator('[data-scene-action="continue"]').count() === 0, "door opened from the CCTV room");
  await scene("back"); await scene("back"); await scene("go-door");
  await scene("continue");
  await click('[data-visitor-choice="verify"]');
  await click("#continue-after-third-visitor");
  assert(await original() === base, "replay overwrote original");
  await click("#chapter-replay-active");
  await page.getByRole("button", {name:"另存为新旅途"}).click();
  const fork = await page.evaluate(() => {
    const key = "world-end-store-chapter-one-v6";
    const dir = JSON.parse(localStorage.getItem(key+"-journeys"));
    return JSON.parse(localStorage.getItem(key+"-fork-"+dir.active));
  });
  assert(fork.firstNightExperience.decision === "verify" && fork.nightIndex === 0, "fork did not preserve changed decision");
  assert(await original() === base, "fork overwrote original");
  return {originalNight:2, forkNight:1, decision:fork.firstNightExperience.decision, originalUnchanged:true};
}
