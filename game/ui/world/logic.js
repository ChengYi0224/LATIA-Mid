// 走動畫面的純邏輯：碰撞、靠近物件、門、互動要送什麼動作。不碰 DOM，可以用 node:test 測。
import { TILE } from '../maps.js';

export const PLAYER_HALF = 5;   // 角色碰撞框是 10x10 像素
export const SPEED = 64;        // 像素 / 秒
export const REACH = 10;        // 角色中心到物件外框的距離在這之內才能互動

export const tileAt = (map, tx, ty) => (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h ? '#' : map.tiles[ty][tx]);
export const objRect = (ob) => ({ x0: ob.x * TILE, y0: ob.y * TILE, x1: (ob.x + ob.w) * TILE, y1: (ob.y + ob.h) * TILE });

/** 中心在 (cx, cy) 的角色框會不會撞到牆或實心物件。 */
export function collides(map, cx, cy, half = PLAYER_HALF) {
  const x0 = cx - half, x1 = cx + half, y0 = cy - half, y1 = cy + half;
  for (let ty = Math.floor(y0 / TILE); ty <= Math.floor((y1 - 0.001) / TILE); ty += 1) {
    for (let tx = Math.floor(x0 / TILE); tx <= Math.floor((x1 - 0.001) / TILE); tx += 1) {
      if (tileAt(map, tx, ty) === '#') return true;
    }
  }
  for (const ob of map.objects) {
    if (!ob.solid) continue;
    const r = objRect(ob);
    if (x0 < r.x1 && x1 > r.x0 && y0 < r.y1 && y1 > r.y0) return true;
  }
  return false;
}

const ASSIST = 4; // 差幾像素就能過的窄門，自動往旁邊帶一點

/** 移動 (dx, dy)：X、Y 分開處理，撞到就停在那一軸（可以貼著牆滑）；對不準門口時會自動修正。 */
export function move(map, pos, dx, dy) {
  let { x, y } = pos;
  if (dx) {
    if (!collides(map, x + dx, y)) x += dx;
    else for (let s = 1; s <= ASSIST; s += 1) {
      const side = [s, -s].find((o) => !collides(map, x + dx, y + o));
      if (side !== undefined) { y += Math.sign(side) * Math.min(Math.abs(dx), 1); break; }
    }
  }
  if (dy) {
    if (!collides(map, x, y + dy)) y += dy;
    else for (let s = 1; s <= ASSIST; s += 1) {
      const side = [s, -s].find((o) => !collides(map, x + o, y + dy));
      if (side !== undefined) { x += Math.sign(side) * Math.min(Math.abs(dy), 1); break; }
    }
  }
  return { x, y };
}

const distToRect = (px, py, r) => Math.hypot(Math.max(r.x0 - px, 0, px - r.x1), Math.max(r.y0 - py, 0, py - r.y1));

/** 距離最近、在 REACH 內的可互動物件（裝飾不算），沒有就回 null。 */
export function nearestObject(map, pos, reach = REACH) {
  let best = null;
  let bestD = Infinity;
  for (const ob of map.objects) {
    if (ob.deco) continue;
    const d = distToRect(pos.x, pos.y, objRect(ob));
    if (d <= reach && d < bestD) { best = ob; bestD = d; }
  }
  return best;
}

/** 角色中心所在的格子如果是門，回傳那扇門。 */
export function doorAt(map, pos) {
  const tx = Math.floor(pos.x / TILE), ty = Math.floor(pos.y / TILE);
  if (tileAt(map, tx, ty) !== 'D') return null;
  return map.doors.find((d) => d.x === tx && d.y === ty) ?? null;
}

/**
 * 走進門格時要送的動作。401 的門在警衛鎖門前其實沒鎖：直接走出去就是「門其實沒鎖」（記一筆死法，重來後繼續），
 * 和點左上角的「門」一樣；鎖門之後才是一般的換房間（要後門鑰匙）。
 */
