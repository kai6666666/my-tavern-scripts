// @ts-nocheck
/**
 * validate-advanced-preset-field-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetFieldConfig(deps: any) {
  const validateAdvancedPresetFieldConfig = (
    field: unknown,
    path: string,
    issues: AdvancedPresetValidationIssue[],
    options: { allowKey?: boolean } = {},
  ): void => {
    if (!deps.isAdvancedPresetRecord(field)) {
      deps.pushAdvancedPresetIssue(issues, path, '必须是对象');
      return;
    }
    if (!('defaultValue' in field)) {
      deps.pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '缺少默认值');
    } else if (typeof field.defaultValue !== 'number' && typeof field.defaultValue !== 'string') {
      deps.pushAdvancedPresetIssue(issues, `${path}.defaultValue`, '必须是数字或字符串');
    }
    if ('label' in field && typeof field.label !== 'string') {
      deps.pushAdvancedPresetIssue(issues, `${path}.label`, '必须是字符串');
    }
    if ('placeholder' in field && typeof field.placeholder !== 'string') {
      deps.pushAdvancedPresetIssue(issues, `${path}.placeholder`, '必须是字符串');
    }
    if ('hidden' in field && typeof field.hidden !== 'boolean') {
      deps.pushAdvancedPresetIssue(issues, `${path}.hidden`, '必须是布尔值');
    }
    if (options.allowKey && 'key' in field && typeof field.key !== 'string') {
      deps.pushAdvancedPresetIssue(issues, `${path}.key`, '必须是字符串');
    }
    if (options.allowKey && 'computeModifier' in field) {
      if (typeof field.computeModifier !== 'string') {
        deps.pushAdvancedPresetIssue(issues, `${path}.computeModifier`, '必须是字符串表达式');
      } else {
        const evalResult = deps.evaluateCondition(field.computeModifier, { $attr: 10 });
        if (!evalResult.success) {
          deps.pushAdvancedPresetIssue(issues, `${path}.computeModifier`, evalResult.error || '表达式无法解析');
        }
      }
    }
  };
  return validateAdvancedPresetFieldConfig;
}
