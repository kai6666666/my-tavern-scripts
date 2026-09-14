// @ts-nocheck
/**
 * restore-mutable-runtime-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreMutableRuntimeValue(deps: any) {
  const restoreMutableRuntimeValue = (target: unknown, snapshot: unknown): void => {
    if (Array.isArray(target) && Array.isArray(snapshot)) {
      target.splice(0, target.length, ...snapshot);
      return;
    }
    if (!target || !snapshot || typeof target !== 'object' || typeof snapshot !== 'object') return;

    const targetRecord = target as Record<string, unknown>;
    const snapshotRecord = snapshot as Record<string, unknown>;
    Object.keys(targetRecord).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(snapshotRecord, key)) delete targetRecord[key];
    });
    Object.assign(targetRecord, snapshotRecord);
  };
  return restoreMutableRuntimeValue;
}
