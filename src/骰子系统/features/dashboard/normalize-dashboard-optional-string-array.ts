// @ts-nocheck
/**
 * normalize-dashboard-optional-string-array.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeDashboardOptionalStringArray(deps: any) {
  const normalizeDashboardOptionalStringArray = (value: unknown, label: string): string[] => {
    if (!Array.isArray(value)) {
      throw new Error(`${label} 必须是字符串数组`);
    }
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };
  return normalizeDashboardOptionalStringArray;
}
