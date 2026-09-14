// @ts-nocheck
/**
 * get-custom-gacha-item-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetCustomGachaItemDefinitions(deps: any) {
  const getCustomGachaItemDefinitions = (rawData): GachaItemDefinition[] =>
    deps.getStoredGachaCatalog(rawData, false)?.items || [];

  const getRuntimeGachaRawData = () => cachedRawData || getTableData();
  return getCustomGachaItemDefinitions;
}
