// 程式畫的像素圖：地圖物件、地板、牆、門、主角。沒有外部素材時用這些；
// assets.js 填了 src 就改用圖片（由 index.js 判斷），燈光一樣疊在最上面。
// 座標單位是畫布像素，1 格 = 16。每個物件畫在自己的格子範圍內（寬 w、高 h）。

export const PAL = {
  ol: '#1b1a22', shadow: 'rgba(0,0,0,.28)',
  wood: '#9c6b43', woodD: '#6b4428', woodL: '#c08a5a',
  metal: '#8b93a7', metalD: '#5d6478', metalL: '#c3c9d6',
  paper: '#f2ede0', paperD: '#cfc6ae', ink: '#4a4f63',
  screen: '#18233f', glow: '#7fb2ff', glowL: '#c4dcff',
  red: '#d94f4f', redD: '#8e2f33', green: '#3ec28f', greenD: '#21765a',
  yellow: '#f0d040', orange: '#f09a3e', pink: '#e08bb0', purple: '#7b5ea7', purpleD: '#56407a',
  white: '#f4f4f4', black: '#15161c', skin: '#f2c9a0', hair: '#3a2a2a', blue: '#3d5fa8', blueD: '#2a4277',
  cork: '#c79a5e', corkD: '#a37a45', gold: '#d9b44a', goldD: '#9c7a26',
};
const P = PAL;

// 決定性的小雜訊（紋理用），同一格永遠一樣
const hash = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};

function pen(g, ox, oy) {
  return (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(ox + x, oy + y, w, h); };
}

// ---------- 共用零件 ----------
// 桌子：桌面在 top～top+th，下面四隻腳（從正面看兩隻）
function desk(r, w, top = 7, th = 5, color = P.wood) {
  r(1, 15, w - 2, 1, P.shadow);
  r(1, top + th, 2, 15 - top - th, P.woodD);
  r(w - 3, top + th, 2, 15 - top - th, P.woodD);
  r(0, top, w, th, P.ol);
  r(1, top, w - 2, th - 1, color);
  r(1, top, w - 2, 1, P.woodL);
}
// 螢幕（桌上型）：左上角 (x, y)，寬 w
function monitor(r, x, y, w = 10, h = 7, lines = true, t = 0) {
  r(x, y, w, h, P.ol);
  r(x + 1, y + 1, w - 2, h - 2, P.screen);
  if (lines) {
    for (let i = 0; i < h - 3; i += 2) r(x + 2, y + 2 + i, Math.max(2, (w - 4) - ((i * 3) % 4)), 1, i % 4 ? P.green : P.glow);
  }
  r(x + w / 2 - 1, y + h, 2, 1, P.metalD);
  r(x + w / 2 - 2, y + h + 1, 4, 1, P.metalD);
}
// 牆上的紙或板子
function framed(r, x, y, w, h, bg, frame = P.ol) {
  r(x, y, w, h, frame);
  r(x + 1, y + 1, w - 2, h - 2, bg);
}
function lines(r, x, y, w, n, c = P.ink, gap = 2) {
  for (let i = 0; i < n; i += 1) r(x, y + i * gap, Math.max(2, w - ((i * 5) % 4)), 1, c);
}
// 立牌（海報架）：海報在上面，下面兩隻腳
function easel(r, poster, inner) {
  r(3, 15, 10, 1, P.shadow);
  r(4, 11, 1, 5, P.woodD); r(11, 11, 1, 5, P.woodD);
  framed(r, 2, 1, 12, 11, poster);
  inner?.();
}
// 椅子（從上方斜看）
function chair(r, x = 4, y = 6, c = P.metalD) {
  r(x, y, 8, 3, c); r(x, y, 8, 1, P.metal);
  r(x + 1, y + 3, 6, 4, c); r(x + 1, y + 3, 6, 1, P.metal);
  r(x + 1, y + 7, 1, 2, P.ol); r(x + 6, y + 7, 1, 2, P.ol);
}
// 睡著的人：趴在桌上（從正面看到頭頂和手臂）
function sleeper(r, hat = null) {
  desk(r, 16, 9, 4);
  r(3, 7, 10, 3, P.blue); // 手臂
  r(5, 3, 6, 5, P.ol);
  r(5, 3, 6, 4, hat ? P.skin : P.hair); // 頭
  if (hat) { r(4, 2, 8, 2, hat); r(4, 4, 8, 1, P.ol); }
  else r(5, 6, 6, 1, P.skin);
}

