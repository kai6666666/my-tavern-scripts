// @ts-nocheck
/**
 * format-signed-modifier.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatSignedModifier(deps: any) {
  const formatSignedModifier = (value: number): string => (value >= 0 ? `+${value}` : String(value));
  return formatSignedModifier;
}
