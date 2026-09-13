// @ts-nocheck
/**
 * dice-stats-scope-labels.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDiceStatsScopeLabels(deps: any) {
  const DICE_STATS_SCOPE_LABELS: Record<DiceStatsScope, string> = {
    chat: '本聊天',
    character: '本角色卡',
    global: '全局',
  };
  return DICE_STATS_SCOPE_LABELS;
}
