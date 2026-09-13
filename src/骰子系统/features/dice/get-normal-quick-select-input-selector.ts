// @ts-nocheck
/**
 * get-normal-quick-select-input-selector.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetNormalQuickSelectInputSelector(deps: any) {
  const getNormalQuickSelectInputSelector = (target: AttributeQuickSelectTarget): string => {
    if (target === 'skillMod') return '#dice-skill-mod';
    if (target === 'mod') return '#dice-modifier';
    return '#dice-attr-value';
  };
  return getNormalQuickSelectInputSelector;
}
