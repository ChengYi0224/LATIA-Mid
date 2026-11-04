// Canvas 地圖、角色走動、碰撞、靠近物件按 E 互動（WP2）。
// 低解析度內部畫布（1 格 = 16 像素），整數倍放大。只讀狀態、只送動作；
// 謎題浮層、死因卡、結局顯示期間（WP3／WP5）暫停輸入。
import { MAPS, TILE } from '../maps.js';
import { getAsset, getImage } from '../assets.js';
import { skyColor, darkness } from '../flavor-logic.js';
import { drawSprite, drawFloor, drawWall, drawDoorTile, drawHero, SPRITE_IDS } from './sprites.js';
import { SPEED, move, nearestObject, doorAt, doorAction, doorFront, spawnFor, resolveObject, planInteraction, blockedText, objRect, tileAt } from './logic.js';

const KEYS = {
  ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down',
  ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right',
};
const VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const MIN_HOLD = 70; // 點一下方向鍵至少走這麼久（毫秒），不然輕點會幾乎不動

// ---------- 氣氛設定（之後換素材時可以調） ----------
// 每個房間的基本暗度；走廊要等第 3 關開燈才會亮
const ROOM_DARK = { r401: 0.5, hall: 0.84, pantry: 0.6, r503: 0.62, office: 0.6, lab: 0.56, floor1: 0.66 };
// 會發光的物件：[顏色, 半徑像素]
const LIGHTS = {
  laptop: ['#9ec3ff', 40], hint: ['#f0b429', 18], phone: ['#3ec28f', 16],
  vending: ['#ff7a7a', 54], switch_panel: ['#ffe27a', 22], keypad: ['#7fffa0', 20],
  lab_pc: ['#8fb8ff', 42], e_restore: ['#8fb8ff', 26], e_sync: ['#8fb8ff', 26], e_seniorcode: ['#8fb8ff', 30],
  broadcast: ['#ff9ad0', 30], e_guardpc: ['#8fb8ff', 24], c_guard: ['#ffd28a', 46], e_printer: ['#cfe0ff', 18],
};
const SCREENS = { laptop: 1, lab_pc: 1, e_restore: 1, e_sync: 1, e_seniorcode: 1, e_guardpc: 1 };
const SLEEPERS = ['c_sleeptalk', 'c_guard'];
// 上牆的窗戶（x 座標；被物件或門佔住、不是牆就不畫）
const WINDOWS = { r401: [3, 4, 8], hall: [1, 22], pantry: [2, 3, 8], r503: [6, 7], office: [2, 3, 10], lab: [6, 7, 13, 14], floor1: [9, 10] };
const hexA = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

const SPRITE_SET = new Set(SPRITE_IDS);
const SPRITE_DRAWN = (ob) => SPRITE_SET.has(ob.id);
const shade = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

