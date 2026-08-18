// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=33「新建/编辑数据验证规则弹窗」
// 原行范围：42838-43416（含 banner 42835-43416）；拆分批次 6；外部 closure 依赖：9（getCore@29 / getConfig@30 / cachedRawData@29 / getTableData@30 / processJsonData@30 / ValidationRuleManager@12 / escapeHtml@3 / RULE_TYPE_INFO@9 / setupOverlayClose@3）
// 接线说明：ValidationRuleManager@12 随本批次拆至 preset-manager.ts、RULE_TYPE_INFO@9 已拆至 validation-rule-manager.ts、escapeHtml/setupOverlayClose@3 随本批次拆至 favorites/bookmark-manager.ts、
//   showActionableErrorToast 来自 ../ui/actionable-error-toast（均不引用本文件，无循环）直接 import；
//   getCore/cachedRawData@29、getConfig/getTableData/processJsonData@30 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireShowAddValidationRuleModalDeps({ getCore, getConfig, cachedRawData, getTableData, processJsonData }) 注入；
//   未注入时模块级引用为 null（函数仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { ValidationRuleManager } from './preset-manager';
import { RULE_TYPE_INFO } from './validation-rule-manager';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';

let getCore = null;
let getConfig = null;
let cachedRawData = null;
let getTableData = null;
let processJsonData = null;

