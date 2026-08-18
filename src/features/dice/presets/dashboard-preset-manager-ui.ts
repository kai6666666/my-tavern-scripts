// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=40「仪表盘预设管理」
// 原行范围：47141-47514（含 banner 47138-47514）；拆分批次 8；外部 closure 依赖：23（getCore@29 / pushModal@29 / getConfig@30 / DashboardPresetManager@29 / DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY@29 / DASHBOARD_PRESET_MODULE_KEYS@29 / escapeHtml@3 / getTutorialButtonHtml@30 / bindTutorialButtonsIn@30 / popModal@29 / DASHBOARD_DEFAULT_PRESET_ID@29 / showActionableErrorToast(import) / downloadJsonFile@29 / showDiceSystemConfirmDialog@29 / pickTextFile@29 / getJsonLikeErrorMessage@29 / setupOverlayClose@3 / cloneDashboardPresetModules@29 / createDashboardPresetEditorTemplate@29 / buildDashboardPresetAgentPrompt@24 / buildDashboardPresetAgentPromptFilename@38 / downloadAiPromptFile@29 / validateJsoncEditorConfig@29 / parseDashboardPresetJson@29）
// 接线说明：escapeHtml/setupOverlayClose 已拆至 favorites/bookmark-manager.ts、buildDashboardPresetAgentPrompt 已拆至 presets/advanced-dice-preset-manager.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   getCore/pushModal/popModal/DashboardPresetManager/DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY/DASHBOARD_PRESET_MODULE_KEYS/DASHBOARD_DEFAULT_PRESET_ID/downloadJsonFile/showDiceSystemConfirmDialog/pickTextFile/getJsonLikeErrorMessage/cloneDashboardPresetModules/createDashboardPresetEditorTemplate/downloadAiPromptFile/validateJsoncEditorConfig/parseDashboardPresetJson@29、getConfig/getTutorialButtonHtml/bindTutorialButtonsIn@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   （buildDashboardPresetAgentPromptFilename@38 批次 9A 起由本文件直连 import presets/advanced-dice-preset-ui）
//   index.ts IIFE 末尾调用 __wireShowDashboardPresetManagerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';
import { buildDashboardPresetAgentPrompt } from './advanced-dice-preset-manager';
import { buildDashboardPresetAgentPromptFilename } from './advanced-dice-preset-ui'; // 批次 9A：idx 38 拆出后由 __wire 改直连 import

let getCore = null;
let pushModal = null;
let getConfig = null;
let DashboardPresetManager = null;
let DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY = null;
let DASHBOARD_PRESET_MODULE_KEYS = null;
let getTutorialButtonHtml = null;
let bindTutorialButtonsIn = null;
let popModal = null;
let DASHBOARD_DEFAULT_PRESET_ID = null;
let downloadJsonFile = null;
let showDiceSystemConfirmDialog = null;
let pickTextFile = null;
let getJsonLikeErrorMessage = null;
let cloneDashboardPresetModules = null;
let createDashboardPresetEditorTemplate = null;
let downloadAiPromptFile = null;
let validateJsoncEditorConfig = null;
let parseDashboardPresetJson = null;

