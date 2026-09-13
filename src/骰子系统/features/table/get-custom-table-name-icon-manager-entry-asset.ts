// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-entry-asset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { CustomTableNameIconImageDB } from '../../shared/storage/custom-table-name-icon-image-db';
export function createGetCustomTableNameIconManagerEntryAsset(deps: any) {
  const getCustomTableNameIconManagerEntryAsset = async (
    entry: CustomTableNameIconEntry | null,
  ): Promise<{ assetUrl: string; isMissing: boolean }> => {
    if (!entry) return { assetUrl: '', isMissing: false };
    if (entry.sourceType === 'url') {
      const isValid = deps.isCustomTableNameIconImageUrlValid(entry.imageUrl);
      return { assetUrl: isValid ? entry.imageUrl : '', isMissing: !isValid };
    }
    const localKey = entry.localIconKey || '';
    if (!localKey) return { assetUrl: '', isMissing: true };
    const assetUrl = await CustomTableNameIconImageDB.get(localKey);
    return { assetUrl: assetUrl || '', isMissing: !assetUrl };
  };
  return getCustomTableNameIconManagerEntryAsset;
}
