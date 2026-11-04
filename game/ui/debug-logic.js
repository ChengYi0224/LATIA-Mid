// 除錯面板的純邏輯（不碰 DOM），方便測試。

/** 網址裡有哪些除錯參數，回傳 [{ key, value }]（只列 TECH.md 第 9 節那幾個）。 */
export const DEBUG_PARAM_KEYS = ['jump', 'death', 'ending', 'unlock', 'clock'];
export function activeDebugParams(params) {
  if (params.get('debug') !== '1') return [];
  return DEBUG_PARAM_KEYS.filter((k) => params.get(k)).map((k) => ({ key: k, value: params.get(k) }));
}

/** 時鐘輸入 → 分鐘數（整數 0~1439）。看不懂就回傳 null。支援 "410" 或 "06:50"。 */
export function parseClockInput(text) {
  const s = String(text ?? '').trim();
  let n;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s);
  if (m) n = Number(m[1]) * 60 + Number(m[2]);
  else if (/^\d+$/.test(s)) n = Number(s);
  else return null;
  return n >= 0 && n < 1440 ? n : null;
}

/** 面板下拉選單的選項：{ id, label }。 */
export function debugOptions(content) {
  return {
    puzzles: content.puzzles.map((p) => ({ id: p.id, label: `${p.id}　${p.title}` })),
    deaths: content.deaths.map((d) => ({ id: d.id, label: `No.${d.no}　${d.title}` })),
    endings: content.endings.map((e) => ({ id: e.id, label: `${e.title}（${e.id}）` })),
  };
}

/** 面板按鈕 → 要送的動作。值不合法回傳 null（不送）。 */
export function buildDebugAction(kind, value, content) {
  switch (kind) {
    case 'jump': return content.puzzleById[value] ? { type: 'DEBUG_JUMP', puzzle: value } : null;
    case 'death': return content.deathById[value] ? { type: 'DEBUG_DEATH', death: value } : null;
    case 'ending': return content.endingById[value] ? { type: 'DEBUG_ENDING', ending: value } : null;
    case 'unlock': return { type: 'DEBUG_UNLOCK_ALL' };
    case 'solve': return { type: 'DEBUG_SOLVE_STAGE' };
    case 'clock': { const n = parseClockInput(value); return n == null ? null : { type: 'DEBUG_CLOCK', clock: n }; }
    default: return null;
  }
}

/** 清存檔只清遊戲自己的存檔（這一局、圖鑑、去過的房間），不碰別的東西，也留著靜音設定。 */
export function isSaveKey(key) {
  return /^latia-mid:(run|codex|visited):/.test(String(key));
}

/** 清完存檔要回去的網址：留在同一頁，只保留 debug=1。 */
export function cleanDebugUrl(href) {
  const u = new URL(href);
  u.search = '?debug=1';
  u.hash = '';
  return u.toString();
}
