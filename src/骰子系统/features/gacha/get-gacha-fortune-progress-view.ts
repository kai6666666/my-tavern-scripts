// @ts-nocheck
/**
 * get-gacha-fortune-progress-view.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ACTIVE_SECONDS_PER_FORTUNE, GACHA_CHARS_PER_FORTUNE, GACHA_MESSAGE_REWARD } from '../../entities/gacha-items';
export function createGetGachaFortuneProgressView(deps: any) {
  const getGachaFortuneProgressView = (
    state: GachaState,
    options: { projectActiveProgress?: boolean; now?: number } = {},
  ): GachaFortuneProgressView => {
    const now = options.now || Date.now();
    const stats = state.inputStats;
    const pendingCharCarry = Math.max(0, Math.floor(Number(stats.pendingCharCarry || 0)));
    const readyCharRewards = Math.floor(pendingCharCarry / GACHA_CHARS_PER_FORTUNE);
    const charProgress = pendingCharCarry % GACHA_CHARS_PER_FORTUNE;
    const charsUntilReward = Math.max(0, GACHA_CHARS_PER_FORTUNE - charProgress);
    const charPercent = Math.max(0, Math.min(100, (charProgress / GACHA_CHARS_PER_FORTUNE) * 100));
    const rewardStepMs = GACHA_ACTIVE_SECONDS_PER_FORTUNE * 1000;
    const projectedActiveMs =
      options.projectActiveProgress && document.visibilityState !== 'hidden'
        ? Math.max(0, Number(stats.pendingActiveMs || 0)) + Math.max(0, now - (stats.lastHeartbeatAt || now))
        : Math.max(0, Number(stats.pendingActiveMs || 0));
    const activeProgressMs = Math.max(0, Math.min(rewardStepMs, projectedActiveMs));
    const activeRemainingMs = Math.max(0, rewardStepMs - activeProgressMs);
    const activePercent = Math.max(0, Math.min(100, (activeProgressMs / rewardStepMs) * 100));
    const lastGainDetail = stats.lastFortuneDetail || stats.lastFortuneReason || '骰运奖励';
    const lastGainText =
      stats.lastFortuneGain > 0
        ? /[+＋]\s*\d+\s*$/.test(lastGainDetail)
          ? lastGainDetail
          : `${lastGainDetail} +${String(stats.lastFortuneGain)}`
        : '暂无获得记录';
    const lastGainTime =
      stats.lastFortuneGain > 0 ? deps.formatGachaRelativeTime(stats.lastFortuneAt) : '继续发送消息、保持活跃或进行检定';
    const charNote =
      readyCharRewards > 0
        ? `已攒够 ${String(readyCharRewards)} 次字数奖励，发送时结算`
        : `再写 ${String(charsUntilReward)} 字 +1，发送基础 +${String(GACHA_MESSAGE_REWARD)}`;

    return {
      fortune: Math.max(0, Math.floor(Number(state.wallet.fortune || 0))),
      charProgress,
      charGoal: GACHA_CHARS_PER_FORTUNE,
      charPercent,
      charNote,
      activePercent,
      activeRemainingText: deps.formatGachaDuration(activeRemainingMs),
      activeNote: `保持活跃满 ${String(GACHA_ACTIVE_SECONDS_PER_FORTUNE)} 秒 +1`,
      lastGainText,
      lastGainTime,
      shouldFlashActiveReward:
        stats.lastFortuneReason === '活跃奖励' && stats.lastFortuneAt > 0 && Math.abs(now - stats.lastFortuneAt) < 1600,
    };
  };
  return getGachaFortuneProgressView;
}
