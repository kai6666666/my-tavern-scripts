// @ts-nocheck
/**
 * setup-fixed-anchor-mutation-observer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetupFixedAnchorMutationObserver(deps: any) {
  const setupFixedAnchorMutationObserver = (targetWindow: Window, targetDocument: Document) => {
    if (
      deps.getFixedAnchorMutationObserver() &&
      deps.getFixedAnchorMutationWindow() === targetWindow &&
      deps.getFixedAnchorMutationDocument() === targetDocument
    ) {
      return;
    }

    deps.clearFixedAnchorMutationObserver();
    if (!targetDocument.body) return;

    const MutationObserverCtor = targetWindow.MutationObserver || window.MutationObserver;
    deps.setFixedAnchorMutationObserver(new MutationObserverCtor(() => deps.scheduleFixedAnchorTargetRefresh()));
    deps.getFixedAnchorMutationObserver().observe(targetDocument.body, { childList: true, subtree: true });
    deps.setFixedAnchorMutationWindow(targetWindow);
    deps.setFixedAnchorMutationDocument(targetDocument);
  };
  return setupFixedAnchorMutationObserver;
}
