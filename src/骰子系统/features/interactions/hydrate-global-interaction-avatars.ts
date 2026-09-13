// @ts-nocheck
/**
 * hydrate-global-interaction-avatars.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createHydrateGlobalInteractionAvatars(deps: any) {
  const hydrateGlobalInteractionAvatars = ($panel: JQuery): void => {
    const { $ } = deps.getCore();
    $panel.find<HTMLElement>('.acu-global-interaction-avatar[data-avatar-name]').each(function () {
      const $avatar = $(this);
      const rowTitle = deps.safeDecodeURIComponent($avatar.attr('data-avatar-name') || '').trim();
      if (!rowTitle) return;
      const lookupNames = deps.getGlobalInteractionAvatarLookupNames(rowTitle);

      void Promise.all(lookupNames.map(name => deps.AvatarManager.getAsync(name).then(avatarUrl => ({ name, avatarUrl }))))
        .then(avatarUrl => {
          const matched = avatarUrl.find(item => Boolean(item.avatarUrl));
          if (!matched?.avatarUrl) return;
          const cssImageUrl = deps.formatCssImageUrl(matched.avatarUrl, { allowInternalObjectUrl: true });
          if (!cssImageUrl) return;
          $avatar
            .css({
              'background-image': cssImageUrl,
              'background-size': `${deps.AvatarManager.getScale(matched.name)}%`,
              'background-position': `${deps.AvatarManager.getOffsetX(matched.name)}% ${deps.AvatarManager.getOffsetY(matched.name)}%`,
            })
            .empty();
        })
        .catch(error => {
          console.warn('[DICE] 交互总览头像加载失败:', error);
        });
    });
  };
  return hydrateGlobalInteractionAvatars;
}
