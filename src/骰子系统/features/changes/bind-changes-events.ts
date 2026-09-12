// @ts-nocheck
/**
 * bind-changes-events.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR } from '../../shared/constants';
import { Store } from '../../shared/storage/store';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createBindChangesEvents(deps: any) {
  const bindChangesEvents = () => {
    const { $ } = deps.getCore();
    const getChangesPanel = (): JQuery<HTMLElement> => {
      const $panel = $('.acu-changes-content').closest<HTMLElement>('.acu-data-display').first();
      if ($panel.length) return $panel;
      return $('#acu-data-area').first() as JQuery<HTMLElement>;
    };

    const resolveChangesPanelJumpTarget = ($item: JQuery): { tableName: string; rowIndex: number } | null => {
      const tableNameFromItem = String($item.data('table') ?? '');
      const tableKey = String($item.data('table-key') || '').trim();
      const rawRowIndex = $item.data('row') ?? $item.data('row-index');
      const rowIndex = Number.parseInt(String(rawRowIndex ?? ''), 10);
      let tableName = tableNameFromItem;

      if (!tableName && tableKey) {
        const rawData = deps.getCachedRawData() || deps.getTableData();
        tableName = String(rawData?.[tableKey]?.name ?? '');
      }

      if (!tableName || !Number.isInteger(rowIndex) || rowIndex < 0) return null;
      return { tableName, rowIndex };
    };

    const jumpToChangesPanelTarget = ($item: JQuery) => {
      const target = resolveChangesPanelJumpTarget($item);
      if (!target) {
        if (window.toastr) window.toastr.warning('无法定位该变更对应的表格行');
        return;
      }
      const tableName = deps.resolveExistingTableName(target.tableName);
      if (!tableName) {
        deps.warnMissingTableTarget(target.tableName);
        return;
      }

      Store.set('acu_changes_panel_active', false);
      Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
      Store.set(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
      Store.set('acu_favorites_panel_active', false);
      deps.saveActiveTabState(tableName);
      deps.setActiveTableNavButton(tableName);
      deps.renderInterface();

      setTimeout(() => {
        const $targetCard = $(`.acu-data-card[data-row-index="${target.rowIndex}"]`);
        if ($targetCard.length) {
          $targetCard[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          $targetCard.addClass('acu-highlight-flash');
          setTimeout(() => $targetCard.removeClass('acu-highlight-flash'), 2000);
        }
      }, 300);
    };

    // 关闭按钮
    $('.acu-changes-content')
      .closest('.acu-data-display')
      .find('.acu-close-btn')
      .off('click')
      .on('click', function () {
        Store.set('acu_changes_panel_active', false);
        const $panel = getChangesPanel();
        deps.closePanel($panel.closest<HTMLElement>(DICE_ROOT_SELECTOR));
      });

    // === 触摸滑动检测阈值（用于区分滑动和点击）===
    const TOUCH_MOVE_THRESHOLD = 10; // 移动超过10px视为滑动

    // === 验证错误：回滚按钮（恢复快照值）===
    $('.acu-validation-error-item .acu-action-reject')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-validation-error-item');
        const tableName = $item.data('table');
        const rowIndex = parseInt($item.data('row'), 10);
        const columnName = $item.data('column');

        if (rowIndex < 0) {
          if (window.toastr) window.toastr.warning('整表级验证项仅标注，不支持快捷回滚');
          return;
        }

        const snapshot = deps.loadSnapshot();
        if (!snapshot) {
          if (window.toastr) window.toastr.warning('无快照数据可恢复');
          return;
        }

        try {
          const rawData = deps.getCachedRawData() || deps.getTableData();
          for (const sheetId in rawData) {
            if (rawData[sheetId]?.name === tableName && snapshot[sheetId]) {
              const headers = rawData[sheetId].content?.[0] || [];
              const colIdx = headers.indexOf(columnName);
              if (
                colIdx >= 0 &&
                rawData[sheetId].content?.[rowIndex + 1] &&
                snapshot[sheetId].content?.[rowIndex + 1]
              ) {
                const snapshotValue = snapshot[sheetId].content[rowIndex + 1][colIdx];
                const nextRow = [...rawData[sheetId].content[rowIndex + 1]];
                nextRow[colIdx] = snapshotValue;
                await deps.saveRowInstantly(sheetId, rowIndex, nextRow);
                deps.renderInterface();
                return;
              }
              break;
            }
          }
          if (window.toastr) window.toastr.warning('无法找到对应的快照数据');
        } catch (err) {
          console.error('[DICE]ACU 恢复快照值失败:', err);
          if (window.toastr) showActionableErrorToast('恢复失败', { suggestion: 'save' });
        }
      });

    // === 验证错误：编辑按钮（智能修改）===
    $('.acu-validation-error-item .acu-action-edit')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-validation-error-item');
        const ruleData = $item.data('rule-data');
        if (!ruleData) {
          if (window.toastr) window.toastr.warning('无法获取规则信息');
          return;
        }
        try {
          const parsed = typeof ruleData === 'string' ? JSON.parse(ruleData) : ruleData;
          const error = {
            ruleId: parsed.ruleId,
            ruleType: parsed.ruleType,
            rule: parsed.rule,
            tableName: $item.data('table') || parsed.tableName || '',
            rowIndex: parseInt($item.data('row'), 10) || parsed.rowIndex || 0,
            columnName: $item.data('column') || parsed.columnName || '',
            currentValue: parsed.currentValue || '',
            rowTitle: parsed.rowTitle || '', // 添加 rowTitle 到错误对象
            ruleName: parsed.ruleName || parsed.rule?.name || '',
            errorMessage: parsed.errorMessage || parsed.rule?.errorMessage || '',
          };
          deps.showSmartFixModal(error);
        } catch (err) {
          console.error('[DICE]ACU 解析规则数据失败:', err);
          if (window.toastr) showActionableErrorToast('解析规则数据失败', { developerHint: true });
        }
      });

    // === 验证错误项：点击定位（但按钮区域除外，且区分滑动和点击）===
    let validationItemTouchStartPos: { x: number; y: number } | null = null;

    $('.acu-validation-error-item')
      .off('click touchstart touchend touchmove')
      .on('touchstart', function (e) {
        const touch = (e.originalEvent as TouchEvent).touches[0];
        validationItemTouchStartPos = { x: touch.clientX, y: touch.clientY };
      })
      .on('touchmove', function (e) {
        if (!validationItemTouchStartPos) return;
        const touch = (e.originalEvent as TouchEvent).touches[0];
        const deltaX = Math.abs(touch.clientX - validationItemTouchStartPos.x);
        const deltaY = Math.abs(touch.clientY - validationItemTouchStartPos.y);
        // 如果移动超过阈值，清除起始位置，表示这是滑动
        if (deltaX > TOUCH_MOVE_THRESHOLD || deltaY > TOUCH_MOVE_THRESHOLD) {
          validationItemTouchStartPos = null;
        }
      })
      .on('touchend', function (e) {
        // 如果触摸位置已被清除（滑动），不触发点击
        if (!validationItemTouchStartPos) return;
        validationItemTouchStartPos = null;

        // 如果点击的是按钮区域，不触发定位
        if ($(e.target).closest('.acu-change-actions, .acu-change-action-btn').length) {
          return;
        }

        // [新增] 检查是否为数据验证模式下的验证错误项
        const isValidationMode = Store.get(deps.STORAGE_KEY_VALIDATION_MODE, false);
        if (isValidationMode) {
          // 数据验证模式下的验证项不跳转
          return;
        }

        jumpToChangesPanelTarget($(this));
      })
      .on('click', function (e) {
        // 桌面端仍使用 click 事件
        // 如果点击的是按钮区域，不触发定位
        if ($(e.target).closest('.acu-change-actions, .acu-change-action-btn').length) {
          return;
        }

        // 检测是否是触摸设备，如果是则 touchend 已处理
        if ('ontouchstart' in window) return;

        // [新增] 检查是否为数据验证模式下的验证错误项
        const isValidationMode = Store.get(deps.STORAGE_KEY_VALIDATION_MODE, false);
        if (isValidationMode) {
          // 数据验证模式下的验证项不跳转
          return;
        }

        jumpToChangesPanelTarget($(this));
      });

    // 折叠/展开分组（根据模式使用不同的存储键）
    $('.acu-changes-group-header')
      .off('click')
      .on('click', function (e) {
        if ($(e.target).closest('.acu-change-item').length) return;

        const tableName = $(this).data('table');
        const $group = $(this).closest('.acu-changes-group');
        const $body = $group.find('.acu-changes-group-body');
        const $icon = $(this).find('.acu-collapse-icon');

        // 根据是否是数据验证模式使用不同的存储键
        const isValidationMode = $(this).hasClass('acu-validation-group-header');
        const storageKey = isValidationMode ? 'acu_validation_collapsed_groups' : 'acu_changes_collapsed_groups';
        let collapsedGroups = Store.get(storageKey, []);

        if ($group.hasClass('collapsed')) {
          $group.removeClass('collapsed');
          $body.slideDown(200);
          $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
          collapsedGroups = collapsedGroups.filter(n => n !== tableName);
        } else {
          $group.addClass('collapsed');
          $body.slideUp(200);
          $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
          if (!collapsedGroups.includes(tableName)) {
            collapsedGroups.push(tableName);
          }
        }

        Store.set(storageKey, collapsedGroups);
      });

    // === 单项操作：接受（完整面板变更条目）===
    $('.acu-change-item .acu-action-accept')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const colIndex = $item.data('col-index');

        const snapshot = deps.loadSnapshot();
        const rawData = deps.getCachedRawData() || deps.getTableData();
        if (!snapshot || !rawData) return;
        if (['table_deleted', 'table_added', 'table_structure_changed'].includes(changeType)) {
          if (window.toastr) window.toastr.warning('整表/结构级变更仅标注，不支持快捷接受');
          return;
        }

        const rawSheet = deps.getDiffSheetByKey(rawData, tableKey);
        const snapshotEntry = deps.findDiffSnapshotEntry(snapshot, tableKey, rawSheet);
        const rawEntry = deps.findDiffSnapshotEntry(rawData, tableKey, snapshotEntry?.sheet || rawSheet);
        if (!rawEntry?.sheet || !snapshotEntry?.sheet) {
          if (window.toastr) window.toastr.warning('找不到对应表格，无法快捷接受该变更');
          return;
        }

        if (changeType === 'cell_modified') {
          // 接受单元格修改：将新值写入快照
          const currentRow = deps.getDiffDataRow(rawEntry.sheet, rowIndex);
          if (currentRow) deps.setDiffDataCell(snapshotEntry.sheet, rowIndex, colIndex, currentRow[colIndex]);
        } else if (changeType === 'row_modified') {
          // 接受整行修改：将整行新值写入快照
          const currentRow = deps.getDiffDataRow(rawEntry.sheet, rowIndex);
          if (currentRow) deps.setDiffDataRow(snapshotEntry.sheet, rowIndex, currentRow);
        } else if (changeType === 'row_added') {
          // 接受新增行：将新行写入快照
          const currentRow = deps.getDiffDataRow(rawEntry.sheet, rowIndex);
          if (currentRow) deps.setDiffDataRow(snapshotEntry.sheet, rowIndex, currentRow);
        } else if (changeType === 'row_deleted') {
          // 接受删除：从快照中也删除该行
          deps.removeDiffDataRow(snapshotEntry.sheet, rowIndex);
        }

        deps.saveSnapshot(snapshot);

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          deps.refreshChangesPanel();
        });
      });

    // === 单项操作：拒绝（完整面板变更条目）===
    $('.acu-change-item .acu-action-reject')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const colIndex = $item.data('col-index');
        const oldValue = deps.safeDecodeURIComponent($item.data('old-value') || '');

        const snapshot = deps.loadSnapshot();
        let rawData = deps.getCachedRawData() || deps.getTableData();
        if (!snapshot || !rawData) return;

        const snapshotEntry = deps.findDiffSnapshotEntry(snapshot, tableKey, deps.getDiffSheetByKey(rawData, tableKey));
        const rawEntry = deps.findDiffSnapshotEntry(
          rawData,
          tableKey,
          snapshotEntry?.sheet || deps.getDiffSheetByKey(rawData, tableKey),
        );
        if (!rawEntry?.sheet) {
          if (window.toastr) window.toastr.warning('找不到当前表格，无法快捷拒绝该变更');
          return;
        }

        if (changeType === 'cell_modified') {
          // 拒绝单元格修改：恢复为快照中的旧值
          const currentRow = deps.getDiffDataRow(rawEntry.sheet, rowIndex);
          if (!currentRow) return;
          const nextRow = [...currentRow];
          nextRow[colIndex] = oldValue;
          await deps.saveRowInstantly(rawEntry.key || tableKey, rowIndex, nextRow);
        } else if (changeType === 'row_modified') {
          // 拒绝整行修改：从快照恢复整行
          const snapshotRow = deps.getDiffDataRow(snapshotEntry?.sheet, rowIndex);
          if (!snapshotRow) return;
          await deps.saveRowInstantly(rawEntry.key || tableKey, rowIndex, [...snapshotRow]);
        } else if (changeType === 'row_added') {
          // 拒绝新增行：从数据中删除该行
          await deps.deleteRowInstantly(rawEntry.key || tableKey, rowIndex);
        }

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          deps.refreshChangesPanel();
        });
      });

    // === 单项操作：恢复（用于已删除的行/表）===
    $('.acu-action-restore')
      .off('click')
      .on('click', async function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const changeType = $item.data('change-type');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');

        const snapshot = deps.loadSnapshot();
        let rawData = deps.getCachedRawData() || deps.getTableData();
        if (!snapshot || !rawData) return;

        if (changeType === 'row_deleted') {
          // 恢复删除的行：从快照中取回该行
          const snapshotEntry = deps.findDiffSnapshotEntry(snapshot, tableKey, deps.getDiffSheetByKey(rawData, tableKey));
          const rawEntry = deps.findDiffSnapshotEntry(rawData, tableKey, snapshotEntry?.sheet);
          const restoredRow = deps.getDiffDataRow(snapshotEntry?.sheet, rowIndex);
          if (!rawEntry?.sheet?.content || !restoredRow) {
            if (window.toastr) window.toastr.warning('找不到对应表格，无法快捷恢复该行');
            return;
          }
          await deps.appendRowInstantly(rawEntry.key || tableKey, [...restoredRow]);
        } else if (changeType === 'table_deleted') {
          if (window.toastr) window.toastr.warning('整表级变更仅标注，不支持快捷恢复');
          return;
        }

        // 移除该条目并刷新
        $item.fadeOut(200, function () {
          $(this).remove();
          deps.refreshChangesPanel();
        });
      });

    // === 单项操作：编辑（完整面板变更条目，排除验证错误项）===
    $('.acu-change-item:not(.acu-validation-error-item) .acu-action-edit')
      .off('click')
      .on('click', function (e) {
        e.stopPropagation();
        const $item = $(this).closest('.acu-change-item');
        const tableKey = $item.data('table-key');
        const rowIndex = $item.data('row-index');
        const changeType = $item.data('change-type');

        if (!tableKey || rowIndex === undefined) return;

        const rawData = deps.getCachedRawData() || deps.getTableData();
        if (!rawData || !rawData[tableKey]) return;

        const sheet = rawData[tableKey];
        const headers = sheet.content ? sheet.content[0] : [];
        const row = sheet.content ? sheet.content[rowIndex + 1] : null;

        if (!row) {
          if (window.toastr) window.toastr.warning('该行可能已被删除');
          return;
        }

        // 根据变更类型选择编辑方式
        if (changeType === 'row_modified') {
          // 多字段修改，打开整体编辑
          deps.showRowCompareEditModal(row, headers, sheet.name || '编辑', rowIndex, tableKey);
        } else if (changeType === 'cell_modified') {
          const colIndex = $item.data('col-index');
          const headerName = headers[colIndex] || `列${colIndex}`;
          const cellValue = row[colIndex] || '';
          deps.showChangeSingleFieldModal(cellValue, headerName, sheet.name, rowIndex, colIndex, tableKey);
        } else {
          deps.showChangeEditModal(row, headers, sheet.name || '编辑', rowIndex, tableKey);
        }
      });

    // === 批量操作：接受全部 ===
    $('.acu-batch-accept')
      .off('click')
      .on('click', async function () {
        const rawData = deps.getCachedRawData() || deps.getTableData();
        if (!rawData) return;
        const snapshot = deps.loadSnapshot();
        const hasStructuralDiff =
          snapshot &&
          (Object.keys(snapshot).some(key => key.startsWith('sheet_') && !rawData[key]) ||
            Object.keys(rawData).some(key => key.startsWith('sheet_') && !snapshot[key]) ||
            Object.keys(rawData).some(
              key =>
                key.startsWith('sheet_') &&
                snapshot[key]?.content &&
                rawData[key]?.content &&
                JSON.stringify(snapshot[key].content[0] || []) !== JSON.stringify(rawData[key].content[0] || []),
            ));
        if (hasStructuralDiff) {
          if (window.toastr) window.toastr.warning('存在整表/结构级变更，批量接受已跳过；请先处理可安全的行/格变更');
          return;
        }

        // 将当前数据完整保存为新快照
        deps.saveSnapshot(JSON.parse(JSON.stringify(rawData)));
        deps.setCurrentDiffMap(new Set());

        // 刷新面板
        deps.refreshChangesPanel();
      });

    // === 批量操作：拒绝全部 ===
    $('.acu-batch-reject')
      .off('click')
      .on('click', async function () {
        const snapshot = deps.loadSnapshot();
        if (!snapshot) {
          if (window.toastr) window.toastr.warning('无快照数据');
          return;
        }
        const rawData = deps.getCachedRawData() || deps.getTableData();
        const hasStructuralDiff =
          rawData &&
          (Object.keys(snapshot).some(key => key.startsWith('sheet_') && !rawData[key]) ||
            Object.keys(rawData).some(key => key.startsWith('sheet_') && !snapshot[key]) ||
            Object.keys(rawData).some(
              key =>
                key.startsWith('sheet_') &&
                snapshot[key]?.content &&
                rawData[key]?.content &&
                JSON.stringify(snapshot[key].content[0] || []) !== JSON.stringify(rawData[key].content[0] || []),
            ));
        if (hasStructuralDiff) {
          if (window.toastr) window.toastr.warning('存在整表/结构级变更，批量拒绝已跳过；请逐项处理可安全的行/格变更');
          return;
        }

        // 将快照数据恢复为当前数据
        const restoredData = JSON.parse(JSON.stringify(snapshot));
        await deps.saveDataToDatabase(restoredData, false, false);
      });

    // === 简洁模式切换 ===
    $('.acu-simple-mode-toggle')
      .off('click')
      .on('click', function () {
        const currentMode = Store.get(deps.STORAGE_KEY_VALIDATION_MODE, false);
        const newMode = !currentMode;
        Store.set(deps.STORAGE_KEY_VALIDATION_MODE, newMode);

        // 刷新面板
        const rawData = deps.getCachedRawData() || deps.getTableData();
        getChangesPanel().html(deps.renderChangesPanel(rawData));
        bindChangesEvents();

        // 更新导航栏计数
        deps.updateChangesCount(rawData);
      });

    // === 高度拖动调节 ===
    $('.acu-changes-content')
      .closest('.acu-data-display')
      .find('.acu-height-drag-handle')
      .off('pointerdown')
      .on('pointerdown', function (e) {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const handle = this;
        handle.setPointerCapture(e.pointerId);
        $(handle).add($(handle).closest('.acu-height-control')).addClass('active');
        const $panel = getChangesPanel();
        const startHeight = deps.getPanelDragStartHeight($panel);
        let requestedHeight = startHeight;
        const startY = e.clientY;
        const tableName = $(handle).data('table');

        handle.onpointermove = function (moveE) {
          const dy = moveE.clientY - startY;
          requestedHeight = deps.setPanelRequestedHeight($panel, startHeight - dy) || requestedHeight;
        };
        handle.onpointerup = function (upE) {
          $(handle).add($(handle).closest('.acu-height-control')).removeClass('active');
          handle.releasePointerCapture(upE.pointerId);
          handle.onpointermove = null;
          handle.onpointerup = null;
          // 保存高度
          deps.savePanelRequestedHeight(tableName, requestedHeight);
        };
      })
      .off('dblclick')
      .on('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const tableName = $(this).data('table');
        const $panel = getChangesPanel();
        deps.resetPanelRequestedHeight($panel, tableName);
      });

    // === 横向模式：智能区分横向和竖向滑动 ===
    const $horizontalScroller = $('.acu-changes-content.acu-changes-horizontal');
    if ($horizontalScroller.length) {
      $horizontalScroller[0].addEventListener(
        'touchstart',
        function (e) {
          this._touchStartX = e.touches[0].clientX;
          this._touchStartY = e.touches[0].clientY;
          this._scrollDirection = null; // 重置滚动方向
        },
        { passive: true },
      );

      $horizontalScroller[0].addEventListener(
        'touchmove',
        function (e) {
          if (!this._touchStartX) return;

          const deltaX = Math.abs(e.touches[0].clientX - this._touchStartX);
          const deltaY = Math.abs(e.touches[0].clientY - this._touchStartY);

          // 第一次移动时确定主滚动方向
          if (!this._scrollDirection && (deltaX > 5 || deltaY > 5)) {
            this._scrollDirection = deltaX > deltaY ? 'horizontal' : 'vertical';
          }

          // 只在明确是横向滚动时才阻止事件传播
          // 竖向滚动时不做任何干预，让其自然触发页面滚动
          if (this._scrollDirection === 'horizontal' && deltaX > 10) {
            e.stopPropagation();
          }
        },
        { passive: false },
      );

      $horizontalScroller[0].addEventListener(
        'touchend',
        function () {
          this._touchStartX = null;
          this._touchStartY = null;
          this._scrollDirection = null;
        },
        { passive: true },
      );

      $horizontalScroller.off('wheel.acuHorizontalScroll').on('wheel.acuHorizontalScroll', function (e) {
        const event = e.originalEvent as WheelEvent | undefined;
        if (!event) return;

        const deltaX = Math.abs(event.deltaX);
        const deltaY = Math.abs(event.deltaY);
        const isHorizontalWheel = deltaX > 0 && deltaX >= deltaY;
        const isShiftWheel = event.shiftKey && deltaY > 0;
        if (!isHorizontalWheel && !isShiftWheel) return;

        const scroller = this as HTMLElement;
        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        if (maxScrollLeft <= 0) return;

        const rawDelta = isHorizontalWheel ? event.deltaX : event.deltaY;
        const deltaUnit =
          event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? scroller.clientWidth
            : event.deltaMode === WheelEvent.DOM_DELTA_LINE
              ? 16
              : 1;
        const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, scroller.scrollLeft + rawDelta * deltaUnit));
        if (nextScrollLeft === scroller.scrollLeft) return;

        e.preventDefault();
        e.stopPropagation();
        scroller.scrollLeft = nextScrollLeft;
      });
    }
  };
  return bindChangesEvents;
}
