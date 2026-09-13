// @ts-nocheck
/**
 * parse-attribute-string.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseAttributeString(deps: any) {
  const parseAttributeString = str => {
    if (!str) return [];
    const results: CharacterAttributeEntry[] = [];
    const rawStr = String(str).trim();

    // 尝试解析 JSON 格式 {"属性名":数值, ...}
    if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
      try {
        const jsonObj = JSON.parse(rawStr);
        for (const key in jsonObj) {
          const val = jsonObj[key];
          if (typeof val === 'number') {
            results.push({ name: key, value: val });
          } else if (typeof val === 'string' && /^\d+$/.test(val)) {
            results.push({ name: key, value: parseInt(val, 10) });
          }
        }
        if (results.length > 0) return results;
      } catch (e) {
        // JSON 解析失败，继续用原有逻辑
      }
    }

    // 原有逻辑：解析 "属性名:数值; 属性名:数值" 格式
    const parts = rawStr.split(/[,;，；\s]+/);
    for (const part of parts) {
      const match = part.match(/^"?([\u4e00-\u9fa5a-zA-Z_]+)"?[:\s：]\s*"?(-?\d+)"?/);
      if (match) {
        results.push({ name: match[1], value: parseInt(match[2], 10) });
      }
    }
    return results;
  };
  return parseAttributeString;
}
