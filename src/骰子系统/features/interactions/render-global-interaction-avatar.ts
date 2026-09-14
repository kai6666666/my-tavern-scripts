// @ts-nocheck
/**
 * render-global-interaction-avatar.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderGlobalInteractionAvatar(deps: any) {
  const renderGlobalInteractionAvatar = (rowTitle: string): string => {
    const displayName = deps.replaceUserPlaceholders(rowTitle);
    const lookupNames = deps.getGlobalInteractionAvatarLookupNames(rowTitle);
    // 角色交互卡片必须继续使用 AvatarManager，禁止在这条路径调用自定义表名图标解析。
    const matchedLookupName = lookupNames.find(name => Boolean(deps.AvatarManager.get(name))) || displayName;
    const avatarUrl = deps.AvatarManager.get(matchedLookupName) || '';
    const avatarStyle = deps.escapeHtml(
      deps.buildAvatarBackgroundStyle(
        avatarUrl,
        deps.AvatarManager.getOffsetX(matchedLookupName),
        deps.AvatarManager.getOffsetY(matchedLookupName),
        deps.AvatarManager.getScale(matchedLookupName),
      ),
    );
    const fallbackText = displayName.trim().charAt(0) || '?';
    return `<div class="acu-global-interaction-avatar" data-avatar-name="${deps.safeEncodeURIComponent(rowTitle)}" title="${deps.escapeHtml(displayName)}" aria-label="${deps.escapeHtml(displayName)}" style="${avatarStyle}">${avatarStyle ? '' : `<span>${deps.escapeHtml(fallbackText)}</span>`}</div>`;
  };
  return renderGlobalInteractionAvatar;
}
