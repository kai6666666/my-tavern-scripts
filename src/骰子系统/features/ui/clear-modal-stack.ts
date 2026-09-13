// @ts-nocheck
/**
 * clear-modal-stack.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearModalStack(deps: any) {
  const clearModalStack = () => {
    deps.getModalStack().length = 0;
  };
  return clearModalStack;
}
