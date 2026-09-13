// @ts-nocheck
/**
 * save-stored-gacha-state-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaState } from './gacha-types';
export function createSaveStoredGachaStateSnapshot(deps: any) {
  const saveStoredGachaStateSnapshot = (state: GachaState): boolean => deps.getGachaStore().save(state);
  return saveStoredGachaStateSnapshot;
}
