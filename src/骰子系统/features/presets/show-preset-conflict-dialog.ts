// @ts-nocheck
/**
 * show-preset-conflict-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowPresetConflictDialog(deps: any) {
  const showPresetConflictDialog = (options: {
    presetName: string;
    presetType: string;
    onOverwrite: () => void;
    onRename: (newName: string) => void;
    onCancel: () => void;
    existingNames: string[];
  }) => {
    const { $ } = deps.getCore();
    $('.acu-import-confirm-overlay').remove();

    const config = deps.getConfig();
    const suggestedName = deps.generateUniqueName(options.presetName, options.existingNames);

    const dialogHtml = `
      <div class="acu-import-confirm-overlay acu-theme-${config.theme}">
        <div class="acu-import-confirm-dialog">
          <div class="acu-import-confirm-header">
            <i class="fa-solid fa-file-import"></i> 导入${options.presetType}预设
          </div>
          <div class="acu-import-confirm-body">
            <div class="acu-import-warning-container">
              <i class="fa-solid fa-exclamation-triangle acu-import-warning-icon"></i>
              <div class="acu-import-warning-title">发现同名预设</div>
              <div class="acu-import-warning-message">预设「${deps.escapeHtml(options.presetName)}」已存在，请选择处理方式：</div>
            </div>
            <div class="acu-import-conflict-options">
              <label class="acu-import-radio">
                <input type="radio" name="preset-conflict-mode" value="overwrite" checked />
                <span>覆盖现有预设</span>
              </label>
              <label class="acu-import-radio">
                <input type="radio" name="preset-conflict-mode" value="rename" />
                <span>新建副本（命名为「${deps.escapeHtml(suggestedName)}」）</span>
              </label>
            </div>
          </div>
          <div class="acu-import-confirm-footer">
            <button class="acu-import-cancel-btn">取消</button>
            <button class="acu-import-confirm-btn">确认导入</button>
          </div>
        </div>
      </div>
    `;

    const $dialog = $(dialogHtml);
    $('body').append($dialog);

    // 强制样式（与头像导入弹窗一致）
    const overlayEl = $dialog[0];
    overlayEl.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0,0,0,0.6) !important;
      z-index: 31300 !important;
      display: flex;
      justify-content: center !important;
      align-items: center !important;
      padding: 16px;
      box-sizing: border-box !important;
    `;

    const closeDialog = () => $dialog.remove();

    $dialog.find('.acu-import-cancel-btn').click(() => {
      closeDialog();
      options.onCancel();
    });

    deps.setupOverlayClose($dialog, 'acu-import-confirm-overlay', () => {
      closeDialog();
      options.onCancel();
    });

    $dialog.find('.acu-import-confirm-btn').click(function () {
      const mode = $dialog.find('input[name="preset-conflict-mode"]:checked').val();
      closeDialog();
      if (mode === 'overwrite') {
        options.onOverwrite();
      } else {
        options.onRename(suggestedName);
      }
    });
  };
  return showPresetConflictDialog;
}
