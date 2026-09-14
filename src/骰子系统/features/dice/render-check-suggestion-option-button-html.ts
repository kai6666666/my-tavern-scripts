// @ts-nocheck
/**
 * render-check-suggestion-option-button-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderCheckSuggestionOptionButtonHtml(deps: any) {
  const renderCheckSuggestionOptionButtonHtml = (displayText: string, commandText: string): string =>
    `<button class="acu-check-suggestion-btn" data-display="${deps.safeEncodeURIComponent(displayText)}" data-command="${deps.safeEncodeURIComponent(commandText)}">${deps.escapeHtml(displayText || '未填写展示文本')}</button>`;
  return renderCheckSuggestionOptionButtonHtml;
}
