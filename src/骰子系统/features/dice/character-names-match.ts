// @ts-nocheck
/**
 * character-names-match.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createCharacterNamesMatch(deps: any) {
  const characterNamesMatch = (storedName: unknown, lookupName: unknown): boolean => {
    const lookupRaw = String(lookupName ?? '').trim();
    if (!lookupRaw) return deps.isUserCharacterName(storedName);

    const storedIsUser = deps.isUserCharacterName(storedName);
    const lookupIsUser = deps.isUserCharacterName(lookupRaw);
    if (storedIsUser || lookupIsUser) return storedIsUser && lookupIsUser;

    const storedKeys = new Set(
      deps.getCharacterNameCandidates(storedName).map(deps.normalizeCharacterNameForCompare).filter(Boolean),
    );
    return deps.getCharacterNameCandidates(lookupRaw).some(candidate => {
      const key = deps.normalizeCharacterNameForCompare(candidate);
      return Boolean(key) && storedKeys.has(key);
    });
  };
  return characterNamesMatch;
}
