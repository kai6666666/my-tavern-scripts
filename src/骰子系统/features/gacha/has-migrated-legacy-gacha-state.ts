// @ts-nocheck
/**
 * has-migrated-legacy-gacha-state.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHasMigratedLegacyGachaState(deps: any) {
  const hasMigratedLegacyGachaState = (): boolean => deps.getGachaStore().hasMigrated();
  const markLegacyGachaStateMigrated = () => deps.getGachaStore().markMigrated();
  return hasMigratedLegacyGachaState;
}
