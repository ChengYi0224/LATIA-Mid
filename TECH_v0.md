# 技術規格

給接手做畫面的人看的。規則核心和資料都已經寫好、測試也通過了。畫面層只要照這份文件接上去，不用改 `game/core/`。

## 1. 技術選型

- **純前端**：vanilla JavaScript ES modules、HTML、CSS。不用 React，也沒有 npm 相依套件。唯一的外部程式是固定版本的 three.js（見下面「3D 與 three.js」），放在 `vendor/`，不用 CDN。`dist/` 由 `npm run build` 產生，雙擊就能離線玩。
- **畫面分兩層**：
  - three.js（WebGL）畫 3D 第一人稱場景：房間、物件、燈光、準星。
  - DOM 疊在上面，負責對話框、謎題介面、假 Moodle 頁、死因卡、圖鑑、HUD、結局。
  
  謎題和文字介面用 HTML 做比用 Canvas 畫字簡單很多，也比較好調。
- **資料**：`content/*.json`。瀏覽器用 `fetch` 讀，所以要開本機伺服器，`file://` 不行。
- **存檔**：`localStorage`，每次讀寫都包 try/catch。拿不到的話自動退回記憶體，照樣能玩。
- **測試**：Node 內建的 `node:test`，需要 Node 20 以上。

## 2. 目錄

```
index.html                 （畫面層建立）遊戲入口
content/                   全部遊戲資料（改劇情、改梗只改這裡）
  puzzles.json  deaths.json  eggs.json  endings.json
  rooms.json    hints.json   texts.json moodle.json
game/core/                 規則核心，不碰 DOM
  engine.js   content.js   save.js   debug.js
  load-browser.js  load-node.js  index.js
  test/                    node:test 測試
game/ui/                   （畫面層建立）見第 7 節
assets/                    （畫面層建立）之後放真正的圖和音效
```

## 3. 本機啟動與測試

在 repo 根目錄執行：

```
npm test          # 跑核心測試
npm run serve     # 開 http://localhost:8080（用 npx http-server，不需要先裝）
npm run build     # 打包成 dist/（可直接雙擊 index.html，file:// 也能玩）
```

也可以用 `python -m http.server 8080`，效果一樣。

原始碼版不能用 `file://` 開（ES module 和 fetch 會被瀏覽器擋）。交給老師的是 `dist/`：`scripts/build.js` 把 `game/`、`content/`、CSS 打成 `dist/index.html` 加 `dist/game.js`，改完原始碼要重跑 `npm run build` 並提交 `dist/`，`npm test` 會檢查它有沒有跟上。

## 4. 資料檔格式

所有 id 都用英文小寫加底線。文字一律繁體中文。改完資料後跑 `npm test`，`validateContent` 會檢查下面這些事：引用有沒有斷掉、每個死法有沒有觸發點、圖鑑編號有沒有重複、預兆是不是 3 個以內。

### puzzles.json

`{ "puzzles": Puzzle[] }`

**Puzzle**

| 欄位 | 型別 | 說明 |
|---|---|---|
| id | string | `p1`～`p8` |
| order | number | 1～8，要連續 |
| title | string | 任務欄顯示的名稱 |
| room | string | 謎題所在房間 id |
| object | string | 地圖上觸發這關的物件 id（畫面層用） |
| requires | string[] | 要先解完的謎題 id |
| optional | boolean? | 可以跳過（只有 p7） |
| onSolve | "exit"? | 解完就走到出口判定（只有 p8） |
| stages | Stage[] | 依序進行的步驟 |
| reward | `{ items: string[], flags: string[] }` | 解完拿到的道具與旗標 |

**Stage 共用欄位**：`id`、`type`、`prompt`（顯示在介面上方的一句話）。`wrongMessage`、`successMessage` 可以不寫。

