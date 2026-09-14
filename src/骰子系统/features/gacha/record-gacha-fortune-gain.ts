// @ts-nocheck
/**
 * record-gacha-fortune-gain.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createRecordGachaFortuneGain(deps: any) {
  const recordGachaFortuneGain = (state: GachaState, gain: number, reason: string, detail: string) => {
    if (gain <= 0) return;
    state.inputStats.lastFortuneGain = gain;
    state.inputStats.lastFortuneReason = reason;
    state.inputStats.lastFortuneDetail = detail;
    state.inputStats.lastFortuneAt = Date.now();
  };
  return recordGachaFortuneGain;
}
