// 謎題的專屬版面：每個謎題的每一步都長得像那個東西本身（筆電、銅鎖、電燈開關面板、販賣機、書架、
// 門禁鍵盤、廣播控制台……）。只負責畫面；答案判定、死亡、進度都還是核心在管，這裡只組出要送的 value。
// skin 簽名：fn(stage, body, api) → 可回傳 { ownPrompt: true } 表示自己畫了題目文字。
// api：{ el, button, input, send, pid, submit, redo(), wheelStep, seqPush, seqUndo, seqClear, toggleSwitch, setField, canSubmit, content }
// 每個可操作的元素都設 data-fid（重畫後焦點回得來），選項類另設 data-num（數字鍵 1–9 可選）。

const add = (parent, ...kids) => { for (const k of kids) if (k) parent.append(k); return parent; };

function fid(node, id) { node.dataset.fid = id; return node; }

/** 選項按鈕：點擊送出該選項，數字鍵 n 也可以。 */
function optionBtn(api, o, i, cls = '', label) {
  const b = api.button(label ?? o.label, () => api.send({ type: 'PUZZLE', puzzle: api.pid, value: o.id }), `pz-opt ${cls}`.trim());
  b.dataset.num = String(i + 1);
  fid(b, `opt:${o.id}`);
  b.prepend(Object.assign(api.el('kbd', 'pz-k', String(i + 1)), {}));
  return b;
}

// ---------- 通用的「選擇」場景（每個場景外觀不同） ----------
const SCENES = {
  // Windows 更新視窗
  winupdate(stage, body, api) {
    const w = api.el('div', 'sc sc-win');
    add(w, add(api.el('div', 'sc-bar'), api.el('b', '', 'Windows Update'), api.el('i', '', '— ▢ ✕')),
      api.el('div', 'sc-win-msg', stage.prompt), api.el('div', 'sc-win-sub', '你的電腦需要更新才能繼續使用。'));
    const row = api.el('div', 'sc-win-btns');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, 'sc-winbtn')));
    w.append(row);
    body.append(w);
    return { ownPrompt: true };
  },
  // 檔案總管：每個選項是一個檔案
  files(stage, body, api, title = '檔案') {
    const w = api.el('div', 'sc sc-files');
    add(w, add(api.el('div', 'sc-bar'), api.el('b', '', title), api.el('i', '', '— ▢ ✕')));
    stage.options.forEach((o, i) => {
      const b = optionBtn(api, o, i, 'sc-file');
      add(b, api.el('span', 'sc-file-d', o.desc ?? ''));
      w.append(b);
    });
    body.append(w);
  },
  // 抽屜：桌面上一張紙，下方是抽屜把手式按鈕
  drawer(stage, body, api) {
    const d = api.el('div', 'sc sc-drawer');
    add(d, api.el('div', 'sc-paper', stage.prompt));
    const row = api.el('div', 'sc-handles');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, 'sc-handle')));
    d.append(row);
    body.append(d);
    return { ownPrompt: true };
  },
  // 來電畫面
  call(stage, body, api) {
    const c = api.el('div', 'sc sc-call');
    add(c, api.el('div', 'sc-callname', '媽媽'), api.el('div', 'sc-calltxt', stage.prompt));
    const row = api.el('div', 'sc-callbtns');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, o.id === 'answer' ? 'sc-ans' : 'sc-msg')));
    add(c, row);
    body.append(c);
    return { ownPrompt: true };
  },
  // 沙發
  sofa(stage, body, api) {
    const s = api.el('div', 'sc sc-sofa');
    add(s, api.el('div', 'sc-sofa-pic', '沙發　（枕頭、毯子都在）'), api.el('div', 'sc-calltxt', stage.prompt));
    const row = api.el('div', 'sc-sofa-btns');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, 'sc-sofabtn')));
    add(s, row);
    body.append(s);
    return { ownPrompt: true };
  },
  // 對話：對方一個泡泡，你的回答是右邊的訊息框
  speech(stage, body, api, who = '對方') {
    const c = api.el('div', 'sc sc-talk');
    add(c, api.el('div', 'sc-who', who), api.el('div', 'sc-bubble', stage.prompt));
    const row = api.el('div', 'sc-replies');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, 'sc-reply')));
    add(c, row);
    body.append(c);
    return { ownPrompt: true };
  },
  // 路由器：燈全滅
  router(stage, body, api) {
    const r = api.el('div', 'sc sc-router');
    const leds = api.el('div', 'sc-leds');
    for (const n of ['PWR', 'WAN', 'LAN', 'WiFi']) leds.append(api.el('span', 'sc-led', n));
    add(r, api.el('div', 'sc-calltxt', stage.prompt), add(api.el('div', 'sc-box'), leds));
    const row = api.el('div', 'sc-sofa-btns');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, 'sc-plug')));
    add(r, row);
    body.append(r);
    return { ownPrompt: true };
  },
  // 白板
  board(stage, body, api) {
    const b = api.el('div', 'sc sc-board');
    add(b, api.el('div', 'sc-board-t', stage.prompt));
    const row = api.el('div', 'sc-sofa-btns');
    stage.options.forEach((o, i) => row.append(optionBtn(api, o, i, 'sc-marker')));
    add(b, row);
    body.append(b);
    return { ownPrompt: true };
  },
};