| type | 專屬欄位 | 玩家送出的 value |
|---|---|---|
| code | `answer: string`、`maxWrong?: number`、`wrongDeath?: deathId`、`checks?: {id,label,setsFlag}[]` | `"5861"`，或 `{ answer: "5861", checks: { remember: true } }` |
| wheel | `wheels: string[][]`（每個滾輪的字）、`answer: string[]` | `["遲","交","不","收"]` |
| sequence | `buttons: {id,label}[]`、`answer: string[]`（按鈕 id 的順序） | 整串按鈕 id 的陣列 |
| toggles | `switches: string[]`、`answer: string[]`（要打開的那些） | 目前打開的開關 id 陣列，順序不拘 |
| select | `fields: {id,label,options:{id,label}[]}[]`、`answer: {fieldId: optionId}`、`deathRules?: {match:{fieldId:optionId}, death}[]` | `{ channel: "f1", sound: "breakfast", volume: "low" }` |
| choice | `options: Option[]` | 選項 id，例如 `"later"` |

**Option**：`{ id, label, desc?, outcome: "next" | "death" | "stay", death?: deathId, message?: string }`

- `next`：過這一步。
- `death`：觸發死法。
- `stay`：只顯示 message，留在原步驟。

sequence 和 wheel 由畫面層收集完整的輸入再一次送出；要不要逐顆顯示回饋由畫面決定。select 的判定順序是先比對 deathRules，再比對 answer。

### deaths.json

`{ "deaths": Death[] }`

| 欄位 | 說明 |
|---|---|
| id | `d_p1_later` 是主線死法；`d_e_desk` 是彩蛋死法 |
| no | 圖鑑編號，和結局共用一套，不能重複 |
| origin | 主線死法填謎題 id；彩蛋死法填房間 id |
| title | 死因卡標題 |
| action | 玩家做了什麼（圖鑑用） |
| text | 死因那句梗，是死因卡的主文字 |
| tip | 「下次試試」的提示；彩蛋死法是空字串 |
| omen | 預兆描述，沒有預兆就是 null。全遊戲只有 3 個不是 null，畫面層要把它畫進場景 |
| art | 死因卡圖的素材 key（見第 8 節） |

### eggs.json

`{ "eggs": Egg[] }`，固定 20 個。

Egg 的欄位：`{ id, room, name, look, actionLabel, death }`

畫面流程：玩家點物件，跳出對話框，顯示 name 和 look，下面兩顆按鈕是 actionLabel 和「算了」。按 actionLabel 就送 `EGG`。

### endings.json

`{ "endings": Ending[] }`

Ending 的欄位：`{ id, no, title, condition, lines: string[], art }`

固定 4 個 id：`end_dawn`、`end_no_submit`、`end_normal`、`end_true`。圖鑑第 1 格是死法 `d_door`（門其實沒鎖），由核心的 `DOOR` 動作觸發，資料檢查會確認它存在而且 no 是 1。

根層級還有一個 `trueEndingCodexRequired`（整數，目前 10）：圖鑑累計收集到幾格，finale 的「點開未讀」才會給真結局。圖鑑是跨局累計的，死法和結局都算。

### rooms.json

`{ "start": "r401", "rooms": Room[] }`

| 欄位 | 說明 |
|---|---|
| id / name | 房間 |
| requires | `{ items?: string[], puzzles?: string[], flags?: string[] }`，全部都要滿足才進得去 |
| exits | 可以直接走到的房間 id |
| clues | `{ id, name, text, forPuzzle }[]`，純文字線索，點了顯示 text，核心不處理 |

### hints.json

- `aiQuota`：每晚的 AI 額度，目前是 3。
- `aiQuotaOutText`：額度用完時顯示的那句。
- 同一關的 `ai` 提示都講完以後，再問只會重講最後一句，不會扣額度；這時事件會多帶 `repeat: true`。
- `senpaiAfterDeaths`：同一關死幾次就給學長便利貼，目前是 3。
- `senpaiSignature`：學長便利貼的簽名。
- `idleSeconds`：卡住多久主角開始自言自語，目前是 60 秒。
- `puzzles.{pid}`：`{ idle: 主角自言自語, ai: [方向, 幾乎是答案], senpai: 學長便利貼 }`

### texts.json

- `clock`：`{ start: 60, dawn: 420, perSolve: 20, perDeath: 10 }`，單位是從 00:00 起算的分鐘數。
- 開場：`opening`、`tutorialNote`、`guardLocks`。
- 門和手機：`doorLocked`、`phoneBadge`、`phoneTapDuringNight`。
- 結局前的選擇：`finale.{prompt, home, unread, unreadLocked, unreadLockedHint}`。後兩個是圖鑑沒到門檻時點未讀的梗，以及「還差幾格」的提示；提示裡的 `{required}`、`{found}` 由核心代換好。
- 死因卡：`deathCardCorner[]`（角落輪播的一句）、`deathCardRetry`、`deathTimeCost`。
- 結算畫面：`results.{peerReview, rememberedAccount, passwordCorner}`。

