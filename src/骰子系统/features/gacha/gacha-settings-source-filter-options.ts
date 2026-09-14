// @ts-nocheck
/**
 * gacha-settings-source-filter-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaSettingsFilterOption, GachaSettingsItemSourceFilter } from './gacha-types';
export function createGachaSettingsSourceFilterOptions(deps: any) {
  const GACHA_SETTINGS_SOURCE_FILTER_OPTIONS: readonly GachaSettingsFilterOption<GachaSettingsItemSourceFilter>[] = [
    { value: 'all', label: '全部来源', iconClass: 'fa-layer-group' },
    { value: 'custom', label: '自定义', iconClass: 'fa-pen-nib' },
    { value: 'builtin', label: '内置', iconClass: 'fa-box-archive' },
  ];
  return GACHA_SETTINGS_SOURCE_FILTER_OPTIONS;
}
