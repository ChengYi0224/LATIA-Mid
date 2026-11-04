// 把 assets/textures/*.jpg 轉成 base64，寫進 game/ui/world3d/style/assets-data.js。
// 為什麼要轉：file:// 雙擊開啟時，瀏覽器不讓 WebGL 載入外部圖片檔（CORS），內嵌成 data URI 就沒問題。
// 用法：在 repo 根目錄執行 `node scripts/gen-assets.js`。換了貼圖就要重跑。
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets', 'textures');
const OUT = join(ROOT, 'game', 'ui', 'world3d', 'style', 'assets-data.js');

const data = {};
let total = 0;
for (const f of readdirSync(SRC).filter((n) => /\.(jpe?g|png)$/i.test(n)).sort()) {
  const buf = readFileSync(join(SRC, f));
  const mime = /\.png$/i.test(f) ? 'image/png' : 'image/jpeg';
  data[f.replace(/\.[^.]+$/, '')] = `data:${mime};base64,${buf.toString('base64')}`;
  total += buf.length;
}
const body =
  '// 由 scripts/gen-assets.js 自動產生，請勿手改。\n' +
  '// 一般 <script> 或 import 都能載入；載入後 materials.js 會從 globalThis.__STYLE_TEXTURES__ 取貼圖。\n' +
  'globalThis.__STYLE_TEXTURES__ = ' + JSON.stringify(data, null, 1) + ';\n';
writeFileSync(OUT, body);
console.log(`貼圖 ${Object.keys(data).length} 張，原檔 ${(total / 1048576).toFixed(2)} MB，輸出 ${(statSync(OUT).size / 1048576).toFixed(2)} MB -> ${OUT}`);
