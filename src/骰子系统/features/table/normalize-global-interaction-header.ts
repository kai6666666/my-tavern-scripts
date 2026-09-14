// @ts-nocheck
/**
 * normalize-global-interaction-header.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeGlobalInteractionHeader(deps: any) {
  const normalizeGlobalInteractionHeader = (header: unknown): string =>
    String(header ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();
  return normalizeGlobalInteractionHeader;
}
