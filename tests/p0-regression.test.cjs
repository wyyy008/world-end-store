// Run: node --test tests/p0-regression.test.cjs
// Isolated guards exercise the exact function bodies without a browser dependency.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(require("node:path").join(__dirname, "..", "game.js"), "utf8");
function extract(name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0, name + " exists");
  let depth = 0, body = source.indexOf("{", start);
  for (let i = body; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}" && --depth === 0) return source.slice(start, i + 1);
  }
  throw Error("Unclosed function: " + name);
}
function harness(name, extra = {}) {
  const events = [];
  const state = { stage: "guest", nightClosed: false, finished: false, cash: 30, time: 6,
    stock: { umbrella: 2, coffee: 4 }, served: {}, flags: {}, firstNightExperience:
    { phase: "sale", scanned: ["umbrella", "coffee", "bag"], changeErrors: 0, clues: [], decision: null } };
  const context = { state, products: { umbrella: { name: "雨伞" }, coffee: { name: "咖啡" } },
    firstNightPhase: () => state.firstNightExperience.phase,
    playSfx: x => events.push(x), showToast: x => events.push(x),
    commit: () => events.push("commit"), addTransaction: () => events.push("transaction"),
    unlockAchievement: () => {}, spendTime: n => { state.time -= n; },
    logVnChoice: () => {}, markCharacterMet: () => {}, applyFlags: () => {},
    addMemory: () => {}, logVnLine: () => {}, advanceStage: () => {},
    currentNight: () => ({ number: 1 }), renderPurchaseResult: () => {},
    ...extra };
  vm.createContext(context);
  vm.runInContext(extract(name), context);
  return { state, events, run: (...args) => context[name](...args) };
}
test("first sale: insufficient stock cannot mutate cash, stock, or phase", () => {
  const h = harness("finishFirstSale");
  h.state.stock.umbrella = 0;
  h.run(30);
  assert.equal(h.state.cash, 30);
  assert.equal(h.state.stock.umbrella, 0);
  assert.equal(h.state.firstNightExperience.phase, "sale");
  assert.ok(!h.events.includes("transaction"));
});
test("first sale: valid change completes exactly once", () => {
  const h = harness("finishFirstSale");
  h.run(30);
  assert.equal(h.state.cash, 50);
  assert.equal(h.state.stock.umbrella, 1);
  assert.equal(h.state.firstNightExperience.phase, "receipt");
  h.run(30);
  assert.equal(h.state.cash, 50);
});
test("purchase: unknown price option cannot corrupt cash", () => {
  const h = harness("completePurchase");
  h.run({ id: "guest", product: "umbrella", quantity: 1, prices: { normal: 10 } }, "invalid");
  assert.equal(h.state.cash, 30);
  assert.equal(h.state.stock.umbrella, 2);
  assert.ok(!h.events.includes("transaction"));
});
test("purchase: no time remaining cannot execute", () => {
  const h = harness("completePurchase");
  h.state.time = 0;
  h.run({ id: "guest", product: "umbrella", quantity: 1, prices: { normal: 10 } }, "normal");
  assert.equal(h.state.cash, 30);
});
test("quick sale: invalid amount cannot corrupt cash", () => {
  const h = harness("serveQuickCustomer");
  h.run({ id: "guest", product: "umbrella", quantity: 1, amount: NaN });
  assert.equal(h.state.cash, 30);
  assert.equal(h.state.stock.umbrella, 2);
});
test("save: checkpoint and legacy migration guards remain present", () => {
  assert.match(source, /saved\.version !== 5/);
  assert.match(source, /saved\.firstNightExperience !== undefined/);
  assert.match(source, /opening\.decision === "verify"/);
  assert.match(source, /opening\.clues\.length < 2/);
  assert.match(source, /Existing saves continue from their original position/);
});
