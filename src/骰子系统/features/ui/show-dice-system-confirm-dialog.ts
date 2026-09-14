// @ts-nocheck
/**
 * show-dice-system-confirm-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowDiceSystemConfirmDialog(deps: any) {
  const showDiceSystemConfirmDialog = (options: {
    title: string;
    message: string;
    detail?: string;
    detailHtml?: string;
    iconClass: string;
    confirmText: string;
    cancelText?: string;
    tone?: DiceSystemConfirmTone;
    hideCancel?: boolean;
  }): Promise<boolean> => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const tone: DiceSystemConfirmTone = options.tone || 'warning';
    const detailClass = options.detailHtml ? ' structured' : '';
    const dialogClass = options.detailHtml ? ' structured-detail' : '';
    const detailHtml = options.detailHtml
      ? `<div class="acu-system-confirm-detail acu-custom-icon-confirm-detail${detailClass}">${options.detailHtml}</div>`
      : options.detail
      ? `<div class="acu-system-confirm-detail acu-custom-icon-confirm-detail">${options.detail
          .split('\n')
          .map(line => `<div>${deps.escapeHtml(line)}</div>`)
          .join('')}</div>`
      : '';
    const cancelButtonHtml = options.hideCancel
      ? ''
      : `<button class="acu-import-cancel-btn acu-system-confirm-cancel acu-custom-icon-confirm-cancel" type="button">${deps.escapeHtml(options.cancelText || '取消')}</button>`;

    return new Promise(resolve => {
      $('.acu-system-confirm-overlay, .acu-custom-icon-confirm-overlay').remove();
      const overlay = $(`
        <div class="acu-import-confirm-overlay acu-system-confirm-overlay acu-custom-icon-confirm-overlay acu-theme-${config.theme}" tabindex="-1">
          <div class="acu-import-confirm-dialog acu-system-confirm-dialog acu-custom-icon-confirm-dialog${dialogClass}">
            <div class="acu-import-confirm-header">
              <span class="acu-import-confirm-title">
                <i class="fa-solid ${deps.escapeHtml(options.iconClass)}"></i>
                ${deps.escapeHtml(options.title)}
              </span>
              <button class="acu-import-close-btn acu-system-confirm-cancel acu-custom-icon-confirm-cancel" type="button" title="关闭" aria-label="关闭">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="acu-import-confirm-body">
              <div class="acu-import-warning-container acu-system-confirm-content acu-custom-icon-confirm-content">
                <i class="fa-solid ${deps.escapeHtml(options.iconClass)} acu-import-warning-icon ${tone}"></i>
                <div class="acu-import-warning-title">${deps.escapeHtml(options.message)}</div>
                ${detailHtml}
              </div>
            </div>
            <div class="acu-import-confirm-footer">
              ${cancelButtonHtml}
              <button class="acu-import-confirm-btn acu-system-confirm-ok acu-custom-icon-confirm-ok ${tone}" type="button">${deps.escapeHtml(options.confirmText)}</button>
            </div>
          </div>
        </div>
      `);

      let settled = false;
      const finish = (confirmed: boolean): void => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(confirmed);
      };

      $('body').append(overlay);

      // 移动端酒馆会给若干容器叠加定位/缩放，这里用高优先级内联规则兜住居中层级。
      const overlayEl = overlay[0] as HTMLElement | undefined;
      if (overlayEl) {
        overlayEl.style.setProperty('position', 'fixed', 'important');
        overlayEl.style.setProperty('top', '0', 'important');
        overlayEl.style.setProperty('left', '0', 'important');
        overlayEl.style.setProperty('right', '0', 'important');
        overlayEl.style.setProperty('bottom', '0', 'important');
        overlayEl.style.setProperty('width', '100vw', 'important');
        overlayEl.style.setProperty('height', '100dvh', 'important');
        overlayEl.style.setProperty('min-height', '100vh', 'important');
        overlayEl.style.setProperty('display', 'flex', 'important');
        overlayEl.style.setProperty('align-items', 'center', 'important');
        overlayEl.style.setProperty('justify-content', 'center', 'important');
        overlayEl.style.setProperty('z-index', '32100', 'important');
        overlayEl.style.setProperty('padding', '16px', 'important');
        overlayEl.style.setProperty('box-sizing', 'border-box', 'important');
        overlayEl.style.setProperty('margin', '0', 'important');
        overlayEl.style.setProperty('transform', 'none', 'important');
      }

      const dialogEl = overlay.find('.acu-system-confirm-dialog')[0] as HTMLElement | undefined;
      if (dialogEl) {
        dialogEl.style.setProperty('margin', 'auto', 'important');
        dialogEl.style.setProperty('max-height', 'calc(100dvh - 32px)', 'important');
        dialogEl.style.setProperty('transform', 'none', 'important');
      }

      deps.setupOverlayClose(overlay, 'acu-system-confirm-overlay', () => finish(false));
      overlay.on('click', '.acu-system-confirm-cancel', () => finish(false));
      overlay.on('click', '.acu-system-confirm-ok', () => finish(true));
      window.setTimeout(() => {
        const confirmButton = overlay.find('.acu-system-confirm-ok')[0] as HTMLButtonElement | undefined;
        confirmButton?.focus();
      }, 0);
    });
  };
  return showDiceSystemConfirmDialog;
}
