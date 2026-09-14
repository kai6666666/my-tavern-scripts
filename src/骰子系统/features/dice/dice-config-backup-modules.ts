// @ts-nocheck
/**
 * dice-config-backup-modules.ts
 * Feature-Sliced 模块（数据常量）。
 */
import { DATA_VALIDATION_DEPRECATED_META } from '../validation/data-validation-deprecated-meta';
import { STORAGE_KEY_UI_CONFIG, STORAGE_KEY_TABLE_ORDER, STORAGE_KEY_ACTION_ORDER, STORAGE_KEY_IS_COLLAPSED, STORAGE_KEY_OPTIONS_COLLAPSED, STORAGE_KEY_TABLE_HEIGHTS, STORAGE_KEY_TABLE_STYLES, STORAGE_KEY_HIDDEN_TABLES, STORAGE_KEY_REVERSE_TABLES, STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS, STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_LAST_PRESET, STORAGE_KEY_ADVANCED_PRESETS, STORAGE_KEY_ACTIVE_ADVANCED_PRESET, STORAGE_KEY_BUILTIN_PRESET_VISIBILITY, STORAGE_KEY_BUILTIN_PRESET_ORDER, STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_ACTIVE_RENDER_PRESET, STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET, STORAGE_KEY_PRESETS, STORAGE_KEY_ACTIVE_PRESET, STORAGE_KEY_VALIDATION_ENABLED, STORAGE_KEY_VALIDATION_MODE, STORAGE_KEY_VALIDATION_RULES, STORAGE_KEY_REGEX_PRESETS, STORAGE_KEY_REGEX_RULES, STORAGE_KEY_REGEX_ACTIVE_PRESET, STORAGE_KEY_REGEX_ENABLED, STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_MAP_FOCUS, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, STORAGE_KEY_GACHA_POOL_SETTINGS, STORAGE_KEY_GACHA_SETTINGS_POOL_TAG, STORAGE_KEY_GACHA_ITEM_SETTINGS, STORAGE_KEY_GACHA_ACTIVE_POOL_TAG, STORAGE_KEY_GACHA_SHARD_SHOP_RARITY } from '../../shared/storage-keys';
import { DICE_CONFIG_BACKUP_SETTINGS_EXPANDED_KEY } from './dice-config-backup-settings-expanded-key';

