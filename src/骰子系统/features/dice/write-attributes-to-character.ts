// @ts-nocheck
/**
 * write-attributes-to-character.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createWriteAttributesToCharacter(deps: any) {
  const writeAttributesToCharacter = async (
    charName,
    newAttrs,
    isDND = false,
    specialAttrs: Record<string, number> | null = null,
  ) => {
    const rawData = deps.getCachedRawData() || deps.getTableData();
    if (!rawData) {
      console.error('[DICE]ACU writeAttributesToCharacter: 无法获取表格数据');
      if (window.toastr)
        showActionableErrorToast('无法获取表格数据，暂时不能写入角色属性。', { suggestion: 'table' });
      return { success: false };
    }

    const lookup = deps.findCharacterAttributeRow(charName, rawData as DiceRawData);
    const targetSheet = lookup?.sheet || null;
    const targetRowIndex = lookup?.rowIndex ?? -1;
    const sheetKey = lookup?.sheetKey || null;
    const { baseColIndex, specialColIndex } = lookup
      ? deps.findPrimaryAttributeColumns(lookup.headers)
      : { baseColIndex: -1, specialColIndex: -1 };

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      console.error('[DICE]ACU writeAttributesToCharacter: 找不到角色', charName);
      if (window.toastr)
        showActionableErrorToast(`找不到角色「${charName || '<user>'}」，无法写入属性。`, {
          suggestion: '请确认角色名与表格中的名称一致，并刷新数据后再试；如果角色确实存在，请检查角色表是否包含名称列。',
        });
      return { success: false };
    }

    if (baseColIndex < 0) {
      console.error('[DICE]ACU writeAttributesToCharacter: 找不到属性列');
      deps.errorTableTemplateIssue('找不到属性列（需要包含"属性"关键词的列）');
      return { success: false };
    }

    // 获取当前规则的属性列表
    const standardAttrs = deps.getStandardAttrs();
    const preset = deps.AttributePresetManager.getActivePreset();
    const presetSpecialAttrNames = new Set<string>();
    if (preset && preset.specialAttributes) {
      preset.specialAttributes.forEach(attr => presetSpecialAttrNames.add(attr.name));
    }

    // ========== 处理基础属性列 ==========
    const existingBaseStr = targetSheet.content[targetRowIndex][baseColIndex] || '';
    const existingBaseAttrs = deps.parseAttributeString(existingBaseStr);

    // 构建现有基础属性的映射
    const existingBaseMap = {};
    existingBaseAttrs.forEach(attr => {
      existingBaseMap[attr.name] = attr.value;
    });

    // 检查标准属性（基本属性）是否完整
    let standardCount = 0;
    standardAttrs.forEach(attrName => {
      if (existingBaseMap[attrName] !== undefined) {
        standardCount++;
      }
    });
    const isComplete = standardCount === standardAttrs.length;

    // 收集基础属性列中的用户自定义属性（不属于当前规则预设的属性）
    const customBaseAttrs: Array<{ name: string; value: number }> = [];
    existingBaseAttrs.forEach(attr => {
      if (!standardAttrs.includes(attr.name) && !presetSpecialAttrNames.has(attr.name)) {
        customBaseAttrs.push({ name: attr.name, value: attr.value });
      }
    });

    // 按标准顺序构建基础属性结果
    const baseResultParts: string[] = [];

    // 写入基本属性
    standardAttrs.forEach(attrName => {
      if (isComplete) {
        // 完整 → 全部用新值覆盖
        const newValue = newAttrs[attrName] !== undefined ? newAttrs[attrName] : existingBaseMap[attrName];
        if (newValue !== undefined) {
          baseResultParts.push(`${attrName}:${newValue}`);
        }
      } else {
        // 不完整 → 有则保留，无则用新值
        if (existingBaseMap[attrName] !== undefined) {
          baseResultParts.push(`${attrName}:${existingBaseMap[attrName]}`);
        } else if (newAttrs[attrName] !== undefined) {
          baseResultParts.push(`${attrName}:${newAttrs[attrName]}`);
        }
      }
    });

    // 如果没有独立的特有属性列，则把特有属性也写入基础属性列（兼容旧格式）
    if (specialColIndex < 0 && specialAttrs) {
      Object.keys(specialAttrs).forEach(attrName => {
        if (isComplete || !existingBaseMap[attrName]) {
          baseResultParts.push(`${attrName}:${specialAttrs[attrName]}`);
        } else {
          baseResultParts.push(`${attrName}:${existingBaseMap[attrName]}`);
        }
      });
    }

    // 追加用户自定义属性
    customBaseAttrs.forEach(attr => {
      baseResultParts.push(`${attr.name}:${attr.value}`);
    });

    const newBaseAttrString = baseResultParts.join(';');

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[baseColIndex] = newBaseAttrString;

    // ========== 处理特有属性列（如果存在且有特有属性需要写入） ==========
    let newSpecialAttrString = '';
    if (specialColIndex >= 0 && specialAttrs && Object.keys(specialAttrs).length > 0) {
      const existingSpecialStr = targetSheet.content[targetRowIndex][specialColIndex] || '';
      const existingSpecialAttrs = deps.parseAttributeString(existingSpecialStr);

      // 构建现有特有属性的映射
      const existingSpecialMap = {};
      existingSpecialAttrs.forEach(attr => {
        existingSpecialMap[attr.name] = attr.value;
      });

      // 收集特有属性列中的用户自定义属性
      const customSpecialAttrs: Array<{ name: string; value: number }> = [];
      existingSpecialAttrs.forEach(attr => {
        if (!presetSpecialAttrNames.has(attr.name)) {
          customSpecialAttrs.push({ name: attr.name, value: attr.value });
        }
      });

      // 构建特有属性结果
      const specialResultParts: string[] = [];

      // 按预设顺序写入特有属性
      if (preset && preset.specialAttributes) {
        preset.specialAttributes.forEach(attrDef => {
          const attrName = attrDef.name;
          if (specialAttrs[attrName] !== undefined) {
            if (isComplete || !existingSpecialMap[attrName]) {
              specialResultParts.push(`${attrName}:${specialAttrs[attrName]}`);
            } else {
              specialResultParts.push(`${attrName}:${existingSpecialMap[attrName]}`);
            }
          } else if (existingSpecialMap[attrName] !== undefined) {
            specialResultParts.push(`${attrName}:${existingSpecialMap[attrName]}`);
          }
        });
      }

      // 追加用户自定义属性
      customSpecialAttrs.forEach(attr => {
        specialResultParts.push(`${attr.name}:${attr.value}`);
      });

      newSpecialAttrString = specialResultParts.join(';');

      nextRow[specialColIndex] = newSpecialAttrString;
    }

    // 保存（不更新完整快照，保留审核面板状态）
    await deps.saveRowInstantly(sheetKey, targetRowIndex - 1, nextRow);

    // 返回写入的属性供UI更新
    const writtenAttrs: Array<{ name: string; value: number }> = [];
    standardAttrs.forEach(attrName => {
      writtenAttrs.push({ name: attrName, value: newAttrs[attrName] });
    });

    return {
      success: true,
      attrs: writtenAttrs,
      attrString: newBaseAttrString,
      specialAttrString: newSpecialAttrString,
      wasComplete: isComplete,
    };
  };
  return writeAttributesToCharacter;
}
