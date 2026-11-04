# PLANS：今晚雛形的跑法與進度

這份是主對話在排工作包時維護的進度檔。實作者的細節規格在 `TECH.md` 第 10 節「實作分工」，設計在 `BRIEF.md`。

## 規則（整晚都照這個）

1. **一次只讓一個 agent 寫程式。** 一棒做完、我驗收過，才叫下一棒。
2. **驗收**：`npm test` 要全過；有畫面的包再起 `npm run serve`、用 `?debug=1` 檢查。沒過就不往下一棒，寫進下面的「卡住」。
3. **不 commit、不 push**，不動 repo 以外的檔案，不自己下載網路素材，不全域安裝套件。
4. **每棒做完，在下面「日誌」補一行**：做了什麼、驗收結果。
6. **課程硬規定：最終作品要純前端（HTML／CSS／JS），方便老師部署。** 交出去的東西不能依賴 Node、後端或 CDN，也不能要老師先 `npm install` 才能玩。開發用的工具（`npm test`、本機伺服器）可以留，但不能是玩遊戲的必要條件。每一棒都不要加外部依賴。
5. **額度**：每棒前查額度。5 小時或每週到 90%，或遇到限流，剩下的棒改用 `ccswap run 2 -- claude -p ...` 在這個 repo 跑，並在日誌標明。

## 順序與狀態

| 棒 | 內容 | 誰 | 狀態 |
|---|---|---|---|
| WP0 | 資料、規則核心、測試 | Opus | 完成（64 測試全過） |
| WP1 | 頁面骨架、房間清單面板、空殼模組 | Sonnet | 完成 |
| WP3 | 6 種謎題通用介面 | Sonnet | 完成 |
| WP5 | 開場、死因卡、圖鑑、結局、結算 | Sonnet | 完成 |
| WP0b | 真結局加門檻：手機未讀要圖鑑收集到一定格數（暫定 10 格，使用者 2026-11-04 由 15 降為 10）才點得開；核心與資料的小改，要加測試 | Opus | 完成 |
| WP2 | Canvas 地圖、走動、碰撞（使用者認為不難，今晚就做，不等確定） | Sonnet | 完成 |
| WP4 | 假 Moodle 頁 | Sonnet | 完成 |
| WP6 | HUD（時鐘、任務欄、小地圖、AI 助教、手機未讀、自言自語） | Sonnet | 完成 |
| WP7 | 佔位美術與音效對照表 | Sonnet | 完成 |
| WP8 | 除錯面板 | Sonnet | 完成 |
| WP9 | 純前端交付：確認資料夾丟到任何靜態空間、以及直接雙擊 index.html（file://）都能玩；ES module 和 fetch JSON 在 file:// 會被瀏覽器擋，若有這個問題就加一支不依賴套件的 Node 打包腳本，產生可直接開的 `dist/`；沒有 CDN；加 `.nojekyll`（開 Pages 要使用者做） | Sonnet | 完成 |
| WP10 | 整合驗收與手感調整 | Opus | 完成 |

到 WP5 做完，就能用點清單的方式從開局玩到 5 種結局（最短路徑）。WP2 走動排在後面補，時間夠的話整晚都會做。

## 替使用者先決定的事（早上請確認）

- Opus 問：今晚先用「點清單」代替走動？ → 使用者回：走動應該不難。決定：今晚就做，WP2 排在 WP5 之後的第一棒。
- Opus 問：真結局只要點開未讀就拿得到，太容易嗎？ → 使用者回：太容易，玩家一定會亂點。決定：加門檻，手機未讀要圖鑑收集到一定格數（暫定 15 格，可在 content/endings.json 調）才點得開，這樣真結局需要探索彩蛋物件；見 WP0b。

## 日誌

（每棒做完補一行）

