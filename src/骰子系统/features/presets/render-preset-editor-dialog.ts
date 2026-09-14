// @ts-nocheck
/**
 * render-preset-editor-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowRenderPresetEditor(deps: any) {
  const showRenderPresetEditor = (presetId?: string) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    deps.pushModal('showRenderPresetEditor', () => showRenderPresetEditor(presetId));

    const config = deps.getConfig();
    const isEdit = Boolean(presetId);
    const existingPreset = presetId ? deps.RenderPresetManager.getPresetById(presetId) : null;

    if (existingPreset?.builtin) {
      if (window.toastr) window.toastr.warning('默认渲染预设不可编辑，请复制后修改');
      deps.popModal();
      return;
    }

    const presetName = existingPreset?.name || '新渲染预设';
    const presetDescription = existingPreset?.description || '';
    const editorJson = existingPreset
      ? JSON.stringify(deps.cloneRenderPresetRules(existingPreset.rules), null, 2)
      : deps.createRenderPresetEditorTemplate();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-render-preset-editor-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-table-cells-large"></i> ${isEdit ? '编辑' : '新建'}渲染预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${deps.getTutorialButtonHtml('renderPresetEditor', '查看渲染预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="render-preset-name">预设名称</label>
                <input id="render-preset-name" type="text" value="${deps.escapeHtml(presetName)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="render-preset-desc">描述</label>
                <input id="render-preset-desc" type="text" value="${deps.escapeHtml(presetDescription)}" placeholder="可选" class="acu-preset-editor-input" />
              </div>
            </div>

            <div class="acu-advanced-preset-json-section">
              <div class="acu-advanced-preset-json-head">
                <label class="acu-advanced-preset-json-label" for="render-preset-json">
                  JSONC 配置
                  <span>可写 // 或 /* */ 注释；保存后会转为标准 JSON</span>
                </label>
              </div>

              <textarea id="render-preset-json" class="acu-preset-editor-textarea acu-advanced-preset-json-textarea acu-render-preset-json-textarea"></textarea>

              <div id="render-preset-format-help" class="acu-advanced-preset-format-help-summary">
                <strong>配置格式：</strong>
                <span>渲染预设只改显示，不改真实表头和数据。columnDisplay 控制列名显示；invalidValues 过滤空值；relationship、attributes、shortTags 控制拆分；badges 控制小标签；quickCheck 控制表格和 MVU 数值快捷检定；dialogueIndent 控制正文头像渲染的标签白名单和黑名单。</span>
              </div>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-footer">
            <div class="acu-advanced-preset-editor-tools">
              <button id="render-preset-download-ai-prompt" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-file-arrow-down"></i> 下载 AI 提示词
              </button>
              <button id="render-preset-validate" type="button" class="acu-dialog-btn acu-advanced-preset-tool-btn">
                <i class="fa-solid fa-vial-circle-check"></i> 验证配置
              </button>
            </div>
            <div class="acu-advanced-preset-editor-actions">
              <button id="render-preset-save" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button id="render-preset-cancel" type="button" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#render-preset-json');
    $jsonTextarea.val(editorJson);

    overlay.find('.acu-close-btn, #render-preset-cancel').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.find('#render-preset-download-ai-prompt').on('click', () => {
      const promptText = deps.buildRenderPresetAgentPrompt();
      const currentPresetName = String(overlay.find('#render-preset-name').val() || presetName);
      const filename = deps.buildRenderPresetAgentPromptFilename(currentPresetName);
      deps.downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#render-preset-validate').on('click', () => {
      deps.validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: deps.parseRenderPresetJson,
        successMessage: parsed => {
          const aliasCount = Object.keys(parsed.rules.columnDisplay.aliases).length;
          const excludedCount = parsed.rules.quickCheck.excludeKeywords.length;
          const dialogueBlacklistCount = parsed.rules.dialogueIndent.blacklist.length;
          return `配置有效：列名别名 ${aliasCount} 个，快捷检定排除 ${excludedCount} 个，对白黑名单 ${dialogueBlacklistCount} 个`;
        },
        errorMessage: deps.getJsonLikeErrorMessage,
        logLabel: '[DICE]ACU 渲染预设验证失败:',
      });
    });

    overlay.find('#render-preset-save').on('click', () => {
      try {
        const name = String(overlay.find('#render-preset-name').val() || '').trim();
        const description = String(overlay.find('#render-preset-desc').val() || '').trim();
        const jsonText = String($jsonTextarea.val() || '').trim();

        if (!name) {
          if (window.toastr) window.toastr.warning('请输入预设名称');
          return;
        }

        const parsed = deps.parseRenderPresetJson(jsonText);
        if (isEdit && presetId) {
          const success = deps.RenderPresetManager.updatePreset(presetId, {
            name,
            description,
            rules: parsed.rules,
          });
          if (!success) {
            if (window.toastr) showActionableErrorToast('保存失败', { title: '渲染预设保存失败', suggestion: 'save' });
            return;
          }
          if (window.toastr) window.toastr.success('渲染预设已更新');
        } else {
          deps.RenderPresetManager.createPreset({
            name,
            description,
            rules: parsed.rules,
          });
          if (window.toastr) window.toastr.success('渲染预设已创建');
        }

        deps.renderInterface();
        deps.refreshDialogueIndentRender();
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
  return showRenderPresetEditor;
}
