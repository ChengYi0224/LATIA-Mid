import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame } from '../../../core/test/helpers.js';
import { initInput, wheelStep, seqPush, toggleSwitch, setField, canSubmit, toValue } from '../logic.js';

// 依資料的正解，用介面邏輯一步步「操作」出 input
function operate(stage) {
  const input = initInput(stage);
  switch (stage.type) {
    case 'code': input.text = ` ${stage.answer} `; break;
    case 'wheel':
      stage.answer.forEach((ch, i) => { while (stage.wheels[i][input.pos[i]] !== ch) wheelStep(stage, input, i, 1); });
      break;
    case 'sequence': stage.answer.forEach((id) => seqPush(input, id)); break;
    case 'toggles': stage.answer.forEach((id) => toggleSwitch(input, id)); break;
    case 'select': for (const [k, v] of Object.entries(stage.answer)) setField(input, k, v); break;
  }
  return input;
}

test('每個非 choice 的步驟，用介面邏輯操作出的 value 都能解開', () => {
  const g = newGame({ debug: true });
  for (const p of content.puzzles) {
    g.dispatch({ type: 'DEBUG_JUMP', puzzle: p.id });
    while (!g.isSolved(p.id)) {
      const stage = g.currentStage(p.id);
      let value;
      if (stage.type === 'choice') value = stage.options.find((o) => o.outcome === 'next').id;
      else {
        const input = operate(stage);
        assert.ok(canSubmit(stage, input), `${p.id}.${stage.id} 應可送出`);
        value = toValue(stage, input);
      }
      const ev = g.dispatch({ type: 'PUZZLE', puzzle: p.id, value });
      assert.ok(!ev.some((e) => ['error', 'wrong', 'death'].includes(e.type)), `${p.id}.${stage.id}：${JSON.stringify(ev)}`);
    }
  }
});

test('滾輪可往兩個方向循環', () => {
  const stage = { type: 'wheel', wheels: [['a', 'b', 'c']] };
  const input = initInput(stage);
  wheelStep(stage, input, 0, -1);
  assert.deepEqual(toValue(stage, input), ['c']);
  wheelStep(stage, input, 0, 1);
  assert.deepEqual(toValue(stage, input), ['a']);
});

test('toggles 開了再按就關；select 沒填滿不能送；有 checks 的 code 送物件', () => {
  const t = initInput({ type: 'toggles' });
  toggleSwitch(t, '2'); toggleSwitch(t, '3'); toggleSwitch(t, '2');
  assert.deepEqual(t.on, ['3']);
  const sel = { type: 'select', fields: [{ id: 'a' }, { id: 'b' }] };
  const si = initInput(sel);
  setField(si, 'a', 'x');
  assert.equal(canSubmit(sel, si), false);
  setField(si, 'b', 'y');
  assert.equal(canSubmit(sel, si), true);
  const code = { type: 'code', checks: [{ id: 'remember' }] };
  const ci = initInput(code);
  ci.text = '12'; ci.checks.remember = true;
  assert.deepEqual(toValue(code, ci), { answer: '12', checks: { remember: true } });
});
