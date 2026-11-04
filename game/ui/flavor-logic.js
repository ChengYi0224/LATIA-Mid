// 氣氛與台詞的純邏輯（不碰 DOM），方便用 node:test 測。
// 時鐘單位都是「從 00:00 起算的分鐘」，和核心一致。

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

// 窗外天色：深夜一路到天亮
export const SKY_STOPS = [
  [0, '#0a0f2c'],
  [300, '#121a4a'],
  [340, '#3b3f8a'],
  [380, '#b8678f'],
  [420, '#f4b26b'],
];

/** 某個時間的窗外顏色。 */
export function skyColor(clock) {
  if (clock <= SKY_STOPS[0][0]) return SKY_STOPS[0][1];
  for (let i = 1; i < SKY_STOPS.length; i += 1) {
    const [t1, c1] = SKY_STOPS[i];
    const [t0, c0] = SKY_STOPS[i - 1];
    if (clock <= t1) {
      const k = (clock - t0) / (t1 - t0);
      const a = hex(c0), b = hex(c1);
      return toHex(a.map((v, j) => v + (b[j] - v) * k));
    }
  }
  return SKY_STOPS[SKY_STOPS.length - 1][1];
}

/** 天亮的程度 0～1：05:00 前是 0，07:00 是 1。 */
export function dawnLevel(clock) {
  return Math.max(0, Math.min(1, (clock - 300) / 120));
}

/** 房間的暗度（0 = 全亮，1 = 全黑）：基本暗度，越接近天亮越亮一點。 */
export function darkness(base, clock) {
  return Math.max(0, base * (1 - 0.5 * dawnLevel(clock)));
}

/**
 * 該跳出來的手機通知／旁白：時間到了、還沒顯示過的。
 * @param {{at:number}[]} list  texts.flavor.chatter
 * @param {number} clock
 * @param {Set<number>} shown  已經顯示過的索引
 */
export function dueChatter(list, clock, shown) {
  const out = [];
  list.forEach((c, i) => { if (c.at <= clock && !shown.has(i)) out.push(i); });
  return out;
}

/** 依序輪流拿台詞（拿到最後一句後從頭開始）。counts 會被更新。 */
export function nextLine(lines, key, counts) {
  if (!lines?.length) return null;
  const n = counts[key] ?? 0;
  counts[key] = n + 1;
  return lines[n % lines.length];
}

/** 打字機效果每個字的毫秒數和總長度（給死因卡的點擊保護用）。 */
export const TYPE_MS = 32;
export function typeDuration(text) {
  return [...String(text ?? '')].length * TYPE_MS;
}
