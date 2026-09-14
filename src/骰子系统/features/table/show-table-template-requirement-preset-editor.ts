// @ts-nocheck
/**
 * show-table-template-requirement-preset-editor.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { normalizeTableTemplateRequirementPreset } from '../../features/table/table-template-requirements';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowTableTemplateRequirementPresetEditor(deps: any) {
  const showTableTemplateRequirementPresetEditor = (presetId: string | null = null): void => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showTableTemplateRequirementPresetEditor', () => showTableTemplateRequirementPresetEditor(presetId));

    const config = deps.getConfig();
    const isEdit = Boolean(presetId);
    const existingPreset = isEdit ? deps.TableTemplateRequirementPresetManager.getPresetById(presetId) : null;
    const defaultJsonText = existingPreset
      ? JSON.stringify(
          {
            name: existingPreset.name,
            description: existingPreset.description || '',
            requirementLevels: existingPreset.requirementLevels,
            template: existingPreset.template,
          },
          null,
          2,
        )
      : deps.buildNewTableTemplateRequirementPresetJsoncTemplate();
    const defaultPreset =
      normalizeTableTemplateRequirementPreset(deps.parseTableTemplateRequirementPresetJson(defaultJsonText), presetId || undefined) ||
      deps.TableTemplateRequirementPresetManager.getActivePreset();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-advanced-preset-editor-dialog acu-table-template-requirement-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3><i class="fa-solid fa-table-list"></i> ${isEdit ? '编辑' : '新建'}模板检验预设</h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('tableTemplateRequirementPresetEditor', '查看模板检验预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭模板检验预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="table-template-requirement-preset-name">预设名称</label>
                <input id="table-template-requirement-preset-name" type="text" value="${deps.escapeHtml(defaultPreset.name || '')}" class="acu-preset-editor-input" />
              </div>
              <div class="acu-advanced-preset-field">
                <label for="table-template-requirement-preset-desc">描述</label>
                <input id="table-template-requirement-preset-desc" type="text" value="${deps.escapeHtml(defaultPreset.description || '')}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="table-template-requirement-preset-json">
                  JSONC 配置
                  <span>支持完整预设、仅 template 对象，或直接导入表格模板 JSON</span>
                </label>
              </div>
              <textarea id="table-template-requirement-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea"></textarea>
              <div id="table-template-requirement-preset-format-help" class="acu-advanced-preset-format-help-summary">
                <strong>分层要求：</strong>
                <span>template 中出现的表、列和可选 sourceData / DDL / 配置会参与校验；可用 requirementLevels 标记 error、warning 或 info。</span>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="table-template-requirement-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="table-template-requirement-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button type="button" id="table-template-requirement-preset-save" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button type="button" id="table-template-requirement-preset-cancel" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#table-template-requirement-preset-json');
    $jsonTextarea.val(defaultJsonText);

    const parseEditorPreset = () => {
      const name = String(overlay.find('#table-template-requirement-preset-name').val() || '').trim();
      const description = String(overlay.find('#table-template-requirement-preset-desc').val() || '').trim();
      const parsed = deps.parseTableTemplateRequirementPresetJson(String($jsonTextarea.val() || ''));
      const normalized = normalizeTableTemplateRequirementPreset(parsed, presetId || undefined);
      if (!normalized) throw new Error('配置中必须包含 template 对象，或直接提供表格模板对象。');
      normalized.name = name || normalized.name;
      normalized.description = description || normalized.description || '';
      normalized.builtin = false;
      return normalized;
    };

    overlay.find('#table-template-requirement-preset-download-ai-prompt').on('click', () => {
      const promptText = deps.buildTableTemplateRequirementPresetAgentPrompt();
      const presetName = String(
        overlay.find('#table-template-requirement-preset-name').val() ||
          defaultPreset?.name ||
          'table_template_requirement_preset',
      );
      const filename = deps.buildTableTemplateRequirementPresetAgentPromptFilename(presetName);
      deps.downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#table-template-requirement-preset-validate').on('click', () => {
      deps.validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: () => parseEditorPreset(),
        successMessage: preset => {
          const stats = deps.getTableTemplateRequirementPresetStats(preset);
          return `配置有效：${preset.name}，${stats.sheetCount} 张表，${stats.headerCount} 个业务列`;
        },
        logLabel: '[DICE]ACU 模板检验预设验证失败:',
      });
    });

    overlay.find('#table-template-requirement-preset-save').on('click', () => {
      try {
        const preset = parseEditorPreset();
        if (!preset.name) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }
        if (isEdit && presetId) {
          deps.TableTemplateRequirementPresetManager.updatePreset(presetId, preset);
        } else {
          deps.TableTemplateRequirementPresetManager.createPreset(preset);
        }
        overlay.remove();
        deps.popModal();
        deps.showTableTemplateRequirementPresetManager();
      } catch (error) {
        console.error('[DICE]ACU 保存模板检验预设失败:', error);
        showActionableErrorToast('保存失败: ' + deps.getJsonLikeErrorMessage(error), { suggestion: 'save' });
      }
    });

    overlay.find('.acu-close-btn, #table-template-requirement-preset-cancel').on('click', () => {
      overlay.remove();
      deps.popModal();
      deps.showTableTemplateRequirementPresetManager();
    });

    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
      deps.showTableTemplateRequirementPresetManager();
    });
  };
  return showTableTemplateRequirementPresetEditor;
}
