// 死因卡、圖鑑格子、結局畫面共用的圖示：每個死法與結局對一個看得懂的 emoji，取代原本的隨機像素色塊。
// key 是 content/deaths.json 與 endings.json 的 art。沒列到的用 DEFAULT_ICON（測試會檢查不會走到）。
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
  // 結局
  end_dawn: '🌅',
  end_no_submit: '🌤️',
  end_normal: '🛏️',
  end_true: '📩',
};

export function deathIcon(art) {
  return DEATH_ICONS[art] ?? DEFAULT_ICON;
}

/** 畫面上的圖示節點。silhouette 為真（圖鑑還沒解鎖）時變成同形狀的剪影。 */
export function iconNode(art, { silhouette = false } = {}) {
  const e = document.createElement('span');
  e.className = 'icon' + (silhouette ? ' sil' : '');
  e.textContent = deathIcon(art);
  e.setAttribute('aria-hidden', 'true');
  return e;
}
