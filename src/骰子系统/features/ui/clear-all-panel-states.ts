// @ts-nocheck
/**
 * clear-all-panel-states.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createClearAllPanelStates(deps: any) {
  const clearAllPanelStates = () => {
    deps.cleanupGlobalInteractionFloatingMenus();
    Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
    Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    Store.set('acu_changes_panel_active', false);
    Store.set('acu_favorites_panel_active', false);
    deps.saveActiveTabState(null);
  };
  return clearAllPanelStates;
}
