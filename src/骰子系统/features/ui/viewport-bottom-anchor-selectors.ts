// @ts-nocheck
/**
 * viewport-bottom-anchor-selectors.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createViewportBottomAnchorSelectors(deps: any) {
  const VIEWPORT_BOTTOM_ANCHOR_SELECTORS = [
    '#send_form',
    '#form_sheld',
    '#send_textarea',
    '#chat_input',
    '#send_but',
  ] as const;
  return VIEWPORT_BOTTOM_ANCHOR_SELECTORS;
}
