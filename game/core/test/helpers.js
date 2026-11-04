import { loadContentSync } from '../load-node.js';
import { createGame, solutionFor } from '../engine.js';
import { memoryStorage } from '../save.js';

export const content = loadContentSync();

export function newGame(opts = {}) {
  return createGame(content, { storage: opts.storage || memoryStorage(), resume: false, ...opts });
}

/** 用正解把某一關的剩下步驟全部解完。 */
export function solvePuzzle(game, pid) {
  const events = [];
  while (!game.isSolved(pid)) {
    const stage = game.currentStage(pid);
    const ev = game.dispatch({ type: 'PUZZLE', puzzle: pid, value: solutionFor(stage) });
    events.push(...ev);
    if (ev.some((e) => e.type === 'error' || e.type === 'death' || e.type === 'wrong')) {
      throw new Error(`${pid}.${stage.id} 用正解卻失敗：${JSON.stringify(ev)}`);
    }
  }
  return events;
}

/** 把主線解到某一關之前（不含）。 */
export function solveUntil(game, pid) {
  for (const p of content.puzzles) {
    if (p.id === pid) return;
    solvePuzzle(game, p.id);
  }
}

/** 讓某一關停在指定步驟。 */
export function reachStage(game, pid, stageId) {
  const p = content.puzzleById[pid];
  while (p.stages[game.getState().puzzles[pid].stage].id !== stageId) {
    game.dispatch({ type: 'PUZZLE', puzzle: pid, value: solutionFor(game.currentStage(pid)) });
  }
}
