// @ts-nocheck
/**
 * render-inventory-filter-buttons.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderInventoryFilterButtons(deps: any) {
  const renderInventoryFilterButtons = <T extends string>(
    filterKey: 'type' | 'quality' | 'sort',
    selectedValue: T,
    options: ReadonlyArray<InventoryFilterButtonMeta<T>>,
  ) =>
    options
      .map(option => {
        const isActive = option.value === selectedValue;
        return `
          <button
            class="acu-inventory-filter-btn ${isActive ? 'active' : ''}"
            type="button"
            data-filter="${filterKey}"
            data-value="${deps.escapeHtml(option.value)}"
            title="${deps.escapeHtml(option.label)}"
            aria-label="${deps.escapeHtml(option.label)}"
          >
            <i class="fa-solid ${option.icon}"></i>
          </button>
        `;
      })
      .join('');
  return renderInventoryFilterButtons;
}
