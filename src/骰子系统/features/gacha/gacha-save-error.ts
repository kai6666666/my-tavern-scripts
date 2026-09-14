// @ts-nocheck
/**
 * gacha-save-error.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createShowGachaSaveError(deps: any) {
  const showGachaSaveError = (error: unknown, actionText: string) => {
    const message = deps.getRuntimeErrorMessage(error);
    const detail = message || '未知错误';
    const toast = window.toastr || window.parent?.toastr;
    if (toast) {
      showActionableErrorToast(`${actionText}失败：${detail}`, {
        title: '骰子商店',
        suggestion: 'save',
        toastrOptions: { timeOut: 9000 },
      });
    }
  };
  return showGachaSaveError;
}
