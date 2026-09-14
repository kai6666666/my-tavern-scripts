// @ts-nocheck
/**
 * change-edit-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowChangeEditModal(deps: any) {
  const showChangeEditModal = (row, headers, tableName, rowIndex, tableKey) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();

    const inputsHtml = row
      .map((cell, idx) => {
        if (idx === 0) return '';
        const headerName = headers[idx] || `列 ${idx}`;
        const val = cell || '';
        return `
                <div class="acu-card-edit-field">
                    <label class="acu-card-edit-label">${deps.escapeHtml(headerName)}</label>
                    <textarea class="acu-card-edit-input acu-card-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${deps.escapeHtml(val)}</textarea>
                </div>`;
      })
      .join('');

    const dialog = $(`
            <div class="acu-edit-overlay">
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">编辑变更 (#${rowIndex + 1} - ${deps.escapeHtml(tableName)})</div>
                    <div class="acu-settings-content acu-settings-content-scroll">
                        ${inputsHtml}
                    </div>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-change-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-change-save"><i class="fa-solid fa-check"></i> 保存并确认</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // [修复] 自动高度调节逻辑
    const adjustHeight = el => {
      // 关键修复：使用 auto 而不是 0px，防止布局塌陷并正确获取 scrollHeight
      el.style.height = 'auto';
      const contentHeight = el.scrollHeight + 2;
      const maxHeight = 500;
      el.style.height = Math.min(contentHeight, maxHeight) + 'px';
      el.style.overflowY = contentHeight > maxHeight ? 'auto' : 'hidden';
    };

    // 1. 初始化时：使用 requestAnimationFrame 确保在 DOM 渲染后执行
    requestAnimationFrame(() => {
      dialog.find('textarea').each(function () {
        adjustHeight(this);
      });
    });

    // 2. 输入时：实时调整
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    const closeDialog = () => {
      deps.setIsSettingsOpen(false);
      dialog.remove();
    };
    dialog.find('#dlg-change-cancel').click(closeDialog);
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    dialog.find('#dlg-change-save').click(async () => {
      let rawData = deps.getCachedRawData() || deps.getTableData();
      if (rawData && rawData[tableKey]) {
        const currentRow = rawData[tableKey]?.content?.[rowIndex + 1];
        if (!currentRow) {
          closeDialog();
          return;
        }

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
          // 1. 保存到数据库（不更新快照）
          try {
            await deps.saveRowInstantly(tableKey, rowIndex, nextRow, {
              tableName,
              headers,
              currentRow,
              sourceData: rawData,
              sheet: rawData?.[tableKey],
            });
          } catch (e) {
            console.error('[DICE]ACU 保存失败:', e);
            let errorMessage = e.message || '保存出错，请检查数据格式和大小';
            // 检查是否是 "Settings could not be saved" 相关的错误
            const errorMsg = String(e);
            if (
              errorMsg.includes('Settings could not be saved') ||
              errorMsg.includes('server connection') ||
              errorMsg.includes('data loss')
            ) {
              errorMessage = '保存失败：服务器连接问题或数据过大，请检查网络连接或减少数据量';
            }
            if (window.toastr) {
              showActionableErrorToast(errorMessage, { title: '保存失败', suggestion: 'save', toastrOptions: { timeOut: 7000 } });
            } else {
              void deps.showDiceSystemConfirmDialog({
                title: '保存失败',
                message: errorMessage,
                iconClass: 'fa-triangle-exclamation',
                confirmText: '知道了',
                tone: 'danger',
                hideCancel: true,
              });
            }
            // 保存失败时不关闭对话框，让用户重试
            return;
          }

          // 2. 只更新快照中这一行（关键！）
          const snapshot = deps.loadSnapshot();
          const snapshotEntry = snapshot ? deps.findDiffSnapshotEntry(snapshot, tableKey, rawData[tableKey]) : null;
          if (deps.setDiffDataRow(snapshotEntry?.sheet, rowIndex, deps.normalizeDiffRow(nextRow))) {
            deps.saveSnapshot(snapshot);
          }

          // 3. 重新计算 diffMap 并刷新变更面板
          const latestRawData = deps.getCachedRawData() || deps.getTableData() || rawData;
          deps.setCurrentDiffMap(deps.generateDiffMap(latestRawData));

          // 4. 刷新变更面板
          const $panel = $('#acu-data-area');
          $panel.html(deps.renderChangesPanel(latestRawData));
          deps.bindChangesEvents();
        }
      }
      closeDialog();
    });
  };
  return showChangeEditModal;
}
