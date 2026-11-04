// HUD：時鐘、任務欄、小地圖、AI 助教、手機未讀、60 秒自言自語（WP6）。
// 只讀狀態、只送動作。美術全部用 CSS 與 Canvas 程式畫，沒有外部圖與字型。
import { MINIMAP_COLS, MINIMAP_ROWS, minimapCells, addVisited, taskText, pickTargets, quotaText, createIdleTracker, clockDelta } from './logic.js';

const VISITED_KEY = 'latia-mid:visited:v1';
const readVisited = () => { try { return JSON.parse(localStorage.getItem(VISITED_KEY)) || []; } catch { return []; } };
const writeVisited = (arr) => { try { localStorage.setItem(VISITED_KEY, JSON.stringify(arr)); } catch { /* 拿不到就只留在記憶體 */ } };

// 像素圖示：每個字元一格，'.' 是透明
const ICONS = {
  phone: ['.######.', '#......#', '#.####.#', '#.####.#', '#.####.#', '#.####.#', '#......#', '#..##..#', '.######.'],
  robot: ['...##...', '..####..', '.######.', '##.##.##', '########', '########', '.#.##.#.', '.#....#.'],
};
function drawIcon(canvas, name, color, px = 3) {
  const rows = ICONS[name];
  canvas.width = rows[0].length * px;
  canvas.height = rows.length * px;
  const g = canvas.getContext('2d');
  g.fillStyle = color;
  rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') g.fillRect(x * px, y * px, px, px); }));
}

const SHORT = { r401: '401', hall: '走廊', pantry: '茶水', r503: '503', office: '系辦', lab: '電腦', floor1: '一樓' };

