// @ts-nocheck
/**
 * is-rule-template-sheet-with-note.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsRuleTemplateSheetWithNote(deps: any) {
  const isRuleTemplateSheetWithNote = (value: unknown): value is RuleTemplateSheet => {
    if (!value || typeof value !== 'object') return false;
    const record = value as Record<string, unknown>;
    const sourceData = record.sourceData;
    if (!sourceData || typeof sourceData !== 'object') return false;
    return typeof (sourceData as Record<string, unknown>).note === 'string';
  };
  return isRuleTemplateSheetWithNote;
}
