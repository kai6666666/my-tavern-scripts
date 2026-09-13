// @ts-nocheck
/**
 * grant-equipment-gacha-reward.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_SHARD_VALUES } from '../../entities/gacha-items';
import type { GachaState, GachaDrawOutcome } from './gacha-types';
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGrantEquipmentGachaReward(deps: any) {
  const grantEquipmentGachaReward = (
    rawData,
    state: GachaState,
    item: GachaItemDefinition,
    quantity: number,
    snapshots?: Map<string, unknown>,
  ): { outcome: GachaDrawOutcome; modifiedSheetKey?: string } | null => {
    const parsed = deps.getGachaRewardParseResultForItem(rawData, item);
    if (!parsed.tableKey || !rawData?.[parsed.tableKey] || !Array.isArray(rawData[parsed.tableKey]?.content)) {
      return null;
    }
    if (snapshots && !snapshots.has(parsed.tableKey)) {
      snapshots.set(parsed.tableKey, deps.cloneRuntimeDataValue(rawData[parsed.tableKey]));
    }

    const existing = parsed.items.find(candidate => candidate.name === item.name) || null;
    const canStackInEquipmentTable = item.stackable && !item.unique && parsed.colMap.quantity >= 0;
    if (existing && !canStackInEquipmentTable) {
      const shardGain = deps.addGachaShards(state, item.quality, GACHA_SHARD_VALUES[item.quality] * Math.max(1, quantity));
      return {
        outcome: {
          kind: 'shards',
          item,
          quantity,
          duplicateConverted: true,
          shardGain,
        },
      };
    }

    const table = rawData[parsed.tableKey];
    if (existing) {
      const row = table.content[existing.rowIndex + 1];
      if (!Array.isArray(row)) return null;
      deps.validateGachaCustomFieldsForExistingRow({
        target: 'equipment',
        tableName: parsed.tableName,
        headers: parsed.headers,
        sheet: rawData[parsed.tableKey],
        item,
        row,
      });
      const currentQuantity = Math.max(
        0,
        Number.parseInt(String(row[parsed.colMap.quantity] ?? existing.quantity ?? 0), 10) || 0,
      );
      const nextQuantity = currentQuantity + Math.max(1, quantity);
      deps.setEquipmentRowBasicFields(row, parsed.colMap, item, nextQuantity, parsed.headers, rawData[parsed.tableKey]);
      deps.applyGachaCustomFieldsToRow(row, parsed.headers, item, {
        target: 'equipment',
        targetColumns: item.targetColumns,
        preserveNonEmptyExisting: true,
      });
      return {
        outcome: {
          kind: 'item',
          item,
          quantity,
          duplicateConverted: false,
          shardGain: 0,
        },
        modifiedSheetKey: parsed.tableKey,
      };
    }

    const headerRow = Array.isArray(table.content[0]) ? table.content[0] : parsed.headers;
    const sheet = rawData[parsed.tableKey];
    deps.validateGachaCustomFieldsForTargetTable({
      target: 'equipment',
      tableName: parsed.tableName,
      headers: headerRow,
      sheet,
      item,
    });
    const newRow = new Array(Math.max(headerRow.length, 1)).fill('');
    if (newRow.length > 0) newRow[0] = String(table.content.length);
    deps.setEquipmentRowBasicFields(newRow, parsed.colMap, item, Math.max(1, quantity), headerRow, sheet);
    deps.applyGachaCustomFieldsToRow(newRow, headerRow, item, { target: 'equipment', targetColumns: item.targetColumns });
    deps.assertCrudRequiredColumnsRepresented(parsed.tableName, headerRow, sheet);
    deps.assertCrudInsertRequiredCells(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    deps.assertCrudEnumConstraints(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    deps.assertCrudLengthConstraints(parsed.tableName, headerRow, newRow, sheet, table.content.length);
    table.content.push(newRow);
    return {
      outcome: {
        kind: 'item',
        item,
        quantity,
        duplicateConverted: false,
        shardGain: 0,
      },
      modifiedSheetKey: parsed.tableKey,
    };
  };
  return grantEquipmentGachaReward;
}
