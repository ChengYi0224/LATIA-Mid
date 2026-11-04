// 材質工廠：卡通寫實風。不 import three.js，由呼叫端傳入 THREE。
// 貼圖來源順序：1) globalThis.__STYLE_TEXTURES__（assets-data.js 產生的 base64，file:// 可用）
//               2) 相對路徑 assets/textures/<name>.jpg（只有 http 伺服器下才載得到）
//               3) 都沒有就只用純色，畫面仍正常。

/** 每種材質的設定：tint 用來把寫實貼圖往柔和、偏暖的卡通色調靠。 */
export const KINDS = {
  floor:  { tex: 'floor',  tint: 0xe6ddd0, roughness: 0.85, metalness: 0,   repeat: [3, 3], normalScale: 0.6 },
  wall:   { tex: 'wall',   tint: 0xf1e8d8, roughness: 0.95, metalness: 0,   repeat: [2, 1], normalScale: 0.5 },
  wood:   { tex: 'wood',   tint: 0xf0d2aa, roughness: 0.7,  metalness: 0,   repeat: [1, 1], normalScale: 0.7 },
  metal:  { tex: 'metal',  tint: 0xcdd6dc, roughness: 0.5,  metalness: 0.6, repeat: [1, 1], normalScale: 0.6 },
  fabric: { tex: 'fabric', tint: 0xd9b8a8, roughness: 1,    metalness: 0,   repeat: [2, 2], normalScale: 0.8 },
  accent: { tex: 'accent', tint: 0xd8d2c8, roughness: 0.9,  metalness: 0,   repeat: [2, 2], normalScale: 0.5 },
};

export function createMaterials(THREE, options = {}) {
  const base = options.baseUrl ?? new URL('../../../../assets/textures/', import.meta.url).href;
  const embedded = () => globalThis.__STYLE_TEXTURES__ || {};
  const loader = new THREE.TextureLoader();
  const texCache = new Map(); // 'name' -> 原始貼圖
  const matCache = new Map(); // 'kind|repeat|color' -> 材質

  function loadTex(name, isColor) {
    if (texCache.has(name)) return texCache.get(name);
    const src = embedded()[name] ?? (options.useFiles === false ? null : `${base}${name}.jpg`);
    if (!src) return null;
    let tex = null;
    try {
      tex = loader.load(src, undefined, undefined, () => {}); // 載入失敗就維持純色
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = options.anisotropy ?? 4;
      if (isColor && 'colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
    } catch (e) { tex = null; }
    texCache.set(name, tex);
    return tex;
  }

  function withRepeat(tex, repeat) {
    if (!tex) return null;
    const t = tex.clone(); // clone 共用同一張圖，只是 repeat 不同
    t.needsUpdate = true;
    t.repeat.set(repeat[0], repeat[1]);
    return t;
  }

  /**
   * @param {string} kind floor|wall|wood|metal|fabric|accent
   * @param {{repeat?:[number,number], color?:number, roughness?:number}} [opts]
   */
  function makeMaterial(kind, opts = {}) {
    const cfg = KINDS[kind] ?? KINDS.accent;
    const repeat = opts.repeat ?? cfg.repeat;
    const color = opts.color ?? cfg.tint;
    const key = `${kind}|${repeat}|${color}|${opts.roughness ?? ''}`;
    if (matCache.has(key)) return matCache.get(key);
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.roughness ?? cfg.roughness,
      metalness: cfg.metalness,
      map: withRepeat(loadTex(`${cfg.tex}_diff`, true), repeat),
      normalMap: withRepeat(loadTex(`${cfg.tex}_nor`, false), repeat),
    });
    if (mat.normalMap) mat.normalScale.set(cfg.normalScale, cfg.normalScale);
    matCache.set(key, mat);
    return mat;
  }

  /** 沒有貼圖的純色材質（道具、重點物件用），一樣是柔和 PBR。 */
  function makeSolid(color, opts = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness: opts.roughness ?? 0.75, metalness: opts.metalness ?? 0 });
  }

  function dispose() {
    for (const m of matCache.values()) { m.map?.dispose(); m.normalMap?.dispose(); m.dispose(); }
    for (const t of texCache.values()) t?.dispose();
    matCache.clear(); texCache.clear();
  }

  return { makeMaterial, makeSolid, dispose, kinds: Object.keys(KINDS) };
}
