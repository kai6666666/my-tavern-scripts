// @ts-nocheck
/**
 * assert-gacha-reward-name-column.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createAssertGachaRewardNameColumn(deps: any) {
  const assertGachaRewardNameColumn = (tableName: string, headers: unknown[], colMap: GachaRewardColumnMap): void => {
    if (colMap.name >= 0 && colMap.name < headers.length) return;
    throw new Error(
      deps.withTableTemplateCheckHint(
        `目标表“${tableName}”缺少可用于奖励名称的列。请在该物品的 targetColumns.name 中填写真实表头，或调整当前仪表盘预设的名称列关键词。`,
      ),
    );
  };
  return assertGachaRewardNameColumn;
}
