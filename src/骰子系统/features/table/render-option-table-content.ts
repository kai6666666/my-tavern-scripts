// @ts-nocheck
/**
 * render-option-table-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderOptionTableContent(deps: any) {
  const renderOptionTableContent = (tableData, tableName, reverseBtnHtml, isReversed) => {
    const config = deps.getConfig();
    const searchTerm = String(deps.getTableSearchStates()[tableName] || '')
      .toLowerCase()
      .trim();
    let optionItems = deps.getOptionItemsFromTable(tableData);

    if (searchTerm) {
      optionItems = optionItems.filter(item => {
        const text = item.text.toLowerCase();
        const header = item.header.toLowerCase();
        return text.includes(searchTerm) || header.includes(searchTerm);
      });
    }

    if (isReversed) {
      optionItems = [...optionItems].reverse();
    }

    const itemsPerPage = config.itemsPerPage || 50;
    const totalItems = optionItems.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    let currentPage = deps.getTablePageStates()[tableName] || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    deps.getTablePageStates()[tableName] = currentPage;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const rowsToRender = optionItems.slice(startIdx, endIdx);
    const displayStart = totalItems > 0 ? startIdx + 1 : 0;
    const displayEnd = Math.min(endIdx, totalItems);
    const optionRowsHtml =
      rowsToRender.length > 0
        ? rowsToRender
            .map((item, idx) => {
              const displayIndex = startIdx + idx + 1;
              return `
                <button class="acu-opt-btn acu-option-table-row" data-val="${deps.safeEncodeURIComponent(item.text)}" data-option-row="${item.rowIndex}" data-option-col="${item.colIndex}">
                  <span class="acu-option-table-index">#${displayIndex}</span>
                  <span class="acu-option-table-text">${deps.escapeHtml(item.text)}</span>
                </button>`;
            })
            .join('')
        : `<div class="acu-option-table-empty">${searchTerm ? '暂无匹配选项' : '暂无可点击选项'}</div>`;

    const headerActionCount = 4 + (reverseBtnHtml ? 1 : 0);
    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
                    <div class="acu-title-main"><i class="fa-solid ${deps.getIconForTableName(tableName)}"></i> <span class="acu-title-text">${deps.escapeHtml(tableName)}</span></div>
                    <div class="acu-title-sub">(${displayStart}-${displayEnd} / 共${totalItems}项)${isReversed ? ' <span style="color:var(--acu-accent);">↓倒序</span>' : ''}</div>
                </div>
                <div class="acu-header-actions acu-table-header-actions" data-action-count="${headerActionCount}">
                    <div class="acu-table-action-set">
                        ${deps.getTutorialButtonHtml('optionTable', '查看选项表教程')}
                        ${reverseBtnHtml}
                        <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" placeholder="搜索选项..." value="${deps.escapeHtml(deps.getTableSearchStates()[tableName] || '')}" /></div>
                    </div>
                    <div class="acu-panel-control-set" aria-label="${deps.escapeHtml(tableName)}面板控制">
                        <div class="acu-height-control">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${deps.escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${deps.escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div class="acu-panel-content acu-option-table-content">
                <div class="acu-card-grid acu-option-table-grid">
                    <div class="acu-option-panel acu-theme-${config.theme} acu-option-table-panel">
                        ${optionRowsHtml}
                    </div>
                </div>
            </div>`;

    if (totalPages > 1) {
      html += `<div class="acu-panel-footer"><button class="acu-page-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
      const range = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i);
      } else {
        if (currentPage <= 4) range.push(1, 2, 3, 4, 5, '...', totalPages);
        else if (currentPage >= totalPages - 3)
          range.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        else range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
      range.forEach(p => {
        if (p === '...') html += `<span class="acu-page-info">...</span>`;
        else html += `<button class="acu-page-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
      });
      html += `<button class="acu-page-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button></div>`;
    }

    return html;
  };
  return renderOptionTableContent;
}
