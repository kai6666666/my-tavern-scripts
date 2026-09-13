// @ts-nocheck
/**
 * setup-viewport-input-mutation-observer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetupViewportInputMutationObserver(deps: any) {
  const setupViewportInputMutationObserver = (targetWindow: Window, targetDocument: Document) => {
    if (
      deps.getViewportInputMutationObserver() &&
      deps.getViewportInputMutationWindow() === targetWindow &&
      deps.getViewportInputMutationDocument() === targetDocument
    ) {
      return;
    }

    deps.clearViewportInputMutationObserver();
    if (!targetDocument.body) return;

    const MutationObserverCtor = targetWindow.MutationObserver || window.MutationObserver;
    deps.setViewportInputMutationObserver(new MutationObserverCtor(() => deps.scheduleViewportInputTargetRefresh()));
    deps.getViewportInputMutationObserver().observe(targetDocument.body, { childList: true, subtree: true });
    deps.setViewportInputMutationWindow(targetWindow);
    deps.setViewportInputMutationDocument(targetDocument);
  };
  return setupViewportInputMutationObserver;
}
