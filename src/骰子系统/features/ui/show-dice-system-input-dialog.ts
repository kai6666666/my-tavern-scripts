// @ts-nocheck
/**
 * show-dice-system-input-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowDiceSystemInputDialog(deps: any) {
  const showDiceSystemInputDialog = (options: {
    title: string;
    message: string;
    detail?: string;
    iconClass: string;
    initialValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    inputMode?: string;
    multiline?: boolean;
    readonly?: boolean;
    hideCancel?: boolean;
  }): Promise<string | null> => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const fieldId = `acu-system-input-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const detailHtml = options.detail
      ? `<div class="acu-system-input-detail">${options.detail
          .split('\n')
          .map(line => `<div>${deps.escapeHtml(line)}</div>`)
          .join('')}</div>`
      : '';
    const fieldAttrs = [
      `id="${fieldId}"`,
      'class="acu-system-input-control"',
      `aria-label="${deps.escapeHtml(options.message)}"`,
      `placeholder="${deps.escapeHtml(options.placeholder || '')}"`,
      options.readonly ? 'readonly' : '',
      options.inputMode ? `inputmode="${deps.escapeHtml(options.inputMode)}"` : '',
    ]
      .filter(Boolean)
      .join(' ');
    const initialValue = deps.escapeHtml(options.initialValue || '');
    const fieldHtml = options.multiline
      ? `<textarea ${fieldAttrs}>${initialValue}</textarea>`
      : `<input type="text" ${fieldAttrs} value="${initialValue}">`;
    const cancelButtonHtml = options.hideCancel
      ? ''
      : `<button class="acu-import-cancel-btn acu-system-input-cancel" type="button">${deps.escapeHtml(options.cancelText || '取消')}</button>`;

    return new Promise(resolve => {
      $('.acu-system-input-overlay').remove();
      const overlay = $(`
        <div class="acu-import-confirm-overlay acu-system-input-overlay acu-theme-${config.theme}" tabindex="-1">
          <div class="acu-import-confirm-dialog acu-system-input-dialog" role="dialog" aria-modal="true" aria-labelledby="${fieldId}-title">
            <div class="acu-import-confirm-header">
              <span class="acu-import-confirm-title" id="${fieldId}-title">
                <i class="fa-solid ${deps.escapeHtml(options.iconClass)}"></i>
                ${deps.escapeHtml(options.title)}
              </span>
              <button class="acu-import-close-btn acu-system-input-cancel" type="button" title="关闭" aria-label="关闭">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="acu-import-confirm-body">
              <div class="acu-system-input-content">
                <label class="acu-system-input-label" for="${fieldId}">${deps.escapeHtml(options.message)}</label>
                ${detailHtml}
                ${fieldHtml}
              </div>
            </div>
            <div class="acu-import-confirm-footer">
              ${cancelButtonHtml}
              <button class="acu-import-confirm-btn acu-system-input-ok" type="button">${deps.escapeHtml(options.confirmText || '确定')}</button>
            </div>
          </div>
        </div>
      `);

      let settled = false;
      const finish = (value: string | null): void => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(value);
      };

      $('body').append(overlay);

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

      const inputEl = overlay.find('.acu-system-input-control')[0] as
        | HTMLInputElement
        | HTMLTextAreaElement
        | undefined;
      const confirm = (): void => finish(inputEl?.value ?? '');

      deps.setupOverlayClose(overlay, 'acu-system-input-overlay', () => finish(null));
      overlay.on('click', '.acu-system-input-cancel', () => finish(null));
      overlay.on('click', '.acu-system-input-ok', confirm);
      overlay.on('keydown', '.acu-system-input-control', event => {
        if (!options.multiline && event.key === 'Enter') {
          event.preventDefault();
          confirm();
        }
      });
      overlay.on('keydown', event => {
        if (event.key === 'Escape') finish(null);
      });
      window.setTimeout(() => {
        inputEl?.focus();
        if (inputEl instanceof HTMLInputElement && !options.readonly) inputEl.select();
      }, 0);
    });
  };
  return showDiceSystemInputDialog;
}
