// @ts-nocheck
/**
 * show-database-manual-update-failure.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowDatabaseManualUpdateFailure(deps: any) {
  const showDatabaseManualUpdateFailure = (title: string, message: string): void => {
    if (window.toastr) {
      showActionableErrorToast(`${title}: ${message}`, {
        title,
        developerHint: true,
        toastrOptions: { timeOut: 5000 },
      });
      return;
    }

    void deps.showDiceSystemConfirmDialog({
      title,
      message,
      iconClass: 'fa-triangle-exclamation',
      confirmText: '知道了',
      tone: 'danger',
      hideCancel: true,
    });
  };
  return showDatabaseManualUpdateFailure;
}
