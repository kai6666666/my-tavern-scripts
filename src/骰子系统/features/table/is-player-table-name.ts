// @ts-nocheck
/**
 * is-player-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsPlayerTableName(deps: any) {
  const isPlayerTableName = (tableName: string): boolean => {
    const normalized = String(tableName || '').toLowerCase();
    return tableName.includes('主角') || tableName.includes('玩家') || normalized.includes('player');
  };
  return isPlayerTableName;
}
