// @ts-nocheck
/**
 * render-gacha-settings-pool-items-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGachaSettingsPoolItemsHtml(deps: any) {
  const renderGachaSettingsPoolItemsHtml = (rawData, poolId: GachaPoolTag): string => {
    const customIds = new Set(deps.getCustomGachaItemDefinitions(rawData).map(item => item.id));
    const items = deps.getGachaSettingsPoolItems(rawData, poolId);
    const sortedItems = items.slice().sort(deps.compareGachaItemDefinitionsForDisplay);
    if (sortedItems.length === 0) {
      return `<div class="acu-inventory-empty compact"><i class="fa-solid fa-box-open"></i><span>这个卡池里还没有物品</span></div>`;
    }

    return sortedItems
      .map((item, index) => {
        const custom = customIds.has(item.id);
        const enabled = deps.isGachaItemEnabled(item);
        const customText = custom ? '自定义' : '内置';
        const enabledText = enabled ? '启用' : '禁用';
        const destinationLabel = deps.formatGachaRewardDestinationLabel(rawData, item);
        const createdAt = deps.getGachaItemCreatedAtMs(item);
        const qualityRank = deps.getGachaRarityRank(item.quality);
        const customFieldsCount = deps.getGachaCustomFieldEntries(item).length;
        const customFieldsSearchText = deps.getGachaCustomFieldsSearchText(item);
        const customFieldsSummaryHtml =
          customFieldsCount > 0
            ? `<div class="acu-gacha-settings-item-custom-fields" aria-label="${deps.escapeHtml(`自定义字段 ${String(customFieldsCount)} 项`)}">${deps.renderGachaCustomFieldsPreviewHtml(item, { limit: 2, showOverflowCount: true, valueOnly: true })}</div>`
            : '';
        const searchText = [
          item.name,
          item.type,
          item.quality,
          deps.getGachaItemTagsText(item),
          deps.getGachaItemEffectText(item),
          item.description,
          deps.formatGachaPoolTags(item.poolTags, rawData),
          destinationLabel,
          customText,
          enabledText,
          customFieldsSearchText,
        ]
          .join(' ')
          .toLowerCase();
        return `
          <article
            class="acu-gacha-settings-item ${enabled ? '' : 'is-disabled'}"
            data-item-id="${deps.escapeHtml(item.id)}"
            data-search="${deps.escapeHtml(searchText)}"
            data-source="${custom ? 'custom' : 'builtin'}"
            data-enabled="${enabled ? 'true' : 'false'}"
            data-name="${deps.escapeHtml(item.name.toLocaleLowerCase('zh-CN'))}"
            data-created-at="${deps.escapeHtml(String(createdAt))}"
            data-quality-rank="${deps.escapeHtml(String(qualityRank))}"
            data-weight="${deps.escapeHtml(String(Number(item.weight) || 0))}"
            data-default-index="${deps.escapeHtml(String(index))}"
            role="button"
            tabindex="0"
            aria-label="${deps.escapeHtml(`查看 ${item.name} 详情`)}"
          >
            <div class="acu-preset-handle acu-gacha-item-handle" title="拖拽排序"><i class="fa-solid fa-grip-vertical"></i></div>
            <div class="acu-gacha-settings-item-icon">${deps.renderGachaItemIconContent(item, deps.getGachaItemCustomTableNameIconContext(item, rawData))}</div>
            <div class="acu-gacha-settings-item-main">
              <div class="acu-gacha-settings-item-name">
                ${deps.escapeHtml(item.name)}
                <span>${deps.escapeHtml(item.quality)}</span>
                <span>${custom ? '自定义' : '内置'}</span>
                ${enabled ? '' : '<span class="acu-gacha-settings-disabled-tag">禁用</span>'}
              </div>
              <div class="acu-gacha-settings-item-desc">${deps.escapeHtml(item.description || '暂无描述')}</div>
              <div class="acu-gacha-settings-item-meta">${deps.escapeHtml(item.type)} · 写入 ${deps.escapeHtml(destinationLabel)} · ${deps.escapeHtml(deps.formatGachaPoolTags(item.poolTags, rawData))} · 权重 ${deps.escapeHtml(String(item.weight))} · ${deps.escapeHtml(deps.formatGachaItemCreatedAt(item))}</div>
              ${customFieldsSummaryHtml}
            </div>
            <div class="acu-gacha-settings-actions">
              <label class="acu-toggle acu-gacha-item-enabled-toggle" title="${enabled ? '已参与抽取与兑换' : '已从抽取与兑换中移除'}">
                <input class="acu-gacha-item-enabled-check" type="checkbox" ${enabled ? 'checked' : ''} />
                <span class="acu-toggle-slider"></span>
              </label>
              ${
                custom
                  ? `<span class="acu-gacha-settings-inline-actions">
                      <button class="acu-preset-btn acu-gacha-item-edit" type="button" title="编辑"><i class="fa-solid fa-pen"></i></button>
                      <button class="acu-preset-btn acu-gacha-item-delete acu-preset-delete" type="button" title="删除"><i class="fa-solid fa-trash"></i></button>
                    </span>`
                  : ''
              }
              <details class="acu-gacha-settings-more">
                <summary class="acu-preset-btn" title="更多操作" aria-label="${deps.escapeHtml(`${item.name} 更多操作`)}"><i class="fa-solid fa-ellipsis-vertical"></i></summary>
                <div class="acu-gacha-settings-more-menu">
                  <button class="acu-gacha-item-toggle-menu" type="button"><i class="fa-solid ${enabled ? 'fa-toggle-off' : 'fa-toggle-on'}"></i><span>${enabled ? '禁用' : '启用'}</span></button>
                  ${
                    custom
                      ? `<button class="acu-gacha-item-edit" type="button"><i class="fa-solid fa-pen"></i><span>编辑</span></button>
                        <button class="acu-gacha-item-delete danger" type="button"><i class="fa-solid fa-trash"></i><span>删除</span></button>`
                      : ''
                  }
                </div>
              </details>
            </div>
          </article>
        `;
      })
      .join('');
  };
  return renderGachaSettingsPoolItemsHtml;
}
