// @ts-nocheck
/**
 * get-gacha-item-created-at-ms.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaItemCreatedAtMs(deps: any) {
  const getGachaItemCreatedAtMs = (item: Pick<GachaItemDefinition, 'createdAt' | 'updatedAt'>): number => {
    const createdAt = deps.normalizeGachaTimestamp(item.createdAt);
    if (createdAt) return createdAt;
    return deps.normalizeGachaTimestamp(item.updatedAt) || 0;
  };
  return getGachaItemCreatedAtMs;
}