// ---------- 各物件 ----------
const SPRITES = {
  // ===== 401 =====
  laptop(r, w, h, t) {
    desk(r, w);
    r(3, 1, 10, 7, P.ol); r(4, 2, 8, 5, P.screen); // 螢幕
    const blink = Math.floor(t / 600) % 2;
    r(5, 3, 5, 1, P.glow); r(5, 5, 3, 1, P.glowL); if (blink) r(9, 5, 1, 1, P.white);
    r(2, 8, 12, 2, P.metalD); r(3, 8, 10, 1, P.metalL); // 鍵盤
  },
  c_laptop_note(r, w) {
    desk(r, w);
    r(4, 5, 7, 6, P.ol); r(5, 5, 5, 5, P.yellow); r(6, 7, 3, 1, P.ink); r(6, 9, 2, 1, P.ink); // 便利貼
    r(11, 8, 4, 1, P.blue); // 筆
  },
  lectern(r, w) {
    r(2, 15, w - 4, 1, P.shadow);
    r(3, 3, w - 6, 13, P.ol);
    r(4, 4, w - 8, 11, P.wood);
    r(4, 4, w - 8, 1, P.woodL);
    r(1, 2, w - 2, 3, P.ol); r(2, 2, w - 4, 2, P.woodL); // 桌面邊
    r(8, 8, w - 16, 4, P.woodD); r(w / 2 - 1, 9, 2, 2, P.gold); // 抽屜和鎖
  },
  c_exam_calc(r) { crumpled(r, '58'); },
  c_exam_stat(r) { crumpled(r, '61'); },
  c_syllabus(r) {
    framed(r, 3, 1, 10, 13, P.paper);
    lines(r, 5, 3, 6, 4);
    r(9, 10, 3, 3, P.red); // 印章
  },
  c_whiteboard(r) {
    framed(r, 1, 2, 14, 10, P.white, P.metalD);
    r(3, 4, 6, 1, P.blue); r(3, 6, 9, 1, P.red); r(3, 8, 4, 1, P.blue);
    r(2, 12, 12, 1, P.metal); // 板擦槽
  },
  e_whiteboard_role(r) {
    framed(r, 1, 2, 14, 10, P.white, P.metalD);
    for (let x = 5; x < 14; x += 4) r(x, 3, 1, 8, P.paperD);
    r(2, 5, 12, 1, P.paperD);
    r(2, 3, 2, 1, P.blue); r(6, 3, 2, 1, P.blue); r(10, 3, 2, 1, P.red);
    r(2, 12, 12, 1, P.metal);
  },
  e_timetable(r) {
    framed(r, 2, 1, 12, 12, P.paper);
    const cols = ['#a7c4a0', '#e9b6b6', '#b6c8e9', '#f0d58a'];
    for (let y = 0; y < 4; y += 1) for (let x = 0; x < 4; x += 1) if (hash(x, y, 3) > 0.35) r(3 + x * 2.5, 2 + y * 2.6, 2, 2, cols[(x + y) % 4]);
  },
  door(r) { doorShape(r, 0, P.woodD, P.wood); },
  e_desk(r, w) {
    desk(r, w);
    r(1, 5, 6, 3, P.paper); r(2, 4, 5, 3, P.paperD); // 亂丟的紙
    r(9, 3, 4, 5, P.ol); r(10, 4, 2, 3, P.white); // 杯子
    r(6, 8, 6, 1, P.black); r(12, 9, 3, 1, P.black); // 電線
  },
  e_tablet(r, w, h, t) {
    desk(r, w);
    r(3, 3, 10, 7, P.ol); r(4, 4, 8, 5, P.screen);
    r(7, 5, 1, 3, P.white); r(8, 6, 1, 1, P.white); // 播放鍵
    if (Math.floor(t / 900) % 2) r(4, 8, 8 * ((t / 9000) % 1), 1, P.red);
  },
  e_exam(r, w) {
    desk(r, w);
    for (let i = 0; i < 4; i += 1) r(3 + i, 7 - i, 9, 2, i % 2 ? P.paperD : P.paper);
    r(4, 4, 7, 1, P.ink);
  },
  e_citation(r, w) {
    desk(r, w);
    r(2, 3, 12, 6, P.ol); r(3, 3, 5, 5, P.paper); r(8, 3, 5, 5, P.paper); r(8, 3, 1, 5, P.paperD); // 打開的書
    lines(r, 4, 4, 3, 2); lines(r, 9, 4, 3, 2);
    r(10, 6, 3, 1, P.yellow); // 螢光筆
  },
  phone(r, w, h, t) {
    r(3, 14, 10, 2, P.shadow);
    r(4, 8, 8, 6, P.woodD); r(4, 8, 8, 1, P.woodL); // 小板凳
    r(5, 2, 6, 7, P.ol); r(6, 3, 4, 5, Math.floor(t / 700) % 2 ? P.glow : P.screen);
    r(10, 1, 2, 2, P.red); // 未讀紅點
  },
  hint(r, w, h, t) { // AI 助教：小機器人終端機
    r(3, 14, 10, 2, P.shadow);
    r(7, 0, 2, 2, P.ol); r(7, 0, 2, 1, Math.floor(t / 500) % 2 ? P.red : P.yellow); // 天線
    r(3, 2, 10, 8, P.ol); r(4, 3, 8, 6, P.metalL);
    r(5, 4, 6, 4, P.screen); r(6, 5, 1, 2, P.glow); r(9, 5, 1, 2, P.glow); // 臉
    r(5, 10, 6, 5, P.metalD); r(6, 11, 4, 1, P.yellow);
  },
  deco_chair(r) { chair(r, 4, 4, P.woodD); },

  // ===== 走廊 =====
  switch_panel(r) {
    framed(r, 2, 3, 12, 8, P.paper, P.metalD);
    for (let i = 0; i < 6; i += 1) { r(3 + i * 2, 5, 1, 4, P.ol); r(3 + i * 2, 5 + (i % 2) * 2, 1, 2, P.white); }
  },
  c_floorplan(r) {
    framed(r, 1, 2, 14, 11, '#dff1e4', P.greenD);
    r(3, 4, 10, 1, P.greenD); r(3, 4, 1, 6, P.greenD); r(12, 4, 1, 6, P.greenD);
    r(5, 7, 4, 1, P.red); r(8, 6, 1, 3, P.red); // 箭頭
  },
  c_plaque(r) {
    r(2, 4, 12, 8, P.goldD); r(3, 5, 10, 6, P.gold); lines(r, 4, 6, 8, 3, P.goldD);
  },
  e_yearbook(r) {
    easel(r, P.pink, () => { r(5, 4, 6, 4, P.ol); r(6, 5, 4, 2, P.metal); r(7, 5, 2, 2, P.screen); r(9, 3, 1, 1, P.ol); }); // 相機
  },
  e_survey(r) {
    easel(r, P.white, () => {
      for (let y = 0; y < 7; y += 1) for (let x = 0; x < 7; x += 1) if (hash(x, y, 9) > 0.5 || (x < 2 && y < 2) || (x > 4 && y < 2) || (x < 2 && y > 4)) r(4 + x, 3 + y, 1, 1, P.ol);
    });
  },
  deco_bench(r, w) { bench(r, w); },
  deco_bench2(r, w) { bench(r, w); },

  // ===== 茶水間 =====
  vending(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(2, 0, w - 4, 16, P.ol);
    r(3, 1, w - 6, 14, P.red);
    r(3, 1, w - 6, 1, '#f08a8a');
    r(4, 2, 17, 8, P.ol); // 商品窗
    const cans = ['#6b3f2a', '#6b3f2a', '#c43a2e', '#e8e8e8', '#3a8fd9', '#f0b429'];
    for (let i = 0; i < 6; i += 1) { r(5 + (i % 3) * 5, 3 + Math.floor(i / 3) * 4, 3, 3, cans[i]); r(5 + (i % 3) * 5, 3 + Math.floor(i / 3) * 4, 3, 1, P.white); }
    r(23, 3, 4, 2, P.black); r(24, 6, 2, 3, P.metalL); // 投幣口、按鈕
    r(6, 11, 14, 3, P.black); // 出貨口
  },
  c_pantry_board(r) {
    framed(r, 1, 2, 14, 10, P.white, P.metalD);
    const c = ['#6b3f2a', '#6b3f2a', '#c43a2e', '#3a8fd9'];
    for (let i = 0; i < 4; i += 1) { r(3 + i * 3, 5, 2, 4, c[i]); r(3 + i * 3, 4, 2, 1, P.metal); }
  },
  e_delivery(r, w) {
    desk(r, w);
    r(3, 0, 10, 8, P.ol); r(4, 1, 8, 6, P.orange); r(4, 1, 8, 1, '#f7c28a'); r(6, 3, 4, 2, P.white); // 外送袋
    r(12, 5, 3, 4, P.ol); r(12, 6, 3, 2, P.orange); // 手機
  },
  e_drinks(r) {
    easel(r, P.paper, () => {
      r(6, 3, 5, 7, P.ol); r(7, 4, 3, 5, '#e7c9a0'); r(7, 7, 3, 2, P.ol); r(8, 1, 1, 3, P.pink); // 珍奶
      r(3, 3, 2, 1, P.red); r(3, 5, 2, 1, P.red);
    });
  },
  deco_sofa(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(0, 3, w, 12, P.ol);
    r(1, 4, w - 2, 5, P.purpleD); // 椅背
    r(1, 9, w - 2, 5, P.purple);
    for (let x = 16; x < w - 1; x += 16) r(x, 9, 1, 5, P.purpleD);
    r(0, 7, 3, 8, P.purpleD); r(w - 3, 7, 3, 8, P.purpleD); // 扶手
  },

  // ===== 503 =====
  bookshelf(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(1, 0, w - 2, 16, P.ol);
    r(2, 1, w - 4, 14, P.woodD);
    const cols = ['#c44f4f', '#3d5fa8', '#3ec28f', '#f0b429', '#7b5ea7', '#e8e8e8', '#f09a3e'];
    for (const shelfY of [1, 8]) {
      let x = 3;
      let i = shelfY;
      while (x < w - 4) {
        const bw = 2 + Math.floor(hash(x, shelfY, 5) * 2);
        const bh = 5 + Math.floor(hash(x, shelfY, 6) * 2);
        r(x, shelfY + 6 - bh, bw, bh, cols[(i += 3) % cols.length]);
        r(x, shelfY + 7 - bh, bw, 1, 'rgba(255,255,255,.35)');
        x += bw + 1;
      }
      r(2, shelfY + 6, w - 4, 1, P.wood);
    }
  },
  c_sleeptalk(r) { sleeper(r); },
  e_labsignup(r) {
    framed(r, 1, 2, 14, 11, P.cork, P.corkD);
    r(3, 4, 4, 3, P.white); r(8, 3, 5, 4, P.yellow); r(4, 8, 6, 3, P.white);
    r(4, 4, 1, 1, P.red); r(10, 3, 1, 1, P.red); r(6, 8, 1, 1, P.red);
  },
  e_seniorcode(r, w, h, t) {
    desk(r, w, 9, 4);
    monitor(r, 3, 1, 10, 7, true, t);
    r(4, 10, 8, 1, P.metalL);
  },
  e_format(r, w) {
    desk(r, w);
    r(3, 1, 10, 7, P.ol); r(4, 2, 8, 5, P.white); lines(r, 5, 3, 6, 2, P.ink); r(5, 5, 3, 1, P.red);
    r(2, 8, 12, 2, P.metalD);
  },
  deco_desk(r, w) {
    desk(r, w);
    if (w >= 32) { r(4, 4, 8, 3, P.paper); r(w - 12, 3, 6, 4, P.ol); r(w - 11, 4, 4, 2, P.screen); }
  },

  // ===== 系辦 =====
  keypad(r, w, h, t) {
    r(4, 2, 8, 12, P.ol); r(5, 3, 6, 10, P.metalD);
    r(6, 4, 4, 2, Math.floor(t / 700) % 2 ? P.green : P.greenD);
    for (let y = 0; y < 3; y += 1) for (let x = 0; x < 3; x += 1) r(5.5 + x * 2, 7 + y * 2, 1, 1, P.metalL);
  },
  c_trash_notice(r) {
    r(3, 15, 10, 1, P.shadow);
    r(4, 5, 8, 11, P.ol); r(5, 6, 6, 9, P.metal); r(4, 4, 8, 2, P.metalD);
    r(6, 7, 1, 7, P.metalL); r(9, 7, 1, 7, P.metalL);
    r(6, 1, 4, 4, P.ol); r(7, 2, 3, 3, P.paper); // 揉掉的公告露出來
  },
  e_printer(r, w, h, t) {
    r(1, 15, 14, 1, P.shadow);
    r(1, 5, 14, 10, P.ol); r(2, 6, 12, 8, P.metalL); r(2, 6, 12, 1, P.white);
    r(4, 9, 8, 2, P.black); // 出紙口
    r(5, 2, 6, 7, P.paper); r(6, 4, 4, 1, P.ink); // 卡住的紙
    r(12, 12, 1, 1, Math.floor(t / 400) % 2 ? P.red : P.redD);
  },
  e_studygroup(r, w) {
    desk(r, w);
    r(4, 2, 8, 9, P.ol); r(5, 3, 6, 7, P.paper); r(6, 2, 4, 2, P.metalD); lines(r, 6, 5, 4, 3);
  },

  // ===== 電腦教室 =====
  lab_pc(r, w, h, t) {
    desk(r, w, 9, 4);
    monitor(r, 2, 1, 12, 8, true, t);
    monitor(r, 18, 1, 12, 8, false, t);
    r(20, 3, 8, 1, P.red); r(20, 5, 6, 1, P.glow); // Moodle 頁
    r(6, 10, 20, 1, P.metalL);
  },
  e_restore(r, w, h, t) { desk(r, w, 9, 4); monitor(r, 3, 1, 10, 7, true, t); },
  e_sync(r, w, h, t) {
    desk(r, w, 9, 4); monitor(r, 3, 1, 10, 7, false, t);
    const a = Math.floor(t / 250) % 4; // 同步圈圈
    r(6, 3, 4, 3, P.white); r(6 + (a % 2) * 3, 3 + (a > 1 ? 2 : 0), 1, 1, P.glow);
  },
  e_usbseat(r, w) {
    desk(r, w, 6, 4);
    r(9, 4, 4, 2, P.blue); r(13, 4, 2, 2, P.metalL); // 隨身碟
    chair(r, 4, 10, P.metalD);
  },
  deco_row1(r, w, h, t) { pcRow(r, w, t); },
  deco_row2(r, w, h, t) { pcRow(r, w, t); },

  // ===== 一樓 =====
  broadcast(r, w, h, t) {
    r(1, 15, w - 2, 1, P.shadow);
    r(1, 6, w - 2, 9, P.ol); r(2, 7, w - 4, 7, P.metalD); r(2, 7, w - 4, 1, P.metal);
    for (let i = 0; i < 6; i += 1) { r(4 + i * 3, 8, 1, 5, P.black); r(3.5 + i * 3, 9 + ((i * 2 + Math.floor(t / 1200)) % 3), 2, 1, P.metalL); }
    r(23, 9, 3, 3, P.red); r(27, 9, 2, 2, P.green); // 按鈕
    r(9, 0, 1, 6, P.ol); r(8, 0, 3, 2, P.black); // 麥克風
  },
  c_broadcast_manual(r) { framed(r, 3, 2, 10, 12, P.paper); r(4, 3, 8, 2, P.red); lines(r, 5, 7, 6, 3); },
  c_guard(r) { sleeper(r, P.blueD); },
  e_guardpc(r, w) {
    desk(r, w, 10, 3);
    r(2, 1, 12, 10, P.ol); r(3, 2, 10, 8, '#d8d2bf'); r(4, 3, 8, 5, P.screen); r(5, 4, 4, 1, P.green); // 老電腦
  },
  e_bbq(r) {
    easel(r, '#f6d7b0', () => {
      r(5, 7, 6, 2, P.ol); r(4, 6, 8, 1, P.metalD); // 烤肉架
      r(5, 4, 2, 2, P.orange); r(8, 3, 2, 2, P.red); r(5, 9, 1, 2, P.ol); r(10, 9, 1, 2, P.ol);
    });
  },
  deco_counter(r, w) {
    r(1, 15, w - 2, 1, P.shadow);
    r(0, 3, w, 12, P.ol); r(1, 4, w - 2, 10, P.wood); r(0, 3, w, 2, P.woodL);
    for (let x = 12; x < w; x += 16) r(x, 6, 1, 8, P.woodD);
  },
};

