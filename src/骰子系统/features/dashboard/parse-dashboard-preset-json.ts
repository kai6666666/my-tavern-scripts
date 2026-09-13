// @ts-nocheck
/**
 * parse-dashboard-preset-json.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseDashboardPresetJson(deps: any) {
  const parseDashboardPresetJson = (
    jsonText: string,
  ): { name: string; description: string; modules: DashboardPresetModules } => {
    const parsed = deps.parseJsoncRecord(jsonText, '仪表盘预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== deps.getDASHBOARD_PRESET_FORMAT()) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawModules = 'modules' in parsed ? parsed.modules : parsed;
    const modules = deps.normalizeDashboardPresetModules(rawModules);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的仪表盘预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, modules };
  };
  return parseDashboardPresetJson;
}
