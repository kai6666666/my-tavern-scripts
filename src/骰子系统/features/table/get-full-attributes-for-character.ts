// @ts-nocheck
/**
 * get-full-attributes-for-character.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetFullAttributesForCharacter(deps: any) {
  const getFullAttributesForCharacter = (
    characterName,
    dataOverride?: Record<string, { name: string; content: (string | number | null)[][] }>,
  ): CharacterAttributeEntry[] => {
    const rawData = (dataOverride || deps.getCachedRawData() || deps.getTableData()) as DiceRawData | null;
    const lookup = deps.findCharacterAttributeRow(characterName, rawData);
    if (!lookup) return [];

    const attrs: CharacterAttributeEntry[] = [];
    const row = lookup.sheet.content[lookup.rowIndex] || [];
    const { baseColIndex, specialColIndex } = deps.findPrimaryAttributeColumns(lookup.headers);
    deps.findAttributeColumnIndices(lookup.headers).forEach(idx => {
      const parsed = deps.parseAttributeString(row[idx] || '');
      parsed.forEach(attr => {
        if (!attrs.some(existing => existing.name === attr.name)) {
          const source: CharacterAttributeSource =
            idx === baseColIndex ? 'base' : idx === specialColIndex ? 'special' : 'generic';
          attrs.push({ ...attr, source });
        }
      });
    });
    return attrs;
  };
  return getFullAttributesForCharacter;
}
