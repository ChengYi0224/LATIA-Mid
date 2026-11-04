import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame, solvePuzzle, solveUntil, reachStage } from './helpers.js';
import { createGame, PHASE, solutionFor } from '../engine.js';
import { memoryStorage } from '../save.js';
import { debugActions } from '../debug.js';

const last = (events, type) => events.filter((e) => e.type === type).at(-1);

test('從開局一路玩到真結局（圖鑑已達門檻）', () => {
  const g = newGame({ debug: true });
  g.dispatch({ type: 'DEBUG_UNLOCK_ALL' });
  g.dispatch({ type: 'NEW_RUN' });
  for (const p of content.puzzles) solvePuzzle(g, p.id);
  assert.equal(g.getState().phase, PHASE.FINALE);
  assert.equal(g.clockText(), '03:40');
  const ev = g.dispatch({ type: 'FINALE', choice: 'unread' });
  assert.equal(last(ev, 'ending').ending.id, 'end_true');
  assert.equal(g.getState().phase, PHASE.ENDING);
});

test('通關後選「回家睡覺」是普通結局', () => {
  const g = newGame();
  for (const p of content.puzzles) solvePuzzle(g, p.id);
  const ev = g.dispatch({ type: 'FINALE', choice: 'home' });
  assert.equal(last(ev, 'ending').ending.id, 'end_normal');
});

test('跳過第 7 關直接出門是「人出來了，報告沒交」', () => {
  const g = newGame();
  solveUntil(g, 'p7');
  const ev = solvePuzzle(g, 'p8');
  assert.equal(last(ev, 'ending').ending.id, 'end_no_submit');
});

test('彩蛋：還沒碰筆電就推門，門其實沒鎖——記成圖鑑第 1 格的死法，重來後接著玩', () => {
  const g = newGame();
  solvePuzzle(g, 'p1'); // 先解一關，確認推門不會把進度清掉……
  const g2 = newGame();
  const ev = g2.dispatch({ type: 'DOOR' });
  const d = last(ev, 'death');
  assert.equal(d.death.id, 'd_door');
  assert.equal(last(ev, 'ending'), undefined);
  assert.equal(g2.getState().phase, PHASE.DEAD);
  assert.equal(g2.codex().entries[0].id, 'd_door');
  assert.equal(g2.codex().entries[0].found, true);
  g2.dispatch({ type: 'RETRY' });
  assert.equal(g2.getState().phase, PHASE.PLAYING);
  assert.equal(g2.clockText(), '01:10');
  // 重來後一樣可以去碰筆電，碰了之後門就鎖了
  g2.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '5861' });
  assert.equal(g2.dispatch({ type: 'DOOR' })[0].type, 'message');
  assert.ok(g.isSolved('p1'));
});

test('碰了筆電之後警衛鎖門，門就推不開了', () => {
  const g = newGame();
  const ev = g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '0000' });
  assert.ok(ev.some((e) => e.type === 'cutscene' && e.id === 'guard_locks'));
  const ev2 = g.dispatch({ type: 'DOOR' });
  assert.equal(ev2[0].type, 'message');
  assert.equal(g.getState().phase, PHASE.PLAYING);
});

/** 用資料找出每個死法的觸發方式，逐一觸發。 */
function triggerDeath(g, death) {
  if (death.id === 'd_door') return g.dispatch({ type: 'DOOR' });
  const egg = content.eggs.find((e) => e.death === death.id);
  if (egg) return g.dispatch({ type: 'EGG', egg: egg.id });
  const p = content.puzzleById[death.origin];
  solveUntil(g, p.id);
  for (const s of p.stages) {
    const opt = s.options?.find((o) => o.death === death.id);
    const rule = s.deathRules?.find((r) => r.death === death.id);
    if (!opt && !rule && s.wrongDeath !== death.id) continue;
    reachStage(g, p.id, s.id);
    if (opt) return g.dispatch({ type: 'PUZZLE', puzzle: p.id, value: opt.id });
    if (rule) return g.dispatch({ type: 'PUZZLE', puzzle: p.id, value: { ...s.answer, ...rule.match } });
    let ev = [];
    for (let i = 0; i < s.maxWrong; i++) ev = g.dispatch({ type: 'PUZZLE', puzzle: p.id, value: 'wrong' });
    return ev;
  }
  throw new Error(`找不到 ${death.id} 的觸發方式`);
}

for (const death of content.deaths) {
  test(`死法可觸發，重來後道具與進度保留：${death.id}`, () => {
    const g = newGame();
    const ev = triggerDeath(g, death);
    const d = last(ev, 'death');
    assert.ok(d, `沒有死：${JSON.stringify(ev)}`);
    assert.equal(d.death.id, death.id);
    assert.equal(d.death.text, death.text);
    assert.equal(g.getState().phase, PHASE.DEAD);
    const before = g.getState();
    g.dispatch({ type: 'RETRY' });
    const after = g.getState();
    assert.equal(after.phase, PHASE.PLAYING);
    assert.deepEqual(after.items, before.items);
    assert.deepEqual(after.puzzles, before.puzzles);
  });
}

test('死了之後是同一步重來，不用重解前面的步驟', () => {
  const g = newGame();
  reachStage(g, 'p1', 'update');
  g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: 'later' });
  g.dispatch({ type: 'RETRY' });
  assert.equal(g.currentStage('p1').id, 'update');
});

test('時間：解一題 +20 分、死一次 +10 分', () => {
  const g = newGame();
  assert.equal(g.clockText(), '01:00');
  solvePuzzle(g, 'p1');
  assert.equal(g.clockText(), '01:20');
  g.dispatch({ type: 'EGG', egg: 'e_desk' });
  assert.equal(g.clockText(), '01:30');
});

