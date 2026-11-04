// 檢查 dist/（交給老師的成品）：純前端、沒有外部資源、而且是由目前原始碼建出來的。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { build, ROOT } from '../build.js';

const DIST = join(ROOT, 'dist');
const lf = (s) => s.replace(/\r\n/g, '\n');
const html = () => lf(readFileSync(join(DIST, 'index.html'), 'utf8'));
const js = () => lf(readFileSync(join(DIST, 'game.js'), 'utf8'));

test('dist 存在，入口是 index.html 加 game.js', () => {
  assert.ok(existsSync(join(DIST, 'index.html')), '找不到 dist/index.html，請先 npm run build');
  assert.ok(existsSync(join(DIST, 'game.js')), '找不到 dist/game.js，請先 npm run build');
});

test('dist 沒有外部 URL（只允許 SVG 命名空間字串）', () => {
  const ALLOWED = ['http://www.w3.org/2000/svg'];
  for (const [name, text] of [['index.html', html()], ['game.js', js()]]) {
    const urls = (text.match(/(?:https?:)?\/\/[\w.-]+\.[a-z]{2,}[^\s"'`)<>]*/gi) || []).filter((u) => !ALLOWED.includes(u));
    assert.deepEqual(urls, [], `${name} 有外部網址`);
  }
});

test('dist 沒有 type="module"、沒有外部 import、沒有 import.meta', () => {
  assert.doesNotMatch(html(), /type\s*=\s*["']?module/i);
  assert.doesNotMatch(js(), /\bimport\.meta\b/);
  assert.doesNotMatch(js(), /^\s*(import|export)\s/m);
  assert.doesNotMatch(js(), /\bimport\s*\(/);
  // index.html 只能引用相對路徑的 game.js，沒有其他 src／href
  const refs = [...html().matchAll(/\b(?:src|href)\s*=\s*"([^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(refs, ['game.js']);
});

test('dist 沒有 fetch，也沒有讀 content/ 或 XMLHttpRequest', () => {
  assert.doesNotMatch(js(), /\bfetch\s*\(/);
  assert.doesNotMatch(js(), /XMLHttpRequest/);
  // 只看字串裡的路徑；註解提到 content/xxx.json 不算
  assert.doesNotMatch(js(), /["'`][^"'`\n]*content\/[\w-]+\.json/);
});

test('dist 的除錯面板仍在，且只有 ?debug=1 才會執行', () => {
  assert.match(js(), /initDebugPanel/);
  assert.match(js(), /if \(debug\) \(await Promise\.resolve\(\)\.then\(\(\) => __require\("game\/ui\/debug-panel\.js"\)\)\)/);
});

test('dist 是由目前原始碼建出來的（內容與重新打包完全一致）', () => {
  const { files, sourceHash } = build();
  assert.match(html(), new RegExp(`source-hash: ${sourceHash}`), '來源已改動，請重跑 npm run build 並提交 dist/');
  assert.match(js(), new RegExp(`source-hash: ${sourceHash}`));
  assert.equal(html(), lf(files['index.html']), 'dist/index.html 與原始碼不一致，請重跑 npm run build');
  assert.equal(js(), lf(files['game.js']), 'dist/game.js 與原始碼不一致，請重跑 npm run build');
});
