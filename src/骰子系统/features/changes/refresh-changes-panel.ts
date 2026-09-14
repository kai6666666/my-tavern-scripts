// @ts-nocheck
/**
 * refresh-changes-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createRefreshChangesPanel(deps: any) {
  const refreshChangesPanel = () => {
    const { $ } = deps.getCore();
    const rawData = deps.getCachedRawData() || deps.getTableData();
    deps.setCurrentDiffMap(deps.generateDiffMap(rawData));

    const $panel = $('#acu-data-area');
    if ($panel.length && Store.get('acu_changes_panel_active', false)) {
      $panel.html(deps.renderChangesPanel(rawData));
      deps.bindChangesEvents();

      // 更新导航栏计数
      deps.updateChangesCount(rawData);
    }
  };
  return refreshChangesPanel;
}
