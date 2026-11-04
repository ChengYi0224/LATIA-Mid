// 8-bit 音效（WP7）：全部用 Web Audio 在程式裡合成，沒有外部音檔。
// 瀏覽器第一次互動前不建立 AudioContext（不然會有警告）；API 不可用時安靜略過。
import { sfxNotes, sfxForEvent, parseMuted, serializeMuted } from './audio-logic.js';

const MUTE_KEY = 'latia-mid:muted:v1';
const readMuted = () => { try { return parseMuted(localStorage.getItem(MUTE_KEY)); } catch { return false; } };
const writeMuted = (m) => { try { localStorage.setItem(MUTE_KEY, serializeMuted(m)); } catch { /* 拿不到就只留在記憶體 */ } };

export function initAudio(ctx) {
  const { bus, debug } = ctx;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./audio.css', import.meta.url).href;
  document.head.append(link);

  let muted = readMuted();
  let ac = null;            // AudioContext，第一次互動後才建立
  let unlocked = false;     // 使用者互動過了嗎
  let broken = false;       // API 不可用或出錯，之後一律略過
  // 除錯用計數：triggered = 事件觸發次數，played = 實際送進 Web Audio 的次數
  const stats = { triggered: {}, played: {}, muted, state: 'none' };
  const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };

  function ensure() {
    if (broken || !unlocked) return null;
    if (ac) return ac;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { broken = true; return null; }
      ac = new AC();
    } catch { broken = true; return null; }
    return ac;
  }

  function play(name) {
    bump(stats.triggered, name);
    if (muted) return;
    const a = ensure();
    if (!a) return;
    try {
      if (a.state === 'suspended') a.resume().catch(() => {});
      const t0 = a.currentTime + 0.01;
      for (const n of sfxNotes(name)) {
        if (!n.f) continue;
        const osc = a.createOscillator();
        const gain = a.createGain();
        osc.type = n.w;
        osc.frequency.value = n.f;
        const peak = 0.12 * n.v; // 整體小聲一點
        gain.gain.setValueAtTime(0.0001, t0 + n.t);
        gain.gain.linearRampToValueAtTime(peak, t0 + n.t + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.t + n.d);
        osc.connect(gain).connect(a.destination);
        osc.start(t0 + n.t);
        osc.stop(t0 + n.t + n.d + 0.02);
      }
      bump(stats.played, name);
      stats.state = a.state;
    } catch { broken = true; }
  }

  // 第一次互動後才解鎖（瀏覽器規定）
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    ensure();
    for (const ev of ['pointerdown', 'keydown']) window.removeEventListener(ev, unlock, true);
  };
  for (const ev of ['pointerdown', 'keydown']) window.addEventListener(ev, unlock, true);

  // 事件 → 音效
  bus.on('*', (ev) => { const s = sfxForEvent(ev.type); if (s) play(s); });
  // 一般按鈕點擊也算互動（靜音鈕自己不發聲）
  document.addEventListener('click', (e) => {
    const b = e.target instanceof Element && e.target.closest('button');
    if (b && !b.classList.contains('au-mute')) play('interact');
  }, true); // 用捕捉階段，畫面層就算擋掉冒泡也收得到

  // 靜音開關
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'au-mute';
  const render = () => {
    btn.textContent = muted ? '音效：關' : '音效：開';
    btn.setAttribute('aria-pressed', String(muted));
    stats.muted = muted;
  };
  btn.addEventListener('click', () => { muted = !muted; writeMuted(muted); render(); });
  render();
  document.body.append(btn);

  if (debug) window.__audio = { stats, play, get muted() { return muted; }, get ctx() { return ac; } };
  return { play };
}
