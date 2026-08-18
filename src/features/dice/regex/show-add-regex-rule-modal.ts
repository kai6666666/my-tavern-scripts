// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=43「showAddRegexRuleModal - 新建/编辑表格正则规则弹窗 (Phase 4.2)」
// 原行范围：48189-48423（含 banner 48186-48423 与 showAddRegexRuleModal 全局暴露行；showDebugConsoleModal 暴露行 48425-48426 留在 index.ts）；拆分批次 4；外部 closure 依赖：10（getCore@29 / getConfig@30 / RegexTransformationManager@13 / cachedRawData@29 / getTableData@30 / escapeHtml@3 / showActionableErrorToast(import) / RegexTransformationEngine@15 / refreshRegexRulesList@32 / setupOverlayClose@3）
// 接线说明：RegexTransformationManager@13、refreshRegexRulesList@32、RegexTransformationEngine@15 均已在 regex/ 拆出（均不引用本文件，无循环），直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast（index.ts 既有 import，该模块不引用本文件，无循环）；
//   getCore/cachedRawData@29、getConfig/getTableData@30、escapeHtml/setupOverlayClose@3 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireShowAddRegexRuleModalDeps({ getCore, getConfig, cachedRawData, getTableData, escapeHtml, setupOverlayClose }) 注入；
//   未注入时模块级引用为 null（函数仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { RegexTransformationEngine } from './regex-transformation-engine';
import { refreshRegexRulesList } from './regex-list-refresh';
import { RegexTransformationManager } from './regex-transformation-manager';
import type { RegexScopeConfig, RegexScopeType } from './regex-types';

let getCore = null;
let getConfig = null;
let cachedRawData = null;
let getTableData = null;
let escapeHtml = null;
let setupOverlayClose = null;

