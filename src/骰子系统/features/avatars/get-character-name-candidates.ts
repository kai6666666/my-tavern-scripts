// @ts-nocheck
/**
 * get-character-name-candidates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { getDisplayName, parseCharacterName } from '../../entities/name-alias';
export function createGetCharacterNameCandidates(deps: any) {
  const getCharacterNameCandidates = (name: unknown, includeResolved = true): string[] => {
    const rawName = String(name ?? '').trim();
    if (!rawName) return [];

    const candidates: string[] = [];
    const addParsedName = (value: string): void => {
      const parsed = parseCharacterName(value);
      deps.pushUniqueNameCandidate(candidates, value);
      deps.pushUniqueNameCandidate(candidates, parsed.displayName);
      parsed.aliases.forEach(alias => deps.pushUniqueNameCandidate(candidates, alias));
    };

    addParsedName(rawName);

    const replacedName = deps.replaceUserPlaceholders(rawName);
    if (typeof replacedName === 'string' && replacedName !== rawName) {
      addParsedName(replacedName);
    }

    const displayName = getDisplayName(rawName);
    const replacedDisplayName = deps.replaceUserPlaceholders(displayName);
    if (typeof replacedDisplayName === 'string' && replacedDisplayName !== displayName) {
      addParsedName(replacedDisplayName);
    }

    deps.getAvatarManualAliases(rawName).forEach(alias => addParsedName(alias));
    if (displayName !== rawName) {
      deps.getAvatarManualAliases(displayName).forEach(alias => addParsedName(alias));
    }

    if (includeResolved) {
      const resolvedName = deps.NameAliasRegistry.resolve(rawName);
      if (resolvedName && resolvedName !== rawName) {
        addParsedName(resolvedName);
      }
    }

    return candidates;
  };
  return getCharacterNameCandidates;
}
