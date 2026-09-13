// @ts-nocheck
/**
 * create-builtin-dashboard-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../dashboard/dashboard-table-config';
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
export function createCreateBuiltinDashboardPreset(deps: any) {
  const createBuiltinDashboardPreset = (): DashboardPreset => ({
    format: deps.getDASHBOARD_PRESET_FORMAT(),
    version: PRESET_FORMAT_VERSION,
    id: deps.getDASHBOARD_DEFAULT_PRESET_ID(),
    name: '默认仪表盘预设',
    builtin: true,
    description: '内置默认仪表盘抓取规则，可导出后修改并重新导入为自定义预设',
    modules: deps.createDashboardPresetModulesFromConfig(DASHBOARD_TABLE_CONFIG),
  });
  return createBuiltinDashboardPreset;
}