function crumpled(r, score) {
  r(3, 12, 10, 2, P.shadow);
  r(2, 5, 12, 8, P.ol);
  r(3, 6, 10, 6, P.paper);
  r(3, 6, 4, 2, P.paperD); r(9, 10, 4, 2, P.paperD); r(7, 8, 2, 1, P.paperD);
  r(4, 9, 4, 1, P.ink);
  r(9, 7, 3, 2, P.red); // 紅筆分數
  r(score === '58' ? 12 : 11, 6, 1, 1, P.red);
}
function bench(r, w) {
  r(1, 14, w - 2, 1, P.shadow);
  r(0, 6, w, 6, P.ol);
  for (let y = 0; y < 2; y += 1) { r(1, 7 + y * 2, w - 2, 1, P.woodL); r(1, 8 + y * 2, w - 2, 1, P.wood); }
  r(3, 12, 2, 3, P.metalD); r(w - 5, 12, 2, 3, P.metalD);
}
function pcRow(r, w, t) {
  desk(r, w, 9, 4);
  for (let x = 2; x + 10 <= w; x += 16) monitor(r, x, 1, 11, 7, hash(x, 1, 2) > 0.5, t);
}
// 門（上牆或下牆上的門格、401 左上角的門）
function doorShape(r, y0, dark, light) {
  r(1, y0, 14, 16, P.ol);
  r(2, y0 + 1, 12, 15, light);
  r(3, y0 + 2, 10, 5, dark); r(3, y0 + 9, 10, 5, dark);
  r(11, y0 + 7, 2, 2, P.gold);
}

