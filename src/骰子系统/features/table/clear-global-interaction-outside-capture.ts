// @ts-nocheck
/**
 * clear-global-interaction-outside-capture.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearGlobalInteractionOutsideCapture(deps: any) {
  const clearGlobalInteractionOutsideCapture = (): void => {
    deps.getCleanupGlobalInteractionOutsideCapture()?.();
    deps.setCleanupGlobalInteractionOutsideCapture(null);
  };
  return clearGlobalInteractionOutsideCapture;
}
