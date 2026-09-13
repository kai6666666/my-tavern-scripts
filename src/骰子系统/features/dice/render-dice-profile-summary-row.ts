// @ts-nocheck
/**
 * render-dice-profile-summary-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceProfileSummaryRow(deps: any) {
  const renderDiceProfileSummaryRow = (summary: DiceProfileSummary, options: { current?: boolean } = {}): string => {
    const sourceLabel = deps.getDiceProfileSourceLabel(summary.source);
    const profileId = deps.escapeHtml(summary.id);
    const profileName = deps.escapeHtml(summary.name);
    const escapedSourceLabel = deps.escapeHtml(sourceLabel);
    const isCharacterProfile = deps.isDiceProfileCharacterSource(summary.source);
    const actionButtons = [
      `<button type="button" class="acu-setting-action-btn acu-profile-action acu-profile-apply-action" data-profile-action="apply" data-profile-id="${profileId}" title="应用" aria-label="应用 ${profileName}"><i class="fa-solid fa-play"></i><span>应用</span></button>`,
      !isCharacterProfile
        ? `<button type="button" class="acu-setting-action-btn acu-profile-action" data-profile-action="rename" data-profile-id="${profileId}" title="重命名" aria-label="重命名 ${profileName}"><i class="fa-solid fa-pen"></i><span>重命名</span></button>`
        : '',
      !isCharacterProfile
        ? `<button type="button" class="acu-setting-action-btn acu-profile-action" data-profile-action="save-as" data-profile-id="${profileId}" title="另存为" aria-label="另存为 ${profileName}"><i class="fa-solid fa-copy"></i><span>另存为</span></button>`
        : '',
      `<button type="button" class="acu-setting-action-btn acu-profile-action" data-profile-action="export" data-profile-id="${profileId}" title="导出" aria-label="导出 ${profileName}"><i class="fa-solid fa-file-export"></i><span>导出</span></button>`,
      `<button type="button" class="acu-setting-action-btn acu-profile-action acu-profile-convert-regex-action" data-profile-action="tavern-regex" data-profile-id="${profileId}" title="转正则" aria-label="把 ${profileName} 转成角色卡正则"><i class="fa-solid fa-code"></i><span>转正则</span></button>`,
      !isCharacterProfile
        ? `<button type="button" class="acu-setting-action-btn acu-profile-action acu-profile-danger" data-profile-action="delete" data-profile-id="${profileId}" title="删除" aria-label="删除 ${profileName}"><i class="fa-solid fa-trash"></i><span>删除</span></button>`
        : '',
    ]
      .filter(Boolean)
      .join('');
    return `
      <div class="acu-profile-row ${options.current ? 'is-current' : ''}" data-profile-id="${profileId}" title="${profileName}（${escapedSourceLabel}）">
        <div class="acu-profile-row-main">
          <div class="acu-profile-row-title">
            <strong>${profileName}</strong>
          </div>
        </div>
        <div class="acu-profile-row-actions">
          ${actionButtons}
        </div>
      </div>`;
  };
  return renderDiceProfileSummaryRow;
}
