// @ts-nocheck
/**
 * load-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_LAST_SNAPSHOT, Store } from '../../shared/storage/store';
export function createLoadSnapshot(deps: any) {
  const loadSnapshot = () => {
    const data = Store.get(STORAGE_KEY_LAST_SNAPSHOT);
    if (!data) return null;
    // 获取当前环境指纹
    const currentCtx = deps.getCurrentContextFingerprint();
    // 如果快照里的指纹存在，但和当前不一致，说明是上个角色的数据，必须作废
    if (data._contextId && data._contextId !== currentCtx) {
      return null;
    }
    return data;
  };
  return loadSnapshot;
}
