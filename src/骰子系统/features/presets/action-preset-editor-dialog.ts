// @ts-nocheck
/**
 * action-preset-editor-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowActionPresetEditor(deps: any) {
  const showActionPresetEditor = (presetId?: string) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showActionPresetEditor', () => showActionPresetEditor(presetId));

    const config = deps.getConfig();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? deps.ActionPresetManager.getPresetById(presetId) : null;

    // 默认值
    const defaultData = {
      name: existingPreset?.name || '新交互规则预设',
      description: existingPreset?.description || '',
      rules: existingPreset?.rules || [
        {
          table_keywords: ['地点（输入表格名关键词，表名中包含关键词的表格将应用此规则）', '场所'],
          actions: [
            {
              label: '前往（按钮显示的文字）',
              template:
                '<user>对{Name}执行互动:前往。（点击按钮后发送的内容，{Name}会替换为表格第一列的列名，一般为名称）',
            },
            {
              label: '调查',
              template: '<user>仔细调查了{Name}的情况。',
            },
          ],
        },
        {
          table_keywords: ['魔法', '奥术'],
          actions: [
            {
              label: '学习',
              template: '<user>尝试学习{Name}。',
            },
            {
              label: '释放',
              template: '<user>释放了{Name}！',
            },
          ],
        },
      ],
    };

    const parseActionPresetRules = (jsonStr: string): Record<string, unknown>[] => {
      const rules = deps.parseJsoncValue(jsonStr);
      if (!Array.isArray(rules) || rules.length === 0) {
        throw new Error('规则不能为空，需要至少一个规则');
      }

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (!deps.isRecordValue(rule)) {
          throw new Error(`规则 ${i + 1} 必须是对象`);
        }
        const tableKeywords = rule.table_keywords;
        if (!Array.isArray(tableKeywords) || tableKeywords.length === 0) {
          throw new Error(`规则 ${i + 1} 缺少 table_keywords`);
        }
        if (!tableKeywords.every((keyword: unknown) => typeof keyword === 'string' && keyword.trim())) {
          throw new Error(`规则 ${i + 1} 的 table_keywords 必须是非空字符串数组`);
        }
        const actions = rule.actions;
        if (!Array.isArray(actions) || actions.length === 0) {
          throw new Error(`规则 ${i + 1} 缺少 actions`);
        }

        for (let j = 0; j < actions.length; j++) {
          const action = actions[j];
          if (!deps.isRecordValue(action)) {
            throw new Error(`规则 ${i + 1} 的动作 ${j + 1} 必须是对象`);
          }
          if (typeof action.label !== 'string' || !action.label.trim()) {
            throw new Error(`规则 ${i + 1} 的动作 ${j + 1} 缺少 label`);
          }
          if (action.template !== undefined && typeof action.template !== 'string') {
            throw new Error(`规则 ${i + 1} 的动作 ${j + 1} 的 template 必须是字符串`);
          }
          if (action.icon !== undefined && typeof action.icon !== 'string') {
            throw new Error(`规则 ${i + 1} 的动作 ${j + 1} 的 icon 必须是字符串`);
          }
        }
      }

      return rules as Record<string, unknown>[];
    };

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-action-preset-editor-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-wand-magic-sparkles"></i> ${isEdit ? '编辑' : '新建'}交互规则预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('actionPresetEditor', '查看新建交互规则预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭交互规则预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="action-preset-name">预设名称</label>
                <input id="action-preset-name" type="text" value="${deps.escapeHtml(defaultData.name)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="action-preset-desc">描述</label>
                <input id="action-preset-desc" type="text" value="${deps.escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label for="action-preset-json" class="acu-advanced-preset-json-label">
                  JSONC 配置 <span>可写 // 或 /* */ 注释，保存后会转为标准 JSON</span>
                </label>
              </div>

              <textarea id="action-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea acu-action-preset-json-textarea"></textarea>

              <div id="action-preset-format-help" class="acu-advanced-preset-format-help-summary">
                <strong>配置格式：</strong>
                <span>顶层必须是规则数组。每个规则组需要 table_keywords 和 actions；每个动作需要 label，template 和 icon 可选。template 中的 {Name} 会替换为当前条目名称。</span>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="action-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="action-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button id="action-preset-save" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button id="action-preset-cancel" type="button" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);

    const $jsonTextarea = overlay.find('#action-preset-json');

    // 初始化 JSON / JSONC；新建时保留带注释示例，编辑时只显示真实 rules 部分。
    $jsonTextarea.val(isEdit ? JSON.stringify(defaultData.rules, null, 2) : deps.buildNewActionPresetRulesJsoncTemplate());

    // 关闭
    overlay.find('.acu-close-btn, #action-preset-cancel').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.find('#action-preset-download-ai-prompt').on('click', () => {
      const promptText = deps.buildActionPresetAgentPrompt();
      const presetName = String(overlay.find('#action-preset-name').val() || defaultData.name || 'action_preset');
      const filename = deps.buildActionPresetAgentPromptFilename(presetName);
      deps.downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#action-preset-validate').on('click', () => {
      deps.validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: parseActionPresetRules,
        successMessage: rules => {
          const actionCount = rules.reduce((total, rule) => {
            const actions = Array.isArray(rule.actions) ? rule.actions : [];
            return total + actions.length;
          }, 0);
          return `配置有效：${rules.length} 个规则组，${actionCount} 个动作`;
        },
        logLabel: '[DICE]ACU 交互规则验证失败:',
      });
    });

    // 保存
    overlay.find('#action-preset-save').on('click', () => {
      try {
        const name = (overlay.find('#action-preset-name').val() as string).trim();
        const description = (overlay.find('#action-preset-desc').val() as string).trim();
        const jsonStr = ($jsonTextarea.val() as string).trim();

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }

        const rules = parseActionPresetRules(jsonStr);

        if (isEdit && presetId) {
          // 更新现有预设
          deps.ActionPresetManager.updatePreset(presetId, { name, description, rules });
          if (window.toastr) window.toastr.success('交互规则预设已更新');
        } else {
          // 创建新预设
          deps.ActionPresetManager.createPreset({ name, description, rules });
          if (window.toastr) window.toastr.success('交互规则预设已创建');
        }

        overlay.remove();
        deps.popModal();
      } catch (e) {
        if (window.toastr) showActionableErrorToast('JSONC 格式错误: ' + deps.getJsonLikeErrorMessage(e), { suggestion: 'importExport' });
      }
    });

    // 点击遮罩关闭
    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showActionPresetEditor;
}
