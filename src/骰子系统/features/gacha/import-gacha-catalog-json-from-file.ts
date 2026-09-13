// @ts-nocheck
/**
 * import-gacha-catalog-json-from-file.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createImportGachaCatalogJsonFromFile(deps: any) {
  const importGachaCatalogJsonFromFile = () => {
    void (async () => {
      try {
        const selected = await deps.pickTextFile();
        if (!selected) return;
        const jsonString = selected.text;
        const rawData = deps.getRuntimeGachaRawData();
        await deps.ensureGachaCatalogLoaded(rawData);
        const analysis = deps.analyzeGachaCatalogImport(jsonString, rawData);
        if (!analysis || analysis.items.length === 0) {
          if (window.toastr) showActionableErrorToast(deps.getGachaCatalogImportFailureMessage(analysis), { suggestion: 'importExport' });
          return;
        }
        deps.showGachaCatalogImportConfirm(jsonString, analysis);
      } catch (error) {
        console.error('[DICE][GACHA]导入文件失败:', error);
        if (window.toastr) showActionableErrorToast('导入失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
      }
    })();
  };
  return importGachaCatalogJsonFromFile;
}
