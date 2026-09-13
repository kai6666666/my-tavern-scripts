// @ts-nocheck
/**
 * parse-relationship-string.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseRelationshipString(deps: any) {
  const parseRelationshipString = str => {
    if (!str) return [];
    const results = [];
    const rawStr = String(str).trim();

    // 按分号分割
    const parts = rawStr.split(/[;；]/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      // 推荐格式: "与人名:关系" 或 "与人名：关系"
      const colonMatch = trimmed.match(/^与?(.+?)[:\：](.+)$/);
      if (colonMatch) {
        const name = colonMatch[1].trim();
        const relation = colonMatch[2].trim();
        if (name && relation) {
          results.push({ name: name, relation: relation });
          continue;
        }
      }

      // 兼容旧式格式: "人名(关系)" 或 "人名（关系）"
      const parenMatch = trimmed.match(/^([^(（]+)[(（]([^)）]+)[)）]$/);
      if (parenMatch) {
        results.push({ name: parenMatch[1].trim(), relation: parenMatch[2].trim() });
        continue;
      }

      // 都不匹配，整个作为人名
      if (trimmed.length > 0) {
        results.push({ name: trimmed, relation: '' });
      }
    }
    return results;
  };
  return parseRelationshipString;
}
