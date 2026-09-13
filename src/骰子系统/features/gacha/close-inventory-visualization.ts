// @ts-nocheck
/**
 * close-inventory-visualization.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloseInventoryVisualization(deps: any) {
  const closeInventoryVisualization = () => {
    $('.acu-inventory-detail-overlay, .acu-inventory-overlay').remove();
  };
  return closeInventoryVisualization;
}
