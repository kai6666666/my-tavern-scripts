// @ts-nocheck
/**
 * apply-attribute-quick-select-defaults.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createApplyAttributeQuickSelectDefaults(deps: any) {
  const applyAttributeQuickSelectDefaults = (preset: AttributePresetConfig): boolean => {
    const before = JSON.stringify(preset.quickSelect ?? null);
    preset.quickSelect = deps.normalizeAttributeQuickSelectConfig(preset.quickSelect);
    return before !== JSON.stringify(preset.quickSelect);
  };
  return applyAttributeQuickSelectDefaults;
}
