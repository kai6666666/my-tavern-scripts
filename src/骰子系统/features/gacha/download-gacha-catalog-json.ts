// @ts-nocheck
/**
 * download-gacha-catalog-json.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { normalizeGachaPoolId } from './gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createDownloadGachaCatalogJson(deps: any) {
  const downloadGachaCatalogJson = async (poolId?: GachaPoolTag) => {
    const rawData = deps.getRuntimeGachaRawData();
    await deps.ensureGachaCatalogLoaded(rawData);
    const normalizedPoolId = normalizeGachaPoolId(poolId);
    const isPoolExport = Boolean(normalizedPoolId);
    const json = deps.exportGachaCatalogJson(rawData, normalizedPoolId);
    const hasExportableItems = deps.getGachaCatalogItemsForExport(rawData, normalizedPoolId).length > 0;
    const datePart = new Date().toISOString().slice(0, 10);
    let filename = '';
    if (isPoolExport) {
      const pool = deps.getAllGachaPoolConfigDefinitions(rawData).find(candidate => candidate.id === normalizedPoolId);
      filename = `gacha-pool_${deps.buildGachaExportNamePart(pool?.name || normalizedPoolId)}_${datePart}.json`;
    } else {
      filename = `gacha-items_${datePart}.${hasExportableItems ? 'json' : 'jsonc'}`;
    }
    if (hasExportableItems || isPoolExport) deps.downloadJsonFile(json, filename);
    else deps.downloadJsoncFile(json, filename);
    if (window.toastr) window.toastr.success(isPoolExport ? '卡池 JSON 已导出' : '自定义物品卡池已导出');
  };
  return downloadGachaCatalogJson;
}
