// @ts-nocheck
/**
 * gacha-catalog-import-confirm.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowGachaCatalogImportConfirm(deps: any) {
  const showGachaCatalogImportConfirm = (jsonString: string, analysis: GachaCatalogImportAnalysis) => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    $('.acu-import-confirm-overlay').remove();
    const conflictText =
      analysis.conflictIds.length > 0
        ? `发现 ${analysis.conflictIds.length} 个同 id 物品：${analysis.conflictIds.slice(0, 5).join('、')}${
            analysis.conflictIds.length > 5 ? '…' : ''
          }`
        : '未发现 id 冲突';
    const errorHtml =
      analysis.errors.length > 0
        ? `<div class="acu-import-warning-message">${analysis.errors
            .slice(0, 6)
            .map(error => `<div>${deps.escapeHtml(error)}</div>`)
            .join('')}${analysis.errors.length > 6 ? '<div>还有更多无效项已跳过…</div>' : ''}</div>`
        : '';
    const dialogHtml = `
      <div class="acu-import-confirm-overlay acu-gacha-catalog-dialog-overlay acu-theme-${config.theme}">
        <div class="acu-import-confirm-dialog">
          <div class="acu-import-confirm-header">
            <span class="acu-import-confirm-title"><i class="fa-solid fa-file-import"></i> 导入自定义物品</span>
            <button class="acu-import-close-btn acu-gacha-catalog-import-close" type="button" title="关闭" aria-label="关闭">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="acu-import-confirm-body">
            <div class="acu-import-warning-container">
              <i class="fa-solid fa-box-open acu-import-warning-icon acu-gacha-catalog-import-icon"></i>
              <div class="acu-import-warning-title">准备导入 ${deps.escapeHtml(String(analysis.items.length))} 个有效物品</div>
              <div class="acu-import-warning-message">${deps.escapeHtml(conflictText)}；已跳过 ${deps.escapeHtml(String(analysis.skipped))} 个无效项。</div>
              ${errorHtml}
            </div>
            <div class="acu-import-conflict-options">
              <label class="acu-import-radio">
                <input type="radio" name="gacha-catalog-conflict-mode" value="overwrite" checked />
                <span>覆盖同 id 物品</span>
              </label>
              <label class="acu-import-radio">
                <input type="radio" name="gacha-catalog-conflict-mode" value="skip" />
                <span>跳过同 id 物品</span>
              </label>
              <label class="acu-import-radio">
                <input type="radio" name="gacha-catalog-conflict-mode" value="rename" />
                <span>重命名同 id 物品</span>
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
      z-index: 31380 !important;
      display: flex;
      justify-content: center !important;
      align-items: center !important;
      padding: 16px;
      box-sizing: border-box !important;
    `;

    const closeDialog = () => $dialog.remove();
    $dialog.find('.acu-import-cancel-btn').click(closeDialog);
    $dialog.find('.acu-gacha-catalog-import-close').click(closeDialog);
    deps.setupOverlayClose($dialog, 'acu-import-confirm-overlay', closeDialog);
    $dialog.find('.acu-import-confirm-btn').click(function () {
      const mode = String(
        $dialog.find('input[name="gacha-catalog-conflict-mode"]:checked').val() || 'overwrite',
      ) as GachaCatalogImportMode;
      closeDialog();
      void deps.runInSaveQueue(async () => {
        const rawData = deps.getRuntimeGachaRawData();
        await deps.ensureGachaCatalogLoaded(rawData);
        const latestAnalysis = deps.analyzeGachaCatalogImport(jsonString, rawData);
        if (!latestAnalysis || latestAnalysis.items.length === 0) {
          if (window.toastr) {
            showActionableErrorToast(deps.getGachaCatalogImportFailureMessage(latestAnalysis), { suggestion: 'importExport' });
          }
          return;
        }
        const stats = await deps.applyGachaCatalogImport(rawData, latestAnalysis, mode);
        if (stats.warnings.length > 0) console.warn('[DICE][GACHA]自定义物品导入提示:', stats.warnings);
        deps.refreshGachaVisualization();
        deps.refreshGachaShardShop();
        if ($('.acu-gacha-settings-overlay').length) void deps.showGachaSettingsDialog();
        if (window.toastr) {
          const title = stats.warnings.length > 0 ? '骰子商店导入完成，有部分跳过' : '骰子商店导入完成';
          window.toastr.success(deps.formatGachaCatalogImportStatsText(stats), title);
        }
      }).catch(error => {
        console.error('[DICE][GACHA]导入自定义物品失败:', error);
        if (window.toastr) {
          showActionableErrorToast(`导入失败: ${deps.getJsonLikeErrorMessage(error)}`, { suggestion: 'importExport' });
        }
      });
    });
  };
  return showGachaCatalogImportConfirm;
}
