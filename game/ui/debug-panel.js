// 除錯面板（WP8），只在 ?debug=1 時載入（main.js 動態 import）。
// 按鈕送的都是核心的 DEBUG_* 動作；沒開 debug 時核心本來就會拒絕，這裡也直接不建立面板。
import { isDebug } from '../core/index.js';
import { activeDebugParams, debugOptions, buildDebugAction, isSaveKey, cleanDebugUrl } from './debug-logic.js';

export function initDebugPanel(ctx, root) {
  const { game, content, bus, send, params } = ctx;
  if (!ctx.debug || !isDebug(params) || !root) return null; // 沒開 debug 一律不出現

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./debug-panel.css', import.meta.url).href;
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const btn = (label, fn, cls = '') => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.addEventListener('click', fn);
    return b;
  };
  const row = (...kids) => { const r = el('div', 'dbg-row'); r.append(...kids); return r; };
  const select = (opts) => {
    const s = el('select');
    for (const o of opts) s.append(new Option(o.label, o.id));
    return s;
  };

  const box = el('details', 'dbg');
  box.open = true;
  box.append(el('summary', '', '除錯面板'));
  const status = el('div', 'dbg-status');
  const log = el('div', 'dbg-log');
  const opts = debugOptions(content);

  // 送動作，回報核心的 debug／error 事件
  const run = (kind, value) => {
    const action = buildDebugAction(kind, value, content);
    if (!action) { log.textContent = `${kind}：值不合法，沒送`; return; }
    const evs = send(action);
    const note = evs.filter((e) => e.type === 'debug' || e.type === 'error').map((e) => (e.type === 'error' ? `錯誤 ${e.reason}` : `ok ${e.did}`));
    log.textContent = `${action.type}${note.length ? '　' + note.join('、') : ''}`;
  };

  const jump = select(opts.puzzles);
  const death = select(opts.deaths);
  const ending = select(opts.endings);
  const clock = el('input');
  clock.type = 'text';
  clock.value = '410';
  clock.size = 6;
  clock.title = '分鐘數（410）或 06:50';

  box.append(
    status,
    row(el('label', '', '跳關'), jump, btn('跳', () => run('jump', jump.value))),
    row(btn('解這一步', () => run('solve'))),
    row(el('label', '', '死法'), death, btn('觸發', () => run('death', death.value))),
    row(el('label', '', '結局'), ending, btn('看', () => run('ending', ending.value))),
    row(btn('解鎖全圖鑑', () => run('unlock'))),
    row(el('label', '', '時鐘'), clock, btn('設定', () => run('clock', clock.value)), btn('06:50', () => { clock.value = '410'; run('clock', '410'); })),
    row(btn('清存檔', () => {
      try {
        for (const k of Object.keys(localStorage)) if (isSaveKey(k)) localStorage.removeItem(k);
      } catch { /* 拿不到 localStorage 就只重新整理 */ }
      location.assign(cleanDebugUrl(location.href));
    }, 'danger')),
  );
  const active = activeDebugParams(params);
  if (active.length) box.append(el('div', 'dbg-params', '網址參數：' + active.map((p) => `${p.key}=${p.value}`).join('　')));
  box.append(log);
  root.append(box);

  const refresh = () => {
    const st = game.getState();
    status.textContent = `${game.clockText()}　${st.phase}　${st.room}　${game.currentPuzzle()?.id ?? '-'}`;
  };
  bus.on('_flush', refresh);
  refresh();
  return box;
}
