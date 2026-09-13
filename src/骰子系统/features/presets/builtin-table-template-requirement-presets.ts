// @ts-nocheck
/**
 * builtin-table-template-requirement-presets.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuiltinTableTemplateRequirementPresets(deps: any) {
  const BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS = [
    deps.createBuiltinTableTemplateRequirementPreset(deps.getDefaultTableTemplateRequirementRaw()),
  ];
  return BUILTIN_TABLE_TEMPLATE_REQUIREMENT_PRESETS;
}
