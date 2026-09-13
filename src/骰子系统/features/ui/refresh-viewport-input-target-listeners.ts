// @ts-nocheck
/**
 * refresh-viewport-input-target-listeners.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshViewportInputTargetListeners(deps: any) {
  const refreshViewportInputTargetListeners = (targetWindow: Window, targetDocument: Document) => {
    deps.clearViewportInputTargetListeners();

    if (!deps.getViewportBoundsRefreshHandler()) return;

    const elements = deps.getViewportBottomAnchorElements(targetDocument);
    const eventHandler = deps.getViewportBoundsRefreshHandler() as EventListener;
    deps.setViewportInputObservedElements(elements);

    elements.forEach(el => {
      deps.VIEWPORT_BOTTOM_REFRESH_EVENTS.forEach(eventName => {
        el.addEventListener(eventName, eventHandler, { capture: true, passive: true });
      });
    });

    const ResizeObserverCtor = targetWindow.ResizeObserver || window.ResizeObserver;
    if (ResizeObserverCtor) {
      deps.setViewportInputResizeObserver(new ResizeObserverCtor(() => deps.getViewportBoundsRefreshHandler()?.()));
      elements.forEach(el => deps.getViewportInputResizeObserver()?.observe(el));
    }
  };
  return refreshViewportInputTargetListeners;
}
