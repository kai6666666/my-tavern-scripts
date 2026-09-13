// @ts-nocheck
/**
 * has-dice-config-backup-local-image-reference.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasDiceConfigBackupLocalImageReference(deps: any) {
  const hasDiceConfigBackupLocalImageReference = (value: unknown, depth = 0): boolean => {
    if (depth > 8) return false;
    if (Array.isArray(value)) return value.some(item => hasDiceConfigBackupLocalImageReference(item, depth + 1));
    if (!deps.isDiceConfigBackupRecord(value)) return false;
    if (value.sourceType === 'local') return true;
    if (typeof value.localIconKey === 'string' && value.localIconKey.trim()) return true;
    return Object.values(value).some(item => hasDiceConfigBackupLocalImageReference(item, depth + 1));
  };
  return hasDiceConfigBackupLocalImageReference;
}
