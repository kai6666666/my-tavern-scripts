// @ts-nocheck
/**
 * fixed-mode-anchor-priority.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFixedModeAnchorPriority(deps: any) {
  const FIXED_MODE_ANCHOR_PRIORITY = new Map([
    ['send_form', 0],
    ['form_sheld', 1],
    ['chat_input', 2],
    ['send_textarea', 3],
    ['send_but', 4],
  ]);
  return FIXED_MODE_ANCHOR_PRIORITY;
}
