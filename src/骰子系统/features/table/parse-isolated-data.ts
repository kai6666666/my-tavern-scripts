// @ts-nocheck
/**
 * parse-isolated-data.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseIsolatedData(deps: any) {
  const parseIsolatedData = (value: unknown): Record<string, unknown> | null => {
    if (!value) return null;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object') return parsed as Record<string, unknown>;
      } catch {
        return null;
      }
      return null;
    }
    if (typeof value === 'object') return value as Record<string, unknown>;
    return null;
  };
  return parseIsolatedData;
}
