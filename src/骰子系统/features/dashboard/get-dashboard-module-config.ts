// @ts-nocheck
/**
 * get-dashboard-module-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDashboardModuleConfig(deps: any) {
  const getDashboardModuleConfig = (moduleKey: string): DashboardModuleConfig | null =>
    deps.getDashboardRuntimeConfig()[moduleKey] || null;
  return getDashboardModuleConfig;
}
