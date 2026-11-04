// 光線、霧、色調：把場景調成柔和自然光、有霧氣的卡通寫實感。不 import three.js，由呼叫端傳入 THREE。

export const PALETTE = {
  background: 0xc9d3d6, // 霧的顏色，背景與霧要同色才不會有邊
  fog: 0xc9d3d6,
  skyLight: 0xdfeaf2,   // 半球光：天空色（偏冷）
  groundLight: 0x8a7b6a, // 半球光：地面反光（偏暖）
  sun: 0xfff0d6,        // 方向光：暖白
};

export function createLighting(THREE) {
  /**
   * 設定 renderer 與 scene 的整體風格。回傳 { hemi, sun }，整合者可再調整位置或強度。
   * 室內小房間建議 fogNear/fogFar 約 6 / 28（單位：公尺）。
   */
  function applyStyle(scene, renderer, opts = {}) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = opts.exposure ?? 1.05;
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene.background = new THREE.Color(opts.background ?? PALETTE.background);
    scene.fog = new THREE.Fog(opts.fog ?? PALETTE.fog, opts.fogNear ?? 6, opts.fogFar ?? 28);

    const hemi = new THREE.HemisphereLight(PALETTE.skyLight, PALETTE.groundLight, opts.hemiIntensity ?? 1.1);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(PALETTE.sun, opts.sunIntensity ?? 2.2);
    sun.position.set(...(opts.sunPosition ?? [6, 9, 4]));
    sun.castShadow = true;
    const half = opts.shadowExtent ?? 12;
    Object.assign(sun.shadow.camera, { left: -half, right: half, top: half, bottom: -half, near: 0.5, far: 40 });
    const size = opts.shadowMapSize ?? 2048;
    sun.shadow.mapSize.set(size, size);
    sun.shadow.radius = 4; // 陰影邊緣更柔
    sun.shadow.bias = -0.0005;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);
    scene.add(sun.target);

    return { hemi, sun };
  }

  /** 螢幕四周變暗的暈邊，純 CSS，不擋滑鼠。回傳元素，要移除就 el.remove()。 */
  function makeVignetteOverlay(parent = document.body, strength = 0.45) {
    const el = document.createElement('div');
    el.className = 'style-vignette';
    const pos = parent === document.body ? 'fixed' : 'absolute';
    el.style.cssText =
      `position:${pos};inset:0;pointer-events:none;z-index:5;` +
      `background:radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(20,16,12,${strength}) 100%);`;
    if (parent !== document.body && getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    parent.appendChild(el);
    return el;
  }

  return { applyStyle, makeVignetteOverlay };
}
