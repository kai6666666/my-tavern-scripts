// @ts-nocheck
/**
 * gacha-state-core-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaStateCore } from './gacha-state';
import { GACHA_RECENT_REWARD_LIMIT } from '../../entities/gacha-items';
export function createGachaStateCoreInstance(deps: any) {
  const gachaStateCore = new GachaStateCore({
    getConfiguredGachaPoolDefinitions: deps.getConfiguredGachaPoolDefinitions,
    testDefaultFortune: deps.getGACHA_TEST_DEFAULT_FORTUNE(),
    recentRewardLimit: GACHA_RECENT_REWARD_LIMIT,
  });
  return gachaStateCore;
}
