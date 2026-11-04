// 互動面板的內容（純函式，不碰 DOM，可以用 node:test 測）。
// 面板只決定「顯示什麼、有哪些按鈕、按了送哪個動作」，謎題判定與劇情進度還是核心在管。
// 回傳 { kicker, title, text, buttons, meta }。
// button：{ id, label, action?（要送給核心的動作）, stay?（按了不關面板，結果顯示在面板裡）, primary?, focus? }
// 面板按鈕可用滑鼠點、Tab／Enter，或直接按對應的數字鍵；Esc 一律取消。

import { dueChatter } from '../flavor-logic.js';

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
        skin: res.clue.id, kicker: '線索', title: res.clue.name, text: res.clue.text,
        buttons: [{ id: 'inspect', label: '仔細想想', stay: true, result: clueRelation(res, ctx) }, CLOSE('記下來了')],
      };
    case 'egg':
      return {
        skin: res.egg.id, kicker: '看看', title: res.egg.name, text: res.egg.look,
        buttons: [{ id: 'egg', label: res.egg.actionLabel, action: { type: 'EGG', egg: res.egg.id } }, { ...CLOSE('算了'), focus: true }],
      };
    case 'phone':
      return {
        skin: 'phone', kicker: '手機', title: '手機', text: '螢幕亮著：1 則未讀，課程公告。',
        chat: phoneThreads(ctx),
        buttons: [{ id: 'phone', label: '點開未讀', action: { type: 'PHONE' }, stay: true }, CLOSE('放回口袋')],
      };
    case 'hint': {
      const left = game.getState().aiQuota;
      const total = content.hints?.aiQuota ?? left;
      return {
        skin: 'hint', kicker: 'AI 助教', title: 'AI 助教', text: '需要提示嗎？每問一次會用掉一次額度。',
        meta: quotaLine(left, total),
        buttons: [{ id: 'hint', label: '問提示', action: { type: 'HINT' }, stay: true }, CLOSE('不問了')],
      };
    }
    case 'door':
      return {
        skin: 'door', kicker: '大門', title: res.name ?? '大門', text: '門就在眼前。要推開它嗎？',
        buttons: [{ id: 'door', label: '推開門', action: { type: 'DOOR' }, stay: true }, { ...CLOSE('再想想'), focus: true }],
      };
    case 'puzzle': {
      const p = res.puzzle;
      if (game.isSolved(p.id)) {
        return { skin: 'solved', puzzleId: p.id, kicker: '已解開', title: p.title, text: '這關已經解開了。', buttons: [CLOSE('知道了')] };
      }
      // 還不能解：列出相關線索
      return { skin: 'locked', puzzleId: p.id, notes: lockedNotes(p.id, ctx), kicker: '還不能解', title: res.name ?? p.title, text: plan.text, buttons: [CLOSE('知道了')] };
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

/** 手機訊息串：到時間的訊息依寄件人分組（純資料，畫面在 panel-skins.js）。 */
export function phoneThreads(ctx) {
  const list = ctx.content?.texts?.flavor?.chatter ?? [];
  const clock = ctx.game.getState().clock ?? 0;
  const due = dueChatter(list, clock, new Set());
  const threads = [];
  for (const i of due) {
    const c = list[i];
    if (c.narration) continue;
    let t = threads.find((x) => x.from === c.from);
    if (!t) { t = { from: c.from, messages: [] }; threads.push(t); }
    t.messages.push(c.text);
  }
  return threads;
}

/** 「還不能解」面板上的線索便條：[{ name, text }]。 */
export function lockedNotes(pid, ctx) {
  const rooms = ctx.content?.rooms?.list ?? [];
  return rooms.flatMap((r) => r.clues).filter((c) => c.forPuzzle === pid).map((c) => ({ name: c.name, text: c.text }));
}

/** 手機一般訊息串底下的三種回覆。 */
export const PHONE_CHOICES = ['收到', '晚點回', '先不回'];

const AUTO_SENDERS = new Set(['Moodle', '外送平台']);
const REPLY_TEXT = {
  軟工第三組: { 收到: '（已讀）好～辛苦組長了', 晚點回: '（已讀）OK，你先忙你的', 先不回: '（已讀）……好吧，晚點再說' },
  系學會: { 收到: '學長：好喔，那改天再約！', 晚點回: '學長：沒問題，不急～', 先不回: '學長：看來學弟很忙，不打擾了' },
  媽媽: { 收到: '媽媽：好，快去睡。', 晚點回: '媽媽：你這孩子，天都快亮了……', 先不回: '媽媽：（已讀）' },
};

/**
 * 選了回覆之後，要顯示什麼：{ out（你送出的泡泡）, reply（對方回的泡泡）, status（結果列） }。
 * 純函式，只是訊息文案；不影響遊戲進度。
 */
export function phoneReply(from, choice) {
  const out = PHONE_CHOICES.includes(choice) ? choice : PHONE_CHOICES[0];
  if (AUTO_SENDERS.has(from)) {
    return { out, reply: '（這是自動通知，無法回覆）', status: `已回覆「${out}」，這是自動通知，沒有人會看到。` };
  }
  const reply = REPLY_TEXT[from]?.[out] ?? '（已讀）';
  return { out, reply, status: `已回覆「${out}」` };
}
