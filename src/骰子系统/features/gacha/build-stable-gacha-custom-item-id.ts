// @ts-nocheck
/**
 * build-stable-gacha-custom-item-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createBuildStableGachaCustomItemId(deps: any) {
  const buildStableGachaCustomItemId = (item: Pick<GachaItemDefinition, 'name' | 'quality' | 'type'>): string => {
    const seed = `${item.name}|${item.quality}|${item.type}`;
    return `custom_${deps.hashGachaCatalogSeed(seed).toString(36)}`;
  };
  return buildStableGachaCustomItemId;
}
