// @ts-nocheck
/**
 * sync-check-rule-tags-in-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSyncCheckRuleTagsInTemplate(deps: any) {
  const syncCheckRuleTagsInTemplate = (
    template: RuleTemplateRecord,
    presetId: string | null | undefined,
    debugPrefix: string,
  ): boolean => {
    const preset = deps.getCheckSuggestionPresetById(presetId);
    if (!preset) {
      console.warn(`${debugPrefix} 找不到可用检定预设，跳过检定规则同步`);
      return false;
    }
    console.info(`${debugPrefix} 已生成当前检定规则内容`, {
      requestedPresetId: presetId,
      resolvedPresetId: preset.id,
      presetName: preset.name,
    });
    return deps.replaceRuleTagInTemplate(template, '检定规则', deps.buildCheckSuggestionGuide(preset), debugPrefix);
  };
  return syncCheckRuleTagsInTemplate;
}
