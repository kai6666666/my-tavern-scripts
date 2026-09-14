// @ts-nocheck
/**
 * render-inline-quick-check-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderInlineQuickCheckButton(deps: any) {
  const renderInlineQuickCheckButton = (
    attrName: string,
    attrValue: number,
    options: { fontSize?: string; marginLeft?: boolean } = {},
  ): string => {
    if (!deps.RenderPresetManager.shouldShowQuickCheck(attrName)) return '';
    const styleParts = [
      'cursor:pointer',
      'color:var(--acu-accent)',
      'opacity:0.5',
      `font-size:${options.fontSize || '11px'}`,
    ];
    if (options.marginLeft) styleParts.push('margin-left:6px');
    return (
      '<i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="' +
      deps.escapeHtml(attrName) +
      '" data-attr-value="' +
      attrValue +
      '" style="' +
      styleParts.join(';') +
      ';" title="检定"></i>'
    );
  };
  return renderInlineQuickCheckButton;
}
