// 第 7 關的假 Moodle 皮（WP4）。由 index.js 在 p7 開出來時呼叫 createMoodle(...).render(stage, note, shake)。
// 畫面文字與配色都來自 content/moodle.json；判定在核心，這裡只送動作。
import { screenFor, isGuest, loginMode, choiceAction, loginAction, calendarOpenable, FAKE_ACCOUNT, FAKE_PASSWORD_MASK } from './moodle-logic.js';

const OWL = [
  'a........a', 'aa......aa', 'aaaaaaaaaa', 'aWWWaaWWWa', 'aWKWaaWKWa',
  'aWWWyyWWWa', 'aaaaayyaaa', 'aabbbbbbaa', '.aabbbbaa.', '..aa..aa..',
];
const OWL_COLORS = { a: '#c9a46a', W: '#ffffff', K: '#111111', y: '#f0b429', b: '#8a6a3b' };
const SVG_NS = 'http://www.w3.org/2000/svg';

// 國立夜貓大學校徽：像素貓頭鷹（內嵌 SVG，不用外部圖）
function owlLogo() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 10 10');
  svg.setAttribute('class', 'mdl-logo');
  svg.setAttribute('shape-rendering', 'crispEdges');
  OWL.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '.') return;
    const r = document.createElementNS(SVG_NS, 'rect');
    r.setAttribute('x', x); r.setAttribute('y', y); r.setAttribute('width', 1); r.setAttribute('height', 1);
    r.setAttribute('fill', OWL_COLORS[c]);
    svg.append(r);
  }));
  return svg;
}

function globeIcon() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('class', 'mdl-globe');
  svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><ellipse cx="10" cy="10" rx="3.5" ry="8"/><path d="M2 10h16M3.5 6h13M3.5 14h13"/></g>';
  return svg;
}

