// @ts-nocheck
/**
 * get-stable-table-sort.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * 目标：为「导航盘管理」「前端导航/表列表」「审核面板分组」提供
 * **全局唯一且确定性**的排序，消除对象键序漂移与调用顺序差异导致的错乱。
 *
 * 排序优先级：
 * 1. 用户在「导航盘管理」拖拽保存的顺序（getSavedTableOrder）；
 * 2. 会话内「首次出现顺序」（按输入数组顺序预冻结，不受排序引擎比较顺序影响）；
 * 3. 中文智能排序兜底。
 */
export function createGetStableTableSort(deps: any) {
  const firstSeen = new Map();
  // 关键修复：按输入数组顺序“预冻结”，而非在比较器中分配，
  // 否则排序引擎的比较序列会决定首次赋值顺序，造成跨界面不一致。
  const freezeSeenOrder = list => {
    for (let i = 0; i < list.length; i += 1) {
      const key = String(list[i]);
      if (!firstSeen.has(key)) firstSeen.set(key, firstSeen.size);
    }
  };
  const getStableTableSort = names => {
    const list = [...names].map(name => String(name));
    freezeSeenOrder(list);
    const saved = (deps.getSavedTableOrder() || []).map(name => String(name));
    const savedIndex = new Map();
    saved.forEach((name, index) => savedIndex.set(name, index));
    const rankOf = key => {
      if (savedIndex.has(key)) return savedIndex.get(key);
      const seen = firstSeen.has(key) ? firstSeen.get(key) : 0;
      return 1000000 + seen;
    };
    return list.sort((left, right) => {
      const leftRank = rankOf(left);
      const rightRank = rankOf(right);
      if (leftRank !== rightRank) return leftRank - rightRank;
      return left.localeCompare(right, 'zh-CN');
    });
  };
  return getStableTableSort;
}
