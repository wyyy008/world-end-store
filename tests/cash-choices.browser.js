async (sourcePage) => {
  const context = await sourcePage.context().browser().newContext({reducedMotion: "reduce"});
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const read = () => page.evaluate(() => JSON.parse(localStorage.getItem(SAVE_KEY)));
  const url = "http://127.0.0.1:8765/index.html?preview=1";
  async function openShop(fixture) {
    await page.goto(url);
    await page.evaluate(({cash, index, guestId}) => {
      const draft = createInitialState();
      draft.introSeen = true;
      draft.route = "summer";
      draft.nightIndex = index;
      draft.openedNights = Array.from({length: index + 1}, (_, i) => i + 1);
      draft.firstNightExperience.phase = "done";
      draft.stage = guestId;
      draft.cash = cash;
      draft.stock.radio = 1;
      localStorage.setItem(SAVE_KEY, JSON.stringify(draft));
    }, fixture);
    await page.reload();
    await page.locator("#continue-game-button").click();
    await page.locator("#next-step-button").click();
  }
  try {
    await openShop({cash:19,index:1,guestId:"xiaoman-1"});
    assert(await page.locator('[data-special-choice="buy-a-hot-meal"]').isDisabled(), "cash gate did not apply");
    assert(await page.locator('[data-special-choice="sunny"]').isEnabled(), "cash gate blocked a free-of-charge alternative");
    await openShop({cash:20,index:1,guestId:"xiaoman-1"});
    await page.locator('[data-special-choice="buy-a-hot-meal"]').click();
    const meal = await read();
    assert(meal.cash === 0 && meal.flags.xiaomanHotMeal && meal.transactions.at(-1).amount === -20, "meal was not booked once");
    await page.reload();
    await page.locator("#continue-game-button").click();
    assert(await page.locator(".choice-feedback").isVisible() && (await read()).cash === 0, "paid feedback did not restore");
    await openShop({cash:28,index:4,guestId:"xiaoman-tunnel"});
    await page.locator('[data-special-choice="repair-radio"]').click();
    const repair = await read();
    assert(repair.cash === 0 && repair.stock.radio === 0 && repair.flags.xiaomanRadioRepaired, "repair cost or stock did not update");
    return {insufficientCash:"fallback available",meal:-20,radioRepair:-28,refresh:"one charge"};
  } finally {
    await context.close();
  }
}
