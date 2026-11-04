// 打包腳本（開發工具，老師不需要執行）：只用 Node 內建模組。
// 把 game/ 的 ES module、全部 CSS、content/*.json 打進 dist/，讓 index.html 能用 file:// 雙擊直接開。
// 用法：在 repo 根目錄執行 `npm run build`。
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { posix, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ENTRY = 'game/ui/main.js';
const CONTENT_NAMES = ['puzzles', 'deaths', 'eggs', 'endings', 'rooms', 'hints', 'texts', 'moodle'];
// 載入順序要和原本各模組 append <link> 的順序一致（CSS 疊加順序不變）
const STYLES_FIRST = 'game/ui/styles.css';

const lf = (s) => s.replace(/\r\n/g, '\n'); // 統一換行，雜湊才不會因為 git autocrlf 不同
const read = (rel) => lf(readFileSync(join(ROOT, rel), 'utf8'));

const IMPORT_RE = /^import\s+([^;]*?)\s+from\s+'([^']+)';?[ \t]*$/gm;
const REEXPORT_RE = /^export\s+\{([^}]*)\}\s+from\s+'([^']+)';?[ \t]*$/gm;
const LINK_RE = /(\w+) = document\.createElement\('link'\);[^\n]*\n\s*\1\.rel = 'stylesheet';\s*\n\s*\1\.href = new URL\('(\.\/[\w.-]+\.css)', import\.meta\.url\)\.href;/g;

/** 把一個 ES module 轉成 `function (__require, __exports) {...}` 的函式本體，並回傳它依賴的模組。 */
function transform(id, src, state) {
  const deps = [];
  const dir = posix.dirname(id);
  const res = (spec) => {
    const target = posix.join(dir, spec);
    deps.push(target);
    return target;
  };
  const exportsNames = [];

  let out = src.replace(REEXPORT_RE, (_, names, spec) => {
    const target = JSON.stringify(res(spec));
    return names.split(',').map((n) => n.trim()).filter(Boolean)
      .map((n) => `__exports.${n} = __require(${target}).${n};`).join(' ');
  });
  out = out.replace(IMPORT_RE, (_, clause, spec) => {
    const target = JSON.stringify(res(spec));
    const star = clause.match(/^\*\s+as\s+(\w+)$/);
    if (star) return `const ${star[1]} = __require(${target});`;
    const named = clause.match(/^\{([^}]*)\}$/);
    if (!named) throw new Error(`${id}: 不支援的 import 寫法：${clause}`);
    const items = named[1].split(',').map((s) => s.trim()).filter(Boolean)
      .map((s) => s.replace(/^(\w+)\s+as\s+(\w+)$/, '$1: $2'));
    return `const { ${items.join(', ')} } = __require(${target});`;
  });
  out = out.replace(/^export\s+(async\s+function|function)\s+(\w+)/gm, (_, kw, name) => { exportsNames.push(name); return `${kw} ${name}`; });
  out = out.replace(/^export\s+(const|let)\s+(\w+)/gm, (_, kw, name) => { exportsNames.push(name); return `${kw} ${name}`; });

  // 動態載入除錯面板：模組都在同一支檔案裡，執行才是「載入」，沒開 debug 就不會執行
  out = out.replace(/import\('(\.\/[\w./-]+\.js)'\)/g, (_, spec) => {
    const target = res(spec);
    return `Promise.resolve().then(() => __require(${JSON.stringify(target)}))`;
  });
  // CSS 改成內嵌 <style>
  out = out.replace(LINK_RE, (_, v, spec) => {
    const cssId = posix.join(dir, spec);
    state.css.set(cssId, read(cssId));
    return `${v} = document.createElement('style');\n  ${v}.textContent = __CSS[${JSON.stringify(cssId)}];`;
  });

  if (/^\s*(import|export)\s/m.test(out) || /import\.meta/.test(out)) throw new Error(`${id}: 還有沒轉完的 import/export/import.meta`);
  out += `\n${exportsNames.map((n) => `__exports.${n} = ${n};`).join('\n')}\n`;
  return { body: out, deps };
}

/** 載入資料改成讀內嵌的物件（原本的 load-browser.js 用 fetch，file:// 下會被擋）。 */
const LOAD_BROWSER_STUB = `import { buildContent } from './content.js';
export async function loadContent() { return buildContent(__RAW_CONTENT); }
`;

