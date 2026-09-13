// @ts-nocheck
/**
 * render-deprecated-badge.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDeprecatedBadge(deps: any) {
  const renderDeprecatedBadge = (reason: string): string =>
    `<span class="acu-deprecated-badge" title="${deps.escapeHtml(reason)}" aria-label="${deps.escapeHtml(reason)}">旧</span>`;
  return renderDeprecatedBadge;
}
