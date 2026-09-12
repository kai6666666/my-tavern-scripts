// @ts-nocheck
/**
 * inventory-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { INVENTORY_QUALITY_ORDER } from '../../shared/defaults-config';
export function createRenderInventoryVisualization(deps: any) {
  const renderInventoryVisualization = rawData => {
    const config = deps.getConfig();
    const filters = deps.getInventoryFilters();
    const isFilterCollapsed = deps.getInventoryFiltersCollapsedState();
    const activeFilterCount = deps.getInventoryActiveFilterCount(filters);
    const { tableName, tableKey, items, colMap } = deps.parseInventoryItems(rawData);
    const normalizedSearch = String(filters.search || '')
      .trim()
      .toLowerCase();

    let filteredItems = items.filter(item => {
      if (filters.type !== '全部' && item.type !== filters.type) return false;
      if (filters.quality !== '全部' && item.quality !== filters.quality) return false;
      if (!normalizedSearch) return true;
      return `${item.name} ${item.description}`.toLowerCase().includes(normalizedSearch);
    });

    filteredItems = filteredItems.sort((a, b) => {
      const taskPriority = (b.type === '任务物品' ? 1 : 0) - (a.type === '任务物品' ? 1 : 0);
      if (taskPriority !== 0) return taskPriority;
      if (a.isChanged !== b.isChanged) return a.isChanged ? -1 : 1;
      if (filters.sort === 'type') return a.type.localeCompare(b.type, 'zh-CN') || a.rowIndex - b.rowIndex;
      if (filters.sort === 'quality') {
        return (
          (INVENTORY_QUALITY_ORDER[b.quality] || 0) - (INVENTORY_QUALITY_ORDER[a.quality] || 0) ||
          a.rowIndex - b.rowIndex
        );
      }
      if (filters.sort === 'quantity') return b.quantity - a.quantity || a.rowIndex - b.rowIndex;
      if (filters.sort === 'name') return a.name.localeCompare(b.name, 'zh-CN');
      return a.rowIndex - b.rowIndex;
    });

    const isInventoryEmpty = filteredItems.length === 0;
    const itemCardsHtml =
      filteredItems.length > 0
        ? filteredItems
            .map(item => {
              const icon = deps.getElementEmoji(item.name, null);
              const depletedClass = item.quantity <= 0 ? ' is-depleted' : '';
              const changedClass = item.isChanged ? ' acu-inventory-changed' : '';
              const iconContext = deps.createCustomTableNameIconContext('item', tableName, 'item', item.name);
              return `
                <article class="acu-inventory-card${depletedClass}${changedClass}" data-row-index="${item.rowIndex}" data-item-name="${deps.escapeHtml(item.name)}">
                  <button class="acu-inventory-card-main" type="button" data-action="detail" title="${deps.escapeHtml(item.name)}" aria-label="查看 ${deps.escapeHtml(item.name)} 详情">
                    <span class="acu-inventory-slot-visual">
                      <span class="acu-inventory-icon">${deps.renderCustomTableNameIconContent(deps.renderThemeIconContent(icon), iconContext)}</span>
                      <span class="acu-inventory-count" title="数量">${deps.escapeHtml(item.quantityText)}</span>
                    </span>
                    <span class="acu-inventory-card-text">
                      <span class="acu-inventory-name">${deps.escapeHtml(item.name)}</span>
                    </span>
                  </button>
                </article>
              `;
            })
            .join('')
        : `<div class="acu-inventory-empty">
             <i class="fa-solid fa-bag-shopping"></i>
             <span>${items.length > 0 ? '没有符合筛选条件的物品' : '暂无物品'}</span>
           </div>`;

    return `
      <div class="acu-inventory-shell acu-theme-${config.theme}">
        <div class="acu-panel-header acu-inventory-window-header">
          <div class="acu-panel-title">
            <div class="acu-title-main"><i class="fa-solid fa-box-open"></i> <span class="acu-title-text">物品栏</span></div>
            <div class="acu-title-sub">${deps.escapeHtml(tableName)} · ${filteredItems.length}/${items.length} 项</div>
          </div>
          <div class="acu-header-actions">
            <label class="acu-inventory-search acu-inventory-search-inline">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input class="acu-inventory-filter" data-filter="search" type="search" value="${deps.escapeHtml(filters.search || '')}" placeholder="搜索" aria-label="搜索物品">
            </label>
            ${deps.getTutorialButtonHtml('inventory', '查看物品栏教程')}
            <button class="acu-view-btn acu-gacha-open-btn" type="button" title="骰子商店" aria-label="打开骰子商店"><i class="fa-solid fa-store"></i></button>
            ${
              tableKey
                ? `<button class="acu-view-btn acu-inventory-open-table" type="button" data-table="${deps.escapeHtml(tableName)}" title="打开物品表" aria-label="打开物品表"><i class="fa-solid fa-table"></i></button>`
                : ''
            }
            <button class="acu-close-btn acu-inventory-close" type="button" title="关闭" aria-label="关闭物品栏"><i class="fa-solid fa-times"></i></button>
          </div>
        </div>
        <div class="acu-inventory-content">
          <div class="acu-inventory-toolbar acu-inventory-filter-collapsible ${isFilterCollapsed ? 'collapsed' : ''}">
            <button class="acu-inventory-filter-collapse-btn" type="button" title="${isFilterCollapsed ? '展开筛选' : '收起筛选'}">
              <span class="acu-inventory-filter-collapse-title">
                <i class="fa-solid fa-sliders"></i>
                <span>筛选选项</span>
                ${activeFilterCount > 0 ? `<span class="acu-inventory-filter-count">${activeFilterCount}</span>` : ''}
              </span>
              <i class="fa-solid fa-chevron-down acu-inventory-filter-collapse-icon"></i>
            </button>
            <div class="acu-inventory-filter-collapse-body">
              <div class="acu-inventory-filter-group">
                <div class="acu-inventory-filter-label"><i class="fa-solid fa-shapes"></i><span>类型</span></div>
                <div class="acu-inventory-filter-row">${deps.renderInventoryFilterButtons('type', filters.type, deps.INVENTORY_TYPE_FILTER_META)}</div>
              </div>
              <div class="acu-inventory-filter-group">
                <div class="acu-inventory-filter-label"><i class="fa-solid fa-gem"></i><span>品质</span></div>
                <div class="acu-inventory-filter-row">${deps.renderInventoryFilterButtons(
                  'quality',
                  filters.quality,
                  deps.INVENTORY_QUALITY_FILTER_META,
                )}</div>
              </div>
              <div class="acu-inventory-filter-group">
                <div class="acu-inventory-filter-label"><i class="fa-solid fa-arrow-down-wide-short"></i><span>排序</span></div>
                <div class="acu-inventory-filter-row">${deps.renderInventoryFilterButtons('sort', filters.sort, deps.INVENTORY_SORT_OPTIONS)}</div>
              </div>
            </div>
          </div>
          <div class="acu-inventory-grid${isInventoryEmpty ? ' is-empty' : ''}" data-table="${deps.escapeHtml(tableName)}" data-table-key="${deps.escapeHtml(tableKey)}" data-quantity-col="${colMap.quantity}">
            ${itemCardsHtml}
          </div>
        </div>
      </div>
    `;
  };
  return renderInventoryVisualization;
}
