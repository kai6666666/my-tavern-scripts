// @ts-nocheck
/**
 * get-gacha-state-migration-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGachaStateMigrationKey(deps: any) {
  const getGachaStateMigrationKey = (): string => deps.getGachaStore().getMigrationKey();
  const hasMigratedLegacyGachaState = (): boolean => deps.getGachaStore().hasMigrated();
  return getGachaStateMigrationKey;
}
