// @ts-nocheck
/**
 * resolve-attribute-alias-name.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveAttributeAliasName(deps: any) {
  const resolveAttributeAliasName = (
    characterName: string,
    targetName: string,
    aliasCandidates: string[] = [],
  ): { name: string | null; reason?: string } => {
    const allAttrs = deps.getFullAttributesForCharacter(characterName)
      .map(attr => attr.name)
      .filter(Boolean);
    if (allAttrs.length === 0) {
      return { name: targetName || null };
    }

    const orderedCandidates = [targetName, ...aliasCandidates]
      .map(n => String(n || '').trim())
      .filter(Boolean)
      .filter((n, idx, arr) => arr.indexOf(n) === idx);
    if (orderedCandidates.length === 0) {
      return { name: null, reason: '目标属性名为空' };
    }

    for (const candidate of orderedCandidates) {
      if (allAttrs.includes(candidate)) {
        return { name: candidate };
      }
    }

    const lowerMap = new Map<string, string>();
    allAttrs.forEach(name => {
      const lower = name.toLowerCase();
      if (!lowerMap.has(lower)) lowerMap.set(lower, name);
    });
    for (const candidate of orderedCandidates) {
      const matched = lowerMap.get(candidate.toLowerCase());
      if (matched) {
        return { name: matched };
      }
    }

    const normalizedGroups = new Map<string, string[]>();
    allAttrs.forEach(name => {
      const key = deps.normalizeAttributeName(name);
      if (!key) return;
      const list = normalizedGroups.get(key) || [];
      list.push(name);
      normalizedGroups.set(key, list);
    });

    for (const candidate of orderedCandidates) {
      const normalized = deps.normalizeAttributeName(candidate);
      if (!normalized) continue;
      const matched = normalizedGroups.get(normalized) || [];
      if (matched.length === 1) {
        return { name: matched[0] };
      }
      if (matched.length > 1) {
        return {
          name: null,
          reason: `属性别名冲突: ${candidate} 可匹配 ${matched.join(', ')}`,
        };
      }
    }

    return {
      name: null,
      reason: `找不到属性: ${targetName}`,
    };
  };
  return resolveAttributeAliasName;
}
