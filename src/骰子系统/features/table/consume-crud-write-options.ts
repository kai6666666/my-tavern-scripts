// @ts-nocheck
/**
 * consume-crud-write-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createConsumeCrudWriteOptions(deps: any) {
  const consumeCrudWriteOptions = (batchContext?: CrudWriteBatchContext) => {
    if (!batchContext) return { skipNotify: true };
    batchContext.remainingOperations = Math.max(0, batchContext.remainingOperations - 1);
    return batchContext.remainingOperations > 0
      ? { skipNotify: true, skipChatSave: true }
      : { skipNotify: true };
  };
  return consumeCrudWriteOptions;
}
