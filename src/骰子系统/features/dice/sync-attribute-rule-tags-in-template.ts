// @ts-nocheck
/**
 * sync-attribute-rule-tags-in-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSyncAttributeRuleTagsInTemplate(deps: any) {
  const syncAttributeRuleTagsInTemplate = (
    template: RuleTemplateRecord,
    presetId: string | null | undefined,
    debugPrefix: string,
  ): boolean => {
    const built = deps.buildAttributeRulesContent(presetId);
    console.info(`${debugPrefix} 已生成当前属性规则内容`, {
      requestedPresetId: presetId,
      resolvedPresetId: built.preset.id,
      presetName: built.preset.name,
      ...built.debug,
    });
    return deps.replaceRuleTagInTemplate(template, '属性规则', built.content, debugPrefix);
  };
  return syncAttributeRuleTagsInTemplate;
}