export function initHud(ctx, root) {
  const { game, content, bus, send } = ctx;
  const texts = content.texts;
  const hints = content.hints;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./hud.css', import.meta.url).href;
  document.head.append(link);

  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const roomNames = Object.fromEntries(content.rooms.list.map((r) => [r.id, r.name.split('（')[0]]));

  // ---------- 版面 ----------
  const bar = el('div', 'hd');
  const clock = el('div', 'hd-clock');
  const clockTime = el('span', 'hd-clock-time', '--:--');
  const clockPlus = el('span', 'hd-clock-plus');
  clock.append(el('span', 'hd-clock-label', '現在'), clockTime, clockPlus);

  const task = el('div', 'hd-task');
  const taskBody = el('span', 'hd-task-body');
  task.append(el('span', 'hd-task-tag', '目標'), taskBody);

  const mapCanvas = el('canvas', 'hd-map-canvas');

  const aiBtn = el('button', 'hd-ai');
  aiBtn.type = 'button';
  const aiIcon = el('canvas', 'hd-icon');
  drawIcon(aiIcon, 'robot', '#7fe3ff');
  const aiQuota = el('span', 'hd-ai-quota');
  aiBtn.append(aiIcon, el('span', 'hd-ai-label', 'AI 助教'), aiQuota);

  const phoneBtn = el('button', 'hd-phone');
  phoneBtn.type = 'button';
  const phoneIcon = el('canvas', 'hd-icon');
  drawIcon(phoneIcon, 'phone', '#f4f1de');
  phoneBtn.title = texts.phoneBadge;
  phoneBtn.append(phoneIcon, el('span', 'hd-phone-badge', '1'), el('span', 'hd-phone-text', texts.phoneBadge));

  const bubble = el('div', 'hd-bubble');
  bubble.hidden = true;
  const bubbleWho = el('div', 'hd-bubble-who');
  const bubbleText = el('div', 'hd-bubble-text');
  const bubbleMeta = el('div', 'hd-bubble-meta');
  bubble.append(bubbleWho, bubbleText, bubbleMeta);

  const left = el('div', 'hd-left');
  left.append(clock, mapCanvas);
  const mid = el('div', 'hd-mid');
  mid.append(task);
  const right = el('div', 'hd-right');
  right.append(aiBtn, phoneBtn);
  bar.append(left, mid, right);
  root.append(bar, bubble);

  // HUD 疊在謎題浮層上面（解題時也能問助教），浮層要往下讓開：把 HUD 底部位置交給 CSS 的 --hud-h
  const syncHudH = () => document.documentElement.style.setProperty('--hud-h', `${Math.max(0, Math.ceil(bar.getBoundingClientRect().bottom))}px`);
  syncHudH();
  window.addEventListener('resize', syncHudH);
  window.addEventListener('scroll', syncHudH, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(syncHudH).observe(bar);

  // ---------- 去過的房間 ----------
  let visited = new Set(readVisited());
  const markVisited = (id) => {
    if (!id || visited.has(id)) return;
    visited = addVisited(visited, id);
    writeVisited([...visited]);
  };

  // ---------- 小地圖 ----------
  const CELL = 18, GAP = 3, PAD = 3, ZOOM = 2; // 畫布就是顯示尺寸（不靠 CSS 縮放），文字才不會糊
  const MAP_W = PAD * 2 + MINIMAP_COLS * CELL + (MINIMAP_COLS - 1) * GAP;
  const MAP_H = PAD * 2 + MINIMAP_ROWS * CELL + (MINIMAP_ROWS - 1) * GAP;
  mapCanvas.width = MAP_W * ZOOM;
  mapCanvas.height = MAP_H * ZOOM;
  const mg = mapCanvas.getContext('2d');
  function drawMap(current, target) {
    mg.setTransform(ZOOM, 0, 0, ZOOM, 0, 0);
    mg.imageSmoothingEnabled = false;
    mg.fillStyle = '#0b0d12';
    mg.fillRect(0, 0, MAP_W, MAP_H);
    mg.strokeStyle = '#343a4a';
    mg.lineWidth = 1;
    mg.strokeRect(0.5, 0.5, MAP_W - 1, MAP_H - 1);
    const blink = Math.floor(performance.now() / 400) & 1;
    for (const c of minimapCells({ visited, current, target, names: roomNames })) {
      const x = PAD + c.col * (CELL + GAP);
      const y = PAD + c.row * (CELL + GAP);
      const w = c.span * CELL + (c.span - 1) * GAP;
      mg.fillStyle = c.seen ? (c.id === 'hall' ? '#3a4054' : '#4b5470') : '#1c2030';
      mg.fillRect(x, y, w, CELL);
      mg.fillStyle = c.seen ? '#2b3040' : '#12141c';
      mg.fillRect(x, y + CELL - 3, w, 3);
      if (c.target) {
        mg.strokeStyle = blink ? '#ffe27a' : '#f0b429';
        mg.lineWidth = 2;
        mg.strokeRect(x + 1, y + 1, w - 2, CELL - 2);
      }
      mg.fillStyle = c.seen ? '#dfe3f0' : '#6a7088';
      mg.font = '6px "Pixel Font", "Microsoft JhengHei", sans-serif'; // 乘上 ZOOM 是 12px，字型原生大小
      mg.textAlign = 'center';
      mg.textBaseline = 'middle';
      mg.fillText(c.seen ? (SHORT[c.id] ?? c.name.slice(0, 2)) : '？', x + w / 2, y + CELL / 2 - 1);
      if (c.here) {
        mg.fillStyle = '#e56b6f';                       // 目前所在：左上角紅點
        mg.fillRect(x + 1, y + 1, 4, 4);
        mg.fillStyle = '#fff';
        mg.fillRect(x + 2, y + 2, 1, 1);
      }
    }
  }

  // ---------- 泡泡（AI 助教、自言自語） ----------
  let bubbleTimer = null;
  function hideBubble() { bubble.hidden = true; }
  function showBubble(kind, who, text, meta) {
    bubble.className = `hd-bubble ${kind}`;
    bubbleWho.textContent = who;
    bubbleText.textContent = text;
    bubbleMeta.textContent = meta || '';
    bubble.hidden = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(hideBubble, kind.startsWith('ai') ? 9000 : 6500);
  }
  bubble.addEventListener('click', hideBubble);

  // ---------- 時鐘：變動時跳一下並顯示 +N ----------
  let lastClock = null;
  function updateClock() {
    const now = game.clockText();
    if (lastClock != null && now !== lastClock) {
      clock.classList.remove('jump');
      void clock.offsetWidth; // 重播動畫
      clock.classList.add('jump');
      const d = clockDelta(lastClock, now);
      clockPlus.textContent = d > 0 ? `+${d}` : '';
      clockPlus.classList.remove('on');
      void clockPlus.offsetWidth;
      if (d > 0) clockPlus.classList.add('on');
    }
    clockTime.textContent = now;
    lastClock = now;
    clock.classList.toggle('late', game.getState().clock >= texts.clock.dawn - 60);
  }

  // ---------- 卡關 60 秒自言自語 ----------
  const idle = createIdleTracker((hints.idleSeconds ?? 60) * 1000);
  setInterval(() => {
    if (game.getState().phase !== 'playing') return;
    const pid = idle.check(Date.now());
    const line = pid && hints.puzzles[pid]?.idle;
    if (line) showBubble('idle', '（自言自語）', `「${line}」`, '');
  }, 1000);

  // ---------- 重畫 ----------
  let currentTarget = null;
  function render() {
    const st = game.getState();
    markVisited(st.room);
    updateClock();
    const { puzzle, other } = pickTargets(game, content);
    currentTarget = puzzle?.room ?? null;
    taskBody.textContent = taskText({
      puzzle, other, phase: st.phase,
      roomName: puzzle ? roomNames[puzzle.room] : '',
      otherRoomName: other ? roomNames[other.room] : '',
    });
    aiQuota.textContent = quotaText(st.aiQuota, hints.aiQuota);
    aiBtn.classList.toggle('empty', st.aiQuota <= 0);
    aiBtn.disabled = st.phase !== 'playing';
    phoneBtn.disabled = st.phase !== 'playing' && st.phase !== 'finale';
    idle.track(st.phase === 'playing' && puzzle ? puzzle.id : null, Date.now());
  }

  // ---------- 按鈕 ----------
  aiBtn.addEventListener('click', () => send({ type: 'HINT' }));
  phoneBtn.addEventListener('click', () => {
    // 整晚點：核心回「等交完再看」；報告交完後（finale）就是真的點開未讀，核心依圖鑑門檻回應
    if (game.getState().phase === 'finale') send({ type: 'FINALE', choice: 'unread' });
    else send({ type: 'PHONE' });
  });

  // ---------- 事件 ----------
  bus.on('hint', (ev) => {
    if (!ev.text) return showBubble('ai', 'AI 助教', '現在沒有需要提示的關卡。', '');
    showBubble(ev.quotaOut ? 'ai out' : 'ai', 'AI 助教', ev.text, ev.quotaOut ? 'AI 額度已用完' : `剩餘 ${ev.quota}／${hints.aiQuota} 次`);
    idle.reset(idle.key, Date.now()); // 剛問過助教，卡關時間重算
  });
  const restartIdle = () => { hideBubble(); idle.reset(null, Date.now()); };
  bus.on('new_run', () => { visited = new Set(); writeVisited([]); restartIdle(); });
  bus.on('retry', restartIdle);
  bus.on('death', restartIdle);
  bus.on('solved', hideBubble);
  bus.on('_flush', render);

  // 目標框會閃，固定頻率重畫小地圖
  setInterval(() => drawMap(game.getState().room, currentTarget), 250);

  render();
  drawMap(game.getState().room, currentTarget);
}
