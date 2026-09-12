// @ts-nocheck
/**
 * show-cell-menu.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FavoritesManager } from '../../features/favorites/favorites-manager';
import { getDbLockAPI } from '../../shared/misc-utils';
import { getRowKey } from '../../shared/table-utils';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowCellMenu(deps: any) {
  const showCellMenu = (e, cell) => {
    const { $ } = deps.getCore();
    $('.acu-cell-menu, .acu-menu-backdrop').remove();
    const backdrop = $('<div class="acu-menu-backdrop"></div>');
    $('body').append(backdrop);

    const $cell = $(cell); // 保存单元格引用用于直接操作 data-locked
    const rowIdx = parseInt($cell.data('row'), 10);
    const colIdx = parseInt($cell.data('col'), 10);
    if (isNaN(rowIdx) || isNaN(colIdx)) {
      console.warn('[DICE]ACU 无效的行/列索引');
      backdrop.remove();
      return;
    }
    const tableKey = $cell.data('key');
    // v19.x 可能没有 tname，尝试获取
    const tableName = $cell.data('tname') || $cell.closest('.acu-data-card').find('.acu-editable-title').text();
    const content = deps.safeDecodeURIComponent($cell.data('val'));
    const config = deps.getConfig();

    // 保存卡片引用用于整行操作
    const $card = $cell.closest('.acu-data-card');

    // 唯一标识 ID
    const cellId = `${tableKey}-${rowIdx}-${colIdx}`;
    if (!window.acuModifiedSet) window.acuModifiedSet = new Set();

    // 状态检查
    const isModified = window.acuModifiedSet.has(cellId);

    // 计算锁定状态
    const headers = deps.getCachedRawData()?.[tableKey]?.content?.[0] || [];
    const rowData = deps.getCachedRawData()?.[tableKey]?.content?.[rowIdx + 1] || [];
    const lockRowKey = getRowKey(tableName, rowData, headers);
    const currentHeader = headers[colIdx] || '';

    let isFieldLocked = false;
    let hasAnyLockInRow = false;
    let rowIndex = -1;
    let sheetKey = '';

    const api = getDbLockAPI();
    if (api && lockRowKey) {
      sheetKey = deps.getSheetKeyByTableName(tableName);
      if (sheetKey) {
        rowIndex = deps.findRowIndexByPrimaryKey(sheetKey, tableName, lockRowKey);
        if (rowIndex !== null && rowIndex !== -1) {
          const lockState = api.getTableLockState(sheetKey);
          if (lockState) {
            // 检查行锁定
            hasAnyLockInRow = lockState.rows?.includes(rowIndex) ?? false;
            // 检查单元格锁定
            // [修复] colIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
            const cellKey = `${rowIndex}:${colIdx - 1}`;
            isFieldLocked = lockState.cells?.includes(cellKey) ?? false;
          }
        } else {
          console.warn('[DICE] 找不到表格的 rowIndex');
          isFieldLocked = false;
          hasAnyLockInRow = false;
        }
      } else {
        console.warn('[DICE] 找不到表格的 sheetKey');
        isFieldLocked = false;
        hasAnyLockInRow = false;
      }
    } else {
      if (!api) console.warn('[DICE] 数据库 API 不可用');
      isFieldLocked = false;
      hasAnyLockInRow = false;
    }

    // 构建锁定菜单项
    let lockMenuHtml = '';
    if (lockRowKey) {
      lockMenuHtml = '<div class="acu-cell-menu-separator"></div>';

      // 单元格锁定选项：当前单元格被锁定时显示"解锁"，否则显示"锁定"
      if (isFieldLocked) {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-unlock-field"><i class="fa-solid fa-unlock"></i> 解锁此单元格</button>';
      } else {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-lock-field"><i class="fa-solid fa-lock"></i> 锁定此单元格</button>';
      }

      // 整行锁定选项：行中有任意锁定时显示"解锁整行"，否则显示"锁定整行"
      if (hasAnyLockInRow) {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-unlock-row"><i class="fa-solid fa-unlock"></i> 解锁整行</button>';
      } else {
        lockMenuHtml +=
          '<button type="button" class="acu-cell-menu-item" id="act-lock-row"><i class="fa-solid fa-lock"></i> 锁定整行</button>';
      }
    }

    const menu = $(`
            <div class="acu-cell-menu acu-theme-${config.theme}">
                <button type="button" class="acu-cell-menu-item" id="act-edit"><i class="fa-solid fa-pen"></i> 编辑内容</button>
                <button type="button" class="acu-cell-menu-item" id="act-edit-card"><i class="fa-solid fa-edit"></i> 整体编辑</button>
                <button type="button" class="acu-cell-menu-item" id="act-insert"><i class="fa-solid fa-plus"></i> 在表尾新增行</button>
                <button type="button" class="acu-cell-menu-item" id="act-copy"><i class="fa-solid fa-copy"></i> 复制内容</button>
                <button type="button" class="acu-cell-menu-item" id="act-favorite"><i class="fa-solid fa-star"></i> 收藏此行</button>
                ${lockMenuHtml}
                ${isModified ? '<button type="button" class="acu-cell-menu-item" id="act-undo"><i class="fa-solid fa-undo"></i> 撤销本次修改</button>' : ''}
                <button type="button" class="acu-cell-menu-item" id="act-delete"><i class="fa-solid fa-trash"></i> 删除整行</button>
                <button type="button" class="acu-cell-menu-item" id="act-close"><i class="fa-solid fa-times"></i> 关闭菜单</button>
            </div>
        `);
    $('body').append(menu);

    // 稳健的坐标计算
    const winWidth = $(window).width();
    const winHeight = $(window).height();
    const mWidth = menu.outerWidth() || 150;
    const mHeight = menu.outerHeight() || 150;
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (!clientX && e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
      clientX = e.originalEvent.touches[0].clientX;
      clientY = e.originalEvent.touches[0].clientY;
    } else if (!clientX && e.changedTouches && e.changedTouches.length) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    }

    // 兜底坐标
    if (clientX === undefined) clientX = winWidth / 2;
    if (clientY === undefined) clientY = winHeight / 2;

    let left = clientX + 5;
    let top = clientY + 5;
    if (left + mWidth > winWidth) left = clientX - mWidth - 5;
    if (top + mHeight > winHeight) top = clientY - mHeight - 5;

    // 防止负坐标
    if (left < 5) left = 5;
    if (top < 5) top = 5;

    menu.css({ top: top + 'px', left: left + 'px' });

    const closeAll = () => {
      menu.remove();
      backdrop.remove();
    };
    backdrop.on('click', closeAll);
    menu.find('#act-close').click(closeAll);
    // 锁定字段
    // [修复] colIdx 是包含行号列的索引，数据库的 colIndex 不包含行号列，需要 -1
    const dbColIndex = colIdx - 1;
    menu.find('#act-lock-field').click(e => {
      e.stopPropagation();
      if (lockRowKey && currentHeader) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1 && dbColIndex >= 0) {
          api.lockTableCell(sheetKey, rowIndex, dbColIndex, true);
          // [优化] 直接修改 data-locked 属性，无需重新渲染
          // [修复] 同时更新 $cell 自身和内部所有带 data-locked 的元素
          if ($cell.is('[data-locked]')) {
            $cell.attr('data-locked', 'true');
          }
          $cell.find('[data-locked]').attr('data-locked', 'true');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法锁定单元格');
        }
      }
      closeAll();
    });

    // 解锁字段
    menu.find('#act-unlock-field').click(e => {
      e.stopPropagation();
      if (lockRowKey && currentHeader) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1 && dbColIndex >= 0) {
          api.lockTableCell(sheetKey, rowIndex, dbColIndex, false);
          // [优化] 直接修改 data-locked 属性，无需重新渲染
          // [修复] 同时更新 $cell 自身和内部所有带 data-locked 的元素
          if ($cell.is('[data-locked]')) {
            $cell.attr('data-locked', 'false');
          }
          $cell.find('[data-locked]').attr('data-locked', 'false');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法解锁单元格');
        }
      }
      closeAll();
    });

    // 锁定整行
    menu.find('#act-lock-row').click(e => {
      e.stopPropagation();
      if (lockRowKey) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1) {
          api.lockTableRow(sheetKey, rowIndex, true);
          // [优化] 直接修改卡片内所有可锁定元素的 data-locked 属性
          $card.find('[data-locked]').attr('data-locked', 'true');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法锁定整行');
        }
      }
      closeAll();
    });

    // 解锁整行
    menu.find('#act-unlock-row').click(e => {
      e.stopPropagation();
      if (lockRowKey) {
        if (api && sheetKey && rowIndex !== null && rowIndex !== -1) {
          // [改进] 解锁整行时，同时清除该行的所有单元格锁定
          const currentLockState = api.getTableLockState(sheetKey);
          if (currentLockState && currentLockState.cells) {
            // 找出该行的所有单元格锁定并逐一解锁
            const rowPrefix = `${rowIndex}:`;
            currentLockState.cells.forEach((cellKey: string) => {
              if (cellKey.startsWith(rowPrefix)) {
                const cellColIndex = parseInt(cellKey.split(':')[1], 10);
                if (!isNaN(cellColIndex)) {
                  api.lockTableCell(sheetKey, rowIndex, cellColIndex, false);
                }
              }
            });
          }
          // 解锁整行
          api.lockTableRow(sheetKey, rowIndex, false);
          // [优化] 直接修改卡片内所有可锁定元素的 data-locked 属性
          $card.find('[data-locked]').attr('data-locked', 'false');
        } else {
          console.warn('[DICE] 数据库API不可用或索引转换失败，无法解锁整行');
        }
      }
      closeAll();
    });

    // 复制功能 (v7.9 融合增强版：优先酒馆接口，兼容性最佳)
    menu.find('#act-copy').click(async e => {
      e.stopPropagation();

      // 【第一优先级】尝试使用酒馆 v7.7 的原生接口 (移动端/PWA 完美兼容)
      // 来源: slash_command.txt /clipboard-set
      if (window.TavernHelper && window.TavernHelper.triggerSlash) {
        try {
          // 转义特殊字符防止命令崩溃
          const safeContent = content
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}');
          await window.TavernHelper.triggerSlash(`/clipboard-set "${safeContent}"`);
          closeAll();
          return; // 如果成功，直接结束，不走后面的浏览器逻辑
        } catch (err) {
          console.warn('[DICE]ACU 酒馆接口复制失败，尝试浏览器原生方法', err);
        }
      }

      // 【第二优先级】浏览器原生逻辑 (v7.8 的兜底方案)
      const doCopy = text => {
        // 方案A: 现代 API (仅在 HTTPS 或 localhost 下有效)
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(text)
            .then(() => {})
            .catch(() => {
              fallbackCopy(text);
            });
        } else {
          // 方案B: 传统 execCommand (兼容 HTTP)
          fallbackCopy(text);
        }
      };

      const fallbackCopy = text => {
        try {
          const textArea = document.createElement('textarea');
          textArea.value = text;

          // 移动端防抖动处理
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.setAttribute('readonly', '');

          document.body.appendChild(textArea);

          textArea.select();
          textArea.setSelectionRange(0, 99999); // 针对 iOS Safari

          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);

          if (successful) {
          } else {
            throw new Error('execCommand failed');
          }
        } catch (err) {
          console.error('[DICE]ACU 复制失败:', err);
          void deps.showDiceSystemInputDialog({
            title: '手动复制',
            message: '复制失败，请长按下方文本手动复制',
            iconClass: 'fa-copy',
            initialValue: text,
            confirmText: '关闭',
            multiline: true,
            readonly: true,
            hideCancel: true,
          });
        }
      };

      doCopy(content);
      closeAll();
    });

    // 收藏此行功能
    menu.find('#act-favorite').click(async () => {
      try {
        // 获取当前行的完整数据
        const tableData = deps.getCachedRawData()?.[tableKey];
        if (!tableData || !tableData.content) {
          showActionableErrorToast('无法获取表格数据', { suggestion: 'table' });
          closeAll();
          return;
        }

        // 获取表头（去掉首列null）
        const fullHeader = tableData.content[0] || [];
        const header: string[] = fullHeader.slice(1).map((h: any) => String(h || ''));

        // 获取行数据（去掉首列null）
        const fullRowData = tableData.content[rowIdx + 1] || [];
        const rowDataValues: (string | number)[] = fullRowData.slice(1);

        if (header.length === 0 || rowDataValues.length === 0) {
          showActionableErrorToast('行数据为空', { suggestion: 'table' });
          closeAll();
          return;
        }

        // 弹出标签输入框
        const tagInput = await deps.showTagInputModal();
        if (tagInput === null) {
          // 用户取消
          closeAll();
          return;
        }
        const tags: string[] = tagInput
          ? tagInput
              .split(',')
              .map(t => t.trim())
              .filter(t => t.length > 0)
          : [];

        // 添加到收藏夹
        const result = await FavoritesManager.addFavorite(tableKey, tableName, header, rowDataValues, tags);

        if (result) {
          toastr.success('收藏成功');
        } else {
          showActionableErrorToast('收藏失败', { title: '收藏失败', suggestion: 'save' });
        }
      } catch (e) {
        console.error('[DICE]收藏失败:', e);
        showActionableErrorToast('收藏失败: ' + (e instanceof Error ? e.message : String(e)), {
          title: '收藏失败',
          suggestion: 'save',
        });
      }
      closeAll();
    });

    // 撤销功能
    menu.find('#act-undo').click(async () => {
      const snapshot = deps.loadSnapshot();
      let originalValue = null;
      const currentSheet = deps.getDiffSheetByKey(deps.getCachedRawData() || deps.getTableData(), tableKey);
      const snapshotEntry = snapshot ? deps.findDiffSnapshotEntry(snapshot, tableKey, currentSheet) : null;
      const snapshotRow = deps.getDiffDataRow(snapshotEntry?.sheet, rowIdx);
      if (snapshotRow) {
        originalValue = snapshotRow[colIdx];
      }

      if (originalValue !== null) {
        const rawData = deps.getCachedRawData() || deps.getTableData();
        const currentEntry = deps.findRuntimeSheetEntryForMutation(rawData, tableKey);
        const currentRow = deps.getDiffDataRow(currentEntry?.sheet, rowIdx);
        if (!currentRow) {
          if (window.toastr) window.toastr.warning('无法找到当前行，撤销失败');
          closeAll();
          return;
        }
        const nextRow = [...currentRow];
        nextRow[colIdx] = originalValue;
        try {
          await deps.saveRowInstantly(tableKey, rowIdx, nextRow, {
            tableName,
            headers: deps.getSheetHeaders(currentEntry?.sheet),
            currentRow,
            sourceData: rawData,
            sheet: currentEntry?.sheet,
          });
        } catch (e) {
          console.error('[DICE]ACU 撤销保存失败:', e);
          closeAll();
          return;
        }

        const $cell = $(cell);
        $cell.attr('data-val', deps.safeEncodeURIComponent(originalValue));
        $cell.data('val', deps.safeEncodeURIComponent(originalValue));

        // [核心修复1] 正确查找显示目标，防止覆盖 Label
        let $displayTarget = $cell;
        if ($cell.find('.acu-card-value').length > 0) {
          $displayTarget = $cell.find('.acu-card-value');
        } else if ($cell.hasClass('acu-grid-item')) {
          $displayTarget = $cell.find('.acu-grid-value');
        } else if ($cell.hasClass('acu-full-item')) {
          $displayTarget = $cell.find('.acu-full-value');
        }

        const badgeStyle = deps.getBadgeStyle(originalValue);
        if (badgeStyle && !$cell.hasClass('acu-editable-title')) {
          $displayTarget.html(`<span class="acu-badge ${badgeStyle}">${originalValue}</span>`);
        } else {
          $displayTarget.text(originalValue);
        }

        // [修复] 修正类名，确保撤销后高亮立即消失
        $displayTarget.removeClass('acu-highlight-manual acu-highlight-diff');
        if ($cell.hasClass('acu-editable-title')) $cell.removeClass('acu-highlight-manual acu-highlight-diff');

        window.acuModifiedSet.delete(cellId);

        if (window.acuModifiedSet.size === 0) {
          deps.setHasUnsavedChanges(false);
          deps.updateSaveButtonState();
        }
      } else {
        if (window.toastr) window.toastr.warning('无法找到原始数据，撤销失败');
      }
      closeAll();
    });

    // [优化] 删除逻辑 (统一即时删除)
    menu.find('#act-delete').click(async () => {
      // [修复] 在任何DOM操作之前保存滚动位置
      const $panelContent = $('.acu-panel-content');
      const savedScrollTop = $panelContent.length ? $panelContent.scrollTop() : 0;
      const savedScrollLeft = $panelContent.length ? $panelContent.scrollLeft() : 0;

      // 关闭右键菜单
      closeAll();

      // [Bug 1 修复] 只关闭preview card，保留地图overlay
      const $mapOverlay = $('.acu-map-overlay');
      const isFromMap = $mapOverlay.length > 0;

      // 只移除preview card overlay
      $('.acu-preview-overlay').remove();

      // --- 视觉优化：前端直接移除 DOM ---
      if (isFromMap) {
        // 地图中的元素chip有 data-table-key 和 data-row-index 属性
        $mapOverlay.find(`.acu-map-element-chip[data-table-key="${tableKey}"][data-row-index="${rowIdx}"]`).remove();
        $mapOverlay.find(`.acu-map-thumbnail[data-table-key="${tableKey}"][data-row-index="${rowIdx}"]`).remove();
      }

      // 主面板中的卡片动画移除
      const $card = $(cell).closest('.acu-data-card');
      if ($card.length && !isFromMap) {
        $card.css('transition', 'all 0.2s ease').css('opacity', '0').css('transform', 'scale(0.9)');
        setTimeout(() => $card.slideUp(200, () => $card.remove()), 200);
      }

      // --- 数据操作 ---
      try {
        await deps.deleteRowInstantly(tableKey, rowIdx);
        const latestRawData = deps.getCachedRawData() || deps.getTableData();

        // [Bug 3 修复] 立即同步更新diffMap，避免闪烁
        deps.setCurrentDiffMap(deps.generateDiffMap(latestRawData));

        // 刷新界面
        deps.renderInterface();

        // [修复] 如果地图overlay存在，刷新地图数据（重建viewModel）
        if (isFromMap) {
          const refreshMapData = $mapOverlay.data('refreshMapData');
          if (typeof refreshMapData === 'function') {
            await refreshMapData();
          }
        }

        // [修复] 恢复滚动位置（在renderInterface防抖完成后）
        setTimeout(() => {
          const $newContent = $('.acu-panel-content');
          if ($newContent.length && (savedScrollTop > 0 || savedScrollLeft > 0)) {
            $newContent.scrollTop(savedScrollTop);
            $newContent.scrollLeft(savedScrollLeft);
          }
        }, 60);
      } catch (e) {
        console.error('[DICE]ACU 删除保存失败:', e);
        showActionableErrorToast('删除保存失败: ' + (e instanceof Error ? e.message : String(e)), {
          title: '删除保存失败',
          developerHint: true,
        });
        deps.renderInterface();

        // [修复] 即使失败也恢复滚动位置
        setTimeout(() => {
          const $newContent = $('.acu-panel-content');
          if ($newContent.length && (savedScrollTop > 0 || savedScrollLeft > 0)) {
            $newContent.scrollTop(savedScrollTop);
            $newContent.scrollLeft(savedScrollLeft);
          }
        }, 60);
      }
    });

    // [新增] 新增行功能：新版数据库 CRUD 仅支持追加到表尾
    menu.find('#act-insert').click(async () => {
      closeAll();
      // 1. 获取最新数据 (优先用缓存，没有则重新获取)
      const sourceData = deps.getTableData({ silent: true }) || deps.getCachedRawData() || deps.loadSnapshot();
      const entry = deps.findRuntimeSheetEntryForMutation(sourceData, tableKey);

      if (entry?.sheet?.content) {
        const sheet = entry.sheet;
        // 2. 构造空行 (长度等于表头)
        const colCount = sheet.content[0] ? sheet.content[0].length : 2;
        const newRow = new Array(colCount).fill('');
        // 智能填充序号 (简单的自增逻辑)
        if (colCount > 0) newRow[0] = String(sheet.content.length);

        await deps.appendRowInstantly(entry.key || tableKey, newRow);

        // 【核心修复】保存后立即重绘界面，否则新行不会显示！
        deps.renderInterface();

        // 额外优化：如果是竖向模式，尝试滚动一下以确保新行可见
        setTimeout(() => {
          const $panel = $('.acu-panel-content');
          // 只有当不在底部时才微调，防止乱跳
          if ($panel.length && $panel[0].scrollHeight > $panel.height()) {
            $panel.scrollTop($panel.scrollTop() + 10);
          }
        }, 100);
      }
    });

    // [新增] 整体编辑事件
    menu.find('#act-edit-card').click(() => {
      closeAll();
      const rawData = deps.getCachedRawData() || deps.getTableData();
      if (rawData && rawData[tableKey]) {
        const headers = rawData[tableKey].content[0];
        const row = rawData[tableKey].content[rowIdx + 1];
        if (row) {
          deps.showCardEditModal(row, headers, tableName, rowIdx, tableKey);
        }
      }
    });

    menu.find('#act-edit').click(() => {
      closeAll();
      deps.showEditDialog(content, async newVal => {
        const rawData = deps.getCachedRawData() || deps.getTableData() || deps.loadSnapshot();
        const entry = deps.findRuntimeSheetEntryForMutation(rawData, tableKey);
        const currentRow = deps.getDiffDataRow(entry?.sheet, rowIdx);

        if (!currentRow) {
          void deps.showDiceSystemConfirmDialog({
            title: '无法写入缓存',
            message: '数据结构异常，无法写入缓存，请刷新页面',
            iconClass: 'fa-triangle-exclamation',
            confirmText: '知道了',
            tone: 'danger',
            hideCancel: true,
          });
          return;
        }

        const nextRow = [...currentRow];
        nextRow[colIdx] = newVal;

        // 使用 saveRowInstantly 执行即时保存 + 单行快照更新
        try {
          await deps.saveRowInstantly(tableKey, rowIdx, nextRow, {
            tableName,
            headers: deps.getSheetHeaders(entry?.sheet),
            currentRow,
            sourceData: rawData,
            sheet: entry?.sheet,
          });
        } catch (e) {
          console.error('[DICE]ACU 单元格保存失败:', e);
          showActionableErrorToast('保存失败: ' + (e instanceof Error ? e.message : String(e)), {
            title: '单元格保存失败',
            developerHint: true,
          });
          return;
        }

        // 2. 准备 UI 元素
        const $cell = $(cell);
        $cell.attr('data-val', deps.safeEncodeURIComponent(newVal)).data('val', deps.safeEncodeURIComponent(newVal));

        let $displayTarget = $cell;
        if ($cell.find('.acu-card-value').length) $displayTarget = $cell.find('.acu-card-value');
        else if ($cell.hasClass('acu-grid-item')) $displayTarget = $cell.find('.acu-grid-value');
        else if ($cell.hasClass('acu-editable-title')) $displayTarget = $cell;

        // 3. 更新 UI 文字/样式 (通用)
        const badgeStyle = deps.getBadgeStyle(newVal);
        if (badgeStyle && !$cell.hasClass('acu-editable-title')) {
          $displayTarget.html(`<span class="acu-badge ${badgeStyle}">${deps.escapeHtml(newVal)}</span>`);
        } else {
          $displayTarget.text(newVal);
        }

        // 4. 统一使用即时保存 + 单行快照更新（保留其他行的AI变更高亮）
        // 移除高亮 (因为马上就保存了)
        $displayTarget.removeClass('acu-highlight-manual acu-highlight-diff');
        if ($cell.hasClass('acu-editable-title')) $cell.removeClass('acu-highlight-manual acu-highlight-diff');

        deps.setCurrentDiffMap(deps.generateDiffMap(deps.getCachedRawData() || deps.getTableData()));
      });
    });
  };
  return showCellMenu;
}
