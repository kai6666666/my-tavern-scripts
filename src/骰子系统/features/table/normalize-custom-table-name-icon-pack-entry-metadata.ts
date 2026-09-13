// @ts-nocheck
/**
 * normalize-custom-table-name-icon-pack-entry-metadata.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCustomTableNameIconPackEntryMetadata(deps: any) {
  const normalizeCustomTableNameIconPackEntryMetadata = (value: unknown): CustomTableNameIconPackEntryMetadata => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {
        imageMimeType: null,
        imageSize: null,
      };
    }
    const raw = value as Record<string, unknown>;
    const imageMimeType = typeof raw.imageMimeType === 'string' ? raw.imageMimeType.trim() : '';
    const imageSize = typeof raw.imageSize === 'number' && Number.isFinite(raw.imageSize) ? raw.imageSize : null;
    const originalLocalKey = typeof raw.originalLocalKey === 'string' ? raw.originalLocalKey.trim() : '';
    return {
      imageMimeType: imageMimeType || null,
      imageSize,
      missingLocalBinary: raw.missingLocalBinary === true,
      originalLocalKey: originalLocalKey || null,
    };
  };
  return normalizeCustomTableNameIconPackEntryMetadata;
}
