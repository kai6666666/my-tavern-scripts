// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=36「表级规则智能修改弹窗」（banner 无标题）
// 原行范围：44340-44900（含标题注释 44338 与 banner 44339）；拆分批次 8；外部 closure 依赖：12（getCore@29 / RULE_TYPE_INFO@9 / escapeHtml@3 / ValidationEngine@16 / setupOverlayClose@3 / warnTableTemplateIssue@1 / extractCodesFromTable@35 / buildCodeMapping@35 / alignAndFixPairedTables@35 / saveDataOnly@30 / renderInterface@45 / deleteRowInstantly@30）
// 接线说明：RULE_TYPE_INFO 已拆至 validation/validation-rule-manager.ts、escapeHtml/setupOverlayClose 已拆至 favorites/bookmark-manager.ts、
//   ValidationEngine 已拆至 validation/validation-engine.ts、warnTableTemplateIssue 已拆至 engine/primary-keys.ts、
//   extractCodesFromTable/buildCodeMapping/alignAndFixPairedTables 已拆至 misc/paired-table-fix.ts（均不引用本文件，无循环）直接 import；
//   showActionableErrorToast 来自 ../ui/actionable-error-toast；
//   getCore@29、saveDataOnly/deleteRowInstantly@30、renderInterface@45 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireShowTableRuleFixModalDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { RULE_TYPE_INFO } from '../validation/validation-rule-manager';
import { escapeHtml, setupOverlayClose } from '../favorites/bookmark-manager';
import { ValidationEngine } from '../validation/validation-engine';
import { warnTableTemplateIssue } from '../engine/primary-keys';
import { alignAndFixPairedTables, buildCodeMapping, extractCodesFromTable } from './paired-table-fix';

let getCore = null;
let saveDataOnly = null;
let renderInterface = null;
let deleteRowInstantly = null;

