// 互動面板的專屬版面（只負責畫面，內容與按鈕動作由 panel-logic.js 決定）。
// 每個物件一個 skin（key 就是物件 id，或 phone／hint／door／locked／solved），
// skin 收到 (def, h)，回傳 { node, result?(text), meta?(text) }。
// h.btn(i, cls, label?) 建出 def.buttons[i] 的按鈕（會自動加數字鍵標記、接上點擊）；
// h.chip(label, fn, cls) 建出只改畫面、不送動作的小按鈕（Tab 可到、Enter 可按）。

import { PHONE_CHOICES, phoneReply } from './panel-logic.js';

const mk = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const add = (parent, ...kids) => { for (const k of kids) if (k) parent.append(k); return parent; };
const lines = (text) => String(text ?? '').split('\n');

/** 還沒有專屬版面的物件用的簡單版（正常不會用到，保險用）。 */
function plain(def, h) {
  const node = mk('div', 'ps ps-plain');
  add(node, mk('p', 'ps-text', def.text), h.resultBox());
  const row = mk('div', 'ps-row');
  def.buttons.forEach((_, i) => row.append(h.btn(i, i === 0 ? 'primary' : '')));
  node.append(row);
  return { node };
}

// ---------- 手機：聊天室 ----------
function phone(def, h) {
  const node = mk('div', 'ps ps-phone');
  const bar = mk('div', 'ph-bar');
  const back = h.chip('‹', () => show('list'), 'ph-back');
  const title = mk('strong', 'ph-title', '訊息');
  add(bar, back, title, mk('span', 'ph-clock', h.clock ?? ''));
  const body = mk('div', 'ph-body');
  const reply = mk('div', 'ph-reply');
  add(node, bar, body, reply);
  const threads = [...(def.chat ?? [])];
  const ann = { from: '課程公告', unread: true, messages: ['【課程公告】老師發了一則新公告。（未讀）'] };
  const sent = {}; // 各串自己回的：{ out, reply, status, replied }
  let announcementOpened = false;
  const bubble = (cls, text) => { const b = mk('div', `ph-bub ${cls}`, text); body.append(b); body.scrollTop = body.scrollHeight; return b; };

  function show(view, th) {
    body.textContent = '';
    reply.textContent = '';
    back.hidden = view === 'list';
    if (view === 'list') {
      title.textContent = '訊息';
      for (const t of [ann, ...threads]) {
        const row = h.chip('', () => show('chat', t), 'ph-thread');
        const last = sent[t.from]?.out ? `你：${sent[t.from].out}` : t.messages.at(-1);
        add(row, mk('span', 'ph-av', t.from.slice(0, 1)), add(mk('span', 'ph-tx'), mk('b', '', t.from), mk('small', '', last)), t.unread && !announcementOpened ? mk('i', 'ph-dot', '1') : null);
        body.append(row);
      }
      return;
    }
    title.textContent = th.from;
    for (const m of th.messages) bubble('in', m);
    const my = sent[th.from];
    if (my) { bubble('out', my.out); if (my.replied) bubble('in', my.reply); else my.typing = bubble('in typing', '…'); }
    if (th === ann) {
      if (announcementOpened) { for (const m of announcementOpened) bubble('self', m); }
      else add(reply, mk('span', 'ph-hint', '點下面的框送出：'), h.btn(0, 'ph-send', '點開這則未讀'));
      add(reply, h.btn(1, 'ph-close', '放回口袋'));
      return;
    }
    const done = sent[th.from];
    if (done) {
      // 已經回過：回覆框鎖住，不能重複送
      const st = mk('div', 'ph-status', done.status);
      st.setAttribute('role', 'status');
      add(reply, st);
    } else {
      add(reply, mk('span', 'ph-hint', '回覆（只是回個話）：'));
      PHONE_CHOICES.forEach((t) => {
        const c = h.chip(t, () => choose(th, t), 'ph-choice');
        c.dataset.choice = t;
        c.title = `回覆「${t}」`;
        reply.append(c);
      });
    }
    add(reply, h.btn(1, 'ph-close', '放回口袋'));
  }

  // 選了回覆：馬上出現自己的泡泡、對方稍後回，回覆框換成結果並鎖住
  function choose(th, text) {
    if (sent[th.from]) return;
    const r = phoneReply(th.from, text);
    sent[th.from] = { ...r, replied: false };
    show('chat', th);
    reply.querySelector('.ph-close')?.focus({ preventScroll: true }); // 回覆框收起來了，焦點移到「放回口袋」
    setTimeout(() => {
      const my = sent[th.from];
      my.replied = true;
      if (my.typing?.isConnected) { my.typing.className = 'ph-bub in'; my.typing.textContent = my.reply; body.scrollTop = body.scrollHeight; }
    }, 450);
  }
  show('list');
  // 手機按鈕 0（點開未讀）按下後的結果，用聊天泡泡顯示
  return {
    node,
    result(text) {
      announcementOpened = [text];
      show('chat', ann);
    },
    startView: () => show('list'),
  };
}

