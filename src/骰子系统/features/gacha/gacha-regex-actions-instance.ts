// @ts-nocheck
/**
 * gacha-regex-actions-instance.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GachaRegexActions } from './gacha-regex-actions';
import { FORTUNE_CURRENCY_NAME } from '../../entities/gacha-items';
import { showActionableErrorToast } from '../../shared/actionable-error-toast';
export function createGachaRegexActionsInstance(deps: any) {
  const gachaRegexActions = new GachaRegexActions({
    gachaApi: deps.getAcuDiceGachaApi(),
    currencyName: FORTUNE_CURRENCY_NAME,
    getToastr: () => {
      try {
        return window.toastr || (deps.getRootWindow() !== window ? (deps.getRootWindow() as unknown as { toastr?: typeof window.toastr }).toastr : undefined);
      } catch {
        return window.toastr;
      }
    },
    getRuntimeErrorMessage: (error: unknown) => deps.getRuntimeErrorMessage(error),
    showActionableErrorToast: (message: string, options?: any) => showActionableErrorToast(message, options),
    getCore: () => deps.getCore(),
  });
  return gachaRegexActions;
}
