import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../../core/test/helpers.js';
import { MAPS } from '../maps.js';
import { skyColor, dawnLevel, darkness, dueChatter, nextLine, typeDuration, TYPE_MS } from '../flavor-logic.js';

const F = content.texts.flavor;

test('天色：深夜到天亮一路變亮，07:00 是橘色', () => {
  assert.equal(skyColor(0), '#0a0f2c');
  assert.notEqual(skyColor(60), skyColor(400));
  assert.equal(skyColor(420), '#f4b26b');
  assert.equal(skyColor(999), '#f4b26b');
  assert.match(skyColor(360), /^#[0-9a-f]{6}$/);
  assert.equal(dawnLevel(200), 0);
  assert.equal(dawnLevel(420), 1);
  assert.ok(darkness(0.8, 420) < darkness(0.8, 60));
});

test('手機通知：時間到才跳，跳過的不再跳', () => {
  const list = [{ at: 100 }, { at: 200 }, { at: 300 }];
  const shown = new Set();
  assert.deepEqual(dueChatter(list, 90, shown), []);
  assert.deepEqual(dueChatter(list, 210, shown), [0, 1]);
  shown.add(0); shown.add(1);
  assert.deepEqual(dueChatter(list, 210, shown), []);
  assert.deepEqual(dueChatter(list, 420, shown), [2]);
});

test('台詞輪流講，講完從頭開始', () => {
  const counts = {};
  assert.equal(nextLine(['a', 'b'], 'x', counts), 'a');
  assert.equal(nextLine(['a', 'b'], 'x', counts), 'b');
  assert.equal(nextLine(['a', 'b'], 'x', counts), 'a');
  assert.equal(nextLine(undefined, 'y', counts), null);
  assert.equal(typeDuration('四個字啊'), 4 * TYPE_MS);
});

test('台詞資料對得上：房間、謎題、線索、道具都存在', () => {
  for (const r of Object.keys(F.roomEnter)) assert.ok(content.rooms.byId[r], r);
  for (const p of Object.keys(F.puzzleIntro)) assert.ok(content.puzzleById[p], p);
  for (const p of content.puzzles) assert.ok(F.puzzleIntro[p.id], `${p.id} 沒有開場白`);
  const clueIds = content.rooms.list.flatMap((r) => r.clues.map((c) => c.id));
  for (const id of Object.keys(F.quips)) assert.ok(clueIds.includes(id), id);
  const rewardItems = content.puzzles.flatMap((p) => p.reward.items);
  for (const it of rewardItems) assert.ok(F.items[it], `${it} 沒有名字`);
  for (const c of F.chatter) {
    assert.ok(c.at > content.texts.clock.start && c.at <= content.texts.clock.dawn, String(c.at));
    assert.ok(c.text && (c.narration || c.from));
  }
  assert.ok(content.texts.openingChat.messages.length >= 3);
});

test('每個房間都有地圖（燈光和窗戶設定用得到）', () => {
  for (const r of Object.keys(F.roomEnter)) assert.ok(MAPS[r], r);
});
