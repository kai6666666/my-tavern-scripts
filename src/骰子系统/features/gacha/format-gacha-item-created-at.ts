// @ts-nocheck
/**
 * format-gacha-item-created-at.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createFormatGachaItemCreatedAt(deps: any) {
  const formatGachaItemCreatedAt = (item: Pick<GachaItemDefinition, 'createdAt' | 'updatedAt'>): string => {
    const createdAt = deps.getGachaItemCreatedAtMs(item);
    if (!createdAt) return '创建时间未知';
    return new Date(createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };
  return formatGachaItemCreatedAt;
}
