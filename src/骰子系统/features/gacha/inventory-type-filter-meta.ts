// @ts-nocheck
/**
 * inventory-type-filter-meta.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInventoryTypeFilterMeta(deps: any) {
  const INVENTORY_TYPE_FILTER_META: InventoryFilterButtonMeta<InventoryTypeFilter>[] = [
    { value: '全部', icon: 'fa-boxes-stacked', label: '全部类型' },
    { value: '消耗品', icon: 'fa-flask', label: '消耗品' },
    { value: '材料', icon: 'fa-hammer', label: '材料' },
    { value: '任务物品', icon: 'fa-scroll', label: '任务物品' },
    { value: '道具', icon: 'fa-cube', label: '道具' },
  ];
  return INVENTORY_TYPE_FILTER_META;
}
