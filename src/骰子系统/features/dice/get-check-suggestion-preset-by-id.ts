// @ts-nocheck
/**
 * get-check-suggestion-preset-by-id.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCheckSuggestionPresetById(deps: any) {
  const getCheckSuggestionPresetById = (presetId: string | null | undefined): AdvancedDicePreset | null => {
    const presets = deps.getAdvancedDicePresetManager().getAllPresets() as AdvancedDicePreset[];
    const fallback = presets.find(preset => preset.id === 'coc7_check') || null;
    if (!presetId) return deps.getAdvancedDicePresetManager().getActivePreset() || fallback;
    return presets.find(preset => preset.id === presetId) || fallback;
  };
  return getCheckSuggestionPresetById;
}
