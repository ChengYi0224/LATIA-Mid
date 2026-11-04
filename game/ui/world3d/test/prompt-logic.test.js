import test from 'node:test';
import assert from 'node:assert/strict';
import { promptFor, labelMark, farText } from '../prompt-logic.js';

const puzzle = { kind: 'puzzle', name: '筆電密碼鎖', puzzle: { id: 'p1' } };

test('謎題提示依狀態變化', () => {
  assert.deepEqual(promptFor(puzzle, { solved: () => false, available: () => true }), { text: '[E] 解謎：筆電密碼鎖', state: 'can' });
  assert.equal(promptFor(puzzle, { solved: () => false, available: () => false }).state, 'locked');
  assert.match(promptFor(puzzle, { solved: () => false, available: () => false }).text, /還不能解/);
  assert.equal(promptFor(puzzle, { solved: () => true, available: () => false }).state, 'done');
});

test('線索、彩蛋看過會標示', () => {
  const clue = { kind: 'clue', name: '便利貼' };
  assert.equal(promptFor(clue, { id: 'c1', seen: new Set() }).text, '[E] 調查：便利貼');
  assert.equal(promptFor(clue, { id: 'c1', seen: new Set(['c1']) }).text, '[E] 調查：便利貼（看過）');
  assert.equal(promptFor({ kind: 'egg', name: '貓' }, { id: 'e1', seen: new Set() }).text, '[E] 看看：貓');
});

test('手機、助教、門', () => {
  assert.equal(promptFor({ kind: 'phone', name: '手機' }).text, '[E] 看手機');
  assert.equal(promptFor({ kind: 'hint', name: 'AI 助教' }).text, '[E] 問 AI 助教');
  assert.equal(promptFor({ kind: 'door', name: '大門' }).text, '[E] 離開');
});

test('名牌記號', () => {
  assert.equal(labelMark(puzzle, { solved: true }), '✓ ');
  assert.equal(labelMark(puzzle, { available: false }), '🔒 ');
  assert.equal(labelMark(puzzle, { isTarget: true }), '★ ');
  assert.equal(labelMark({ kind: 'clue' }, { seen: true }), '✓ ');
  assert.equal(labelMark({ kind: 'clue' }, {}), '');
  assert.equal(farText('筆電'), '靠近一點：筆電');
});
