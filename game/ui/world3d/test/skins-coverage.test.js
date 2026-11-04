// 檢查：所有線索、彩蛋、手機、助教、門、未解關卡都有專屬版面；每步謎題（除 p7 的假 Moodle）也都有。
// panel-skins.js／skins.js 只在函式裡用 document，載入本身不碰 DOM，可以在 node 讀。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { skinIds } from '../panel-skins.js';
import { skinKeys } from '../../puzzles/skins.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
const json = (n) => JSON.parse(readFileSync(join(root, 'content', n), 'utf8'));

test('線索與彩蛋、手機、助教、門、未解／已解都有專屬版面', () => {
  const have = new Set(skinIds());
  const need = ['phone', 'hint', 'door', 'locked', 'solved'];
  for (const r of json('rooms.json').rooms) for (const c of r.clues) need.push(c.id);
  const eggs = json('eggs.json');
  for (const e of (Array.isArray(eggs) ? eggs : eggs.eggs)) need.push(e.id);
  const missing = need.filter((id) => !have.has(id));
  assert.deepEqual(missing, []);
});

test('每個謎題的每一步（p7 假 Moodle 除外）都有專屬版面', () => {
  const have = new Set(skinKeys());
  const pz = json('puzzles.json');
  const missing = [];
  for (const p of (Array.isArray(pz) ? pz : pz.puzzles)) {
    if (p.id === 'p7') continue;
    p.stages.forEach((_, i) => { if (!have.has(`${p.id}:${i}`)) missing.push(`${p.id}:${i}`); });
  }
  assert.deepEqual(missing, []);
});
