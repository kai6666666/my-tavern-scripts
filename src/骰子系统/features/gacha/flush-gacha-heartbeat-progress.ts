// @ts-nocheck
/**
 * flush-gacha-heartbeat-progress.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ACTIVE_SECONDS_PER_FORTUNE } from '../../entities/gacha-items';
export function createFlushGachaHeartbeatProgress(deps: any) {
  const flushGachaHeartbeatProgress = (_persistProgress: boolean) => {
    const state = deps.getGachaState(undefined, true);
    if (!state) return;

    const now = Date.now();
    const lastHeartbeatAt = state.inputStats.lastHeartbeatAt || now;
    const elapsed = Math.max(0, now - lastHeartbeatAt);
    state.inputStats.lastHeartbeatAt = now;
    state.inputStats.lastActiveAt = Math.max(state.inputStats.lastActiveAt || 0, deps.getLastHumanInputActivityAt() || 0);
    const isTavernPageAwake = document.visibilityState !== 'hidden';
    if (isTavernPageAwake) {
      state.inputStats.lastActiveAt = now;
      state.inputStats.pendingActiveMs += elapsed;
    }

    const rewardStepMs = GACHA_ACTIVE_SECONDS_PER_FORTUNE * 1000;
    const rewardCount = Math.floor(state.inputStats.pendingActiveMs / rewardStepMs);
    if (rewardCount > 0) {
      state.inputStats.pendingActiveMs -= rewardCount * rewardStepMs;
      state.inputStats.totalActiveMinutes += (rewardCount * GACHA_ACTIVE_SECONDS_PER_FORTUNE) / 60;
      state.wallet.fortune += rewardCount;
      deps.recordGachaFortuneGain(
        state,
        rewardCount,
        '活跃奖励',
        `活跃 ${rewardCount * GACHA_ACTIVE_SECONDS_PER_FORTUNE} 秒`,
      );
    }

    if (!deps.saveStoredGachaStateSnapshot(state)) return;
    deps.updateGachaFortuneProgressDom(state);
  };
  return flushGachaHeartbeatProgress;
}
