// @ts-nocheck
/**
 * get-global-interaction-avatar-lookup-names.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetGlobalInteractionAvatarLookupNames(deps: any) {
  const getGlobalInteractionAvatarLookupNames = (rowTitle: string): string[] => {
    const displayName = deps.replaceUserPlaceholders(rowTitle);
    const names = [displayName.trim(), rowTitle.trim()];
    if (/^[\u4e00-\u9fa5]{3,}$/.test(displayName.trim())) {
      names.push(displayName.trim().slice(0, 2));
    }
    return [...new Set(names.filter(Boolean))];
  };
  return getGlobalInteractionAvatarLookupNames;
}
