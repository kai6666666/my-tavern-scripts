// @ts-nocheck
/**
 * clone-render-preset-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCloneRenderPresetRules(deps: any) {
  const cloneRenderPresetRules = (rules: RenderPresetRules): RenderPresetRules =>
    JSON.parse(JSON.stringify(rules)) as RenderPresetRules;
  return cloneRenderPresetRules;
}
