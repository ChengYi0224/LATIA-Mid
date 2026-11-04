// 第一人稱 3D 走動畫面：three.js 場景、滑鼠鎖定視角、WASD 走路、準星加 E／左鍵互動。
// 規則不在這裡：碰撞、門、互動判定沿用 logic.js（格子座標），視角與準星是 fps-logic.js。
// 只讀狀態、只送動作；謎題浮層、死因卡、結局、圖鑑、設定顯示期間釋放滑鼠並暫停輸入。
import { MAPS, TILE } from '../maps.js';
import { move, doorAt, doorAction, doorFront, spawnFor, resolveObject, planInteraction, blockedText } from '../world/logic.js';
import { WALK_SPEED, TURN_SPEED, AIM_REACH, applyLook, walkVector, aimedObject, spawnYaw, clamp } from './fps-logic.js';
import { promptFor, farText } from './prompt-logic.js';
import { buildRoom } from './room3d.js';
import { createStyle } from './style/index.js';
import { setStyle } from './kit.js';

const EYE = 1.45;
const SETTINGS_KEY = 'latia-fps-settings';
const DEFAULT_SETTINGS = { sens: 1, fov: 75 };

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? 'null');
    return { sens: clamp(Number(s?.sens) || 1, 0.2, 3), fov: clamp(Number(s?.fov) || 75, 60, 100) };
  } catch { return { ...DEFAULT_SETTINGS }; }
}
function saveSettings(s) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* 存不了就算了 */ } }

