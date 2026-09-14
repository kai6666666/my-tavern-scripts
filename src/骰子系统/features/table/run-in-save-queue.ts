// @ts-nocheck
/**
 * run-in-save-queue.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRunInSaveQueue(deps: any) {
  const runInSaveQueue = async <T>(task: () => Promise<T>): Promise<T> => {
    const operation = deps.getSaveQueue()
      .catch(error => {
        console.warn('[DICE]ACU runInSaveQueue previous step failed, continue next task:', error);
      })
      .then(task);

    deps.setSaveQueue(operation
      .then(() => undefined)
      .catch(e => {
        console.error('[DICE]ACU runInSaveQueue error:', deps.getRuntimeErrorLogPayload(e));
      }));
    return operation;
  };
  return runInSaveQueue;
}
