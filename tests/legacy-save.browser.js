async (sourcePage) => {
  const context = await sourcePage.context().browser().newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const errors = [];
  page.on("pageerror", error => errors.push(String(error)));
  const url = "http://127.0.0.1:8765/index.html?preview=1";
  await page.goto(url);
  const original = await page.evaluate(() => {
    const fixture = createInitialState();
    fixture.version = 5;
    fixture.introSeen = true;
    fixture.openedNights = [1];
    fixture.stage = CONTENT.firstNight.cast[1].id;
    fixture.served["acheng-1"] = true;
    fixture.transactions.push({label:"首笔销售",amount:20,customer:"夜班第一位客人",night:1});
    fixture.firstNightExperience = {phase:"investigate",scanned:["umbrella","coffee","bag"],changeErrors:101,clues:["receipt","timetable"],decision:null};
    const raw = JSON.stringify(fixture);
    localStorage.setItem(LEGACY_SAVE_KEY, raw);
    return raw;
  });
  await page.reload();
  await page.locator("#continue-game-button").click();
  await page.locator("#approach-third-visitor").click();
  await page.locator('[data-visitor-choice="open"]').click();
  await page.locator("#continue-after-third-visitor").click();
  const results = await page.evaluate(() => ({
    old:localStorage.getItem(LEGACY_SAVE_KEY),
    next: JSON.parse(localStorage.getItem(SAVE_KEY))
  }));
  if (errors.length || results.old !== original || results.next.firstNightExperience.decision !== "open" ||
      results.next.transactions.length !== 1 || results.next.firstNightExperience.changeErrors !== 100) {
    throw Error("Legacy save check failed: " + JSON.stringify(errors));
  }
  await page.locator("#open-closing").click();
  const earlyClosing = page.getByRole("button", {name: /仍然打烊/});
  if (await earlyClosing.isVisible()) await earlyClosing.click();
  await page.locator("#keepsake-list button:not(:disabled)").first().click();
  await page.locator('[data-next-route="summer"]').click();
  for (let i = 0; i < 60 && await page.locator("#finale-dialog[open]").count(); i++) {
    await page.locator("#finale-continue").click();
  }
  await page.getByRole("button", {name: /倒着延伸的水迹/}).click();
  if (errors.length || !await page.evaluate(() => state.nightIndex === 1 && state.flags.doorTraceRead)) {
    throw Error("Opening the door failed to leave a night-two trace: " + JSON.stringify(errors));
  }
  await context.close();
  return {legacyPreserved:true,continuedAt:"investigate",noDuplicateSale:true,errorCount:100,doorDecision:"open",nightTwoTrace:true};
}
