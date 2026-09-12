// @ts-nocheck
/**
 * gacha-confirm-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaConfirmDialog(deps: any) {
  const showGachaConfirmDialog = (options: {
    title: string;
    message: string;
    detail?: string;
    iconClass?: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
  }): Promise<boolean> => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    return new Promise(resolve => {
      $('.acu-gacha-confirm-overlay').remove();
      const overlay = $(`
        <div class="acu-import-confirm-overlay acu-gacha-confirm-overlay acu-theme-${config.theme}">
          <div class="acu-import-confirm-dialog acu-gacha-confirm-dialog">
            <div class="acu-import-confirm-header">
              <span class="acu-import-confirm-title">
                <i class="fa-solid ${deps.escapeHtml(options.iconClass || 'fa-triangle-exclamation')}"></i>
                ${deps.escapeHtml(options.title)}
              </span>
              <button class="acu-import-close-btn acu-gacha-confirm-cancel" type="button" title="关闭" aria-label="关闭">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="acu-import-confirm-body">
              <div class="acu-import-warning-container">
                <i class="fa-solid ${deps.escapeHtml(options.iconClass || 'fa-triangle-exclamation')} acu-import-warning-icon ${options.danger ? 'danger' : ''}"></i>
                <div class="acu-import-warning-title">${deps.escapeHtml(options.message)}</div>
                ${options.detail ? `<div class="acu-import-warning-message">${deps.escapeHtml(options.detail)}</div>` : ''}
              </div>
            </div>
            <div class="acu-import-confirm-footer">
              <button class="acu-import-cancel-btn acu-gacha-confirm-cancel" type="button">${deps.escapeHtml(options.cancelText || '取消')}</button>
              <button class="acu-import-confirm-btn acu-gacha-confirm-ok ${options.danger ? 'danger' : ''}" type="button">${deps.escapeHtml(options.confirmText || '确认')}</button>
            </div>
          </div>
        </div>
      `);
      let settled = false;
      const finish = (confirmed: boolean) => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(confirmed);
      };
      $('body').append(overlay);
      deps.setupOverlayClose(overlay, 'acu-gacha-confirm-overlay', () => finish(false));
      overlay.on('click', '.acu-gacha-confirm-cancel', () => finish(false));
      overlay.on('click', '.acu-gacha-confirm-ok', () => finish(true));
    });
  };
  return showGachaConfirmDialog;
}
