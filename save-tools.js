/* Portable backups use the same validation and resume path as local autosaves. */
(() => {
  const FORMAT = "world-end-store-save";
  const exportButton = document.querySelector("#export-save");
  const input = document.querySelector("#import-save-file");
  const preview = document.querySelector("#save-preview");
  const feedback = document.querySelector("#save-feedback");
  let pendingSave = null;
  let readingFile = false;

  function currentSave() {
    return normalizeSavedState(elements.titleScreen.hidden ? state : readSavedState());
  }

  function report(message, isError = false) {
    feedback.textContent = message;
    feedback.classList.toggle("is-error", isError);
  }

  function cancelImport() {
    pendingSave = null;
    preview.hidden = true;
    input.value = "";
  }

  function refreshBackupControls() {
    exportButton.disabled = !hasPlayableSave(currentSave());
  }

  exportButton.addEventListener("click", () => {
    const saved = currentSave();
    if (!saved || !hasPlayableSave(saved)) {
      report("还没有可备份的进度，先推门进去吧。");
      return;
    }
    const payload = { format: FORMAT, formatVersion: 1, exportedAt: new Date().toISOString(), state: saved };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `世界尽头的便利店-第${saved.nightIndex + 1}夜-存档.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    report("存档已交给浏览器下载，包含当前阅读位置与对话历史。");
  });

  document.querySelector("#import-save").addEventListener("click", () => {
    cancelImport();
    report("");
    input.click();
  });

  input.addEventListener("change", async () => {
    const file = input.files[0];
    if (!file || readingFile) return;
    readingFile = true;
    cancelImport();
    try {
      if (file.size > 1024 * 1024) throw new Error("这份文件太大，请选择本游戏下载的 JSON 存档。");
      let payload;
      try {
        payload = JSON.parse(await file.text());
      } catch {
        throw new Error("没有读懂这份文件。请选择完整的 JSON 存档。");
      }
      if (payload?.format && (payload.format !== FORMAT || payload.formatVersion !== 1)) {
        throw new Error("这不是当前试玩版支持的存档格式。");
      }
      const candidate = payload?.format === FORMAT ? payload.state : payload;
      const saved = normalizeSavedState(candidate);
      if (!saved || !hasPlayableSave(saved)) throw new Error("存档数据不完整，或不属于当前八夜试玩版。现有进度已保留。");
      pendingSave = saved;
      const night = nightAtIndex(saved.nightIndex, saved.route);
      const location = !saved.introSeen ? "序章" : saved.finished ? "终章" : saved.nightClosed ? "打烊后" : "营业中";
      document.querySelector("#save-preview-detail").textContent =
        `第 ${night.number} 夜 · ${night.place} · ${location}；留下 ${saved.memories.length} 条记忆，已读过去 ${saved.pastSeen.length}/5。`;
      preview.hidden = false;
      report("已读到存档。确认载入后才会替换当前进度。");
      preview.scrollIntoView({ block: "nearest" });
      document.querySelector("#confirm-import-save").focus({ preventScroll: true });
    } catch (error) {
      report(error.message, true);
    } finally {
      readingFile = false;
    }
  });

  document.querySelector("#cancel-import-save").addEventListener("click", () => {
    cancelImport();
    report("已取消，当前旅途没有改变。");
    document.querySelector("#import-save").focus();
  });

  document.querySelector("#confirm-import-save").addEventListener("click", () => {
    if (!pendingSave) return;
    try {
      // Do not replace the live game until the browser has accepted the save.
      localStorage.setItem(SAVE_KEY, JSON.stringify(pendingSave));
    } catch {
      report("浏览器暂时无法保存，未替换当前旅途。请允许本站使用本地存储后再试。", true);
      return;
    }
    cancelImport();
    closeDialog(elements.settingsDialog);
    showTitleScreen();
    continueGame();
    report("");
    refreshBackupControls();
    showToast("存档已载入，旅途从这里继续。");
  });

  // Settings can be opened from the cover, prologue, or shop without changing progress.
  new MutationObserver(() => {
    if (elements.settingsDialog.open) refreshBackupControls();
    else cancelImport();
  }).observe(elements.settingsDialog, { attributes: true, attributeFilter: ["open"] });
  refreshBackupControls();
})();
