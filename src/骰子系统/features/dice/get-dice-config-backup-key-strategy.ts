// @ts-nocheck
/**
 * get-dice-config-backup-key-strategy.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiceConfigBackupKeyStrategy(deps: any) {
  const getDiceConfigBackupKeyStrategy = (key: string): DiceConfigBackupKeyStrategy =>
    deps.getDICE_CONFIG_BACKUP_KEY_STRATEGIES()[key] || 'raw';
  return getDiceConfigBackupKeyStrategy;
}
