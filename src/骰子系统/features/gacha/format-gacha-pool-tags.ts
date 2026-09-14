// @ts-nocheck
/**
 * format-gacha-pool-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createFormatGachaPoolTags(deps: any) {
  const formatGachaPoolTags = (poolTags: readonly GachaPoolTag[], rawData = deps.getRuntimeGachaRawData()): string =>
    poolTags.map(tag => deps.getGachaPoolDisplayName(tag, rawData)).join('、');
  return formatGachaPoolTags;
}
