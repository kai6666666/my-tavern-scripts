// @ts-nocheck
/**
 * resolve-quick-select-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveQuickSelectTarget(deps: any) {
  const resolveQuickSelectTarget = (
    attrName: string,
    source: CharacterAttributeSource | null | undefined,
    preset: QuickSelectCheckPresetConfig | null | undefined,
    mode: 'normal' | 'contest',
  ): AttributeQuickSelectTarget => {
    const activeAttributePreset = deps.getAttributePresetManager().getActivePreset() as AttributePresetConfig | null;
    const mappedByAttributePreset = deps.getAttributePresetMappedTarget(activeAttributePreset, attrName, source);
    const mappedByCheckPreset = mappedByAttributePreset || deps.getAdvancedPresetMappedTarget(preset, attrName);
    const target = mappedByCheckPreset || 'attribute';
    return deps.isQuickSelectTargetAvailable(target, preset, mode) ? target : 'attribute';
  };
  return resolveQuickSelectTarget;
}
