// @ts-nocheck
/**
 * get-active-panel-height-key.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetActivePanelHeightKey(deps: any) {
  const getActivePanelHeightKey = (): string | null => {
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return '仪表盘';
    if (Store.get('acu_changes_panel_active', false)) return '审核面板';
    if (Store.get('acu_favorites_panel_active', false)) return '收藏夹';
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) return '交互总览';
    const activeTab = String(deps.getActiveTabState() || '').trim();
    return activeTab || null;
  };
  return getActivePanelHeightKey;
}
