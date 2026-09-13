// @ts-nocheck
/**
 * get-attributes-for-character.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAttributesForCharacter(deps: any) {
  const getAttributesForCharacter = characterName => {
    return deps.getFullAttributesForCharacter(characterName).map(attr => attr.name);
  };
  return getAttributesForCharacter;
}
