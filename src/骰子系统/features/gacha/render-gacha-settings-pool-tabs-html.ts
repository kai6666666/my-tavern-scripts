// @ts-nocheck
/**
 * render-gacha-settings-pool-tabs-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createRenderGachaSettingsPoolTabsHtml(deps: any) {
  const renderGachaSettingsPoolTabsHtml = (rawData, selectedPoolId: GachaPoolTag): string => {
    const pools = deps.getVisibleGachaPoolConfigDefinitions(rawData);
    return `
      <div class="acu-gacha-pool-tabs acu-gacha-settings-pool-tabs" role="tablist">
        ${pools
          .map(pool => {
            const active = pool.id === selectedPoolId;
            return `
              <button
                class="acu-gacha-pool-tab acu-gacha-settings-pool-tab ${active ? 'active' : ''}"
                type="button"
                role="tab"
                aria-selected="${active ? 'true' : 'false'}"
                data-pool-id="${deps.escapeHtml(pool.id)}"
                title="${deps.escapeHtml(pool.name)}"
              >
                <i class="fa-solid fa-tags"></i>
                <span>${deps.escapeHtml(pool.name)}</span>
              </button>
            `;
          })
          .join('')}
      </div>
    `;
  };
  return renderGachaSettingsPoolTabsHtml;
}
