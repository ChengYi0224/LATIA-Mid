// 畫面用的純函式（不碰 DOM），方便測試。

/** 字串轉成 32 位元雜湊，當作佔位美術的種子。 */
export function hash(str) {
  let h = 2166136261;
  for (const ch of String(str)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 小型亂數產生器，同一個種子永遠同一串。 */
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** 16×16 左右對稱的像素圖樣，值 0 = 底、1 = 前景、2 = 亮點。 */
export function artGrid(key, size = 16) {
  const r = rng(hash(key));
  const half = size / 2;
  const grid = [];
  for (let y = 0; y < size; y++) {
    const row = new Array(size).fill(0);
    for (let x = 0; x < half; x++) {
      // 中間密、邊緣疏，看起來像個小東西
      const edge = Math.abs(x - half) / half;
      const v = r() < 0.62 - edge * 0.15 && y > 1 && y < size - 2 ? (r() < 0.2 ? 2 : 1) : 0;
      row[x] = v;
      row[size - 1 - x] = v;
    }
    grid.push(row);
  }
  return grid;
}

/** 沒有素材時，用 key 算一個固定的色相。 */
export function placeholderColor(key, light = 45) {
  return `hsl(${hash(key) % 360} 45% ${light}%)`;
}

export const pad2 = (n) => String(n).padStart(2, '0');

/** 圖鑑格子：把 codex() 的項目補上美術 key、提示與動作說明。 */
export function codexCells(codex, content) {
  const roomName = (id) => content.rooms.byId[id]?.name ?? id;
  return codex.entries.map((e) => {
    if (e.kind === 'death') {
      const d = content.deathById[e.id];
      const p = content.puzzleById[d.origin];
      const where = p ? `第 ${p.order} 關「${p.title}」` : `${roomName(d.origin)}`;
      return { ...e, no: e.no, art: d.art, action: d.action, tip: d.tip, hint: `出沒地點：${where}` };
    }
    const en = content.endingById[e.id];
    return { ...e, art: en.art, action: '', tip: '', hint: '尚未走到的結局' };
  });
}

/** 收集率百分比（整數）。 */
export function percent(found, total) {
  return total ? Math.round((found / total) * 100) : 0;
}

/**
 * 死因卡資料。events 的 death 事件有 corner／senpai；重新整理後從存檔回推。
 * @param {{death, isNew, clock, corner, senpai}} ev
 */
export function deathCardData(ev, codex) {
  const no = ev.death.no;
  return {
    death: ev.death,
    isNew: !!ev.isNew,
    no,
    noText: pad2(no),
    found: codex.found,
    total: codex.total,
    clock: ev.clock,
    corner: ev.corner,
    senpai: ev.senpai || null,
  };
}

/** 從存檔狀態回推死因卡的事件（重新整理頁面時用）。 */
export function deathEventFromState(state, content, clockText) {
  const d = content.deathById[state.lastDeath];
  if (!d) return null;
  const corners = content.texts.deathCardCorner;
  const ev = { type: 'death', death: d, isNew: false, clock: clockText, corner: corners[Math.max(0, state.deaths - 1) % corners.length] };
  const n = state.puzzles[d.origin]?.deaths ?? 0;
  const every = content.hints.senpaiAfterDeaths;
  if (n > 0 && n % every === 0) ev.senpai = `${content.hints.puzzles[d.origin].senpai}${content.hints.senpaiSignature}`;
  return ev;
}

/** 結算畫面各列。 */
export function resultRows(results, endingId) {
  const timeLabel = endingId === 'end_dawn' ? '結束時間' : '通關時間';
  return [
    { label: timeLabel, value: results.clock },
    { label: '死亡次數', value: `${results.deaths} 次` },
    { label: '圖鑑收集率', value: `${results.codexFound} / ${results.codexTotal}（${percent(results.codexFound, results.codexTotal)}%）` },
  ];
}

/** 開局時還沒碰過任何東西（沒有進度可以繼續）。 */
export function isFreshState(state, startClock) {
  return state.phase === 'playing' && state.clock === startClock && state.deaths === 0 && !state.doorLocked &&
    state.items.length === 0 && Object.values(state.puzzles).every((p) => !p.solved && p.stage === 0);
}
