// @ts-nocheck
/**
 * create-empty-gacha-catalog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
import type { GachaCatalog } from './gacha-types';
export function createCreateEmptyGachaCatalog(deps: any) {
  const createEmptyGachaCatalog = (): GachaCatalog => ({
    version: GACHA_CATALOG_VERSION,
    items: [],
    updatedAt: 0,
  });
  return createEmptyGachaCatalog;
}
