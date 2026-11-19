async (page) => {
  const click = s => page.locator(s).first().click({ timeout: 4000 });
  const isVisible = s => page.locator(s).first().isVisible();
  const expected = (value, msg) => { if (!value) throw new Error(msg); };
  const get = () => page.evaluate(() => {
    const key="world-end-store-chapter-one-v6";
    const id=JSON.parse(localStorage.getItem(key+"-journeys"))?.active;
    return JSON.parse(localStorage.getItem(id ? key+"-fork-"+id : key));
  });
  async function story() {
    for (let i=0; i<120 && await isVisible("#finale-dialog[open] #finale-continue"); i++) await click("#finale-continue");
  }
  async function closeNight(openParcel) {
    if (openParcel) await page.getByRole("button",{name:/把包裹放上柜台/}).first().click();
    await click("#open-closing");
    const early = page.getByRole("button",{name:/仍然打烊/});
    if (await early.isVisible()) await early.click();
    if (await early.isVisible()) await early.click();
    if (openParcel) await page.getByRole("button",{name:/拆开包裹/}).click();
    else if (await page.getByRole("button",{name:/重新封好包裹/}).isVisible()) await page.getByRole("button",{name:/重新封好包裹/}).click();
    else await click("#keepsake-list button:not(:disabled)");
    await story();
    expected((await get()).nightClosed, "night was not closed");
  }
  async function loop(route) {
    const nights=[];
    while (true) {
      const night=(await get()).nightIndex+1;
      await closeNight(route === "summer" && night === 8);
      nights.push(night);
      if (night===8) break;
      if (night===1) {
        await click(`[data-next-route="${route}"]`);
        if (await isVisible("[data-chapter-skip]")) await click("[data-chapter-skip]");
      } else await click("#next-night");
      await story();
      if (route === "summer" && night === 1) {
        await click("[data-night-two-trace]");
        expected((await get()).flags.doorTraceRead, "night two CCTV trace was not recorded");
      }
    }
    const final = await get();
    expected(final.finished && final.route === route && final.closingChoice === (route === "summer" ? "openParcel" : "sealParcel"), "expected ending was not reached");
    return nights;
  }
  await page.goto("http://127.0.0.1:8765/index.html?preview=1");
  await page.emulateMedia({reducedMotion:"reduce"});
  await click("#continue-game-button");
  const summer = (await get()).finished ? [] : await loop("summer");
  await page.evaluate(() => showTitleScreen());
  await click("#open-settings");
  await click("#open-chapter-replay");
  await page.getByRole("button",{name:"切回原旅途"}).click();
  await story();
  const station = await loop("station");
  return {summer,station};
}
