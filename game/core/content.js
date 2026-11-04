// 資料檔的整理與檢查。不依賴瀏覽器或 Node 專屬 API。

export const CONTENT_FILES = ['puzzles', 'deaths', 'eggs', 'endings', 'rooms', 'hints', 'texts', 'moodle'];

export const STAGE_TYPES = ['code', 'wheel', 'sequence', 'toggles', 'select', 'choice'];

const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));

/**
 * 把各資料檔的原始 JSON 組成核心要用的 content 物件。
 * @param {Record<string, any>} raw  key 是 CONTENT_FILES 裡的名字，value 是該檔的 JSON
 */
export function buildContent(raw) {
  for (const name of CONTENT_FILES) {
    if (!raw[name]) throw new Error(`缺少資料檔：${name}.json`);
  }
  const puzzles = [...raw.puzzles.puzzles].sort((a, b) => a.order - b.order);
  const deaths = raw.deaths.deaths;
  const eggs = raw.eggs.eggs;
  const endings = raw.endings.endings;
  const roomList = raw.rooms.rooms;
  return {
    puzzles,
    puzzleById: byId(puzzles),
    deaths,
    deathById: byId(deaths),
    eggs,
    eggById: byId(eggs),
    endings,
    endingById: byId(endings),
    trueEndingCodexRequired: raw.endings.trueEndingCodexRequired ?? 0,
    rooms: { start: raw.rooms.start, list: roomList, byId: byId(roomList) },
    hints: raw.hints,
    texts: raw.texts,
    moodle: raw.moodle,
  };
}

/** 回傳錯誤訊息陣列；空陣列代表資料檔沒問題。 */
export function validateContent(c) {
  const errors = [];
  const err = (m) => errors.push(m);
  const dupCheck = (list, label) => {
    const seen = new Set();
    for (const x of list) {
      if (seen.has(x.id)) err(`${label} id 重複：${x.id}`);
      seen.add(x.id);
    }
  };
  dupCheck(c.puzzles, '謎題');
  dupCheck(c.deaths, '死法');
  dupCheck(c.eggs, '彩蛋');
  dupCheck(c.endings, '結局');
  dupCheck(c.rooms.list, '房間');

  if (c.puzzles.length !== 8) err(`主線謎題應為 8 關，目前 ${c.puzzles.length}`);
  c.puzzles.forEach((p, i) => {
    if (p.order !== i + 1) err(`謎題 order 應連續：${p.id}`);
  });
  if (c.eggs.length !== 20) err(`彩蛋物件應為 20 個，目前 ${c.eggs.length}`);

  const referenced = new Map(); // deathId -> origin
  const ref = (deathId, origin, where) => {
    if (!c.deathById[deathId]) return err(`${where} 指到不存在的死法：${deathId}`);
    if (referenced.has(deathId)) err(`死法被引用兩次：${deathId}`);
    referenced.set(deathId, origin);
  };

  const rewardItems = new Set();
  for (const p of c.puzzles) {
    if (!c.rooms.byId[p.room]) err(`${p.id} 的房間不存在：${p.room}`);
    for (const r of p.requires) if (!c.puzzleById[r]) err(`${p.id} 依賴不存在的謎題：${r}`);
    if (!c.hints.puzzles[p.id]) err(`${p.id} 沒有提示`);
    for (const it of p.reward.items) rewardItems.add(it);
    if (!p.stages.length) err(`${p.id} 沒有任何步驟`);
    for (const s of p.stages) {
      const where = `${p.id}.${s.id}`;
      if (!STAGE_TYPES.includes(s.type)) err(`${where} 未知的步驟類型：${s.type}`);
      if (s.type === 'choice') {
        if (!s.options.some((o) => o.outcome === 'next')) err(`${where} 沒有正解選項`);
        for (const o of s.options) {
          if (!['next', 'death', 'stay'].includes(o.outcome)) err(`${where}.${o.id} 未知 outcome`);
          if (o.outcome === 'death') ref(o.death, p.id, `${where}.${o.id}`);
        }
      } else if (s.answer === undefined) {
        err(`${where} 沒有 answer`);
      }
      if (s.wrongDeath) ref(s.wrongDeath, p.id, where);
      for (const r of s.deathRules || []) ref(r.death, p.id, where);
      if (s.type === 'wheel') {
        s.answer.forEach((a, i) => { if (!s.wheels[i]?.includes(a)) err(`${where} 第 ${i + 1} 個滾輪沒有答案字`); });
      }
      if (s.type === 'sequence') {
        const ids = new Set(s.buttons.map((b) => b.id));
        for (const a of s.answer) if (!ids.has(a)) err(`${where} 答案按鈕不存在：${a}`);
      }
      if (s.type === 'toggles') {
        for (const a of s.answer) if (!s.switches.includes(a)) err(`${where} 答案開關不存在：${a}`);
      }
      if (s.type === 'select') {
        for (const f of s.fields) {
          if (!f.options.some((o) => o.id === s.answer[f.id])) err(`${where} 欄位 ${f.id} 的答案不在選項裡`);
        }
      }
    }
  }
  // 401 的門：警衛鎖門前推門出去（核心的 DOOR 動作）
  if (c.deathById.d_door) ref('d_door', 'r401', '401 的門');
  else err('缺少死法 d_door（門其實沒鎖）');
  for (const e of c.eggs) {
    if (!c.rooms.byId[e.room]) err(`彩蛋 ${e.id} 的房間不存在：${e.room}`);
    ref(e.death, e.room, `彩蛋 ${e.id}`);
  }
  for (const d of c.deaths) {
    const origin = referenced.get(d.id);
    if (origin === undefined) err(`死法沒有任何觸發點：${d.id}`);
    else if (origin !== d.origin) err(`死法 ${d.id} 的 origin 應為 ${origin}，寫的是 ${d.origin}`);
    if (!d.text) err(`死法 ${d.id} 沒有死因文字`);
  }
  for (const room of c.rooms.list) {
    for (const it of room.requires.items || []) if (!rewardItems.has(it)) err(`房間 ${room.id} 需要拿不到的道具：${it}`);
    for (const pid of room.requires.puzzles || []) if (!c.puzzleById[pid]) err(`房間 ${room.id} 依賴不存在的謎題：${pid}`);
    for (const ex of room.exits) if (!c.rooms.byId[ex]) err(`房間 ${room.id} 的出口不存在：${ex}`);
  }
  if (!c.rooms.byId[c.rooms.start]) err('起始房間不存在');

  const nos = new Set();
  for (const x of [...c.deaths, ...c.endings]) {
    if (nos.has(x.no)) err(`圖鑑編號重複：${x.no}`);
    nos.add(x.no);
  }
  if (c.deathById.d_door?.no !== 1) err('「門其實沒鎖」必須是圖鑑第 1 格');
  for (const id of ['end_dawn', 'end_no_submit', 'end_normal', 'end_true']) {
    if (!c.endingById[id]) err(`缺少結局：${id}`);
  }
  const req = c.trueEndingCodexRequired;
  const total = c.deaths.length + c.endings.length;
  if (!Number.isInteger(req) || req < 0 || req >= total) err(`trueEndingCodexRequired 應為 0～${total - 1} 的整數，目前 ${req}`);
  const omens = c.deaths.filter((d) => d.omen);
  if (omens.length > 3) err(`預兆最多 3 個，目前 ${omens.length}`);
  return errors;
}
