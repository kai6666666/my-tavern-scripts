// @ts-nocheck
/**
 * normalize-render-preset-alias-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeRenderPresetAliasMap(deps: any) {
  const normalizeRenderPresetAliasMap = (value: unknown, fallback: Record<string, string>): Record<string, string> => {
    const source = deps.isRecordValue(value) ? value : fallback;
    const aliases: Record<string, string> = {};
    Object.entries(source).forEach(([rawKey, rawValue]) => {
      const key = String(rawKey || '').trim();
      const alias = typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue).trim() : '';
      if (key && alias) aliases[key] = alias;
    });
    return aliases;
  };
  return normalizeRenderPresetAliasMap;
}
