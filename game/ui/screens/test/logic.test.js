import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame } from '../../../core/test/helpers.js';
import { readFileSync } from 'node:fs';
import { DEATH_ICONS, DEFAULT_ICON, deathIcon } from '../death-icons.js';
import { artGrid, codexCells, deathCardData, deathEventFromState, resultRows, percent, isFreshState, hash } from '../logic.js';

test('佔位像素圖：同 key 一樣、左右對稱', () => {
  const a = artGrid('death_desk');
  assert.deepEqual(a, artGrid('death_desk'));
  assert.notDeepEqual(a, artGrid('death_tablet'));
  for (const row of a) assert.deepEqual(row, [...row].reverse());
  assert.equal(hash('x'), hash('x'));
});

test('圖鑑格子：44 格、編號連續、已解鎖才有文字', () => {
  const game = newGame({ debug: true });
  let cells = codexCells(game.codex(), content);
  assert.equal(cells.length, 44);
  assert.deepEqual(cells.map((c) => c.no), Array.from({ length: 44 }, (_, i) => i + 1));
  assert.ok(cells.every((c) => !c.found && c.hint && c.art));
  game.dispatch({ type: 'DEBUG_UNLOCK_ALL' });
  cells = codexCells(game.codex(), content);
  assert.ok(cells.every((c) => c.found && c.text));
  assert.equal(cells[0].id, 'd_door');
});

test('死因卡資料與存檔回推一致', () => {
  const game = newGame({ debug: true });
  const [ev] = game.dispatch({ type: 'DEBUG_DEATH', death: 'd_p1_later' });
  const data = deathCardData(ev, game.codex());
  assert.equal(data.noText, String(ev.death.no).padStart(2, '0'));
  assert.equal(data.total, 44);
  assert.ok(data.isNew);
  const back = deathEventFromState(game.getState(), content, game.clockText());
  assert.equal(back.death.id, ev.death.id);
  assert.equal(back.corner, ev.corner);
  assert.equal(back.isNew, false);
});

test('同一關第 3 次死，回推的死因卡也帶學長便利貼', () => {
  const g2 = newGame({ debug: true });
  let ev;
  for (let i = 0; i < 3; i++) { [ev] = g2.dispatch({ type: 'DEBUG_DEATH', death: 'd_p1_later' }); g2.dispatch({ type: 'RETRY' }); }
  assert.ok(ev.senpai);
  assert.equal(deathEventFromState(g2.getState(), content, '00:00').senpai, ev.senpai);
});

test('結算列與收集率', () => {
  const game = newGame({ debug: true });
  const [ev] = game.dispatch({ type: 'DEBUG_ENDING', ending: 'end_true' });
  const rows = resultRows(ev.results, 'end_true');
  assert.equal(rows[0].label, '通關時間');
  assert.equal(resultRows(ev.results, 'end_dawn')[0].label, '結束時間');
  assert.equal(percent(11, 44), 25);
  assert.equal(percent(0, 0), 0);
});

test('剛開始的狀態才算全新', () => {
  const game = newGame({ debug: true });
  assert.ok(isFreshState(game.getState(), content.texts.clock.start));
  game.dispatch({ type: 'DEBUG_DEATH', death: 'd_e_desk' });
  assert.ok(!isFreshState(game.getState(), content.texts.clock.start));
});

test('44 個死法與結局每個都有自己的圖示，不會走到預設圖或隨機像素', () => {
  const read = (n) => JSON.parse(readFileSync(new URL(`../../../../content/${n}`, import.meta.url), 'utf8'));
  const arts = [...read('deaths.json').deaths.map((d) => d.art), ...read('endings.json').endings.map((e) => e.art)];
  assert.equal(arts.length, 44);
  for (const a of arts) {
    assert.ok(Object.hasOwn(DEATH_ICONS, a), `${a} 沒有圖示`);
    assert.notEqual(deathIcon(a), DEFAULT_ICON, `${a} 走到預設圖`);
  }
  const icons = arts.map(deathIcon);
  assert.equal(new Set(icons).size, 44, '有兩個死法共用同一個圖示');
});
