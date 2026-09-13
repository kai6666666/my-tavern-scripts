// @ts-nocheck
/**
 * resolve-gacha-target-table-override.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../../features/dashboard/dashboard-table-config';
import type { GachaRewardTarget } from '../../entities/gacha-items';
export function createResolveGachaTargetTableOverride(deps: any) {
  const resolveGachaTargetTableOverride = (rawData, target: GachaRewardTarget, options: GachaRewardParseOptions) => {
    const targetTable = deps.normalizeGachaTargetTable(options.targetTable);
    if (!targetTable) return null;
    const matches = deps.getGachaTargetTableMatches(rawData, targetTable);
    if (matches.length === 0) {
      throw new Error(
        deps.withTableTemplateCheckHint(
          `未找到骰子商店奖励目标表“${targetTable}”。请检查该物品的 targetTable，或清空 targetTable 改用当前仪表盘预设的${deps.getGachaRewardTargetModuleName(target)}区映射。`,
        ),
      );
    }
    if (matches.length > 1) {
      throw new Error(
        deps.withTableTemplateCheckHint(
          `骰子商店奖励目标表“${targetTable}”存在 ${matches.length} 张同名表，无法判断应该写入哪一张。请先改成唯一表名，再更新 targetTable。`,
        ),
      );
    }
    const moduleKey = deps.getGachaRewardTargetModuleKey(target);
    const config = deps.getDashboardModuleConfig(moduleKey) || DASHBOARD_TABLE_CONFIG[moduleKey];
    return deps.buildGachaTableResultFromSheet(matches[0], config);
  };
  return resolveGachaTargetTableOverride;
}
