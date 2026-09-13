// @ts-nocheck
/**
 * save-current-database-snapshot-as-review-baseline.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSaveCurrentDatabaseSnapshotAsReviewBaseline(deps: any) {
  const saveCurrentDatabaseSnapshotAsReviewBaseline = (trigger: string): boolean => {
    const current = deps.getTableData({ silent: true });
    if (!current || !deps.hasSheetKeys(current)) return false;
    deps.saveSnapshot(current);
    console.info(`[DICE]已从数据库 API 更新审核基线 (${trigger})`);
    return true;
  };
  return saveCurrentDatabaseSnapshotAsReviewBaseline;
}
