// 佔位美術：沒有素材時用程式畫的像素色塊，有 src 就載圖，載入失敗退回色塊。
import { getAsset, whenImage } from '../assets.js';
import { artGrid, placeholderColor } from './logic.js';

const SIZE = 16;

function paintPlaceholder(ctx, key, asset, silhouette) {
  const base = silhouette ? '#10131a' : asset.color && asset.color !== '#888' ? asset.color : placeholderColor(key, 38);
  const fg = silhouette ? '#252b3a' : placeholderColor(key, 68);
  const hi = silhouette ? '#2f3648' : '#fff6d6';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, SIZE, SIZE);
  artGrid(key, SIZE).forEach((row, y) => row.forEach((v, x) => {
    if (!v) return;
    ctx.fillStyle = v === 2 ? hi : fg;
    ctx.fillRect(x, y, 1, 1);
  }));
}

/** 回傳一個 canvas（16×16，放大顯示時不糊）。silhouette 為真時畫剪影。 */
export function makeArt(key, { silhouette = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  canvas.className = 'sc-art' + (silhouette ? ' sil' : '');
  const ctx = canvas.getContext('2d');
  const asset = getAsset(key);
  paintPlaceholder(ctx, key, asset, silhouette);
  if (asset.src && !silhouette) {
    // 載入失敗（img 為 null）就保留色塊
    whenImage(key, (img) => { if (img) { ctx.clearRect(0, 0, SIZE, SIZE); ctx.imageSmoothingEnabled = false; ctx.drawImage(img, 0, 0, SIZE, SIZE); } });
  }
  return canvas;
}
