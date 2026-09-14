// @ts-nocheck
/**
 * update-single-attribute.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createUpdateSingleAttribute(deps: any) {
  const updateSingleAttribute = async (
    charName: string,
    attrName: string,
    operation: 'add' | 'subtract' | 'set',
    value: number,
    options?: {
      initValue?: number;
      min?: number;
      max?: number;
      aliasCandidates?: string[];
      skipSave?: boolean;
      dataOverride?: Record<string, { name: string; content: (string | number | null)[][] }>;
    },
  ): Promise<{
    success: boolean;
    oldValue: number;
    newValue: number;
    error?: string;
    resolvedAttrName?: string;
    modifiedSheetKey?: string;
  }> => {
    const rawData = options?.dataOverride || deps.getCachedRawData() || deps.getTableData();
    if (!rawData) {
      const error = '无法获取表格数据';
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    const lookup = deps.findCharacterAttributeRow(charName, rawData as DiceRawData);
    const targetSheet = lookup?.sheet || null;
    const targetRowIndex = lookup?.rowIndex ?? -1;
    const sheetKey = lookup?.sheetKey || null;
    const attrColIndices = lookup ? deps.findAttributeColumnIndices(lookup.headers) : [];
    const fallbackAttrColIndex = lookup ? deps.pickFallbackAttributeColumn(attrColIndices, lookup.headers) : -1;
    let targetColIndex = fallbackAttrColIndex;

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      const error = `找不到角色: ${charName || '<user>'}`;
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    if (targetColIndex < 0) {
      const error = deps.withTableTemplateCheckHint('找不到属性列（需要包含"属性"关键词的列）');
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    const resolved = deps.resolveAttributeAliasName(charName, attrName, options?.aliasCandidates || []);
    if (!resolved.name) {
      const error = resolved.reason || `属性 ${attrName} 不存在`;
      console.warn(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }
    const targetAttrName = resolved.name;

    // 在所有属性列中，优先选择实际包含目标属性的列
    for (const colIdx of attrColIndices) {
      const cellStr = String(targetSheet.content[targetRowIndex][colIdx] || '');
      const parsed = deps.parseAttributeString(cellStr);
      if (parsed.some(attr => attr.name === targetAttrName)) {
        targetColIndex = colIdx;
        break;
      }
    }
    if (targetColIndex < 0) {
      targetColIndex = fallbackAttrColIndex;
    }

    // 读取目标列现有属性并解析
    const existingStr = String(targetSheet.content[targetRowIndex][targetColIndex] || '');
    const existingAttrs = deps.parseAttributeString(existingStr);
    const existingMap: Record<string, number> = {};
    existingAttrs.forEach(attr => {
      existingMap[attr.name] = attr.value;
    });

    // 获取旧值或使用初始值
    let oldValue: number;
    if (existingMap[targetAttrName] !== undefined) {
      oldValue = existingMap[targetAttrName];
    } else if (options?.initValue !== undefined) {
      oldValue = options.initValue;
      console.info(`[DICE] updateSingleAttribute: 属性 ${targetAttrName} 不存在，初始化为 ${oldValue}`);
    } else {
      const error = `属性 ${targetAttrName} 不存在且未提供初始值`;
      console.warn(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    // 执行操作
    let newValue: number;
    switch (operation) {
      case 'add':
        newValue = oldValue + value;
        break;
      case 'subtract':
        newValue = oldValue - value;
        break;
      case 'set':
        newValue = value;
        break;
      default:
        const error = `不支持的操作类型: ${operation}`;
        console.error(`[DICE] updateSingleAttribute: ${error}`);
        return { success: false, oldValue, newValue: oldValue, error };
    }

    // 应用 min/max 约束
    const min = options?.min ?? 0; // 默认最小为0
    const max = options?.max ?? Infinity;
    newValue = Math.max(min, Math.min(max, newValue));

    console.info(
      `[DICE] updateSingleAttribute: ${charName}.${targetAttrName} ${oldValue} → ${newValue} (${operation} ${value})`,
    );

    // 更新属性映射
    existingMap[targetAttrName] = newValue;

    // 重建属性字符串（保持原有顺序，新属性追加到末尾）
    const resultParts: string[] = [];
    const processedNames = new Set<string>();

    // 先按原有顺序处理
    existingAttrs.forEach(attr => {
      const val = existingMap[attr.name];
      if (val !== undefined) {
        resultParts.push(`${attr.name}:${val}`);
        processedNames.add(attr.name);
      }
    });

    // 添加新属性（如果是初始化的情况）
    if (!processedNames.has(targetAttrName)) {
      resultParts.push(`${targetAttrName}:${newValue}`);
    }

    const newAttrString = resultParts.join(';');

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[targetColIndex] = newAttrString;
    if (options?.skipSave || options?.dataOverride) {
      targetSheet.content[targetRowIndex] = nextRow;
    } else {
      try {
        await deps.saveRowInstantly(sheetKey!, targetRowIndex - 1, nextRow);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[DICE] updateSingleAttribute: 保存 ${charName}.${targetAttrName} 失败: ${message}`);
        return { success: false, oldValue, newValue: oldValue, error: message, resolvedAttrName: targetAttrName };
      }
    }

    console.info(`[DICE] updateSingleAttribute: 成功修改 ${charName}.${targetAttrName}`);
    return { success: true, oldValue, newValue, resolvedAttrName: targetAttrName, modifiedSheetKey: sheetKey! };
  };
  return updateSingleAttribute;
}
