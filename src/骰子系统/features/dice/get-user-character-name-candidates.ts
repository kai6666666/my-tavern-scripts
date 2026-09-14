// @ts-nocheck
/**
 * get-user-character-name-candidates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetUserCharacterNameCandidates(deps: any) {
  const getUserCharacterNameCandidates = (): string[] => {
    const seeds: string[] = [...deps.getUSER_PLACEHOLDER_KEYS(), '主角'];
    [deps.getPlayerName(), deps.getPersonaName(), deps.getDisplayPlayerName()].forEach(name => deps.pushUniqueNameCandidate(seeds, name));
    deps.getUSER_PLACEHOLDER_KEYS().forEach(key =>
      deps.getAvatarManualAliases(key).forEach(alias => deps.pushUniqueNameCandidate(seeds, alias)),
    );

    const candidates: string[] = [];
    seeds.forEach(seed => {
      deps.getCharacterNameCandidates(seed).forEach(candidate => deps.pushUniqueNameCandidate(candidates, candidate));
    });
    return candidates;
  };
  return getUserCharacterNameCandidates;
}