### moodle.json

第 7 關假 Moodle 的畫面文字和配色，判定邏輯在 `puzzles.json` 的 p7。`stageScreens` 告訴你每一步要顯示哪個畫面：

| 畫面代號 | 顯示什麼 |
|---|---|
| course | 課程的繳交區 |
| course+dialog | 繳交區加上訪客確認框 |
| login | 登入頁 |
| home | 首頁的課程列表和左側欄 |

## 5. 核心 API

```js
import { loadContent, createGame, browserStorage, debugActions, isDebug, PHASE } from './game/core/index.js';

const content = await loadContent();                       // 讀 content/*.json
const params = new URLSearchParams(location.search);
const game = createGame(content, { storage: browserStorage(), debug: isDebug(params) });
for (const a of debugActions(params)) handle(game.dispatch(a));

const events = game.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '5861' });
handle(events);                                            // 畫面依事件播動畫、開對話框
```

### 讀取函式（不會改狀態）

| 函式 | 回傳 |
|---|---|
| `getState()` | 狀態的複本，見第 6 節 |
| `currentPuzzle()` | 任務欄要顯示的那一關，沒有就是 null |
| `currentStage(pid)` | 這關目前的 Stage 物件 |
| `puzzleAvailable(pid)` | 前置條件滿足而且還沒解 |
| `canEnter(roomId)` | 能不能進這個房間 |
| `hasItem(id)` | 有沒有這個道具 |
| `isSolved(pid)` | 這關解了沒 |
| `codex()` | `{ entries:[{no,kind,id,title,found,text}], found, total }`，已經照 no 排好 |
| `results()` | `{ clock, deaths, codexFound, codexTotal, lines[] }`，給結算畫面用 |
| `clockText()` | `"03:40"` |
| `trueEndingGate()` | `{ unreadReady, found, required }`：真結局門檻目前的狀態 |

### 動作（dispatch）

| action | 什麼時候送 | 限定 phase |
|---|---|---|
| `{type:'NEW_RUN'}` | 標題畫面按開始、結局畫面按再玩一次 | 任何 |
| `{type:'GO', room}` | 角色走進另一個房間 | playing |
| `{type:'DOOR'}` | 點 401 的門 | playing |
| `{type:'PUZZLE', puzzle, value}` | 謎題介面送出答案或選項 | playing |
| `{type:'EGG', egg}` | 彩蛋對話框按 actionLabel | playing |
| `{type:'HINT'}` | 按 AI 助教 | playing |
| `{type:'PHONE'}` | 整晚點手機上的未讀 | playing |
| `{type:'RETRY'}` | 死因卡按「再來一次」 | dead |
| `{type:'FINALE', choice:'home'或'unread'}` | 出門後的兩顆按鈕 | finale |
| `DEBUG_*` | 見第 9 節 | 要 debug:true |

### 回傳的事件

dispatch 回傳一個事件陣列。畫面層照順序處理，看不懂的 type 就忽略。

| type | 欄位 | 畫面該做的事 |
|---|---|---|
| new_run | opening[], tutorialNote | 播開場字幕，顯示學長的教學便利貼 |
| moved | room | 切換房間 |
| blocked | room, requires | 顯示「門鎖著」 |
| cutscene | id:'guard_locks', lines[] | 播警衛鎖門的過場 |
| wrong | puzzle, stage, message, wrongCount | 謎題介面搖一下，顯示 message |
| stage_cleared | puzzle, stage, message | 顯示 message |
| stage | puzzle, stage | 換成下一步的介面 |
| item | item | 跳出「獲得道具」 |
| solved | puzzle, clock | 關掉謎題介面，時鐘跳動 |
| death | death, isNew, clock, corner, senpai? | 顯示死因卡：death.title、death.text、death.tip、corner。isNew 為真時蓋「NEW」章。有 senpai 就多貼一張便利貼 |
| finale | text（整包 `texts.finale` 物件，不是字串）、unreadReady、found、required | 顯示 `text.prompt` 和兩顆按鈕（`text.home`、`text.unread`） |
| finale_locked | text、hint、unreadReady:false、found、required | 圖鑑未達門檻時點未讀：phase 仍是 finale，在 finale 畫面顯示 text 和 hint，玩家可以之後再點 |
| ending | ending, isNew, results | 顯示結局畫面和結算 |
| hint | puzzle, text, quotaOut, quota | AI 助教的對話框 |
| message | text | 一般訊息框 |
| debug | did | 除錯用 |
| error | reason | 開發時印到 console 就好，玩家看不到 |

