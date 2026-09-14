// @ts-nocheck
/**
 * is-user-character-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsUserCharacterName(deps: any) {
  const isUserCharacterName = (name: unknown): boolean => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return true;

    const userKeys = new Set(deps.getUserCharacterNameCandidates().map(deps.normalizeCharacterNameForCompare).filter(Boolean));
    return deps.getCharacterNameCandidates(rawName).some(candidate => {
      const key = deps.normalizeCharacterNameForCompare(candidate);
      return Boolean(key) && userKeys.has(key);
    });
  };
  return isUserCharacterName;
}
