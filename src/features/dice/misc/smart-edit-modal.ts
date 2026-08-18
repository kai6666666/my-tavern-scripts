// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=34「智能修改弹窗」
// 原行范围：43421-44029（含 banner 43418-44029）；拆分批次 8；外部 closure 依赖：19（getCore@29 / getConfig@30 / RULE_TYPE_INFO@9 / getTableData@30 / cloneRuntimeDataValue@30 / cachedRawData@29 / loadSnapshot@29 / showTableRuleFixModal@36 / escapeHtml@3 / getColumnExamples@31 / suggestFormatValue@31 / getNearestValidNumber@31 / getRelationOptions@31 / isValueInRelationTable@31 / errorTableTemplateIssue@1 / appendRowInstantly@30 / renderInterface@45 / showActionableErrorToast(import) / setupOverlayClose@3 / saveRowInstantly@30）
// 接线说明：RULE_TYPE_INFO 已拆至 validation/validation-rule-manager.ts、escapeHtml/setupOverlayClose 已拆至 favorites/bookmark-manager.ts、
//   getColumnExamples/suggestFormatValue/getNearestValidNumber/getRelationOptions/isValueInRelationTable 已拆至 misc/smart-edit-helpers.ts、
//   errorTableTemplateIssue 已拆至 engine/primary-keys.ts、showTableRuleFixModal 已随本批拆至 misc/table-rule-fix-modal.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   getCore/cachedRawData/loadSnapshot/appendRowInstantly@29、getConfig/getTableData/cloneRuntimeDataValue/saveRowInstantly@30、renderInterface@45 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireShowSmartFixModalDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { RULE_TYPE_INFO } from '../validation/validation-rule-manager';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';
import { getColumnExamples, getNearestValidNumber, getRelationOptions, isValueInRelationTable, suggestFormatValue } from './smart-edit-helpers';
import { errorTableTemplateIssue } from '../engine/primary-keys';
import { showTableRuleFixModal } from './table-rule-fix-modal';

let getCore = null;
let getConfig = null;
let getTableData = null;
let cloneRuntimeDataValue = null;
let cachedRawData = null;
let loadSnapshot = null;
let appendRowInstantly = null;
let renderInterface = null;
let saveRowInstantly = null;

