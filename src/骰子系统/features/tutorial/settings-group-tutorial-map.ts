// @ts-nocheck
/**
 * settings-group-tutorial-map.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { TutorialScope } from '../tutorial';
export function createSettingsGroupTutorialMap(deps: any) {
  const SETTINGS_GROUP_TUTORIAL_MAP: Partial<Record<TutorialScope, string>> = {
    settingsAppearance: 'appearance',
    settingsLayout: 'layout',
    settingsPosition: 'position',
    settingsOptions: 'position',
    settingsTables: 'position',
    settingsDicePresets: 'dicePresets',
    settingsAdvanced: 'advanced',
  };
  return SETTINGS_GROUP_TUTORIAL_MAP;
}
