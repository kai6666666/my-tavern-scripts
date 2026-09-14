// @ts-nocheck
/**
 * change-single-field-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowChangeSingleFieldModal(deps: any) {
  const showChangeSingleFieldModal = (value, headerName, tableName, rowIndex, colIndex, tableKey) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();

    // 获取快照中的旧值
    const snapshot = deps.loadSnapshot();
    const currentRawData = deps.getCachedRawData() || deps.getTableData();
    const snapshotEntry = snapshot
      ? deps.findDiffSnapshotEntry(snapshot, tableKey, deps.getDiffSheetByKey(currentRawData, tableKey))
      : null;
    const oldRow = deps.getDiffDataRow(snapshotEntry?.sheet, rowIndex);
    const oldValue = String(oldRow?.[colIndex] ?? '');
    const hasOldValue = oldValue !== '' && String(oldValue) !== String(value);

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}" style="max-width:450px;">
                    <div class="acu-edit-title">编辑: ${deps.escapeHtml(tableName)} - ${deps.escapeHtml(headerName)}</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
                        ${
                          hasOldValue
                            ? `
                        <div class="acu-diff-section acu-diff-old-section">
                            <div class="acu-diff-label">
                                <i class="fa-solid fa-clock-rotate-left"></i> 原始值（快照）
                            </div>
                            <div class="acu-diff-readonly">${deps.escapeHtml(oldValue)}</div>
                        </div>
                        <div class="acu-diff-arrow-down">
                            <i class="fa-solid fa-arrow-down"></i>
                        </div>
                        `
                            : ''
                        }
                        <div class="acu-diff-section acu-diff-new-section">
                            <div class="acu-diff-label">
                                <i class="fa-solid fa-pen"></i> ${hasOldValue ? '当前值（可编辑）' : '内容'}
                            </div>
                            <textarea class="acu-change-single-input acu-edit-textarea" spellcheck="false"
                                style="width:100%;min-height:60px;max-height:300px;padding:12px;resize:none;">${deps.escapeHtml(value)}</textarea>
                        </div>
                    </div>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-single-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        ${hasOldValue ? `<button type="button" class="acu-dialog-btn acu-btn-revert" id="dlg-single-revert"><i class="fa-solid fa-rotate-left"></i> 恢复原值</button>` : ''}
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-single-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // 自动高度
    const $textarea = dialog.find('.acu-change-single-input');
    const adjustHeight = () => {
      $textarea[0].style.height = 'auto';
      const h = Math.max(60, Math.min($textarea[0].scrollHeight + 2, 300));
      $textarea[0].style.height = h + 'px';
    };
    setTimeout(adjustHeight, 0);
    $textarea.on('input', adjustHeight);
    $textarea.focus();

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-single-cancel').click(closeDialog);
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    // [新增] 恢复原值按钮
    dialog.find('#dlg-single-revert').click(function () {
      $textarea.val(oldValue).trigger('input');
    });

    dialog.find('#dlg-single-save').click(async () => {
      const newVal = $textarea.val();
      let rawData = deps.getCachedRawData() || deps.getTableData();

      if (rawData && rawData[tableKey] && rawData[tableKey].content) {
        const currentRow = rawData[tableKey].content[rowIndex + 1];
        if (currentRow && String(currentRow[colIndex]) !== String(newVal)) {
          const nextRow = [...currentRow];
          nextRow[colIndex] = newVal;
          await deps.saveRowInstantly(tableKey, rowIndex, nextRow, {
            tableName,
            headers: rawData[tableKey].content[0] || [],
            currentRow,
            sourceData: rawData,
            sheet: rawData[tableKey],
          });

          // 只更新快照中这一个单元格
          const snapshot = deps.loadSnapshot();
          const snapshotEntry = snapshot ? deps.findDiffSnapshotEntry(snapshot, tableKey, rawData[tableKey]) : null;
          if (deps.setDiffDataCell(snapshotEntry?.sheet, rowIndex, colIndex, newVal)) {
            deps.saveSnapshot(snapshot);
          }

          // 刷新
          deps.setCurrentDiffMap(deps.generateDiffMap(deps.getCachedRawData() || deps.getTableData() || rawData));
          deps.refreshChangesPanel();
        }
      }
      closeDialog();
    });
  };
  return showChangeSingleFieldModal;
}
