// @ts-nocheck
/**
 * assert-crud-insert-required-cells.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertCrudInsertRequiredCells(deps: any) {
  const assertCrudInsertRequiredCells = (tableName: string, headers, row, sheet, rowIndex: number): void => {
    try {
      deps.assertCrudRequiredCellValues(tableName, headers, row, sheet, rowIndex);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(
        message.replace(
          `表 "${tableName}" 第 ${rowIndex + 1} 行存在必填列为空`,
          `向 "${tableName}" 追加第 ${rowIndex + 1} 行前发现必填列为空`,
        ),
      );
    }
  };
  return assertCrudInsertRequiredCells;
}
