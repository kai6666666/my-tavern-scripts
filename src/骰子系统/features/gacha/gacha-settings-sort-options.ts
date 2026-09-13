// @ts-nocheck
/**
 * gacha-settings-sort-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaSettingsFilterOption, GachaSettingsItemSortMode } from './gacha-types';
export function createGachaSettingsSortOptions(deps: any) {
  const GACHA_SETTINGS_SORT_OPTIONS: readonly GachaSettingsFilterOption<GachaSettingsItemSortMode>[] = [
    { value: 'default', label: '默认排序', iconClass: 'fa-arrow-down-wide-short' },
    { value: 'nameAsc', label: '名称 A-Z', iconClass: 'fa-arrow-down-a-z' },
    { value: 'nameDesc', label: '名称 Z-A', iconClass: 'fa-arrow-down-z-a' },
    { value: 'createdDesc', label: '最新创建', iconClass: 'fa-clock' },
    { value: 'createdAsc', label: '最早创建', iconClass: 'fa-clock-rotate-left' },
    { value: 'qualityDesc', label: '品质高到低', iconClass: 'fa-gem' },
    { value: 'weightDesc', label: '权重高到低', iconClass: 'fa-scale-balanced' },
  ];
  return GACHA_SETTINGS_SORT_OPTIONS;
}
