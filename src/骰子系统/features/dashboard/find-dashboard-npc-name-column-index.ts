// @ts-nocheck
/**
 * find-dashboard-npc-name-column-index.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DASHBOARD_TABLE_CONFIG } from './dashboard-table-config';
import { findNameColumnIndex } from '../../entities/name-alias';
export function createFindDashboardNpcNameColumnIndex(deps: any) {
  const findDashboardNpcNameColumnIndex = (headers, source): number => {
    if (source?.nameColumn) {
      const configuredNameIdx = deps.findRelationGraphColumnIndex(headers, source.nameColumn);
      return configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(headers, -1);
    }

    const npcConfig = deps.getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
    const configuredNameIdx = deps.getDashboardDataParser().findColumnIndex(headers, 'name', npcConfig);
    return configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(headers, -1);
  };
  return findDashboardNpcNameColumnIndex;
}
