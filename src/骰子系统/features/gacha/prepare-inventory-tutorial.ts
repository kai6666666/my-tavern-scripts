// @ts-nocheck
/**
 * prepare-inventory-tutorial.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPrepareInventoryTutorial(deps: any) {
  const prepareInventoryTutorial = (button: Element): boolean => {
    const { $ } = deps.getCore();
    const $overlay = $(button).closest('.acu-inventory-overlay');
    if (!$overlay.length) return false;

    const $filterPanel = $overlay.find('.acu-inventory-filter-collapsible').first();
    if ($filterPanel.length) {
      $filterPanel.removeClass('collapsed');
      $filterPanel[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
    return true;
  };
  return prepareInventoryTutorial;
}
