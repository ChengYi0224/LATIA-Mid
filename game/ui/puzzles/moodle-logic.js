// 第 7 關假 Moodle 的純邏輯（不碰 DOM，方便測試）：每一步顯示哪個畫面、右上角狀態、各點擊要送什麼。

// 遊戲裡的假帳號（登入頁自動填好的「上一個人」）。不是真實學號。
export const FAKE_ACCOUNT = 's1130042';
export const FAKE_PASSWORD_MASK = '••••••••';

/** 這一步的畫面代號：course／course+dialog／login／home。 */
export function screenFor(moodle, stageId) {
  return moodle.stageScreens[stageId] || 'course';
}

/** 右上角是不是訪客：按了「繳交」之後到登入完成之前都是。 */
export function isGuest(stageId) {
  return ['guest_dialog', 'login_choice', 'login'].includes(stageId);
}

/** 這一步登入頁是「自動填好」（login_choice）還是「自己輸入」（login）。 */
export function loginMode(stageId) {
  return stageId === 'login_choice' ? 'autofill' : 'manual';
}

/** 這一步有沒有這個選項（UI 的點擊要對得上資料，沒有就不送）。 */
export function hasOption(stage, optionId) {
  return stage?.type === 'choice' && stage.options.some((o) => o.id === optionId);
}

/** 點擊要送的 PUZZLE 動作；選項不存在回 null。 */
export function choiceAction(pid, stage, optionId) {
  return hasOption(stage, optionId) ? { type: 'PUZZLE', puzzle: pid, value: optionId } : null;
}

/** 登入步驟送的動作：密碼＋「記住帳號」勾選。 */
export function loginAction(pid, password, remember) {
  return { type: 'PUZZLE', puzzle: pid, value: { answer: String(password).trim(), checks: { remember: !!remember } } };
}

/** 登入頁上哪些點擊在這一步有效，對應 login_choice 的選項 id。 */
export function loginChoiceIds() {
  return { guest: 'guest', forgot: 'forgot', contact: 'contact', autofill: 'autofill', clear: 'clear' };
}

/** 行事曆能不能點（只有 find_course 那步）。 */
export function calendarOpenable(stageId) {
  return stageId === 'find_course';
}
