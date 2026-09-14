// @ts-nocheck
/**
 * render-global-interactions-section.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionsSection(deps: any) {
  const renderGlobalInteractionsSection = (section: GlobalInteractionSection): string => {
    const collapsedSections = deps.getGlobalInteractionCollapsedSections();
    const isCollapsed = collapsedSections.includes(section.kind);
    const rowCount = section.groups.reduce((count, group) => count + group.rows.length, 0);
    const actionCount = section.groups.reduce(
      (count, group) => count + group.rows.reduce((rowCountSum, row) => rowCountSum + row.actions.length, 0),
      0,
    );
    const sectionSearchText = section.groups
      .map(group => `${group.tableName} ${group.rows.map(row => row.searchText).join(' ')}`)
      .join(' ');
    const groupsHtml = section.groups.map(group => deps.renderGlobalInteractionsTableGroup(group, section.kind)).join('');

    return `
                <div class="acu-global-interaction-section acu-global-interaction-section-${section.kind} ${isCollapsed ? 'collapsed' : ''}" data-section-kind="${section.kind}" data-search-text="${deps.safeEncodeURIComponent(String(sectionSearchText))}">
                    <button type="button" class="acu-global-interaction-section-header" data-section-kind="${section.kind}" aria-expanded="${isCollapsed ? 'false' : 'true'}">
                        <i class="fa-solid fa-chevron-${isCollapsed ? 'right' : 'down'} acu-collapse-icon"></i>
                        <span class="acu-global-interaction-section-title"><i class="fa-solid ${deps.escapeHtml(section.icon)}"></i> ${deps.escapeHtml(section.title)}</span>
                        <span class="acu-global-interaction-section-stats">${deps.escapeHtml(String(section.groups.length))} 个表 / ${deps.escapeHtml(String(rowCount))} 个对象 / ${deps.escapeHtml(String(actionCount))} 个交互</span>
                    </button>
                    <div class="acu-global-interaction-section-body" style="${isCollapsed ? 'display:none;' : ''}">
                        <div class="acu-global-interaction-table-list">${groupsHtml}</div>
                    </div>
                </div>`;
  };
  return renderGlobalInteractionsSection;
}
