// 音效的純邏輯（不碰 Web Audio），方便測試。
// 每個音效是一串音符 { f: 頻率 Hz（0 = 休止）, t: 起始秒, d: 長度秒, w: 波形, v: 音量 0~1 }。

export const SFX_NAMES = ['interact', 'solve', 'death', 'ending', 'step', 'bump', 'pickup', 'door', 'buzz', 'chain'];

const note = (f, t, d, w = 'square', v = 0.5) => ({ f, t, d, w, v });

export const SFX = {
  // 互動：短短一聲
  interact: [note(660, 0, 0.05), note(880, 0.05, 0.06)],
  // 解開：上行三音
  solve: [note(523, 0, 0.09), note(659, 0.09, 0.09), note(784, 0.18, 0.09), note(1047, 0.27, 0.2, 'square', 0.45)],
  // 死亡：下行，最後一個低音
  death: [note(440, 0, 0.12, 'sawtooth', 0.45), note(330, 0.12, 0.12, 'sawtooth', 0.45), note(220, 0.24, 0.12, 'sawtooth', 0.45), note(110, 0.36, 0.3, 'triangle', 0.6)],
  // 結局：小段旋律
  ending: [note(392, 0, 0.14, 'triangle', 0.6), note(523, 0.14, 0.14, 'triangle', 0.6), note(659, 0.28, 0.14, 'triangle', 0.6), note(784, 0.42, 0.14, 'triangle', 0.6), note(1047, 0.56, 0.4, 'square', 0.4)],
  // 腳步：很輕的一下
  step: [note(140, 0, 0.03, 'triangle', 0.18)],
  // 撞牆：悶悶的一聲
  bump: [note(95, 0, 0.07, 'square', 0.35)],
  // 拿到道具：叮叮
  pickup: [note(988, 0, 0.07), note(1319, 0.07, 0.14, 'square', 0.45)],
  // 開門換房間
  door: [note(220, 0, 0.06, 'triangle', 0.4), note(165, 0.06, 0.1, 'triangle', 0.4)],
  // 手機震動
  buzz: [note(180, 0, 0.06, 'square', 0.25), note(180, 0.1, 0.06, 'square', 0.25)],
  // 警衛鎖門的鐵鍊聲
  chain: [note(310, 0, 0.05, 'sawtooth', 0.3), note(280, 0.07, 0.05, 'sawtooth', 0.3), note(330, 0.14, 0.05, 'sawtooth', 0.3), note(120, 0.3, 0.25, 'square', 0.45)],
};

/** 取得某個音效的音符；沒有這個名字回傳空陣列。 */
export function sfxNotes(name) {
  return SFX[name] ?? [];
}

/** 音效的總長度（秒）。 */
export function sfxDuration(name) {
  return sfxNotes(name).reduce((m, n) => Math.max(m, n.t + n.d), 0);
}

/** 事件 type → 音效名（沒有對應就是 null）。 */
const EVENT_SFX = { ui_interact: 'interact', item: 'pickup', solved: 'solve', death: 'death', ending: 'ending', moved: 'door', cutscene: 'chain' };
export function sfxForEvent(type) {
  return EVENT_SFX[type] ?? null;
}

/** localStorage 存的靜音值 → 布林。只有明確存了 '1' 才是靜音。 */
export function parseMuted(raw) {
  return raw === '1';
}
export function serializeMuted(muted) {
  return muted ? '1' : '0';
}