- WP1：建好 index.html、main.js、bus.js、rooms-panel.js、styles.css 與各包空殼；`npm test` 64 全過；`?debug=1` console 無錯誤，清單點 GO／PHONE／HINT 都送出正確動作，點謎題物件會發 `ui_open_puzzle` 事件給 WP3 接。
- WP3：新增 game/ui/puzzles/（index.js、logic.js、puzzles.css、test/）；6 種 stage type 介面，監聽 `ui_open_puzzle`，解完顯示完成畫面，死亡時關閉並由核心發 death 事件；`package.json` 的 test 加上 puzzles/test；`npm test` 67 全過；瀏覽器 jump=p1～p8 每關正解與答錯（wrongMessage）都驗過，p1 三次錯與選項死法、p8 deathRules 都有發 death 事件，console 無錯誤。
- WP5：新增 game/ui/screens/（index.js、logic.js、art.js、screens.css、test/）；標題、開場字幕＋學長便利貼、死因卡（點一下重來、含 NEW 章與學長便利貼）、44 格圖鑑、finale 兩顆按鈕、5 個結局、結算；rooms-panel 拿掉新局／再來一次／finale 按鈕，改右上角「圖鑑／重新開始」；`npm test` 73 全過；瀏覽器驗過 death／unlock=all／5 個結局／真實玩 p1 死亡重來／jump=p8 走到真結局與結算，console 無錯誤。
- WP0b：真結局加門檻，圖鑑累計 15 格（`content/endings.json` 的 `trueEndingCodexRequired`）才點得開未讀；未達標回 `finale_locked` 事件，finale 畫面顯示「儲存空間不足」的梗和還差幾格，可之後再點；finale 事件的 text 是整包物件，改 TECH.md 對齊（核心沒改這點）；`npm test` 78 全過；瀏覽器驗過清空存檔後 `jump=p8` 點未讀只出現梗（0/15 格），加 `unlock=all` 再點拿到真結局，console 無錯誤。
- WP2：新增 game/ui/maps.js（7 個房間格子地圖）與 game/ui/world/（index.js、logic.js、world.css、test/）；Canvas 低解析度整數倍放大、方向鍵／WASD、碰撞、靠近物件按 E、走到門換房間、被擋顯示訊息；互動送的動作和房間清單一樣；房間清單只在 `?debug=1` 顯示；`package.json` 的 test 加上 world/test；`npm test` 87 全過；瀏覽器從 401 走到筆電開 p1，jump=p3～p8 各房間走得到、撞牆會停、彩蛋 E 對話框與死因卡正常，console 無錯誤。
- WP4：新增 game/ui/puzzles/moodle.js、moodle.css、moodle-logic.js、test/moodle-logic.test.js；p7 開出來換成假 Moodle（深色、深紅標題列、登入頁左藍右黑、像素貓頭鷹校徽，全用 CSS／內嵌 SVG）；index.js 只加載入 css 與 p7 分流掛接；`npm test` 93 全過；瀏覽器驗過正解解開 p7、6 個死法都出死因卡、勾記住帳號後結算有「公用電腦記住帳號」那句，console 無錯誤。
- WP6：新增 game/ui/hud/（index.js、logic.js、hud.css、test/）；時鐘（變動時跳動並顯示 +20／+10）、任務欄、小地圖（只畫去過的房間，標目前所在與目標房）、AI 助教泡泡（顯示剩餘次數與額度用完那句）、手機未讀、60 秒自言自語；世界畫面拿掉重複的 hint 提示，改由 HUD 顯示；`package.json` 的 test 加上 hud/test；`npm test` 103 全過；瀏覽器驗過解題與死亡後時鐘跳、助教用 3 次後出梗、小地圖、遊戲中點手機出梗、finale 圖鑑不足出梗、`unlock=all` 進真結局（03:40），console 無錯誤。
- 使用者決定真結局圖鑑門檻 15→10（2026-11-04）：改 `content/endings.json`、測試、BRIEF／TECH／PLANS 文字同步，重建 dist。
- WP7：assets.js 改成 96 筆素材對照表（主角、地圖物件、死因卡圖、結局圖；src 預設空，填了顯示圖、壞了退回色塊，圖片載入與快取在 assets-logic.js）；world 畫物件／主角、screens 的 art.js 改經過 assets.js；新增 audio.js／audio-logic.js（Web Audio 合成 4 個 8-bit 音效、左下角靜音開關存 localStorage、互動前不建 AudioContext）與 assets/README.md；world 互動多發一個 `ui_interact` 事件給音效用；`package.json` 的 test 加上 game/ui/test；瀏覽器驗過填圖顯示、壞路徑退回色塊、4 個音效觸發與靜音，console 無 JS 錯誤。
- WP8：新增 debug-panel.js／debug-logic.js／debug-panel.css（跳關、解這一步、觸發死法、看結局、解鎖全圖鑑、設時鐘、清存檔）；main.js 改成 `?debug=1` 才動態載入面板，沒開 debug 連檔案都不請求；`npm test` 117 全過；瀏覽器驗過每個按鈕和 jump／death／ending／unlock／clock 網址參數，沒開 debug 時沒有面板。

