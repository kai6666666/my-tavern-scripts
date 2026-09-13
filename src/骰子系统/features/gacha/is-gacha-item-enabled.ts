// @ts-nocheck
/**
 * is-gacha-item-enabled.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createIsGachaItemEnabled(deps: any) {
  const isGachaItemEnabled = (item: Pick<GachaItemDefinition, 'enabled'>): boolean =>
    deps.normalizeGachaItemEnabled(item.enabled);
  return isGachaItemEnabled;
}
