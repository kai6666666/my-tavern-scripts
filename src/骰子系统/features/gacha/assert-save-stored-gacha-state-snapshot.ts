// @ts-nocheck
/**
 * assert-save-stored-gacha-state-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createAssertSaveStoredGachaStateSnapshot(deps: any) {
  const assertSaveStoredGachaStateSnapshot = (state: GachaState): void => deps.getGachaStore().assertSave(state);

  const normalizeGachaStateRecord = (rawValue: unknown): GachaState | null => gachaStateCore.normalizeRecord(rawValue);
  return assertSaveStoredGachaStateSnapshot;
}
