// @ts-nocheck
/**
 * get-gacha-item-description-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaItemDescriptionText(deps: any) {
  const getGachaItemDescriptionText = (item: Pick<GachaItemDefinition, 'description'>): string =>
    String(item.description || '').trim();
  return getGachaItemDescriptionText;
}
