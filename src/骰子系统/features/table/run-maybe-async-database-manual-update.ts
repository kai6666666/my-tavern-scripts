// @ts-nocheck
/**
 * run-maybe-async-database-manual-update.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRunMaybeAsyncDatabaseManualUpdate(deps: any) {
  const runMaybeAsyncDatabaseManualUpdate = async (
    updater: () => unknown,
    source: string,
  ): Promise<DatabaseManualUpdateResult> => {
    try {
      const result = updater();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        const resolved = await result;
        return resolved === false ? { status: 'failed', source } : { status: 'updated', source };
      }
      return result === false ? { status: 'failed', source } : { status: 'updated', source };
    } catch (error) {
      console.warn(`[DICE]${source}调用失败:`, error);
      return { status: 'failed', error, source };
    }
  };
  return runMaybeAsyncDatabaseManualUpdate;
}
