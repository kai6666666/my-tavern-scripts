// @ts-nocheck
/**
 * render-theme-icon-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderThemeIconContent(deps: any) {
  const renderThemeIconContent = (icon: string | null | undefined): string => {
    if (!icon) return '<i class="fa-solid fa-cube"></i>';
    if (icon.startsWith('fa:')) {
      return `<i class="fa-solid fa-${icon.slice(3)}"></i>`;
    }
    if (icon.startsWith('ti:')) {
      return `<i class="ti ti-${icon.slice(3)}"></i>`;
    }
    return deps.escapeHtml(icon);
  };
  return renderThemeIconContent;
}
