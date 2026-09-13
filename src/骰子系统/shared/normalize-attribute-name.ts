// @ts-nocheck
/**
 * normalize-attribute-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAttributeName(deps: any) {
  const normalizeAttributeName = (name: string): string => {
    if (!name) return '';
    return String(name)
      .trim()
      .toLowerCase()
      .replace(/[\s_:\-：]/g, '')
      .replace(/值$/u, '');
  };
  return normalizeAttributeName;
}
