// 不用走動的房間清單：列出房間與物件，點了就送動作（最短路徑用）。
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function initRoomsPanel(ctx, root) {
  const { game, content, bus, send } = ctx;
  const logLines = [];
  const log = (text, cls = '') => {
    logLines.push({ text, cls });
    if (logLines.length > 40) logLines.shift();
  };

  // 事件摘要，方便看動作有沒有送對
  bus.on('*', (ev) => {
    const { type, ...rest } = ev;
    log(`${type} ${JSON.stringify(rest)}`, type === 'error' ? 'err' : '');
  });
  bus.on('_flush', render);

  // 點到的物件：統一在這裡轉成動作或 UI 事件
  const act = {
    go: (room) => { log(`> GO ${room}`); send({ type: 'GO', room }); },
    door: () => { log('> DOOR'); send({ type: 'DOOR' }); },
    phone: () => { log('> PHONE'); send({ type: 'PHONE' }); },
    hint: () => { log('> HINT'); send({ type: 'HINT' }); },
    egg: (egg) => {
      const e = content.eggById[egg];
      if (confirm(`${e.name}\n${e.look}\n\n[確定] ${e.actionLabel}　[取消] 算了`)) {
        log(`> EGG ${egg}`);
        send({ type: 'EGG', egg });
      }
    },
    clue: (c) => alert(`${c.name}\n${c.text}`),
    puzzle: (p) => {
      if (game.puzzleAvailable(p.id)) {
        // 謎題介面（WP3）監聽這個事件；還沒做時只會留紀錄
        log(`> ui_open_puzzle ${p.id}`);
        bus.emit([{ type: 'ui_open_puzzle', puzzle: p.id }]);
      } else {
        const clues = content.rooms.list.flatMap((r) => r.clues).filter((c) => c.forPuzzle === p.id);
        alert('還不能解。相關線索：\n' + (clues.map((c) => `・${c.name}：${c.text}`).join('\n') || '沒有'));
      }
    },
  };

  const btn = (label, handler, { disabled = false, title = '' } = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.disabled = disabled;
    if (title) b.title = title;
    b.addEventListener('click', handler);
    return b;
  };

  function render() {
    const st = game.getState();
    root.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'rp';
    wrap.innerHTML = `<h2>房間清單</h2><div class="status">階段 ${esc(st.phase)}｜時間 ${esc(game.clockText())}｜所在 ${esc(st.room)}｜死亡 ${st.deaths}｜AI 額度 ${st.aiQuota}</div>`;

    const top = document.createElement('div');
    top.append(
      btn('AI 助教', act.hint, { disabled: st.phase !== 'playing' }),
      ' ',
      btn('手機未讀', act.phone, { disabled: st.phase !== 'playing' }),
    );
    wrap.append(top);

    const playing = st.phase === 'playing';
    for (const room of content.rooms.list) {
      const sec = document.createElement('div');
      sec.className = 'room' + (room.id === st.room ? ' here' : '');
      const head = document.createElement('div');
      head.className = 'room-head';
      const ok = game.canEnter(room.id);
      head.append(`${room.name}${ok ? '' : '（鎖）'}`);
      if (room.id !== st.room) head.append(btn('前往', () => act.go(room.id), { disabled: !playing, title: ok ? '' : '會被擋下，可看 blocked 事件' }));
      sec.append(head);

      const ul = document.createElement('ul');
      const li = (b) => { const el = document.createElement('li'); el.append(b); ul.append(el); };
      if (room.id === 'r401') li(btn('門', act.door, { disabled: !playing }));
      for (const p of content.puzzles.filter((p) => p.room === room.id)) {
        const label = `${p.order}. ${p.title}（${p.object}）${game.isSolved(p.id) ? ' ✓' : ''}`;
        li(btn(label, () => act.puzzle(p), { disabled: !playing || game.isSolved(p.id) }));
      }
      for (const e of content.eggs.filter((e) => e.room === room.id)) li(btn(e.name, () => act.egg(e.id), { disabled: !playing }));
      for (const c of room.clues) li(btn(`📄 ${c.name}`, () => act.clue(c)));
      sec.append(ul);
      wrap.append(sec);
    }

    const h = document.createElement('h2');
    h.textContent = '事件紀錄';
    const logEl = document.createElement('div');
    logEl.className = 'log';
    for (const l of logLines) {
      const d = document.createElement('div');
      d.className = l.cls;
      d.textContent = l.text;
      logEl.append(d);
    }
    wrap.append(h, logEl);
    root.append(wrap);
    logEl.scrollTop = logEl.scrollHeight;
  }
}
