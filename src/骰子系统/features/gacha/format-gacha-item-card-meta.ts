// @ts-nocheck
/**
 * format-gacha-item-card-meta.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createFormatGachaItemCardMeta(deps: any) {
  const formatGachaItemCardMeta = (
    item: Pick<GachaItemDefinition, 'type' | 'quality' | 'tags' | 'customFields' | 'grantQuantity'>,
    quantity = Math.max(1, Math.floor(Number(item.grantQuantity) || 1)),
  ): string => `${item.type} · ${item.quality} · ${deps.getGachaItemTagsText(item)} · 数量×${String(quantity)}`;
  return formatGachaItemCardMeta;
}
