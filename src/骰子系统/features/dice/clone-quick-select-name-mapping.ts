// @ts-nocheck
/**
 * clone-quick-select-name-mapping.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneQuickSelectNameMapping(deps: any) {
  const cloneQuickSelectNameMapping = (
    mapping: Partial<Record<AttributeQuickSelectTarget, string[]>> | undefined,
  ): Partial<Record<AttributeQuickSelectTarget, string[]>> => {
    const result: Partial<Record<AttributeQuickSelectTarget, string[]>> = {};
    if (!mapping) return result;
    (['attribute', 'skillMod', 'mod'] as AttributeQuickSelectTarget[]).forEach(target => {
      const names = mapping[target];
      if (Array.isArray(names)) {
        result[target] = names.map(name => String(name).trim()).filter(Boolean);
      }
    });
    return result;
  };
  return cloneQuickSelectNameMapping;
}
