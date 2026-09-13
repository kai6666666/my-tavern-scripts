// @ts-nocheck
/**
 * refresh-name-aliases-for-check-suggestion.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshNameAliasesForCheckSuggestion(deps: any) {
  const refreshNameAliasesForCheckSuggestion = () => {
    try {
      const rawDataForAlias = deps.getCachedRawData() || deps.getTableData();
      if (rawDataForAlias) {
        deps.getNameAliasRegistry().rebuild(deps.processJsonData(rawDataForAlias || {}));
      }
    } catch (error) {
      console.warn('[DICE] 检定建议刷新角色别名失败', error);
    }
  };
  return refreshNameAliasesForCheckSuggestion;
}
