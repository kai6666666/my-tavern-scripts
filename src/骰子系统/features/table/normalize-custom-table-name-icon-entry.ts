// @ts-nocheck
/**
 * normalize-custom-table-name-icon-entry.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCustomTableNameIconEntry(deps: any) {
  const normalizeCustomTableNameIconEntry = (value: unknown): CustomTableNameIconEntry | null => {
    const context = deps.normalizeCustomTableNameIconContext(value);
    if (!context) return null;
    const raw = value as Record<string, unknown>;
    const sourceType = raw.sourceType === 'local' ? 'local' : 'url';
    const imageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl.trim() : '';
    const localIconKey = typeof raw.localIconKey === 'string' ? raw.localIconKey.trim() : '';
    const imageMimeType = typeof raw.imageMimeType === 'string' ? raw.imageMimeType.trim() : '';
    const imageSize = typeof raw.imageSize === 'number' && Number.isFinite(raw.imageSize) ? raw.imageSize : null;
    if (sourceType === 'url') {
      if (!deps.isCustomTableNameIconImageUrlValid(imageUrl)) return null;
    } else if (!localIconKey) {
      return null;
    }
    const createdAt = typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0;
    const updatedAt = typeof raw.updatedAt === 'number' && Number.isFinite(raw.updatedAt) ? raw.updatedAt : createdAt;
    return {
      ...context,
      sourceType,
      imageUrl,
      localIconKey: localIconKey || null,
      imageMimeType: imageMimeType || null,
      imageSize,
      createdAt,
      updatedAt,
    };
  };
  return normalizeCustomTableNameIconEntry;
}
