// @ts-nocheck
/**
 * dashboard-preset-editor-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDashboardPresetEditor(deps: any) {
  const showDashboardPresetEditor = (presetId?: string) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showDashboardPresetEditor', () => showDashboardPresetEditor(presetId));

    const config = deps.getConfig();
    const isEdit = Boolean(presetId);
    const existingPreset = presetId ? deps.DashboardPresetManager.getPresetById(presetId) : null;

    if (existingPreset?.builtin) {
      if (window.toastr) window.toastr.warning('默认仪表盘预设不可编辑，请导出或复制后修改');
      deps.popModal();
      return;
    }

    const presetName = existingPreset?.name || '新仪表盘预设';
    const presetDescription = existingPreset?.description || '';
    const editorJson = existingPreset
      ? JSON.stringify(deps.cloneDashboardPresetModules(existingPreset.modules), null, 2)
      : deps.createDashboardPresetEditorTemplate();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-dashboard-preset-editor-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-chart-line"></i> ${isEdit ? '编辑' : '新建'}仪表盘预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('dashboardPresetEditor', '查看新建仪表盘预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="dashboard-preset-name">预设名称</label>
                <input id="dashboard-preset-name" type="text" value="${deps.escapeHtml(presetName)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="dashboard-preset-desc">描述</label>
                <input id="dashboard-preset-desc" type="text" value="${deps.escapeHtml(presetDescription)}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="dashboard-preset-json">
                  JSONC 配置
                  <span>可写 // 或 /* */ 注释；保存后会转为标准 JSON</span>
                </label>
              </div>

              <textarea id="dashboard-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea acu-dashboard-preset-json-textarea"></textarea>

              <div id="dashboard-preset-format-help" class="acu-advanced-preset-format-help-summary">
                <strong>配置格式：</strong>
                <span>区域名固定为 global、player、location、npc、quest、bag、equip，可选 relationshipGraph。tableKeywords 匹配表名，columns.keywords 匹配表头列名，filters 控制装备/任务等状态筛选；relationshipGraph.sources 支持 fixedTarget 和 relationList。</span>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="dashboard-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="dashboard-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button id="dashboard-preset-save" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button id="dashboard-preset-cancel" type="button" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#dashboard-preset-json');
    $jsonTextarea.val(editorJson);

    overlay.find('.acu-close-btn, #dashboard-preset-cancel').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.find('#dashboard-preset-download-ai-prompt').on('click', () => {
      const promptText = deps.buildDashboardPresetAgentPrompt();
      const currentPresetName = String(overlay.find('#dashboard-preset-name').val() || presetName);
      const filename = deps.buildDashboardPresetAgentPromptFilename(currentPresetName);
      deps.downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#dashboard-preset-validate').on('click', () => {
      deps.validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: deps.parseDashboardPresetJson,
        successMessage: parsed => `配置有效：${Object.keys(parsed.modules).length} 个区域`,
        errorMessage: deps.getJsonLikeErrorMessage,
        logLabel: '[DICE]ACU 仪表盘预设验证失败:',
      });
    });

    overlay.find('#dashboard-preset-save').on('click', () => {
      try {
        const name = String(overlay.find('#dashboard-preset-name').val() || '').trim();
        const description = String(overlay.find('#dashboard-preset-desc').val() || '').trim();
        const jsonText = String($jsonTextarea.val() || '').trim();

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }

        const parsed = deps.parseDashboardPresetJson(jsonText);
        if (isEdit && presetId) {
          const success = deps.DashboardPresetManager.updatePreset(presetId, {
            name,
            description,
            modules: parsed.modules,
          });
          if (!success) {
            if (window.toastr) showActionableErrorToast('保存失败', { title: '仪表盘预设保存失败', suggestion: 'save' });
            return;
          }
          if (window.toastr) window.toastr.success('仪表盘预设已更新');
        } else {
          deps.DashboardPresetManager.createPreset({
            name,
            description,
            modules: parsed.modules,
          });
          if (window.toastr) window.toastr.success('仪表盘预设已创建');
        }

        overlay.remove();
        deps.popModal();
      } catch (error) {
        if (window.toastr) showActionableErrorToast('JSONC 格式错误: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
      }
    });

    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showDashboardPresetEditor;
}
