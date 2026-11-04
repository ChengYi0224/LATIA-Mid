// 3 個房間的格子地圖與物件位置（WP2）。key 是房間 id，和 content/rooms.json 一致。
// 單位是格（TILE 像素）。tiles：'#' 牆、'.' 地板、'D' 門。物件 id 對應：
//   謎題 → puzzles.json 的 object；彩蛋 → eggs.json 的 id；線索 → rooms.json 的 clue id；
//   另外有 door（401 大門）、phone、hint。deco 是純裝飾（不能互動，會擋路）。
// signs：不能互動的假門（只畫在牆上），{ x, y, text }，x、y 是北牆的格子。
// 目前都是程式畫的佔位色塊，WP7 之後可換素材。
export const TILE = 16;

// 物件：id、位置、顏色、圖示字（1 字）、寬高（格）、是否裝飾
const o = (id, x, y, color, icon, w = 1, h = 1) => ({ id, x, y, w, h, color, icon, solid: true, deco: false });
const deco = (id, x, y, color, w = 1, h = 1) => ({ id, x, y, w, h, color, icon: '', solid: true, deco: true });

// 依大小與門的位置產生外牆和地板；門在牆上，spawn 是門前面那一格
function room({ w, h, doors, objects, floor, wall, signs = [] }) {
  const grid = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => (x === 0 || y === 0 || x === w - 1 || y === h - 1 ? '#' : '.')));
  for (const d of doors) grid[d.y][d.x] = 'D';
  return { w, h, tiles: grid.map((r) => r.join('')), doors, objects, floor, wall, signs };
}

export const MAPS = {
  r401: room({
    w: 16, h: 11, floor: '#c9b48a', wall: '#6b5a45',
    doors: [{ x: 13, y: 10, to: 'hall' }],
    objects: [
      o('laptop', 3, 2, '#5b7fd1', '筆'),
      o('c_laptop_note', 4, 2, '#f2e07a', '條'),
      o('lectern', 7, 2, '#8a5a3c', '講', 2, 1),
      o('c_exam_calc', 2, 4, '#f0ece0', '考'),
      o('c_exam_stat', 4, 4, '#f0ece0', '考'),
      o('c_syllabus', 12, 0, '#d9d2b8', '綱'),
      o('c_whiteboard', 10, 0, '#f4f4f4', '白'),
      o('e_whiteboard_role', 6, 0, '#e8e8e8', '工'),
      o('e_timetable', 14, 0, '#a7c4a0', '課'),
      o('door', 1, 0, '#4a4a58', '門'),
      o('e_desk', 2, 6, '#9c7b57', '桌'),
      o('e_tablet', 5, 6, '#5a5f7a', '板'),
      o('e_exam', 8, 6, '#c8b6a6', '古'),
      o('e_citation', 11, 6, '#b5cfe0', '引'),
      o('phone', 12, 3, '#3ec28f', '機'),
      o('hint', 10, 3, '#f0b429', '助'),
    ],
  }),
  hall: room({
    w: 26, h: 11, floor: '#bfc3cc', wall: '#59607a',
    doors: [{ x: 3, y: 0, to: 'r401' }, { x: 12, y: 0, to: 'r503' }],
    signs: [
      { x: 19, y: 0, text: '系辦（門關著）' },
      { x: 24, y: 0, text: '樓梯↓一樓（鐵捲門關著）' },
    ],
    objects: [
      o('switch_panel', 7, 0, '#d4c04a', '燈'),
      o('c_floorplan', 8, 0, '#7fb8d9', '圖'),
      o('c_plaque', 15, 0, '#c9a24a', '匾'),
      o('keypad', 18, 0, '#3a3f4f', '鍵'),
      o('e_studygroup', 20, 0, '#e6d3a0', '簽'),
      o('e_bbq', 22, 0, '#d98a4a', '烤'),
      o('vending', 2, 9, '#d94f4f', '販', 2, 1),
      o('c_pantry_board', 5, 10, '#f4f4f4', '板'),
      o('e_drinks', 6, 10, '#8fc9a0', '飲'),
      o('e_delivery', 1, 5, '#f09a3e', '送'),
      deco('deco_sofa', 7, 8, '#7b5ea7', 3, 1),
      o('broadcast', 12, 9, '#c44f7a', '播', 2, 1),
      o('c_broadcast_manual', 14, 10, '#f4f4f4', '說'),
      o('c_guard', 15, 10, '#e0a870', '警'),
      o('phone', 10, 5, '#3ec28f', '機'),
      o('hint', 13, 5, '#f0b429', '助'),
      o('e_yearbook', 1, 2, '#e08bb0', '冊'),
      o('c_trash_notice', 21, 1, '#9a9a9a', '桶'),
      o('e_printer', 23, 2, '#cfd3da', '印'),
      deco('deco_counter', 17, 6, '#8a6a50', 4, 1),
      o('e_guardpc', 22, 6, '#5a7fb0', '腦'),
      o('e_survey', 24, 4, '#8fd0c0', '問'),
    ],
  }),
  r503: room({
    w: 16, h: 11, floor: '#aab4c0', wall: '#454e63',
    doors: [{ x: 2, y: 10, to: 'hall' }],
    objects: [
      o('e_labsignup', 2, 0, '#e8e0a0', '板'),
      o('bookshelf', 11, 1, '#8b5a2b', '書', 2, 1),
      o('c_sleeptalk', 4, 3, '#e8b49a', '哲'),
      deco('deco_desk', 6, 3, '#7c6a58', 2, 1),
      o('e_format', 4, 6, '#9fb4d9', '檔'),
      o('e_seniorcode', 8, 6, '#4f6bd1', '腦'),
      o('lab_pc', 12, 5, '#2f2f3a', '電', 2, 1),
      o('e_restore', 7, 8, '#6f86b0', '電'),
      o('e_sync', 9, 8, '#6fb0a0', '雲'),
      o('e_usbseat', 13, 8, '#b0a06f', '碟'),
    ],
  }),
};
