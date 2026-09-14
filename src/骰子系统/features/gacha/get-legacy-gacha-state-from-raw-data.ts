// @ts-nocheck
/**
 * get-legacy-gacha-state-from-raw-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createGetLegacyGachaStateFromRawData(deps: any) {
  const getLegacyGachaStateFromRawData = (rawData?: unknown): GachaState | null => {
    if (!rawData || typeof rawData !== 'object') return null;
    const mate = (rawData as Record<string, unknown>).mate;
    if (!mate || typeof mate !== 'object') return null;
    return deps.normalizeGachaStateRecord((mate as Record<string, unknown>).gacha);
  };
  return getLegacyGachaStateFromRawData;
}
