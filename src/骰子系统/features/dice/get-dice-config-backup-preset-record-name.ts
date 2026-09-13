// @ts-nocheck
/**
 * get-dice-config-backup-preset-record-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupPresetRecordName(deps: any) {
  const getDiceConfigBackupPresetRecordName = (record: Record<string, unknown>): string => {
    const rawName = record.name;
    return typeof rawName === 'string' || typeof rawName === 'number' ? String(rawName).trim() : '';
  };
  return getDiceConfigBackupPresetRecordName;
}
