// @ts-nocheck
/**
 * build-acu-dice-gacha-state-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { cloneGachaState } from './gacha-helpers';
import type { GachaState } from './gacha-types';
export function createBuildAcuDiceGachaStateSnapshot(deps: any) {
  const buildAcuDiceGachaStateSnapshot = (state?: GachaState | null) => {
    const sourceState = state ? cloneGachaState(state) : deps.getGachaState(undefined, true) || deps.createDefaultGachaState();
    sourceState.activePoolTag = deps.getGachaActivePoolTag(sourceState);
    return {
      fortune: Math.max(0, Math.floor(Number(sourceState.wallet.fortune || 0))),
      wallet: deps.cloneAcuDiceApiValue(sourceState.wallet),
      activePoolTag: sourceState.activePoolTag,
      pity: deps.cloneAcuDiceApiValue(sourceState.pity),
      recentRewards: deps.cloneAcuDiceApiValue(sourceState.recentRewards),
      totalDraws: Math.max(0, Math.floor(Number(sourceState.totalDraws || 0))),
      inputStats: deps.cloneAcuDiceApiValue(sourceState.inputStats),
      progress: deps.getGachaFortuneProgressView(sourceState, { projectActiveProgress: true }),
    };
  };
  return buildAcuDiceGachaStateSnapshot;
}
