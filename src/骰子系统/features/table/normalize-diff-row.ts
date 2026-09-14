// @ts-nocheck
/**
 * normalize-diff-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { DiffRow } from './table-template-requirements';
export function createNormalizeDiffRow(deps: any) {
  const normalizeDiffRow = (row: unknown): DiffRow => (Array.isArray(row) ? row : []);
  return normalizeDiffRow;
}
