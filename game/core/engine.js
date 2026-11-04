// 遊戲規則核心：狀態機、謎題判定、死法、時間、提示、結局。
// 不碰 DOM / Canvas。畫面層只透過 dispatch(action) 和讀取函式跟它互動。

import { createSave } from './save.js';

export const PHASE = Object.freeze({
  PLAYING: 'playing', // 正常遊玩
  DEAD: 'dead', // 死因卡顯示中，等 RETRY
  FINALE: 'finale', // 走出大門，等玩家選「回家」或「點開未讀」
  ENDING: 'ending', // 結局畫面，等 NEW_RUN
});

export const STATE_VERSION = 1;

export function initialState(content) {
  const puzzles = {};
  for (const p of content.puzzles) {
    puzzles[p.id] = { stage: 0, wrong: 0, solved: false, deaths: 0, hintLevel: 0 };
  }
  return {
    v: STATE_VERSION,
    phase: PHASE.PLAYING,
    clock: content.texts.clock.start,
    room: content.rooms.start,
    puzzles,
    items: [],
    flags: {},
    deaths: 0,
    lastDeath: null,
    ending: null,
    aiQuota: content.hints.aiQuota,
    doorLocked: false,
  };
}

export function formatClock(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** 某一步的正解（給測試與除錯「自動解這一步」用）。 */
export function solutionFor(stage) {
  if (stage.type === 'choice') return stage.options.find((o) => o.outcome === 'next').id;
  return stage.answer;
}

const sameList = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
const sameSet = (a, b) => Array.isArray(a) && sameList([...new Set(a)].sort(), [...b].sort());

function isValidState(s, content) {
  return (
    s && s.v === STATE_VERSION && s.puzzles &&
    content.puzzles.every((p) => s.puzzles[p.id]) && Object.values(PHASE).includes(s.phase)
  );
}

/**
 * @param {object} content  buildContent() 的結果
 * @param {{ storage?: Storage, resume?: boolean, debug?: boolean }} [opts]
 */
export function createGame(content, opts = {}) {
  const save = createSave(opts.storage);
  const { clock: clockRule } = content.texts;
  let state = initialState(content);
  if (opts.resume !== false) {
    const saved = save.loadRun();
    if (isValidState(saved, content)) state = saved;
  }

  // ---------- 查詢 ----------
  const hasItem = (id) => state.items.includes(id);
  const isSolved = (pid) => state.puzzles[pid]?.solved === true;
  const meets = (req = {}) =>
    (req.items || []).every(hasItem) && (req.puzzles || []).every(isSolved) &&
    (req.flags || []).every((f) => state.flags[f]);

  function puzzleAvailable(pid) {
    const p = content.puzzleById[pid];
    return !!p && !isSolved(pid) && p.requires.every(isSolved);
  }

  /** 目前該做的主線謎題（提示、任務欄用）。p7、p8 同時開放時優先 p7。 */
  function currentPuzzle() {
    return content.puzzles.find((p) => puzzleAvailable(p.id)) || null;
  }

  function currentStage(pid) {
    const p = content.puzzleById[pid];
    return p ? p.stages[state.puzzles[pid].stage] || null : null;
  }

  function canEnter(roomId) {
    const room = content.rooms.byId[roomId];
    return !!room && meets(room.requires);
  }

  function codex() {
    const c = save.loadCodex();
    const entries = [
      ...content.deaths.map((d) => ({ no: d.no, kind: 'death', id: d.id, title: d.title, origin: d.origin, found: !!c.deaths[d.id], text: c.deaths[d.id] ? d.text : null })),
      ...content.endings.map((e) => ({ no: e.no, kind: 'ending', id: e.id, title: e.title, found: !!c.endings[e.id], text: c.endings[e.id] ? e.lines.join('\n') : null })),
    ].sort((a, b) => a.no - b.no);
    return { entries, found: entries.filter((e) => e.found).length, total: entries.length };
  }

  /** 真結局門檻：圖鑑收集到 trueEndingCodexRequired 格，手機那則未讀才點得開。 */
  function trueEndingGate() {
    const required = content.trueEndingCodexRequired;
    const found = codex().found;
    return { unreadReady: found >= required, found, required };
  }

  function results() {
    const cx = codex();
    const lines = [content.texts.results.peerReview];
    if (state.flags.p7_remembered) lines.push(content.texts.results.rememberedAccount);
    if (isSolved('p7')) lines.push(content.texts.results.passwordCorner);
    return { clock: formatClock(state.clock), deaths: state.deaths, codexFound: cx.found, codexTotal: cx.total, lines };
  }

  // ---------- 狀態變更 ----------
  function die(deathId, events) {
    const d = content.deathById[deathId];
    state.phase = PHASE.DEAD;
    state.lastDeath = deathId;
    state.deaths += 1;
    state.clock += clockRule.perDeath;
    const isNew = save.record('deaths', deathId);
    const corners = content.texts.deathCardCorner;
    const ev = { type: 'death', death: d, isNew, clock: formatClock(state.clock), corner: corners[(state.deaths - 1) % corners.length] };
    const pState = state.puzzles[d.origin];
    if (pState) {
      pState.deaths += 1;
      if (pState.deaths % content.hints.senpaiAfterDeaths === 0) {
        ev.senpai = `${content.hints.puzzles[d.origin].senpai}${content.hints.senpaiSignature}`;
      }
    }
    events.push(ev);
  }

  function end(endingId, events) {
    state.phase = PHASE.ENDING;
    state.ending = endingId;
    const isNew = save.record('endings', endingId);
    events.push({ type: 'ending', ending: content.endingById[endingId], isNew, results: results() });
  }

  function solve(p, events) {
    const ps = state.puzzles[p.id];
    ps.solved = true;
    state.clock += clockRule.perSolve;
    for (const it of p.reward.items) {
      if (!hasItem(it)) {
        state.items.push(it);
        events.push({ type: 'item', item: it });
      }
    }
    for (const f of p.reward.flags) state.flags[f] = true;
    events.push({ type: 'solved', puzzle: p.id, clock: formatClock(state.clock) });
    if (p.onSolve === 'exit') {
      if (state.flags.submitted) {
        state.phase = PHASE.FINALE;
        events.push({ type: 'finale', text: content.texts.finale, ...trueEndingGate() });
      } else {
        end('end_no_submit', events);
      }
      return;
    }
    if (state.clock >= clockRule.dawn) end('end_dawn', events);
  }

  function advance(p, message, events) {
    const ps = state.puzzles[p.id];
    const stage = p.stages[ps.stage];
    ps.wrong = 0;
    events.push({ type: 'stage_cleared', puzzle: p.id, stage: stage.id, message: message || null });
    ps.stage += 1;
    if (ps.stage >= p.stages.length) solve(p, events);
    else events.push({ type: 'stage', puzzle: p.id, stage: p.stages[ps.stage].id });
  }

  function handlePuzzle(pid, value, events) {
    const p = content.puzzleById[pid];
    if (!p) return events.push({ type: 'error', reason: 'unknown_puzzle' });
    if (isSolved(pid)) return events.push({ type: 'error', reason: 'already_solved' });
    if (!puzzleAvailable(pid)) return events.push({ type: 'error', reason: 'locked' });
    if (pid === 'p1' && !state.doorLocked) {
      state.doorLocked = true;
      events.push({ type: 'cutscene', id: 'guard_locks', lines: content.texts.guardLocks });
    }
    const ps = state.puzzles[pid];
    const s = p.stages[ps.stage];
    const wrong = () => {
      ps.wrong += 1;
      if (s.maxWrong && ps.wrong >= s.maxWrong) {
        ps.wrong = 0;
        return die(s.wrongDeath, events);
      }
      events.push({ type: 'wrong', puzzle: pid, stage: s.id, message: s.wrongMessage || null, wrongCount: ps.wrong });
    };

    switch (s.type) {
      case 'code': {
        const answer = typeof value === 'object' && value !== null ? value.answer : value;
        if (String(answer ?? '').trim() !== String(s.answer)) return wrong();
        const checks = (typeof value === 'object' && value?.checks) || {};
        for (const c of s.checks || []) if (checks[c.id] && c.setsFlag) state.flags[c.setsFlag] = true;
        return advance(p, s.successMessage, events);
      }
      case 'wheel':
      case 'sequence':
        return sameList(value, s.answer) ? advance(p, s.successMessage, events) : wrong();
      case 'toggles':
        return sameSet(value, s.answer) ? advance(p, s.successMessage, events) : wrong();
      case 'select': {
        const v = value || {};
        const rule = (s.deathRules || []).find((r) => Object.entries(r.match).every(([k, x]) => v[k] === x));
        if (rule) return die(rule.death, events);
        const ok = Object.entries(s.answer).every(([k, x]) => v[k] === x);
        return ok ? advance(p, s.successMessage, events) : wrong();
      }
      case 'choice': {
        const o = s.options.find((x) => x.id === value);
        if (!o) return events.push({ type: 'error', reason: 'unknown_option' });
        if (o.outcome === 'death') return die(o.death, events);
        if (o.outcome === 'stay') return events.push({ type: 'message', text: o.message || '' });
        return advance(p, o.message, events);
      }
      default:
        return events.push({ type: 'error', reason: 'unknown_stage_type' });
    }
  }

  function handleHint(events) {
    const p = currentPuzzle();
    if (!p) return events.push({ type: 'hint', text: null });
    const ps = state.puzzles[p.id];
    const list = content.hints.puzzles[p.id].ai;
    // 這關的提示都給過了：重講最後一句，不再扣額度（不然第 3 次會白白浪費掉）
    if (ps.hintLevel >= list.length) {
      return events.push({ type: 'hint', puzzle: p.id, text: list[list.length - 1], quotaOut: false, quota: state.aiQuota, repeat: true });
    }
    if (state.aiQuota <= 0) return events.push({ type: 'hint', puzzle: p.id, text: content.hints.aiQuotaOutText, quotaOut: true, quota: 0 });
    state.aiQuota -= 1;
    const text = list[Math.min(ps.hintLevel, list.length - 1)];
    ps.hintLevel += 1;
    events.push({ type: 'hint', puzzle: p.id, text, quotaOut: false, quota: state.aiQuota });
  }

  // ---------- 除錯 ----------
  function handleDebug(action, events) {
    if (!opts.debug) return events.push({ type: 'error', reason: 'debug_disabled' });
    switch (action.type) {
      case 'DEBUG_JUMP': {
        const target = content.puzzleById[action.puzzle];
        if (!target) return events.push({ type: 'error', reason: 'unknown_puzzle' });
        state = initialState(content);
        state.doorLocked = true;
        let n = 0;
        for (const p of content.puzzles) {
          if (p.order >= target.order) break;
          state.puzzles[p.id].solved = true;
          state.puzzles[p.id].stage = p.stages.length;
          for (const it of p.reward.items) if (!hasItem(it)) state.items.push(it);
          for (const f of p.reward.flags) state.flags[f] = true;
          n += 1;
        }
        state.clock = clockRule.start + clockRule.perSolve * n;
        state.room = target.room;
        return events.push({ type: 'debug', did: 'jump', puzzle: target.id });
      }
      case 'DEBUG_DEATH':
        if (!content.deathById[action.death]) return events.push({ type: 'error', reason: 'unknown_death' });
        return die(action.death, events);
      case 'DEBUG_ENDING':
        if (!content.endingById[action.ending]) return events.push({ type: 'error', reason: 'unknown_ending' });
        return end(action.ending, events);
      case 'DEBUG_UNLOCK_ALL': {
        const c = save.loadCodex();
        for (const d of content.deaths) c.deaths[d.id] = c.deaths[d.id] || 1;
        for (const e of content.endings) c.endings[e.id] = c.endings[e.id] || 1;
        save.writeCodex(c);
        return events.push({ type: 'debug', did: 'unlock_all' });
      }
      case 'DEBUG_CLOCK':
        state.clock = Number(action.clock);
        return events.push({ type: 'debug', did: 'clock', clock: formatClock(state.clock) });
      case 'DEBUG_SOLVE_STAGE': {
        const p = currentPuzzle();
        if (!p) return events.push({ type: 'error', reason: 'nothing_to_solve' });
        return handlePuzzle(p.id, solutionFor(currentStage(p.id)), events);
      }
      default:
        return events.push({ type: 'error', reason: 'unknown_action' });
    }
  }

  // ---------- 入口 ----------
  const PLAYING_ONLY = new Set(['GO', 'DOOR', 'PUZZLE', 'EGG', 'HINT', 'PHONE']);

  function dispatch(action) {
    const events = [];
    const t = action?.type;
    if (PLAYING_ONLY.has(t) && state.phase !== PHASE.PLAYING) {
      events.push({ type: 'error', reason: 'wrong_phase', phase: state.phase });
      return events;
    }
    switch (t) {
      case 'NEW_RUN':
        state = initialState(content);
        events.push({ type: 'new_run', opening: content.texts.opening, tutorialNote: content.texts.tutorialNote });
        break;
      case 'GO':
        if (!content.rooms.byId[action.room]) events.push({ type: 'error', reason: 'unknown_room' });
        else if (!canEnter(action.room)) events.push({ type: 'blocked', room: action.room, requires: content.rooms.byId[action.room].requires });
        else {
          state.room = action.room;
          events.push({ type: 'moved', room: action.room });
        }
        break;
      case 'DOOR':
        if (state.doorLocked) events.push({ type: 'message', text: content.texts.doorLocked });
        else die('d_door', events); // 門其實沒鎖：記一筆死法，重來後繼續玩
        break;
      case 'PUZZLE':
        handlePuzzle(action.puzzle, action.value, events);
        break;
      case 'EGG': {
        const egg = content.eggById[action.egg];
        if (!egg) events.push({ type: 'error', reason: 'unknown_egg' });
        else die(egg.death, events);
        break;
      }
      case 'HINT':
        handleHint(events);
        break;
      case 'PHONE':
        events.push({ type: 'message', text: content.texts.phoneTapDuringNight });
        break;
      case 'RETRY':
        if (state.phase !== PHASE.DEAD) {
          events.push({ type: 'error', reason: 'wrong_phase', phase: state.phase });
          break;
        }
        if (state.clock >= clockRule.dawn) end('end_dawn', events);
        else {
          state.phase = PHASE.PLAYING;
          events.push({ type: 'retry', clock: formatClock(state.clock) });
        }
        break;
      case 'FINALE':
        if (state.phase !== PHASE.FINALE) events.push({ type: 'error', reason: 'wrong_phase', phase: state.phase });
        else if (action.choice === 'unread') {
          const gate = trueEndingGate();
          if (gate.unreadReady) end('end_true', events);
          else {
            const f = content.texts.finale;
            events.push({
              type: 'finale_locked',
              text: f.unreadLocked,
              hint: f.unreadLockedHint.replace('{required}', gate.required).replace('{found}', gate.found),
              ...gate,
            });
          }
        }
        else if (action.choice === 'home') end('end_normal', events);
        else events.push({ type: 'error', reason: 'unknown_choice' });
        break;
      default:
        if (typeof t === 'string' && t.startsWith('DEBUG_')) handleDebug(action, events);
        else events.push({ type: 'error', reason: 'unknown_action' });
    }
    save.saveRun(state);
    return events;
  }

  return {
    dispatch,
    getState: () => structuredClone(state),
    currentPuzzle,
    currentStage,
    puzzleAvailable,
    canEnter,
    hasItem,
    isSolved,
    codex,
    results,
    trueEndingGate,
    clockText: () => formatClock(state.clock),
    content,
  };
}
