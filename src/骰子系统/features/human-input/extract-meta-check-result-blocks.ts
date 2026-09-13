// @ts-nocheck
/**
 * extract-meta-check-result-blocks.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExtractMetaCheckResultBlocks(deps: any) {
  const extractMetaCheckResultBlocks = (text: unknown): string[] =>
    Array.from(String(text ?? '').matchAll(deps.createMetaCheckResultRegex()))
      .map(match => match[0])
      .filter(Boolean);
  return extractMetaCheckResultBlocks;
}
