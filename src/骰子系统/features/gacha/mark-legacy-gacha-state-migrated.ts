// @ts-nocheck
/**
 * mark-legacy-gacha-state-migrated.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createMarkLegacyGachaStateMigrated(deps: any) {
  const markLegacyGachaStateMigrated = () => deps.getGachaStore().markMigrated();
  const getStoredGachaStateSnapshot = (): Record<string, unknown> | null => deps.getGachaStore().load();
  return markLegacyGachaStateMigrated;
}
