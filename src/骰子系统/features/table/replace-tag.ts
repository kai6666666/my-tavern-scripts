// @ts-nocheck
/**
 * replace-tag.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReplaceTag(deps: any) {
  const replaceTag = (text: string, tag: string, content: string): string => {
    // 使用 [\s\S]* 匹配任意字符（包括换行）
    const regex = new RegExp(`<${tag}>[\\s\\S]*?</${tag}>`, 'g');
    return text.replace(regex, `<${tag}>\n${content}\n</${tag}>`);
  };
  return replaceTag;
}