export function __wireShowAddValidationRuleModalDeps(deps) {
  getCore = deps.getCore;
  getConfig = deps.getConfig;
  cachedRawData = deps.cachedRawData;
  getTableData = deps.getTableData;
  processJsonData = deps.processJsonData;
}
  // ========================================
  // 新建/编辑数据验证规则弹窗
  // ========================================
  const showAddValidationRuleModal = (parentDialog: JQuery, editRuleId?: string) => {
    const { $ } = getCore();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;

    // 获取所有表名
    const rawData = cachedRawData || getTableData();
    const tables = processJsonData(rawData || {});
    const tableNames = Object.keys(tables);

    // 编辑模式：获取现有规则数据
    const isEditMode = !!editRuleId;
    const existingRule = isEditMode ? ValidationRuleManager.getRule(editRuleId) : null;

    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay" ${isEditMode ? 'style="opacity:0;transition:opacity 0.15s ease-in;"' : ''}>
        <div class="acu-edit-dialog acu-validation-modal acu-validation-rule-editor-dialog ${currentThemeClass}">
          <div class="acu-advanced-preset-header">
            <h3>
              <i class="fa-solid fa-shield-halved"></i> ${isEditMode ? '编辑数据验证规则' : '新建数据验证规则'}
            </h3>
            <div class="acu-advanced-preset-header-actions">
              <button type="button" class="acu-close-btn" id="dlg-rule-close" aria-label="关闭数据验证规则编辑器" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>
          <div class="acu-validation-modal-body">
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">规则名称</span></div>
              <input type="text" id="rule-name" class="acu-panel-input" placeholder="如：物品数量限制" style="flex:1;">
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">目标表格</span></div>
              <select id="rule-table" class="acu-setting-select">
                <option value="">请选择...</option>
                ${tableNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
              </select>
            </div>
            <div class="acu-setting-row" id="row-column">
              <div class="acu-setting-info"><span class="acu-setting-label">目标列</span></div>
              <select id="rule-column" class="acu-setting-select" disabled>
                <option value="">请先选择表格...</option>
              </select>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">规则类型</span></div>
              <select id="rule-type" class="acu-setting-select">
                <optgroup label="── 表级规则 ──">
                  <option value="tableReadonly">表级只读（禁止修改）</option>
                  <option value="rowLimit">行数限制</option>
                  <option value="sequence">序列递增</option>
                </optgroup>
                <optgroup label="── 字段级规则 ──">
                  <option value="required">必填</option>
                  <option value="format">格式验证（正则）</option>
                  <option value="enum">枚举验证（可选值）</option>
                  <option value="numeric">数值范围</option>
                  <option value="relation">关联验证（引用其他表）</option>
                  <option value="keyValue">键值对验证</option>
                </optgroup>
              </select>
            </div>
            <!-- 表级只读无需配置 -->
            <div class="acu-rule-config-section" id="config-tableReadonly">
              <div class="acu-inline-callout acu-inline-callout-warning">
                <i class="fa-solid fa-info-circle" style="color:var(--acu-warning-icon);margin-right:6px;"></i> 启用后,该表将不允许任何修改
              </div>
            </div>
            <!-- 行数限制配置 -->
            <div class="acu-rule-config-section" id="config-rowLimit" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">最少行数</span></div>
                <input type="number" id="cfg-row-min" class="acu-panel-input" placeholder="0" style="width:80px;">
                <div class="acu-setting-info" style="margin-left:16px;"><span class="acu-setting-label">最多行数</span></div>
                <input type="number" id="cfg-row-max" class="acu-panel-input" placeholder="不限" style="width:80px;">
              </div>
            </div>
            <!-- 序列递增配置 -->
            <div class="acu-rule-config-section" id="config-sequence" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">编码前缀</span></div>
                <input type="text" id="cfg-sequence-prefix" class="acu-panel-input" placeholder="如：AM" style="width:120px;">
              </div>
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">起始数字</span></div>
                <input type="number" id="cfg-sequence-start" class="acu-panel-input" placeholder="1" value="1" style="width:120px;">
              </div>
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">配对表（可选）</span></div>
                <select id="cfg-sequence-paired-table" class="acu-setting-select" style="flex:1;">
                  <option value="">无（单表修复）</option>
                  ${tableNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
                </select>
              </div>
              <div class="acu-inline-callout acu-inline-callout-warning" style="margin-top:8px;">
                <i class="fa-solid fa-info-circle" style="color:var(--acu-warning-icon);margin-right:6px;"></i> 检查指定列的值是否从"前缀+起始数字"开始严格递增(如AM0001, AM0002, AM0003...),不可跳号或重复。需要指定目标列。<br>
                <i class="fa-solid fa-link" style="margin-top:4px;display:block;color:var(--acu-warning-icon);margin-right:6px;"></i> 如果设置了配对表,修复时会同时修复两个表的编码,确保相同编码值修复后仍然相同。
              </div>
            </div>
            <!-- 必填无需配置 -->
            <div class="acu-rule-config-section" id="config-required" style="display:none;">
              <div class="acu-inline-callout acu-inline-callout-warning">
                <i class="fa-solid fa-info-circle" style="color:var(--acu-warning-icon);margin-right:6px;"></i> 该字段不能为空
              </div>
            </div>
            <!-- 格式验证配置 -->
            <div class="acu-rule-config-section" id="config-format" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">正则表达式</span></div>
                <input type="text" id="cfg-pattern" class="acu-panel-input" placeholder="如：^AM\\d{3}$" style="flex:1;">
              </div>
            </div>
            <!-- 枚举验证配置 -->
            <div class="acu-rule-config-section" id="config-enum" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">允许的值</span></div>
                <input type="text" id="cfg-values" class="acu-panel-input" placeholder="用逗号分隔，如：进行中,已完成,已失败" style="flex:1;">
              </div>
            </div>
            <!-- 数值范围配置 -->
            <div class="acu-rule-config-section" id="config-numeric" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">最小值</span></div>
                <input type="number" id="cfg-min" class="acu-panel-input" placeholder="0" style="width:80px;">
                <div class="acu-setting-info" style="margin-left:16px;"><span class="acu-setting-label">最大值</span></div>
                <input type="number" id="cfg-max" class="acu-panel-input" placeholder="100" style="width:80px;">
              </div>
            </div>
            <!-- 关联验证配置 -->
            <div class="acu-rule-config-section" id="config-relation" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">关联表格</span></div>
                <select id="cfg-ref-table" class="acu-setting-select">
                  <option value="">请选择...</option>
                  ${tableNames.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join('')}
                </select>
              </div>
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">关联列</span></div>
                <select id="cfg-ref-column" class="acu-setting-select" multiple style="flex:1;min-height:80px;">
                  <option value="">请先选择关联表格...</option>
                </select>
              </div>
              <div class="acu-inline-callout acu-inline-callout-warning" style="margin-top:8px;">
                <i class="fa-solid fa-info-circle" style="color:var(--acu-warning-icon);margin-right:6px;"></i> 可选择多列,任一列匹配即通过验证(OR 逻辑)。使用 Ctrl/Cmd 键可选择多个列。
              </div>
            </div>
            <!-- 键值对验证配置 -->
            <div class="acu-rule-config-section" id="config-keyValue" style="display:none;">
              <div class="acu-setting-row">
                <div class="acu-setting-info"><span class="acu-setting-label">值类型</span></div>
                <select id="cfg-keyvalue-type" class="acu-setting-select">
                  <option value="text">文本型（只验证格式）</option>
                  <option value="numeric">数值型（验证格式和数值范围）</option>
                </select>
              </div>
              <div class="acu-setting-row" id="row-keyvalue-range" style="display:none;">
                <div class="acu-setting-info"><span class="acu-setting-label">最小值</span></div>
                <input type="number" id="cfg-keyvalue-min" class="acu-panel-input" placeholder="0" style="width:80px;">
                <div class="acu-setting-info" style="margin-left:16px;"><span class="acu-setting-label">最大值</span></div>
                <input type="number" id="cfg-keyvalue-max" class="acu-panel-input" placeholder="100" style="width:80px;">
              </div>
              <div class="acu-inline-callout acu-inline-callout-warning" style="margin-top:8px;">
                <i class="fa-solid fa-info-circle" style="color:var(--acu-warning-icon);margin-right:6px;"></i> 格式:键:值;键:值(使用英文标点,自动去除空格)。数值型会验证每个值的范围。
              </div>
            </div>
            <div class="acu-setting-row">
              <div class="acu-setting-info"><span class="acu-setting-label">错误提示</span></div>
              <input type="text" id="rule-error-msg" class="acu-panel-input" placeholder="验证失败时显示的提示信息" style="flex:1;">
            </div>
          </div>
          <div class="acu-advanced-preset-editor-footer acu-validation-modal-footer">
            <div class="acu-advanced-preset-editor-actions">
              <button id="dlg-rule-save" type="button" class="acu-dialog-btn acu-btn-confirm acu-advanced-preset-editor-save">
                <i class="fa-solid fa-check"></i> 保存
              </button>
              <button id="dlg-rule-cancel" type="button" class="acu-dialog-btn">
                <i class="fa-solid fa-times"></i> 取消
              </button>
            </div>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 统一设置select的颜色（当选中空值时显示为灰色）
    const updateSelectColor = $select => {
      const val = $select.val();
      if (!val || val === '') {
        $select.css('color', 'var(--acu-text-sub)');
        $select.css('opacity', '0.7');
      } else {
        $select.css('color', 'var(--acu-text-main)');
        $select.css('opacity', '1');
      }
    };

    // 初始化所有select的颜色
    dialog.find('select').each(function () {
      updateSelectColor($(this));
      $(this).on('change', function () {
        updateSelectColor($(this));
      });
    });

    // 表格选择变化时更新列选项和配对表选项
    dialog.find('#rule-table').on('change', function () {
      const tableName = $(this).val();
      const $colSelect = dialog.find('#rule-column');
      const $pairedTableSelect = dialog.find('#cfg-sequence-paired-table');
      updateSelectColor($(this));

      // 更新配对表选项（排除当前选择的表）
      if ($pairedTableSelect.length > 0) {
        const currentPairedValue = $pairedTableSelect.val();
        $pairedTableSelect.empty();
        $pairedTableSelect.append('<option value="">无（单表修复）</option>');
        tableNames
          .filter(name => name !== tableName)
          .forEach(name => {
            $pairedTableSelect.append(`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`);
          });
        // 如果之前选择的值仍然有效，恢复它
        if (currentPairedValue && currentPairedValue !== tableName) {
          $pairedTableSelect.val(currentPairedValue);
        }
        updateSelectColor($pairedTableSelect);
      }

      if (!tableName || !tables[tableName]) {
        $colSelect.html('<option value="">请先选择表格...</option>').prop('disabled', true);
        updateSelectColor($colSelect);
        return;
      }

      const headers = tables[tableName].headers || [];
      const options = headers
        .filter((h, i) => i > 0 && h) // 跳过索引列
        .map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`)
        .join('');

      $colSelect.html('<option value="">请选择...</option>' + options).prop('disabled', false);
      updateSelectColor($colSelect);
    });

    // 关联表格选择变化时更新关联列选项
    dialog.find('#cfg-ref-table').on('change', function () {
      const refTableName = $(this).val();
      const $refColSelect = dialog.find('#cfg-ref-column');
      updateSelectColor($(this));

      if (!refTableName || !tables[refTableName]) {
        $refColSelect.html('<option value="">请先选择关联表格...</option>').prop('disabled', true);
        updateSelectColor($refColSelect);
        return;
      }

      const headers = tables[refTableName].headers || [];
      const options = headers
        .filter((h, i) => i > 0 && h) // 跳过索引列
        .map(h => `<option value="${escapeHtml(h)}">${escapeHtml(h)}</option>`)
        .join('');

      $refColSelect.html(options).prop('disabled', false);
      updateSelectColor($refColSelect);
    });

    // 规则类型变化时切换配置区域和目标列显示
    dialog.find('#rule-type').on('change', function () {
      const type = $(this).val();
      const typeInfo = RULE_TYPE_INFO[type];
      const isTableRule = typeInfo?.scope === 'table';
      updateSelectColor($(this));

      // 切换配置区域
      dialog.find('.acu-rule-config-section').hide();
      dialog.find('#config-' + type).show();

      // 表级规则隐藏目标列选择（但sequence规则需要目标列）
      if (isTableRule && type !== 'sequence') {
        dialog.find('#row-column').hide();
        dialog.find('#rule-column').val('').prop('disabled', true);
      } else {
        dialog.find('#row-column').show();
        // 如果已选择表格，启用列选择
        if (dialog.find('#rule-table').val()) {
          dialog.find('#rule-column').prop('disabled', false);
        }
      }
    });

    // 键值对类型变化时显示/隐藏数值范围输入框
    dialog.find('#cfg-keyvalue-type').on('change', function () {
      const valueType = $(this).val();
      if (valueType === 'numeric') {
        dialog.find('#row-keyvalue-range').show();
      } else {
        dialog.find('#row-keyvalue-range').hide();
      }
    });

    // 关闭
    const closeDialog = () => dialog.remove();
    dialog.on('click', '#dlg-rule-close, #dlg-rule-cancel', function (e) {
      e.stopPropagation(); // 阻止事件冒泡到设置面板
      closeDialog();
    });
    setupOverlayClose(dialog, 'acu-validation-modal-overlay', () => {
      closeDialog();
    });

    // 保存
    dialog.find('#dlg-rule-save').on('click', function () {
      const name = dialog.find('#rule-name').val()?.trim();
      const targetTable = dialog.find('#rule-table').val();
      const targetColumn = dialog.find('#rule-column').val();
      const ruleType = dialog.find('#rule-type').val();
      const errorMessage = dialog.find('#rule-error-msg').val()?.trim();
      const typeInfo = RULE_TYPE_INFO[ruleType];
      const isTableRule = typeInfo?.scope === 'table';

      // 验证必填项
      if (!name) {
        if (window.toastr) window.toastr.warning('请输入规则名称');
        return;
      }
      if (!targetTable) {
        if (window.toastr) window.toastr.warning('请选择目标表格');
        return;
      }
      // 字段级规则和sequence规则必须选择目标列
      if ((!isTableRule || ruleType === 'sequence') && !targetColumn) {
        if (window.toastr) window.toastr.warning('请选择目标列');
        return;
      }

      // 构建配置
      const ruleConfig = {};
      if (ruleType === 'tableReadonly') {
        // 无需配置
      } else if (ruleType === 'rowLimit') {
        const min = dialog.find('#cfg-row-min').val();
        const max = dialog.find('#cfg-row-max').val();
        if (min !== '') ruleConfig.min = parseInt(min, 10);
        if (max !== '') ruleConfig.max = parseInt(max, 10);
      } else if (ruleType === 'required') {
        // 无需配置
      } else if (ruleType === 'format') {
        const pattern = dialog.find('#cfg-pattern').val()?.trim();
        if (!pattern) {
          if (window.toastr) window.toastr.warning('请输入正则表达式');
          return;
        }
        // 验证正则表达式有效性
        try {
          new RegExp(pattern);
        } catch (e) {
          if (window.toastr) showActionableErrorToast('正则表达式无效', { suggestion: 'input' });
          return;
        }
        ruleConfig.pattern = pattern;
      } else if (ruleType === 'enum') {
        const valuesStr = dialog.find('#cfg-values').val()?.trim();
        if (!valuesStr) {
          if (window.toastr) window.toastr.warning('请输入允许的值');
          return;
        }
        ruleConfig.values = valuesStr
          .split(',')
          .map(v => v.trim())
          .filter(v => v);
      } else if (ruleType === 'numeric') {
        const min = dialog.find('#cfg-min').val();
        const max = dialog.find('#cfg-max').val();
        if (min !== '') ruleConfig.min = parseFloat(min);
        if (max !== '') ruleConfig.max = parseFloat(max);
      } else if (ruleType === 'relation') {
        const refTable = dialog.find('#cfg-ref-table').val();
        const refColumns = dialog.find('#cfg-ref-column').val(); // 多选时返回数组

        if (!refTable) {
          if (window.toastr) window.toastr.warning('请选择关联表格');
          return;
        }

        const selectedColumns = Array.isArray(refColumns) ? refColumns : refColumns ? [refColumns] : [];
        if (selectedColumns.length === 0 || (selectedColumns.length === 1 && !selectedColumns[0])) {
          if (window.toastr) window.toastr.warning('请至少选择一列作为关联列');
          return;
        }

        ruleConfig.refTable = refTable;
        // 如果只有一列，保存为字符串；如果多列，保存为数组
        ruleConfig.refColumn = selectedColumns.length === 1 ? selectedColumns[0] : selectedColumns;
      } else if (ruleType === 'keyValue') {
        const valueType = dialog.find('#cfg-keyvalue-type').val();
        ruleConfig.valueType = valueType || 'text';

        if (valueType === 'numeric') {
          const min = dialog.find('#cfg-keyvalue-min').val();
          const max = dialog.find('#cfg-keyvalue-max').val();
          if (min !== '') ruleConfig.valueMin = parseFloat(min);
          if (max !== '') ruleConfig.valueMax = parseFloat(max);
        }
      } else if (ruleType === 'sequence') {
        const prefix = dialog.find('#cfg-sequence-prefix').val()?.trim() || '';
        const startFrom = dialog.find('#cfg-sequence-start').val();
        const pairedTable = dialog.find('#cfg-sequence-paired-table').val()?.trim() || null;
        ruleConfig.prefix = prefix;
        ruleConfig.startFrom = startFrom !== '' ? parseInt(startFrom, 10) : 1;
        if (isNaN(ruleConfig.startFrom)) {
          if (window.toastr) window.toastr.warning('起始数字必须是有效数字');
          return;
        }
        if (pairedTable) {
          ruleConfig.pairedTable = pairedTable;
        }
      }

      // 编辑模式使用原规则ID，新建模式生成新ID
      const finalRuleId = isEditMode
        ? editRuleId
        : 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

      // 构建规则对象
      const ruleData = {
        id: finalRuleId,
        name: name,
        description: existingRule?.description || '',
        targetTable: targetTable,
        targetColumn: isTableRule && ruleType !== 'sequence' ? '' : targetColumn, // 表级规则不需要 targetColumn，但sequence规则需要
        ruleType: ruleType,
        config: ruleConfig,
        errorMessage: errorMessage || typeInfo?.desc || '数据验证失败',
        intercept: existingRule?.intercept ?? false, // 编辑模式保留原拦截状态，新建模式默认不启用
        enabled: existingRule?.enabled ?? true, // 编辑模式保留原启用状态，新建模式默认启用
      };

      let success = false;
      if (isEditMode) {
        // 编辑模式：更新规则
        success = ValidationRuleManager.updateCustomRule(editRuleId, ruleData);
      } else {
        // 新建模式：添加规则
        success = ValidationRuleManager.addCustomRule(ruleData);
      }

      if (success) {
        closeDialog();

        // 清除缓存确保获取最新数据
        ValidationRuleManager.clearCache();

        // 刷新规则列表
        const $rulesList = parentDialog.find('#validation-rules-list');

        if (isEditMode) {
          // 编辑模式：更新现有规则项
          const $existingItem = $rulesList.find(`.acu-validation-rule-item[data-rule-id="${escapeHtml(editRuleId)}"]`);
          if ($existingItem.length) {
            const hasIntercept = ruleData.intercept;
            const isEnabled = ruleData.enabled;
            $existingItem.find('.acu-rule-name').text(name);
            $existingItem
              .find('.acu-rule-target')
              .text(`${targetTable}${isTableRule && ruleType !== 'sequence' ? ' (整表)' : '.' + targetColumn}`);
            $existingItem
              .find('.acu-rule-type-icon')
              .attr('title', `${typeInfo?.name || ruleType}${isTableRule ? ' (表级)' : ''}`)
              .find('i')
              .attr('class', `fa-solid ${typeInfo?.icon || 'fa-question'}`);
            $existingItem.toggleClass('disabled', !isEnabled);
          }
        } else {
          // 新建模式：追加新规则项
          const ruleHtml = `
          <div class="acu-validation-rule-item" data-rule-id="${escapeHtml(finalRuleId)}">
            <div class="acu-rule-type-icon" title="${escapeHtml(typeInfo?.name || ruleType)}${isTableRule ? ' (表级)' : ''}">
              <i class="fa-solid ${typeInfo?.icon || 'fa-question'}"></i>
            </div>
            <div class="acu-rule-info">
              <div class="acu-rule-name">${escapeHtml(name)}</div>
              <div class="acu-rule-target">${escapeHtml(targetTable)}${isTableRule && ruleType !== 'sequence' ? ' (整表)' : '.' + escapeHtml(targetColumn)}</div>
            </div>
            <div class="acu-rule-intercept" data-rule-id="${escapeHtml(finalRuleId)}" title="点击启用拦截提示（违反时标注）"><i class="fa-solid fa-shield-halved"></i></div>
            <button type="button" class="acu-rule-action acu-rule-edit" data-rule-id="${escapeHtml(finalRuleId)}" title="编辑此规则" aria-label="编辑此规则"><i class="fa-solid fa-pen"></i></button>
            <div class="acu-rule-toggle active" title="点击切换启用/禁用">
              <i class="fa-solid fa-toggle-on"></i>
            </div>
            <button type="button" class="acu-rule-action acu-rule-delete" data-rule-id="${escapeHtml(finalRuleId)}" title="删除此规则" aria-label="删除此规则"><i class="fa-solid fa-trash"></i></button>
          </div>
        `;
          $rulesList.append(ruleHtml);
        }
        // 事件由父级事件委托处理，无需单独绑定
      } else {
        if (window.toastr) {
          showActionableErrorToast(isEditMode ? '规则更新失败' : '规则添加失败', {
            title: isEditMode ? '规则更新失败' : '规则添加失败',
            suggestion: 'input',
          });
        }
      }
    });

    // 编辑模式：预填充现有规则数据（必须在事件绑定之后执行）
    if (isEditMode && existingRule) {
      dialog.find('#rule-name').val(existingRule.name || '');
      dialog.find('#rule-error-msg').val(existingRule.errorMessage || '');

      // 先设置表格，触发 change 事件更新列选项
      dialog
        .find('#rule-table')
        .val(existingRule.targetTable || '')
        .trigger('change');

      // 再设置规则类型，触发 change 事件切换配置区域
      dialog
        .find('#rule-type')
        .val(existingRule.ruleType || 'required')
        .trigger('change');

      // 延迟填充目标列和配置（等待表格/类型 change 事件处理完成）
      setTimeout(() => {
        // 填充目标列
        if (existingRule.targetColumn) {
          dialog.find('#rule-column').val(existingRule.targetColumn);
          updateSelectColor(dialog.find('#rule-column'));
        }

        // 填充规则配置
        const cfg = existingRule.config || {};
        const ruleType = existingRule.ruleType;

        if (ruleType === 'rowLimit') {
          if (cfg.min !== undefined) dialog.find('#cfg-row-min').val(cfg.min);
          if (cfg.max !== undefined) dialog.find('#cfg-row-max').val(cfg.max);
        } else if (ruleType === 'sequence') {
          dialog.find('#cfg-sequence-prefix').val(cfg.prefix || '');
          dialog.find('#cfg-sequence-start').val(cfg.startFrom ?? 1);
          if (cfg.pairedTable) {
            dialog.find('#cfg-sequence-paired-table').val(cfg.pairedTable);
            updateSelectColor(dialog.find('#cfg-sequence-paired-table'));
          }
        } else if (ruleType === 'format') {
          dialog.find('#cfg-pattern').val(cfg.pattern || '');
        } else if (ruleType === 'enum') {
          dialog.find('#cfg-values').val((cfg.values || []).join(','));
        } else if (ruleType === 'numeric') {
          if (cfg.min !== undefined) dialog.find('#cfg-min').val(cfg.min);
          if (cfg.max !== undefined) dialog.find('#cfg-max').val(cfg.max);
        } else if (ruleType === 'relation') {
          if (cfg.refTable) {
            dialog.find('#cfg-ref-table').val(cfg.refTable).trigger('change');
            // 延迟填充关联列，然后显示弹窗
            setTimeout(() => {
              const refColumns = Array.isArray(cfg.refColumn) ? cfg.refColumn : cfg.refColumn ? [cfg.refColumn] : [];
              dialog.find('#cfg-ref-column').val(refColumns);
              updateSelectColor(dialog.find('#cfg-ref-column'));
              // 显示弹窗
              dialog.css('opacity', '1');
            }, 100);
            return; // relation 类型在嵌套 setTimeout 中显示弹窗
          }
        } else if (ruleType === 'keyValue') {
          dialog
            .find('#cfg-keyvalue-type')
            .val(cfg.valueType || 'text')
            .trigger('change');
          if (cfg.valueMin !== undefined) dialog.find('#cfg-keyvalue-min').val(cfg.valueMin);
          if (cfg.valueMax !== undefined) dialog.find('#cfg-keyvalue-max').val(cfg.valueMax);
        }

        // 数据填充完成，显示弹窗
        dialog.css('opacity', '1');
      }, 100);
    }
  };
export { showAddValidationRuleModal }; // __wireShowAddValidationRuleModalDeps 已由头部 export function 导出
