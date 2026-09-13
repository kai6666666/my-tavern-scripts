// @ts-nocheck
/**
 * define-acu-dice-on-window.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDefineAcuDiceOnWindow(deps: any) {
  const defineAcuDiceOnWindow = (target: Window) => {
    if ('AcuDice' in target) return;
    Object.defineProperty(target, 'AcuDice', {
      value: deps.getAcuDiceAPI(),
      writable: false,
      configurable: false,
    });
  };
  return defineAcuDiceOnWindow;
}
