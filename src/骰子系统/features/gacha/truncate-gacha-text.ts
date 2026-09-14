// @ts-nocheck
/**
 * truncate-gacha-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createTruncateGachaText(deps: any) {
  const truncateGachaText = (value: unknown, maxLength: number): string =>
    Array.from(String(value || ''))
      .slice(0, maxLength)
      .join('');
  return truncateGachaText;
}
