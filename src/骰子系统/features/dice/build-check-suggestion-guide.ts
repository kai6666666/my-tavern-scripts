// @ts-nocheck
/**
 * build-check-suggestion-guide.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildCheckSuggestionGuide(deps: any) {
  const buildCheckSuggestionGuide = (preset: AdvancedDicePreset): string => {
    const autoGuide = deps.buildAutoCheckSuggestionGuide(preset);
    const manualGuide = preset.checkSuggestionGuide || {};
    const rule = String(manualGuide.rule || autoGuide.rule).trim();
    const dsl = String(manualGuide.dsl || autoGuide.dsl).trim();
    const examples = String(manualGuide.examples || autoGuide.examples).trim();
    return `【检定规则】
${rule}

【DSL 命令】
${dsl}

【格式示例】
${examples}`;
  };
  return buildCheckSuggestionGuide;
}
