// 謎題介面的純邏輯（不碰 DOM，方便測試）：每種 stage type 的輸入狀態與送出的 value。

/** 這一步剛開始時的輸入狀態。 */
export function initInput(stage) {
  switch (stage.type) {
    case 'code': return { text: '', checks: {} };
    case 'wheel': return { pos: stage.wheels.map(() => 0) };
    case 'sequence': return { picked: [] };
    case 'toggles': return { on: [] };
    case 'select': return { values: {} };
    default: return {};
  }
}

/** 滾輪 i 往前或往後轉一格（循環）。 */
export function wheelStep(stage, input, i, dir) {
  const n = stage.wheels[i].length;
  input.pos[i] = (input.pos[i] + dir + n) % n;
}

export function seqPush(input, id) { input.picked.push(id); }
export function seqUndo(input) { input.picked.pop(); }
export function seqClear(input) { input.picked.length = 0; }

export function toggleSwitch(input, id) {
  const i = input.on.indexOf(id);
  if (i >= 0) input.on.splice(i, 1);
  else input.on.push(id);
}

export function setField(input, fieldId, optionId) {
  if (optionId) input.values[fieldId] = optionId;
  else delete input.values[fieldId];
}

/** 能不能送出（code 要有字、sequence 要有按、select 每欄都選了）。 */
export function canSubmit(stage, input) {
  switch (stage.type) {
    case 'code': return input.text.trim() !== '';
    case 'sequence': return input.picked.length > 0;
    case 'select': return stage.fields.every((f) => input.values[f.id]);
    default: return true;
  }
}

/** 轉成送給核心的 PUZZLE value。choice 不走這裡，直接送選項 id。 */
export function toValue(stage, input) {
  switch (stage.type) {
    case 'code':
      return stage.checks?.length ? { answer: input.text.trim(), checks: { ...input.checks } } : input.text.trim();
    case 'wheel': return stage.wheels.map((w, i) => w[input.pos[i]]);
    case 'sequence': return [...input.picked];
    case 'toggles': return [...input.on];
    case 'select': return { ...input.values };
    default: return undefined;
  }
}
