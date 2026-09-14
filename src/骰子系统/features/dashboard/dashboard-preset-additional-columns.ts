// @ts-nocheck
/**
 * dashboard-preset-additional-columns.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDashboardPresetAdditionalColumns(deps: any) {
  const DASHBOARD_PRESET_ADDITIONAL_COLUMNS: Record<string, readonly string[]> = {
    quest: ['priority'],
  };
  return DASHBOARD_PRESET_ADDITIONAL_COLUMNS;
}
