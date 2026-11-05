# CREDITS

## 分工

組員：

- 資工116張呈義 （GitHub 帳號 ChengYi0224 ）
- 工教117黃博程（GitHub 帳號 paul950117-prog）。

張呈義負責遊戲的設定、角色、劇情和關卡，包括 8 關謎題、20 個彩蛋、死法與圖鑑，也寫了開場的群組聊天和字幕。遊戲裡的梗，包括 40 種死法、20 個彩蛋和場景裡的笑點，是張呈義和 Claude 一起想的。美術風格一開始是黃博程決定的 2D 像素風格，張呈義找了《星露谷物語》和《青鬼》當參考。後來改成 3D 卡通寫實風格，方向是張呈義提的，他找了《Potato Please》當參考。

issue 1 把遊戲從 2D 改成 3D 第一人稱，由張呈義負責，包括走路、轉頭、準星和視角靈敏度設定，還有 3D 場景的牆、地板和物件造型。貼圖用的是 Poly Haven 的 CC0 圖。issue 2 和 3 由黃博程負責：場景縮到 401、四樓走廊和 503，場景調亮，加強互動提示和回饋，畫面改成 3D 鋪滿視窗。

issue 5 和 9 是互動物件的專屬介面，issue 5 由黃博程提出，張呈義實作。手機有聊天室，電燈有開關，廣播台有控制台，每個物件都有自己的畫面。issue 7、10、12 由張呈義負責，把物件做得更接近現實，修掉穿模、懸空和擋路，也改了死因卡和圖鑑的圖示、標題和按鈕文字。

issue 13 要把手機放進畫面，並支援按 E 開啟，是黃博程提出的，目前還沒做。文件方面，黃博程做了驗收清單 `VERIFY_v0.md`，計畫 `PLANS_v0.md` 和技術說明 `TECH_v0.md` 的 v0 版。

## 美術與音效

外部素材只有 three.js 和 6 組 CC0 貼圖，其餘都是程式畫的或合成的：

- three.js r170：MIT 授權，放在 `vendor/three.min.js`，作者 mrdoob 與 three.js 作者群，https://threejs.org 。
- 牆、地板、木頭、金屬、布料、水泥的貼圖：Poly Haven（https://polyhaven.com ），CC0，逐項來源在 `assets/LICENSES.md`。
- 3D 物件：程式用基本幾何體拼的，沒有外部模型（見 `game/ui/world3d/models.js`）。
- 死因卡圖、結局圖：用 Canvas 與 CSS 畫的色塊與像素圖形。
- 假 Moodle 畫面（含貓頭鷹校徽）：用 CSS 與內嵌 SVG 畫的，不是任何真實網站的檔案。
- 4 個 8-bit 音效：用瀏覽器的 Web Audio 即時合成（見 `game/ui/audio.js`），沒有音檔。
- 沒有使用外部字型，也沒有 CDN。

## 虛構名稱

遊戲裡的學校「國立夜貓大學」、系館、人物（阿哲、學長、警衛伯伯等）和事件都是虛構的，如有雷同純屬巧合。

## 字型

- 像素字型：Fusion Pixel Font 12px（proportional、zh_tw），作者 TakWolf，授權 SIL Open Font License 1.1。
  來源：https://github.com/TakWolf/fusion-pixel-font （release 2026.10.25），授權全文：https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL
- 我們只用 `scripts/build-font.py` 取出遊戲裡出現的字（約 1100 字，43KB）轉成 woff2，內嵌在 `game/ui/pixel-font.css`，放在 `assets/fonts/pixel-font.woff2`。字型原檔不放進 repo。OFL 允許這樣修改與再散布。
- 沒收錄的字會退回系統字型。
