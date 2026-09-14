// @ts-nocheck
/**
 * validate-advanced-preset-templates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createValidateAdvancedPresetTemplates(deps: any) {
  const validateAdvancedPresetTemplates = (
    preset: AdvancedDicePreset,
    issues: AdvancedPresetValidationIssue[],
    options: { requireMetaWrapper: boolean },
  ): void => {
    const validateTemplate = (value: unknown, path: string): void => {
      if (value === undefined) return;
      if (typeof value !== 'string') {
        deps.pushAdvancedPresetIssue(issues, path, '必须是字符串');
        return;
      }
      if (!options.requireMetaWrapper) return;
      if (!value.includes('<meta:检定结果>')) {
        deps.pushAdvancedPresetIssue(
          issues,
          path,
          'AI 预设自定义输出模板必须包含 <meta:检定结果> 包裹；不需要自定义时请省略该字段',
        );
      }
      if (!value.includes('</meta:检定结果>')) {
        deps.pushAdvancedPresetIssue(
          issues,
          path,
          'AI 预设自定义输出模板必须包含 </meta:检定结果> 结束标签；不需要自定义时请省略该字段',
        );
      }
    };

    validateTemplate(preset.outputTemplate, 'outputTemplate');
    validateTemplate(preset.contestOutputTemplate, 'contestOutputTemplate');
  };
  return validateAdvancedPresetTemplates;
}
