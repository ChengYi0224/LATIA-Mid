import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame, solveUntil } from '../../../core/test/helpers.js';
import { MAPS } from '../../maps.js';
import { MINIMAP_LAYOUT, minimapCells, addVisited, taskText, pickTargets, quotaText, createIdleTracker, clockDelta } from '../logic.js';

test('小地圖格位涵蓋全部 7 個房間，而且和地圖一致', () => {
  assert.deepEqual(Object.keys(MINIMAP_LAYOUT).sort(), Object.keys(MAPS).sort());
  assert.deepEqual(Object.keys(MINIMAP_LAYOUT).sort(), content.rooms.list.map((r) => r.id).sort());
});

test('小地圖只畫去過的房間，目前所在一定算', () => {
  const cells = minimapCells({ visited: ['r401'], current: 'hall', target: null });
  assert.deepEqual(cells.map((c) => c.id).sort(), ['hall', 'r401']);
  assert.equal(cells.find((c) => c.id === 'hall').here, true);
  assert.equal(cells.find((c) => c.id === 'r401').here, false);
});

test('目標房間沒去過時只標問號格，去過就顯示名字', () => {
  const names = { hall: '四樓走廊', pantry: '茶水間' };
  const a = minimapCells({ visited: [], current: 'hall', target: 'pantry', names });
  const p = a.find((c) => c.id === 'pantry');
  assert.equal(p.seen, false);
  assert.equal(p.name, '？');
  assert.equal(p.target, true);
  const b = minimapCells({ visited: ['pantry'], current: 'hall', target: 'pantry', names });
  assert.equal(b.find((c) => c.id === 'pantry').name, '茶水間');
});

test('addVisited 不改原集合', () => {
  const s = ['r401'];
  assert.deepEqual([...addVisited(s, 'hall')].sort(), ['hall', 'r401']);
  assert.deepEqual(s, ['r401']);
});

test('任務文字隨進度更新，永遠有字', () => {
  const g = newGame();
  const names = (id) => content.rooms.byId[id]?.name;
  const t1 = pickTargets(g, content);
  assert.equal(t1.puzzle.id, 'p1');
  const s1 = taskText({ puzzle: t1.puzzle, roomName: names(t1.puzzle.room), phase: 'playing' });
  assert.match(s1, /筆電密碼鎖/);
  solveUntil(g, 'p3');
  const t3 = pickTargets(g, content);
  assert.equal(t3.puzzle.id, 'p3');
  assert.notEqual(taskText({ puzzle: t3.puzzle, roomName: names('hall'), phase: 'playing' }), s1);
});

test('p6 之後 p7（可跳過）與 p8 同時列出', () => {
  const g = newGame();
  solveUntil(g, 'p7');
  const t = pickTargets(g, content);
  assert.equal(t.puzzle.id, 'p7');
  assert.equal(t.other.id, 'p8');
  const s = taskText({ puzzle: t.puzzle, other: t.other, roomName: '電腦教室', otherRoomName: '一樓', phase: 'playing' });
  assert.match(s, /可跳過/);
  assert.match(s, /廣播控制台/);
});

test('沒有目標或在特殊階段也有文字', () => {
  assert.ok(taskText({ puzzle: null, phase: 'playing' }).length > 0);
  assert.ok(taskText({ puzzle: null, phase: 'finale' }).length > 0);
  assert.ok(taskText({ puzzle: null, phase: 'ending' }).length > 0);
});

test('額度文字', () => {
  assert.equal(quotaText(3, 3), '剩 3／3 次');
  assert.equal(quotaText(0, 3), '額度用完');
});

test('卡關計時：滿 idle 秒觸發一次，換題重新計', () => {
  const t = createIdleTracker(60000);
  t.track('p1', 0);
  assert.equal(t.check(59999), null);
  assert.equal(t.check(60000), 'p1');
  assert.equal(t.check(120000), null); // 只講一次
  t.track('p1', 130000);               // 同題不重置
  assert.equal(t.check(200000), null);
  t.track('p2', 200000);               // 換題
  assert.equal(t.check(259999), null);
  assert.equal(t.check(260000), 'p2');
  t.reset('p2', 300000);               // 死亡重來等於重新計
  assert.equal(t.check(360000), 'p2');
  t.reset(null, 400000);
  assert.equal(t.check(999999), null);
});

test('時鐘跳動分鐘數', () => {
  assert.equal(clockDelta('01:00', '01:20'), 20);
  assert.equal(clockDelta('01:20', '01:30'), 10);
  assert.equal(clockDelta('01:00', '01:00'), 0);
  assert.equal(clockDelta(null, '01:00'), 0);
});
