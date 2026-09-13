// @ts-nocheck
/**
 * get-gm-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { ACTION_ICON_MAP } from './action-icon-map';
import { DEFAULT_GM_CONFIG } from '../../shared/defaults-config';
import { STORAGE_KEY_GM_CONFIG } from '../../shared/storage-keys';
import { Store } from '../../shared/storage/store';
export function createGetGMConfig(deps: any) {
  const getGMConfig = () => {
    const baseConfig = Store.get(STORAGE_KEY_GM_CONFIG, DEFAULT_GM_CONFIG);

    // 检查用户是否明确禁用了所有交互规则
    const activePresetId = deps.ActionPresetManager.getActivePresetId();
    if (activePresetId === '__none__') {
      return {
        ...baseConfig,
        action_rules_disabled: true, // 标记：用户明确禁用了所有规则
      };
    }

    // 注入用户交互规则预设
    const activePreset = deps.ActionPresetManager.getActivePreset();
    if (activePreset && activePreset.rules && activePreset.rules.length > 0) {
      // 转换预设格式为 custom_action_groups 格式
      const customActionGroups = activePreset.rules.map(rule => ({
        table_keywords: rule.table_keywords || [],
        actions: (rule.actions || []).map(action => ({
          label: action.label,
          icon: action.icon || ACTION_ICON_MAP[action.label] || 'fa-circle',
          type: 'prompt',
          template: action.template || `<user>对{Name}执行互动:${action.label}。`,
          auto_send: false,
        })),
      }));

      return {
        ...baseConfig,
        custom_action_groups: customActionGroups,
      };
    }

    return baseConfig;
  };
  return getGMConfig;
}