export function doorAction(roomId, door, state) {
  if (roomId === 'r401' && !state.doorLocked) return { type: 'DOOR' };
  return { type: 'GO', room: door.to };
}

/** 門前面（房間裡面）那一格的中心座標。 */
export function doorFront(map, door) {
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    if (tileAt(map, door.x + dx, door.y + dy) === '.') return { x: (door.x + dx + 0.5) * TILE, y: (door.y + dy + 0.5) * TILE };
  }
  return { x: (door.x + 0.5) * TILE, y: (door.y + 0.5) * TILE };
}

/** 進房間時站在哪：從哪個房間來就站在通往那裡的門前；沒有就站在第一扇門前。 */
export function spawnFor(map, fromRoom) {
  const door = map.doors.find((d) => d.to === fromRoom) ?? map.doors[0];
  return doorFront(map, door);
}

/** 把物件 id 對回資料：{ kind, ... }。找不到回 null。 */
export function resolveObject(content, roomId, id) {
  if (id === 'door' || id === 'phone' || id === 'hint') return { kind: id, name: { door: '大門', phone: '手機', hint: 'AI 助教' }[id] };
  const puzzle = content.puzzles.find((p) => p.object === id);
  if (puzzle) return { kind: 'puzzle', puzzle, name: puzzle.title };
  if (content.eggById[id]) return { kind: 'egg', egg: content.eggById[id], name: content.eggById[id].name };
  const clue = content.rooms.byId[roomId]?.clues.find((c) => c.id === id);
  if (clue) return { kind: 'clue', clue, name: clue.name };
  return null;
}

/**
 * 按 E 要做什麼（和 rooms-panel 清單點同一個物件完全一樣）：
 *  { do: 'send', action }    送動作給核心（DOOR / PHONE / HINT）
 *  { do: 'egg', egg }        開彩蛋對話框，按 actionLabel 才送 { type:'EGG', egg }
 *  { do: 'open_puzzle', puzzle }  發 ui_open_puzzle 事件
 *  { do: 'text', title, text }    純文字
 */
export function planInteraction(res, game, content) {
  switch (res.kind) {
    case 'door': return { do: 'send', action: { type: 'DOOR' } };
    case 'phone': return { do: 'send', action: { type: 'PHONE' } };
    case 'hint': return { do: 'send', action: { type: 'HINT' } };
    case 'egg': return { do: 'egg', egg: res.egg };
    case 'clue': return { do: 'text', title: res.clue.name, text: res.clue.text };
    case 'puzzle': {
      const p = res.puzzle;
      if (game.isSolved(p.id)) return { do: 'text', title: p.title, text: '這關已經解開了。' };
      if (game.puzzleAvailable(p.id)) return { do: 'open_puzzle', puzzle: p.id };
      const clues = content.rooms.list.flatMap((r) => r.clues).filter((c) => c.forPuzzle === p.id);
      return { do: 'text', title: '還不能解', text: '相關線索：\n' + (clues.map((c) => `・${c.name}：${c.text}`).join('\n') || '（無）') };
    }
    default: return null;
  }
}

/** 被擋下的門要顯示什麼（核心的 blocked 事件只給條件，沒有文字）。 */
export function blockedText(ev, content) {
  const r = ev.requires ?? {};
  const parts = [];
  if (r.items?.length) parts.push('需要鑰匙或道具');
  if (r.puzzles?.length) parts.push(`需要先解開：${r.puzzles.map((id) => content.puzzleById[id]?.title ?? id).join('、')}`);
  if (r.flags?.length) parts.push('還沒滿足條件');
  return `門鎖著。${parts.join('；')}`;
}

