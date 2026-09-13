// @ts-nocheck
/**
 * save-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_LAST_SNAPSHOT, Store } from '../../shared/storage/store';
export function createSaveSnapshot(deps: any) {
  const saveSnapshot = v => {
    if (!v) return;
    // 确保数据对象里带有当前 ChatID
    if (typeof v === 'object') {
      v._contextId = deps.getCurrentContextFingerprint();
    }
    Store.set(STORAGE_KEY_LAST_SNAPSHOT, v);
  };
  return saveSnapshot;
}
