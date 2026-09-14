// @ts-nocheck
/**
 * collect-dice-config-backup-gacha-catalog-records.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaCatalogDB } from '../gacha/gacha-catalog-db';
import type { GachaCatalogRecord } from '../gacha/gacha-types';
export function createCollectDiceConfigBackupGachaCatalogRecords(deps: any) {
  const collectDiceConfigBackupGachaCatalogRecords = async (): Promise<GachaCatalogRecord[]> => {
    try {
      await deps.migrateGachaCatalogRecordsToGlobalScope();
      return deps.normalizeDiceConfigBackupGachaCatalogSnapshotRecords(await GachaCatalogDB.getAll());
    } catch (error) {
      console.error('[DICE]配置备份读取商城自定义目录失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`读取骰子商城自定义物品目录失败，已取消导出：${message}`);
    }
  };
  return collectDiceConfigBackupGachaCatalogRecords;
}
