import { test } from 'node:test';
import assert from 'node:assert/strict';
import { content, newGame, solveUntil } from '../../../core/test/helpers.js';
import { MAPS, TILE } from '../../maps.js';
import {
  collides, move, nearestObject, doorAt, doorFront, spawnFor, resolveObject, planInteraction, blockedText, checkMaps, tileAt,
} from '../logic.js';

test('地圖和資料對得上：物件齊全、門和 exits 一致、每個物件走得到', () => {
  assert.deepEqual(checkMaps(MAPS, content), []);
  assert.equal(Object.keys(MAPS).length, 7);
});

test('20 個彩蛋物件、8 個謎題物件都在地圖上', () => {
  const ids = Object.entries(MAPS).flatMap(([r, m]) => m.objects.map((o) => `${r}:${o.id}`));
  for (const e of content.eggs) assert.ok(ids.includes(`${e.room}:${e.id}`), e.id);
  for (const p of content.puzzles) assert.ok(ids.includes(`${p.room}:${p.object}`), p.object);
});

test('撞牆會停、貼著牆可以滑、不能穿過實心物件', () => {
  const m = MAPS.r401;
  const start = { x: 1.5 * TILE, y: 1.5 * TILE }; // 左上角
  let p = start;
  for (let i = 0; i < 50; i += 1) p = move(m, p, -1, 0);
  assert.ok(p.x >= TILE + 5 - 0.01, '不會穿過左牆');
  const slide = move(m, { x: p.x, y: p.y }, -1, 1);
  assert.equal(slide.x, p.x);
  assert.ok(slide.y > p.y, '貼牆時 Y 方向仍可移動');
  // 筆電在 (3,2)：從左側走過去會被擋
  let q = { x: 1.5 * TILE, y: 2.5 * TILE };
  for (let i = 0; i < 80; i += 1) q = move(m, q, 1, 0);
  assert.ok(q.x < 3 * TILE, '被筆電擋住');
  assert.ok(collides(m, 3.5 * TILE, 2.5 * TILE));
  assert.ok(!collides(m, 1.5 * TILE, 1.5 * TILE));
});

test('靠近物件才找得到，裝飾不算', () => {
  const m = MAPS.r401;
  const near = nearestObject(m, { x: 2.5 * TILE, y: 2.5 * TILE }); // 筆電左邊
  assert.equal(near.id, 'laptop');
  assert.equal(nearestObject(m, { x: 8.5 * TILE, y: 8.5 * TILE }), null);
  assert.equal(nearestObject(m, { x: 3.5 * TILE, y: 3.5 * TILE })?.deco ?? false, false);
});

test('門：站在門格上才算；進房間站在通往來處的門前', () => {
  const m = MAPS.hall;
  const d = m.doors.find((x) => x.to === 'pantry');
  assert.equal(doorAt(m, { x: (d.x + 0.5) * TILE, y: (d.y + 0.5) * TILE }), d);
  assert.equal(doorAt(m, doorFront(m, d)), null);
  const sp = spawnFor(m, 'floor1');
  assert.equal(tileAt(m, Math.floor(sp.x / TILE), Math.floor(sp.y / TILE)), '.');
  const lab = m.doors.find((x) => x.to === 'lab');
  assert.equal(Math.floor(sp.x / TILE), 18);
  assert.equal(Math.floor(spawnFor(m, 'lab').x / TILE), lab.x);
});

test('互動動作和房間清單一樣', () => {
  const g = newGame();
  const plan = (room, id) => planInteraction(resolveObject(content, room, id), g, content);
  assert.deepEqual(plan('r401', 'door'), { do: 'send', action: { type: 'DOOR' } });
  assert.deepEqual(plan('r401', 'phone'), { do: 'send', action: { type: 'PHONE' } });
  assert.deepEqual(plan('r401', 'hint'), { do: 'send', action: { type: 'HINT' } });
  const egg = plan('r401', 'e_tablet');
  assert.equal(egg.do, 'egg');
  assert.equal(egg.egg.id, 'e_tablet'); // 對話框按鈕送 { type:'EGG', egg: 'e_tablet' }
  assert.deepEqual(plan('r401', 'laptop'), { do: 'open_puzzle', puzzle: 'p1' });
  const clue = plan('r401', 'c_exam_calc');
  assert.equal(clue.do, 'text');
  assert.equal(clue.text, content.rooms.byId.r401.clues[0].text);
});

