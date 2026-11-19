# V6 浏览器回归

在仓库目录执行 `node tests/serve.cjs`，保持该终端开启。用另一个终端运行下面的命令。请用专门的浏览器会话，前三项会在该会话中开始一段新旅途。

```powershell
playwright-cli -s=v6-qa open http://127.0.0.1:8765/index.html
playwright-cli -s=v6-qa run-code --filename tests/first-night.browser.js
playwright-cli -s=v6-qa run-code --filename tests/chapter-replay.browser.js
playwright-cli -s=v6-qa run-code --filename tests/routes.browser.js
playwright-cli -s=v6-qa run-code --filename tests/legacy-save.browser.js
playwright-cli -s=v6-qa run-code --filename tests/save-roundtrip.browser.js
```

- `first-night` 验证找零反馈、收据焦点、整理中途刷新、扣一格、错误关联、无监控的门铃选项，以及接待完首夜所有顾客。
- `chapter-replay` 会接续上一项。从第一夜转入无眠车站，再以 390px 视口回溯第一夜，解锁监控选项并另存。原旅途的 JSON 必须逐字节相同。
- `routes` 会接续上一项。从另存的旅途进入夏天路线，到拆包结局。再切回车站路线，到封存结局。这个用例验证路线衔接，可提前打烊。
- `legacy-save` 在独立浏览器上下文中导入模拟的 V5 第一夜调查进度，验证续玩、旧键保留、计数修正与防重复结算。
- `save-roundtrip` 在独立浏览器上下文检查零库存 V5 首单恢复、JSON 下载、损坏文件拒绝、取消导入以及确认导入。
