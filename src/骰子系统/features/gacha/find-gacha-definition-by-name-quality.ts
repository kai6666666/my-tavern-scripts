// @ts-nocheck
/**
 * find-gacha-definition-by-name-quality.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createFindGachaDefinitionByNameQuality(deps: any) {
  const findGachaDefinitionByNameQuality = (
    name: string,
    quality: string,
    rawData = deps.getRuntimeGachaRawData(),
  ): GachaItemDefinition | null => {
    const normalizedName = String(name || '').trim();
    const normalizedQuality = String(quality || '').trim();
    if (!normalizedName || !normalizedQuality) return null;
    return (
      deps.getAllGachaItemDefinitions(rawData).find(
        definition => definition.name === normalizedName && definition.quality === normalizedQuality,
      ) || null
    );
  };
  return findGachaDefinitionByNameQuality;
}
