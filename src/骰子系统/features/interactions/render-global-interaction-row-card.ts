// @ts-nocheck
/**
 * render-global-interaction-row-card.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionRowCard(deps: any) {
  const renderGlobalInteractionRowCard = (
    group: GlobalInteractionGroup,
    row: GlobalInteractionRow,
    sectionKind: GlobalInteractionSectionKind,
  ): string => {
    const actionsHtml = row.actions
      .map((action, actionIndex) => deps.renderGlobalInteractionActionButton(group, row, action, actionIndex))
      .join('');
    const displayName = deps.replaceUserPlaceholders(row.title);
    const iconName = row.iconName || row.title;
    const customIconContext =
      sectionKind === 'character' ? null : deps.createGlobalInteractionCustomTableNameIconContext(group.tableName, iconName);
    const visualHtml =
      sectionKind === 'character'
        ? // 角色分区必须保留 AvatarManager 头像与偏移/缩放逻辑，不能走自定义表名图标。
          deps.renderGlobalInteractionAvatar(row.title)
        : sectionKind === 'map'
          ? deps.renderGlobalInteractionMapMark(row.title, group.tableName, iconName)
          : sectionKind === 'item'
            ? deps.renderGlobalInteractionItemMark(row.title, customIconContext)
            : deps.renderGlobalInteractionGenericMark(row.title, customIconContext);

    return `
                    <div class="acu-global-interaction-row acu-global-interaction-row-${sectionKind}" data-table-key="${deps.safeEncodeURIComponent(String(group.tableKey))}" data-row-index="${deps.safeEncodeURIComponent(String(row.rowIndex))}" data-search-text="${deps.safeEncodeURIComponent(String(row.searchText))}">
                        <button type="button" class="acu-global-interaction-row-main" aria-expanded="false" aria-label="打开 ${deps.escapeHtml(displayName)} 的交互菜单">
                            ${visualHtml}
                        </button>
                        <div class="acu-global-interaction-details">
                            <button type="button" class="acu-global-interaction-row-title acu-dash-preview-trigger" data-table-key="${deps.safeEncodeURIComponent(String(group.tableKey))}" data-row-index="${deps.safeEncodeURIComponent(String(row.rowIndex))}" title="${deps.escapeHtml(displayName)}" aria-label="查看 ${deps.escapeHtml(displayName)} 的卡片">${deps.escapeHtml(displayName)}</button>
                            <div class="acu-global-interaction-actions">${actionsHtml}</div>
                        </div>
                    </div>`;
  };
  return renderGlobalInteractionRowCard;
}
