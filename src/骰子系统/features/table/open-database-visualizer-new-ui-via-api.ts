// @ts-nocheck
/**
 * open-database-visualizer-new-ui-via-api.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenDatabaseVisualizerNewUiViaApi(deps: any) {
  const openDatabaseVisualizerNewUiViaApi = async (): Promise<DatabaseVisualizerNewUiOpenResult> => {
    let hasNewUiVisualizerApi = false;

    for (const targetWindow of deps.collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (!api || typeof api.openVisualizer !== 'function') continue;
      hasNewUiVisualizerApi = true;
      const opened = await deps.runMaybeAsyncDatabaseUiOpener(
        () => api.openVisualizer.call(api),
        '新版可视化表格编辑器',
      );
      if (opened) return 'opened';
    }

    return hasNewUiVisualizerApi ? 'failed' : 'unavailable';
  };
  return openDatabaseVisualizerNewUiViaApi;
}
