// @ts-nocheck
/**
 * get-gacha-settings-filter-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaSettingsFilterField } from './gacha-types';
export function createGetGachaSettingsFilterLabel(deps: any) {
  const getGachaSettingsFilterLabel = (field: GachaSettingsFilterField, value: string): string => {
    if (field === 'source') {
      return deps.getGACHA_SETTINGS_SOURCE_FILTER_OPTIONS().find(option => option.value === value)?.label || '全部来源';
    }
    if (field === 'status') {
      return deps.getGACHA_SETTINGS_STATUS_FILTER_OPTIONS().find(option => option.value === value)?.label || '全部状态';
    }
    return deps.getGACHA_SETTINGS_SORT_OPTIONS().find(option => option.value === value)?.label || '默认排序';
  };
  return getGachaSettingsFilterLabel;
}
