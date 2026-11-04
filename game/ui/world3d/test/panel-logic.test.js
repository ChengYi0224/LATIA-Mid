import test from 'node:test';
import assert from 'node:assert/strict';
import { panelFor, resultFromEvent, buttonIndexForKey, quotaLine, phoneReply, PHONE_CHOICES } from '../panel-logic.js';

const content = { puzzleById: { p1: { title: '筆電密碼鎖' } }, hints: { aiQuota: 3 } };
const game = (over = {}) => ({
  isSolved: () => false, puzzleAvailable: () => true, getState: () => ({ aiQuota: 2 }), ...over,
});
const ctx = (g = game()) => ({ game: g, content });

test('線索面板：標題、文字、可仔細想想與關閉', () => {
  const p = panelFor({ kind: 'clue', clue: { name: '考卷', text: '58 分', forPuzzle: 'p1' } }, null, ctx());
  assert.equal(p.title, '考卷');
  assert.equal(p.text, '58 分');
  assert.equal(p.buttons[0].stay, true);
  assert.match(p.buttons[0].result, /筆電密碼鎖.*現在就可以去解/);
  assert.equal(p.buttons.at(-1).id, 'close');
});

test('線索對應的關卡狀態：已解開、還沒輪到、沒有對應', () => {
  const clue = (forPuzzle) => ({ kind: 'clue', clue: { name: 'x', text: 't', forPuzzle } });
  assert.match(panelFor(clue('p1'), null, ctx(game({ isSolved: () => true }))).buttons[0].result, /已經解開/);
  assert.match(panelFor(clue('p1'), null, ctx(game({ puzzleAvailable: () => false }))).buttons[0].result, /還沒輪到/);
  assert.match(panelFor(clue(undefined), null, ctx()).buttons[0].result, /沒有對上/);
});

test('彩蛋、門：按鈕送正確動作，預設焦點在「算了／再想想」', () => {
  const egg = panelFor({ kind: 'egg', egg: { id: 'e1', name: '平板', look: '看看', actionLabel: '看一集' } }, null, ctx());
  assert.deepEqual(egg.buttons[0].action, { type: 'EGG', egg: 'e1' });
  assert.equal(egg.buttons[1].focus, true);
  const door = panelFor({ kind: 'door', name: '大門' }, null, ctx());
  assert.deepEqual(door.buttons[0].action, { type: 'DOOR' });
  assert.equal(door.buttons[1].focus, true);
});

test('手機與助教：留在面板裡看結果，助教顯示剩餘額度', () => {
  const phone = panelFor({ kind: 'phone' }, null, ctx());
  assert.deepEqual(phone.buttons[0].action, { type: 'PHONE' });
  assert.equal(phone.buttons[0].stay, true);
  const hint = panelFor({ kind: 'hint' }, null, ctx());
  assert.deepEqual(hint.buttons[0].action, { type: 'HINT' });
  assert.equal(hint.meta, 'AI 額度：剩餘 2／3 次');
});

test('謎題：已解開與還不能解都只有關閉', () => {
  const res = { kind: 'puzzle', name: '筆電', puzzle: { id: 'p1', title: '筆電密碼鎖' } };
  const done = panelFor(res, { text: '' }, ctx(game({ isSolved: () => true })));
  assert.equal(done.kicker, '已解開');
  const locked = panelFor(res, { text: '相關線索：\n・考卷' }, ctx(game({ puzzleAvailable: () => false })));
  assert.equal(locked.kicker, '還不能解');
  assert.match(locked.text, /考卷/);
  assert.equal(locked.buttons.length, 1);
});

test('事件轉面板結果文字', () => {
  assert.equal(resultFromEvent({ type: 'message', text: '等交完再看' }), '等交完再看');
  assert.equal(resultFromEvent({ type: 'hint', text: '排日期' }), '排日期');
  assert.match(resultFromEvent({ type: 'hint', text: '' }), /沒有需要提示/);
  assert.equal(resultFromEvent({ type: 'finale_locked', text: 'a', hint: 'b' }), 'a\nb');
  assert.equal(resultFromEvent({ type: 'moved' }), null);
});

test('數字鍵對應按鈕', () => {
  assert.equal(buttonIndexForKey('1', 2), 0);
  assert.equal(buttonIndexForKey('2', 2), 1);
  assert.equal(buttonIndexForKey('3', 2), -1);
  assert.equal(buttonIndexForKey('a', 2), -1);
  assert.equal(buttonIndexForKey('0', 2), -1);
  assert.equal(quotaLine(1, 3), 'AI 額度：剩餘 1／3 次');
});

test('每個面板都帶 skin；手機面板有訊息串、未解關卡有線索便條', async () => {
  const { phoneThreads, lockedNotes } = await import('../panel-logic.js');
  const c = {
    puzzleById: {}, hints: { aiQuota: 3 },
    texts: { flavor: { chatter: [{ at: 100, from: '媽媽', text: 'a' }, { at: 120, from: '媽媽', text: 'b' }, { at: 130, narration: true, text: 'n' }, { at: 900, from: '晚來', text: 'z' }] } },
    rooms: { list: [{ clues: [{ name: '考卷', text: '58', forPuzzle: 'p1' }, { name: '別的', text: 'x', forPuzzle: 'p2' }] }] },
  };
  const g = game({ getState: () => ({ aiQuota: 2, clock: 200 }) });
  const phone = panelFor({ kind: 'phone' }, null, { game: g, content: c });
  assert.equal(phone.skin, 'phone');
  assert.deepEqual(phone.chat, [{ from: '媽媽', messages: ['a', 'b'] }]);
  assert.deepEqual(phoneThreads({ game: g, content: c })[0].messages.length, 2);
  assert.deepEqual(lockedNotes('p1', { content: c }), [{ name: '考卷', text: '58' }]);
  const res = { kind: 'puzzle', name: '筆電', puzzle: { id: 'p1', title: 'x' } };
  assert.equal(panelFor(res, { text: '' }, { game: game({ puzzleAvailable: () => false }), content: c }).skin, 'locked');
  assert.equal(panelFor({ kind: 'hint' }, null, { game: g, content: c }).skin, 'hint');
  assert.equal(panelFor({ kind: 'door', name: '大門' }, null, { game: g, content: c }).skin, 'door');
  assert.equal(panelFor({ kind: 'clue', clue: { id: 'c_x', name: 'n', text: 't' } }, null, { game: g, content: c }).skin, 'c_x');
});

test('手機回覆：每個寄件人、每種回覆都有自己的泡泡、對方回應與結果', () => {
  for (const from of ['軟工第三組', '系學會', '媽媽', 'Moodle', '外送平台', '不認識的人']) {
    for (const c of PHONE_CHOICES) {
      const r = phoneReply(from, c);
      assert.equal(r.out, c);
      assert.ok(r.reply && r.status.includes(c), `${from}/${c}`);
    }
  }
  assert.match(phoneReply('Moodle', '收到').reply, /自動通知/);
});

test('大門按鈕留在面板裡（上鎖時訊息顯示在面板）', () => {
  assert.equal(panelFor({ kind: 'door' }, null, ctx()).buttons[0].stay, true);
});
