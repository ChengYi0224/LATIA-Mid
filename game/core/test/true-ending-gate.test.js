import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame, solvePuzzle } from './helpers.js';
import { createGame, PHASE } from '../engine.js';
import { memoryStorage } from '../save.js';
import { debugActions } from '../debug.js';

const last = (events, type) => events.filter((e) => e.type === type).at(-1);
const REQ = content.trueEndingCodexRequired;

function toFinale(g) {
  let ev = [];
  for (const p of content.puzzles) ev = solvePuzzle(g, p.id);
  assert.equal(g.getState().phase, PHASE.FINALE);
  return last(ev, 'finale');
}

test('門檻寫在 endings.json，暫定 10 格', () => {
  assert.equal(REQ, 10);
});

test('未達門檻：點未讀不觸發真結局，只給梗，之後還能再點', () => {
  const g = newGame();
  const fin = toFinale(g);
  assert.equal(fin.unreadReady, false);
  assert.equal(fin.required, REQ);
  assert.equal(typeof fin.text, 'object'); // finale 事件的 text 是整包 texts.finale
  for (let i = 0; i < 2; i++) {
    const ev = g.dispatch({ type: 'FINALE', choice: 'unread' });
    const locked = last(ev, 'finale_locked');
    assert.ok(locked);
    assert.equal(locked.text, content.texts.finale.unreadLocked);
    assert.match(locked.hint, new RegExp(`${REQ} 格`));
    assert.match(locked.hint, new RegExp(`目前 ${locked.found} 格`));
    assert.equal(last(ev, 'ending'), undefined);
    assert.equal(g.getState().phase, PHASE.FINALE);
  }
  // 回家睡覺仍然可以
  assert.equal(last(g.dispatch({ type: 'FINALE', choice: 'home' }), 'ending').ending.id, 'end_normal');
});

test('達到門檻：點未讀觸發真結局', () => {
  const storage = memoryStorage();
  const g = createGame(content, { storage, resume: false });
  // 先靠死法把圖鑑收集到剛好門檻
  const eggs = content.eggs.slice(0, REQ);
  for (const e of eggs) {
    g.dispatch({ type: 'EGG', egg: e.id });
    g.dispatch({ type: 'RETRY' });
  }
  assert.equal(g.codex().found, REQ);
  g.dispatch({ type: 'NEW_RUN' });
  const fin = toFinale(g);
  assert.equal(fin.unreadReady, true);
  const ev = g.dispatch({ type: 'FINALE', choice: 'unread' });
  assert.equal(last(ev, 'finale_locked'), undefined);
  assert.equal(last(ev, 'ending').ending.id, 'end_true');
});

test('差一格時被擋，補到門檻後回來再點就通', () => {
  const storage = memoryStorage();
  const g = createGame(content, { storage, resume: false });
  for (const e of content.eggs.slice(0, REQ - 2)) {
    g.dispatch({ type: 'EGG', egg: e.id });
    g.dispatch({ type: 'RETRY' });
  }
  g.dispatch({ type: 'NEW_RUN' });
  toFinale(g);
  const locked = last(g.dispatch({ type: 'FINALE', choice: 'unread' }), 'finale_locked');
  assert.equal(locked.found, REQ - 2);
  // 先拿普通結局（+1 格），下一局再死一個新的彩蛋（+1 格），回到 finale 再點
  g.dispatch({ type: 'FINALE', choice: 'home' });
  g.dispatch({ type: 'NEW_RUN' });
  g.dispatch({ type: 'EGG', egg: content.eggs[REQ].id });
  g.dispatch({ type: 'RETRY' });
  toFinale(g);
  assert.equal(g.trueEndingGate().found, REQ);
  assert.equal(last(g.dispatch({ type: 'FINALE', choice: 'unread' }), 'ending').ending.id, 'end_true');
});

test('除錯 unlock=all 直接通過門檻', () => {
  const g = newGame({ debug: true });
  for (const a of debugActions(new URLSearchParams('debug=1&unlock=all&jump=p8'))) g.dispatch(a);
  solvePuzzle(g, 'p8');
  assert.equal(g.getState().phase, PHASE.FINALE);
  assert.equal(g.trueEndingGate().unreadReady, true);
  assert.equal(last(g.dispatch({ type: 'FINALE', choice: 'unread' }), 'ending').ending.id, 'end_true');
});
