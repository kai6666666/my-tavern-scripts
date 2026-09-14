// @ts-nocheck
/**
 * dedupe-interaction-actions.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDedupeInteractionActions(deps: any) {
  const dedupeInteractionActions = (actions: GlobalInteractionAction[]): GlobalInteractionAction[] => {
    const seenLabels = new Set<string>();
    const result: GlobalInteractionAction[] = [];

    actions.forEach(action => {
      const normalizedLabel = deps.normalizeInteractionLabel(action.label);
      if (!normalizedLabel || seenLabels.has(normalizedLabel)) return;
      seenLabels.add(normalizedLabel);
      result.push(action);
    });

    return result;
  };
  return dedupeInteractionActions;
}
