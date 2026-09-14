// @ts-nocheck
/**
 * build-custom-table-name-icon-pack-entry.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCustomTableNameIconPackEntry(deps: any) {
  const buildCustomTableNameIconPackEntry = (entry: CustomTableNameIconEntry): CustomTableNameIconPackEntry | null => {
    if (!deps.isCustomTableNameIconContextAllowed(entry)) return null;
    if (entry.sourceType === 'url') {
      if (!deps.isCustomTableNameIconImageUrlValid(entry.imageUrl)) return null;
      return {
        moduleId: entry.moduleId,
        tableName: entry.tableName,
        section: entry.section,
        name: entry.name,
        sourceType: 'url',
        url: entry.imageUrl,
        metadata: {
          imageMimeType: entry.imageMimeType,
          imageSize: entry.imageSize,
        },
      };
    }

    const exportedLocalKey = String(entry.localIconKey || deps.getCustomTableNameIconManagerLocalKey(entry)).trim();
    if (!exportedLocalKey) return null;
    return {
      moduleId: entry.moduleId,
      tableName: entry.tableName,
      section: entry.section,
      name: entry.name,
      sourceType: 'local',
      localKey: exportedLocalKey,
      metadata: {
        imageMimeType: entry.imageMimeType,
        imageSize: entry.imageSize,
        missingLocalBinary: true,
        originalLocalKey: exportedLocalKey,
      },
    };
  };
  return buildCustomTableNameIconPackEntry;
}
