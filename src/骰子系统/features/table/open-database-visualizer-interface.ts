// @ts-nocheck
/**
 * open-database-visualizer-interface.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createOpenDatabaseVisualizerInterface(deps: any) {
  const openDatabaseVisualizerInterface = async (): Promise<void> => {
    const newUiOpenResult = await deps.openDatabaseVisualizerNewUiViaApi();
    if (newUiOpenResult === 'opened') return;
    if (newUiOpenResult === 'unavailable' && (await deps.openLegacyDatabaseVisualizer())) return;

    if (window.toastr) {
      const message =
        newUiOpenResult === 'failed'
          ? '新版可视化编辑器入口调用失败，请检查数据库本体控制台日志'
          : '可视化编辑器接口不可用，请确保数据库脚本已加载';
      window.toastr.warning(message);
    }
  };
  return openDatabaseVisualizerInterface;
}
