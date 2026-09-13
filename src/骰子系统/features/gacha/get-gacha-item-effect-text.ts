// @ts-nocheck
/**
 * get-gacha-item-effect-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaItemDefinition } from '../../entities/gacha-items';
export function createGetGachaItemEffectText(deps: any) {
  const getGachaItemEffectText = (
    item: Pick<GachaItemDefinition, 'effect' | 'description' | 'customFields'>,
  ): string =>
    String(item.effect || deps.getGachaNamedCustomField(item, ['效果', '作用', '能力', '特效']) || item.description || '').trim();
  return getGachaItemEffectText;
}
