// 把一個房間的格子地圖蓋成 3D 場景：地板、牆、門、窗、天花板燈、物件，以及燈光和每幀的動畫。
// 只讀地圖與狀態，不碰規則。座標：地圖格 (x, y) 對應 3D 的 (X, Z)，1 格 = 1 單位。
import { TILE } from '../maps.js';
import { skyColor, darkness, dawnLevel } from '../flavor-logic.js';
import { tileAt, resolveObject } from '../world/logic.js';
import { WALL_H, mat, getStyle, tileTexture, assemble, makeLabel, makeGlyph, disposeGroup, B, T } from './kit.js';
import { MODELS, genericModel } from './models.js';
import { labelMark } from './prompt-logic.js';

const T3 = () => globalThis.THREE;

// ---------- 氣氛設定 ----------
// 每個房間的基本暗度；走廊要等第 3 關開燈才會亮
export const ROOM_DARK = { r401: 0.22, hall: 0.5, r503: 0.28 };
// 會發光的物件：[顏色, 光照半徑（像素）]
export const LIGHTS = {
  laptop: ['#9ec3ff', 40], hint: ['#f0b429', 18], phone: ['#3ec28f', 16],
  vending: ['#ff7a7a', 54], switch_panel: ['#ffe27a', 22], keypad: ['#7fffa0', 20],
  lab_pc: ['#8fb8ff', 42], e_restore: ['#8fb8ff', 26], e_sync: ['#8fb8ff', 26], e_seniorcode: ['#8fb8ff', 30],
  broadcast: ['#ff9ad0', 30], e_guardpc: ['#8fb8ff', 24], c_guard: ['#9fd0ff', 30], e_printer: ['#cfe0ff', 18],
};
export const SLEEPERS = ['c_sleeptalk'];
// 北牆上的窗戶（x 座標；被物件或門佔住、不是牆就不蓋）
const WINDOWS = { r401: [3, 4, 8], hall: [1, 22], r503: [6, 7] };
const KIND_COLOR = { puzzle: '#f0b429', egg: '#e08bb0', clue: '#7fb8d9', door: '#3ec28f', phone: '#3ec28f', hint: '#3ec28f' };
const LABEL_NEAR = 9;

const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `#${[n >> 16, (n >> 8) & 255, n & 255].map((v) => c(v).toString(16).padStart(2, '0')).join('')}`;
};
const lerpColor = (a, b, k) => new (T3().Color)(a).lerp(new (T3().Color)(b), k);

const DIRS = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // [dx, dz]

