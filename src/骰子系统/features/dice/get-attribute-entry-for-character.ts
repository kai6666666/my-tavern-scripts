// @ts-nocheck
/**
 * get-attribute-entry-for-character.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAttributeEntryForCharacter(deps: any) {
  const getAttributeEntryForCharacter = (
    characterName: string,
    attrName: string,
    aliasCandidates: string[] = [],
  ): CharacterAttributeEntry | null => {
    if (!attrName) return null;
    const resolved = deps.resolveAttributeAliasName(characterName, attrName, aliasCandidates);
    if (!resolved.name) return null;
    return deps.getFullAttributesForCharacter(characterName).find(attr => attr.name === resolved.name) || null;
  };
  return getAttributeEntryForCharacter;
}
