// @ts-nocheck
/**
 * is-gacha-target-table-alias-match.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createIsGachaTargetTableAliasMatch(deps: any) {
  const isGachaTargetTableAliasMatch = (candidate: unknown, targetTable: string): boolean => {
    const normalizedCandidate = deps.normalizeDiffText(candidate);
    const normalizedTarget = deps.normalizeDiffText(targetTable);
    if (!normalizedCandidate || !normalizedTarget) return false;
    return normalizedCandidate === normalizedTarget || normalizedCandidate.toLowerCase() === normalizedTarget.toLowerCase();
  };
  return isGachaTargetTableAliasMatch;
}
