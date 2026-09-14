// @ts-nocheck
/**
 * sync-host-regenerate-button-visibility.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DICE_ROOT_SELECTOR, HOST_REGENERATE_BUTTON_SELECTOR, HOST_REGENERATE_HIDDEN_CLASS } from '../../shared/constants';
export function createSyncHostRegenerateButtonVisibility(deps: any) {
  const syncHostRegenerateButtonVisibility = ($root?: JQuery<HTMLElement>): void => {
    const { $ } = deps.getCore();
    const $currentRoot = $root && $root.length ? $root : $(DICE_ROOT_SELECTOR).last();
    const $panel = deps.getDataAreaForRoot($currentRoot);
    const shouldHideRegenerate = Boolean($currentRoot.length && $panel.length && $panel.hasClass('visible'));
    const $hostMessage = shouldHideRegenerate ? deps.getPanelHostMessage($currentRoot) : $();
    const $markedMessages = $(`#chat .mes.${HOST_REGENERATE_HIDDEN_CLASS}`);

    if ($hostMessage.length) {
      $markedMessages.not($hostMessage).removeClass(HOST_REGENERATE_HIDDEN_CLASS);
    } else {
      $markedMessages.removeClass(HOST_REGENERATE_HIDDEN_CLASS);
    }

    if (
      !shouldHideRegenerate ||
      !$hostMessage.length ||
      !$hostMessage.find(HOST_REGENERATE_BUTTON_SELECTOR).length
    ) {
      return;
    }

    $hostMessage.addClass(HOST_REGENERATE_HIDDEN_CLASS);
  };
  return syncHostRegenerateButtonVisibility;
}