test('謎題還沒開放時顯示線索；解完後說已解開', () => {
  const g = newGame();
  const locked = planInteraction(resolveObject(content, 'r401', 'lectern'), g, content);
  assert.equal(locked.do, 'text');
  assert.match(locked.text, /遲交不收/);
  solveUntil(g, 'p2');
  assert.equal(planInteraction(resolveObject(content, 'r401', 'lectern'), g, content).do, 'open_puzzle');
});

test('被擋的門：核心給條件，這裡轉成文字', () => {
  const g = newGame();
  const ev = g.dispatch({ type: 'GO', room: 'pantry' })[0];
  assert.equal(ev.type, 'blocked');
  assert.match(blockedText(ev, content), /門鎖著/);
  assert.match(blockedText(ev, content), new RegExp(content.puzzleById.p3.title));
});

test('對不準窄門口時會自動帶進去，差太多就不會', () => {
  const m = MAPS.r401;
  const d = m.doors[0]; // (13,10)
  const walkDown = (x) => {
    let p = { x, y: (d.y - 1) * TILE + 8 };
    for (let i = 0; i < 80; i += 1) p = move(m, p, 0, 0.5);
    return doorAt(m, p);
  };
  assert.equal(walkDown((d.x + 0.5) * TILE + 3.5), d); // 偏 3.5px（超出碰撞框 0.5）
  assert.equal(walkDown((d.x + 1) * TILE + 6), null);   // 偏到門框外
});

test('401 的門：警衛鎖門前走出去是「門其實沒鎖」，鎖門後才是一般換房間', async () => {
  const { doorAction } = await import('../logic.js');
  const door = MAPS.r401.doors.find((d) => d.to === 'hall');
  const g = newGame();
  assert.deepEqual(doorAction('r401', door, g.getState()), { type: 'DOOR' });
  const ev = g.dispatch(doorAction('r401', door, g.getState()));
  assert.equal(ev.find((e) => e.type === 'death').death.id, 'd_door');
  assert.equal(ev.some((e) => e.type === 'ending'), false);

  const g2 = newGame();
  g2.dispatch({ type: 'PUZZLE', puzzle: 'p1', value: '0000' }); // 碰了筆電，警衛鎖門
  assert.deepEqual(doorAction('r401', door, g2.getState()), { type: 'GO', room: 'hall' });
  assert.equal(g2.dispatch(doorAction('r401', door, g2.getState()))[0].type, 'blocked');
  // 其他房間的門永遠是換房間
  const hallDoor = MAPS.hall.doors[0];
  assert.deepEqual(doorAction('hall', hallDoor, newGame().getState()), { type: 'GO', room: hallDoor.to });
});

test('每個地圖物件都有程式畫的像素圖（字不再當主圖）', async () => {
  const { SPRITE_IDS } = await import('../sprites.js');
  for (const [room, m] of Object.entries(MAPS)) {
    for (const ob of m.objects) assert.ok(SPRITE_IDS.includes(ob.id), `${room} 的 ${ob.id} 沒有像素圖`);
  }
});

test('像素圖畫得出來、主角四個方向兩格都畫得出來（用假的畫布）', async () => {
  const { drawSprite, drawFloor, drawWall, drawDoorTile, drawHero } = await import('../sprites.js');
  const calls = [];
  const g = { set fillStyle(v) { calls.push(v); }, fillRect: (x, y, w, h) => { assert.ok([x, y, w, h].every(Number.isFinite)); } };
  for (const [room, m] of Object.entries(MAPS)) {
    for (const ob of m.objects) {
      const r = { x0: ob.x * TILE, y0: ob.y * TILE, x1: (ob.x + ob.w) * TILE, y1: (ob.y + ob.h) * TILE };
      assert.equal(drawSprite(g, ob, r, 1234), true);
    }
    drawFloor(g, room, 1, 1, m.floor);
    drawWall(g, room, 1, 0, m.wall, true);
  }
  drawDoorTile(g, 2, 0);
  for (const f of ['up', 'down', 'left', 'right']) for (const fr of [-1, 0, 1]) drawHero(g, 40, 40, f, fr);
  assert.ok(calls.length > 100);
});