export function __wireShowTableRuleFixModalDeps(deps) {
  getCore = deps.getCore;
  saveDataOnly = deps.saveDataOnly;
  renderInterface = deps.renderInterface;
  deleteRowInstantly = deps.deleteRowInstantly;
}
  // 表级规则智能修改弹窗
  // ========================================
  const showTableRuleFixModal = (error, rule, ruleType, rawData, snapshot, currentThemeClass) => {
    const { $ } = getCore();
    const typeInfo = RULE_TYPE_INFO[ruleType] || { name: ruleType, icon: 'fa-question' };

    let contentHtml = '';
    let actionBtns = '';

    if (ruleType === 'tableReadonly') {
      // 表只读规则：仅显示修改概览，不提供整表恢复快捷操作
      let changeCount = 0;
      let changeDetails = [];

      if (snapshot && rawData) {
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === error.tableName && snapshot[sheetId]) {
            const newRows = rawData[sheetId].content?.slice(1) || [];
            const oldRows = snapshot[sheetId].content?.slice(1) || [];

            // 检测修改
            newRows.forEach((row, idx) => {
              const oldRow = oldRows[idx];
              if (!oldRow) {
                changeDetails.push(`第${idx + 1}行: 新增`);
                changeCount++;
              } else {
                for (let c = 0; c < row.length; c++) {
                  if (String(row[c] || '') !== String(oldRow[c] || '')) {
                    changeDetails.push(`第${idx + 1}行: 有修改`);
                    changeCount++;
                    break;
                  }
                }
              }
            });

            // 检测删除
            if (oldRows.length > newRows.length) {
              for (let i = newRows.length; i < oldRows.length; i++) {
                changeDetails.push(`第${i + 1}行: 已删除`);
                changeCount++;
              }
            }
            break;
          }
        }
      }

      contentHtml = `
        <div class="acu-smart-fix-rule-info">
          <div class="acu-smart-fix-rule-header">
            <i class="fa-solid fa-lock"></i>
            <span>表只读保护</span>
          </div>
          <div class="acu-smart-fix-rule-desc">此表被设置为只读，但检测到有修改；当前仅标注，不提供整表回滚。</div>
        </div>
        <div class="acu-smart-fix-table-summary">
          <div class="acu-smart-fix-stat">
            <i class="fa-solid fa-exclamation-triangle"></i>
            检测到 <strong>${changeCount}</strong> 处修改
          </div>
          ${
            changeDetails.length > 0
              ? `
            <div class="acu-smart-fix-change-list">
              ${changeDetails
                .slice(0, 10)
                .map(d => `<div class="acu-smart-fix-change-item">${escapeHtml(d)}</div>`)
                .join('')}
              ${changeDetails.length > 10 ? `<div class="acu-smart-fix-change-item">... 还有 ${changeDetails.length - 10} 处</div>` : ''}
            </div>
          `
              : ''
          }
        </div>
      `;
      actionBtns = `<button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 关闭</button>`;
    } else if (ruleType === 'rowLimit') {
      // 行数限制规则：显示超出的行，提供删除功能
      const minRows = rule.config?.min;
      const maxRows = rule.config?.max;
      let currentRowCount = 0;
      let excessRows = [];

      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === error.tableName) {
          currentRowCount = (rawData[sheetId].content?.length || 1) - 1; // 减去表头
          break;
        }
      }

      const isTooMany = maxRows !== undefined && currentRowCount > maxRows;
      const isTooFew = minRows !== undefined && currentRowCount < minRows;

      if (isTooMany) {
        for (let i = maxRows + 1; i <= currentRowCount; i++) {
          excessRows.push(i);
        }
      }

      contentHtml = `
        <div class="acu-smart-fix-rule-info">
          <div class="acu-smart-fix-rule-header">
            <i class="fa-solid fa-arrows-up-down"></i>
            <span>行数限制</span>
          </div>
          <div class="acu-smart-fix-rule-desc">${escapeHtml(error.errorMessage || rule.errorMessage || '')}</div>
        </div>
        <div class="acu-smart-fix-table-summary">
          <div class="acu-smart-fix-stat">
            当前行数: <strong>${currentRowCount}</strong> 行
            ${minRows !== undefined || maxRows !== undefined ? ` | 限制: ${minRows !== undefined ? minRows : 0} ~ ${maxRows !== undefined ? maxRows : '∞'} 行` : ''}
          </div>
          ${
            isTooMany && excessRows.length > 0
              ? `
            <div class="acu-smart-fix-excess-rows">
              <div class="acu-smart-fix-suggest-label">
                <i class="fa-solid fa-trash"></i> 需删除的行 (第 ${excessRows[0]} 行及之后):
              </div>
              <div class="acu-smart-fix-change-list">
                ${excessRows
                  .slice(0, 10)
                  .map(r => `<div class="acu-smart-fix-change-item">第 ${r} 行</div>`)
                  .join('')}
                ${excessRows.length > 10 ? `<div class="acu-smart-fix-change-item">... 共 ${excessRows.length} 行</div>` : ''}
              </div>
            </div>
          `
              : ''
          }
          ${
            isTooFew
              ? `
            <div class="acu-smart-fix-hint">
              <i class="fa-solid fa-info-circle"></i> 当前少于最小行数；该情况仅标注，不自动追加空行
            </div>
          `
              : ''
          }
        </div>
      `;

      if (isTooMany && excessRows.length > 0) {
        actionBtns = `
          <button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 取消</button>
          <button class="acu-dialog-btn acu-btn-confirm" id="smart-fix-delete-rows" data-start="${maxRows}" data-table="${escapeHtml(error.tableName)}">
            <i class="fa-solid fa-trash"></i> 删除多余的 ${excessRows.length} 行
          </button>
        `;
      } else {
        actionBtns = `<button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 关闭</button>`;
      }
    } else if (ruleType === 'sequence' && rule.targetColumn) {
      // 序列递增规则：检测跳号、重复，提供自动修复
      const prefix = rule.config?.prefix || '';
      const startFrom = rule.config?.startFrom !== undefined ? rule.config?.startFrom : 1;
      let targetSheet = null;
      let issues = [];
      let fixSuggestions = [];

      // 找到目标表
      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === error.tableName) {
          targetSheet = rawData[sheetId];
          break;
        }
      }

      if (targetSheet && targetSheet.content && targetSheet.content.length > 1) {
        const headers = targetSheet.content[0] || [];
        const rows = targetSheet.content.slice(1) || [];
        const colIndex = ValidationEngine.findColumnIndex(headers, rule.targetColumn);

        if (colIndex >= 0) {
          // 提取所有编码索引的数字部分
          const numbers = [];
          for (let i = 0; i < rows.length; i++) {
            const value = rows[i]?.[colIndex];
            if (value === null || value === undefined || value === '') continue;

            const strValue = String(value).trim();
            if (!strValue) continue;

            let num = null;
            if (prefix) {
              const match = strValue.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
              if (match) {
                num = parseInt(match[1], 10);
              }
            } else {
              num = parseInt(strValue, 10);
            }

            if (!isNaN(num)) {
              numbers.push({ rowIndex: i, value: strValue, num, originalRowIndex: i + 2 }); // +2 因为表头+1索引
            }
          }

          // 按行索引排序
          numbers.sort((a, b) => a.rowIndex - b.rowIndex);

          // 检测问题
          const numCountMap = new Map(); // 记录每个数字出现的次数和位置
          const duplicates = [];
          const gaps = [];
          const outOfOrder = [];

          // 第一遍：统计每个数字出现的次数
          for (let i = 0; i < numbers.length; i++) {
            const actualNum = numbers[i].num;
            if (!numCountMap.has(actualNum)) {
              numCountMap.set(actualNum, []);
            }
            numCountMap.get(actualNum).push(i);
          }

          // 第二遍：检测问题
          for (let i = 0; i < numbers.length; i++) {
            const expectedNum = startFrom + i;
            const actualNum = numbers[i].num;
            const rowNum = numbers[i].originalRowIndex;

            // 检测重复（如果这个数字出现了多次）
            const occurrences = numCountMap.get(actualNum) || [];
            if (occurrences.length > 1) {
              // 只有第一次出现时才添加到重复列表（避免重复报告）
              if (occurrences[0] === i) {
                duplicates.push({
                  rowNum,
                  value: numbers[i].value,
                  num: actualNum,
                  expectedNum,
                  count: occurrences.length,
                });
              }
            }

            // 检测跳号或顺序错误
            if (actualNum !== expectedNum) {
              if (actualNum < expectedNum) {
                // 数字小于期望值（可能是重复或顺序错误）
                outOfOrder.push({ rowNum, value: numbers[i].value, num: actualNum, expectedNum });
              } else {
                // 数字大于期望值（跳号）
                gaps.push({ rowNum, value: numbers[i].value, num: actualNum, expectedNum });
              }
            }
          }

          // 生成修复建议
          for (let i = 0; i < numbers.length; i++) {
            const expectedNum = startFrom + i;
            const actualNum = numbers[i].num;
            const rowNum = numbers[i].originalRowIndex;
            const currentValue = numbers[i].value;
            const fixedValue = prefix + String(expectedNum).padStart(4, '0');

            if (actualNum !== expectedNum || duplicates.some(d => d.num === actualNum && d.rowNum === rowNum)) {
              fixSuggestions.push({
                rowNum,
                currentValue,
                fixedValue,
                reason: actualNum < expectedNum ? '重复或顺序错误' : actualNum > expectedNum ? '跳号' : '重复',
              });
            }
          }

          // 合并所有问题（去重，因为重复和顺序错误可能有重叠）
          const issueSet = new Set();
          duplicates.forEach(d => {
            issueSet.add(`第${d.rowNum}行: "${d.value}" 重复 (出现${d.count}次)`);
          });
          gaps.forEach(g => {
            issueSet.add(
              `第${g.rowNum}行: "${g.value}" 应为 "${prefix}${String(g.expectedNum).padStart(4, '0')}" (跳号)`,
            );
          });
          outOfOrder.forEach(o => {
            issueSet.add(
              `第${o.rowNum}行: "${o.value}" 应为 "${prefix}${String(o.expectedNum).padStart(4, '0')}" (顺序错误)`,
            );
          });
          issues = Array.from(issueSet);
        }
      }

      contentHtml = `
        <div class="acu-smart-fix-rule-info">
          <div class="acu-smart-fix-rule-header">
            <i class="fa-solid fa-sort-numeric-up"></i>
            <span>序列递增验证</span>
          </div>
          <div class="acu-smart-fix-rule-desc">${escapeHtml(error.errorMessage || rule.errorMessage || '')}</div>
        </div>
        <div class="acu-smart-fix-table-summary">
          <div class="acu-smart-fix-stat">
            <i class="fa-solid fa-exclamation-triangle"></i>
            检测到 <strong>${issues.length}</strong> 个问题
          </div>
          ${
            issues.length > 0
              ? `
            <div class="acu-smart-fix-change-list" style="max-height:200px;overflow-y:auto;margin-top:8px;">
              ${issues
                .slice(0, 20)
                .map(issue => `<div class="acu-smart-fix-change-item">${escapeHtml(issue)}</div>`)
                .join('')}
              ${issues.length > 20 ? `<div class="acu-smart-fix-change-item">... 还有 ${issues.length - 20} 个问题</div>` : ''}
            </div>
          `
              : ''
          }
          ${
            fixSuggestions.length > 0
              ? `
            <div class="acu-smart-fix-suggest" style="margin-top:12px;">
              <div class="acu-smart-fix-suggest-label">
                <i class="fa-solid fa-lightbulb"></i> 修复建议:
              </div>
              <div class="acu-smart-fix-change-list" style="max-height:200px;overflow-y:auto;margin-top:8px;">
                ${fixSuggestions
                  .slice(0, 20)
                  .map(
                    fix => `
                  <div class="acu-smart-fix-change-item">
                    <span style="color:var(--acu-text-sub);">第${fix.rowNum}行:</span>
                    <span style="color:var(--acu-hl-manual);">${escapeHtml(fix.currentValue)}</span>
                    <span style="color:var(--acu-text-sub);"> → </span>
                    <span style="color:var(--acu-hl-diff);">${escapeHtml(fix.fixedValue)}</span>
                    <span style="color:var(--acu-text-sub);font-size:11px;"> (${escapeHtml(fix.reason)})</span>
                  </div>
                `,
                  )
                  .join('')}
                ${fixSuggestions.length > 20 ? `<div class="acu-smart-fix-change-item">... 还有 ${fixSuggestions.length - 20} 处需要修复</div>` : ''}
              </div>
            </div>
          `
              : ''
          }
        </div>
      `;

      if (fixSuggestions.length > 0) {
        const pairedTable = rule.config?.pairedTable || null;

        if (pairedTable) {
          actionBtns = `<button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 关闭</button>`;
        } else {
          actionBtns = `
            <button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 取消</button>
            <button class="acu-dialog-btn acu-btn-confirm" id="smart-fix-fix-sequence" data-table="${escapeHtml(error.tableName)}" data-column="${escapeHtml(rule.targetColumn)}" data-prefix="${escapeHtml(prefix)}" data-start="${startFrom}">
              <i class="fa-solid fa-magic"></i> 自动修复 ${fixSuggestions.length} 处
            </button>
          `;
        }
      } else {
        actionBtns = `<button class="acu-dialog-btn" id="smart-fix-cancel"><i class="fa-solid fa-times"></i> 关闭</button>`;
      }
    }

    const dialog = $(`
      <div class="acu-edit-overlay acu-validation-modal-overlay">
        <div class="acu-edit-dialog acu-validation-modal ${currentThemeClass}" style="max-width:450px;">
          <div class="acu-edit-title">智能修改: ${escapeHtml(error.tableName || '')} (表级规则)</div>
          <div class="acu-settings-content" style="flex:1; overflow-y:auto; padding:15px;">
            ${contentHtml}
          </div>
          <div class="acu-dialog-btns">
            ${actionBtns}
          </div>
        </div>
      </div>
    `);

    $('body').append(dialog);

    // 关闭
    const closeDialog = () => dialog.remove();
    dialog.on('click', '#smart-fix-cancel', closeDialog);
    setupOverlayClose(dialog, 'acu-validation-modal-overlay', closeDialog);

    // 自动修复序列递增
    dialog.on('click', '#smart-fix-fix-sequence', async function () {
      const $btn = $(this);
      const tableName = $btn.data('table');
      const columnName = $btn.data('column');
      const prefix = $btn.data('prefix') || '';
      const startFrom = parseInt($btn.data('start') || '1', 10);
      const pairedTableName = $btn.data('paired-table') || null;

      try {
        if (pairedTableName) {
          if (window.toastr) window.toastr.warning('配对表序列修复可能涉及插入/重排，当前仅标注不自动修复');
          return;
        }
        $btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> 修复中...');

        // 找到目标表
        let targetSheet = null;
        let targetSheetId = null;
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === tableName) {
            targetSheet = rawData[sheetId];
            targetSheetId = sheetId;
            break;
          }
        }

        if (!targetSheet || !targetSheet.content || targetSheet.content.length < 2) {
          warnTableTemplateIssue('未找到目标表');
          $btn.prop('disabled', false).html('<i class="fa-solid fa-magic"></i> 自动修复');
          return;
        }

        const headers = targetSheet.content[0] || [];
        const rows = targetSheet.content.slice(1) || [];
        const colIndex = headers.indexOf(columnName);

        if (colIndex < 0) {
          warnTableTemplateIssue('未找到目标列');
          $btn.prop('disabled', false).html('<i class="fa-solid fa-magic"></i> 自动修复');
          return;
        }

        // 如果有配对表，使用配对修复逻辑
        if (pairedTableName) {
          // 找到配对表
          let pairedSheet = null;
          let pairedSheetId = null;
          for (const sheetId in rawData) {
            if (rawData[sheetId]?.name === pairedTableName) {
              pairedSheet = rawData[sheetId];
              pairedSheetId = sheetId;
              break;
            }
          }

          if (!pairedSheet || !pairedSheet.content || pairedSheet.content.length < 1) {
            warnTableTemplateIssue(`未找到配对表: ${pairedTableName}`);
            $btn.prop('disabled', false).html('<i class="fa-solid fa-magic"></i> 自动修复');
            return;
          }

          const pairedHeaders = pairedSheet.content[0] || [];
          const pairedColIndex = pairedHeaders.indexOf(columnName);

          if (pairedColIndex < 0) {
            warnTableTemplateIssue(`配对表中未找到目标列: ${columnName}`);
            $btn.prop('disabled', false).html('<i class="fa-solid fa-magic"></i> 自动修复');
            return;
          }

          // 提取两个表的编码
          const extract1 = extractCodesFromTable(targetSheet, columnName, prefix);
          const extract2 = extractCodesFromTable(pairedSheet, columnName, prefix);

          // 构建编码映射
          const mapping = buildCodeMapping(extract1.allCodes, extract2.allCodes, prefix, startFrom);

          // 对齐和修复
          const { fixedCount1, fixedCount2 } = alignAndFixPairedTables(
            targetSheet,
            targetSheetId,
            pairedSheet,
            pairedSheetId,
            columnName,
            mapping,
            prefix,
            startFrom,
            rawData,
          );

          await saveDataOnly(rawData, [targetSheetId, pairedSheetId].filter(Boolean));
          closeDialog();
          renderInterface();
        } else {
          // 原有的单表修复逻辑
          // 提取所有编码索引的数字部分
          const numbers = [];
          for (let i = 0; i < rows.length; i++) {
            const value = rows[i]?.[colIndex];
            if (value === null || value === undefined || value === '') continue;

            const strValue = String(value).trim();
            if (!strValue) continue;

            let num = null;
            if (prefix) {
              const match = strValue.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
              if (match) {
                num = parseInt(match[1], 10);
              }
            } else {
              num = parseInt(strValue, 10);
            }

            if (!isNaN(num)) {
              numbers.push({ rowIndex: i, value: strValue, num });
            }
          }

          // 按行索引排序
          numbers.sort((a, b) => a.rowIndex - b.rowIndex);

          // 修复编号
          let fixedCount = 0;
          for (let i = 0; i < numbers.length; i++) {
            const expectedNum = startFrom + i;
            const actualNum = numbers[i].num;
            const rowIndex = numbers[i].rowIndex;

            if (actualNum !== expectedNum) {
              const fixedValue = prefix + String(expectedNum).padStart(4, '0');
              rows[rowIndex][colIndex] = fixedValue;
              fixedCount++;
            }
          }

          await saveDataOnly(rawData, targetSheetId ? [targetSheetId] : undefined);
          closeDialog();
          renderInterface();
        }
      } catch (e) {
        console.error('[DICE]ACU 修复序列递增失败:', e);
        if (window.toastr) showActionableErrorToast('修复失败: ' + (e.message || '未知错误'), { suggestion: 'save' });
        $btn.prop('disabled', false).html('<i class="fa-solid fa-magic"></i> 自动修复');
      }
    });

    // 删除多余行
    dialog.on('click', '#smart-fix-delete-rows', async function () {
      const startRow = parseInt($(this).data('start'), 10);
      const tableName = $(this).data('table');

      try {
        let targetSheetId = null;
        let targetRowCount = 0;
        for (const sheetId in rawData) {
          if (rawData[sheetId]?.name === tableName) {
            targetSheetId = sheetId;
            targetRowCount = Math.max(0, (rawData[sheetId].content?.length || 1) - 1);
            break;
          }
        }
        if (!targetSheetId) {
          warnTableTemplateIssue('未找到目标表');
          return;
        }

        for (let rowIndex = targetRowCount - 1; rowIndex >= startRow; rowIndex--) {
          await deleteRowInstantly(targetSheetId, rowIndex);
        }
        closeDialog();
        renderInterface();
      } catch (e) {
        console.error('[DICE]ACU 删除行失败:', e);
        if (window.toastr) showActionableErrorToast('删除失败: ' + (e.message || '未知错误'), { suggestion: 'save' });
      }
    });
  };
export { showTableRuleFixModal }; // __wireShowTableRuleFixModalDeps 已由头部 export function 导出
