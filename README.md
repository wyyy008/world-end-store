# 世界尽头的便利店 · 网页发布版

公开地址：[https://wyyy008.github.io/world-end-store/](https://wyyy008.github.io/world-end-store/)

这个仓库只保存网页运行所需的文件，并负责把游戏发布到 GitHub Pages。开发源文件仍在：

`C:\Users\wuyiy\Documents\world_end_store_plan`

## 更新方法

在源项目里改完 `index.html`、`styles.css`、`game.js`、`content.js`、`audio.js` 或 `assets/` 之后：

1. 双击本目录的 `发布更新.cmd`
2. 等窗口显示 “Published via GitHub API”
3. GitHub Pages 会自动重新发布，通常一到两分钟

也可以直接用 PowerShell：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\publish.ps1 -Message "更新说明"
```

发布脚本通过 GitHub API 直接提交，不依赖 `git push`；即使本机到 `github.com` 的 Git 端口不稳定也能发布。

网址不会改变。玩家的浏览器存档也留在同一个域名下。
