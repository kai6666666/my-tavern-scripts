// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=37「属性预设管理面板」
// 原行范围：44906-45531（含 banner 44902-45531）；拆分批次 8；外部 closure 依赖：23（getCore@29 / pushModal@29 / getConfig@30 / AttributePresetManager@23 / Store@29 / STORAGE_KEY_ACTIVE_ATTR_PRESET@3 / escapeHtml@3 / getTutorialButtonHtml@30 / JSONC_FILE_ACCEPT@29 / bindTutorialButtonsIn@30 / popModal@29 / PRESET_FORMAT_VERSION@3 / ATTRIBUTE_QUICK_SELECT_DEFAULT@23 / showActionableErrorToast(import) / downloadJsonFile@29 / showDiceSystemConfirmDialog@29 / readTextFile@29 / parseJsoncRecord@29 / showPresetConflictDialog@3 / getJsonLikeErrorMessage@29 / setupOverlayClose@3 / attributePresetAgentPromptTemplate(import) / normalizeAttributeQuickSelectConfig@23 / downloadAiPromptFile@29 / validateJsoncEditorConfig@29）
// 接线说明：AttributePresetManager/ATTRIBUTE_QUICK_SELECT_DEFAULT/normalizeAttributeQuickSelectConfig 已拆至 presets/attribute-rule-preset.ts、
//   STORAGE_KEY_ACTIVE_ATTR_PRESET/PRESET_FORMAT_VERSION 已拆至 engine/preset-constants.ts、escapeHtml/showPresetConflictDialog/setupOverlayClose 已拆至 favorites/bookmark-manager.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；attributePresetAgentPromptTemplate 为 index.ts 既有模块级 ?raw import，随本文件迁移（index.ts 侧同步移除）；
//   getCore/pushModal/popModal/Store/JSONC_FILE_ACCEPT/downloadJsonFile/showDiceSystemConfirmDialog/readTextFile/parseJsoncRecord/getJsonLikeErrorMessage/downloadAiPromptFile/validateJsoncEditorConfig@29、getConfig/getTutorialButtonHtml/bindTutorialButtonsIn@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireShowAttributePresetManagerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { AttributePresetManager, ATTRIBUTE_QUICK_SELECT_DEFAULT, normalizeAttributeQuickSelectConfig } from './attribute-rule-preset';
import { PRESET_FORMAT_VERSION, STORAGE_KEY_ACTIVE_ATTR_PRESET } from '../engine/preset-constants';
import { escapeHtml, setupOverlayClose, showPresetConflictDialog } from '../favorites/bookmark-manager';
import attributePresetAgentPromptTemplate from '../assets/docs/attribute-preset-agent-prompt.md?raw';

let getCore = null;
let pushModal = null;
let getConfig = null;
let Store = null;
let getTutorialButtonHtml = null;
let JSONC_FILE_ACCEPT = null;
let bindTutorialButtonsIn = null;
let popModal = null;
let downloadJsonFile = null;
let showDiceSystemConfirmDialog = null;
let readTextFile = null;
let parseJsoncRecord = null;
let getJsonLikeErrorMessage = null;
let downloadAiPromptFile = null;
let validateJsoncEditorConfig = null;

