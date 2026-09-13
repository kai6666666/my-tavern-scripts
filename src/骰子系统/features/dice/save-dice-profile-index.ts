// @ts-nocheck
/**
 * save-dice-profile-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createSaveDiceProfileIndex(deps: any) {
  const saveDiceProfileIndex = (summaries: readonly DiceProfileSummary[]): boolean =>
    Store.set(
      deps.getDICE_PROFILE_INDEX_STORAGE_KEY(),
      summaries
        .map(summary => deps.cloneDiceConfigBackupValue(summary))
        .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || ''))),
    );
  return saveDiceProfileIndex;
}
