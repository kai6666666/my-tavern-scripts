// @ts-nocheck
/**
 * row-compare-edit-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowRowCompareEditModal(deps: any) {
  const showRowCompareEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();

    // 获取快照中的旧行
    const snapshot = deps.loadSnapshot();
    const currentRawData = deps.getCachedRawData() || deps.getTableData();
    const snapshotEntry = snapshot
      ? deps.findDiffSnapshotEntry(snapshot, tableKey, deps.getDiffSheetByKey(currentRawData, tableKey))
      : null;
    const oldRow = deps.getDiffDataRow(snapshotEntry?.sheet, rowIndex) || [];

    // 构建字段对比列表
    let fieldsHtml = '';
    for (let idx = 1; idx < headers.length; idx++) {
      const headerName = headers[idx] || `列 ${idx}`;
      const oldVal = oldRow[idx] ?? '';
      const newVal = row[idx] ?? '';
      const isChanged = String(oldVal) !== String(newVal);

      fieldsHtml += `
                <div class="acu-row-edit-field ${isChanged ? 'acu-field-changed' : ''}">
                    <div class="acu-row-edit-label">${deps.escapeHtml(headerName)} ${isChanged ? '<span class="acu-changed-badge">已改</span>' : ''}</div>
                    ${isChanged ? `<div class="acu-row-edit-old">${deps.escapeHtml(oldVal) || '<span class="acu-empty-val">(空)</span>'}</div>` : ''}
                    <textarea class="acu-row-edit-input acu-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${deps.escapeHtml(newVal)}</textarea>
                </div>
            `;
    }

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}" style="max-width:550px;">
                    <div class="acu-edit-title">整体编辑: ${deps.escapeHtml(tableName)} - ${deps.escapeHtml(row[1] || '行 ' + (rowIndex + 1))}</div>
                    <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px; max-height:60vh;">
                        ${fieldsHtml}
                    </div>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-row-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button type="button" class="acu-dialog-btn" id="dlg-row-revert"><i class="fa-solid fa-rotate-left"></i> 全部恢复</button>
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-row-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // 自动高度
    const adjustHeight = el => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight + 2, 200) + 'px';
    };
    dialog.find('textarea').each(function () {
      adjustHeight(this);
    });
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-row-cancel').click(closeDialog);
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    // 全部恢复
    dialog.find('#dlg-row-revert').click(function () {
      dialog.find('textarea').each(function () {
        const colIdx = parseInt($(this).data('col'));
        $(this)
          .val(oldRow[colIdx] ?? '')
          .trigger('input');
      });
    });

    // 保存
    dialog.find('#dlg-row-save').click(async () => {
      let rawData = deps.getCachedRawData() || deps.getTableData();
      if (!rawData?.[tableKey]?.content?.[rowIndex + 1]) {
        closeDialog();
        return;
      }

      const currentRow = rawData[tableKey].content[rowIndex + 1];
      const nextRow = [...currentRow];
      let hasChanges = false;

      dialog.find('textarea').each(function () {
        const colIdx = parseInt($(this).data('col'));
        const newVal = $(this).val();
        if (String(nextRow[colIdx]) !== String(newVal)) {
          hasChanges = true;
          nextRow[colIdx] = newVal;
        }
      });

      if (hasChanges) {
        await deps.saveRowInstantly(tableKey, rowIndex, nextRow, {
          tableName,
          headers,
          currentRow,
          sourceData: rawData,
          sheet: rawData[tableKey],
        });

        // 更新快照中这一行
        const snapshot = deps.loadSnapshot();
        const snapshotEntry = snapshot ? deps.findDiffSnapshotEntry(snapshot, tableKey, rawData[tableKey]) : null;
        if (deps.setDiffDataRow(snapshotEntry?.sheet, rowIndex, deps.normalizeDiffRow(nextRow))) {
          deps.saveSnapshot(snapshot);
        }

        deps.setCurrentDiffMap(deps.generateDiffMap(deps.getCachedRawData() || deps.getTableData() || rawData));
        deps.refreshChangesPanel();
      }
      closeDialog();
    });
  };
  return showRowCompareEditModal;
}
