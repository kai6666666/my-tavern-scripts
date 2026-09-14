// @ts-nocheck
/**
 * apply-gacha-custom-fields-to-row.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createApplyGachaCustomFieldsToRow(deps: any) {
  const applyGachaCustomFieldsToRow = (
    row: unknown[],
    headers: unknown[],
    item: Pick<GachaItemDefinition, 'customFields'>,
    options: GachaCustomFieldApplyOptions,
  ): void => {
    if (!Array.isArray(row) || !Array.isArray(headers) || !deps.hasGachaCustomFields(item)) return;

    const headerMap = deps.buildGachaCustomFieldHeaderMap(headers);
    const reservedHeaders = deps.getGachaReservedCustomFieldHeaders(options.target, options.targetColumns || item.targetColumns);

    for (const [rawKey, rawValue] of deps.getGachaCustomFieldEntries(item)) {
      const headerName = String(rawKey ?? '').trim();
      const value = String(rawValue ?? '').trim();
      if (!headerName || !value || reservedHeaders.has(headerName)) continue;

      const columnIndex = headerMap.get(headerName);
      if (typeof columnIndex !== 'number' || columnIndex < 0) continue;
      if (options.preserveNonEmptyExisting && String(row[columnIndex] ?? '').trim()) continue;

      row[columnIndex] = value;
    }
  };
  return applyGachaCustomFieldsToRow;
}
