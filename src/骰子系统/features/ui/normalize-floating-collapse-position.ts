// @ts-nocheck
/**
 * normalize-floating-collapse-position.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeFloatingCollapsePosition(deps: any) {
  const normalizeFloatingCollapsePosition = (value: unknown): FloatingCollapsePosition | null => {
    if (!value || typeof value !== 'object') return null;
    const raw = value as { left?: unknown; top?: unknown };
    const left = typeof raw.left === 'number' && Number.isFinite(raw.left) ? raw.left : null;
    const top = typeof raw.top === 'number' && Number.isFinite(raw.top) ? raw.top : null;
    if (left === null || top === null) return null;
    return { left, top };
  };
  return normalizeFloatingCollapsePosition;
}
