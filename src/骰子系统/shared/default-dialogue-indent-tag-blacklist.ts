// @ts-nocheck
/**
 * default-dialogue-indent-tag-blacklist.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDefaultDialogueIndentTagBlacklist(deps: any) {
  const DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST = [
    'summary',
    'tucao',
    'JSONPatch',
    'Analysis',
    'UpdateVariable',
    'StatusBlock',
    'StatusPlaceHolderImpl',
    'options',
    'meta:检定结果',
    '摘要',
    'image',
    'script',
    'placeholder',
    'think',
    'thought',
    'thinking',
  ] as const;
  return DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST;
}
