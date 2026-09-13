// @ts-nocheck
/**
 * settle-gacha-fortune-for-dice-event.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CHECK_REWARD } from '../../entities/gacha-items';
export function createSettleGachaFortuneForDiceEvent(deps: any) {
  function settleGachaFortuneForDiceEvent(event: string, payload: unknown) {
    if (event !== 'check' && event !== 'contest') return;
    const state = deps.touchGachaActivity(deps.getGachaState(undefined, true));
    if (!state) return;

    const settlementKey = deps.buildGachaDiceEventSettlementKey(event, payload);
    if (settlementKey && state.inputStats.lastSettledCheckId === settlementKey) return;

    state.inputStats.lastSettledCheckId = settlementKey;
    state.inputStats.totalRewardedChecks += 1;
    state.wallet.fortune += GACHA_CHECK_REWARD;
    deps.recordGachaFortuneGain(state, GACHA_CHECK_REWARD, '检定奖励', deps.getGachaDiceEventDetail(event, payload));

    if (!deps.saveStoredGachaStateSnapshot(state)) return;
    deps.refreshGachaVisualization();
  }
  return settleGachaFortuneForDiceEvent;
}
