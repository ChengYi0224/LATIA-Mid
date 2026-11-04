// 死因卡中間的圖示：每個死法對一個看得懂的 emoji，取代原本的隨機像素色塊。
// key 是 content/deaths.json 的 art。沒列到的用 DEFAULT_ICON。
export const DEFAULT_ICON = '💀';

export const DEATH_ICONS = {
  end_door: '🚪',
  death_lockout: '🔒',
  death_update_later: '⏰',
  death_update_now: '🔄',
  death_autorecover: '🩹',
  death_lastyear_notice: '📅',
  death_mom_call: '📞',
  death_nap: '🛋️',
  death_tidy: '🗑️',
  death_final: '📄',
  death_really_final: '📑',
  death_plusone: '➕',
  death_guest: '👤',
  death_forgot: '🔑',
  death_admin_mail: '✉️',
  death_senior_account: '🧑‍🎓',
  death_lastyear_course: '📚',
  death_conclusion: '📝',
  death_wakeall: '📢',
  death_dinner: '🍽️',
  death_desk: '🖥️',
  death_tablet: '📺',
  death_exam: '📖',
  death_timetable: '🗓️',
  death_citation: '❓',
  death_integrate: '🧩',
  death_yearbook: '📷',
  death_survey: '📋',
  death_delivery: '🛵',
  death_drinks: '🧋',
  death_labsignup: '🔬',
  death_seniorcode: '💻',
  death_format: '🖋️',
  death_printer: '🖨️',
  death_studygroup: '✍️',
  death_restore: '♻️',
  death_sync: '☁️',
  death_usbseat: '💾',
  death_guardpc: '🛠️',
  death_bbq: '🍖',
};

export function deathIcon(art) {
  return DEATH_ICONS[art] ?? DEFAULT_ICON;
}