export function __wireShowAddRegexRuleModalDeps(deps) {
  getCore = deps.getCore;
  getConfig = deps.getConfig;
  cachedRawData = deps.cachedRawData;
  getTableData = deps.getTableData;
  escapeHtml = deps.escapeHtml;
  setupOverlayClose = deps.setupOverlayClose;
}
  // ========================================
  // showAddRegexRuleModal - 新建/编辑表格正则规则弹窗 (Phase 4.2)
  // ========================================
  const showAddRegexRuleModal = (editRuleId?: string) => {
    const { $ } = getCore();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;

    // 获取要编辑的规则(如果有)
    const editRule = editRuleId ? RegexTransformationManager.getRule(editRuleId) : null;

    // 获取所有表格名
    const tableData = cachedRawData || getTableData();
    const tableNames = Object.keys(tableData || {})
      .filter(k => k.startsWith('sheet_'))
      .map(k => tableData[k]?.name || k)
      .sort();

    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay">
        <div class="acu-edit-dialog acu-validation-modal acu-validation-rule-editor-dialog ${currentThemeClass}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-table-list"></i> ${editRule ? '编辑验证规则' : '新建验证规则'}
            </h3>
            <div class="acu-advanced-preset-header-actions">
              <button type="button" class="acu-close-btn" id="acu-close-regex-rule" aria-label="关闭验证规则编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-validation-modal-body">
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">规则名称 *</span></div>
              <input type="text" id="rule-name" class="acu-panel-input" value="${editRule ? escapeHtml(editRule.name) : ''}" placeholder="例如: 清理多余空格" style="flex:1;" required>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">规则描述</span></div>
              <textarea id="rule-description" class="acu-panel-input" placeholder="输入规则介绍" style="flex:1; resize: none; overflow-wrap: break-word; overflow-y: hidden; min-height: 34px; height: 34px; line-height: 1.4;">${editRule ? escapeHtml(editRule.description || '') : ''}</textarea>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">匹配模式 *</span></div>
              <input type="text" id="rule-pattern" class="acu-panel-input" value="${editRule ? escapeHtml(editRule.pattern) : ''}" placeholder="例如: \\s+ 或 /test/g" style="flex:1; font-family: monospace;" required>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">替换内容</span></div>
              <input type="text" id="rule-replacement" class="acu-panel-input" value="${editRule ? escapeHtml(editRule.replacement || '') : ''}" placeholder="留空表示删除,或使用 $1, $2 等捕获组" style="flex:1; font-family: monospace;">
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">作用范围 *</span></div>
              <select id="rule-scope-type" class="acu-setting-select" style="width:120px;">
                <option value="global" ${editRule?.scope?.type === 'global' ? 'selected' : ''}>全局</option>
                <option value="table" ${editRule?.scope?.type === 'table' ? 'selected' : ''}>表级</option>
                <option value="column" ${editRule?.scope?.type === 'column' ? 'selected' : ''}>列级</option>
              </select>
            </div>
            <div class="acu-setting-row" id="field-table-names" style="display: ${editRule?.scope?.type === 'global' ? 'none' : 'flex'};">
              <div class="acu-setting-info"><span class="acu-setting-label">表格名 (多个用逗号分隔)</span></div>
              <input type="text" id="rule-table-names" class="acu-panel-input" value="${editRule?.scope?.tableNames?.join(',') || ''}" placeholder="例如: 物品表,装备表" style="flex:1;">
            </div>
            <div class="acu-setting-row" id="field-column-names" style="display: ${editRule?.scope?.type === 'column' ? 'flex' : 'none'};">
              <div class="acu-setting-info"><span class="acu-setting-label">列名 (多个用逗号分隔)</span></div>
              <input type="text" id="rule-column-names" class="acu-panel-input" value="${editRule?.scope?.columnNames?.join(',') || ''}" placeholder="例如: 品质,描述" style="flex:1;">
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">优先级</span></div>
              <input type="number" id="rule-priority" class="acu-panel-input" value="${editRule?.priority || 50}" min="1" max="100" style="width:80px;">
            </div>

          </div>
          <div class="acu-advanced-preset-editor-footer acu-validation-modal-footer">
            <div class="acu-advanced-preset-editor-actions">
              <button id="acu-regex-rule-confirm" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button id="acu-regex-rule-cancel" type="button" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    // 作用域类型变化时显示/隐藏字段
    const updateScopeFields = () => {
      const scopeType = dialog.find('#rule-scope-type').val();
      if (scopeType === 'global') {
        dialog.find('#field-table-names, #field-column-names').hide();
      } else if (scopeType === 'table') {
        dialog.find('#field-table-names').css('display', 'flex').show();
        dialog.find('#field-column-names').hide();
      } else if (scopeType === 'column') {
        dialog.find('#field-table-names, #field-column-names').css('display', 'flex').show();
      }
    };

    dialog.find('#rule-scope-type').on('change', updateScopeFields);

    // Textarea自动调节高度
    const $textarea = dialog.find('#rule-description');
    const autoResizeTextarea = () => {
      // 重置高度以获取正确的scrollHeight
      $textarea.css('height', '34px');
      // 设置为内容高度,最小1行
      const scrollHeight = $textarea[0].scrollHeight;
      $textarea.css('height', Math.max(34, scrollHeight) + 'px');
    };
    // 监听输入事件
    $textarea.on('input', autoResizeTextarea);

    // 保存按钮(原立即替换按钮)
    dialog.find('#acu-regex-rule-confirm').on('click', async function () {
      const name = dialog.find('#rule-name').val();
      const pattern = dialog.find('#rule-pattern').val();
      const scopeType = dialog.find('#rule-scope-type').val();

      if (!name || !pattern) {
        showActionableErrorToast('请填写规则名称和匹配模式');
        return;
      }

      // 构建 scope 配置
      const scope: RegexScopeConfig = { type: scopeType as RegexScopeType };
      if (scopeType !== 'global') {
        const tableNames = dialog.find('#rule-table-names').val();
        if (tableNames)
          scope.tableNames = String(tableNames)
            .split(',')
            .map(s => s.trim())
            .filter(s => s);
      }
      if (scopeType === 'column') {
        const columnNames = dialog.find('#rule-column-names').val();
        if (columnNames)
          scope.columnNames = String(columnNames)
            .split(',')
            .map(s => s.trim())
            .filter(s => s);
      }

      // 从 pattern 中提取内联 flags（如果存在）
      const patternStr = String(pattern);
      const { flags: extractedFlags, patternWithoutFlags } = RegexTransformationEngine._extractFlags(patternStr);

      // 校验正则表达式合法性
      try {
        new RegExp(patternWithoutFlags);
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        showActionableErrorToast(`正则表达式无效: ${errorMsg}`, { title: '保存失败' });
        return;
      }

      // 获取 UI 中的 flags（如果复选框存在）
      const $flagGlobal = dialog.find('#flag-global');
      const $flagIgnoreCase = dialog.find('#flag-ignorecase');
      const $flagMultiline = dialog.find('#flag-multiline');

      const uiFlags = {
        global: $flagGlobal.length > 0 ? $flagGlobal.is(':checked') : false,
        caseInsensitive: $flagIgnoreCase.length > 0 ? $flagIgnoreCase.is(':checked') : false,
        multiline: $flagMultiline.length > 0 ? $flagMultiline.is(':checked') : false,
      };

      // 如果 pattern 包含内联 flags，使用提取后的 pattern 和合并后的 flags
      const finalPattern = patternWithoutFlags !== patternStr ? patternWithoutFlags : patternStr;
      const finalFlags =
        patternWithoutFlags !== patternStr
          ? { ...uiFlags, ...extractedFlags } // 内联 flags 覆盖 UI flags
          : uiFlags; // 没有内联 flags，使用 UI flags

      const ruleData = {
        name: String(name),
        description: dialog.find('#rule-description').val(),
        operation: 'replace', // 固定为替换操作
        pattern: finalPattern, // 使用提取后的 pattern（去除内联 flags）
        flags: finalFlags, // 使用合并后的 flags
        replacement: dialog.find('#rule-replacement').val(),
        scope,
        enabled: true, // 默认启用
        priority: parseInt(dialog.find('#rule-priority').val(), 10),
        executeMode: 'auto', // 所有规则默认自动执行
      };

      // 保存规则
      if (editRuleId) {
        // 更新现有规则
        RegexTransformationManager.updateRule(editRuleId, ruleData);
      } else {
        // 添加新规则
        const newRule = RegexTransformationManager.addCustomRule(ruleData);
        if (newRule) {
          editRuleId = newRule.id;
        }
      }

      // [修复] 关闭当前对话框并刷新规则列表
      dialog.remove();
      $(document).off('keydown.regex-rule-modal'); // 移除ESC键监听
      refreshRegexRulesList(); // 刷新规则列表而不是重渲染整个界面
    });

    // 关闭弹窗的统一函数（注意：不重置 isSettingsOpen，因为设置面板仍在后面打开）
    const closeDialog = () => {
      dialog.remove();
      $(document).off('keydown.regex-rule-modal'); // 移除ESC键监听
    };

    // 取消和关闭按钮（阻止事件冒泡，防止触发设置面板的关闭事件）
    dialog.find('#acu-regex-rule-cancel, #acu-close-regex-rule').on('click', function (e) {
      e.stopPropagation();
      closeDialog();
    });

    // 点击遮罩层关闭
    setupOverlayClose(dialog, 'acu-edit-overlay', closeDialog);

    // ESC 键关闭
    $(document).on('keydown.regex-rule-modal', function (e) {
      if (e.key === 'Escape' && dialog.length && dialog.is(':visible')) {
        e.preventDefault();
        closeDialog();
        $(document).off('keydown.regex-rule-modal'); // 移除事件监听
      }
    });

    $('body').append(dialog);

    // 在DOM完全渲染后调整textarea高度
    requestAnimationFrame(() => {
      const $textarea = dialog.find('#rule-description');
      if ($textarea.length && $textarea[0].scrollHeight > 34) {
        $textarea.css('height', $textarea[0].scrollHeight + 'px');
      }
    });
  };

  // 暴露到全局
  window.showAddRegexRuleModal = showAddRegexRuleModal;
export { showAddRegexRuleModal }; // __wireShowAddRegexRuleModalDeps 已由头部 export function 导出
