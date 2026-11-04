import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAPS, TILE } from '../../maps.js';
import { collides, objRect, spawnFor } from '../../world/logic.js';
import {
  forwardVec, rightVec, yawToward, applyLook, walkVector, rayHitRect, aimedObject, spawnYaw, PITCH_LIMIT, WALK_SPEED,
} from '../fps-logic.js';

test('視角：yaw 0 看地圖上方，往左轉 yaw 變大，右手永遠垂直於前方', () => {
  const f0 = forwardVec(0);
  assert.ok(Math.abs(f0.x) < 1e-9 && f0.y === -1);
  const fl = forwardVec(Math.PI / 2); // 左轉 90 度：看向地圖左邊
  assert.ok(Math.abs(fl.x + 1) < 1e-9 && Math.abs(fl.y) < 1e-9);
  for (const yaw of [0, 0.7, 2, -1.3]) {
    const f = forwardVec(yaw), r = rightVec(yaw);
    assert.ok(Math.abs(f.x * r.x + f.y * r.y) < 1e-9, '前方和右手互相垂直');
    assert.ok(f.x * r.y - f.y * r.x > 0.99, '右手在前方的順時針側（地圖座標 y 朝下）');
  }
  assert.ok(Math.abs(yawToward({ x: 0, y: 0 }, { x: 0, y: -5 })) < 1e-9);
  const y = yawToward({ x: 10, y: 10 }, { x: 4, y: 10 });
  assert.ok(Math.abs(forwardVec(y).x + 1) < 1e-9);
});

test('滑鼠往右移 yaw 變小（右轉），往上移 pitch 變大，抬頭低頭有上限，靈敏度成比例', () => {
  const a = applyLook({ yaw: 0, pitch: 0 }, 100, 0, 1);
  assert.ok(a.yaw < 0 && a.pitch === 0);
  const b = applyLook({ yaw: 0, pitch: 0 }, 0, -100, 1);
  assert.ok(b.pitch > 0);
  const c = applyLook({ yaw: 0, pitch: 0 }, 100, 0, 2);
  assert.ok(Math.abs(c.yaw - 2 * a.yaw) < 1e-9);
  assert.equal(applyLook({ yaw: 0, pitch: 0 }, 0, -1e6, 1).pitch, PITCH_LIMIT);
  assert.equal(applyLook({ yaw: 0, pitch: 0 }, 0, 1e6, 1).pitch, -PITCH_LIMIT);
});

test('WASD 依視角算移動向量，斜走不會變快，沒按鍵或前後同按就不動', () => {
  const fwd = walkVector(0, { f: 1 }, 10);
  assert.ok(Math.abs(fwd.x) < 1e-9 && Math.abs(fwd.y + 10) < 1e-9);
  const back = walkVector(0, { b: 1 }, 10);
  assert.ok(Math.abs(back.y - 10) < 1e-9);
  const right = walkVector(0, { r: 1 }, 10);
  assert.ok(Math.abs(right.x - 10) < 1e-9);
  const turned = walkVector(Math.PI / 2, { f: 1 }, 10); // 看向左邊，往前就是 x 變小
  assert.ok(Math.abs(turned.x + 10) < 1e-9);
  const diag = walkVector(0.4, { f: 1, r: 1 }, 10);
  assert.ok(Math.abs(Math.hypot(diag.x, diag.y) - 10) < 1e-9);
  assert.deepEqual(walkVector(0, {}, 10), { x: 0, y: 0 });
  assert.deepEqual(walkVector(0, { f: 1, b: 1 }, 10), { x: 0, y: 0 });
});

test('射線碰矩形：正對、擦邊、在後面', () => {
  const r = { x0: 10, y0: 10, x1: 20, y1: 20 };
  assert.equal(rayHitRect({ x: 15, y: 40 }, { x: 0, y: -1 }, r), 20);
  assert.equal(rayHitRect({ x: 25, y: 40 }, { x: 0, y: -1 }, r), null);
  assert.equal(rayHitRect({ x: 25, y: 40 }, { x: 0, y: -1 }, r, 6), 14, '放寬後擦邊也算');
  assert.equal(rayHitRect({ x: 15, y: 5 }, { x: 0, y: -1 }, r), null, '物件在背後');
});

test('準星：對著筆電靠近才能互動，轉開、太遠、看天花板都不行，被裝飾擋住不算', () => {
  const m = MAPS.r401; // 筆電在 (3,2)，椅子（裝飾）在 (3,3)
  const eye = { x: 2.5 * TILE, y: 2.5 * TILE };
  const yawToLaptop = yawToward(eye, { x: 3.5 * TILE, y: 2.5 * TILE });
  assert.equal(aimedObject(m, eye, yawToLaptop).id, 'laptop');
  assert.equal(aimedObject(m, eye, yawToLaptop + Math.PI), null, '背對筆電');
  assert.equal(aimedObject(m, { x: 1.5 * TILE, y: 2.5 * TILE }, yawToLaptop, 0, 6), null, '距離太遠');
  assert.equal(aimedObject(m, eye, yawToLaptop, 1.2), null, '看天花板不算');
  const chair = { x: 3.5 * TILE, y: 4.4 * TILE }; // 椅子正下方往上看，先看到椅子
  assert.equal(aimedObject(m, chair, 0), null);
  const wb = m.objects.find((o) => o.id === 'c_whiteboard'); // 牆上的物件也要瞄得到
  assert.equal(aimedObject(m, { x: (wb.x + 0.5) * TILE, y: 1.5 * TILE }, 0).id, 'c_whiteboard');
});

test('每個非裝飾物件，站在旁邊看向它都對得到', () => {
  for (const [roomId, map] of Object.entries(MAPS)) {
    for (const ob of map.objects) {
      if (ob.deco) continue;
      const r = objRect(ob);
      const c = { x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 };
      let ok = false;
      for (const [sx, sy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const p = { x: sx ? (sx > 0 ? r.x1 + 6 : r.x0 - 6) : c.x, y: sy ? (sy > 0 ? r.y1 + 6 : r.y0 - 6) : c.y };
        if (collides(map, p.x, p.y)) continue;
        if (aimedObject(map, p, yawToward(p, c))?.id === ob.id) { ok = true; break; }
      }
      assert.ok(ok, `${roomId}:${ob.id} 站在旁邊對不到`);
    }
  }
});

test('進房間時背對門、面向房間裡面', () => {
  for (const [roomId, m] of Object.entries(MAPS)) {
    for (const door of m.doors) {
      const front = spawnFor(m, door.to);
      const f = forwardVec(spawnYaw(m, door.to));
      const toDoor = { x: (door.x + 0.5) * TILE - front.x, y: (door.y + 0.5) * TILE - front.y };
      assert.ok(f.x * toDoor.x + f.y * toDoor.y < 0, `${roomId} 的門 ${door.to} 要背對`);
    }
  }
  assert.ok(WALK_SPEED > 0);
});
