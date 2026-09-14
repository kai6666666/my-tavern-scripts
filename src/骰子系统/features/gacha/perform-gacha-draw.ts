// @ts-nocheck
/**
 * perform-gacha-draw.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { FORTUNE_CURRENCY_NAME, GACHA_DRAW_COST_SINGLE, GACHA_DRAW_COST_TEN } from '../../entities/gacha-items';
import { cloneGachaState } from './gacha-helpers';
export function createPerformGachaDraw(deps: any) {
  const performGachaDraw = async (drawCount: number) => {
    const safeDrawCount = drawCount >= 10 ? 10 : 1;
    const drawCost = safeDrawCount >= 10 ? GACHA_DRAW_COST_TEN : GACHA_DRAW_COST_SINGLE;
    let drawResult = {
      success: false,
      drawCount: safeDrawCount,
      cost: drawCost,
      outcomes: [] as GachaDrawOutcome[],
      state: null as GachaState | null,
      message: '',
      error: '',
    };
    try {
      await deps.runInSaveQueue(async () => {
        const rawData = deps.getTableData({ silent: true }) || deps.getCachedRawData();
        if (!rawData) {
          drawResult.message = '未找到当前聊天数据库表格';
          return;
        }
        await deps.ensureGachaCatalogLoaded(rawData);

        const state = deps.touchGachaActivity(deps.getGachaState(rawData, true));
        if (!state) {
          drawResult.message = '骰子商店状态不可用';
          return;
        }
        state.activePoolTag = deps.getGachaActivePoolTag(state);
        const availableTargets = deps.getAvailableGachaRewardTargets(rawData);
        const poolTargets = new Set(
          deps.getGachaPoolDefinitions(state.activePoolTag, rawData).map(item => item.rewardTarget),
        ) as Set<GachaRewardTarget>;
        if (poolTargets.size > 0 && Array.from(poolTargets).every(target => !availableTargets.has(target))) {
          const label = Array.from(poolTargets).map(deps.getGachaRewardTargetTableLabel).join('或');
          drawResult.state = cloneGachaState(state);
          drawResult.message = `未找到${label}，暂时无法发放骰子商店奖励`;
          deps.warnTableTemplateIssue(`未找到${label}，暂时无法发放骰子商店奖励`);
          return;
        }
        if (state.wallet.fortune < drawCost) {
          drawResult.state = cloneGachaState(state);
          drawResult.message = `${FORTUNE_CURRENCY_NAME}不足，无法抽取`;
          if (window.toastr) window.toastr.warning(`${FORTUNE_CURRENCY_NAME}不足，无法抽取`);
          return;
        }

        const stateSnapshot = deps.cloneRuntimeDataValue(state);
        state.wallet.fortune -= drawCost;
        const modifiedSheetKeys = new Set<string>();
        const outcomes: GachaDrawOutcome[] = [];
        // 按需表级快照：只深拷贝本卡池实际写入的表，避免每次抽卡克隆全部工作表。
        const sheetSnapshots = new Map<string, unknown>();
        try {
          for (let index = 0; index < safeDrawCount; index++) {
            const result = deps.drawSingleGachaOutcome(rawData, state, availableTargets, sheetSnapshots);
            if (!result) continue;
            if (result.modifiedSheetKey) modifiedSheetKeys.add(result.modifiedSheetKey);
            outcomes.push(result.outcome);
          }
        } catch (error) {
          sheetSnapshots.forEach((snapshot, sheetKey) => {
            deps.restoreMutableRuntimeValue(rawData[sheetKey], snapshot);
          });
          deps.restoreMutableRuntimeValue(state, stateSnapshot);
          throw error;
        }

        if (outcomes.length === 0) {
          state.wallet.fortune += drawCost;
          drawResult.state = cloneGachaState(state);
          drawResult.message = '当前卡池没有可发放的奖励';
          if (window.toastr) window.toastr.warning('当前卡池没有可发放的奖励');
          return;
        }

        await deps.persistRawDataWithGacha(rawData, Array.from(modifiedSheetKeys), state);
        deps.refreshGachaVisualization();
        deps.refreshInventoryVisualization();
        const summary = outcomes
          .slice(0, 5)
          .map(outcome =>
            outcome.duplicateConverted
              ? `${outcome.item.name}→${outcome.shardGain}${deps.getGachaShardLabel(outcome.item.quality)}`
              : outcome.item.name,
          )
          .join('、');
        if (window.toastr) {
          window.toastr.success(
            `${safeDrawCount >= 10 ? '十连' : '单抽'}完成：${summary}${outcomes.length > 5 ? '…' : ''}`,
            '骰子商店',
          );
        }
        drawResult = {
          success: true,
          drawCount: safeDrawCount,
          cost: drawCost,
          outcomes,
          state: cloneGachaState(state),
          message: `${safeDrawCount >= 10 ? '十连' : '单抽'}完成`,
          error: '',
        };
      });
    } catch (error) {
      deps.showGachaSaveError(error, safeDrawCount >= 10 ? '十连抽取保存' : '单抽保存');
      drawResult.error = deps.getRuntimeErrorMessage(error) || String(error);
      drawResult.message = safeDrawCount >= 10 ? '十连抽取保存失败' : '单抽保存失败';
    }
    return drawResult;
  };
  return performGachaDraw;
}