export function __wireShowAttributePresetManagerDeps(deps) {
  getCore = deps.getCore;
  pushModal = deps.pushModal;
  getConfig = deps.getConfig;
  Store = deps.Store;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  JSONC_FILE_ACCEPT = deps.JSONC_FILE_ACCEPT;
  bindTutorialButtonsIn = deps.bindTutorialButtonsIn;
  popModal = deps.popModal;
  downloadJsonFile = deps.downloadJsonFile;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  readTextFile = deps.readTextFile;
  parseJsoncRecord = deps.parseJsoncRecord;
  getJsonLikeErrorMessage = deps.getJsonLikeErrorMessage;
  downloadAiPromptFile = deps.downloadAiPromptFile;
  validateJsoncEditorConfig = deps.validateJsoncEditorConfig;
}
  // ========================================
  // 属性预设管理面板
  // ========================================

  const showAttributePresetManager = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showAttributePresetManager', showAttributePresetManager);

    const config = getConfig();
    const presets = AttributePresetManager.getAllPresets();
    const activeId = Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null);

    // 生成默认规则项HTML（当activeId为null时启用）
    const isDefaultActive = activeId === null;
    const defaultPresetHtml = `
      <div class="acu-preset-item" data-id="__default__">
        <div class="acu-preset-info">
          <div class="acu-preset-name">
            六维属性百分制
            <span class="acu-preset-badge">默认</span>
          </div>
          <div class="acu-preset-desc">使用百分制生成六维基础属性（力量、敏捷、体质、智力、感知、魅力），范围5-95</div>
          <div class="acu-preset-stats">
            基础属性: 6 | 特别属性: 0
          </div>
        </div>
          <div class="acu-preset-actions">
            <label class="acu-toggle">
              <input type="checkbox" class="acu-preset-toggle" data-id="__default__" ${isDefaultActive ? 'checked' : ''}>
              <span class="acu-toggle-slider"></span>
            </label>
            <button type="button" class="acu-preset-btn acu-preset-copy" data-id="__default__" title="复制为属性预设" aria-label="复制为属性预设"><i class="fa-solid fa-copy"></i></button>
            <button type="button" class="acu-preset-btn acu-preset-export" data-id="__default__" title="导出" aria-label="导出属性预设"><i class="fa-solid fa-download"></i></button>
          </div>
        </div>
    `;

    // 生成预设列表HTML
    const presetsHtml = presets
      .map(preset => {
        const isActive = preset.id === activeId;
        const isBuiltin = preset.builtin;

        return `
        <div class="acu-preset-item" data-id="${escapeHtml(preset.id)}">
          <div class="acu-preset-info">
            <div class="acu-preset-name">
              ${escapeHtml(preset.name)}
              ${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}
            </div>
            ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
            <div class="acu-preset-stats">
              基础属性: ${preset.baseAttributes.length} | 特别属性: ${preset.specialAttributes?.length || 0}
            </div>
          </div>
          <div class="acu-preset-actions">
            <label class="acu-toggle">
              <input type="checkbox" class="acu-preset-toggle" data-id="${escapeHtml(preset.id)}" ${isActive ? 'checked' : ''}>
              <span class="acu-toggle-slider"></span>
            </label>
            ${
              isBuiltin
                ? `<button type="button" class="acu-preset-btn acu-preset-copy" data-id="${escapeHtml(preset.id)}" title="复制为属性预设" aria-label="复制为属性预设"><i class="fa-solid fa-copy"></i></button>`
                : `<button type="button" class="acu-preset-btn acu-preset-edit" data-id="${escapeHtml(preset.id)}" title="编辑" aria-label="编辑属性预设"><i class="fa-solid fa-pen"></i></button>`
            }
            <button type="button" class="acu-preset-btn acu-preset-export" data-id="${escapeHtml(preset.id)}" title="导出" aria-label="导出属性预设"><i class="fa-solid fa-download"></i></button>
            ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete" data-id="${escapeHtml(preset.id)}" title="删除" aria-label="删除属性预设"><i class="fa-solid fa-trash"></i></button>` : ''}
          </div>
        </div>
      `;
      })
      .join('');

    // 合并默认规则和预设列表
    const allPresetsHtml = defaultPresetHtml + presetsHtml;

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-attribute-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-dice-d20"></i> 属性预设
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('attributePresetManager', '查看属性预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭属性预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-presets-list">
              ${allPresetsHtml || `<div style="text-align: center; padding: 40px; color: var(--acu-text-sub);">暂无属性预设</div>`}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button type="button" id="acu-preset-new" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建属性预设" aria-label="新建属性预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button type="button" id="acu-preset-import" class="acu-dialog-btn">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button type="button" id="acu-preset-back" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>

          <input type="file" id="acu-preset-file-input" class="acu-advanced-preset-file-input" accept="${JSONC_FILE_ACCEPT}" />
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn, #acu-preset-back').on('click', () => {
      overlay.remove();
      popModal();
    });

    // Toggle切换预设激活状态
    overlay.on('change', '.acu-preset-toggle', function () {
      const $toggle = $(this);
      const id = $toggle.data('id');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        // 激活该预设（如果是默认规则，id为"__default__"，需要设置为null）
        const finalId = id === '__default__' ? null : id;
        AttributePresetManager.setActivePreset(finalId);

        // 将其他所有toggle设置为未选中状态（确保只有一个激活）
        overlay.find('.acu-preset-toggle').each(function () {
          const $thisToggle = $(this);
          const thisId = $thisToggle.data('id');
          if (thisId !== id) {
            $thisToggle.prop('checked', false);
          }
        });
      } else {
        // 取消激活（设置为null，使用默认规则）
        AttributePresetManager.setActivePreset(null);
      }
    });

    // 编辑预设
    overlay.on('click', '.acu-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      showAttributePresetEditor(id);
    });

    // 导出预设
    overlay.on('click', '.acu-preset-export', function () {
      const id = $(this).data('id');

      let json;
      let filename;

      if (id === '__default__') {
        // 导出默认预设（六维属性百分制）
        const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];
        const defaultPresetData = {
          format: 'acu_attr_preset_v1',
          version: PRESET_FORMAT_VERSION,
          id: 'default_percentile',
          name: '六维属性百分制',
          description: '使用百分制生成六维基础属性（力量、敏捷、体质、智力、感知、魅力），范围5-95',
          quickSelect: ATTRIBUTE_QUICK_SELECT_DEFAULT,
          baseAttributes: STANDARD_ATTRS.map(name => ({
            name,
            formula: '3d6*5',
            range: [15, 90],
            modifier: '1d10-5',
          })),
          specialAttributes: [],
        };
        json = JSON.stringify(defaultPresetData, null, 2);
        filename = `acu_preset_六维属性百分制_${Date.now()}.json`;
      } else {
        json = AttributePresetManager.exportPreset(id);
        if (!json) {
          if (window.toastr) showActionableErrorToast('导出失败', { title: '属性预设导出失败', suggestion: 'importExport' });
          return;
        }
        const preset = presets.find(p => p.id === id);
        filename = `acu_preset_${preset?.name || id}_${Date.now()}.json`;
      }

      downloadJsonFile(json, filename);
    });

    // 删除预设
    overlay.on('click', '.acu-preset-delete', async function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除属性预设',
        message: `确定要删除预设「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = AttributePresetManager.deletePreset(id);
        if (success) {
          overlay.remove();
          showAttributePresetManager();
        } else {
          if (window.toastr) showActionableErrorToast('删除失败', { title: '属性预设删除失败', suggestion: 'save' });
        }
      }
    });

    // 复制预设为自定义预设
    overlay.on('click', '.acu-preset-copy', function () {
      const id = $(this).data('id');

      let copyData;
      if (id === '__default__') {
        // 复制默认预设（六维属性百分制）
        // 使用与内置预设相同的数据结构：formula + range + modifier
        const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];
        copyData = {
          name: '六维属性百分制 (副本)',
          description: '使用百分制生成六维基础属性（力量、敏捷、体质、智力、感知、魅力），范围5-95',
          quickSelect: ATTRIBUTE_QUICK_SELECT_DEFAULT,
          baseAttributes: STANDARD_ATTRS.map(name => ({
            name,
            formula: '3d6*5',
            range: [15, 90],
            modifier: '1d10-5',
          })),
          specialAttributes: [],
        };
      } else {
        // 复制内置预设
        const preset = presets.find(p => p.id === id);
        if (!preset) return;

        copyData = {
          name: preset.name + ' (副本)',
          description: preset.description || '',
          quickSelect: JSON.parse(JSON.stringify(preset.quickSelect || ATTRIBUTE_QUICK_SELECT_DEFAULT)),
          baseAttributes: JSON.parse(JSON.stringify(preset.baseAttributes)),
          specialAttributes: JSON.parse(JSON.stringify(preset.specialAttributes || [])),
        };
      }

      const newPreset = AttributePresetManager.createPreset(copyData);
      if (newPreset) {
        if (window.toastr) window.toastr.success(`已创建副本：${newPreset.name}`);
        overlay.remove();
        showAttributePresetManager(); // 刷新列表
      }
    });

    // 新建预设
    overlay.find('#acu-preset-new').on('click', () => {
      overlay.remove();
      showAttributePresetEditor();
    });

    // 导入预设
    overlay.find('#acu-preset-import').on('click', () => {
      overlay.find('#acu-preset-file-input').click();
    });

    overlay.find('#acu-preset-file-input').on('change', function (e) {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;

      void (async () => {
        try {
          const jsonStr = await readTextFile(file);
          if (!jsonStr?.trim()) return;

          // 先解析 JSONC 获取预设名称，检查是否有同名预设
          let parsedData: Record<string, unknown>;
          try {
            parsedData = parseJsoncRecord(jsonStr.trim(), '属性预设');
          } catch (error) {
            console.error('[DICE]ACU 属性预设 JSONC 解析失败:', error);
            if (window.toastr) showActionableErrorToast('JSONC 格式无效', { suggestion: 'importExport' });
            return;
          }

          const importingName =
            typeof parsedData.name === 'string' && parsedData.name.trim() ? parsedData.name.trim() : '导入的预设';
          const existingPresets = AttributePresetManager.getAllPresets();
          const existingNames = existingPresets.map(p => p.name);
          const hasConflict = existingNames.includes(importingName);

          // 执行导入的函数
          const doImport = (overwrite: boolean, newName?: string) => {
            // 如果需要重命名，修改JSON中的名称
            let finalJson = jsonStr.trim();
            if (newName) {
              parsedData.name = newName;
              // 同时生成新的ID避免ID冲突
              parsedData.id = `attr_preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              finalJson = JSON.stringify(parsedData);
            }

            // 如果是覆盖模式且存在同名预设，先删除旧预设
            if (overwrite && hasConflict) {
              const existingPreset = existingPresets.find(p => p.name === importingName);
              if (existingPreset && !existingPreset.builtin) {
                AttributePresetManager.deletePreset(existingPreset.id);
              }
            }

            const imported = AttributePresetManager.importPreset(finalJson);
            if (imported) {
              overlay.remove();
              showAttributePresetManager();
            } else {
              if (window.toastr) showActionableErrorToast('导入失败：格式不正确', { suggestion: 'importExport' });
            }
          };

          // 如果有冲突，显示冲突处理弹窗
          if (hasConflict) {
            showPresetConflictDialog({
              presetName: importingName,
              presetType: '属性预设',
              existingNames,
              onOverwrite: () => doImport(true),
              onRename: newName => doImport(false, newName),
              onCancel: () => {},
            });
          } else {
            // 无冲突，直接导入
            doImport(false);
          }
        } catch (err) {
          console.error('[DICE]ACU 导入预设失败:', err);
          if (window.toastr) showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(err), { suggestion: 'importExport' });
        } finally {
          input.value = '';
        }
      })();
    });

    // 点击遮罩关闭
    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };

  // 规则预设编辑器
  const buildNewAttributePresetJsoncTemplate = (): string => `{
  // 这里只填写属性配置本体；预设名称和描述在上方输入框填写。
  // baseAttributes：基础属性，会作为表格生成和属性快捷选择的主要属性池。
  "baseAttributes": [
    {
      // name：属性显示名，也会作为快捷检定按钮和提示词里的属性名。
      "name": "力量",

      // formula：生成属性值时使用的骰子表达式，支持 3d6、3d6*5、4d6kh3、1d10-5 等。
      "formula": "3d6",

      // range：属性合理范围，用于提示词约束和结果检查。
      "range": [3, 18],

      // modifier：可选，属性微调用的随机修正表达式；不需要时可以删除。
      "modifier": "1d4-2"
    },
    {
      "name": "敏捷",
      "formula": "3d6",
      "range": [3, 18],
      "modifier": "1d4-2"
    },
    {
      "name": "体质",
      "formula": "3d6",
      "range": [3, 18],
      "modifier": "1d4-2"
    }
  ],

  // specialAttributes：技能、派生属性或世界观专属属性；没有时保留空数组。
  "specialAttributes": [
    {
      "name": "幸运",
      "formula": "3d6",
      "range": [3, 18]
    }
  ],

  // quickSelect：点击属性快捷检定时，属性值默认填入哪个检定字段。
  // 可选目标：attribute（主属性/技能值）、skillMod（技能加值）、mod（临时修正）。
  "quickSelect": {
    "baseTarget": "attribute",
    "specialTarget": "attribute",
    "fallbackTarget": "attribute",

    // nameTargetMapping：少数属性名需要填入不同字段时在这里覆盖。
    "nameTargetMapping": {
      "skillMod": ["幸运"]
    }
  }
}`;

  const showAttributePresetEditor = (presetId = null) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showAttributePresetEditor', () => showAttributePresetEditor(presetId));

    const config = getConfig();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? AttributePresetManager.getAllPresets().find(p => p.id === presetId) : null;

    const buildAttributePresetAgentPrompt = (): string => attributePresetAgentPromptTemplate;
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
      quickSelect: normalizeAttributeQuickSelectConfig(existingPreset?.quickSelect),
    };

    const parseAttributePresetEditorConfig = (
      jsonText: string,
    ): {
      quickSelect: NormalizedAttributeQuickSelectConfig;
      baseAttributes: AttributePresetAttributeDef[];
      specialAttributes: AttributePresetAttributeDef[];
    } => {
      const data = parseJsoncRecord(jsonText, '属性预设配置');
      if (!Array.isArray(data.baseAttributes) || data.baseAttributes.length === 0) {
        throw new Error('基本属性不能为空');
      }
      const specialAttributes = Array.isArray(data.specialAttributes) ? data.specialAttributes : [];
      return {
        quickSelect: normalizeAttributeQuickSelectConfig(
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
              ${getTutorialButtonHtml('attributePresetEditor', '查看新建属性预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭属性预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="preset-name">属性预设名称</label>
                <input id="preset-name" type="text" value="${escapeHtml(defaultData.name)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="preset-desc">描述</label>
                <input id="preset-desc" type="text" value="${escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" />
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
    bindTutorialButtonsIn(overlay);

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
      $jsonTextarea.val(buildNewAttributePresetJsoncTemplate());
    }

    // 关闭
    overlay.find('.acu-close-btn, #preset-cancel').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.find('#preset-download-ai-prompt').on('click', () => {
      const promptText = buildAttributePresetAgentPrompt();
      const presetName = String(overlay.find('#preset-name').val() || defaultData.name || 'attribute_preset');
      const filename = buildAttributePresetAgentPromptFilename(presetName);
      downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#preset-validate').on('click', () => {
      const name = String(overlay.find('#preset-name').val() || '').trim();
      if (!name) {
        if (window.toastr) window.toastr.warning('请输入属性预设名称');
        return;
      }
      validateJsoncEditorConfig({
        text: String($jsonTextarea.val() || ''),
        parse: parseAttributePresetEditorConfig,
        successMessage: parsed =>
          `配置有效：${name}，基础属性 ${parsed.baseAttributes.length} 项，特殊属性 ${parsed.specialAttributes.length} 项`,
        errorMessage: error => '验证失败：' + getJsonLikeErrorMessage(error),
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
          AttributePresetManager.updatePreset(presetId, preset);
        } else {
          AttributePresetManager.createPreset(preset);
        }

        overlay.remove();
        popModal();
      } catch (err) {
        console.error('[DICE]ACU 保存预设失败:', err);
        if (window.toastr) showActionableErrorToast('保存失败：' + getJsonLikeErrorMessage(err), { suggestion: 'save' });
      }
    });

    // 点击遮罩关闭
    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };
export {
  showAttributePresetManager,
  buildNewAttributePresetJsoncTemplate,
  showAttributePresetEditor,
}; // __wireShowAttributePresetManagerDeps 已由头部 export function 导出
