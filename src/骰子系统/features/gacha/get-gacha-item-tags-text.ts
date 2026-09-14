// @ts-nocheck
/**
 * get-gacha-item-tags-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaItemTagsText(deps: any) {
  const getGachaItemTagsText = (
    item: Pick<GachaItemDefinition, 'type' | 'quality' | 'tags' | 'customFields'>,
  ): string =>
    String(item.tags || deps.getGachaNamedCustomField(item, ['标签', '标记', '词条']) || `[${item.type}][${item.quality}]`).trim();
  return getGachaItemTagsText;
}
