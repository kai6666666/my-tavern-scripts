// @ts-nocheck
/**
 * get-dice-profile-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createGetDiceProfileIndex(deps: any) {
  const getDiceProfileIndex = (): DiceProfileSummary[] => {
    const stored = Store.get(deps.getDICE_PROFILE_INDEX_STORAGE_KEY(), []);
    return Array.isArray(stored) ? stored.filter(item => deps.isDiceConfigBackupRecord(item)) : [];
  };
  return getDiceProfileIndex;
}
