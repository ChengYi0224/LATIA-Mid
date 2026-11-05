# 天亮前交出去

網頁版密室逃脫。期中週前一晚，玩家被鎖在系館裡，要在天亮前把報告交到 Moodle，再走出大門。

每個謎題的最後一步，都有一個看起來合理、但做了就會死的選擇。死亡時會出現一張死因卡。點一下死因卡，就會回到同一步重來。

本作品為純前端（HTML、CSS、JavaScript）。執行時不需要 Node、不需要安裝套件、不需要網路，也沒有使用 CDN 或外部字型。

## 怎麼玩

雙擊 `dist/index.html`，用瀏覽器開啟即可遊玩，`file://` 也可以。根目錄的 `index.html` 是原始碼版，不能直接雙擊，必須用 `npm run serve` 開啟。

若要放到網路上，把 `dist/` 資料夾裡的檔案上傳至靜態網站空間即可，不需要任何設定。靜態網站空間包括 GitHub Pages 和學校提供的網頁空間。

使用 GitHub Pages 時，到 Settings → Pages，選「Deploy from a branch」，分支選 main，資料夾選 `/ (root)`，網址會是 `.../dist/`。若要讓網址直接是根目錄，把 `dist/` 的內容放到網站根目錄。repo 根目錄已經有 `.nojekyll`。

### 操作

| 按鍵 | 作用 |
|---|---|
| 點一下畫面 | 進入遊戲並鎖定滑鼠指標；若無法鎖定滑鼠，按住左鍵拖曳即可轉頭 |
| 滑鼠 | 轉頭 |
| WASD | 走動（方向鍵上下也是前進後退，左右是轉頭） |
| E 或滑鼠左鍵 | 準星對著的東西互動（筆電、講桌、門、手機、AI 助教等） |
| Esc | 放開滑鼠 |
| 畫面右上「設定」 | 調視角靈敏度和視野 |

存檔放在 localStorage。localStorage 是瀏覽器內建的功能，可以把資料存在這台電腦上。重新整理頁面後會接著玩。若瀏覽器不提供 localStorage，例如使用私密視窗，遊戲仍可遊玩，但不會保存進度。

## 本機開發

以下都在 repo 根目錄執行，需要 Node 20 以上；只有開發者需要，遊玩和提交作業都不需要。

```
npm test          # 跑全部測試（核心、畫面邏輯、dist 檢查）
npm run build     # 把 game/、content/ 打包成 dist/
npm run serve     # 用本機伺服器開原始碼版，網址 http://localhost:8080
```

- 原始碼在 `game/`（`core/` 是規則核心，`ui/` 是畫面），資料在 `content/*.json`。原始碼版用 ES module 和 fetch，所以必須經過伺服器開，`file://` 不行。
- `dist/` 是打包後要一併提交的成品：一個 `index.html` 加一支 `game.js`，所有程式、樣式和資料都在裡面。修改 `game/` 或 `content/` 之後，必須重新執行 `npm run build`，並把 `dist/` 一併提交。`npm test` 會檢查 `dist/` 是否與目前的原始碼一致，也會檢查成品裡沒有外部網址、沒有 `type="module"`、沒有 fetch。
- 打包腳本是 `scripts/build.js`，只用 Node 內建模組。

詳細規格看 `TECH.md`，設計看 `BRIEF.md`。

## 除錯網址

網址加上 `?debug=1` 會開啟除錯模式和除錯面板。面板可以跳關、解開目前這一步、觸發死法、查看結局、解鎖圖鑑、修改時鐘。沒有加這個參數時，不會出現面板。

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

3D 物件的長相寫在 `game/ui/world3d/models.js`，用基本幾何體拼；想換貼圖，換 `assets/textures/` 的圖後執行 `node scripts/gen-assets.js` 再 `npm run build`。細節看 `TECH.md` 的「3D 與 three.js」。

## 授權與來源

3D 場景用 three.js r170（MIT，放在 `vendor/`），牆、地板、木頭的貼圖是 Poly Haven 的 CC0 素材（來源在 `assets/LICENSES.md`）；物件是程式用基本幾何體拼的，沒有外部模型，音效是用 Web Audio 在瀏覽器中合成的，沒有引用外部圖片、字型或音檔。遊戲裡的「國立夜貓大學」和所有人物、事件都是虛構的。若日後加入外部素材，請把來源與授權補在 `CREDITS.md`。
