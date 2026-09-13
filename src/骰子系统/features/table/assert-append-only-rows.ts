// @ts-nocheck
/**
 * assert-append-only-rows.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertAppendOnlyRows(deps: any) {
  const assertAppendOnlyRows = (oldRows, desiredRows): void => {
    if (desiredRows.length < oldRows.length) return;
    for (let index = 0; index < oldRows.length; index++) {
      if (deps.getStableRowKeyForCrud(oldRows[index]) !== deps.getStableRowKeyForCrud(desiredRows[index])) {
        throw new Error('当前变更包含中间插入或行重排，新版数据库 API 无法安全表达，已取消快捷保存。');
      }
    }
  };
  return assertAppendOnlyRows;
}
