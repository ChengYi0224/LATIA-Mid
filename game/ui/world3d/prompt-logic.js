// 準星對著東西時的提示文字與狀態（純函式，不碰 DOM，可以用 node:test 測）。
// res 是 resolveObject 的結果；ctx：{ solved(puzzleId), available(puzzleId), seen: Set 物件 id, id: 物件 id }。
// 回傳 { text, state }，state：can（可以互動）、locked（還不能解）、done（已解開）。

export function promptFor(res, ctx = {}) {
  const seen = !!ctx.seen?.has(ctx.id);
  const name = res?.name ?? ctx.id ?? '';
  switch (res?.kind) {
    case 'puzzle': {
      const id = res.puzzle.id;
      if (ctx.solved?.(id)) return { text: `✓ 已解開：${name}`, state: 'done' };
      if (ctx.available?.(id)) return { text: `[E] 解謎：${name}`, state: 'can' };
      return { text: `[E] 查看：${name}（還不能解）`, state: 'locked' };
    }
    case 'clue': return { text: `[E] 調查：${name}${seen ? '（看過）' : ''}`, state: 'can' };
    case 'egg': return { text: `[E] 看看：${name}${seen ? '（看過）' : ''}`, state: 'can' };
    case 'phone': return { text: '[E] 看手機', state: 'can' };
    case 'hint': return { text: '[E] 問 AI 助教', state: 'can' };
    case 'door': return { text: '[E] 離開', state: 'can' };
    default: return { text: `[E] 檢查${name}`, state: 'can' };
  }
}

/** 名牌前面的記號：已解 ✓、不能解 🔒、看過 ✓（線索與彩蛋）、現在要做的那關 ★。 */
export function labelMark(res, { solved = false, available = true, seen = false, isTarget = false } = {}) {
  if (res?.kind === 'puzzle') {
    if (solved) return '✓ ';
    if (!available) return '🔒 ';
    return isTarget ? '★ ' : '';
  }
  if (res?.kind === 'clue' || res?.kind === 'egg') return seen ? '✓ ' : '';
  return '';
}

/** 準星在遠處對到物件時，提示要走近。 */
export const farText = (name) => `靠近一點：${name}`;
