// @ts-nocheck
/**
 * emit-event.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createEmitEvent(deps: any) {
  const emitEvent = (event: string, data: unknown): void => {
    deps.acuDiceEvents.emit(event, data);
  };
  return emitEvent;
}