/** 畫物件；有這個 id 的程式圖就畫並回傳 true，沒有回傳 false（呼叫端改畫色塊）。 */
export function drawSprite(g, ob, rect, t) {
  const fn = SPRITES[ob.id];
  if (!fn) return false;
  const w = rect.x1 - rect.x0, h = rect.y1 - rect.y0;
  fn(pen(g, rect.x0, rect.y0), w, h, t);
  return true;
}
export const SPRITE_IDS = Object.keys(SPRITES);

// ---------- 地板與牆 ----------
// 每個房間一種地板：木地板、磁磚、黑白格、地毯、塑膠地磚、高架地板、磨石子
const FLOORS = {
  r401: 'planks', hall: 'tiles', pantry: 'checker', r503: 'carpet', office: 'lino', lab: 'panels', floor1: 'terrazzo',
};
const WALLS = { r401: 'brick', hall: 'paint', pantry: 'tilewall', r503: 'paint', office: 'paint', lab: 'paint', floor1: 'brick' };

const mix = (hex, f) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.max(0, Math.min(255, Math.round(v * f)));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
};

export function drawFloor(g, roomId, tx, ty, base) {
  const x = tx * 16, y = ty * 16;
  const r = pen(g, x, y);
  r(0, 0, 16, 16, base);
  switch (FLOORS[roomId]) {
    case 'planks': { // 木地板：橫向木條，接縫錯開
      for (let i = 0; i < 4; i += 1) {
        r(0, i * 4 + 3, 16, 1, mix(base, 0.82));
        const seam = Math.floor(hash(tx, ty * 4 + i, 1) * 16);
        r(seam, i * 4, 1, 3, mix(base, 0.86));
        if (hash(tx, ty * 4 + i, 2) > 0.6) r((seam + 6) % 14, i * 4 + 1, 3, 1, mix(base, 1.06));
      }
      break;
    }
    case 'tiles': // 大磁磚
      r(0, 15, 16, 1, mix(base, 0.85)); r(15, 0, 1, 16, mix(base, 0.85));
      r(1, 1, 3, 1, mix(base, 1.08));
      break;
    case 'checker':
      if ((tx + ty) % 2) r(0, 0, 16, 16, mix(base, 0.72));
      r(0, 0, 8, 8, (tx + ty) % 2 ? mix(base, 0.72) : mix(base, 1.04));
      r(8, 8, 8, 8, (tx + ty) % 2 ? mix(base, 0.72) : mix(base, 1.04));
      break;
    case 'carpet':
      for (let i = 0; i < 10; i += 1) r(Math.floor(hash(tx, ty, i) * 16), Math.floor(hash(ty, tx, i + 20) * 16), 1, 1, mix(base, i % 2 ? 0.85 : 1.1));
      break;
    case 'lino':
      r(0, 7, 16, 1, mix(base, 0.9)); r(0, 15, 16, 1, mix(base, 0.9));
      r((ty % 2) * 8, 0, 1, 7, mix(base, 0.9)); r(((ty + 1) % 2) * 8, 8, 1, 7, mix(base, 0.9));
      break;
    case 'panels':
      r(0, 0, 16, 1, mix(base, 1.1)); r(0, 0, 1, 16, mix(base, 1.1)); r(0, 15, 16, 1, mix(base, 0.8)); r(15, 0, 1, 16, mix(base, 0.8));
      r(3, 3, 1, 1, mix(base, 0.75)); r(12, 3, 1, 1, mix(base, 0.75)); r(3, 12, 1, 1, mix(base, 0.75)); r(12, 12, 1, 1, mix(base, 0.75));
      break;
    case 'terrazzo':
      for (let i = 0; i < 12; i += 1) r(Math.floor(hash(tx, ty, i) * 15), Math.floor(hash(ty, tx, i + 40) * 15), 1 + (i % 3 === 0), 1, i % 2 ? mix(base, 0.7) : mix(base, 1.15));
      break;
    default:
      if ((tx + ty) & 1) r(0, 0, 16, 16, 'rgba(0,0,0,.06)');
  }
}

