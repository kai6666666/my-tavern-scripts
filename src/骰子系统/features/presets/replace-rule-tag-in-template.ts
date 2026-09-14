// @ts-nocheck
/**
 * replace-rule-tag-in-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReplaceRuleTagInTemplate(deps: any) {
  const replaceRuleTagInTemplate = (
    template: RuleTemplateRecord,
    tag: string,
    content: string,
    debugPrefix: string,
  ): boolean => {
    let modified = false;
    const ruleSheets = Object.entries(template).filter((entry): entry is [string, RuleTemplateSheet] => {
      const [, sheet] = entry;
      if (!deps.isRuleTemplateSheetWithNote(sheet)) return false;
      return sheet.sourceData?.note?.includes(`<${tag}>`) === true;
    });
    console.info(`${debugPrefix} ${tag} 可同步表扫描`, {
      totalSheets: Object.keys(template).length,
      matchedCount: ruleSheets.length,
      matchedSheets: ruleSheets.map(([sheetKey, sheet]) => ({
        sheetKey,
        sheetName: String(sheet.name || ''),
      })),
    });

    ruleSheets.forEach(([sheetKey, sheet]) => {
      const sourceData = sheet.sourceData;
      if (!sourceData || typeof sourceData.note !== 'string') return;
      const originalNote = sourceData.note;
      const nextNote = deps.replaceTag(originalNote, tag, content);
      const changed = nextNote !== originalNote;
      console.info(`${debugPrefix} ${tag} note 替换结果`, {
        sheetKey,
        sheetName: String(sheet.name || ''),
        changed,
        beforeSnippet: deps.getRuleTagSnippet(originalNote, tag),
        afterSnippet: deps.getRuleTagSnippet(nextNote, tag),
      });
      if (changed) {
        sourceData.note = nextNote;
        modified = true;
      }
    });

    return modified;
  };
  return replaceRuleTagInTemplate;
}
