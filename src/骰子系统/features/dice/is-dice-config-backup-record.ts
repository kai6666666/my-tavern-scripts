// @ts-nocheck
/**
 * is-dice-config-backup-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDiceConfigBackupRecord(deps: any) {
  const isDiceConfigBackupRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const cloneDiceConfigBackupValue = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
  return isDiceConfigBackupRecord;
}
