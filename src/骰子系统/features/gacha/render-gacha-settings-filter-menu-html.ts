// @ts-nocheck
/**
 * render-gacha-settings-filter-menu-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaSettingsFilterField, GachaSettingsFilterOption } from '../../features/gacha/gacha-types';
export function createRenderGachaSettingsFilterMenuHtml(deps: any) {
  const renderGachaSettingsFilterMenuHtml = <T extends string>(
    field: GachaSettingsFilterField,
    options: readonly GachaSettingsFilterOption<T>[],
    selectedValue: T,
  ): string => {
    const fallback = options[0];
    if (!fallback) return '';
    const selected = options.find(option => option.value === selectedValue) || fallback;
    const optionHtml = options
      .map(option => {
        const active = option.value === selected.value;
        return `
          <button
            class="acu-gacha-settings-filter-option ${active ? 'active' : ''}"
            type="button"
            role="menuitemradio"
            aria-checked="${active ? 'true' : 'false'}"
            data-filter-value="${deps.escapeHtml(option.value)}"
          >
            <i class="fa-solid ${deps.escapeHtml(option.iconClass)}"></i>
            <span>${deps.escapeHtml(option.label)}</span>
          </button>
        `;
      })
      .join('');
    return `
      <input class="acu-gacha-settings-${field}-filter" type="hidden" value="${deps.escapeHtml(selected.value)}" />
      <div class="acu-gacha-settings-filter-menu" data-filter-field="${field}">
        <button class="acu-gacha-settings-filter-trigger" type="button" aria-haspopup="menu" aria-expanded="false">
          <i class="fa-solid ${deps.escapeHtml(selected.iconClass)}"></i>
          <span class="acu-gacha-settings-filter-menu-label">${deps.escapeHtml(selected.label)}</span>
          <i class="fa-solid fa-chevron-down acu-gacha-settings-filter-chevron"></i>
        </button>
        <div class="acu-gacha-settings-filter-menu-list" role="menu">
          ${optionHtml}
        </div>
      </div>
    `;
  };
  return renderGachaSettingsFilterMenuHtml;
}
