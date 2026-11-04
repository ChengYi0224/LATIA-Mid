// 6 種 stage type 的通用謎題介面（WP3），p7 的 Moodle 皮在 moodle.js（WP4）。
// 監聽 ui_open_puzzle 打開；送 PUZZLE 動作給核心，依 wrong／stage／solved／death 事件更新。
import { createMoodle } from './moodle.js';
import { skinFor } from './skins.js';
import { initInput, wheelStep, seqPush, seqUndo, seqClear, toggleSwitch, setField, canSubmit, toValue } from './logic.js';

const CLOSE_ON = ['death', 'new_run', 'ending', 'finale'];

export function initPuzzles(ctx, root) {
  const { game, content, bus, send } = ctx;

  // 樣式放在自己的資料夾，由這裡載入（不用動 index.html）
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./puzzles.css', import.meta.url).href;
  document.head.append(link);
  const mlink = document.createElement('link');   // p7 的假 Moodle 皮（WP4）
  mlink.rel = 'stylesheet';
  mlink.href = new URL('./moodle.css', import.meta.url).href;
  document.head.append(mlink);
  const slink = document.createElement('link');   // 每個謎題的專屬版面（skins.js）
  slink.rel = 'stylesheet';
  slink.href = new URL('./skins.css', import.meta.url).href;
  document.head.append(slink);

  let pid = null;          // 目前打開的謎題
  let stageKey = '';       // 用來判斷步驟換了就重設輸入
  let input = null;
  let note = null;         // { text, cls }
  let done = false;        // 這關剛解完，顯示完成畫面
  let shake = false;
  let dirty = true;

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const button = (label, fn, cls = '', disabled = false) => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };
  const close = () => { pid = null; note = null; done = false; dirty = true; };

  bus.on('ui_open_puzzle', (ev) => {
    if (!game.puzzleAvailable(ev.puzzle)) return;
    pid = ev.puzzle; note = null; done = false; stageKey = ''; dirty = true;
  });
  bus.on('wrong', (ev) => { if (ev.puzzle === pid) { note = { text: ev.message || '不對。', cls: 'bad' }; shake = true; dirty = true; } });
  bus.on('stage_cleared', (ev) => { if (ev.puzzle === pid) { note = ev.message ? { text: ev.message, cls: 'ok' } : null; dirty = true; } });
  bus.on('message', (ev) => { if (pid) { note = { text: ev.text, cls: 'ok' }; dirty = true; } });
  bus.on('stage', (ev) => { if (ev.puzzle === pid) dirty = true; });
  bus.on('solved', (ev) => { if (ev.puzzle === pid) { done = true; dirty = true; } });
  // 一秒重來：死在謎題裡的話，按「再來一次」後直接把同一關打開在死掉的那一步（要在 close 之前記下來）
  let reopen = null;
  bus.on('death', (ev) => { reopen = pid && ev.death?.origin === pid ? pid : null; });
  bus.on('new_run', () => { reopen = null; });
  bus.on('retry', () => {
    const id = reopen;
    reopen = null;
    if (id && game.getState().phase === 'playing' && game.puzzleAvailable(id)) {
      pid = id; note = null; done = false; stageKey = ''; dirty = true;
    }
  });
  for (const t of CLOSE_ON) bus.on(t, close);
  bus.on('_flush', render);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pid) { close(); render(); return; }
    // 數字鍵 1–9 選第幾個選項（輸入框裡打字時不搶）
    if (pid && /^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return;
      const b = root.querySelector(`[data-num="${e.key}"]`);
      if (b && !b.disabled) { e.preventDefault(); b.click(); }
    }
  });

  const submit = () => {
    const stage = game.currentStage(pid);
    send({ type: 'PUZZLE', puzzle: pid, value: toValue(stage, input) });
  };

  // ---------- 各 stage type 的內容 ----------
  const bodies = {
    code(stage, body) {
      const inp = el('input', 'pz-code');
      inp.type = 'text';
      inp.value = input.text;
      inp.autocomplete = 'off';
      inp.placeholder = '輸入答案';
      inp.addEventListener('input', () => { input.text = inp.value; });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      body.append(inp);
      for (const c of stage.checks || []) {
        const label = el('label', 'pz-check');
        const cb = el('input');
        cb.type = 'checkbox';
        cb.checked = !!input.checks[c.id];
        cb.addEventListener('change', () => { input.checks[c.id] = cb.checked; });
        label.append(cb, ` ${c.label}`);
        body.append(label);
      }
      body.append(button('送出', submit, 'primary'));
      setTimeout(() => inp.focus(), 0);
    },
    wheel(stage, body) {
      const row = el('div', 'pz-wheels');
      stage.wheels.forEach((w, i) => {
        const col = el('div', 'pz-wheel');
        col.append(
          button('▲', () => { wheelStep(stage, input, i, -1); dirty = true; render(); }, 'pz-step'),
          el('div', 'pz-glyph', w[input.pos[i]]),
          button('▼', () => { wheelStep(stage, input, i, 1); dirty = true; render(); }, 'pz-step'),
        );
        row.append(col);
      });
      body.append(row, button('試試看', submit, 'primary'));
    },
    sequence(stage, body) {
      const labelOf = (id) => stage.buttons.find((b) => b.id === id)?.label ?? id;
      const grid = el('div', 'pz-grid');
      for (const b of stage.buttons) grid.append(button(b.label, () => { seqPush(input, b.id); dirty = true; render(); }));
      body.append(grid);
      body.append(el('div', 'pz-picked', input.picked.length ? `已按：${input.picked.map(labelOf).join(' → ')}` : '還沒按任何一顆'));
      const row = el('div', 'pz-row');
      row.append(
        button('退一步', () => { seqUndo(input); dirty = true; render(); }, '', !input.picked.length),
        button('清除', () => { seqClear(input); dirty = true; render(); }, '', !input.picked.length),
        button('送出', submit, 'primary', !canSubmit(stage, input)),
      );
      body.append(row);
    },
    toggles(stage, body) {
      const row = el('div', 'pz-switches');
      for (const id of stage.switches) {
        const on = input.on.includes(id);
        row.append(button(`${id}　${on ? '開' : '關'}`, () => { toggleSwitch(input, id); dirty = true; render(); }, 'pz-switch' + (on ? ' on' : '')));
      }
      body.append(row, button('確認', submit, 'primary'));
    },
    select(stage, body) {
      for (const f of stage.fields) {
        const label = el('label', 'pz-field', `${f.label}　`);
        const sel = el('select');
        sel.append(new Option('請選擇', ''));
        for (const o of f.options) sel.append(new Option(o.label, o.id));
        sel.value = input.values[f.id] || '';
        sel.addEventListener('change', () => { setField(input, f.id, sel.value); dirty = true; render(); });
        label.append(sel);
        body.append(label);
      }
      body.append(button('送出', submit, 'primary', !canSubmit(stage, input)));
    },
    choice(stage, body) {
      const list = el('div', 'pz-options');
      for (const o of stage.options) {
        const b = button(o.label, () => send({ type: 'PUZZLE', puzzle: pid, value: o.id }), 'pz-option');
        if (o.desc) b.append(el('span', 'pz-desc', o.desc));
        list.append(b);
      }
      body.append(list);
    },
  };

  const moodle = createMoodle({ content, send, pid: 'p7', close: () => { close(); render(); }, refresh: () => { dirty = true; render(); } });

  function render() {
    if (!dirty) return;
    dirty = false;
    const keepFocus = root.contains(document.activeElement) ? document.activeElement?.dataset?.fid : null;
    root.innerHTML = '';
    if (!pid) return;
    if (pid === 'p7' && !done) {   // p7 換成假 Moodle 皮
      const overlay = el('div', 'pz-overlay');
      overlay.append(moodle.render(game.currentStage(pid), note, shake));
      shake = false;
      root.append(overlay);
      return;
    }
    const p = content.puzzleById[pid];
    const card = el('div', 'pz-card' + (shake ? ' shake' : ''));
    shake = false;
    const head = el('div', 'pz-head');
    head.append(el('strong', '', p.title), button('✕', () => { close(); render(); }, 'pz-close'));
    card.append(head);

    if (done) {
      card.append(el('p', 'pz-prompt', '這關解開了。'));
      if (note) card.append(el('div', 'pz-note ' + note.cls, note.text));
      card.append(button('好', () => { close(); render(); }, 'primary'));
    } else {
      const stage = game.currentStage(pid);
      const idx = p.stages.findIndex((s) => s.id === stage.id);
      const key = `${pid}:${stage.id}`;
      if (key !== stageKey) { stageKey = key; input = initInput(stage); }
      head.append(el('span', 'pz-step-no', `第 ${idx + 1} / ${p.stages.length} 步`));
      const body = el('div', 'pz-body pzt-' + stage.type);
      const skin = skinFor(pid, idx);
      let own = false;
      if (skin) {
        card.classList.add('pz-skin', `pz-skin-${pid}`);
        const api = {
          el, button, input, send, pid, submit, content, redo: () => { dirty = true; render(); },
          wheelStep, seqPush, seqUndo, seqClear, toggleSwitch, setField, canSubmit,
        };
        own = !!skin(stage, body, api)?.ownPrompt;
      } else (bodies[stage.type] || bodies.choice)(stage, body);
      if (!own) card.append(el('p', 'pz-prompt', stage.prompt));
      card.append(body);
      if (note) card.append(el('div', 'pz-note ' + note.cls, note.text));
    }
    const overlay = el('div', 'pz-overlay');
    overlay.append(card);
    root.append(overlay);
    if (keepFocus) root.querySelector(`[data-fid="${keepFocus.replace(/"/g, '\\"')}"]`)?.focus({ preventScroll: true });
  }
}
