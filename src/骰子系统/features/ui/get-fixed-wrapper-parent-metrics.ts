// @ts-nocheck
/**
 * get-fixed-wrapper-parent-metrics.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetFixedWrapperParentMetrics(deps: any) {
  const getFixedWrapperParentMetrics = (
    parent: HTMLElement | null,
    targetWindow: Window,
    fallbackWidth: number,
    fallbackLeft: number,
  ): { contentWidth: number; contentLeft: number } | null => {
    const parentRect = parent?.getBoundingClientRect();
    const rectWidth = parentRect && parentRect.width > 0 ? parentRect.width : 0;
    const clientWidth = parent && parent.clientWidth > 0 ? parent.clientWidth : 0;
    const fallbackContentWidth = fallbackWidth > 0 ? fallbackWidth : 0;
    const contentWidthCandidates = [clientWidth, rectWidth, fallbackContentWidth].filter(width => width > 0);
    const contentWidth = contentWidthCandidates.length > 0 ? Math.min(...contentWidthCandidates) : 0;
    if (contentWidth <= 0) return null;

    const style = parent ? targetWindow.getComputedStyle(parent) : null;
    const borderLeft = style ? Number.parseFloat(style.borderLeftWidth) || 0 : 0;
    const contentLeft = (parentRect?.left ?? fallbackLeft) + borderLeft;

    return {
      contentWidth,
      contentLeft,
    };
  };
  return getFixedWrapperParentMetrics;
}
