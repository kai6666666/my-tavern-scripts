// @ts-nocheck
/**
 * normalize-imported-gacha-pool-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG, normalizeGachaPoolId } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createNormalizeImportedGachaPoolTags(deps: any) {
  const normalizeImportedGachaPoolTags = (
    rawTags: unknown,
    tagAliases: Record<string, GachaPoolTag> = {},
  ): GachaPoolTag[] => {
    const values = Array.isArray(rawTags) ? rawTags : typeof rawTags === 'string' ? rawTags.split(/[、,，\s]+/) : [];
    const tags = new Set<GachaPoolTag>();
    values.forEach(value => {
      const tag = normalizeGachaPoolId(value);
      if (!tag) return;
      const aliasedTag = tagAliases[tag] || tag;
      if (aliasedTag === GACHA_ALL_POOL_TAG) {
        deps.getGachaAllExpandablePoolTags().forEach(candidate => tags.add(candidate));
      } else {
        tags.add(aliasedTag);
      }
    });
    return Array.from(tags);
  };
  return normalizeImportedGachaPoolTags;
}
