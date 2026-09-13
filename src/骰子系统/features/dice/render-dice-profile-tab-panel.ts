// @ts-nocheck
/**
 * render-dice-profile-tab-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceProfileTabPanel(deps: any) {
  const renderDiceProfileTabPanel = (
    id: 'character' | 'library' | 'snapshots',
    summaries: readonly DiceProfileSummary[],
    emptyText: string,
    options: { active?: boolean; current?: boolean } = {},
  ): string => `
    <section class="acu-profile-tab-panel ${options.active ? 'is-active' : ''}" data-profile-panel="${id}" ${options.active ? '' : 'hidden'}>
      <div class="acu-profile-list">
        ${
          summaries.length > 0
            ? summaries.map(summary => deps.renderDiceProfileSummaryRow(summary, { current: options.current })).join('')
            : `<div class="acu-config-backup-empty acu-profile-empty">${deps.escapeHtml(emptyText)}</div>`
        }
      </div>
    </section>`;
  return renderDiceProfileTabPanel;
}
