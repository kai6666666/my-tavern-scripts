// @ts-nocheck
/**
 * serialize-acu-dice-gacha-item.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createSerializeAcuDiceGachaItem(deps: any) {
  const serializeAcuDiceGachaItem = (item: GachaItemDefinition, customIds?: ReadonlySet<string>) => ({
    ...deps.serializeGachaCatalogItemForExport(item),
    source: customIds?.has(item.id) ? 'custom' : 'builtin',
  });
  return serializeAcuDiceGachaItem;
}
