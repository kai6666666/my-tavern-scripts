// @ts-nocheck
/**
 * show-card-edit-modal.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowCardEditModal(deps: any) {
  const showCardEditModal = (
    row,
    headers,
    tableName,
    rowIndex,
    tableKey,
    options?: { overlayClass?: string; onSaved?: () => void },
  ) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    let rawData = deps.getCachedRawData() || deps.getTableData() || deps.loadSnapshot();

    let displayRow = row;
    // 确保获取的是最新数据
    if (rawData && rawData[tableKey] && rawData[tableKey]?.content?.[rowIndex + 1]) {
      displayRow = rawData[tableKey]?.content?.[rowIndex + 1];
    }

    const inputsHtml = displayRow
      .map((cell, idx) => {
        if (idx === 0) return ''; // 跳过索引列
        const headerName = headers[idx] || `列 ${idx}`;
        const val = cell || '';
        // 自动高度的 textarea
        return `
                <div class="acu-card-edit-field">
                    <label class="acu-card-edit-label">${deps.escapeHtml(headerName)}</label>
                    <textarea class="acu-card-edit-input acu-card-edit-textarea" data-col="${idx}" spellcheck="false" rows="1">${deps.escapeHtml(val)}</textarea>
                </div>`;
      })
      .join('');

    const dialog = $(`
            <div class="acu-edit-overlay ${options?.overlayClass || ''}">
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">整体编辑 (#${rowIndex + 1} - ${deps.escapeHtml(tableName)})</div>
                    <div class="acu-settings-content acu-settings-content-scroll">
                        ${inputsHtml}
                    </div>
                     <div class="acu-dialog-btns">
                        <button class="acu-dialog-btn" id="dlg-card-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button class="acu-dialog-btn acu-btn-confirm" id="dlg-card-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    // --- [修复] 自动高度调节逻辑 ---
    const adjustHeight = el => {
      // 关键修复：使用 auto 而不是 0px，防止布局塌陷并正确获取 shrinking 时的 scrollHeight
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
    // -----------------------------

    const closeDialog = () => dialog.remove();
    dialog.find('#dlg-card-cancel').click(closeDialog);

    // 保存逻辑：使用即时保存 + 单行快照更新（保留其他行的AI变更高亮）
    dialog.find('#dlg-card-save').click(async () => {
      let rawData = deps.getCachedRawData() || deps.getTableData() || deps.loadSnapshot();
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
          try {
            // 使用 saveRowInstantly 执行即时保存 + 单行快照更新
            await deps.saveRowInstantly(tableKey, rowIndex, nextRow, {
              tableName,
              headers,
              currentRow,
              sourceData: rawData,
              sheet: rawData?.[tableKey],
            });
            deps.renderInterface();
            options?.onSaved?.();
          } catch (e) {
            console.error('[DICE]ACU 保存失败:', e);
            // 保存失败时不关闭对话框，让用户重试
            return;
          }
        }
      }
      closeDialog();
    });
    // 点击遮罩层关闭
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);
    // 点击关闭按钮（双重保险）
    dialog.on('click', function (e) {
      if ($(e.target).closest('#dlg-close-x, #dlg-close, .acu-close-btn').length) {
        closeDialog();
      }
    });
  };
  return showCardEditModal;
}
