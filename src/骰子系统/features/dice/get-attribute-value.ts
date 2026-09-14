// @ts-nocheck
/**
 * get-attribute-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAttributeValue(deps: any) {
  const getAttributeValue = (characterName, attrName, aliasCandidates: string[] = []) => {
    const found = deps.getAttributeEntryForCharacter(characterName, attrName, aliasCandidates);
    return found ? found.value : null;
  };
  return getAttributeValue;
}
