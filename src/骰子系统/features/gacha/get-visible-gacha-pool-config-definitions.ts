// @ts-nocheck
/**
 * get-visible-gacha-pool-config-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createGetVisibleGachaPoolConfigDefinitions(deps: any) {
  const getVisibleGachaPoolConfigDefinitions = (rawData = deps.getRuntimeGachaRawData()): GachaPoolDefinition[] =>
    deps.getAllGachaPoolConfigDefinitions(rawData).filter(deps.isGachaPoolEnabled);
  return getVisibleGachaPoolConfigDefinitions;
}
