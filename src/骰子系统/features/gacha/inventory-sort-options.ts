// @ts-nocheck
/**
 * inventory-sort-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInventorySortOptions(deps: any) {
  const INVENTORY_SORT_OPTIONS = [
    { value: 'default', label: '默认', icon: 'fa-border-all' },
    { value: 'type', label: '类型', icon: 'fa-shapes' },
    { value: 'quality', label: '品质', icon: 'fa-gem' },
    { value: 'quantity', label: '数量', icon: 'fa-hashtag' },
    { value: 'name', label: '名称', icon: 'fa-font' },
  ] as const;
  return INVENTORY_SORT_OPTIONS;
}
