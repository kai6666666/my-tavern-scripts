// @ts-nocheck
/**
 * gacha-settings-status-filter-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaSettingsFilterOption, GachaSettingsItemStatusFilter } from './gacha-types';
export function createGachaSettingsStatusFilterOptions(deps: any) {
  const GACHA_SETTINGS_STATUS_FILTER_OPTIONS: readonly GachaSettingsFilterOption<GachaSettingsItemStatusFilter>[] = [
    { value: 'all', label: '全部状态', iconClass: 'fa-toggle-on' },
    { value: 'enabled', label: '启用', iconClass: 'fa-circle-check' },
    { value: 'disabled', label: '禁用', iconClass: 'fa-circle-pause' },
  ];
  return GACHA_SETTINGS_STATUS_FILTER_OPTIONS;
}
