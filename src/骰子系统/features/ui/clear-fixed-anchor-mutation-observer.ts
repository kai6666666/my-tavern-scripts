// @ts-nocheck
/**
 * clear-fixed-anchor-mutation-observer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearFixedAnchorMutationObserver(deps: any) {
  const clearFixedAnchorMutationObserver = () => {
    if (deps.getFixedAnchorMutationObserver()) {
      deps.getFixedAnchorMutationObserver().disconnect();
      deps.setFixedAnchorMutationObserver(null);
    }
    deps.setFixedAnchorMutationWindow(null);
    deps.setFixedAnchorMutationDocument(null);

    if (deps.getFixedAnchorTargetsRaf() !== null) {
      cancelAnimationFrame(deps.getFixedAnchorTargetsRaf());
      deps.setFixedAnchorTargetsRaf(null);
    }
  };
  return clearFixedAnchorMutationObserver;
}
