// @ts-nocheck
/**
 * normalize-render-preset-tag-filter-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeRenderPresetTagFilterList(deps: any) {
  const normalizeRenderPresetTagFilterList = (value: unknown, fallback: readonly string[] = []): string[] => {
    const rawItems = typeof value === 'string' ? value.split(/[,，;；\n]/) : Array.isArray(value) ? value : fallback;
    const seen = new Set<string>();
    const result: string[] = [];
    rawItems.forEach(item => {
      let text = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!text) return;
      if (text.startsWith('<') && text.endsWith('>')) {
        text = text
          .slice(1, -1)
          .replace(/^\/\s*/, '')
          .replace(/\/\s*$/, '')
          .trim();
        text = text.split(/\s+/)[0] || '';
      }
      if (!text) return;
      const dedupeKey = text.toLocaleLowerCase();
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      result.push(text);
    });
    return result;
  };
  return normalizeRenderPresetTagFilterList;
}
