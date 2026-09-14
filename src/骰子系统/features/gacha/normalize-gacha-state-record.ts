// @ts-nocheck
/**
 * normalize-gacha-state-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createNormalizeGachaStateRecord(deps: any) {
  const normalizeGachaStateRecord = (rawValue: unknown): GachaState | null => deps.getGachaStateCore().normalizeRecord(rawValue);
  return normalizeGachaStateRecord;
}
