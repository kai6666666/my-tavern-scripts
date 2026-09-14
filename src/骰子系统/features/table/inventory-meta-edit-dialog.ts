// @ts-nocheck
/**
 * inventory-meta-edit-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowInventoryMetaEditDialog(deps: any) {
  const showInventoryMetaEditDialog = rowIndex => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const context = deps.getInventoryDetailContext(rowIndex);
    if (!context) {
      if (window.toastr) window.toastr.warning('未找到物品数据');
      return;
    }

    const record = deps.getInventoryMetadataForItem(context.rawData, context.item) || {
      acquiredAt: '',
      acquiredAtLocation: '',
    };
    const dialog = $(`
      <div class="acu-edit-overlay acu-inventory-edit-overlay acu-inventory-meta-overlay">
        <div class="acu-edit-dialog acu-theme-${config.theme} acu-inventory-meta-dialog">
          <div class="acu-edit-title"><i class="fa-solid fa-pen-to-square"></i> 编辑获得信息 · ${deps.escapeHtml(context.item.name)}</div>
          <div class="acu-settings-content" style="display:flex;flex-direction:column;gap:12px;padding:4px 2px;">
            <label style="display:flex;flex-direction:column;gap:6px;">
              <span>获得地</span>
              <input type="text" class="acu-input acu-inventory-meta-input" data-field="acquiredAtLocation" value="${deps.escapeHtml(record.acquiredAtLocation || '')}" placeholder="例如：校门口甜品店">
            </label>
            <label style="display:flex;flex-direction:column;gap:6px;">
              <span>获取时间</span>
              <input type="text" class="acu-input acu-inventory-meta-input" data-field="acquiredAt" value="${deps.escapeHtml(record.acquiredAt || '')}" placeholder="例如：2020-05-15 20:05">
            </label>
          </div>
          <div class="acu-dialog-btns">
            <button class="acu-dialog-btn acu-inventory-meta-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            <button class="acu-dialog-btn acu-btn-confirm acu-inventory-meta-save"><i class="fa-solid fa-check"></i> 保存</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());
    dialog.on('click', '.acu-inventory-meta-cancel', () => dialog.remove());
    dialog.on('click', '.acu-inventory-meta-save', async () => {
      const nextRecord: InventoryMetadataRecord = {
        ...record,
        acquiredAtLocation: String(
          dialog.find('.acu-inventory-meta-input[data-field="acquiredAtLocation"]').val() || '',
        ).trim(),
        acquiredAt: String(dialog.find('.acu-inventory-meta-input[data-field="acquiredAt"]').val() || '').trim(),
      };

      try {
        await deps.saveInventoryMetadataRecord(rowIndex, nextRecord);
        dialog.remove();
      } catch (e) {
        console.error('[DICE] 保存物品获得信息失败:', e);
        if (window.toastr) {
          showActionableErrorToast('保存获得信息失败', {
            title: '保存获得信息失败',
            developerHint: true,
          });
        }
      }
    });
  };
  return showInventoryMetaEditDialog;
}
