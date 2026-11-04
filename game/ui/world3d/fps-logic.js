// 第一人稱（3D）用的純邏輯：視角、走路向量、準星對準物件。不碰 DOM 和 three.js，可以用 node:test 測。
// 座標沿用格子地圖的像素：map 的 x 對應 3D 的 X，map 的 y 對應 3D 的 Z。
// yaw = 0 時看向地圖上方（y 變小），往左轉 yaw 變大，和 three.js 的相機慣例一致。
import { TILE } from '../maps.js';
import { objRect, doorFront } from '../world/logic.js';

export const WALK_SPEED = 52;      // 像素 / 秒（約每秒 3.2 格）
export const TURN_SPEED = 1.9;     // 方向鍵轉頭的速度（弧度 / 秒）
export const AIM_REACH = 26;       // 準星互動距離（像素，從眼睛算到物件外框）
export const AIM_PAD = 4;          // 準星容許誤差（物件外框往外放寬幾像素），讓細物件不用瞄得太準
export const PITCH_LIMIT = 1.3;    // 抬頭低頭上限（弧度）
export const PITCH_AIM_LIMIT = 0.9; // 抬頭低頭超過這個，看的是天花板和地板，不算對準物件

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** 面向 yaw 的前方向量（地圖座標）。 */
export const forwardVec = (yaw) => ({ x: -Math.sin(yaw), y: -Math.cos(yaw) });
/** 面向 yaw 的右手方向量（地圖座標）。 */
export const rightVec = (yaw) => ({ x: Math.cos(yaw), y: -Math.sin(yaw) });
/** 從 from 看向 to 的 yaw。 */
export const yawToward = (from, to) => Math.atan2(-(to.x - from.x), -(to.y - from.y));

/** 滑鼠（或拖曳）移動量換成新的視角。sens 是靈敏度倍率，1 = 預設。 */
export function applyLook(view, dx, dy, sens = 1) {
  const k = 0.0022 * sens;
  return { yaw: view.yaw - dx * k, pitch: clamp(view.pitch - dy * k, -PITCH_LIMIT, PITCH_LIMIT) };
}

/** 依按鍵與視角算這一幀要移動的向量（地圖像素）。input：{ f, b, l, r } 是真值或假值，f 往前、l 往左平移。 */
export function walkVector(yaw, input, dist) {
  const f = (input.f ? 1 : 0) - (input.b ? 1 : 0);
  const s = (input.r ? 1 : 0) - (input.l ? 1 : 0);
  if (!f && !s) return { x: 0, y: 0 };
  const fw = forwardVec(yaw), rt = rightVec(yaw);
  const len = Math.hypot(f, s);
  return { x: ((fw.x * f + rt.x * s) / len) * dist, y: ((fw.y * f + rt.y * s) / len) * dist };
}

/** 射線（從 o 往 d 方向）碰到矩形的距離，沒碰到回 null。矩形先往外放寬 pad。 */
export function rayHitRect(o, d, r, pad = 0) {
  let t0 = 0, t1 = Infinity;
  for (const [oo, dd, lo, hi] of [[o.x, d.x, r.x0 - pad, r.x1 + pad], [o.y, d.y, r.y0 - pad, r.y1 + pad]]) {
    if (Math.abs(dd) < 1e-9) {
      if (oo < lo || oo > hi) return null;
    } else {
      let a = (lo - oo) / dd, b = (hi - oo) / dd;
      if (a > b) [a, b] = [b, a];
      t0 = Math.max(t0, a);
      t1 = Math.min(t1, b);
      if (t0 > t1) return null;
    }
  }
  return t0;
}

/**
 * 準星對著的物件：從眼睛沿視線方向找最先碰到的物件外框（含裝飾，所以被家具擋住的不算），
 * 距離在 reach 內、而且不是裝飾才算。
 */
export function aimedObject(map, pos, yaw, pitch = 0, reach = AIM_REACH) {
  if (Math.abs(pitch) > PITCH_AIM_LIMIT) return null;
  const d = forwardVec(yaw);
  let best = null, bestT = Infinity;
  for (const ob of map.objects) {
    const t = rayHitRect(pos, d, objRect(ob), AIM_PAD);
    if (t !== null && t < bestT) { best = ob; bestT = t; }
  }
  if (!best || best.deco) return null;
  const real = rayHitRect(pos, d, objRect(best), 0) ?? bestT; // 沒瞄準中心、只擦到放寬的邊時，以放寬後的距離算
  return real <= reach ? best : null;
}

/** 進房間時朝哪個方向看：背對進來的那扇門，面向房間裡面。 */
export function spawnYaw(map, fromRoom) {
  const door = map.doors.find((d) => d.to === fromRoom) ?? map.doors[0];
  const front = doorFront(map, door);
  const doorPos = { x: (door.x + 0.5) * TILE, y: (door.y + 0.5) * TILE };
  return yawToward(doorPos, front);
}
