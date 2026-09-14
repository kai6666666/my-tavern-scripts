// @ts-nocheck
/**
 * close-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createClosePanel(deps: any) {
  const closePanel = ($root?: JQuery<HTMLElement>) => {
    const { $ } = deps.getCore();
    const $panel = deps.getDataAreaForRoot($root);
    deps.saveCurrentTabState(); // <--- 调用通用保存
    deps.cleanupGlobalInteractionFloatingMenus();

    $panel.removeClass('visible');
    ($root && $root.length ? $root.find('.acu-nav-btn') : $('.acu-nav-btn')).removeClass('active');
    Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
    Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    Store.set('acu_changes_panel_active', false);
    Store.set('acu_favorites_panel_active', false);
    deps.saveActiveTabState(null);
    deps.syncHostRegenerateButtonVisibility($root);
    // [修复] 关闭表格面板时，不要移除气泡里的选项面板
    // $('.acu-embedded-options-container').remove();
  };
  return closePanel;
}