export function initWorld(ctx, root) {
  const { game, content, bus, send, debug } = ctx;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./world.css', import.meta.url).href;
  document.head.append(link);

  // 房間清單面板預設收起來，只在 ?debug=1 顯示（可用右上角按鈕切換）；不動 rooms-panel 本身
  const app = document.getElementById('app');
  const panel = document.getElementById('rooms-root');
  const setPanel = (show) => { panel.hidden = !show; app.classList.toggle('wd-solo', !show); };
  setPanel(debug);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const wrap = el('div', 'wd');
  const canvas = el('canvas', 'wd-canvas');
  const g = canvas.getContext('2d');
  const prompt = el('div', 'wd-prompt');
  const toast = el('div', 'wd-toast');
  const roomName = el('div', 'wd-room');
  const stage = el('div', 'wd-stage');
  stage.append(canvas, prompt, toast);
  wrap.append(roomName, stage, el('div', 'wd-help', '方向鍵／WASD 走動　E 互動'));
  if (debug) {
    const t = el('button', 'wd-panel-btn', '房間清單');
    t.type = 'button';
    t.addEventListener('click', () => setPanel(panel.hidden));
    wrap.append(t);
  }
  root.append(wrap);

  // ---------- 狀態 ----------
  let roomId = null;
  let map = null;
  let pos = { x: 0, y: 0 };
  let facing = 'down';
  let walk = 0;                 // 走路動畫用的累計距離
  let near = null;              // 目前靠近的物件
  let modal = null;             // 自己的對話框（彩蛋、線索）
  const held = new Map();       // 方向 -> { since, up }
  let scale = 3;
  let toastTimer = null;
  let lastMoveAt = 0;           // 最後一次真的有移動的時間（走路動畫用）
  let stepAcc = 0;              // 腳步聲：累計走了幾像素
  let lastBump = 0;             // 上次撞牆的時間
  let shakeUntil = 0;           // 撞牆時畫面抖一下

  const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 3200);
  };

  function loadRoom(id, from) {
    roomId = id;
    map = MAPS[id];
    pos = spawnFor(map, from);
    held.clear();
    near = null;
    canvas.width = map.w * TILE;
    canvas.height = map.h * TILE;
    roomName.textContent = content.rooms.byId[id]?.name ?? id;
    fit();
    if (from) { // 換房間：黑一下再亮
      stage.classList.remove('wd-fade');
      void stage.offsetWidth;
      stage.classList.add('wd-fade');
    }
  }

  function fit() {
    if (!map) return;
    const availW = Math.max(root.clientWidth - 16, TILE * map.w);
    const top = root.getBoundingClientRect().top;
    const availH = Math.max(window.innerHeight - top - 80, TILE * map.h);
    scale = Math.max(1, Math.min(Math.floor(availW / canvas.width), Math.floor(availH / canvas.height), 6));
    canvas.style.width = `${canvas.width * scale}px`;
    canvas.style.height = `${canvas.height * scale}px`;
  }
  window.addEventListener('resize', fit);
  new ResizeObserver(fit).observe(root); // 樣式載入完、面板收合時寬度會變

  // 狀態裡的房間和畫面不同就換（清單、除錯跳關、重新開始都會走這裡）
  function syncRoom() {
    const st = game.getState();
    if (st.room !== roomId && MAPS[st.room]) loadRoom(st.room, roomId);
  }

  // ---------- 暫停判斷 ----------
  const overlayOpen = () => !!document.querySelector('#puzzle-root .pz-overlay, #screen-root .sc-overlay');
  const paused = () => game.getState().phase !== 'playing' || !!modal || overlayOpen();

  // ---------- 對話框（彩蛋、線索） ----------
  function closeModal() {
    if (!modal) return;
    modal.node.remove();
    modal = null;
    wrap.focus({ preventScroll: true });
  }
  function openModal({ title, text, buttons }) {
    closeModal();
    const node = el('div', 'wd-modal');
    const card = el('div', 'wd-card');
    card.append(el('strong', '', title), el('p', '', text));
    const row = el('div', 'wd-row');
    for (const b of buttons) {
      const btn = el('button', b.cls || '', b.label);
      btn.type = 'button';
      btn.addEventListener('click', () => { closeModal(); b.fn?.(); });
      row.append(btn);
    }
    card.append(row);
    node.append(card);
    wrap.append(node);
    modal = { node };
    held.clear();
    row.lastElementChild.focus({ preventScroll: true }); // 預設停在最後一顆（算了／關閉），不會手滑
  }

  // ---------- 互動：和 rooms-panel 清單點同一個物件送一樣的動作 ----------
  function interact() {
    if (!near) return;
    const res = resolveObject(content, roomId, near.id);
    const plan = res && planInteraction(res, game, content);
    if (!plan) return;
    bus.emit([{ type: 'ui_interact', id: near.id, kind: plan.do }]); // 給音效和台詞用
    held.clear();
    if (plan.do === 'send') send(plan.action);
    else if (plan.do === 'open_puzzle') bus.emit([{ type: 'ui_open_puzzle', puzzle: plan.puzzle }]);
    else if (plan.do === 'text') openModal({ title: plan.title, text: plan.text, buttons: [{ label: '關閉', cls: 'primary' }] });
    else if (plan.do === 'egg') {
      const e = plan.egg;
      openModal({
        title: e.name, text: e.look,
        buttons: [{ label: e.actionLabel, fn: () => send({ type: 'EGG', egg: e.id }) }, { label: '算了', cls: 'primary' }],
      });
    }
  }

  // ---------- 鍵盤 ----------
  const typing = (t) => t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
    if (modal) {
      if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
      return;
    }
    if (paused()) return;
    const dir = KEYS[e.key];
    if (dir) {
      e.preventDefault();
      const h = held.get(dir);
      if (!h || h.up) held.set(dir, { since: performance.now(), up: false });
    } else if ((e.key === 'e' || e.key === 'E') && !e.repeat) {
      interact();
    }
  });
  window.addEventListener('keyup', (e) => {
    const dir = KEYS[e.key];
    const h = dir && held.get(dir);
    if (h) h.up = true;
  });
  window.addEventListener('blur', () => held.clear());

  // ---------- 事件 ----------
  bus.on('_flush', syncRoom);
  bus.on('blocked', (ev) => showToast(blockedText(ev, content)));
  bus.on('message', (ev) => { if (!overlayOpen()) showToast(ev.text); });
  // AI 助教回覆改由 HUD（hud/index.js）顯示，這裡不再重複彈提示
  bus.on('death', closeModal);
  bus.on('ending', closeModal);
  // 新的一局：就算還在同一個房間，也要回到起點（不然會接著站在上一局的位置）
  bus.on('new_run', () => { closeModal(); held.clear(); const st = game.getState(); if (MAPS[st.room]) loadRoom(st.room, null); });
  bus.on('debug', (ev) => { if (ev.did === 'jump') { const st = game.getState(); if (MAPS[st.room]) loadRoom(st.room, null); } });

  // ---------- 每一幀 ----------
  let last = performance.now();
  function step(ms) {
    syncRoom();
    if (!map) return;
    if (paused()) { held.clear(); near = null; return; }
    const now = performance.now();
    let dx = 0, dy = 0;
    for (const [dir, h] of held) {
      if (h.up && now - h.since >= MIN_HOLD) { held.delete(dir); continue; }
      dx += VEC[dir][0];
      dy += VEC[dir][1];
      facing = dir;
    }
    if (dx || dy) {
      const len = Math.hypot(dx, dy);
      const dist = (SPEED * ms) / 1000;
      const n = Math.max(1, Math.ceil(dist / 2)); // 切小步，避免穿牆
      const before = pos;
      for (let i = 0; i < n; i += 1) pos = move(map, pos, (dx / len) * (dist / n), (dy / len) * (dist / n));
      const moved = Math.hypot(pos.x - before.x, pos.y - before.y);
      walk += moved;
      if (moved > 0.01) lastMoveAt = now;
      // 腳步聲和撞牆：直接呼叫音效，不走事件
      stepAcc += moved;
      if (stepAcc > 14) { stepAcc = 0; ctx.sfx?.('step'); }
      if (moved < 0.01 && now - lastBump > 380) { lastBump = now; shakeUntil = now + 140; ctx.sfx?.('bump'); }
      if (Math.abs(dx) !== Math.abs(dy) || !(dx && dy)) facing = Math.abs(dx) >= Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');

      const door = doorAt(map, pos);
      if (door) {
        const from = roomId;
        send(doorAction(roomId, door, game.getState()));
        if (roomId === from) { pos = doorFront(map, door); held.clear(); } // 被擋下：退回門前、放開按鍵，訊息由 blocked 事件顯示
      }
    }
    near = nearestObject(map, pos);
  }

  function frame(t) {
    const ms = Math.min(50, t - last);
    last = t;
    step(ms);
    draw();
    canvas.style.transform = t < shakeUntil ? `translate(${(Math.random() < 0.5 ? -1 : 1) * scale}px, 0)` : '';
    requestAnimationFrame(frame);
  }

  // ---------- 繪製（全部是程式畫的佔位圖形） ----------
  function draw() {
    if (!map) return;
    const st = game.getState();
    g.imageSmoothingEnabled = false;
    g.fillStyle = '#0d0e13';
    g.fillRect(0, 0, canvas.width, canvas.height);
    for (let ty = 0; ty < map.h; ty += 1) {
      for (let tx = 0; tx < map.w; tx += 1) drawTile(tx, ty, tileAt(map, tx, ty));
    }
    const now = performance.now();
    drawWindows(st, now);
    const items = map.objects.map((ob) => ({ y: (ob.y + ob.h) * TILE, fn: () => drawObject(ob, st) }));
    items.push({ y: pos.y + 6, fn: drawPlayer });
    items.sort((a, b) => a.y - b.y);
    for (const it of items) it.fn();
    drawAmbient(now);
    drawLighting(st, now);
    placePrompt();
  }

  function drawTile(tx, ty, ch) {
    if (ch === '#') return drawWall(g, roomId, tx, ty, map.wall, tileAt(map, tx, ty + 1) !== '#');
    drawFloor(g, roomId, tx, ty, map.floor);
    if (ch === 'D') drawDoorTile(g, tx, ty);
  }

  function drawObject(ob, st) {
    const r = objRect(ob);
    const w = r.x1 - r.x0, h = r.y1 - r.y0;
    const img = getImage(ob.id);   // 素材表有填 src 而且載入成功才有圖，否則畫下面的色塊
    const color = getAsset(ob.id).color !== '#888' ? getAsset(ob.id).color : ob.color;
    if (img) {
      g.drawImage(img, r.x0, r.y0, w, h);
    } else if (drawSprite(g, ob, r, performance.now())) {
      // 程式畫的像素圖（sprites.js）
    } else {
      g.fillStyle = 'rgba(0,0,0,.22)';
      g.fillRect(r.x0 + 1, r.y0 + 2, w, h);
      g.fillStyle = shade(color, ob.deco ? 0.75 : 0.62);
      g.fillRect(r.x0 + 1, r.y0 + 1, w - 2, h - 1);
      g.fillStyle = color;
      g.fillRect(r.x0 + 2, r.y0 + 2, w - 4, h - 5);
      g.fillStyle = 'rgba(255,255,255,.28)';
      g.fillRect(r.x0 + 2, r.y0 + 2, w - 4, 1);
    }
    if (ob.icon && !img && !SPRITE_DRAWN(ob)) {
      g.font = '12px "Pixel Font", "Microsoft JhengHei", sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillStyle = shade(color, 0.3);
      g.fillText(ob.icon, r.x0 + w / 2, r.y0 + h / 2 - 1);
    }
    const res = ob.deco ? null : resolveObject(content, roomId, ob.id);
    if (res?.kind === 'puzzle' && game.isSolved(res.puzzle.id)) {
      g.fillStyle = '#3ec28f';
      g.fillRect(r.x1 - 6, r.y0 + 1, 5, 5);
      g.fillStyle = '#0b2a1f';
      g.fillRect(r.x1 - 5, r.y0 + 3, 1, 1); g.fillRect(r.x1 - 4, r.y0 + 4, 1, 1); g.fillRect(r.x1 - 3, r.y0 + 2, 1, 2);
    }
    if (ob === near) {
      g.strokeStyle = (Math.floor(performance.now() / 300) & 1) ? '#ffe27a' : '#ffffff';
      g.lineWidth = 1;
      g.strokeRect(r.x0 + 0.5, r.y0 + 0.5, w - 1, h - 1);
    }
  }

  function drawPlayer() {
    const img = getImage('player');
    if (img) { g.drawImage(img, Math.round(pos.x) - 8, Math.round(pos.y) - 11, 16, 16); return; } // 16×16，腳底對齊角色位置
    const moving = performance.now() - lastMoveAt < 120;
    drawHero(g, pos.x, pos.y, facing, moving ? Math.floor(walk / 5) : -1);
  }

  // ---------- 氣氛：窗外天色、燈光、小動畫（全部程式畫，之後有素材也能疊在上面） ----------
  const objAt = (x, y) => map.objects.some((o) => x >= o.x && x < o.x + o.w && y >= o.y && y < o.y + o.h);
  function drawWindows(st, now) {
    const sky = skyColor(st.clock);
    const night = st.clock < 330;
    for (const x of WINDOWS[roomId] ?? []) {
      if (tileAt(map, x, 0) !== '#' || objAt(x, 0) || map.doors.some((d) => d.x === x && d.y === 0)) continue;
      const px = x * TILE;
      g.fillStyle = '#20232c';
      g.fillRect(px + 1, 2, TILE - 2, 11);
      g.fillStyle = sky;
      g.fillRect(px + 2, 3, TILE - 4, 9);
      if (night) { // 星星一閃一閃
        g.fillStyle = '#ffffff';
        for (let k = 0; k < 2; k += 1) {
          const sx = px + 3 + ((x * 7 + k * 5) % 10), sy = 4 + ((x * 3 + k * 4) % 6);
          if (Math.sin(now / 400 + x * 1.7 + k * 2.3) > 0.2) g.fillRect(sx, sy, 1, 1);
        }
      }
      g.fillStyle = '#20232c';
      g.fillRect(px + 7, 3, 1, 9); // 窗框
    }
  }

  function drawAmbient(now) {
    for (const ob of map.objects) {
      const r = objRect(ob);
      if (SLEEPERS.includes(ob.id)) { // 睡覺的人頭上冒 z
        g.font = '12px "Pixel Font", monospace';
        g.textAlign = 'center';
        g.textBaseline = 'alphabetic';
        for (let k = 0; k < 3; k += 1) {
          const p = ((now / 2400) + k / 3) % 1;
          g.fillStyle = `rgba(255,255,255,${(1 - p) * 0.9})`;
          g.fillText('z', r.x1 - 2 + p * 6, r.y0 - 1 - p * 12);
        }
      }
      if (ob.id === 'vending') { // 販賣機的小燈
        g.fillStyle = Math.floor(now / 500) % 2 ? '#7fffa0' : '#1d4a2a';
        g.fillRect(r.x1 - 5, r.y0 + 3, 2, 2);
      }
      if (SCREENS[ob.id]) { // 螢幕的光微微閃
        g.fillStyle = `rgba(160,200,255,${0.25 + 0.15 * Math.sin(now / 300 + r.x0)})`;
        g.fillRect(r.x0 + 3, r.y0 + 3, r.x1 - r.x0 - 6, 4);
      }
    }
  }

  const fog = document.createElement('canvas');
  const fg = fog.getContext('2d');
  let flickerUntil = 0;
  function drawLighting(st, now) {
    let base = ROOM_DARK[roomId] ?? 0.5;
    if (roomId === 'hall' && st.flags.hall_lit) {
      base = 0.28;
      if (now > flickerUntil && Math.random() < 0.006) flickerUntil = now + 90 + Math.random() * 160; // 日光燈閃一下
      if (now < flickerUntil) base = 0.7;
    }
    const a = darkness(base, st.clock);
    if (a <= 0.02) return;
    if (fog.width !== canvas.width || fog.height !== canvas.height) { fog.width = canvas.width; fog.height = canvas.height; }
    fg.globalCompositeOperation = 'source-over';
    fg.clearRect(0, 0, fog.width, fog.height);
    fg.fillStyle = `rgba(6,8,24,${a})`;
    fg.fillRect(0, 0, fog.width, fog.height);
    fg.globalCompositeOperation = 'destination-out';
    const lights = [{ x: pos.x, y: pos.y - 2, r: 46 }]; // 手機手電筒
    for (const ob of map.objects) {
      const L = LIGHTS[ob.id];
      if (!L) continue;
      const r = objRect(ob);
      lights.push({ x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2, r: L[1] * (1 + 0.06 * Math.sin(now / 260 + r.x0)), color: L[0] });
    }
    if (roomId === 'hall' && !st.flags.hall_lit) { // 緊急出口的綠燈
      for (const d of map.doors) lights.push({ x: (d.x + 0.5) * TILE, y: (d.y + 0.5) * TILE, r: 20, color: '#3dff8a' });
    }
    for (const L of lights) {
      const gr = fg.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
      gr.addColorStop(0, 'rgba(0,0,0,1)');
      gr.addColorStop(0.55, 'rgba(0,0,0,.7)');
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      fg.fillStyle = gr;
      fg.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
    }
    g.drawImage(fog, 0, 0);
    g.save();
    g.globalCompositeOperation = 'lighter';
    for (const L of lights) {
      if (!L.color) continue;
      const gr = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r * 0.8);
      gr.addColorStop(0, hexA(L.color, 0.22 * a + 0.04));
      gr.addColorStop(1, hexA(L.color, 0));
      g.fillStyle = gr;
      g.fillRect(L.x - L.r, L.y - L.r, L.r * 2, L.r * 2);
    }
    g.restore();
  }

  // 名牌：浮在靠近的物件上方（DOM，字才清楚）
  function placePrompt() {
    if (!near || paused()) { prompt.classList.remove('on'); return; }
    const res = resolveObject(content, roomId, near.id);
    prompt.textContent = `[E] ${res?.name ?? near.id}`;
    const r = objRect(near);
    prompt.style.left = `${((r.x0 + r.x1) / 2) * scale}px`;
    prompt.style.top = `${Math.max(r.y0 * scale - 6, 14)}px`;
    prompt.classList.add('on');
  }

  syncRoom();
  if (!map) loadRoom(content.rooms.start, null);
  requestAnimationFrame(frame);

  // 除錯用：?debug=1 時掛出來，方便在 console 檢查位置
  if (debug) window.__world = { get room() { return roomId; }, get pos() { return { ...pos }; }, step, teleport: (x, y) => { pos = { x, y }; } };
}
