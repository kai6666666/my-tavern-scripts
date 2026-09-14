// @ts-nocheck
/**
 * read-advanced-preset-context-tags.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadAdvancedPresetContextTags(deps: any) {
  const readAdvancedPresetContextTags = (value: unknown): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };
  return readAdvancedPresetContextTags;
}
