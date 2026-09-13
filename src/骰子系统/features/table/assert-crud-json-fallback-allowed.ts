// @ts-nocheck
/**
 * assert-crud-json-fallback-allowed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertCrudJsonFallbackAllowed(deps: any) {
  const assertCrudJsonFallbackAllowed = (tableName: string, sheet: unknown): void => {
    const unsupportedConstraint = deps.getCrudUnsupportedFallbackConstraintText(sheet);
    if (!unsupportedConstraint) return;
    throw new Error(
      `更新 "${tableName}" 失败后已取消 JSON 回退保存：数据库结构包含当前无法本地复核的约束（${unsupportedConstraint}）。请修正单元格内容或表格结构后重试。`,
    );
  };
  return assertCrudJsonFallbackAllowed;
}