## 6. 狀態機

```
            NEW_RUN
              │
              ▼
   ┌──────► playing ──(死法)──► dead ──RETRY──┐
   │          │  │                            │
   └──────────┼──┼──── 時鐘還沒到 07:00 ──────┘
              │  │                 時鐘到了 07:00 → ending(end_dawn)
              │  ├─ DOOR 且還沒碰筆電 → dead(d_door)，重來後接著玩
              │  └─ 解完 p8：
              │        已交報告 → finale ─FINALE home→ ending(end_normal)
              │                         ─FINALE unread→ 圖鑑 ≥ 門檻：ending(end_true)
              │                                         未達門檻：finale_locked，留在 finale
              │        沒交報告 → ending(end_no_submit)
              ▼
           ending ──NEW_RUN──► playing
```

- **死了之後**：回到死掉的那一步重來，前面的步驟不用重解。道具、旗標全部保留。
- **時間**：解一題 +20 分鐘，死一次 +10 分鐘。死掉當下不結算天亮，玩家按 RETRY 時才判定。照這個算，全破不死是 03:40。
- **門鎖住的時機**：第一次對 p1 送 PUZZLE 時，核心會發出 `guard_locks`，從這一刻起門就鎖了。在這之前送 DOOR，就是死法「門其實沒鎖」（d_door）：跳死因卡、時間 +10，按重來回到 playing，進度不變。
- **任務欄**：p6 解完後 p7、p8 同時開放，任務欄顯示 p7，但玩家可以直接去做 p8。
- **自動存檔**：每次 dispatch 都會自動存。重新整理頁面會接著玩，除非傳入 `resume:false`。

`getState()` 的形狀：

```
{ v:1, phase, clock, room, items[], flags{}, deaths, lastDeath, ending, aiQuota, doorLocked,
  puzzles: { p1: { stage, wrong, solved, deaths, hintLevel }, ... } }
```

存檔的 key 是 `latia-mid:run:v1`（這一局）和 `latia-mid:codex:v1`（跨局的圖鑑）。

## 7. 畫面層要怎麼接

建議的檔案。每個工作包只動自己的資料夾，避免衝突：

```
index.html
game/ui/main.js          載入資料、建立 game、把事件分給各模組（WP1）
game/ui/bus.js           簡單的事件分發：on(type, fn)、emit(events)（WP1）
game/ui/rooms-panel.js   不用走動的房間清單，最短路徑用（WP1）
game/ui/world/logic.js     格子座標的碰撞、門、互動判定（3D 沿用，WP2）
game/ui/world3d/         3D 第一人稱畫面：index.js（視角、輸入、暫停、設定）、room3d.js（蓋房間與燈光）、
                         models.js（物件的 3D 長相）、kit.js（積木工具）、fps-logic.js（視角與準星的純邏輯）、style/（材質與燈光風格）
vendor/three.min.js      three.js r170（見下）
game/ui/maps.js          3 個房間的格子地圖、物件位置（WP2）
game/ui/puzzles/         6 種 stage type 的通用介面（WP3），moodle.js（WP4）
game/ui/screens/         開場、死因卡、圖鑑、結局、結算（WP5）
game/ui/hud/             時鐘、任務欄、小地圖、提示、手機未讀、自言自語（WP6）
game/ui/assets.js        素材對照表（WP7）
game/ui/debug-panel.js   除錯面板（WP8）
```

三條規則：

