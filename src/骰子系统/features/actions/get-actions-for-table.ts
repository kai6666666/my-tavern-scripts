// @ts-nocheck
/**
 * get-actions-for-table.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetActionsForTable(deps: any) {
  const getActionsForTable = (tableName: string) => {
    const config = deps.getGMConfig();
    if (!config.enabled) return [];

    // 如果用户明确禁用了所有规则，返回空数组
    if ((config as any).action_rules_disabled) return [];

    const lowerName = tableName.toLowerCase();

    // [扩展点] 优先检查用户自定义规则
    const customRules = (config as any).custom_action_groups || [];
    for (const group of customRules) {
      const matched = group.table_keywords.some((keyword: string) => lowerName.includes(keyword.toLowerCase()));
      if (matched) return [...(group.actions || [])]; // 返回副本
    }

    // 回退到内置默认规则
    const builtinRules = config.action_groups || [];
    for (const group of builtinRules) {
      const matched = group.table_keywords.some((keyword: string) => lowerName.includes(keyword.toLowerCase()));
      if (matched) return [...(group.actions || [])]; // 返回副本
    }

    return [];
  };
  return getActionsForTable;
}
