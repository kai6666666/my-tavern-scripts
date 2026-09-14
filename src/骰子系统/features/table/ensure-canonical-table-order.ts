// @ts-nocheck
/**
 * ensure-canonical-table-order.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * 目标：把「导航盘管理」当前生效的完整顺序**持久化**为唯一权威顺序。
 *
 * 背景：若用户从未拖拽过，旧逻辑每次刷新都会按当时的数据键序重新计算，
 * 造成审核面板/前端列表“偶发错乱”。本模块在每次拿到全量键列表时，
 * 将稳定排序结果写回 saveTableOrder，使顺序一次冻结、终生一致。
 *
 * 注意：仅允许持有“全量键集合”的调用方（设置弹窗、导航渲染）调用，
 * 子集调用方（如审核面板）禁止调用，防止把局部顺序覆盖为全局顺序。
 */
export function createEnsureCanonicalTableOrder(deps: any) {
  let lastFingerprint = '';
  const ensureCanonicalTableOrder = (candidateKeys: any[]): void => {
    try {
      const keys = (candidateKeys || []).map(key => String(key)).filter(key => key.length > 0);
      if (keys.length === 0) return;
      const sorted = deps.getStableTableSort(keys);
      const saved = (deps.getSavedTableOrder() || []).map(key => String(key));
      const seen = new Set(sorted);
      // 已保存但不在当前集合中的条目（如被隐藏的特殊项）追加保留，避免丢序
      const merged = sorted.concat(saved.filter(key => !seen.has(key)));
      const fingerprint = merged.join('|');
      if (fingerprint === lastFingerprint) return;
      lastFingerprint = fingerprint;
      if (fingerprint === saved.join('|')) return;
      deps.saveTableOrder(merged);
    } catch (error) {
      // 排序持久化失败不得影响渲染
    }
  };
  return ensureCanonicalTableOrder;
}
