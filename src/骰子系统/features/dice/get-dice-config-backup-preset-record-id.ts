// @ts-nocheck
/**
 * get-dice-config-backup-preset-record-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupPresetRecordId(deps: any) {
  const getDiceConfigBackupPresetRecordId = (record: Record<string, unknown>): string => {
    const rawId = record.id;
    return typeof rawId === 'string' || typeof rawId === 'number' ? String(rawId).trim() : '';
  };
  return getDiceConfigBackupPresetRecordId;
}
