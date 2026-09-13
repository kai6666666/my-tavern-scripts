// @ts-nocheck
/**
 * get-advanced-preset-mapped-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAdvancedPresetMappedTarget(deps: any) {
  const getAdvancedPresetMappedTarget = (
    preset: QuickSelectCheckPresetConfig | null | undefined,
    attrName: string,
  ): AttributeQuickSelectTarget | null => {
    const mapping = preset?.attrTargetMapping || {};
    for (const [target, names] of Object.entries(mapping)) {
      if (!deps.isAttributeQuickSelectTarget(target)) continue;
      if (Array.isArray(names) && names.includes(attrName)) return target;
    }
    return null;
  };
  return getAdvancedPresetMappedTarget;
}