- WP9：實測 `file://` 開原始碼版 index.html 會因為 ES module 的 CORS 被擋、整頁空白，所以新增 scripts/build.js（只用 Node 內建模組；`npm run build`）把 JS、CSS、content/*.json 打成 dist/index.html + dist/game.js（傳統 script、資料內嵌、不用 fetch、?debug=1 才執行的除錯面板保留）；加 .nojekyll、README.md、CREDITS.md、scripts/test/dist.test.js（無外部 URL／module／fetch、dist 與原始碼雜湊一致）；`npm test` 123 全過；用 headless Chrome 開 file:// 的 dist 和 Node 一次性靜態伺服器開 dist，從標題、開場、走動、第 1 關、死亡重來到 ?debug=1 面板行為一致，console 無錯誤。

- WP10：在瀏覽器裡實際走動、按 E、操作謎題畫面，把 4 條路線都走到結局和結算：門其實沒鎖、8 關全解後拿真結局、跳過第 7 關的「人出來了，報告沒交」、死到 07:00 的「天亮了」。另外抽測了普通結局、圖鑑沒到門檻時的梗、記住帳號的結算梗、60 秒自言自語、AI 助教 3 次、同一關死 3 次的學長便利貼。修掉的問題：
  - 開局直接走出 401 的門會被擋，拿不到彩蛋結局，改成鎖門前走出去就是「門其實沒鎖」；
  - 警衛鎖門的過場沒顯示，補上；
  - 第 2 關的預兆（公告日期）畫面上沒寫，補上；
  - 第 7 關登入頁沒有密碼線索，補一句「你所有的密碼都設成同一組」；
  - HUD 蓋住 Moodle 頁的說明列和 ✕，謎題浮層改成讓開 HUD；
  - 死掉按「再來一次」後要重新走回去開謎題，改成直接回到死掉的那一步；
  - 新的一局角色沒有回到起點；
  - 除錯跳關時，上一局的結局畫面沒收掉，會擋住畫面；
  - 同一關的 AI 提示講完後還會繼續扣額度，改成重講最後一句、不扣額度；
  - 03:40 出門卻寫「天亮了」、Moodle 上的檔名和第 5 關對不上等文字小錯。
  
  `npm test` 127 全過，`npm run build` 已更新 dist/，dist 開起來 console 沒有錯誤。

- 氣氛改版（使用者回饋「單調無味」）：
  - 開場改成群組聊天，阿哲刪報告、組員已讀不回。
  - 房間有夜晚的燈光和手機手電筒的光圈，窗外天色跟著時間從深夜變到天亮；走廊要解完第 3 關才會亮，亮了日光燈還會閃。
  - 加了阿哲和警衛頭上冒 z、腳步聲、撞牆聲、開門黑一下、拿到道具跳字。
  - 主角會在進房間、開謎題、看線索、死掉重來的時候自言自語；手機照時間跳群組訊息、Moodle 截止提醒、媽媽叫你早點睡。
  - 死因卡改成砸下來、紅色一閃、死因一個字一個字打出來。
  - 台詞都在 `content/texts.json` 的 `flavor`。`npm test` 132 全過，dist 已重建。

- 像素圖改版（使用者說物件像象棋）：
  - 所有地圖物件改成程式畫的小像素圖（`game/ui/world/sprites.js`），字不再當主圖：筆電有螢幕和鍵盤、講桌有抽屜和鎖、販賣機有商品窗和投幣口、書架有書脊、印表機吐出卡紙、睡著的阿哲和警衛趴在桌上。
  - 7 個房間的地板和牆各有不同紋理：木地板、大磁磚、黑白格、地毯、塑膠地磚、高架地板、磨石子，牆有磚牆、磁磚牆、油漆牆和踢腳板。
  - 主角改成連帽衫學生，四個方向走路有兩格動畫。
  - `assets.js` 填了 src 還是優先用圖。`npm test` 134 全過，dist 已重建，7 個房間都實際看過畫面。

- 「門其實沒鎖」改成死法（使用者決定）：開局推門不再跳結局，改成圖鑑第 1 格的死法 `d_door`：「門其實沒鎖。你走到校門口才想起報告還沒交，又默默走了回來。」跳死因卡、時間 +10，重來後接著玩。結局從 5 個變 4 個，死法從 39 種變 40 種，圖鑑一樣 44 格；`ending=end_door` 不再有效，改用 `death=d_door`。`npm test` 135 全過，dist 已重建。

## 卡住

（沒有）

## 已知問題與後續

需要使用者決定的：

- **圖鑑沒到門檻時，走到 finale 只能回家**：已處理。使用者決定門檻 15→10（2026-11-04），改 `content/endings.json`；「回系館逛逛」按鈕沒做，之後視需要再議。
- **謎題偏簡單**：第 3、4、5 關的線索幾乎直接寫出答案。要不要加難度（例如線索拆成兩處、要對照才解得開）是產品決定。

沒修、但不影響通關的：

- 系辦的門禁鍵盤和「垃圾桶裡的公告草稿」都在系辦裡面，邏輯上應該在門外，要改地圖。
- 第 7 關按「取消」後，訪客確認框還會留在畫面上，按繼續就好，不會卡住。
- 每個結局的結算都會出現「組員互評」那句。
- 死因卡是快轉的想像（例如「聊到四點」），時鐘只加 10 分鐘。這是刻意的，但第一次玩可能有點跳。

需要美術或音效素材的地方（填 `game/ui/assets.js` 的 `src` 就能換）：

- 主角的走路圖（16×16，四個方向）；
- 7 個房間的地板、牆、門；
- 地圖上約 50 個物件；
- 39 張死因卡圖、5 張結局圖；
- 配樂（目前只有 4 個合成音效）。

建議的下一步：

1. 請組員從 `dist/index.html` 試玩一次，聽聽門檻和難度的感受；
2. 決定上面兩個產品問題；
3. 先換主角和死因卡的圖，最能拉開跟老師 demo 的差距；
4. 有時間的話再補手機觸控按鈕。

