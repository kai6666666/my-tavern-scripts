// @ts-nocheck
/**
 * inventory-field-edit-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowInventoryFieldEditDialog(deps: any) {
  const showInventoryFieldEditDialog = (rowIndex: number, fieldKey: InventoryEditableField) => {
    const context = deps.getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }

    const fieldLabel = deps.getInventoryFieldLabel(fieldKey);
    if (fieldKey === 'type' || fieldKey === 'quality') {
      const { $ } = deps.getCore();
      const config = deps.getConfig();
      const currentValue = fieldKey === 'type' ? context.item.type : context.item.quality;
      const options = deps.getInventoryEnumOptions(context.item.tableName, fieldKey);
      const optionButtonsHtml = options
        .map(
          option => `
            <button
              type="button"
              class="acu-dialog-btn acu-inventory-enum-option ${option === currentValue ? 'is-active' : ''}"
              data-value="${deps.escapeHtml(option)}"
            >
              ${deps.escapeHtml(option)}
            </button>
          `,
        )
        .join('');
      const dialog = $(`
        <div class="acu-edit-overlay acu-inventory-edit-overlay acu-inventory-enum-overlay">
          <div class="acu-edit-dialog acu-theme-${config.theme} acu-inventory-enum-dialog">
            <div class="acu-edit-title"><i class="fa-solid fa-list"></i> 选择${deps.escapeHtml(fieldLabel)}</div>
            <div class="acu-inventory-enum-options">${optionButtonsHtml}</div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn acu-inventory-enum-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            </div>
          </div>
        </div>
      `);
      $('body').append(dialog);
      deps.setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());
      dialog.on('click', '.acu-inventory-enum-cancel', () => dialog.remove());
      dialog.on('click', '.acu-inventory-enum-option', async function () {
        const nextValue = String($(this).data('value') || '').trim();
        if (!nextValue) return;
        try {
          await deps.saveInventoryFieldValue(rowIndex, fieldKey, nextValue);
          dialog.remove();
        } catch (e) {
          console.error(`[DICE] 保存物品${fieldLabel}失败:`, e);
          if (window.toastr) {
            showActionableErrorToast(`保存${fieldLabel}失败`, {
              title: `保存${fieldLabel}失败`,
              developerHint: true,
            });
          }
        }
      });
      return;
    }

    if (fieldKey === 'acquiredAtLocation' || fieldKey === 'acquiredAt') {
      const currentRecord = deps.getInventoryMetadataForItem(context.rawData, context.item) || {
        acquiredAt: '',
        acquiredAtLocation: '',
      };
      const currentValue =
        fieldKey === 'acquiredAtLocation' ? currentRecord.acquiredAtLocation : currentRecord.acquiredAt;
      deps.showEditDialog(
        currentValue,
        async newVal => {
          try {
            await deps.saveInventoryFieldValue(rowIndex, fieldKey, String(newVal || ''));
          } catch (e) {
            console.error(`[DICE] 保存物品${fieldLabel}失败:`, e);
            if (window.toastr) {
              showActionableErrorToast(`保存${fieldLabel}失败`, {
                title: `保存${fieldLabel}失败`,
                developerHint: true,
              });
            }
          }
        },
        {
          title: `编辑${fieldLabel}`,
          overlayClass: 'acu-inventory-edit-overlay',
        },
      );
      return;
    }

    const colIdx = deps.getInventoryFieldColumnIndex(context.colMap, fieldKey);
    if (colIdx < 0) {
      deps.warnTableTemplateIssue(`未找到“${fieldLabel}”列`);
      return;
    }

    const currentValue = String(context.row[colIdx] ?? '');
    deps.showEditDialog(
      currentValue,
      async newVal => {
        try {
          await deps.saveInventoryFieldValue(rowIndex, fieldKey, String(newVal || ''));
        } catch (e) {
          console.error(`[DICE] 保存物品${fieldLabel}失败:`, e);
          if (window.toastr) {
            showActionableErrorToast(`保存${fieldLabel}失败`, {
              title: `保存${fieldLabel}失败`,
              developerHint: true,
            });
          }
        }
      },
      {
        title: `编辑${fieldLabel}`,
        overlayClass: 'acu-inventory-edit-overlay',
      },
    );
  };
  return showInventoryFieldEditDialog;
}