1. **畫面只讀狀態、只送動作**。不要直接改 `getState()` 拿到的物件，也不要在畫面裡寫勝負判定。
2. **地圖上能點的東西用 id 對應資料**：謎題用 `puzzle.object`，彩蛋用 `egg.id`，線索用 `clue.id`，401 的門用 `door`，手機用 `phone`。互動時：
   - 點謎題物件：先問 `puzzleAvailable` 才打開謎題介面；還沒開放的話，顯示這一關相關的線索文字。
   - 點彩蛋：開彩蛋對話框。
   - 點線索：顯示 text。
3. **謎題介面照 stage type 畫**，不要照關卡畫。p7 例外，它用 `moodle.json` 的 `stageScreens` 換成假 Moodle 皮。

## 8. 佔位美術與換素材

- 所有圖都用素材 key，例如 `death.art`、`ending.art`，或地圖物件的 id。`game/ui/assets.js` 是一張對照表，格式是 `{ key: { color: '#hex', label: '平板', src: null } }`。
- `src` 是 null 時，用 color 畫一個色塊，上面寫 label。換成真的圖片時只要填 `src: 'assets/xxx.png'`，載入失敗就自動退回色塊。
- 3D 物件的長相寫在 `game/ui/world3d/models.js`，以物件 id 為 key，用方塊、圓柱、球拼出來。沒有專屬模型的物件會用 `maps.js` 的顏色拼一個方塊加字。`assets.js` 的色塊對照表是舊的 2D 畫面用的，3D 版不讀它；`game/ui/world/sprites.js`（2D 像素圖）也一樣，只剩測試在用。

## 9. 除錯網址

| 網址參數 | 作用 |
|---|---|
| `?debug=1` | 打開除錯模式，可以用 DEBUG_* 動作，並顯示除錯面板 |
| `&jump=p5` | 跳到第 5 關，前面都算解完，道具也都給你 |
| `&death=d_p8_dinner` | 直接觸發這個死法 |
| `&ending=end_true` | 直接看這個結局 |
| `&unlock=all` | 解鎖全部圖鑑 |
| `&clock=410` | 把時鐘設成 06:50 |

除錯面板上可以多一顆「解這一步」，送的是 `{type:'DEBUG_SOLVE_STAGE'}`，會用正解自動過目前這一步。debug 模式下建議把 `window.__game = game` 掛出來，方便在瀏覽器 console 裡檢查。

## 10. 部署到 GitHub Pages

要放的是 build 出來的 `dist/`（`index.html` 加 `game.js`）。先在 repo 根目錄執行 `npm run build`。根目錄的 `index.html` 是原始碼版，用了 ES module 和 `vendor/three.min.js`，不能直接當成品。到 repo 的 Settings → Pages，選「Deploy from a branch」，用 main 分支的根目錄，網址是 `.../dist/`；或把 `dist/` 的內容放到網站根目錄。

- 根目錄要放一個空的 `.nojekyll` 檔。
- 所有路徑都用相對路徑，不要用 `/` 開頭，因為網址會在 `/repo 名稱/` 底下。
- 根目錄 `index.html` 有一段 file-guard：在 `file://` 開會顯示中文提示，請改開 `dist/index.html`。build 會把這段拿掉。

## 11. 實作分工

原則：要整體判斷、或容易做壞的交給 Opus；量大但規格明確的交給 Sonnet，照這份文件做。

