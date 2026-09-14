// @ts-nocheck
/**
 * parse-jsonc-record.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseJsoncRecord(deps: any) {
  const parseJsoncRecord = (jsonText: string, label: string): Record<string, unknown> => {
    return deps.parseJsoncDocument({
      text: jsonText,
      invalidJsonMessage: `${label}不是有效的 JSON/JSONC`,
      validate: parsed => {
        if (!deps.isRecordValue(parsed)) {
          throw new Error(`${label}必须是对象`);
        }
        return parsed;
      },
    });
  };
  return parseJsoncRecord;
}