export function __wireShowDashboardPresetManagerDeps(deps) {
  getCore = deps.getCore;
  pushModal = deps.pushModal;
  getConfig = deps.getConfig;
  DashboardPresetManager = deps.DashboardPresetManager;
  DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY = deps.DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY;
  DASHBOARD_PRESET_MODULE_KEYS = deps.DASHBOARD_PRESET_MODULE_KEYS;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  bindTutorialButtonsIn = deps.bindTutorialButtonsIn;
  popModal = deps.popModal;
  DASHBOARD_DEFAULT_PRESET_ID = deps.DASHBOARD_DEFAULT_PRESET_ID;
  downloadJsonFile = deps.downloadJsonFile;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  pickTextFile = deps.pickTextFile;
  getJsonLikeErrorMessage = deps.getJsonLikeErrorMessage;
  cloneDashboardPresetModules = deps.cloneDashboardPresetModules;
  createDashboardPresetEditorTemplate = deps.createDashboardPresetEditorTemplate;
  downloadAiPromptFile = deps.downloadAiPromptFile;
  validateJsoncEditorConfig = deps.validateJsoncEditorConfig;
  parseDashboardPresetJson = deps.parseDashboardPresetJson;
}
  // ========================================
  // 仪表盘预设管理
  // ========================================
  const showDashboardPresetManager = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showDashboardPresetManager', showDashboardPresetManager);

    const config = getConfig();
    const presets = DashboardPresetManager.getAllPresets();
    const activeId = DashboardPresetManager.getActivePresetId();

    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin === true;
        const hasRelationshipGraph = Boolean(preset.modules[DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY]?.sources?.length);
        const moduleNames = [
          ...DASHBOARD_PRESET_MODULE_KEYS.filter(moduleKey => Boolean(preset.modules[moduleKey])),
          ...(hasRelationshipGraph ? ['relationshipGraph'] : []),
        ];
        const moduleSummary = moduleNames.join('、') || '无';
        const keywordSummary =
          Object.values(preset.modules)
            .flatMap(moduleConfig => [
              ...(moduleConfig.tableKeywords || []),
              ...(moduleConfig.sources || []).flatMap(source => source.tableKeywords),
            ])
            .slice(0, 5)
            .join('、') || '无';

        return `
          <div class="acu-preset-item" data-id="${escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name">${escapeHtml(preset.name)}${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}</div>
              ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats">
                区域: ${escapeHtml(moduleSummary)} | 关键词: ${escapeHtml(keywordSummary)}
              </div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle">
                <input type="checkbox" class="acu-dashboard-preset-toggle" data-id="${escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-dashboard-preset-copy" data-id="${escapeHtml(preset.id)}" title="复制为仪表盘预设" aria-label="复制 ${escapeHtml(preset.name)} 为仪表盘预设"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-dashboard-preset-edit" data-id="${escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-dashboard-preset-export" data-id="${escapeHtml(preset.id)}" title="导出" aria-label="导出 ${escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-dashboard-preset-delete" data-id="${escapeHtml(preset.id)}" title="删除" aria-label="删除 ${escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        `;
      })
      .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-dashboard-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-chart-line"></i> 仪表盘预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('dashboardPresetManager', '查看仪表盘预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭仪表盘预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-dashboard-presets-list">
              ${presetsHtml}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-dashboard-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建仪表盘预设" aria-label="新建仪表盘预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-dashboard-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-dashboard-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    overlay.find('.acu-close-btn, #acu-dashboard-preset-back').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.on('change', '.acu-dashboard-preset-toggle', function () {
      const $toggle = $(this);
      const id = String($toggle.data('id') || '');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        DashboardPresetManager.setActivePresetId(id);
        overlay.find('.acu-dashboard-preset-toggle').each(function () {
          if (String($(this).data('id') || '') !== id) {
            $(this).prop('checked', false);
          }
        });
        if (window.toastr) window.toastr.success('仪表盘预设已启用');
        return;
      }

      DashboardPresetManager.setActivePresetId(DASHBOARD_DEFAULT_PRESET_ID);
      overlay.find('.acu-dashboard-preset-toggle').each(function () {
        const toggleId = String($(this).data('id') || '');
        $(this).prop('checked', toggleId === DASHBOARD_DEFAULT_PRESET_ID);
      });
      if (window.toastr) window.toastr.info('已切回默认仪表盘预设');
    });

    overlay.on('click', '.acu-dashboard-preset-edit', function () {
      const id = String($(this).data('id') || '');
      overlay.remove();
      showDashboardPresetEditor(id);
    });

    overlay.on('click', '.acu-dashboard-preset-export', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      const json = DashboardPresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '仪表盘预设导出失败', suggestion: 'importExport' });
        return;
      }

      downloadJsonFile(json, `${preset?.name || '仪表盘预设'}.json`);
      if (window.toastr) window.toastr.success('已导出仪表盘预设');
    });

    overlay.on('click', '.acu-dashboard-preset-copy', function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset) return;

      const copy = DashboardPresetManager.createPreset({
        name: `${preset.name} (副本)`,
        description: preset.description || '',
        modules: preset.modules,
      });
      if (window.toastr) window.toastr.success(`已创建副本：${copy.name}`);
      overlay.remove();
      showDashboardPresetManager();
    });

    overlay.on('click', '.acu-dashboard-preset-delete', async function () {
      const id = String($(this).data('id') || '');
      const preset = presets.find(item => item.id === id);
      if (!preset || preset.builtin) return;

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除仪表盘预设',
        message: `确定要删除仪表盘预设「${preset.name}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = DashboardPresetManager.deletePreset(id);
        if (success) {
          overlay.remove();
          showDashboardPresetManager();
        } else if (window.toastr) {
          showActionableErrorToast('删除失败', { title: '仪表盘预设删除失败', suggestion: 'save' });
        }
      }
    });

    overlay.find('#acu-dashboard-preset-new').on('click', () => {
      overlay.remove();
      showDashboardPresetEditor();
    });

    overlay.find('#acu-dashboard-preset-import').on('click', () => {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const jsonText = selected.text.trim();
          if (!jsonText) {
            if (window.toastr) showActionableErrorToast('文件内容为空', { suggestion: 'importExport' });
            return;
          }

          const imported = DashboardPresetManager.importPreset(jsonText);
          if (imported) {
            if (window.toastr) window.toastr.success(`导入成功：${imported.name}`);
            overlay.remove();
            showDashboardPresetManager();
          }
        } catch (error) {
          console.error('[DICE]ACU 仪表盘预设导入失败:', error);
          if (window.toastr) showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };

  const showDashboardPresetEditor = (presetId?: string) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showDashboardPresetEditor', () => showDashboardPresetEditor(presetId));

    const config = getConfig();
    const isEdit = Boolean(presetId);
    const existingPreset = presetId ? DashboardPresetManager.getPresetById(presetId) : null;

    if (existingPreset?.builtin) {
      if (window.toastr) window.toastr.warning('默认仪表盘预设不可编辑，请导出或复制后修改');
      popModal();
      return;
    }

    const presetName = existingPreset?.name || '新仪表盘预设';
    const presetDescription = existingPreset?.description || '';
    const editorJson = existingPreset
      ? JSON.stringify(cloneDashboardPresetModules(existingPreset.modules), null, 2)
      : createDashboardPresetEditorTemplate();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-dashboard-preset-editor-dialog acu-advanced-preset-editor-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-chart-line"></i> ${isEdit ? '编辑' : '新建'}仪表盘预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('dashboardPresetEditor', '查看新建仪表盘预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="dashboard-preset-name">预设名称</label>
                <input id="dashboard-preset-name" type="text" value="${escapeHtml(presetName)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="dashboard-preset-desc">描述</label>
                <input id="dashboard-preset-desc" type="text" value="${escapeHtml(presetDescription)}" placeholder="可选" class="acu-preset-editor-input" />
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
    bindTutorialButtonsIn(overlay);

    const $jsonTextarea = overlay.find('#dashboard-preset-json');
    $jsonTextarea.val(editorJson);

    overlay.find('.acu-close-btn, #dashboard-preset-cancel').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.find('#dashboard-preset-download-ai-prompt').on('click', () => {
      const promptText = buildDashboardPresetAgentPrompt();
      const currentPresetName = String(overlay.find('#dashboard-preset-name').val() || presetName);
      const filename = buildDashboardPresetAgentPromptFilename(currentPresetName);
      downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#dashboard-preset-validate').on('click', () => {
      validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: parseDashboardPresetJson,
        successMessage: parsed => `配置有效：${Object.keys(parsed.modules).length} 个区域`,
        errorMessage: getJsonLikeErrorMessage,
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

        const parsed = parseDashboardPresetJson(jsonText);
        if (isEdit && presetId) {
          const success = DashboardPresetManager.updatePreset(presetId, {
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
          DashboardPresetManager.createPreset({
            name,
            description,
            modules: parsed.modules,
          });
          if (window.toastr) window.toastr.success('仪表盘预设已创建');
        }

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
export { showDashboardPresetManager, showDashboardPresetEditor }; // __wireShowDashboardPresetManagerDeps 已由头部 export function 导出
