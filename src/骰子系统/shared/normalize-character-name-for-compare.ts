// @ts-nocheck
/**
 * normalize-character-name-for-compare.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDisplayName } from '../entities/name-alias';
export function createNormalizeCharacterNameForCompare(deps: any) {
  const normalizeCharacterNameForCompare = (value: unknown): string => {
    return getDisplayName(String(value ?? '').trim())
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  };
  return normalizeCharacterNameForCompare;
}
