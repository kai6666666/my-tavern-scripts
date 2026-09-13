// @ts-nocheck
/**
 * clear-fixed-anchor-resize-observer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearFixedAnchorResizeObserver(deps: any) {
  const clearFixedAnchorResizeObserver = () => {
    if (deps.getFixedAnchorResizeObserver()) {
      deps.getFixedAnchorResizeObserver().disconnect();
      deps.setFixedAnchorResizeObserver(null);
    }
  };
  return clearFixedAnchorResizeObserver;
}
