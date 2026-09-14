// @ts-nocheck
/**
 * is-element-visible-in-layout.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsElementVisibleInLayout(deps: any) {
  const isElementVisibleInLayout = (element: HTMLElement): boolean => {
    const targetWindow = element.ownerDocument.defaultView || window;
    const style = targetWindow.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };
  return isElementVisibleInLayout;
}
