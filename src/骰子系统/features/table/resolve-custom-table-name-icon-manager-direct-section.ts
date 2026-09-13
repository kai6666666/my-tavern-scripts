// @ts-nocheck
/**
 * resolve-custom-table-name-icon-manager-direct-section.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveCustomTableNameIconManagerDirectSection(deps: any) {
  const resolveCustomTableNameIconManagerDirectSection = (tableName: string): CustomTableNameIconSection | null => {
    const normalizedName = deps.normalizeGlobalInteractionCategoryText(tableName);
    if (normalizedName.includes('商店') || normalizedName.includes('店铺') || normalizedName.includes('shop'))
      return 'shop';
    const meta = deps.resolveGlobalInteractionSectionMeta(tableName);
    if (meta.kind === 'item' || meta.kind === 'equipment' || meta.kind === 'faction') return meta.kind;
    return null;
  };
  return resolveCustomTableNameIconManagerDirectSection;
}
