// 素材對照表的純邏輯（不碰 DOM），方便測試。

const FALLBACK_COLOR = '#888';

/** src 只接受非空字串，其餘（null、空字串、空白、非字串）都當作沒有。 */
export function normalizeSrc(src) {
  return typeof src === 'string' && src.trim() ? src.trim() : null;
}

/** 從對照表取素材；表裡沒有的 key 回傳灰色後備。回傳的 src 已正規化。 */
export function resolveAsset(table, key) {
  const a = table?.[key];
  if (!a) return { color: FALLBACK_COLOR, label: String(key), src: null, known: false };
  return { color: a.color || FALLBACK_COLOR, label: a.label ?? String(key), src: normalizeSrc(a.src), known: true };
}

/**
 * 圖片快取。load(src, onOk, onFail) 由呼叫端提供（瀏覽器用 Image，測試用假的）。
 * get(src) 回傳「已載入好的圖」或 null（沒填、載入中、載入失敗都是 null，呼叫端就畫色塊）。
 * 失敗的 src 不會重試。
 */
export function createImageCache(load) {
  const state = new Map(); // src -> { status: 'loading' | 'ok' | 'fail', img, waiting: [] }
  const start = (s) => {
    let e = state.get(s);
    if (e) return e;
    e = { status: 'loading', img: null, waiting: [] };
    state.set(s, e);
    const finish = (status, img) => {
      e.status = status;
      e.img = img;
      for (const fn of e.waiting.splice(0)) fn(img);
    };
    load(s, (img) => finish('ok', img), () => finish('fail', null));
    return e;
  };
  return {
    get(src) {
      const s = normalizeSrc(src);
      return s && start(s).status === 'ok' ? state.get(s).img : null;
    },
    /** 載好（或失敗）時呼叫 done(圖 或 null)；同一個 src 只會請求一次。 */
    whenReady(src, done) {
      const s = normalizeSrc(src);
      if (!s) return;
      const e = start(s);
      if (e.status === 'loading') e.waiting.push(done);
      else done(e.img);
    },
    status(src) { return state.get(normalizeSrc(src))?.status ?? 'none'; },
  };
}
