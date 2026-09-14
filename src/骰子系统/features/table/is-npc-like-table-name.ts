// @ts-nocheck
/**
 * is-npc-like-table-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { isNpcTableName } from '../../shared/constants';
export function createIsNpcLikeTableName(deps: any) {
  const isNpcLikeTableName = (tableName: string): boolean => {
    const normalized = String(tableName || '').toLowerCase();
    return (
      isNpcTableName(tableName) ||
      tableName.includes('人物') ||
      tableName.includes('NPC') ||
      tableName.includes('角色') ||
      tableName.includes('对象') ||
      normalized.includes('character')
    );
  };
  return isNpcLikeTableName;
}
