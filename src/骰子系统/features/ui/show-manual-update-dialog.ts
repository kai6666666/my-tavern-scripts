// @ts-nocheck
/**
 * show-manual-update-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowManualUpdateDialog(deps: any) {
  const showManualUpdateDialog = (options?: {
    title?: string;
    iconClass?: string;
    description?: string;
    safeTitle?: string;
    safeDescription?: string;
    confirmText?: string;
    loadingText?: string;
    onConfirm?: () => Promise<void>;
    isDanger?: boolean;
    safeIconClass?: string;
  }) => {
    const { $ } = deps.getCore();
    $('.acu-manual-update-overlay').remove();

    const config = deps.getConfig();
    const title = options?.title || '手动更新';
    const iconClass = options?.iconClass || 'fa-rotate';
    const description = options?.description || '将清理脚本缓存并刷新页面，以获取最新版本。';
    const safeTitle = options?.safeTitle || '数据安全';
    const safeDescription =
      options?.safeDescription || '您的自定义规则、预设、正则转换、黑名单等数据存储在本地游览器中，不会受到影响。';
    const confirmText = options?.confirmText || '立即更新';
    const loadingText = options?.loadingText || '更新中...';
    const onConfirm = options?.onConfirm;
    const isDanger = options?.isDanger || false;
    const safeIconClass = options?.safeIconClass || (isDanger ? 'fa-triangle-exclamation' : 'fa-shield-check');

    // 颜色统一跟随主题变量，避免硬编码色与主题不协调
    const headerBg = 'var(--acu-table-head)';
    const headerTextColor = 'var(--acu-text-main)';
    const confirmBtnBg = 'var(--acu-accent)';
    const safeBoxBorder = 'var(--acu-border)';
    const safeBoxIconColor = 'var(--acu-accent)';

    const dialogHtml = `
    <div class="acu-manual-update-overlay acu-theme-${config.theme}">
      <div class="acu-manual-update-dialog" style="background:var(--acu-bg-panel);border-color:var(--acu-border);max-width:420px;box-shadow:0 8px 24px rgba(0,0,0,0.3);">
        <div class="acu-manual-update-header" style="background:${headerBg};color:${headerTextColor};border-bottom:1px solid var(--acu-border);padding:12px 16px;font-weight:bold;font-size:1.1em;display:flex;align-items:center;gap:8px;">
          <i class="fa-solid ${deps.escapeHtml(iconClass)}" style="font-size:1.1em;"></i> ${deps.escapeHtml(title)}
        </div>
        <div class="acu-manual-update-body" style="color:var(--acu-text-main);padding:20px 16px;">
          <p style="color:var(--acu-text-main);margin-bottom:16px;line-height:1.5;">${deps.escapeHtml(description)}</p>
          <div class="acu-manual-update-safe-box" style="background:var(--acu-btn-bg);border:1px solid ${safeBoxBorder};border-radius:6px;padding:12px;display:flex;gap:12px;align-items:flex-start;">
            <i class="fa-solid ${deps.escapeHtml(safeIconClass)}" style="color:${safeBoxIconColor};font-size:1.2em;margin-top:2px;"></i>
            <div class="safe-text" style="display:flex;flex-direction:column;gap:4px;">
              <strong style="color:var(--acu-text-main);font-size:0.95em;">${deps.escapeHtml(safeTitle)}</strong>
              <span style="color:var(--acu-text-sub);font-size:0.85em;line-height:1.4;">${deps.escapeHtml(safeDescription)}</span>
            </div>
          </div>
        </div>
        <div class="acu-manual-update-footer" style="background:var(--acu-table-head);border-top:1px solid var(--acu-border);padding:12px 16px;display:flex;justify-content:flex-end;gap:10px;">
          <button class="acu-manual-update-cancel-btn" style="background:transparent;color:var(--acu-text-sub);border:1px solid var(--acu-border);padding:6px 16px;border-radius:4px;cursor:pointer;transition:all 0.2s;">取消</button>
          <button class="acu-manual-update-confirm-btn" style="background:${confirmBtnBg};color:var(--acu-btn-active-text, #fff);border:none;padding:6px 20px;border-radius:4px;cursor:pointer;font-weight:bold;box-shadow:0 2px 4px rgba(0,0,0,0.2);transition:all 0.2s;">${deps.escapeHtml(confirmText)}</button>
        </div>
      </div>
    </div>
  `;

    const $dialog = $(dialogHtml);
    $('body').append($dialog);

    const overlayEl = $dialog[0];

    // 事件绑定
    $dialog.find('.acu-manual-update-cancel-btn').on('click', () => {
      $dialog.remove();
    });

    $dialog.find('.acu-manual-update-confirm-btn').on('click', async () => {
      const $btn = $dialog.find('.acu-manual-update-confirm-btn');
      $btn.prop('disabled', true).html(`<i class="fa-solid fa-spinner fa-spin"></i> ${deps.escapeHtml(loadingText)}`);

      try {
        if (onConfirm) {
          await onConfirm();
          $dialog.remove();
          return;
        }

        await deps.clearDiceSystemCache();
        // 刷新整个酒馆页面并绕过缓存（相当于 Ctrl+Shift+R）
        if (window.parent !== window) {
          window.parent.location.reload();
        } else {
          window.location.reload();
        }
      } catch (err) {
        console.error('[DICE] 手动弹窗操作失败:', err);
        if (window.toastr) showActionableErrorToast('手动更新操作失败，请查看控制台日志。', { developerHint: true });
        $btn.prop('disabled', false).html(deps.escapeHtml(confirmText));
      }
    });

    // 点击遮罩关闭
    $dialog.on('click', e => {
      if (e.target === overlayEl) {
        $dialog.remove();
      }
    });
  };
  return showManualUpdateDialog;
}
