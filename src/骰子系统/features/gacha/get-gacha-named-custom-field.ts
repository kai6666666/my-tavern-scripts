// @ts-nocheck
/**
 * get-gacha-named-custom-field.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaNamedCustomField(deps: any) {
  const getGachaNamedCustomField = (
    item: Pick<GachaItemDefinition, 'customFields'>,
    fieldNames: readonly string[],
  ): string => {
    const wanted = new Set(fieldNames.map(deps.normalizeGachaFieldAlias).filter(Boolean));
    for (const [key, value] of deps.getGachaCustomFieldEntries(item)) {
      if (wanted.has(String(key).trim().toLowerCase())) return String(value || '').trim();
    }
    return '';
  };
  return getGachaNamedCustomField;
}
