// @ts-nocheck
/**
 * touch-gacha-activity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createTouchGachaActivity(deps: any) {
  const touchGachaActivity = (state: GachaState | null = deps.getGachaState(undefined, true)): GachaState | null => {
    if (!state) return null;
    const now = Date.now();
    state.inputStats.lastActiveAt = Math.max(now, state.inputStats.lastActiveAt || 0, deps.getLastHumanInputActivityAt() || 0);
    if (!state.inputStats.lastHeartbeatAt) {
      state.inputStats.lastHeartbeatAt = now;
    }
    return state;
  };
  return touchGachaActivity;
}
