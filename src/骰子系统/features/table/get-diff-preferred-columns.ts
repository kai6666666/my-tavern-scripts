// @ts-nocheck
/**
 * get-diff-preferred-columns.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetDiffPreferredColumns(deps: any) {
  const getDiffPreferredColumns = (headers: DiffRow): number[] => {
    const indices: number[] = [];
    const add = (index: number): void => {
      if (index >= 0 && !indices.includes(index)) indices.push(index);
    };

    headers.forEach((header, index) => {
      const normalized = deps.normalizeDiffHeader(header);
      if (!normalized) return;
      if (deps.getDIFF_ID_HEADER_KEYWORDS().some(keyword => normalized.includes(keyword.toLowerCase()))) add(index);
    });

    add(1);
    add(0);
    return indices;
  };
  return getDiffPreferredColumns;
}
