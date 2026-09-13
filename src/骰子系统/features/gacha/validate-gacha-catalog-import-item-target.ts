// @ts-nocheck
/**
 * validate-gacha-catalog-import-item-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createValidateGachaCatalogImportItemTarget(deps: any) {
  const validateGachaCatalogImportItemTarget = (rawData, item: GachaItemDefinition, warnings: string[]): boolean => {
    try {
      const parsed = deps.getGachaRewardParseResultForItem(rawData, item);
      const sheet = parsed.tableKey && rawData ? rawData[parsed.tableKey] : undefined;
      const validation = deps.validateGachaCustomFieldsForTargetTable({
        target: item.rewardTarget,
        tableName: parsed.tableName,
        headers: parsed.headers,
        sheet,
        item,
        throwOnMissing: false,
      });
      if (validation.message) {
        warnings.push(validation.message);
        return false;
      }
      const headerRow = Array.isArray(sheet?.content?.[0]) ? sheet.content[0] : parsed.headers;
      const candidateRow = new Array(Math.max(headerRow.length, 1)).fill('');
      if (candidateRow.length > 0) candidateRow[0] = '1';
      const quantity = Math.max(1, Math.floor(Number(item.grantQuantity) || 1));
      if (item.rewardTarget === 'equipment') {
        deps.setEquipmentRowBasicFields(candidateRow, parsed.colMap, item, quantity, headerRow, sheet);
      } else {
        deps.setInventoryRowBasicFields(candidateRow, parsed.colMap, item, quantity);
      }
      deps.applyGachaCustomFieldsToRow(candidateRow, headerRow, item, {
        target: item.rewardTarget,
        targetColumns: item.targetColumns,
      });
      deps.assertCrudRequiredColumnsRepresented(parsed.tableName, headerRow, sheet);
      deps.assertCrudInsertRequiredCells(parsed.tableName, headerRow, candidateRow, sheet, 0);
      deps.assertCrudEnumConstraints(parsed.tableName, headerRow, candidateRow, sheet, 0);
      deps.assertCrudLengthConstraints(parsed.tableName, headerRow, candidateRow, sheet, 0);
      return true;
    } catch (error) {
      warnings.push(deps.getRuntimeErrorMessage(error) || `物品「${item.name || item.id}」的写入目标无法解析`);
      return false;
    }
  };
  return validateGachaCatalogImportItemTarget;
}
