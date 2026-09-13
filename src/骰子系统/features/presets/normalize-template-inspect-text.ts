// @ts-nocheck
/**
 * normalize-template-inspect-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeTemplateInspectText(deps: any) {
  const normalizeTemplateInspectText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .toLowerCase();
  return normalizeTemplateInspectText;
}
