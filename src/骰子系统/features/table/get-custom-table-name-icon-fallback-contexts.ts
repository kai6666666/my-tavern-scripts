// @ts-nocheck
/**
 * get-custom-table-name-icon-fallback-contexts.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCustomTableNameIconFallbackContexts(deps: any) {
  const getCustomTableNameIconFallbackContexts = (
    context: CustomTableNameIconContext,
  ): CustomTableNameIconContext[] => {
    const fallbackContexts: CustomTableNameIconContext[] = [];

    const addFallbackContext = (fallbackContext: CustomTableNameIconContext): void => {
      if (deps.getCustomTableNameIconContextKey(fallbackContext) === deps.getCustomTableNameIconContextKey(context)) return;
      if (!deps.isCustomTableNameIconContextAllowed(fallbackContext)) return;
      if (
        fallbackContexts.some(
          item => deps.getCustomTableNameIconContextKey(item) === deps.getCustomTableNameIconContextKey(fallbackContext),
        )
      )
        return;
      fallbackContexts.push(fallbackContext);
    };

    if (context.moduleId === 'global-interaction-panel') {
      const directModuleId = (() => {
        if (context.section === 'item') return 'item';
        if (context.section === 'equipment') return 'equipment';
        if (context.section === 'faction') return 'faction';
        if (context.section === 'shop') return 'shop';
        return null;
      })();
      if (directModuleId) {
        addFallbackContext({
          ...context,
          moduleId: directModuleId,
        });
      }
    }

    if (context.moduleId !== 'table-name') {
      addFallbackContext({
        ...context,
        moduleId: 'table-name',
        section: 'table',
      });
    }

    return fallbackContexts;
  };
  return getCustomTableNameIconFallbackContexts;
}
