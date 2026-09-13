// @ts-nocheck
/**
 * dispatch-ready-event.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDispatchReadyEvent(deps: any) {
  const dispatchReadyEvent = (target: Window) => {
    try {
      target.dispatchEvent(new CustomEvent(deps.getACUDICE_READY_EVENT()));
    } catch (error) {
      console.warn('[AcuDice] ready 事件触发失败', error);
    }
  };
  return dispatchReadyEvent;
}
