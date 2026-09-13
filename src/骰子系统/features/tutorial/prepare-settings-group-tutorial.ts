// @ts-nocheck
/**
 * prepare-settings-group-tutorial.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
import type { TutorialScope } from '../tutorial';
export function createPrepareSettingsGroupTutorial(deps: any) {
  const prepareSettingsGroupTutorial = (scope: TutorialScope, button: Element): boolean => {
    const groupId = deps.SETTINGS_GROUP_TUTORIAL_MAP[scope];
    console.info('[tut-debug] prepareSettings entry scope=', scope, 'groupId=', groupId);
    if (!groupId) { console.info('[tut-debug] prepareSettings: no groupId -> true'); return true; }

    const { $ } = deps.getCore();
    const $dialog = $(button).closest('.acu-settings-dialog');
    console.info('[tut-debug] prepareSettings dialog found=', $dialog.length);
    if (!$dialog.length) { console.info('[tut-debug] prepareSettings: no dialog -> false'); return false; }

    const $group = $dialog.find(`.acu-settings-group[data-group="${groupId}"]`).first();
    console.info('[tut-debug] prepareSettings group found=', $group.length, 'collapsed=', $group.hasClass('collapsed'));
    if (!$group.length) { console.info('[tut-debug] prepareSettings: no group -> false'); return false; }

    const $body = $group.find('.acu-settings-group-body').first();
    const $chevron = $group.find('.acu-group-chevron').first();
    if ($group.hasClass('collapsed')) {
      $group.removeClass('collapsed');
      $body.stop(true, true).show().css('height', '').removeClass('acu-animating');
      $chevron.removeClass('fa-chevron-right').addClass('fa-chevron-down');

      const savedGroups = Store.get('acu_settings_expanded', ['appearance']);
      const expandedGroups = Array.isArray(savedGroups) ? savedGroups.map(String) : ['appearance'];
      if (!expandedGroups.includes(groupId)) {
        Store.set('acu_settings_expanded', [...expandedGroups, groupId]);
      }
    }

    $group[0].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    return true;
  };
  return prepareSettingsGroupTutorial;
}
