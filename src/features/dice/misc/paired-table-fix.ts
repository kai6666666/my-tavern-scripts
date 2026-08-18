// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=35「配对表编码修复辅助函数」
// 原行范围：44037-44336（含 banner 44031-44336）；拆分批次 1；外部 closure 依赖：0
  // ========================================
  // ========================================
  // 配对表编码修复辅助函数
  // ========================================

  // 从表中提取所有编码值
  function extractCodesFromTable(sheet, columnName, prefix) {
    if (!sheet || !sheet.content || sheet.content.length < 2) {
      return { codes: new Map(), allCodes: new Set(), codeToRows: new Map() };
    }

    const headers = sheet.content[0] || [];
    const rows = sheet.content.slice(1) || [];
    const colIndex = headers.indexOf(columnName);

    if (colIndex < 0) {
      return { codes: new Map(), allCodes: new Set(), codeToRows: new Map() };
    }

    const codes = new Map(); // Map<编码值, 行索引数组>
    const allCodes = new Set(); // Set<编码值>
    const codeToRows = new Map(); // Map<编码值, 行索引数组>

    for (let i = 0; i < rows.length; i++) {
      const value = rows[i]?.[colIndex];
      if (value === null || value === undefined || value === '') continue;

      const strValue = String(value).trim();
      if (!strValue) continue;

      // 验证编码格式
      let isValid = false;
      if (prefix) {
        const match = strValue.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
        if (match) {
          isValid = true;
        }
      } else {
        const num = parseInt(strValue, 10);
        if (!isNaN(num)) {
          isValid = true;
        }
      }

      if (isValid) {
        allCodes.add(strValue);
        if (!codeToRows.has(strValue)) {
          codeToRows.set(strValue, []);
        }
        codeToRows.get(strValue).push(i);
      }
    }

    return { codes, allCodes, codeToRows };
  }

  // 构建编码映射：旧编码 → 新编码
  function buildCodeMapping(codes1, codes2, prefix, startFrom) {
    // 合并两个表的所有唯一编码值
    const allUniqueCodes = new Set([...codes1, ...codes2]);

    // 提取数字部分并排序
    const codeNumbers = [];
    for (const code of allUniqueCodes) {
      let num = null;
      if (prefix) {
        const match = code.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
        if (match) {
          num = parseInt(match[1], 10);
        }
      } else {
        num = parseInt(code, 10);
      }

      if (!isNaN(num)) {
        codeNumbers.push({ code, num });
      }
    }

    // 按数字部分排序
    codeNumbers.sort((a, b) => a.num - b.num);

    // 建立映射：旧编码 → 新编码
    const mapping = new Map();
    for (let i = 0; i < codeNumbers.length; i++) {
      const oldCode = codeNumbers[i].code;
      const newNum = startFrom + i;
      const newCode = prefix + String(newNum).padStart(4, '0');
      mapping.set(oldCode, newCode);
    }

    return mapping;
  }

  // 对齐和修复配对表
  // 核心逻辑：
  // 1. 编码为空的行保持原位置不动（这些是错误数据，由必填规则检测）
  // 2. 有效编码行更新编码值，修复跳号
  // 3. 缺失的编码插入空白行，保证两表有编码的行数一致
  function alignAndFixPairedTables(
    table1Sheet,
    table1SheetId,
    table2Sheet,
    table2SheetId,
    columnName,
    mapping,
    prefix,
    startFrom,
    rawData,
  ) {
    if (!table1Sheet || !table2Sheet) return { fixedCount1: 0, fixedCount2: 0 };

    const headers1 = table1Sheet.content[0] || [];
    const rows1 = table1Sheet.content.slice(1) || [];
    const colIndex1 = headers1.indexOf(columnName);

    const headers2 = table2Sheet.content[0] || [];
    const rows2 = table2Sheet.content.slice(1) || [];
    const colIndex2 = headers2.indexOf(columnName);

    if (colIndex1 < 0 || colIndex2 < 0) return { fixedCount1: 0, fixedCount2: 0 };

    let fixedCount1 = 0;
    let fixedCount2 = 0;

    // 构建反向映射：新编码 -> 旧编码
    const reverseMapping = new Map();
    for (const [oldCode, newCode] of mapping.entries()) {
      reverseMapping.set(newCode, oldCode);
    }

    // 按新编码的数字部分排序
    const sortedNewCodes = Array.from(mapping.values()).sort((a, b) => {
      const numA = parseInt(a.replace(prefix, ''), 10);
      const numB = parseInt(b.replace(prefix, ''), 10);
      return numA - numB;
    });

    // 分析表结构：识别有效编码行和空白编码行，记录空白行在哪两个编码之间
    const analyzeTable = (rows, colIndex) => {
      const codeRows = []; // {rowIndex, oldCode, row}
      const emptyRows = []; // {rowIndex, row, prevOldCode, nextOldCode}

      for (let i = 0; i < rows.length; i++) {
        const value = rows[i]?.[colIndex];
        const strValue = value === null || value === undefined ? '' : String(value).trim();

        // 检查是否是有效编码
        let isValid = false;
        if (strValue && prefix) {
          const match = strValue.match(new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\d+)$`));
          if (match) isValid = true;
        } else if (strValue) {
          const num = parseInt(strValue, 10);
          if (!isNaN(num)) isValid = true;
        }

        if (isValid) {
          codeRows.push({ rowIndex: i, oldCode: strValue, row: rows[i] });
        } else {
          emptyRows.push({ rowIndex: i, row: rows[i], prevOldCode: null, nextOldCode: null });
        }
      }

      // 为每个空白行确定它在哪两个编码之间
      for (const emptyRow of emptyRows) {
        let prevCode = null;
        let nextCode = null;

        for (const codeRow of codeRows) {
          if (codeRow.rowIndex < emptyRow.rowIndex) {
            prevCode = codeRow.oldCode;
          }
          if (codeRow.rowIndex > emptyRow.rowIndex && nextCode === null) {
            nextCode = codeRow.oldCode;
            break;
          }
        }

        emptyRow.prevOldCode = prevCode;
        emptyRow.nextOldCode = nextCode;
      }

      return { codeRows, emptyRows };
    };

    const analysis1 = analyzeTable(rows1, colIndex1);
    const analysis2 = analyzeTable(rows2, colIndex2);

    // 构建新的行序列
    const buildNewRows = (analysis, headers, colIndex, allOldCodes) => {
      const newRows = [];
      const codeRowMap = new Map(); // oldCode -> row data

      // 构建旧编码到行数据的映射
      for (const cr of analysis.codeRows) {
        codeRowMap.set(cr.oldCode, cr.row);
      }

      // 按新编码顺序构建有效编码行
      for (const newCode of sortedNewCodes) {
        const oldCode = reverseMapping.get(newCode);

        if (codeRowMap.has(oldCode)) {
          // 有对应的旧数据，更新编码
          const oldRow = codeRowMap.get(oldCode);
          const newRow = oldRow.map(cell => cell);
          newRow[colIndex] = newCode;
          newRows.push({ newCode, row: newRow, isCodeRow: true });
        } else {
          // 缺失的编码，创建空白行（只有编码，其他列为空）
          const newRow = new Array(headers.length).fill(null);
          newRow[colIndex] = newCode;
          newRows.push({ newCode, row: newRow, isCodeRow: true, isInserted: true });
        }
      }

      // 把空白编码行插入到它们原来的相对位置
      // 相对位置由 prevOldCode 和 nextOldCode 确定
      const result = [];
      let codeRowIndex = 0;

      // 先处理在所有编码之前的空白行
      for (const emptyRow of analysis.emptyRows) {
        if (emptyRow.prevOldCode === null && emptyRow.nextOldCode !== null) {
          // 在第一个编码之前
          const nextNewCode = mapping.get(emptyRow.nextOldCode);
          // 在对应的新编码之前插入
          while (codeRowIndex < newRows.length && newRows[codeRowIndex].newCode !== nextNewCode) {
            result.push(newRows[codeRowIndex].row);
            codeRowIndex++;
          }
          result.push(emptyRow.row);
        } else if (emptyRow.prevOldCode === null && emptyRow.nextOldCode === null) {
          // 表中只有空白行，没有有效编码
          result.push(emptyRow.row);
        }
      }

      // 处理有效编码行和在编码之间的空白行
      for (; codeRowIndex < newRows.length; codeRowIndex++) {
        result.push(newRows[codeRowIndex].row);
        const currentNewCode = newRows[codeRowIndex].newCode;
        const currentOldCode = reverseMapping.get(currentNewCode);

        // 检查是否有空白行应该在这个编码之后
        for (const emptyRow of analysis.emptyRows) {
          if (emptyRow.prevOldCode === currentOldCode) {
            result.push(emptyRow.row);
          }
        }
      }

      // 处理在所有编码之后的空白行（prevOldCode 是最后一个编码，nextOldCode 为 null）
      for (const emptyRow of analysis.emptyRows) {
        if (emptyRow.prevOldCode !== null && emptyRow.nextOldCode === null) {
          // 已经在上面的循环中处理了
        }
      }

      return result;
    };

    // 构建两个表的新行
    const newRows1 = buildNewRows(analysis1, headers1, colIndex1, new Set(analysis1.codeRows.map(r => r.oldCode)));
    const newRows2 = buildNewRows(analysis2, headers2, colIndex2, new Set(analysis2.codeRows.map(r => r.oldCode)));

    // 计算修复数量
    const countCodeChanges = (oldAnalysis, newRows, colIndex) => {
      let count = 0;
      // 统计编码变化的数量
      const oldCodes = new Set(oldAnalysis.codeRows.map(r => r.oldCode));
      const newCodes = new Set();

      for (const row of newRows) {
        const code = row[colIndex];
        if (code) newCodes.add(code);
      }

      // 计算更新的编码数量和新插入的行数量
      for (const [oldCode, newCode] of mapping.entries()) {
        if (oldCodes.has(oldCode) && oldCode !== newCode) {
          count++; // 编码被更新
        }
      }

      // 计算新插入的行数量
      for (const newCode of sortedNewCodes) {
        const oldCode = reverseMapping.get(newCode);
        if (!oldCodes.has(oldCode)) {
          count++; // 新插入的行
        }
      }

      return count;
    };

    fixedCount1 = countCodeChanges(analysis1, newRows1, colIndex1);
    fixedCount2 = countCodeChanges(analysis2, newRows2, colIndex2);

    // 更新表内容
    table1Sheet.content = [headers1, ...newRows1];
    table2Sheet.content = [headers2, ...newRows2];

    return { fixedCount1, fixedCount2 };
  }
export { extractCodesFromTable, buildCodeMapping, alignAndFixPairedTables };
