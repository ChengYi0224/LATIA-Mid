# assets/：放真正的像素素材

遊戲目前全部是程式畫的佔位圖形。想換成真的圖，把圖放進這個資料夾，再到 `game/ui/assets.js` 把對應 key 的 `src` 填上就好，不用改別的程式。

## 怎麼換一張圖

1. 把圖放進 `assets/`，例如 `assets/laptop.png`。
2. 打開 `game/ui/assets.js`，找到那個 key，把 `src: null` 改成 `src: 'assets/laptop.png'`。
3. 重新整理頁面（要用 `npm run serve` 或任何靜態伺服器開，`file://` 不行）。

```js
laptop: { color: '#5b7fd1', label: '筆', src: 'assets/laptop.png' },
```

- `src` 是 `null` 或空字串：畫 `color` 色塊。
- `src` 路徑錯、檔案壞掉、還在載入：也是畫色塊，不會報錯，遊戲照玩。
- 路徑一律用相對路徑，不要用 `/` 開頭（部署到 GitHub Pages 會在 `/repo 名稱/` 底下）。
- 不要引用外部網址的圖，作業要求純前端、不依賴外部資源。

## 格式與尺寸

- 格式：PNG（要透明背景）。
- 像素風，不要縮放後糊掉：遊戲用整數倍放大、關掉平滑。所以請畫成**原尺寸**，不要先放大。
- 原尺寸建議：

| 類型 | key 範例 | 尺寸 |
|---|---|---|
| 主角 | `player` | 16×16（腳底在圖的下緣附近，畫出來會對齊角色位置） |
| 地圖物件 | `laptop`、`lectern`、`e_tablet` | 物件佔幾格就是幾格×16。1×1 格 = 16×16，寬 2 格 = 32×16 |
| 純裝飾 | `deco_bench` 等 | 同上，看 `game/ui/maps.js` 裡的寬高 |
| 死因卡圖、圖鑑縮圖 | `death_*` | 16×16（死因卡和圖鑑共用同一張，會放大顯示） |
| 結局圖 | `end_*` | 16×16 |

物件的格數在 `game/ui/maps.js`（每個物件的 `w`、`h`）。

## 命名

檔名用英文小寫加底線，跟 key 一樣最好找，例如 key `death_tablet` 就放 `assets/death_tablet.png`。key 不要改，程式和 `content/*.json` 都靠它對應。

## key 從哪來

- 地圖物件：`game/ui/maps.js` 的物件 id（`laptop`、`e_tablet`、`phone`……）。
- 死因卡：`content/deaths.json` 每個死法的 `art`。
- 結局：`content/endings.json` 每個結局的 `art`。
- 主角：`player`。

新增 key 時，也在 `game/ui/assets.js` 加一列（`color` 是沒圖時的底色，`label` 是色塊上的字）。

## 音效

音效不是檔案，是在 `game/ui/audio-logic.js` 用 Web Audio 合成的 4 個 8-bit 短音（互動、解開、死亡、結局）。要改音高或節奏，改那個檔案的音符表。左下角的「音效」按鈕可以靜音，設定會記在瀏覽器裡。
