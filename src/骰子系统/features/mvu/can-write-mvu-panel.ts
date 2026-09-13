// @ts-nocheck
/**
 * can-write-mvu-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createCanWriteMvuPanel(deps: any) {
  function canWriteMvuPanel() {
    if (deps.getActiveTabState() !== deps.getMvuModule().MODULE_ID) return false;
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) return false;
    if (Store.get('acu_changes_panel_active', false)) return false;
    if (Store.get('acu_favorites_panel_active', false)) return false;
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return false;
    return true;
  }
  return canWriteMvuPanel;
}
