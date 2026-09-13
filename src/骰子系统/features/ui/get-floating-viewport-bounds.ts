// @ts-nocheck
/**
 * get-floating-viewport-bounds.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetFloatingViewportBounds(deps: any) {
  const getFloatingViewportBounds = (targetWindow: Window, targetDocument: Document) => {
    const visualViewport = targetWindow.visualViewport;
    const left = visualViewport?.offsetLeft || 0;
    const top = visualViewport?.offsetTop || 0;
    const width =
      visualViewport?.width ||
      targetWindow.innerWidth ||
      targetDocument.documentElement.clientWidth ||
      window.innerWidth ||
      deps.FLOATING_COLLAPSE_SIZE;
    const height =
      visualViewport?.height ||
      targetWindow.innerHeight ||
      targetDocument.documentElement.clientHeight ||
      window.innerHeight ||
      deps.FLOATING_COLLAPSE_SIZE;

    return { left, top, width, height };
  };
  return getFloatingViewportBounds;
}
