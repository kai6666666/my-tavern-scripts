// @ts-nocheck
/**
 * inventory-quality-filter-meta.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInventoryQualityFilterMeta(deps: any) {
  const INVENTORY_QUALITY_FILTER_META: InventoryFilterButtonMeta<InventoryQualityFilter>[] = [
    { value: '全部', icon: 'fa-layer-group', label: '全部品质' },
    { value: '普通', icon: 'fa-circle', label: '普通' },
    { value: '优秀', icon: 'fa-square', label: '优秀' },
    { value: '稀有', icon: 'fa-diamond', label: '稀有' },
    { value: '史诗', icon: 'fa-crown', label: '史诗' },
    { value: '传说', icon: 'fa-star', label: '传说' },
    { value: '神话', icon: 'fa-sun', label: '神话' },
    { value: '唯一', icon: 'fa-fingerprint', label: '唯一' },
  ];
  return INVENTORY_QUALITY_FILTER_META;
}