export function buildRoom({ map, roomId, content }) {
  const THREE = T3();
  const group = new THREE.Group();
  const W = map.w, H = map.h;
  const objAt = (x, y) => map.objects.some((o) => x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h);
  const isDoor = (x, y) => tileAt(map, x, y) === 'D';

  // ----- 地板與天花板 -----
  const style = getStyle();
  let floorMat;
  if (style) floorMat = style.makeMaterial('floor', { repeat: [W / 2, H / 2], color: parseInt(shade(map.floor, 1.05).slice(1), 16) });
  else {
    const floorTex = tileTexture(map.floor);
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(W, H);
    floorMat = mat('#ffffff', { map: floorTex });
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, H), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(W / 2, 0, H / 2);
  floor.receiveShadow = true;
  group.add(floor);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat('#d9d6cf'));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(W / 2, WALL_H, H / 2);
  group.add(ceil);

  // ----- 牆（只蓋看得到的：貼著可走格子的牆） -----
  const wallMat = style
    ? style.makeMaterial('wall', { repeat: [1, 1], color: parseInt(shade(map.wall, 1.25).slice(1), 16) })
    : mat('#ffffff', { map: tileTexture(map.wall, { band: shade(map.wall, 0.78) }) });
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      if (tileAt(map, x, y) !== '#') continue;
      if (!DIRS.some(([dx, dz]) => tileAt(map, x + dx, y + dz) !== '#' && x + dx >= 0 && y + dz >= 0 && x + dx < W && y + dz < H)) continue;
      const m = new THREE.Mesh(new THREE.BoxGeometry(1, WALL_H, 1), wallMat);
      m.position.set(x + 0.5, WALL_H / 2, y + 0.5);
      m.castShadow = true; m.receiveShadow = true;
      group.add(m);
    }
  }

  // ----- 門（signs 是關著、不能互動的假門，畫法一樣） -----
  const doorEntries = [];
  const signXs = new Set((map.signs ?? []).map((sg) => `${sg.x},${sg.y}`));
  const doorList = [...map.doors.map((d) => ({ ...d, fake: false })), ...(map.signs ?? []).map((sg) => ({ ...sg, fake: true }))];
  for (const d of doorList) {
    const dir = DIRS.find(([dx, dz]) => tileAt(map, d.x + dx, d.y + dz) === '.') ?? [0, 1];
    const g = assemble([
      B(0, 1.1, 0.04, 0.92, 2.2, 0.08, '#6b4a2f', { tex: 'wood' }), B(0, 1.1, 0.085, 0.74, 1.95, 0.02, '#7c5736', { tex: 'wood' }),
      B(0.3, 1.05, 0.11, 0.05, 0.05, 0.05, '#d9b24c'),
      B(0, 2.4, 0.04, 0.96, 0.4, 0.08, '#6a6a74'),
      B(-0.5, 1.2, 0.04, 0.08, 2.4, 0.1, '#55555f'), B(0.5, 1.2, 0.04, 0.08, 2.4, 0.1, '#55555f'),
      d.fake
        ? T(0, 2.4, 0.09, 0.6, 0.2, '鎖住', { bg: '#4a4a52', fg: '#c8c8d0', px: 66, w: 256, h: 128 })
        : T(0, 2.4, 0.09, 0.6, 0.2, '出口', { bg: '#1d6b3d', fg: '#d8ffe4', px: 66, w: 256, h: 128, glow: true }),
    ]);
    g.position.set(d.x + 0.5 + dir[0] * 0.42, 0, d.y + 0.5 + dir[1] * 0.42);
    g.rotation.y = Math.atan2(dir[0], dir[1]);
    group.add(g);
    const label = d.fake ? makeLabel(d.text, '#9a9ead') : makeLabel(`→ ${content.rooms.byId[d.to]?.name ?? d.to}`, '#3ec28f');
    label.position.set(d.x + 0.5 + dir[0] * 0.2, 2.0, d.y + 0.5 + dir[1] * 0.2);
    group.add(label);
    doorEntries.push({ label });
  }

  // ----- 窗 -----
  const windows = [];
  for (const x of WINDOWS[roomId] ?? []) {
    if (tileAt(map, x, 0) !== '#' || objAt(x, 0) || isDoor(x, 0) || signXs.has(`${x},0`)) continue;
    const g = new THREE.Group();
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.86), mat('#0a0f2c', { glow: true, unique: true }));
    pane.userData.ownMaterial = true;
    pane.position.set(0, 1.6, 0.003);
    g.add(pane);
    const stars = [];
    for (let k = 0; k < 4; k += 1) {
      const s = new THREE.Mesh(new THREE.PlaneGeometry(0.025, 0.025), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true }));
      s.userData.ownMaterial = true;
      s.position.set(-0.28 + ((x * 7 + k * 5) % 10) * 0.056, 1.3 + ((x * 3 + k * 4) % 6) * 0.1, 0.006);
      g.add(s); stars.push(s);
    }
    g.add(assemble([
      B(0, 2.07, 0.03, 0.9, 0.08, 0.06, '#2a2d38'), B(0, 1.13, 0.03, 0.9, 0.08, 0.06, '#2a2d38'),
      B(-0.43, 1.6, 0.03, 0.08, 1.02, 0.06, '#2a2d38'), B(0.43, 1.6, 0.03, 0.08, 1.02, 0.06, '#2a2d38'),
      B(0, 1.6, 0.03, 0.04, 0.98, 0.04, '#2a2d38'), B(0, 1.1, 0.1, 0.96, 0.05, 0.16, '#cfc8b8'),
    ]));
    g.position.set(x + 0.5, 0, 1.0);
    group.add(g);
    windows.push({ pane, stars, x });
  }

  // ----- 物件 -----
  const entries = [];
  const freeSteps = (ob, dx, dz) => { // 從物件邊緣往 (dx,dz) 看，走得出幾格
    const cx = dx > 0 ? ob.x + ob.w - 1 : dx < 0 ? ob.x : ob.x + Math.floor(ob.w / 2);
    const cy = dz > 0 ? ob.y + ob.h - 1 : dz < 0 ? ob.y : ob.y + Math.floor(ob.h / 2);
    let n = 0;
    while (n < 8 && tileAt(map, cx + dx * (n + 1), cy + dz * (n + 1)) === '.' && !objAt(cx + dx * (n + 1), cy + dz * (n + 1))) n += 1;
    return n;
  };
  for (const ob of map.objects) {
    const wall = tileAt(map, ob.x, ob.y) === '#';
    const parts = (MODELS[ob.id] ?? genericModel)(ob);
    const g = assemble(parts);
    let dir = [0, 1];
    if (wall) {
      dir = DIRS.find(([dx, dz]) => tileAt(map, ob.x + dx, ob.y + dz) === '.') ?? [0, 1];
      g.position.set(ob.x + 0.5 + dir[0] * 0.5, 0, ob.y + 0.5 + dir[1] * 0.5);
    } else {
      const long = ob.w > ob.h ? [[0, 1], [0, -1]] : ob.h > ob.w ? [[1, 0], [-1, 0]] : DIRS;
      dir = long.map((d) => ({ d, n: freeSteps(ob, d[0], d[1]) })).sort((a, b) => b.n - a.n)[0].d;
      g.position.set(ob.x + ob.w / 2, 0, ob.y + ob.h / 2);
    }
    g.rotation.y = Math.atan2(dir[0], dir[1]);
    group.add(g);
    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(g);
    const entry = { ob, group: g, box, res: null, label: null };
    if (!ob.deco) {
      entry.res = resolveObject(content, roomId, ob.id);
      const label = makeLabel(entry.res?.name ?? ob.id, KIND_COLOR[entry.res?.kind] ?? '#f0b429');
      const top = box.max.y;
      label.position.set((box.min.x + box.max.x) / 2 + (wall ? dir[0] * 0.1 : 0), Math.min(top + 0.22, 2.35), (box.min.z + box.max.z) / 2 + (wall ? dir[1] * 0.1 : 0));
      group.add(label);
      entry.label = label;
    }
    entries.push(entry);
  }

  // 睡覺的人頭上冒 z
  const zs = [];
  for (const e of entries) {
    if (!SLEEPERS.includes(e.ob.id)) continue;
    for (let k = 0; k < 3; k += 1) { const s = makeGlyph('z'); group.add(s); zs.push({ s, k, x: (e.box.min.x + e.box.max.x) / 2, y: e.box.max.y, z: (e.box.min.z + e.box.max.z) / 2 }); }
  }

  // ----- 燈光 -----
  const hemi = new THREE.HemisphereLight('#9fb4ff', '#6a5a4a', 1);
  group.add(hemi);
  const sun = new THREE.DirectionalLight('#8fa6ff', 1);
  const span = Math.max(W, H);
  sun.position.set(W / 2 + span * 0.35, span * 0.9, H / 2 + span * 0.25);
  sun.target.position.set(W / 2, 0, H / 2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -span * 0.75, right: span * 0.75, top: span * 0.75, bottom: -span * 0.75, near: 0.5, far: span * 3 });
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.04;
  group.add(sun, sun.target);

  const nLamps = Math.max(1, Math.round((W * H) / 60));
  const lamps = [];
  for (let i = 0; i < nLamps; i += 1) {
    const along = W >= H;
    const x = along ? ((i + 0.5) / nLamps) * W : W / 2, z = along ? H / 2 : ((i + 0.5) / nLamps) * H;
    const fix = assemble([B(0, WALL_H - 0.04, 0, along ? 0.9 : 0.35, 0.05, along ? 0.35 : 0.9, '#fff4d8', { glow: true, unique: true, tag: 'lamp', sharp: true })]);
    fix.position.set(x, 0, z);
    group.add(fix);
    const light = new THREE.PointLight('#ffe9c2', 10, 0, 1.2);
    light.position.set(x, WALL_H - 0.3, z);
    group.add(light);
    lamps.push({ light, fix });
  }
  const glows = [];
  for (const e of entries) {
    const L = LIGHTS[e.ob.id];
    if (!L) continue;
    const light = new THREE.PointLight(L[0], 2, (L[1] / TILE) * 1.8, 1.6);
    light.position.set((e.box.min.x + e.box.max.x) / 2, Math.min(e.box.max.y, 1.5) - 0.05, (e.box.min.z + e.box.max.z) / 2);
    const dir = new THREE.Vector3((e.box.min.x + e.box.max.x) / 2, 0, (e.box.min.z + e.box.max.z) / 2);
    light.position.add(new THREE.Vector3(0, 0, 0)).add(dir.clone().multiplyScalar(0));
    group.add(light);
    glows.push({ light, base: 2, phase: e.box.min.x });
  }

  // 動畫用的零件：記下原本的顏色
  const tagged = [];
  group.traverse((o) => {
    if (o.userData.tag && o.material) { o.userData.base = o.material.color.clone(); tagged.push(o); }
  });

  let flickerUntil = 0;
  let targetObj = null;
  const labelState = new Map();

  return {
    group, entries, map, roomId,
    /** 解開的謎題名牌打勾。 */
    refreshLabels({ solved, available, seen, targetId }) {
      targetObj = targetId ?? null;
      for (const e of entries) {
        if (!e.label || !e.res) continue;
        const isPuzzle = e.res.kind === 'puzzle';
        const done = isPuzzle && !!solved?.(e.res.puzzle.id);
        const open = !isPuzzle || !!available?.(e.res.puzzle.id);
        const visited = !!seen?.has(e.ob.id);
        const isTarget = isPuzzle && !done && e.res.puzzle.object === targetId;
        const key = `${done}|${open}|${visited}|${isTarget}`;
        if (labelState.get(e.ob.id) === key) continue;
        labelState.set(e.ob.id, key);
        const mark = labelMark(e.res, { solved: done, available: open, seen: visited, isTarget });
        const color = done ? '#3ec28f' : isTarget ? '#ffe27a' : (visited && !isPuzzle) || !open ? '#7d8294' : KIND_COLOR[e.res.kind] ?? '#f0b429';
        e.label.userData.draw(`${mark}${e.res.name}`, color);
      }
    },
    /** 每幀：燈光亮度、霧、窗外天色、閃爍和名牌淡入淡出。 */
    update({ scene, camera, st, now }) {
      let base = ROOM_DARK[roomId] ?? 0.5;
      if (roomId === 'hall' && st.flags.hall_lit) {
        base = 0.12;
        if (now > flickerUntil && Math.random() < 0.006) flickerUntil = now + 90 + Math.random() * 160;
        if (now < flickerUntil) base = 0.4;
      }
      const a = darkness(base, st.clock);
      const bright = 1 - a;
      const dawn = dawnLevel(st.clock);
      hemi.intensity = 0.7 + 1.1 * bright;
      hemi.color.set(lerpColor('#b8c4ff', '#ffe2b8', dawn));
      sun.intensity = 0.6 + 1.8 * bright;
      sun.color.copy(lerpColor('#8aa2ff', '#ffd9a0', dawn));
      for (const l of lamps) l.light.intensity = 10 + 22 * bright;
      const fogCol = lerpColor('#1b2238', '#6b7494', Math.min(1, bright * 0.9 + dawn * 0.3));
      scene.fog.color.copy(fogCol);
      scene.fog.near = 5;
      scene.fog.far = 16 + 14 * bright;
      scene.background.copy(fogCol);

      const sky = skyColor(st.clock);
      const night = 1 - dawn;
      for (const w of windows) {
        w.pane.material.color.set(sky);
        w.stars.forEach((s, k) => { s.material.opacity = night * (Math.sin(now / 400 + w.x * 1.7 + k * 2.3) > 0.2 ? 1 : 0.15); });
      }
      for (const m of tagged) {
        const t = m.userData.tag, base0 = m.userData.base;
        if (t === 'screen') m.material.color.copy(base0).multiplyScalar(0.88 + 0.12 * Math.sin(now / 300 + m.position.x * 3));
        else if (t === 'blink') m.material.color.copy(base0).multiplyScalar(Math.floor(now / 500 + m.position.x * 4) % 2 ? 1 : 0.2);
        else if (t === 'lamp') m.material.color.copy(base0).multiplyScalar(0.5 + 0.5 * Math.min(1, bright * 1.4));
      }
      for (const g of glows) g.light.intensity = (g.base * (0.8 + 0.2 * Math.sin(now / 260 + g.phase))) * (0.8 + 0.8 * a);
      for (const z of zs) {
        const p = ((now / 2400) + z.k / 3) % 1;
        z.s.position.set(z.x + 0.1 + p * 0.3, z.y + 0.1 + p * 0.55, z.z);
        z.s.material.opacity = (1 - p) * 0.9;
      }
      for (const e of [...entries, ...doorEntries]) {
        if (!e.label) continue;
        const d = e.label.position.distanceTo(camera.position);
        e.label.visible = d < LABEL_NEAR;
        e.label.material.opacity = Math.max(0, Math.min(1, (LABEL_NEAR - d) / 2));
        if (e.ob && e.res?.kind === 'puzzle' && e.res.puzzle.object === targetObj) e.label.material.opacity *= 0.65 + 0.35 * Math.sin(now / 220); // 現在該做的那關：名牌閃
        let k = Math.max(0.55, Math.min(1.5, d / 4)); // 靠近時名牌縮小，不擋住畫面
        if (e.ob && d < 3.2) k *= 1 + 0.07 * Math.sin(now / 260 + e.ob.x); // 靠近可互動物件：名牌輕微脈動
        e.label.scale.set(e.label.userData.w * k, 0.17 * k, 1);
      }
    },
    dispose() {
      disposeGroup(group);
      group.removeFromParent();
    },
  };
}
