// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=39「交互规则预设管理」
// 原行范围：46641-47136（含 banner 46638-47136）；拆分批次 8；外部 closure 依赖：18（getCore@29 / pushModal@29 / getConfig@30 / ActionPresetManager@26 / escapeHtml@3 / getTutorialButtonHtml@30 / popModal@29 / showActionableErrorToast(import) / downloadJsonFile@29 / showDiceSystemConfirmDialog@29 / pickTextFile@29 / getJsonLikeErrorMessage@29 / setupOverlayClose@3 / parseJsoncValue@29 / isRecordValue@29 / buildActionPresetAgentPrompt@24 / buildActionPresetAgentPromptFilename@38 / downloadAiPromptFile@29 / validateJsoncEditorConfig@29）
// 接线说明：ActionPresetManager 已拆至 presets/interaction-rule-preset.ts、escapeHtml/setupOverlayClose 已拆至 favorites/bookmark-manager.ts、
//   buildActionPresetAgentPrompt 已拆至 presets/advanced-dice-preset-manager.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   getCore/pushModal/popModal/downloadJsonFile/showDiceSystemConfirmDialog/pickTextFile/getJsonLikeErrorMessage/parseJsoncValue/isRecordValue/downloadAiPromptFile/validateJsoncEditorConfig@29、getConfig/getTutorialButtonHtml@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   （buildActionPresetAgentPromptFilename@38 批次 9A 起由本文件直连 import presets/advanced-dice-preset-ui）
//   index.ts IIFE 末尾调用 __wireShowActionPresetManagerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { ActionPresetManager } from './interaction-rule-preset';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';
import { buildActionPresetAgentPrompt } from './advanced-dice-preset-manager';
import { buildActionPresetAgentPromptFilename } from './advanced-dice-preset-ui'; // 批次 9A：idx 38 拆出后由 __wire 改直连 import

let getCore = null;
let pushModal = null;
let getConfig = null;
let getTutorialButtonHtml = null;
let popModal = null;
let downloadJsonFile = null;
let showDiceSystemConfirmDialog = null;
let pickTextFile = null;
let getJsonLikeErrorMessage = null;
let parseJsoncValue = null;
let isRecordValue = null;
let downloadAiPromptFile = null;
let validateJsoncEditorConfig = null;

