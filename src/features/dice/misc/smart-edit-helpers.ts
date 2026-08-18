// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=31「智能修改辅助函数」
// 原行范围：42625-42787（含 banner 42620-42787）；拆分批次 1；外部 closure 依赖：0
  // ========================================
  // 智能修改辅助函数
  // ========================================

  // 格式验证智能推算
  function suggestFormatValue(pattern, rowIndex, existingValues = [], tableContent = null) {
    if (!pattern || rowIndex === undefined || rowIndex < 0) return null;

    try {
      // 识别 "前缀+数字" 模式，如 ^AM\d{3}$
      // pattern 在 JavaScript 字符串中是 '^AM\\d{3}$'，实际内容是 '^AM\d{3}$'
      // 在正则匹配时，要匹配字面量 \d{3}，需要用 /\\d\{3\}/（转义后的反斜杠+d，转义后的花括号）
      // 匹配格式：^?[字母]+\d\{数字\}$?
      const prefixMatch = pattern.match(/^\^?([A-Za-z]+)\\d\{(\d+)\}\$?$/);

      if (prefixMatch) {
        const prefix = prefixMatch[1]; // "AM"
        const digits = parseInt(prefixMatch[2], 10); // 3

        // 【改进】对于总结表和总体大纲，基于现有值计算下一个编码
        if (tableContent && (tableContent.name === '总结表' || tableContent.name === '总体大纲')) {
          const headers = tableContent.content?.[0] || [];
          const rows = tableContent.content?.slice(1) || [];
          const codeIndex = headers.indexOf('编码索引');

          if (codeIndex >= 0) {
            // 提取所有现有编码索引的数字部分
            const existingNumbers = [];
            rows.forEach(row => {
              const codeValue = row?.[codeIndex];
              if (codeValue && typeof codeValue === 'string') {
                const match = codeValue.match(new RegExp(`^${prefix}(\\d+)$`));
                if (match) {
                  const num = parseInt(match[1], 10);
                  if (!isNaN(num)) existingNumbers.push(num);
                }
              }
            });

            // 计算下一个数字
            const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
            const nextNum = String(maxNum + 1).padStart(digits, '0');
            return prefix + nextNum;
          }
        }

        // 原有逻辑：基于行索引（作为后备方案）
        const nextNum = String(rowIndex + 1).padStart(digits, '0');
        return prefix + nextNum;
      }

      // 尝试识别其他常见模式，如 \d{3} 单独出现（仅数字）
      const numOnlyMatch = pattern.match(/^\^?\\d\{(\d+)\}\$?$/);
      if (numOnlyMatch) {
        const digits = parseInt(numOnlyMatch[1], 10);
        return String(rowIndex + 1).padStart(digits, '0');
      }
    } catch (e) {
      console.error('[DICE]ACU 格式推算失败:', e);
    }

    return null; // 无法推算，显示空输入框
  }

  // 关联验证下拉选项提取（支持多列 OR 合并）
  function getRelationOptions(refTable, refColumns, rawData) {
    const options = new Set();
    if (!refTable || !refColumns || !rawData) return Array.from(options);

    const columns = Array.isArray(refColumns) ? refColumns : [refColumns];

    // 查找引用表
    for (const sheetId in rawData) {
      if (rawData[sheetId]?.name === refTable) {
        const headers = rawData[sheetId].content?.[0] || [];
        const rows = rawData[sheetId].content?.slice(1) || [];

        // 遍历所有指定的列
        columns.forEach(col => {
          const colIdx = headers.indexOf(col);
          if (colIdx >= 0) {
            rows.forEach(row => {
              const value = row?.[colIdx];
              if (value !== null && value !== undefined && String(value).trim() !== '') {
                options.add(String(value).trim());
              }
            });
          }
        });

        break; // 找到表后跳出
      }
    }

    return Array.from(options).sort();
  }

  // 检查值是否已存在于关联表的任何列中（用于判断是否需要反向写入）
  function isValueInRelationTable(value, refTable, refColumns, rawData) {
    if (!value || !refTable || !refColumns || !rawData) return false;
    if (String(value).trim() === '') return false;

    const columns = Array.isArray(refColumns) ? refColumns : [refColumns];
    const strVal = String(value).trim();

    // 查找引用表
    for (const sheetId in rawData) {
      if (rawData[sheetId]?.name === refTable) {
        const headers = rawData[sheetId].content?.[0] || [];
        const rows = rawData[sheetId].content?.slice(1) || [];

        // 遍历所有指定的列
        for (const col of columns) {
          const colIdx = headers.indexOf(col);
          if (colIdx === -1) continue;

          // 检查值是否存在于该列
          for (let i = 0; i < rows.length; i++) {
            const cellValue = rows[i]?.[colIdx];
            if (cellValue !== null && cellValue !== undefined && String(cellValue).trim() === strVal) {
              return true; // 找到匹配值
            }
          }
        }

        break; // 找到表后跳出
      }
    }

    return false; // 值不存在于任何列中
  }

  // 获取同列其他行的示例值（用于 required 规则）
  function getColumnExamples(tableName, columnName, currentRowIndex, rawData, maxCount = 5) {
    const examples = new Set();
    if (!tableName || !columnName || !rawData) return [];

    for (const sheetId in rawData) {
      if (rawData[sheetId]?.name === tableName) {
        const headers = rawData[sheetId].content?.[0] || [];
        const rows = rawData[sheetId].content?.slice(1) || [];
        const colIdx = headers.indexOf(columnName);

        if (colIdx >= 0) {
          rows.forEach((row, idx) => {
            if (idx !== currentRowIndex) {
              const value = row?.[colIdx];
              if (value !== null && value !== undefined && String(value).trim() !== '') {
                examples.add(String(value).trim());
              }
            }
          });
        }
        break;
      }
    }

    return Array.from(examples).slice(0, maxCount);
  }

  // 获取数值的最近有效值
  function getNearestValidNumber(currentValue, min, max) {
    const num = parseFloat(currentValue);
    if (isNaN(num)) return min !== undefined ? min : 0;
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return num;
  }
export {
  suggestFormatValue,
  getRelationOptions,
  isValueInRelationTable,
  getColumnExamples,
  getNearestValidNumber,
};
