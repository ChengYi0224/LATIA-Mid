// HUD 的純邏輯：小地圖顯示哪些房間、任務文字、額度文字、卡關計時。不碰 DOM。

/** 小地圖格位：2 欄 2 列，401 在左上、503 在右上，走廊橫跨整個下排。 */
export const MINIMAP_LAYOUT = {
  r401: { col: 0, row: 0, span: 1 },
  r503: { col: 1, row: 0, span: 1 },
  hall: { col: 0, row: 1, span: 2 },
};
export const MINIMAP_COLS = 2;
export const MINIMAP_ROWS = 2;

/** 去過的房間 id 集合（目前所在一定算）。 */
export function addVisited(visited, roomId) {
  const set = new Set(visited || []);
  if (roomId) set.add(roomId);
  return set;
}

/** 小地圖要畫的房間：只有去過的；標出目前所在與目標房間（目標房間沒去過也要標，才知道往哪走，但只畫小問號格）。 */
export function minimapCells({ visited, current, target, layout = MINIMAP_LAYOUT, names = {} }) {
  const seen = addVisited(visited, current);
  const cells = [];
  for (const [id, pos] of Object.entries(layout)) {
    const isSeen = seen.has(id);
    const isTarget = id === target;
    if (!isSeen && !isTarget) continue;
    cells.push({ id, ...pos, name: isSeen ? (names[id] ?? id) : '？', seen: isSeen, here: id === current, target: isTarget });
  }
  return cells;
}

/** 任務欄文字：永遠有一句。puzzle 是 game.currentPuzzle()，other 是同時開放的另一關（p7／p8）。 */
export function taskText({ puzzle, other, roomName, otherRoomName, phase }) {
  if (phase === 'ending') return '今晚結束了。';
  if (phase === 'finale') return '報告交了。回家，還是點開那則未讀？';
  if (!puzzle) return '出口就在眼前，走出去吧。';
  let text = `${roomName ? `${roomName}：` : ''}${puzzle.title}`;
  if (puzzle.optional) text += '（可跳過）';
  if (other) text += `　或直接去${otherRoomName ? ` ${otherRoomName}：` : ' '}${other.title}`;
  return text;
}

/** 找出「下一個目標」和同時開放的另一關。 */
export function pickTargets(game, content) {
  const puzzle = game.currentPuzzle();
  if (!puzzle) return { puzzle: null, other: null };
  const other = content.puzzles.find((p) => p.id !== puzzle.id && game.puzzleAvailable(p.id) && !p.optional && puzzle.optional) || null;
  return { puzzle, other };
}

/** AI 額度文字。 */
export function quotaText(left, total) {
  return left > 0 ? `剩 ${left}／${total} 次` : '額度用完';
}

/** 卡關計時：同一題連續停留超過 idleMs 就觸發一次；換題或 reset 後重新計。 */
export function createIdleTracker(idleMs) {
  let key = null;
  let since = 0;
  let fired = false;
  return {
    /** 重新開始計時（換題、死亡重來、新局）。key 為 null 代表現在不用計。 */
    reset(newKey, now) { key = newKey; since = now; fired = false; },
    /** 換題才重置，同題不動。 */
    track(newKey, now) { if (newKey !== key) this.reset(newKey, now); },
    /** 該不該自言自語；回傳題目 id 或 null。每個 reset 後最多一次。 */
    check(now) {
      if (key == null || fired || now - since < idleMs) return null;
      fired = true;
      return key;
    },
    get key() { return key; },
  };
}

/** 時鐘跳了多少分鐘（用 HH:MM 字串算），沒變回 0。 */
export function clockDelta(prev, next) {
  const toMin = (s) => { const [h, m] = String(s).split(':').map(Number); return h * 60 + m; };
  if (!prev || !next || prev === next) return 0;
  return toMin(next) - toMin(prev);
}
