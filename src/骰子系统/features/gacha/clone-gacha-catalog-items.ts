// @ts-nocheck
/**
 * clone-gacha-catalog-items.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createCloneGachaCatalogItems(deps: any) {
  const cloneGachaCatalogItems = (items: readonly GachaItemDefinition[]): GachaItemDefinition[] =>
    JSON.parse(JSON.stringify(items)) as GachaItemDefinition[];

  const getGachaCatalogScopeKey = (): string => GACHA_CATALOG_GLOBAL_SCOPE_KEY;
  return cloneGachaCatalogItems;
}
