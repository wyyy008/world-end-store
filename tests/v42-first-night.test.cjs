const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const source = fs.readFileSync(path.join(__dirname, "..", "game.js"), "utf8");
function extract(name) {
  const start = source.indexOf("function " + name + "(");
  assert.ok(start >= 0);
  const body = source.indexOf("{", start);
  let depth = 0;
  for (let i = body; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") {
      depth--;
      if (!depth) return source.slice(start, i + 1);
    }
  }
  throw Error("Unclosed " + name);
}
function setup(clues) {
  const calls = [];
  const state = { flags: {}, firstNightExperience: { clues, phase: "investigate" } };
  const ctx = { state, firstNightPhase: () => state.firstNightExperience.phase,
    showToast: msg => calls.push(["toast", msg]), addMemory: msg => calls.push(["memory", msg]),
    playSfx: () => {}, commit: () => calls.push(["commit"]) };
  vm.createContext(ctx);
  vm.runInContext(extract("compareFirstNightEvidence"), ctx);
  return { state, calls, compare: () => ctx.compareFirstNightEvidence() };
}
test("requires receipt and camera", () => {
  const h = setup(["receipt", "timetable"]);
  h.compare();
  assert.equal(h.state.flags.firstNightTimeDeduction, undefined);
  assert.equal(h.calls.filter(x => x[0] === "memory").length, 0);
});
test("valid evidence creates one persistent deduction", () => {
  const h = setup(["receipt", "camera"]);
  h.compare();
  h.compare();
  assert.equal(h.state.flags.firstNightTimeDeduction, true);
  assert.equal(h.calls.filter(x => x[0] === "memory").length, 1);
  assert.equal(h.calls.filter(x => x[0] === "commit").length, 1);
});
test("does not run outside investigation", () => {
  const h = setup(["receipt", "camera"]);
  h.state.firstNightExperience.phase = "visitor";
  h.compare();
  assert.equal(h.state.flags.firstNightTimeDeduction, undefined);
});
test("keeps original visitor transition and save version", () => {
  assert.match(source, /experience\.clues\.length < 2/);
  assert.match(source, /const SAVE_KEY = "world-end-store-chapter-one-v5"/);
  assert.match(source, /version: 5/);
});
