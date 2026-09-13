// @ts-nocheck
/**
 * with-gacha-item-settings.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
import type { GachaItemSettingsRecord } from '../../features/gacha/gacha-types';
export function createWithGachaItemSettings(deps: any) {
  const withGachaItemSettings = (
    item: GachaItemDefinition,
    settings: GachaItemSettingsRecord = deps.getStoredGachaItemSettings(),
  ): GachaItemDefinition => {
    const stored = settings.items[item.id];
    return {
      ...item,
      enabled: stored ? stored.enabled : deps.normalizeGachaItemEnabled(item.enabled),
      order: stored ? stored.order : deps.normalizeGachaItemOrder(item.order),
    };
  };
  return withGachaItemSettings;
}
