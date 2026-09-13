// @ts-nocheck
/**
 * render-gacha-custom-fields-details-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createRenderGachaCustomFieldsDetailsHtml(deps: any) {
  const renderGachaCustomFieldsDetailsHtml = (
    item: Pick<GachaItemDefinition, 'customFields'>,
    options: GachaCustomFieldsDetailsRenderOptions = {},
  ): string => {
    const entries = deps.getGachaCustomFieldEntries(item);
    if (entries.length === 0) return '';

    const title = options.title || '自定义字段';
    const openThreshold = Math.max(0, Math.floor(Number(options.openThreshold ?? 4)));
    const openAttribute = entries.length <= openThreshold ? ' open' : '';
    const rowsHtml = entries
      .map(
        ([key, value]) => `
          <div class="acu-gacha-custom-field-detail-row">
            <span class="acu-gacha-custom-field-detail-key">${deps.escapeHtml(key)}</span>
            <span class="acu-gacha-custom-field-detail-value">${deps.escapeHtml(value)}</span>
          </div>
        `,
      )
      .join('');

    return `
      <details class="acu-gacha-custom-field-details acu-gacha-custom-fields-details"${openAttribute}>
        <summary>
          <span><i class="fa-solid fa-table-list"></i><strong>${deps.escapeHtml(title)}</strong></span>
          <small>${deps.escapeHtml(String(entries.length))} 项</small>
        </summary>
        <div class="acu-gacha-custom-field-detail-list">${rowsHtml}</div>
      </details>
    `;
  };
  return renderGachaCustomFieldsDetailsHtml;
}
