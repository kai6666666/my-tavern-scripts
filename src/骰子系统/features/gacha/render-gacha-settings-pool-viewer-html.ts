// @ts-nocheck
/**
 * render-gacha-settings-pool-viewer-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from '../../features/gacha/gacha-helpers';
import type { GachaPoolTag } from '../../entities/gacha-items';
export function createRenderGachaSettingsPoolViewerHtml(deps: any) {
  const renderGachaSettingsPoolViewerHtml = (rawData, selectedPoolId: GachaPoolTag): string => {
    const pool = deps.getVisibleGachaPoolConfigDefinitions(rawData).find(candidate => candidate.id === selectedPoolId);
    const safePoolId = pool?.id || GACHA_ALL_POOL_TAG;
    const items = deps.getGachaSettingsPoolItems(rawData, safePoolId);
    return `
      <section class="acu-gacha-settings-section acu-gacha-settings-items-section" data-pool-id="${deps.escapeHtml(safePoolId)}">
        <div class="acu-gacha-settings-section-head">
          <div>
            <strong>卡池物品：${deps.escapeHtml(pool?.name || safePoolId)}</strong>
            <span class="acu-gacha-settings-count">当前 ${deps.escapeHtml(String(items.length))} 个</span>
          </div>
          <div class="acu-gacha-settings-toolbar">
            ${deps.renderGachaSettingsFilterMenuHtml('source', deps.GACHA_SETTINGS_SOURCE_FILTER_OPTIONS, deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.source)}
            ${deps.renderGachaSettingsFilterMenuHtml('status', deps.GACHA_SETTINGS_STATUS_FILTER_OPTIONS, deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.status)}
            ${deps.renderGachaSettingsFilterMenuHtml('sort', deps.GACHA_SETTINGS_SORT_OPTIONS, deps.DEFAULT_GACHA_SETTINGS_ITEM_FILTERS.sort)}
            <label class="acu-gacha-settings-search">
              <i class="fa-solid fa-search"></i>
              <input class="acu-gacha-settings-item-search" type="text" placeholder="名称、类型、描述" autocomplete="off" />
            </label>
          </div>
        </div>
        ${deps.renderGachaSettingsPoolTabsHtml(rawData, safePoolId)}
        <div class="acu-gacha-settings-item-list">
          ${deps.renderGachaSettingsPoolItemsHtml(rawData, safePoolId)}
          <div class="acu-inventory-empty compact acu-gacha-settings-filter-empty" hidden><i class="fa-solid fa-filter-circle-xmark"></i><span>没有符合筛选条件的物品</span></div>
        </div>
      </section>
    `;
  };
  return renderGachaSettingsPoolViewerHtml;
}
