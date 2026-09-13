// @ts-nocheck
/**
 * is-attribute-quick-select-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsAttributeQuickSelectTarget(deps: any) {
  const isAttributeQuickSelectTarget = (value: unknown): value is AttributeQuickSelectTarget =>
    value === 'attribute' || value === 'skillMod' || value === 'mod';
  return isAttributeQuickSelectTarget;
}
