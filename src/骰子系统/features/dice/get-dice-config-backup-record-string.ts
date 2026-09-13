// @ts-nocheck
/**
 * get-dice-config-backup-record-string.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupRecordString(deps: any) {
  const getDiceConfigBackupRecordString = (record: Record<string, unknown>, key: string): string => {
    const value = record[key];
    return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
  };
  return getDiceConfigBackupRecordString;
}
