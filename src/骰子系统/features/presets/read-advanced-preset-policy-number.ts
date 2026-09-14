// @ts-nocheck
/**
 * read-advanced-preset-policy-number.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadAdvancedPresetPolicyNumber(deps: any) {
  const readAdvancedPresetPolicyNumber = (
    context: Record<string, string | number | boolean | RollResult>,
    key: string,
    fallback: number,
  ): number => {
    const rawValue = context[key];
    if (typeof rawValue === 'number' && Number.isFinite(rawValue)) return rawValue;
    if (typeof rawValue === 'boolean') return rawValue ? 1 : 0;
    if (typeof rawValue === 'string') {
      const parsed = Number(rawValue);
      if (Number.isFinite(parsed)) return parsed;
    }
    return fallback;
  };
  return readAdvancedPresetPolicyNumber;
}
