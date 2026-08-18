// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=16「ValidationEngine - 数据验证引擎」
// 原行范围：5824-6381（含 banner 5821-6381）；拆分批次 4；外部 closure 依赖：3（RULE_TYPE_INFO@9 / isNpcTableName@1 / ValidationRuleManager@12）
// 接线说明：RULE_TYPE_INFO 来自同目录 validation-rule-manager.ts、isNpcTableName 来自 ../engine/primary-keys.ts（均已拆出且不引用本文件，无循环），直接 import；
//   ValidationRuleManager 定义于 index.ts IIFE 内（章节12）无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireValidationEngineDeps({ ValidationRuleManager }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { RULE_TYPE_INFO } from './validation-rule-manager';
import { isNpcTableName } from '../engine/primary-keys';

let ValidationRuleManager = null;

export function __wireValidationEngineDeps(deps) {
  ValidationRuleManager = deps.ValidationRuleManager;
}
  // ========================================
  // ValidationEngine - 数据验证引擎
  // ========================================
  const ValidationEngine = {
    // 查找列索引（支持精确匹配和模糊 fallback）
    // 先精确匹配，找不到时 fallback 到"列名包含目标列名"的模糊匹配
    findColumnIndex(headers: (string | null)[], targetColumn: string): number {
      // 1. 精确匹配
      const exactIndex = headers.indexOf(targetColumn);
      if (exactIndex !== -1) return exactIndex;

      const normalizeColumnName = (value: unknown): string =>
        String(value ?? '')
          .trim()
          .replace(/（/g, '(')
          .replace(/）/g, ')')
          .replace(/\s+/g, '')
          .toLowerCase();
      const targetNormalized = normalizeColumnName(targetColumn);
      if (targetNormalized) {
        for (let i = 0; i < headers.length; i++) {
          if (normalizeColumnName(headers[i]) === targetNormalized) return i;
        }
      }

      // 2. 模糊匹配 fallback：找包含目标列名的列
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header && header.includes(targetColumn)) {
          return i;
        }
        const headerNormalized = normalizeColumnName(header);
        if (targetNormalized && headerNormalized.includes(targetNormalized)) return i;
      }

      return -1; // 未找到
    },

    // 格式验证（正则表达式）
    validateFormat(value, pattern) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证
      try {
        const regex = new RegExp(pattern);
        return regex.test(String(value));
      } catch (e) {
        console.error('[DICE]ValidationEngine 正则表达式错误:', pattern, e);
        return true; // 正则错误时跳过验证
      }
    },

    // 枚举验证
    validateEnum(value, allowedValues) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证
      if (!Array.isArray(allowedValues) || allowedValues.length === 0) return true;
      return allowedValues.includes(String(value));
    },

    // 数值范围验证
    validateNumeric(value, min, max) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证

      // 提取数值（支持 "50/100" 或 "力量:80" 等格式）
      const strVal = String(value);
      let numVal;

      // 尝试解析百分比格式 "50%"
      if (strVal.endsWith('%')) {
        numVal = parseFloat(strVal);
      }
      // 尝试解析分数格式 "50/100"
      else if (strVal.includes('/')) {
        const parts = strVal.split('/');
        numVal = parseFloat(parts[0]);
      }
      // 尝试解析 "属性:数值" 格式
      else if (strVal.includes(':')) {
        const parts = strVal.split(':');
        numVal = parseFloat(parts[parts.length - 1]);
      }
      // 直接解析数字
      else {
        numVal = parseFloat(strVal);
      }

      if (isNaN(numVal)) return false; // 非数值验证失败

      if (min !== undefined && min !== null && numVal < min) return false;
      if (max !== undefined && max !== null && numVal > max) return false;
      return true;
    },

    // 关联验证（检查值是否存在于另一表的某列，支持多列 OR 检查）
    validateRelation(value, rawData, refTable, refColumn) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证
      if (!rawData || !refTable || !refColumn) return true;

      // 查找引用表
      let refSheet = null;
      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === refTable) {
          refSheet = rawData[sheetId];
          break;
        }
      }

      if (!refSheet || !refSheet.content || refSheet.content.length < 2) {
        return true; // 引用表不存在或为空时跳过
      }

      const headers = refSheet.content[0];
      const strVal = String(value);

      // 支持 refColumn 为数组，任一列匹配即可
      const columns = Array.isArray(refColumn) ? refColumn : [refColumn];

      for (const col of columns) {
        const refColIndex = headers.indexOf(col);
        if (refColIndex === -1) continue; // 该列不存在，跳过检查下一列

        // 检查值是否存在于该引用列
        for (let i = 1; i < refSheet.content.length; i++) {
          if (String(refSheet.content[i][refColIndex] || '') === strVal) {
            return true; // 任一列匹配即通过
          }
        }
      }

      return columns.length === 0; // 空列数组返回 true，否则返回 false（所有列都未匹配）
    },

    // 必填验证
    validateRequired(value) {
      return value !== null && value !== undefined && String(value).trim() !== '';
    },

    // 键值对验证
    validateKeyValue(value, ruleConfig) {
      if (value === null || value === undefined || value === '') return true; // 空值不验证

      const valueType = ruleConfig?.valueType || 'text';
      const valueMin = ruleConfig?.valueMin;
      const valueMax = ruleConfig?.valueMax;

      // 预处理：修正中文标点符号和去除空格
      let processedValue = String(value);

      // 修正中文标点符号
      processedValue = processedValue
        .replace(/：/g, ':') // 中文冒号 → 英文冒号
        .replace(/；/g, ';') // 中文分号 → 英文分号
        .replace(/，/g, ';'); // 中文逗号 → 英文分号（键值对分隔符）

      // 去除所有空格
      processedValue = processedValue.replace(/\s+/g, '');

      // 解析键值对
      const pairs = processedValue.split(';').filter(p => p.trim());

      if (pairs.length === 0) return false; // 至少需要一个键值对

      // 验证每个键值对
      for (const pair of pairs) {
        const colonIndex = pair.indexOf(':');
        if (colonIndex === -1 || colonIndex === 0 || colonIndex === pair.length - 1) {
          return false; // 格式错误：缺少冒号或键/值为空
        }

        const key = pair.substring(0, colonIndex);
        const val = pair.substring(colonIndex + 1);

        if (!key || !val) return false; // 键或值不能为空

        // 如果是数值型，验证数值范围
        if (valueType === 'numeric') {
          // 验证值必须是纯数字（不能包含非数字字符）
          if (!/^-?\d+(\.\d+)?$/.test(val.trim())) return false; // 不是纯数字格式

          const numVal = parseFloat(val);
          if (isNaN(numVal)) return false; // 不是有效数字

          if (valueMin !== undefined && valueMin !== null && numVal < valueMin) return false;
          if (valueMax !== undefined && valueMax !== null && numVal > valueMax) return false;
        }
        // 文本型只验证格式，不验证值内容
      }

      return true;
    },

    // 表级只读验证（比较新旧数据）
    validateTableReadonly(oldContent, newContent) {
      if (!oldContent || !newContent) return true;
      return JSON.stringify(oldContent) === JSON.stringify(newContent);
    },

    // 行数限制验证
    validateRowLimit(rowCount, min, max) {
      if (min !== undefined && min !== null && rowCount < min) return false;
      if (max !== undefined && max !== null && rowCount > max) return false;
      return true;
    },

    // 序列递增验证（检查字段值是否严格递增）
    validateSequence(sheet, columnName, config) {
      if (!sheet || !sheet.content || sheet.content.length < 2) return true; // 空表或只有表头，通过验证
      if (!columnName || !config) return true;

      const headers = sheet.content[0] || [];
      const rows = sheet.content.slice(1) || [];
      const colIndex = headers.indexOf(columnName);
      if (colIndex < 0) return true; // 列不存在，跳过验证

      const prefix = config.prefix || '';
      const startFrom = config.startFrom !== undefined ? config.startFrom : 1;

      // 提取所有编码索引的数字部分
      const numbers = [];
      const allRowValues = []; // 记录所有行的原始值用于调试
      for (let i = 0; i < rows.length; i++) {
        const value = rows[i]?.[colIndex];
        allRowValues.push({ rowIndex: i, rawValue: value, type: typeof value });
        if (value === null || value === undefined || value === '') continue;

        const strValue = String(value).trim();
        if (!strValue) continue;

        // 匹配前缀+数字格式
        if (prefix) {
          const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`^${escapedPrefix}(\\d+)$`);
          const match = strValue.match(regex);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num)) numbers.push({ rowIndex: i, value: strValue, num });
          }
        } else {
          // 无前缀，直接解析数字
          const num = parseInt(strValue, 10);
          if (!isNaN(num)) numbers.push({ rowIndex: i, value: strValue, num });
        }
      }

      if (numbers.length === 0) return true; // 没有有效值，通过验证

      // 按行索引排序（保持原始顺序）
      numbers.sort((a, b) => a.rowIndex - b.rowIndex);

      // 检查是否有重复值
      const numSet = new Set(numbers.map(n => n.num));
      if (numSet.size !== numbers.length) {
        return false; // 有重复值
      }

      // 检查是否从startFrom开始严格递增
      // 要求：第一行必须是startFrom，第二行必须是startFrom+1，以此类推
      for (let i = 0; i < numbers.length; i++) {
        const expectedNum = startFrom + i;
        const actualNum = numbers[i].num;
        if (actualNum !== expectedNum) {
          return false; // 发现跳号、重复或不是从startFrom开始
        }
      }

      return true;
    },

    // 检查拦截规则（用于更新拦截，检查所有启用了 intercept 的规则）
    checkTableRules(snapshot, newData, rules) {
      const violations = [];
      if (!snapshot || !newData || !rules) return violations;

      for (const rule of rules) {
        // 只检查启用了拦截的规则
        if (!rule.enabled || !rule.intercept) continue;
        const typeInfo = RULE_TYPE_INFO[rule.ruleType];
        if (!typeInfo) continue;

        // 查找目标表
        let oldSheet = null,
          newSheet = null;
        for (const sheetId in snapshot) {
          if (
            snapshot[sheetId]?.name === rule.targetTable ||
            (isNpcTableName(snapshot[sheetId]?.name) && isNpcTableName(rule.targetTable))
          ) {
            oldSheet = snapshot[sheetId];
            break;
          }
        }
        for (const sheetId in newData) {
          if (
            newData[sheetId]?.name === rule.targetTable ||
            (isNpcTableName(newData[sheetId]?.name) && isNpcTableName(rule.targetTable))
          ) {
            newSheet = newData[sheetId];
            break;
          }
        }

        // 表不存在时，对于 rowLimit 规则视为 0 行
        if (!newSheet) {
          if (rule.ruleType === 'rowLimit' && rule.config?.min && rule.config.min > 0) {
            violations.push({
              rule,
              tableName: rule.targetTable,
              message: rule.errorMessage || `表 "${rule.targetTable}" 不存在或为空 (需要至少 ${rule.config.min} 行)`,
            });
          }
          continue;
        }

        // 表级规则检查
        if (typeInfo.scope === 'table') {
          if (rule.ruleType === 'tableReadonly') {
            if (!this.validateTableReadonly(oldSheet?.content, newSheet?.content)) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                message: rule.errorMessage || `表 "${rule.targetTable}" 为只读，不允许修改`,
              });
            }
          } else if (rule.ruleType === 'rowLimit') {
            const rowCount = (newSheet.content?.length || 1) - 1; // 减去表头
            if (!this.validateRowLimit(rowCount, rule.config?.min, rule.config?.max)) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                message:
                  rule.errorMessage ||
                  `表 "${rule.targetTable}" 行数 ${rowCount} 超出限制 (${rule.config?.min || 0}-${rule.config?.max || '∞'})`,
              });
            }
          } else if (rule.ruleType === 'sequence' && rule.targetColumn) {
            // 序列递增验证
            if (!this.validateSequence(newSheet, rule.targetColumn, rule.config || {})) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                message:
                  rule.errorMessage ||
                  `字段 "${rule.targetColumn}" 的编码索引必须从${rule.config?.prefix || ''}${String(rule.config?.startFrom || 1).padStart(4, '0')}开始严格递增，不可跳号或重复`,
              });
            }
          }
        }
        // 字段级规则检查
        else if (typeInfo.scope === 'field' && rule.targetColumn) {
          const headers = newSheet.content?.[0] || [];
          const colIndex = this.findColumnIndex(headers, rule.targetColumn);
          if (colIndex === -1) continue;

          // 检查新数据中的每一行
          for (let rowIdx = 1; rowIdx < (newSheet.content?.length || 0); rowIdx++) {
            const row = newSheet.content[rowIdx];
            const value = row?.[colIndex];
            const isValid = this.validateValue(value, rule, newData);

            if (!isValid) {
              violations.push({
                rule,
                tableName: rule.targetTable,
                rowIndex: rowIdx,
                columnName: rule.targetColumn,
                currentValue: String(value ?? ''),
                message: rule.errorMessage || `字段 "${rule.targetColumn}" 验证失败`,
              });
              // 只报告第一个违规即可触发回滚
              break;
            }
          }
        }
      }
      return violations;
    },

    // 验证单个值
    validateValue(value, rule, rawData) {
      switch (rule.ruleType) {
        case 'format':
          return this.validateFormat(value, rule.config?.pattern);
        case 'enum':
          return this.validateEnum(value, rule.config?.values);
        case 'numeric':
          return this.validateNumeric(value, rule.config?.min, rule.config?.max);
        case 'relation':
          return this.validateRelation(value, rawData, rule.config?.refTable, rule.config?.refColumn);
        case 'required':
          return this.validateRequired(value);
        case 'keyValue':
          return this.validateKeyValue(value, rule.config);
        default:
          return true;
      }
    },

    // 验证单行数据
    validateRow(row, headers, tableName, rowIndex, rules, rawData) {
      const errors = [];
      // 获取第一列的值（通常是名称列，优先使用第二列，否则使用第一列）
      const rowTitle = row[1] || row[0] || `行 ${rowIndex + 1}`;

      for (const rule of rules) {
        if (rule.targetTable !== tableName && !(isNpcTableName(rule.targetTable) && isNpcTableName(tableName)))
          continue;
        if (!rule.enabled) continue;

        // 找到目标列
        const colIndex = this.findColumnIndex(headers, rule.targetColumn);
        if (colIndex === -1) continue;

        const value = row[colIndex];
        const isValid = this.validateValue(value, rule, rawData);

        if (!isValid) {
          errors.push({
            ruleId: rule.id,
            ruleName: rule.name,
            ruleType: rule.ruleType,
            rule: rule, // 保存完整规则对象用于智能修改
            tableName: tableName,
            rowIndex: rowIndex,
            columnName: rule.targetColumn,
            currentValue: String(value ?? ''),
            rowTitle: rowTitle, // 添加第一列的值，用于标识错误行
            errorMessage: rule.errorMessage,
            severity: 'error',
          });
        }
      }

      return errors;
    },

    // 验证整个数据集
    validateAllData(rawData) {
      if (!rawData) return [];

      const rules = ValidationRuleManager.getEnabledRules();
      if (rules.length === 0) return [];

      const allErrors = [];

      for (const sheetId in rawData) {
        if (!sheetId.startsWith('sheet_')) continue;
        const sheet = rawData[sheetId];
        if (!sheet?.name || !sheet?.content) continue;

        const tableName = sheet.name;
        const headers = sheet.content[0];
        const tableRules = rules.filter(r => r.targetTable === tableName);

        if (tableRules.length === 0) continue;

        // 检查表级规则（如行数限制、序列递增）—— 即使表格为空也要检查
        for (const rule of tableRules) {
          const typeInfo = RULE_TYPE_INFO[rule.ruleType];
          if (typeInfo?.scope === 'table') {
            if (rule.ruleType === 'rowLimit') {
              const rowCount = sheet.content.length - 1;
              if (!this.validateRowLimit(rowCount, rule.config?.min, rule.config?.max)) {
                allErrors.push({
                  ruleId: rule.id,
                  ruleName: rule.name,
                  ruleType: rule.ruleType,
                  rule: rule, // 保存完整规则对象用于智能修改
                  tableName: tableName,
                  rowIndex: -1, // 表级错误
                  columnName: '',
                  currentValue: `${rowCount} 行`,
                  errorMessage:
                    rule.errorMessage ||
                    `行数 ${rowCount} 超出限制 (${rule.config?.min || 0}-${rule.config?.max || '∞'})`,
                  severity: 'warning',
                });
              }
            } else if (rule.ruleType === 'sequence' && rule.targetColumn) {
              // 序列递增验证
              const isValid = this.validateSequence(sheet, rule.targetColumn, rule.config || {});
              if (!isValid) {
                const error = {
                  ruleId: rule.id,
                  ruleName: rule.name,
                  ruleType: rule.ruleType,
                  rule: rule, // 保存完整规则对象用于智能修改
                  tableName: tableName,
                  rowIndex: -1, // 表级错误
                  columnName: rule.targetColumn,
                  currentValue: '',
                  errorMessage:
                    rule.errorMessage ||
                    `字段 "${rule.targetColumn}" 的编码索引必须从${rule.config?.prefix || ''}${String(rule.config?.startFrom || 1).padStart(4, '0')}开始严格递增，不可跳号或重复`,
                  severity: 'error',
                };
                allErrors.push(error);
              }
            }
            // tableReadonly 不在这里检查（需要对比快照）
          }
        }

        // 验证每一行（字段级规则）
        const fieldRules = tableRules.filter(r => RULE_TYPE_INFO[r.ruleType]?.scope !== 'table');
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          const rowErrors = this.validateRow(row, headers, tableName, i - 1, fieldRules, rawData);
          allErrors.push(...rowErrors);
        }
      }

      return allErrors;
    },

    // 验证特定表的数据
    validateTable(rawData, tableName) {
      if (!rawData) return [];

      const rules = ValidationRuleManager.getRulesByTable(tableName);
      if (rules.length === 0) return [];

      // 查找表
      let targetSheet = null;
      for (const sheetId in rawData) {
        if (rawData[sheetId]?.name === tableName) {
          targetSheet = rawData[sheetId];
          break;
        }
      }

      if (!targetSheet || !targetSheet.content || targetSheet.content.length < 2) {
        return [];
      }

      const headers = targetSheet.content[0];
      const allErrors = [];

      for (let i = 1; i < targetSheet.content.length; i++) {
        const row = targetSheet.content[i];
        const rowErrors = this.validateRow(row, headers, tableName, i - 1, rules, rawData);
        allErrors.push(...rowErrors);
      }

      return allErrors;
    },

    // 按表名分组验证结果
    groupErrorsByTable(errors) {
      const grouped = {};
      for (const error of errors) {
        if (!grouped[error.tableName]) {
          grouped[error.tableName] = [];
        }
        grouped[error.tableName].push(error);
      }
      return grouped;
    },

    // 获取验证错误数量
    getErrorCount(rawData) {
      return this.validateAllData(rawData).length;
    },
  };
export { ValidationEngine }; // __wireValidationEngineDeps 已由头部 export function 导出