export function __wireShowActionPresetManagerDeps(deps) {
  getCore = deps.getCore;
  pushModal = deps.pushModal;
  getConfig = deps.getConfig;
  getTutorialButtonHtml = deps.getTutorialButtonHtml;
  popModal = deps.popModal;
  downloadJsonFile = deps.downloadJsonFile;
  showDiceSystemConfirmDialog = deps.showDiceSystemConfirmDialog;
  pickTextFile = deps.pickTextFile;
  getJsonLikeErrorMessage = deps.getJsonLikeErrorMessage;
  parseJsoncValue = deps.parseJsoncValue;
  isRecordValue = deps.isRecordValue;
  downloadAiPromptFile = deps.downloadAiPromptFile;
  validateJsoncEditorConfig = deps.validateJsoncEditorConfig;
}
  // ========================================
  // 交互规则预设管理
  // ========================================
  const showActionPresetManager = () => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showActionPresetManager', showActionPresetManager);

    const config = getConfig();
    const presets = ActionPresetManager.getAllPresets();
    const activeId = ActionPresetManager.getActivePresetId();

    // 生成预设列表HTML
    const presetsHtml =
      presets.length === 0
        ? `<div class="acu-empty-state">暂无交互规则预设，点击下方按钮创建</div>`
        : presets
            .map(preset => {
              const isActive = preset.id === activeId;
              const isBuiltin = preset.builtin === true;
              const keywordsSummary =
                (preset.rules || [])
                  .flatMap(r => r.table_keywords || [])
                  .slice(0, 3)
                  .join('、') || '无';
              const actionsSummary =
                (preset.rules || [])
                  .flatMap(r => (r.actions || []).map(a => a.label))
                  .slice(0, 4)
                  .join('、') || '无';

              return `
          <div class="acu-preset-item" data-id="${escapeHtml(preset.id)}">
            <div class="acu-preset-info">
              <div class="acu-preset-name">${escapeHtml(preset.name)}${isBuiltin ? `<span class="acu-preset-badge">内置</span>` : ''}</div>
              ${preset.description ? `<div class="acu-preset-desc">${escapeHtml(preset.description)}</div>` : ''}
              <div class="acu-preset-stats">
                关键词: ${escapeHtml(keywordsSummary)} | 动作: ${escapeHtml(actionsSummary)}
              </div>
            </div>
            <div class="acu-preset-actions">
              <label class="acu-toggle">
                <input type="checkbox" class="acu-action-preset-toggle" data-id="${escapeHtml(preset.id)}" ${isActive ? 'checked' : ''} aria-label="启用 ${escapeHtml(preset.name)}">
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                isBuiltin
                  ? `<button type="button" class="acu-preset-btn acu-action-preset-copy" data-id="${escapeHtml(preset.id)}" title="复制为交互规则预设" aria-label="复制 ${escapeHtml(preset.name)} 为交互规则预设"><i class="fa-solid fa-copy"></i></button>`
                  : `<button type="button" class="acu-preset-btn acu-action-preset-edit" data-id="${escapeHtml(preset.id)}" title="编辑" aria-label="编辑 ${escapeHtml(preset.name)}"><i class="fa-solid fa-pen"></i></button>`
              }
              <button type="button" class="acu-preset-btn acu-action-preset-export" data-id="${escapeHtml(preset.id)}" title="导出" aria-label="导出 ${escapeHtml(preset.name)}"><i class="fa-solid fa-download"></i></button>
              ${!isBuiltin ? `<button type="button" class="acu-preset-btn acu-preset-delete acu-action-preset-delete" data-id="${escapeHtml(preset.id)}" title="删除" aria-label="删除 ${escapeHtml(preset.name)}"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </div>
        `;
            })
            .join('');

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-action-preset-manager-dialog acu-advanced-preset-manager-dialog acu-theme-${config.theme}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-wand-magic-sparkles"></i> 交互规则预设管理
            </h3>
            <div class="acu-advanced-preset-header-actions">
              ${getTutorialButtonHtml('actionPresetManager', '查看交互规则预设管理教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭交互规则预设管理" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-body">
            <div id="acu-action-presets-list">
              ${presetsHtml}
            </div>
          </div>

          <div class="acu-advanced-preset-footer">
            <button id="acu-action-preset-new" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-footer-main" title="新建交互规则预设" aria-label="新建交互规则预设">
              <i class="fa-solid fa-plus"></i> 新建
            </button>
            <button id="acu-action-preset-import" type="button" class="acu-dialog-btn acu-advanced-preset-footer-main">
              <i class="fa-solid fa-file-import"></i> 导入
            </button>
            <button id="acu-action-preset-back" type="button" class="acu-dialog-btn">
              <i class="fa-solid fa-arrow-left"></i> 返回
            </button>
          </div>
        </div>
      </div>
    `);

    $('body').append(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn, #acu-action-preset-back').on('click', () => {
      overlay.remove();
      popModal();
    });

    // Toggle切换预设激活状态（单选）
    overlay.on('change', '.acu-action-preset-toggle', function () {
      const $toggle = $(this);
      const id = $toggle.data('id');
      const isChecked = $toggle.is(':checked');

      if (isChecked) {
        ActionPresetManager.setActivePresetId(id);
        // 取消其他toggle
        overlay.find('.acu-action-preset-toggle').each(function () {
          if ($(this).data('id') !== id) {
            $(this).prop('checked', false);
          }
        });
      } else {
        // 只有当取消的是当前激活的预设时，才清空
        if (ActionPresetManager.getActivePresetId() === id) {
          ActionPresetManager.setActivePresetId(null);
          if (window.toastr) window.toastr.info('所有交互规则已禁用');
        }
      }
    });

    // 编辑预设
    overlay.on('click', '.acu-action-preset-edit', function () {
      const id = $(this).data('id');
      overlay.remove();
      showActionPresetEditor(id);
    });

    // 导出预设 - 下载为JSON文件
    overlay.on('click', '.acu-action-preset-export', function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);
      const json = ActionPresetManager.exportPreset(id);
      if (!json) {
        if (window.toastr) showActionableErrorToast('导出失败', { title: '动作预设导出失败', suggestion: 'importExport' });
        return;
      }

      downloadJsonFile(json, `${preset?.name || '交互规则预设'}.json`);
      if (window.toastr) window.toastr.success('已导出文件');
    });

    // 复制内置预设为自定义预设
    overlay.on('click', '.acu-action-preset-copy', function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);
      if (!preset) return;

      const copyData = {
        name: preset.name + ' (副本)',
        description: preset.description || '',
        rules: JSON.parse(JSON.stringify(preset.rules)),
      };

      const newPreset = ActionPresetManager.createPreset(copyData);
      if (newPreset) {
        if (window.toastr)
          window.toastr.success(`已创建副本：${newPreset.name}，包含 ${newPreset.rules.length} 个规则组`);
        overlay.remove();
        showActionPresetManager(); // 刷新列表而不是打开编辑器
      }
    });

    // 删除预设
    overlay.on('click', '.acu-action-preset-delete', async function () {
      const id = $(this).data('id');
      const preset = presets.find(p => p.id === id);

      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除交互规则预设',
        message: `确定要删除交互规则预设「${preset?.name || '未命名预设'}」吗？`,
        detail: '删除后需要重新导入或手动创建才能恢复。',
        iconClass: 'fa-trash',
        confirmText: '删除预设',
        cancelText: '取消',
        tone: 'danger',
      });
      if (confirmed) {
        const success = ActionPresetManager.deletePreset(id);
        if (success) {
          overlay.remove();
          showActionPresetManager();
        } else {
          if (window.toastr) showActionableErrorToast('删除失败', { title: '动作预设删除失败', suggestion: 'save' });
        }
      }
    });

    // 新建预设
    overlay.find('#acu-action-preset-new').on('click', () => {
      overlay.remove();
      showActionPresetEditor();
    });

    // 导入预设 - 选择 JSON/JSONC 文件上传
    overlay.find('#acu-action-preset-import').on('click', () => {
      void (async () => {
        const selected = await pickTextFile();
        if (!selected) return;
        try {
          const jsonStr = selected.text;
          if (!jsonStr?.trim()) {
            if (window.toastr) showActionableErrorToast('文件内容为空', { suggestion: 'importExport' });
            return;
          }

          const result = ActionPresetManager.importPreset(jsonStr.trim());
          if (result) {
            if (window.toastr) window.toastr.success(`导入成功：${result.name}`);
            overlay.remove();
            showActionPresetManager();
          } else {
            if (window.toastr) showActionableErrorToast('导入失败，请检查 JSONC 格式', { suggestion: 'importExport' });
          }
        } catch (error) {
          console.error('[DICE]ACU 交互规则导入失败:', error);
          if (window.toastr) showActionableErrorToast('导入失败: ' + getJsonLikeErrorMessage(error), { suggestion: 'importExport' });
        }
      })();
    });

    // 点击遮罩关闭
    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };

  const buildNewActionPresetRulesJsoncTemplate = (): string => `[
  // 这里填写规则数组；每个规则组按表名关键词匹配一类表格。
  {
    // table_keywords：表名中包含任意关键词时，这组 actions 会显示在该表的条目上。
    "table_keywords": ["地点", "地图", "场所"],

    // actions：匹配后显示的快捷按钮。至少需要一个动作。
    "actions": [
      {
        // label：按钮文字，必填，建议短一些。
        "label": "前往",

        // icon：可选 Font Awesome 图标 class；不填时使用默认按钮样式。
        "icon": "fa-location-arrow",

        // template：点击按钮后写入输入框的文本；{Name} 会替换为当前条目的名称。
        "template": "<user>前往{Name}。"
      },
      {
        "label": "调查",
        "icon": "fa-magnifying-glass",
        "template": "<user>仔细调查{Name}的情况。"
      }
    ]
  },
  {
    // 同一预设可以包含多个规则组；后续规则不会覆盖前面的规则，而是按命中的表格一起提供动作。
    "table_keywords": ["人物", "NPC", "角色"],
    "actions": [
      {
        // template 可以使用 <user>、{Name} 和普通文本；复杂提示词建议保持一句话可读。
        "label": "交谈",
        "icon": "fa-comments",
        "template": "<user>与{Name}交谈。"
      },
      {
        "label": "观察",
        "icon": "fa-eye",
        "template": "<user>观察{Name}。"
      }
    ]
  }
]`;

  // 交互规则编辑器（JSON配置风格）
  const showActionPresetEditor = (presetId?: string) => {
    const { $ } = getCore();
    $('.acu-edit-overlay').remove();
    pushModal('showActionPresetEditor', () => showActionPresetEditor(presetId));

    const config = getConfig();
    const isEdit = !!presetId;
    const existingPreset = isEdit ? ActionPresetManager.getPresetById(presetId) : null;

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
      const rules = parseJsoncValue(jsonStr);
      if (!Array.isArray(rules) || rules.length === 0) {
        throw new Error('规则不能为空，需要至少一个规则');
      }

      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (!isRecordValue(rule)) {
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
          if (!isRecordValue(action)) {
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
              ${getTutorialButtonHtml('actionPresetEditor', '查看新建交互规则预设教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭交互规则预设编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

          <div class="acu-advanced-preset-editor-body">
            <div class="acu-advanced-preset-editor-fields">
              <div class="acu-advanced-preset-field">
                <label for="action-preset-name">预设名称</label>
                <input id="action-preset-name" type="text" value="${escapeHtml(defaultData.name)}" class="acu-preset-editor-input" />
              </div>

              <div class="acu-advanced-preset-field">
                <label for="action-preset-desc">描述</label>
                <input id="action-preset-desc" type="text" value="${escapeHtml(defaultData.description)}" placeholder="可选" class="acu-preset-editor-input" />
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
    $jsonTextarea.val(isEdit ? JSON.stringify(defaultData.rules, null, 2) : buildNewActionPresetRulesJsoncTemplate());

    // 关闭
    overlay.find('.acu-close-btn, #action-preset-cancel').on('click', () => {
      overlay.remove();
      popModal();
    });

    overlay.find('#action-preset-download-ai-prompt').on('click', () => {
      const promptText = buildActionPresetAgentPrompt();
      const presetName = String(overlay.find('#action-preset-name').val() || defaultData.name || 'action_preset');
      const filename = buildActionPresetAgentPromptFilename(presetName);
      downloadAiPromptFile(promptText, filename);
      if (window.toastr) window.toastr.success('已下载 AI 提示词');
    });

    overlay.find('#action-preset-validate').on('click', () => {
      validateJsoncEditorConfig({
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
          ActionPresetManager.updatePreset(presetId, { name, description, rules });
          if (window.toastr) window.toastr.success('交互规则预设已更新');
        } else {
          // 创建新预设
          ActionPresetManager.createPreset({ name, description, rules });
          if (window.toastr) window.toastr.success('交互规则预设已创建');
        }

        overlay.remove();
        popModal();
      } catch (e) {
        if (window.toastr) showActionableErrorToast('JSONC 格式错误: ' + getJsonLikeErrorMessage(e), { suggestion: 'importExport' });
      }
    });

    // 点击遮罩关闭
    setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      popModal();
    });
  };
export {
  showActionPresetManager,
  buildNewActionPresetRulesJsoncTemplate,
  showActionPresetEditor,
}; // __wireShowActionPresetManagerDeps 已由头部 export function 导出
