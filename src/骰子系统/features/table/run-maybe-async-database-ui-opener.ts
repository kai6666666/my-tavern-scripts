// @ts-nocheck
/**
 * run-maybe-async-database-ui-opener.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRunMaybeAsyncDatabaseUiOpener(deps: any) {
  const runMaybeAsyncDatabaseUiOpener = async (opener: () => unknown, context = '数据库界面'): Promise<boolean> => {
    try {
      const result = opener();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        const resolved = await result;
        return resolved !== false;
      }
      return result !== false;
    } catch (error) {
      console.warn(`[DICE]打开${context}失败:`, error);
      return false;
    }
  };
  return runMaybeAsyncDatabaseUiOpener;
}
