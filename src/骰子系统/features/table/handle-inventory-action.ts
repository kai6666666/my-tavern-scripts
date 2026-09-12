// @ts-nocheck
/**
 * handle-inventory-action.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createHandleInventoryAction(deps: any) {
  const handleInventoryAction = (rowIndex, action) => {
    const { $ } = deps.getCore();
    const item = deps.findInventoryItemByRow(rowIndex);
    if (!item && action !== 'detail') return;
    if (action === 'detail') {
      deps.showInventoryItemDetail(rowIndex);
      return;
    }
    if (action === 'gift') {
      void deps.showInventoryGiftDialog(rowIndex);
      return;
    }
    if (action === 'show') {
      deps.smartInsertToTextarea(`<user>向周围人出示${item.name}。`, 'action');
      $('.acu-inventory-detail-overlay').remove();
      return;
    }
    if (action === 'send-desc') {
      deps.smartInsertToTextarea(`${item.name}：${item.description || '暂无描述'}`, 'action');
      $('.acu-inventory-detail-overlay').remove();
      return;
    }
    if (action === 'jump') {
      const tableName = deps.resolveExistingTableName(item.tableName);
      if (!tableName) {
        deps.warnMissingTableTarget(item.tableName);
        return;
      }

      $('.acu-inventory-detail-overlay').remove();
      deps.closeInventoryVisualization();
      Store.set(deps.STORAGE_KEY_DASHBOARD_ACTIVE, false);
      Store.set(deps.STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
      Store.set('acu_changes_panel_active', false);
      deps.saveActiveTabState(tableName);
      deps.setActiveTableNavButton(tableName);
      setTimeout(() => deps.renderInterface(), 0);
      setTimeout(() => {
        const $targetCard = $(`.acu-data-card[data-row-index="${rowIndex}"]`);
        if ($targetCard.length) {
          $targetCard.addClass('acu-highlight-flash');
          $targetCard[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          setTimeout(() => $targetCard.removeClass('acu-highlight-flash'), 2000);
        }
      }, 300);
      return;
    }
    deps.smartInsertToTextarea(deps.getInventoryActionPrompt(item), 'action');
    $('.acu-inventory-detail-overlay').remove();
  };
  return handleInventoryAction;
}
