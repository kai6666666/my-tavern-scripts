// @ts-nocheck
/**
 * get-inventory-characters.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from '../../features/dashboard/dashboard-table-config';
import { getDisplayName } from '../../entities/name-alias';
import { isNpcTableName } from '../../shared/constants';
export function createGetInventoryCharacters(deps: any) {
  const getInventoryCharacters = rawData => {
    const result = [];
    if (!rawData) return result;
    for (const sheetId in rawData) {
      const sheet = rawData[sheetId];
      if (!sheet?.name || !isNpcTableName(sheet.name) || !Array.isArray(sheet.content)) continue;
      const headers = sheet.content[0] || [];
      const npcConfig = deps.getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
      const nameIdx = deps.DashboardDataParser.findColumnIndex(headers, 'name', npcConfig);
      const inSceneIdx = deps.DashboardDataParser.findColumnIndex(headers, 'inScene', npcConfig);
      sheet.content.slice(1).forEach((row, rowIndex) => {
        const rawName = String(row[nameIdx] ?? '').trim();
        if (!rawName) return;
        const displayName = deps.replaceUserPlaceholders(getDisplayName(rawName)).trim() || rawName;
        const presence = String(row[inSceneIdx] ?? '').trim() || '未知';
        result.push({ name: rawName, displayName, presence, rowIndex });
      });
    }
    return result.sort((a, b) => {
      const aInScene = a.presence === '在场' ? 0 : 1;
      const bInScene = b.presence === '在场' ? 0 : 1;
      if (aInScene !== bInScene) return aInScene - bInScene;
      return a.displayName.localeCompare(b.displayName, 'zh-CN');
    });
  };
  return getInventoryCharacters;
}
