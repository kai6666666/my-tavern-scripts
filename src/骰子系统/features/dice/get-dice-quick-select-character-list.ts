// @ts-nocheck
/**
 * get-dice-quick-select-character-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../../features/dashboard/dashboard-table-config';
import { findNameColumnIndex } from '../../entities/name-alias';
import { isNpcTableName } from '../../shared/constants';
export function createGetDiceQuickSelectCharacterList(deps: any) {
  const getDiceQuickSelectCharacterList = (rawData: DiceRawData | null | undefined): string[] => {
    const list: string[] = [];
    if (!rawData) return list;

    const allTables = deps.processJsonData(rawData || {}) as Record<string, RelationGraphTableInput>;
    const playerResult = deps.DashboardDataParser.findTable(allTables, 'player');
    if (playerResult?.data?.rows?.length > 0) {
      const playerConfig = playerResult.config || deps.getDashboardModuleConfig('player') || DASHBOARD_TABLE_CONFIG.player;
      const playerHeaders = playerResult.data.headers || [];
      const playerNameIdx = deps.DashboardDataParser.findColumnIndex(playerHeaders, 'name', playerConfig);
      const safePlayerNameIdx = playerNameIdx >= 0 ? playerNameIdx : findNameColumnIndex(playerHeaders);
      deps.pushDiceQuickSelectCharacter(list, playerResult.data.rows[0]?.[safePlayerNameIdx], true);
    }

    const npcListData = deps.getDashboardNpcListData(allTables);
    const dashboardEntries = (npcListData.entries || []) as Array<{ name?: unknown }>;
    dashboardEntries.forEach(entry => deps.pushDiceQuickSelectCharacter(list, entry.name));

    if (list.length > 0) return list;

    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet?.name || !Array.isArray(sheet.content)) continue;
      const headers = sheet.content[0] || [];

      if (isNpcTableName(sheet.name)) {
        const nameIdx = findNameColumnIndex(headers);
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row) deps.pushDiceQuickSelectCharacter(list, row[nameIdx]);
        }
      }

      if (sheet.name.includes('主角') && sheet.content[1]) {
        const nameIdx = findNameColumnIndex(headers);
        deps.pushDiceQuickSelectCharacter(list, sheet.content[1][nameIdx], true);
      }
    }

    return list;
  };
  return getDiceQuickSelectCharacterList;
}
