// 載入資料、建立 game、把事件分給各模組。只有 WP1 會改這支。
import { loadContent, createGame, browserStorage, debugActions, isDebug } from '../core/index.js';
import * as bus from './bus.js';
import { initRoomsPanel } from './rooms-panel.js';
import { initWorld } from './world3d/index.js';
import { initPuzzles } from './puzzles/index.js';
import { initScreens } from './screens/index.js';
import { initHud } from './hud/index.js';
import { initAudio } from './audio.js';
import { initFlavor } from './flavor.js';

// 像素字型（base64 內嵌，由 scripts/build-font.py 產生）
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = new URL('./pixel-font.css', import.meta.url).href;
document.head.append(fontLink);

const content = await loadContent();
const params = new URLSearchParams(location.search);
const debug = isDebug(params);
const game = createGame(content, { storage: browserStorage(), debug });

// 畫面只送動作：送給核心，結果事件分發給各模組
const send = (action) => {
  const events = game.dispatch(action);
  bus.emit(events);
  return events;
};
const ctx = { game, content, bus, send, params, debug };

if (debug) window.__game = game;

// 開發時把 error 事件印到 console
bus.on('error', (ev) => console.warn('[core error]', ev.reason));

// 各模組掛上去（先掛監聽，再處理 debug 動作）
initRoomsPanel(ctx, document.getElementById('rooms-root'));
initWorld(ctx, document.getElementById('world-root'));
initPuzzles(ctx, document.getElementById('puzzle-root'));
initScreens(ctx, document.getElementById('screen-root'));
initHud(ctx, document.getElementById('hud-root'));
ctx.sfx = initAudio(ctx).play; // 腳步、撞牆這種很頻繁的音效直接呼叫，不走事件（不然每一步都會重畫整個畫面）
initFlavor(ctx);
if (debug) (await import('./debug-panel.js')).initDebugPanel(ctx, document.getElementById('debug-root')); // 沒開 debug 連檔案都不載入

for (const a of debugActions(params)) bus.emit(game.dispatch(a));
bus.emit([]); // 畫一次初始畫面
