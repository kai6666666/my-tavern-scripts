// @ts-nocheck
/**
 * apply-gacha-target-column-overrides.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaRewardTargetColumns } from '../../entities/gacha-items';
export function createApplyGachaTargetColumnOverrides(deps: any) {
  const applyGachaTargetColumnOverrides = (
    colMap: GachaRewardColumnMap,
    headers: unknown[],
    tableName: string,
    targetColumns?: GachaRewardTargetColumns,
    sheet?: unknown,
  ): GachaRewardColumnMap => {
    const entries = deps.getGachaTargetColumnEntries(targetColumns);
    if (entries.length === 0) return colMap;
    const nextMap: GachaRewardColumnMap = { ...colMap };
    entries.forEach(([key, headerName]) => {
      const columnIndex = deps.findGachaTargetColumnIndex(headers, headerName, sheet);
      if (columnIndex < 0) {
        throw new Error(
          deps.withTableTemplateCheckHint(
            `目标表“${tableName}”找不到 targetColumns.${key} 指定的表头“${headerName}”。当前表头：${headers.map(header => String(header || '').trim()).filter(Boolean).join('、') || '（无）'}。`,
          ),
        );
      }
      nextMap[key] = columnIndex;
    });
    return nextMap;
  };
  return applyGachaTargetColumnOverrides;
}
