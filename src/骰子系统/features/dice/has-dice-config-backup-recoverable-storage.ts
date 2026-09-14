// @ts-nocheck
/**
 * has-dice-config-backup-recoverable-storage.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasDiceConfigBackupRecoverableStorage(deps: any) {
  const hasDiceConfigBackupRecoverableStorage = (
    payload: DiceConfigBackupModulePayload,
    definition: DiceConfigBackupModuleDefinition,
  ): boolean =>
    Object.entries(payload.storage || {}).some(([key, value]) => {
      if (!definition.storageKeys.includes(key) || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (deps.isDiceConfigBackupRecord(value)) return Object.keys(value).length > 0;
      return value !== null && value !== '';
    });
  return hasDiceConfigBackupRecoverableStorage;
}
