async (sourcePage) => {
  const context = await sourcePage.context().browser().newContext({acceptDownloads: true});
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const key = "world-end-store-chapter-one-v6";
  const raw = () => page.evaluate(key => localStorage.getItem(key), key);
  const settings = () => page.locator("#open-settings-nav").click();
  const upload = file => page.locator("#import-save-file").setInputFiles(file);
  try {
    await page.goto("http://127.0.0.1:8765/index.html?preview=1");
    const legacy = await page.evaluate(() => {
      const fixture = createInitialState();
      fixture.version = 5;
      fixture.introSeen = true;
      fixture.openedNights = [1];
      fixture.time = 0;
      fixture.stock.umbrella = 0;
      fixture.stock.coffee = 0;
      fixture.firstNightExperience.scanned = ["umbrella", "coffee", "bag"];
      const legacy = JSON.stringify(fixture);
      localStorage.setItem(LEGACY_SAVE_KEY, legacy);
      return legacy;
    });
    await page.reload();
    await page.locator("#continue-game-button").click();
    await page.locator('[data-first-change="20"]').click();
    await page.locator('[data-first-change="40"]').click();
    const unpaid = JSON.parse(await raw());
    assert(unpaid.cash === 30 && unpaid.transactions.length === 0 && unpaid.firstNightExperience.changeErrors === 2,
      "incorrect change altered the sale");
    await page.locator('[data-first-change="30"]').click();
    await page.locator("#inspect-first-receipt").click();
    const sold = JSON.parse(await raw());
    assert(sold.cash === 50 && sold.transactions.length === 1 && sold.stock.umbrella === 0 && sold.stock.coffee === 0,
      "the zero-stock sale did not settle once");
    await page.locator("#customer-actions button").click();
    await page.locator("#shortage-story").click();
    await page.locator("#shortage-story").click();
    const investigated = JSON.parse(await raw());
    assert(investigated.firstNightExperience.phase === "investigate" && investigated.transactions.length === 1,
      "the zero-stock legacy save could not enter investigation");

    await settings();
    const [download] = await Promise.all([page.waitForEvent("download"), page.locator("#export-save").click()]);
    const backup = await download.path();
    assert(backup && download.suggestedFilename().endsWith(".json"), "no downloadable JSON");
    const before = await raw();
    await upload({name: "bad.json", mimeType: "application/json", buffer: Buffer.from("{")});
    await page.locator("#save-feedback.is-error").waitFor();
    assert(await raw() === before, "malformed JSON overwrote the file");
    await upload(backup);
    await page.locator("#confirm-import-save").waitFor();
    await page.locator("#cancel-import-save").click();
    assert(await raw() === before, "cancel changed the save");
    await page.locator('[data-close="settings-dialog"]').last().click();
    await page.locator('[data-first-clue="receipt"]').click();
    assert(await raw() !== before, "could not produce state to restore");
    await settings();
    await upload(backup);
    await page.locator("#confirm-import-save").click();
    const restored = JSON.parse(await raw());
    assert(restored.firstNightExperience.clues.length === 0 && restored.transactions.length === 1, "confirmed import did not restore backup");
    assert(await page.evaluate(() => localStorage.getItem(LEGACY_SAVE_KEY)) === legacy, "original V5 key changed");
    return {zeroStockSale: "passed", legacyProgression: "passed", exportImport: "passed", corruptAndCancelPreserveSave: "passed"};
  } finally {
    await context.close();
  }
}
