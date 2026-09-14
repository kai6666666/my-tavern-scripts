// @ts-nocheck
/**
 * switch-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createSwitchPanel(deps: any) {
  const switchPanel = (
    updateContentFn: ($panel: JQuery<HTMLElement>) => void | Promise<void>,
    $root?: JQuery<HTMLElement>,
    panelHeightKey?: string | null,
  ) => {
    const $panel = deps.getDataAreaForRoot($root);
    const refreshPanelHeight = () => {
      deps.applyStoredPanelHeight($panel, panelHeightKey || null);
    };
    const showPanel = () => {
      refreshPanelHeight();
      if (!$panel.hasClass('visible')) $panel.addClass('visible');
      deps.syncHostRegenerateButtonVisibility($root);
      requestAnimationFrame(() => {
        refreshPanelHeight();
        deps.ensurePanelNavigationVisible($root);
        deps.syncHostRegenerateButtonVisibility($root);
      });
      window.setTimeout(() => {
        refreshPanelHeight();
      }, 120);
    };
    const showPanelError = (error: unknown) => {
      console.error('[DICE]ACU 面板切换失败:', error);
      $panel.html('<div class="acu-panel-content"><div class="acu-empty-hint">面板打开失败，请查看控制台</div></div>');
      if (window.toastr) showActionableErrorToast('面板打开失败，请查看控制台', { developerHint: true });
      showPanel();
    };

    try {
      refreshPanelHeight();
      const updateResult = updateContentFn($panel);
      if (updateResult instanceof Promise) {
        void updateResult.then(showPanel).catch(showPanelError);
        return;
      }
      showPanel();
    } catch (error) {
      showPanelError(error);
    }
  };
  return switchPanel;
}
