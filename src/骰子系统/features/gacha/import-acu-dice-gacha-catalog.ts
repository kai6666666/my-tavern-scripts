// @ts-nocheck
/**
 * import-acu-dice-gacha-catalog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCatalogImportMode, GachaCatalogImportStats } from '../../features/gacha/gacha-types';
export function createImportAcuDiceGachaCatalog(deps: any) {
  const importAcuDiceGachaCatalog = async (
    input: unknown,
    options: { mode?: GachaCatalogImportMode; silent?: boolean } = {},
  ) => {
    const jsonString = deps.stringifyAcuDiceGachaCatalogInput(input);
    const mode = deps.normalizeAcuDiceGachaImportMode(options.mode);
    let stats: GachaCatalogImportStats | null = null;

    await deps.runInSaveQueue(async () => {
      const rawData = deps.getRuntimeGachaRawData();
      await deps.ensureGachaCatalogLoaded(rawData);
      const analysis = deps.analyzeGachaCatalogImport(jsonString, rawData);
      if (!analysis || analysis.items.length === 0) {
        throw new Error(deps.getGachaCatalogImportFailureMessage(analysis));
      }
      stats = await deps.applyGachaCatalogImport(rawData, analysis, mode);
      deps.refreshGachaVisualization();
      deps.refreshGachaShardShop();
      if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
    });

    if (!stats) throw new Error('骰子商店目录导入失败');
    if (!options.silent && window.toastr) {
      const title = stats.warnings.length > 0 ? '骰子商店导入完成，有部分跳过' : '骰子商店导入完成';
      window.toastr.success(deps.formatGachaCatalogImportStatsText(stats), title);
    }
    const result = deps.cloneAcuDiceApiValue(stats);
    deps.emitEvent('gacha:catalog', { action: 'import', mode, stats: result });
    return result;
  };
  return importAcuDiceGachaCatalog;
}
