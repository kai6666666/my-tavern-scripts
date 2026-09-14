// @ts-nocheck
/**
 * get-stable-table-sort.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 *
 * 目标：为「审核面板分组」与「前端表列表/导航」提供**确定性**排序，
 * 消除因数据库导出对象键顺序偶发漂移导致的表排序错乱。
 *
 * 排序优先级：
 * 1. 用户拖拽保存的顺序（getSavedTableOrder）；
 * 2. 会话内「首次出现顺序」（首次渲染时冻结，之后不再受键序漂移影响）；
 * 3. 中文智能排序兜底。
 */
export function createGetStableTableSort(deps: any) {
  const firstSeen = new Map();
  const stableSeenIndex = name => {
    const key = String(name);
    if (!firstSeen.has(key)) firstSeen.set(key, firstSeen.size);
    return firstSeen.get(key);
  };
  const getStableTableSort = names => {
    const saved = deps.getSavedTableOrder() || [];
    const savedIndex = new Map();
    saved.forEach((name, index) => savedIndex.set(String(name), index));
    return [...names].sort((left, right) => {
      const leftSaved = savedIndex.has(left) ? savedIndex.get(left) : Number.MAX_SAFE_INTEGER;
      const rightSaved = savedIndex.has(right) ? savedIndex.get(right) : Number.MAX_SAFE_INTEGER;
      if (leftSaved !== rightSaved) return leftSaved - rightSaved;
      const leftSeen = stableSeenIndex(left);
      const rightSeen = stableSeenIndex(right);
      if (leftSeen !== rightSeen) return leftSeen - rightSeen;
      return String(left).localeCompare(String(right), 'zh-CN');
    });
  };
  return getStableTableSort;
}
