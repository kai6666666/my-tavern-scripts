// @ts-nocheck
/**
 * show-edit-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowEditDialog(deps: any) {
  const showEditDialog = (content, onSave, options?: { overlayClass?: string; title?: string }) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();

    const dialog = $(`
            <div class="acu-edit-overlay ${options?.overlayClass || ''}">
                <!-- 2. [修改] 在这里加上 acu-theme-${config.theme} -->
                <div class="acu-edit-dialog acu-theme-${config.theme}">
                    <div class="acu-edit-title">${deps.escapeHtml(options?.title || '编辑单元格内容')}</div>
                    <textarea class="acu-edit-textarea" spellcheck="false">${deps.escapeHtml(content)}</textarea>
                    <div class="acu-dialog-btns">
                        <button type="button" class="acu-dialog-btn" id="dlg-cancel"><i class="fa-solid fa-times"></i> 取消</button>
                        <button type="button" class="acu-dialog-btn acu-btn-confirm" id="dlg-save"><i class="fa-solid fa-check"></i> 保存</button>
                    </div>
                </div>
            </div>
        `);
    $('body').append(dialog);

    const adjustHeight = el => {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 2 + 'px';
    };
    dialog.find('textarea').on('input', function () {
      adjustHeight(this);
    });

    dialog.find('#dlg-cancel').click(() => dialog.remove());
    // 点击遮罩层也可以关闭
    deps.setupOverlayClose(dialog, 'acu-edit-overlay', () => dialog.remove());

    dialog.find('#dlg-save').click(() => {
      onSave(dialog.find('textarea').val());
      dialog.remove();
    });
  };
  return showEditDialog;
}
