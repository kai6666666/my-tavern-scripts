// @ts-nocheck
/**
 * clear-gacha-fortune.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FORTUNE_CURRENCY_NAME } from '../../entities/gacha-items';
export function createClearGachaFortune(deps: any) {
  const clearGachaFortune = async () => {
    const state = deps.getGachaState(undefined, true);
    const currentFortune = Math.max(0, Math.floor(Number(state?.wallet.fortune || 0)));
    if (!state || currentFortune <= 0) {
      if (window.toastr) window.toastr.info(`${FORTUNE_CURRENCY_NAME}已经是 0`, '骰子商店');
      return;
    }

    const confirmed = await deps.showDiceSystemConfirmDialog({
      title: `清空${FORTUNE_CURRENCY_NAME}`,
      message: `确定要清空当前${FORTUNE_CURRENCY_NAME}余额吗？`,
      detail: `当前余额：${currentFortune}\n只会清空当前聊天/上下文的${FORTUNE_CURRENCY_NAME}，不会影响碎片、保底、最近收获或物品栏。`,
      iconClass: 'fa-eraser',
      confirmText: `清空${FORTUNE_CURRENCY_NAME}`,
      cancelText: '取消',
      tone: 'danger',
    });
    if (!confirmed) return;

    try {
      await deps.runInSaveQueue(async () => {
        const latestState = deps.getGachaState(undefined, true);
        const latestFortune = Math.max(0, Math.floor(Number(latestState?.wallet.fortune || 0)));
        if (!latestState || latestFortune <= 0) {
          if (window.toastr) window.toastr.info(`${FORTUNE_CURRENCY_NAME}已经是 0`, '骰子商店');
          deps.refreshGachaVisualization();
          return;
        }
        latestState.wallet.fortune = 0;
        deps.assertSaveStoredGachaStateSnapshot(latestState);
        deps.refreshGachaVisualization();
        if (window.toastr) window.toastr.success(`${FORTUNE_CURRENCY_NAME}已清空`, '骰子商店');
      });
    } catch (error) {
      deps.showGachaSaveError(error, `${FORTUNE_CURRENCY_NAME}清空保存`);
    }
  };
  return clearGachaFortune;
}
