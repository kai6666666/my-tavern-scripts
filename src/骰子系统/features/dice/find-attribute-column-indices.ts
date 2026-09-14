// @ts-nocheck
/**
 * find-attribute-column-indices.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFindAttributeColumnIndices(deps: any) {
  const findAttributeColumnIndices = (headers: unknown[], includeSkill = false): number[] => {
    const cols: number[] = [];
    headers.forEach((header, idx) => {
      const text = String(header || '');
      if (text.includes('属性') || (includeSkill && text.includes('技能'))) {
        cols.push(idx);
      }
    });
    return cols;
  };
  return findAttributeColumnIndices;
}
