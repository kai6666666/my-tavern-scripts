// @ts-nocheck
/**
 * import-confirm-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowImportConfirmDialog(deps: any) {
  const showImportConfirmDialog = (jsonData, analysis, onComplete) => {
    const { $ } = deps.getCore();
    $('.acu-import-confirm-overlay').remove();

    const config = deps.getConfig();

    const hasConflicts = analysis.conflicts.length > 0;
    const conflictListHtml =
      analysis.conflicts.length > 0
        ? `<div style="max-height:80px;overflow-y:auto;background:rgba(0,0,0,0.1);border-radius:4px;padding:6px 8px;margin-top:6px;font-size:11px;color:var(--acu-text-sub);">${analysis.conflicts.map(n => deps.escapeHtml(n)).join(', ')}</div>`
        : '';

    const dialogHtml = `
            <div class="acu-import-confirm-overlay acu-theme-${config.theme}">
                <div class="acu-import-confirm-dialog">
                    <div class="acu-import-confirm-header">
                        <span class="acu-import-confirm-title"><i class="fa-solid fa-file-import"></i> 导入头像配置</span>
                        <button class="acu-import-close-btn" title="关闭"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-import-confirm-body">
                        <div class="acu-import-stats">
                            <div class="acu-import-stat">
                                <span class="acu-stat-num">${analysis.total}</span>
                                <span class="acu-stat-label">总计</span>
                            </div>
                            <div class="acu-import-stat acu-stat-new">
                                <span class="acu-stat-num">${analysis.newItems.length}</span>
                                <span class="acu-stat-label">新增</span>
                            </div>
                            <div class="acu-import-stat acu-stat-conflict">
                                <span class="acu-stat-num">${analysis.conflicts.length}</span>
                                <span class="acu-stat-label">冲突</span>
                            </div>
                        </div>

                        ${
                          hasConflicts
                            ? `
                            <div class="acu-import-conflict-section">
                                <div class="acu-import-warning">
                                    <i class="fa-solid fa-exclamation-triangle"></i> 以下角色已存在：
                                </div>
                                ${conflictListHtml}
                                <div class="acu-import-conflict-options">
                                    <label class="acu-import-radio">
                                        <input type="radio" name="conflict-mode" value="overwrite" checked />
                                        <span>用导入的覆盖本地</span>
                                    </label>
                                    <label class="acu-import-radio">
                                        <input type="radio" name="conflict-mode" value="skip" />
                                        <span>保留本地的不变</span>
                                    </label>
                                </div>
                            </div>
                        `
                            : `
                            <div class="acu-import-success">
                                <i class="fa-solid fa-check-circle"></i> 无冲突，可直接导入
                            </div>
                        `
                        }
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

    // 强制样式
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

    $dialog.find('.acu-import-cancel-btn').click(closeDialog);
    $dialog.find('.acu-import-close-btn').click(closeDialog);
    deps.setupOverlayClose($dialog, 'acu-import-confirm-overlay', closeDialog);

    $dialog.find('.acu-import-confirm-btn').click(function () {
      const overwrite = $dialog.find('input[name="conflict-mode"]:checked').val() !== 'skip';
      try {
        const stats = deps.AvatarManager.importData(jsonData, overwrite);
        closeDialog();
        onComplete && onComplete();
      } catch (err) {
        console.error('[DICE]ACU 导入失败:', err);
        if (window.toastr)
          showActionableErrorToast('头像配置导入失败：' + (err instanceof Error ? err.message : String(err)), {
            suggestion: '请确认导入内容仍符合头像配置格式；如果确认无误，请打开控制台复制 [DICE]ACU 导入失败日志联系开发者。',
          });
      }
    });
  };
  return showImportConfirmDialog;
}
