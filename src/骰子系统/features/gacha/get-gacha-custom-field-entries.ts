// @ts-nocheck
/**
 * get-gacha-custom-field-entries.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaCustomFieldEntries(deps: any) {
  const getGachaCustomFieldEntries = (item: Pick<GachaItemDefinition, 'customFields'>): [string, string][] =>
    item.customFields ? Object.entries(item.customFields) : [];
  return getGachaCustomFieldEntries;
}
