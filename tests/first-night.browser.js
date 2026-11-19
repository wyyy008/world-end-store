async (page) => {
  const assert = (condition, msg) => { if (!condition) throw new Error(msg); };
  const click = s => page.locator(s).first().click({ timeout: 3500 });
  const get = () => page.evaluate(() => JSON.parse(localStorage.getItem("world-end-store-chapter-one-v6")));
  async function consumeStory() {
    for (let i = 0; i < 50 && await page.locator("#finale-dialog[open]").count(); i++) await click("#finale-continue");
    assert(await page.locator("#finale-dialog[open]").count() === 0, "story not dismissed");
  }
  async function enter() {
    if (await page.getByRole("button", {name:"跳过动画"}).isVisible()) await page.getByRole("button", {name:"跳过动画"}).click();
    await click("#continue-game-button");
    await consumeStory();
  }
  async function scene(action) {
    await click(`[data-scene-action="${action}"]`);
    if (action.startsWith("go-") || action === "back") await page.waitForTimeout(190);
  }
  await page.setViewportSize({width:1366,height:768});
  await page.goto("http://127.0.0.1:8765/index.html");
  await page.emulateMedia({reducedMotion:"reduce"});
  if (await page.getByRole("button", {name:"跳过动画"}).isVisible()) await page.getByRole("button", {name:"跳过动画"}).click();
  await click("#new-game-button");
  if (await page.locator("#new-game-dialog[open]").count()) await click("#confirm-new-game");
  await consumeStory();
  await click("#counter-stage [data-v6-register]");
  await click('[data-first-scan="umbrella"]');
  await page.reload();
  await enter();
  assert(await page.locator(".pos-display strong").textContent() === "¥10", "scan progress did not restore");
  for (const id of ["coffee","bag"]) await click(`[data-first-scan="${id}"]`);
  await click("#v6-register-record");
  await click('[data-first-change="20"]');
  assert(await page.locator(".v6-till-feedback").isVisible(), "wrong change has no inline feedback");
  await click('[data-first-change="30"]');
  assert(await page.locator("#inspect-first-receipt:focus").count() === 1, "receipt lost focus after payment");
  const paid = await get();
  assert(paid.time === 6 && paid.cash === 50 && paid.transactions.length === 1, "bad sale");
  await page.reload();
  await enter();
  assert((await get()).cash === paid.cash, "reloading repeated sale");
  assert((await page.locator("#inspect-first-receipt").textContent()).includes("明日 00:17"), "missing future receipt");
  await click("#inspect-first-receipt");
  await page.getByRole("button", {name:"接待阿澄", exact:true}).first().click();
  await click('[data-v6-umbrella="ask"]');
  await click('[data-trade-price="normal"]');
  const trade = await get();
  await page.reload();
  await enter();
  assert((await get()).transactions.length === trade.transactions.length, "reloading repeated Ah Cheng's sale");
  await click("#trade-continue");
  await consumeStory();
  assert((await get()).firstNightExperience.phase === "shelf", "shelf not unlocked");
  await scene("go-shelf");
  await scene("label");
  await scene("back");
  assert(await page.locator(".ex-next-button").getAttribute("data-scene-action") === "go-shelf", "wrong starting guide");
  await scene("go-shelf");
  await scene("tidy");
  await scene("sort-umbrella");
  const timeBeforeTidy = (await get()).time;
  await page.reload();
  await enter();
  assert(await page.locator('[data-scene-action="sort-umbrella"][aria-pressed="true"]').count() === 1, "shelf draft was lost");
  assert((await get()).time === timeBeforeTidy, "unfinished sorting cost time");
  await scene("sort-lunchbox");
  await scene("commit-tidy");
  assert((await get()).time === 4, "tidy spent wrong time");
  assert(await page.locator(".ex-next-button").getAttribute("data-scene-action") === "back", "an optional clue incorrectly unlocked the link guide");
  await scene("back");
  await scene("go-door");
  await scene("timetable");
  await scene("umbrella");
  await scene("book");
  await scene("select-receipt");
  await scene("select-lunchbox");
  await scene("connect");
  assert(await page.getByRole("status").filter({hasText:"没有共同的时间"}).count() === 1, "invalid combo accepted");
  await scene("select-lunchbox");
  await scene("select-timetable");
  await scene("connect");
  assert((await get()).firstNightExperience.combinedClues === "receipt+timetable", "pair not saved");
  assert((await get()).time === 4, "investigation consumed time");
  assert(await page.locator(".ex-clue-entry.is-linked").count() === 2, "linked evidence not marked");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "desktop overflow");
  await scene("continue");
  assert(await page.locator('[data-visitor-choice="verify"]').count() === 0, "verify without camera");
  await click('[data-visitor-choice="wait"]');
  await click("#continue-after-third-visitor");
  await click("#customer-actions button");
  const beforeGift = await get();
  await click("[data-counter-coffee]");
  assert((await get()).transactions.length === beforeGift.transactions.length, "placing the can completed the sale");
  await click('[data-commuter-deal="station-gift"]');
  await page.reload();
  await enter();
  const gifted = await get();
  assert(gifted.cash === beforeGift.cash && gifted.time === beforeGift.time &&
    gifted.stock.coffee === beforeGift.stock.coffee - 1 && gifted.flags.stationCoffeeGift,
    "commuter gift did not persist once");
  assert(await page.locator(".choice-feedback").getByText("店里请客", {exact:false}).count() > 0, "gift feedback did not restore");
  await click("#trade-continue");
  await click("#customer-actions button");
  const beforePremium = await get();
  await click('[data-trade-price="high"]');
  const premium = await get();
  assert(premium.cash === beforePremium.cash + 20 && premium.flags.shenPackedBoth && !premium.flags.unopenedCoffee,
    "premium sale did not change the keepsake");
  await click("#trade-continue");
  await consumeStory();
  const end = await get();
  assert(end.served["commuter-1"] && end.served["shen-1"], "closing guests were not served");
  return {phase:end.firstNightExperience.phase, guests:end.served, remainingTime:end.time};
}
