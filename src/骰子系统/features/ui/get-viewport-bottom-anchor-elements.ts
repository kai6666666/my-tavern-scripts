// @ts-nocheck
/**
 * get-viewport-bottom-anchor-elements.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetViewportBottomAnchorElements(deps: any) {
  const getViewportBottomAnchorElements = (targetDocument: Document): HTMLElement[] => {
    const seen = new Set<HTMLElement>();
    const elements: HTMLElement[] = [];

    deps.getVIEWPORT_BOTTOM_ANCHOR_SELECTORS().forEach(selector => {
      targetDocument.querySelectorAll<HTMLElement>(selector).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        elements.push(el);
      });
    });

    return elements;
  };
  return getViewportBottomAnchorElements;
}