export function __wireShowSmartFixModalDeps(deps) {
  getCore = deps.getCore;
  getConfig = deps.getConfig;
  getTableData = deps.getTableData;
  cloneRuntimeDataValue = deps.cloneRuntimeDataValue;
  cachedRawData = deps.cachedRawData;
  loadSnapshot = deps.loadSnapshot;
  appendRowInstantly = deps.appendRowInstantly;
  renderInterface = deps.renderInterface;
  saveRowInstantly = deps.saveRowInstantly;
}
  // ========================================
  // 智能修改弹窗
  // ========================================
  const showSmartFixModal = error => {
    if (!error || !error.rule) {
      if (window.toastr) window.toastr.warning('无法获取规则信息');
      return;
    }

    const { $ } = getCore();
    const config = getConfig();
    const currentThemeClass = `acu-theme-${config.theme}`;
    const rule = error.rule;
    const ruleType = error.ruleType || rule.ruleType;
    const typeInfo = RULE_TYPE_INFO[ruleType] || { name: ruleType, icon: 'fa-question' };
    const isTableRule = typeInfo?.scope === 'table';

    // 获取原始数据和快照。这里拿克隆数据，避免智能修复在保存前污染前端缓存。
    const rawData = getTableData({ silent: true }) || cloneRuntimeDataValue(cachedRawData);
    const snapshot = loadSnapshot();

    // 如果错误对象中没有 rowTitle，尝试从原始数据中获取
    if (!error.rowTitle && error.rowIndex >= 0 && rawData && error.tableName) {
      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === error.tableName) {
          const row = rawData[sheetId].content?.[error.rowIndex + 1];
          if (row) {
            error.rowTitle = row[1] || row[0] || `行 ${error.rowIndex + 1}`;
          }
          break;
        }
      }
    }

    // 获取快照值（用于字段级规则）
    let snapshotValue = '';
    if (!isTableRule && snapshot && error.tableName && error.columnName !== undefined) {
      for (const sheetId in snapshot) {
        if (snapshot[sheetId]?.name === error.tableName) {
          const headers = snapshot[sheetId].content?.[0] || [];
          const colIdx = headers.indexOf(error.columnName);
          const rowIdx = error.rowIndex + 1;
          if (colIdx >= 0 && snapshot[sheetId].content?.[rowIdx]) {
            snapshotValue = snapshot[sheetId].content[rowIdx][colIdx] ?? '';
          }
          break;
        }
      }
    }

    const hasSnapshotValue = snapshotValue !== '' && String(snapshotValue) !== String(error.currentValue || '');

    // ========================================
    // 表级规则特殊处理
    // ========================================
    if (isTableRule) {
      showTableRuleFixModal(error, rule, ruleType, rawData, snapshot, currentThemeClass);
      return;
    }

    // ========================================
    // 字段级规则处理
    // ========================================

    // 根据规则类型生成不同的修改UI
    let inputHtml = '';

    if (ruleType === 'enum' && rule.config?.values) {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'relation' && rule.config?.refTable && rule.config?.refColumn) {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'numeric') {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'format' && rule.config?.pattern) {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else if (ruleType === 'keyValue') {
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    } else {
      // 必填或其他
      inputHtml = `<textarea id="smart-fix-value" class="acu-edit-textarea" spellcheck="false"
        style="width:100%;min-height:60px;max-height:200px;resize:none;">${escapeHtml(error.currentValue || '')}</textarea>`;
    }

    // 生成智能修复建议内容
    let smartSuggestHtml = '';

    if (ruleType === 'required') {
      // 必填验证：显示同列示例值
      const examples = getColumnExamples(error.tableName, error.columnName, error.rowIndex, rawData, 5);
      if (examples.length > 0) {
        smartSuggestHtml = `
          <div class="acu-smart-fix-suggest">
            <div class="acu-smart-fix-suggest-label">
              <i class="fa-solid fa-lightbulb"></i> 同列示例值:
            </div>
            <div class="acu-smart-fix-suggest-options">
              ${examples
                .map(
                  val => `
                <span class="acu-smart-fix-option" data-value="${escapeHtml(val)}" title="点击填充">
                  ${escapeHtml(val.length > 20 ? val.substring(0, 20) + '...' : val)}
                </span>
              `,
                )
                .join('')}
            </div>
          </div>
        `;
      }
    } else if (ruleType === 'enum' && rule.config?.values) {
      // 枚举验证：显示所有可用选项
      const validValues = rule.config.values;
      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-list"></i> 允许的值 (点击选择):
          </div>
          <div class="acu-smart-fix-suggest-options acu-smart-fix-suggest-options-scroll">
            ${validValues
              .map(
                val => `
              <span class="acu-smart-fix-option ${error.currentValue === val ? 'acu-smart-fix-option-current' : ''}"
                    data-value="${escapeHtml(val)}" title="${error.currentValue === val ? '当前值（无效）' : '点击选择'}">
                ${escapeHtml(val)}
              </span>
            `,
              )
              .join('')}
          </div>
        </div>
      `;
    } else if (ruleType === 'format' && rule.config?.pattern) {
      // 格式验证：显示格式说明和推荐值
      // 获取表数据用于智能推算
      let tableContent = null;
      if (rawData && error.tableName) {
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === error.tableName) {
            tableContent = rawData[sheetId];
            break;
          }
        }
      }
      const suggestedValue = suggestFormatValue(rule.config.pattern, error.rowIndex, [], tableContent);
      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-font"></i> 格式要求: <code>${escapeHtml(rule.config.pattern)}</code>
          </div>
          ${
            suggestedValue
              ? `
            <div style="margin-top:8px;">
              <span class="acu-smart-fix-suggest-label" style="margin-bottom:4px;display:block;">
                <i class="fa-solid fa-lightbulb"></i> 推荐值:
              </span>
              <span class="acu-smart-fix-quick-btn" data-value="${escapeHtml(suggestedValue)}">
                <i class="fa-solid fa-magic"></i> ${escapeHtml(suggestedValue)}
              </span>
            </div>
          `
              : ''
          }
        </div>
      `;
    } else if (ruleType === 'numeric') {
      // 数值范围验证：显示范围和快速修正按钮
      const min = rule.config?.min;
      const max = rule.config?.max;
      const currentNum = parseFloat(error.currentValue);
      const isOutOfRange =
        !isNaN(currentNum) && ((min !== undefined && currentNum < min) || (max !== undefined && currentNum > max));
      const nearestValid = isOutOfRange ? getNearestValidNumber(error.currentValue, min, max) : null;

      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-hashtag"></i> 允许范围: ${min !== undefined ? min : '-∞'} ~ ${max !== undefined ? max : '+∞'}
          </div>
          ${
            isOutOfRange && nearestValid !== null
              ? `
            <div style="margin-top:8px;">
              <span class="acu-smart-fix-quick-btn" data-value="${nearestValid}">
                <i class="fa-solid fa-arrow-right"></i> 修正为 ${nearestValid}
              </span>
            </div>
          `
              : ''
          }
        </div>
      `;
    } else if (ruleType === 'relation' && rule.config?.refTable && rule.config?.refColumn) {
      // 关联验证：显示可用值列表（带搜索）
      const options = getRelationOptions(rule.config.refTable, rule.config.refColumn, rawData);
      const refColumns = Array.isArray(rule.config.refColumn) ? rule.config.refColumn : [rule.config.refColumn];
      const hasMultipleColumns = refColumns.length > 1;
      const currentInvalidValue = String(error.currentValue || '').trim();
      const valueExists = isValueInRelationTable(
        currentInvalidValue,
        rule.config.refTable,
        rule.config.refColumn,
        rawData,
      );

      // 构建可用值列表HTML
      let optionsHtml = '';
      if (options.length > 0) {
        optionsHtml = `
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-link"></i> 关联表 "${escapeHtml(rule.config.refTable)}" 可用值 (${options.length}项):
          </div>
          <div class="acu-smart-fix-suggest-options acu-smart-fix-suggest-options-scroll" id="smart-fix-options-container">
            ${options
              .map(
                val => `
              <span class="acu-smart-fix-option ${error.currentValue === val ? 'acu-smart-fix-option-current' : ''}"
                    data-value="${escapeHtml(val)}" title="${error.currentValue === val ? '当前值（无效）' : '点击选择'}">
                ${escapeHtml(val)}
              </span>
            `,
              )
              .join('')}
          </div>
        `;
      }

      // 反向写入选项：仅在值不存在于关联表中时显示
      let reverseWriteHtml = '';
      if (currentInvalidValue && !valueExists) {
        if (hasMultipleColumns) {
          // 多个列：显示选择器
          reverseWriteHtml = `
            <div class="acu-smart-fix-reverse-write" style="margin-top:15px;padding-top:15px;border-top:1px solid var(--acu-border);">
              <div class="acu-smart-fix-suggest-label">
                <i class="fa-solid fa-arrow-left"></i> 反向写入到关联表:
              </div>
              <div style="margin-top:8px;">
                <select id="smart-fix-reverse-column" class="acu-edit-select" style="width:100%;margin-bottom:8px;">
                  ${refColumns.map(col => `<option value="${escapeHtml(col)}">${escapeHtml(col)}</option>`).join('')}
                </select>
                <button class="acu-smart-fix-quick-btn" id="smart-fix-reverse-write-btn" style="width:100%;">
                  <i class="fa-solid fa-plus"></i> 将 "${escapeHtml(currentInvalidValue.length > 30 ? currentInvalidValue.substring(0, 30) + '...' : currentInvalidValue)}" 写入到 "${escapeHtml(rule.config.refTable)}"
                </button>
              </div>
            </div>
          `;
        } else {
          // 单个列：直接显示按钮
          reverseWriteHtml = `
            <div class="acu-smart-fix-reverse-write" style="margin-top:15px;padding-top:15px;border-top:1px solid var(--acu-border);">
              <div class="acu-smart-fix-suggest-label">
                <i class="fa-solid fa-arrow-left"></i> 反向写入到关联表:
              </div>
              <div style="margin-top:8px;">
                <button class="acu-smart-fix-quick-btn" id="smart-fix-reverse-write-btn" data-column="${escapeHtml(refColumns[0])}" style="width:100%;">
                  <i class="fa-solid fa-plus"></i> 将 "${escapeHtml(currentInvalidValue.length > 30 ? currentInvalidValue.substring(0, 30) + '...' : currentInvalidValue)}" 写入到 "${escapeHtml(rule.config.refTable)}.${escapeHtml(refColumns[0])}"
                </button>
              </div>
            </div>
          `;
        }
      }

      if (optionsHtml || reverseWriteHtml) {
        smartSuggestHtml = `
          <div class="acu-smart-fix-suggest">
            ${optionsHtml}
            ${reverseWriteHtml}
          </div>
        `;
      }
    } else if (ruleType === 'keyValue') {
      // 键值对验证：显示格式说明和问题列表
      const valueType = rule.config?.valueType || 'text';
      const valueMin = rule.config?.valueMin;
      const valueMax = rule.config?.valueMax;

      // 预处理当前值
      let processedValue = String(error.currentValue || '');
      processedValue = processedValue.replace(/：/g, ':').replace(/；/g, ';').replace(/，/g, ';').replace(/\s+/g, '');

      // 解析键值对并检测问题
      const pairs = processedValue.split(';').filter(p => p.trim());
      const issues = [];
      const fixedPairs = [];

      for (const pair of pairs) {
        const colonIndex = pair.indexOf(':');
        if (colonIndex === -1 || colonIndex === 0 || colonIndex === pair.length - 1) {
          issues.push({ pair, error: '格式错误：缺少冒号或键/值为空' });
          continue;
        }

        const key = pair.substring(0, colonIndex);
        const val = pair.substring(colonIndex + 1);

        if (!key || !val) {
          issues.push({ pair, error: '键或值不能为空' });
          continue;
        }

        let fixedVal = val;
        let hasIssue = false;

        if (valueType === 'numeric') {
          const numVal = parseFloat(val);
          if (isNaN(numVal)) {
            issues.push({ pair, error: `"${val}" 不是有效数字` });
            hasIssue = true;
          } else {
            if (valueMin !== undefined && valueMin !== null && numVal < valueMin) {
              fixedVal = String(valueMin);
              issues.push({ pair, error: `数值 ${numVal} 小于最小值 ${valueMin}` });
              hasIssue = true;
            } else if (valueMax !== undefined && valueMax !== null && numVal > valueMax) {
              fixedVal = String(valueMax);
              issues.push({ pair, error: `数值 ${numVal} 大于最大值 ${valueMax}` });
              hasIssue = true;
            }
          }
        }

        fixedPairs.push({ key, val: fixedVal, originalVal: val, hasIssue });
      }

      // 生成修正后的完整字符串
      const fixedValue = fixedPairs.map(p => `${p.key}:${p.val}`).join(';');
      const hasIssues = issues.length > 0 || fixedPairs.some(p => p.hasIssue);

      let issuesHtml = '';
      if (hasIssues) {
        issuesHtml = `
          <div class="acu-smart-fix-suggest-label" style="margin-bottom:8px;">
            <i class="fa-solid fa-exclamation-triangle"></i> 问题列表:
          </div>
          <div style="margin-bottom:8px;">
            ${issues
              .map(
                issue => `
              <div style="font-size:11px;color:var(--acu-text-sub);padding:4px 8px;background:var(--acu-card-bg);border-radius:4px;margin-bottom:4px;">
                <span style="color:var(--acu-hl-manual);">❌</span> ${escapeHtml(issue.pair)} - ${escapeHtml(issue.error)}
              </div>
            `,
              )
              .join('')}
            ${fixedPairs
              .filter(p => p.hasIssue)
              .map(
                p => `
              <div style="font-size:11px;color:var(--acu-text-sub);padding:4px 8px;background:var(--acu-card-bg);border-radius:4px;margin-bottom:4px;">
                <span style="color:var(--acu-hl-manual);">⚠️</span> ${escapeHtml(p.key)}:${escapeHtml(p.originalVal)} → ${escapeHtml(p.val)}
              </div>
            `,
              )
              .join('')}
          </div>
        `;
      }

      smartSuggestHtml = `
        <div class="acu-smart-fix-suggest">
          <div class="acu-smart-fix-suggest-label">
            <i class="fa-solid fa-key"></i> 格式要求: 键:值;键:值（使用英文标点，自动去除空格）
          </div>
          ${
            valueType === 'numeric'
              ? `
            <div class="acu-smart-fix-suggest-label" style="margin-top:8px;">
              <i class="fa-solid fa-hashtag"></i> 数值范围: ${valueMin !== undefined ? valueMin : '-∞'} ~ ${valueMax !== undefined ? valueMax : '+∞'}
            </div>
          `
              : ''
          }
          ${issuesHtml}
          ${
            hasIssues
              ? `
            <div style="margin-top:8px;">
              <span class="acu-smart-fix-quick-btn" data-value="${escapeHtml(fixedValue)}">
                <i class="fa-solid fa-magic"></i> 一键修正所有问题
              </span>
            </div>
            <div style="margin-top:8px;padding:8px;background:var(--acu-card-bg);border-radius:4px;font-size:11px;color:var(--acu-text-sub);">
              <div style="margin-bottom:4px;"><strong>修正后预览:</strong></div>
              <code style="color:var(--acu-success-text);">${escapeHtml(fixedValue)}</code>
            </div>
          `
              : `
            <div style="margin-top:8px;padding:8px;background:var(--acu-success-bg);border-radius:4px;font-size:11px;color:var(--acu-success-text);">
              <i class="fa-solid fa-check-circle"></i> 格式正确
            </div>
          `
          }
        </div>
      `;
    }

    // 弹窗HTML
    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay">
        <div class="acu-edit-dialog acu-validation-modal ${currentThemeClass}" style="max-width:450px;">
          <div class="acu-edit-title">智能修改: ${escapeHtml(error.tableName || '')} - ${escapeHtml(error.columnName || '')}</div>
          <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
            <!-- 规则说明 -->
            <div class="acu-smart-fix-rule-info">
              <div class="acu-smart-fix-rule-header">
                <i class="fa-solid ${typeInfo.icon}"></i>
                <span>${escapeHtml(error.ruleName || rule.name || '')}</span>
              </div>
              <div class="acu-smart-fix-rule-desc">${escapeHtml(error.errorMessage || rule.errorMessage || typeInfo.desc || '')}</div>
            </div>

            <!-- 快照值（只读） -->
            ${
              hasSnapshotValue
                ? `
              <div class="acu-diff-section acu-diff-old-section">
                <div class="acu-diff-label">
                  <i class="fa-solid fa-clock-rotate-left"></i> 快照值（原始）
                </div>
                <div class="acu-diff-readonly">${escapeHtml(snapshotValue)}</div>
              </div>
              <div class="acu-diff-arrow-down"><i class="fa-solid fa-arrow-down"></i></div>
            `
                : ''
            }

            <!-- 当前值（可编辑） -->
            <div class="acu-diff-section acu-diff-new-section">
              ${
                error.rowTitle && error.rowIndex >= 0
                  ? `<div style="font-size:12px;color:var(--acu-text-sub);margin-bottom:8px;padding:4px 8px;background:var(--acu-table-head);border-radius:4px;">
                <i class="fa-solid fa-tag" style="margin-right:4px;"></i>${escapeHtml(error.rowTitle)}
              </div>`
                  : ''
              }
              <div class="acu-diff-label">
                <i class="fa-solid fa-pen"></i> 当前值（可编辑）
              </div>
              ${inputHtml}
            </div>

            <!-- 智能建议 -->
            ${
              smartSuggestHtml
                ? `
              <div class="acu-smart-fix-suggest-section">
                ${smartSuggestHtml}
              </div>
            `
                : ''
            }
          </div>
          <div class="acu-dialog-btns">
            <button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            ${hasSnapshotValue ? `<button class="acu-dialog-btn acu-btn-revert" id="smart-fix-revert"><i class="fa-solid fa-rotate-left"></i> 恢复快照值</button>` : ''}
            <button class="acu-dialog-btn acu-btn-clear" id="smart-fix-clear"><i class="fa-solid fa-eraser"></i> 清空当前值</button>
            <button class="acu-dialog-btn acu-btn-confirm" id="smart-fix-confirm"><i class="fa-solid fa-check"></i> 保存</button>
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 点击建议选项或快速修正按钮，填充到输入框
    dialog.on('click', '.acu-smart-fix-option, .acu-smart-fix-quick-btn', function () {
      // 排除反向写入按钮
      if ($(this).attr('id') === 'smart-fix-reverse-write-btn') return;
      if ($(this).hasClass('acu-smart-fix-option-current')) return;
      const optionValue = $(this).data('value') || $(this).text().trim();
      dialog.find('#smart-fix-value').val(optionValue).trigger('input');
    });

    // 反向写入到关联表
    dialog.on('click', '#smart-fix-reverse-write-btn', async function () {
      const currentInvalidValue = String(error.currentValue || '').trim();
      if (!currentInvalidValue) {
        if (window.toastr) window.toastr.warning('无法写入空值');
        return;
      }

      // 确定要写入的列
      let targetColumn;
      if (ruleType === 'relation' && rule.config?.refColumn) {
        const refColumns = Array.isArray(rule.config.refColumn) ? rule.config.refColumn : [rule.config.refColumn];
        if (refColumns.length > 1) {
          // 多个列：从选择器获取
          targetColumn = dialog.find('#smart-fix-reverse-column').val();
        } else {
          // 单个列：从按钮的data属性或直接使用
          targetColumn = $(this).data('column') || refColumns[0];
        }
      } else {
        errorTableTemplateIssue('无法确定目标列');
        return;
      }

      if (!targetColumn || !rule.config?.refTable) {
        errorTableTemplateIssue('无法确定目标表或列');
        return;
      }

      try {
        const rawData = cachedRawData || getTableData();
        let refSheet = null;
        let refSheetId = null;

        // 查找关联表
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === rule.config.refTable) {
            refSheet = rawData[sheetId];
            refSheetId = sheetId;
            break;
          }
        }

        if (!refSheet || !refSheet.content) {
          errorTableTemplateIssue(`找不到关联表 "${rule.config.refTable}"`);
          return;
        }

        const headers = refSheet.content[0] || [];
        const targetColIdx = headers.indexOf(targetColumn);

        if (targetColIdx === -1) {
          errorTableTemplateIssue(`关联表中不存在列 "${targetColumn}"`);
          return;
        }

        // 创建新行：长度与表头一致，填充空字符串
        const newRow = new Array(headers.length).fill('');
        newRow[targetColIdx] = currentInvalidValue;

        await appendRowInstantly(refSheetId || rule.config.refTable, newRow);

        // 关闭弹窗并重新渲染界面（会自动重新验证，所有相关错误会消失）
        closeDialog();
        renderInterface();
      } catch (e) {
        console.error('[DICE]ACU 反向写入失败:', e);
        if (window.toastr) showActionableErrorToast('反向写入失败: ' + (e.message || '未知错误'), { suggestion: 'save' });
      }
    });

    // 恢复快照值
    dialog.on('click', '#smart-fix-revert', function () {
      dialog.find('#smart-fix-value').val(snapshotValue);
    });

    // 清空当前值
    dialog.on('click', '#smart-fix-clear', function () {
      dialog.find('#smart-fix-value').val('').trigger('input');
    });

    // 关闭
    const closeDialog = () => dialog.remove();
    dialog.on('click', '#smart-fix-close, #smart-fix-cancel', closeDialog);
    setupOverlayClose(dialog, 'acu-validation-modal-overlay', closeDialog);

    // 确认修改
    dialog.find('#smart-fix-confirm').on('click', async function () {
      const newValue = dialog.find('#smart-fix-value').val()?.trim() || '';

      if (newValue === '' && ruleType === 'required') {
        if (window.toastr) window.toastr.warning('必填字段不能为空');
        return;
      }

      // 更新单元格值
      try {
        const rawData = cachedRawData || getTableData();
        let updated = false;

        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === error.tableName) {
            const sheet = rawData[sheetId];
            const headers = sheet.content?.[0] || [];

            if (error.rowIndex >= 0 && error.columnName) {
              const colIdx = headers.indexOf(error.columnName);
              const rowIdx = error.rowIndex + 1;

              if (colIdx >= 0 && sheet.content && sheet.content[rowIdx]) {
                const nextRow = [...sheet.content[rowIdx]];
                nextRow[colIdx] = newValue;
                await saveRowInstantly(sheetId, error.rowIndex, nextRow);
                updated = true;
                break;
              }
            }
          }
        }

        if (updated) {
          closeDialog();
          renderInterface();
        } else {
          if (window.toastr) showActionableErrorToast('无法找到目标单元格', { suggestion: 'table' });
        }
      } catch (e) {
        console.error('[DICE]ACU 更新单元格失败:', e);
        if (window.toastr) showActionableErrorToast('更新失败: ' + (e.message || '未知错误'), { suggestion: 'save' });
      }
    });
  };
export { showSmartFixModal }; // __wireShowSmartFixModalDeps 已由头部 export function 导出
