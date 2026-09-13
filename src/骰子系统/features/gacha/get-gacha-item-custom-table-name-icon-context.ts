// @ts-nocheck
/**
 * get-gacha-item-custom-table-name-icon-context.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition, GachaRewardTarget } from '../../entities/gacha-items';
export function createGetGachaItemCustomTableNameIconContext(deps: any) {
  const getGachaItemCustomTableNameIconContext = (
    item: Pick<GachaItemDefinition, 'name' | 'rewardTarget' | 'targetTable' | 'targetColumns'>,
    rawDataOverride?: unknown,
  ): CustomTableNameIconContext | null => {
    const target: GachaRewardTarget = item.rewardTarget === 'equipment' ? 'equipment' : 'inventory';
    let tableName = deps.getGachaRewardTargetTableLabel(target);
    try {
      const parsed = deps.getGachaRewardParseResult(
        rawDataOverride || deps.getCachedRawData() || deps.getTableData(),
        target,
        deps.getGachaRewardTargetOptions(item),
      );
      tableName = parsed.tableName || tableName;
    } catch {
      tableName = deps.normalizeGachaTargetTable(item.targetTable) || tableName;
    }
    return deps.createCustomTableNameIconContext(
      target === 'equipment' ? 'equipment' : 'item',
      tableName,
      target === 'equipment' ? 'equipment' : 'item',
      item.name,
    );
  };
  return getGachaItemCustomTableNameIconContext;
}
