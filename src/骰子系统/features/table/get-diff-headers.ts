// @ts-nocheck
/**
 * get-diff-headers.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { DiffRow } from './table-template-requirements';
export function createGetDiffHeaders(deps: any) {
  const getDiffHeaders = (sheet: unknown): DiffRow => deps.getDiffSheetContent(sheet)[0] ?? [];

  const getDiffRows = (sheet: unknown): DiffRow[] => deps.getDiffSheetContent(sheet).slice(1);
  return getDiffHeaders;
}
