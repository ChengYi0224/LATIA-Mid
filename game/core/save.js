// 存檔與圖鑑。storage 介面同 localStorage：getItem / setItem / removeItem。
// 每次讀寫都包 try/catch，私密視窗或被封鎖時遊戲照樣能玩，只是不會記住。

export const KEY_CODEX = 'latia-mid:codex:v1';
export const KEY_RUN = 'latia-mid:run:v1';

export function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
  };
}

/** 瀏覽器用：拿得到 localStorage 就用，拿不到就退回記憶體。 */
export function browserStorage() {
  try {
    const s = globalThis.localStorage;
    const probe = '__latia_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return memoryStorage();
  }
}

function readJSON(storage, key) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJSON(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* 存不了就算了 */
  }
}

export function createSave(storage = memoryStorage()) {
  const emptyCodex = () => ({ deaths: {}, endings: {} });
  return {
    loadCodex() {
      const c = readJSON(storage, KEY_CODEX);
      return c && c.deaths && c.endings ? c : emptyCodex();
    },
    /** 記一筆；回傳是不是第一次拿到。kind: 'deaths' | 'endings' */
    record(kind, id) {
      const c = this.loadCodex();
      const isNew = !c[kind][id];
      c[kind][id] = (c[kind][id] || 0) + 1;
      writeJSON(storage, KEY_CODEX, c);
      return isNew;
    },
    writeCodex(c) {
      writeJSON(storage, KEY_CODEX, c);
    },
    loadRun() {
      return readJSON(storage, KEY_RUN);
    },
    saveRun(state) {
      writeJSON(storage, KEY_RUN, state);
    },
    clearRun() {
      try {
        storage.removeItem(KEY_RUN);
      } catch {
        /* ignore */
      }
    },
  };
}