| 包 | 內容 | 誰做 | 為什麼 | 依賴 | 會動到的檔案 | 驗收 |
|---|---|---|---|---|---|---|
| WP0 | 資料、規則核心、測試 | Opus（已完成） | 要整體判斷 | 無 | content/、game/core/ | `npm test` 全過 |
| WP1 | index.html、main.js、bus.js、房間清單面板、基本 CSS，並幫其他包建好空殼模組 | Sonnet | 第 5～7 節已經寫死了介面 | WP0 | index.html、game/ui/main.js、bus.js、rooms-panel.js、styles | 開 `npm run serve`，console 沒有錯誤；用清單點物件會送出正確的動作 |
| WP2 | Canvas 地圖、走動（後來整個換成 3D 第一人稱，見最後的「3D 與 three.js」，格子座標與碰撞邏輯沿用）、碰撞、靠近物件按 E 互動、3 個房間的格子地圖 | Sonnet | 量大但規格明確 | WP1 | game/ui/world/、maps.js | 3 個房間都走得到、撞牆會停、按 E 觸發的動作跟清單一樣 |
| WP3 | 6 種 stage type 的通用謎題介面 | Sonnet | 規格明確 | WP1 | game/ui/puzzles/（moodle.js 除外） | 用 `?debug=1&jump=p1`～`p8` 逐關跳過去，每關都能用資料裡的答案解開；答錯會顯示 wrongMessage |
| WP4 | 假 Moodle 頁 | Sonnet | 視覺工作量大，但 moodle.json 都寫好了 | WP3 的介面 | game/ui/puzzles/moodle.js、moodle.css | 和使用者給的截圖描述一致；p7 的 6 個死法都點得到 |
| WP5 | 開場、死因卡、圖鑑頁、結局、結算畫面 | Sonnet | 規格明確 | WP1 | game/ui/screens/ | `?debug=1&death=任一 id` 會出死因卡；`&unlock=all` 圖鑑顯示 44 格；`&ending=` 4 個結局都能看 |
| WP6 | HUD：時鐘、任務欄、小地圖、AI 助教、手機未讀、60 秒自言自語 | Sonnet | 規格明確 | WP1；小地圖要等 WP2 | game/ui/hud/ | 解題或死掉後時鐘會跳；AI 用 3 次後出現額度用完那句；小地圖只顯示去過的房間 |
| WP7 | 佔位美術對照表、4 個佔位音效 | Sonnet（Haiku 也可以） | 純量 | WP2 | game/ui/assets.js、assets/ | 隨便填一個 src 會顯示圖；圖壞掉會退回色塊 |
| WP8 | 除錯面板 | Sonnet | 小 | WP1 | game/ui/debug-panel.js | 第 9 節的參數全部有效 |
| WP9 | 純前端交付 | Sonnet | 小，但 Pages 要使用者開權限 | WP1 | scripts/build.js、dist/、.nojekyll、README.md、CREDITS.md | 雙擊 dist/index.html 能玩；Pages 網址沒有 404 |
| WP10 | 整合驗收和手感調整：走一遍完整流程，修跨包的問題 | Opus | 要整體判斷，最容易做壞 | 全部 | 少量改動各處 | `npm test` 全過，再手動玩下面 4 條路線 |

**能不能同時做**：WP1 做完以後，WP2、WP3、WP5、WP8、WP9 可以同時做，因為它們各自只動自己的資料夾。WP4 要等 WP3 定好介面；WP6 的小地圖和 WP7 要等 WP2。只有 WP1 會動 `main.js`，其他包只能透過 WP1 建好的空殼模組掛上去，所以不能兩個包同時改 `main.js`。

**最短路徑（今晚就能從開局玩到結局）**：WP1（用房間清單代替走動）→ WP3 → WP5。p7 先用通用的 choice／code 介面頂著，WP4 之後再換成 Moodle 皮。這樣不用地圖、不用美術，就能用點清單的方式玩完全部 8 關和 4 個結局。剩下的 WP2、WP6、WP4、WP7 照順序補上。

**WP10 手動驗收的 4 條路線**：

1. 開局直接推門，跳出「門其實沒鎖」死因卡，重來後接著玩。
2. 照正解全破後點開未讀：圖鑑不到 10 格時只出現「儲存空間不足」的梗；用 `?debug=1&unlock=all` 再走一次就拿到真結局，時鐘顯示 03:40。
3. 第 6 關解完直接去一樓，拿到「人出來了，報告沒交」。
4. 用 `?debug=1&clock=410` 再隨便死一次，按重來後拿到「天亮了」。

## 3D 與 three.js

只換了渲染層，`game/core/` 沒動；`content/*.json` 後來只因為房間縮成 3 個（401、走廊、503）而改過房間、關卡所在房間和台詞；格子座標、碰撞、門、互動判定還是 `game/ui/world/logic.js` 和 `maps.js`。