export function createMoodle({ content, send, pid, close, refresh }) {
  const m = content.moodle;
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  const btn = (label, fn, cls = '', disabled = false) => {
    const b = el('button', cls, label);
    b.type = 'button';
    b.disabled = disabled;
    b.addEventListener('click', fn);
    return b;
  };

  // 本地狀態：步驟換了就重設（輸入框內容、行事曆是否打開）
  let stageId = '';
  let ui = {};
  const resetUi = () => { ui = { view: 'home', user: '', pass: '', remember: false }; };
  resetUi();

  function render(stage, note, shake) {
    if (stage.id !== stageId) { stageId = stage.id; resetUi(); }
    const screen = screenFor(m, stage.id);
    const guest = isGuest(stage.id);
    const act = (optionId) => { const a = choiceAction(pid, stage, optionId); if (a) send(a); };

    const root = el('div', 'mdl-wrap' + (shake ? ' shake' : ''));
    root.style.setProperty('--mdl-bg', m.theme.background);
    root.style.setProperty('--mdl-bar', m.theme.titleBar);
    root.style.setProperty('--mdl-left', m.theme.loginLeft);
    root.style.setProperty('--mdl-right', m.theme.loginRight);
    root.style.setProperty('--mdl-btn', m.theme.primaryButton);
    root.style.setProperty('--mdl-text', m.theme.text);

    // 旁白列：這一步的提示（不在 Moodle 頁面裡）
    const cap = el('div', 'mdl-caption');
    cap.append(el('span', '', stage.prompt), btn('✕', () => close(), 'mdl-x'));
    root.append(cap);

    const win = el('div', 'mdl-win');
    root.append(win);
    win.append(titleBar(guest));

    if (screen === 'login') win.append(loginPage(stage, act));
    else {
      const body = el('div', 'mdl-body');
      body.append(sidebar(stage));
      body.append(screen === 'home' ? homePage(act) : coursePage(stage, act));
      win.append(body);
    }
    if (screen === 'course+dialog') win.append(dialog(act));
    win.append(el('div', 'mdl-footer', m.footer));

    if (note) root.append(el('div', 'mdl-note ' + note.cls, note.text));
    return root;
  }

  function titleBar(guest) {
    const bar = el('div', 'mdl-bar');
    const burger = el('span', 'mdl-burger');
    burger.append(el('i'), el('i'), el('i'));
    const title = el('div', 'mdl-title');
    title.append(owlLogo(), el('span', '', m.titleBar.title));
    const right = el('div', 'mdl-right');
    right.append(globeIcon());
    if (guest) {
      const s = el('span', 'mdl-status');
      s.append('您正使用訪客身分瀏覽（', el('u', '', '登入'), '）');
      right.append(s);
    } else {
      right.append(el('span', 'mdl-status', '你（已登入）'));
    }
    bar.append(burger, title, right);
    return bar;
  }

  function sidebar(stage) {
    const side = el('nav', 'mdl-side');
    const openable = calendarOpenable(stage.id);
    for (const name of m.sidebar) {
      const isCal = name === '行事曆';
      const on = openable && ui.view === (isCal ? 'calendar' : 'home');
      side.append(btn(name, () => { if (!openable) return; ui.view = isCal ? 'calendar' : 'home'; refresh(); }, 'mdl-nav' + (on ? ' on' : '')));
    }
    return side;
  }

  function coursePage(stage, act) {
    const main = el('div', 'mdl-main');
    main.append(el('div', 'mdl-crumb', `首頁 / ${m.home.myCourses[1]} / 期中報告`));
    main.append(el('h1', '', m.assignment.title));
    const table = el('div', 'mdl-table');
    const row = (k, v) => { const r = el('div', 'mdl-row'); r.append(el('span', 'k', k), el('span', 'v', v)); table.append(r); };
    row('繳交狀態', m.assignment.statusDraft.replace('繳交狀態：', ''));
    row('截止時間', m.home.calendarEvent.replace('期中報告截止 ', '今天 '));
    row('繳交檔案', '最終版(1).docx');
    main.append(table);
    if (stage.id === 'final_submit') {
      const team = el('div', 'mdl-team');
      team.append(el('strong', '', '組員訊息'), el('p', '', stage.prompt));
      main.append(team);
      const acts = el('div', 'mdl-actions');
      acts.append(btn('把共用檔的結論併進來', () => act('merge'), 'mdl-sec'), btn('提交作業', () => act('submit'), 'mdl-primary'));
      main.append(acts);
    } else {
      main.append(btn('繳交', () => act('submit'), 'mdl-primary', stage.id !== 'submit'));
    }
    return main;
  }

  function homePage(act) {
    const main = el('div', 'mdl-main');
    if (ui.view === 'calendar') {
      main.append(el('h1', '', '行事曆'));
      const cal = el('div', 'mdl-cal');
      cal.append(el('div', 'mdl-cal-head', '今天'), btn(m.home.calendarEvent, () => act('calendar'), 'mdl-event'));
      main.append(cal);
      return main;
    }
    main.append(el('h1', '', '我的課程'));
    const list = el('div', 'mdl-courses');
    const ids = ['lastyear', 'thisyear', null];
    m.home.myCourses.forEach((name, i) => {
      const card = btn('', () => { if (ids[i]) act(ids[i]); }, 'mdl-course');
      card.append(el('span', 'mdl-thumb'), el('span', 'mdl-cname', name));
      if (i === 0) card.append(el('span', 'mdl-recent', '最近瀏覽'));
      list.append(card);
    });
    main.append(list);
    return main;
  }

  function dialog(act) {
    const shade = el('div', 'mdl-shade');
    const box = el('div', 'mdl-dialog');
    box.append(el('h2', '', m.guestDialog.title), el('p', '', m.guestDialog.text));
    const acts = el('div', 'mdl-actions');
    acts.append(btn(m.guestDialog.buttons[0], () => act('continue'), 'mdl-primary'), btn(m.guestDialog.buttons[1], () => act('cancel'), 'mdl-sec'));
    box.append(acts);
    shade.append(box);
    return shade;
  }

  function loginPage(stage, act) {
    const auto = loginMode(stage.id) === 'autofill';
    const L = m.loginPage.left;
    const R = m.loginPage.right;
    const page = el('div', 'mdl-login');
    const card = el('div', 'mdl-login-card');

    const left = el('div', 'mdl-login-left');
    left.append(owlLogo(), el('h2', '', L.title));
    for (const line of L.lines) left.append(el('p', '', line));
    left.append(btn(L.guestButton, () => act('guest'), 'mdl-ghost'));

    const right = el('div', 'mdl-login-right');
    right.append(el('h2', '', R.title));
    const user = el('input');
    const pass = el('input');
    user.type = 'text'; pass.type = 'password';
    user.placeholder = R.usernamePlaceholder; pass.placeholder = R.passwordPlaceholder;
    user.autocomplete = 'off'; pass.autocomplete = 'off';
    const remember = el('input');
    remember.type = 'checkbox';
    const submit = () => send(loginAction(pid, ui.pass, ui.remember));
    if (auto) {
      // 公用電腦記住了上一個人：欄位已填好，只能「直接登入」或「清掉」
      user.value = FAKE_ACCOUNT; pass.value = FAKE_PASSWORD_MASK;
      user.readOnly = pass.readOnly = true;
      remember.checked = true; remember.disabled = true;
    } else {
      user.value = ui.user; pass.value = ui.pass; remember.checked = ui.remember;
      user.addEventListener('input', () => { ui.user = user.value; });
      pass.addEventListener('input', () => { ui.pass = pass.value; });
      remember.addEventListener('change', () => { ui.remember = remember.checked; });
      pass.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
      user.addEventListener('keydown', (e) => { if (e.key === 'Enter') pass.focus(); });
    }
    right.append(user, pass);
    const rem = el('label', 'mdl-remember');
    rem.append(remember, ` ${R.remember}`);
    right.append(rem, btn(R.loginButton, () => (auto ? act('autofill') : submit()), 'mdl-primary mdl-wide'));
    right.append(btn(R.forgot, () => act('forgot'), 'mdl-link'));
    if (auto) right.append(btn('清掉欄位，自己輸入', () => act('clear'), 'mdl-link'));

    card.append(left, right);
    page.append(card, btn('保持聯繫：寫信給管理者', () => act('contact'), 'mdl-link mdl-contact'));
    if (!auto) setTimeout(() => (ui.user ? pass : user).focus(), 0);
    return page;
  }

  return { render };
}
