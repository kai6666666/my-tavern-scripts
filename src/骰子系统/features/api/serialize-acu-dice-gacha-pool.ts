// @ts-nocheck
/**
 * serialize-acu-dice-gacha-pool.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createSerializeAcuDiceGachaPool(deps: any) {
  const serializeAcuDiceGachaPool = (pool: GachaPoolDefinition) => ({
    id: pool.id,
    name: pool.name,
    builtin: pool.builtin === true,
    visibleInTabs: pool.visibleInTabs === true,
    includeInAll: pool.includeInAll === true,
    order: Number(pool.order) || 0,
    canDelete: deps.canDeleteGachaPoolDefinition(pool),
  });
  return serializeAcuDiceGachaPool;
}