export function drawWall(g, roomId, tx, ty, base, faceBelow) {
  const x = tx * 16, y = ty * 16;
  const r = pen(g, x, y);
  r(0, 0, 16, 16, base);
  switch (WALLS[roomId]) {
    case 'brick':
      for (let row = 0; row < 4; row += 1) {
        r(0, row * 4 + 3, 16, 1, mix(base, 0.75));
        const off = (row + ty) % 2 ? 4 : 12;
        r(off, row * 4, 1, 3, mix(base, 0.75));
        if (hash(tx, ty * 4 + row, 7) > 0.7) r((off + 3) % 14, row * 4 + 1, 3, 1, mix(base, 1.12));
      }
      break;
    case 'tilewall':
      for (let i = 0; i < 4; i += 1) { r(0, i * 4 + 3, 16, 1, mix(base, 0.85)); r(i * 4 + 3, 0, 1, 16, mix(base, 0.85)); }
      break;
    default: // 油漆牆：上淺下深、底下踢腳板
      r(0, 0, 16, 2, mix(base, 1.12));
      if (hash(tx, ty, 8) > 0.75) r(Math.floor(hash(tx, ty, 9) * 12), 6, 2, 3, mix(base, 0.9)); // 牆上的污漬
  }
  if (faceBelow) { r(0, 12, 16, 4, mix(base, 0.6)); r(0, 12, 16, 1, mix(base, 0.45)); } // 牆腳陰影／踢腳板
}

