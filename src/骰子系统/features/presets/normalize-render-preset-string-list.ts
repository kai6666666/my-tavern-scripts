// @ts-nocheck
/**
 * normalize-render-preset-string-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeRenderPresetStringList(deps: any) {
  const normalizeRenderPresetStringList = (value: unknown, fallback: readonly string[] = []): string[] => {
    const rawItems = Array.isArray(value) ? value : fallback;
    const seen = new Set<string>();
    const result: string[] = [];
    rawItems.forEach(item => {
      const text = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!text || seen.has(text)) return;
      seen.add(text);
      result.push(text);
    });
    return result;
  };
  return normalizeRenderPresetStringList;
}