test('死到 07:00，重來時進入「天亮了」', () => {
  const g = newGame();
  let ev;
  for (let i = 0; i < 36; i++) {
    g.dispatch({ type: 'EGG', egg: 'e_tablet' });
    ev = g.dispatch({ type: 'RETRY' });
    if (g.getState().phase === PHASE.ENDING) break;
  }
  assert.equal(g.clockText(), '07:00');
  assert.equal(last(ev, 'ending').ending.id, 'end_dawn');
});

test('AI 助教每晚 3 次，用完出現額度用完的梗', () => {
  const g = newGame();
  const hint = () => last(g.dispatch({ type: 'HINT' }), 'hint');
  const a = hint();
  const b = hint();
  assert.equal(a.text, content.hints.puzzles.p1.ai[0]);
  assert.equal(b.text, content.hints.puzzles.p1.ai[1]);
  assert.equal(b.quota, 1);
  // 同一關的提示都講完了：重講最後一句，不扣額度
  const again = hint();
  assert.equal(again.text, content.hints.puzzles.p1.ai[1]);
  assert.equal(again.repeat, true);
  assert.equal(again.quota, 1);
  solvePuzzle(g, 'p1');
  assert.equal(hint().quota, 0); // p2 第一句，用掉最後一次
  const out = hint();
  assert.equal(out.quotaOut, true);
  assert.equal(out.text, content.hints.aiQuotaOutText);
});

test('同一關死 3 次，死因卡附上學長便利貼', () => {
  const g = newGame();
  reachStage(g, 'p1', 'update');
  let d;
  for (let i = 0; i < 3; i++) {
    d = last(g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: 'now' }), 'death');
    if (i < 2) assert.equal(d.senpai, undefined);
    g.dispatch({ type: 'RETRY' });
  }
  assert.match(d.senpai, /有空吃個飯/);
});

test('密碼打錯兩次只是錯，第三次才死', () => {
  const g = newGame();
  assert.equal(g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '1111' }).at(-1).type, 'wrong');
  assert.equal(g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '1111' }).at(-1).type, 'wrong');
  assert.equal(last(g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '1111' }), 'death').death.id, 'd_p1_lockout');
});

test('房間要有鑰匙才進得去', () => {
  const g = newGame();
  assert.equal(g.dispatch({ type: 'GO', room: 'hall' })[0].type, 'blocked');
  solvePuzzle(g, 'p1');
  solvePuzzle(g, 'p2');
  assert.equal(g.dispatch({ type: 'GO', room: 'hall' })[0].type, 'moved');
});

test('還沒解前一關，下一關不能動', () => {
  const g = newGame();
  assert.equal(g.dispatch({ type: 'PUZZLE', puzzle: 'p3', value: [] })[0].reason, 'locked');
});

test('死因卡顯示中不能做別的事', () => {
  const g = newGame();
  g.dispatch({ type: 'EGG', egg: 'e_desk' });
  assert.equal(g.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '5861' })[0].reason, 'wrong_phase');
});

test('勾了「記住帳號」，結算多一句', () => {
  const g = newGame();
  solveUntil(g, 'p7');
  reachStage(g, 'p7', 'login');
  g.dispatch({ type: 'PUZZLE', puzzle: 'p7', value: { answer: '5861', checks: { remember: true } } });
  solvePuzzle(g, 'p7');
  solvePuzzle(g, 'p8');
  const ev = g.dispatch({ type: 'FINALE', choice: 'home' });
  assert.ok(last(ev, 'ending').results.lines.includes(content.texts.results.rememberedAccount));
});

test('圖鑑跨局保存；存檔可以接續', () => {
  const storage = memoryStorage();
  const g1 = createGame(content, { storage, resume: false });
  g1.dispatch({ type: 'EGG', egg: 'e_bbq' });
  const g2 = createGame(content, { storage });
  assert.equal(g2.getState().phase, PHASE.DEAD);
  g2.dispatch({ type: 'NEW_RUN' });
  assert.equal(g2.getState().deaths, 0);
  assert.equal(g2.codex().entries.find((e) => e.id === 'd_e_bbq').found, true);
  assert.equal(g2.codex().found, 1);
});

test('storage 壞掉時照樣能玩', () => {
  const broken = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); }, removeItem() { throw new Error('x'); } };
  const g = createGame(content, { storage: broken });
  solvePuzzle(g, 'p1');
  assert.equal(g.isSolved('p1'), true);
});

test('除錯：沒開 debug 不能用；開了可以跳關、觸發死法、解鎖全圖鑑', () => {
  assert.equal(newGame().dispatch({ type: 'DEBUG_JUMP', puzzle: 'p5' })[0].reason, 'debug_disabled');
  const g = newGame({ debug: true });
  const params = new URLSearchParams('debug=1&unlock=all&jump=p7');
  for (const a of debugActions(params)) g.dispatch(a);
  assert.equal(g.currentPuzzle().id, 'p7');
  assert.ok(g.hasItem('usb_report'));
  assert.equal(g.clockText(), '03:00');
  assert.equal(g.codex().found, g.codex().total);
  g.dispatch({ type: 'DEBUG_SOLVE_STAGE' });
  assert.equal(g.currentStage('p7').id, 'guest_dialog');
  assert.equal(last(g.dispatch({ type: 'DEBUG_DEATH', death: 'd_p8_dinner' }), 'death').death.id, 'd_p8_dinner');
});

test('solutionFor 對每一步都給得出答案', () => {
  for (const p of content.puzzles) for (const s of p.stages) assert.notEqual(solutionFor(s), undefined, `${p.id}.${s.id}`);
});
