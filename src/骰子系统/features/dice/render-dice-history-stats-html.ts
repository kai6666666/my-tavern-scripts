// @ts-nocheck
/**
 * render-dice-history-stats-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceHistoryStatsHtml(deps: any) {
  const renderDiceHistoryStatsHtml = (
    allStats: Record<DiceStatsScope, DiceHistoryStatsSummary>,
    scope: DiceStatsScope,
  ): string => {
    const activeStats = allStats[scope];
    const scopeUnavailable = deps.isDiceStatsScopeUnavailable(scope, deps.getDiceStatsContext());
    return `
      <div class="acu-history-stats-grid">
        <div class="acu-history-stat-card"><small>本聊天</small><strong>${allStats.chat.total}</strong></div>
        <div class="acu-history-stat-card"><small>本角色卡</small><strong>${allStats.character.total}</strong></div>
        <div class="acu-history-stat-card"><small>全局</small><strong>${allStats.global.total}</strong></div>
      </div>
      <div class="acu-history-stats-summary">
        <span>当前统计范围：${deps.DICE_STATS_SCOPE_LABELS[scope]}</span>
        <div class="acu-history-stats-values">
          <span>总数：<b>${activeStats.total}</b></span>
          <span>普通：<b>${activeStats.checks}</b></span>
          <span>对抗：<b>${activeStats.contests}</b></span>
          <span>成功率：<b class="is-success">${activeStats.checkSuccessRate}%</b></span>
        </div>
      </div>
      ${scopeUnavailable ? '<div class="acu-history-scope-note">当前环境未识别到该范围ID，仅显示已识别范围数据。</div>' : ''}
    `;
  };
  return renderDiceHistoryStatsHtml;
}
