// @ts-nocheck
/**
 * change-acu-dice-gacha-fortune.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FORTUNE_CURRENCY_NAME } from '../../entities/gacha-items';
export function createChangeAcuDiceGachaFortune(deps: any) {
  const changeAcuDiceGachaFortune = async (
    mode: 'set' | 'add',
    value: unknown,
    options: { silent?: boolean; reason?: string; detail?: string } = {},
  ) => {
    const amount = deps.normalizeAcuDiceGachaInteger(value, mode === 'set' ? FORTUNE_CURRENCY_NAME : `${FORTUNE_CURRENCY_NAME}变化量`, {
      allowNegative: mode === 'add',
    });
    let result: {
      before: number;
      after: number;
      delta: number;
      state: ReturnType<typeof deps.buildAcuDiceGachaStateSnapshot>;
    } | null = null;

    await deps.runInSaveQueue(async () => {
      const state = deps.touchGachaActivity(deps.getGachaState(undefined, true));
      if (!state) throw new Error('骰子商店状态不可用');
      const before = Math.max(0, Math.floor(Number(state.wallet.fortune || 0)));
      const after = mode === 'set' ? amount : Math.max(0, before + amount);
      state.wallet.fortune = after;
      const delta = after - before;
      if (delta > 0) {
        const reason = String(options.reason || 'API调整').trim() || 'API调整';
        const detail = String(options.detail || reason).trim() || reason;
        deps.recordGachaFortuneGain(state, delta, reason, `${detail} +${delta}`);
      }
      deps.assertSaveStoredGachaStateSnapshot(state);
      deps.refreshGachaVisualization();
      result = {
        before,
        after,
        delta,
        state: deps.buildAcuDiceGachaStateSnapshot(state),
      };
    });

    if (!result) throw new Error('骰子商店状态保存失败');
    if (!options.silent && window.toastr) {
      if (result.delta === 0) {
        window.toastr.info(`${FORTUNE_CURRENCY_NAME}保持 ${result.after}`, '骰子商店');
      } else {
        const verb = result.delta > 0 ? '增加' : '减少';
        window.toastr.success(
          `${FORTUNE_CURRENCY_NAME}${verb} ${Math.abs(result.delta)}，当前 ${result.after}`,
          '骰子商店',
        );
      }
    }
    deps.emitEvent('gacha:fortune', result);
    return result;
  };
  return changeAcuDiceGachaFortune;
}
