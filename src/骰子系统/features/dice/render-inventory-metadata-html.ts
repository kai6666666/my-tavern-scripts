// @ts-nocheck
/**
 * render-inventory-metadata-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderInventoryMetadataHtml(deps: any) {
  const renderInventoryMetadataHtml = record => {
    const acquiredAtLocation = String(record?.acquiredAtLocation || '').trim() || '未知';
    const acquiredAt = String(record?.acquiredAt || '').trim() || '未知';
    return `
      <div class="acu-inventory-detail-meta">
        <button class="acu-inventory-detail-field-row acu-inventory-detail-menu-target" type="button" data-menu-scope="field" data-field-key="acquiredAtLocation">
          <span class="acu-inventory-detail-field-label">获得地</span>
          <span class="acu-inventory-detail-field-value">${deps.escapeHtml(acquiredAtLocation)}</span>
        </button>
        <button class="acu-inventory-detail-field-row acu-inventory-detail-menu-target" type="button" data-menu-scope="field" data-field-key="acquiredAt">
          <span class="acu-inventory-detail-field-label">获取时间</span>
          <span class="acu-inventory-detail-field-value">${deps.escapeHtml(acquiredAt)}</span>
        </button>
      </div>
    `;
  };
  return renderInventoryMetadataHtml;
}
