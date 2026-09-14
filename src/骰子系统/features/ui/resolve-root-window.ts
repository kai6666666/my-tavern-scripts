// @ts-nocheck
/**
 * resolve-root-window.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveRootWindow(deps: any) {
  const resolveRootWindow = (): Window => {
    try {
      return window.top ?? window;
    } catch (error) {
      return window;
    }
  };
  return resolveRootWindow;
}
