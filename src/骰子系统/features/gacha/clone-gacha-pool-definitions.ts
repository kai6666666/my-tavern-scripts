// @ts-nocheck
/**
 * clone-gacha-pool-definitions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolDefinition } from '../../entities/gacha-items';
export function createCloneGachaPoolDefinitions(deps: any) {
  const cloneGachaPoolDefinitions = (pools: readonly GachaPoolDefinition[]): GachaPoolDefinition[] =>
    JSON.parse(JSON.stringify(pools)) as GachaPoolDefinition[];
  return cloneGachaPoolDefinitions;
}
