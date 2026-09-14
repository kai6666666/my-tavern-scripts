// @ts-nocheck
/**
 * normalize-interaction-label.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeInteractionLabel(deps: any) {
  const normalizeInteractionLabel = (label: string): string => label.trim().toLowerCase();
  return normalizeInteractionLabel;
}
