// @ts-nocheck
/**
 * build-global-interaction-search-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGlobalInteractionSearchText(deps: any) {
  const buildGlobalInteractionSearchText = (
    tableName: string,
    rowTitle: string,
    actions: GlobalInteractionAction[],
  ): string => {
    return [tableName, rowTitle, ...actions.map(action => action.label)].join(' ').toLowerCase();
  };
  return buildGlobalInteractionSearchText;
}