export function drawDoorTile(g, tx, ty) {
  const r = pen(g, tx * 16, ty * 16);
  doorShape(r, 0, '#5a3d24', '#8a6338');
}

// ---------- 主角（連帽衫學生）：四個方向，走路兩格 ----------
export function drawHero(g, x, y, facing, frame) {
  const r = pen(g, Math.round(x) - 5, Math.round(y) - 12);
  const moving = frame >= 0; // frame < 0 代表站著不動
  const step = moving ? frame % 2 : 0;
  r(1, 15, 9, 2, P.shadow);
  // 腳：上下走時兩腳輪流抬起；左右走時前後腳交換
  const side = facing === 'left' || facing === 'right';
  if (side) {
    const a = moving && step ? 2 : 0;
    r(2 + a, 12, 3, 3, '#3d4a7a'); r(6 - a, 12, 3, 3, '#2d3550');
    r(2 + a, 14, 3, 1, P.ol); r(6 - a, 14, 3, 1, P.ol);
  } else {
    const up1 = moving && step, up2 = moving && !step;
    r(2, 12, 3, up1 ? 2 : 3, '#2d3550'); r(6, 12, 3, up2 ? 2 : 3, '#2d3550');
    r(2, up1 ? 13 : 14, 3, 1, P.ol); r(6, up2 ? 13 : 14, 3, 1, P.ol);
  }
  // 身體（紅色連帽衫）
  r(1, 6, 9, 7, P.ol);
  r(2, 6, 7, 6, '#e56b6f');
  r(2, 11, 7, 1, '#b84a52');
  // 手（擺動）
  const arm = moving && step ? 1 : 0;
  if (facing === 'down' || facing === 'up') { r(0, 7 + arm, 2, 4, '#e56b6f'); r(9, 8 - arm, 2, 4, '#e56b6f'); }
  else r(facing === 'left' ? 6 : 3, 7 + arm, 2, 4, '#c85a60');
  // 頭
  r(1, 0, 9, 7, P.ol);
  r(2, 1, 7, 5, P.skin);
  r(2, 0, 7, 2, P.hair);
  if (facing === 'up') r(2, 0, 7, 6, P.hair);
  if (facing === 'left') { r(5, 1, 4, 4, P.hair); r(3, 3, 1, 1, P.ol); }
  if (facing === 'right') { r(2, 1, 4, 4, P.hair); r(7, 3, 1, 1, P.ol); }
  if (facing === 'down') { r(3, 3, 1, 2, P.ol); r(7, 3, 1, 2, P.ol); r(4, 5, 3, 1, '#d99a7a'); }
  // 背包帶
  if (facing === 'down') { r(3, 7, 1, 4, '#3a3f55'); r(7, 7, 1, 4, '#3a3f55'); }
  if (facing === 'up') r(3, 7, 5, 5, '#3a3f55');
}
