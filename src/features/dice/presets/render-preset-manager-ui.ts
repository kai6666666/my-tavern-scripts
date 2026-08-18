// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=41「渲染预设管理」
// 原行范围：47519-47908（含 banner 47516-47908）；拆分批次 8；外部 closure 依赖：23（getCore@29 / pushModal@29 / getConfig@30 / RenderPresetManager@11 / escapeHtml@3 / getTutorialButtonHtml@30 / bindTutorialButtonsIn@30 / popModal@29 / renderInterface@45 / refreshDialogueIndentRender@20 / RENDER_DEFAULT_PRESET_ID@11 / showActionableErrorToast(import) / downloadJsonFile@29 / showDiceSystemConfirmDialog@29 / pickTextFile@29 / getJsonLikeErrorMessage@29 / setupOverlayClose@3 / cloneRenderPresetRules@11 / createRenderPresetEditorTemplate@11 / buildRenderPresetAgentPrompt@24 / buildRenderPresetAgentPromptFilename@38 / downloadAiPromptFile@29 / validateJsoncEditorConfig@29 / parseRenderPresetJson@11）
// 接线说明：RenderPresetManager/RENDER_DEFAULT_PRESET_ID/cloneRenderPresetRules/createRenderPresetEditorTemplate/parseRenderPresetJson 已拆至 presets/render-preset-manager.ts、
//   refreshDialogueIndentRender 已拆至 engine/character-name-resolver.ts、escapeHtml/setupOverlayClose 已拆至 favorites/bookmark-manager.ts、
//   buildRenderPresetAgentPrompt 已拆至 presets/advanced-dice-preset-manager.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   getCore/pushModal/popModal/downloadJsonFile/showDiceSystemConfirmDialog/pickTextFile/getJsonLikeErrorMessage/downloadAiPromptFile/validateJsoncEditorConfig@29、getConfig/getTutorialButtonHtml/bindTutorialButtonsIn@30、renderInterface@45 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   （buildRenderPresetAgentPromptFilename@38 批次 9A 起由本文件直连 import presets/advanced-dice-preset-ui）
//   index.ts IIFE 末尾调用 __wireShowRenderPresetManagerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { RenderPresetManager, RENDER_DEFAULT_PRESET_ID, cloneRenderPresetRules, createRenderPresetEditorTemplate, parseRenderPresetJson } from './render-preset-manager';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';
import { refreshDialogueIndentRender } from '../engine/character-name-resolver';
import { buildRenderPresetAgentPrompt } from './advanced-dice-preset-manager';
import { buildRenderPresetAgentPromptFilename } from './advanced-dice-preset-ui'; // 批次 9A：idx 38 拆出后由 __wire 改直连 import

let getCore = null;
let pushModal = null;
let getConfig = null;
let getTutorialButtonHtml = null;
let bindTutorialButtonsIn = null;
let popModal = null;
let renderInterface = null;
let downloadJsonFile = null;
let showDiceSystemConfirmDialog = null;
let pickTextFile = null;
let getJsonLikeErrorMessage = null;
let downloadAiPromptFile = null;
let validateJsoncEditorConfig = null;

