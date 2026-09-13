// @ts-nocheck
/**
 * normalize-acu-dice-gacha-import-mode.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogImportMode } from '../gacha/gacha-types';
export function createNormalizeAcuDiceGachaImportMode(deps: any) {
  const normalizeAcuDiceGachaImportMode = (mode: unknown): GachaCatalogImportMode => {
    const value = String(mode || 'overwrite').trim();
    return value === 'skip' || value === 'rename' || value === 'overwrite' ? value : 'overwrite';
  };
  return normalizeAcuDiceGachaImportMode;
}
