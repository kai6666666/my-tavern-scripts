// @ts-nocheck
/**
 * normalize-advanced-preset-notes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeAdvancedPresetNotes(deps: any) {
  const normalizeAdvancedPresetNotes = (rawNotes: unknown): string[] => {
    if (typeof rawNotes === 'string' && rawNotes.trim()) return [rawNotes.trim()];
    if (!Array.isArray(rawNotes)) return [];
    return rawNotes.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };
  return normalizeAdvancedPresetNotes;
}
