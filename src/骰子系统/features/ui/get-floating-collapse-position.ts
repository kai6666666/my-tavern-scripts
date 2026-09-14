// @ts-nocheck
/**
 * get-floating-collapse-position.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetFloatingCollapsePosition(deps: any) {
  const getFloatingCollapsePosition = (config = deps.getConfig()): FloatingCollapsePosition | null =>
    deps.normalizeFloatingCollapsePosition(config.floatingCollapsePosition);
  return getFloatingCollapsePosition;
}
