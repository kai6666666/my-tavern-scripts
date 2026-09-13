// @ts-nocheck
/**
 * is-diff-sheet.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsDiffSheet(deps: any) {
  const isDiffSheet = (value: unknown): value is DiffSheet => {
    const record = deps.asDiffRecord(value);
    return Boolean(record && Array.isArray(record.content));
  };
  return isDiffSheet;
}
