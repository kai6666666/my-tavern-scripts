// @ts-nocheck
/**
 * resolve-user-graph-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDisplayName } from '../../entities/name-alias';
export function createResolveUserGraphName(deps: any) {
  const resolveUserGraphName = (name: string): string => {
    const displayName = getDisplayName(String(name || '').trim());
    if (!displayName) return displayName;

    const avatarPrimary = deps.AvatarManager.getPrimaryName(displayName);
    if (
      deps.isUserPlaceholderKey(displayName) ||
      deps.isUserPlaceholderKey(avatarPrimary) ||
      deps.isUserCharacterName(displayName) ||
      deps.isUserCharacterName(avatarPrimary)
    ) {
      return deps.USER_NODE_KEY;
    }

    const userAliases = new Set<string>(deps.USER_PLACEHOLDER_KEYS);
    deps.USER_PLACEHOLDER_KEYS.forEach(key => {
      const aliases = deps.AvatarManager.load()[key]?.aliases || [];
      aliases.forEach(alias => {
        if (alias) userAliases.add(alias);
      });
    });

    const personaName = deps.getPersonaName();
    if (personaName) userAliases.add(getDisplayName(personaName));

    const diceCfg = deps.getDiceConfig();
    if (diceCfg.autoMergeProtagonist !== false) {
      userAliases.add('主角');
      const playerName = deps.getPlayerName();
      if (playerName) userAliases.add(getDisplayName(playerName));
    }

    const normalizedUserAliases = [...userAliases].map(alias => alias.toLowerCase());
    const candidates = [displayName, avatarPrimary, deps.NameAliasRegistry.resolve(displayName)]
      .filter(Boolean)
      .map(candidate => candidate.toLowerCase());

    if (candidates.some(candidate => normalizedUserAliases.includes(candidate))) {
      return deps.USER_NODE_KEY;
    }

    return avatarPrimary;
  };
  return resolveUserGraphName;
}
