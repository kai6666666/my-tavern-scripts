// @ts-nocheck
/**
 * get-gacha-custom-fields-search-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaCustomFieldsSearchText(deps: any) {
  const getGachaCustomFieldsSearchText = (item: Pick<GachaItemDefinition, 'customFields'>): string =>
    deps.getGachaCustomFieldEntries(item)
      .map(([key, value]) => `${key} ${value}`)
      .join(' ');
  return getGachaCustomFieldsSearchText;
}
