# 天亮前交出去

> 直接雙擊請開 `dist/index.html`（根目錄的 `index.html` 是原始碼版，要用 `npm run serve` 才能開）。

網頁版密室逃脫。期中週前一晚，你被鎖在系館裡，要在天亮前把報告交到 Moodle，再走出大門。每個謎題的最後一步都藏著一個「看起來很合理、做了就會死」的選擇，死了會有一張死因卡，按一下就在同一步重來。

純前端（HTML、CSS、JavaScript），不需要 Node、不需要安裝套件、不需要網路，沒有 CDN 或外部字型。

## 怎麼玩

**直接雙擊 `dist/index.html`**，用瀏覽器開就能玩（`file://` 也可以）。

要放到網路上：把整個 `dist/` 資料夾的內容丟到任何靜態空間就好（GitHub Pages、學校的網頁空間都可以），不用任何設定。用 GitHub Pages 的話，到 Settings → Pages，選「Deploy from a branch」，分支選 main，資料夾選 `/ (root)`，網址是 `.../dist/`；要讓網址直接是根目錄，可以把 `dist/` 的內容放到網站根目錄。repo 根目錄已經有 `.nojekyll`。

### 操作

| 按鍵 | 作用 |
|---|---|
| 方向鍵或 WASD | 走動 |
| E | 和附近的東西互動（筆電、講桌、門、手機、AI 助教等） |
| 滑鼠 | 點對話框和謎題介面的按鈕 |

存檔放在瀏覽器的 localStorage，重新整理會接著玩；拿不到 localStorage 時（例如私密視窗）照樣能玩，只是不會記住。

## 本機開發

以下都在 repo 根目錄執行，需要 Node 20 以上；只有開發者需要，玩遊戲和交作業都不需要。

```
npm test          # 跑全部測試（核心、畫面邏輯、dist 檢查）
npm run build     # 把 game/、content/ 打包成 dist/
npm run serve     # 用本機伺服器開原始碼版，網址 http://localhost:8080
```

- 原始碼在 `game/`（`core/` 是規則核心，`ui/` 是畫面），資料在 `content/*.json`。原始碼版用 ES module 和 fetch，所以必須經過伺服器開，`file://` 不行。
- `dist/` 是打包出來、要交出去的成品：一個 `index.html` 加一支 `game.js`，所有程式、樣式和資料都在裡面。**改了 `game/` 或 `content/` 之後要重跑 `npm run build` 再一起提交**，`npm test` 會檢查 `dist/` 有沒有跟上目前的原始碼，也會檢查成品裡沒有外部網址、沒有 `type="module"`、沒有 fetch。
- 打包腳本是 `scripts/build.js`，只用 Node 內建模組。

詳細規格看 `TECH.md`，設計看 `BRIEF.md`。

## 除錯網址

網址加 `?debug=1` 會打開除錯模式和除錯面板（跳關、解這一步、觸發死法、看結局、解鎖圖鑑、改時鐘）。沒加的時候面板不會出現。

| 參數 | 作用 |
|---|---|
| `?debug=1` | 打開除錯模式 |
| `&jump=p5` | 跳到第 5 關，前面算解完 |
| `&death=d_p8_dinner` | 直接觸發這個死法 |
| `&ending=end_true` | 直接看這個結局 |
| `&unlock=all` | 解鎖全部圖鑑 |
| `&clock=410` | 把時鐘設成 06:50 |

例如：`dist/index.html?debug=1&jump=p5`

## 換素材

目前所有圖都是程式畫的佔位圖形。想換成真的圖，把圖放進 `assets/`，再到 `game/ui/assets.js` 填上對應 key 的 `src`，重跑 `npm run build`。步驟看 `assets/README.md`。

## 授權與來源

目前沒有任何外部素材：美術是程式畫的色塊與像素，音效是用 Web Audio 在瀏覽器裡合成的，沒有引用外部圖片、字型或音檔。遊戲裡的「國立夜貓大學」和所有人物、事件都是虛構的。之後加了外部素材，請把來源與授權補在 `CREDITS.md`。
