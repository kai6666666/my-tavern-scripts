// @ts-nocheck
/**
 * refresh-inventory-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRefreshInventoryVisualization(deps: any) {
  const refreshInventoryVisualization = (options?: { focusSearch?: boolean; cursor?: number }) => {
    const rawData = deps.getCachedRawData() || deps.getTableData();
    const $overlay = $('.acu-inventory-overlay');
    if (!$overlay.length) return;
    $overlay.html(deps.renderInventoryVisualization(rawData));
    deps.hydrateCustomTableNameIconsIn($overlay as JQuery<HTMLElement>);
    if (options?.focusSearch) {
      const $search = $('.acu-inventory-filter[data-filter="search"]');
      $search.trigger('focus');
      const input = $search[0] as HTMLInputElement | undefined;
      if (input) {
        const cursor = Math.min(options.cursor ?? input.value.length, input.value.length);
        input.setSelectionRange(cursor, cursor);
      }
    }
  };
  return refreshInventoryVisualization;
}
