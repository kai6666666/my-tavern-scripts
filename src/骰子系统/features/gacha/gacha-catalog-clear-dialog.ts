// @ts-nocheck
/**
 * gacha-catalog-clear-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowGachaCatalogClearDialog(deps: any) {
  const showGachaCatalogClearDialog = async () => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const rawData = deps.getRuntimeGachaRawData();
    await deps.ensureGachaCatalogLoaded(rawData);
    const count = deps.getCustomGachaItemDefinitions(rawData).length;
    $('.acu-import-confirm-overlay').remove();
    const dialog = $(`
      <div class="acu-import-confirm-overlay acu-gacha-catalog-dialog-overlay acu-theme-${config.theme}">
        <div class="acu-import-confirm-dialog">
          <div class="acu-import-confirm-header">
            <span class="acu-import-confirm-title"><i class="fa-solid fa-broom"></i> 清空自定义物品</span>
            <button class="acu-import-close-btn acu-gacha-catalog-clear-close" type="button" title="关闭" aria-label="关闭">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="acu-import-confirm-body">
            <div class="acu-import-warning-container">
              <i class="fa-solid fa-broom acu-import-warning-icon acu-gacha-catalog-import-icon"></i>
              <div class="acu-import-warning-title">全局目录有 ${deps.escapeHtml(String(count))} 个自定义物品</div>
              <div class="acu-import-warning-message">清空后会影响所有聊天可见的自定义物品；不会影响内置卡池，也不会删除已经写入目标表的奖励。</div>
            </div>
          </div>
          <div class="acu-import-confirm-footer acu-gacha-catalog-clear-footer">
            <button class="acu-import-cancel-btn acu-gacha-catalog-clear-close" type="button">取消</button>
            <button class="acu-import-confirm-btn acu-gacha-catalog-clear-global" type="button">清空全局目录</button>
          </div>
        </div>
      </div>
    `);
    $('body').append(dialog);
    const closeDialog = () => dialog.remove();
    deps.setupOverlayClose(dialog, 'acu-import-confirm-overlay', closeDialog);
    dialog.on('click', '.acu-gacha-catalog-clear-close', closeDialog);
    dialog.on('click', '.acu-gacha-catalog-clear-global', () => {
      closeDialog();
      void deps.clearGlobalGachaCatalog().catch(error => {
        console.error('[DICE][GACHA]清空全局自定义物品失败:', error);
        if (window.toastr) showActionableErrorToast(`清空失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
      });
    });
  };
  return showGachaCatalogClearDialog;
}
