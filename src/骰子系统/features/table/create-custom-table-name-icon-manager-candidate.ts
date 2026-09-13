// @ts-nocheck
/**
 * create-custom-table-name-icon-manager-candidate.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCreateCustomTableNameIconManagerCandidate(deps: any) {
  const createCustomTableNameIconManagerCandidate = (
    context: CustomTableNameIconContext,
    tableKey: string,
    source: CustomTableNameIconManagerCandidateSource,
  ): CustomTableNameIconManagerCandidate | null => {
    const normalizedContext = deps.normalizeCustomTableNameIconContext(context);
    if (!normalizedContext || !deps.isCustomTableNameIconContextAllowed(normalizedContext)) return null;
    const key = deps.getCustomTableNameIconContextKey(normalizedContext);
    return {
      context: normalizedContext,
      key,
      tableKey,
      source,
      searchText: [
        deps.getCustomTableNameIconManagerModuleLabel(normalizedContext.moduleId),
        deps.getCustomTableNameIconManagerSectionLabel(normalizedContext.section),
        normalizedContext.tableName,
        normalizedContext.name,
        deps.getCustomTableNameIconManagerSourceLabel(source),
      ]
        .join(' ')
        .toLowerCase(),
    };
  };
  return createCustomTableNameIconManagerCandidate;
}
