// 美術風格入口：createStyle(THREE) 回傳 { makeMaterial, makeSolid, applyStyle, makeVignetteOverlay, dispose, kinds }
// 要 file:// 可玩，需先載入 assets-data.js（見 materials.js 說明）。
import { createMaterials } from './materials.js';
import { createLighting } from './lighting.js';

export function createStyle(THREE, options = {}) {
  return { ...createMaterials(THREE, options), ...createLighting(THREE) };
}
