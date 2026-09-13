// @ts-nocheck
/**
 * restore-dice-config-backup-gacha-catalog-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaCatalogDB } from '../../features/gacha/gacha-catalog-db';
export function createRestoreDiceConfigBackupGachaCatalogSnapshot(deps: any) {
  const restoreDiceConfigBackupGachaCatalogSnapshot = async (
    snapshot: DiceConfigBackupGachaCatalogRollbackSnapshot | null,
  ): Promise<string[]> => {
    const warnings: string[] = [];
    if (!snapshot) return warnings;
    if (!snapshot.records) {
      warnings.push(snapshot.warning || '骰子商城配置与自定义物品: 恢复前没有可用回滚快照，无法自动撤回已导入的目录。');
      return warnings;
    }
    const restored = await GachaCatalogDB.replaceAll(snapshot.records.map(record => deps.cloneDiceConfigBackupValue(record)));
    if (!restored) {
      warnings.push('骰子商城配置与自定义物品: 回滚 IndexedDB 目录失败，可能残留部分导入内容。');
      return warnings;
    }
    deps.setGachaCatalogCache(null);
    deps.setGachaCatalogLoadTask(null);
    return warnings;
  };
  return restoreDiceConfigBackupGachaCatalogSnapshot;
}