// ---------- AI 助教：聊天視窗，額度是電量格 ----------
function hint(def, h) {
  const node = mk('div', 'ps ps-ai');
  const head = mk('div', 'ai-head');
  const pips = mk('span', 'ai-pips');
  add(head, mk('b', '', 'AI 助教'), pips);
  const log = mk('div', 'ai-log');
  add(log, mk('div', 'ai-msg bot', '嗨，需要提示嗎？每問一次會用掉一次額度。'));
  const quota = mk('div', 'ai-quota', def.meta);
  const row = mk('div', 'ai-row');
  add(row, h.btn(0, 'ai-send', '問提示'), h.btn(1, '', '不問了'));
  add(node, head, log, quota, row);
  const draw = (text) => {
    const m = /剩餘 (\d+)／(\d+)/.exec(text ?? '');
    pips.textContent = '';
    if (!m) return;
    for (let i = 0; i < Number(m[2]); i += 1) pips.append(mk('i', i < Number(m[1]) ? 'on' : ''));
    quota.textContent = text;
  };
  draw(def.meta);
  return {
    node,
    meta: draw,
    result(text) {
      add(log, mk('div', 'ai-msg me', '請給我提示'));
      const bot = mk('div', 'ai-msg bot typing', '…');
      log.append(bot);
      setTimeout(() => { bot.className = 'ai-msg bot'; bot.textContent = text; log.scrollTop = log.scrollHeight; }, 350);
      log.scrollTop = log.scrollHeight;
    },
  };
}

// ---------- 大門 ----------
function door(def, h) {
  const node = mk('div', 'ps ps-door');
  const leaf = mk('div', 'dr-leaf');
  add(leaf, mk('div', 'dr-sign', '出口'), mk('div', 'dr-window'), h.btn(0, 'dr-handle', '推開門'));
  add(node, leaf, mk('p', 'ps-text', def.text), h.resultBox(), add(mk('div', 'ps-row'), h.btn(1, '', '再想想')));
  return { node };
}

// ---------- 還不能解／已解開 ----------
function locked(def, h) {
  const node = mk('div', 'ps ps-locked');
  add(node, mk('div', 'lk-lock', '鎖著'), mk('p', 'ps-text', '還不能解。先去找這些線索：'));
  const board = mk('div', 'lk-board');
  const notes = def.notes ?? [];
  if (!notes.length) board.append(mk('div', 'lk-note', '（目前沒有相關線索）'));
  for (const n of notes) add(board, add(mk('div', 'lk-note'), mk('b', '', n.name), mk('span', '', n.text)));
  add(node, board, add(mk('div', 'ps-row'), h.btn(0, 'primary', '知道了')));
  return { node };
}
function solved(def, h) {
  const node = mk('div', 'ps ps-solved');
  add(node, mk('div', 'sv-stamp', '完成'), mk('p', 'ps-text', def.text), add(mk('div', 'ps-row'), h.btn(0, 'primary', '知道了')));
  return { node };
}

// ---------- 線索 ----------
/** 線索共用的下半部：結果便條＋按鈕列（每張線索的上半部都是自己的樣子）。 */
function clueFoot(node, def, h) {
  add(node, mk('div', 'cl-think'), h.resultBox('cl-result'));
  add(node, add(mk('div', 'ps-row'), h.btn(0, '', '仔細想想'), h.btn(1, 'primary', '記下來了')));
}
function paper(cls, def, h, inner) {
  const node = mk('div', `ps ps-clue ${cls}`);
  add(node, inner);
  clueFoot(node, def, h);
  return { node };
}
function examPaper(subject, date, score) {
  return (def, h) => {
    const sheet = mk('div', 'cl-exam');
    add(sheet, mk('div', 'ex-top', `${subject}期中考`), mk('div', 'ex-date', date), mk('div', 'ex-score', String(score)), mk('div', 'ex-note', '（揉過，攤平了）'));
    return paper('cl-exam-wrap', def, h, sheet);
  };
}
function whiteboard(def, h, rows) {
  const b = mk('div', 'cl-wb');
  for (const r of rows) b.append(mk('div', 'wb-line', r));
  return paper('cl-wb-wrap', def, h, b);
}

