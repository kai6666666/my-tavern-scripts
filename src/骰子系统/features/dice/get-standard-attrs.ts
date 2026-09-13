// @ts-nocheck
/**
 * get-standard-attrs.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetStandardAttrs(deps: any) {
  const getStandardAttrs = () => {
    const preset = deps.getAttributePresetManager().getActivePreset();
    if (preset && preset.baseAttributes) {
      return preset.baseAttributes.map(attr => attr.name);
    }
    return deps.getSTANDARD_ATTRS();
  };
  return getStandardAttrs;
}
