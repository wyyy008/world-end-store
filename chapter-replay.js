/* Chapter checkpoints and independent journey slots. */
function journeyDirectory() {
  try {
    const directory = JSON.parse(localStorage.getItem(JOURNEY_KEY));
    const forks = Array.isArray(directory?.forks) ? directory.forks.filter(id => typeof id === "string" && /^[a-z0-9-]{1,64}$/.test(id)) : [];
    return { forks, active: forks.includes(directory?.active) ? directory.active : null };
  } catch {
    return { forks: [], active: null };
  }
}

function journeySaveKey(id = journeyDirectory().active) {
  return id ? `${SAVE_KEY}-fork-${id}` : SAVE_KEY;
}

function readJourneyRaw(id = journeyDirectory().active) {
  const key = journeySaveKey(id);
  return localStorage.getItem(key) ?? (key === SAVE_KEY ? localStorage.getItem(LEGACY_SAVE_KEY) : null);
}

function newJourneyId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
}

function chapterKey(id, nightIndex) {
  return `${SAVE_KEY}-chapter-${id}-${nightIndex}`;
}

function captureChapterEntry() {
  if (saveWriteBlocked) return;
  state.journeyId ||= newJourneyId();
  const entry = JSON.stringify({ ...state, vnHistory: [...vnHistory] });
  if (chapterReplay) {
    replayCheckpoints.set(state.nightIndex, entry);
    return;
  }
  try {
    localStorage.setItem(chapterKey(state.journeyId, state.nightIndex), entry);
  } catch {
    // The active journey still gets its normal autosave.
  }
}

function readChapterEntry(id, index) {
  if (!id) return null;
  try {
    const entry = normalizeSavedState(JSON.parse(localStorage.getItem(chapterKey(id, index))));
    return entry?.journeyId === id && entry.nightIndex === index && !entry.nightClosed ? entry : null;
  } catch {
    return null;
  }
}

function openChapterReplay() {
  const dialog = document.querySelector("#chapter-replay-dialog");
  const list = document.querySelector("#chapter-replay-list");
  const note = document.querySelector("#chapter-replay-note");
  list.replaceChildren();
  const addButton = (label, action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "secondary-button";
    button.textContent = label;
    button.addEventListener("click", action);
    list.append(button);
  };
  if (chapterReplay) {
    note.textContent = "这是临时重玩。你可以返回原旅途，或把这段进度另存成新旅途。";
    addButton("结束重玩，回到原旅途", () => { showTitleScreen(); continueGame(); });
    addButton("另存为新旅途", () => saveReplayAsFork(note));
  } else {
    const saved = readSavedState();
    const directory = journeyDirectory();
    note.textContent = "已完成且留有开场记录的夜晚可以重玩。旧旅途仍可在「对话历史」阅读。";
    const end = saved ? saved.nightIndex + Number(saved.nightClosed) : 0;
    for (let index = 0; index < end; index += 1) {
      const entry = readChapterEntry(saved.journeyId, index);
      if (!entry) continue;
      addButton(`重玩第 ${index + 1} 夜 · ${nightAtIndex(index, entry.route).place}`, () => {
        showTitleScreen();
        chapterReplay = true;
        state = entry;
        replayCheckpoints.clear();
        replayCheckpoints.set(index, JSON.stringify(entry));
        resumeJourney();
      });
    }
    if (saved?.vnHistory.length) addButton("回看已有对话", openHistoryDialog);
    if (directory.active) addButton("切回原旅途", () => switchJourney(null, note));
    for (const id of directory.forks) {
      if (id === directory.active) continue;
      try {
        const fork = normalizeSavedState(JSON.parse(localStorage.getItem(journeySaveKey(id))));
        if (fork) addButton(`切换到分支 · 第 ${fork.nightIndex + 1} 夜`, () => switchJourney(id, note));
      } catch { /* An invalid slot is excluded. */ }
    }
  }
  openDialog(dialog);
}

function switchJourney(id, note) {
  try {
    localStorage.setItem(JOURNEY_KEY, JSON.stringify({ ...journeyDirectory(), active: id }));
  } catch {
    note.textContent = "浏览器暂时无法切换旅途。";
    return;
  }
  showTitleScreen();
  continueGame();
}

function saveReplayAsFork(note) {
  if (!chapterReplay) return;
  const directory = journeyDirectory();
  const id = newJourneyId();
  const fork = normalizeSavedState({ ...state, journeyId: id, vnHistory: [...vnHistory] });
  if (!fork) return;
  const written = [];
  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    written.push(key);
  };
  try {
    write(journeySaveKey(id), fork);
    const forkPoint = Math.min(...replayCheckpoints.keys());
    for (let index = 0; index <= state.nightIndex; index += 1) {
      const raw = replayCheckpoints.get(index);
      const entry = raw ? normalizeSavedState(JSON.parse(raw))
        : index < forkPoint ? readChapterEntry(state.journeyId, index) : null;
      if (entry) write(chapterKey(id, index), { ...entry, journeyId: id });
    }
    localStorage.setItem(JOURNEY_KEY, JSON.stringify({ forks: [...directory.forks, id], active: id }));
  } catch {
    for (const key of written) {
      try { localStorage.removeItem(key); } catch { /* The unpublished slot stays hidden. */ }
    }
    note.textContent = "浏览器暂时无法另存。原旅途仍在，可以继续临时重玩。";
    return;
  }
  chapterReplay = false;
  replayCheckpoints.clear();
  showTitleScreen();
  continueGame();
}
