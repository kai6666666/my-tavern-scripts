// @ts-nocheck
/**
 * normalize-dashboard-keyword-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDashboardKeywordArray(deps: any) {
  const normalizeDashboardKeywordArray = (value: unknown, label: string): string[] => {
    if (!Array.isArray(value)) {
      throw new Error(`${label} 必须是字符串数组`);
    }
    const keywords = value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
    if (keywords.length === 0) {
      throw new Error(`${label} 至少需要一个关键词`);
    }
    return keywords;
  };
  return normalizeDashboardKeywordArray;
}
