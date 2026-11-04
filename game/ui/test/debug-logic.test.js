import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content } from '../../core/test/helpers.js';
import { debugActions } from '../../core/debug.js';
import { activeDebugParams, parseClockInput, debugOptions, buildDebugAction, isSaveKey, cleanDebugUrl } from '../debug-logic.js';

const P = (q) => new URLSearchParams(q);

test('網址參數：沒開 debug 一個都不算，開了列出第 9 節的參數', () => {
  assert.deepEqual(activeDebugParams(P('jump=p5&clock=410')), []);
  assert.deepEqual(debugActions(P('jump=p5')), []);
  const a = activeDebugParams(P('debug=1&jump=p5&death=d_p8_dinner&ending=end_true&unlock=all&clock=410&foo=1'));
  assert.deepEqual(a.map((x) => x.key), ['jump', 'death', 'ending', 'unlock', 'clock']);
  assert.deepEqual(activeDebugParams(P('debug=1')), []);
});

test('第 9 節的參數全部轉得成動作', () => {
  const acts = debugActions(P('debug=1&jump=p5&death=d_p8_dinner&ending=end_true&unlock=all&clock=410'));
  assert.deepEqual(acts.map((a) => a.type).sort(), ['DEBUG_CLOCK', 'DEBUG_DEATH', 'DEBUG_ENDING', 'DEBUG_JUMP', 'DEBUG_UNLOCK_ALL']);
});

test('時鐘輸入：分鐘數或 hh:mm，超出範圍或亂打回傳 null', () => {
  assert.equal(parseClockInput('410'), 410);
  assert.equal(parseClockInput(' 06:50 '), 410);
  assert.equal(parseClockInput('0'), 0);
  for (const v of ['', 'abc', '-5', '1440', '25:00', '12:60x', null, '4.5']) {
    assert.equal(parseClockInput(v), null, String(v));
  }
});

test('面板選項涵蓋全部關卡、死法、結局', () => {
  const o = debugOptions(content);
  assert.equal(o.puzzles.length, 8);
  assert.equal(o.deaths.length, content.deaths.length);
  assert.equal(o.endings.length, 4);
  assert.equal(buildDebugAction('ending', 'end_door', content), null); // 門其實沒鎖改成死法，不再是結局
  assert.deepEqual(buildDebugAction('death', 'd_door', content), { type: 'DEBUG_DEATH', death: 'd_door' });
});

test('面板按鈕對應的動作，值不合法就不送', () => {
  assert.deepEqual(buildDebugAction('jump', 'p3', content), { type: 'DEBUG_JUMP', puzzle: 'p3' });
  assert.equal(buildDebugAction('jump', 'p99', content), null);
  assert.deepEqual(buildDebugAction('death', 'd_p8_dinner', content), { type: 'DEBUG_DEATH', death: 'd_p8_dinner' });
  assert.equal(buildDebugAction('death', 'nope', content), null);
  assert.deepEqual(buildDebugAction('ending', 'end_true', content), { type: 'DEBUG_ENDING', ending: 'end_true' });
  assert.equal(buildDebugAction('ending', 'nope', content), null);
  assert.deepEqual(buildDebugAction('unlock', null, content), { type: 'DEBUG_UNLOCK_ALL' });
  assert.deepEqual(buildDebugAction('solve', null, content), { type: 'DEBUG_SOLVE_STAGE' });
  assert.deepEqual(buildDebugAction('clock', '06:50', content), { type: 'DEBUG_CLOCK', clock: 410 });
  assert.equal(buildDebugAction('clock', 'abc', content), null);
  assert.equal(buildDebugAction('boom', 1, content), null);
});

test('清存檔只動遊戲自己的存檔 key，不動靜音設定和別人的資料', () => {
  assert.ok(isSaveKey('latia-mid:run:v1'));
  assert.ok(isSaveKey('latia-mid:codex:v1'));
  assert.ok(isSaveKey('latia-mid:visited:v1'));
  assert.ok(!isSaveKey('latia-mid:muted:v1'));
  assert.ok(!isSaveKey('other:run:v1'));
});

test('清完存檔的網址只留 debug=1', () => {
  assert.equal(cleanDebugUrl('http://localhost:8080/?debug=1&jump=p5#x'), 'http://localhost:8080/?debug=1');
});
