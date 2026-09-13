// @ts-nocheck
/**
 * prepare-avatar-manager-tutorial.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createPrepareAvatarManagerTutorial(deps: any) {
  const prepareAvatarManagerTutorial = (button: Element): boolean => {
    console.info('[tut-debug] prepareAvatar entry');
    const { $ } = deps.getCore();
    const $manager = $(button).closest('.acu-avatar-manager');
    if (!$manager.length) return false;

    const $userItem = $manager.find('#acu-avatar-list-container .acu-avatar-user-item').first();
    console.info('[tut-debug] prepareAvatar manager found=', $manager.length, 'userItem=', $userItem.length);
    if (!$userItem.length) { console.info('[tut-debug] prepareAvatar: no user item -> false'); return false; }

    const $otherExpandedItems = $manager.find('#acu-avatar-list-container .acu-avatar-item.expanded').not($userItem);
    $otherExpandedItems.removeClass('expanded');
    $otherExpandedItems.find('.acu-btn-edit i').removeClass('fa-chevron-up').addClass('fa-pencil');

    if (!$userItem.hasClass('expanded')) {
      const $editButton = $userItem.find('.acu-btn-edit').first();
      if ($editButton.length) {
        $editButton.trigger('click');
      }
      if (!$userItem.hasClass('expanded')) {
        $userItem.addClass('expanded');
        $editButton.find('i').removeClass('fa-pencil').addClass('fa-chevron-up');
      }
    }

    $userItem[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    return true;
  };
  return prepareAvatarManagerTutorial;
}
