// @ts-nocheck
/**
 * get-attribute-rule-preset-by-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DEFAULT_VIRTUAL_PRESET } from '../../shared/defaults-config';
export function createGetAttributeRulePresetById(deps: any) {
  const getAttributeRulePresetById = (presetId: string | null | undefined): AttributeRulePresetConfig => {
    if (presetId === null || presetId === undefined || presetId === '__default__') {
      return DEFAULT_VIRTUAL_PRESET;
    }
    const found = (deps.getAttributePresetManager().getAllPresets() as AttributeRulePresetConfig[]).find(
      preset => preset.id === presetId,
    );
    return found || DEFAULT_VIRTUAL_PRESET;
  };
  return getAttributeRulePresetById;
}
