// 素材對照表（WP7）。格式 { key: { color, label, src } }。
// src 是 null（或空字串）時畫 color 色塊；填 'assets/xxx.png' 就顯示那張圖，載入失敗自動退回色塊。
// 尺寸與命名建議見 assets/README.md。key 不要改（程式和 content/*.json 都用它對應）。
import { resolveAsset, createImageCache } from './assets-logic.js';

export const ASSETS = {
  // ----- 角色（建議 16×16，站姿朝下）-----
  player: { color: '#e56b6f', label: '主角', src: null },
  // ----- 地圖物件（1 格 = 16×16，寬 2 格 = 32×16，依此類推）-----
  laptop: { color: '#5b7fd1', label: '筆', src: null },
  c_laptop_note: { color: '#f2e07a', label: '條', src: null },
  lectern: { color: '#8a5a3c', label: '講', src: null },
  c_exam_calc: { color: '#f0ece0', label: '考', src: null },
  c_exam_stat: { color: '#f0ece0', label: '考', src: null },
  c_syllabus: { color: '#d9d2b8', label: '綱', src: null },
  c_whiteboard: { color: '#f4f4f4', label: '白', src: null },
  e_whiteboard_role: { color: '#e8e8e8', label: '工', src: null },
  e_timetable: { color: '#a7c4a0', label: '課', src: null },
  door: { color: '#4a4a58', label: '門', src: null },
  e_desk: { color: '#9c7b57', label: '桌', src: null },
  e_tablet: { color: '#5a5f7a', label: '板', src: null },
  e_exam: { color: '#c8b6a6', label: '古', src: null },
  e_citation: { color: '#b5cfe0', label: '引', src: null },
  phone: { color: '#3ec28f', label: '機', src: null },
  hint: { color: '#f0b429', label: '助', src: null },
  switch_panel: { color: '#d4c04a', label: '燈', src: null },
  c_floorplan: { color: '#7fb8d9', label: '圖', src: null },
  c_plaque: { color: '#c9a24a', label: '匾', src: null },
  e_yearbook: { color: '#e08bb0', label: '冊', src: null },
  e_survey: { color: '#8fd0c0', label: '問', src: null },
  vending: { color: '#d94f4f', label: '販', src: null },
  c_pantry_board: { color: '#f4f4f4', label: '板', src: null },
  e_delivery: { color: '#f09a3e', label: '送', src: null },
  e_drinks: { color: '#8fc9a0', label: '飲', src: null },
  bookshelf: { color: '#8b5a2b', label: '書', src: null },
  c_sleeptalk: { color: '#e8b49a', label: '哲', src: null },
  e_labsignup: { color: '#e8e0a0', label: '板', src: null },
  e_seniorcode: { color: '#4f6bd1', label: '腦', src: null },
  e_format: { color: '#9fb4d9', label: '檔', src: null },
  keypad: { color: '#3a3f4f', label: '鍵', src: null },
  c_trash_notice: { color: '#9a9a9a', label: '桶', src: null },
  e_printer: { color: '#cfd3da', label: '印', src: null },
  e_studygroup: { color: '#e6d3a0', label: '簽', src: null },
  lab_pc: { color: '#2f2f3a', label: '電', src: null },
  e_restore: { color: '#6f86b0', label: '電', src: null },
  e_sync: { color: '#6fb0a0', label: '雲', src: null },
  e_usbseat: { color: '#b0a06f', label: '碟', src: null },
  broadcast: { color: '#c44f7a', label: '播', src: null },
  c_broadcast_manual: { color: '#f4f4f4', label: '說', src: null },
  c_guard: { color: '#e0a870', label: '警', src: null },
  e_guardpc: { color: '#5a7fb0', label: '腦', src: null },
  e_bbq: { color: '#d98a4a', label: '烤', src: null },
  // ----- 純裝飾（不能互動，會擋路）-----
  deco_chair: { color: '#7a6a52', label: 'deco_chair', src: null },
  deco_bench: { color: '#8a7a66', label: 'deco_bench', src: null },
  deco_bench2: { color: '#8a7a66', label: 'deco_bench2', src: null },
  deco_sofa: { color: '#7b5ea7', label: 'deco_sofa', src: null },
  deco_desk: { color: '#7c6a58', label: 'deco_desk', src: null },
  deco_row1: { color: '#566078', label: 'deco_row1', src: null },
  deco_row2: { color: '#566078', label: 'deco_row2', src: null },
  deco_counter: { color: '#8a6a50', label: 'deco_counter', src: null },
  // ----- 死因卡圖與圖鑑縮圖（建議 16×16，兩處共用同一張）-----
  death_lockout: { color: '#888', label: '密碼打錯三次', src: null },
  death_update_later: { color: '#888', label: '稍後提醒我', src: null },
  death_update_now: { color: '#888', label: '立即重新啟動', src: null },
  death_autorecover: { color: '#888', label: '自動修復', src: null },
  death_lastyear_notice: { color: '#888', label: '延期公告', src: null },
  death_mom_call: { color: '#888', label: '媽媽來電', src: null },
  death_nap: { color: '#888', label: '瞇 15 分鐘', src: null },
  death_tidy: { color: '#888', label: '幫你整理', src: null },
  death_final: { color: '#888', label: '最終版', src: null },
  death_really_final: { color: '#888', label: '真的最終', src: null },
  death_plusone: { color: '#888', label: '+1', src: null },
  death_guest: { color: '#888', label: '以訪客身分登入', src: null },
  death_forgot: { color: '#888', label: '忘記密碼', src: null },
  death_admin_mail: { color: '#888', label: '保持聯繫', src: null },
  death_senior_account: { color: '#888', label: '記住帳號', src: null },
  death_lastyear_course: { color: '#888', label: '去年的課', src: null },
  death_conclusion: { color: '#888', label: '結論寫好了', src: null },
  death_wakeall: { color: '#888', label: '全館最大聲', src: null },
  death_dinner: { color: '#888', label: '吃個飯而已', src: null },
  death_desk: { color: '#888', label: '先整理桌面', src: null },
  death_tablet: { color: '#888', label: '看一集就好', src: null },
  death_exam: { color: '#888', label: '大概不會考', src: null },
  death_timetable: { color: '#888', label: '早八不會點名', src: null },
  death_citation: { color: '#888', label: '之後再補引用', src: null },
  death_integrate: { color: '#888', label: '我來整合就好', src: null },
  death_yearbook: { color: '#888', label: '幫大家拍照', src: null },
  death_survey: { color: '#888', label: '填個問卷而已', src: null },
  death_delivery: { color: '#888', label: '湊免運', src: null },
  death_drinks: { color: '#888', label: '第二杯半價', src: null },
  death_labsignup: { color: '#888', label: '去實驗室看看', src: null },
  death_seniorcode: { color: '#888', label: '幫看一下就好', src: null },
  death_format: { color: '#888', label: '幫組員改格式', src: null },
  death_printer: { color: '#888', label: '幫忙拉卡紙', src: null },
  death_studygroup: { color: '#888', label: '簽個名而已', src: null },
  death_restore: { color: '#888', label: '存在桌面', src: null },
  death_sync: { color: '#888', label: '兩台一起開', src: null },
  death_usbseat: { color: '#888', label: '插著隨身碟佔位', src: null },
  death_guardpc: { color: '#888', label: '誰會修電腦', src: null },
  death_bbq: { color: '#888', label: '有空的寫名字', src: null },
  // ----- 結局圖（建議 16×16）-----
  end_door: { color: '#888', label: '門其實沒鎖', src: null }, // 死法 d_door 的圖（沿用原本的 key）
  end_dawn: { color: '#888', label: '天亮了', src: null },
  end_no_submit: { color: '#888', label: '人出來了，報告沒交', src: null },
  end_normal: { color: '#888', label: '交了，也出來了', src: null },
  end_true: { color: '#888', label: '1 則未讀', src: null },
};

/** 取得素材；表裡沒有的 key 回傳灰色後備。 */
export function getAsset(key) {
  return resolveAsset(ASSETS, key);
}

// ---------- 圖片載入（瀏覽器專用，載入失敗就當沒有圖）----------
const cache = createImageCache((src, ok, fail) => {
  const img = new Image();
  img.onload = () => ok(img);
  img.onerror = fail;
  img.src = src;
});

/** 這個 key 目前能用的圖（已載入好才有），沒有就回傳 null，呼叫端改畫色塊。 */
export function getImage(key) {
  return cache.get(getAsset(key).src);
}

/** 等某個 key 的圖載好（或失敗）後呼叫 done(img 或 null)。給 DOM 畫面用，同一張圖只請求一次。 */
export function whenImage(key, done) {
  cache.whenReady(getAsset(key).src, done);
}
