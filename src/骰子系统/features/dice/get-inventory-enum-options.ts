// @ts-nocheck
/**
 * get-inventory-enum-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetInventoryEnumOptions(deps: any) {
  const getInventoryEnumOptions = (
    tableName: string,
    fieldKey: Extract<InventoryEditableField, 'type' | 'quality'>,
  ): string[] => {
    const targetColumn = fieldKey === 'type' ? '类型' : '品质';
    const matchedRule = deps.ValidationRuleManager.getEnabledRules().find(rule => {
      if (rule.ruleType !== 'enum') return false;
      if (String(rule.targetColumn || '').trim() !== targetColumn) return false;
      const ruleTableName = String(rule.targetTable || '').trim();
      return ruleTableName === tableName || ruleTableName === '物品表';
    });
    const ruleValues = Array.isArray(matchedRule?.config?.values)
      ? matchedRule.config.values.map(value => String(value || '').trim()).filter(Boolean)
      : [];
    if (ruleValues.length > 0) return ruleValues;
    if (fieldKey === 'type') {
      return deps.INVENTORY_TYPE_OPTIONS.filter(option => option !== '全部');
    }
    return ['普通', '优秀', '稀有', '史诗', '传说', '神话'];
  };
  return getInventoryEnumOptions;
}
