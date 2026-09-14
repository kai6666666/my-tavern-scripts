// @ts-nocheck
/**
 * get-template-inspection-sheets.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetTemplateInspectionSheets(deps: any) {
  const getTemplateInspectionSheets = (template: unknown): TemplateInspectionSheet[] => {
    if (!template || typeof template !== 'object') return [];
    return Object.entries(template as Record<string, unknown>)
      .filter(([key, value]) => key.startsWith('sheet_') && value && typeof value === 'object')
      .map(([key, value]) => {
        const record = value as Record<string, unknown>;
        const content = Array.isArray(record.content) ? record.content : [];
        const headerRow = Array.isArray(content[0]) ? content[0] : [];
        const sourceData = record.sourceData && typeof record.sourceData === 'object' ? record.sourceData : {};
        return {
          key,
          name: String(record.name || key),
          headers: headerRow.map(header => String(header ?? '').trim()).filter(Boolean),
          note: String((sourceData as Record<string, unknown>).note || ''),
        };
      });
  };
  return getTemplateInspectionSheets;
}
