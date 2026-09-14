// @ts-nocheck
/**
 * gacha-pool-name-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowGachaPoolNameDialog(deps: any) {
  const showGachaPoolNameDialog = (options: {
    title: string;
    label: string;
    initialValue?: string;
    confirmText?: string;
  }): Promise<string | null> => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    return new Promise(resolve => {
      $('.acu-gacha-name-dialog-overlay').remove();
      const overlay = $(`
        <div class="acu-edit-overlay acu-gacha-name-dialog-overlay acu-theme-${config.theme}">
          <form class="acu-edit-dialog acu-gacha-name-dialog">
            <div class="acu-gacha-settings-header">
              <div class="acu-gacha-settings-title"><i class="fa-solid fa-tags"></i> ${deps.escapeHtml(options.title)}</div>
              <button class="acu-close-btn acu-gacha-name-cancel" type="button" title="关闭" aria-label="关闭卡池命名弹窗"><i class="fa-solid fa-times"></i></button>
            </div>
            <label class="acu-gacha-name-field">
              <span>${deps.escapeHtml(options.label)}</span>
              <input class="acu-gacha-name-input" type="text" value="${deps.escapeHtml(options.initialValue || '')}" maxlength="40" autocomplete="off" />
            </label>
            <div class="acu-gacha-settings-footer acu-gacha-name-dialog-footer">
              <button class="acu-dialog-btn acu-gacha-name-cancel" type="button">取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" type="submit">${deps.escapeHtml(options.confirmText || '确定')}</button>
            </div>
          </form>
        </div>
      `);
      let settled = false;
      const finish = (value: string | null) => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(value);
      };
      $('body').append(overlay);
      deps.setupOverlayClose(overlay, 'acu-gacha-name-dialog-overlay', () => finish(null));
      overlay.on('click', '.acu-gacha-name-cancel', () => finish(null));
      overlay.on('submit', '.acu-gacha-name-dialog', event => {
        event.preventDefault();
        finish(String(overlay.find('.acu-gacha-name-input').val() || '').trim());
      });
      window.setTimeout(() => {
        const input = overlay.find('.acu-gacha-name-input')[0] as HTMLInputElement | undefined;
        input?.focus();
        input?.select();
      }, 0);
    });
  };
  return showGachaPoolNameDialog;
}
