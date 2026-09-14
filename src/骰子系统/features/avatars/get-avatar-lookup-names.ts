// @ts-nocheck
/**
 * get-avatar-lookup-names.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetAvatarLookupNames(deps: any) {
  const getAvatarLookupNames = (name: unknown): string[] => {
    const originalName = String(name || '').trim();
    const names = originalName ? [originalName] : [];
    const playerName = String(deps.getPlayerName() || '').trim();
    const personaName = String(deps.getPersonaName() || '').trim();
    const lowerName = originalName.toLowerCase();
    const autoMergeProtagonist = deps.getDiceConfig().autoMergeProtagonist !== false;
    const isUserAvatar =
      deps.USER_AVATAR_LOOKUP_KEYS.some(key => key.toLowerCase() === lowerName) ||
      (autoMergeProtagonist && originalName === '主角') ||
      (autoMergeProtagonist && Boolean(playerName) && originalName === playerName) ||
      (personaName ? originalName === personaName : false);

    if (isUserAvatar) {
      names.push(...deps.USER_AVATAR_LOOKUP_KEYS);
    }

    return [...new Set(names.filter(Boolean))];
  };
  return getAvatarLookupNames;
}
