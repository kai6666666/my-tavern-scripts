// @ts-nocheck
/**
 * acu-dice-history-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { AcuDiceHistory } from './history';
export function createAcuDiceHistoryInstance(deps: any) {
  const acuDiceHistory = new AcuDiceHistory({
    getCheckHistory: () => deps.checkHistory,
    getContestHistory: () => deps.contestHistory,
  });
  return acuDiceHistory;
}