export function __wireShowRenderPresetManagerDeps(deps) {
  getCore = deps.getCore;
  pushModal = deps.pushModal;
  getConfig = deps.getConfig;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  bindTutorialButtonsIn = deps.bindTutorialButtonsIn;
  popModal = deps.popModal;
  renderInterface = deps.renderInterface;
  downloadJsonFile = deps.downloadJsonFile;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  pickTextFile = deps.pickTextFile;
  getJsonLikeErrorMessage = deps.getJsonLikeErrorMessage;
  downloadAiPromptFile = deps.downloadAiPromptFile;
  validateJsoncEditorConfig = deps.validateJsoncEditorConfig;
}
  // ========================================
  // 渲染预设管理
  // ========================================
  const showRenderPresetManager = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showRenderPresetManager', showRenderPresetManager);

    const config = getConfig();
    const presets = RenderPresetManager.getAllPresets();
    const activeId = RenderPresetManager.getActivePresetId();

    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin === true;
        const aliasCount = Object.keys(preset.rules.columnDisplay.aliases).length;
        const excludedCount = preset.rules.quickCheck.excludeKeywords.length;
        const dialogueWhitelist = preset.rules.dialogueIndent.whitelist;
        const dialogueBlacklistCount = preset.rules.dialogueIndent.blacklist.length;
        const dialogueScope =
          dialogueWhitelist.length === 0 || dialogueWhitelist.includes('*')
            ? '正文头像渲染全局'
            : `正文头像渲染白名单 ${dialogueWhitelist.length}`;
        const ruleSummary = [
          preset.rules.attributes.enabled ? '属性键值对' : '',
          preset.rules.relationship.enabled ? '关系拆分' : '',
          preset.rules.shortTags.enabled ? '短标签' : '',
          preset.rules.quickCheck.enabled ? '快捷检定过滤' : '',
          '正文头像渲染标签过滤',
        ]
          .filter(Boolean)
          .join('、');

        return `
          <div class="acu-preset-item" data-id="${escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name">${escapeHtml(preset.name)}${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}</div>
              ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats">
                规则: ${escapeHtml(ruleSummary || '基础文本')} | 列名别名: ${aliasCount} | 快捷检定排除: ${excludedCount} | ${escapeHtml(dialogueScope)}，黑名单: ${dialogueBlacklistCount}
              </div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle">
                <input type="checkbox" class="acu-render-preset-toggle" data-id="${escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-render-preset-copy" data-id="${escapeHtml(preset.id)}" title="复制为自定义渲染预设" aria-label="复制 ${escapeHtml(preset.name)} 为自定义渲染预设"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-render-preset-edit" data-id="${escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-render-preset-export" data-id="${escapeHtml(preset.id)}" title="导出" aria-label="导出 ${escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-render-preset-delete" data-id="${escapeHtml(preset.id)}" title="删除" aria-label="删除 ${escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-render-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-table-cells-large"></i> 渲染预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('renderPresetManager', '查看渲染预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭渲染预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-render-presets-list">
              ${presetsHtml}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-render-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建渲染预设" aria-label="新建渲染预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-render-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-render-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-render-preset-back').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.on('change', '.acu-render-preset-toggle', function () {
      const $toggle = $(this);
      const id = String($toggle.data('id') || '');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        RenderPresetManager.setActivePresetId(id);
        overlay.find('.acu-render-preset-toggle').each(function () {
          if (String($(this).data('id') || '') !== id) {
            $(this).prop('checked', false);
          }
        });
        renderInterface();
        refreshDialogueIndentRender();
        if (window.toastr) window.toastr.success('渲染预设已启用');
        return;
      }

      RenderPresetManager.setActivePresetId(RENDER_DEFAULT_PRESET_ID);
      overlay.find('.acu-render-preset-toggle').each(function () {
        const toggleId = String($(this).data('id') || '');
        $(this).prop('checked', toggleId === RENDER_DEFAULT_PRESET_ID);
      });
      renderInterface();
      refreshDialogueIndentRender();
      if (window.toastr) window.toastr.info('已切回默认渲染预设');
    });

    overlay.on('click', '.acu-render-preset-edit', function () {
      const id = String($(this).data('id') || '');
      overlay.remove();
      showRenderPresetEditor(id);
    });

    overlay.on('click', '.acu-render-preset-export', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      const json = RenderPresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '渲染预设导出失败', suggestion: 'importExport' });
        return;
      }

      downloadJsonFile(json, `${preset?.name || '渲染预设'}.json`);
      if (window.toastr) window.toastr.success('已导出渲染预设');
    });

    overlay.on('click', '.acu-render-preset-copy', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset) return;

      const copy = RenderPresetManager.createPreset({
        name: `${preset.name} (副本)`,
        description: preset.description || '',
        rules: preset.rules,
      });
      if (window.toastr) window.toastr.success(`已创建副本：${copy.name}`);
      overlay.remove();
      showRenderPresetManager();
    });

    overlay.on('click', '.acu-render-preset-delete', async function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset || preset.builtin) return;

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除渲染预设',
        message: `确定要删除渲染预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除渲染预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (!confirmed) return;

      const success = RenderPresetManager.deletePreset(id);
      if (success) {
        renderInterface();
        refreshDialogueIndentRender();
        overlay.remove();
        showRenderPresetManager();
      } else if (window.toastr) {
        showActionableErrorToast('删除失败', { title: '渲染预设删除失败', suggestion: 'save' });
      }
    });

    overlay.find('#acu-render-preset-new').on('click', () => {
      overlay.remove();
      showRenderPresetEditor();
    });

    overlay.find('#acu-render-preset-import').on('click', () => {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const jsonText = selected.text.trim();
          if (!jsonText) {
            if (window.toastr) showActionableErrorToast('文件内容为空', { suggestion: 'importExport' });
            return;
          }

          const imported = RenderPresetManager.importPreset(jsonText);
          if (imported) {
            if (window.toastr) window.toastr.success(`导入成功：${imported.name}`);
            overlay.remove();
            showRenderPresetManager();
          }
        } catch (error) {
          console.error('[DICE]ACU 渲染预设导入失败:', error);
          if (window.toastr) showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };

  const showRenderPresetEditor = (presetId?: string) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showRenderPresetEditor', () => showRenderPresetEditor(presetId));

    const config = getConfig();
    const isEdit = Boolean(presetId);
    const existingPreset = presetId ? RenderPresetManager.getPresetById(presetId) : null;

    if (existingPreset?.builtin) {
      if (window.toastr) window.toastr.warning('默认渲染预设不可编辑，请复制后修改');
      popModal();
      return;
    }

    const presetName = existingPreset?.name || '新渲染预设';
    const presetDescription = existingPreset?.description || '';
    const editorJson = existingPreset
      ? JSON.stringify(cloneRenderPresetRules(existingPreset.rules), null, 2)
      : createRenderPresetEditorTemplate();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-render-preset-editor-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-table-cells-large"></i> ${isEdit ? '编辑' : '新建'}渲染预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('renderPresetEditor', '查看渲染预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="render-preset-name">预设名称</label>
                <input id="render-preset-name" type="text" value="${escapeHtml(presetName)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="render-preset-desc">描述</label>
                <input id="render-preset-desc" type="text" value="${escapeHtml(presetDescription)}" placeholder="可选" class="acu-preset-editor-input" />
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
    bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#render-preset-json');
    $jsonTextarea.val(editorJson);

    overlay.find('.acu-close-btn, #render-preset-cancel').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.find('#render-preset-download-ai-prompt').on('click', () => {
      const promptText = buildRenderPresetAgentPrompt();
      const currentPresetName = String(overlay.find('#render-preset-name').val() || presetName);
      const filename = buildRenderPresetAgentPromptFilename(currentPresetName);
      downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#render-preset-validate').on('click', () => {
      validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: parseRenderPresetJson,
        successMessage: parsed => {
          const aliasCount = Object.keys(parsed.rules.columnDisplay.aliases).length;
          const excludedCount = parsed.rules.quickCheck.excludeKeywords.length;
          const dialogueBlacklistCount = parsed.rules.dialogueIndent.blacklist.length;
          return `配置有效：列名别名 ${aliasCount} 个，快捷检定排除 ${excludedCount} 个，对白黑名单 ${dialogueBlacklistCount} 个`;
        },
        errorMessage: getJsonLikeErrorMessage,
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

        const parsed = parseRenderPresetJson(jsonText);
        if (isEdit && presetId) {
          const success = RenderPresetManager.updatePreset(presetId, {
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
          RenderPresetManager.createPreset({
            name,
            description,
            rules: parsed.rules,
          });
          if (window.toastr) window.toastr.success('渲染预设已创建');
        }

        renderInterface();
        refreshDialogueIndentRender();
        overlay.remove();
        popModal();
      } catch (error) {
        if (window.toastr) showActionableErrorToast('JSONC 格式错误: ' + getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
      }
    });

    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };
export { showRenderPresetManager, showRenderPresetEditor }; // __wireShowRenderPresetManagerDeps 已由头部 export function 导出
