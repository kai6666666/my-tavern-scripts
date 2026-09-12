// @ts-nocheck
/**
 * attribute-preset-editor-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { PRESET_FORMAT_VERSION } from '../../shared/constants';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowAttributePresetEditor(deps: any) {
  const showAttributePresetEditor = (presetId = null) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showAttributePresetEditor', () => showAttributePresetEditor(presetId));

    const config = deps.getConfig();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? deps.AttributePresetManager.getAllPresets().find(p => p.id === presetId) : null;

    const buildAttributePresetAgentPrompt = (): string => deps.attributePresetAgentPromptTemplate;
    const buildAttributePresetAgentPromptFilename = (presetName: string): string => {
      const safeName =
        presetName
          .trim()
          .replace(/[\\/:*?"<>|]+/g, '_')
          .replace(/\s+/g, '_')
          .replace(/^_+|_+$/g, '')
          .slice(0, 60) || 'attribute_preset';
      const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      return `acu_attribute_preset_ai_prompt_${safeName}_${datePart}.md`;
    };

    // 默认值
    const defaultData = {
      name: existingPreset?.name || '新属性预设',
      description: existingPreset?.description || '',
      baseAttributes: existingPreset?.baseAttributes || [
        { name: '力量', formula: '3d6', range: [3, 18] },
        { name: '敏捷', formula: '3d6', range: [3, 18] },
        { name: '体质', formula: '3d6', range: [3, 18] },
        { name: '智力', formula: '3d6', range: [3, 18] },
        { name: '感知', formula: '3d6', range: [3, 18] },
        { name: '魅力', formula: '3d6', range: [3, 18] },
      ],
      specialAttributes: existingPreset?.specialAttributes || [],
      quickSelect: deps.normalizeAttributeQuickSelectConfig(existingPreset?.quickSelect),
    };

    const parseAttributePresetEditorConfig = (
      jsonText: string,
    ): {
      quickSelect: NormalizedAttributeQuickSelectConfig;
      baseAttributes: AttributePresetAttributeDef[];
      specialAttributes: AttributePresetAttributeDef[];
    } => {
      const data = deps.parseJsoncRecord(jsonText, '属性预设配置');
      if (!Array.isArray(data.baseAttributes) || data.baseAttributes.length === 0) {
        throw new Error('基本属性不能为空');
      }
      const specialAttributes = Array.isArray(data.specialAttributes) ? data.specialAttributes : [];
      return {
        quickSelect: deps.normalizeAttributeQuickSelectConfig(
          data.quickSelect as AttributeQuickSelectConfig | null | undefined,
        ),
        baseAttributes: data.baseAttributes as AttributePresetAttributeDef[],
        specialAttributes: specialAttributes as AttributePresetAttributeDef[],
      };
    };

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-attribute-preset-editor-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-pen"></i> ${isEdit ? '编辑' : '新建'}属性预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('attributePresetEditor', '查看新建属性预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭属性预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="preset-name">属性预设名称</label>
                <input id="preset-name" type="text" value="${deps.escapeHtml(defaultData.name)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="preset-desc">描述</label>
                <input id="preset-desc" type="text" value="${deps.escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="preset-json">
                  JSON配置
                  <span>支持直接编辑或导入</span>
                </label>
              </div>
              <textarea id="preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea acu-attribute-preset-json-textarea"></textarea>
              <div id="attribute-preset-format-help" class="acu-advanced-preset-format-help-summary">
                <strong>配置格式：</strong>
                <span>
                  baseAttributes 是必填基础属性数组；specialAttributes 可放技能或派生属性；quickSelect 决定快捷检定填入字段。formula 支持骰子表达式和数学运算，range 用于约束属性合理范围。
                </span>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button type="button" id="preset-save" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button type="button" id="preset-cancel" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#preset-json');

    // 初始化 JSON / JSONC；新建时保留带注释示例，编辑时展示真实保存内容。
    if (isEdit) {
      const data = {
        baseAttributes: defaultData.baseAttributes,
        specialAttributes: defaultData.specialAttributes,
        quickSelect: defaultData.quickSelect,
      };
      $jsonTextarea.val(JSON.stringify(data, null, 2));
    } else {
      $jsonTextarea.val(deps.buildNewAttributePresetJsoncTemplate());
    }

    // 关闭
    overlay.find('.acu-close-btn, #preset-cancel').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.find('#preset-download-ai-prompt').on('click', () => {
      const promptText = buildAttributePresetAgentPrompt();
      const presetName = String(overlay.find('#preset-name').val() || defaultData.name || 'attribute_preset');
      const filename = buildAttributePresetAgentPromptFilename(presetName);
      deps.downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#preset-validate').on('click', () => {
      const name = String(overlay.find('#preset-name').val() || '').trim();
      if (!name) {
        if (window.toastr) window.toastr.warning('请输入属性预设名称');
        return;
      }
      deps.validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: parseAttributePresetEditorConfig,
        successMessage: parsed =>
          `配置有效：${name}，基础属性 ${parsed.baseAttributes.length} 项，特殊属性 ${parsed.specialAttributes.length} 项`,
        errorMessage: error => '验证失败：' + deps.getJsonLikeErrorMessage(error),
        logLabel: '[DICE]ACU 属性预设验证失败:',
      });
    });

    // 保存
    overlay.find('#preset-save').on('click', () => {
      try {
        const name = overlay.find('#preset-name').val().trim();
        const description = overlay.find('#preset-desc').val().trim();
        const jsonStr = $jsonTextarea.val().trim();

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入属性预设名称');
          return;
        }

        const parsedConfig = parseAttributePresetEditorConfig(jsonStr);

        // 构建预设
        const preset = {
          format: 'acu_attr_preset_v1',
          version: PRESET_FORMAT_VERSION,
          id: presetId || `custom_${Date.now()}`,
          name,
          description,
          quickSelect: parsedConfig.quickSelect,
          baseAttributes: parsedConfig.baseAttributes,
          specialAttributes: parsedConfig.specialAttributes,
        };

        // 保存
        if (isEdit) {
          deps.AttributePresetManager.updatePreset(presetId, preset);
        } else {
          deps.AttributePresetManager.createPreset(preset);
        }

        overlay.remove();
        deps.popModal();
      } catch (err) {
        console.error('[DICE]ACU 保存预设失败:', err);
        if (window.toastr) showActionableErrorToast('保存失败：' + deps.getJsonLikeErrorMessage(err), { suggestion: 'save' });
      }
    });

    // 点击遮罩关闭
    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showAttributePresetEditor;
}
