// @ts-nocheck
/**
 * merge-dice-config-backup-set-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMergeDiceConfigBackupSetArray(deps: any) {
  const mergeDiceConfigBackupSetArray = (current: unknown, incoming: unknown): unknown[] | null => {
    if (!Array.isArray(incoming)) return null;
    const result = deps.cloneDiceConfigBackupValue(incoming);
    const seen = new Set(result.map(item => deps.getDiceConfigBackupValueIdentity(item)));
    if (Array.isArray(current)) {
      current.forEach(item => {
        const identity = deps.getDiceConfigBackupValueIdentity(item);
        if (seen.has(identity)) return;
        seen.add(identity);
        result.push(deps.cloneDiceConfigBackupValue(item));
      });
    }
    return result;
  };
  return mergeDiceConfigBackupSetArray;
}
