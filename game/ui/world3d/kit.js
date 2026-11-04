// 3D 積木：用基本幾何體拼物件的小工具，文字貼圖，浮動名牌。
// three.js 由 index.html（開發）或 game.js 開頭（dist）放成全域 THREE，所以這裡不 import。
// 單位：1 格 = 1 單位（約 1 公尺）。物件的原點在地板上、腳印中心，前面是 +z。

const T3 = () => globalThis.THREE;

// 美術風格（style/）提供的寫實貼圖材質；沒設定就用程式畫的顆粒貼圖
let STYLE = null;
export const setStyle = (s) => { STYLE = s; };
export const getStyle = () => STYLE;

export const WALL_H = 2.6;
export const FONT = '"Pixel Font", "Microsoft JhengHei", "PingFang TC", "Noto Sans TC", sans-serif';

// ---------- 材質 ----------
const mats = new Map();
/** 共用材質。glow = 不受光（自己會發亮）；unique = 不共用，才能個別做動畫。 */
export function mat(color, { glow = false, alpha = 1, map = null, unique = false, side, tex } = {}) {
  const THREE = T3();
  if (STYLE && tex === 'wood' && !glow && !map && !unique) {
    const k = `wood|${color}`;
    if (!mats.has(k)) mats.set(k, STYLE.makeMaterial('wood', { repeat: [1, 1], color: parseInt(color.slice(1), 16) }));
    return mats.get(k);
  }
  const key = map || unique ? null : `${color}|${glow}|${alpha}|${side ?? ''}|${tex ?? ''}`;
  if (key && mats.has(key)) return mats.get(key);
  const opt = { color, map: map ?? (glow ? null : grainTexture(tex)), transparent: alpha < 1, opacity: alpha };
  if (side) opt.side = side;
  const m = glow ? new THREE.MeshBasicMaterial(opt) : new THREE.MeshStandardMaterial({ ...opt, roughness: 0.82, metalness: 0.02 });
  if (key) mats.set(key, m);
  return m;
}

// ---------- 零件描述（位置是零件中心；rx ry rz 是旋轉） ----------
export const B = (x, y, z, w, h, d, c, o = {}) => ({ k: 'b', x, y, z, s: [w, h, d], c, ...o });
export const Cy = (x, y, z, r, h, c, o = {}) => ({ k: 'c', x, y, z, s: [r, h], c, ...o });
export const S = (x, y, z, r, c, o = {}) => ({ k: 's', x, y, z, s: [r], c, ...o });
export const Ic = (x, y, z, r, c, o = {}) => ({ k: 'i', x, y, z, s: [r], c, ...o });
export const Co = (x, y, z, r, h, c, o = {}) => ({ k: 'k', x, y, z, s: [r, h], c, ...o });
/** 貼字的平面（面向 +z）。 */
export const T = (x, y, z, w, h, text, o = {}) => ({ k: 't', x, y, z, s: [w, h], text, ...o });
/** 像 QR code 的黑白方塊平面。 */
export const Q = (x, y, z, w, o = {}) => ({ k: 'q', x, y, z, s: [w, w], ...o });

// ---------- 文字貼圖 ----------
const texCache = new Map();
function canvasTex(key, w, h, draw) {
  if (texCache.has(key)) return texCache.get(key);
  const THREE = T3();
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  draw(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  texCache.set(key, t);
  return t;
}

export function textTexture(text, { fg = '#222', bg = '#fff', w = 128, h = 128, px = 44 } = {}) {
  return canvasTex(`t|${text}|${fg}|${bg}|${w}|${h}|${px}`, w, h, (g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `bold ${px}px ${FONT}`;
    const lines = String(text).split('\n');
    lines.forEach((ln, i) => g.fillText(ln, w / 2, h / 2 + (i - (lines.length - 1) / 2) * px * 1.15));
  });
}

export function qrTexture() {
  return canvasTex('qr', 96, 96, (g) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, 96, 96);
    g.fillStyle = '#111';
    const n = 11, c = 96 / n;
    const finder = (ox, oy) => { g.fillRect(ox * c, oy * c, 3 * c, 3 * c); g.fillStyle = '#fff'; g.fillRect((ox + 0.6) * c, (oy + 0.6) * c, 1.8 * c, 1.8 * c); g.fillStyle = '#111'; g.fillRect((ox + 1) * c, (oy + 1) * c, c, c); };
    finder(0, 0); finder(n - 3, 0); finder(0, n - 3);
    let seed = 7;
    for (let y = 0; y < n; y += 1) for (let x = 0; x < n; x += 1) {
      const inFinder = (x < 4 && y < 4) || (x > n - 5 && y < 4) || (x < 4 && y > n - 5);
      seed = (seed * 16807) % 2147483647;
      if (!inFinder && seed % 3 === 0) g.fillRect(x * c, y * c, c, c);
    }
  });
}

/** 地板、牆的格子貼圖（低解析度、不平滑，保留一點像素感）。 */
export function tileTexture(base, { line = 'rgba(0,0,0,.18)', band = null } = {}) {
  return canvasTex(`tile|${base}|${line}|${band}`, 32, 32, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    if (band) { g.fillStyle = band; g.fillRect(0, h * 0.62, w, h * 0.38); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, h * 0.62, w, 1); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, h - 3, w, 3); }
    g.fillStyle = line; g.fillRect(0, 0, w, 1); g.fillRect(0, 0, 1, h);
    g.fillStyle = 'rgba(255,255,255,.05)';
    for (let i = 0; i < 6; i += 1) g.fillRect((i * 13) % w, (i * 7) % h, 2, 2);
  });
}

