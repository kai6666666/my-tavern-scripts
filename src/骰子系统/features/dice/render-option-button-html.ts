// @ts-nocheck
/**
 * render-option-button-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderOptionButtonHtml(deps: any) {
  const renderOptionButtonHtml = (text: string): string =>
    `<button class="acu-opt-btn" data-val="${deps.safeEncodeURIComponent(text)}">${deps.escapeHtml(text)}</button>`;
  return renderOptionButtonHtml;
}
