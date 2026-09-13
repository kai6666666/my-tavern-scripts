// @ts-nocheck
/**
 * restore-crud-row-id-preparation.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreCrudRowIdPreparation(deps: any) {
  const restoreCrudRowIdPreparation = (preparation: CrudRowIdPreparation): void => {
    preparation?.patchedRows.forEach(patch => {
      patch.row[0] = patch.originalValue;
    });
  };
  return restoreCrudRowIdPreparation;
}
