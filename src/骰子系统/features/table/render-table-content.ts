// @ts-nocheck
/**
 * render-table-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDbLockAPI } from '../../shared/misc-utils';
import { getDisplayName, isCharacterTable } from '../../entities/name-alias';
import { getRowKey } from '../../shared/table-utils';
export function createRenderTableContent(deps: any) {
  const renderTableContent = (tableData, tableName) => {
    const isReversed = deps.isTableReversed(tableName);
    const reverseBtnHtml = deps.shouldShowReverseButton(tableName)
      ? `
            <button type="button" class="acu-view-btn acu-reverse-btn" data-table="${deps.escapeHtml(tableName)}" title="${isReversed ? '当前：倒序（新→旧），点击切换为正序' : '当前：正序（旧→新），点击切换为倒序'}" aria-label="${isReversed ? '切换为正序' : '切换为倒序'}">
                <i class="fa-solid ${isReversed ? 'fa-sort-amount-up' : 'fa-sort-amount-down'}"></i>
            </button>
        `
      : '';

    if (tableData && deps.isOptionTableName(tableName)) {
      return deps.renderOptionTableContent(tableData, tableName, reverseBtnHtml, isReversed);
    }

    if (tableData && deps.isCheckSuggestionTableName(tableName)) {
      return deps.renderCheckSuggestionTableContent(tableData, tableName, reverseBtnHtml, isReversed);
    }

    if (!tableData || !tableData.rows.length) {
      const emptyHeaderActionCount = 3 + (reverseBtnHtml ? 1 : 0);
      return `
            <div class="acu-panel-header"><div class="acu-panel-title"><div class="acu-title-main"><i class="fa-solid ${deps.getIconForTableName(tableName)}"></i> <span class="acu-title-text">${deps.escapeHtml(tableName)}</span></div><div class="acu-title-sub">暂无可浏览条目</div></div><div class="acu-header-actions acu-table-header-actions" data-action-count="${emptyHeaderActionCount}"><div class="acu-table-action-set">${deps.getTutorialButtonHtml('table', '查看表格教程')}${reverseBtnHtml}</div><div class="acu-panel-control-set" aria-label="${deps.escapeHtml(tableName)}面板控制"><div class="acu-height-control"><i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${deps.escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i></div><button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${deps.escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button></div></div></div>
            <div class="acu-panel-content"><div class="acu-empty-state"><i class="fa-regular fa-folder-open"></i><span>暂无数据</span></div></div>`;
    }

    const config = deps.getConfig();
    const headers = (tableData.headers || []).slice(1);

    // [新增] 获取数据库锁定状态API
    const dbLockApi = getDbLockAPI();
    const sheetKey = dbLockApi ? deps.getSheetKeyByTableName(tableName) : null;
    const lockState = dbLockApi && sheetKey ? dbLockApi.getTableLockState(sheetKey) : null;

    // 获取当前表格的视图模式 (默认 list)
    const currentStyle = (deps.getTableStyles() || {})[tableName] || 'list';
    const isGridMode = currentStyle === 'grid';
    const showRelationGraphButton = isCharacterTable(tableName);
    const showMapButton = tableName.includes('地图');
    const showInventoryButton = tableName.includes('物品') || tableName.includes('背包') || tableName.includes('道具');
    const headerActionCount =
      5 +
      (reverseBtnHtml ? 1 : 0) +
      (showRelationGraphButton ? 1 : 0) +
      (showMapButton ? 1 : 0) +
      (showInventoryButton ? 1 : 0);

    let titleColIndex = 1;
    if (tableData.headers.length === 1) {
      titleColIndex = 0;
    } else if (tableName.includes('总结') || tableName.includes('大纲')) {
      const idx = tableData.headers.findIndex(
        h => h && (h.includes('索引') || h.includes('编号') || h.includes('代码')),
      );
      if (idx > 0) titleColIndex = idx;
    }

    // --- 搜索和排序逻辑 ---
    let processedRows = tableData.rows.map((row, index) => {
      const rowKey = getRowKey(tableName, row, tableData.headers);
      const isBookmarked = rowKey && deps.BookmarkManager.isBookmarked(tableName, rowKey);
      return { data: row, originalIndex: index, rowKey, isBookmarked };
    });
    const searchTerm = (deps.getTableSearchStates()[tableName] || '').toLowerCase().trim();

    if (searchTerm) {
      processedRows = processedRows.filter(item =>
        item.data.some(cell => String(cell).toLowerCase().includes(searchTerm)),
      );
      processedRows.sort((a, b) => {
        // 优先按bookmark状态排序：bookmark的在前
        if (a.isBookmarked && !b.isBookmarked) return -1;
        if (!a.isBookmarked && b.isBookmarked) return 1;
        // 在bookmark组内和非bookmark组内，保持原有的搜索匹配度排序
        const titleA = String(a.data[titleColIndex] || '').toLowerCase();
        const titleB = String(b.data[titleColIndex] || '').toLowerCase();
        const aHitTitle = titleA.includes(searchTerm);
        const bHitTitle = titleB.includes(searchTerm);
        if (titleA === searchTerm && titleB !== searchTerm) return -1;
        if (titleA !== searchTerm && titleB === searchTerm) return 1;
        if (aHitTitle && !bHitTitle) return -1;
        if (!aHitTitle && bHitTitle) return 1;
        return isReversed ? b.originalIndex - a.originalIndex : a.originalIndex - b.originalIndex;
      });
    } else {
      // 默认按原始顺序排列，如果启用倒序则反转
      // 但bookmark的始终在前
      processedRows.sort((a, b) => {
        // 优先按bookmark状态排序：bookmark的在前
        if (a.isBookmarked && !b.isBookmarked) return -1;
        if (!a.isBookmarked && b.isBookmarked) return 1;
        // 在bookmark组内和非bookmark组内，保持原有的排序逻辑
        if (isReversed) {
          return b.originalIndex - a.originalIndex;
        } else {
          return a.originalIndex - b.originalIndex;
        }
      });
    }

    const itemsPerPage = config.itemsPerPage || 50;
    const totalItems = processedRows.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    let currentPage = deps.getTablePageStates()[tableName] || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    deps.getTablePageStates()[tableName] = currentPage;

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const rowsToRender = processedRows.slice(startIdx, endIdx);
    // [修改] 表头增加了 视图切换按钮 和 高度拖拽手柄

    let html = `
            <div class="acu-panel-header">
                <div class="acu-panel-title">
    <div class="acu-title-main"><i class="fa-solid ${deps.getIconForTableName(tableName)}"></i> <span class="acu-title-text">${deps.escapeHtml(tableName)}</span></div>
    <div class="acu-title-sub">(${startIdx + 1}-${Math.min(endIdx, totalItems)} / 共${totalItems}项)${isReversed ? ' <span style="color:var(--acu-accent);">↓倒序</span>' : ''}</div>
</div>
                <div class="acu-header-actions acu-table-header-actions" data-action-count="${headerActionCount}">
                    <div class="acu-table-action-set">
                        ${deps.getTutorialButtonHtml('table', '查看表格教程')}
                        ${showRelationGraphButton ? `<button type="button" class="acu-view-btn" id="acu-btn-relation-graph" data-table="${deps.escapeHtml(tableName)}" title="查看人物关系图" aria-label="查看人物关系图"><i class="fa-solid fa-project-diagram"></i></button>` : ''}
                        ${showMapButton ? `<button type="button" class="acu-view-btn acu-table-map-btn" title="地图可视化" aria-label="地图可视化"><i class="fa-solid fa-map"></i></button>` : ''}
                        ${showInventoryButton ? `<button type="button" class="acu-view-btn acu-table-inventory-btn" title="物品栏可视化" aria-label="物品栏可视化"><i class="fa-solid fa-box-open"></i></button>` : ''}
                        ${reverseBtnHtml}
                        <button type="button" class="acu-view-btn" id="acu-btn-switch-style" data-table="${deps.escapeHtml(tableName)}" title="切换视图模式，当前为${isGridMode ? '双列网格' : '单列列表'}" aria-label="切换视图模式">
                            <i class="fa-solid ${isGridMode ? 'fa-th-large' : 'fa-list'}"></i>
                        </button>
                        <div class="acu-search-wrapper"><i class="fa-solid fa-search acu-search-icon"></i><input type="text" class="acu-search-input" placeholder="搜索全部..." value="${(deps.getTableSearchStates()[tableName] || '').replace(/"/g, '&quot;')}" /></div>
                    </div>
                    <div class="acu-panel-control-set" aria-label="${deps.escapeHtml(tableName)}面板控制">
                        <div class="acu-height-control">
                            <i class="fa-solid fa-arrows-up-down acu-height-drag-handle" data-table="${deps.escapeHtml(tableName)}" title="↕️ 拖动调整面板高度 | 双击恢复默认"></i>
                        </div>
                        <button type="button" class="acu-close-btn" title="关闭" aria-label="关闭${deps.escapeHtml(tableName)}"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div class="acu-panel-content"><div class="acu-card-grid">`;

    html += rowsToRender
      .map(item => {
        const realRowIdx = item.originalIndex;
        const row = item.data;
        const cardTitle = row[titleColIndex] || '未命名';
        // 角色相关表格：将逗号分隔名称转为主key显示
        const cardTitleDisplay = isCharacterTable(tableName) ? getDisplayName(String(cardTitle)) : String(cardTitle);
        const showDefaultIndex = titleColIndex === 1;
        const titleCellId = `${tableData.key}-${realRowIdx}-${titleColIndex}`;
        const isTitleModified = window.acuModifiedSet && window.acuModifiedSet.has(titleCellId);
        const isRowNew = deps.getCurrentDiffMap().has(`${tableName}-row-${realRowIdx}`);
        let rowClass = '';
        if (config.highlightNew) {
          if (isTitleModified) rowClass = 'acu-highlight-manual';
          else if (isRowNew) rowClass = 'acu-highlight-diff';
        }

        // [迁移] 计算整行锁定状态（移到外层以便卡片标题使用）
        const cardLockRowKey = getRowKey(tableName, row, tableData.headers);
        const cardRowIndex =
          sheetKey && cardLockRowKey ? deps.findRowIndexByPrimaryKey(sheetKey, tableName, cardLockRowKey) : null;
        const isCardRowLocked = lockState && cardRowIndex !== null ? lockState.rows.includes(cardRowIndex) : false;

        // [新增] 计算标题列是否单独锁定（用于在标题后显示小锁图标）
        // titleColIndex 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
        const isTitleCellLocked =
          lockState && cardRowIndex !== null ? lockState.cells.includes(`${cardRowIndex}:${titleColIndex - 1}`) : false;

        // 计算有效列数，用于网格视图末行占满处理
        const validColIndices = row.map((_, i) => i).filter(i => i > 0 && i !== titleColIndex);
        const isOddValidCount = validColIndices.length % 2 === 1;

        const cardBody = row
          .map((cell, cIdx) => {
            if (cIdx <= 0 || cIdx === titleColIndex) return '';
            // [新增] 隐藏"交互选项"列（因为已经以按钮形式显示）
            const currentHeader = headers[cIdx - 1] || '';
            if (currentHeader.includes('交互')) return '';
            const isLastValidCol = cIdx === validColIndices[validColIndices.length - 1];
            const spanFullRow = isLastValidCol && isOddValidCount;
            // 清理列标题：移除括号/方括号及其内容
            const rawHeaderName = headers[cIdx - 1] || '属性' + cIdx;

            // [迁移] 计算单元格锁定状态（复用外层的cardRowIndex）
            // [修复] cIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
            const isThisCellLocked =
              lockState && cardRowIndex !== null ? lockState.cells.includes(`${cardRowIndex}:${cIdx - 1}`) : false;
            // [改进] 整行锁定时，所有单元格都显示锁定图标
            const isThisFieldLocked = isCardRowLocked || isThisCellLocked;

            const renderedCell = deps.renderDataCardCellContent({
              rawHeaderName,
              cell,
              isFieldLocked: isThisFieldLocked,
            });
            if (!renderedCell.shouldRender) return '';
            const { headerName, contentHtml, hideLabel } = renderedCell;

            const isDiffChanged = deps.getCurrentDiffMap().has(tableName + '-' + realRowIdx + '-' + cIdx);
            const cellId = tableData.key + '-' + realRowIdx + '-' + cIdx;
            const isUserModified = window.acuModifiedSet && window.acuModifiedSet.has(cellId);
            let cellHighlight = '';
            if (config.highlightNew) {
              if (isUserModified) cellHighlight = 'acu-highlight-manual';
              else if (isDiffChanged) cellHighlight = 'acu-highlight-diff';
            }

            // 隐藏标题时添加特殊 class
            // 检查锁定状态并添加图标 (已移除重复计算)

            const rowClass =
              'acu-card-row acu-cell' +
              (spanFullRow ? ' acu-grid-span-full' : '') +
              (hideLabel ? ' acu-hide-label' : '');

            return (
              '<div class="' +
              rowClass +
              '" data-key="' +
              deps.escapeHtml(tableData.key) +
              '" data-tname="' +
              deps.escapeHtml(tableName) +
              '" data-row="' +
              realRowIdx +
              '" data-col="' +
              cIdx +
              '" data-val="' +
              deps.safeEncodeURIComponent(cell ?? '') +
              '"><div class="acu-card-label"><span data-locked="' +
              isThisFieldLocked +
              '">' +
              deps.escapeHtml(headerName) +
              '</span></div><div class="acu-card-value ' +
              cellHighlight +
              '">' +
              contentHtml +
              '</div></div>'
            );
          })
          .join('');

        // [修改] 给 acu-card-body 增加了 view-grid 或 view-list 类
        // [修复] 传入完整的 tableData.headers 而非 slice 后的 headers，避免 getInteractOptionsForRow 内部索引错位
        const tableActions = deps.getInteractOptionsForRow(tableName, tableData.headers, row);
        let actionsHtml = '';

        if (tableActions.length > 0) {
          const cardTitle = row[titleColIndex] || '未知';
          const actionBtns = tableActions
            .map(
              (act, actIdx) =>
                `<button type="button" class="acu-action-item ${act.type === 'check' ? 'check-type' : ''}" data-action-idx="${actIdx}" data-row="${realRowIdx}" title="${deps.escapeHtml(act.label)}"><i class="fa-solid ${act.icon || 'fa-play'}"></i> ${deps.escapeHtml(act.label)}</button>`,
            )
            .join('');
          actionsHtml = `<div class="acu-card-actions">${actionBtns}</div>`;
        }

        // [修改] 标题小锁图标：整行锁定或标题列单独锁定时都显示
        const isTitleLocked = isCardRowLocked || isTitleCellLocked;

        // [移除] 不再需要单独的整行锁定样式类，因为每个单元格都会显示锁图标
        // const cardLockedClass = isCardRowLocked ? ' acu-card-locked' : '';

        // 检查是否被bookmark
        const cardBookmarkRowKey = getRowKey(tableName, row, tableData.headers);
        const isBookmarked = cardBookmarkRowKey && deps.BookmarkManager.isBookmarked(tableName, cardBookmarkRowKey);
        const bookmarkIcon = cardBookmarkRowKey
          ? `<i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark acu-bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" data-table="${deps.escapeHtml(tableName)}" data-row-key="${deps.escapeHtml(cardBookmarkRowKey)}" title="${isBookmarked ? '取消书签' : '添加书签'}"></i>`
          : '';

        // [移除] 不再需要右上角的整行锁定图标，因为每个单元格都会显示锁图标
        // const rowLockBadge = isCardRowLocked ? '...' : '';

        return `<div class="acu-data-card"><div class="acu-card-header"><span class="acu-card-index">${showDefaultIndex ? '#' + (realRowIdx + 1) : ''}</span><span class="acu-cell acu-editable-title ${rowClass}" data-key="${deps.escapeHtml(tableData.key)}" data-tname="${deps.escapeHtml(tableName)}" data-row="${realRowIdx}" data-col="${titleColIndex}" data-val="${deps.safeEncodeURIComponent(cardTitle ?? '')}" data-locked="${isTitleLocked}" title="点击编辑标题">${deps.escapeHtml(cardTitleDisplay)}</span>${bookmarkIcon}</div><div class="acu-card-body ${isGridMode ? 'view-grid' : 'view-list'}">${cardBody}</div>${actionsHtml}</div>`;
      })
      .join('');
    html += `</div></div>`;

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
  return renderTableContent;
}
