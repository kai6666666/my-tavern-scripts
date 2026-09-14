// @ts-nocheck
/**
 * clear-viewport-input-mutation-observer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearViewportInputMutationObserver(deps: any) {
  const clearViewportInputMutationObserver = () => {
    if (deps.getViewportInputMutationObserver()) {
      deps.getViewportInputMutationObserver().disconnect();
      deps.setViewportInputMutationObserver(null);
    }
    deps.setViewportInputMutationWindow(null);
    deps.setViewportInputMutationDocument(null);

    if (deps.getViewportInputTargetsRaf() !== null) {
      cancelAnimationFrame(deps.getViewportInputTargetsRaf());
      deps.setViewportInputTargetsRaf(null);
    }
  };
  return clearViewportInputMutationObserver;
}