export function initWorld(ctx, root) {
  const { game, content, bus, send, debug } = ctx;
  const THREE = globalThis.THREE;

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
  wrap.tabIndex = -1;
  const stage = el('div', 'wd-stage');
  const roomName = el('div', 'wd-room');
  const crosshair = el('div', 'wd-cross');
  const prompt = el('div', 'wd-prompt');
  const toast = el('div', 'wd-toast');
  const vignette = el('div', 'wd-vignette');
  const flashEl = el('div', 'wd-flash');
  const help = el('div', 'wd-help', 'WASD 走動　滑鼠看　E 或左鍵互動　←→ 轉頭　Esc 放開滑鼠');
  const gear = el('button', 'wd-gear', '設定');
  gear.type = 'button';

  // 點一下進入（滑鼠鎖定）的提示層
  const gate = el('div', 'wd-gate');
  const gateTitle = el('strong', '', '點一下畫面開始');
  const gateSub = el('p', '', 'WASD 走動，滑鼠轉頭，準星對著東西按 E 或左鍵。按 Esc 可以放開滑鼠。');
  const gateAlt = el('button', 'wd-gate-alt', '滑鼠鎖定不能用？改成按住拖曳轉頭');
  gateAlt.type = 'button';
  gate.append(gateTitle, gateSub, gateAlt);

  // 設定面板
  const settings = loadSettings();
  const setPanelEl = el('div', 'wd-settings');
  setPanelEl.hidden = true;
  const sliderRow = (label, key, min, max, step, fmt) => {
    const row = el('label', 'wd-srow');
    const name = el('span', '', label);
    const val = el('span', 'wd-sval');
    const input = el('input');
    Object.assign(input, { type: 'range', min, max, step, value: settings[key] });
    const sync = () => { val.textContent = fmt(settings[key]); };
    input.addEventListener('input', () => { settings[key] = Number(input.value); sync(); saveSettings(settings); applyFov(); });
    sync();
    row.append(name, input, val);
    return row;
  };
  const closeSettingsBtn = el('button', 'primary', '關閉');
  closeSettingsBtn.type = 'button';
  setPanelEl.append(
    el('strong', '', '視角設定'),
    sliderRow('視角靈敏度', 'sens', 0.2, 3, 0.1, (v) => `${v.toFixed(1)}x`),
    sliderRow('視野（FOV）', 'fov', 60, 100, 1, (v) => `${v}°`),
    el('p', 'wd-shint', '覺得頭暈就把視野調小、靈敏度調低。'),
    closeSettingsBtn,
  );

  stage.append(crosshair, prompt, toast, vignette, flashEl, gear, gate, setPanelEl);
  wrap.append(roomName, stage, help);
  const modeBtn = el('button', 'wd-mode', '');
  modeBtn.type = 'button';
  modeBtn.hidden = true;
  wrap.append(modeBtn);
  if (debug) {
    const t = el('button', 'wd-panel-btn', '房間清單');
    t.type = 'button';
    t.addEventListener('click', () => setPanel(panel.hidden));
    wrap.append(t);
  }
  root.append(wrap);

  // ---------- three.js ----------
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    stage.append(el('div', 'wd-nogl', '這個瀏覽器開不了 3D（WebGL）。請換 Chrome、Edge 或 Firefox 再試。'));
    console.error(err);
    return;
  }
  const canvas = renderer.domElement;
  canvas.className = 'wd-canvas';
  stage.prepend(canvas);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;

  // 寫實貼圖（Poly Haven CC0，內嵌在 assets-data.js，離線可用）。檔案路徑後備關掉，只用內嵌的
  setStyle(createStyle(THREE, { baseUrl: '', useFiles: false }));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1b2238');
  scene.fog = new THREE.Fog('#1b2238', 5, 22);
  const camera = new THREE.PerspectiveCamera(settings.fov, 16 / 9, 0.05, 80);
  camera.rotation.order = 'YXZ';
  scene.add(camera);
  const flash = new THREE.PointLight('#fff1d0', 3.2, 9, 1.2); // 手機手電筒
  flash.position.set(0, -0.15, 0.1);
  camera.add(flash);
  const outline = new THREE.Box3Helper(new THREE.Box3(), 0xffe27a);
  outline.material.depthTest = false;
  outline.renderOrder = 20;
  outline.visible = false;
  scene.add(outline);
  const aimLight = new THREE.PointLight('#ffe9a8', 4, 2.5, 1.5); // 對準目標時跟著它的暖光
  aimLight.intensity = 0;
  scene.add(aimLight);

  function applyFov() { camera.fov = settings.fov; camera.updateProjectionMatrix(); }

  // ---------- 狀態 ----------
  let room = null;
  let roomId = null;
  let map = null;
  let pos = { x: 0, y: 0 };
  let yaw = 0, pitch = 0;
  let near = null;              // 準星對著的物件
  let modal = null;             // 自己的對話框（彩蛋、線索）
  let settingsOpen = false;
  let fallback = false;         // 滑鼠鎖定用不了時，改成按住拖曳轉頭
  let dragging = null;          // 拖曳視角：{ x, y, moved }
  const keys = new Set();
  let toastTimer = null;
  const seen = new Set();       // 這一局互動過的物件 id（名牌會標記）
  let hitTimer = null;
  let taught = false;           // 第一次對準東西的教學提示只跳一次
  let flashTimer = null;
  let near2 = null;             // 準星對到、但離太遠的物件
  let stepAcc = 0;
  let lastBump = 0;
  let bobT = 0;
  let kickUntil = 0;
  let size = { w: 0, h: 0 };

  const locked = () => document.pointerLockElement === canvas;
  const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 3200);
  };

  function refreshLabels() {
    const cur = game.currentPuzzle?.();
    room?.refreshLabels({
      solved: (pid) => game.isSolved(pid), available: (pid) => game.puzzleAvailable(pid), seen,
      targetId: cur && cur.room === roomId ? cur.object : null,
    });
  }

  function loadRoom(id, from) {
    room?.dispose();
    roomId = id;
    map = MAPS[id];
    room = buildRoom({ map, roomId: id, content });
    scene.add(room.group);
    refreshLabels();
    pos = spawnFor(map, from);
    yaw = spawnYaw(map, from);
    pitch = 0;
    keys.clear();
    near = null;
    outline.visible = false;
    roomName.textContent = content.rooms.byId[id]?.name ?? id;
    if (from) { // 換房間：黑一下再亮
      stage.classList.remove('wd-fade');
      void stage.offsetWidth;
      stage.classList.add('wd-fade');
    }
  }

  function fit() {
    const w = Math.max(320, window.innerWidth);
    const h = Math.max(300, window.innerHeight);
    if (w === size.w && h === size.h) return;
    size = { w, h };
    renderer.setSize(w, h);
    stage.style.width = `${w}px`;
    stage.style.height = `${h}px`;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', fit);
  new ResizeObserver(fit).observe(root);

  // 狀態裡的房間和畫面不同就換（清單、除錯跳關、重新開始都會走這裡）
  function syncRoom() {
    const st = game.getState();
    if (st.room !== roomId && MAPS[st.room]) loadRoom(st.room, roomId);
  }

  // ---------- 暫停判斷 ----------
  const overlayOpen = () => !!document.querySelector('#puzzle-root .pz-overlay, #screen-root .sc-overlay');
  const paused = () => game.getState().phase !== 'playing' || !!modal || overlayOpen() || settingsOpen;

  // ---------- 滑鼠鎖定與備用操作 ----------
  function tryLock() {
    if (fallback || paused() || locked()) return;
    try {
      const p = canvas.requestPointerLock();
      if (p && typeof p.catch === 'function') p.catch(() => showLockHelp());
    } catch { showLockHelp(); }
  }
  function showLockHelp() {
    gateTitle.textContent = '瀏覽器沒讓滑鼠鎖定';
    gateSub.textContent = '再點一次試試；還是不行就用下面的按鈕，改成按住滑鼠拖曳轉頭。';
    gateAlt.classList.add('urgent');
  }
  function setFallback(on) {
    fallback = on;
    if (on && locked()) document.exitPointerLock();
    modeBtn.hidden = !on;
    modeBtn.textContent = '切回滑鼠鎖定';
    dragging = null;
  }
  gate.addEventListener('click', (e) => { if (e.target === gateAlt) return; tryLock(); });
  gateAlt.addEventListener('click', () => setFallback(true));
  modeBtn.addEventListener('click', () => { setFallback(false); });
  document.addEventListener('pointerlockerror', showLockHelp);
  document.addEventListener('pointerlockchange', () => {
    if (locked()) { gateTitle.textContent = '點一下畫面開始'; gateSub.textContent = 'WASD 走動，滑鼠轉頭，準星對著東西按 E 或左鍵。按 Esc 可以放開滑鼠。'; gateAlt.classList.remove('urgent'); }
  });

  function openSettings() {
    settingsOpen = true;
    setPanelEl.hidden = false;
    if (locked()) document.exitPointerLock();
    keys.clear();
  }
  function closeSettings() {
    settingsOpen = false;
    setPanelEl.hidden = true;
    wrap.focus({ preventScroll: true });
  }
  gear.addEventListener('click', () => (settingsOpen ? closeSettings() : openSettings()));
  closeSettingsBtn.addEventListener('click', closeSettings);

  // ---------- 對話框（彩蛋、線索） ----------
  function closeModal() {
    if (!modal) return;
    modal.node.remove();
    modal = null;
    wrap.focus({ preventScroll: true });
  }
  function openModal({ title, text, buttons }) {
    closeModal();
    if (locked()) document.exitPointerLock();
    const node = el('div', 'wd-modal');
    const card = el('div', 'wd-card');
    card.append(el('strong', '', title), el('p', '', text));
    const row = el('div', 'wd-row');
    for (const b of buttons) {
      const btn = el('button', b.cls || '', b.label);
      btn.type = 'button';
      btn.addEventListener('click', () => { closeModal(); b.fn?.(); tryLock(); }); // 點按鈕算使用者操作，順便把滑鼠鎖回來
      row.append(btn);
    }
    card.append(row);
    node.append(card);
    stage.append(node);
    modal = { node };
    keys.clear();
    row.lastElementChild.focus({ preventScroll: true }); // 預設停在最後一顆（算了／關閉），不會手滑
  }

  // ---------- 互動：和 rooms-panel 清單點同一個物件送一樣的動作 ----------
  function interact() {
    if (!near) return;
    const res = resolveObject(content, roomId, near.id);
    const plan = res && planInteraction(res, game, content);
    if (!plan) return;
    bus.emit([{ type: 'ui_interact', id: near.id, kind: plan.do }]); // 給音效和台詞用
    keys.clear();
    seen.add(near.id);
    refreshLabels();
    kickUntil = performance.now() + 100;
    try { navigator.vibrate?.(30); } catch { /* 不支援就算了 */ }
    if (res.kind === 'clue') showToast(`記下來了：${res.clue.name}`);
    stage.classList.remove('wd-hit'); void stage.offsetWidth; stage.classList.add('wd-hit');
    clearTimeout(hitTimer); hitTimer = setTimeout(() => stage.classList.remove('wd-hit'), 500);
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

  // ---------- 鍵盤與滑鼠 ----------
  const KEYMAP = {
    KeyW: 'f', ArrowUp: 'f', KeyS: 'b', ArrowDown: 'b', KeyA: 'l', KeyD: 'r', ArrowLeft: 'tl', ArrowRight: 'tr',
  };
  const typing = (t) => t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
    if (settingsOpen) { if (e.key === 'Escape') { closeSettings(); e.preventDefault(); } return; }
    if (modal) {
      if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
      return;
    }
    if (paused()) return;
    const k = KEYMAP[e.code];
    if (k) {
      e.preventDefault();
      keys.add(k);
    } else if ((e.code === 'KeyE' || e.key === 'e' || e.key === 'E') && !e.repeat) {
      interact();
    }
  });
  window.addEventListener('keyup', (e) => { const k = KEYMAP[e.code]; if (k) keys.delete(k); });
  window.addEventListener('blur', () => keys.clear());

  document.addEventListener('mousemove', (e) => {
    if (paused()) return;
    if (locked()) {
      ({ yaw, pitch } = applyLook({ yaw, pitch }, e.movementX, e.movementY, settings.sens));
    } else if (fallback && dragging) {
      dragging.moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      ({ yaw, pitch } = applyLook({ yaw, pitch }, e.movementX, e.movementY, settings.sens));
    }
  });
  canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || paused()) return;
    if (locked()) { interact(); return; }
    if (fallback) dragging = { moved: 0 };
  });
  window.addEventListener('mouseup', () => {
    if (dragging && dragging.moved < 4 && !paused()) interact(); // 沒拖動就是點一下
    dragging = null;
  });

  // ---------- 事件 ----------
  bus.on('_flush', () => { syncRoom(); refreshLabels(); });
  const screenFlash = (kind) => {
    flashEl.className = 'wd-flash';
    void flashEl.offsetWidth;
    flashEl.className = `wd-flash ${kind}`;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { flashEl.className = 'wd-flash'; }, 450);
    try { navigator.vibrate?.(kind === 'ok' ? 30 : [40, 30, 40]); } catch { /* 不支援就算了 */ }
  };
  bus.on('stage_cleared', () => screenFlash('ok'));
  bus.on('solved', () => screenFlash('ok'));
  bus.on('wrong', () => screenFlash('bad'));
  bus.on('blocked', (ev) => { showToast(blockedText(ev, content)); kickUntil = performance.now() + 220; });
  bus.on('message', (ev) => { if (!overlayOpen()) showToast(ev.text); });
  bus.on('death', closeModal);
  bus.on('ending', closeModal);
  // 新的一局：就算還在同一個房間，也要回到起點（不然會接著站在上一局的位置）
  bus.on('new_run', () => { seen.clear(); closeModal(); keys.clear(); const st = game.getState(); if (MAPS[st.room]) loadRoom(st.room, null); });
  bus.on('debug', (ev) => { if (ev.did === 'jump') { const st = game.getState(); if (MAPS[st.room]) loadRoom(st.room, null); } });

  // ---------- 每一幀 ----------
  let last = performance.now();
  function step(ms) {
    syncRoom();
    if (!map) return;
    const isPaused = paused();
    if (isPaused) {
      keys.clear(); near = null; near2 = null; dragging = null;
      if (locked()) document.exitPointerLock();
      return;
    }
    const now = performance.now();
    const dt = ms / 1000;
    if (keys.has('tl')) yaw += TURN_SPEED * dt;
    if (keys.has('tr')) yaw -= TURN_SPEED * dt;
    const input = { f: keys.has('f'), b: keys.has('b'), l: keys.has('l'), r: keys.has('r') };
    const v = walkVector(yaw, input, WALK_SPEED * dt);
    if (v.x || v.y) {
      const dist = Math.hypot(v.x, v.y);
      const n = Math.max(1, Math.ceil(dist / 2)); // 切小步，避免穿牆
      const before = pos;
      for (let i = 0; i < n; i += 1) pos = move(map, pos, v.x / n, v.y / n);
      const moved = Math.hypot(pos.x - before.x, pos.y - before.y);
      bobT += moved;
      stepAcc += moved;
      if (stepAcc > 14) { stepAcc = 0; ctx.sfx?.('step'); }
      if (moved < dist * 0.3 && now - lastBump > 380) { lastBump = now; kickUntil = now + 160; ctx.sfx?.('bump'); }
      const door = doorAt(map, pos);
      if (door) {
        const from = roomId;
        send(doorAction(roomId, door, game.getState()));
        if (roomId === from) { pos = doorFront(map, door); keys.clear(); } // 被擋下：退回門前、放開按鍵，訊息由 blocked 事件顯示
      }
    }
    near = aimedObject(map, pos, yaw, pitch);
    near2 = near ? null : aimedObject(map, pos, yaw, pitch, AIM_REACH * 2.5);
  }

  const bobAmount = () => (keys.has('f') || keys.has('b') || keys.has('l') || keys.has('r') ? 1 : 0);
  function frame(t) {
    const ms = Math.min(50, t - last);
    last = t;
    step(ms);
    render(t);
    requestAnimationFrame(frame);
  }

  function render(now) {
    if (!room) return;
    const st = game.getState();
    const bob = bobAmount() ? Math.sin(bobT * 0.55) * 0.025 : 0;
    const kick = now < kickUntil ? (Math.random() - 0.5) * 0.05 : 0;
    camera.position.set(pos.x / TILE, EYE + bob, pos.y / TILE);
    camera.rotation.set(pitch + kick, yaw + kick * 0.6, 0);
    room.update({ scene, camera, st, now });

    const entry = near && room.entries.find((e) => e.ob === near);
    outline.visible = !!entry;
    if (entry) {
      outline.box.copy(entry.box).expandByScalar(0.03);
      outline.material.color.setHSL(0.13, 1, 0.62 + 0.18 * Math.sin(now / 160));
    }
    const far = !entry && near2 ? room.entries.find((e) => e.ob === near2) : null;
    const info = entry && !paused()
      ? promptFor(entry.res, { id: near.id, seen, solved: (pid) => game.isSolved(pid), available: (pid) => game.puzzleAvailable(pid) })
      : null;
    crosshair.className = `wd-cross${info ? ` on ${info.state}` : far && !paused() ? ' far' : ''}`;
    if (info) {
      prompt.textContent = info.text;
      prompt.className = `wd-prompt on ${info.state}`;
      if (!taught) { taught = true; showToast('準星變黃就可以按 E'); }
    } else if (far && !paused()) {
      prompt.textContent = farText(far.res?.name ?? far.ob.id);
      prompt.className = 'wd-prompt on far';
    } else prompt.className = 'wd-prompt';
    aimLight.intensity = info ? 4 : 0; // 不切 visible，免得燈數變了 three.js 重編 shader
    if (entry) aimLight.position.set((entry.box.min.x + entry.box.max.x) / 2, Math.min(entry.box.max.y, 1.6) + 0.1, (entry.box.min.z + entry.box.max.z) / 2).addScaledVector(new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)), 0.5);

    // 提示層：沒鎖定、沒暫停、沒用拖曳模式時，請玩家點一下
    gate.hidden = !(!locked() && !paused() && !fallback);
    gear.hidden = locked();
    renderer.render(scene, camera);
  }

  fit();
  syncRoom();
  if (!map) loadRoom(content.rooms.start, null);
  requestAnimationFrame(frame);

  // 除錯用：?debug=1 時掛出來，方便在 console 檢查位置與視角
  if (debug) {
    window.__world = {
      get room() { return roomId; }, get pos() { return { ...pos }; }, get yaw() { return yaw; }, get pitch() { return pitch; },
      get aimed() { return near?.id ?? null; }, get fallback() { return fallback; }, step, interact,
      teleport: (x, y) => { pos = { x, y }; },
      look: (y, p = 0) => { yaw = y; pitch = p; },
      setFallback,
    };
  }
}
