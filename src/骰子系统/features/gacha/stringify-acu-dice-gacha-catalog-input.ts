// @ts-nocheck
/**
 * stringify-acu-dice-gacha-catalog-input.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CATALOG_EXPORT_KIND, GACHA_CATALOG_VERSION } from '../../entities/gacha-items';
export function createStringifyAcuDiceGachaCatalogInput(deps: any) {
  const stringifyAcuDiceGachaCatalogInput = (input: unknown): string => {
    if (typeof input === 'string') return input;
    if (Array.isArray(input)) {
      return JSON.stringify({ kind: GACHA_CATALOG_EXPORT_KIND, version: GACHA_CATALOG_VERSION, items: input });
    }
    if (input && typeof input === 'object') {
      const record = input as Record<string, unknown>;
      if (!Array.isArray(record.items) && record.name && record.quality) {
        return JSON.stringify({ kind: GACHA_CATALOG_EXPORT_KIND, version: GACHA_CATALOG_VERSION, items: [record] });
      }
    }
    return JSON.stringify(input);
  };
  return stringifyAcuDiceGachaCatalogInput;
}
