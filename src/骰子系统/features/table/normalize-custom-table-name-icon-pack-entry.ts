// @ts-nocheck
/**
 * normalize-custom-table-name-icon-pack-entry.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCustomTableNameIconPackEntry(deps: any) {
  const normalizeCustomTableNameIconPackEntry = (value: unknown): CustomTableNameIconPackEntry | null => {
    const context = deps.normalizeCustomTableNameIconContext(value);
    if (!context) return null;
    const raw = value as Record<string, unknown>;
    const sourceType = raw.sourceType === 'local' ? 'local' : raw.sourceType === 'url' ? 'url' : null;
    if (!sourceType) return null;
    const url = typeof raw.url === 'string' ? raw.url.trim() : '';
    const localKey = typeof raw.localKey === 'string' ? raw.localKey.trim() : '';
    if (sourceType === 'url' && !url) return null;
    if (sourceType === 'local' && !localKey) return null;
    return {
      ...context,
      sourceType,
      ...(sourceType === 'url' ? { url } : { localKey }),
      metadata: deps.normalizeCustomTableNameIconPackEntryMetadata(raw.metadata),
    };
  };
  return normalizeCustomTableNameIconPackEntry;
}
