// @ts-nocheck
/**
 * render-async-image-icon-slot-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderAsyncImageIconSlotContent(deps: any) {
  const renderAsyncImageIconSlotContent = (
    fallbackContent: string,
    options: { url?: string | null; localKey?: string | null },
  ): string => {
    const url = String(options.url || '').trim();
    const localKey = String(options.localKey || '').trim();
    if (!url && !localKey) return fallbackContent;
    const sourceClass = url ? 'acu-custom-table-name-url-icon' : 'acu-custom-table-name-local-icon';
    const sourceAttr = url
      ? ` data-custom-table-name-icon-url="${deps.escapeHtml(url)}"`
      : ` data-custom-table-name-icon-local-key="${deps.escapeHtml(localKey)}"`;
    return `<span class="acu-custom-table-name-icon-slot acu-custom-table-name-icon ${sourceClass}"${sourceAttr} style="display:inline-flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:inherit;overflow:hidden;">${fallbackContent}</span>`;
  };
  return renderAsyncImageIconSlotContent;
}
