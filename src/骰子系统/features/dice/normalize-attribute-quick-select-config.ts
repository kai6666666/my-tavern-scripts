// @ts-nocheck
/**
 * normalize-attribute-quick-select-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAttributeQuickSelectConfig(deps: any) {
  const normalizeAttributeQuickSelectConfig = (
    config: AttributeQuickSelectConfig | null | undefined,
  ): NormalizedAttributeQuickSelectConfig => ({
    baseTarget: deps.isAttributeQuickSelectTarget(config?.baseTarget) ? config.baseTarget : 'attribute',
    specialTarget: deps.isAttributeQuickSelectTarget(config?.specialTarget) ? config.specialTarget : 'attribute',
    fallbackTarget: deps.isAttributeQuickSelectTarget(config?.fallbackTarget) ? config.fallbackTarget : 'attribute',
    nameTargetMapping: deps.cloneQuickSelectNameMapping(config?.nameTargetMapping),
  });
  return normalizeAttributeQuickSelectConfig;
}