const CLUES = {
  c_exam_calc: examPaper('微積分', '10/14', 58),
  c_exam_stat: examPaper('統計', '10/21', 61),
  c_laptop_note(def, h) {
    const n = mk('div', 'cl-sticky');
    add(n, mk('div', 'st-pin'), ...lines(def.text).map((t) => mk('p', '', t)), mk('div', 'st-arrow', '↑ 貼在螢幕背面'));
    return paper('cl-sticky-wrap', def, h, n);
  },
  c_whiteboard: (def, h) => whiteboard(def, h, ['值日生：', '講桌密碼＝老師口頭禪', '（誰擦掉誰倒垃圾）']),
  c_syllabus(def, h) {
    const p = mk('div', 'cl-syl');
    add(p, mk('div', 'sy-h', '課程大綱'), mk('div', 'sy-line'), mk('div', 'sy-line short'), mk('div', 'sy-line'), mk('div', 'sy-foot', '頁尾'), mk('div', 'sy-stamp', '遲交不收'));
    return paper('cl-syl-wrap', def, h, p);
  },
  c_floorplan(def, h) {
    const p = mk('div', 'cl-plan');
    add(p, mk('div', 'pl-h', '逃生平面圖　401 → 茶水間'));
    const row = mk('div', 'pl-row');
    for (let i = 1; i <= 6; i += 1) row.append(mk('div', `pl-seg${[2, 3, 5].includes(i) ? ' on' : ''}`, `第 ${i} 段`));
    add(p, row, mk('div', 'pl-legend', '黃色＝會經過的走廊段'));
    return paper('cl-plan-wrap', def, h, p);
  },
  c_plaque(def, h) {
    const p = mk('div', 'cl-plaque');
    add(p, mk('div', 'pq-h', '系　館'), mk('div', 'pq-t', '本館於西元'), mk('div', 'pq-y', '1987'), mk('div', 'pq-t', '年落成'));
    return paper('cl-plaque-wrap', def, h, p);
  },
  c_pantry_board(def, h) {
    const b = mk('div', 'cl-wb');
    const r = mk('div', 'wb-cans');
    for (const [n, c] of [['咖啡', 'c1'], ['咖啡', 'c1'], ['紅茶', 'c2'], ['能量飲', 'c3']]) r.append(mk('div', `wb-can ${c}`, n));
    add(b, mk('div', 'wb-line', '卡住的東西這樣按會掉出來：'), r, mk('div', 'wb-line', '（旁邊畫了箭頭，由左到右）'));
    return paper('cl-wb-wrap', def, h, b);
  },
  c_trash_notice(def, h) {
    const p = mk('div', 'cl-draft');
    add(p, mk('div', 'dr-stain', '垃圾桶裡撿的'), mk('p', '', '公告（草稿）'), mk('p', '', def.text), mk('div', 'dr-cross', '已劃掉：「之後再改」'));
    return paper('cl-draft-wrap', def, h, p);
  },
  c_broadcast_manual(def, h) {
    const p = mk('div', 'cl-manual');
    add(p, mk('div', 'mn-h', '廣播台使用說明'));
    const t = mk('div', 'mn-table');
    for (const [a, b] of [['頻道', '全館／一樓／五樓'], ['夜間', '請用小音量'], ['備註', '音效按一下就送出']]) add(t, mk('b', '', a), mk('span', '', b));
    add(p, t);
    return paper('cl-manual-wrap', def, h, p);
  },
  c_guard(def, h) {
    const p = mk('div', 'cl-crt');
    add(p, mk('div', 'crt-bar', 'CAM 1F　警衛室　REC'), mk('div', 'crt-scene', 'Zzz…'), mk('div', 'crt-line', '伯伯抱著鐵捲門遙控器，睡得很熟'), mk('div', 'crt-line', '桌上有一張早餐店的集點卡'));
    return paper('cl-crt-wrap', def, h, p);
  },
  c_sleeptalk(def, h) {
    const p = mk('div', 'cl-dream');
    const bub = mk('div', 'dm-bub');
    for (const t of ['演算法……第三版……', '作業系統……', '資料庫……', '網路……']) bub.append(mk('div', '', t));
    add(p, mk('div', 'dm-z', 'Z z z'), bub, mk('div', 'dm-who', '阿哲（睡著）'));
    return paper('cl-dream-wrap', def, h, p);
  },
};

