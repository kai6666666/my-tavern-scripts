// @ts-nocheck
/**
 * is-gacha-pickup-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition, GachaPoolTag } from '../../entities/gacha-items';
export function createIsGachaPickupItem(deps: any) {
  const isGachaPickupItem = (poolTag: GachaPoolTag, item: GachaItemDefinition): boolean =>
    deps.getGachaPickupItems(poolTag).some(pickup => pickup.id === item.id);
  return isGachaPickupItem;
}
