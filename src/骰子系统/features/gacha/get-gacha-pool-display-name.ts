// @ts-nocheck
/**
 * get-gacha-pool-display-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createGetGachaPoolDisplayName(deps: any) {
  const getGachaPoolDisplayName = (poolTag: GachaPoolTag, rawData = deps.getRuntimeGachaRawData()): string =>
    deps.getAllGachaPoolConfigDefinitions(rawData).find(pool => pool.id === poolTag)?.name || poolTag;
  return getGachaPoolDisplayName;
}