- **座標**：地圖的 1 格（16 像素）= 3D 的 1 單位，地圖 x 對應 3D 的 X，地圖 y 對應 3D 的 Z。牆高 2.6，眼睛高 1.45。碰撞還是 10 像素的框，在格子上算。
- **視角**：`yaw = 0` 看地圖上方，往左轉 yaw 變大。`fps-logic.js` 是純邏輯（轉頭、WASD 的移動向量、準星對準物件），有測試（`game/ui/world3d/test/`）。
- **準星互動**：從眼睛沿視線方向射一條線，找最先碰到的物件外框（外框放寬 4 像素），距離在 26 像素內才算；先碰到裝飾（椅子、長椅）就不算。按 E 或左鍵後走 `resolveObject` 和 `planInteraction`，和房間清單點同一個物件完全一樣。
- **門**：走進門格就觸發，和 2D 時一樣。401 的門在鎖門前走進去是「門其實沒鎖」。
- **暫停**：謎題浮層、死因卡、結局、圖鑑、世界自己的對話框、設定面板任何一個開著，就釋放滑鼠（`exitPointerLock`）、清掉按鍵、不更新位置。關掉後畫面上出現「點一下畫面開始」，點了才再鎖滑鼠。
- **滑鼠鎖定被擋**：`requestPointerLock` 失敗或 `pointerlockerror` 時，提示層改成說明，並提供「改成按住拖曳轉頭」的備用模式（拖曳轉頭，沒拖動就算點擊互動，畫面下方有按鈕可切回）。
- **設定**：右上角「設定」有視角靈敏度（0.2 到 3 倍）和視野（60 到 100 度），存在 localStorage 的 `latia-fps-settings`。
- **光線**：天花板燈、發光物件（`room3d.js` 的 `LIGHTS`）、手機手電筒、半球光、方向光（有柔和陰影）。房間基本暗度沿用 `ROOM_DARK` 和 `flavor-logic.js` 的 `darkness`；走廊第 3 關開燈前很暗，開燈後日光燈會閃。窗外天色用 `skyColor(clock)`，星星在天亮前慢慢消失。
- **風格**：ACES 色調映射、柔和 shadow map、霧、暈邊、圓角方塊。牆、地板、木桌用 `style/` 的材質。

### three.js 怎麼放進來

- 版本固定 **r170**，放在 `vendor/three.min.js`，是全域 `THREE` 的壓縮檔。沒有用 CDN。
- 這個檔是從 npm 的 `three@0.170.0` 用 esbuild 打成 IIFE 再做三處小修改（原始檔本身是 MIT 授權）：把正則裡的 `///i` 改成 `/[/]/i`、把 XHTML 命名空間字串拆開、把 `fetch(` 和 `XMLHttpRequest` 的名字換掉。這樣 `scripts/test/dist.test.js` 的「沒有外部網址、沒有 fetch」檢查才會過；遊戲沒有用到 three.js 的載入器。
- 重做的方法（在一個空資料夾）：`npm pack three@0.170.0`、解開，然後 `npx esbuild package/build/three.module.js --bundle --minify --format=iife --global-name=THREE --legal-comments=none --target=es2020 --outfile=three.min.js`，再套上面三處修改。
- 開發版（`index.html`）用 `<script>` 載入 `vendor/three.min.js` 和 `style/assets-data.js`；`scripts/build.js` 會把這兩個檔直接放到 `dist/game.js` 最前面，並把 `index.html` 裡這兩個標籤拿掉，所以 `dist/` 還是只有 `index.html`、`game.js`、`assets/`。
- `style/assets-data.js` 約 7.5 MB，是 `assets/textures/` 的貼圖轉成 base64（由 `scripts/gen-assets.js` 產生），所以 `dist/game.js` 約 8.5 MB，第一次載入會慢一兩秒。貼圖來源和授權在 `assets/LICENSES.md`（Poly Haven，CC0）。
- `style/materials.js` 裡 `new URL(..., import.meta.url)` 的後備路徑，打包時會被換成空字串，成品只用內嵌貼圖。

## 像素字型

- UI 的中文字型是子集過的 Fusion Pixel（見 CREDITS.md），字級只用 12、24、36 px（字型原生大小的整數倍），不然會糊。
- 改了 `content/` 或 `game/` 裡的文字後，要重跑子集腳本，新字才會用像素字型（沒收錄的字會退回系統字型）。把 Fusion Pixel 12px proportional zh_tw 的 ttf 下載到 repo 外，然後在根目錄執行 `pip install fonttools brotli` 與 `python scripts/build-font.py <ttf 路徑>`，再 `npm run build`。
