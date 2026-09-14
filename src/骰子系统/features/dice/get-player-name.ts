// @ts-nocheck
/**
 * get-player-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getRowDisplayName } from '../../entities/name-alias';
export function createGetPlayerName(deps: any) {
  const getPlayerName = () => {
    const rawData = deps.getCachedRawData() || (typeof deps.getTableData === 'function' ? deps.getTableData() : null);
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          const headers = sheet.content[0] || [];
          const displayName = getRowDisplayName(sheet.content[1], headers);
          if (displayName) return displayName;
        }
      }
    }
    return null;
  };
  return getPlayerName;
}
