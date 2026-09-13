// @ts-nocheck
/**
 * resolve-custom-table-name-icon-asset-url.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { CustomTableNameIconImageDB } from '../../shared/storage/custom-table-name-icon-image-db';
export function createResolveCustomTableNameIconAssetUrl(deps: any) {
  const resolveCustomTableNameIconAssetUrl = async (
    context?: CustomTableNameIconContext | null,
  ): Promise<string | null> => {
    const resolved = deps.resolveCustomTableNameIcon('fa-table', context);
    if (!resolved.entry) return null;
    if (resolved.entry.sourceType === 'url') {
      const url = resolved.entry.imageUrl;
      if (!deps.isCustomTableNameIconImageUrlValid(url)) {
        CustomTableNameIconImageDB.markUrlFailed(url);
        return null;
      }
      if (CustomTableNameIconImageDB.hasUrlFailed(url)) return null;
      return url;
    }
    const localKey = resolved.entry.localIconKey;
    if (!localKey) return null;
    if (CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return null;
    return await CustomTableNameIconImageDB.get(localKey);
  };
  return resolveCustomTableNameIconAssetUrl;
}
