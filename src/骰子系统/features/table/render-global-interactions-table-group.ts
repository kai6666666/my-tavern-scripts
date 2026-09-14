// @ts-nocheck
/**
 * render-global-interactions-table-group.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionsTableGroup(deps: any) {
  const renderGlobalInteractionsTableGroup = (
    group: GlobalInteractionGroup,
    sectionKind: GlobalInteractionSectionKind,
  ): string => {
    const rowsHtml = group.rows.map(row => deps.renderGlobalInteractionRowCard(group, row, sectionKind)).join('');
    const groupSearchText = [group.tableName, ...group.rows.map(row => row.searchText)].join(' ');

    return `
                    <div class="acu-global-interaction-group" data-table-key="${deps.safeEncodeURIComponent(String(group.tableKey))}" data-table-name="${deps.safeEncodeURIComponent(String(group.tableName))}" data-search-text="${deps.safeEncodeURIComponent(String(groupSearchText))}">
                        <div class="acu-global-interaction-grid">${rowsHtml}</div>
                    </div>`;
  };
  return renderGlobalInteractionsTableGroup;
}
