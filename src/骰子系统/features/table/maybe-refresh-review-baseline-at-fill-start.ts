// @ts-nocheck
/**
 * maybe-refresh-review-baseline-at-fill-start.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * 「填表开始」时更新审核基线，但带保护：
 * - 若当前数据库已相对基线存在待审核变更（比如上一轮更新尚未审核），
 *   则【不覆盖】基线，避免审核面板丢失"哪些表格更新了"的差异数据；
 * - 仅当没有待审核变更时，才把当前数据保存为新基线。
 */
export function createMaybeRefreshReviewBaselineAtFillStart(deps: any) {
  const maybeRefreshReviewBaselineAtFillStart = (): boolean => {
    try {
      const current = deps.getTableData({ silent: true });
      if (!current || !deps.hasSheetKeys(current)) return false;
      const baseline = deps.loadSnapshot();
      if (baseline && deps.hasSheetKeys(baseline) && typeof deps.countRuntimeDataChanges === 'function') {
        let pending = 0;
        try {
          pending = deps.countRuntimeDataChanges(baseline, current) || 0;
        } catch (countError) {
          pending = 0;
        }
        if (pending > 0) {
          console.info(`[DICE]填表开始：检测到 ${pending} 处待审核变更，保留现有审核基线`);
          return false;
        }
      }
      deps.saveSnapshot(current);
      console.info('[DICE]已从数据库 API 更新审核基线 (table_fill_start)');
      return true;
    } catch (error) {
      console.warn('[DICE]填表开始更新审核基线失败（已忽略）:', error);
      return false;
    }
  };
  return maybeRefreshReviewBaselineAtFillStart;
}
