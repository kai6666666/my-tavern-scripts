// @ts-nocheck
/**
 * open-legacy-database-visualizer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenLegacyDatabaseVisualizer(deps: any) {
  const openLegacyDatabaseVisualizer = async (): Promise<boolean> => {
    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterAPI;
      if (api && typeof api.openVisualizer === 'function') {
        const opened = await deps.runMaybeAsyncDatabaseUiOpener(() => api.openVisualizer.call(api), '旧版可视化表格编辑器');
        if (opened) return true;
      }

      const legacyGlobal = (targetWindow as any).openNewVisualizer_ACU;
      if (typeof legacyGlobal === 'function') {
        const opened = await deps.runMaybeAsyncDatabaseUiOpener(() => legacyGlobal.call(targetWindow), '旧版可视化表格编辑器');
        if (opened) return true;
      }
    }

    return false;
  };
  return openLegacyDatabaseVisualizer;
}
