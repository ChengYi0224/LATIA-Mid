// 氣氛與台詞：主角的自言自語（進房間、開謎題、看線索、死掉重來）、拿到道具的跳字、
// 手機通知與旁白（照時鐘跳出來）、整頁跟著時間變天色。只聽事件、不送動作。
// 台詞都在 content/texts.json 的 flavor。
import { dueChatter, nextLine, skyColor, dawnLevel, TYPE_MS } from './flavor-logic.js';

export function initFlavor(ctx) {
  const { game, content, bus } = ctx;
  const F = content.texts.flavor;
  if (!F) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./flavor.css', import.meta.url).href;
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const sfx = (name) => ctx.sfx?.(name);

  // ---------- 對話框（畫面下方） ----------
  const box = el('div', 'fv-say');
  const who = el('div', 'fv-who');
  const line = el('div', 'fv-line');
  box.append(who, line);
  box.hidden = true;
  document.body.append(box);

  const queue = [];           // { text, speaker }
  let typing = null;          // setInterval id
  let hideTimer = null;
  let full = '';

  const blocked = () => !!document.querySelector('#screen-root .sc-overlay') || game.getState().phase !== 'playing';

  function finishTyping() {
    clearInterval(typing);
    typing = null;
    line.textContent = full;
  }
  function hide() {
    finishTyping();
    clearTimeout(hideTimer);
    box.hidden = true;
  }
  function showNext() {
    const item = queue.shift();
    if (!item) return;
    full = item.text;
    who.textContent = item.speaker ?? '';
    who.hidden = !item.speaker;
    box.classList.toggle('narration', !item.speaker);
    line.textContent = '';
    box.hidden = false;
    const chars = [...full];
    let i = 0;
    clearInterval(typing);
    typing = setInterval(() => {
      i += 1;
      line.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) finishTyping();
    }, TYPE_MS);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { hide(); }, Math.max(2600, chars.length * TYPE_MS + 2200));
  }
  box.addEventListener('click', () => { if (typing) finishTyping(); else hide(); });
  const say = (text, speaker = F.speaker) => { if (text) queue.push({ text, speaker }); };

  // 有空檔就講下一句；死因卡、結局、開場這些畫面蓋著的時候先等
  setInterval(() => {
    if (blocked()) { if (!box.hidden) hide(); return; }
    if (box.hidden && queue.length) showNext();
  }, 200);

  // ---------- 拿到道具 ----------
  const pop = el('div', 'fv-item');
  pop.hidden = true;
  document.body.append(pop);
  let popTimer = null;
  function showItem(id) {
    const name = F.items?.[id] ?? id;
    pop.replaceChildren(el('span', 'fv-item-icon'), el('span', 'fv-item-label', '獲得'), el('b', '', name));
    pop.hidden = false;
    pop.classList.remove('on');
    void pop.offsetWidth;
    pop.classList.add('on');
    clearTimeout(popTimer);
    popTimer = setTimeout(() => { pop.hidden = true; }, 2200);
  }

  // ---------- 手機通知（右上角，HUD 下面） ----------
  const stack = el('div', 'fv-notes');
  document.body.append(stack);
  function notify(c) {
    if (c.narration) { say(c.text, ''); return; }
    const n = el('div', 'fv-note');
    n.append(el('div', 'fv-note-from', c.from), el('div', 'fv-note-text', c.text));
    stack.prepend(n);
    sfx('buzz');
    setTimeout(() => n.classList.add('out'), 5200);
    setTimeout(() => n.remove(), 5800);
    while (stack.children.length > 3) stack.lastChild.remove();
  }

  // ---------- 每局的記錄 ----------
  let seenRooms = new Set();
  let seenIntro = new Set();
  let counts = {};
  let shownChat = new Set();
  let retryN = 0;
  const chatter = F.chatter ?? [];

  function resetRun(markPassed) {
    seenRooms = new Set();
    seenIntro = new Set();
    counts = {};
    retryN = 0;
    shownChat = new Set();
    queue.length = 0;
    hide();
    // 重新整理接著玩時，已經過去的通知不要一次全部跳出來
    if (markPassed) for (const i of dueChatter(chatter, game.getState().clock, new Set())) shownChat.add(i);
  }
  resetRun(true);
  seenRooms.add(game.getState().room);

  // ---------- 天色：整頁背景跟著時間變 ----------
  function paintSky() {
    const clock = game.getState().clock;
    const root = document.documentElement.style;
    root.setProperty('--sky', skyColor(clock));
    root.setProperty('--dawn', String(dawnLevel(clock)));
  }

  // ---------- 事件 ----------
  bus.on('new_run', () => {
    resetRun(false);
    const st = game.getState();
    seenRooms.add(st.room);
    for (const t of F.roomEnter?.[st.room] ?? []) say(t);
  });
  bus.on('moved', (ev) => {
    if (seenRooms.has(ev.room)) return;
    seenRooms.add(ev.room);
    for (const t of F.roomEnter?.[ev.room] ?? []) say(t);
  });
  bus.on('ui_open_puzzle', (ev) => {
    if (seenIntro.has(ev.puzzle)) return;
    seenIntro.add(ev.puzzle);
    say(F.puzzleIntro?.[ev.puzzle]);
  });
  bus.on('ui_interact', (ev) => {
    if (ev.kind !== 'text') return; // 線索、已解開的謎題
    const t = nextLine(F.quips?.[ev.id], ev.id, counts);
    if (t) say(t);
  });
  let lastDeathId = null;
  bus.on('retry', () => {
    if (lastDeathId === 'd_door') return; // 推門那次是真的走出去又走回來，不是「想像」，不接重來的台詞
    const lines = F.retry ?? [];
    if (lines.length && retryN++ % 2 === 0) say(lines[(retryN >> 1) % lines.length]);
  });
  bus.on('item', (ev) => { showItem(ev.item); });
  bus.on('death', (ev) => { lastDeathId = ev.death?.id ?? null; queue.length = 0; hide(); });
  bus.on('ending', () => { queue.length = 0; hide(); });
  bus.on('_flush', () => {
    paintSky();
    const st = game.getState();
    if (st.phase !== 'playing') return; // 死因卡蓋著的時候先不跳，重來後再跳
    for (const i of dueChatter(chatter, st.clock, shownChat)) {
      shownChat.add(i);
      notify(chatter[i]);
    }
  });
  bus.on('debug', (ev) => { if (ev.did === 'jump' || ev.did === 'clock') resetRun(true); });
  paintSky();

  if (ctx.debug) window.__flavor = { say, notify, queue };
}