/** 組出整份 dist：回傳 { files: {相對路徑: 文字或 Buffer}, sourceHash }。不寫檔。 */
export function build() {
  const state = { css: new Map() };
  const modules = new Map(); // id -> { body, deps }
  const order = [];
  const visit = (id) => {
    if (modules.has(id)) return;
    const src = id === 'game/core/load-browser.js' ? LOAD_BROWSER_STUB : read(id);
    const m = transform(id, src, state);
    modules.set(id, m);
    for (const d of m.deps) visit(d);
    order.push(id);
  };
  visit(ENTRY);
  // 除錯面板由動態 import 帶進來，visit 已經涵蓋

  const rawContent = {};
  for (const name of CONTENT_NAMES) rawContent[name] = JSON.parse(read(`content/${name}.json`));

  // 來源雜湊：所有進到成品的來源檔（含原始的 load-browser.js、index.html、全部 CSS 與資料）
  const hashInputs = [...new Set([...modules.keys(), 'game/core/load-browser.js'])].sort().map((id) => [id, read(id)]);
  hashInputs.push(['index.html', read('index.html')], [STYLES_FIRST, read(STYLES_FIRST)]);
  for (const [id] of [...state.css]) hashInputs.push([id, read(id)]);
  for (const name of CONTENT_NAMES) hashInputs.push([`content/${name}.json`, read(`content/${name}.json`)]);
  const h = createHash('sha256');
  for (const [id, text] of hashInputs.sort((a, b) => (a[0] < b[0] ? -1 : 1))) h.update(`${id}\n${text}\n`);
  const sourceHash = h.digest('hex');

  const cssObj = Object.fromEntries([...state.css.entries()].sort());
  const defs = order.map((id) => {
    const isEntry = id === ENTRY;
    const { body } = modules.get(id);
    return `__def(${JSON.stringify(id)}, ${isEntry ? 'async ' : ''}function (__require, __exports) {\n${body}\n});`;
  }).join('\n\n');

  const js = `// 《天亮前交出去》成品（由 scripts/build.js 產生，請不要手改；改 game/、content/ 後重跑 npm run build）
// source-hash: ${sourceHash}
(function () {
'use strict';
const __RAW_CONTENT = ${JSON.stringify(rawContent)};
const __CSS = ${JSON.stringify(cssObj)};
const __defs = Object.create(null);
const __cache = Object.create(null);
function __def(id, fn) { __defs[id] = fn; }
function __require(id) {
  if (id in __cache) return __cache[id].exports;
  if (!__defs[id]) throw new Error('找不到模組：' + id);
  const mod = { exports: {} };
  __cache[id] = mod;
  __defs[id](__require, mod.exports);
  return mod.exports;
}

${defs}

__defs[${JSON.stringify(ENTRY)}](__require, {}).catch((e) => console.error(e)); // 入口有 top-level await，所以是 async
})();
`;

  const tpl = read('index.html').replace(/[ \t]*<!-- file-guard:start -->[\s\S]*?<!-- file-guard:end -->\r?\n/, '');
  const styles = read(STYLES_FIRST).trim();
  let html = tpl
    .replace(/<link rel="stylesheet" href="game\/ui\/styles\.css">/, () => `<style>\n${styles}\n  </style>`)
    .replace(/<script type="module" src="game\/ui\/main\.js"><\/script>/, '<script src="game.js" charset="utf-8"></script>');
  if (html === tpl || html.includes('type="module"') || html.includes('styles.css')) throw new Error('index.html 轉換失敗');
  html = html.replace('<!doctype html>', `<!doctype html>\n<!-- source-hash: ${sourceHash} -->`);

  const files = { 'index.html': html, 'game.js': js };
  // assets/ 裡的圖片與音檔一起帶過去（README 不用）
  const walk = (rel) => {
    const abs = join(ROOT, rel);
    if (!existsSync(abs)) return;
    for (const name of readdirSync(abs).sort()) {
      const r = posix.join(rel, name);
      if (statSync(join(ROOT, r)).isDirectory()) walk(r);
      else if (!/\.md$/i.test(name)) files[r] = readFileSync(join(ROOT, r));
    }
  };
  walk('assets');
  return { files, sourceHash };
}

/** 寫進 dist/（先清掉舊的） */
export function writeDist() {
  const { files, sourceHash } = build();
  const out = join(ROOT, 'dist');
  rmSync(out, { recursive: true, force: true });
  for (const [rel, data] of Object.entries(files)) {
    const p = join(out, rel);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, data);
  }
  return { count: Object.keys(files).length, sourceHash };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { count, sourceHash } = writeDist();
  console.log(`dist/ 完成：${count} 個檔案，source-hash ${sourceHash.slice(0, 12)}`);
}
