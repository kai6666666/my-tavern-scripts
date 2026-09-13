// @ts-nocheck
/**
 * warn-missing-table-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWarnMissingTableTarget(deps: any) {
  const warnMissingTableTarget = (tableNameValue: unknown) => {
    const tableName = String(tableNameValue ?? '');
    deps.warnTableTemplateIssue(tableName ? `未找到表格「${tableName}」` : '无法定位目标表格');
  };
  return warnMissingTableTarget;
}
