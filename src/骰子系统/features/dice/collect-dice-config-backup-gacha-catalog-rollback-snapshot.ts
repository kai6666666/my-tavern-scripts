// @ts-nocheck
/**
 * collect-dice-config-backup-gacha-catalog-rollback-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaCatalogDB } from '../gacha/gacha-catalog-db';
export function createCollectDiceConfigBackupGachaCatalogRollbackSnapshot(deps: any) {
  const collectDiceConfigBackupGachaCatalogRollbackSnapshot =
    async (): Promise<DiceConfigBackupGachaCatalogRollbackSnapshot> => {
      try {
        return { records: deps.normalizeDiceConfigBackupGachaCatalogSnapshotRecords(await GachaCatalogDB.getAll()) };
      } catch (error) {
        console.warn('[DICE]配置备份读取商城自定义目录回滚快照失败:', error);
        const message = error instanceof Error ? error.message : String(error);
        return {
          records: null,
          warning: `骰子商城配置与自定义物品: 无法创建回滚快照，已取消恢复：${message}`,
        };
      }
    };
  return collectDiceConfigBackupGachaCatalogRollbackSnapshot;
}
