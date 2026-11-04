import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content } from './helpers.js';
import { validateContent } from '../content.js';

test('資料檔通過完整性檢查', () => {
  assert.deepEqual(validateContent(content), []);
});

test('規模：8 關、20 個彩蛋、4 個結局', () => {
  assert.equal(content.puzzles.length, 8);
  assert.equal(content.eggs.length, 20);
  assert.equal(content.endings.length, 4);
  assert.equal(content.deaths.length, 40); // 門其實沒鎖 1 + 主線 19 + 彩蛋 20；加 4 個結局，圖鑑共 44 格
  assert.equal(content.deaths.length + content.endings.length, 44);
});

test('預兆只有 3 個，而且是指定的那 3 個', () => {
  const omens = content.deaths.filter((d) => d.omen).map((d) => d.id).sort();
  assert.deepEqual(omens, ['d_p2_lastyear', 'd_p7_conclusion', 'd_p8_dinner']);
});

test('每個死法都有 id、觸發動作、死因文字', () => {
  for (const d of content.deaths) {
    assert.ok(d.id && d.action && d.text, d.id);
  }
});

test('第 7 關用虛構校名', () => {
  assert.equal(content.moodle.schoolName, '國立夜貓大學');
  assert.match(content.moodle.titleBar.title, /^國立夜貓大學/);
});

test('第 2 關的假公告不寫「今年不延」，避免跟真結局矛盾', () => {
  const d = content.deathById.d_p2_lastyear;
  assert.doesNotMatch(d.text, /不延/);
  assert.match(content.endingById.end_true.lines.join(''), /延期一週/);
});

test('WP10：三個預兆都真的出現在玩家看得到的文字裡', () => {
  const p2 = content.puzzleById.p2.stages.find((s) => s.id === 'drawer');
  assert.match(p2.prompt, /去年/); // 公告日期
  const p7 = content.puzzleById.p7.stages.find((s) => s.id === 'final_submit');
  assert.match(p7.prompt, /字數 4/);
  assert.match(content.texts.tutorialNote, /有空吃個飯/);
});

test('WP10：Moodle 密碼在遊戲裡有線索（和筆電同一組）', () => {
  const login = content.puzzleById.p7.stages.find((s) => s.id === 'login');
  assert.equal(login.answer, content.puzzleById.p1.stages[0].answer);
  assert.match(login.prompt, /同一組/);
});

test('WP10：出門時最早 03:40，finale 文字不說「天亮了」', () => {
  assert.doesNotMatch(content.texts.finale.prompt, /^天亮了/);
});