/** 顆粒／木紋貼圖（灰階，乘在顏色上，讓表面有手感）。tex: 'wood' 木紋，其餘是細顆粒。 */
export function grainTexture(tex) {
  const kind = tex === 'wood' ? 'wood' : 'grain';
  return canvasTex(`grain|${kind}`, 64, 64, (g, w, h) => {
    let seed = kind === 'wood' ? 11 : 3;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    if (kind === 'wood') {
      for (let y = 0; y < h; y += 1) { const v = 215 + Math.sin(y * 0.9 + rnd() * 1.5) * 22 + rnd() * 10; g.fillStyle = `rgb(${v},${v - 6},${v - 14})`; g.fillRect(0, y, w, 1); }
    }
    for (let i = 0; i < 380; i += 1) { const v = 200 + rnd() * 55; g.fillStyle = `rgba(${v},${v},${v},.55)`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1); }
  });
}

/** 圓角方塊：把有分段的方塊的頂點推到「內縮方塊加半徑」的表面上。UV 保留，貼圖照常用。 */
export function roundedBoxGeometry(w, h, d, r) {
  const THREE = T3();
  const geo = new THREE.BoxGeometry(w, h, d, 4, 4, 4);
  const pos = geo.attributes.position;
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
  const v = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    v.fromBufferAttribute(pos, i);
    c.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
    v.sub(c);
    if (v.lengthSq() > 1e-12) v.normalize().multiplyScalar(r);
    pos.setXYZ(i, c.x + v.x, c.y + v.y, c.z + v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ---------- 把零件組成 Group ----------
export function assemble(parts) {
  const THREE = T3();
  const group = new THREE.Group();
  for (const p of parts.flat(4)) {
    if (!p) continue;
    let geo, material;
    switch (p.k) {
      case 'b': {
        const m = Math.min(...p.s);
        geo = m >= 0.05 && !p.sharp ? roundedBoxGeometry(p.s[0], p.s[1], p.s[2], Math.min(0.035, m * 0.3)) : new THREE.BoxGeometry(...p.s);
        break;
      }
      case 'c': geo = new THREE.CylinderGeometry(p.s[0], p.s[0], p.s[1], 14); break;
      case 's': geo = new THREE.SphereGeometry(p.s[0], 14, 10); break;
      case 'i': geo = new THREE.IcosahedronGeometry(p.s[0], 0); break;
      case 'k': geo = new THREE.ConeGeometry(p.s[0], p.s[1], 12); break;
      case 't': case 'q': geo = new THREE.PlaneGeometry(...p.s); break;
      default: continue;
    }
    if (p.k === 't') {
      const map = textTexture(p.text, p);
      material = mat('#ffffff', { map, glow: p.glow, alpha: p.alpha ?? 1 });
    } else if (p.k === 'q') {
      material = mat('#ffffff', { map: qrTexture() });
    } else {
      material = mat(p.c, p);
    }
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(p.x, p.y, p.z);
    mesh.rotation.set(p.rx ?? 0, p.ry ?? 0, p.rz ?? 0);
    if (!p.glow && p.k !== 't' && p.k !== 'q') { mesh.castShadow = true; mesh.receiveShadow = true; }
    if (p.tag) mesh.userData.tag = p.tag;
    if (p.unique) mesh.userData.ownMaterial = true;
    group.add(mesh);
  }
  return group;
}

// ---------- 浮動名牌 ----------
export function makeLabel(text, border = '#f0b429') {
  const THREE = T3();
  const cv = document.createElement('canvas');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 10;
  sprite.userData.draw = (t, b) => {
    const g = cv.getContext('2d');
    g.font = `bold 30px ${FONT}`;
    const w = Math.min(560, Math.max(110, Math.ceil(g.measureText(t).width) + 36));
    cv.width = w; cv.height = 56;
    g.font = `bold 30px ${FONT}`;
    g.fillStyle = 'rgba(10,11,16,.85)'; g.fillRect(0, 0, w, 56);
    g.strokeStyle = b; g.lineWidth = 4; g.strokeRect(2, 2, w - 4, 52);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(t, w / 2, 29);
    tex.needsUpdate = true;
    sprite.userData.w = (w / 56) * 0.17;
    sprite.scale.set(sprite.userData.w, 0.17, 1);
  };
  sprite.userData.draw(text, border);
  return sprite;
}

/** 浮在空中的小字（睡覺的 z）。 */
export function makeGlyph(char, color = '#ffffff') {
  const THREE = T3();
  const tex = canvasTex(`g|${char}|${color}`, 64, 64, (g) => {
    g.font = `bold 52px ${FONT}`; g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(char, 32, 34);
  });
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set(0.2, 0.2, 1);
  return sprite;
}

/** 釋放一個 Group 的幾何體（材質與貼圖是共用的，不釋放）。 */
export function disposeGroup(group) {
  group.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.isSprite && o.userData.draw) { o.material.map?.dispose(); o.material.dispose(); }
    else if (o.material && o.userData.ownMaterial) o.material.dispose();
  });
}