/** 檢查地圖和資料對得上，回傳錯誤陣列（空的就是沒問題）。 */
export function checkMaps(maps, content) {
  const errs = [];
  const need = new Map(); // roomId -> Set(objectId)
  const add = (room, id) => { if (!need.has(room)) need.set(room, new Set()); need.get(room).add(id); };
  for (const p of content.puzzles) add(p.room, p.object);
  for (const e of content.eggs) add(e.room, e.id);
  for (const r of content.rooms.list) for (const c of r.clues) add(r.id, c.id);
  add('r401', 'door'); add('r401', 'phone'); add('r401', 'hint');

  for (const r of content.rooms.list) {
    const map = maps[r.id];
    if (!map) { errs.push(`缺少房間地圖：${r.id}`); continue; }
    const ids = map.objects.filter((ob) => !ob.deco).map((ob) => ob.id);
    for (const id of need.get(r.id) ?? []) if (!ids.includes(id)) errs.push(`${r.id} 缺少物件 ${id}`);
    for (const id of ids) {
      if (!resolveObject(content, r.id, id)) errs.push(`${r.id} 的物件 ${id} 在資料裡找不到`);
    }
    // 門要和 rooms.json 的 exits 一致
    const exits = [...new Set(map.doors.map((d) => d.to))].sort();
    if (exits.join() !== [...r.exits].sort().join()) errs.push(`${r.id} 的門 [${exits}] 和 exits [${r.exits}] 不一致`);
    // 物件不能重疊、不能超出地圖
    const seen = new Map();
    for (const ob of map.objects) {
      if (ob.x < 0 || ob.y < 0 || ob.x + ob.w > map.w || ob.y + ob.h > map.h) errs.push(`${r.id} 的 ${ob.id} 超出地圖`);
      for (let y = ob.y; y < ob.y + ob.h; y += 1) {
        for (let x = ob.x; x < ob.x + ob.w; x += 1) {
          const k = `${x},${y}`;
          if (seen.has(k)) errs.push(`${r.id} 的 ${ob.id} 和 ${seen.get(k)} 重疊於 ${k}`);
          seen.set(k, ob.id);
          if (tileAt(map, x, y) === 'D') errs.push(`${r.id} 的 ${ob.id} 壓在門上`);
        }
      }
    }
    // 從出生點走得到每扇門，也走得到每個物件旁邊
    const reach = reachableTiles(map, spawnFor(map, map.doors[0].to));
    for (const d of map.doors) if (!reach.has(`${d.x},${d.y}`)) errs.push(`${r.id} 走不到門 ${d.to}`);
    for (const ob of map.objects) {
      if (ob.deco) continue;
      if (!touchesReach(map, ob, reach)) errs.push(`${r.id} 走不到物件 ${ob.id}`);
    }
  }
  return errs;
}

// 以「格」為單位的可走區域（角色 10px 小於 1 格，單格寬的走道也過得去）
function reachableTiles(map, startPx) {
  const blocked = new Set();
  for (const ob of map.objects) {
    if (!ob.solid) continue;
    for (let y = ob.y; y < ob.y + ob.h; y += 1) for (let x = ob.x; x < ob.x + ob.w; x += 1) blocked.add(`${x},${y}`);
  }
  const ok = (x, y) => tileAt(map, x, y) !== '#' && !blocked.has(`${x},${y}`);
  const start = [Math.floor(startPx.x / TILE), Math.floor(startPx.y / TILE)];
  const seen = new Set([start.join()]);
  const queue = [start];
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (ok(nx, ny) && !seen.has(`${nx},${ny}`)) { seen.add(`${nx},${ny}`); queue.push([nx, ny]); }
    }
  }
  return seen;
}

function touchesReach(map, ob, reach) {
  for (let y = ob.y - 1; y <= ob.y + ob.h; y += 1) {
    for (let x = ob.x - 1; x <= ob.x + ob.w; x += 1) {
      const inside = x >= ob.x && x < ob.x + ob.w && y >= ob.y && y < ob.y + ob.h;
      if (!inside && reach.has(`${x},${y}`)) return true;
    }
  }
  return false;
}
