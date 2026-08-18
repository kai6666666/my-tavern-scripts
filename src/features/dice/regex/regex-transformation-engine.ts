// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=15「RegexTransformationEngine - 正则转换引擎 (Phase 2.1)」
// 原行范围：5309-5819（含 banner 5306-5819）；拆分批次 3；外部 closure 依赖：1（RegexTransformationManager@13）
// 接线说明：RegexTransformationManager 定义于 index.ts IIFE 内（章节13，本批次未拆分）无法 export，采用运行时注入避免循环 import：
//   index.ts IIFE 末尾调用 __wireRegexTransformationManager(RegexTransformationManager) 注入真实实现；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。
// 类型（RegexFlags/RegexTransformationRule/RegexTransformResult/RegexPreviewResult/RegexExecutionMode）来自同批次 regex-types.ts，import type 引入。

import type { RegexFlags, RegexTransformationRule, RegexTransformResult, RegexPreviewResult, RegexExecutionMode } from './regex-types';

let RegexTransformationManager = null;

export function __wireRegexTransformationManager(fn) {
  RegexTransformationManager = fn;
}
  // ========================================
  // RegexTransformationEngine - 正则转换引擎 (Phase 2.1)
  // ========================================
  const RegexTransformationEngine = {
    // 正则表达式缓存
    _regexCache: new Map<string, RegExp>(),

    // 构建正则标志位字符串
    _buildFlags(flags: RegexFlags): string {
      const result: string[] = [];
      if (flags.caseInsensitive) result.push('i');
      if (flags.global) result.push('g');
      if (flags.multiline) result.push('m');
      if (flags.unicode) result.push('u');
      if (flags.sticky) result.push('y');
      return result.join('');
    },

    // 获取或创建正则表达式(带缓存)
    _getRegex(pattern: string, flags: RegexFlags): RegExp | null {
      // 检测是否需要 unicode 标志（负向后顾断言和正向后顾断言需要）
      const hasLookbehind = pattern.includes('(?<') || pattern.includes('(?<=');
      const hasLookahead = pattern.includes('(?=') || pattern.includes('(?!');
      const needsUnicode = hasLookbehind || hasLookahead;

      // 如果检测到需要 unicode 标志但未设置，自动添加
      if (needsUnicode && !flags.unicode) {
        flags = { ...flags, unicode: true };
      }

      const flagsStr = this._buildFlags(flags);
      const cacheKey = `${pattern}/${flagsStr}`;

      if (this._regexCache.has(cacheKey)) {
        const regex = this._regexCache.get(cacheKey)!;
        regex.lastIndex = 0;
        return regex;
      }

      try {
        const regex = new RegExp(pattern, flagsStr);
        this._regexCache.set(cacheKey, regex);
        return regex;
      } catch (e) {
        console.error('[DICE]RegexTransformationEngine: 正则表达式错误', pattern, e);
        return null;
      }
    },

    // ReDoS防护: 评分正则复杂度
    _scoreRegexComplexity(pattern: string): number {
      let score = 0;

      // 嵌套量词 +50分
      if (/(\*|\+|\{)\1{2,}/.test(pattern)) score += 50;

      // 回溯风险 +30分
      if (/(\.\*|\.\+)[^\[]*\1/.test(pattern)) score += 30;

      // 捕获组过多 +10分
      const captureGroups = (pattern.match(/\(/g) || []).length;
      score += Math.min(captureGroups * 5, 20);

      return score;
    },

    // ReDoS防护: 获取规则的超时时间
    _getTimeoutForRule(rule: RegexTransformationRule): number {
      const complexity = this._scoreRegexComplexity(rule.pattern);
      const baseTimeout = rule.security?.maxMatchTime || 100;
      // 复杂度越高,超时时间越短
      return Math.max(baseTimeout - complexity * 2, 50);
    },

    // 安全地应用正则替换
    _safeReplace(value: string, rule: RegexTransformationRule, regex: RegExp): RegexTransformResult {
      const oldValue = value;

      // 检查输入长度
      const maxInputLength = rule.security?.maxInputLength || 10000;
      if (value.length > maxInputLength) {
        return {
          success: false,
          oldValue,
          newValue: oldValue,
          matched: false,
          error: `输入长度超过限制(${maxInputLength})`,
        };
      }

      try {
        const timeout = this._getTimeoutForRule(rule);
        const startTime = Date.now();

        // 执行替换
        let newValue: string;
        switch (rule.operation) {
          case 'replace':
            newValue = value.replace(regex, rule.replacement || '');
            break;
          case 'delete':
            newValue = value.replace(regex, '');
            break;
          case 'validate':
            const isValid = regex.test(value);
            newValue = value;
            break;
          default:
            newValue = value;
        }

        // 检查超时
        const elapsed = Date.now() - startTime;
        if (elapsed > timeout) {
          console.warn('[DICE]RegexTransformationEngine: 正则匹配超时', rule.pattern, elapsed);
          return {
            success: false,
            oldValue,
            newValue: oldValue,
            matched: false,
            error: `匹配超时(${elapsed}ms > ${timeout}ms)`,
          };
        }

        // 只有实际改变内容才算可写入转换，避免自替换规则反复触发保存。
        const matched = oldValue !== newValue;

        return {
          success: true,
          oldValue,
          newValue,
          matched,
        };
      } catch (e) {
        console.error('[DICE]RegexTransformationEngine: 正则替换错误', rule.pattern, e);
        return {
          success: false,
          oldValue,
          newValue: oldValue,
          matched: false,
          error: String(e),
        };
      }
    },

    // 对单个值应用规则
    applyToValue(value: string, rule: RegexTransformationRule): RegexTransformResult {
      if (value === null || value === undefined) {
        return {
          success: true,
          oldValue: '',
          newValue: '',
          matched: false,
        };
      }

      const strValue = String(value);

      // 如果 pattern 包含内联 flags（如 /pattern/flags），先提取它们
      let pattern = rule.pattern;
      let flags = rule.flags || {};

      // 检查是否是 /pattern/flags 格式
      const extracted = this._extractFlags(pattern);
      if (extracted.patternWithoutFlags !== pattern) {
        // 如果提取成功，使用提取后的 pattern 和合并后的 flags
        pattern = extracted.patternWithoutFlags;
        flags = { ...flags, ...extracted.flags };
      }

      // 对于数据转换场景，默认使用全局替换（除非明确指定不全局）
      // 如果 flags 中没有明确设置 global，默认设为 true
      if (flags.global === undefined) {
        flags.global = true;
      }

      const regex = this._getRegex(pattern, flags);

      if (!regex) {
        return {
          success: false,
          oldValue: strValue,
          newValue: strValue,
          matched: false,
          error: '无效的正则表达式',
        };
      }

      return this._safeReplace(strValue, rule, regex);
    },

    // 从模式字符串中提取内联flags (例如: /test/g 中的 'g')
    _extractFlags(patternStr: string): { flags: RegexFlags; patternWithoutFlags: string } {
      const flags: RegexFlags = {
        global: false,
        caseInsensitive: false,
        multiline: false,
        unicode: false,
        sticky: false,
      };

      // 检查是否是 /pattern/flags 格式
      const inlineFlagMatch = patternStr.match(/^\/(.+)\/([gimuy]*)$/);
      if (inlineFlagMatch) {
        const [, patternWithoutFlags, flagStr] = inlineFlagMatch;
        if (flagStr.includes('g')) flags.global = true;
        if (flagStr.includes('i')) flags.caseInsensitive = true;
        if (flagStr.includes('m')) flags.multiline = true;
        if (flagStr.includes('u')) flags.unicode = true;
        if (flagStr.includes('y')) flags.sticky = true;
        return { flags, patternWithoutFlags };
      }

      // 否则返回原始模式和空flags
      return { flags, patternWithoutFlags: patternStr };
    },

    // 对整个表格应用规则
    applyToTable(
      tableData:
        | { name: string; headers: string[]; rows: string[][] }
        | { [key: string]: { name?: string; content?: string[][] } },
      rules: RegexTransformationRule[],
    ): { totalApplied: number; errors: string[]; modifiedSheetKeys: string[] } {
      let totalApplied = 0;
      const errors: string[] = [];
      const modifiedSheetKeys: string[] = [];

      try {
        // 兼容神数据库格式和简化格式
        let isSimpleFormat = false;
        let sheetMap: Map<
          string,
          { sheet: any; sheetKey: string; name: string; headers: string[]; contentRowIndex: number }
        > = new Map();

        if ('name' in tableData && 'headers' in tableData && 'rows' in tableData) {
          // 简化格式: { name, headers, rows }
          isSimpleFormat = true;
          const simpleTable = tableData as { name: string; headers: string[]; rows: string[][] };
          sheetMap.set(simpleTable.name, {
            sheet: simpleTable,
            sheetKey: simpleTable.name,
            name: simpleTable.name,
            headers: simpleTable.headers,
            contentRowIndex: -1, // 简化格式不使用 contentRowIndex
          });
        } else {
          // 神数据库格式: { sheet_xxx: { name, content: [headers, ...rows] } }
          const dataObj = tableData as { [key: string]: { name?: string; content?: string[][] } };

          Object.keys(dataObj).forEach(sheetKey => {
            if (!sheetKey.startsWith('sheet_')) return;

            const sheet = dataObj[sheetKey];
            if (!sheet || !sheet.content || !Array.isArray(sheet.content) || sheet.content.length < 1) {
              console.warn(`[DICE]applyToTable: 跳过无效表格 ${sheetKey}`);
              return;
            }

            const tableName = sheet.name || sheetKey;
            sheetMap.set(tableName, {
              sheet,
              sheetKey,
              name: tableName,
              headers: sheet.content[0] || [],
              contentRowIndex: 0, // 表头在 content[0]
            });
          });
        }

        if (sheetMap.size === 0) {
          console.warn('[DICE]applyToTable: 没有有效的表格数据');
          return { totalApplied: 0, errors: ['没有有效的表格数据'], modifiedSheetKeys: [] };
        }

        // 对每个表格应用规则
        for (const [tableName, tableInfo] of sheetMap.entries()) {
          const { sheet, headers, sheetKey } = tableInfo;
          let tableModified = false;

          for (const rule of rules) {
            if (!rule.enabled) continue;

            // 获取规则作用域
            const scope = rule.scope;
            const shouldProcessTable = scope.type === 'global' || scope.tableNames?.includes(tableName);

            if (!shouldProcessTable) continue;

            try {
              // 处理每一行
              if (isSimpleFormat) {
                // 简化格式：直接修改 rows
                const rows = (sheet as { rows: string[][] }).rows;
                for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                  const row = rows[rowIndex];

                  // 处理每个单元格
                  for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const columnName = headers[colIndex];

                    // 检查列级作用域
                    if (scope.type === 'column') {
                      if (!scope.columnNames?.includes(columnName)) continue;
                    }

                    // 应用规则
                    const result = this.applyToValue(row[colIndex], rule);
                    if (result.success) {
                      if (result.matched && result.oldValue !== result.newValue) {
                        row[colIndex] = result.newValue;
                        totalApplied++;
                        tableModified = true;
                      }
                    } else {
                      errors.push(`${rule.name} [${tableName}]: ${result.error}`);
                    }
                  }
                }
              } else {
                // 神数据库格式：直接修改 content 数组（跳过表头，从 content[1] 开始）
                const content = sheet.content;
                for (let contentRowIndex = 1; contentRowIndex < content.length; contentRowIndex++) {
                  const row = content[contentRowIndex];
                  if (!Array.isArray(row)) continue;

                  // 处理每个单元格
                  for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const columnName = headers[colIndex];

                    // 检查列级作用域
                    if (scope.type === 'column') {
                      if (!scope.columnNames?.includes(columnName)) continue;
                    }

                    // 应用规则
                    const oldValue = row[colIndex];
                    const result = this.applyToValue(oldValue, rule);

                    if (result.success) {
                      if (result.matched && result.oldValue !== result.newValue) {
                        row[colIndex] = result.newValue;
                        totalApplied++;
                        tableModified = true;
                        console.debug(
                          `[DICE]正则转换: ${tableName}[${contentRowIndex}].${columnName}`,
                          `"${result.oldValue}" -> "${result.newValue}"`,
                        );
                      }
                    } else {
                      errors.push(`${rule.name} [${tableName}]: ${result.error}`);
                    }
                  }
                }
              }
            } catch (tableError) {
              const errorMsg = tableError instanceof Error ? tableError.message : String(tableError);
              console.error(`[DICE]applyToTable: 处理表格 ${tableName} 时出错:`, tableError);
              errors.push(`${rule.name} [${tableName}]: 处理表格时出错 - ${errorMsg}`);
            }
          }
          if (tableModified && sheetKey) {
            modifiedSheetKeys.push(sheetKey);
          }
        }

        if (totalApplied > 0) {
          console.info(`[DICE]applyToTable: 成功应用 ${totalApplied} 处转换`);
        }
        if (errors.length > 0) {
          console.warn(`[DICE]applyToTable: 遇到 ${errors.length} 个错误`);
        }
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        console.error('[DICE]applyToTable: 执行失败:', e);
        errors.push(`执行失败: ${errorMsg}`);
      }

      return { totalApplied, errors, modifiedSheetKeys };
    },

    // 对单元格应用规则
    applyToCell(
      value: string,
      tableName: string,
      columnName: string,
      executeMode?: RegexExecutionMode,
    ): RegexTransformResult {
      // 获取适用的规则
      const rules = RegexTransformationManager.getApplicableRules(tableName, columnName);

      // 如果没有规则,直接返回
      if (rules.length === 0) {
        return {
          success: true,
          oldValue: value || '',
          newValue: value || '',
          matched: false,
        };
      }

      // 过滤执行模式
      let applicableRules = rules;
      if (executeMode) {
        applicableRules = rules.filter(r => r.executeMode === executeMode || r.executeMode === 'auto');
      }

      if (applicableRules.length === 0) {
        return {
          success: true,
          oldValue: value || '',
          newValue: value || '',
          matched: false,
        };
      }

      // 依次应用规则
      let currentValue = value || '';
      let wasMatched = false;

      for (const rule of applicableRules) {
        const result = this.applyToValue(currentValue, rule);
        if (!result.success) {
          return result;
        }
        if (result.matched) {
          wasMatched = true;
        }
        currentValue = result.newValue;
      }

      return {
        success: true,
        oldValue: value || '',
        newValue: currentValue,
        matched: wasMatched,
      };
    },

    // 对行数据应用规则
    applyToRow(row: string[], headers: string[], tableName: string, executeMode?: RegexExecutionMode): string[] {
      return row.map((cell, index) => {
        const columnName = headers[index];
        const result = this.applyToCell(cell, tableName, columnName, executeMode);
        return result.newValue;
      });
    },

    // 预览批量转换结果
    previewBatchTransform(
      tableData: { name: string; headers: string[]; rows: string[][] },
      executeMode?: RegexExecutionMode,
    ): RegexPreviewResult[] {
      const tableName = tableData.name;
      const rules = RegexTransformationManager.getApplicableRules(tableName, null).filter(
        r => r.scope.type === 'global' || r.scope.tableNames?.includes(tableName),
      );

      const results: RegexPreviewResult[] = [];

      for (const rule of rules) {
        const affectedCells: RegexPreviewResult['affectedCells'] = [];
        let totalAffected = 0;

        for (let rowIndex = 0; rowIndex < tableData.rows.length; rowIndex++) {
          const row = tableData.rows[rowIndex];
          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const columnName = tableData.headers[colIndex];
            const value = row[colIndex];

            // 检查作用域
            if (rule.scope.type === 'column') {
              if (!rule.scope.columnNames?.includes(columnName) || !rule.scope.tableNames?.includes(tableName)) {
                continue;
              }
            } else if (rule.scope.type === 'table') {
              if (!rule.scope.tableNames?.includes(tableName)) {
                continue;
              }
            }

            const result = this.applyToValue(value, rule);
            if (result.matched && result.oldValue !== result.newValue) {
              affectedCells.push({
                tableName,
                rowIndex,
                columnIndex: colIndex,
                columnName,
                oldValue: result.oldValue,
                newValue: result.newValue,
              });
              totalAffected++;
            }
          }
        }

        if (totalAffected > 0) {
          results.push({
            rule,
            affectedCells,
            totalAffected,
          });
        }
      }

      return results;
    },

    // 清除正则缓存
    clearRegexCache() {
      this._regexCache.clear();
    },
  };
export { RegexTransformationEngine }; // __wireRegexTransformationManager 已由头部 export function 导出
