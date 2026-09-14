// @ts-nocheck
/**
 * get-gacha-item-grant-quantity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaItemGrantQuantity(deps: any) {
  const getGachaItemGrantQuantity = (item: Pick<GachaItemDefinition, 'grantQuantity'>): number =>
    Math.max(1, Math.floor(Number(item.grantQuantity) || 1));
  return getGachaItemGrantQuantity;
}
