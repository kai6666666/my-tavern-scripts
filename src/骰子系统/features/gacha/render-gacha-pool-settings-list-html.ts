// @ts-nocheck
/**
 * render-gacha-pool-settings-list-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { GACHA_ALL_POOL_TAG } from '../../features/gacha/gacha-helpers';
export function createRenderGachaPoolSettingsListHtml(deps: any) {
  const renderGachaPoolSettingsListHtml = (rawData): string => {
    const itemDefinitions = deps.getAllGachaItemDefinitions(rawData);
    const counts = new Map<GachaPoolTag, number>();
    itemDefinitions.forEach(item => {
      item.poolTags.forEach(tag => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });
    const allPoolItems = deps.getGachaCatalogItemsForExport(rawData, GACHA_ALL_POOL_TAG);
    return deps.getAllGachaPoolConfigDefinitions(rawData)
      .map(pool => {
        const isAllPool = pool.id === GACHA_ALL_POOL_TAG;
        const poolItems = isAllPool ? allPoolItems : itemDefinitions.filter(item => item.poolTags.includes(pool.id));
        const countText = isAllPool ? `${poolItems.length} 个候选` : `${counts.get(pool.id) || 0} 个物品`;
        const enabled = isAllPool || pool.includeInAll === true;
        const canDeletePool = deps.canDeleteGachaPoolDefinition(pool);
        const statusText = isAllPool ? '固定显示' : enabled ? '已启用' : '已停用';
        return `
          <article class="acu-preset-item acu-gacha-settings-pool-item ${enabled ? '' : 'is-disabled'}" data-pool-id="${deps.escapeHtml(pool.id)}">
            ${!isAllPool ? `<div class="acu-preset-handle acu-gacha-pool-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></div>` : '<div class="acu-gacha-pool-handle-placeholder"></div>'}
            <div class="acu-gacha-settings-pool-main">
              <div class="acu-gacha-settings-pool-name">
                ${deps.escapeHtml(pool.name)}
                ${pool.builtin && !canDeletePool ? '<span>内置</span>' : '<span>自定义</span>'}
              </div>
              <div class="acu-gacha-settings-pool-meta">${deps.escapeHtml(pool.id)} · ${deps.escapeHtml(countText)} · ${deps.escapeHtml(statusText)}</div>
            </div>
            <div class="acu-gacha-settings-actions">
              ${
                isAllPool
                  ? `<span class="acu-gacha-pool-all-fixed" title="全部是聚合卡池，不加入自身"><i class="fa-solid fa-layer-group"></i></span>`
                  : `<label class="acu-toggle acu-gacha-pool-all-toggle" title="${enabled ? '已启用：显示标签并进入全部抽取范围' : '已停用：隐藏标签并移出全部抽取范围'}">
                      <input class="acu-gacha-pool-all-check" type="checkbox" ${enabled ? 'checked' : ''} />
                      <span class="acu-toggle-slider"></span>
                    </label>`
              }
              <button class="acu-preset-btn acu-gacha-pool-export" type="button" title="导出此卡池"><i class="fa-solid fa-download"></i></button>
              ${!isAllPool ? `<button class="acu-preset-btn acu-gacha-pool-rename" type="button" title="重命名"><i class="fa-solid fa-pen"></i></button>` : ''}
              ${canDeletePool ? `<button class="acu-preset-btn acu-gacha-pool-delete acu-preset-delete" type="button" title="删除"><i class="fa-solid fa-trash"></i></button>` : ''}
            </div>
          </article>
        `;
      })
      .join('');
  };
  return renderGachaPoolSettingsListHtml;
}