// ---------- 各謎題各步驟 ----------
const SKINS = {
  // p1 筆電密碼鎖
  'p1:0'(stage, body, api) {
    const l = api.el('div', 'sk sk-lap');
    const dots = api.el('div', 'lp-dots');
    const inp = api.el('input', 'lp-pw');
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.maxLength = 12;
    inp.value = api.input.text;
    inp.autocomplete = 'off';
    inp.placeholder = '輸入 4 位數密碼';
    fid(inp, 'pw');
    const paint = () => { dots.textContent = '●'.repeat(api.input.text.length) || '＿＿＿＿'; };
    inp.addEventListener('input', () => { api.input.text = inp.value; paint(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') api.submit(); });
    paint();
    add(l, api.el('div', 'lp-avatar', '你'), api.el('div', 'lp-user', '組長'), inp, dots, api.button('登入 →', api.submit, 'primary lp-go'));
    body.append(l);
    setTimeout(() => inp.focus(), 0);
  },
  'p1:1': (stage, body, api) => SCENES.winupdate(stage, body, api),
  'p1:2': (stage, body, api) => { body.append(api.el('p', 'sc-q', stage.prompt)); SCENES.files(stage, body, api, '找回報告'); return { ownPrompt: true }; },

  // p2 講桌漢字滾輪鎖
  'p2:0'(stage, body, api) {
    const lock = api.el('div', 'sk sk-brass');
    const row = api.el('div', 'br-wheels');
    stage.wheels.forEach((w, i) => {
      const col = api.el('div', 'br-col');
      const up = api.button('▲', () => { api.wheelStep(stage, api.input, i, -1); api.redo(); }, 'br-step');
      const dn = api.button('▼', () => { api.wheelStep(stage, api.input, i, 1); api.redo(); }, 'br-step');
      fid(up, `up${i}`); fid(dn, `dn${i}`);
      add(col, up, api.el('div', 'br-glyph', w[api.input.pos[i]]), dn);
      row.append(col);
    });
    const word = stage.wheels.map((w, i) => w[api.input.pos[i]]).join('');
    add(lock, api.el('div', 'br-title', '講桌抽屜鎖'), row, api.el('div', 'br-now', `目前對齊：${word}`), api.button('試著拉開抽屜', api.submit, 'primary br-pull'));
    body.append(lock);
  },
  'p2:1': (stage, body, api) => SCENES.drawer(stage, body, api),

  // p3 走廊電燈開關
  'p3:0'(stage, body, api) {
    const panel = api.el('div', 'sk sk-sw');
    const sw = api.el('div', 'sw-row');
    const lamps = api.el('div', 'sw-lamps');
    for (const id of stage.switches) {
      const on = api.input.on.includes(id);
      const b = api.button('', () => {
        api.toggleSwitch(api.input, id);
        const now = api.input.on.includes(id);
        const lit = stage.switches.filter((s) => api.input.on.includes(s));
        api.input.msg = `${id} 號開關${now ? '往上撥：開' : '往下撥：關'}。${lit.length ? `現在亮著第 ${lit.join('、')} 段` : '走廊全暗了'}。`;
        api.redo();
      }, `sw-toggle${on ? ' on' : ''}`);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${id} 號開關，${on ? '開' : '關'}`);
      fid(b, `sw${id}`);
      add(b, api.el('i', 'sw-knob'));
      const cell = api.el('div', 'sw-cell');
      add(cell, api.el('span', 'sw-onl', '開'), b, api.el('span', 'sw-num', id), api.el('span', 'sw-onl', '關'));
      sw.append(cell);
      lamps.append(api.el('span', `sw-lamp${on ? ' on' : ''}`, id));
    }
    add(panel, sw, api.el('div', 'sw-cap', '走廊燈（亮的段落）'), lamps, api.el('div', 'sw-msg', api.input.msg || '撥一下開關，看下面哪一段會亮。'), api.button('確認這樣就好', api.submit, 'primary'));
    body.append(panel);
  },
  'p3:1': (stage, body, api) => SCENES.call(stage, body, api),

  // p4 販賣機
  'p4:0'(stage, body, api) {
    const m = api.el('div', 'sk sk-vend');
    const win = api.el('div', 'vd-window');
    const labelOf = (id) => stage.buttons.find((b) => b.id === id)?.label ?? id;
    for (const b of stage.buttons) win.append(api.el('div', `vd-can vd-${b.id}`, b.label));
    const lcd = api.el('div', 'vd-lcd', api.input.picked.length ? api.input.picked.map(labelOf).join(' → ') : '請選擇');
    const pad = api.el('div', 'vd-pad');
    stage.buttons.forEach((b, i) => {
      const btn = api.button(b.label, () => {
        api.seqPush(api.input, b.id);
        api.input.msg = `按了「${b.label}」，已按 ${api.input.picked.length} 下。`;
        api.redo();
      }, `vd-btn vd-${b.id}`);
      fid(btn, `vb:${b.id}`);
      btn.prepend(api.el('kbd', 'pz-k', String(i + 1)));
      btn.dataset.num = String(i + 1);
      pad.append(btn);
    });
    const ctl = api.el('div', 'vd-ctl');
    add(ctl, api.button('退一步', () => { api.seqUndo(api.input); api.input.msg = '退掉最後一下。'; api.redo(); }, '', !api.input.picked.length),
      api.button('清除', () => { api.seqClear(api.input); api.input.msg = '清掉了，重按。'; api.redo(); }, '', !api.input.picked.length),
      api.button('取出', api.submit, 'primary', !api.canSubmit(stage, api.input)));
    add(m, win, lcd, pad, api.el('div', 'vd-msg', api.input.msg || '照順序按按鈕，按完按「取出」。'), ctl);
    body.append(m);
  },
  'p4:1': (stage, body, api) => SCENES.sofa(stage, body, api),

  // p5 書架
  'p5:0'(stage, body, api) {
    const s = api.el('div', 'sk sk-shelf');
    const row = api.el('div', 'sf-books');
    stage.buttons.forEach((b, i) => {
      const orders = api.input.picked.map((id, k) => (id === b.id ? k + 1 : 0)).filter(Boolean);
      const book = api.button('', () => {
        api.seqPush(api.input, b.id);
        api.input.msg = `抽出《${b.label}》，這是第 ${api.input.picked.length} 本。`;
        api.redo();
      }, `sf-book bk${i}${orders.length ? ' out' : ''}`);
      fid(book, `bk:${b.id}`);
      book.dataset.num = String(i + 1);
      add(book, api.el('kbd', 'pz-k', String(i + 1)), api.el('span', 'sf-title', b.label), orders.length ? api.el('em', 'sf-order', orders.join(',')) : null);
      row.append(book);
    });
    const ctl = api.el('div', 'vd-ctl');
    add(ctl, api.button('退一步', () => { api.seqUndo(api.input); api.input.msg = '把最後那本放回去。'; api.redo(); }, '', !api.input.picked.length),
      api.button('清除', () => { api.seqClear(api.input); api.input.msg = '全部放回去了。'; api.redo(); }, '', !api.input.picked.length),
      api.button('抽完了', api.submit, 'primary', !api.canSubmit(stage, api.input)));
    add(s, row, api.el('div', 'vd-msg', api.input.msg || '照順序一本一本抽，抽出來的書會凸出來並標上順序。'), ctl);
    body.append(s);
  },
  'p5:1': (stage, body, api) => SCENES.speech(stage, body, api, '阿哲（剛醒）'),
  'p5:2': (stage, body, api) => { body.append(api.el('p', 'sc-q', stage.prompt)); SCENES.files(stage, body, api, '桌面　3 個檔案'); return { ownPrompt: true }; },

  // p6 門禁鍵盤
  'p6:0'(stage, body, api) {
    const k = api.el('div', 'sk sk-keypad');
    const inp = api.el('input', 'kp-lcd');
    inp.type = 'text';
    inp.inputMode = 'numeric';
    inp.maxLength = 8;
    inp.value = api.input.text;
    inp.placeholder = '＿＿＿＿';
    inp.autocomplete = 'off';
    fid(inp, 'lcd');
    inp.addEventListener('input', () => { api.input.text = inp.value.replace(/\D/g, ''); inp.value = api.input.text; });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') api.submit(); });
    const grid = api.el('div', 'kp-grid');
    const press = (d) => { api.input.text = (api.input.text + d).slice(0, 8); inp.value = api.input.text; inp.focus(); };
    for (const d of ['1', '2', '3', '4', '5', '6', '7', '8', '9']) grid.append(fid(api.button(d, () => press(d), 'kp-key'), `k${d}`));
    grid.append(
      fid(api.button('清除', () => { api.input.text = ''; inp.value = ''; inp.focus(); }, 'kp-key kp-c'), 'kc'),
      fid(api.button('0', () => press('0'), 'kp-key'), 'k0'),
      fid(api.button('確認', api.submit, 'kp-key kp-ok'), 'kok'),
    );
    add(k, api.el('div', 'kp-head', '系辦門禁'), inp, grid);
    body.append(k);
    setTimeout(() => inp.focus(), 0);
  },
  'p6:1': (stage, body, api) => SCENES.router(stage, body, api),
  'p6:2': (stage, body, api) => SCENES.board(stage, body, api),

  // p8 廣播控制台
  'p8:0'(stage, body, api) {
    const root = api.el('div', 'sk sk-bc');
    const labelOf = (f, id) => f.options.find((o) => o.id === id)?.label;
    const status = api.el('div', 'bc-status');
    const missing = stage.fields.filter((f) => !api.input.values[f.id]);
    for (const f of stage.fields) {
      const v = labelOf(f, api.input.values[f.id]);
      add(status, add(api.el('div', `bc-stat${v ? ' set' : ''}`), api.el('small', '', f.label), api.el('b', '', v ?? '—')));
    }
    const monitor = api.el('div', 'bc-mon', '1F 警衛室　伯伯睡得很熟　Zzz');
    const panel = api.el('div', 'bc-panels');
    for (const f of stage.fields) {
      const sec = api.el('div', `bc-sec bc-${f.id}`);
      sec.append(api.el('div', 'bc-cap', f.label));
      const opts = api.el('div', 'bc-opts');
      f.options.forEach((o) => {
        const sel = api.input.values[f.id] === o.id;
        const b = api.button(o.label, () => {
          api.setField(api.input, f.id, o.id);
          api.input.msg = `${f.label}設成「${o.label}」。`;
          api.redo();
        }, `bc-opt${sel ? ' sel' : ''}`);
        b.setAttribute('aria-pressed', String(sel));
        fid(b, `${f.id}:${o.id}`);
        opts.append(b);
      });
      sec.append(opts);
      panel.append(sec);
    }
    const ready = !missing.length;
    const go = api.button(ready ? '廣播！' : `還有 ${missing.length} 項沒設定`, api.submit, `bc-go${ready ? ' ready' : ''}`, !ready);
    fid(go, 'go');
    add(root, add(api.el('div', 'bc-head'), api.el('b', '', '樓層廣播控制台'), api.el('span', `bc-lamp${ready ? ' on' : ''}`, ready ? 'READY' : 'SETUP')), monitor, status, panel,
      api.el('div', 'vd-msg', api.input.msg || '設好頻道、音效、音量，再按「廣播」。'), go);
    body.append(root);
  },
  'p8:1': (stage, body, api) => SCENES.speech(stage, body, api, '學長'),
};

/** 這一步有沒有專屬版面；沒有就用原本的通用元件。 */
export function skinFor(pid, stageIndex) { return SKINS[`${pid}:${stageIndex}`] ?? null; }
export const skinKeys = () => Object.keys(SKINS);
