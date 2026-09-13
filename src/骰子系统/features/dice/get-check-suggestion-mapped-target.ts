// @ts-nocheck
/**
 * get-check-suggestion-mapped-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetCheckSuggestionMappedTarget(deps: any) {
  const getCheckSuggestionMappedTarget = (
    preset: AdvancedDicePreset,
    attrName: string,
    attrSource?: CharacterAttributeSource,
  ): AttributeQuickSelectTarget => {
    return deps.resolveQuickSelectTarget(attrName, attrSource, preset, 'normal');
  };
  return getCheckSuggestionMappedTarget;
}
