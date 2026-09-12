// @ts-nocheck
/**
 * inventory-item-detail.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowInventoryItemDetail(deps: any) {
  const showInventoryItemDetail = rowIndex => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const item = deps.findInventoryItemByRow(rowIndex);
    if (!item) {
      if (window.toastr) window.toastr.warning('未找到该物品');
      return;
    }
    const icon = deps.getElementEmoji(item.name, null);
    const iconContext = deps.createCustomTableNameIconContext('item', item.tableName, 'item', item.name);
    const metaRecord = deps.getInventoryMetadataForItem(rawData, item);
    const detailContext = deps.getInventoryDetailContext(rowIndex);
    const quickActions = detailContext
      ? deps.getInteractOptionsForRow(item.tableName, detailContext.headers, detailContext.row)
      : [];
    const canDismantle = deps.isGachaRarity(String(item.quality || '').trim() as GachaRarity);
    const detail = $(`
      <div class="acu-inventory-detail-overlay acu-theme-${config.theme}">
        <div class="acu-inventory-detail" data-row-index="${item.rowIndex}">
          <div class="acu-inventory-detail-header">
            <div class="acu-inventory-detail-head-main">
              <div class="acu-inventory-detail-icon">${deps.renderCustomTableNameIconContent(deps.renderThemeIconContent(icon), iconContext)}</div>
              <div class="acu-inventory-detail-summary">
                <div class="acu-inventory-detail-title-row">
                  <button class="acu-inventory-detail-title acu-inventory-detail-menu-target" type="button" data-menu-scope="card">${deps.escapeHtml(item.name)}</button>
                  <button class="acu-inventory-detail-inline-action acu-inventory-detail-gift" type="button" title="赠与" aria-label="赠与">
                    <i class="fa-solid fa-gift"></i>
                  </button>
                </div>
                <button class="acu-inventory-detail-sub acu-inventory-detail-menu-target" type="button" data-menu-scope="summary">${deps.escapeHtml(item.type)} · ${deps.escapeHtml(item.quality)} · 数量 ${deps.escapeHtml(item.quantityText)}</button>
              </div>
            </div>
            <div class="acu-inventory-detail-header-actions">
              ${
                item.tableKey
                  ? '<button class="acu-view-btn acu-inventory-detail-jump" type="button" title="跳转表格" aria-label="跳转表格"><i class="fa-solid fa-table"></i></button>'
                  : ''
              }
              <button class="acu-view-btn acu-inventory-detail-dismantle" type="button" title="拆解为碎片" aria-label="拆解为碎片"><i class="fa-solid fa-hammer"></i></button>
              ${deps.getTutorialButtonHtml('inventoryDetail', '查看物品详情教程')}
              <button class="acu-preview-close" type="button" title="关闭" aria-label="关闭物品详情"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-inventory-detail-meta-wrap">
            ${deps.renderInventoryMetadataHtml(metaRecord)}
          </div>
          <button class="acu-inventory-detail-desc acu-inventory-detail-menu-target" type="button" data-menu-scope="field" data-field-key="description">
            ${deps.escapeHtml(item.description || '暂无描述')}
          </button>
          ${
            canDismantle || quickActions.length > 0
              ? `<div class="acu-inventory-detail-actions">
            ${
              canDismantle
                ? '<button class="acu-action-item acu-inventory-detail-dismantle-action" type="button"><i class="fa-solid fa-hammer"></i> 分解碎片</button>'
                : ''
            }
            ${quickActions
              .map((action, actionIdx) => {
                const iconClass = String(action.icon || deps.ACTION_ICON_MAP[action.label] || 'fa-play').trim();
                return `<button class="acu-action-item acu-inventory-detail-quick-action" type="button" data-action-idx="${actionIdx}"><i class="fa-solid ${deps.escapeHtml(iconClass)}"></i> ${deps.escapeHtml(action.label)}</button>`;
              })
              .join('')}
          </div>`
              : ''
          }
        </div>
      </div>
    `);
    $('.acu-inventory-detail-overlay').remove();
    $('body').append(detail);
    deps.hydrateCustomTableNameIconsIn(detail);
    const detailEl = detail[0] as HTMLElement | undefined;
    if (detailEl) {
      detailEl.style.setProperty('position', 'fixed', 'important');
      detailEl.style.setProperty('top', '0', 'important');
      detailEl.style.setProperty('left', '0', 'important');
      detailEl.style.setProperty('right', '0', 'important');
      detailEl.style.setProperty('bottom', '0', 'important');
      detailEl.style.setProperty('width', '100vw', 'important');
      detailEl.style.setProperty('height', '100dvh', 'important');
      detailEl.style.setProperty('display', 'flex', 'important');
      detailEl.style.setProperty('justify-content', 'center', 'important');
      detailEl.style.setProperty('align-items', 'center', 'important');
      detailEl.style.setProperty('z-index', '31250', 'important');
    }
    deps.setupOverlayClose(detail, 'acu-inventory-detail-overlay', () => detail.remove());
    detail.on('click', '.acu-preview-close', () => detail.remove());
    detail.on('click', '.acu-inventory-detail-gift', () => {
      detail.remove();
      void deps.showInventoryGiftDialog(rowIndex);
    });
    detail.on('click', '.acu-inventory-detail-jump', () => {
      deps.handleInventoryAction(rowIndex, 'jump');
    });
    detail.on('click', '.acu-inventory-detail-dismantle', () => {
      detail.remove();
      void deps.dismantleInventoryItem(rowIndex);
    });
    detail.on('click', '.acu-inventory-detail-dismantle-action', e => {
      e.stopPropagation();
      e.preventDefault();
      detail.remove();
      void deps.dismantleInventoryItem(rowIndex);
    });
    detail.on('click', '.acu-inventory-detail-quick-action', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const actionIdx = Number.parseInt(String($(this).data('action-idx') || ''), 10);
      if (Number.isNaN(actionIdx)) return;
      const freshContext = deps.getInventoryDetailContext(rowIndex);
      if (!freshContext) return;
      const actions = deps.getInteractOptionsForRow(freshContext.item.tableName, freshContext.headers, freshContext.row);
      const action = actions[actionIdx];
      const executed = deps.executeTableInteractionAction(action, freshContext.headers, freshContext.row);
      if (executed) detail.remove();
    });
  };
  return showInventoryItemDetail;
}
