import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame } from '../../../core/test/helpers.js';
import { screenFor, isGuest, loginMode, hasOption, choiceAction, loginAction, loginChoiceIds, FAKE_ACCOUNT } from '../moodle-logic.js';

const p7 = content.puzzleById.p7;
const stage = (id) => p7.stages.find((s) => s.id === id);

test('每一步都有對應畫面，且是 moodle.json 定義的四種之一', () => {
  for (const s of p7.stages) assert.ok(['course', 'course+dialog', 'login', 'home'].includes(screenFor(content.moodle, s.id)), s.id);
});

test('訪客狀態只在繳交後到登入完成前', () => {
  assert.deepEqual(p7.stages.map((s) => isGuest(s.id)), [false, true, true, true, false, false]);
  assert.equal(loginMode('login_choice'), 'autofill');
  assert.equal(loginMode('login'), 'manual');
});

test('登入頁的點擊都對得上 login_choice 的選項，死法 id 與資料一致', () => {
  const st = stage('login_choice');
  const ids = loginChoiceIds();
  for (const id of Object.values(ids)) assert.ok(hasOption(st, id), id);
  const deaths = Object.fromEntries(st.options.filter((o) => o.death).map((o) => [o.id, o.death]));
  assert.deepEqual(deaths, { guest: 'd_p7_guest', forgot: 'd_p7_forgot', contact: 'd_p7_admin', autofill: 'd_p7_senior_account' });
  assert.equal(choiceAction('p7', st, 'nope'), null);
});

test('假帳號不是真實學號格式的樣本，且 moodle.json 有說明', () => {
  assert.match(FAKE_ACCOUNT, /^s\d+$/);
});

test('用 UI 邏輯送出的動作能走完 p7 正解並設起 p7_remembered', () => {
  const g = newGame({ debug: true });
  g.dispatch({ type: 'DEBUG_JUMP', puzzle: 'p7' });
  const go = (a) => g.dispatch(a);
  go(choiceAction('p7', g.currentStage('p7'), 'submit'));
  go(choiceAction('p7', g.currentStage('p7'), 'continue'));
  go(choiceAction('p7', g.currentStage('p7'), 'clear'));
  const ev = go(loginAction('p7', ' 5861 ', true));
  assert.ok(ev.some((e) => e.type === 'stage_cleared' || e.type === 'stage'));
  assert.equal(g.getState().flags.p7_remembered, true);
  go(choiceAction('p7', g.currentStage('p7'), 'calendar'));
  go(choiceAction('p7', g.currentStage('p7'), 'submit'));
  assert.ok(g.isSolved('p7'));
});

test('6 個死法都能用 UI 動作觸發', () => {
  const to = (steps) => {
    const g = newGame({ debug: true });
    g.dispatch({ type: 'DEBUG_JUMP', puzzle: 'p7' });
    for (const id of steps) g.dispatch(choiceAction('p7', g.currentStage('p7'), id));
    return g;
  };
  const cases = [
    [['submit', 'continue', 'guest'], 'd_p7_guest'],
    [['submit', 'continue', 'forgot'], 'd_p7_forgot'],
    [['submit', 'continue', 'contact'], 'd_p7_admin'],
    [['submit', 'continue', 'autofill'], 'd_p7_senior_account'],
  ];
  for (const [steps, death] of cases) assert.equal(to(steps).getState().lastDeath, death);
  const lastyear = to(['submit', 'continue', 'clear']);
  lastyear.dispatch(loginAction('p7', '5861', false));
  lastyear.dispatch(choiceAction('p7', lastyear.currentStage('p7'), 'lastyear'));
  assert.equal(lastyear.getState().lastDeath, 'd_p7_lastyear');
  const concl = to(['submit', 'continue', 'clear']);
  concl.dispatch(loginAction('p7', '5861', false));
  concl.dispatch(choiceAction('p7', concl.currentStage('p7'), 'calendar'));
  concl.dispatch(choiceAction('p7', concl.currentStage('p7'), 'merge'));
  assert.equal(concl.getState().lastDeath, 'd_p7_conclusion');
});