export const DICE_CONFIG_BACKUP_MODULES: DiceConfigBackupModuleDefinition[] = [
    {
      id: 'uiLayout',
      name: '界面外观与布局',
      description: '主题、布局、表格顺序、高度、显示与隐藏、倒序与折叠状态。',
      storageKeys: [
        STORAGE_KEY_UI_CONFIG,
        STORAGE_KEY_TABLE_ORDER,
        STORAGE_KEY_ACTION_ORDER,
        STORAGE_KEY_IS_COLLAPSED,
        STORAGE_KEY_OPTIONS_COLLAPSED,
        STORAGE_KEY_TABLE_HEIGHTS,
        STORAGE_KEY_TABLE_STYLES,
        STORAGE_KEY_HIDDEN_TABLES,
        STORAGE_KEY_REVERSE_TABLES,
        STORAGE_KEY_GLOBAL_INTERACTION_COLLAPSED_SECTIONS,
        DICE_CONFIG_BACKUP_SETTINGS_EXPANDED_KEY,
      ],
    },
    {
      id: 'diceConfig',
      name: '检定设置',
      description: '是否隐藏，覆盖检定结果、头像与图标联动、疯狂模式的开关。',
      storageKeys: [STORAGE_KEY_DICE_CONFIG, STORAGE_KEY_CRAZY_MODE, STORAGE_KEY_LAST_PRESET],
    },
    {
      id: 'advancedPresets',
      name: '检定预设',
      description: '自定义检定预设、预设显示顺序与当前激活预设。',
      storageKeys: [
        STORAGE_KEY_ADVANCED_PRESETS,
        STORAGE_KEY_ACTIVE_ADVANCED_PRESET,
        STORAGE_KEY_BUILTIN_PRESET_VISIBILITY,
        STORAGE_KEY_BUILTIN_PRESET_ORDER,
      ],
    },
    {
      id: 'attributePresets',
      name: '属性预设',
      description: '自定义属性生成预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_ATTRIBUTE_PRESETS, STORAGE_KEY_ACTIVE_ATTR_PRESET],
    },
    {
      id: 'actionGm',
      name: '交互规则预设',
      description: '交互规则预设与当前激活状态；若历史版本保存过 GM 引擎配置也会一并迁移。',
      storageKeys: [STORAGE_KEY_ACTION_PRESETS, STORAGE_KEY_ACTIVE_ACTION_PRESET, STORAGE_KEY_GM_CONFIG],
    },
    {
      id: 'dashboardPresets',
      name: '仪表盘预设',
      description: '仪表盘预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET],
    },
    {
      id: 'renderPresets',
      name: '渲染预设',
      description: '自定义渲染预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_RENDER_PRESETS, STORAGE_KEY_ACTIVE_RENDER_PRESET],
    },
    {
      id: 'tableTemplate',
      name: '当前数据库表格模板',
      description: '当前聊天生效的数据库表格模板。恢复时会导入到数据库模板列表；如果已有同名模板，会覆盖同名模板。',
      storageKeys: [],
    },
    {
      id: 'tableTemplateRequirementPresets',
      name: '模板检验预设',
      description: '自定义模板检验预设与当前激活状态。',
      storageKeys: [STORAGE_KEY_TABLE_TEMPLATE_REQUIREMENT_PRESETS, STORAGE_KEY_ACTIVE_TABLE_TEMPLATE_REQUIREMENT_PRESET],
    },
    {
      id: 'validation',
      name: '数据验证',
      description: '数据验证预设、当前激活状态、启用状态与验证模式。',
      storageKeys: [
        STORAGE_KEY_PRESETS,
        STORAGE_KEY_ACTIVE_PRESET,
        STORAGE_KEY_VALIDATION_ENABLED,
        STORAGE_KEY_VALIDATION_MODE,
        STORAGE_KEY_VALIDATION_RULES,
      ],
      ...DATA_VALIDATION_DEPRECATED_META,
    },
    {
      id: 'regex',
      name: '表格正则预设',
      description: '表格正则预设、当前激活状态、规则列表与启用状态。',
      storageKeys: [
        STORAGE_KEY_REGEX_PRESETS,
        STORAGE_KEY_REGEX_RULES,
        STORAGE_KEY_REGEX_ACTIVE_PRESET,
        STORAGE_KEY_REGEX_ENABLED,
      ],
    },
    {
      id: 'avatarMap',
      name: '角色头像预设',
      description: '角色头像 URL、裁剪偏移、缩放与别名映射。不包括本地上传的图片',
      storageKeys: [STORAGE_KEY_AVATAR_MAP, STORAGE_KEY_MAP_FOCUS],
    },
    {
      id: 'customIcons',
      name: '图标预设',
      description: '表名、物品、装备、势力等图标预设的配置元数据。',
      storageKeys: [STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS],
    },
    {
      id: 'gachaSettings',
      name: '骰子商城配置与自定义物品',
      description: '商城卡池、条目设置、全局自定义物品目录、当前池与碎片商店稀有度。',
      storageKeys: [
        STORAGE_KEY_GACHA_POOL_SETTINGS,
        STORAGE_KEY_GACHA_SETTINGS_POOL_TAG,
        STORAGE_KEY_GACHA_ITEM_SETTINGS,
        STORAGE_KEY_GACHA_ACTIVE_POOL_TAG,
        STORAGE_KEY_GACHA_SHARD_SHOP_RARITY,
      ],
    },
  ];
