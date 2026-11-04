// 互動面板的內容（純函式，不碰 DOM，可以用 node:test 測）。
// 面板只決定「顯示什麼、有哪些按鈕、按了送哪個動作」，謎題判定與劇情進度還是核心在管。
// 回傳 { kicker, title, text, buttons, meta }。
// button：{ id, label, action?（要送給核心的動作）, stay?（按了不關面板，結果顯示在面板裡）, primary?, focus? }
// 面板按鈕可用滑鼠點、Tab／Enter，或直接按對應的數字鍵；Esc 一律取消。

const CLOSE = (label = '關閉') => ({ id: 'close', label, primary: true });

function clueRelation(res, ctx) {
  const pid = res.clue.forPuzzle;
  if (!pid) return '這條線索目前沒有對上特定的關卡，先記著就好。';
  const title = ctx.content.puzzleById?.[pid]?.title ?? pid;
  if (ctx.game.isSolved(pid)) return `這條線索對應「${title}」，那關你已經解開了。`;
  if (ctx.game.puzzleAvailable(pid)) return `這條線索對應「${title}」，現在就可以去解。`;
  return `這條線索對應「${title}」，那關還沒輪到，先記著。`;
}

export function panelFor(res, plan, ctx) {
  const { game, content } = ctx;
  switch (res.kind) {
    case 'clue':
      return {
        kicker: '線索', title: res.clue.name, text: res.clue.text,
        buttons: [{ id: 'inspect', label: '仔細想想', stay: true, result: clueRelation(res, ctx) }, CLOSE('記下來了')],
      };
    case 'egg':
      return {
        kicker: '看看', title: res.egg.name, text: res.egg.look,
        buttons: [{ id: 'egg', label: res.egg.actionLabel, action: { type: 'EGG', egg: res.egg.id } }, { ...CLOSE('算了'), focus: true }],
      };
    case 'phone':
      return {
        kicker: '手機', title: '手機', text: '螢幕亮著：1 則未讀，課程公告。',
        buttons: [{ id: 'phone', label: '點開未讀', action: { type: 'PHONE' }, stay: true }, CLOSE('放回口袋')],
      };
    case 'hint': {
      const left = game.getState().aiQuota;
      const total = content.hints?.aiQuota ?? left;
      return {
        kicker: 'AI 助教', title: 'AI 助教', text: '需要提示嗎？每問一次會用掉一次額度。',
        meta: quotaLine(left, total),
        buttons: [{ id: 'hint', label: '問提示', action: { type: 'HINT' }, stay: true }, CLOSE('不問了')],
      };
    }
    case 'door':
      return {
        kicker: '大門', title: res.name ?? '大門', text: '門就在眼前。要推開它嗎？',
        buttons: [{ id: 'door', label: '推開門', action: { type: 'DOOR' } }, { ...CLOSE('再想想'), focus: true }],
      };
    case 'puzzle': {
      const p = res.puzzle;
      if (game.isSolved(p.id)) {
        return { kicker: '已解開', title: p.title, text: '這關已經解開了。', buttons: [CLOSE('知道了')] };
      }
      // 還不能解：列出相關線索
      return { kicker: '還不能解', title: res.name ?? p.title, text: plan.text, buttons: [CLOSE('知道了')] };
    }
    default:
      return { kicker: '', title: plan.title ?? '', text: plan.text ?? '', buttons: [CLOSE()] };
  }
}

export const quotaLine = (left, total) => `AI 額度：剩餘 ${left}／${total} 次`;

/** 核心送回來的事件，轉成面板裡要顯示的結果文字；不相關的事件回 null。 */
export function resultFromEvent(ev) {
  switch (ev?.type) {
    case 'message': return ev.text ?? null;
    case 'hint': return ev.text || '現在沒有需要提示的關卡。';
    case 'finale_locked': return [ev.text, ev.hint].filter(Boolean).join('\n');
    default: return null;
  }
}

/** 數字鍵 → 第幾顆按鈕（1 起算）；不是 1–9 或超出範圍回 -1。 */
export function buttonIndexForKey(key, count) {
  if (!/^[1-9]$/.test(key)) return -1;
  const i = Number(key) - 1;
  return i < count ? i : -1;
}
