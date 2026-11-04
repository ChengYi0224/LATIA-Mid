// 簡單的事件分發：on(type, fn)、emit(events)。type 用 '*' 可收全部事件。
const handlers = new Map();

/** 註冊處理函式，回傳取消註冊的函式。 */
export function on(type, fn) {
  if (!handlers.has(type)) handlers.set(type, new Set());
  handlers.get(type).add(fn);
  return () => handlers.get(type).delete(fn);
}

/** 照順序分發事件陣列；單一處理函式出錯不影響其他人。最後送一個 _flush 讓畫面重畫。 */
export function emit(events = []) {
  for (const ev of events) {
    for (const key of [ev.type, '*']) {
      for (const fn of handlers.get(key) ?? []) {
        try { fn(ev); } catch (e) { console.error(`[bus] ${ev.type} 處理失敗`, e); }
      }
    }
  }
  for (const fn of handlers.get('_flush') ?? []) {
    try { fn({ type: '_flush' }); } catch (e) { console.error('[bus] _flush 處理失敗', e); }
  }
}
