// @ts-nocheck
/**
 * compare-gacha-item-definitions-for-display.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createCompareGachaItemDefinitionsForDisplay(deps: any) {
  const compareGachaItemDefinitionsForDisplay = (a: GachaItemDefinition, b: GachaItemDefinition): number =>
    deps.normalizeGachaItemOrder(a.order) - deps.normalizeGachaItemOrder(b.order) ||
    deps.getGachaRarityRank(b.quality) - deps.getGachaRarityRank(a.quality) ||
    a.name.localeCompare(b.name, 'zh-Hans-CN');
  return compareGachaItemDefinitionsForDisplay;
}
