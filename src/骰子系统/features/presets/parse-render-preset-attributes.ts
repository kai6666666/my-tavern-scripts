// @ts-nocheck
/**
 * parse-render-preset-attributes.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseRenderPresetAttributes(deps: any) {
  const parseRenderPresetAttributes = (rawStr: string, preset: RenderPreset): CharacterAttributeEntry[] => {
    const rules = preset.rules.attributes;
    if (!rules.enabled) return [];
    const trimmed = String(rawStr || '').trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return rules.parseJsonObject ? deps.parseAttributeString(trimmed) : [];
    }
    return rules.parseKeyValuePairs ? deps.parseAttributeString(trimmed) : [];
  };
  return parseRenderPresetAttributes;
}
