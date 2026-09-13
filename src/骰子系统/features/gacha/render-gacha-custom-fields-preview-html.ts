// @ts-nocheck
/**
 * render-gacha-custom-fields-preview-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createRenderGachaCustomFieldsPreviewHtml(deps: any) {
  const renderGachaCustomFieldsPreviewHtml = (
    item: Pick<GachaItemDefinition, 'customFields' | 'targetColumns'>,
    options: GachaCustomFieldsPreviewRenderOptions = {},
  ): string => {
    const entries = deps.getGachaCustomFieldEntries(item);
    if (entries.length === 0) return '';

    const limit = Math.max(0, Math.floor(Number(options.limit ?? 2)));
    const visibleEntries = limit > 0 ? entries.slice(0, limit) : [];
    const overflowCount = Math.max(0, entries.length - visibleEntries.length);
    const fieldsHtml = visibleEntries
      .map(([key, value]) => {
        const title = `${key}：${value}`;
        const valueOnlyClass = options.valueOnly ? ' acu-gacha-custom-field-preview-chip-value-only' : '';
        return `
          <span class="acu-gacha-custom-field-preview-chip acu-gacha-custom-field-chip${valueOnlyClass}" title="${deps.escapeHtml(title)}" aria-label="${deps.escapeHtml(title)}">
            ${options.valueOnly ? '' : `<span class="acu-gacha-custom-field-preview-key">${deps.escapeHtml(key)}</span>`}
            <span class="acu-gacha-custom-field-preview-value">${deps.escapeHtml(value)}</span>
          </span>
        `;
      })
      .join('');
    const overflowHtml =
      options.showOverflowCount !== false && overflowCount > 0
        ? `<span class="acu-gacha-custom-field-preview-more">${deps.escapeHtml(options.valueOnly ? `+${String(overflowCount)}` : `+${String(overflowCount)} 字段`)}</span>`
        : '';

    if (!fieldsHtml && !overflowHtml) return '';
    return `<div class="acu-gacha-custom-field-preview acu-gacha-custom-fields-preview">${fieldsHtml}${overflowHtml}</div>`;
  };
  return renderGachaCustomFieldsPreviewHtml;
}
