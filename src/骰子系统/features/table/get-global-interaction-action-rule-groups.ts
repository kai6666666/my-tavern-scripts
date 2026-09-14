// @ts-nocheck
/**
 * get-global-interaction-action-rule-groups.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGlobalInteractionActionRuleGroups(deps: any) {
  const getGlobalInteractionActionRuleGroups = (): GlobalInteractionActionRuleGroup[] => {
    const config = deps.getGMConfig() as {
      enabled?: boolean;
      action_rules_disabled?: boolean;
      custom_action_groups?: unknown;
      action_groups?: unknown;
    };
    if (config.enabled === false || config.action_rules_disabled) return [];

    const customRules = Array.isArray(config.custom_action_groups) ? config.custom_action_groups : [];
    const builtinRules = Array.isArray(config.action_groups) ? config.action_groups : [];
    return [...customRules, ...builtinRules]
      .map(rule => ({ table_keywords: deps.getGlobalInteractionRuleKeywords(rule) }))
      .filter(rule => rule.table_keywords.length > 0);
  };
  return getGlobalInteractionActionRuleGroups;
}
