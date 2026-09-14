// @ts-nocheck
/**
 * has-gacha-custom-fields.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createHasGachaCustomFields(deps: any) {
  const hasGachaCustomFields = (item: Pick<GachaItemDefinition, 'customFields'>): boolean =>
    Boolean(item.customFields && Object.keys(item.customFields).length);
  return hasGachaCustomFields;
}
