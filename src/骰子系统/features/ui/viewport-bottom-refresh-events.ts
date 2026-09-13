// @ts-nocheck
/**
 * viewport-bottom-refresh-events.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createViewportBottomRefreshEvents(deps: any) {
  const VIEWPORT_BOTTOM_REFRESH_EVENTS = [
    'input',
    'change',
    'focus',
    'blur',
    'keyup',
    'compositionend',
    'click',
    'pointerup',
    'transitionend',
  ] as const;
  return VIEWPORT_BOTTOM_REFRESH_EVENTS;
}
