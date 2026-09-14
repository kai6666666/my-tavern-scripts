// @ts-nocheck
/**
 * get-gacha-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { mergeLegacyGachaStateForLocalStorage } from './gacha-helpers';
export function createGetGachaState(deps: any) {
  const getGachaState = (rawData?: unknown, createIfMissing = false): GachaState | null => {
    const storedState = deps.normalizeGachaStateRecord(deps.getStoredGachaStateSnapshot());
    const legacyDatabaseState = deps.getLegacyGachaStateFromRawData(rawData);
    if (legacyDatabaseState && (!storedState || !deps.hasMigratedLegacyGachaState())) {
      const migratedState = storedState
        ? mergeLegacyGachaStateForLocalStorage(storedState, legacyDatabaseState)
        : legacyDatabaseState;
      if (deps.saveStoredGachaStateSnapshot(migratedState)) deps.markLegacyGachaStateMigrated();
      return migratedState;
    }

    if (storedState) return storedState;
    return createIfMissing ? deps.createDefaultGachaState() : null;
  };
  return getGachaState;
}
