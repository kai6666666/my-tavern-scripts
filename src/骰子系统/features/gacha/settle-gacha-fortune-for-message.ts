// @ts-nocheck
/**
 * settle-gacha-fortune-for-message.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_CHARS_PER_FORTUNE, GACHA_MESSAGE_REWARD } from '../../entities/gacha-items';
export function createSettleGachaFortuneForMessage(deps: any) {
  const settleGachaFortuneForMessage = (messageId?: unknown) => {
    const state = deps.touchGachaActivity(deps.getGachaState(undefined, true));
    if (!state) return;

    const normalizedMessageId = deps.normalizeGachaMessageId(messageId);
    const humanInput = deps.consumePendingHumanInputSnapshot() || deps.getGachaChatMessageText(messageId);
    const settlementKey = deps.buildGachaSettlementKey(normalizedMessageId, humanInput);
    if (settlementKey && state.inputStats.lastSettledMessageId === settlementKey) return;
    const typedChars = deps.countUnicodeCharacters(deps.stripSystemInjectedContent(humanInput));
    const totalChars = state.inputStats.pendingCharCarry + typedChars;
    const charReward = Math.floor(totalChars / GACHA_CHARS_PER_FORTUNE);

    state.inputStats.totalTypedMessages += 1;
    state.inputStats.totalTypedChars += typedChars;
    state.inputStats.pendingCharCarry = totalChars % GACHA_CHARS_PER_FORTUNE;
    if (settlementKey) state.inputStats.lastSettledMessageId = settlementKey;
    const totalReward = GACHA_MESSAGE_REWARD + charReward;
    state.wallet.fortune += totalReward;
    deps.recordGachaFortuneGain(
      state,
      totalReward,
      '发送消息',
      `发送 ${typedChars} 字，基础 ${GACHA_MESSAGE_REWARD}${charReward > 0 ? `，字数奖励 ${charReward}` : ''}`,
    );

    if (!deps.saveStoredGachaStateSnapshot(state)) return;
    deps.refreshGachaVisualization();
  };
  return settleGachaFortuneForMessage;
}
