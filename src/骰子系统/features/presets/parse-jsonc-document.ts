// @ts-nocheck
/**
 * parse-jsonc-document.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseJsoncDocument(deps: any) {
  const parseJsoncDocument = <T>({
    text,
    emptyMessage = '请输入 JSONC 配置',
    invalidJsonMessage = '不是有效的 JSON/JSONC',
    validate,
  }: JsoncDocumentParseOptions<T>): T => {
    const trimmed = String(text || '').trim();
    if (!trimmed) throw new Error(emptyMessage);
    let parsed: unknown;
    try {
      parsed = deps.parseJsoncValue(trimmed);
    } catch {
      throw new Error(invalidJsonMessage);
    }
    return validate(parsed);
  };
  return parseJsoncDocument;
}
