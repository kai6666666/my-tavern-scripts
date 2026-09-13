// @ts-nocheck
/**
 * notify-ready.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNotifyReady(deps: any) {
  const notifyReady = (): void => {
    deps.acuDiceReady.markReady();
  };
  return notifyReady;
}
