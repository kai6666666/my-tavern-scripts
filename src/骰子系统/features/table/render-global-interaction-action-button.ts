// @ts-nocheck
/**
 * render-global-interaction-action-button.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionActionButton(deps: any) {
  const renderGlobalInteractionActionButton = (
    group: GlobalInteractionGroup,
    row: GlobalInteractionRow,
    action: GlobalInteractionAction,
    actionIndex: number,
  ): string => {
    const actionLabel = String(action.label);
    const iconClass = String(action.icon || 'fa-hand-pointer').trim() || 'fa-hand-pointer';
    const ariaLabel = `执行 ${actionLabel}：${row.title}`;

    return `<button type="button" class="acu-global-interaction-action" data-table-key="${deps.safeEncodeURIComponent(String(group.tableKey))}" data-row-index="${deps.safeEncodeURIComponent(String(row.rowIndex))}" data-action-label="${deps.safeEncodeURIComponent(String(actionLabel))}" data-action-index="${deps.safeEncodeURIComponent(String(actionIndex))}" aria-label="${deps.escapeHtml(String(ariaLabel))}"><i class="fa-solid ${deps.escapeHtml(String(iconClass))}"></i> ${deps.escapeHtml(String(actionLabel))}</button>`;
  };
  return renderGlobalInteractionActionButton;
}
