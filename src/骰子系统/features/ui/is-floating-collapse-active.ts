// @ts-nocheck
/**
 * is-floating-collapse-active.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsFloatingCollapseActive(deps: any) {
  const isFloatingCollapseActive = (config = deps.getConfig()): boolean =>
    deps.getCollapsedState() && deps.normalizeCollapseStyle(config.collapseStyle) === 'floating';
  return isFloatingCollapseActive;
}
