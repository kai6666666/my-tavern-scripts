// @ts-nocheck
/**
 * get-dice-config-backup-value-identity.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupValueIdentity(deps: any) {
  const getDiceConfigBackupValueIdentity = (value: unknown): string => {
    if (value === null) return 'null:null';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return `${typeof value}:${String(value)}`;
    }
    try {
      return `json:${JSON.stringify(value)}`;
    } catch {
      return `string:${String(value)}`;
    }
  };
  return getDiceConfigBackupValueIdentity;
}