// ---------- 彩蛋：每個物件一個樣子 ----------
function eggShell(cls, def, h, inner, btnCls, btnLabel) {
  const node = mk('div', `ps ps-egg ${cls}`);
  add(node, inner, mk('p', 'eg-look', def.text), h.resultBox('eg-result'));
  add(node, add(mk('div', 'ps-row'), h.btn(0, `eg-act ${btnCls ?? ''}`, btnLabel), h.btn(1, 'eg-back')));
  return { node };
}
function win(title, rows, status) {
  const w = mk('div', 'eg-win');
  add(w, add(mk('div', 'ew-bar'), mk('b', '', title), mk('i', '', '— ▢ ✕')));
  const b = mk('div', 'ew-body');
  for (const r of rows) b.append(mk('div', r.cls ? `ew-line ${r.cls}` : 'ew-line', r.t ?? r));
  add(w, b);
  if (status) w.append(mk('div', 'ew-status', status));
  return w;
}
function sheet(title, rows, cls = '') {
  const s = mk('div', `eg-sheet ${cls}`);
  s.append(mk('div', 'es-h', title));
  for (const r of rows) s.append(mk('div', r.cls ? `es-row ${r.cls}` : 'es-row', r.t ?? r));
  return s;
}

const EGGS = {
  e_desk(def, h) {
    const d = mk('div', 'eg-desk');
    for (const [t, c] of [['講義', 'a'], ['飲料杯', 'b'], ['充電線', 'c'], ['講義', 'd'], ['便利貼', 'e']]) d.append(mk('span', `dk dk-${c}`, t));
    return eggShell('eg-desk-wrap', def, h, d, 'broom');
  },
  e_tablet(def, h) {
    const t = mk('div', 'eg-tablet');
    add(t, mk('div', 'tb-screen', '第 1 季　第 1 集　片頭'), add(mk('div', 'tb-bar'), mk('i', '')), mk('div', 'tb-ep', '共 6 季'));
    return eggShell('eg-tablet-wrap', def, h, t, 'play');
  },
  e_exam: (def, h) => eggShell('eg-quiz', def, h, sheet('考古題　目錄', [{ t: '☑ 第 1 章', cls: 'done' }, { t: '☑ 第 2 章', cls: 'done' }, { t: '☐ 第 3 章　（老師：大概不會考）', cls: 'skip' }, { t: '☐ 第 4 章' }]), 'check'),
  e_timetable(def, h) {
    const g = mk('div', 'eg-grid');
    for (const d of ['', '一', '二', '三', '四', '五']) g.append(mk('b', '', d));
    for (const t of ['8:10', '10:10', '13:10']) {
      g.append(mk('b', '', t));
      for (let i = 0; i < 5; i += 1) g.append(mk('span', t === '8:10' && i === 0 ? 'now' : '', t === '8:10' && i === 0 ? '早八' : ''));
    }
    return eggShell('eg-tt', def, h, g, 'skip');
  },
  e_citation(def, h) {
    const q = mk('div', 'eg-quote');
    add(q, mk('div', 'qt-mark', '“'), mk('div', 'qt-t', '一句很好用的話'), mk('div', 'qt-src', '出處：＿＿＿＿＿＿'));
    return eggShell('eg-citation', def, h, q, 'pen');
  },
  e_whiteboard_role(def, h) {
    return eggShell('eg-roles', def, h, sheet('分工表', [{ t: '資料蒐集　小美' }, { t: '簡報　阿明' }, { t: '撰寫　組長（你）' }, { t: '整合　＿＿＿＿', cls: 'blank' }]), 'pen');
  },
  e_yearbook(def, h) {
    const p = mk('div', 'eg-poster');
    add(p, mk('b', '', '畢業紀念冊'), mk('div', 'po-big', '徵求攝影'), mk('small', '', '攝影師不用入鏡喔'));
    return eggShell('eg-poster-wrap', def, h, p, 'cam');
  },
  e_survey(def, h) {
    const q = mk('div', 'eg-qrbox');
    const qr = mk('div', 'eg-qr');
    for (let i = 0; i < 49; i += 1) qr.append(mk('i', [0, 1, 2, 7, 9, 14, 16, 21, 22, 24, 26, 30, 33, 35, 36, 40, 42, 44, 46, 47, 48, 5, 6, 12, 19, 28].includes(i) ? 'on' : ''));
    add(q, qr, mk('div', 'qr-t', '學長的畢業專題問卷'));
    return eggShell('eg-survey', def, h, q, 'scan');
  },
  e_delivery(def, h) {
    const bar = mk('div', 'eg-free');
    add(bar, mk('div', 'fr-fill'), mk('span', '', '還差 $15 免運'));
    return eggShell('eg-app', def, h, add(mk('div', 'eg-phoneapp'), mk('b', '', '外送 App　購物車'), mk('div', 'ew-line', '雞腿便當　$95'), mk('div', 'ew-line', '運費　$29'), bar), 'cart');
  },
  e_drinks(def, h) {
    return eggShell('eg-menu', def, h, sheet('手搖飲菜單', [{ t: '紅茶　$30' }, { t: '奶茶　$45' }, { t: '第二杯半價', cls: 'hot' }, { t: '＋ 揪團訂單：共 8 杯', cls: 'blank' }]), 'order');
  },
  e_labsignup(def, h) {
    return eggShell('eg-board', def, h, sheet('教授的留言板', [{ t: '有興趣來實驗室看看的同學，請留名。' }, { t: '1. 陳＿＿' }, { t: '2. ＿＿＿＿', cls: 'blank' }]), 'pen');
  },
  e_seniorcode(def, h) {
    return eggShell('eg-code', def, h, win('main.py　學長的電腦', [{ t: '1  def run():', cls: 'code' }, { t: '2      data = load()   # 幫我看一下就好', cls: 'code' }, { t: '3      process(dta)    ← 好像哪裡怪怪的', cls: 'code err' }], '1 個錯誤'), 'fix');
  },
  e_format(def, h) {
    return eggShell('eg-doc', def, h, win('阿哲的檔案.docx', [{ t: '標題一ㄧ　字型三種', cls: 'warp' }, { t: '　　段落　間距　不一致' }, { t: '編號 1. 一、(一) 混用', cls: 'warp' }], '格式：亂'), 'fix');
  },
  e_printer(def, h) {
    const p = mk('div', 'eg-printer');
    add(p, mk('div', 'pr-led', 'ERR'), mk('div', 'pr-lcd', '卡紙　請檢查出紙口'), mk('div', 'pr-paper', '▃▃▃▃ 紙卡在這'));
    return eggShell('eg-printer-wrap', def, h, p, 'pull');
  },
  e_studygroup(def, h) {
    return eggShell('eg-sign', def, h, sheet('讀書會簽到表', [{ t: '1. 小美　✓' }, { t: '2. 阿明　✓' }, { t: '3. ＿＿＿＿', cls: 'blank' }]), 'pen');
  },
  e_restore(def, h) {
    return eggShell('eg-desktop', def, h, win('隔壁那台電腦　桌面', [{ t: '桌面很乾淨，只有「資源回收筒」。' }, { t: '開機只花了 8 秒。' }], '登入：訪客'), 'save');
  },
  e_sync(def, h) {
    const s = mk('div', 'eg-sync');
    add(s, mk('div', 'sy-pc', '電腦 A'), mk('div', 'sy-arrow', '⇄ 同步中'), mk('div', 'sy-pc', '電腦 B'));
    return eggShell('eg-sync-wrap', def, h, s, 'open2');
  },
  e_usbseat(def, h) {
    const s = mk('div', 'eg-seat');
    add(s, mk('div', 'se-chair', '空椅子'), mk('div', 'se-usb', '隨身碟'), mk('div', 'se-water', '飲水機 →'));
    return eggShell('eg-seat-wrap', def, h, s, 'usb');
  },
  e_guardpc(def, h) {
    return eggShell('eg-guardpc', def, h, win('服務台', [{ t: '便條：「誰會修？——警衛」', cls: 'note' }, { t: '系統無回應，游標轉圈圈中', cls: 'err' }], '無回應'), 'fix');
  },
  e_bbq(def, h) {
    return eggShell('eg-bbq', def, h, sheet('系烤報名表', [{ t: '烤肉組　5 人' }, { t: '採買組　3 人' }, { t: '主持人　缺', cls: 'blank' }]), 'pen');
  },
};

const SKINS = { phone, hint, door, locked, solved, ...CLUES, ...EGGS };

/**
 * 蓋出這個面板的專屬版面。
 * h：{ btn(i, cls, label?), chip(label, fn, cls), resultBox(cls?) }，由 index.js 提供。
 */
export function buildSkin(def, h) {
  const fn = SKINS[def.skin] ?? plain;
  return fn(def, h);
}

export const hasSkin = (id) => Object.hasOwn(SKINS, id);
export const skinIds = () => Object.keys(SKINS);
