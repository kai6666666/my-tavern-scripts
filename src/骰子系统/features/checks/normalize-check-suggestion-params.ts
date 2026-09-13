// @ts-nocheck
/**
 * normalize-check-suggestion-params.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCheckSuggestionParams(deps: any) {
  const normalizeCheckSuggestionParams = (
    rawParams: CheckSuggestionRawParams,
    preset: AdvancedDicePreset,
  ): CheckSuggestionParams => {
    const normalized: CheckSuggestionParams = {};
    const aliases = preset.checkSuggestionAliases;
    const normalizeSidePrefixedKey = (rawKey: string): { key: string; valueAliasKey: string } => {
      const lowerKey = rawKey.toLowerCase();
      const sidePrefix = lowerKey.startsWith('left') ? 'left' : lowerKey.startsWith('right') ? 'right' : '';
      if (!sidePrefix) {
        const canonicalKey = aliases?.params?.[rawKey] || rawKey;
        return { key: canonicalKey, valueAliasKey: canonicalKey };
      }
      const prefixLength = sidePrefix.length;
      const stripped = rawKey.slice(prefixLength);
      if (!stripped) return { key: rawKey, valueAliasKey: rawKey };
      const normalizedStripped = stripped.charAt(0).toLowerCase() + stripped.slice(1);
      const canonicalStripped = aliases?.params?.[stripped] || aliases?.params?.[normalizedStripped] || normalizedStripped;
      const sideKey = `${sidePrefix}${canonicalStripped.charAt(0).toUpperCase()}${canonicalStripped.slice(1)}`;
      return { key: sideKey, valueAliasKey: canonicalStripped };
    };
    Object.entries(rawParams).forEach(([rawKey, rawValue]) => {
      if (rawKey === 'preset') return;
      const { key: canonicalKey, valueAliasKey } = normalizeSidePrefixedKey(rawKey);
      const valueAliases = aliases?.values?.[canonicalKey] || aliases?.values?.[valueAliasKey] || {};
      const aliasedValue = valueAliases[rawValue];
      normalized[canonicalKey] =
        aliasedValue !== undefined ? aliasedValue : deps.parseCheckSuggestionPrimitiveValue(rawValue);
    });
    return normalized;
  };
  return normalizeCheckSuggestionParams;
}
