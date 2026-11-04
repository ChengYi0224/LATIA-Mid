// 把除錯網址參數轉成 dispatch 動作。畫面層在 ?debug=1 時呼叫。
//   ?debug=1&jump=p5        跳到第 5 關（前面都算解完）
//   ?debug=1&death=d_p8_dinner  直接觸發某個死法
//   ?debug=1&ending=end_true    直接看某個結局
//   ?debug=1&unlock=all     解鎖全部圖鑑
//   ?debug=1&clock=400      把時鐘設成 06:40（分鐘數）

export function isDebug(params) {
  return params.get('debug') === '1';
}

export function debugActions(params) {
  if (!isDebug(params)) return [];
  const actions = [];
  if (params.get('unlock') === 'all') actions.push({ type: 'DEBUG_UNLOCK_ALL' });
  if (params.get('jump')) actions.push({ type: 'DEBUG_JUMP', puzzle: params.get('jump') });
  if (params.get('clock')) actions.push({ type: 'DEBUG_CLOCK', clock: Number(params.get('clock')) });
  if (params.get('death')) actions.push({ type: 'DEBUG_DEATH', death: params.get('death') });
  if (params.get('ending')) actions.push({ type: 'DEBUG_ENDING', ending: params.get('ending') });
  return actions;
}
