// @ts-nocheck
/**
 * save-inventory-panel-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import { STORAGE_KEY_INVENTORY_ACTIVE_TARGET } from '../../shared/storage-keys';
export function createSaveInventoryPanelTarget(deps: any) {
  const saveInventoryPanelTarget = (target: 'inventory' | 'equipment') => {
    Store.set(STORAGE_KEY_INVENTORY_ACTIVE_TARGET, target === 'equipment' ? 'equipment' : 'inventory');
  };
  return saveInventoryPanelTarget;
}
