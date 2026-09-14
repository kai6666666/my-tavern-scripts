// @ts-nocheck
/**
 * get-custom-table-name-icon-manager-context-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconManagerContextLabel(deps: any) {
  const getCustomTableNameIconManagerContextLabel = (context: CustomTableNameIconContext): string => {
    const seenLabels = new Set<string>();
    const labels = [
      deps.getCustomTableNameIconManagerModuleLabel(context.moduleId),
      context.tableName,
      deps.getCustomTableNameIconManagerSectionLabel(context.section),
    ]
      .map(label => label.trim())
      .filter(label => {
        if (!label) return false;
        const key = deps.normalizeGlobalInteractionCategoryText(label);
        if (seenLabels.has(key)) return false;
        seenLabels.add(key);
        return true;
      });
    return labels.join(' / ') || context.tableName || context.name;
  };
  return getCustomTableNameIconManagerContextLabel;
}
