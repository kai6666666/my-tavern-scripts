// @ts-nocheck
/**
 * validate-advanced-preset-custom-fields.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetCustomFields(deps: any) {
  const validateAdvancedPresetCustomFields = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
  ): void => {
    if (preset.customFields === undefined) return;
    if (!Array.isArray(preset.customFields)) {
      deps.pushAdvancedPresetIssue(issues, 'customFields', '必须是数组');
      return;
    }

    const allowedTypes = new Set(['number', 'text', 'select', 'toggle']);
    const ids = new Set<string>();
    preset.customFields.forEach((field, index) => {
      const path = `customFields[${index}]`;
      if (!deps.isAdvancedPresetRecord(field)) {
        deps.pushAdvancedPresetIssue(issues, path, '必须是对象');
        return;
      }
      if (typeof field.id !== 'string' || !field.id.trim()) {
        deps.pushAdvancedPresetIssue(issues, `${path}.id`, '必须是非空字符串');
      } else if (ids.has(field.id)) {
        deps.pushAdvancedPresetIssue(issues, `${path}.id`, `重复的自定义字段 ID: ${field.id}`);
      } else {
        ids.add(field.id);
      }
      if (typeof field.type !== 'string' || !allowedTypes.has(field.type)) {
        deps.pushAdvancedPresetIssue(issues, `${path}.type`, '必须是 number/text/select/toggle 之一');
      }
      if ('label' in field && typeof field.label !== 'string') {
        deps.pushAdvancedPresetIssue(issues, `${path}.label`, '必须是字符串');
      }
      if ('defaultValue' in field) {
        const valueType = typeof field.defaultValue;
        if (valueType !== 'number' && valueType !== 'string' && valueType !== 'boolean') {
          deps.pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '必须是数字、字符串或布尔值');
        }
      }
      if ('options' in field && !Array.isArray(field.options)) {
        deps.pushAdvancedPresetIssue(issues, `${path}.options`, '必须是数组');
      }
    });
  };
  return validateAdvancedPresetCustomFields;
}
