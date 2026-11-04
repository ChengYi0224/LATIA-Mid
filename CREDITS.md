# CREDITS

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

## 之後新增素材請補在這裡

加了外部圖片、音檔、字型或程式碼，請在下表補一列：來源網址、作者、授權（例如 CC0、CC BY 4.0）、放在專案裡的哪個檔案。授權要求標示作者的，一定要寫。

| 素材 | 檔案 | 作者／來源 | 授權 |
|---|---|---|---|
| （目前沒有） | | | |

## 字型

- 像素字型：Fusion Pixel Font 12px（proportional、zh_tw），作者 TakWolf，授權 SIL Open Font License 1.1。
  來源：https://github.com/TakWolf/fusion-pixel-font （release 2026.10.25），授權全文：https://github.com/TakWolf/fusion-pixel-font/blob/master/LICENSE-OFL
- 我們只用 `scripts/build-font.py` 取出遊戲裡出現的字（約 1100 字，43KB）轉成 woff2，內嵌在 `game/ui/pixel-font.css`，放在 `assets/fonts/pixel-font.woff2`。字型原檔不放進 repo。OFL 允許這樣修改與再散布。
- 沒收錄的字會退回系統字型。
