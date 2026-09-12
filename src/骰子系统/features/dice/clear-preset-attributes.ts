// @ts-nocheck
/**
 * clear-preset-attributes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createClearPresetAttributesForCharacter(deps: any) {
  const clearPresetAttributesForCharacter = async charName => {
    const rawData = deps.getCachedRawData() || deps.getTableData();
    if (!rawData) {
      console.error('[DICE]ACU clearPresetAttributesForCharacter: 无法获取表格数据');
      if (window.toastr)
        showActionableErrorToast('无法获取表格数据，暂时不能清空角色属性。', { suggestion: 'table' });
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
      console.error('[DICE]ACU clearPresetAttributesForCharacter: 找不到角色', charName);
      if (window.toastr)
        showActionableErrorToast(`找不到角色「${charName || '<user>'}」，无法清空属性。`, {
          suggestion: '请确认角色名与表格中的名称一致，并刷新数据后再试；如果角色确实存在，请检查角色表是否包含名称列。',
        });
      return { success: false };
    }

    if (baseColIndex < 0) {
      console.error('[DICE]ACU clearPresetAttributesForCharacter: 找不到属性列');
      deps.errorTableTemplateIssue('找不到属性列');
      return { success: false };
    }

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[baseColIndex] = '';

    // 如果存在特有属性列，也清空
    if (specialColIndex >= 0) {
      nextRow[specialColIndex] = '';
    }

    await deps.saveRowInstantly(sheetKey, targetRowIndex - 1, nextRow);

    return {
      success: true,
    };
  };
  return clearPresetAttributesForCharacter;
}
