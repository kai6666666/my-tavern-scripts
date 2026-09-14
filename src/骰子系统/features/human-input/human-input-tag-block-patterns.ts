// @ts-nocheck
/**
 * human-input-tag-block-patterns.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHumanInputTagBlockPatterns(deps: any) {
  const HUMAN_INPUT_TAG_BLOCK_PATTERNS = [
    /<meta:检定结果>[\s\S]*?<\/meta:检定结果>/gi,
    /<recall>[\s\S]*?<\/recall>/gi,
    /<supplement>[\s\S]*?<\/supplement>/gi,
  ];
  return HUMAN_INPUT_TAG_BLOCK_PATTERNS;
}
