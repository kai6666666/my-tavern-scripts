// @ts-nocheck
/**
 * get-inventory-panel-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_ACTIVE_TARGET } from '../../shared/storage-keys';
export function createGetInventoryPanelTarget(deps: any) {
  const getInventoryPanelTarget = (): 'inventory' | 'equipment' => {
    const stored = String(Store.get(STORAGE_KEY_INVENTORY_ACTIVE_TARGET, 'inventory') || '').trim();
    return stored === 'equipment' ? 'equipment' : 'inventory';
  };
  return getInventoryPanelTarget;
}
