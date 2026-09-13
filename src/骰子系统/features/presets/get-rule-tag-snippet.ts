// @ts-nocheck
/**
 * get-rule-tag-snippet.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetRuleTagSnippet(deps: any) {
  const getRuleTagSnippet = (note: string, tag: string): string => {
    const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matched = note.match(new RegExp(`<${safeTag}>[\\s\\S]*?</${safeTag}>`));
    return (matched?.[0] || '').slice(0, 500);
  };
  return getRuleTagSnippet;
}
