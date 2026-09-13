// @ts-nocheck
/**
 * render-custom-table-name-icon-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { CustomTableNameIconImageDB } from '../../shared/storage/custom-table-name-icon-image-db';
export function createRenderCustomTableNameIconContent(deps: any) {
  const renderCustomTableNameIconContent = (
    fallbackContent: string,
    context?: CustomTableNameIconContext | null,
  ): string => {
    const resolved = deps.resolveCustomTableNameIcon('fa-table', context);
    if (!resolved.entry) return fallbackContent;
    if (resolved.entry.sourceType === 'url') {
      const url = String(resolved.entry.imageUrl || '').trim();
      if (!url || !deps.isCustomTableNameIconImageUrlValid(url) || CustomTableNameIconImageDB.hasUrlFailed(url)) {
        return fallbackContent;
      }
      return deps.renderAsyncImageIconSlotContent(fallbackContent, { url });
    }
    const localKey = String(resolved.entry.localIconKey || '').trim();
    if (!localKey || CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return fallbackContent;
    return deps.renderAsyncImageIconSlotContent(fallbackContent, { localKey });
  };
  return renderCustomTableNameIconContent;
}
