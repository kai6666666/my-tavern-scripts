// @ts-nocheck
/**
 * parse-table-template-requirement-preset-json.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseTableTemplateRequirementPresetJson(deps: any) {
  const parseTableTemplateRequirementPresetJson = (jsonText: string) => {
    const parsed = deps.parseJsoncRecord(jsonText, '模板检验预设');
    if (parsed.template || parsed.preset) return parsed;
    if (Object.keys(parsed).some(key => key.startsWith('sheet_'))) {
      return {
        name: String(parsed.name || '导入的表格模板要求'),
        description: '从表格模板文件导入生成。',
        template: parsed,
      };
    }
    return parsed;
  };
  return parseTableTemplateRequirementPresetJson;
}
