// @ts-nocheck
/**
 * build-global-interaction-groups.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGlobalInteractionGroups(deps: any) {
  const buildGlobalInteractionGroups = (rawData: unknown): GlobalInteractionGroup[] => {
    if (!deps.isRecord(rawData)) return [];

    const groups: GlobalInteractionGroup[] = [];
    Object.entries(rawData).forEach(([tableKey, sheet]) => {
      if (!tableKey.startsWith('sheet_') || !deps.isRecord(sheet)) return;
      if (typeof sheet.name !== 'string' || !sheet.name.trim() || !deps.isTwoDimensionalArray(sheet.content)) return;

      const tableName = sheet.name.trim();
      const headers = sheet.content[0] || [];
      const rows = sheet.content.slice(1).reduce<GlobalInteractionRow[]>((result, rowData, contentRowIndex) => {
        const actions = deps.dedupeInteractionActions(deps.getInteractOptionsForRow(tableName, headers, rowData));
        if (actions.length === 0) return result;

        const title = deps.resolveGlobalInteractionRowTitle(headers, rowData, contentRowIndex);
        result.push({
          rowIndex: contentRowIndex,
          title,
          iconName: deps.resolveCustomTableNameIconRowName(tableName, headers, rowData, contentRowIndex),
          actions,
          searchText: deps.buildGlobalInteractionSearchText(tableName, title, actions),
        });
        return result;
      }, []);

      if (rows.length > 0) {
        groups.push({
          tableKey,
          tableName,
          rows,
        });
      }
    });

    return groups;
  };
  return buildGlobalInteractionGroups;
}
