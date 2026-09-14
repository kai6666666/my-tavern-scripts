// @ts-nocheck
/**
 * render-icon.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderIcon(deps: any) {
  const renderIcon = (icon: string | null): string => {
    if (!icon) return '';
    if (icon.startsWith('fa:')) {
      const name = icon.slice(3);
      return `<i class="fa-solid fa-${name} acu-icon"></i>`;
    }
    if (icon.startsWith('ti:')) {
      const name = icon.slice(3);
      return `<i class="ti ti-${name} acu-icon"></i>`;
    }
    return deps.escapeHtml(icon); // 原样返回emoji
  };
  return renderIcon;
}
