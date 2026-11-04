// 開場、死因卡、圖鑑、結局、結算畫面（WP5）。
// 監聽 new_run / death / retry / finale / ending 事件；只讀狀態、只送動作。
// 任何畫面顯示期間：蓋住全畫面、擋掉鍵盤，玩家不能做別的事。
import { iconNode } from './death-icons.js';
import { typeDuration, TYPE_MS } from '../flavor-logic.js';
import { codexCells, deathCardData, deathEventFromState, resultRows, isFreshState, pad2 } from './logic.js';

const DEBUG_KEYS = ['jump', 'death', 'ending', 'unlock', 'clock'];

export function initScreens(ctx, root) {
  const { game, content, bus, send, params } = ctx;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./screens.css', import.meta.url).href;
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const button = (label, fn, cls = '') => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', (e) => { e.stopPropagation(); fn(); });
    return b;
  };

  // ---------- 畫面管理 ----------
  let current = null;          // { name, node, onKey?, onClose? }
  let menu = null;
  const timers = new Set();
  const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };

  function clear() {
    for (const t of timers) clearTimeout(t);
    timers.clear();
    if (current?.node) current.node.remove();
    current = null;
  }
  function show(name, node, extra = {}) {
    clear();
    current = { name, node, ...extra };
    root.append(node);
    drawMenu();
    node.querySelector('.primary')?.focus({ preventScroll: true });
  }
  function close() {
    clear();
    drawMenu();
  }

  // 顯示期間擋掉其他鍵盤輸入（謎題介面的 Esc 之類），只放行該畫面自己要的鍵
  window.addEventListener('keydown', (e) => {
    if (!current) return;
    const onButton = e.target instanceof HTMLButtonElement;
    if (current.onKey?.(e)) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (!(onButton && (e.key === 'Enter' || e.key === ' '))) e.stopImmediatePropagation();
  }, true);

  // ---------- 右上角選單（圖鑑、重新開始） ----------
  function drawMenu() {
    menu?.remove();
    menu = null;
    if (current) return;
    menu = el('div', 'sc-menu');
    const cx = game.codex();
    menu.append(button(`圖鑑 ${cx.found}/${cx.total}`, openCodex));
    let armed = false;
    const restart = button('重新開始', () => {
      if (!armed) { armed = true; restart.textContent = '再按一次確認'; later(() => { armed = false; restart.textContent = '重新開始'; }, 3000); return; }
      send({ type: 'NEW_RUN' });
    });
    menu.append(restart);
    root.append(menu);
  }
  bus.on('_flush', () => { if (!current) drawMenu(); });

  // ---------- 標題 ----------
  function showTitle() {
    const node = el('div', 'sc-overlay');
    const box = el('div', 'sc-title sc-fade');
    box.append(el('h1', '', '天亮前交出去'), el('p', '', '期中週前一晚，你被鎖在系館裡。'));
    const row = el('div', 'row');
    row.append(button('開始', () => send({ type: 'NEW_RUN' }), 'primary'), button('圖鑑', openCodex));
    box.append(row);
    node.append(box);
    show('title', node);
  }

  // ---------- 開場字幕 ----------
  function showOpening(ev) {
    const lines = ev.opening || [];
    const node = el('div', 'sc-overlay sc-opening');
    let i = -1;
    let timer = null;
    const line = el('div', 'line');
    const hint = el('div', 'hint', '點一下繼續');
    const skip = button('跳過', () => toNote());
    skip.className = 'skip';
    node.append(line, hint, skip);

    function toNote() {
      if (current?.node !== node) return;
      clearTimeout(timer);
      const wrap = el('div', 'sc-note-wrap sc-fade');
      const note = el('div', 'sc-note');
      note.append(el('div', '', ev.tutorialNote), el('small', '', '學長留的便利貼'));
      wrap.append(note, button('知道了', close, 'primary'));
      node.className = 'sc-overlay';
      node.replaceChildren(wrap);
      wrap.querySelector('.primary').focus();
      current.onKey = null;
    }
    function next() {
      clearTimeout(timer);
      i += 1;
      if (i >= lines.length) return toNote();
      line.textContent = lines[i];
      line.className = 'line' + (lines[i].includes('我都可以') ? ' hot' : '');
      line.style.animation = 'none';
      void line.offsetWidth;
      line.style.animation = '';
      timer = later(next, 2800);
    }
    // 先演一段群組聊天（阿哲刪了報告），點一下或播完再上字幕
    const chat = content.texts.openingChat;
    let chatting = !!chat?.messages?.length;
    function startCaptions() {
      if (!chatting) return;
      chatting = false;
      clearTimeout(timer);
      node.replaceChildren(line, hint, skip);
      next();
    }
    function playChat() {
      const phone = el('div', 'sc-phone');
      const head = el('div', 'sc-phone-head', chat.title);
      const list = el('div', 'sc-phone-list');
      phone.append(el('div', 'sc-phone-time', '00:47'), head, list);
      node.replaceChildren(phone, hint, skip);
      let k = 0;
      const push = () => {
        if (!chatting || current?.node !== node) return;
        const m = chat.messages[k];
        if (!m) { hint.textContent = '點一下繼續'; return; }
        const row = el('div', 'sc-msg' + (m.me ? ' me' : '') + (m.sys ? ' sys' : ''));
        if (!m.me && !m.sys) row.append(el('div', 'from', m.from));
        if (m.note) row.append(el('div', 'note', m.note));
        row.append(el('div', 'bubble', m.text));
        list.append(row);
        list.scrollTop = list.scrollHeight;
        ctx.sfx?.(m.me ? 'interact' : 'buzz');
        k += 1;
        timer = later(push, m.me ? 900 : 1100);
      };
      hint.textContent = '點一下跳過聊天';
      timer = later(push, 500);
    }
    node.addEventListener('click', () => {
      if (chatting) return startCaptions();
      if (i >= 0 && i < lines.length) next();
    });
    show('opening', node, { onKey: (e) => { if (e.key === 'Enter' || e.key === ' ') { if (chatting) startCaptions(); else next(); return true; } return false; } });
    if (chatting) playChat();
    else next();
  }

  // ---------- 死因卡 ----------
  function showDeath(ev) {
    const data = deathCardData(ev, game.codex());
    const d = data.death;
    const node = el('div', 'sc-overlay sc-death');
    const card = el('div', 'sc-card sc-fade');
    if (data.isNew) card.append(el('div', 'sc-stamp', 'NEW'));

    const no = el('div', 'no');
    no.append(el('span', '', `圖鑑 No.${data.noText} / ${data.total}`), el('span', '', `已收集 ${data.found}`));
    const artBox = el('div', 'art-box');
    artBox.append(iconNode(d.art));
    const big = el('div', 'big', '');
    card.append(no, artBox, el('div', 'ttl', d.title), big);
    const chars = [...d.text];
    let typed = 0;
    const typeTick = () => {
      typed += 1;
      big.textContent = chars.slice(0, typed).join('');
      if (typed < chars.length) later(typeTick, TYPE_MS);
    };
    node.append(el('div', 'sc-flash'));
    if (d.tip) card.append(el('div', 'tip', `下次試試：${d.tip}`));
    if (data.corner) card.append(el('div', 'corner', data.corner));
    const cost = el('div', 'cost');
    cost.append(el('span', '', content.texts.deathTimeCost), el('span', '', `現在 ${data.clock}`));
    if (data.senpai) card.append(el('div', 'sc-senpai', data.senpai));
    card.append(cost, el('div', 'retry', content.texts.deathCardRetry));
    node.append(card);

    // 剛出現的半秒內不吃點擊，避免連點直接跳過
    const bornAt = performance.now();
    let used = false;
    const retry = () => {
      if (used) return;
      if (typed < chars.length) { typed = chars.length - 1; return; } // 還在打字：先把字打完
      if (performance.now() - bornAt < 450) return;
      used = true;
      send({ type: 'RETRY' }); // 天亮的話這裡會直接換成結局畫面
      if (current?.node === node) {
        card.classList.add('sc-leaving');
        later(() => { if (current?.node === node) close(); }, 500);
      }
    };
    node.addEventListener('click', retry);
    show('death', node, { onKey: (e) => { if (e.key === 'Enter' || e.key === ' ') { retry(); return true; } return false; } });
    later(typeTick, 380); // 要在 show() 之後排，show() 會清掉之前排的計時器
  }

  // ---------- 圖鑑 ----------
  function openCodex() {
    const prev = current && current.name === 'title' ? 'title' : null;
    const cells = codexCells(game.codex(), content);
    const found = cells.filter((c) => c.found).length;
    const node = el('div', 'sc-overlay sc-codex');
    const box = el('div', 'sc-codex-box');
    const head = el('div', 'sc-codex-head');
    head.append(el('h2', '', `圖鑑　${found} / ${cells.length}`), button('關閉', () => (prev ? showTitle() : close()), 'primary'));
    const grid = el('div', 'sc-grid');
    const detail = el('div', 'sc-detail', '點一格看詳細。');
    let selBtn = null;
    for (const c of cells) {
      const b = el('button', 'sc-cell ' + (c.found ? 'on' : 'off'));
      b.type = 'button';
      b.append(el('span', 'n', `No.${pad2(c.no)}${c.kind === 'ending' ? '　結局' : ''}`), (() => { const box = el('span', 'cell-art'); box.append(iconNode(c.art, { silhouette: !c.found })); return box; })());
      b.append(el('span', 't' + (c.kind === 'ending' && c.found ? ' end' : ''), c.found ? c.title : '？？？'));
      b.addEventListener('click', () => {
        selBtn?.classList.remove('sel');
        selBtn = b;
        b.classList.add('sel');
        detail.replaceChildren();
        if (c.found) {
          const lines = [`No.${pad2(c.no)}　${c.title}`];
          if (c.kind === 'death') lines.push(`你做了：${c.action}`, c.text, c.tip ? `下次試試：${c.tip}` : '');
          else lines.push(c.text);
          detail.textContent = lines.filter(Boolean).join('\n');
        } else {
          detail.textContent = `No.${pad2(c.no)}　還沒解鎖\n${c.hint}`;
        }
      });
      grid.append(b);
    }
    box.append(head, grid, detail);
    node.append(box);
    show('codex', node, { onKey: (e) => { if (e.key === 'Escape') { prev ? showTitle() : close(); return true; } return false; } });
  }

  // ---------- 結局前的兩顆按鈕 ----------
  function showFinale(text) {
    const f = content.texts.finale;
    const node = el('div', 'sc-overlay sc-finale');
    const row = el('div', 'row');
    row.append(button(f.home, () => send({ type: 'FINALE', choice: 'home' }), 'primary'), button(f.unread, () => send({ type: 'FINALE', choice: 'unread' })));
    // 核心的 finale 事件 text 實際是整包 texts.finale 物件，這裡兩種都吃
    node.append(el('p', 'sc-fade', (typeof text === 'string' ? text : text?.prompt) || f.prompt), row);
    finaleNote = el('p', 'sc-finale-locked');
    finaleNote.style.whiteSpace = 'pre-line';
    node.append(finaleNote);
    show('finale', node);
  }
  let finaleNote = null;
  // 圖鑑還沒到門檻時點未讀：核心不給結局，只回 finale_locked，顯示那句梗與還差幾格
  function showFinaleLocked(ev) {
    if (finaleNote) finaleNote.textContent = `${ev.text}\n${ev.hint}`;
  }

  // ---------- 結局 ----------
  function showEnding(ev) {
    const en = ev.ending;
    const node = el('div', 'sc-overlay sc-ending');
    const wrap = el('div', 'art-wrap');
    if (ev.isNew) wrap.append(el('div', 'sc-stamp', 'NEW'));
    wrap.append(iconNode(en.art));
    const lines = el('div', 'lines');
    en.lines.forEach((t, i) => {
      const p = el('p', '', t);
      p.style.animationDelay = `${0.4 + i * 1.1}s`;
      lines.append(p);
    });
    const after = el('div', 'later');
    after.style.animationDelay = `${0.4 + en.lines.length * 1.1}s`;
    after.append(button('看結算', () => showResults(ev), 'primary'));
    node.append(el('div', 'no', `結局　圖鑑 No.${pad2(en.no)}`), wrap, el('h2', '', en.title), lines, after);
    show('ending', node);
  }

  // ---------- 結算 ----------
  function showResults(ev) {
    const r = ev.results;
    const node = el('div', 'sc-overlay');
    const box = el('div', 'sc-results sc-fade');
    box.append(el('h2', '', '結算'));
    for (const row of resultRows(r, ev.ending.id)) {
      const line = el('div', 'row');
      line.append(el('span', '', row.label), el('b', '', row.value));
      box.append(line);
    }
    for (const t of r.lines) box.append(el('p', 'joke', t));
    const btns = el('div', 'btns');
    btns.append(button('再玩一次', () => send({ type: 'NEW_RUN' }), 'primary'), button('看圖鑑', openCodex));
    box.append(btns);
    node.append(box);
    show('results', node);
  }

  // ---------- 過場（警衛鎖門） ----------
  // 第一次碰筆電時核心會發 cutscene；蓋在謎題上面，按一下回到謎題
  function showCutscene(ev) {
    if (current && current.name !== 'title') return; // 別蓋掉死因卡或結局
    const node = el('div', 'sc-overlay sc-finale');
    for (const t of ev.lines || []) node.append(el('p', 'sc-fade', t));
    const row = el('div', 'row');
    row.append(button('繼續', close, 'primary'));
    node.append(row);
    show('cutscene', node, { onKey: (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') { close(); return true; } return false; } });
  }

  // ---------- 事件 ----------
  bus.on('cutscene', showCutscene);
  // 除錯跳關會換掉整局狀態，蓋著的結局／死因卡要收掉，不然會擋住畫面
  bus.on('debug', (ev) => { if (ev.did === 'jump' && current) close(); });
  bus.on('new_run', showOpening);
  bus.on('death', showDeath);
  bus.on('finale', (ev) => showFinale(ev.text));
  bus.on('finale_locked', showFinaleLocked);
  bus.on('ending', showEnding);

  // ---------- 重新整理後接回目前階段 ----------
  const st = game.getState();
  const hasDebugAction = ctx.debug && DEBUG_KEYS.some((k) => params.get(k));
  if (st.phase === 'dead') {
    const ev = deathEventFromState(st, content, game.clockText());
    if (ev) showDeath(ev);
  } else if (st.phase === 'finale') {
    showFinale();
  } else if (st.phase === 'ending' && content.endingById[st.ending]) {
    const ev = { ending: content.endingById[st.ending], isNew: false, results: game.results() };
    showEnding(ev);
  } else if (!hasDebugAction && isFreshState(st, content.texts.clock.start)) {
    showTitle();
  } else {
    drawMenu();
  }
}
