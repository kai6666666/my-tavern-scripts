// @ts-nocheck
/**
 * wait-for-database-ui-tick.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createWaitForDatabaseUiTick(deps: any) {
  const waitForDatabaseUiTick = (ms = 120): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
  return waitForDatabaseUiTick;
}
