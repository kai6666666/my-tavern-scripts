// @ts-nocheck
/**
 * refresh-fixed-anchor-resize-observer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
export function createRefreshFixedAnchorResizeObserver(deps: any) {
  const refreshFixedAnchorResizeObserver = (targetWindow: Window, targetDocument: Document) => {
    deps.clearFixedAnchorResizeObserver();
    if (!deps.getFixedWrapperBoundsRefreshHandler()) return;

    const ResizeObserverCtor = targetWindow.ResizeObserver || window.ResizeObserver;
    if (!ResizeObserverCtor) return;

    deps.setFixedAnchorResizeObserver(new ResizeObserverCtor(() => deps.getFixedWrapperBoundsRefreshHandler()?.()));
    deps.getViewportBottomAnchorElements(targetDocument).forEach(el => deps.getFixedAnchorResizeObserver()?.observe(el));

    const wrapper =
      targetDocument.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`) ||
      document.querySelector<HTMLElement>(`${DICE_ROOT_SELECTOR}.acu-mode-fixed`);
    if (wrapper?.parentElement) {
      deps.getFixedAnchorResizeObserver().observe(wrapper.parentElement);
    }
  };
  return refreshFixedAnchorResizeObserver;
}
