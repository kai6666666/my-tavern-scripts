// @ts-nocheck
/**
 * clamp-floating-collapse-position.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClampFloatingCollapsePosition(deps: any) {
  const clampFloatingCollapsePosition = (
    position: FloatingCollapsePosition | null,
    targetWindow = deps.getTavernHostWindow(),
    targetDocument = deps.getTavernHostDocument(),
  ): FloatingCollapsePosition => {
    const bounds = deps.getFloatingViewportBounds(targetWindow, targetDocument);
    const margin = deps.FLOATING_COLLAPSE_MARGIN;
    const maxLeft = Math.max(bounds.left + margin, bounds.left + bounds.width - deps.FLOATING_COLLAPSE_SIZE - margin);
    const maxTop = Math.max(bounds.top + margin, bounds.top + bounds.height - deps.FLOATING_COLLAPSE_SIZE - margin);
    const defaultBottomOffset = Math.max(margin, deps.getViewportBottomOffset());
    const fallback = {
      left: bounds.left + bounds.width - deps.FLOATING_COLLAPSE_SIZE - margin,
      top: bounds.top + bounds.height - deps.FLOATING_COLLAPSE_SIZE - defaultBottomOffset,
    };
    const raw = position || fallback;

    return {
      left: Math.round(Math.min(Math.max(raw.left, bounds.left + margin), maxLeft)),
      top: Math.round(Math.min(Math.max(raw.top, bounds.top + margin), maxTop)),
    };
  };
  return clampFloatingCollapsePosition;
}
