// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=29「仪表盘统一配置中心」
// 原行范围：202-16964（含 banner 199-201）；拆分批次 12；外部 closure 依赖：111（23 条直连 import + 6 个 IIFE 符号 + 8 个共享 let 读写回调）
// 落点说明：idx 29 为仪表盘统一配置中心连续大段（16763 行），内含多子模块——仪表盘预设/配置（202-1291）、通用 JSONC/文件工具（1292-1092 区间）、
//   全局交互面板（1573-2335）、全局状态变量簇（2336-2572）、数据库打开/手动更新工具（2573-3333）、自定义表名图标系统（3334-5403）、
//   面板状态/表格样式/反转表（5404-6068）、属性快捷选择/检定工具（6069-7031）、仪表盘面板渲染（7032-11515）、检定/对战面板（11516-12900）、
//   地图可视化（12901-14106）、关系图/NPC 头像收集（14107-16964）。正文 80% 以上为仪表盘/全局交互/面板状态/关系图运行时层，
//   故落点新建目录 dashboard/dashboard.ts（与 engine/misc/presets 等平级），以功能主题命名。
// 接线说明：
//   已拆模块直连 import（23 条，见下）；IIFE 内无法 export 的 6 个 idx 45 符号（renderInterface/renderGlobalInteractionsPanel/bindGlobalInteractionEvents/
//   renderDashboard/bindEvents/loadDashboardNpcAvatars，均为渲染刷新钩子）→ __wireDashboardDeps({...}) 尾注入，未注入时模块级引用为 null
//   （全部仅在运行时函数内调用，注入先于任何调用，与 IIFE 内原时序等价）；
//   共享 let 状态（批次6/10/11模式）：cachedRawData/hasUnsavedChanges/dashboardRuntimeConfigCache 经批次 11 回调（getCachedRawData/setCachedRawData/
//   getHasUnsavedChanges/setHasUnsavedChanges/getDashboardRuntimeConfigCache/setDashboardRuntimeConfigCache）读写，
//   cleanupGlobalInteractionOutsideCapture 为新增回调（get/set，声明保留 IIFE 内、idx 45 直接赋值）；声明全部保留 IIFE 内、本模块不导出；
//   isInitialized/_boundRenderHandler/_boundReviewBaselineHandler 仅被 __wireAcuDiceInitDeps 接线引用（init.ts 维护本地副本），声明保留 IIFE 内；
//   isSaving/saveQueue/isEditingOrder/isSettingsOpen/currentDiffMap/observer/isAutoTransforming/tablePageStates/tableSearchStates/lastOptionHash/
//   optionPanelVisible/tableScrollStates/STORAGE_KEY_SCROLL 声明保留 IIFE 内（idx 45/收尾接线直接读写），本模块正文无引用；
//   类型（DiceRawData/GachaCatalogRecord/AdvancedDicePreset/OutcomeLevel/PendingEffectContext 等定义于 idx 45 或已拆模块）仅作类型标注，
//   @ts-nocheck 下无运行时影响（沿用批次 3 idx 28 的 OutcomeLevel 先例）；
//   正文改写（批次12 记录在案，EXACT-MATCH 其余逐字一致）：cachedRawData 16 处读改写为 getCachedRawData()（15 处 `|| getTableData()` + 1 处复合读取）、
//   dashboardRuntimeConfigCache 5 处（3 写 setDashboardRuntimeConfigCache(null) / 1 读 / 1 写）、hasUnsavedChanges 1 处、cleanupGlobalInteractionOutsideCapture 2 处；
//   19 个共享 let/const 声明（含 STORAGE_KEY_SCROLL + tableScrollStates 恢复块）随标记保留 index.ts IIFE 内（见 index.ts 标记处）。
// 注：sections.json 记录 idx 29 为 bak 17860-34622；当前 index.ts 为 199-16964（前序批次行号偏移），本次按当前行号锚定。
import { MAX_HISTORY, checkHistory, contestHistory, emitEvent, showGlobalDiceHistoryDialog } from '../api';
import { CHARACTER_NAME_COLUMN_KEYS, NameAliasRegistry, USER_NODE_KEY, characterNamesMatch, createGlobalInteractionCustomTableNameIconContext, findAttributeColumnIndices, findCharacterAttributeRow, findNameColumnIndex, findPrimaryAttributeColumns, getDisplayName, getElementEmoji, getRowDisplayName, hydrateCustomTableNameIconsIn, isCharacterTable, isNpcLikeTableName, isPlayerTableName, pickFallbackAttributeColumn, renderCustomTableNameIconContent, resolveBatchLocationEmojis, resolveCanonicalCharacterName, resolveUserGraphName } from '../engine/character-name-resolver';
import { RELATION_ICON_MAP } from '../engine/emoji-maps';
import { DEFAULT_CONTEST_OUTPUT_TEMPLATE, DEFAULT_OUTPUT_TEMPLATE, calculateDiceExpectedValue, evaluateCondition, evaluateConditionNumber, evaluateFormula, evaluateOutcomes, formatOutputTemplate, generateAttributeValue, isComplexCondition, rollComplexDiceExpression } from '../engine/formula-parser';
import { MvuModule, getDiceConfig, hideDiceResultsInUserMessages, saveDiceConfig } from '../engine/mvu-visualizer';
import { PRESET_FORMAT_VERSION, STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, STORAGE_KEY_DASHBOARD_PRESETS, STORAGE_KEY_LAST_PRESET } from '../engine/preset-constants';
import { errorTableTemplateIssue, isNpcTableName, warnTableTemplateIssue, withTableTemplateCheckHint } from '../engine/primary-keys';
import type { RollResult } from '../engine/types';
import { MAX_PANEL_HEIGHT, MIN_PANEL_HEIGHT, PANEL_VIEWPORT_TOP_GUTTER, STORAGE_KEY_ACTIVE_TAB, STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, STORAGE_KEY_DASHBOARD_ACTIVE, STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, STORAGE_KEY_GM_CONFIG, STORAGE_KEY_HIDDEN_TABLES, STORAGE_KEY_IS_COLLAPSED, STORAGE_KEY_LAST_SNAPSHOT, STORAGE_KEY_MAP_FOCUS, STORAGE_KEY_OPTIONS_COLLAPSED, STORAGE_KEY_REVERSE_TABLES, STORAGE_KEY_TABLE_HEIGHTS, STORAGE_KEY_TABLE_ORDER, STORAGE_KEY_TABLE_STYLES, buildAvatarBackgroundStyle, escapeHtml, formatCssImageUrl, getRemoteImageUrlValidationError, safeEncodeURIComponent, setTextareaValueAndNotify, setupOverlayClose, smartInsertToTextarea } from '../favorites/bookmark-manager';
import { DiceHistoryStatsDB } from '../favorites/favorites-db';
import { AvatarManager, getPlayerName, renderDiceHistoryStatsHtml, replaceUserPlaceholders } from '../favorites/favorites-manager';
import { buildEffectMetaLines, buildEffectTraceLines, computePendingEffectVariables, executeEffects, executeSecondaryEffectsChain, parseEffectValueInput } from '../infra/db-adapter';
import { AdvancedDicePresetManager, applyAdvancedPresetOutcomePolicy, getAdvancedPresetDisplayOutcome } from '../presets/advanced-dice-preset-manager';
import { showAdvancedPresetManager } from '../presets/advanced-dice-preset-ui';
import { AttributePresetManager, isAttributeQuickSelectTarget, normalizeAttributeQuickSelectConfig } from '../presets/attribute-rule-preset';
import { ActionPresetManager } from '../presets/interaction-rule-preset';
import { RenderPresetManager } from '../presets/render-preset-manager';
import { bindTutorialButtonsIn, getConfig, getTableData, getTutorialButtonHtml, hasSheetKeys, processJsonData, saveRowInstantly, showAvatarManager } from '../settings/dice-settings';
import { showActionableErrorToast } from '../ui/actionable-error-toast';
import { ValidationRuleManager } from '../validation/preset-manager';
import { ValidationEngine } from '../validation/validation-engine';

let renderInterface = null;
let renderGlobalInteractionsPanel = null;
let bindGlobalInteractionEvents = null;
let renderDashboard = null;
let bindEvents = null;
let loadDashboardNpcAvatars = null;
let getCachedRawData = null;
let setCachedRawData = null;
let getHasUnsavedChanges = null;
let setHasUnsavedChanges = null;
let getDashboardRuntimeConfigCache = null;
let setDashboardRuntimeConfigCache = null;
let getCleanupGlobalInteractionOutsideCapture = null;
let setCleanupGlobalInteractionOutsideCapture = null;

export function __wireDashboardDeps(deps) {
  renderInterface = deps.renderInterface;
  renderGlobalInteractionsPanel = deps.renderGlobalInteractionsPanel;
  bindGlobalInteractionEvents = deps.bindGlobalInteractionEvents;
  renderDashboard = deps.renderDashboard;
  bindEvents = deps.bindEvents;
  loadDashboardNpcAvatars = deps.loadDashboardNpcAvatars;
  getCachedRawData = deps.getCachedRawData;
  setCachedRawData = deps.setCachedRawData;
  getHasUnsavedChanges = deps.getHasUnsavedChanges;
  setHasUnsavedChanges = deps.setHasUnsavedChanges;
  getDashboardRuntimeConfigCache = deps.getDashboardRuntimeConfigCache;
  setDashboardRuntimeConfigCache = deps.setDashboardRuntimeConfigCache;
  getCleanupGlobalInteractionOutsideCapture = deps.getCleanupGlobalInteractionOutsideCapture;
  setCleanupGlobalInteractionOutsideCapture = deps.setCleanupGlobalInteractionOutsideCapture;
}
  // ========================================
  // 仪表盘统一配置中心
  // ========================================
  type DashboardColumnConfig = {
    keywords: string[];
    fallbackIndex: number | null;
    isMultiple?: boolean;
  };
  type DashboardFilterConfig = {
    column: string;
    includes: string[];
    excludeColumn?: string;
    excludes?: string[];
  };
  type DashboardModuleConfig = {
    tableKeywords: string[];
    columns: Record<string, DashboardColumnConfig>;
    filters?: Record<string, DashboardFilterConfig>;
  };
  type DashboardConfigMap = Record<string, DashboardModuleConfig>;
  type DashboardPresetColumnConfig = {
    keywords: string[];
  };
  type DashboardPresetFilterConfig = {
    column?: string;
    includes?: string[];
    excludeColumn?: string;
    excludes?: string[];
  };
  type DashboardRelationshipGraphSourceMode = 'fixedTarget' | 'relationList';
  type DashboardRelationshipGraphSourceConfig = {
    mode: DashboardRelationshipGraphSourceMode;
    tableKeywords: string[];
    nameColumn: string[];
    relationColumn: string[];
    target?: string;
  };
  type DashboardPresetModuleConfig = {
    tableKeywords?: string[];
    columns?: Record<string, DashboardPresetColumnConfig>;
    filters?: Record<string, DashboardPresetFilterConfig>;
    sources?: DashboardRelationshipGraphSourceConfig[];
  };
  type DashboardPresetModules = Record<string, DashboardPresetModuleConfig>;
  type DashboardPreset = {
    format: 'acu_dashboard_preset_v1';
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    modules: DashboardPresetModules;
    createdAt?: string;
    updatedAt?: string;
  };

  const DASHBOARD_PRESET_FORMAT = 'acu_dashboard_preset_v1';
  const DASHBOARD_DEFAULT_PRESET_ID = '__builtin_dashboard_default__';
  const DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY = 'relationshipGraph';
  const DASHBOARD_PRESET_MODULE_KEYS = ['global', 'player', 'location', 'npc', 'quest', 'bag', 'equip'] as const;
  const DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES: DashboardRelationshipGraphSourceMode[] = [
    'fixedTarget',
    'relationList',
  ];
  const DASHBOARD_PRESET_FILTER_KEYS: Record<string, readonly string[]> = {
    equip: ['equipped'],
  };
  const DASHBOARD_PRESET_ADDITIONAL_COLUMNS: Record<string, readonly string[]> = {
    quest: ['priority'],
  };

  const DASHBOARD_TABLE_CONFIG: DashboardConfigMap = {
    global: {
      tableKeywords: ['全局数据表', '全局数据', '全局'],
      columns: {
        detailLocation: { keywords: ['当前详细地点', '详细地点', '具体位置', '当前位置'], fallbackIndex: null },
        currentLocation: { keywords: ['当前次要地区', '当前所在地点', '当前地点', '所在地点'], fallbackIndex: 2 },
        currentTime: { keywords: ['当前时间', '时间', '当前日期时间', '当前日期', '日期时间'], fallbackIndex: null },
      },
    },
    player: {
      // 新增: user, <user>
      tableKeywords: ['主角信息', '主角', '玩家', '角色信息', 'player', '用户', 'user', '<user>'],
      columns: {
        name: { keywords: CHARACTER_NAME_COLUMN_KEYS, fallbackIndex: 1 },
        status: { keywords: ['状态关键词', '状态关键字', '状态标签', '状态'], fallbackIndex: null },
        position: { keywords: ['具体位置', '位置', '所在地'], fallbackIndex: null },
        attrs: { keywords: ['基础属性', '属性'], fallbackIndex: null, isMultiple: true },
        // 新增: 灵石, 积分, 代币, 信用点
        money: {
          keywords: ['金钱', '资金', '金币', '货币', '余额', '灵石', '积分', '代币', '信用点'],
          fallbackIndex: null,
        },
        resources: { keywords: ['资源数据', '资源', 'resources'], fallbackIndex: null },
      },
    },
    location: {
      // 新增: 秘境, 副本, 洞府, 空间, 位面, 界域
      tableKeywords: [
        '世界地图点',
        '地图点',
        '地图',
        '地点',
        '地点表',
        '地图表',
        '场景',
        '区域',
        '秘境',
        '副本',
        '洞府',
        '空间',
        '位面',
        '界域',
      ],
      columns: {
        name: {
          keywords: ['详细地点', '具体位置', '当前地点', '次要地区', '主要地区', '地区', '地点名', '名称'],
          fallbackIndex: 1,
        },
        description: { keywords: ['环境描述', '描述', '说明', '介绍', '氛围描述'], fallbackIndex: null },
      },
    },
    npc: {
      // 新增: 弟子, 成员, 队友, 伙伴, 宠物, 灵宠
      tableKeywords: [
        '重要人物表',
        '重要角色表',
        '重要人物',
        'NPC',
        '人物表',
        '人物',
        '角色表',
        '角色',
        'character',
        '弟子',
        '成员',
        '队友',
        '伙伴',
        '宠物',
        '灵宠',
      ],
      columns: {
        name: { keywords: CHARACTER_NAME_COLUMN_KEYS, fallbackIndex: 1 },
        status: { keywords: ['自身状态', '状态'], fallbackIndex: null },
        position: { keywords: ['具体位置', '位置', '所在地点', '所在'], fallbackIndex: null },
        inScene: { keywords: ['在场状态', '在场', '是否离场', '离场'], fallbackIndex: null },
      },
    },
    quest: {
      // 新增: 委托, 悬赏
      tableKeywords: ['任务表', '备忘事项', '任务', '事项', '目标', '待办', '主线', '支线', '委托', '悬赏'],
      columns: {
        name: { keywords: ['事项名称', '任务名', '名称'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类', '事项类型'], fallbackIndex: 2 },
        progress: { keywords: ['进度', '完成度', '进度/结果'], fallbackIndex: 5 },
        status: { keywords: ['状态'], fallbackIndex: 6 },
      },
      filters: {
        active: { column: 'status', includes: ['活跃', '进行中', '进行'], excludeColumn: 'type', excludes: ['规则'] },
      },
    },
    bag: {
      // 新增: 储物袋, 空间戒指
      tableKeywords: ['背包物品', '背包', '物品', '道具', '库存', '储物袋', '空间戒指', '持有物品表'],
      columns: {
        name: { keywords: ['物品名称', '名称', '物品名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类', '物品类型'], fallbackIndex: 2 },
        count: { keywords: ['数量', '个数', '持有数'], fallbackIndex: 3 },
      },
    },
    skill: {
      // 新增: 神通, 道法, 功法, 血脉, 天赋, 义体改造, 超凡能力, 词条
      tableKeywords: [
        '主角技能',
        '技能表',
        '技能',
        '能力',
        '魔法',
        '超能力',
        '异能',
        '神通',
        '道法',
        '功法',
        '血脉',
        '天赋',
        '义体改造',
        '超凡能力',
        '词条',
      ],
      columns: {
        name: { keywords: ['技能名称', '名称', '技能名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类'], fallbackIndex: 2 },
        level: { keywords: ['等级', '级别', '熟练度', 'lv'], fallbackIndex: 3 },
      },
    },
    equip: {
      // 新增: 法宝, 灵器, 仙器, 神器, 义体, 神装
      tableKeywords: ['装备表', '装备', '武器', '防具', '法宝', '灵器', '仙器', '神器', '义体', '神装'],
      columns: {
        name: { keywords: ['装备名称', '名称', '装备名'], fallbackIndex: 1 },
        type: { keywords: ['类型', '分类'], fallbackIndex: 2 },
        part: { keywords: ['部位', '装备部位', '位置'], fallbackIndex: 3 },
        isEquipped: { keywords: ['状态', '是否装备', '装备状态', '装备中'], fallbackIndex: 4 },
      },
      filters: {
        equipped: { column: 'isEquipped', includes: ['已装备', '装备中', 'true', '是', 'yes', 'equipped'] },
      },
    },
  };


  const cloneDashboardConfig = (config: DashboardConfigMap): DashboardConfigMap => {
    const cloned: DashboardConfigMap = {};
    Object.entries(config).forEach(([moduleKey, moduleConfig]) => {
      const columns: Record<string, DashboardColumnConfig> = {};
      Object.entries(moduleConfig.columns).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = {
          ...columnConfig,
          keywords: [...columnConfig.keywords],
        };
      });
      cloned[moduleKey] = {
        tableKeywords: [...moduleConfig.tableKeywords],
        columns,
        ...(moduleConfig.filters
          ? { filters: JSON.parse(JSON.stringify(moduleConfig.filters)) as Record<string, DashboardFilterConfig> }
          : {}),
      };
    });
    return cloned;
  };

  const createDashboardPresetModulesFromConfig = (config: DashboardConfigMap): DashboardPresetModules => {
    const modules: DashboardPresetModules = {};
    DASHBOARD_PRESET_MODULE_KEYS.forEach(moduleKey => {
      const moduleConfig = config[moduleKey];
      if (!moduleConfig) return;
      const columns: Record<string, DashboardPresetColumnConfig> = {};
      Object.entries(moduleConfig.columns).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = { keywords: [...columnConfig.keywords] };
      });
      modules[moduleKey] = {
        tableKeywords: [...moduleConfig.tableKeywords],
        columns,
      };
      const allowedFilters = DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
      const filters: Record<string, DashboardPresetFilterConfig> = {};
      allowedFilters.forEach(filterKey => {
        const filterConfig = moduleConfig.filters?.[filterKey];
        if (!filterConfig) return;
        filters[filterKey] = {
          column: filterConfig.column,
          includes: [...filterConfig.includes],
          ...(filterConfig.excludeColumn ? { excludeColumn: filterConfig.excludeColumn } : {}),
          ...(filterConfig.excludes ? { excludes: [...filterConfig.excludes] } : {}),
        };
      });
      if (Object.keys(filters).length > 0) {
        modules[moduleKey].filters = filters;
      }
    });
    return modules;
  };

  const cloneDashboardPresetModules = (modules: DashboardPresetModules): DashboardPresetModules => {
    const cloned: DashboardPresetModules = {};
    Object.entries(modules).forEach(([moduleKey, moduleConfig]) => {
      const columns: Record<string, DashboardPresetColumnConfig> = {};
      Object.entries(moduleConfig.columns || {}).forEach(([columnKey, columnConfig]) => {
        columns[columnKey] = { keywords: [...columnConfig.keywords] };
      });
      const filters: Record<string, DashboardPresetFilterConfig> = {};
      Object.entries(moduleConfig.filters || {}).forEach(([filterKey, filterConfig]) => {
        filters[filterKey] = {
          ...(filterConfig.column ? { column: filterConfig.column } : {}),
          ...(filterConfig.includes ? { includes: [...filterConfig.includes] } : {}),
          ...(filterConfig.excludeColumn ? { excludeColumn: filterConfig.excludeColumn } : {}),
          ...(filterConfig.excludes ? { excludes: [...filterConfig.excludes] } : {}),
        };
      });
      const sources = (moduleConfig.sources || []).map(source => ({
        mode: source.mode,
        tableKeywords: [...source.tableKeywords],
        nameColumn: [...source.nameColumn],
        relationColumn: [...source.relationColumn],
        ...(source.target ? { target: source.target } : {}),
      }));
      cloned[moduleKey] = {
        ...(moduleConfig.tableKeywords ? { tableKeywords: [...moduleConfig.tableKeywords] } : {}),
        ...(Object.keys(columns).length > 0 ? { columns } : {}),
        ...(Object.keys(filters).length > 0 ? { filters } : {}),
        ...(sources.length > 0 ? { sources } : {}),
      };
    });
    return cloned;
  };

  const createBuiltinDashboardPreset = (): DashboardPreset => ({
    format: DASHBOARD_PRESET_FORMAT,
    version: PRESET_FORMAT_VERSION,
    id: DASHBOARD_DEFAULT_PRESET_ID,
    name: '默认仪表盘预设',
    builtin: true,
    description: '内置默认仪表盘抓取规则，可导出后修改并重新导入为自定义预设',
    modules: createDashboardPresetModulesFromConfig(DASHBOARD_TABLE_CONFIG),
  });

  const isRecordValue = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const normalizeDashboardKeywordArray = (value: unknown, label: string): string[] => {
    if (!Array.isArray(value)) {
      throw new Error(`${label} 必须是字符串数组`);
    }
    const keywords = value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
    if (keywords.length === 0) {
      throw new Error(`${label} 至少需要一个关键词`);
    }
    return keywords;
  };

  const normalizeDashboardOptionalStringArray = (value: unknown, label: string): string[] => {
    if (!Array.isArray(value)) {
      throw new Error(`${label} 必须是字符串数组`);
    }
    return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  };

  const normalizeDashboardPresetFilters = (
    moduleKey: string,
    rawFilters: unknown,
  ): Record<string, DashboardPresetFilterConfig> => {
    if (!isRecordValue(rawFilters)) {
      throw new Error(`模块 ${moduleKey}.filters 必须是对象`);
    }

    const moduleConfig = DASHBOARD_TABLE_CONFIG[moduleKey];
    const allowedFilterKeys = DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
    const filters: Record<string, DashboardPresetFilterConfig> = {};

    Object.entries(rawFilters).forEach(([filterKey, rawFilter]) => {
      if (!allowedFilterKeys.includes(filterKey)) {
        throw new Error(`模块 ${moduleKey} 不支持过滤器: ${filterKey}`);
      }
      if (!moduleConfig.filters?.[filterKey]) {
        throw new Error(`模块 ${moduleKey} 不存在默认过滤器: ${filterKey}`);
      }
      if (!isRecordValue(rawFilter)) {
        throw new Error(`模块 ${moduleKey}.filters.${filterKey} 必须是对象`);
      }

      const filterConfig: DashboardPresetFilterConfig = {};
      if ('column' in rawFilter) {
        const column = typeof rawFilter.column === 'string' ? rawFilter.column.trim() : '';
        if (!column || !moduleConfig.columns[column]) {
          throw new Error(`模块 ${moduleKey}.filters.${filterKey}.column 必须引用已有字段`);
        }
        filterConfig.column = column;
      }
      if ('excludeColumn' in rawFilter) {
        const excludeColumn = typeof rawFilter.excludeColumn === 'string' ? rawFilter.excludeColumn.trim() : '';
        if (!excludeColumn || !moduleConfig.columns[excludeColumn]) {
          throw new Error(`模块 ${moduleKey}.filters.${filterKey}.excludeColumn 必须引用已有字段`);
        }
        filterConfig.excludeColumn = excludeColumn;
      }
      if ('includes' in rawFilter) {
        filterConfig.includes = normalizeDashboardOptionalStringArray(
          rawFilter.includes,
          `模块 ${moduleKey}.filters.${filterKey}.includes`,
        );
      }
      if ('excludes' in rawFilter) {
        filterConfig.excludes = normalizeDashboardOptionalStringArray(
          rawFilter.excludes,
          `模块 ${moduleKey}.filters.${filterKey}.excludes`,
        );
      }

      if (Object.keys(filterConfig).length === 0) {
        throw new Error(`模块 ${moduleKey}.filters.${filterKey} 至少需要配置一个字段`);
      }
      filters[filterKey] = filterConfig;
    });

    return filters;
  };

  const normalizeDashboardRelationshipGraphConfig = (
    rawModule: Record<string, unknown>,
  ): DashboardPresetModuleConfig => {
    if (!Array.isArray(rawModule.sources)) {
      throw new Error('模块 relationshipGraph.sources 必须是数组');
    }

    const sources = rawModule.sources.map((rawSource, index) => {
      if (!isRecordValue(rawSource)) {
        throw new Error(`模块 relationshipGraph.sources.${index} 必须是对象`);
      }

      const mode = typeof rawSource.mode === 'string' ? rawSource.mode.trim() : '';
      if (!DASHBOARD_RELATIONSHIP_GRAPH_SOURCE_MODES.includes(mode as DashboardRelationshipGraphSourceMode)) {
        throw new Error(`模块 relationshipGraph.sources.${index}.mode 只能是 fixedTarget 或 relationList`);
      }

      const source: DashboardRelationshipGraphSourceConfig = {
        mode: mode as DashboardRelationshipGraphSourceMode,
        tableKeywords: normalizeDashboardKeywordArray(
          rawSource.tableKeywords,
          `模块 relationshipGraph.sources.${index}.tableKeywords`,
        ),
        nameColumn: normalizeDashboardKeywordArray(
          rawSource.nameColumn,
          `模块 relationshipGraph.sources.${index}.nameColumn`,
        ),
        relationColumn: normalizeDashboardKeywordArray(
          rawSource.relationColumn,
          `模块 relationshipGraph.sources.${index}.relationColumn`,
        ),
      };

      if ('target' in rawSource) {
        const target = typeof rawSource.target === 'string' ? rawSource.target.trim() : '';
        if (!target) {
          throw new Error(`模块 relationshipGraph.sources.${index}.target 必须是非空字符串`);
        }
        source.target = target;
      }

      return source;
    });

    if (sources.length === 0) {
      throw new Error('模块 relationshipGraph.sources 至少需要一个来源');
    }

    return { sources };
  };

  const stripJsonComments = (jsonText: string): string => {
    let result = '';
    let inString = false;
    let quote = '';
    let escaped = false;

    for (let i = 0; i < jsonText.length; i++) {
      const char = jsonText[i];
      const next = jsonText[i + 1];

      if (inString) {
        result += char;
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          inString = false;
          quote = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quote = char;
        result += char;
        continue;
      }

      if (char === '/' && next === '/') {
        while (i < jsonText.length && jsonText[i] !== '\n') i++;
        result += '\n';
        continue;
      }

      if (char === '/' && next === '*') {
        i += 2;
        while (i < jsonText.length && !(jsonText[i] === '*' && jsonText[i + 1] === '/')) {
          if (jsonText[i] === '\n') result += '\n';
          i++;
        }
        i++;
        continue;
      }

      result += char;
    }

    return result;
  };

  const JSONC_FILE_ACCEPT = '.json,.jsonc,application/json,application/jsonc';
  const JSON_FILE_MIME = 'application/json;charset=utf-8';
  const JSONC_FILE_MIME = 'application/jsonc;charset=utf-8';
  const MARKDOWN_FILE_MIME = 'text/markdown;charset=utf-8';

  interface TextFileSelection {
    file: File;
    text: string;
  }

  interface DownloadTextFileOptions {
    content: string;
    filename: string;
    mimeType: string;
  }

  interface JsoncEditorValidationOptions<T> {
    text: string;
    emptyMessage?: string;
    parse: (text: string) => T;
    successMessage: (parsed: T) => string;
    errorMessage?: (error: unknown) => string;
    logLabel: string;
  }

  interface JsoncDocumentParseOptions<T> {
    text: string;
    emptyMessage?: string;
    invalidJsonMessage?: string;
    validate: (value: unknown) => T;
  }

  const getJsonLikeErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error || '未知错误');
  };

  const stripJsoncSyntax = (jsonText: string): string => {
    const withoutComments = stripJsonComments(String(jsonText || ''));
    let result = '';
    let inString = false;
    let quote = '';
    let escaped = false;

    for (let index = 0; index < withoutComments.length; index++) {
      const char = withoutComments[index];

      if (inString) {
        result += char;
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          inString = false;
          quote = '';
        }
        continue;
      }

      if (char === '"' || char === "'") {
        inString = true;
        quote = char;
        result += char;
        continue;
      }

      if (char === ',') {
        let nextIndex = index + 1;
        while (nextIndex < withoutComments.length && /\s/.test(withoutComments[nextIndex])) {
          nextIndex++;
        }
        if (withoutComments[nextIndex] === '}' || withoutComments[nextIndex] === ']') continue;
      }

      result += char;
    }

    return result;
  };

  const parseJsoncValue = (jsonText: string): unknown => JSON.parse(stripJsoncSyntax(jsonText));

  const parseJsoncDocument = <T>({
    text,
    emptyMessage = '请输入 JSONC 配置',
    invalidJsonMessage = '不是有效的 JSON/JSONC',
    validate,
  }: JsoncDocumentParseOptions<T>): T => {
    const trimmed = String(text || '').trim();
    if (!trimmed) throw new Error(emptyMessage);
    let parsed: unknown;
    try {
      parsed = parseJsoncValue(trimmed);
    } catch {
      throw new Error(invalidJsonMessage);
    }
    return validate(parsed);
  };

  const parseJsoncRecord = (jsonText: string, label: string): Record<string, unknown> => {
    return parseJsoncDocument({
      text: jsonText,
      invalidJsonMessage: `${label}不是有效的 JSON/JSONC`,
      validate: parsed => {
        if (!isRecordValue(parsed)) {
          throw new Error(`${label}必须是对象`);
        }
        return parsed;
      },
    });
  };

  const downloadTextFile = ({ content, filename, mimeType }: DownloadTextFileOptions): void => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    try {
      anchor.click();
    } finally {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }
  };

  const downloadJsonFile = (content: string, filename: string): void => {
    downloadTextFile({ content, filename, mimeType: JSON_FILE_MIME });
  };

  const downloadJsoncFile = (content: string, filename: string): void => {
    downloadTextFile({ content, filename, mimeType: JSONC_FILE_MIME });
  };

  const downloadAiPromptFile = (content: string, filename: string): void => {
    downloadTextFile({ content, filename, mimeType: MARKDOWN_FILE_MIME });
  };

  const readTextFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = event => resolve(String(event.target?.result || ''));
      reader.onerror = () => reject(reader.error || new Error('文件读取失败'));
      reader.readAsText(file);
    });

  const pickTextFile = (accept = JSONC_FILE_ACCEPT): Promise<TextFileSelection | null> =>
    new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      input.style.display = 'none';
      const cleanup = () => {
        if (input.isConnected) input.remove();
      };
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          cleanup();
          resolve(null);
          return;
        }
        readTextFile(file)
          .then(text => resolve({ file, text }))
          .catch(error => {
            console.error('[DICE]读取文件失败:', error);
            if (window.toastr)
              showActionableErrorToast('文件读取失败，浏览器没有成功读取所选文件。', { suggestion: 'importExport' });
            resolve(null);
          })
          .finally(cleanup);
      };
      input.addEventListener(
        'cancel',
        () => {
          cleanup();
          resolve(null);
        },
        { once: true },
      );
      document.body.appendChild(input);
      input.click();
    });

  const validateJsoncEditorConfig = <T>(options: JsoncEditorValidationOptions<T>): T | null => {
    const text = String(options.text || '').trim();
    if (!text) {
      if (window.toastr) window.toastr.warning(options.emptyMessage || '请输入 JSONC 配置');
      return null;
    }

    try {
      const parsed = options.parse(text);
      if (window.toastr) window.toastr.success(options.successMessage(parsed));
      return parsed;
    } catch (error) {
      console.error(options.logLabel, error);
      const message = options.errorMessage
        ? options.errorMessage(error)
        : `JSONC 格式错误: ${getJsonLikeErrorMessage(error)}`;
      if (window.toastr) showActionableErrorToast(message, { suggestion: 'importExport' });
      return null;
    }
  };

  const normalizeDashboardPresetModules = (rawModules: unknown): DashboardPresetModules => {
    if (!isRecordValue(rawModules)) {
      throw new Error('modules 必须是对象');
    }

    const modules: DashboardPresetModules = {};
    Object.entries(rawModules).forEach(([moduleKey, rawModule]) => {
      if (moduleKey === DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY) {
        if (!isRecordValue(rawModule)) {
          throw new Error('模块 relationshipGraph 必须是对象');
        }
        modules[moduleKey] = normalizeDashboardRelationshipGraphConfig(rawModule);
        return;
      }

      if (!DASHBOARD_PRESET_MODULE_KEYS.includes(moduleKey as (typeof DASHBOARD_PRESET_MODULE_KEYS)[number])) {
        throw new Error(`未知仪表盘区域: ${moduleKey}`);
      }
      if (!isRecordValue(rawModule)) {
        throw new Error(`模块 ${moduleKey} 必须是对象`);
      }

      const moduleConfig: DashboardPresetModuleConfig = {};
      if ('tableKeywords' in rawModule) {
        moduleConfig.tableKeywords = normalizeDashboardKeywordArray(
          rawModule.tableKeywords,
          `模块 ${moduleKey}.tableKeywords`,
        );
      }

      if ('columns' in rawModule) {
        if (!isRecordValue(rawModule.columns)) {
          throw new Error(`模块 ${moduleKey}.columns 必须是对象`);
        }
        const columns: Record<string, DashboardPresetColumnConfig> = {};
        Object.entries(rawModule.columns).forEach(([columnKey, rawColumn]) => {
          const baseColumn = DASHBOARD_TABLE_CONFIG[moduleKey]?.columns[columnKey];
          const allowedAdditionalColumns = DASHBOARD_PRESET_ADDITIONAL_COLUMNS[moduleKey] || [];
          if (!baseColumn && !allowedAdditionalColumns.includes(columnKey)) {
            throw new Error(`模块 ${moduleKey} 不存在字段: ${columnKey}`);
          }

          const keywordsSource = Array.isArray(rawColumn)
            ? rawColumn
            : isRecordValue(rawColumn)
              ? rawColumn.keywords
              : null;
          columns[columnKey] = {
            keywords: normalizeDashboardKeywordArray(keywordsSource, `模块 ${moduleKey}.columns.${columnKey}.keywords`),
          };
        });
        if (Object.keys(columns).length > 0) {
          moduleConfig.columns = columns;
        }
      }

      if ('filters' in rawModule) {
        const filters = normalizeDashboardPresetFilters(moduleKey, rawModule.filters);
        if (Object.keys(filters).length > 0) {
          moduleConfig.filters = filters;
        }
      }

      if (!moduleConfig.tableKeywords && !moduleConfig.columns && !moduleConfig.filters && !moduleConfig.sources) {
        throw new Error(`模块 ${moduleKey} 至少需要 tableKeywords、columns 或 filters`);
      }
      modules[moduleKey] = moduleConfig;
    });

    if (Object.keys(modules).length === 0) {
      throw new Error('modules 至少需要配置一个仪表盘区域');
    }

    return modules;
  };

  const parseDashboardPresetJson = (
    jsonText: string,
  ): { name: string; description: string; modules: DashboardPresetModules } => {
    const parsed = parseJsoncRecord(jsonText, '仪表盘预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== DASHBOARD_PRESET_FORMAT) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawModules = 'modules' in parsed ? parsed.modules : parsed;
    const modules = normalizeDashboardPresetModules(rawModules);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的仪表盘预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, modules };
  };

  const createDashboardPresetEditorTemplate = (): string => `{
  // 预设名称和描述在上方输入框填写；这里配置各区域如何抓取表格。
  // 每个区域保持现有渲染方式，只替换表名关键词和字段列关键词。
  // 这里可以直接填写 modules 对象；导入完整预设文件时也支持 format / name / description / modules 包装。
  // 示例对比：重要对象表 → 恋爱对象表；装备表 → 装扮表；任务表 → 备忘录。
  "global": {
    // 全局数据区：当前地点、时间等
    "tableKeywords": ["全局数据表", "全局数据", "全局"],
    "columns": {
      "detailLocation": { "keywords": ["当前详细地点", "详细地点", "具体位置", "当前位置"] },
      "currentLocation": { "keywords": ["当前次要地区", "当前所在地点", "当前地点", "所在地点"] },
      "currentTime": { "keywords": ["当前时间", "时间", "当前日期时间", "当前日期", "日期时间"] }
    }
  },
  "player": {
    // 主角区：属性、资源、当前位置
    "tableKeywords": ["主角信息", "主角", "玩家", "角色信息", "user", "<user>"],
    "columns": {
      "name": { "keywords": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"] },
      "status": { "keywords": ["近况", "当前状态", "状态关键词", "状态关键字", "状态标签", "状态"] },
      "position": { "keywords": ["具体位置", "位置", "所在地"] },
      "money": { "keywords": ["金钱", "资金", "金币", "货币", "余额"] },
      "resources": { "keywords": ["资源数据", "资源", "resources"] }
    }
  },
  "location": {
    // 地点区：保持地点列表和当前地点高亮
    "tableKeywords": ["世界地图点", "地图点", "地图", "地点", "地点表", "地图表"],
    "columns": {
      "name": { "keywords": ["详细地点", "具体位置", "当前地点", "地区", "地点名", "名称"] },
      "description": { "keywords": ["环境描述", "描述", "说明", "介绍"] }
    }
  },
  "npc": {
    // 角色区：示例把默认的“重要对象表”改成“恋爱对象表”，仍保持在场/离场分组和头像
    "tableKeywords": ["恋爱对象表", "恋爱对象"],
    "columns": {
      "name": { "keywords": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"] },
      "status": { "keywords": ["当前情绪", "对主角态度", "自身状态", "状态"] },
      "position": { "keywords": ["具体位置", "位置", "所在地点", "所在"] },
      "inScene": { "keywords": ["在场状态", "在场", "是否离场", "离场"] }
    }
  },
  "relationshipGraph": {
    // 人物关系图：sources 可配置多个来源，并按 mode 决定关系解析方式
    // fixedTarget：当前行角色固定连到 target；适合“恋爱对象表.与主角关系”
    // relationList：沿用“角色名:关系词;角色名:关系词”；适合“重要角色表.人际关系”
    "sources": [
      {
        "mode": "fixedTarget",
        "tableKeywords": ["恋爱对象表", "恋爱对象"],
        "nameColumn": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"],
        "relationColumn": ["与主角关系"],
        "target": "player"
      },
      {
        "mode": "relationList",
        "tableKeywords": ["重要角色表", "重要人物表"],
        "nameColumn": ["姓名", "名称", "名字", "角色名", "人物名", "人物名称", "name", "Name"],
        "relationColumn": ["人际关系"]
      }
    ]
  },
  "quest": {
    // 任务区：示例把默认的“任务表”改成“备忘录”，仍保持进度条、状态排序等渲染
    "tableKeywords": ["备忘录", "备忘表", "备忘"],
    "columns": {
      "name": { "keywords": ["备忘标题", "事项名称", "任务名", "名称"] },
      "type": { "keywords": ["类型", "分类", "事项类型"] },
      "progress": { "keywords": ["后续结果", "进度", "完成度", "进度/结果"] },
      "status": { "keywords": ["当前状态", "状态"] },
      "priority": { "keywords": ["重要程度", "重要性", "优先级", "紧急程度"] }
    }
  },
  "bag": {
    // 物品区：保持物品列表和物品栏入口
    "tableKeywords": ["背包物品", "背包", "物品", "道具", "库存", "持有物品表"],
    "columns": {
      "name": { "keywords": ["物品名称", "名称", "物品名"] },
      "type": { "keywords": ["类型", "分类", "物品类型"] },
      "count": { "keywords": ["数量", "个数", "持有数"] }
    }
  },
  "equip": {
    // 装备区：示例把默认的“装备表”改成“装扮表”，并把“正在穿/已佩戴”识别为展示项
    "tableKeywords": ["装扮表", "装扮"],
    "columns": {
      "name": { "keywords": ["装扮名称", "装备名称", "名称", "装备名"] },
      "type": { "keywords": ["类型", "分类"] },
      "part": { "keywords": ["适用场景", "部位", "装备部位", "位置"] },
      "isEquipped": { "keywords": ["当前状态", "状态", "是否装备", "装备状态", "装备中"] }
    },
    "filters": {
      "equipped": {
        "includes": ["正在穿", "已佩戴", "已穿戴", "穿着中", "已装备"],
        "excludes": ["收纳中", "收纳", "损坏", "遗失", "借出", "已更换", "纪念保存", "未穿戴", "未装备"]
      }
    }
  }
}`;

  const DashboardPresetManager = (() => {
    let _cache: DashboardPreset[] | null = null;

    const getBuiltinPreset = (): DashboardPreset => createBuiltinDashboardPreset();
    const getStoredPresets = (): DashboardPreset[] => Store.get(STORAGE_KEY_DASHBOARD_PRESETS, []);
    const saveStoredPresets = (presets: DashboardPreset[]) => {
      Store.set(STORAGE_KEY_DASHBOARD_PRESETS, presets);
      _cache = null;
      setDashboardRuntimeConfigCache(null);
    };

    return {
      getAllPresets(): DashboardPreset[] {
        if (_cache) return _cache;
        _cache = [getBuiltinPreset(), ...getStoredPresets()];
        return _cache;
      },

      getPresetById(id: string): DashboardPreset | null {
        return this.getAllPresets().find(preset => preset.id === id) || null;
      },

      getActivePresetId(): string {
        const stored = Store.get(STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, DASHBOARD_DEFAULT_PRESET_ID);
        if (typeof stored !== 'string' || !this.getPresetById(stored)) {
          Store.set(STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, DASHBOARD_DEFAULT_PRESET_ID);
          return DASHBOARD_DEFAULT_PRESET_ID;
        }
        return stored;
      },

      getActivePreset(): DashboardPreset {
        return this.getPresetById(this.getActivePresetId()) || getBuiltinPreset();
      },

      setActivePresetId(id: string): boolean {
        const preset = this.getPresetById(id);
        if (!preset) return false;
        Store.set(STORAGE_KEY_ACTIVE_DASHBOARD_PRESET, id);
        setDashboardRuntimeConfigCache(null);
        return true;
      },

      createPreset(preset: { name: string; description?: string; modules: DashboardPresetModules }): DashboardPreset {
        const stored = getStoredPresets();
        const newPreset: DashboardPreset = {
          format: DASHBOARD_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          id: `dashboard_${Date.now()}`,
          name: preset.name,
          description: preset.description || '',
          builtin: false,
          modules: cloneDashboardPresetModules(preset.modules),
          createdAt: new Date().toISOString(),
        };
        stored.push(newPreset);
        saveStoredPresets(stored);
        return newPreset;
      },

      updatePreset(
        id: string,
        updates: { name: string; description?: string; modules: DashboardPresetModules },
      ): boolean {
        const stored = getStoredPresets();
        const index = stored.findIndex(preset => preset.id === id);
        if (index < 0) return false;
        stored[index] = {
          ...stored[index],
          name: updates.name,
          description: updates.description || '',
          modules: cloneDashboardPresetModules(updates.modules),
          version: PRESET_FORMAT_VERSION,
          updatedAt: new Date().toISOString(),
        };
        saveStoredPresets(stored);
        return true;
      },

      deletePreset(id: string): boolean {
        if (id === DASHBOARD_DEFAULT_PRESET_ID) return false;
        const stored = getStoredPresets();
        const filtered = stored.filter(preset => preset.id !== id);
        if (filtered.length === stored.length) return false;
        saveStoredPresets(filtered);
        if (this.getActivePresetId() === id) {
          this.setActivePresetId(DASHBOARD_DEFAULT_PRESET_ID);
        }
        return true;
      },

      exportPreset(id: string): string | null {
        const preset = this.getPresetById(id);
        if (!preset) return null;
        const exported = {
          format: DASHBOARD_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          name: preset.name,
          description: preset.description || '',
          modules: cloneDashboardPresetModules(preset.modules),
        };
        return JSON.stringify(exported, null, 2);
      },

      importPreset(jsonText: string): DashboardPreset | null {
        try {
          const parsed = parseDashboardPresetJson(jsonText);
          return this.createPreset({
            name: parsed.name,
            description: parsed.description,
            modules: parsed.modules,
          });
        } catch (error) {
          console.error('[DICE]DashboardPresetManager 导入失败:', error);
          if (window.toastr)
            showActionableErrorToast('仪表盘预设导入失败: ' + (error instanceof Error ? error.message : String(error)), {
              suggestion: 'importExport',
            });
          return null;
        }
      },

      clearCache(): void {
        _cache = null;
        setDashboardRuntimeConfigCache(null);
      },
    };
  })();

  const getActiveDashboardRelationshipGraphSources = (): DashboardRelationshipGraphSourceConfig[] => {
    const graphConfig = DashboardPresetManager.getActivePreset().modules[DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY];
    return graphConfig?.sources || [];
  };

  const getDashboardRuntimeConfig = (): DashboardConfigMap => {
    if (getDashboardRuntimeConfigCache()) return getDashboardRuntimeConfigCache();

    const runtimeConfig = cloneDashboardConfig(DASHBOARD_TABLE_CONFIG);
    const activePreset = DashboardPresetManager.getActivePreset();

    Object.entries(activePreset.modules || {}).forEach(([moduleKey, moduleOverride]) => {
      const moduleConfig = runtimeConfig[moduleKey];
      if (!moduleConfig) return;

      if (moduleOverride.tableKeywords && moduleOverride.tableKeywords.length > 0) {
        moduleConfig.tableKeywords = [...moduleOverride.tableKeywords];
      }

      Object.entries(moduleOverride.columns || {}).forEach(([columnKey, columnOverride]) => {
        const columnConfig = moduleConfig.columns[columnKey];
        if (columnConfig && columnOverride.keywords.length > 0) {
          columnConfig.keywords = [...columnOverride.keywords];
          return;
        }

        const allowedAdditionalColumns = DASHBOARD_PRESET_ADDITIONAL_COLUMNS[moduleKey] || [];
        if (allowedAdditionalColumns.includes(columnKey) && columnOverride.keywords.length > 0) {
          moduleConfig.columns[columnKey] = {
            keywords: [...columnOverride.keywords],
            fallbackIndex: null,
          };
        }
      });

      Object.entries(moduleOverride.filters || {}).forEach(([filterKey, filterOverride]) => {
        const allowedFilterKeys = DASHBOARD_PRESET_FILTER_KEYS[moduleKey] || [];
        const filterConfig = moduleConfig.filters?.[filterKey];
        if (!allowedFilterKeys.includes(filterKey) || !filterConfig) return;

        const mergedFilter: DashboardFilterConfig = { ...filterConfig, includes: [...filterConfig.includes] };
        if (filterConfig.excludes) {
          mergedFilter.excludes = [...filterConfig.excludes];
        }
        if (filterOverride.column && moduleConfig.columns[filterOverride.column]) {
          mergedFilter.column = filterOverride.column;
        }
        if (filterOverride.excludeColumn && moduleConfig.columns[filterOverride.excludeColumn]) {
          mergedFilter.excludeColumn = filterOverride.excludeColumn;
        }
        if (Array.isArray(filterOverride.includes)) {
          mergedFilter.includes = [...filterOverride.includes];
        }
        if (Array.isArray(filterOverride.excludes)) {
          mergedFilter.excludes = [...filterOverride.excludes];
        }
        moduleConfig.filters = {
          ...(moduleConfig.filters || {}),
          [filterKey]: mergedFilter,
        };
      });
    });

    setDashboardRuntimeConfigCache(runtimeConfig);
    return runtimeConfig;
  };

  const getDashboardModuleConfig = (moduleKey: string): DashboardModuleConfig | null =>
    getDashboardRuntimeConfig()[moduleKey] || null;

  // 仪表盘数据解析器
  const DashboardDataParser = {
    // 根据配置查找所有匹配表
    findTables(allTables, moduleKey) {
      const config = getDashboardModuleConfig(moduleKey);
      if (!config) {
        console.info(`[DICE]仪表盘查找表格: 模块"${moduleKey}"配置不存在`);
        return [];
      }

      const results = [];
      const matchedTableNames = new Set();
      for (const keyword of config.tableKeywords) {
        for (const tableName in allTables) {
          if (tableName.includes(keyword) && !matchedTableNames.has(tableName)) {
            matchedTableNames.add(tableName);
            console.info(`[DICE]仪表盘查找表格: 模块"${moduleKey}"找到表格"${tableName}" (关键词: "${keyword}")`);
            results.push({
              data: allTables[tableName],
              name: tableName,
              key: allTables[tableName].key,
              config: config,
            });
          }
        }
      }

      if (results.length === 0) {
        console.info(
          `[DICE]仪表盘查找表格: 模块"${moduleKey}"未找到匹配表格 (关键词: ${config.tableKeywords.join(', ')})`,
        );
      }
      return results;
    },

    // 根据配置查找表
    findTable(allTables, moduleKey) {
      return this.findTables(allTables, moduleKey)[0] || null;
    },

    // 根据配置查找列索引
    findColumnIndex(headers, columnKey, moduleConfig) {
      const colConfig = moduleConfig.columns[columnKey];
      if (!colConfig) return -1;

      // 先尝试关键词匹配
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').toLowerCase();
        if (colConfig.keywords.some(kw => h.includes(kw.toLowerCase()))) {
          return i;
        }
      }

      // 回退到默认索引
      return colConfig.fallbackIndex ?? -1;
    },

    // 从行中提取指定列的值
    getValue(row, headers, columnKey, moduleConfig) {
      const idx = this.findColumnIndex(headers, columnKey, moduleConfig);
      if (idx < 0 || idx >= row.length) return null;
      return row[idx];
    },

    // 获取模块的所有列索引映射
    getColumnMap(headers, moduleKey) {
      const config = getDashboardModuleConfig(moduleKey);
      if (!config) return {};

      const map = {};
      for (const colKey in config.columns) {
        map[colKey] = this.findColumnIndex(headers, colKey, config);
      }
      return map;
    },

    // 解析表格数据为结构化对象数组
    parseRows(tableResult, moduleKey) {
      if (!tableResult || !tableResult.data) {
        console.info(`[DICE]仪表盘解析数据: 模块"${moduleKey}"无数据，跳过解析`);
        return [];
      }

      const { data, config } = tableResult;
      const headers = data.headers || [];
      const rows = data.rows || [];
      const colMap = this.getColumnMap(headers, moduleKey);

      const parsed = rows.map((row, idx) => {
        const obj = { _rowIndex: idx, _raw: row };
        for (const colKey in colMap) {
          const colIdx = colMap[colKey];
          obj[colKey] = colIdx >= 0 && colIdx < row.length ? row[colIdx] : null;
        }
        return obj;
      });

      console.info(`[DICE]仪表盘解析数据: 模块"${moduleKey}"解析完成，共${parsed.length}行`);
      return parsed;
    },

    // 应用过滤器（容错：当目标列不存在时返回全部数据）
    applyFilter(parsedRows, filterKey, moduleKey) {
      const config = getDashboardModuleConfig(moduleKey);
      if (!config || !config.filters || !config.filters[filterKey]) return parsedRows;

      const filter = config.filters[filterKey];

      // 容错：检查过滤列是否存在（即parsedRows中是否有该字段的有效值）
      const hasFilterColumn = parsedRows.some(row => row[filter.column] !== null && row[filter.column] !== undefined);
      if (!hasFilterColumn) {
        // 过滤列不存在，返回全部数据
        return parsedRows;
      }

      return parsedRows.filter(row => {
        const value = String(row[filter.column] || '').toLowerCase();
        const matchInclude = filter.includes.some(inc => value.includes(inc.toLowerCase()));

        if (filter.excludes && filter.excludes.length > 0) {
          const excludeColumn = filter.excludeColumn || filter.column;
          const excludeValue = String(row[excludeColumn] || '').toLowerCase();
          const matchExclude = filter.excludes.some(exc => excludeValue.includes(exc.toLowerCase()));
          return matchInclude && !matchExclude;
        }

        return matchInclude;
      });
    },
  };

  const DEFAULT_GM_CONFIG = {
    enabled: true,
    diceSystem: '1d100',
    showDiceIcon: true,
    autoSendPrompt: true,
    action_groups: [
      {
        table_keywords: ['地点', '地图', 'Location', 'Map', '世界', '场所'],
        actions: [
          { label: '前往', icon: 'fa-walking', type: 'prompt', template: '<user>前往{Name}。', auto_send: true },
          { label: '探索', icon: 'fa-search', type: 'prompt', template: '<user>探索{Name}。', auto_send: true },
          { label: '停留', icon: 'fa-clock', type: 'prompt', template: '<user>在{Name}停留。', auto_send: true },
        ],
      },
      {
        table_keywords: ['人物', 'NPC', '重要人物', '角色', '女主'],
        actions: [
          { label: '交谈', icon: 'fa-comments', type: 'prompt', template: '<user>与{Name}交谈。', auto_send: true },
          { label: '观察', icon: 'fa-eye', type: 'prompt', template: '<user>观察{Name}。', auto_send: true },
          { label: '战斗', icon: 'fa-hand-fist', type: 'prompt', template: '<user>与{Name}战斗。', auto_send: true },
        ],
      },
      {
        table_keywords: ['物品', '背包', '道具'],
        actions: [
          { label: '使用', icon: 'fa-hand-pointer', type: 'prompt', template: '<user>使用了{Name}。', auto_send: true },
          { label: '查看', icon: 'fa-eye', type: 'prompt', template: '<user>查看了{Name}。', auto_send: true },
          { label: '丢弃', icon: 'fa-trash', type: 'prompt', template: '<user>丢弃了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['装备', '武器', '防具'],
        actions: [
          {
            label: '装备',
            icon: 'fa-shield-halved',
            type: 'prompt',
            template: '<user>装备了{Name}。',
            auto_send: true,
          },
          { label: '卸下', icon: 'fa-circle-xmark', type: 'prompt', template: '<user>卸下了{Name}。', auto_send: true },
          { label: '卖出', icon: 'fa-coins', type: 'prompt', template: '<user>卖出了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['技能', '能力'],
        actions: [
          {
            label: '使用',
            icon: 'fa-wand-magic-sparkles',
            type: 'skill_check',
            template: '<user>使用{Name}。',
            auto_send: true,
          },
          { label: '练习', icon: 'fa-dumbbell', type: 'prompt', template: '<user>练习{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['备忘', '任务', '事项'],
        actions: [
          {
            label: '追踪',
            icon: 'fa-crosshairs',
            type: 'prompt',
            template: '<user>将{Name}设为当前追踪目标。',
            auto_send: true,
          },
          {
            label: '整理',
            icon: 'fa-list-check',
            type: 'prompt',
            template: '<user>整理关于{Name}的信息。',
            auto_send: true,
          },
          { label: '放弃', icon: 'fa-circle-xmark', type: 'prompt', template: '<user>放弃了{Name}。', auto_send: true },
        ],
      },
      {
        table_keywords: ['势力', '组织', '阵营'],
        actions: [
          {
            label: '打探',
            icon: 'fa-ear-listen',
            type: 'prompt',
            template: '<user>打探{Name}的情报。',
            auto_send: true,
          },
          { label: '加入', icon: 'fa-user-plus', type: 'prompt', template: '<user>申请加入{Name}。', auto_send: true },
          {
            label: '合作',
            icon: 'fa-handshake',
            type: 'prompt',
            template: '<user>向{Name}请求合作。',
            auto_send: true,
          },
        ],
      },
    ],
  };
  const getGMConfig = () => {
    const baseConfig = Store.get(STORAGE_KEY_GM_CONFIG, DEFAULT_GM_CONFIG);

    // 检查用户是否明确禁用了所有交互规则
    const activePresetId = ActionPresetManager.getActivePresetId();
    if (activePresetId === '__none__') {
      return {
        ...baseConfig,
        action_rules_disabled: true, // 标记：用户明确禁用了所有规则
      };
    }

    // 注入用户交互规则预设
    const activePreset = ActionPresetManager.getActivePreset();
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

  // 统一的结果标签样式生成函数 - 返回 CSS 类名
  const getResultBadgeClass = resultType => {
    // resultType: 'critSuccess' | 'extremeSuccess' | 'success' | 'warning' | 'failure' | 'critFailure'
    const classMap = {
      critSuccess: 'acu-result-badge acu-result-badge-crit-success',
      extremeSuccess: 'acu-result-badge acu-result-badge-extreme-success',
      success: 'acu-result-badge acu-result-badge-success',
      warning: 'acu-result-badge acu-result-badge-warning',
      failure: 'acu-result-badge acu-result-badge-failure',
      critFailure: 'acu-result-badge acu-result-badge-crit-failure',
    };
    return classMap[resultType] || classMap.failure;
  };

  // [统一] 交互选项的图标映射表，供所有渲染位置共享使用
  const ACTION_ICON_MAP: Record<string, string> = {
    // 战斗类
    战斗: 'fa-hand-fist',
    攻击: 'fa-hand-fist',
    防御: 'fa-shield',
    逃跑: 'fa-person-running',
    // 社交类
    交谈: 'fa-comments',
    对话: 'fa-comments',
    告别: 'fa-hand',
    求爱: 'fa-heart',
    邀约: 'fa-calendar-check',
    赠送: 'fa-gift',
    送礼: 'fa-gift',
    // 观察类
    观察: 'fa-eye',
    查看: 'fa-eye',
    检查: 'fa-magnifying-glass',
    // 物品操作
    使用: 'fa-hand-pointer',
    丢弃: 'fa-trash',
    装备: 'fa-shield-halved',
    卸下: 'fa-circle-xmark',
    卖出: 'fa-coins',
    购买: 'fa-shopping-cart',
    // 移动类
    前往: 'fa-walking',
    探索: 'fa-search',
    停留: 'fa-clock',
    离开: 'fa-door-open',
    // 技能类
    练习: 'fa-dumbbell',
    施展: 'fa-wand-magic-sparkles',
    凝练: 'fa-fire',
    // 任务类
    追踪: 'fa-crosshairs',
    整理: 'fa-list-check',
    放弃: 'fa-circle-xmark',
    完成: 'fa-check',
    // 组织类
    打探: 'fa-ear-listen',
    加入: 'fa-user-plus',
    合作: 'fa-handshake',
    // 表演类
    表演: 'fa-music',
    演奏: 'fa-guitar',
    唱歌: 'fa-microphone',
  };

  /**
   * 获取指定表格的默认交互动作
   *
   * [扩展点] 支持用户自定义规则，优先级：用户自定义规则 > 内置默认规则
   * 将来可通过 config.custom_action_groups 添加用户定义的表格规则
   * 例如用户可以为"神通表"定义固有选项"凝练"、"施展"
   *
   * @param tableName 表格名称（用于匹配动作组）
   * @returns 匹配的动作列表（返回副本，避免变异原配置）
   */
  const getActionsForTable = (tableName: string) => {
    const config = getGMConfig();
    if (!config.enabled) return [];

    // 如果用户明确禁用了所有规则，返回空数组
    if ((config as any).action_rules_disabled) return [];

    const lowerName = tableName.toLowerCase();

    // [扩展点] 优先检查用户自定义规则
    const customRules = (config as any).custom_action_groups || [];
    for (const group of customRules) {
      const matched = group.table_keywords.some((keyword: string) => lowerName.includes(keyword.toLowerCase()));
      if (matched) return [...(group.actions || [])]; // 返回副本
    }

    // 回退到内置默认规则
    const builtinRules = config.action_groups || [];
    for (const group of builtinRules) {
      const matched = group.table_keywords.some((keyword: string) => lowerName.includes(keyword.toLowerCase()));
      if (matched) return [...(group.actions || [])]; // 返回副本
    }

    return [];
  };

  /**
   * 获取指定行的完整交互选项列表
   * 合并逻辑：默认动作 + AI生成的自定义动作（去重）
   *
   * @param tableName 表格名称（用于匹配默认动作）
   * @param headers 表头数组
   * @param rowData 行数据数组
   * @returns 完整的动作列表（默认动作在前，自定义动作在后）
   */
  const getInteractOptionsForRow = (tableName: string, headers: unknown[], rowData: unknown[]) => {
    // 1. 获取基于表格类型的默认动作（返回副本避免变异）
    const defaultActions = [...getActionsForTable(tableName)];

    // 2. 查找"交互选项"列索引
    const interactColIdx = headers.findIndex(h => h && String(h).includes('交互'));
    if (interactColIdx < 0 || !rowData[interactColIdx]) {
      return defaultActions;
    }

    // 3. 过滤无效值
    const invalidValues = ['-', 'null', 'none', '无', '空', 'n/a', 'undefined', '/'];
    const cellValue = String(rowData[interactColIdx]).trim();
    if (!cellValue || invalidValues.includes(cellValue.toLowerCase())) {
      return defaultActions;
    }

    // 4. 解析分隔的选项
    const interactOptions = cellValue
      .split(/[,，、;；]/)
      .map(s => s.trim())
      .filter(s => s && !invalidValues.includes(s.toLowerCase()));

    if (interactOptions.length === 0) {
      return defaultActions;
    }

    // 5. 获取默认动作的标签列表，用于去重
    const existingLabels = defaultActions.map(a => a.label.toLowerCase());

    // 6. 只追加不在默认动作中的自定义选项
    const newActions = interactOptions
      .filter(opt => !existingLabels.includes(opt.toLowerCase()))
      .map(opt => ({
        label: opt,
        icon: ACTION_ICON_MAP[opt] || 'fa-hand-pointer',
        type: 'prompt',
        template: `<user>对{Name}执行互动:${opt}。`,
        auto_send: true,
      }));

    // 7. 返回合并后的数组：默认动作 + 自定义动作
    return [...defaultActions, ...newActions];
  };

  interface GlobalInteractionAction {
    label: string;
    icon?: string;
    type?: string;
    template?: string;
    auto_send?: boolean;
  }

  interface GlobalInteractionRow {
    rowIndex: number;
    title: string;
    iconName: string;
    actions: GlobalInteractionAction[];
    searchText: string;
  }

  interface GlobalInteractionGroup {
    tableKey: string;
    tableName: string;
    rows: GlobalInteractionRow[];
  }

  type GlobalInteractionSectionKind =
    | 'character'
    | 'map'
    | 'item'
    | 'equipment'
    | 'task'
    | 'skill'
    | 'faction'
    | 'generic';

  interface GlobalInteractionSection {
    kind: GlobalInteractionSectionKind;
    title: string;
    icon: string;
    order: number;
    groups: GlobalInteractionGroup[];
  }

  interface GlobalInteractionSectionMeta {
    kind: GlobalInteractionSectionKind;
    title: string;
    icon: string;
    order: number;
    keywords: string[];
  }

  interface GlobalInteractionActionRuleGroup {
    table_keywords: string[];
  }

  const GLOBAL_INTERACTION_NAME_HEADERS = [
    '名称',
    '名字',
    '姓名',
    '角色',
    '角色名',
    '角色名称',
    '人物',
    '人物名',
    '人物名称',
    '地点',
    '地点名',
    '详细地点',
    '地名',
    '物品',
    '物品名',
    '物品名称',
    '道具',
    'name',
    'title',
  ];
  const GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS = [
    '名称',
    '名字',
    '姓名',
    '角色名',
    '人物名',
    '地点',
    '地名',
    '物品名',
    '道具名',
    'name',
    'title',
  ];
  const GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS = [
    '类型',
    '定位',
    '关系',
    '身份',
    '职业',
    '阵营',
    '状态',
    '等级',
    '数值',
    '备注',
    '描述',
    '说明',
    '交互',
    '选项',
    '序号',
    '编号',
    '索引',
  ];
  const GLOBAL_INTERACTION_INDEX_HEADERS = ['序号', '编号', '索引', 'index', 'order', 'id', '#'];
  const GLOBAL_INTERACTION_DEBUG_PREFIX = '[DICE][GlobalInteractionsDebug]';
  const GLOBAL_INTERACTION_DEFAULT_SECTION_META: GlobalInteractionSectionMeta = {
    kind: 'generic',
    title: '通用',
    icon: 'fa-layer-group',
    order: 90,
    keywords: [],
  };
  const GLOBAL_INTERACTION_SECTION_METAS: GlobalInteractionSectionMeta[] = [
    {
      kind: 'character',
      title: '角色',
      icon: 'fa-user-circle',
      order: 10,
      keywords: ['主角', '角色', '人物', 'NPC', 'npc', '女主', '关键人物', '重要人物', '伙伴', '队友'],
    },
    {
      kind: 'map',
      title: '地图',
      icon: 'fa-map-location-dot',
      order: 20,
      keywords: ['地点', '地图', 'Location', 'Map', '世界', '场所', '地区', '位置', '地标', '元素'],
    },
    {
      kind: 'item',
      title: '物品',
      icon: 'fa-box-open',
      order: 30,
      keywords: ['物品', '背包', '道具', '材料', '消耗品'],
    },
    {
      kind: 'equipment',
      title: '装备',
      icon: 'fa-briefcase',
      order: 40,
      keywords: ['装备', '武器', '防具', '护甲', '饰品'],
    },
    {
      kind: 'task',
      title: '任务',
      icon: 'fa-scroll',
      order: 50,
      keywords: ['任务', '备忘', '事项', '委托', '目标'],
    },
    {
      kind: 'skill',
      title: '技能',
      icon: 'fa-wand-magic-sparkles',
      order: 60,
      keywords: ['技能', '能力', '法术', '神通'],
    },
    {
      kind: 'faction',
      title: '势力',
      icon: 'fa-shield-halved',
      order: 70,
      keywords: ['势力', '组织', '阵营', '派系'],
    },
  ];

  const debugGlobalInteraction = (event: string, details: Record<string, unknown> = {}): void => {
    const debugWindow = window as Window & { ACU_GLOBAL_INTERACTION_DEBUG?: boolean };
    if (!debugWindow.ACU_GLOBAL_INTERACTION_DEBUG) return;
    console.log(GLOBAL_INTERACTION_DEBUG_PREFIX, event, details);
  };

  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object' && !Array.isArray(value);

  const isTwoDimensionalArray = (value: unknown): value is unknown[][] =>
    Array.isArray(value) && value.every(row => Array.isArray(row));

  const normalizeInteractionLabel = (label: string): string => label.trim().toLowerCase();

  const dedupeInteractionActions = (actions: GlobalInteractionAction[]): GlobalInteractionAction[] => {
    const seenLabels = new Set<string>();
    const result: GlobalInteractionAction[] = [];

    actions.forEach(action => {
      const normalizedLabel = normalizeInteractionLabel(action.label);
      if (!normalizedLabel || seenLabels.has(normalizedLabel)) return;
      seenLabels.add(normalizedLabel);
      result.push(action);
    });

    return result;
  };

  const getStringLikeCellText = (value: unknown): string => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim();
    }
    return '';
  };

  const isPureIndexCell = (headers: unknown[], columnIndex: number, value: unknown): boolean => {
    const headerText = String(headers[columnIndex] ?? '')
      .trim()
      .toLowerCase();
    const cellText = getStringLikeCellText(value);
    return (
      GLOBAL_INTERACTION_INDEX_HEADERS.some(keyword => headerText.includes(keyword.toLowerCase())) ||
      /^\d+$/.test(cellText)
    );
  };

  const normalizeGlobalInteractionHeader = (header: unknown): string =>
    String(header ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  const isLikelyGlobalInteractionNameHeader = (header: unknown): boolean => {
    const headerText = normalizeGlobalInteractionHeader(header);
    if (!headerText) return false;
    if (GLOBAL_INTERACTION_NAME_HEADERS.some(keyword => headerText === keyword.toLowerCase())) return true;
    if (GLOBAL_INTERACTION_NON_NAME_HEADER_KEYWORDS.some(keyword => headerText.includes(keyword.toLowerCase())))
      return false;
    return GLOBAL_INTERACTION_NAME_HEADER_KEYWORDS.some(keyword => headerText.includes(keyword.toLowerCase()));
  };

  const resolveGlobalInteractionRowTitle = (headers: unknown[], rowData: unknown[], rowIndex: number): string => {
    const exactNameColumnIndex = headers.findIndex(header => {
      const headerText = normalizeGlobalInteractionHeader(header);
      return (
        Boolean(headerText) && GLOBAL_INTERACTION_NAME_HEADERS.some(keyword => headerText === keyword.toLowerCase())
      );
    });
    const nameColumnIndex =
      exactNameColumnIndex >= 0 ? exactNameColumnIndex : headers.findIndex(isLikelyGlobalInteractionNameHeader);
    const nameColumnText = nameColumnIndex >= 0 ? getStringLikeCellText(rowData[nameColumnIndex]) : '';
    if (nameColumnText) return nameColumnText;

    const firstDescriptiveCell = rowData.find((cell, columnIndex) => {
      const cellText = getStringLikeCellText(cell);
      return Boolean(cellText) && !isPureIndexCell(headers, columnIndex, cell);
    });
    const descriptiveText = getStringLikeCellText(firstDescriptiveCell);
    if (descriptiveText) return descriptiveText;

    const firstStringLikeCell = rowData.find(cell => Boolean(getStringLikeCellText(cell)));
    const fallbackText = getStringLikeCellText(firstStringLikeCell);
    return fallbackText || `第 ${rowIndex + 1} 行`;
  };

  const buildGlobalInteractionSearchText = (
    tableName: string,
    rowTitle: string,
    actions: GlobalInteractionAction[],
  ): string => {
    return [tableName, rowTitle, ...actions.map(action => action.label)].join(' ').toLowerCase();
  };

  const normalizeGlobalInteractionCategoryText = (value: unknown): string =>
    String(value ?? '')
      .trim()
      .replace(/\s+/g, '')
      .toLowerCase();

  const getGlobalInteractionRuleKeywords = (rule: unknown): string[] => {
    if (!isRecord(rule) || !Array.isArray(rule.table_keywords)) return [];
    return rule.table_keywords.map(keyword => getStringLikeCellText(keyword)).filter(Boolean);
  };

  const getGlobalInteractionActionRuleGroups = (): GlobalInteractionActionRuleGroup[] => {
    const config = getGMConfig() as {
      enabled?: boolean;
      action_rules_disabled?: boolean;
      custom_action_groups?: unknown;
      action_groups?: unknown;
    };
    if (config.enabled === false || config.action_rules_disabled) return [];

    const customRules = Array.isArray(config.custom_action_groups) ? config.custom_action_groups : [];
    const builtinRules = Array.isArray(config.action_groups) ? config.action_groups : [];
    return [...customRules, ...builtinRules]
      .map(rule => ({ table_keywords: getGlobalInteractionRuleKeywords(rule) }))
      .filter(rule => rule.table_keywords.length > 0);
  };

  const getMatchedGlobalInteractionRuleKeywords = (tableName: string): string[] => {
    const normalizedTableName = normalizeGlobalInteractionCategoryText(tableName);
    for (const rule of getGlobalInteractionActionRuleGroups()) {
      const matched = rule.table_keywords.some(keyword =>
        normalizedTableName.includes(normalizeGlobalInteractionCategoryText(keyword)),
      );
      if (matched) return rule.table_keywords;
    }
    return [];
  };

  const resolveGlobalInteractionSectionMeta = (tableName: string): GlobalInteractionSectionMeta => {
    const dashboardSectionKind = resolveDashboardGlobalInteractionSectionKind(tableName);
    if (dashboardSectionKind) {
      const dashboardMeta = GLOBAL_INTERACTION_SECTION_METAS.find(meta => meta.kind === dashboardSectionKind);
      if (dashboardMeta) return dashboardMeta;
    }

    const candidateTexts = [tableName, ...getMatchedGlobalInteractionRuleKeywords(tableName)].map(
      normalizeGlobalInteractionCategoryText,
    );
    return (
      GLOBAL_INTERACTION_SECTION_METAS.find(meta =>
        meta.keywords.some(keyword => {
          const normalizedKeyword = normalizeGlobalInteractionCategoryText(keyword);
          return candidateTexts.some(text => text.includes(normalizedKeyword));
        }),
      ) || GLOBAL_INTERACTION_DEFAULT_SECTION_META
    );
  };

  const createGlobalInteractionSections = (groups: GlobalInteractionGroup[]): GlobalInteractionSection[] => {
    const sectionByKind = new Map<GlobalInteractionSectionKind, GlobalInteractionSection>();
    groups.forEach(group => {
      const meta = resolveGlobalInteractionSectionMeta(group.tableName);
      const existingSection = sectionByKind.get(meta.kind);
      if (existingSection) {
        existingSection.groups.push(group);
        return;
      }
      sectionByKind.set(meta.kind, {
        kind: meta.kind,
        title: meta.title,
        icon: meta.icon,
        order: meta.order,
        groups: [group],
      });
    });

    return [...sectionByKind.values()].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh-CN'));
  };

  const buildGlobalInteractionGroups = (rawData: unknown): GlobalInteractionGroup[] => {
    if (!isRecord(rawData)) return [];

    const groups: GlobalInteractionGroup[] = [];
    Object.entries(rawData).forEach(([tableKey, sheet]) => {
      if (!tableKey.startsWith('sheet_') || !isRecord(sheet)) return;
      if (typeof sheet.name !== 'string' || !sheet.name.trim() || !isTwoDimensionalArray(sheet.content)) return;

      const tableName = sheet.name.trim();
      const headers = sheet.content[0] || [];
      const rows = sheet.content.slice(1).reduce<GlobalInteractionRow[]>((result, rowData, contentRowIndex) => {
        const actions = dedupeInteractionActions(getInteractOptionsForRow(tableName, headers, rowData));
        if (actions.length === 0) return result;

        const title = resolveGlobalInteractionRowTitle(headers, rowData, contentRowIndex);
        result.push({
          rowIndex: contentRowIndex,
          title,
          iconName: resolveCustomTableNameIconRowName(tableName, headers, rowData, contentRowIndex),
          actions,
          searchText: buildGlobalInteractionSearchText(tableName, title, actions),
        });
        return result;
      }, []);

      if (rows.length > 0) {
        groups.push({
          tableKey,
          tableName,
          rows,
        });
      }
    });

    return groups;
  };

  const executeTableInteractionAction = (
    action:
      | {
          label: string;
          icon?: string;
          type?: string;
          template?: string;
          auto_send?: boolean;
        }
      | undefined,
    headers: unknown[],
    rowData: unknown[],
  ) => {
    if (!action) return false;

    if (action.type === 'skill_check') {
      const skillName = String(rowData[1] ?? '技能');
      let checkValue: number | null = null;
      const attrValIdx = headers.findIndex(header => header && String(header).includes('属性值'));
      const profIdx = headers.findIndex(
        header => header && (String(header).includes('熟练') || String(header).includes('等级')),
      );

      if (attrValIdx > 0 && rowData[attrValIdx]) {
        const value = extractNumericValue(rowData[attrValIdx]);
        if (value > 0) checkValue = value;
      }
      if (checkValue === null && profIdx > 0 && rowData[profIdx]) {
        const value = extractNumericValue(rowData[profIdx]);
        if (value > 0) checkValue = value;
      }

      const promptText = processTemplate(action.template, rowData, headers);
      smartInsertToTextarea(promptText, 'action');

      if (checkValue !== null && checkValue > 0) {
        showDicePanel({
          attrValue: checkValue,
          targetValue: null,
          targetName: skillName,
          initiatorName: '<user>',
        });
      } else {
        $('#send_textarea').focus();
      }
      return true;
    }

    if (!action.template) return false;

    if (action.label === '交谈') {
      const { $ } = getCore();
      const targetName = String(rowData[1] ?? rowData[0] ?? '对方').trim() || '对方';
      const config = getConfig();
      $('.acu-msg-overlay').remove();

      const overlay = $(`
        <div class="acu-msg-overlay acu-theme-${config.theme}" role="dialog" aria-modal="true" aria-label="发送消息">
          <div class="acu-msg-dialog">
            <div class="acu-msg-title">
              <i class="fa-solid fa-comment"></i> 发送消息给 ${escapeHtml(targetName)}
            </div>
            <input type="text" id="acu-msg-input" class="acu-msg-input" placeholder="输入消息内容..." autofocus>
            <div class="acu-msg-actions">
              <button type="button" id="acu-msg-cancel" class="acu-msg-cancel">取消</button>
              <button type="button" id="acu-msg-send" class="acu-msg-send">发送</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(overlay);
      const overlayEl = overlay[0];
      overlayEl.style.setProperty('position', 'fixed', 'important');
      overlayEl.style.setProperty('top', '0', 'important');
      overlayEl.style.setProperty('left', '0', 'important');
      overlayEl.style.setProperty('right', '0', 'important');
      overlayEl.style.setProperty('bottom', '0', 'important');
      overlayEl.style.setProperty('width', '100vw', 'important');
      overlayEl.style.setProperty('height', '100vh', 'important');
      overlayEl.style.setProperty('display', 'flex', 'important');
      overlayEl.style.setProperty('justify-content', 'center', 'important');
      overlayEl.style.setProperty('align-items', 'center', 'important');
      overlayEl.style.setProperty('z-index', '31100', 'important');
      setTimeout(() => overlay.find('#acu-msg-input').focus(), 50);

      const sendMessage = () => {
        const msg = String(overlay.find('#acu-msg-input').val() || '').trim();
        if (msg) {
          smartInsertToTextarea(`<user>对${targetName}说：“${msg}”`, 'action');
          $('#send_textarea').focus();
        }
        overlay.remove();
      };

      overlay.find('#acu-msg-send').click(sendMessage);
      overlay.find('#acu-msg-input').on('keydown', function (ev) {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          sendMessage();
        }
      });
      overlay.find('#acu-msg-cancel').click(() => overlay.remove());
      setupOverlayClose(overlay, 'acu-msg-overlay', () => overlay.remove());
      return true;
    }

    const promptText = processTemplate(action.template, rowData, headers);
    smartInsertToTextarea(promptText, 'action');
    $('#send_textarea').focus();
    return true;
  };

  const isNumericCell = value => {
    if (value === null || value === undefined || value === '') return false;
    const str = String(value).trim();
    // 匹配: 纯数字、百分比、分数(50/100)、任意中文/英文标签:数字 格式
    return (
      /^-?\d+(\.\d+)?%?$/.test(str) ||
      /^\d+\/\d+$/.test(str) ||
      /^[\u4e00-\u9fa5a-zA-Z]+[:\s：]\s*\d+/i.test(str) ||
      /\d+/.test(str)
    );
  };

  const extractNumericValue = value => {
    if (!value) return 0;
    const str = String(value).trim();
    // 处理分数形式 (50/100 -> 取第一个数)
    if (/^\d+\/\d+$/.test(str)) return parseInt(str.split('/')[0], 10);
    // 处理百分比
    if (str.endsWith('%')) return parseInt(str.replace('%', ''), 10);
    // 处理 "标签:数值" 格式，提取最后一个数字
    const matches = str.match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[matches.length - 1], 10);
    }
    return 0;
  };

  const parseAttributeString = str => {
    if (!str) return [];
    const results: CharacterAttributeEntry[] = [];
    const rawStr = String(str).trim();

    // 尝试解析 JSON 格式 {"属性名":数值, ...}
    if (rawStr.startsWith('{') && rawStr.endsWith('}')) {
      try {
        const jsonObj = JSON.parse(rawStr);
        for (const key in jsonObj) {
          const val = jsonObj[key];
          if (typeof val === 'number') {
            results.push({ name: key, value: val });
          } else if (typeof val === 'string' && /^\d+$/.test(val)) {
            results.push({ name: key, value: parseInt(val, 10) });
          }
        }
        if (results.length > 0) return results;
      } catch (e) {
        // JSON 解析失败，继续用原有逻辑
      }
    }

    // 原有逻辑：解析 "属性名:数值; 属性名:数值" 格式
    const parts = rawStr.split(/[,;，；\s]+/);
    for (const part of parts) {
      const match = part.match(/^"?([\u4e00-\u9fa5a-zA-Z_]+)"?[:\s：]\s*"?(-?\d+)"?/);
      if (match) {
        results.push({ name: match[1], value: parseInt(match[2], 10) });
      }
    }
    return results;
  };
  // 解析人际关系字符串，推荐使用冒号格式，同时兼容旧式括号格式:
  // 推荐格式: "人名:关系描述;人名:关系描述" 或 "与人名:关系描述;与人名:关系描述"
  // 兼容格式: "人名(关系标签);人名(关系)"
  const parseRelationshipString = str => {
    if (!str) return [];
    const results = [];
    const rawStr = String(str).trim();

    // 按分号分割
    const parts = rawStr.split(/[;；]/);
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      // 推荐格式: "与人名:关系" 或 "与人名：关系"
      const colonMatch = trimmed.match(/^与?(.+?)[:\：](.+)$/);
      if (colonMatch) {
        const name = colonMatch[1].trim();
        const relation = colonMatch[2].trim();
        if (name && relation) {
          results.push({ name: name, relation: relation });
          continue;
        }
      }

      // 兼容旧式格式: "人名(关系)" 或 "人名（关系）"
      const parenMatch = trimmed.match(/^([^(（]+)[(（]([^)）]+)[)）]$/);
      if (parenMatch) {
        results.push({ name: parenMatch[1].trim(), relation: parenMatch[2].trim() });
        continue;
      }

      // 都不匹配，整个作为人名
      if (trimmed.length > 0) {
        results.push({ name: trimmed, relation: '' });
      }
    }
    return results;
  };

  // [新增] 检测是否是人际关系格式
  const isRelationshipCell = (value, headerName) => {
    if (!value) return false;
    const str = String(value).trim();
    const lowerHeader = (headerName || '').toLowerCase();
    // 表头包含"关系"关键词
    if (lowerHeader.includes('关系') || lowerHeader.includes('人际')) {
      return true;
    }
    // 非关系字段里常见 "名称(说明)"，单个括号不应被误判为人际关系。
    // 仅对旧式括号格式做内容兜底识别：如 "张三(朋友);李四(同事)"。
    // 冒号格式请优先放在列名包含“关系/人际”的关系列中。
    return /^[^(（;；]+[(（][^)）]+[)）](?:[;；][^(（;；]+[(（][^)）]+[)）])+$/.test(str);
  };

  const processTemplate = (template, cardData, headers) => {
    if (!template || !cardData) return template;
    let result = template;
    const name = cardData[1] || '未知';
    result = result.replace(/\{Name\}/gi, name);
    result = result.replace(/\{RowIndex\}/gi, cardData[0] || '0');
    if (headers && headers.length > 0) {
      headers.forEach((header, idx) => {
        if (header && idx < cardData.length) {
          const value = cardData[idx] || '未知';
          const regex = new RegExp(`\\{${header}\\}`, 'gi');
          result = result.replace(regex, value);
        }
      });
    }
    result = result.replace(/\{[^}]+\}/g, '未知');
    return result;
  };

  // 固定显示的功能按钮
  // 注意：保存按钮已移除，系统现在使用即时保存模式（每次编辑/删除后自动保存）
  const ACTION_BUTTONS = [
    // { id: 'acu-btn-save-global', icon: 'fa-save', title: '保存所有修改' }, // 已废弃：使用即时保存
    { id: 'acu-btn-open-editor', icon: 'fa-database', title: '打开数据库' },
    { id: 'acu-btn-open-visualizer', icon: 'fa-table-columns', title: '打开可视化表格编辑' },
    { id: 'acu-btn-collapse', icon: 'fa-chevron-down', title: '收起面板' },
    { id: 'acu-btn-refill', icon: 'fa-bolt', title: '重新填表' },
    { id: 'acu-btn-settings', icon: 'fa-cog', title: '全能设置' },
  ];
  type SpecialNavigationItem = {
    key: string;
    icon: string;
    label: string;
    id: string;
    extraClass: string;
    isActive?: boolean;
    warningIcon?: boolean;
    checkAvailable?: () => boolean;
  };
  type NavigationItem = {
    key: string;
    icon: string;
    label: string;
    isSpecial: boolean;
    id?: string;
    extraClass?: string;
    isActive?: boolean;
    warningIcon?: boolean;
  };

  let isGachaItemEditorOpen = false;

  // === 弹窗栈管理 ===
  // 用于追踪弹窗打开顺序，关闭时自动返回上一个弹窗
  type ModalEntry = {
    name: string;
    show: () => void;
  };
  const modalStack: ModalEntry[] = [];

  /**
   * 将弹窗推入栈中
   * @param name 弹窗名称（用于调试）
   * @param show 重新打开该弹窗的函数
   */
  const pushModal = (name: string, show: () => void) => {
    const current = modalStack[modalStack.length - 1];
    if (current?.name === name) {
      current.show = show;
      return;
    }
    modalStack.push({ name, show });
  };

  /**
   * 从栈中弹出当前弹窗并返回上一个弹窗
   * @returns 是否成功返回上一个弹窗
   */
  const popModal = (): boolean => {
    modalStack.pop(); // 移除当前弹窗
    const prev = modalStack.pop(); // 获取上一个弹窗
    if (prev) {
      prev.show(); // 重新打开上一个弹窗
      return true;
    }
    return false;
  };

  /**
   * 清空弹窗栈（用于关闭所有弹窗或从根弹窗关闭）
   */
  const clearModalStack = () => {
    modalStack.length = 0;
  };

  // --- 全局状态变量 ---

  // [修复] 存储待删除行的索引（按表格分组）
  let pendingDeletions: Record<string, number[]> = {};
  const getPendingDeletions = () => pendingDeletions;
  const clearPendingDeletions = () => {
    pendingDeletions = {};
  };
  const createSheetDataFingerprint = (rawData: unknown): string => {
    if (!rawData || typeof rawData !== 'object') return '';
    const tableRecord = rawData as Record<string, unknown>;
    const sheetEntries = Object.entries(tableRecord)
      .filter(([key, value]) => key.startsWith('sheet_') && value && typeof value === 'object')
      .map(([key, value]) => {
        const sheet = value as Record<string, unknown>;
        return [key, sheet.name, sheet.content];
      })
      .sort((left, right) => String(left[0]).localeCompare(String(right[0])));
    return JSON.stringify(sheetEntries);
  };

  const isSameSheetData = (leftData: unknown, rightData: unknown): boolean => {
    const leftFingerprint = createSheetDataFingerprint(leftData);
    const rightFingerprint = createSheetDataFingerprint(rightData);
    return Boolean(leftFingerprint && rightFingerprint && leftFingerprint === rightFingerprint);
  };

  const AUTO_REGEX_TRANSFORM_COOLDOWN_MS = 5000;
  let lastAutoRegexTransformKey = '';
  let lastAutoRegexTransformAt = 0;
  const createRegexRuleSignature = (rules: readonly RegexTransformationRule[]): string =>
    JSON.stringify(
      rules.map(rule => ({
        id: rule.id,
        operation: rule.operation,
        pattern: rule.pattern,
        flags: rule.flags,
        replacement: rule.replacement,
        scope: rule.scope,
        priority: rule.priority,
        executeMode: rule.executeMode,
        enabled: rule.enabled,
      })),
    );
  const createAutoRegexTransformKey = (rawData: unknown, rules: readonly RegexTransformationRule[]): string => {
    const dataFingerprint = createSheetDataFingerprint(rawData);
    if (!dataFingerprint) return '';
    return `${dataFingerprint}\n${createRegexRuleSignature(rules)}`;
  };
  const shouldSkipAutoRegexTransform = (key: string): boolean =>
    Boolean(
      key &&
      key === lastAutoRegexTransformKey &&
      Date.now() - lastAutoRegexTransformAt < AUTO_REGEX_TRANSFORM_COOLDOWN_MS,
    );
  const rememberAutoRegexTransform = (key: string): void => {
    if (!key) return;
    lastAutoRegexTransformKey = key;
    lastAutoRegexTransformAt = Date.now();
  };

  // [优化] 智能更新控制器：后端数据变动时，自动更新快照
  const UpdateController = {
    _lastValidationCount: 0,

    handleUpdate: () => {
      // === 更新拦截逻辑（检查启用了 intercept 的规则） ===
      let newData: unknown = null;
      try {
        const snapshot = loadSnapshot();
        newData = getTableData({ silent: true });
        if (snapshot && newData) {
          const rules = ValidationRuleManager.getEnabledRules();
          const violations = ValidationEngine.checkTableRules(snapshot, newData, rules);

          if (violations.length > 0) {
            console.warn('[DICE]ACU 规则拦截触发，仅标注不回滚:', violations);
            if (window.toastr) {
              window.toastr.warning(violations[0].message, '验证提示', {
                timeOut: 5000,
                positionClass: 'toast-bottom-right',
              });
            }
          }
        }
      } catch (e) {
        console.error('[DICE]ACU 拦截检查失败:', e);
      }

      if (newData && getCachedRawData() && isSameSheetData(getCachedRawData(), newData)) {
        return;
      }

      // 直接触发渲染，让 renderInterface 内部处理数据获取和差异计算
      // 注意：不要在这里更新快照！快照只在用户主动保存时更新
      renderInterface();

      // 执行实时验证
      setTimeout(() => {
        try {
          const rawData = getCachedRawData() || getTableData();
          if (rawData) {
            const errors = ValidationEngine.validateAllData(rawData);
            const newCount = errors.length;

            // 只有当错误数量增加时才弹出提示
            if (newCount > UpdateController._lastValidationCount && newCount > 0) {
              // 错误数量已增加
            }

            UpdateController._lastValidationCount = newCount;

            // 更新导航栏指示器
            updateValidationIndicator(newCount);
          }
        } catch (e) {
          console.error('[DICE]ACU 验证执行失败:', e);
        }
      }, 100);
    },
  };

  // 更新导航栏验证指示器
  const updateValidationIndicator = count => {
    const { $ } = getCore();
    const $indicator = $('.acu-validation-indicator');

    if (count > 0) {
      if ($indicator.length) {
        $indicator.find('.acu-validation-count').text(count);
        $indicator.show();
      }
    } else {
      $indicator.hide();
    }
  };

  // --- [重构] 上下文指纹工具 ---
  const getCurrentContextFingerprint = () => {
    try {
      // 方式1: 酒馆标准 API
      if (typeof SillyTavern !== 'undefined' && SillyTavern.getCurrentChatId) {
        return SillyTavern.getCurrentChatId();
      }
      // 方式2: 直接访问属性
      if (typeof SillyTavern !== 'undefined' && SillyTavern.chatId) {
        return SillyTavern.chatId;
      }
      // 方式3: 父窗口 (iframe 场景)
      if (window.parent?.SillyTavern?.getCurrentChatId) {
        return window.parent.SillyTavern.getCurrentChatId();
      }
    } catch (e) {
      console.warn('[DICE]ACU getCurrentContextFingerprint error:', e);
    }
    return 'unknown_context';
  };

  // 全局状态追踪 (已清理死代码)

  const DEFAULT_CONFIG = {
    layout: 'horizontal',
    collapseStyle: 'bar',
    collapseAlign: 'right',
    fontFamily: 'default',
    theme: 'native',
    cardWidth: 260,
    fontSize: 13,
    highlightNew: true,
    itemsPerPage: 50,
    actionsPosition: 'bottom',
    gridColumns: 'auto', // [修改] 默认为智能自动列数
    desktopNavAligned: false,
    showHorizontalScrollbar: true,
    positionMode: 'fixed', // fixed=悬浮底部, embedded=跟随消息, viewport=固定底部
    showOptionPanel: true, // [新增] 显示选项面板
    clickOptionToAutoSend: true, // [新增] 点击选项自动发送
    optionFontSize: 12, // [新增] 选项面板独立字体大小
    navFontSize: 13,
    floatingCollapsePosition: null as null | { left: number; top: number },
    muteDatabaseToasts: false,
    dialogueIndentEnabled: false,
    dialogueIndentStrategy: 'conservative',
  };

  const COLLAPSE_STYLES = ['bar', 'pill', 'floating'] as const;
  type CollapseStyle = (typeof COLLAPSE_STYLES)[number];

  const normalizeCollapseStyle = (value: unknown): CollapseStyle => {
    const style = String(value || '').trim();
    if (style === 'mini') return 'floating';
    return COLLAPSE_STYLES.includes(style as CollapseStyle) ? (style as CollapseStyle) : 'bar';
  };

  const getNavigationFontMetrics = (size: unknown) => {
    const rawFontSize = typeof size === 'number' && Number.isFinite(size) ? size : DEFAULT_CONFIG.navFontSize;
    const fontSize = Math.max(10, Math.min(20, Math.round(rawFontSize)));

    return {
      fontSize,
      buttonSize: Math.max(28, Math.min(48, Math.round(fontSize * 2.46))),
      iconSize: Math.max(14, Math.min(22, Math.round(fontSize * 1.08))),
      paddingX: Math.max(10, Math.min(20, Math.round(fontSize * 0.92))),
    };
  };

  const FONTS = [
    { id: 'default', name: '系统默认 (Modern)', val: `'Segoe UI', 'Microsoft YaHei', sans-serif` },
    { id: 'hanchan', name: '寒蝉全圆体', val: `"寒蝉全圆体", sans-serif` },
    { id: 'maple', name: 'Maple Mono (代码风)', val: `"Maple Mono NF CN", monospace` },
    { id: 'huiwen', name: '汇文明朝体 (Huiwen)', val: `"Huiwen-mincho", serif` },
    { id: 'cooper', name: 'Cooper正楷', val: `"CooperZhengKai", serif` },
    { id: 'yffyt', name: 'YFFYT (艺术体)', val: `"YFFYT", sans-serif` },
    { id: 'fusion', name: 'Fusion Pixel (像素风)', val: `"Fusion Pixel 12px M latin", monospace` },
    { id: 'wenkai', name: '霞鹜文楷 (WenKai)', val: `"LXGW WenKai", serif` },
    { id: 'notosans', name: '思源黑体 (Noto Sans)', val: `"Noto Sans CJK", sans-serif` },
    { id: 'zhuque', name: '朱雀仿宋 (Zhuque)', val: `"Zhuque Fangsong (technical preview)", serif` },
  ];

  // 主题维护提示：这里控制设置界面的骰子系统主题选项。
  // 新增、改名或改 theme id 时，同步更新 外部参考/数据库主题/acu-db-theme-dice-<theme-id>.json
  // 的文件名、theme.id 和 theme.name，避免数据库本体主题与骰子系统主题脱节。
  const THEMES = [
    { id: 'native', name: '跟随酒馆 (Adaptive)', icon: 'fa-circle-half-stroke' },
    { id: 'retro', name: '复古羊皮 (Retro)', icon: 'fa-scroll' },
    { id: 'dark', name: '极夜深空 (Dark)', icon: 'fa-moon' },
    { id: 'modern', name: '现代清爽 (Modern)', icon: 'fa-sun' },
    { id: 'forest', name: '森之物语 (Forest)', icon: 'fa-tree' },
    { id: 'ocean', name: '深海幽蓝 (Ocean)', icon: 'fa-water' },
    { id: 'cyber', name: '赛博霓虹 (Cyber)', icon: 'fa-bolt' },
    { id: 'nightowl', name: '深蓝磨砂 (Night Owl)', icon: 'fa-feather' },
    { id: 'sakura', name: '暖粉手账 (Warm Pink)', icon: 'fa-heart' },
    { id: 'minepink', name: '量产地雷 (Mine Pink)', icon: 'fa-skull' },
    { id: 'galgame', name: '粉梦物语 (Galgame Pink)', icon: 'fa-heart' },
    { id: 'purple', name: '紫罗兰梦 (Purple)', icon: 'fa-gem' },
    { id: 'wechat', name: '绿色泡泡 (Green Bubble)', icon: 'fa-weixin' },
    { id: 'educational', name: '学习资料 (Educational)', icon: 'fa-book' },
    { id: 'vaporwave', name: '霓虹怀旧 (Vaporwave)', icon: 'fa-palette' },
    { id: 'classicpackaging', name: '经典包装 (Classic Packaging)', icon: 'fa-box' },
    { id: 'terminal', name: '终端绿屏 (Terminal)', icon: 'fa-terminal' },
    { id: 'dreamcore', name: '梦核迷离 (Dreamcore)', icon: 'fa-cloud-moon' },
    { id: 'aurora', name: '极光幻境 (Aurora)', icon: 'fa-snowflake' },
    { id: 'chouten', name: '幻夜霓虹 (Cyber Kawaii)', icon: 'fa-star' },
  ];

  // [优化] 缓存 core 对象 (修复竞态条件 + 增强 ST 穿透查找)
  let _coreCache = null;

  const getAccessibleDocument = (targetWindow: Window | null | undefined): Document | null => {
    if (!targetWindow) return null;
    try {
      return targetWindow.document || null;
    } catch {
      return null;
    }
  };

  const HOST_SELECTOR = '#chat, #send_form, #form_sheld, #send_textarea, #chat_input, #send_but';

  const getTavernHostWindow = (): Window => {
    const windows: Window[] = [];
    const addWindow = (targetWindow: Window | null | undefined) => {
      if (!targetWindow || windows.includes(targetWindow)) return;
      if (!getAccessibleDocument(targetWindow)) return;
      windows.push(targetWindow);
    };

    addWindow(window);

    try {
      let cursor = window;
      while (cursor.parent && cursor.parent !== cursor) {
        const parentWindow = cursor.parent;
        if (!getAccessibleDocument(parentWindow)) break;
        addWindow(parentWindow);
        cursor = parentWindow;
      }
    } catch {
      // 跨域或宿主限制时保留已收集的窗口
    }

    try {
      addWindow(window.top);
    } catch {
      // ignore
    }

    const hasVisibleHostAnchor = (targetWindow: Window): boolean => {
      const doc = getAccessibleDocument(targetWindow);
      if (!doc) return false;

      const viewportWidth = targetWindow.innerWidth || doc.documentElement.clientWidth || 0;
      const viewportHeight = targetWindow.innerHeight || doc.documentElement.clientHeight || 0;
      const anchors = Array.from(doc.querySelectorAll<HTMLElement>(HOST_SELECTOR));

      return anchors.some(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return false;
        if (viewportWidth > 0 && (rect.right <= 0 || rect.left >= viewportWidth)) return false;
        if (viewportHeight > 0 && (rect.bottom <= 0 || rect.top >= viewportHeight)) return false;
        return true;
      });
    };

    for (let i = windows.length - 1; i >= 0; i--) {
      if (hasVisibleHostAnchor(windows[i])) {
        return windows[i];
      }
    }

    for (let i = windows.length - 1; i >= 0; i--) {
      const doc = getAccessibleDocument(windows[i]);
      if (doc?.querySelector(HOST_SELECTOR)) {
        return windows[i];
      }
    }

    return windows[windows.length - 1] || window;
  };

  const getTavernHostDocument = (): Document => getAccessibleDocument(getTavernHostWindow()) || document;

  const createElementFromHtml = (targetDocument: Document, html: string): HTMLElement | null => {
    const template = targetDocument.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild as HTMLElement | null;
  };

  const collectHostAndLocalNodes = <T extends Element>(selector: string): T[] => {
    const nodes = new Set<T>();
    getTavernHostDocument()
      .querySelectorAll<T>(selector)
      .forEach(node => nodes.add(node));
    document.querySelectorAll<T>(selector).forEach(node => nodes.add(node));
    return Array.from(nodes);
  };

  const getCore = () => {
    const w = getTavernHostWindow();
    // 动态获取 jQuery
    const $ = w.jQuery || window.jQuery;

    // 只有当缓存存在且宿主窗口/jQuery 仍一致时才复用，避免移动端多层 iframe 下拿到旧 document
    if (_coreCache && _coreCache.$ && _coreCache.hostWindow === w && _coreCache.$ === $) return _coreCache;

    const core = {
      $: $,
      hostWindow: w,
      getDB: () => w.AutoCardUpdaterAPI || window.AutoCardUpdaterAPI,
      clipboard: w.navigator?.clipboard || window.navigator.clipboard,
      // 增强查找：依次尝试 当前窗口 -> 父窗口 -> 顶层窗口 (带跨域保护)
      ST:
        w.SillyTavern ||
        window.SillyTavern ||
        (() => {
          try {
            return window.top ? window.top.SillyTavern : null;
          } catch (e) {
            return null;
          }
        })(),
    };

    // 只有成功获取到 jQuery 后才锁定缓存，防止初始化过早导致永久失效
    if ($) _coreCache = core;
    return core;
  };

  const ACU_DATABASE_NEW_UI_MENU_SELECTOR = '#acu-v2-menu-item';
  const ACU_DATABASE_NEW_UI_API_METHODS = [
    'openApp',
    'openMain',
    'openNewUI',
    'openNewUi',
    'openUi',
    'openUI',
    'openShell',
    'showApp',
  ];
  const ACU_DATABASE_MANUAL_UPDATE_API_METHODS = [
    'manualUpdate',
    'runManualUpdate',
    'startManualUpdate',
    'triggerManualUpdate',
  ];
  const ACU_DATABASE_V2_ROOT_SELECTOR = '#acu-app-v2, .acu-v2-app';
  const ACU_DATABASE_FORM_FILL_NAV_SELECTOR = '[data-page-id="form-fill"]';
  const ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR = '#form-fill-manual-panel';
  const ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR =
    '#form-fill-manual-panel button, .acu-v2-form-fill-page__actions button, button.acu-btn--primary';
  const ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR = '[id$="-manual-update-card"]';
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS = 1800;
  const ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS = 120;

  const collectAccessibleRuntimeWindows = (): Window[] => {
    const windows: Window[] = [];
    const queuedWindows: Window[] = [];
    const visitedWindows = new Set<Window>();

    const addWindow = (targetWindow: Window | null | undefined) => {
      if (!targetWindow || visitedWindows.has(targetWindow)) return;
      if (!getAccessibleDocument(targetWindow)) return;
      visitedWindows.add(targetWindow);
      windows.push(targetWindow);
      queuedWindows.push(targetWindow);
    };

    addWindow(window);
    try {
      addWindow(getTavernHostWindow());
    } catch {
      // ignore host lookup failures
    }

    try {
      let cursor = window;
      while (cursor.parent && cursor.parent !== cursor) {
        const parentWindow = cursor.parent;
        if (!getAccessibleDocument(parentWindow)) break;
        addWindow(parentWindow);
        cursor = parentWindow;
      }
    } catch {
      // 跨域或宿主限制时保留已收集的窗口
    }

    try {
      addWindow(window.top);
    } catch {
      // ignore
    }

    for (let index = 0; index < queuedWindows.length; index++) {
      const targetWindow = queuedWindows[index];

      try {
        for (let frameIndex = 0; frameIndex < targetWindow.frames.length; frameIndex++) {
          addWindow(targetWindow.frames[frameIndex]);
        }
      } catch {
        // ignore inaccessible child frames
      }

      const targetDocument = getAccessibleDocument(targetWindow);
      targetDocument?.querySelectorAll<HTMLIFrameElement>('iframe').forEach(frame => {
        try {
          addWindow(frame.contentWindow);
        } catch {
          // ignore inaccessible iframe content windows
        }
      });
    }

    return windows;
  };

  const runMaybeAsyncDatabaseUiOpener = async (opener: () => unknown, context = '数据库界面'): Promise<boolean> => {
    try {
      const result = opener();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        const resolved = await result;
        return resolved !== false;
      }
      return result !== false;
    } catch (error) {
      console.warn(`[DICE]打开${context}失败:`, error);
      return false;
    }
  };

  const openDatabaseNewUiViaApi = async (): Promise<boolean> => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (!api || typeof api !== 'object') continue;

      for (const methodName of ACU_DATABASE_NEW_UI_API_METHODS) {
        const method = api[methodName];
        if (typeof method !== 'function') continue;
        const opened = await runMaybeAsyncDatabaseUiOpener(() => method.call(api), '数据库新 UI 入口');
        if (opened) return true;
      }
    }

    return false;
  };

  const openDatabaseNewUiViaMenuEntry = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      const menuItem = targetDocument?.querySelector<HTMLElement>(ACU_DATABASE_NEW_UI_MENU_SELECTOR);
      if (!menuItem || typeof menuItem.click !== 'function') continue;

      menuItem.click();
      return true;
    }

    return false;
  };

  const openLegacyDatabaseSettings = (): boolean => {
    const api = getCore().getDB();
    if (api && typeof api.openSettings === 'function') {
      api.openSettings();
      return true;
    }
    return false;
  };

  const openDatabaseInterface = async (): Promise<void> => {
    if (await openDatabaseNewUiViaApi()) return;
    if (openDatabaseNewUiViaMenuEntry()) return;
    if (openLegacyDatabaseSettings()) return;

    if (window.toastr) {
      window.toastr.warning('数据库脚本未就绪或版本过低，无法打开数据库界面');
    }
  };

  type DatabaseVisualizerNewUiOpenResult = 'opened' | 'unavailable' | 'failed';

  const openDatabaseVisualizerNewUiViaApi = async (): Promise<DatabaseVisualizerNewUiOpenResult> => {
    let hasNewUiVisualizerApi = false;

    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (!api || typeof api.openVisualizer !== 'function') continue;
      hasNewUiVisualizerApi = true;
      const opened = await runMaybeAsyncDatabaseUiOpener(
        () => api.openVisualizer.call(api),
        '新版可视化表格编辑器',
      );
      if (opened) return 'opened';
    }

    return hasNewUiVisualizerApi ? 'failed' : 'unavailable';
  };

  const openLegacyDatabaseVisualizer = async (): Promise<boolean> => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterAPI;
      if (api && typeof api.openVisualizer === 'function') {
        const opened = await runMaybeAsyncDatabaseUiOpener(() => api.openVisualizer.call(api), '旧版可视化表格编辑器');
        if (opened) return true;
      }

      const legacyGlobal = (targetWindow as any).openNewVisualizer_ACU;
      if (typeof legacyGlobal === 'function') {
        const opened = await runMaybeAsyncDatabaseUiOpener(() => legacyGlobal.call(targetWindow), '旧版可视化表格编辑器');
        if (opened) return true;
      }
    }

    return false;
  };

  const openDatabaseVisualizerInterface = async (): Promise<void> => {
    const newUiOpenResult = await openDatabaseVisualizerNewUiViaApi();
    if (newUiOpenResult === 'opened') return;
    if (newUiOpenResult === 'unavailable' && (await openLegacyDatabaseVisualizer())) return;

    if (window.toastr) {
      const message =
        newUiOpenResult === 'failed'
          ? '新版可视化编辑器入口调用失败，请检查数据库本体控制台日志'
          : '可视化编辑器接口不可用，请确保数据库脚本已加载';
      window.toastr.warning(message);
    }
  };

  type DatabaseManualUpdateResult =
    | { status: 'updated'; source: string }
    | { status: 'unavailable' }
    | { status: 'failed'; error?: unknown; source?: string };

  const waitForDatabaseUiTick = (ms = 120): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

  const isElementVisibleInLayout = (element: HTMLElement): boolean => {
    const targetWindow = element.ownerDocument.defaultView || window;
    const style = targetWindow.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  };

  const normalizeDatabaseUiText = (text: string | null | undefined): string =>
    String(text || '')
      .replace(/\s+/g, ' ')
      .trim();

  const isDatabaseManualUpdateButtonText = (text: string): boolean =>
    text.includes('执行手动填表') || text.includes('交火索引已启用');

  const isDatabaseManualUpdateActionButton = (button: HTMLButtonElement): boolean => {
    const buttonText = normalizeDatabaseUiText(button.textContent);
    if (isDatabaseManualUpdateButtonText(buttonText)) return true;

    const inManualPanel = !!button.closest(ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR);
    const inManualActions = !!button.closest('.acu-v2-form-fill-page__actions');
    return inManualPanel && inManualActions;
  };

  const isDatabaseButtonDisabled = (button: HTMLButtonElement): boolean =>
    button.disabled || button.getAttribute('aria-disabled') === 'true';

  const hasDatabaseNewUiRuntime = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const api = (targetWindow as any).AutoCardUpdaterV2API;
      if (api && typeof api === 'object') return true;

      const targetDocument = getAccessibleDocument(targetWindow);
      if (targetDocument?.querySelector(ACU_DATABASE_V2_ROOT_SELECTOR)) return true;
      if (targetDocument?.querySelector(ACU_DATABASE_NEW_UI_MENU_SELECTOR)) return true;
    }

    return false;
  };

  const findDatabaseNewUiManualUpdateButton = ():
    | { status: 'found'; button: HTMLButtonElement }
    | { status: 'disabled'; text: string }
    | { status: 'unavailable' } => {
    let disabledButtonText = '';

    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      if (!targetDocument) continue;

      const rawButtons = Array.from(
        targetDocument.querySelectorAll<HTMLButtonElement>(ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR),
      );
      const candidateButtons = rawButtons.filter(
        button => isElementVisibleInLayout(button) && isDatabaseManualUpdateActionButton(button),
      );

      const manualButton =
        candidateButtons.find(button => {
          const text = normalizeDatabaseUiText(button.textContent);
          return !isDatabaseButtonDisabled(button) && text.includes('执行手动填表');
        }) ||
        candidateButtons.find(button => {
          const text = normalizeDatabaseUiText(button.textContent);
          return !isDatabaseButtonDisabled(button) && text.includes('交火索引已启用');
        }) ||
        candidateButtons.find(button => !isDatabaseButtonDisabled(button));

      if (manualButton) return { status: 'found', button: manualButton };

      const disabledButton = candidateButtons.find(button => isDatabaseButtonDisabled(button));
      if (disabledButton) {
        const buttonText = normalizeDatabaseUiText(disabledButton.textContent);
        disabledButtonText = buttonText || '执行手动填表';
        continue;
      }
    }

    return disabledButtonText ? { status: 'disabled', text: disabledButtonText } : { status: 'unavailable' };
  };

  const waitForDatabaseNewUiManualUpdateButton = async (
    timeoutMs = ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS,
  ): Promise<ReturnType<typeof findDatabaseNewUiManualUpdateButton>> => {
    const deadline = Date.now() + timeoutMs;
    let latestDisabledText = '';

    do {
      const buttonResult = findDatabaseNewUiManualUpdateButton();
      if (buttonResult.status === 'found') return buttonResult;
      if (buttonResult.status === 'disabled') latestDisabledText = buttonResult.text;

      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() < deadline);

    return latestDisabledText ? { status: 'disabled', text: latestDisabledText } : { status: 'unavailable' };
  };

  const hasDatabaseManualUpdateSurface = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      if (!targetDocument) continue;

      const panel = targetDocument.querySelector<HTMLElement>(ACU_DATABASE_MANUAL_UPDATE_PANEL_SELECTOR);
      if (panel && isElementVisibleInLayout(panel)) return true;

      const manualButton = Array.from(
        targetDocument.querySelectorAll<HTMLButtonElement>(ACU_DATABASE_MANUAL_UPDATE_ACTION_SELECTOR),
      ).find(button => isElementVisibleInLayout(button) && isDatabaseManualUpdateActionButton(button));
      if (manualButton) return true;
    }

    return false;
  };

  const waitForDatabaseManualUpdateSurface = async (timeoutMs = ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS) => {
    const start = Date.now();

    do {
      if (hasDatabaseManualUpdateSurface()) return true;

      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() - start < timeoutMs);

    return false;
  };

  const clickDatabaseNewUiFormFillNavigation = (): boolean => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      const navButton = targetDocument?.querySelector<HTMLElement>(ACU_DATABASE_FORM_FILL_NAV_SELECTOR);
      if (!navButton || typeof navButton.click !== 'function') continue;
      if (!isElementVisibleInLayout(navButton)) continue;

      navButton.click();
      return true;
    }

    return false;
  };

  const openDatabaseFormFillPage = async (): Promise<boolean> => {
    if (clickDatabaseNewUiFormFillNavigation()) {
      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
      if (await waitForDatabaseManualUpdateSurface(480)) return true;
    }

    const opened = (await openDatabaseNewUiViaApi()) || openDatabaseNewUiViaMenuEntry();
    if (!opened && !hasDatabaseNewUiRuntime()) return false;

    const deadline = Date.now() + ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS;
    do {
      if (clickDatabaseNewUiFormFillNavigation()) {
        await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
        if (await waitForDatabaseManualUpdateSurface(480)) return true;
      }
      await waitForDatabaseUiTick(ACU_DATABASE_MANUAL_UPDATE_BUTTON_POLL_MS);
    } while (Date.now() < deadline);

    return waitForDatabaseManualUpdateSurface(ACU_DATABASE_MANUAL_UPDATE_BUTTON_WAIT_MS);
  };

  const runDatabaseManualUpdateViaNewUiButton = async (): Promise<DatabaseManualUpdateResult> => {
    let buttonResult = await waitForDatabaseNewUiManualUpdateButton(360);

    if (buttonResult.status === 'unavailable' && (await openDatabaseFormFillPage())) {
      buttonResult = await waitForDatabaseNewUiManualUpdateButton();
    }

    if (buttonResult.status === 'found') {
      buttonResult.button.click();
      return { status: 'updated', source: '新版填表工作台按钮' };
    }

    if (buttonResult.status === 'disabled') {
      return {
        status: 'failed',
        source: '新版填表工作台按钮',
        error: `新版填表工作台的「${buttonResult.text}」按钮当前不可用，请先选择至少一张表，或等待当前填表完成。`,
      };
    }

    return { status: 'unavailable' };
  };

  const runMaybeAsyncDatabaseManualUpdate = async (
    updater: () => unknown,
    source: string,
  ): Promise<DatabaseManualUpdateResult> => {
    try {
      const result = updater();
      if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
        const resolved = await result;
        return resolved === false ? { status: 'failed', source } : { status: 'updated', source };
      }
      return result === false ? { status: 'failed', source } : { status: 'updated', source };
    } catch (error) {
      console.warn(`[DICE]${source}调用失败:`, error);
      return { status: 'failed', error, source };
    }
  };

  const runDatabaseManualUpdateViaApi = async (options?: {
    includeLegacyApi?: boolean;
  }): Promise<DatabaseManualUpdateResult> => {
    let failedResult: DatabaseManualUpdateResult | null = null;
    const includeLegacyApi = options?.includeLegacyApi !== false;

    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const apiEntries = [
        { source: '新版数据库 manualUpdate API', api: (targetWindow as any).AutoCardUpdaterV2API },
        ...(includeLegacyApi
          ? [{ source: '旧版数据库 manualUpdate API', api: (targetWindow as any).AutoCardUpdaterAPI }]
          : []),
      ];

      for (const { source, api } of apiEntries) {
        if (!api || typeof api !== 'object') continue;

        for (const methodName of ACU_DATABASE_MANUAL_UPDATE_API_METHODS) {
          const method = api[methodName];
          if (typeof method !== 'function') continue;

          const result = await runMaybeAsyncDatabaseManualUpdate(() => method.call(api), `${source}.${methodName}`);
          if (result.status === 'updated') return result;
          failedResult = result;
        }
      }
    }

    return failedResult || { status: 'unavailable' };
  };

  const runDatabaseManualUpdateViaLegacyButton = (): DatabaseManualUpdateResult => {
    for (const targetWindow of collectAccessibleRuntimeWindows()) {
      const targetDocument = getAccessibleDocument(targetWindow);
      const manualUpdateButton = targetDocument?.querySelector<HTMLElement>(
        ACU_DATABASE_LEGACY_MANUAL_UPDATE_BUTTON_SELECTOR,
      );
      if (!manualUpdateButton || typeof manualUpdateButton.click !== 'function') continue;

      manualUpdateButton.click();
      return { status: 'updated', source: '旧版数据库设置面板手动填表按钮' };
    }

    return { status: 'unavailable' };
  };

  const runDatabaseManualUpdate = async (): Promise<DatabaseManualUpdateResult> => {
    const newUiApiResult = await runDatabaseManualUpdateViaApi({ includeLegacyApi: false });
    if (newUiApiResult.status !== 'unavailable') return newUiApiResult;

    const newUiButtonResult = await runDatabaseManualUpdateViaNewUiButton();
    if (newUiButtonResult.status !== 'unavailable') return newUiButtonResult;

    const legacyApiResult = await runDatabaseManualUpdateViaApi({ includeLegacyApi: true });
    if (legacyApiResult.status === 'updated') return legacyApiResult;

    const legacyButtonResult = runDatabaseManualUpdateViaLegacyButton();
    if (legacyButtonResult.status === 'updated') return legacyButtonResult;

    if (hasDatabaseNewUiRuntime()) {
      return {
        status: 'failed',
        source: '新版填表工作台',
        error: '已检测到新版数据库 UI，但没有找到可执行的「执行手动填表」按钮。请先打开数据库的「填表工作台」页面并确认已选择表格。',
      };
    }

    return legacyApiResult.status === 'unavailable' ? legacyButtonResult : legacyApiResult;
  };

  const getDatabaseManualUpdateErrorMessage = (error: unknown, fallback: string): string => {
    if (error instanceof Error && error.message) return error.message;
    if (typeof error === 'string' && error.trim()) return error;
    return fallback;
  };

  const showDatabaseManualUpdateFailure = (title: string, message: string): void => {
    if (window.toastr) {
      showActionableErrorToast(`${title}: ${message}`, {
        title,
        developerHint: true,
        toastrOptions: { timeOut: 5000 },
      });
      return;
    }

    void showDiceSystemConfirmDialog({
      title,
      message,
      iconClass: 'fa-triangle-exclamation',
      confirmText: '知道了',
      tone: 'danger',
      hideCancel: true,
    });
  };

  const updateSaveButtonState = () => {
    const { $ } = getCore();
    const $btn = $('#acu-btn-save-global');
    const $icon = $btn.find('i');
    const deletions = getPendingDeletions();
    let hasDeletions = false;
    if (deletions) {
      for (const key in deletions) {
        if (deletions[key] && deletions[key].length > 0) {
          hasDeletions = true;
          break;
        }
      }
    }
    if (getHasUnsavedChanges() || hasDeletions) {
      $icon.addClass('acu-icon-breathe');
      $btn.attr('title', '你有未保存的手动修改或删除操作');
    } else {
      $icon.removeClass('acu-icon-breathe');
      $btn.attr('title', '保存');
      $btn.css('color', '');
    }
  };

  const getIconForTableName = name => {
    if (!name) return 'fa-table';
    const n = name.toLowerCase();
    if (n.includes('主角') || n.includes('角色')) return 'fa-user-circle';
    if (n.includes('通用') || n.includes('全局')) return 'fa-globe-asia';
    if (n.includes('装扮') || n.includes('服装') || n.includes('外观')) return 'fa-shirt';
    if (n.includes('装备') || n.includes('背包')) return 'fa-briefcase';
    if (n.includes('技能') || n.includes('武魂')) return 'fa-dragon';
    if (n.includes('恋爱日记') || n.includes('日记')) return 'fa-book-open';
    if (n.includes('恋爱对象') || n.includes('恋爱')) return 'fa-heart';
    if (n.includes('关系') || n.includes('周边')) return 'fa-user-friends';
    if (n.includes('备忘') || n.includes('便签')) return 'fa-note-sticky';
    if (n.includes('任务') || n.includes('日志')) return 'fa-scroll';
    if (n.includes('人物') || n.includes('关键人物')) return 'fa-address-book';
    if (n.includes('纪要')) return 'fa-clipboard-list';
    if (n.includes('总结') || n.includes('大纲')) return 'fa-book-reader';
    if (n.includes('地图点') || n.includes('世界地图')) return 'fa-map-location-dot';
    if (n.includes('地图元素') || n.includes('机关') || n.includes('线索')) return 'fa-bullseye';
    if (n.includes('势力') || n.includes('阵营')) return 'fa-shield-halved';
    if (n.includes('物品')) return 'fa-gem';
    if (n.includes('情报') || n.includes('信息')) return 'fa-file-lines';
    if (n.includes('检定建议')) return 'fa-dice-d20';
    if (n.includes('选项')) return 'fa-list-check';
    return 'fa-table';
  };

  type CustomTableNameIconModuleId =
    | 'table-name'
    | 'item'
    | 'equipment'
    | 'faction'
    | 'global-interaction-panel'
    | 'global-interaction-map-marker'
    | 'shop'
    | 'avatar-manager'
    | 'relationship-graph'
    | 'map-character-node'
    | 'character-interaction-panel'
    | 'alias-resolution'
    | 'user-graph-resolution';

  type CustomTableNameIconSection =
    | 'table'
    | 'map'
    | 'item'
    | 'equipment'
    | 'faction'
    | 'shop'
    | 'task'
    | 'skill'
    | 'generic'
    | 'character'
    | 'relationship'
    | 'alias'
    | 'user';

  interface CustomTableNameIconContext {
    moduleId: CustomTableNameIconModuleId;
    tableName: string;
    section: CustomTableNameIconSection;
    name: string;
  }

  type CustomTableNameIconSourceType = 'url' | 'local';

  type CustomTableNameIconInvalidSourceReason =
    | 'invalid_url'
    | 'invalid_protocol'
    | 'svg_url'
    | 'svg_mime'
    | 'unsupported_mime'
    | 'oversize';

  const CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION = 1;

  interface CustomTableNameIconEntry extends CustomTableNameIconContext {
    sourceType: CustomTableNameIconSourceType;
    imageUrl: string;
    localIconKey: string | null;
    imageMimeType: string | null;
    imageSize: number | null;
    createdAt: number;
    updatedAt: number;
  }

  interface CustomTableNameIconPackEntryMetadata {
    imageMimeType: string | null;
    imageSize: number | null;
    missingLocalBinary?: boolean;
    originalLocalKey?: string | null;
  }

  interface CustomTableNameIconPackEntry extends CustomTableNameIconContext {
    sourceType: CustomTableNameIconSourceType;
    url?: string;
    localKey?: string | null;
    metadata: CustomTableNameIconPackEntryMetadata;
  }

  interface CustomTableNameIconPack {
    schemaVersion: number;
    exportedAt: string;
    entries: CustomTableNameIconPackEntry[];
  }

  interface CustomTableNameIconPackImportAnalysis {
    entriesToImport: CustomTableNameIconEntry[];
    importedCount: number;
    overwrittenCount: number;
    skippedInvalidUrlCount: number;
    skippedNonWhitelistCount: number;
    skippedInvalidEntryCount: number;
    localMissingCount: number;
  }

  interface ResolvedCustomTableNameIcon {
    icon: string;
    entry: CustomTableNameIconEntry | null;
    key: string | null;
    sourceType: CustomTableNameIconSourceType | null;
    imageUrl: string | null;
    localIconKey: string | null;
    assetUrl: string | null;
    reason: 'invalid' | 'invalid_source' | 'not_whitelisted' | 'missing' | 'resolved';
  }

  interface CustomTableNameIconImageRecord {
    key: string;
    blob: Blob;
    size: number;
    type: string;
    updatedAt: number;
  }

  type DashboardCustomTableNameIconContextInfo = {
    moduleId: CustomTableNameIconModuleId;
    section: CustomTableNameIconSection;
  };

  const DASHBOARD_MODULE_SECTION_KIND: Record<string, GlobalInteractionSectionKind> = {
    player: 'character',
    npc: 'character',
    location: 'map',
    bag: 'item',
    equip: 'equipment',
    quest: 'task',
    skill: 'skill',
  };

  const CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS: Record<string, DashboardCustomTableNameIconContextInfo> = {
    location: { moduleId: 'global-interaction-map-marker', section: 'map' },
    bag: { moduleId: 'item', section: 'item' },
    equip: { moduleId: 'equipment', section: 'equipment' },
    quest: { moduleId: 'global-interaction-panel', section: 'task' },
    skill: { moduleId: 'global-interaction-panel', section: 'skill' },
  };

  const getDashboardModuleKeysForTableName = (tableName: string): string[] => {
    const normalizedTableName = normalizeGlobalInteractionCategoryText(tableName);
    if (!normalizedTableName) return [];

    return Object.entries(getDashboardRuntimeConfig())
      .filter(([, moduleConfig]) =>
        moduleConfig.tableKeywords.some(keyword =>
          normalizedTableName.includes(normalizeGlobalInteractionCategoryText(keyword)),
        ),
      )
      .map(([moduleKey]) => moduleKey);
  };

  const resolveDashboardGlobalInteractionSectionKind = (tableName: string): GlobalInteractionSectionKind | null => {
    for (const moduleKey of getDashboardModuleKeysForTableName(tableName)) {
      const sectionKind = DASHBOARD_MODULE_SECTION_KIND[moduleKey];
      if (sectionKind) return sectionKind;
    }
    return null;
  };

  const resolveDashboardCustomTableNameIconContextInfo = (
    tableName: string,
  ): DashboardCustomTableNameIconContextInfo | null => {
    for (const moduleKey of getDashboardModuleKeysForTableName(tableName)) {
      const contextInfo = CUSTOM_TABLE_NAME_ICON_DASHBOARD_MODULE_CONTEXTS[moduleKey];
      if (contextInfo) return contextInfo;
    }
    return null;
  };

  const resolveDashboardCustomTableNameIconRowName = (
    tableName: string,
    headers: unknown[],
    rowData: unknown[],
  ): string | null => {
    for (const moduleKey of getDashboardModuleKeysForTableName(tableName)) {
      const moduleConfig = getDashboardModuleConfig(moduleKey);
      if (!moduleConfig?.columns?.name) continue;
      const nameColumnIndex = DashboardDataParser.findColumnIndex(headers, 'name', moduleConfig);
      const nameText = nameColumnIndex >= 0 ? getStringLikeCellText(rowData[nameColumnIndex]) : '';
      if (nameText) return nameText;
    }
    return null;
  };

  const resolveCustomTableNameIconRowName = (
    tableName: string,
    headers: unknown[],
    rowData: unknown[],
    rowIndex: number,
  ): string =>
    resolveDashboardCustomTableNameIconRowName(tableName, headers, rowData) ||
    resolveGlobalInteractionRowTitle(headers, rowData, rowIndex);

  const CUSTOM_TABLE_NAME_ICON_MODULE_IDS: readonly CustomTableNameIconModuleId[] = [
    'table-name',
    'item',
    'equipment',
    'faction',
    'global-interaction-panel',
    'global-interaction-map-marker',
    'shop',
    'avatar-manager',
    'relationship-graph',
    'map-character-node',
    'character-interaction-panel',
    'alias-resolution',
    'user-graph-resolution',
  ];
  const CUSTOM_TABLE_NAME_ICON_SECTIONS: readonly CustomTableNameIconSection[] = [
    'table',
    'map',
    'item',
    'equipment',
    'faction',
    'shop',
    'task',
    'skill',
    'generic',
    'character',
    'relationship',
    'alias',
    'user',
  ];
  const CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS = new Set<CustomTableNameIconSection>([
    'map',
    'item',
    'equipment',
    'faction',
    'shop',
    'task',
    'skill',
    'generic',
  ]);
  const CUSTOM_TABLE_NAME_ICON_DENIED_MODULES = new Set<CustomTableNameIconModuleId>([
    'avatar-manager',
    'relationship-graph',
    'map-character-node',
    'character-interaction-panel',
    'alias-resolution',
    'user-graph-resolution',
  ]);
  const CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS = new Set<CustomTableNameIconSection>([
    'character',
    'relationship',
    'alias',
    'user',
  ]);
  const CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES = new Set<string>([
    '全局数据表',
    '纪要表',
    '总结表',
    '总结大纲表',
    '总体大纲',
    '选项表',
    '检定建议表',
    '主角信息',
    '重要人物表',
    '重要角色表',
  ]);

  const isCustomTableNameIconModuleId = (value: string): value is CustomTableNameIconModuleId =>
    CUSTOM_TABLE_NAME_ICON_MODULE_IDS.includes(value as CustomTableNameIconModuleId);

  const isCustomTableNameIconSection = (value: string): value is CustomTableNameIconSection =>
    CUSTOM_TABLE_NAME_ICON_SECTIONS.includes(value as CustomTableNameIconSection);

  const normalizeCustomTableNameIconKeyPart = (value: unknown): string => String(value ?? '').trim();

  const isCustomTableNameIconTableDenied = (tableName: string): boolean => {
    const normalizedTableName = String(tableName || '').trim();
    if (!normalizedTableName) return true;
    if (CUSTOM_TABLE_NAME_ICON_DENIED_TABLE_NAMES.has(normalizedTableName)) return true;
    if (isPlayerTableName(normalizedTableName) || isNpcLikeTableName(normalizedTableName)) return true;
    return resolveDashboardGlobalInteractionSectionKind(normalizedTableName) === 'character';
  };

  const normalizeCustomTableNameIconContext = (value: unknown): CustomTableNameIconContext | null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const raw = value as Record<string, unknown>;
    const moduleId = normalizeCustomTableNameIconKeyPart(raw.moduleId);
    const tableName = normalizeCustomTableNameIconKeyPart(raw.tableName);
    const section = normalizeCustomTableNameIconKeyPart(raw.section);
    const name = normalizeCustomTableNameIconKeyPart(raw.name);
    if (!isCustomTableNameIconModuleId(moduleId) || !isCustomTableNameIconSection(section)) return null;
    if (!tableName || !name) return null;
    return {
      moduleId,
      tableName,
      section,
      name,
    };
  };

  const getCustomTableNameIconContextKey = (context: CustomTableNameIconContext): string =>
    [context.moduleId, context.tableName, context.section, context.name]
      .map(normalizeCustomTableNameIconKeyPart)
      .join('||');

  const normalizeCustomTableNameIconEntry = (value: unknown): CustomTableNameIconEntry | null => {
    const context = normalizeCustomTableNameIconContext(value);
    if (!context) return null;
    const raw = value as Record<string, unknown>;
    const sourceType = raw.sourceType === 'local' ? 'local' : 'url';
    const imageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl.trim() : '';
    const localIconKey = typeof raw.localIconKey === 'string' ? raw.localIconKey.trim() : '';
    const imageMimeType = typeof raw.imageMimeType === 'string' ? raw.imageMimeType.trim() : '';
    const imageSize = typeof raw.imageSize === 'number' && Number.isFinite(raw.imageSize) ? raw.imageSize : null;
    if (sourceType === 'url') {
      if (!isCustomTableNameIconImageUrlValid(imageUrl)) return null;
    } else if (!localIconKey) {
      return null;
    }
    const createdAt = typeof raw.createdAt === 'number' && Number.isFinite(raw.createdAt) ? raw.createdAt : 0;
    const updatedAt = typeof raw.updatedAt === 'number' && Number.isFinite(raw.updatedAt) ? raw.updatedAt : createdAt;
    return {
      ...context,
      sourceType,
      imageUrl,
      localIconKey: localIconKey || null,
      imageMimeType: imageMimeType || null,
      imageSize,
      createdAt,
      updatedAt,
    };
  };

  const CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES = new Set([
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
  ]);
  const CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE = 1024 * 1024;

  const isCustomTableNameIconSvgMimeType = (value: string): boolean =>
    String(value || '')
      .trim()
      .toLowerCase() === 'image/svg+xml';

  function isCustomTableNameIconImageUrlValid(url: string): boolean {
    return getCustomTableNameIconImageUrlValidationError(url) === null;
  }

  function getCustomTableNameIconImageUrlValidationError(url: string): CustomTableNameIconInvalidSourceReason | null {
    return getRemoteImageUrlValidationError(url);
  }

  function getCustomTableNameIconLocalFileValidationError(
    file: File | null,
  ): CustomTableNameIconInvalidSourceReason | null {
    if (!file) return 'invalid_url';
    const mimeType = String(file.type || '')
      .trim()
      .toLowerCase();
    if (isCustomTableNameIconSvgMimeType(mimeType)) return 'svg_mime';
    if (!CUSTOM_TABLE_NAME_ICON_ALLOWED_LOCAL_MIME_TYPES.has(mimeType)) return 'unsupported_mime';
    if (file.size > CUSTOM_TABLE_NAME_ICON_MAX_LOCAL_FILE_SIZE) return 'oversize';
    return null;
  }

  const CustomTableNameIconImageDB = {
    DB_NAME: 'acu_custom_table_name_icon_images',
    STORE_NAME: 'images',
    DB_VERSION: 1,
    _db: null as IDBDatabase | null,
    _urlCache: new Map<string, string>(),
    _failedUrlCache: new Set<string>(),
    _failedLocalKeyCache: new Set<string>(),

    async init(): Promise<IDBDatabase> {
      if (this._db) return this._db;
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
        request.onerror = () => {
          console.error('[DICE][CUSTOM_ICON]自定义图标图片 IndexedDB 打开失败:', request.error);
          reject(request.error);
        };
        request.onsuccess = () => {
          this._db = request.result;
          resolve(this._db);
        };
        request.onupgradeneeded = event => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.STORE_NAME)) {
            db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          }
        };
      });
    },

    markUrlFailed(url: string): void {
      const normalizedUrl = String(url || '').trim();
      if (!normalizedUrl) return;
      this._failedUrlCache.add(normalizedUrl);
    },

    markLocalKeyFailed(key: string): void {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return;
      this._failedLocalKeyCache.add(normalizedKey);
    },

    clearUrlFailure(url: string): void {
      const normalizedUrl = String(url || '').trim();
      if (!normalizedUrl) return;
      this._failedUrlCache.delete(normalizedUrl);
    },

    clearLocalKeyFailure(key: string): void {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return;
      this._failedLocalKeyCache.delete(normalizedKey);
    },

    hasUrlFailed(url: string): boolean {
      const normalizedUrl = String(url || '').trim();
      return normalizedUrl ? this._failedUrlCache.has(normalizedUrl) : false;
    },

    hasLocalKeyFailed(key: string): boolean {
      const normalizedKey = String(key || '').trim();
      return normalizedKey ? this._failedLocalKeyCache.has(normalizedKey) : false;
    },

    async save(key: string, blob: Blob): Promise<boolean> {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey || !blob) return false;
      try {
        const db = await this.init();
        if (this._urlCache.has(normalizedKey)) {
          URL.revokeObjectURL(this._urlCache.get(normalizedKey) || '');
          this._urlCache.delete(normalizedKey);
        }
        this.clearLocalKeyFailure(normalizedKey);
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const request = tx.objectStore(this.STORE_NAME).put({
            key: normalizedKey,
            blob,
            size: blob.size,
            type: blob.type,
            updatedAt: Date.now(),
          } satisfies CustomTableNameIconImageRecord);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            console.error('[DICE][CUSTOM_ICON]保存自定义图标图片失败:', request.error);
            this.markLocalKeyFailed(normalizedKey);
            resolve(false);
          };
        });
      } catch (error) {
        console.error('[DICE][CUSTOM_ICON]保存自定义图标图片异常:', error);
        this.markLocalKeyFailed(normalizedKey);
        return false;
      }
    },

    async get(key: string): Promise<string | null> {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return null;
      if (this._failedLocalKeyCache.has(normalizedKey)) return null;
      if (this._urlCache.has(normalizedKey)) return this._urlCache.get(normalizedKey) || null;
      try {
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readonly');
          const request = tx.objectStore(this.STORE_NAME).get(normalizedKey);
          request.onsuccess = () => {
            const result = request.result as CustomTableNameIconImageRecord | undefined;
            if (!result?.blob) {
              this.markLocalKeyFailed(normalizedKey);
              resolve(null);
              return;
            }
            const url = URL.createObjectURL(result.blob);
            this._urlCache.set(normalizedKey, url);
            this.clearLocalKeyFailure(normalizedKey);
            resolve(url);
          };
          request.onerror = () => {
            this.markLocalKeyFailed(normalizedKey);
            resolve(null);
          };
        });
      } catch (error) {
        console.warn('[DICE][CUSTOM_ICON]读取自定义图标图片失败:', error);
        this.markLocalKeyFailed(normalizedKey);
        return null;
      }
    },

    async delete(key: string): Promise<boolean> {
      const normalizedKey = String(key || '').trim();
      if (!normalizedKey) return false;
      try {
        if (this._urlCache.has(normalizedKey)) {
          URL.revokeObjectURL(this._urlCache.get(normalizedKey) || '');
          this._urlCache.delete(normalizedKey);
        }
        this.clearLocalKeyFailure(normalizedKey);
        const db = await this.init();
        return await new Promise(resolve => {
          const tx = db.transaction(this.STORE_NAME, 'readwrite');
          const request = tx.objectStore(this.STORE_NAME).delete(normalizedKey);
          request.onsuccess = () => resolve(true);
          request.onerror = () => {
            this.markLocalKeyFailed(normalizedKey);
            resolve(false);
          };
        });
      } catch (error) {
        console.warn('[DICE][CUSTOM_ICON]删除自定义图标图片失败:', error);
        this.markLocalKeyFailed(normalizedKey);
        return false;
      }
    },

    cleanup(): void {
      this._urlCache.forEach(url => URL.revokeObjectURL(url));
      this._urlCache.clear();
      this._failedUrlCache.clear();
      this._failedLocalKeyCache.clear();
    },
  };

  const isCustomTableNameIconContextAllowed = (context: CustomTableNameIconContext): boolean => {
    if (CUSTOM_TABLE_NAME_ICON_DENIED_MODULES.has(context.moduleId)) return false;
    if (CUSTOM_TABLE_NAME_ICON_DENIED_SECTIONS.has(context.section)) return false;
    if (isCustomTableNameIconTableDenied(context.tableName)) return false;

    if (context.moduleId === 'table-name') {
      return context.section === 'table';
    }
    if (context.moduleId === 'global-interaction-map-marker') {
      return context.section === 'map';
    }
    if (context.moduleId === 'item') {
      return context.section === 'item';
    }
    if (context.moduleId === 'equipment') {
      return context.section === 'equipment';
    }
    if (context.moduleId === 'faction') {
      return context.section === 'faction';
    }
    if (context.moduleId === 'global-interaction-panel') {
      return CUSTOM_TABLE_NAME_ICON_ALLOWED_PANEL_SECTIONS.has(context.section);
    }
    if (context.moduleId === 'shop') {
      return context.section === 'shop';
    }

    return false;
  };

  const getCustomTableNameIconFallbackContexts = (
    context: CustomTableNameIconContext,
  ): CustomTableNameIconContext[] => {
    const fallbackContexts: CustomTableNameIconContext[] = [];

    const addFallbackContext = (fallbackContext: CustomTableNameIconContext): void => {
      if (getCustomTableNameIconContextKey(fallbackContext) === getCustomTableNameIconContextKey(context)) return;
      if (!isCustomTableNameIconContextAllowed(fallbackContext)) return;
      if (
        fallbackContexts.some(
          item => getCustomTableNameIconContextKey(item) === getCustomTableNameIconContextKey(fallbackContext),
        )
      )
        return;
      fallbackContexts.push(fallbackContext);
    };

    if (context.moduleId === 'global-interaction-panel') {
      const directModuleId = (() => {
        if (context.section === 'item') return 'item';
        if (context.section === 'equipment') return 'equipment';
        if (context.section === 'faction') return 'faction';
        if (context.section === 'shop') return 'shop';
        return null;
      })();
      if (directModuleId) {
        addFallbackContext({
          ...context,
          moduleId: directModuleId,
        });
      }
    }

    if (context.moduleId !== 'table-name') {
      addFallbackContext({
        ...context,
        moduleId: 'table-name',
        section: 'table',
      });
    }

    return fallbackContexts;
  };

  const CustomTableNameIconStoreManager = (() => {
    let cache: Record<string, CustomTableNameIconEntry> | null = null;

    const load = (): Record<string, CustomTableNameIconEntry> => {
      if (cache) return cache;
      const raw = Store.get(STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, {});
      const next: Record<string, CustomTableNameIconEntry> = {};
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
        Object.values(raw as Record<string, unknown>).forEach(value => {
          const entry = normalizeCustomTableNameIconEntry(value);
          if (!entry) return;
          next[getCustomTableNameIconContextKey(entry)] = entry;
        });
      }
      cache = next;
      return next;
    };

    const get = (context: CustomTableNameIconContext): CustomTableNameIconEntry | null =>
      load()[getCustomTableNameIconContextKey(context)] || null;

    const getAll = (): CustomTableNameIconEntry[] => Object.values(load());

    const save = (entry: CustomTableNameIconEntry): boolean => {
      const normalizedEntry = normalizeCustomTableNameIconEntry(entry);
      if (!normalizedEntry) return false;
      const next = { ...load(), [getCustomTableNameIconContextKey(normalizedEntry)]: normalizedEntry };
      cache = next;
      Store.set(STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, next);
      return true;
    };

    const remove = (context: CustomTableNameIconContext): boolean => {
      const key = getCustomTableNameIconContextKey(context);
      const current = load();
      if (!current[key]) return false;
      const next = { ...current };
      delete next[key];
      cache = next;
      Store.set(STORAGE_KEY_CUSTOM_TABLE_NAME_ICONS, next);
      return true;
    };

    const invalidate = (): void => {
      cache = null;
    };

    return {
      load,
      get,
      getAll,
      save,
      delete: remove,
      invalidate,
    };
  })();

  const resolveCustomTableNameIcon = (
    defaultIcon: string,
    context?: CustomTableNameIconContext | null,
  ): ResolvedCustomTableNameIcon => {
    const fallbackIcon = normalizeCustomTableNameIconKeyPart(defaultIcon) || 'fa-table';
    const normalizedContext = normalizeCustomTableNameIconContext(context);
    if (!normalizedContext) {
      return {
        icon: fallbackIcon,
        entry: null,
        key: null,
        sourceType: null,
        imageUrl: null,
        localIconKey: null,
        assetUrl: null,
        reason: 'invalid',
      };
    }

    if (!isCustomTableNameIconContextAllowed(normalizedContext)) {
      return {
        icon: fallbackIcon,
        entry: null,
        key: getCustomTableNameIconContextKey(normalizedContext),
        sourceType: null,
        imageUrl: null,
        localIconKey: null,
        assetUrl: null,
        reason: 'not_whitelisted',
      };
    }

    let resolvedContext = normalizedContext;
    let entry = CustomTableNameIconStoreManager.get(resolvedContext);
    if (!entry) {
      for (const fallbackContext of getCustomTableNameIconFallbackContexts(normalizedContext)) {
        const fallbackEntry = CustomTableNameIconStoreManager.get(fallbackContext);
        if (fallbackEntry) {
          resolvedContext = fallbackContext;
          entry = fallbackEntry;
          break;
        }
      }
    }

    if (!entry) {
      return {
        icon: fallbackIcon,
        entry: null,
        key: getCustomTableNameIconContextKey(normalizedContext),
        sourceType: null,
        imageUrl: null,
        localIconKey: null,
        assetUrl: null,
        reason: 'missing',
      };
    }

    return {
      icon: fallbackIcon,
      entry,
      key: getCustomTableNameIconContextKey(resolvedContext),
      sourceType: entry.sourceType,
      imageUrl: entry.imageUrl || null,
      localIconKey: entry.localIconKey,
      assetUrl: entry.sourceType === 'url' ? entry.imageUrl : null,
      reason: 'resolved',
    };
  };

  const resolveCustomTableNameIconAssetUrl = async (
    context?: CustomTableNameIconContext | null,
  ): Promise<string | null> => {
    const resolved = resolveCustomTableNameIcon('fa-table', context);
    if (!resolved.entry) return null;
    if (resolved.entry.sourceType === 'url') {
      const url = resolved.entry.imageUrl;
      if (!isCustomTableNameIconImageUrlValid(url)) {
        CustomTableNameIconImageDB.markUrlFailed(url);
        return null;
      }
      if (CustomTableNameIconImageDB.hasUrlFailed(url)) return null;
      return url;
    }
    const localKey = resolved.entry.localIconKey;
    if (!localKey) return null;
    if (CustomTableNameIconImageDB.hasLocalKeyFailed(localKey)) return null;
    return await CustomTableNameIconImageDB.get(localKey);
  };

  type CustomTableNameIconManagerCandidateSource = 'direct' | 'interaction' | 'saved';

  interface CustomTableNameIconManagerRawSheet {
    key: string;
    name: string;
    content: unknown[][];
  }

  interface CustomTableNameIconManagerCandidate {
    context: CustomTableNameIconContext;
    key: string;
    tableKey: string;
    source: CustomTableNameIconManagerCandidateSource;
    searchText: string;
  }

  const CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS: Record<CustomTableNameIconModuleId, string> = {
    'table-name': '通用表格',
    item: '物品',
    equipment: '装备',
    faction: '势力',
    'global-interaction-panel': '交互面板',
    'global-interaction-map-marker': '地图标记',
    shop: '商店',
    'avatar-manager': '角色头像预设',
    'relationship-graph': '关系图',
    'map-character-node': '地图角色',
    'character-interaction-panel': '角色交互',
    'alias-resolution': '别名解析',
    'user-graph-resolution': '用户解析',
  };

  const CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS: Record<CustomTableNameIconSection, string> = {
    table: '表格',
    map: '地图',
    item: '物品',
    equipment: '装备',
    faction: '势力',
    shop: '商店',
    task: '任务',
    skill: '技能',
    generic: '通用',
    character: '角色',
    relationship: '关系',
    alias: '别名',
    user: '用户',
  };

  const CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION: Partial<
    Record<CustomTableNameIconSection, CustomTableNameIconModuleId>
  > = {
    item: 'item',
    equipment: 'equipment',
    faction: 'faction',
    shop: 'shop',
  };

  const getCustomTableNameIconManagerModuleLabel = (moduleId: CustomTableNameIconModuleId): string =>
    CUSTOM_TABLE_NAME_ICON_MANAGER_MODULE_LABELS[moduleId] || moduleId;

  const getCustomTableNameIconManagerSectionLabel = (section: CustomTableNameIconSection): string =>
    CUSTOM_TABLE_NAME_ICON_MANAGER_SECTION_LABELS[section] || section;

  const getCustomTableNameIconManagerSourceLabel = (source: CustomTableNameIconManagerCandidateSource): string => {
    if (source === 'direct') return '表格条目';
    if (source === 'interaction') return '交互条目';
    return '已保存映射';
  };

  const getCustomTableNameIconManagerContextLabel = (context: CustomTableNameIconContext): string => {
    const seenLabels = new Set<string>();
    const labels = [
      getCustomTableNameIconManagerModuleLabel(context.moduleId),
      context.tableName,
      getCustomTableNameIconManagerSectionLabel(context.section),
    ]
      .map(label => label.trim())
      .filter(label => {
        if (!label) return false;
        const key = normalizeGlobalInteractionCategoryText(label);
        if (seenLabels.has(key)) return false;
        seenLabels.add(key);
        return true;
      });
    return labels.join(' / ') || context.tableName || context.name;
  };

  const getCustomTableNameIconManagerLocalKey = (context: CustomTableNameIconContext): string =>
    `custom-table-name-icon::${getCustomTableNameIconContextKey(context)}`;

  const getCustomTableNameIconManagerRawSheets = (): CustomTableNameIconManagerRawSheet[] => {
    const rawData = getTableData({ silent: true }) as unknown;
    if (!isRecord(rawData)) return [];

    return Object.entries(rawData).reduce<CustomTableNameIconManagerRawSheet[]>((result, [key, sheet]) => {
      if (!key.startsWith('sheet_') || !isRecord(sheet)) return result;
      const name = typeof sheet.name === 'string' ? sheet.name.trim() : '';
      const content = sheet.content;
      if (!name || !isTwoDimensionalArray(content)) return result;
      result.push({ key, name, content });
      return result;
    }, []);
  };

  const resolveCustomTableNameIconManagerDirectSection = (tableName: string): CustomTableNameIconSection | null => {
    const normalizedName = normalizeGlobalInteractionCategoryText(tableName);
    if (normalizedName.includes('商店') || normalizedName.includes('店铺') || normalizedName.includes('shop'))
      return 'shop';
    const meta = resolveGlobalInteractionSectionMeta(tableName);
    if (meta.kind === 'item' || meta.kind === 'equipment' || meta.kind === 'faction') return meta.kind;
    return null;
  };

  const createCustomTableNameIconManagerCandidate = (
    context: CustomTableNameIconContext,
    tableKey: string,
    source: CustomTableNameIconManagerCandidateSource,
  ): CustomTableNameIconManagerCandidate | null => {
    const normalizedContext = normalizeCustomTableNameIconContext(context);
    if (!normalizedContext || !isCustomTableNameIconContextAllowed(normalizedContext)) return null;
    const key = getCustomTableNameIconContextKey(normalizedContext);
    return {
      context: normalizedContext,
      key,
      tableKey,
      source,
      searchText: [
        getCustomTableNameIconManagerModuleLabel(normalizedContext.moduleId),
        getCustomTableNameIconManagerSectionLabel(normalizedContext.section),
        normalizedContext.tableName,
        normalizedContext.name,
        getCustomTableNameIconManagerSourceLabel(source),
      ]
        .join(' ')
        .toLowerCase(),
    };
  };

  const getCustomTableNameIconManagerCandidates = (): CustomTableNameIconManagerCandidate[] => {
    const candidateMap = new Map<string, CustomTableNameIconManagerCandidate>();
    const addCandidate = (candidate: CustomTableNameIconManagerCandidate | null): void => {
      if (!candidate || candidateMap.has(candidate.key)) return;
      candidateMap.set(candidate.key, candidate);
    };

    const sheets = getCustomTableNameIconManagerRawSheets();
    sheets.forEach(sheet => {
      const headers = sheet.content[0] || [];
      const rows = sheet.content.slice(1);
      const dashboardContextInfo = resolveDashboardCustomTableNameIconContextInfo(sheet.name);
      const directSection = resolveCustomTableNameIconManagerDirectSection(sheet.name);
      const directModuleId = directSection
        ? CUSTOM_TABLE_NAME_ICON_MANAGER_DIRECT_MODULE_BY_SECTION[directSection]
        : undefined;
      if (!dashboardContextInfo && !directModuleId) {
        rows.forEach((row, rowIndex) => {
          const name = resolveCustomTableNameIconRowName(sheet.name, headers, row, rowIndex);
          addCandidate(
            createCustomTableNameIconManagerCandidate(
              { moduleId: 'table-name', tableName: sheet.name, section: 'table', name },
              sheet.key,
              'direct',
            ),
          );
        });
      }
      if (dashboardContextInfo) {
        rows.forEach((row, rowIndex) => {
          const name = resolveCustomTableNameIconRowName(sheet.name, headers, row, rowIndex);
          addCandidate(
            createCustomTableNameIconManagerCandidate(
              { ...dashboardContextInfo, tableName: sheet.name, name },
              sheet.key,
              'direct',
            ),
          );
        });
      }
      if (directSection && directModuleId) {
        rows.forEach((row, rowIndex) => {
          const name = resolveGlobalInteractionRowTitle(headers, row, rowIndex);
          addCandidate(
            createCustomTableNameIconManagerCandidate(
              { moduleId: directModuleId, tableName: sheet.name, section: directSection, name },
              sheet.key,
              'direct',
            ),
          );
        });
      }
    });

    const rawData = getTableData({ silent: true }) as unknown;
    buildGlobalInteractionGroups(rawData).forEach(group => {
      const meta = resolveGlobalInteractionSectionMeta(group.tableName);
      const section = meta.kind as CustomTableNameIconSection;
      const moduleId: CustomTableNameIconModuleId =
        section === 'map' ? 'global-interaction-map-marker' : 'global-interaction-panel';
      group.rows.forEach(row => {
        addCandidate(
          createCustomTableNameIconManagerCandidate(
            { moduleId, tableName: group.tableName, section, name: row.title },
            group.tableKey,
            'interaction',
          ),
        );
      });
    });

    CustomTableNameIconStoreManager.getAll().forEach(entry => {
      addCandidate(createCustomTableNameIconManagerCandidate(entry, 'saved', 'saved'));
    });

    return [...candidateMap.values()].sort((left, right) => {
      const moduleCompare = getCustomTableNameIconManagerModuleLabel(left.context.moduleId).localeCompare(
        getCustomTableNameIconManagerModuleLabel(right.context.moduleId),
        'zh-CN',
      );
      if (moduleCompare !== 0) return moduleCompare;
      const tableCompare = left.context.tableName.localeCompare(right.context.tableName, 'zh-CN');
      if (tableCompare !== 0) return tableCompare;
      return left.context.name.localeCompare(right.context.name, 'zh-CN');
    });
  };

  const getCustomTableNameIconManagerInvalidSourceText = (
    reason: CustomTableNameIconInvalidSourceReason | null,
  ): string => {
    if (reason === 'invalid_protocol') return '仅支持 http/https 图片地址';
    if (reason === 'svg_url' || reason === 'svg_mime') return '不支持 SVG 图片';
    if (reason === 'unsupported_mime') return '仅支持 PNG、JPEG、WebP、GIF';
    if (reason === 'oversize') return '本地图片不能超过 1 MB';
    return '图片来源无效';
  };

  const getCustomTableNameIconManagerEntryAsset = async (
    entry: CustomTableNameIconEntry | null,
  ): Promise<{ assetUrl: string; isMissing: boolean }> => {
    if (!entry) return { assetUrl: '', isMissing: false };
    if (entry.sourceType === 'url') {
      const isValid = isCustomTableNameIconImageUrlValid(entry.imageUrl);
      return { assetUrl: isValid ? entry.imageUrl : '', isMissing: !isValid };
    }
    const localKey = entry.localIconKey || '';
    if (!localKey) return { assetUrl: '', isMissing: true };
    const assetUrl = await CustomTableNameIconImageDB.get(localKey);
    return { assetUrl: assetUrl || '', isMissing: !assetUrl };
  };

  const normalizeCustomTableNameIconPackEntryMetadata = (value: unknown): CustomTableNameIconPackEntryMetadata => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {
        imageMimeType: null,
        imageSize: null,
      };
    }
    const raw = value as Record<string, unknown>;
    const imageMimeType = typeof raw.imageMimeType === 'string' ? raw.imageMimeType.trim() : '';
    const imageSize = typeof raw.imageSize === 'number' && Number.isFinite(raw.imageSize) ? raw.imageSize : null;
    const originalLocalKey = typeof raw.originalLocalKey === 'string' ? raw.originalLocalKey.trim() : '';
    return {
      imageMimeType: imageMimeType || null,
      imageSize,
      missingLocalBinary: raw.missingLocalBinary === true,
      originalLocalKey: originalLocalKey || null,
    };
  };

  const normalizeCustomTableNameIconPackEntry = (value: unknown): CustomTableNameIconPackEntry | null => {
    const context = normalizeCustomTableNameIconContext(value);
    if (!context) return null;
    const raw = value as Record<string, unknown>;
    const sourceType = raw.sourceType === 'local' ? 'local' : raw.sourceType === 'url' ? 'url' : null;
    if (!sourceType) return null;
    const url = typeof raw.url === 'string' ? raw.url.trim() : '';
    const localKey = typeof raw.localKey === 'string' ? raw.localKey.trim() : '';
    if (sourceType === 'url' && !url) return null;
    if (sourceType === 'local' && !localKey) return null;
    return {
      ...context,
      sourceType,
      ...(sourceType === 'url' ? { url } : { localKey }),
      metadata: normalizeCustomTableNameIconPackEntryMetadata(raw.metadata),
    };
  };

  const buildCustomTableNameIconPackEntry = (entry: CustomTableNameIconEntry): CustomTableNameIconPackEntry | null => {
    if (!isCustomTableNameIconContextAllowed(entry)) return null;
    if (entry.sourceType === 'url') {
      if (!isCustomTableNameIconImageUrlValid(entry.imageUrl)) return null;
      return {
        moduleId: entry.moduleId,
        tableName: entry.tableName,
        section: entry.section,
        name: entry.name,
        sourceType: 'url',
        url: entry.imageUrl,
        metadata: {
          imageMimeType: entry.imageMimeType,
          imageSize: entry.imageSize,
        },
      };
    }

    const exportedLocalKey = String(entry.localIconKey || getCustomTableNameIconManagerLocalKey(entry)).trim();
    if (!exportedLocalKey) return null;
    return {
      moduleId: entry.moduleId,
      tableName: entry.tableName,
      section: entry.section,
      name: entry.name,
      sourceType: 'local',
      localKey: exportedLocalKey,
      metadata: {
        imageMimeType: entry.imageMimeType,
        imageSize: entry.imageSize,
        missingLocalBinary: true,
        originalLocalKey: exportedLocalKey,
      },
    };
  };

  const buildCustomTableNameIconPack = (): CustomTableNameIconPack => ({
    schemaVersion: CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    entries: CustomTableNameIconStoreManager.getAll()
      .map(buildCustomTableNameIconPackEntry)
      .filter((entry): entry is CustomTableNameIconPackEntry => Boolean(entry)),
  });

  const getCustomTableNameIconPackDownloadFileName = (): string =>
    `custom-table-name-icon-pack-${new Date().toISOString().slice(0, 10)}.json`;

  const downloadCustomTableNameIconPack = (pack: CustomTableNameIconPack): void => {
    const json = JSON.stringify(pack, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = getCustomTableNameIconPackDownloadFileName();
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const analyzeCustomTableNameIconPackImport = (value: unknown): CustomTableNameIconPackImportAnalysis => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('图标包格式无效');
    }
    const raw = value as Record<string, unknown>;
    if (raw.schemaVersion !== CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION) {
      throw new Error(`仅支持 schemaVersion ${CUSTOM_TABLE_NAME_ICON_PACK_SCHEMA_VERSION} 的图标包`);
    }
    if (!Array.isArray(raw.entries)) {
      throw new Error('图标包缺少 entries 数组');
    }

    const now = Date.now();
    const existingEntries = CustomTableNameIconStoreManager.getAll().reduce<Record<string, CustomTableNameIconEntry>>(
      (result, entry) => {
        result[getCustomTableNameIconContextKey(entry)] = entry;
        return result;
      },
      {},
    );
    const analysis: CustomTableNameIconPackImportAnalysis = {
      entriesToImport: [],
      importedCount: 0,
      overwrittenCount: 0,
      skippedInvalidUrlCount: 0,
      skippedNonWhitelistCount: 0,
      skippedInvalidEntryCount: 0,
      localMissingCount: 0,
    };

    raw.entries.forEach(item => {
      const packEntry = normalizeCustomTableNameIconPackEntry(item);
      if (!packEntry) {
        analysis.skippedInvalidEntryCount += 1;
        return;
      }
      if (!isCustomTableNameIconContextAllowed(packEntry)) {
        analysis.skippedNonWhitelistCount += 1;
        return;
      }

      const contextKey = getCustomTableNameIconContextKey(packEntry);
      const previousEntry = existingEntries[contextKey] || null;
      const createdAt = previousEntry?.createdAt || now;
      const updatedAt = now;
      if (packEntry.sourceType === 'url') {
        const imageUrl = String(packEntry.url || '').trim();
        if (getCustomTableNameIconImageUrlValidationError(imageUrl)) {
          analysis.skippedInvalidUrlCount += 1;
          return;
        }
        analysis.entriesToImport.push({
          moduleId: packEntry.moduleId,
          tableName: packEntry.tableName,
          section: packEntry.section,
          name: packEntry.name,
          sourceType: 'url',
          imageUrl,
          localIconKey: null,
          imageMimeType: packEntry.metadata.imageMimeType,
          imageSize: packEntry.metadata.imageSize,
          createdAt,
          updatedAt,
        });
      } else {
        const localIconKey = String(packEntry.localKey || getCustomTableNameIconManagerLocalKey(packEntry)).trim();
        if (!localIconKey) {
          analysis.skippedInvalidEntryCount += 1;
          return;
        }
        analysis.entriesToImport.push({
          moduleId: packEntry.moduleId,
          tableName: packEntry.tableName,
          section: packEntry.section,
          name: packEntry.name,
          sourceType: 'local',
          imageUrl: '',
          localIconKey,
          imageMimeType: packEntry.metadata.imageMimeType,
          imageSize: packEntry.metadata.imageSize,
          createdAt,
          updatedAt,
        });
        analysis.localMissingCount += 1;
      }
      if (previousEntry) {
        analysis.overwrittenCount += 1;
      }
    });

    analysis.importedCount = analysis.entriesToImport.length;
    return analysis;
  };

  const getCustomTableNameIconPackImportSummaryText = (analysis: CustomTableNameIconPackImportAnalysis): string => {
    const lines = [
      `将导入 ${analysis.importedCount} 条图标映射。`,
      `覆盖现有映射：${analysis.overwrittenCount}`,
      `导入后需重传的本地图标：${analysis.localMissingCount}`,
      `跳过无效 URL：${analysis.skippedInvalidUrlCount}`,
      `跳过非白名单上下文：${analysis.skippedNonWhitelistCount}`,
    ];
    if (analysis.skippedInvalidEntryCount > 0) {
      lines.push(`跳过格式无效条目：${analysis.skippedInvalidEntryCount}`);
    }
    return lines.join('\n');
  };

  type DiceSystemConfirmTone = 'warning' | 'danger';

  const showDiceSystemConfirmDialog = (options: {
    title: string;
    message: string;
    detail?: string;
    detailHtml?: string;
    iconClass: string;
    confirmText: string;
    cancelText?: string;
    tone?: DiceSystemConfirmTone;
    hideCancel?: boolean;
  }): Promise<boolean> => {
    const { $ } = getCore();
    const config = getConfig();
    const tone: DiceSystemConfirmTone = options.tone || 'warning';
    const detailClass = options.detailHtml ? ' structured' : '';
    const dialogClass = options.detailHtml ? ' structured-detail' : '';
    const detailHtml = options.detailHtml
      ? `<div class="acu-system-confirm-detail acu-custom-icon-confirm-detail${detailClass}">${options.detailHtml}</div>`
      : options.detail
      ? `<div class="acu-system-confirm-detail acu-custom-icon-confirm-detail">${options.detail
          .split('\n')
          .map(line => `<div>${escapeHtml(line)}</div>`)
          .join('')}</div>`
      : '';
    const cancelButtonHtml = options.hideCancel
      ? ''
      : `<button class="acu-import-cancel-btn acu-system-confirm-cancel acu-custom-icon-confirm-cancel" type="button">${escapeHtml(options.cancelText || '取消')}</button>`;

    return new Promise(resolve => {
      $('.acu-system-confirm-overlay, .acu-custom-icon-confirm-overlay').remove();
      const overlay = $(`
        <div class="acu-import-confirm-overlay acu-system-confirm-overlay acu-custom-icon-confirm-overlay acu-theme-${config.theme}" tabindex="-1">
          <div class="acu-import-confirm-dialog acu-system-confirm-dialog acu-custom-icon-confirm-dialog${dialogClass}">
            <div class="acu-import-confirm-header">
              <span class="acu-import-confirm-title">
                <i class="fa-solid ${escapeHtml(options.iconClass)}"></i>
                ${escapeHtml(options.title)}
              </span>
              <button class="acu-import-close-btn acu-system-confirm-cancel acu-custom-icon-confirm-cancel" type="button" title="关闭" aria-label="关闭">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="acu-import-confirm-body">
              <div class="acu-import-warning-container acu-system-confirm-content acu-custom-icon-confirm-content">
                <i class="fa-solid ${escapeHtml(options.iconClass)} acu-import-warning-icon ${tone}"></i>
                <div class="acu-import-warning-title">${escapeHtml(options.message)}</div>
                ${detailHtml}
              </div>
            </div>
            <div class="acu-import-confirm-footer">
              ${cancelButtonHtml}
              <button class="acu-import-confirm-btn acu-system-confirm-ok acu-custom-icon-confirm-ok ${tone}" type="button">${escapeHtml(options.confirmText)}</button>
            </div>
          </div>
        </div>
      `);

      let settled = false;
      const finish = (confirmed: boolean): void => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(confirmed);
      };

      $('body').append(overlay);

      // 移动端酒馆会给若干容器叠加定位/缩放，这里用高优先级内联规则兜住居中层级。
      const overlayEl = overlay[0] as HTMLElement | undefined;
      if (overlayEl) {
        overlayEl.style.setProperty('position', 'fixed', 'important');
        overlayEl.style.setProperty('top', '0', 'important');
        overlayEl.style.setProperty('left', '0', 'important');
        overlayEl.style.setProperty('right', '0', 'important');
        overlayEl.style.setProperty('bottom', '0', 'important');
        overlayEl.style.setProperty('width', '100vw', 'important');
        overlayEl.style.setProperty('height', '100dvh', 'important');
        overlayEl.style.setProperty('min-height', '100vh', 'important');
        overlayEl.style.setProperty('display', 'flex', 'important');
        overlayEl.style.setProperty('align-items', 'center', 'important');
        overlayEl.style.setProperty('justify-content', 'center', 'important');
        overlayEl.style.setProperty('z-index', '32100', 'important');
        overlayEl.style.setProperty('padding', '16px', 'important');
        overlayEl.style.setProperty('box-sizing', 'border-box', 'important');
        overlayEl.style.setProperty('margin', '0', 'important');
        overlayEl.style.setProperty('transform', 'none', 'important');
      }

      const dialogEl = overlay.find('.acu-system-confirm-dialog')[0] as HTMLElement | undefined;
      if (dialogEl) {
        dialogEl.style.setProperty('margin', 'auto', 'important');
        dialogEl.style.setProperty('max-height', 'calc(100dvh - 32px)', 'important');
        dialogEl.style.setProperty('transform', 'none', 'important');
      }

      setupOverlayClose(overlay, 'acu-system-confirm-overlay', () => finish(false));
      overlay.on('click', '.acu-system-confirm-cancel', () => finish(false));
      overlay.on('click', '.acu-system-confirm-ok', () => finish(true));
      window.setTimeout(() => {
        const confirmButton = overlay.find('.acu-system-confirm-ok')[0] as HTMLButtonElement | undefined;
        confirmButton?.focus();
      }, 0);
    });
  };

  const showDiceSystemInputDialog = (options: {
    title: string;
    message: string;
    detail?: string;
    iconClass: string;
    initialValue?: string;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    inputMode?: string;
    multiline?: boolean;
    readonly?: boolean;
    hideCancel?: boolean;
  }): Promise<string | null> => {
    const { $ } = getCore();
    const config = getConfig();
    const fieldId = `acu-system-input-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const detailHtml = options.detail
      ? `<div class="acu-system-input-detail">${options.detail
          .split('\n')
          .map(line => `<div>${escapeHtml(line)}</div>`)
          .join('')}</div>`
      : '';
    const fieldAttrs = [
      `id="${fieldId}"`,
      'class="acu-system-input-control"',
      `aria-label="${escapeHtml(options.message)}"`,
      `placeholder="${escapeHtml(options.placeholder || '')}"`,
      options.readonly ? 'readonly' : '',
      options.inputMode ? `inputmode="${escapeHtml(options.inputMode)}"` : '',
    ]
      .filter(Boolean)
      .join(' ');
    const initialValue = escapeHtml(options.initialValue || '');
    const fieldHtml = options.multiline
      ? `<textarea ${fieldAttrs}>${initialValue}</textarea>`
      : `<input type="text" ${fieldAttrs} value="${initialValue}">`;
    const cancelButtonHtml = options.hideCancel
      ? ''
      : `<button class="acu-import-cancel-btn acu-system-input-cancel" type="button">${escapeHtml(options.cancelText || '取消')}</button>`;

    return new Promise(resolve => {
      $('.acu-system-input-overlay').remove();
      const overlay = $(`
        <div class="acu-import-confirm-overlay acu-system-input-overlay acu-theme-${config.theme}" tabindex="-1">
          <div class="acu-import-confirm-dialog acu-system-input-dialog" role="dialog" aria-modal="true" aria-labelledby="${fieldId}-title">
            <div class="acu-import-confirm-header">
              <span class="acu-import-confirm-title" id="${fieldId}-title">
                <i class="fa-solid ${escapeHtml(options.iconClass)}"></i>
                ${escapeHtml(options.title)}
              </span>
              <button class="acu-import-close-btn acu-system-input-cancel" type="button" title="关闭" aria-label="关闭">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <div class="acu-import-confirm-body">
              <div class="acu-system-input-content">
                <label class="acu-system-input-label" for="${fieldId}">${escapeHtml(options.message)}</label>
                ${detailHtml}
                ${fieldHtml}
              </div>
            </div>
            <div class="acu-import-confirm-footer">
              ${cancelButtonHtml}
              <button class="acu-import-confirm-btn acu-system-input-ok" type="button">${escapeHtml(options.confirmText || '确定')}</button>
            </div>
          </div>
        </div>
      `);

      let settled = false;
      const finish = (value: string | null): void => {
        if (settled) return;
        settled = true;
        overlay.remove();
        resolve(value);
      };

      $('body').append(overlay);

      const overlayEl = overlay[0] as HTMLElement | undefined;
      if (overlayEl) {
        overlayEl.style.setProperty('position', 'fixed', 'important');
        overlayEl.style.setProperty('top', '0', 'important');
        overlayEl.style.setProperty('left', '0', 'important');
        overlayEl.style.setProperty('right', '0', 'important');
        overlayEl.style.setProperty('bottom', '0', 'important');
        overlayEl.style.setProperty('width', '100vw', 'important');
        overlayEl.style.setProperty('height', '100dvh', 'important');
        overlayEl.style.setProperty('min-height', '100vh', 'important');
        overlayEl.style.setProperty('display', 'flex', 'important');
        overlayEl.style.setProperty('align-items', 'center', 'important');
        overlayEl.style.setProperty('justify-content', 'center', 'important');
        overlayEl.style.setProperty('z-index', '32100', 'important');
        overlayEl.style.setProperty('padding', '16px', 'important');
        overlayEl.style.setProperty('box-sizing', 'border-box', 'important');
        overlayEl.style.setProperty('margin', '0', 'important');
        overlayEl.style.setProperty('transform', 'none', 'important');
      }

      const inputEl = overlay.find('.acu-system-input-control')[0] as
        | HTMLInputElement
        | HTMLTextAreaElement
        | undefined;
      const confirm = (): void => finish(inputEl?.value ?? '');

      setupOverlayClose(overlay, 'acu-system-input-overlay', () => finish(null));
      overlay.on('click', '.acu-system-input-cancel', () => finish(null));
      overlay.on('click', '.acu-system-input-ok', confirm);
      overlay.on('keydown', '.acu-system-input-control', event => {
        if (!options.multiline && event.key === 'Enter') {
          event.preventDefault();
          confirm();
        }
      });
      overlay.on('keydown', event => {
        if (event.key === 'Escape') finish(null);
      });
      window.setTimeout(() => {
        inputEl?.focus();
        if (inputEl instanceof HTMLInputElement && !options.readonly) inputEl.select();
      }, 0);
    });
  };

  const showCustomTableNameIconManager = () => {
    const { $ } = getCore();
    $('.acu-custom-table-name-icon-manager-overlay').remove();

    const config = getConfig();
    let candidates = getCustomTableNameIconManagerCandidates();
    let candidateByKey = new Map(candidates.map(candidate => [candidate.key, candidate]));
    let selectedKey = candidates[0]?.key || '';
    let pendingLocalFile: File | null = null;

    const moduleOptions = [...new Set(candidates.map(candidate => candidate.context.moduleId))]
      .map(
        moduleId =>
          `<option value="${escapeHtml(moduleId)}">${escapeHtml(getCustomTableNameIconManagerModuleLabel(moduleId))}</option>`,
      )
      .join('');
    const tableOptions = [...new Set(candidates.map(candidate => candidate.context.tableName))]
      .sort((left, right) => left.localeCompare(right, 'zh-CN'))
      .map(tableName => `<option value="${escapeHtml(tableName)}">${escapeHtml(tableName)}</option>`)
      .join('');

    const overlay = $(`
      <div class="acu-avatar-manager-overlay acu-custom-table-name-icon-manager-overlay acu-theme-${config.theme}">
        <div class="acu-avatar-manager acu-custom-icon-manager" role="dialog" aria-modal="true" aria-labelledby="acu-custom-icon-manager-title">
          <div class="acu-custom-icon-guide-top">
            <div class="acu-panel-header">
              <div class="acu-avatar-title" id="acu-custom-icon-manager-title"><i class="fa-solid fa-icons"></i> 图标预设管理</div>
              <div class="acu-avatar-header-actions">
                ${getTutorialButtonHtml('customIconManager', '查看图标预设管理教程', 'acu-btn-icon')}
                <button type="button" class="acu-custom-icon-close acu-btn-icon" title="关闭" aria-label="关闭图标预设管理"><i class="fa-solid fa-times"></i></button>
              </div>
            </div>
            <div class="acu-avatar-toolbar acu-custom-icon-toolbar">
              <div class="acu-toolbar-group left acu-avatar-filter-controls acu-custom-icon-filter-controls">
                <div class="acu-select-wrapper sort-field">
                  <select id="acu-custom-icon-module-filter" class="acu-toolbar-select" title="模块过滤" aria-label="按模块过滤">
                    <option value="">全部模块</option>
                    ${moduleOptions}
                  </select>
                </div>
                <div class="acu-select-wrapper sort-field">
                  <select id="acu-custom-icon-table-filter" class="acu-toolbar-select" title="表格过滤" aria-label="按表格过滤">
                    <option value="">全部表格</option>
                    ${tableOptions}
                  </select>
                </div>
              </div>
              <div class="acu-toolbar-group right acu-custom-icon-pack-actions">
                <button type="button" id="acu-custom-icon-import" class="acu-custom-icon-pack-btn" title="导入图标包" aria-label="导入图标包">
                  <i class="fa-solid fa-file-import"></i> <span class="acu-custom-icon-action-label">导入图标包</span>
                </button>
                <button type="button" id="acu-custom-icon-export" class="acu-custom-icon-pack-btn" title="导出图标包" aria-label="导出图标包">
                  <i class="fa-solid fa-file-export"></i> <span class="acu-custom-icon-action-label">导出图标包</span>
                </button>
              </div>
              <div class="acu-search-wrapper acu-custom-icon-search-wrapper">
                <i class="fa-solid fa-magnifying-glass acu-search-icon"></i>
                <input type="text" id="acu-custom-icon-search" class="acu-avatar-search" placeholder="搜索" autocomplete="off" aria-label="搜索图标条目">
              </div>
            </div>
          </div>
          <div class="acu-custom-icon-body">
            <div class="acu-avatar-list acu-custom-icon-list" id="acu-custom-icon-list"></div>
            <div class="acu-avatar-list acu-custom-icon-detail" id="acu-custom-icon-detail"></div>
          </div>
          <input type="file" id="acu-custom-icon-local-file" class="acu-custom-icon-file-input" accept="image/png,image/jpeg,image/webp,image/gif" />
          <input type="file" id="acu-custom-icon-import-file" class="acu-custom-icon-file-input" accept=".json,application/json" />
        </div>
      </div>
    `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    const updateCandidateCache = (): void => {
      candidates = getCustomTableNameIconManagerCandidates();
      candidateByKey = new Map(candidates.map(candidate => [candidate.key, candidate]));
      if (!candidates.some(candidate => candidate.key === selectedKey)) {
        selectedKey = candidates[0]?.key || '';
      }
    };

    const updateFilterOptions = (): void => {
      const moduleSelect = overlay.find('#acu-custom-icon-module-filter');
      const tableSelect = overlay.find('#acu-custom-icon-table-filter');
      const currentModule = String(moduleSelect.val() || '').trim();
      const currentTable = String(tableSelect.val() || '').trim();
      const nextModuleOptions = [...new Set(candidates.map(candidate => candidate.context.moduleId))]
        .map(
          moduleId =>
            `<option value="${escapeHtml(moduleId)}">${escapeHtml(getCustomTableNameIconManagerModuleLabel(moduleId))}</option>`,
        )
        .join('');
      const nextTableOptions = [...new Set(candidates.map(candidate => candidate.context.tableName))]
        .sort((left, right) => left.localeCompare(right, 'zh-CN'))
        .map(tableName => `<option value="${escapeHtml(tableName)}">${escapeHtml(tableName)}</option>`)
        .join('');
      moduleSelect.html(`<option value="">全部模块</option>${nextModuleOptions}`);
      tableSelect.html(`<option value="">全部表格</option>${nextTableOptions}`);
      moduleSelect.val(candidates.some(candidate => candidate.context.moduleId === currentModule) ? currentModule : '');
      tableSelect.val(candidates.some(candidate => candidate.context.tableName === currentTable) ? currentTable : '');
    };

    const getFilteredCandidates = (): CustomTableNameIconManagerCandidate[] => {
      const moduleFilter = String(overlay.find('#acu-custom-icon-module-filter').val() || '').trim();
      const tableFilter = String(overlay.find('#acu-custom-icon-table-filter').val() || '').trim();
      const query = String(overlay.find('#acu-custom-icon-search').val() || '')
        .trim()
        .toLowerCase();
      return candidates.filter(candidate => {
        if (moduleFilter && candidate.context.moduleId !== moduleFilter) return false;
        if (tableFilter && candidate.context.tableName !== tableFilter) return false;
        if (query && !candidate.searchText.includes(query)) return false;
        return true;
      });
    };

    const getSelectedCandidate = (): CustomTableNameIconManagerCandidate | null =>
      selectedKey ? candidateByKey.get(selectedKey) || null : null;

    const renderList = async (): Promise<void> => {
      const filteredCandidates = getFilteredCandidates();
      if (!filteredCandidates.some(candidate => candidate.key === selectedKey)) {
        selectedKey = filteredCandidates[0]?.key || '';
        pendingLocalFile = null;
      }

      if (filteredCandidates.length === 0) {
        overlay.find('#acu-custom-icon-list').html(`
          <div class="acu-import-empty">
            <i class="fa-solid fa-ban"></i> 没有可选择的白名单上下文<br>
            <span class="acu-custom-icon-empty-note">角色、角色头像预设、全局数据表、选项表、检定建议表等非白名单上下文不会出现在这里。</span>
          </div>
        `);
        await renderDetail();
        return;
      }

      const rows = await Promise.all(
        filteredCandidates.map(async candidate => {
          const entry = CustomTableNameIconStoreManager.get(candidate.context);
          const asset = await getCustomTableNameIconManagerEntryAsset(entry);
          const sourceText = entry ? (entry.sourceType === 'local' ? '本地' : 'URL') : '未设置';
          const sourceClass =
            entry?.sourceType === 'local' ? 'acu-source-local' : entry?.sourceType === 'url' ? 'acu-source-url' : '';
          const isSelected = candidate.key === selectedKey;
          const previewImageUrl = formatCssImageUrl(asset.assetUrl, { allowInternalObjectUrl: true });
          const previewStyle = previewImageUrl ? escapeHtml(`background-image:${previewImageUrl};`) : '';
          const missingText = asset.isMissing ? '<span class="acu-custom-icon-missing-text">缺失/需重传</span>' : '';
          const itemLabel = `选择图标预设条目：${candidate.context.name}`;
          return `
            <div class="acu-avatar-item acu-custom-table-name-icon-item ${isSelected ? 'expanded is-selected' : ''}" data-key="${escapeHtml(candidate.key)}" role="button" tabindex="0" aria-label="${escapeHtml(itemLabel)}" aria-current="${isSelected ? 'true' : 'false'}">
              <div class="acu-avatar-row-collapsed">
                <div class="acu-avatar-preview-wrap">
                  <div class="acu-avatar-preview ${asset.assetUrl ? 'has-image' : ''}" style="${previewStyle}">
                    ${asset.assetUrl ? '' : '<span><i class="fa-solid fa-table"></i></span>'}
                  </div>
                  <span class="acu-avatar-source ${sourceClass}">${sourceText}</span>
                </div>
                <div class="acu-avatar-info acu-custom-icon-list-info">
                  <div class="acu-avatar-name acu-custom-icon-list-name">
                    <span>${escapeHtml(candidate.context.name)}</span>${missingText}
                  </div>
                  <div class="acu-avatar-url-preview">
                    ${escapeHtml(getCustomTableNameIconManagerContextLabel(candidate.context))}
                  </div>
                </div>
              </div>
            </div>
          `;
        }),
      );
      overlay.find('#acu-custom-icon-list').html(rows.join(''));
    };

    const renderDetail = async (): Promise<void> => {
      const candidate = getSelectedCandidate();
      if (!candidate) {
        overlay.find('#acu-custom-icon-detail').html(`
          <div class="acu-import-empty">
            <i class="fa-solid fa-circle-info"></i> 请选择一个白名单条目
          </div>
        `);
        return;
      }

      const entry = CustomTableNameIconStoreManager.get(candidate.context);
      const asset = await getCustomTableNameIconManagerEntryAsset(entry);
      const previewImageUrl = formatCssImageUrl(asset.assetUrl, { allowInternalObjectUrl: true });
      const previewStyle = previewImageUrl ? escapeHtml(`background-image:${previewImageUrl};`) : '';
      const missingNotice = asset.isMissing
        ? '<div class="acu-custom-icon-warning"><i class="fa-solid fa-triangle-exclamation"></i> 本地图片缺失或 URL 无效，运行时会回退默认图标，请重新上传或保存 URL。</div>'
        : '';

      overlay.find('#acu-custom-icon-detail').html(`
        <div class="acu-custom-icon-detail-panel">
          <div class="acu-custom-icon-detail-head">
            <div class="acu-avatar-preview ${asset.assetUrl ? 'has-image' : ''}" style="${previewStyle}">
              ${asset.assetUrl ? '' : '<span><i class="fa-solid fa-table"></i></span>'}
            </div>
            <div class="acu-custom-icon-detail-title">
              <div class="acu-avatar-name">${escapeHtml(candidate.context.name)}</div>
              <div class="acu-avatar-url-preview">${escapeHtml(getCustomTableNameIconManagerContextLabel(candidate.context))}</div>
            </div>
          </div>
          <div class="acu-custom-icon-detail-form">
            <label class="acu-custom-icon-field">
              <span class="acu-custom-icon-url-label">
                URL 图片地址
                ${
                  pendingLocalFile
                    ? `<span id="acu-custom-icon-local-status" class="acu-custom-icon-local-status">已选择：${escapeHtml(pendingLocalFile.name)}</span>`
                    : ''
                }
              </span>
              <input id="acu-custom-icon-url" class="acu-input acu-custom-icon-url-input" type="url" value="${escapeHtml(entry?.sourceType === 'url' ? entry.imageUrl : '')}" placeholder="https://example.com/icon.png" autocomplete="off" aria-label="URL 图片地址" />
            </label>
            ${missingNotice}
          </div>
          <div class="acu-custom-icon-detail-actions">
            <button type="button" id="acu-custom-icon-save" class="acu-custom-icon-detail-btn acu-custom-icon-primary-btn" title="保存 URL" aria-label="保存图标 URL">
              <i class="fa-solid fa-link"></i> 保存 URL
            </button>
            <button type="button" id="acu-custom-icon-pick-local" class="acu-custom-icon-detail-btn" title="上传本地图片" aria-label="上传本地图片">
              <i class="fa-solid fa-cloud-arrow-up"></i> 上传
            </button>
            <button type="button" id="acu-custom-icon-save-local" class="acu-custom-icon-detail-btn" title="保存本地图片" aria-label="保存本地图片">
              <i class="fa-solid fa-floppy-disk"></i> 保存本地
            </button>
            <button type="button" id="acu-custom-icon-clear-input" class="acu-custom-icon-detail-btn" title="清空图标输入" aria-label="清空图标输入">
              <i class="fa-solid fa-eraser"></i> 清空输入框
            </button>
            <button type="button" id="acu-custom-icon-delete" class="acu-custom-icon-detail-btn acu-custom-icon-danger-btn" title="删除图标映射" aria-label="删除图标映射">
              <i class="fa-solid fa-trash"></i> 删除
            </button>
          </div>
        </div>
      `);
      overlay.find('#acu-custom-icon-save i').removeClass('fa-link').addClass('fa-floppy-disk');
    };

    const refreshManager = async (): Promise<void> => {
      updateCandidateCache();
      updateFilterOptions();
      await renderList();
      await renderDetail();
    };

    const refreshRenderedIconConsumers = (): void => {
      const dataArea = $('#acu-data-area');
      if (!dataArea.length || !dataArea.hasClass('visible')) return;

      const rawData = getCachedRawData() || getTableData();
      if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) {
        dataArea.html(renderGlobalInteractionsPanel(rawData));
        hydrateCustomTableNameIconsIn(dataArea as JQuery<HTMLElement>);
        bindGlobalInteractionEvents(dataArea as JQuery<HTMLElement>);
        return;
      }

      if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) {
        const tables = processJsonData(rawData || {});
        dataArea.html(renderDashboard(tables));
        hydrateCustomTableNameIconsIn(dataArea as JQuery<HTMLElement>);
        bindEvents(tables);
        loadDashboardNpcAvatars();
        return;
      }

      hydrateCustomTableNameIconsIn(dataArea as JQuery<HTMLElement>);
    };

    let renderedIconConsumersRefreshTimer: ReturnType<typeof setTimeout> | null = null;

    const cancelRenderedIconConsumersRefresh = (): void => {
      if (!renderedIconConsumersRefreshTimer) return;
      clearTimeout(renderedIconConsumersRefreshTimer);
      renderedIconConsumersRefreshTimer = null;
    };

    const scheduleRenderedIconConsumersRefresh = (): void => {
      cancelRenderedIconConsumersRefresh();
      renderedIconConsumersRefreshTimer = setTimeout(() => {
        renderedIconConsumersRefreshTimer = null;
        refreshRenderedIconConsumers();
      }, 80);
    };

    const closeCustomIconManager = (): void => {
      cancelRenderedIconConsumersRefresh();
      overlay.remove();
    };

    const removeSelectedCustomIconMapping = async (successMessage: string): Promise<boolean> => {
      const candidate = getSelectedCandidate();
      if (!candidate) return false;
      const entry = CustomTableNameIconStoreManager.get(candidate.context);
      pendingLocalFile = null;
      overlay.find('#acu-custom-icon-url').val('');
      if (!entry) {
        if (window.toastr) window.toastr.info('该条目没有图标映射');
        await refreshManager();
        return false;
      }
      if (entry.sourceType === 'local' && entry.localIconKey) {
        await CustomTableNameIconImageDB.delete(entry.localIconKey);
      }
      const removed = CustomTableNameIconStoreManager.delete(candidate.context);
      CustomTableNameIconStoreManager.invalidate();
      if (removed) window.toastr?.success(successMessage);
      else showActionableErrorToast('删除图标映射失败，当前条目可能已被刷新或存储状态异常。', { developerHint: true });
      await refreshManager();
      scheduleRenderedIconConsumersRefresh();
      return removed;
    };

    overlay.on(
      'change input',
      '#acu-custom-icon-module-filter, #acu-custom-icon-table-filter, #acu-custom-icon-search',
      () => {
        pendingLocalFile = null;
        void refreshManager();
      },
    );

    overlay.on('click', '.acu-custom-table-name-icon-item', function () {
      selectedKey = String($(this).data('key') || '');
      pendingLocalFile = null;
      void refreshManager();
    });

    overlay.on('keydown', '.acu-custom-table-name-icon-item', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      $(this).trigger('click');
    });

    overlay.on('click', '#acu-custom-icon-save', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const previousEntry = CustomTableNameIconStoreManager.get(candidate.context);
      const now = Date.now();

      if (pendingLocalFile) {
        const validationError = getCustomTableNameIconLocalFileValidationError(pendingLocalFile);
        if (validationError) {
          if (window.toastr) window.toastr.warning(getCustomTableNameIconManagerInvalidSourceText(validationError));
          return;
        }

        const localIconKey = getCustomTableNameIconManagerLocalKey(candidate.context);
        const savedImage = await CustomTableNameIconImageDB.save(localIconKey, pendingLocalFile);
        if (!savedImage) {
          showActionableErrorToast('本地图标保存失败，图片没有写入本地浏览器存储。', { suggestion: 'image' });
          return;
        }

        const saved = CustomTableNameIconStoreManager.save({
          ...candidate.context,
          sourceType: 'local',
          imageUrl: '',
          localIconKey,
          imageMimeType: pendingLocalFile.type || null,
          imageSize: pendingLocalFile.size,
          createdAt: previousEntry?.createdAt || now,
          updatedAt: now,
        });
        CustomTableNameIconStoreManager.invalidate();
        pendingLocalFile = null;
        scheduleRenderedIconConsumersRefresh();
        if (saved) window.toastr?.success('本地图标已保存');
        else showActionableErrorToast('保存本地图标映射失败，图标文件已读取但映射配置没有写入。', { developerHint: true });
        await refreshManager();
        return;
      }

      if (previousEntry?.sourceType === 'local') {
        if (window.toastr) window.toastr.info('已保留本地图标；如需改用 URL，请先清空映射。');
        await refreshManager();
        return;
      }

      const imageUrl = String(overlay.find('#acu-custom-icon-url').val() || '').trim();
      const validationError = getCustomTableNameIconImageUrlValidationError(imageUrl);
      if (validationError) {
        if (window.toastr) window.toastr.warning(getCustomTableNameIconManagerInvalidSourceText(validationError));
        return;
      }

      if (previousEntry?.sourceType === 'local' && previousEntry.localIconKey) {
        await CustomTableNameIconImageDB.delete(previousEntry.localIconKey);
      }

      const saved = CustomTableNameIconStoreManager.save({
        ...candidate.context,
        sourceType: 'url',
        imageUrl,
        localIconKey: null,
        imageMimeType: null,
        imageSize: null,
        createdAt: previousEntry?.createdAt || now,
        updatedAt: now,
      });
      CustomTableNameIconStoreManager.invalidate();
      CustomTableNameIconImageDB.clearUrlFailure(imageUrl);
      scheduleRenderedIconConsumersRefresh();
      if (saved) window.toastr?.success('图标 URL 已保存');
      else showActionableErrorToast('保存图标 URL 映射失败，配置没有写入本地存储。', { developerHint: true });
      await refreshManager();
    });

    overlay.on('click', '#acu-custom-icon-save-url', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const imageUrl = String(overlay.find('#acu-custom-icon-url').val() || '').trim();
      const validationError = getCustomTableNameIconImageUrlValidationError(imageUrl);
      if (validationError) {
        if (window.toastr) window.toastr.warning(getCustomTableNameIconManagerInvalidSourceText(validationError));
        return;
      }

      const previousEntry = CustomTableNameIconStoreManager.get(candidate.context);
      if (previousEntry?.sourceType === 'local' && previousEntry.localIconKey) {
        await CustomTableNameIconImageDB.delete(previousEntry.localIconKey);
      }

      const now = Date.now();
      const saved = CustomTableNameIconStoreManager.save({
        ...candidate.context,
        sourceType: 'url',
        imageUrl,
        localIconKey: null,
        imageMimeType: null,
        imageSize: null,
        createdAt: previousEntry?.createdAt || now,
        updatedAt: now,
      });
      CustomTableNameIconStoreManager.invalidate();
      CustomTableNameIconImageDB.clearUrlFailure(imageUrl);
      pendingLocalFile = null;
      scheduleRenderedIconConsumersRefresh();
      if (saved) window.toastr?.success('图标 URL 已保存');
      else showActionableErrorToast('保存图标 URL 映射失败，配置没有写入本地存储。', { developerHint: true });
      await refreshManager();
    });

    overlay.on('click', '#acu-custom-icon-pick-local', () => {
      overlay.find('#acu-custom-icon-local-file').trigger('click');
    });

    overlay.on('change', '#acu-custom-icon-local-file', function (event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      const validationError = getCustomTableNameIconLocalFileValidationError(file);
      if (validationError) {
        pendingLocalFile = null;
        if (window.toastr) window.toastr.warning(getCustomTableNameIconManagerInvalidSourceText(validationError));
        input.value = '';
        void renderDetail();
        return;
      }
      pendingLocalFile = file;
      input.value = '';
      void renderDetail();
    });

    overlay.on('click', '#acu-custom-icon-save-local', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const validationError = getCustomTableNameIconLocalFileValidationError(pendingLocalFile);
      if (validationError || !pendingLocalFile) {
        if (window.toastr) window.toastr.warning(getCustomTableNameIconManagerInvalidSourceText(validationError));
        return;
      }

      const localIconKey = getCustomTableNameIconManagerLocalKey(candidate.context);
      const savedImage = await CustomTableNameIconImageDB.save(localIconKey, pendingLocalFile);
      if (!savedImage) {
        showActionableErrorToast('本地图片保存失败，图片没有写入本地浏览器存储。', { suggestion: 'image' });
        return;
      }

      const previousEntry = CustomTableNameIconStoreManager.get(candidate.context);
      const now = Date.now();
      const saved = CustomTableNameIconStoreManager.save({
        ...candidate.context,
        sourceType: 'local',
        imageUrl: '',
        localIconKey,
        imageMimeType: pendingLocalFile.type || null,
        imageSize: pendingLocalFile.size,
        createdAt: previousEntry?.createdAt || now,
        updatedAt: now,
      });
      CustomTableNameIconStoreManager.invalidate();
      pendingLocalFile = null;
      scheduleRenderedIconConsumersRefresh();
      if (saved) window.toastr?.success('本地图标已保存');
      else showActionableErrorToast('保存本地图标映射失败，图标文件已读取但映射配置没有写入。', { developerHint: true });
      await refreshManager();
    });

    overlay.on('click', '#acu-custom-icon-clear-input', async () => {
      await removeSelectedCustomIconMapping('图标映射已清空');
    });

    overlay.on('click', '#acu-custom-icon-delete', async () => {
      const candidate = getSelectedCandidate();
      if (!candidate) return;
      const entry = CustomTableNameIconStoreManager.get(candidate.context);
      if (!entry) {
        if (window.toastr) window.toastr.info('该条目没有图标映射');
        return;
      }
      const confirmed = await showDiceSystemConfirmDialog({
        title: '删除图标映射',
        message: `确定删除「${candidate.context.name}」的图标映射吗？`,
        detail: `${getCustomTableNameIconManagerContextLabel(candidate.context)}\n删除后会回退到默认图标。`,
        iconClass: 'fa-trash',
        confirmText: '删除映射',
        tone: 'danger',
      });
      if (!confirmed) return;
      await removeSelectedCustomIconMapping('图标映射已删除');
    });

    overlay.on('click', '#acu-custom-icon-export', () => {
      const pack = buildCustomTableNameIconPack();
      downloadCustomTableNameIconPack(pack);
      if (window.toastr) window.toastr.success(`已导出 ${pack.entries.length} 条图标映射`);
    });

    overlay.on('click', '#acu-custom-icon-import', () => {
      overlay.find('#acu-custom-icon-import-file').trigger('click');
    });

    overlay.on('change', '#acu-custom-icon-import-file', function (event) {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async loadEvent => {
        input.value = '';
        try {
          const jsonText = typeof loadEvent.target?.result === 'string' ? loadEvent.target.result : '';
          const parsed = JSON.parse(jsonText) as unknown;
          const analysis = analyzeCustomTableNameIconPackImport(parsed);
          if (analysis.importedCount === 0) {
            if (window.toastr) window.toastr.warning('没有可导入的有效图标映射');
            return;
          }

          const summaryText = getCustomTableNameIconPackImportSummaryText(analysis);
          const confirmed = await showDiceSystemConfirmDialog({
            title: '导入图标包',
            message: '将按合并覆盖方式导入图标包。',
            detail: summaryText,
            iconClass: 'fa-file-import',
            confirmText: '继续导入',
            tone: 'warning',
          });
          if (!confirmed) return;

          let importedCount = 0;
          for (const entry of analysis.entriesToImport) {
            const previousEntry = CustomTableNameIconStoreManager.get(entry);
            if (
              previousEntry?.sourceType === 'local' &&
              previousEntry.localIconKey &&
              previousEntry.localIconKey !== entry.localIconKey
            ) {
              await CustomTableNameIconImageDB.delete(previousEntry.localIconKey);
            }
            if (entry.sourceType === 'local' && entry.localIconKey) {
              await CustomTableNameIconImageDB.delete(entry.localIconKey);
            } else if (entry.sourceType === 'url') {
              CustomTableNameIconImageDB.clearUrlFailure(entry.imageUrl);
            }
            if (CustomTableNameIconStoreManager.save(entry)) {
              importedCount += 1;
            }
          }

          CustomTableNameIconStoreManager.invalidate();
          CustomTableNameIconImageDB.cleanup();
          pendingLocalFile = null;
          scheduleRenderedIconConsumersRefresh();
          await refreshManager();
          if (window.toastr) {
            window.toastr.success(
              `图标包导入完成：导入 ${importedCount} 条，覆盖 ${analysis.overwrittenCount} 条，跳过无效 URL ${analysis.skippedInvalidUrlCount} 条，跳过非白名单 ${analysis.skippedNonWhitelistCount} 条，本地缺失 ${analysis.localMissingCount} 条`,
            );
          }
        } catch (error) {
          console.error('[DICE][CUSTOM_ICON]导入图标包失败:', error);
          if (window.toastr) {
            showActionableErrorToast(`图标包导入失败: ${error instanceof Error ? error.message : String(error)}`, {
              suggestion: '请确认图标包是从本功能导出的 JSON 文件；如果文件无误仍失败，请打开控制台复制 [DICE][CUSTOM_ICON] 日志联系开发者。',
            });
          }
        }
      };
      reader.readAsText(file);
    });

    overlay.find('.acu-custom-icon-close').on('click', event => {
      event.preventDefault();
      event.stopPropagation();
      closeCustomIconManager();
    });
    setupOverlayClose(overlay, 'acu-custom-table-name-icon-manager-overlay', closeCustomIconManager);
    void refreshManager();
  };

  const handleCustomTableNameIconImageDBPagehide = (): void => {
    CustomTableNameIconImageDB.cleanup();
  };

  window.addEventListener('pagehide', handleCustomTableNameIconImageDBPagehide, { once: true });

  const isOptionTableName = tableName => String(tableName || '').includes('选项');
  const isCheckSuggestionTableName = tableName => String(tableName || '').includes('检定建议');

  const getOptionItemsFromTable = tableData => {
    const items: { text: string; rowIndex: number; colIndex: number; header: string }[] = [];
    const rows = Array.isArray(tableData?.rows) ? tableData.rows : [];
    const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];

    rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return;
      row.forEach((cell, colIndex) => {
        if (colIndex <= 0) return;
        const text = String(cell ?? '').trim();
        if (!text) return;
        items.push({
          text,
          rowIndex,
          colIndex,
          header: String(headers[colIndex] ?? ''),
        });
      });
    });

    return items;
  };

  const renderOptionButtonHtml = (text: string): string =>
    `<button class="acu-opt-btn" data-val="${safeEncodeURIComponent(text)}">${escapeHtml(text)}</button>`;

  const renderCheckSuggestionOptionButtonHtml = (displayText: string, commandText: string): string =>
    `<button class="acu-check-suggestion-btn" data-display="${safeEncodeURIComponent(displayText)}" data-command="${safeEncodeURIComponent(commandText)}">${escapeHtml(displayText || '未填写展示文本')}</button>`;

  const getCheckSuggestionItemsFromTable = tableData => {
    const items: { displayText: string; commandText: string; rowIndex: number; rowId: string }[] = [];
    const rows = Array.isArray(tableData?.rows) ? tableData.rows : [];
    const headers = Array.isArray(tableData?.headers) ? tableData.headers : [];
    const displayCol = headers.findIndex(header => String(header || '').includes('展示'));
    const commandCol = headers.findIndex(header => String(header || '').includes('骰子命令'));
    const safeDisplayCol = displayCol >= 0 ? displayCol : 1;
    const safeCommandCol = commandCol >= 0 ? commandCol : 2;

    rows.forEach((row, rowIndex) => {
      if (!Array.isArray(row)) return;
      const displayText = String(row[safeDisplayCol] ?? '').trim();
      const commandText = String(row[safeCommandCol] ?? '').trim();
      if (!displayText && !commandText) return;
      items.push({
        displayText,
        commandText,
        rowIndex,
        rowId: String(row[0] ?? rowIndex + 1),
      });
    });

    return items;
  };

  const getBadgeStyle = text => {
    if (!text) return '';
    const str = String(text).trim();
    if (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str)) return 'acu-badge-green';
    if (str.length <= 6 && !str.includes('http')) return 'acu-badge-neutral';
    if (['是', '否', '有', '无', '死亡', '存活'].includes(str)) return 'acu-badge-neutral';
    return '';
  };

  interface RenderDataCardCellOptions {
    rawHeaderName: string;
    cell: unknown;
    isFieldLocked?: boolean;
    diceIconFontSize?: string;
    numericDiceMarginLeft?: boolean;
  }

  interface RenderDataCardCellResult {
    headerName: string;
    contentHtml: string;
    hideLabel: boolean;
    shouldRender: boolean;
  }

  type RenderRelationshipItem = {
    name: string;
    relation: string;
  };

  const getRenderPresetBadgeStyle = (text: string, preset: RenderPreset): string => {
    const rules = preset.rules.badges;
    if (!rules.enabled) return '';
    const str = String(text || '').trim();
    if (!str) return '';
    if (rules.numericPattern && (/^[0-9]+%?$/.test(str) || /^Lv\.\d+$/.test(str))) return 'acu-badge-green';
    if (str.length <= rules.shortTextMaxLength && !str.includes('http')) return 'acu-badge-neutral';
    if (rules.statusValues.includes(str)) return 'acu-badge-neutral';
    return '';
  };

  const parseRenderPresetAttributes = (rawStr: string, preset: RenderPreset): CharacterAttributeEntry[] => {
    const rules = preset.rules.attributes;
    if (!rules.enabled) return [];
    const trimmed = String(rawStr || '').trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return rules.parseJsonObject ? parseAttributeString(trimmed) : [];
    }
    return rules.parseKeyValuePairs ? parseAttributeString(trimmed) : [];
  };

  const renderInlineQuickCheckButton = (
    attrName: string,
    attrValue: number,
    options: { fontSize?: string; marginLeft?: boolean } = {},
  ): string => {
    if (!RenderPresetManager.shouldShowQuickCheck(attrName)) return '';
    const styleParts = [
      'cursor:pointer',
      'color:var(--acu-accent)',
      'opacity:0.5',
      `font-size:${options.fontSize || '11px'}`,
    ];
    if (options.marginLeft) styleParts.push('margin-left:6px');
    return (
      '<i class="fa-solid fa-dice-d20 acu-inline-dice-btn" data-attr-name="' +
      escapeHtml(attrName) +
      '" data-attr-value="' +
      attrValue +
      '" style="' +
      styleParts.join(';') +
      ';" title="检定"></i>'
    );
  };

  const renderDataCardCellContent = (options: RenderDataCardCellOptions): RenderDataCardCellResult => {
    const preset = RenderPresetManager.getActivePreset();
    const rawHeaderName = String(options.rawHeaderName || '');
    const headerName = RenderPresetManager.getColumnDisplayName(rawHeaderName || '属性');
    const rawStrOriginal = String(options.cell ?? '').trim();
    const rawStr = replaceUserPlaceholders(rawStrOriginal);
    const isFieldLocked = options.isFieldLocked === true;

    if (RenderPresetManager.isInvalidValue(rawStr)) {
      return { headerName, contentHtml: '', hideLabel: false, shouldRender: false };
    }

    let contentHtml = '';
    let hideLabel = false;
    const splitRegex = /[;；]/;
    const isIdentityField =
      RenderPresetManager.isIdentityHeader(rawHeaderName) || RenderPresetManager.isIdentityHeader(headerName);
    const parsedAttrs = isIdentityField ? [] : parseRenderPresetAttributes(rawStr, preset);

    if (isIdentityField) {
      const badgeStyle = getRenderPresetBadgeStyle(rawStr, preset);
      const displayCell = escapeHtml(rawStr) === '' && String(options.cell) !== '0' ? '&nbsp;' : escapeHtml(rawStr);
      contentHtml = badgeStyle ? '<span class="acu-badge ' + badgeStyle + '">' + displayCell + '</span>' : displayCell;
    } else if (RenderPresetManager.isRelationshipCell(rawStr, headerName)) {
      const relations = parseRelationshipString(rawStr) as RenderRelationshipItem[];
      const validRelations = relations.filter(rel => {
        if (!rel.relation) return true;
        return !RenderPresetManager.isInvalidValue(rel.relation);
      });

      if (validRelations.length > 1) {
        hideLabel = true;
        let relHtml = '';
        for (let i = 0; i < validRelations.length; i++) {
          const rel = validRelations[i];
          const borderStyle = i < validRelations.length - 1 ? 'border-bottom:1px dashed rgba(128,128,128,0.2);' : '';
          relHtml += '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;' + borderStyle + '">';
          relHtml +=
            '<span style="color:var(--acu-text-sub);font-size:0.95em;" data-locked="' +
            isFieldLocked +
            '">' +
            escapeHtml(rel.name) +
            '</span>';
          if (rel.relation) {
            relHtml +=
              '<span style="color:var(--acu-text-main);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">' +
              escapeHtml(rel.relation) +
              '</span>';
          }
          relHtml += '</div>';
        }
        contentHtml = '<div class="acu-relation-container">' + relHtml + '</div>';
      } else if (validRelations.length === 1) {
        hideLabel = true;
        const rel = validRelations[0];
        contentHtml = '<div style="display:flex;align-items:center;gap:8px;padding:3px 0;">';
        contentHtml +=
          '<span style="color:var(--acu-text-sub);font-size:0.95em;" data-locked="' +
          isFieldLocked +
          '">' +
          escapeHtml(rel.name) +
          '</span>';
        if (rel.relation) {
          contentHtml +=
            '<span style="color:var(--acu-text-main);font-size:0.85em;background:var(--acu-badge-bg);padding:1px 6px;border-radius:8px;">' +
            escapeHtml(rel.relation) +
            '</span>';
        }
        contentHtml += '</div>';
      }
    } else if (parsedAttrs.length > 1) {
      hideLabel = true;
      let attrsHtml = '';
      for (let i = 0; i < parsedAttrs.length; i++) {
        const attr = parsedAttrs[i];
        attrsHtml += '<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0;">';
        attrsHtml +=
          '<span style="color:var(--acu-text-sub);font-size:0.9em;white-space:nowrap;" data-locked="' +
          isFieldLocked +
          '" title="' +
          escapeHtml(attr.name) +
          '">' +
          escapeHtml(attr.name.length > 3 ? attr.name.substring(0, 5) : attr.name) +
          '</span>';
        attrsHtml += '<div style="display:flex;align-items:center;gap:4px;">';
        attrsHtml +=
          '<span style="color:var(--acu-text-main);font-weight:bold;font-size:0.95em;">' + attr.value + '</span>';
        attrsHtml += renderInlineQuickCheckButton(attr.name, attr.value, {
          fontSize: options.diceIconFontSize || '10px',
        });
        attrsHtml += '</div></div>';
      }
      contentHtml = '<div class="acu-multi-attr-container">' + attrsHtml + '</div>';
    } else if (parsedAttrs.length === 1) {
      hideLabel = true;
      const attr = parsedAttrs[0];
      contentHtml = '<div style="display:flex;justify-content:space-between;align-items:center;">';
      contentHtml +=
        '<span style="color:var(--acu-text-sub);font-size:0.95em;" data-locked="' +
        isFieldLocked +
        '">' +
        escapeHtml(attr.name) +
        '</span>';
      contentHtml += '<div style="display:flex;align-items:center;gap:6px;">';
      contentHtml += '<span style="color:var(--acu-text-main);font-weight:bold;">' + attr.value + '</span>';
      contentHtml += renderInlineQuickCheckButton(attr.name, attr.value, {
        fontSize: options.diceIconFontSize || '11px',
      });
      contentHtml += '</div></div>';
    } else if (
      preset.rules.shortTags.enabled &&
      rawStr.length > 0 &&
      splitRegex.test(rawStr) &&
      !rawStr.includes('http')
    ) {
      const parts = rawStr
        .split(splitRegex)
        .map(s => s.trim())
        .filter(s => s && !RenderPresetManager.isInvalidValue(s));
      const allShort = parts.length > 1 && parts.every(p => p.length <= preset.rules.shortTags.maxLength);
      if (allShort) {
        const tagsHtml = parts
          .map(part => {
            const subStyle = getRenderPresetBadgeStyle(part, preset) || 'acu-badge-neutral';
            return '<span class="acu-badge ' + subStyle + '">' + escapeHtml(part) + '</span>';
          })
          .join('');
        contentHtml = '<div class="acu-tag-container">' + tagsHtml + '</div>';
      } else if (parts.length > 0) {
        contentHtml = escapeHtml(parts.join('; '));
      } else {
        contentHtml = '';
      }
    } else if (isNumericCell(rawStr) && !rawStr.includes(':') && !rawStr.includes('：')) {
      const numVal = extractNumericValue(rawStr);
      contentHtml = '<div style="display:flex;justify-content:space-between;align-items:center;">';
      contentHtml += '<span>' + escapeHtml(rawStr) + '</span>';
      contentHtml += renderInlineQuickCheckButton(headerName, numVal, {
        fontSize: options.diceIconFontSize || '11px',
        marginLeft: options.numericDiceMarginLeft === true,
      });
      contentHtml += '</div>';
    } else {
      const badgeStyle = getRenderPresetBadgeStyle(rawStr, preset);
      const displayCell = escapeHtml(rawStr) === '' && String(options.cell) !== '0' ? '&nbsp;' : escapeHtml(rawStr);
      contentHtml = badgeStyle ? '<span class="acu-badge ' + badgeStyle + '">' + displayCell + '</span>' : displayCell;
    }

    return { headerName, contentHtml, hideLabel, shouldRender: true };
  };

  // [优化] 统一存储封装 (带静默自动清理)
  const Store = {
    get: (key, def = null) => {
      try {
        return JSON.parse(localStorage.getItem(key)) ?? def;
      } catch {
        return def;
      }
    },
    set: (key, val): boolean => {
      try {
        localStorage.setItem(key, JSON.stringify(val));
        return true;
      } catch (e) {
        // 捕获存储空间已满错误
        if (e.name === 'QuotaExceededError' || e.message.includes('quota')) {
          console.warn('[DICE]ACU 存储空间已满，触发静默清理策略...');
          try {
            // 1. 优先删除最占空间的“数据快照” (不影响功能，只会导致下次刷新暂时没有蓝色高亮)
            localStorage.removeItem(STORAGE_KEY_LAST_SNAPSHOT);

            // 2. 再次尝试保存
            localStorage.setItem(key, JSON.stringify(val));
            return true;
          } catch (retryErr) {
            // 如果清理后还是存不下，才弹窗打扰用户
            console.error('[DICE]ACU Store 清理后依然失败', retryErr);
            if (window.toastr && !window._acuQuotaAlerted) {
              window.toastr.warning('⚠️ 浏览器存储空间严重不足，配置保存失败');
              window._acuQuotaAlerted = true;
              setTimeout(() => (window._acuQuotaAlerted = false), 10000);
            }
          }
        } else {
          console.error('[DICE]ACU Store', e);
        }
        return false;
      }
    },
  };

  const getActiveTabState = () => Store.get(STORAGE_KEY_ACTIVE_TAB);
  const saveActiveTabState = v => Store.set(STORAGE_KEY_ACTIVE_TAB, v);


  const clearGlobalInteractionOutsideCapture = (): void => {
    getCleanupGlobalInteractionOutsideCapture()?.();
    setCleanupGlobalInteractionOutsideCapture(null);
  };

  const cleanupGlobalInteractionFloatingMenus = (): void => {
    const { $ } = getCore();
    clearGlobalInteractionOutsideCapture();
    $('.acu-global-interaction-row.is-expanded')
      .removeClass('is-expanded')
      .find('.acu-global-interaction-row-main')
      .attr('aria-expanded', 'false');
    $('.acu-global-interaction-floating-host').remove();
    $('#acu-data-area').off('.globalInteractionEvents');
    $('body').off('.globalInteractionEvents');
    $(document).off('.globalInteractionEvents');
    $(window).off('resize.globalInteractionEvents scroll.globalInteractionEvents');
  };

  // [修复] 统一清理所有面板状态，避免状态残留导致内容错乱
  const clearAllPanelStates = () => {
    cleanupGlobalInteractionFloatingMenus();
    Store.set(STORAGE_KEY_DASHBOARD_ACTIVE, false);
    Store.set(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false);
    Store.set('acu_changes_panel_active', false);
    Store.set('acu_favorites_panel_active', false);
    saveActiveTabState(null);
  };

  // [修复] MVU 面板异步回调防竞态：只有当前仍处于 MVU 标签且无更高优先级面板激活时才允许写入
  function canWriteMvuPanel() {
    if (getActiveTabState() !== MvuModule.MODULE_ID) return false;
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) return false;
    if (Store.get('acu_changes_panel_active', false)) return false;
    if (Store.get('acu_favorites_panel_active', false)) return false;
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return false;
    return true;
  }

  const getSavedTableOrder = () => Store.get(STORAGE_KEY_TABLE_ORDER);
  const saveTableOrder = v => Store.set(STORAGE_KEY_TABLE_ORDER, v);
  const getCollapsedState = () => Store.get(STORAGE_KEY_IS_COLLAPSED, false);
  const saveCollapsedState = v => Store.set(STORAGE_KEY_IS_COLLAPSED, v);
  // [新增] 选项面板独立折叠状态管理
  const getOptionsCollapsedState = () => Store.get(STORAGE_KEY_OPTIONS_COLLAPSED, false);
  const saveOptionsCollapsedState = v => Store.set(STORAGE_KEY_OPTIONS_COLLAPSED, v);
  // [修改] 读取快照时，严格核对身份证 (Chat ID)
  const loadSnapshot = () => {
    const data = Store.get(STORAGE_KEY_LAST_SNAPSHOT);
    if (!data) return null;
    // 获取当前环境指纹
    const currentCtx = getCurrentContextFingerprint();
    // 如果快照里的指纹存在，但和当前不一致，说明是上个角色的数据，必须作废
    if (data._contextId && data._contextId !== currentCtx) {
      return null;
    }
    return data;
  };

  // [修改] 保存快照时，自动注入当前的身份证
  const saveSnapshot = v => {
    if (!v) return;
    // 确保数据对象里带有当前 ChatID
    if (typeof v === 'object') {
      v._contextId = getCurrentContextFingerprint();
    }
    Store.set(STORAGE_KEY_LAST_SNAPSHOT, v);
  };

  const saveCurrentDatabaseSnapshotAsReviewBaseline = (trigger: string): boolean => {
    const current = getTableData({ silent: true });
    if (!current || !hasSheetKeys(current)) return false;
    saveSnapshot(current);
    console.info(`[DICE]已从数据库 API 更新审核基线 (${trigger})`);
    return true;
  };

  // --- [新增] 移植的辅助函数 ---
  const getTableHeights = () => Store.get(STORAGE_KEY_TABLE_HEIGHTS, {});
  const saveTableHeights = v => Store.set(STORAGE_KEY_TABLE_HEIGHTS, v);
  const normalizePanelHeightValue = (value: unknown): number | null => {
    const height = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(height) || height <= 0) return null;
    return Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, height));
  };

  const getPanelDisplayMaxHeight = ($panel?: JQuery<HTMLElement>): number => {
    const panelEl = $panel?.[0];
    const panelDocument = panelEl?.ownerDocument || getTavernHostDocument();
    const panelWindow = panelDocument.defaultView || getTavernHostWindow();
    const viewport = panelWindow.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportHeight = viewport?.height || panelWindow.innerHeight || panelDocument.documentElement.clientHeight || 600;
    const viewportMaxHeight = Math.max(120, Math.floor(viewportHeight - PANEL_VIEWPORT_TOP_GUTTER));
    if (!panelEl) return Math.min(MAX_PANEL_HEIGHT, viewportMaxHeight);

    const rect = panelEl.getBoundingClientRect();
    const availableAbovePanel = Math.floor(rect.bottom - viewportTop - PANEL_VIEWPORT_TOP_GUTTER);
    const availableHeight =
      availableAbovePanel > 0 ? Math.min(viewportMaxHeight, availableAbovePanel) : viewportMaxHeight;
    return Math.max(120, Math.min(MAX_PANEL_HEIGHT, availableHeight));
  };

  const applyPanelDisplayMaxHeight = ($panel: JQuery<HTMLElement>): void => {
    if (!$panel?.length) return;
    $panel[0].style.setProperty('max-height', `${getPanelDisplayMaxHeight($panel)}px`, 'important');
  };

  const clampPanelHeightToDisplay = (
    $panel: JQuery<HTMLElement>,
    height: unknown,
    displayMaxHeight?: number,
  ): number | null => {
    const rawHeight = Number.parseInt(String(height ?? ''), 10);
    if (!Number.isFinite(rawHeight)) return null;
    const normalizedHeight = Math.max(MIN_PANEL_HEIGHT, Math.min(MAX_PANEL_HEIGHT, rawHeight));
    const effectiveMaxHeight =
      typeof displayMaxHeight === 'number' && Number.isFinite(displayMaxHeight)
        ? displayMaxHeight
        : getPanelDisplayMaxHeight($panel);
    return Math.max(MIN_PANEL_HEIGHT, Math.min(effectiveMaxHeight, normalizedHeight));
  };

  const getStoredPanelHeight = (panelKey: unknown): number | null => {
    const key = String(panelKey ?? '').trim();
    if (!key) return null;
    return normalizePanelHeightValue(getTableHeights()[key]);
  };

  const clearPanelRequestedHeight = ($panel: JQuery<HTMLElement>): void => {
    if (!$panel?.length) return;
    applyPanelDisplayMaxHeight($panel);
    $panel.css('height', '').removeClass('acu-manual-mode').removeAttr('data-acu-requested-height');
  };

  const setPanelRequestedHeight = ($panel: JQuery<HTMLElement>, height: unknown): number | null => {
    if (!$panel?.length) return null;
    const displayMaxHeight = getPanelDisplayMaxHeight($panel);
    const normalizedHeight = clampPanelHeightToDisplay($panel, height, displayMaxHeight);
    $panel[0].style.setProperty('max-height', `${displayMaxHeight}px`, 'important');
    if (!normalizedHeight) {
      clearPanelRequestedHeight($panel);
      return null;
    }
    $panel
      .css('height', `${normalizedHeight}px`)
      .addClass('acu-manual-mode')
      .attr('data-acu-requested-height', String(normalizedHeight));
    return normalizedHeight;
  };

  const applyStoredPanelHeight = ($panel: JQuery<HTMLElement>, panelKey: unknown): number | null => {
    const savedHeight = getStoredPanelHeight(panelKey);
    if (!savedHeight) {
      clearPanelRequestedHeight($panel);
      return null;
    }
    return setPanelRequestedHeight($panel, savedHeight);
  };

  const getPanelDragStartHeight = ($panel: JQuery<HTMLElement>): number => {
    return (
      clampPanelHeightToDisplay($panel, $panel.attr('data-acu-requested-height')) ||
      clampPanelHeightToDisplay($panel, $panel.css('height')) ||
      clampPanelHeightToDisplay($panel, $panel.height()) ||
      MIN_PANEL_HEIGHT
    );
  };

  const savePanelRequestedHeight = (panelKey: unknown, height: unknown): number | null => {
    const key = String(panelKey ?? '').trim();
    const normalizedHeight = normalizePanelHeightValue(height);
    if (!key || !normalizedHeight) return null;
    const heights = getTableHeights();
    heights[key] = normalizedHeight;
    saveTableHeights(heights);
    return normalizedHeight;
  };

  const resetPanelRequestedHeight = ($panel: JQuery<HTMLElement>, panelKey: unknown): void => {
    const key = String(panelKey ?? '').trim();
    if (key) {
      const heights = getTableHeights();
      delete heights[key];
      saveTableHeights(heights);
    }
    clearPanelRequestedHeight($panel);
  };

  const getActivePanelHeightKey = (): string | null => {
    if (Store.get(STORAGE_KEY_DASHBOARD_ACTIVE, false)) return '仪表盘';
    if (Store.get('acu_changes_panel_active', false)) return '审核面板';
    if (Store.get('acu_favorites_panel_active', false)) return '收藏夹';
    if (Store.get(STORAGE_KEY_GLOBAL_INTERACTIONS_ACTIVE, false)) return '交互总览';
    const activeTab = String(getActiveTabState() || '').trim();
    return activeTab || null;
  };

  const getTableStyles = () => Store.get(STORAGE_KEY_TABLE_STYLES, {});
  const saveTableStyles = v => Store.set(STORAGE_KEY_TABLE_STYLES, v);
  const getHiddenTables = () => Store.get(STORAGE_KEY_HIDDEN_TABLES, []);
  const saveHiddenTables = v => Store.set(STORAGE_KEY_HIDDEN_TABLES, v);
  const getReverseTables = () => Store.get(STORAGE_KEY_REVERSE_TABLES, []);
  const saveReverseTables = v => Store.set(STORAGE_KEY_REVERSE_TABLES, v);

  const normalizeTableNameList = tableNames => {
    if (!Array.isArray(tableNames)) return [];
    return Array.from(new Set(tableNames.filter(name => typeof name === 'string' && name.trim())));
  };

  const getNormalizedReverseTables = () => normalizeTableNameList(getReverseTables());

  // 判断表格是否需要显示倒序按钮
  const shouldShowReverseButton = tableName => {
    return typeof tableName === 'string' && tableName.trim().length > 0;
  };

  // 判断表格当前是否为倒序
  const isTableReversed = tableName => {
    return getNormalizedReverseTables().includes(tableName);
  };

  const areAllTablesReversed = tableNames => {
    const names = normalizeTableNameList(tableNames);
    if (names.length === 0) return false;
    const reverseSet = new Set(getNormalizedReverseTables());
    return names.every(name => reverseSet.has(name));
  };

  const setAllTablesReverse = (tableNames, enabled) => {
    const targetNames = normalizeTableNameList(tableNames);
    if (targetNames.length === 0) return;

    const targetSet = new Set(targetNames);
    if (enabled) {
      saveReverseTables(Array.from(new Set([...getNormalizedReverseTables(), ...targetNames])));
    } else {
      saveReverseTables(getNormalizedReverseTables().filter(name => !targetSet.has(name)));
    }
  };

  // 切换表格倒序状态
  const toggleTableReverse = tableName => {
    const list = getNormalizedReverseTables();
    const idx = list.indexOf(tableName);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(tableName);
    }
    saveReverseTables(list);
    console.log('[DICE]ACU toggleTableReverse:', tableName, 'reversed:', idx < 0);
  };
  // [新增] 根据角色名获取属性列表
  const getAttributesForCharacter = characterName => {
    return getFullAttributesForCharacter(characterName).map(attr => attr.name);
  };
  const normalizeAttributeName = (name: string): string => {
    if (!name) return '';
    return String(name)
      .trim()
      .toLowerCase()
      .replace(/[\s_:\-：]/g, '')
      .replace(/值$/u, '');
  };

  const resolveAttributeAliasName = (
    characterName: string,
    targetName: string,
    aliasCandidates: string[] = [],
  ): { name: string | null; reason?: string } => {
    const allAttrs = getFullAttributesForCharacter(characterName)
      .map(attr => attr.name)
      .filter(Boolean);
    if (allAttrs.length === 0) {
      return { name: targetName || null };
    }

    const orderedCandidates = [targetName, ...aliasCandidates]
      .map(n => String(n || '').trim())
      .filter(Boolean)
      .filter((n, idx, arr) => arr.indexOf(n) === idx);
    if (orderedCandidates.length === 0) {
      return { name: null, reason: '目标属性名为空' };
    }

    for (const candidate of orderedCandidates) {
      if (allAttrs.includes(candidate)) {
        return { name: candidate };
      }
    }

    const lowerMap = new Map<string, string>();
    allAttrs.forEach(name => {
      const lower = name.toLowerCase();
      if (!lowerMap.has(lower)) lowerMap.set(lower, name);
    });
    for (const candidate of orderedCandidates) {
      const matched = lowerMap.get(candidate.toLowerCase());
      if (matched) {
        return { name: matched };
      }
    }

    const normalizedGroups = new Map<string, string[]>();
    allAttrs.forEach(name => {
      const key = normalizeAttributeName(name);
      if (!key) return;
      const list = normalizedGroups.get(key) || [];
      list.push(name);
      normalizedGroups.set(key, list);
    });

    for (const candidate of orderedCandidates) {
      const normalized = normalizeAttributeName(candidate);
      if (!normalized) continue;
      const matched = normalizedGroups.get(normalized) || [];
      if (matched.length === 1) {
        return { name: matched[0] };
      }
      if (matched.length > 1) {
        return {
          name: null,
          reason: `属性别名冲突: ${candidate} 可匹配 ${matched.join(', ')}`,
        };
      }
    }

    return {
      name: null,
      reason: `找不到属性: ${targetName}`,
    };
  };

  const isSameAttributeAlias = (left: string, right: string): boolean => {
    const a = normalizeAttributeName(left);
    const b = normalizeAttributeName(right);
    return Boolean(a) && Boolean(b) && a === b;
  };

  const getAttributeEntryForCharacter = (
    characterName: string,
    attrName: string,
    aliasCandidates: string[] = [],
  ): CharacterAttributeEntry | null => {
    if (!attrName) return null;
    const resolved = resolveAttributeAliasName(characterName, attrName, aliasCandidates);
    if (!resolved.name) return null;
    return getFullAttributesForCharacter(characterName).find(attr => attr.name === resolved.name) || null;
  };

  // [新增] 根据角色名和属性名获取属性值
  const getAttributeValue = (characterName, attrName, aliasCandidates: string[] = []) => {
    const found = getAttributeEntryForCharacter(characterName, attrName, aliasCandidates);
    return found ? found.value : null;
  };

  const pushDiceQuickSelectCharacter = (list: string[], name: unknown, preferFront = false): void => {
    const displayName = getDisplayName(String(name ?? '').trim());
    if (!displayName || list.some(existing => characterNamesMatch(existing, displayName))) return;
    if (preferFront) {
      list.unshift(displayName);
    } else {
      list.push(displayName);
    }
  };

  const getDiceQuickSelectCharacterList = (rawData: DiceRawData | null | undefined): string[] => {
    const list: string[] = [];
    if (!rawData) return list;

    const allTables = processJsonData(rawData || {}) as Record<string, RelationGraphTableInput>;
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    if (playerResult?.data?.rows?.length > 0) {
      const playerConfig = playerResult.config || getDashboardModuleConfig('player') || DASHBOARD_TABLE_CONFIG.player;
      const playerHeaders = playerResult.data.headers || [];
      const playerNameIdx = DashboardDataParser.findColumnIndex(playerHeaders, 'name', playerConfig);
      const safePlayerNameIdx = playerNameIdx >= 0 ? playerNameIdx : findNameColumnIndex(playerHeaders);
      pushDiceQuickSelectCharacter(list, playerResult.data.rows[0]?.[safePlayerNameIdx], true);
    }

    const npcListData = getDashboardNpcListData(allTables);
    const dashboardEntries = (npcListData.entries || []) as Array<{ name?: unknown }>;
    dashboardEntries.forEach(entry => pushDiceQuickSelectCharacter(list, entry.name));

    if (list.length > 0) return list;

    for (const key in rawData) {
      const sheet = rawData[key];
      if (!sheet?.name || !Array.isArray(sheet.content)) continue;
      const headers = sheet.content[0] || [];

      if (isNpcTableName(sheet.name)) {
        const nameIdx = findNameColumnIndex(headers);
        for (let i = 1; i < sheet.content.length; i++) {
          const row = sheet.content[i];
          if (row) pushDiceQuickSelectCharacter(list, row[nameIdx]);
        }
      }

      if (sheet.name.includes('主角') && sheet.content[1]) {
        const nameIdx = findNameColumnIndex(headers);
        pushDiceQuickSelectCharacter(list, sheet.content[1][nameIdx], true);
      }
    }

    return list;
  };

  const getAdvancedPresetMappedTarget = (
    preset: QuickSelectCheckPresetConfig | null | undefined,
    attrName: string,
  ): AttributeQuickSelectTarget | null => {
    const mapping = preset?.attrTargetMapping || {};
    for (const [target, names] of Object.entries(mapping)) {
      if (!isAttributeQuickSelectTarget(target)) continue;
      if (Array.isArray(names) && names.includes(attrName)) return target;
    }
    return null;
  };

  const getAttributePresetMappedTarget = (
    preset: AttributePresetConfig | null | undefined,
    attrName: string,
    source: CharacterAttributeSource | null | undefined,
  ): AttributeQuickSelectTarget | null => {
    if (!preset?.quickSelect) return null;
    const config = normalizeAttributeQuickSelectConfig(preset.quickSelect);
    for (const [target, names] of Object.entries(config.nameTargetMapping)) {
      if (!isAttributeQuickSelectTarget(target)) continue;
      if (Array.isArray(names) && names.includes(attrName)) return target;
    }
    if (source === 'base') return config.baseTarget;
    if (source === 'special') return config.specialTarget;
    return config.fallbackTarget;
  };

  const isQuickSelectTargetAvailable = (
    target: AttributeQuickSelectTarget,
    preset: QuickSelectCheckPresetConfig | null | undefined,
    mode: 'normal' | 'contest',
  ): boolean => {
    if (target === 'attribute') return true;
    if (target === 'skillMod') {
      if (!preset?.skillMod || preset.skillMod.hidden) return false;
      return mode !== 'contest' || preset.contestRule?.hideSkillMod !== true;
    }
    if (target === 'mod') {
      if (!preset?.mod || preset.mod.hidden) return false;
      return mode !== 'contest' || preset.contestRule?.hideMod !== true;
    }
    return false;
  };

  const resolveQuickSelectTarget = (
    attrName: string,
    source: CharacterAttributeSource | null | undefined,
    preset: QuickSelectCheckPresetConfig | null | undefined,
    mode: 'normal' | 'contest',
  ): AttributeQuickSelectTarget => {
    const activeAttributePreset = AttributePresetManager.getActivePreset() as AttributePresetConfig | null;
    const mappedByAttributePreset = getAttributePresetMappedTarget(activeAttributePreset, attrName, source);
    const mappedByCheckPreset = mappedByAttributePreset || getAdvancedPresetMappedTarget(preset, attrName);
    const target = mappedByCheckPreset || 'attribute';
    return isQuickSelectTargetAvailable(target, preset, mode) ? target : 'attribute';
  };

  const formatSignedModifier = (value: number): string => (value >= 0 ? `+${value}` : String(value));

  const getNamedCheckParamText = (value: string | number | boolean | undefined): string | null => {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return null;
    if (/^(true|false|是|否|启用|禁用|开启|关闭)$/i.test(trimmed)) return null;
    return trimmed;
  };

  const buildCheckValueText = (options: {
    preset: AdvancedDicePreset;
    characterName: string;
    actionName: string;
    attrValue: number;
    attrMod: number;
    skillMod: number;
    mode: 'normal' | 'contest';
    attrNameOverride?: string | null;
    skillNameOverride?: string | null;
  }): string => {
    const entry = getAttributeEntryForCharacter(options.characterName, options.actionName);
    const resolvedActionName = entry?.name || options.actionName;
    const mappedTarget = resolveQuickSelectTarget(resolvedActionName, entry?.source, options.preset, options.mode);
    const attrModText = options.attrMod !== 0 ? `（调整值${formatSignedModifier(options.attrMod)}）` : '';
    const attributeName =
      options.attrNameOverride ||
      (mappedTarget === 'skillMod'
        ? options.attrMod !== 0
          ? options.preset.attribute?.label || '属性值'
          : null
        : resolvedActionName);
    const skillName = options.skillNameOverride || (mappedTarget === 'skillMod' ? resolvedActionName : null);

    const parts: string[] = [];
    if (attributeName) parts.push(`${attributeName}${options.attrValue}${attrModText}`);
    if (skillName) parts.push(`${skillName}（技能加值${formatSignedModifier(options.skillMod)}）`);
    else if (options.skillMod !== 0) parts.push(`技能加值${formatSignedModifier(options.skillMod)}`);

    if (parts.length > 0) return parts.join('+');
    return `${options.preset.attribute?.label || '属性值'}${options.attrValue}${attrModText}`;
  };

  const getNormalQuickSelectInputSelector = (target: AttributeQuickSelectTarget): string => {
    if (target === 'skillMod') return '#dice-skill-mod';
    if (target === 'mod') return '#dice-modifier';
    return '#dice-attr-value';
  };
  // [新增] 标准6维属性名
  const STANDARD_ATTRS = ['力量', '敏捷', '体质', '智力', '感知', '魅力'];

  /**
   * 获取当前规则的标准属性名列表
   */
  const getStandardAttrs = () => {
    const preset = AttributePresetManager.getActivePreset();
    if (preset && preset.baseAttributes) {
      return preset.baseAttributes.map(attr => attr.name);
    }
    return STANDARD_ATTRS;
  };

  /**
   * 获取当前规则的随机属性池（包含基本属性和特殊属性）
   * 默认状态：返回所有规则预设的属性合并（超级大杂烩）
   * 选中特定规则时：返回该规则的基本属性 + 特殊属性
   */
  const getRandomSkillPool = () => {
    try {
      const preset = AttributePresetManager.getActivePreset();
      if (preset) {
        // 选中特定规则：返回该规则的基本属性 + 特殊属性
        const allAttrs = new Set();

        // 添加基本属性
        if (preset.baseAttributes && Array.isArray(preset.baseAttributes)) {
          preset.baseAttributes.forEach(attr => {
            const attrName = typeof attr === 'string' ? attr : attr && attr.name;
            if (attrName) {
              allAttrs.add(attrName);
            }
          });
        }

        // 添加特殊属性
        if (preset.specialAttributes && Array.isArray(preset.specialAttributes)) {
          preset.specialAttributes.forEach(attr => {
            const attrName = typeof attr === 'string' ? attr : attr && attr.name;
            if (attrName) {
              allAttrs.add(attrName);
            }
          });
        }

        return Array.from(allAttrs);
      }

      // 默认状态（没有激活预设）：返回所有规则预设的属性合并（超级大杂烩）
      const allPresets = AttributePresetManager.getAllPresets() || [];
      const allAttrs = new Set(RANDOM_SKILL_POOL || []); // 先添加默认池

      // 合并所有预设的基本属性和特殊属性
      if (Array.isArray(allPresets)) {
        allPresets.forEach(p => {
          if (!p) return;

          // 添加基本属性
          if (p.baseAttributes && Array.isArray(p.baseAttributes)) {
            p.baseAttributes.forEach(attr => {
              const attrName = typeof attr === 'string' ? attr : attr && attr.name;
              if (attrName) {
                allAttrs.add(attrName);
              }
            });
          }

          // 添加特殊属性
          if (p.specialAttributes && Array.isArray(p.specialAttributes)) {
            p.specialAttributes.forEach(attr => {
              const attrName = typeof attr === 'string' ? attr : attr && attr.name;
              if (attrName) {
                allAttrs.add(attrName);
              }
            });
          }
        });
      }

      return Array.from(allAttrs);
    } catch (err) {
      console.error('[DICE]ACU getRandomSkillPool 错误:', err);
      return RANDOM_SKILL_POOL || [];
    }
  };

  // [新增] 随机技能池（用于属性名随机生成，可自由增减）
  const RANDOM_SKILL_POOL = [
    // --- 身体与移动类 (Physical & Movement) ---
    '杂技',
    '特技',
    '运动',
    '格斗',
    '斗殴',
    '攀爬',
    '健康',
    '闪避',
    '身法',
    '驾驶',
    '耐力',
    '灵巧',
    '巧手',
    '戏法',
    '跑酷',
    '飞行',
    '潜行',
    '渗透',
    '骑术',
    '游泳',
    '投掷',
    '跳跃',
    '体操',
    '功夫',
    '武术',

    // --- 社交与心理类 (Social & Psychological) ---
    '行政',
    '官僚',
    '权威',
    '命令',
    '交易',
    '掮客',
    '欺诈',
    '诱骗',
    '谎言侦测',
    '狂欢',
    '交际',
    '摆布',
    '镇定',
    '黑话',
    '行话',
    '礼节',
    '礼仪',
    '信誉',
    '财力',
    '戏剧',
    '表演',
    '共情',
    '洞察',
    '情感',
    '团队精神',
    '话术',
    '博弈',
    '赌博',
    '阅人',
    '小透明',
    '审讯',
    '恐吓',
    '挑衅',
    '领导',
    '谈判',
    '演说',
    '精神分析',
    '街头智慧',
    '边缘知识',
    '残酷真相',
    '意志',
    '决心',
    '说服',
    '魅惑',
    '威吓',
    '游说',
    '交涉',
    '察言观色',
    '欺骗',
    '洞悉',
    '欺瞒',
    // 网络/现代用语
    '标新立异',
    '脑内剧场',
    '神游太虚',
    '踩地雷',
    '顾左右而言他',
    '主角光环',
    '厚颜无耻',
    '甩锅',
    '造假',
    '废话文学',
    '上头',
    '破防',
    '种草',
    '社死',
    '点子',
    '惊世智慧',
    '奶龙之力',
    '狗屎运',
    '天意',
    '桃花运',

    // --- 技术与技艺类 (Technical & Crafting) ---
    '建筑学',
    '军械',
    '枪械制造',
    '工匠',
    '技艺',
    '生物科技',
    '露营',
    '化学',
    '药理',
    '创作',
    '电脑',
    '黑客',
    '赛博技术',
    '爆破',
    '电子学',
    '工程学',
    '急救',
    '伪造',
    '信息安全',
    '修补',
    '捣鼓',
    '开锁',
    '机械',
    '修理',
    '医学',
    '摄影',
    '编程',
    '锻造',
    '编译',
    '科技使用',
    '机械维修',
    '电气维修',
    '锁匠',
    '操作重型机械',
    '药学',
    '艺术',

    // --- 知识与调查类 (Knowledge & Investigation) ---
    '会计',
    '人类学',
    '智慧生物学',
    '考古学',
    '灵视',
    '导航',
    '方向',
    '天文学',
    '生物学',
    '犯罪学',
    '神话',
    '禁忌知识',
    '文化',
    '习俗',
    '法医',
    '搜证',
    '历史',
    '人力情报',
    '调查',
    '搜索',
    '语言',
    '语言学',
    '法律',
    '图书馆使用',
    '研究',
    '学识',
    '侦察',
    '神秘学',
    '物理',
    '有备无患',
    '信号情报',
    '生存',
    '战术',
    '神学',
    '通识',
    '侦查',
    '聆听',
    '心理学',
    '追踪',
    '博物学',
    '克苏鲁神话',
    '地质学',
    '气象学',
    '奥秘',
    '自然',
    '宗教',
    '察觉',
    '求生',
    '情报收集',
    '估价',
    '密语',
    '读唇',
    '手语',

    // --- 战斗与特殊类 (Combat & Special) ---
    '弓术',
    '炮术',
    '引导',
    '召唤',
    '信仰',
    '奇迹',
    '击剑',
    '枪械',
    '射击',
    '重武器',
    '先攻',
    '神射',
    '狙击',
    '武艺',
    '近战',
    '兵器',
    '预兆',
    '运气',
    '格挡',
    '灵能',
    '巫术',
    '施法',
    '茶道',
    '破坏',
    '剑术',
    '斧术',
    '鞭术',
    '躲藏',
    '乔装',
    '隐匿',
    '驯兽',
    '医疗',
    '催眠',
    '伪装',
    '时髦值',
  ];

  // [新增] 生成 COC/DND 风格的6维属性（支持预设）
  /**
   * 生成角色属性
   * @param isDNDOrPreset 布尔值(旧版兼容) 或 预设对象 或 null(自动获取激活预设)
   * @returns { base: {...}, special: {...} } 或旧格式 {...}（向后兼容）
   */
  const generateRPGAttributes = (isDNDOrPreset = undefined) => {
    // 兼容旧版：如果传入布尔值，使用传统逻辑
    if (typeof isDNDOrPreset === 'boolean') {
      const isDND = isDNDOrPreset;
      const rollDice = sides => Math.floor(Math.random() * sides) + 1;
      const generate3d6 = () => rollDice(6) + rollDice(6) + rollDice(6);

      const generateValue = () => {
        if (isDND) {
          const base = generate3d6();
          const adjust = rollDice(4) - 2;
          return Math.max(3, Math.min(18, base + adjust));
        } else {
          const base = generate3d6() * 5;
          const adjust = rollDice(10) - 5;
          return Math.max(5, Math.min(95, base + adjust));
        }
      };

      const result = {};
      STANDARD_ATTRS.forEach(attr => {
        result[attr] = generateValue();
      });
      return result; // 旧格式
    }

    // 新版：使用预设系统
    const preset = isDNDOrPreset || AttributePresetManager.getActivePreset();

    // 如果没有激活预设，使用默认逻辑（百分制六维）
    if (!preset) {
      const rollDice = sides => Math.floor(Math.random() * sides) + 1;
      const generate3d6 = () => rollDice(6) + rollDice(6) + rollDice(6);
      const result = {};
      STANDARD_ATTRS.forEach(attr => {
        const base = generate3d6() * 5;
        const adjust = rollDice(10) - 5;
        result[attr] = Math.max(5, Math.min(95, base + adjust));
      });
      return { base: result, special: {} };
    }

    // 第一阶段：生成基本属性
    const baseResult = {};
    preset.baseAttributes.forEach(attr => {
      const formula = attr.modifier ? `${attr.formula}+${attr.modifier}` : attr.formula;
      baseResult[attr.name] = generateAttributeValue(formula, attr.range, {});
    });

    // 第二阶段：生成特别属性（可引用基本属性）
    const specialResult = {};
    if (preset.specialAttributes && Array.isArray(preset.specialAttributes)) {
      preset.specialAttributes.forEach(attr => {
        specialResult[attr.name] = generateAttributeValue(attr.formula, attr.range, baseResult);
      });
    }

    return { base: baseResult, special: specialResult };
  };

  // [简化] 清空角色的属性（直接清空基础属性列和特有属性列）
  const clearPresetAttributesForCharacter = async charName => {
    const rawData = getCachedRawData() || getTableData();
    if (!rawData) {
      console.error('[DICE]ACU clearPresetAttributesForCharacter: 无法获取表格数据');
      if (window.toastr)
        showActionableErrorToast('无法获取表格数据，暂时不能清空角色属性。', { suggestion: 'table' });
      return { success: false };
    }

    const lookup = findCharacterAttributeRow(charName, rawData as DiceRawData);
    const targetSheet = lookup?.sheet || null;
    const targetRowIndex = lookup?.rowIndex ?? -1;
    const sheetKey = lookup?.sheetKey || null;
    const { baseColIndex, specialColIndex } = lookup
      ? findPrimaryAttributeColumns(lookup.headers)
      : { baseColIndex: -1, specialColIndex: -1 };

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      console.error('[DICE]ACU clearPresetAttributesForCharacter: 找不到角色', charName);
      if (window.toastr)
        showActionableErrorToast(`找不到角色「${charName || '<user>'}」，无法清空属性。`, {
          suggestion: '请确认角色名与表格中的名称一致，并刷新数据后再试；如果角色确实存在，请检查角色表是否包含名称列。',
        });
      return { success: false };
    }

    if (baseColIndex < 0) {
      console.error('[DICE]ACU clearPresetAttributesForCharacter: 找不到属性列');
      errorTableTemplateIssue('找不到属性列');
      return { success: false };
    }

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[baseColIndex] = '';

    // 如果存在特有属性列，也清空
    if (specialColIndex >= 0) {
      nextRow[specialColIndex] = '';
    }

    await saveRowInstantly(sheetKey, targetRowIndex - 1, nextRow);

    return {
      success: true,
    };
  };

  // [新增] 将属性写入角色表格
  // [修复] 支持分别写入基础属性列和特有属性列
  const writeAttributesToCharacter = async (
    charName,
    newAttrs,
    isDND = false,
    specialAttrs: Record<string, number> | null = null,
  ) => {
    const rawData = getCachedRawData() || getTableData();
    if (!rawData) {
      console.error('[DICE]ACU writeAttributesToCharacter: 无法获取表格数据');
      if (window.toastr)
        showActionableErrorToast('无法获取表格数据，暂时不能写入角色属性。', { suggestion: 'table' });
      return { success: false };
    }

    const lookup = findCharacterAttributeRow(charName, rawData as DiceRawData);
    const targetSheet = lookup?.sheet || null;
    const targetRowIndex = lookup?.rowIndex ?? -1;
    const sheetKey = lookup?.sheetKey || null;
    const { baseColIndex, specialColIndex } = lookup
      ? findPrimaryAttributeColumns(lookup.headers)
      : { baseColIndex: -1, specialColIndex: -1 };

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      console.error('[DICE]ACU writeAttributesToCharacter: 找不到角色', charName);
      if (window.toastr)
        showActionableErrorToast(`找不到角色「${charName || '<user>'}」，无法写入属性。`, {
          suggestion: '请确认角色名与表格中的名称一致，并刷新数据后再试；如果角色确实存在，请检查角色表是否包含名称列。',
        });
      return { success: false };
    }

    if (baseColIndex < 0) {
      console.error('[DICE]ACU writeAttributesToCharacter: 找不到属性列');
      errorTableTemplateIssue('找不到属性列（需要包含"属性"关键词的列）');
      return { success: false };
    }

    // 获取当前规则的属性列表
    const standardAttrs = getStandardAttrs();
    const preset = AttributePresetManager.getActivePreset();
    const presetSpecialAttrNames = new Set<string>();
    if (preset && preset.specialAttributes) {
      preset.specialAttributes.forEach(attr => presetSpecialAttrNames.add(attr.name));
    }

    // ========== 处理基础属性列 ==========
    const existingBaseStr = targetSheet.content[targetRowIndex][baseColIndex] || '';
    const existingBaseAttrs = parseAttributeString(existingBaseStr);

    // 构建现有基础属性的映射
    const existingBaseMap = {};
    existingBaseAttrs.forEach(attr => {
      existingBaseMap[attr.name] = attr.value;
    });

    // 检查标准属性（基本属性）是否完整
    let standardCount = 0;
    standardAttrs.forEach(attrName => {
      if (existingBaseMap[attrName] !== undefined) {
        standardCount++;
      }
    });
    const isComplete = standardCount === standardAttrs.length;

    // 收集基础属性列中的用户自定义属性（不属于当前规则预设的属性）
    const customBaseAttrs: Array<{ name: string; value: number }> = [];
    existingBaseAttrs.forEach(attr => {
      if (!standardAttrs.includes(attr.name) && !presetSpecialAttrNames.has(attr.name)) {
        customBaseAttrs.push({ name: attr.name, value: attr.value });
      }
    });

    // 按标准顺序构建基础属性结果
    const baseResultParts: string[] = [];

    // 写入基本属性
    standardAttrs.forEach(attrName => {
      if (isComplete) {
        // 完整 → 全部用新值覆盖
        const newValue = newAttrs[attrName] !== undefined ? newAttrs[attrName] : existingBaseMap[attrName];
        if (newValue !== undefined) {
          baseResultParts.push(`${attrName}:${newValue}`);
        }
      } else {
        // 不完整 → 有则保留，无则用新值
        if (existingBaseMap[attrName] !== undefined) {
          baseResultParts.push(`${attrName}:${existingBaseMap[attrName]}`);
        } else if (newAttrs[attrName] !== undefined) {
          baseResultParts.push(`${attrName}:${newAttrs[attrName]}`);
        }
      }
    });

    // 如果没有独立的特有属性列，则把特有属性也写入基础属性列（兼容旧格式）
    if (specialColIndex < 0 && specialAttrs) {
      Object.keys(specialAttrs).forEach(attrName => {
        if (isComplete || !existingBaseMap[attrName]) {
          baseResultParts.push(`${attrName}:${specialAttrs[attrName]}`);
        } else {
          baseResultParts.push(`${attrName}:${existingBaseMap[attrName]}`);
        }
      });
    }

    // 追加用户自定义属性
    customBaseAttrs.forEach(attr => {
      baseResultParts.push(`${attr.name}:${attr.value}`);
    });

    const newBaseAttrString = baseResultParts.join(';');

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[baseColIndex] = newBaseAttrString;

    // ========== 处理特有属性列（如果存在且有特有属性需要写入） ==========
    let newSpecialAttrString = '';
    if (specialColIndex >= 0 && specialAttrs && Object.keys(specialAttrs).length > 0) {
      const existingSpecialStr = targetSheet.content[targetRowIndex][specialColIndex] || '';
      const existingSpecialAttrs = parseAttributeString(existingSpecialStr);

      // 构建现有特有属性的映射
      const existingSpecialMap = {};
      existingSpecialAttrs.forEach(attr => {
        existingSpecialMap[attr.name] = attr.value;
      });

      // 收集特有属性列中的用户自定义属性
      const customSpecialAttrs: Array<{ name: string; value: number }> = [];
      existingSpecialAttrs.forEach(attr => {
        if (!presetSpecialAttrNames.has(attr.name)) {
          customSpecialAttrs.push({ name: attr.name, value: attr.value });
        }
      });

      // 构建特有属性结果
      const specialResultParts: string[] = [];

      // 按预设顺序写入特有属性
      if (preset && preset.specialAttributes) {
        preset.specialAttributes.forEach(attrDef => {
          const attrName = attrDef.name;
          if (specialAttrs[attrName] !== undefined) {
            if (isComplete || !existingSpecialMap[attrName]) {
              specialResultParts.push(`${attrName}:${specialAttrs[attrName]}`);
            } else {
              specialResultParts.push(`${attrName}:${existingSpecialMap[attrName]}`);
            }
          } else if (existingSpecialMap[attrName] !== undefined) {
            specialResultParts.push(`${attrName}:${existingSpecialMap[attrName]}`);
          }
        });
      }

      // 追加用户自定义属性
      customSpecialAttrs.forEach(attr => {
        specialResultParts.push(`${attr.name}:${attr.value}`);
      });

      newSpecialAttrString = specialResultParts.join(';');

      nextRow[specialColIndex] = newSpecialAttrString;
    }

    // 保存（不更新完整快照，保留审核面板状态）
    await saveRowInstantly(sheetKey, targetRowIndex - 1, nextRow);

    // 返回写入的属性供UI更新
    const writtenAttrs: Array<{ name: string; value: number }> = [];
    standardAttrs.forEach(attrName => {
      writtenAttrs.push({ name: attrName, value: newAttrs[attrName] });
    });

    return {
      success: true,
      attrs: writtenAttrs,
      attrString: newBaseAttrString,
      specialAttrString: newSpecialAttrString,
      wasComplete: isComplete,
    };
  };

  // [新增] 更新属性字符串中的单个属性值（用于燃运等功能）
  const updateSingleAttribute = async (
    charName: string,
    attrName: string,
    operation: 'add' | 'subtract' | 'set',
    value: number,
    options?: {
      initValue?: number;
      min?: number;
      max?: number;
      aliasCandidates?: string[];
      skipSave?: boolean;
      dataOverride?: Record<string, { name: string; content: (string | number | null)[][] }>;
    },
  ): Promise<{
    success: boolean;
    oldValue: number;
    newValue: number;
    error?: string;
    resolvedAttrName?: string;
    modifiedSheetKey?: string;
  }> => {
    const rawData = options?.dataOverride || getCachedRawData() || getTableData();
    if (!rawData) {
      const error = '无法获取表格数据';
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    const lookup = findCharacterAttributeRow(charName, rawData as DiceRawData);
    const targetSheet = lookup?.sheet || null;
    const targetRowIndex = lookup?.rowIndex ?? -1;
    const sheetKey = lookup?.sheetKey || null;
    const attrColIndices = lookup ? findAttributeColumnIndices(lookup.headers) : [];
    const fallbackAttrColIndex = lookup ? pickFallbackAttributeColumn(attrColIndices, lookup.headers) : -1;
    let targetColIndex = fallbackAttrColIndex;

    // 验证是否找到目标
    if (!targetSheet || targetRowIndex < 0) {
      const error = `找不到角色: ${charName || '<user>'}`;
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    if (targetColIndex < 0) {
      const error = withTableTemplateCheckHint('找不到属性列（需要包含"属性"关键词的列）');
      console.error(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    const resolved = resolveAttributeAliasName(charName, attrName, options?.aliasCandidates || []);
    if (!resolved.name) {
      const error = resolved.reason || `属性 ${attrName} 不存在`;
      console.warn(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }
    const targetAttrName = resolved.name;

    // 在所有属性列中，优先选择实际包含目标属性的列
    for (const colIdx of attrColIndices) {
      const cellStr = String(targetSheet.content[targetRowIndex][colIdx] || '');
      const parsed = parseAttributeString(cellStr);
      if (parsed.some(attr => attr.name === targetAttrName)) {
        targetColIndex = colIdx;
        break;
      }
    }
    if (targetColIndex < 0) {
      targetColIndex = fallbackAttrColIndex;
    }

    // 读取目标列现有属性并解析
    const existingStr = String(targetSheet.content[targetRowIndex][targetColIndex] || '');
    const existingAttrs = parseAttributeString(existingStr);
    const existingMap: Record<string, number> = {};
    existingAttrs.forEach(attr => {
      existingMap[attr.name] = attr.value;
    });

    // 获取旧值或使用初始值
    let oldValue: number;
    if (existingMap[targetAttrName] !== undefined) {
      oldValue = existingMap[targetAttrName];
    } else if (options?.initValue !== undefined) {
      oldValue = options.initValue;
      console.info(`[DICE] updateSingleAttribute: 属性 ${targetAttrName} 不存在，初始化为 ${oldValue}`);
    } else {
      const error = `属性 ${targetAttrName} 不存在且未提供初始值`;
      console.warn(`[DICE] updateSingleAttribute: ${error}`);
      return { success: false, oldValue: 0, newValue: 0, error };
    }

    // 执行操作
    let newValue: number;
    switch (operation) {
      case 'add':
        newValue = oldValue + value;
        break;
      case 'subtract':
        newValue = oldValue - value;
        break;
      case 'set':
        newValue = value;
        break;
      default:
        const error = `不支持的操作类型: ${operation}`;
        console.error(`[DICE] updateSingleAttribute: ${error}`);
        return { success: false, oldValue, newValue: oldValue, error };
    }

    // 应用 min/max 约束
    const min = options?.min ?? 0; // 默认最小为0
    const max = options?.max ?? Infinity;
    newValue = Math.max(min, Math.min(max, newValue));

    console.info(
      `[DICE] updateSingleAttribute: ${charName}.${targetAttrName} ${oldValue} → ${newValue} (${operation} ${value})`,
    );

    // 更新属性映射
    existingMap[targetAttrName] = newValue;

    // 重建属性字符串（保持原有顺序，新属性追加到末尾）
    const resultParts: string[] = [];
    const processedNames = new Set<string>();

    // 先按原有顺序处理
    existingAttrs.forEach(attr => {
      const val = existingMap[attr.name];
      if (val !== undefined) {
        resultParts.push(`${attr.name}:${val}`);
        processedNames.add(attr.name);
      }
    });

    // 添加新属性（如果是初始化的情况）
    if (!processedNames.has(targetAttrName)) {
      resultParts.push(`${targetAttrName}:${newValue}`);
    }

    const newAttrString = resultParts.join(';');

    const nextRow = [...targetSheet.content[targetRowIndex]];
    nextRow[targetColIndex] = newAttrString;
    if (options?.skipSave || options?.dataOverride) {
      targetSheet.content[targetRowIndex] = nextRow;
    } else {
      try {
        await saveRowInstantly(sheetKey!, targetRowIndex - 1, nextRow);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[DICE] updateSingleAttribute: 保存 ${charName}.${targetAttrName} 失败: ${message}`);
        return { success: false, oldValue, newValue: oldValue, error: message, resolvedAttrName: targetAttrName };
      }
    }

    console.info(`[DICE] updateSingleAttribute: 成功修改 ${charName}.${targetAttrName}`);
    return { success: true, oldValue, newValue, resolvedAttrName: targetAttrName, modifiedSheetKey: sheetKey! };
  };

  // [修复] 获取角色的完整属性列表（包括基础属性和特有属性等所有包含"属性"的列）
  const getFullAttributesForCharacter = (
    characterName,
    dataOverride?: Record<string, { name: string; content: (string | number | null)[][] }>,
  ): CharacterAttributeEntry[] => {
    const rawData = (dataOverride || getCachedRawData() || getTableData()) as DiceRawData | null;
    const lookup = findCharacterAttributeRow(characterName, rawData);
    if (!lookup) return [];

    const attrs: CharacterAttributeEntry[] = [];
    const row = lookup.sheet.content[lookup.rowIndex] || [];
    const { baseColIndex, specialColIndex } = findPrimaryAttributeColumns(lookup.headers);
    findAttributeColumnIndices(lookup.headers).forEach(idx => {
      const parsed = parseAttributeString(row[idx] || '');
      parsed.forEach(attr => {
        if (!attrs.some(existing => existing.name === attr.name)) {
          const source: CharacterAttributeSource =
            idx === baseColIndex ? 'base' : idx === specialColIndex ? 'special' : 'generic';
          attrs.push({ ...attr, source });
        }
      });
    });
    return attrs;
  };
  // [新增] 自定义下拉菜单初始化函数
  const initCustomDropdown = ($input, options) => {
    const { $ } = getCore();
    const inputId = $input.attr('id') || 'dd_' + Math.random().toString(36).substr(2, 9);
    $input.attr('id', inputId);

    // 移除已存在的下拉
    $input.parent().find('.acu-dropdown-list').remove();

    // 包裹成 wrapper
    if (!$input.parent().hasClass('acu-dropdown-wrapper')) {
      $input.wrap('<div class="acu-dropdown-wrapper"></div>');
    }

    // 创建下拉列表 - 样式通过 CSS 类控制
    const $dropdown = $(`<div class="acu-dropdown-list" data-for="${inputId}"></div>`);
    $input.after($dropdown);

    const renderItems = (filter = '') => {
      const lowerFilter = filter.toLowerCase();
      const filtered = options.filter(opt => opt.toLowerCase().includes(lowerFilter));

      if (filtered.length === 0) {
        $dropdown.html(`<div class="acu-dropdown-empty">无匹配项</div>`);
      } else {
        $dropdown.html(
          filtered
            .map(opt => `<div class="acu-dropdown-item" data-value="${escapeHtml(opt)}">${escapeHtml(opt)}</div>`)
            .join(''),
        );
      }
    };

    const showDropdown = () => {
      $('.acu-dropdown-list').removeClass('visible');
      renderItems($input.val());
      $dropdown.addClass('visible');
    };

    const hideDropdown = () => {
      $dropdown.removeClass('visible');
    };

    // 点击输入框显示下拉
    $input.off('.acudd').on('focus.acudd click.acudd', function (e) {
      e.stopPropagation();
      showDropdown();
    });

    // 输入筛选
    $input.on('input.acudd', function () {
      renderItems($(this).val());
    });

    // hover 效果已通过 CSS :hover 处理，无需 JS

    // 选择项目
    $dropdown.on('click', '.acu-dropdown-item', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const val = $(this).data('value');
      $input.val(val).trigger('change');
      hideDropdown();
    });

    // 点击下拉列表本身不关闭
    $dropdown.on('click', function (e) {
      e.stopPropagation();
    });

    // 点击面板其他区域关闭
    $input
      .closest('.acu-dice-panel, .acu-contest-panel')
      .off('click.acudd_' + inputId)
      .on('click.acudd_' + inputId, function (e) {
        if (!$(e.target).closest('.acu-dropdown-wrapper').length) {
          hideDropdown();
        }
      });
  };
  // [新增] 给输入框添加清除按钮
  const addClearButton = ($panel, inputSelector) => {
    const { $ } = getCore();
    $panel.find(inputSelector).each(function () {
      const $input = $(this);
      // 避免重复添加
      if ($input.parent().hasClass('acu-input-wrapper')) return;
      // 包装输入框
      $input.wrap('<div class="acu-input-wrapper"></div>');
      // 添加清除按钮 - 样式通过 CSS 类控制
      const $clearBtn = $(
        `<button type="button" class="acu-clear-btn" title="清除"><i class="fa-solid fa-times"></i></button>`,
      );
      $input.after($clearBtn);
      // 点击清除
      $clearBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $input.val('').trigger('input').trigger('change').focus();
      });
      // hover 效果已通过 CSS :hover 处理，无需 JS
    });
  };
  // [新增] 统一的骰子规则设置面板
  /**
   * @deprecated 请使用 showAdvancedPresetManager() 替代。此函数仅保留函数体以供回退。
   */
  const showDiceSettingsPanel = (isDND = false) => {
    const { $ } = getCore();
    $('.acu-dice-config-overlay').remove();

    const config = getConfig();
    const diceCfg = getDiceConfig();

    const ruleTitle = isDND ? 'DND 规则设置' : 'COC 规则设置';
    const resetText = isDND ? '恢复 DND 默认' : '恢复 COC 默认';

    // 默认值定义
    const defaults = isDND
      ? { critSuccess: 20, critFail: 1 }
      : { critSuccess: 5, critFail: 96, hardDiv: 2, extremeDiv: 5 };

    // 当前值：只有用户明确设置过才显示，否则留空用 placeholder
    const currentCritSuccess = isDND
      ? diceCfg.dndCritSuccess !== undefined && diceCfg.dndCritSuccess !== defaults.critSuccess
        ? diceCfg.dndCritSuccess
        : ''
      : diceCfg.critSuccessMax !== undefined && diceCfg.critSuccessMax !== defaults.critSuccess
        ? diceCfg.critSuccessMax
        : '';
    const currentCritFail = isDND
      ? diceCfg.dndCritFail !== undefined && diceCfg.dndCritFail !== defaults.critFail
        ? diceCfg.dndCritFail
        : ''
      : diceCfg.critFailMin !== undefined && diceCfg.critFailMin !== defaults.critFail
        ? diceCfg.critFailMin
        : '';
    const currentHardDiv =
      !isDND && diceCfg.difficultSuccessDiv !== undefined && diceCfg.difficultSuccessDiv !== defaults.hardDiv
        ? diceCfg.difficultSuccessDiv
        : '';
    const currentExtremeDiv =
      !isDND && diceCfg.hardSuccessDiv !== undefined && diceCfg.hardSuccessDiv !== defaults.extremeDiv
        ? diceCfg.hardSuccessDiv
        : '';

    const tieRule = diceCfg.contestTieRule || 'initiator_lose';
    const hideDiceResultFromUser =
      diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
    const hideDiceResultInChat = diceCfg.hideDiceResultInChat !== undefined ? diceCfg.hideDiceResultInChat : false;
    const overwriteLastDiceResult = diceCfg.overwriteLastDiceResult !== false;

    const cocExtraHtml = isDND
      ? ''
      : `
            <div class="acu-dice-cfg-row">
                <div class="acu-dice-cfg-item">
                    <label>困难 (÷)</label>
                    <div class="acu-stepper" data-id="cfg-hard-div" data-min="2" data-max="5" data-step="1">
                        <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                        <span class="acu-stepper-value">${currentHardDiv || defaults.hardDiv}</span>
                        <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <div class="acu-dice-cfg-item">
                    <label>极难 (÷)</label>
                    <div class="acu-stepper" data-id="cfg-extreme-div" data-min="3" data-max="10" data-step="1">
                        <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                        <span class="acu-stepper-value">${currentExtremeDiv || defaults.extremeDiv}</span>
                        <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;

    const panelHtml = `
            <div class="acu-dice-config-overlay">
                <div class="acu-dice-config-dialog acu-theme-${config.theme}">
                    <div class="acu-dice-cfg-header">
                        <span><i class="fa-solid fa-cog"></i> ${ruleTitle}</span>
                        <button class="acu-config-close"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-dice-cfg-body">
                        <div class="acu-dice-cfg-row">
                            <div class="acu-dice-cfg-item">
                                <label>大成功阈值</label>
                                <div class="acu-stepper" data-id="cfg-crit-success" data-min="1" data-max="100" data-step="1">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${currentCritSuccess || defaults.critSuccess}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-dice-cfg-item">
                                <label>大失败阈值</label>
                                <div class="acu-stepper" data-id="cfg-crit-fail" data-min="1" data-max="100" data-step="1">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${currentCritFail || defaults.critFail}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        ${cocExtraHtml}
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item">
                                <label>对抗平手规则</label>
                                <select id="cfg-tie-rule">
                                    <option value="initiator_lose" ${tieRule === 'initiator_lose' ? 'selected' : ''}>发起方判负 (默认)</option>
                                    <option value="tie" ${tieRule === 'tie' ? 'selected' : ''}>双方平手</option>
                                    <option value="initiator_win" ${tieRule === 'initiator_win' ? 'selected' : ''}>发起方判胜</option>
                                </select>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item acu-cfg-toggle-item">
                                <label>隐藏输入栏中的检定结果</label>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-hide-dice-result" ${hideDiceResultFromUser ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item acu-cfg-toggle-item">
                                <label>覆盖上一次检定结果</label>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-overwrite-last-dice-result" ${overwriteLastDiceResult ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item acu-cfg-toggle-item">
                                <label>隐藏聊天记录中的检定结果</label>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-hide-dice-result-chat" ${hideDiceResultInChat ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-actions">
                            <button type="button" id="cfg-reset-dice">${resetText}</button>
                            <button type="button" id="cfg-save-dice">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const $panel = $(panelHtml);
    $('body').append($panel);

    $panel.css({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      'z-index': '31300',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '20px',
      'box-sizing': 'border-box',
    });

    const closePanel = () => $panel.remove();
    $panel.find('.acu-config-close').click(closePanel);
    setupOverlayClose($panel, 'acu-dice-config-overlay', closePanel);

    // === Stepper 步进器事件 ===
    $panel.find('.acu-stepper').each(function () {
      const $stepper = $(this);
      const id = $stepper.data('id');
      const min = parseInt($stepper.data('min'));
      const max = parseInt($stepper.data('max'));
      const step = parseInt($stepper.data('step'));
      const $value = $stepper.find('.acu-stepper-value');

      const updateValue = newVal => {
        newVal = Math.max(min, Math.min(max, newVal));
        $value.text(newVal);
      };

      const getCurrentValue = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || min;
      };

      $stepper.find('.acu-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });

      $stepper.find('.acu-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });

    $panel.find('#cfg-save-dice').click(function () {
      const newCfg = { contestTieRule: $('#cfg-tie-rule').val() };

      // 从stepper读取值
      const getStepperValue = id => {
        const $stepper = $panel.find(`.acu-stepper[data-id="${id}"]`);
        if ($stepper.length) {
          const text = $stepper.find('.acu-stepper-value').text().replace(/[^\d]/g, '');
          return text !== '' ? parseInt(text, 10) : null;
        }
        return null;
      };

      const critSuccessVal = getStepperValue('cfg-crit-success');
      const critFailVal = getStepperValue('cfg-crit-fail');

      if (isDND) {
        newCfg.dndCritSuccess = critSuccessVal !== null ? critSuccessVal : defaults.critSuccess;
        newCfg.dndCritFail = critFailVal !== null ? critFailVal : defaults.critFail;
      } else {
        newCfg.critSuccessMax = critSuccessVal !== null ? critSuccessVal : defaults.critSuccess;
        newCfg.critFailMin = critFailVal !== null ? critFailVal : defaults.critFail;

        const hardDivVal = getStepperValue('cfg-hard-div');
        const extremeDivVal = getStepperValue('cfg-extreme-div');
        newCfg.difficultSuccessDiv = hardDivVal !== null ? hardDivVal : defaults.hardDiv;
        newCfg.hardSuccessDiv = extremeDivVal !== null ? extremeDivVal : defaults.extremeDiv;
      }

      // 保存"隐藏输入栏中的检定结果"设置
      newCfg.hideDiceResultFromUser = $('#cfg-hide-dice-result').is(':checked');
      // 保存"覆盖上一次检定结果"设置
      newCfg.overwriteLastDiceResult = $('#cfg-overwrite-last-dice-result').is(':checked');
      // 保存"隐藏聊天记录中的检定结果"设置
      newCfg.hideDiceResultInChat = $('#cfg-hide-dice-result-chat').is(':checked');

      saveDiceConfig(newCfg);
      // 保存后立即应用隐藏逻辑
      console.info('[DICE]应用投骰结果隐藏/显示设置...');
      hideDiceResultsInUserMessages();
      closePanel();
    });

    $panel.find('#cfg-reset-dice').click(function () {
      // 重置stepper到默认值
      const resetStepper = (id, defaultValue) => {
        const $stepper = $panel.find(`.acu-stepper[data-id="${id}"]`);
        if ($stepper.length) {
          $stepper.find('.acu-stepper-value').text(defaultValue);
        }
      };

      resetStepper('cfg-crit-success', defaults.critSuccess);
      resetStepper('cfg-crit-fail', defaults.critFail);
      if (!isDND) {
        resetStepper('cfg-hard-div', defaults.hardDiv);
        resetStepper('cfg-extreme-div', defaults.extremeDiv);
      }
    });
  };
  // [新增] 显示掷骰面板
  const showDicePanel = (options = {}) => {
    const { $ } = getCore();
    $('.acu-dice-panel, .acu-dice-overlay').remove();

    const config = getConfig();
    const diceCfg = getDiceConfig();
    // 读取上次保存的骰子类型，必须是有效公式，否则默认1d100
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    // 验证是否是有效公式，无效则回退到1d100
    if (Number.isNaN(rollComplexDiceExpression(savedDiceType).total)) {
      savedDiceType = '1d100';
    }
    // [新增] 构建角色和属性下拉列表
    const rawDataForList = getCachedRawData() || getTableData();
    const diceCharacterList = getDiceQuickSelectCharacterList(rawDataForList as DiceRawData | null | undefined);
    let diceAttrList = [];

    if (rawDataForList) {
      for (const key in rawDataForList) {
        const sheet = rawDataForList[key];
        if (!sheet || !sheet.name || !sheet.content) continue;
        const headers = sheet.content[0] || [];

        if (sheet.name?.includes('主角') && sheet.content[1]) {
          const row = sheet.content[1];
          headers.forEach((h, idx) => {
            if (h && h.includes('属性')) {
              const parsed = parseAttributeString(row[idx] || '');
              parsed.forEach(attr => {
                if (!diceAttrList.includes(attr.name)) diceAttrList.push(attr.name);
              });
            }
          });
        }
      }
    }
    const {
      targetValue = null, // [修复] 默认为 null，支持留空自动计算
      targetName = '', // 留空让 placeholder 显示，执行时若仍为空则使用 '自由检定'
      attrValue = null, // [新增] 属性值参数
      diceType = savedDiceType, // 使用上次保存的骰子类型
      successCriteria = 'lte', // [新增] 默认成功标准：小于等于（COC规则）
      onResult = null,
      initiatorName = '', // [修复] 接收发起者名字
      fromMvu = false, // [新增] 是否从MVU面板调用
      mvuPath = null, // [新增] MVU变量路径
      mvuParsedInfo = null, // [新增] 解析后的路径信息
    } = options;

    // [新增] 计算初始属性值和目标值/DC
    const isDND = diceType === '1d20' || successCriteria === 'gte';
    let initialAttrValue = attrValue;
    let initialTargetValue = targetValue;

    // 如果传入了attrValue但没有targetValue，根据模式自动计算
    if (attrValue !== null && targetValue === null) {
      if (isDND) {
        initialTargetValue = Math.max(0, 20 - attrValue);
      } else {
        initialTargetValue = attrValue;
      }
    }

    const overlay = $(`<div class="acu-dice-overlay"></div>`);

    // [精简] 成功标准选项：只保留 COC 和 DND
    const successCriteriaOptions = [
      { id: 'lte', name: '≤ (COC)' },
      { id: 'gte', name: '≥ (DND)' },
    ];

    // [新增] 根据骰子类型智能选择默认成功标准
    let defaultCriteria = successCriteria;
    if (diceType === '1d100') defaultCriteria = 'lte';
    else if (diceType === '1d20') defaultCriteria = 'gte';

    // [新增] 预设快捷按钮区逻辑
    const quickPresetsHtml = (() => {
      const presets = AdvancedDicePresetManager.getAllPresets()
        .filter(p => p.visible !== false) // 默认显示
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      let html = `<div class="acu-dice-quick-section" id="dice-normal-presets-section" style="margin-bottom: 8px;">`;
      html += `<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则<div id="dice-preset-quick-actions" class="acu-dice-preset-quick-actions"></div></span></div>`;

      // 1. 常规预设选择器容器
      html += `<div class="acu-dice-quick-presets" id="dice-normal-presets">`;
      // 自定义按钮（固定在最左）
      html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="__custom__">自定义</button>`;

      presets.forEach(p => {
        html += `<button type="button" class="acu-dice-quick-preset-btn" data-id="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`;
      });
      html += `</div>`;

      // 2. 工作流模式下的“返回”按钮容器（默认隐藏）
      html += `<div id="dice-workflow-return-container" style="display: none;">
        <button type="button" class="acu-dice-return-btn" id="dice-return-normal-btn">
            <i class="fa-solid fa-arrow-left"></i> 返回常规检定
        </button>
      </div>`;

      html += `</div>`;
      return html;
    })();

    const panel = $(`
            <div class="acu-dice-panel acu-theme-${config.theme}">
                <div class="acu-dice-panel-header">
                    <div class="acu-dice-panel-title">
                        <i class="fa-solid fa-dice-d20"></i> 普通检定
                    </div>
                    <div class="acu-dice-panel-actions">
                        ${getTutorialButtonHtml('dice', '查看检定面板教程')}
                        <button type="button" id="dice-switch-contest-top" class="acu-dice-panel-action-btn" aria-label="切换到对抗检定" title="切换到对抗检定"><i class="fa-solid fa-people-arrows"></i></button>
                        <button type="button" id="dice-history-btn" class="acu-dice-panel-action-btn" aria-label="检定历史" title="检定历史"><i class="fa-solid fa-history"></i></button>
                        <button type="button" class="acu-dice-config-btn acu-dice-panel-action-btn" aria-label="检定设置" title="检定设置">
                            <i class="fa-solid fa-cog"></i>
                        </button>
                        <button type="button" class="acu-dice-close acu-dice-panel-action-btn" aria-label="关闭检定面板" title="关闭">
                            <i class="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="acu-dice-panel-body">
                    ${quickPresetsHtml}

                    <!-- 快捷选择角色 -->
                    <div class="acu-dice-quick-section">
                        <div class="acu-dice-section-title" id="dice-char-buttons-section"><span><i class="fa-solid fa-user"></i> 快捷选择</span><div id="dice-char-buttons" class="acu-dice-quick-inline"></div></div>
                    </div>

                    <div id="dice-normal-params-section">
                        <!-- 第1行：名字 + 属性名 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-1">
                            <div id="dice-name-wrapper">
                                <div class="acu-dice-form-label">名字</div>
                                <input type="text" id="dice-initiator-name" class="acu-dice-input" value="${escapeHtml(initiatorName)}" placeholder="<user>">
                            </div>
                            <div id="dice-attr-name-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-name-label">
                                    <span class="dice-attr-name-text">属性名</span>
                                    <button type="button" class="acu-random-skill-btn" id="dice-random-skill" title="随机技能">
                                        <i class="fa-solid fa-dice"></i>
                                    </button>
                                </div>
                                <input type="text" id="dice-attr-name" class="acu-dice-input" value="${escapeHtml(targetName || '')}" placeholder="自由检定">
                            </div>
                        </div>

                        <!-- 第2行：属性值 + 技能加值 + 目标值 -->
                        <div class="acu-dice-form-row cols-2" id="dice-row-2">
                            <div id="dice-attr-wrapper">
                                <div class="acu-dice-form-label" id="dice-attr-label">属性值</div>
                                <input type="text" id="dice-attr-value" class="acu-dice-input" value="${initialAttrValue !== null ? initialAttrValue : ''}" placeholder="留空=50%最大值">
                            </div>
                            <div id="dice-skill-mod-wrapper" style="display: none;">
                                <div class="acu-dice-form-label" id="dice-skill-mod-label">技能加值</div>
                                <input type="text" id="dice-skill-mod" class="acu-dice-input" placeholder="留空=0">
                            </div>
                            <div id="dice-target-wrapper">
                                <div class="acu-dice-form-label" id="dice-target-label">目标值</div>
                                <input type="text" id="dice-target" class="acu-dice-input" value="${initialTargetValue !== null ? initialTargetValue : ''}" placeholder="留空=属性值">
                            </div>
                        </div>
                    </div>

                    <!-- 第3行：成功标准 + 难度等级 + 修正值 (基础模式) -->
                    <div class="acu-dice-form-row cols-3" id="dice-row-3">
                        <div>
                            <div class="acu-dice-form-label centered">成功标准</div>
                            <select id="dice-success-criteria" class="acu-dice-select">
                                ${successCriteriaOptions
                                  .map(
                                    opt =>
                                      `<option value="${opt.id}" ${opt.id === defaultCriteria ? 'selected' : ''}>${opt.name}</option>`,
                                  )
                                  .join('')}
                            </select>
                        </div>
                        <div id="dice-difficulty-wrapper">
                            <div class="acu-dice-form-label centered">难度等级</div>
                            <select id="dice-difficulty" class="acu-dice-select">
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="extreme">极难</option>
                                <option value="critical">大成功</option>
                            </select>
                        </div>
                        <div id="dice-mod-wrapper">
                            <div class="acu-dice-form-label" id="dice-mod-label">修正值</div>
                            <input type="text" id="dice-modifier" class="acu-dice-input" placeholder="留空=0">
                        </div>
                    </div>

                    <!-- [新增] 高级预设自定义字段区域 (在快捷属性上方) -->
                    <div id="dice-custom-fields-area"></div>

                    <!-- [新增] 自定义掷骰模式字段区 -->
                    <div id="acu-dice-custom-mode-fields" style="display: none; margin-top: 8px;">
                        <div class="acu-dice-form-row cols-3">
                            <div>
                                <div class="acu-dice-form-label">骰子语法</div>
                                <input type="text" id="custom-dice-expr" class="acu-dice-input" value="${escapeHtml(diceCfg.customDiceExpr || '')}" placeholder="1d100,2d6+3...">
                            </div>
                            <div>
                                <div class="acu-dice-form-label">成功条件</div>
                                <select id="custom-judge-mode" class="acu-dice-select">
                                    <option value=">=">>=</option>
                                    <option value="<=" selected><=</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value="none">无判定</option>
                                </select>
                            </div>
                            <div>
                                <div class="acu-dice-form-label">目标值</div>
                                <input type="text" id="custom-target-value" class="acu-dice-input" placeholder="留空=50%概率">
                            </div>
                        </div>
                    </div>

                    <!-- 快捷选择属性（紧凑型） -->
                    <div id="dice-attr-buttons" class="acu-dice-quick-compact"></div>

                    <!-- 隐藏的骰子公式 -->
                    <input type="hidden" id="dice-formula" value="${diceType}">

                    <button type="button" id="dice-roll-btn" class="acu-dice-roll-btn">
                        <i class="fa-solid fa-dice"></i> 掷骰！
                    </button>
                </div>
            </div>
        `);

    overlay.append(panel);
    $('body').append(overlay);
    bindTutorialButtonsIn(panel);
    const effectRunCleanerTimerKey = '__acuEffectRunCleanerTimer';

    const expandedTraceRunIds = new Set<string>();
    let historyFilterStatus = 'all';
    let historyKeyword = '';
    let historyStatsScope: DiceStatsScope = 'chat';

    const renderDiceHistoryItems = (): string => {
      type HistoryItem =
        | (CheckHistoryEntry & { historyType: 'check' })
        | ((AcuDice.ContestResult & { timestamp: number; detailId?: string; detailLines?: string[] }) & {
            historyType: 'contest';
          });

      const mergedItems: HistoryItem[] = [
        ...checkHistory.map(item => ({ ...item, historyType: 'check' as const })),
        ...contestHistory.map(item => ({ ...item, historyType: 'contest' as const })),
      ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter(item => {
          if (historyFilterStatus !== 'all') {
            const status = String((item as Record<string, unknown>).effectStatus || '');
            if (!status || status !== historyFilterStatus) return false;
          }
          const keyword = historyKeyword.trim().toLowerCase();
          if (!keyword) return true;
          const raw = item as Record<string, unknown>;
          const haystack = [
            raw.attrName,
            raw.message,
            raw.outcomeText,
            raw.effectStatus,
            raw.initiatorName,
            raw['left'] && typeof raw['left'] === 'object' ? (raw['left'] as Record<string, unknown>).name : undefined,
            raw['right'] && typeof raw['right'] === 'object'
              ? (raw['right'] as Record<string, unknown>).name
              : undefined,
          ]
            .map(text => String(text || '').toLowerCase())
            .join(' ');
          return haystack.includes(keyword);
        })
        .slice(0, 80);

      if (mergedItems.length === 0) {
        return `<div class="acu-empty-state"><i class="fa-solid fa-dice-d20"></i><span>暂无检定历史</span></div>`;
      }

      const statusTextMap: Record<string, string> = {
        planned: '待执行',
        confirmed: '已确认',
        committed: '已提交',
        failed: '失败',
        cancelled: '已取消',
      };
      const statusColorMap: Record<string, string> = {
        planned: 'var(--acu-text-sub)',
        confirmed: 'var(--acu-accent)',
        committed: 'var(--acu-success-text)',
        failed: 'var(--acu-error-text)',
        cancelled: 'var(--acu-text-sub)',
      };

      return mergedItems
        .map(item => {
          const raw = item as Record<string, unknown>;
          const isContest = item.historyType === 'contest';
          const status = String(raw.effectStatus || '');
          const statusText = status ? statusTextMap[status] || status : '';
          const statusColor = status ? statusColorMap[status] || 'var(--acu-text-sub)' : 'var(--acu-text-sub)';

          const detailId = String(
            raw.detailId ||
              raw.effectRunId ||
              `${item.historyType}-${item.timestamp}-${String(raw.attrName || raw.message || '')}`,
          );
          const traceLines = Array.isArray(raw.effectTrace) ? (raw.effectTrace as string[]) : [];
          const detailLines = Array.isArray(raw.detailLines) ? (raw.detailLines as string[]) : [];
          const canExpand = detailLines.length > 0 || traceLines.length > 0;
          const isExpanded = canExpand && expandedTraceRunIds.has(detailId);

          let title = String(raw.attrName || '检定');
          let subtitle = '';
          let resultColor = raw.success ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
          let rollText = `${String(raw.total ?? '-')}/${String(raw.target ?? '-')}`;
          let metaTag = isContest ? '对抗' : '普通';

          if (isContest) {
            const left = (raw.left || {}) as Record<string, unknown>;
            const right = (raw.right || {}) as Record<string, unknown>;
            title = `${String(left.name || '发起方')} vs ${String(right.name || '对抗方')}`;
            subtitle = String(raw.message || '对抗检定');
            const winner = String(raw.winner || 'tie');
            resultColor = winner === 'tie' ? 'var(--acu-text-sub)' : 'var(--acu-accent)';
            rollText = `${String(left.roll ?? '-')}:${String(right.roll ?? '-')}`;
          } else {
            const initiatorName = String(raw.initiatorName || '').trim();
            if (initiatorName) {
              title = `${initiatorName} · ${title}`;
            }
            subtitle = String(raw.outcomeText || (raw.success ? '成功' : '失败'));
          }

          const pushedBadge = raw.isPushed
            ? '<i class="fa-solid fa-skull acu-history-pushed-icon" title="孤注一掷"></i>'
            : '';
          const expandBtn = canExpand
            ? `<button type="button" class="acu-history-icon-btn acu-history-trace-toggle" data-run-id="${escapeHtml(detailId)}" aria-label="${isExpanded ? '收起详情' : '展开详情'}" title="${isExpanded ? '收起详情' : '展开详情'}">${isExpanded ? '▼' : '▶'}</button>`
            : '';
          const detailHtml =
            canExpand && isExpanded
              ? `<div class="acu-history-detail">
                   ${detailLines.length > 0 ? `<strong>检定详情</strong>${detailLines.map(line => escapeHtml(line)).join('<br>')}` : ''}
                   ${detailLines.length > 0 && traceLines.length > 0 ? '<hr>' : ''}
                   ${traceLines.length > 0 ? `<strong>效果链路</strong>${traceLines.map(line => escapeHtml(line)).join('<br>')}` : ''}
                 </div>`
              : '';

          return `
            <div class="acu-history-item">
              <div class="acu-history-main">
                <div class="acu-history-primary">
                  <div class="acu-history-title-row">
                    <span class="acu-history-tag">${metaTag}</span>
                    <span class="acu-history-title">${escapeHtml(title)}${pushedBadge}</span>
                  </div>
                  <div class="acu-history-meta">
                    <span class="acu-history-result" style="--acu-history-result-color:${resultColor};">${escapeHtml(subtitle)}</span>
                    <span class="acu-history-roll">${escapeHtml(rollText)}</span>
                    ${statusText ? `<span class="acu-history-status" style="--acu-history-status-color:${statusColor};">效果:${statusText}</span>` : ''}
                  </div>
                </div>
                <div class="acu-history-side">
                  <span class="acu-history-time">${new Date(item.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</span>
                  ${expandBtn}
                </div>
              </div>
              ${detailHtml}
            </div>
          `;
        })
        .join('');
    };

    const showDiceHistoryDialog = () => {
      $('.acu-dice-history-overlay').remove();
      const currentThemeClass = `acu-theme-${config.theme}`;
      const dialog = $(`
        <div class="acu-edit-overlay acu-dice-history-overlay">
          <div class="acu-edit-dialog acu-dice-history-dialog ${currentThemeClass}">
            <div class="acu-dice-history-header">
              <h3><i class="fa-solid fa-clock-rotate-left"></i> 检定历史</h3>
              <div class="acu-dice-history-actions">
                ${getTutorialButtonHtml('diceHistory', '查看检定历史教程', 'acu-help-btn')}
                <button type="button" class="acu-close-btn acu-history-close" aria-label="关闭检定历史" title="关闭"><i class="fa-solid fa-times"></i></button>
              </div>
            </div>
            <div class="acu-dice-history-filters">
              <select id="acu-history-scope-filter" class="acu-dice-select">
                <option value="chat">本聊天</option>
                <option value="character">本角色卡</option>
                <option value="global">全局</option>
              </select>
              <select id="acu-history-status-filter" class="acu-dice-select">
                <option value="all">全部状态</option>
                <option value="planned">待执行</option>
                <option value="confirmed">已确认</option>
                <option value="committed">已提交</option>
                <option value="failed">失败</option>
                <option value="cancelled">已取消</option>
              </select>
              <div class="acu-dice-history-search">
                <i class="fa-solid fa-search"></i>
                <input id="acu-history-search" class="acu-dice-input" placeholder="搜索" value="${escapeHtml(historyKeyword)}">
              </div>
            </div>
            <div id="acu-dice-history-stats" class="acu-dice-history-stats">
              <div class="acu-history-stats-scope">统计加载中...</div>
            </div>
            <div id="acu-dice-history-list" class="acu-dice-history-list">
              ${renderDiceHistoryItems()}
            </div>
            <div class="acu-history-footer">
              <button type="button" class="acu-dialog-btn" id="acu-history-clear"><i class="fa-solid fa-trash"></i> 清理历史</button>
              <button type="button" class="acu-dialog-btn acu-history-close"><i class="fa-solid fa-times"></i> 关闭</button>
            </div>
          </div>
        </div>
      `);
      $('body').append(dialog);
      bindTutorialButtonsIn(dialog);

      const renderHistoryStats = async () => {
        const $stats = dialog.find('#acu-dice-history-stats');
        if ($stats.length === 0) return;

        const allStats = await DiceHistoryStatsDB.getDashboardStats();
        $stats.html(renderDiceHistoryStatsHtml(allStats, historyStatsScope));
      };

      const rerender = () => {
        dialog.find('#acu-dice-history-list').html(renderDiceHistoryItems());
        void renderHistoryStats();
      };
      dialog.find('#acu-history-status-filter').val(historyFilterStatus);
      dialog.find('#acu-history-scope-filter').val(historyStatsScope);

      const refreshByEvent = () => rerender();
      const canListen = Boolean(window.AcuDice && typeof window.AcuDice.on === 'function');
      if (canListen) {
        window.AcuDice.on('check', refreshByEvent);
        window.AcuDice.on('contest', refreshByEvent);
        window.AcuDice.on('effect_run', refreshByEvent);
      }

      void renderHistoryStats();

      dialog.on('change', '#acu-history-scope-filter', function () {
        const val = String($(this).val() || 'chat') as DiceStatsScope;
        historyStatsScope = val === 'character' || val === 'global' ? val : 'chat';
        void renderHistoryStats();
      });

      dialog.on('change', '#acu-history-status-filter', function () {
        historyFilterStatus = String($(this).val() || 'all');
        rerender();
      });

      dialog.on('input', '#acu-history-search', function () {
        historyKeyword = String($(this).val() || '');
        rerender();
      });

      dialog.on('touchstart touchmove', '#acu-dice-history-list', function (e) {
        e.stopPropagation();
      });

      dialog.on('click', '.acu-history-trace-toggle', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const runId = String($(this).data('run-id') || '');
        if (!runId) return;
        if (expandedTraceRunIds.has(runId)) expandedTraceRunIds.delete(runId);
        else expandedTraceRunIds.add(runId);
        rerender();
      });

      dialog.on('click', '#acu-history-clear', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        const ok = await showDiceSystemConfirmDialog({
          title: '清理检定历史',
          message: '确定要清理检定历史吗？',
          detail: '此操作会清空当前会话内历史和统计库记录。',
          iconClass: 'fa-trash',
          confirmText: '清理历史',
          cancelText: '取消',
          tone: 'danger',
        });
        if (!ok) return;

        checkHistory.length = 0;
        contestHistory.length = 0;
        expandedTraceRunIds.clear();
        await DiceHistoryStatsDB.clear();
        rerender();
        if (window.toastr) window.toastr.success('检定历史已清理');
      });

      const closeDialog = () => {
        if (canListen) {
          window.AcuDice.off('check', refreshByEvent);
          window.AcuDice.off('contest', refreshByEvent);
          window.AcuDice.off('effect_run', refreshByEvent);
        }
        dialog.remove();
      };
      dialog.on('click', '.acu-history-close', closeDialog);
      setupOverlayClose(dialog, 'acu-dice-history-overlay', closeDialog);
    };

    // [新增] 构建角色快捷按钮
    const buildCharButtons = () => {
      const $container = panel.find('#dice-char-buttons');
      let html = '';

      // [新增] 如果从MVU面板调用，添加从路径解析的发起者备选
      if (fromMvu && mvuParsedInfo && mvuParsedInfo.initiator) {
        const initiator = mvuParsedInfo.initiator;
        const shortName = initiator.length > 4 ? initiator.substring(0, 4) + '..' : initiator;
        html += `<button type="button" class="acu-dice-char-btn acu-dice-char-btn-mvu" data-char="${escapeHtml(initiator)}" title="从变量路径提取: ${escapeHtml(initiator)}">${escapeHtml(shortName)}</button>`;
      }

      // 添加常规角色列表（所有名字统一处理，不再区分 <user>）
      diceCharacterList.forEach(name => {
        const resolvedName = resolveCanonicalCharacterName(String(name));
        const displayName = replaceUserPlaceholders(String(resolvedName));
        const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
        html += `<button type="button" class="acu-dice-char-btn" data-char="${escapeHtml(String(resolvedName))}" title="${escapeHtml(displayName)}">${escapeHtml(shortName)}</button>`;
      });

      // [新增] 如果从MVU面板调用，添加其他候选（如果有）
      if (fromMvu && mvuParsedInfo && mvuParsedInfo.candidates && mvuParsedInfo.candidates.length > 0) {
        mvuParsedInfo.candidates.forEach(candidate => {
          // 跳过已经添加的发起者
          if (mvuParsedInfo.initiator && candidate === mvuParsedInfo.initiator) return;
          const shortName = candidate.length > 4 ? candidate.substring(0, 4) + '..' : candidate;
          html += `<button type="button" class="acu-dice-char-btn acu-dice-char-btn-mvu-candidate" data-char="${escapeHtml(candidate)}" title="从变量路径提取: ${escapeHtml(candidate)}">${escapeHtml(shortName)}</button>`;
        });
      }

      $container.html(html || `<div class="acu-dice-empty-hint">无角色数据</div>`);
      // 绑定点击事件
      $container.find('.acu-dice-char-btn').click(function () {
        const charName = $(this).data('char');
        panel.find('#dice-initiator-name').val(charName).trigger('change');
      });
    };

    // [新增] 构建属性快捷按钮
    const buildAttrButtons = charName => {
      const $container = panel.find('#dice-attr-buttons');
      const $parentSection = $container.parent(); // 获取包含标题的父容器
      const attrs = getFullAttributesForCharacter(charName);

      // 始终显示区域（即使没有属性数据，也要显示生成按钮）
      $parentSection.show();

      let html = '';

      // [新增] 如果从MVU面板调用，添加从路径解析的属性名备选
      if (fromMvu && mvuParsedInfo && mvuParsedInfo.attrName) {
        const attrName = mvuParsedInfo.attrName;
        // 尝试从当前角色获取该属性的值
        const attrValue = getAttributeValue(charName, attrName) || targetValue || '';
        if (attrValue) {
          html += `<button type="button" class="acu-dice-attr-btn acu-dice-attr-btn-mvu" data-name="${escapeHtml(attrName)}" data-value="${attrValue}" data-source="generic" title="从变量路径提取: ${escapeHtml(attrName)}">${escapeHtml(attrName)}:${attrValue}</button>`;
        } else {
          // 即使没有值也显示，用户可以手动填入
          html += `<button type="button" class="acu-dice-attr-btn acu-dice-attr-btn-mvu" data-name="${escapeHtml(attrName)}" data-value="" data-source="generic" title="从变量路径提取: ${escapeHtml(attrName)}">${escapeHtml(attrName)}</button>`;
        }
      }

      // 现有属性按钮
      attrs.forEach(attr => {
        html += `<button type="button" class="acu-dice-attr-btn" data-name="${escapeHtml(attr.name)}" data-value="${attr.value}" data-source="${escapeHtml(attr.source || 'generic')}">${escapeHtml(attr.name)}:${attr.value}</button>`;
      });

      // 生成属性按钮（始终显示）
      html += `<button type="button" class="acu-dice-gen-attr-btn" aria-label="为当前角色生成属性" title="为当前角色生成属性"><i class="fa-solid fa-dice"></i></button>`;

      // 清空属性按钮
      html += `<button type="button" class="acu-dice-clear-attr-btn" aria-label="清空当前规则的属性" title="清空当前规则的属性（保留自定义属性）"><i class="fa-solid fa-trash-alt"></i></button>`;

      $container.html(html);

      // 绑定属性按钮点击事件
      $container.find('.acu-dice-attr-btn').click(function () {
        const attrName = $(this).data('name');
        const attrValue = $(this).data('value');
        const attrSource = String($(this).attr('data-source') || 'generic') as CharacterAttributeSource;

        // 填入属性名
        // 使用 change 触发提交态刷新，避免输入中每字符重绘导致焦点丢失
        const $attrNameInput = panel.find('#dice-attr-name');
        $attrNameInput.val(attrName).trigger('change');

        const target = resolveQuickSelectTarget(attrName, attrSource, currentAdvancedPreset, 'normal');
        const targetField = getNormalQuickSelectInputSelector(target);

        panel.find(targetField).val(attrValue);

        // [新增] 如果处于自定义模式,同时填入目标值
        if (panel.find('#acu-dice-custom-mode-fields').is(':visible')) {
          panel.find('#custom-target-value').val(attrValue);
        }

        // [修复] 只填入对应字段，不自动填写DC
        // DC留空时会在检定时根据预设的defaultValue处理
        // - COC模式：DC = 属性值
        // - DND模式：DC = 10（或预设的默认值）

        // 触发change事件以更新相关UI
        panel.find(targetField).trigger('change');
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-dice-gen-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // [修复] 临时禁用更新处理器，防止闪烁
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 属性生成中，跳过自动刷新');
        };

        try {
          const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';

          console.log('[DICE]ACU 生成属性 for:', charName);

          // 生成属性（使用激活的预设）
          const generated = generateRPGAttributes();

          // 兼容旧格式和新格式
          const baseAttrs = generated.base || generated;
          const specialAttrs = generated.special || {};

          // [修复] 分别写入基础属性和特有属性到对应的列
          const result = await writeAttributesToCharacter(charName, baseAttrs, false, specialAttrs);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[DICE]ACU 生成属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('生成属性失败，未能把随机属性写回角色表。', {
              suggestion: '请确认当前角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // [修复] 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });

      // 绑定清空属性按钮点击事件
      $container.find('.acu-dice-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // 临时禁用更新处理器
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 清空属性中，跳过自动刷新');
        };

        try {
          console.log('[DICE]ACU 清空属性 for:', charName);

          const result = await clearPresetAttributesForCharacter(charName);

          if (result.success) {
            // 刷新属性按钮
            buildAttrButtons(charName);
          }
        } catch (err) {
          console.error('[DICE]ACU 清空属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('清空属性失败，未能把角色属性列清空。', {
              suggestion: '请确认当前角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });
    };

    // 初始化角色按钮
    buildCharButtons();
    // 初始化属性按钮（默认主角）
    buildAttrButtons(diceCharacterList[0] || '<user>');
    // [新增] 随机技能按钮点击事件
    panel.find('#dice-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = getRandomSkillPool();
      const randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#dice-attr-name').val(randomSkill).trigger('change');
    });

    // 初始化自定义下拉菜单
    initCustomDropdown(panel.find('#dice-initiator-name'), diceCharacterList);
    initCustomDropdown(panel.find('#dice-attr-name'), diceAttrList);
    // [新增] 添加清除按钮
    addClearButton(
      panel,
      '#dice-initiator-name, #dice-attr-name, #dice-attr-value, #dice-skill-mod, #dice-target, #dice-modifier, #custom-dice-expr, #custom-target-value',
    );

    // [修复] 角色变化时更新属性列表和快捷按钮
    panel.find('#dice-initiator-name').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = getAttributesForCharacter(charName);
      initCustomDropdown(panel.find('#dice-attr-name'), newAttrList.length > 0 ? newAttrList : diceAttrList);

      // [新增] 更新属性快捷按钮
      buildAttrButtons(charName);
    });

    // [新增] 属性名变化时自动填入属性值
    panel.find('#dice-attr-name').on('change.acuval', function () {
      const charName = panel.find('#dice-initiator-name').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrEntry = getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const target = resolveQuickSelectTarget(attrEntry.name, attrEntry.source, currentAdvancedPreset, 'normal');
        const targetField = getNormalQuickSelectInputSelector(target);
        panel.find(targetField).val(attrEntry.value).trigger('change');
        // [修复] 不自动填写DC，让检定时根据预设的defaultValue处理
      }
    });

    // [修复] 根据骰子类型自动转换目标值
    const convertTargetForDice = (currentTarget, fromDice, toDice) => {
      if (!currentTarget || currentTarget === '') return '';
      const val = parseInt(currentTarget, 10);
      if (isNaN(val)) return currentTarget;

      // 获取骰子最大值
      const getMaxRoll = dice => {
        const match = dice.match(/(\d+)d(\d+)/i);
        if (!match) return 100;
        return parseInt(match[1], 10) * parseInt(match[2], 10);
      };

      const fromMax = getMaxRoll(fromDice);
      const toMax = getMaxRoll(toDice);

      // 按比例转换
      const ratio = val / fromMax;
      const newVal = Math.round(ratio * toMax);
      return Math.max(0, Math.min(newVal, toMax));
    };

    // [重写] 成功标准切换时更新 UI（COC/DND 模式切换）
    const updateRuleMode = () => {
      const criteria = panel.find('#dice-success-criteria').val();
      const isDND = criteria === 'gte';
      const $targetInput = panel.find('#dice-target');
      const $difficultyWrapper = panel.find('#dice-difficulty-wrapper');
      const $row3 = panel.find('#dice-row-3');

      if (isDND) {
        // DND 模式
        $targetInput.attr('placeholder', '留空=10');
        panel.find('#dice-target-label').text('DC');
        $difficultyWrapper.hide();
        $row3.css('grid-template-columns', '1fr 1fr');
      } else {
        // COC 模式
        $targetInput.attr('placeholder', '留空=属性值');
        panel.find('#dice-target-label').text('目标值');
        $difficultyWrapper.show();
        $row3.css('grid-template-columns', '1fr 1fr 1fr');
      }
    };

    panel.find('#dice-success-criteria').on('change', updateRuleMode);

    // 初始化时执行一次
    updateRuleMode();

    // [新增] 高级预设选择器变更事件 (已重构为快捷按钮点击事件)
    let currentAdvancedPreset: AdvancedDicePreset | LegacyAdvancedDicePreset | null = null;
    let lastVisiblePresetId: string | null = null;
    let pendingEffectRuns: PendingEffectContext[] = [];
    let activeConfirmEffectRun: PendingEffectContext | null = null;
    let effectRunRetryTimer: ReturnType<typeof setTimeout> | null = null;
    let effectRunEventSeq = 0;
    const EFFECT_RUN_TTL_MS = 60_000;
    const EFFECT_RUN_FALLBACK_WINDOW_MS = 2_500;
    const messageMutationQueues = new Map<number, Promise<unknown>>();

    const getPresetQuickActions = (
      preset: AdvancedDicePreset | LegacyAdvancedDicePreset | null,
    ): PresetQuickAction[] => {
      if (!preset || !('quickActions' in preset) || !Array.isArray(preset.quickActions)) return [];
      return preset.quickActions.filter((action): action is PresetQuickAction =>
        Boolean(action && typeof action.id === 'string' && typeof action.kind === 'string'),
      );
    };

    const buildQuickActionContext = (): Record<string, number> => {
      const attrRaw = String(panel.find('#dice-attr-value').val() || '').trim();
      const modRaw = String(panel.find('#dice-modifier').val() || '').trim();
      const targetRaw = String(panel.find('#dice-target').val() || '').trim();
      const attr = attrRaw === '' ? 0 : parseFloat(attrRaw) || 0;
      const mod = modRaw === '' ? 0 : parseFloat(modRaw) || 0;
      const dc = targetRaw === '' ? 0 : parseFloat(targetRaw) || 0;
      return {
        $attr: attr,
        $mod: mod,
        $dc: dc,
      };
    };

    const isQuickActionVisible = (action: PresetQuickAction): boolean => {
      if (!action.condition) return true;
      const evalResult = evaluateCondition(action.condition, buildQuickActionContext());
      if (!evalResult.success) return false;
      return typeof evalResult.value === 'number' ? evalResult.value !== 0 : Boolean(evalResult.value);
    };

    const renderPresetQuickActions = (preset: AdvancedDicePreset | LegacyAdvancedDicePreset | null): void => {
      const $container = panel.find('#dice-preset-quick-actions');
      if (!$container.length) return;
      const actions = getPresetQuickActions(preset).filter(isQuickActionVisible);
      if (actions.length === 0) {
        $container.empty().hide();
        return;
      }
      let html = '';
      actions.forEach(action => {
        const icon = action.icon || 'fa-bolt';
        const tooltip = action.tooltip || action.id;
        html += `<button type="button" class="acu-dice-preset-action-btn" data-action-id="${escapeHtml(action.id)}" title="${escapeHtml(tooltip)}"><i class="fa-solid ${escapeHtml(icon)}"></i></button>`;
      });
      $container.html(html).show();
    };

    const waitMs = (ms: number): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    };

    const enqueueMessageMutation = async <T>(messageId: number, task: () => Promise<T>): Promise<T> => {
      const prev = messageMutationQueues.get(messageId) || Promise.resolve();
      const next: Promise<T> = prev.catch(() => undefined).then(task);
      messageMutationQueues.set(messageId, next);
      try {
        return await next;
      } finally {
        if (messageMutationQueues.get(messageId) === next) {
          messageMutationQueues.delete(messageId);
        }
      }
    };

    const findMetaClosingIndex = (
      text: string,
      closingCandidates: string[],
      sourceMetaText?: string,
    ): { closingIdx: number; closingTag: string } => {
      if (sourceMetaText) {
        const anchorLine = sourceMetaText
          .split('\n')
          .map(line => line.trim())
          .find(line => line && line !== '<meta:检定结果>' && line !== '</meta:检定结果>');
        if (anchorLine) {
          const anchorIdx = text.indexOf(anchorLine);
          if (anchorIdx >= 0) {
            let bestIdx = -1;
            let bestTag = '';
            for (const candidate of closingCandidates) {
              const idx = text.indexOf(candidate, anchorIdx);
              if (idx >= 0 && (bestIdx === -1 || idx < bestIdx)) {
                bestIdx = idx;
                bestTag = candidate;
              }
            }
            if (bestIdx >= 0) return { closingIdx: bestIdx, closingTag: bestTag };
          }
        }
      }

      let closingIdx = -1;
      let closingTag = '';
      for (const candidate of closingCandidates) {
        const idx = text.lastIndexOf(candidate);
        if (idx > closingIdx) {
          closingIdx = idx;
          closingTag = candidate;
        }
      }
      return { closingIdx, closingTag };
    };

    const injectEffectLinesIntoMeta = async (
      messageId: number,
      runId: string,
      lines: string[],
      sourceMetaText?: string,
    ): Promise<boolean> => {
      if (lines.length === 0) return false;
      console.info(`[DICE][META] inject start: run=${runId}, message=${messageId}, lines=${lines.length}`);
      return enqueueMessageMutation(messageId, async () => {
        const retryDelays = [0, 120, 280, 500, 900];
        for (let attempt = 0; attempt < retryDelays.length; attempt++) {
          const delay = retryDelays[attempt];
          if (delay > 0) await waitMs(delay);

          const msgs = getChatMessages(messageId);
          if (msgs.length === 0) {
            console.info(
              `[DICE][META] inject retry=${attempt + 1}/${retryDelays.length}: message not found, run=${runId}, message=${messageId}`,
            );
            continue;
          }

          const msg = msgs[0];
          const msgRole = (msg as { role?: string }).role || 'unknown';
          const extraObj: Record<string, unknown> =
            msg.extra && typeof msg.extra === 'object' ? (msg.extra as Record<string, unknown>) : {};
          const injectedRunsRaw = extraObj.acuEffectInjectedRuns;
          const injectedRuns = Array.isArray(injectedRunsRaw)
            ? injectedRunsRaw.filter((v): v is string => typeof v === 'string')
            : [];
          if (injectedRuns.includes(runId)) {
            console.info(`[DICE][META] inject skipped duplicated run: run=${runId}, message=${messageId}`);
            return true;
          }

          const original = String(msg.message || '');
          const closingCandidates = ['</meta:检定结果>', '&lt;/meta:检定结果&gt;', '&amp;lt;/meta:检定结果&amp;gt;'];
          const { closingIdx, closingTag } = findMetaClosingIndex(original, closingCandidates, sourceMetaText);
          if (closingIdx === -1) {
            const hasRawOpen = original.includes('<meta:检定结果>');
            const hasRawClose = original.includes('</meta:检定结果>');
            const hasEscapedOpen = original.includes('&lt;meta:检定结果&gt;');
            const hasEscapedClose = original.includes('&lt;/meta:检定结果&gt;');
            console.info(
              `[DICE][META] inject retry=${attempt + 1}/${retryDelays.length}: closing tag not found, run=${runId}, message=${messageId}, role=${msgRole}, length=${original.length}, rawOpen=${hasRawOpen}, rawClose=${hasRawClose}, escapedOpen=${hasEscapedOpen}, escapedClose=${hasEscapedClose}`,
            );
            continue;
          }

          const beforeClose = original.slice(0, closingIdx);
          const needsLeadingNewline = beforeClose.length > 0 && !beforeClose.endsWith('\n');
          const effectBlock = `${needsLeadingNewline ? '\n' : ''}${lines.join('\n')}`;
          const updatedMsg = beforeClose + effectBlock + '\n' + original.slice(closingIdx);
          console.info(
            `[DICE][META] inject apply: run=${runId}, message=${messageId}, role=${msgRole}, attempt=${attempt + 1}, oldLen=${original.length}, newLen=${updatedMsg.length}, closingIdx=${closingIdx}, closingTag=${closingTag}`,
          );
          await setChatMessages(
            [
              {
                message_id: messageId,
                message: updatedMsg,
                extra: {
                  ...extraObj,
                  acuEffectInjectedRuns: [...injectedRuns, runId],
                },
              },
            ],
            { refresh: 'affected' },
          );
          const verifyMsg = getChatMessages(messageId)[0];
          const verifyText = String(verifyMsg?.message || '');
          const lineHitCount = lines.filter(line => verifyText.includes(line)).length;
          console.info(
            `[DICE][META] inject done: run=${runId}, message=${messageId}, lineHit=${lineHitCount}/${lines.length}, finalLen=${verifyText.length}`,
          );
          return true;
        }

        console.warn(
          `[DICE][META] inject failed: run=${runId}, message=${messageId}, reason=message_not_ready_or_meta_missing`,
        );
        return false;
      });
    };

    const injectEffectLinesIntoTextarea = (runId: string, lines: string[], sourceMetaText?: string): boolean => {
      if (lines.length === 0) return false;
      try {
        const { $ } = getCore();
        const $ta = $('#send_textarea');
        if ($ta.length === 0) return false;
        const raw = String($ta.val() || '');
        if (!raw.includes('meta:检定结果')) return false;
        const missingLines = lines.filter(line => !raw.includes(line));
        if (missingLines.length === 0) {
          console.info(`[DICE][META] textarea inject skipped duplicated run=${runId}`);
          return true;
        }

        const closingCandidates = ['</meta:检定结果>', '&lt;/meta:检定结果&gt;', '&amp;lt;/meta:检定结果&amp;gt;'];
        const { closingIdx, closingTag } = findMetaClosingIndex(raw, closingCandidates, sourceMetaText);
        if (closingIdx === -1) {
          console.warn(`[DICE][META] textarea inject failed: closing tag missing, run=${runId}`);
          return false;
        }

        const beforeClose = raw.slice(0, closingIdx);
        const needsLeadingNewline = beforeClose.length > 0 && !beforeClose.endsWith('\n');
        const effectBlock = `${needsLeadingNewline ? '\n' : ''}${missingLines.join('\n')}`;
        const updated = beforeClose + effectBlock + '\n' + raw.slice(closingIdx);
        setTextareaValueAndNotify($ta[0] as HTMLTextAreaElement, updated);
        console.info(
          `[DICE][META] textarea inject done: run=${runId}, lines=${missingLines.length}, closingTag=${closingTag}`,
        );
        return true;
      } catch (e) {
        console.warn(`[DICE][META] textarea inject error: run=${runId}`, e);
        return false;
      }
    };

    const hasMetaInTextarea = (): boolean => {
      try {
        const { $ } = getCore();
        const $ta = $('#send_textarea');
        if ($ta.length === 0) return false;
        const raw = String($ta.val() || '');
        return raw.includes('meta:检定结果');
      } catch {
        return false;
      }
    };

    const normalizeMessageId = (payload: unknown): string | undefined => {
      if (payload === null || payload === undefined) return undefined;
      if (typeof payload === 'string' || typeof payload === 'number') return String(payload);
      if (typeof payload === 'object') {
        const record = payload as Record<string, unknown>;
        const candidates = [record.messageId, record.message_id, record.id, record.mid];
        const hit = candidates.find(v => v !== undefined && v !== null && String(v).trim() !== '');
        if (hit !== undefined && hit !== null) return String(hit);
      }
      return undefined;
    };

    const emitEffectRun = (payload: Omit<EffectRunEventPayload, 'seq'>): number => {
      effectRunEventSeq += 1;
      const fullPayload: EffectRunEventPayload = {
        ...payload,
        seq: effectRunEventSeq,
      };
      emitEvent('effect_run', fullPayload);
      return effectRunEventSeq;
    };

    const getSecondaryTriggerMode = (preset?: AdvancedDicePreset): 'first' | 'all' => {
      return preset?.secondaryTriggerMode === 'all' ? 'all' : 'first';
    };

    const findHistoryIndexByRunId = (runId?: string): number => {
      if (!runId) return -1;
      for (let index = checkHistory.length - 1; index >= 0; index--) {
        const item = checkHistory[index] as CheckHistoryEntry;
        if (item.effectRunId === runId) return index;
      }
      return -1;
    };

    const isValidEffectStatusTransition = (
      fromStatus: CheckHistoryExtension['effectStatus'],
      toStatus: CheckHistoryExtension['effectStatus'],
    ): boolean => {
      if (!fromStatus || !toStatus) return true;
      if (fromStatus === toStatus) return true;
      const transitions: Record<string, string[]> = {
        planned: ['confirmed', 'cancelled', 'failed'],
        confirmed: ['committed', 'failed', 'cancelled'],
        committed: [],
        failed: [],
        cancelled: [],
      };
      const allowed = transitions[fromStatus] || [];
      return allowed.includes(toStatus);
    };

    const setHistoryEffectState = (
      historyIndex: number,
      patch: Partial<CheckHistoryExtension>,
    ): CheckHistoryEntry | null => {
      if (historyIndex < 0 || historyIndex >= checkHistory.length) return null;
      const historyEntry = checkHistory[historyIndex] as CheckHistoryEntry;
      const nextPatch = { ...patch };
      if (
        nextPatch.effectStatus &&
        historyEntry.effectStatus &&
        !isValidEffectStatusTransition(historyEntry.effectStatus, nextPatch.effectStatus)
      ) {
        console.warn(
          `[DICE] Invalid effect status transition blocked: ${historyEntry.effectStatus} -> ${nextPatch.effectStatus}`,
        );
        delete nextPatch.effectStatus;
      }
      Object.assign(historyEntry, nextPatch);
      return historyEntry;
    };

    const setHistoryEffectStateByRun = (
      run: PendingEffectContext,
      patch: Partial<CheckHistoryExtension>,
    ): CheckHistoryEntry | null => {
      const byRunId = findHistoryIndexByRunId(run.runId);
      if (byRunId >= 0) return setHistoryEffectState(byRunId, patch);
      console.warn(`[DICE] setHistoryEffectStateByRun skipped: runId not found (${run.runId})`);
      return null;
    };

    const resolveLatestMetaUserMessageId = (): number | undefined => {
      try {
        const lastId = getLastMessageId();
        if (!Number.isFinite(lastId) || lastId < 0) return undefined;
        const from = Math.max(0, lastId - 12);
        const msgs = getChatMessages(`${from}-${lastId}`, { role: 'user' }) as Array<{
          message_id: number;
          message: string;
        }>;
        for (let i = msgs.length - 1; i >= 0; i--) {
          const text = String(msgs[i].message || '');
          if (text.includes('meta:检定结果')) {
            return msgs[i].message_id;
          }
        }
      } catch {
        // ignore
      }
      return undefined;
    };

    const scheduleEffectRunRetry = (): void => {
      if (effectRunRetryTimer) return;
      effectRunRetryTimer = setTimeout(() => {
        effectRunRetryTimer = null;
        void processPendingEffectRuns();
      }, 220);
    };

    const enqueueEffectRun = (run: PendingEffectContext): void => {
      if (!run.expiresAt) {
        run.expiresAt = Date.now() + EFFECT_RUN_TTL_MS;
      }
      pendingEffectRuns.push(run);
      console.info(
        `[DICE] Effect run queued: ${run.runId}, message=${run.messageId || 'pending'}, expiresAt=${run.expiresAt}, pending=${pendingEffectRuns.length}`,
      );
    };

    const processPendingEffectRuns = async (payload?: unknown): Promise<void> => {
      const incomingMessageId = normalizeMessageId(payload);
      if (incomingMessageId) {
        console.info(`[DICE][META] MESSAGE_SENT captured id=${incomingMessageId}`);
      }

      // 即使队列为空，也将 messageId 捕获到正在等待确认的 run 上
      // （确认弹窗期间 MESSAGE_SENT 可能已触发，run 还没进队列）
      if (incomingMessageId && activeConfirmEffectRun && !activeConfirmEffectRun.messageId) {
        activeConfirmEffectRun.messageId = incomingMessageId;
        console.info(
          `[DICE][META] bind activeConfirm run=${activeConfirmEffectRun.runId} message=${incomingMessageId}`,
        );
      }

      if (pendingEffectRuns.length === 0) return;

      const now = Date.now();
      const nextPending: PendingEffectContext[] = [];
      const executableRuns: PendingEffectContext[] = [];
      const consumeAllRunsForMessage = getDiceConfig().overwriteLastDiceResult === false;
      let consumedByMessage = false;
      let consumedByFallback = false;

      for (const run of pendingEffectRuns) {
        const expired = Boolean(run.expiresAt && run.expiresAt < now);
        if (expired) {
          const errMsg = '效果执行已过期，已自动取消';
          setHistoryEffectStateByRun(run, {
            effectStatus: 'cancelled',
            effectError: errMsg,
            effectTrace: ['已取消：超时未提交'],
          });
          const seq = emitEffectRun({
            runId: run.runId,
            status: 'cancelled',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: [],
            effectTrace: ['已取消：超时未提交'],
            chainMode: getSecondaryTriggerMode(run.preset),
            error: errMsg,
            timestamp: now,
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });
          continue;
        }

        if (incomingMessageId) {
          if (run.messageId && run.messageId !== incomingMessageId) {
            nextPending.push(run);
            continue;
          }

          if (!consumedByMessage || consumeAllRunsForMessage) {
            if (!run.messageId) {
              run.messageId = incomingMessageId;
              console.info(`[DICE][META] bind queued run=${run.runId} message=${incomingMessageId}`);
            }
            executableRuns.push(run);
            if (!consumeAllRunsForMessage) {
              consumedByMessage = true;
            }
          } else {
            nextPending.push(run);
          }
          continue;
        }

        // 无 messageId 事件参数时，使用短时间窗降级执行，避免队列永久卡住
        const withinFallbackWindow = now - run.timestamp <= EFFECT_RUN_FALLBACK_WINDOW_MS;
        if (withinFallbackWindow && !consumedByFallback) {
          if (!run.messageId) {
            const guessedMsgId = resolveLatestMetaUserMessageId();
            if (guessedMsgId !== undefined) {
              run.messageId = String(guessedMsgId);
              console.warn(`[DICE][META] fallback guessed messageId: run=${run.runId}, message=${run.messageId}`);
            }
          }
          if (run.messageId) {
            console.warn(`[DICE] Effect run ${run.runId}: fallback commit with bound messageId=${run.messageId}`);
            executableRuns.push(run);
            consumedByFallback = true;
          } else if (hasMetaInTextarea()) {
            console.warn(`[DICE][META] fallback commit by textarea meta presence: run=${run.runId}`);
            executableRuns.push(run);
            consumedByFallback = true;
          } else {
            console.warn(`[DICE][META] fallback skipped: run=${run.runId} has no messageId yet`);
            nextPending.push(run);
          }
        } else if (!withinFallbackWindow && !consumedByFallback) {
          console.warn(`[DICE][META] timeout fallback commit without messageId: run=${run.runId}`);
          executableRuns.push(run);
          consumedByFallback = true;
        } else {
          nextPending.push(run);
        }
      }

      if (executableRuns.length === 0) {
        pendingEffectRuns = nextPending;
        if (pendingEffectRuns.length > 0) {
          scheduleEffectRunRetry();
        }
        return;
      }

      pendingEffectRuns = nextPending;
      for (const run of executableRuns) {
        try {
          const results = await executeEffects(run);
          const hasFailure = results.some(r => !r.success);
          if (!hasFailure) {
            const succeeded = results.filter(r => r.success);
            const latestAttrResult = succeeded
              .slice()
              .reverse()
              .find(r => r.target && isSameAttributeAlias(r.target, run.context.attributeName));
            if (latestAttrResult) {
              panel.find('#dice-attr-value').val(String(latestAttrResult.newValue));
            }
            buildAttrButtons(run.context.characterName);
          }

          setHistoryEffectStateByRun(run, {
            effectStatus: hasFailure ? 'failed' : 'committed',
            effectResults: results,
            effectError: hasFailure ? '部分效果执行失败' : undefined,
            effectTrace: buildEffectTraceLines(results),
          });

          const seq = emitEffectRun({
            runId: run.runId,
            status: hasFailure ? 'failed' : 'committed',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: results,
            effectTrace: buildEffectTraceLines(results),
            chainMode: getSecondaryTriggerMode(run.preset),
            error: hasFailure ? '部分效果执行失败' : undefined,
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });

          if (hasFailure && window.toastr) {
            const firstError =
              results.find(result => !result.success && result.error)?.error ||
              withTableTemplateCheckHint('请检查表格结构和字段约束');
            window.toastr.warning(`效果执行失败，已回滚本次全部效果：${firstError}`, '效果执行失败', {
              timeOut: 9000,
            });
          }

          console.info(
            `[DICE] Effect run committed: ${run.runId}, total=${results.length}, success=${results.filter(r => r.success).length}`,
          );

          // 效果结果注入：将属性变化和 outputMessage 插入到已有的 <meta:检定结果> 闭合标签前
          if (!hasFailure) {
            const metaLines = buildEffectMetaLines(results, {
              branchReasonText: run.branchReasonText,
            });
            if (metaLines.length > 0) {
              try {
                if (run.messageId) {
                  const msgId = parseInt(run.messageId, 10);
                  if (!isNaN(msgId) && msgId >= 0) {
                    const injected = await injectEffectLinesIntoMeta(msgId, run.runId, metaLines, run.sourceMetaText);
                    if (injected) {
                      console.info(
                        `[DICE] Effect results injected into meta: ${metaLines.length} line(s) in message ${msgId}`,
                      );
                    } else {
                      console.warn(
                        `[DICE][META] inject returned false: run=${run.runId}, rawMessageId=${run.messageId}, lines=${metaLines.length}`,
                      );
                    }
                  } else {
                    console.warn(
                      `[DICE][META] invalid messageId for injection: run=${run.runId}, rawMessageId=${run.messageId}`,
                    );
                  }
                } else {
                  const textareaInjected = injectEffectLinesIntoTextarea(run.runId, metaLines, run.sourceMetaText);
                  if (!textareaInjected) {
                    console.warn(`[DICE][META] no messageId and textarea inject failed: run=${run.runId}`);
                  }
                }
              } catch (injectErr) {
                console.error('[DICE] Failed to inject effect results into meta:', injectErr);
              }
            }
          }
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          setHistoryEffectStateByRun(run, {
            effectStatus: 'failed',
            effectError: errMsg,
            effectTrace: [`执行失败：${errMsg}`],
          });
          const seq = emitEffectRun({
            runId: run.runId,
            status: 'failed',
            characterName: run.context.characterName,
            attributeName: run.context.attributeName,
            historyIndex: run.historyIndex,
            effectResults: [],
            effectTrace: [`执行失败：${errMsg}`],
            chainMode: getSecondaryTriggerMode(run.preset),
            error: errMsg,
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(run, { effectEventSeq: seq });
          console.error(`[DICE] Effect run failed: ${run.runId}`, error);
        }
      }
    };

    const cleanupExpiredEffectRuns = (): void => {
      if (pendingEffectRuns.length === 0) return;
      const now = Date.now();
      const nextPending: PendingEffectContext[] = [];
      for (const run of pendingEffectRuns) {
        const expired = Boolean(run.expiresAt && run.expiresAt < now);
        if (!expired) {
          nextPending.push(run);
          continue;
        }

        const errMsg = '效果执行已过期，已自动取消';
        setHistoryEffectStateByRun(run, {
          effectStatus: 'cancelled',
          effectError: errMsg,
          effectTrace: ['已取消：超时'],
        });
        const seq = emitEffectRun({
          runId: run.runId,
          status: 'cancelled',
          characterName: run.context.characterName,
          attributeName: run.context.attributeName,
          historyIndex: run.historyIndex,
          effectResults: [],
          effectTrace: ['已取消：超时'],
          chainMode: getSecondaryTriggerMode(run.preset),
          error: errMsg,
          timestamp: now,
        });
        setHistoryEffectStateByRun(run, { effectEventSeq: seq });
      }
      pendingEffectRuns = nextPending;
    };
    const existingCleaner = (window as Record<string, unknown>)[effectRunCleanerTimerKey];
    if (typeof existingCleaner === 'number') {
      window.clearInterval(existingCleaner);
    }
    (window as Record<string, unknown>)[effectRunCleanerTimerKey] = window.setInterval(() => {
      cleanupExpiredEffectRuns();
    }, 2000);

    // 辅助函数: 应用字段配置
    const applyFieldConfig = function (
      $input: JQuery,
      $label: JQuery,
      config: FieldConfig | undefined,
      defaults: { label: string; placeholder: string },
    ) {
      // 获取包含label和input的wrapper div
      // 实际DOM结构: <div> <label/> <div.acu-input-wrapper> <input/> </div> </div>
      // 所以需要找到label的父元素（同时也是input-wrapper的父元素）
      const $wrapper = $label.parent();

      if (config?.hidden) {
        $wrapper.hide();
        return;
      }

      $wrapper.show();
      $input.attr('placeholder', config?.placeholder || defaults.placeholder).prop('readonly', false);
      $label.text(config?.label || defaults.label);
    };

    /**
     * [新增] 检查属性名是否匹配 CheckSelector
     * @param attrName - 当前检定的属性名
     * @param selector - 选择器配置
     * @returns 是否匹配（true=可用，false=不可用）
     */
    const matchesCheckSelector = (attrName: string, selector?: CheckSelector): boolean => {
      // 如果没有定义 selector，默认匹配所有
      if (!selector) return true;

      const normalizedName = attrName.trim().toLowerCase();

      // 辅助函数：将通配符模式转换为正则表达式
      const wildcardToRegex = (pattern: string): RegExp => {
        const escaped = pattern
          .replace(/[.+^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
          .replace(/\*/g, '.*') // * -> .*
          .replace(/\?/g, '.'); // ? -> .
        return new RegExp(`^${escaped}$`, 'i');
      };

      // 辅助函数：检查名称是否匹配任一模式
      const matchesAnyPattern = (name: string, patterns: string[]): boolean => {
        return patterns.some(pattern => {
          const regex = wildcardToRegex(pattern);
          return regex.test(name);
        });
      };

      // 1. 检查 namePatterns.exclude（优先于 include）
      if (selector.namePatterns?.exclude && selector.namePatterns.exclude.length > 0) {
        if (matchesAnyPattern(normalizedName, selector.namePatterns.exclude)) {
          return false; // 被排除
        }
      }

      // 2. 检查 namePatterns.include
      if (selector.namePatterns?.include && selector.namePatterns.include.length > 0) {
        // 如果定义了 include 且不为 ['*']，需要匹配
        const isWildcardOnly = selector.namePatterns.include.length === 1 && selector.namePatterns.include[0] === '*';
        if (!isWildcardOnly && !matchesAnyPattern(normalizedName, selector.namePatterns.include)) {
          return false; // 未被包含
        }
      }

      // 3. 检查 tags（暂时跳过，因为当前掷骰上下文可能没有 tags 元数据）
      // 未来可以扩展支持 tags.include/exclude

      return true;
    };

    // [新增] 渲染效果输入区域
    const renderEffectInputs = (preset: AdvancedDicePreset, attrName: string): string[] => {
      if (!preset.effectsConfig) return [];

      // 检查触发模式
      const isMatched = matchesCheckSelector(attrName, {
        namePatterns: { include: preset.effectsConfig.triggerPatterns },
      });

      if (!isMatched) return [];

      const items: string[] = [];

      // 从 preset.outcomes 中查找有效果的结果等级，生成输入框
      // 注意：效果定义在 preset.outcomes[].effects 中，不是 effectsConfig.outcomes
      if (preset.outcomes && Array.isArray(preset.outcomes)) {
        const outcomesWithEffects = preset.outcomes.filter(outcome => outcome.effects && outcome.effects.length > 0);

        outcomesWithEffects.forEach(outcome => {
          // 获取该结果等级的默认值（从 effectsConfig.defaultValues 或 effects[0].value）
          const defaultVal =
            preset.effectsConfig?.defaultValues?.[outcome.name] || (outcome.effects && outcome.effects[0]?.value) || '';
          const label = outcome.name; // 使用结果名作为标签

          items.push(`
            <div class="acu-effect-input-group">
              <div class="acu-effect-input-label">
                <span>${escapeHtml(label)}效果</span>
                <span class="acu-effect-preview-text" id="effect-preview-${escapeHtml(outcome.name)}"></span>
              </div>
              <input type="text"
                     class="acu-dice-input acu-effect-value-input"
                     data-outcome="${escapeHtml(outcome.name)}"
                     value=""
                     placeholder="${escapeHtml(String(defaultVal || '输入效果值 (如 1d6)'))}">
            </div>
          `);
        });
      }

      return items;
    };

    const applyAdvancedPreset = (presetId: string | null) => {
      // 获取关键DOM元素
      const $modWrapper = panel.find('#dice-mod-wrapper');
      const $row1 = panel.find('#dice-row-1');
      const $row2 = panel.find('#dice-row-2');
      const $row3 = panel.find('#dice-row-3');
      const $customArea = panel.find('#dice-custom-fields-area');
      const $attrWrapper = panel.find('#dice-attr-wrapper');
      const $targetWrapper = panel.find('#dice-target-wrapper');
      const $skillModWrapper = panel.find('#dice-skill-mod-wrapper');
      const $nameWrapper = panel.find('#dice-name-wrapper');
      const $attrNameWrapper = panel.find('#dice-attr-name-wrapper');

      // 辅助函数: 恢复 Row 1 的名字和属性名
      const restoreRow1 = () => {
        if ($nameWrapper.parent().attr('id') !== 'dice-row-1') {
          $nameWrapper.detach().prependTo($row1);
        }
        if ($attrNameWrapper.parent().attr('id') !== 'dice-row-1') {
          $attrNameWrapper.detach().appendTo($row1);
        }
        $nameWrapper.show();
        $attrNameWrapper.show();
        $row1.show();
        // 恢复为2列布局
        $row1.removeClass('cols-2 cols-3').addClass('cols-2');
      };

      // 辅助函数: 确保修正值输入框回到原来的位置
      const restoreModifier = () => {
        if ($modWrapper.parent().attr('id') !== 'dice-row-3') {
          $modWrapper.detach().appendTo($row3);
        }
        $modWrapper.show();
        panel.find('#dice-mod-label').text('修正值'); // 恢复默认标签
        panel.find('#dice-modifier').attr('placeholder', '留空=0');
      };

      // 辅助函数: 恢复 Row 2 的属性值、技能加值和目标值
      const restoreRow2 = () => {
        if ($attrWrapper.parent().attr('id') !== 'dice-row-2') {
          $attrWrapper.detach().prependTo($row2);
        }
        if ($skillModWrapper.parent().attr('id') !== 'dice-row-2') {
          $skillModWrapper.detach().insertAfter($attrWrapper);
        }
        if ($targetWrapper.parent().attr('id') !== 'dice-row-2') {
          $targetWrapper.detach().appendTo($row2);
        }
        $attrWrapper.show();
        $skillModWrapper.hide(); // 默认隐藏，由预设控制显示
        $targetWrapper.show();
        $row2.show();
      };

      if (!presetId || presetId === '__custom__') {
        // 恢复默认模式 (自定义或无预设)
        currentAdvancedPreset = null;
        lastVisiblePresetId = null;

        // [新增] 显示自定义模式字段区,隐藏预设相关字段
        panel.find('#acu-dice-custom-mode-fields').show();

        // 恢复 Row 1、Row 2 和 Row 3 但隐藏 Row 2/3 (自定义模式使用专属字段)
        restoreRow1();
        restoreRow2();
        restoreModifier();
        $row2.hide();
        $row3.hide();
        panel.find('#dice-difficulty-wrapper').hide();
        panel.find('#dice-success-criteria').closest('div').hide();

        // 清空自定义区域
        $customArea.empty();

        // 恢复"属性名"标签
        panel.find('.dice-attr-name-text').text('属性名');

        // 恢复属性值和目标值输入框
        applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), undefined, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });

        applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), undefined, {
          label: '目标值',
          placeholder: '留空=属性值',
        });

        // 更新按钮高亮
        panel.find('.acu-dice-quick-preset-btn').removeClass('active');
        panel.find('.acu-dice-quick-preset-btn[data-id="__custom__"]').addClass('active');

        panel.find('#dice-normal-presets').show();
        panel.find('#dice-workflow-return-container').hide();

        updateRuleMode();
        renderPresetQuickActions(null);
        return;
      }

      const preset = AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
      if (!preset) {
        console.warn('[DICE] 未找到预设:', presetId);
        // 回退到自定义模式
        applyAdvancedPreset('__custom__');
        return;
      }

      currentAdvancedPreset = preset;
      if (preset.visible !== false) {
        lastVisiblePresetId = preset.id;
      }

      // 更新按钮高亮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      panel.find(`.acu-dice-quick-preset-btn[data-id="${escapeHtml(preset.id)}"]`).addClass('active');

      // 隐藏自定义输入框
      // [新增] 隐藏自定义模式字段区
      panel.find('#acu-dice-custom-mode-fields').hide();

      // 更新骰子表达式
      panel.find('#dice-formula').val(preset.diceExpression);

      // 更新"属性名"标签（如Fate使用"技能/风格"）
      panel.find('.dice-attr-name-text').text(preset.attributeName?.label || '属性名');

      // 隐藏原始 Row 1、Row 2 和 Row 3 (所有字段将整合到 customArea 中)
      restoreRow1();
      restoreRow2();
      restoreModifier();
      $row1.hide();
      $row2.hide();
      $row3.hide();

      // 清空自定义区域
      $customArea.empty();

      // [重构] 收集所有可见字段，统一使用智能布局
      const gridItems: (JQuery | string)[] = [];

      // 0. 名字 (始终显示)
      gridItems.push($nameWrapper);

      // 0.5 属性名 (始终显示)
      gridItems.push($attrNameWrapper);

      // 1. 属性值 (如果未隐藏)
      if (!preset.attribute?.hidden) {
        applyFieldConfig(panel.find('#dice-attr-value'), panel.find('#dice-attr-label'), preset.attribute, {
          label: '属性值',
          placeholder: '留空=50%最大值',
        });
        gridItems.push($attrWrapper);
      }

      // 1.5 技能加值 (如果预设定义了 skillMod 且未隐藏)
      if (preset.skillMod && !preset.skillMod.hidden) {
        applyFieldConfig(panel.find('#dice-skill-mod'), panel.find('#dice-skill-mod-label'), preset.skillMod, {
          label: '技能加值',
          placeholder: '留空=0',
        });
        gridItems.push($skillModWrapper);
      }

      // [新增] 效果输入区域
      const attrName = panel.find('#dice-attr-name').val().trim();
      const effectInputItems = renderEffectInputs(preset, attrName);
      if (effectInputItems.length > 0) {
        gridItems.push(...effectInputItems);
      }

      // 2. 目标值/DC (如果未隐藏)
      if (!preset.dc?.hidden) {
        applyFieldConfig(panel.find('#dice-target'), panel.find('#dice-target-label'), preset.dc, {
          label: '目标值',
          placeholder: '留空=属性值',
        });
        gridItems.push($targetWrapper);
      }

      // 3. 修正值 (如果未隐藏)
      if (!preset.mod?.hidden) {
        if (preset.mod?.label) {
          panel.find('#dice-mod-label').text(preset.mod.label);
        }
        // 使用 placeholder 显示默认值
        const modDefault = preset.mod?.defaultValue;
        if (modDefault !== undefined && modDefault !== 0) {
          panel.find('#dice-modifier').attr('placeholder', `留空=${modDefault}`);
        } else {
          panel.find('#dice-modifier').attr('placeholder', '留空=0');
        }
        gridItems.push($modWrapper);
      }

      // 4. 收集自定义字段
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const visibleFields = preset.customFields.filter(f => !f.hidden);

        visibleFields.forEach(field => {
          let html = '<div>';

          // 标签
          if (field.type !== 'toggle') {
            html += `<div class="acu-dice-form-label">${escapeHtml(field.label || field.id)}</div>`;
          } else {
            html += '<div class="acu-dice-form-label">&nbsp;</div>'; // 占位
          }

          // 控件
          if (field.type === 'select' && field.options) {
            html += `<select class="acu-dice-select acu-dice-custom-field" data-id="${escapeHtml(field.id)}">`;
            field.options.forEach(opt => {
              const isSelected = opt.value === field.defaultValue ? 'selected' : '';
              html += `<option value="${escapeHtml(String(opt.value))}" ${isSelected}>${escapeHtml(opt.label)}</option>`;
            });
            html += '</select>';
          } else if (field.type === 'toggle') {
            const isChecked = field.defaultValue ? 'checked' : '';
            html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
              <input type="checkbox" class="acu-dice-custom-field" data-id="${escapeHtml(field.id)}" ${isChecked} style="margin-right: 8px;">
              ${escapeHtml(field.label || field.id)}
            </label>`;
          } else {
            const type = field.type === 'number' ? 'number' : 'text';
            // [修复] 使用 placeholder 而不是 value 显示默认值
            const defaultVal = field.defaultValue;
            const placeholderText =
              field.placeholder || (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
            html += `<input type="${type}" class="acu-dice-input acu-dice-custom-field" data-id="${escapeHtml(field.id)}"
              placeholder="${escapeHtml(placeholderText)}">`;
          }

          html += '</div>';
          gridItems.push(html);
        });
      }

      // 5. 智能排版渲染网格
      // 布局规律：最后一行优先放3个字段，前面的行放2个字段
      // - 4个字段：2+2
      // - 5个字段：2+3
      // - 6个字段：3+3
      // - 7个字段：2+2+3
      // - 8个字段：2+3+3
      // - 9个字段：3+3+3
      const appendItem = ($row: JQuery, item: JQuery | string) => {
        if (typeof item === 'string') {
          $row.append(item);
        } else {
          item.detach().appendTo($row);
          item.show();
        }
      };

      // 计算行分配：从后往前，优先用3列填充
      const computeRowLayout = (total: number): number[] => {
        if (total <= 0) return [];
        if (total <= 2) return [2]; // 最少2列，避免 cols-1
        if (total === 3) return [3];
        if (total === 4) return [2, 2];
        if (total === 5) return [2, 3];
        if (total === 6) return [3, 3];
        // 7+ 字段：递归计算，最后一行放3个，剩余的递归处理
        return [...computeRowLayout(total - 3), 3];
      };

      // 直接计算 gridItems 的行分配
      const gridRowLayout = computeRowLayout(gridItems.length);

      let itemIndex = 0;
      for (const colCount of gridRowLayout) {
        const $row = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
        for (let j = 0; j < colCount; j++) {
          if (itemIndex < gridItems.length) {
            appendItem($row, gridItems[itemIndex]);
            itemIndex++;
          } else {
            $row.append('<div></div>');
          }
        }
        $customArea.append($row);
      }

      // [新增] 为动态生成的 customFields 输入框添加清除按钮
      addClearButton($customArea, '.acu-dice-custom-field[type="text"], .acu-dice-custom-field[type="number"]');

      renderPresetQuickActions(preset);

      // [核心修复] 检测是否为“工作流模式”并切换 UI 状态
      // 这里的判定逻辑：如果预设是“非默认可见”的（visible: false），则视为特殊工作流（如技能成长）
      // 此时隐藏常规预设切换按钮，显示“返回常规检定”按钮
      const isWorkMode = preset.visible === false;
      const $normalPresets = panel.find('#dice-normal-presets');
      const $workflowReturn = panel.find('#dice-workflow-return-container');

      if (isWorkMode) {
        $normalPresets.hide();
        $workflowReturn.show();
        $workflowReturn
          .find('button')
          .html(`<i class="fa-solid fa-arrow-left"></i> 返回常规检定（退出${escapeHtml(preset.name)}）`);
      } else {
        $normalPresets.show();
        $workflowReturn.hide();
      }

      console.log('[DICE] 应用高级预设:', preset.name, isWorkMode ? '(工作流模式)' : '');
    };

    // [新增] 动态监听属性名变化，更新效果输入区域
    panel.find('#dice-attr-name').on('change', function () {
      if (!currentAdvancedPreset) return;
      // 重新渲染整个面板内容可能太重，这里只更新效果区域
      // 但由于效果区域是作为 gridItems 动态插入的，直接重新调用 applyAdvancedPreset 最简单
      // 必须防止死循环
      if (panel.data('updating-preset')) return;
      panel.data('updating-preset', true);
      applyAdvancedPreset(currentAdvancedPreset.id);
      panel.data('updating-preset', false);
    });

    // 自定义模式下持久化骰子语法（仅自定义模式使用）
    panel.find('#custom-dice-expr').on('input change', function () {
      if (!panel.find('#acu-dice-custom-mode-fields').is(':visible')) return;
      const customExpr = ($(this).val() || '').toString().trim();
      saveDiceConfig({ customDiceExpr: customExpr });
    });

    // 绑定快捷预设按钮点击事件：预设管理器会动态刷新按钮，必须用委托绑定新按钮
    panel.on('click', '#dice-normal-presets .acu-dice-quick-preset-btn', function () {
      const presetId = $(this).data('id') as string;

      // 保存到 last preset
      if (presetId === '__custom__') {
        AdvancedDicePresetManager.setActivePreset(null);
        localStorage.setItem(STORAGE_KEY_LAST_PRESET, '__custom__');
      } else {
        AdvancedDicePresetManager.setActivePreset(presetId);
        localStorage.setItem(STORAGE_KEY_LAST_PRESET, presetId);
      }

      applyAdvancedPreset(presetId);
    });

    // [新增] 绑定“返回常规检定”按钮点击事件
    panel.on('click', '#dice-return-normal-btn', function (e) {
      e.preventDefault();
      // 返回到最近一次可见预设；若无则回退到第一个可见预设
      let targetPresetId: string | null = lastVisiblePresetId;

      // 验证 targetPresetId 是否有效且可见
      const allPresets = AdvancedDicePresetManager.getAllPresets();
      const targetPreset = allPresets.find(p => p.id === targetPresetId);
      if (!targetPreset || targetPreset.visible === false) {
        // 如果上次预设无效或不可见，则回退到第一个可见预设
        const firstVisible = allPresets.find(p => p.visible !== false);
        targetPresetId = firstVisible ? firstVisible.id : '__custom__';
      }

      // 执行切换
      if (targetPresetId === '__custom__') {
        AdvancedDicePresetManager.setActivePreset(null);
      } else {
        AdvancedDicePresetManager.setActivePreset(targetPresetId);
      }
      // 更新 localStorage
      localStorage.setItem(STORAGE_KEY_LAST_PRESET, targetPresetId || '__custom__');

      applyAdvancedPreset(targetPresetId);
    });

    panel.on('click', '.acu-dice-preset-action-btn', async function (e) {
      e.preventDefault();
      e.stopPropagation();
      const actionId = String($(this).data('action-id') || '').trim();
      if (!actionId) return;
      const $btn = $(this);
      if ($btn.prop('disabled')) return;
      $btn.prop('disabled', true).addClass('disabled');
      try {
        await executePresetQuickAction(actionId);
      } finally {
        $btn.prop('disabled', false).removeClass('disabled');
        renderPresetQuickActions(currentAdvancedPreset);
      }
    });

    panel.find('#dice-attr-value, #dice-modifier, #dice-target').on('input change', function () {
      renderPresetQuickActions(currentAdvancedPreset);
    });

    // 初始化时应用已保存的预设
    const savedPresetId = localStorage.getItem(STORAGE_KEY_LAST_PRESET);
    // 兼容旧逻辑：如果 ActivePresetManager 里有值，优先使用
    const activePreset = AdvancedDicePresetManager.getActivePreset();

    if (activePreset) {
      applyAdvancedPreset(activePreset.id);
    } else if (savedPresetId && savedPresetId !== '__custom__') {
      applyAdvancedPreset(savedPresetId);
    } else {
      applyAdvancedPreset('__custom__');
    }

    // 掷骰逻辑 - 使用 rollComplexDiceExpression 支持复合表达式
    const rollDice = formula => {
      const rollResult = rollComplexDiceExpression(formula);
      const total = rollResult.total;
      if (Number.isNaN(total)) {
        return { total: 0, rolls: [], formula };
      }
      // 尝试从公式中提取基本信息用于显示
      const basicMatch = formula.match(/^(\d*)d(\d+|F)/i);
      const count = basicMatch && basicMatch[1] ? parseInt(basicMatch[1], 10) : 1;
      const sidesStr = basicMatch ? basicMatch[2] : '100';
      const sides = sidesStr.toUpperCase() === 'F' ? 3 : parseInt(sidesStr, 10);
      // 对于复杂语法，不提供单独的 rolls 数组
      return { total, rolls: [], sides, count, modifier: 0, formula };
    };

    // 解析修正值，支持纯数字和骰子表达式（如1d6, 1d6+2等）
    const parseModifier = function (modStr) {
      if (!modStr || modStr.trim() === '') return 0;
      const trimmed = modStr.trim();

      // 尝试直接解析为数字
      const numValue = parseFloat(trimmed);
      if (!isNaN(numValue) && isFinite(numValue) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
        return numValue;
      }

      // 复合表达式统一走完整解析
      const rollResult = rollComplexDiceExpression(trimmed);
      if (!Number.isNaN(rollResult.total)) return rollResult.total;
      return 0;
    };

    const resolveExpressionWithContext = (expr: string, context: Record<string, string | number | boolean>): string => {
      let resolved = String(expr || '0');
      Object.entries(context).forEach(([key, value]) => {
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        resolved = resolved.replace(new RegExp(safeKey, 'g'), String(value));
      });
      return resolved;
    };

    const activatePresetQuickAction = (action: WorkflowQuickAction): void => {
      const presetId = String(action.config.presetId || '').trim();
      if (!presetId) {
        if (window.toastr) window.toastr.warning('快捷操作缺少目标预设');
        return;
      }
      const targetPreset = AdvancedDicePresetManager.getAllPresets().find(item => item.id === presetId);
      if (!targetPreset) {
        if (window.toastr) window.toastr.warning(`未找到预设: ${presetId}`);
        return;
      }

      const carryInitiator = action.config.carryInitiator !== false;
      const carryAttrName = action.config.carryAttrName !== false;
      const carryAttrValue = action.config.carryAttrValue !== false;
      const carryTarget = action.config.carryTarget === true;
      const carryModifier = action.config.carryModifier === true;
      const carrySkillMod = action.config.carrySkillMod === true;

      const previousState = {
        initiatorName: String(panel.find('#dice-initiator-name').val() || '').trim(),
        attrName: String(panel.find('#dice-attr-name').val() || '').trim(),
        attrValue: String(panel.find('#dice-attr-value').val() || '').trim(),
        target: String(panel.find('#dice-target').val() || '').trim(),
        modifier: String(panel.find('#dice-modifier').val() || '').trim(),
        skillMod: String(panel.find('#dice-skill-mod').val() || '').trim(),
      };

      AdvancedDicePresetManager.setActivePreset(presetId);
      localStorage.setItem(STORAGE_KEY_LAST_PRESET, presetId);
      applyAdvancedPreset(presetId);

      if (carryInitiator) {
        panel.find('#dice-initiator-name').val(previousState.initiatorName);
      }
      if (carryAttrName) {
        panel.find('#dice-attr-name').val(previousState.attrName);
      } else if (action.config.attrName !== undefined) {
        panel.find('#dice-attr-name').val(action.config.attrName);
      }
      if (carryAttrValue) {
        panel.find('#dice-attr-value').val(previousState.attrValue);
      }
      if (carryTarget) {
        panel.find('#dice-target').val(previousState.target);
      }
      if (carryModifier) {
        panel.find('#dice-modifier').val(previousState.modifier);
      }
      if (carrySkillMod) {
        panel.find('#dice-skill-mod').val(previousState.skillMod);
      }

      if (action.config.customFieldValues) {
        Object.entries(action.config.customFieldValues).forEach(([fieldId, rawValue]) => {
          const $field = panel
            .find('.acu-dice-custom-field')
            .filter((_index, element) => String($(element).data('id') || '') === fieldId);
          if (!$field.length) return;
          if ($field.is(':checkbox')) {
            $field.prop('checked', Boolean(rawValue));
            return;
          }
          $field.val(String(rawValue));
        });
      }

      panel.find('#dice-attr-name').trigger('change');
      panel.find('#dice-attr-value, #dice-target, #dice-modifier, #dice-skill-mod').trigger('change');
    };

    const executeAttrShortcutQuickAction = (action: AttrShortcutQuickAction): void => {
      const presetId = String(action.config.presetId || '').trim();
      if (!presetId) {
        if (window.toastr) window.toastr.warning('属性快捷缺少目标预设');
        return;
      }

      const allPresets = AdvancedDicePresetManager.getAllPresets();
      const configuredTargetPreset = allPresets.find(item => item.id === presetId);
      if (!configuredTargetPreset) {
        if (window.toastr) window.toastr.warning(`属性快捷目标预设不存在: ${presetId}`);
        return;
      }

      // 架构约束：属性快捷只能指向“常规可见预设”，若指向工作流预设则直接中止
      if (configuredTargetPreset.visible === false) {
        if (window.toastr) {
          window.toastr.warning(`属性快捷目标预设不可用（工作流）: ${configuredTargetPreset.name}，已中止执行`);
        }
        return;
      }

      const presetAllowedTargets = Array.isArray(configuredTargetPreset.effectsConfig?.allowedTargets)
        ? configuredTargetPreset.effectsConfig?.allowedTargets
        : [];
      const mergedCandidates = Array.from(
        new Set(
          [...(action.config.attrAliasCandidates || []), ...presetAllowedTargets]
            .map(name => String(name || '').trim())
            .filter(Boolean),
        ),
      );

      const workflowAction: WorkflowQuickAction = {
        id: action.id,
        kind: 'workflow_shortcut',
        icon: action.icon,
        tooltip: action.tooltip,
        condition: action.condition,
        config: {
          presetId,
          carryInitiator: action.config.carryInitiator,
          carryAttrName: false,
          carryAttrValue: action.config.carryAttrValue,
          carryTarget: action.config.carryTarget,
          carryModifier: action.config.carryModifier,
          carrySkillMod: action.config.carrySkillMod,
        },
      };
      activatePresetQuickAction(workflowAction);

      const charName = String(panel.find('#dice-initiator-name').val() || '').trim() || '<user>';
      const candidates = mergedCandidates;
      const fallbackName = String(action.config.fallbackAttrName || '').trim() || candidates[0] || '';
      if (!fallbackName) return;

      const resolved = resolveAttributeAliasName(charName, fallbackName, candidates);
      const resolvedAttrName = resolved.name || fallbackName;
      panel.find('#dice-attr-name').val(resolvedAttrName).trigger('change');
    };

    const executePresetQuickAction = async (actionId: string): Promise<void> => {
      const preset = currentAdvancedPreset;
      if (!preset) {
        if (window.toastr) window.toastr.warning('请先选择一个检定预设');
        return;
      }
      const action = getPresetQuickActions(preset).find(item => item.id === actionId);
      if (!action) {
        if (window.toastr) window.toastr.warning('未找到快捷操作配置');
        return;
      }
      if (action.kind === 'workflow_shortcut') {
        activatePresetQuickAction(action);
        return;
      }
      if (action.kind === 'attr_shortcut') {
        executeAttrShortcutQuickAction(action);
        return;
      }
      if (window.toastr) window.toastr.warning('暂不支持的快捷操作类型');
    };

    // [新增] 资源消耗器按钮渲染辅助函数
    const renderResourceBurnerButtons = (
      preset: AdvancedDicePreset,
      context: Record<string, number>,
      matchedOutcome?: OutcomeLevel,
      attrName?: string,
    ): string => {
      if (!preset.resourceBurners || !Array.isArray(preset.resourceBurners) || preset.resourceBurners.length === 0) {
        return '';
      }

      let html = '';
      preset.resourceBurners.forEach(burner => {
        // 1. 首先检查 selector 过滤（结构性范围控制）
        if (attrName && burner.selector) {
          const selectorMatch = matchesCheckSelector(attrName, burner.selector);
          if (!selectorMatch) {
            return; // 属性名被 selector 排除
          }
        }

        // 2. 然后检查 condition（动态状态控制）
        if (burner.condition) {
          const evalResult = evaluateCondition(burner.condition, context);
          if (
            !evalResult.success ||
            (typeof evalResult.value === 'number' ? evalResult.value === 0 : !evalResult.value)
          ) {
            return;
          }
        }
        const icon = burner.ui?.icon || 'fa-fire';
        const tooltip = burner.ui?.tooltip || `消耗 ${burner.resourceName}`;

        html += `<button type="button" class="acu-dice-burner-btn" data-id="${escapeHtml(burner.id)}" title="${escapeHtml(tooltip)}">
          <i class="fa-solid ${escapeHtml(icon)}"></i>
        </button>`;
      });

      return html ? `<div class="acu-dice-burners">${html}</div>` : '';
    };

    // [新增] 资源消耗器点击处理函数
    const handleResourceBurnerClick = (burner: ResourceBurner, context: Record<string, number>) => {
      // 获取角色名：保留原始值用于数据操作，解析后的值用于显示
      const rawInitiatorName = panel.find('#dice-initiator-name').val().trim() || '<user>';
      const displayName = replaceUserPlaceholders(rawInitiatorName);

      // 获取当前资源值（使用原始值，让 getAttributeValue 内部判断是否是主角）
      let currentResource = getAttributeValue(rawInitiatorName, burner.resourceName);

      // 如果资源不存在，尝试初始化（仅限幸运值）
      if (currentResource === undefined || currentResource === null) {
        if (burner.resourceName === '幸运' || burner.resourceName.toLowerCase() === 'luck') {
          // CoC7 幸运值初始化：3D6 × 5
          const d1 = Math.floor(Math.random() * 6) + 1;
          const d2 = Math.floor(Math.random() * 6) + 1;
          const d3 = Math.floor(Math.random() * 6) + 1;
          const initialLuck = (d1 + d2 + d3) * 5;

          if (window.toastr) {
            window.toastr.info(`幸运值未设置，已随机生成: ${d1}+${d2}+${d3}=${d1 + d2 + d3} × 5 = ${initialLuck}`);
          }

          // 尝试写入初始值（使用原始值，让函数内部判断是否是主角）
          updateSingleAttribute(rawInitiatorName, burner.resourceName, 'set', initialLuck, {
            initValue: initialLuck,
          }).then(result => {
            if (result.success) {
              // 递归调用自己，现在资源已存在
              handleResourceBurnerClick(burner, context);
            } else {
              if (window.toastr)
                showActionableErrorToast(`初始化幸运值失败: ${result.error}`, {
                  suggestion: '请确认角色表存在可写的幸运值/资源属性；如果表格结构正确仍失败，请查看控制台中的属性写入日志。',
                });
            }
          });
          return;
        } else {
          if (window.toastr)
            showActionableErrorToast(`找不到属性「${burner.resourceName}」，无法执行资源消耗。`, {
              suggestion: '请确认属性预设或角色表中存在这个资源属性；如果这是新资源，请先在属性表里创建或启用初始化。',
            });
          return;
        }
      }

      currentResource = currentResource || 0;

      // 创建自定义对话框（传递原始名字用于数据操作）
      showBurnerInputDialog(burner, rawInitiatorName, currentResource, context);
    };

    // [新增] 显示燃运输入对话框
    const showBurnerInputDialog = (
      burner: ResourceBurner,
      rawCharName: string, // 原始角色名（如 <user>），用于数据操作
      currentResource: number,
      context: Record<string, number>,
    ) => {
      const currentThemeClass = `acu-theme-${config.theme}`;

      // 移除已存在的对话框
      $('.acu-burner-overlay').remove();

      // 计算建议消耗量（如果预设定义了 suggestedAmount 表达式）
      let suggestedValue = 1; // 默认为1
      let suggestedHint = '';
      if (burner.suggestedAmount) {
        const evalResult = evaluateCondition(burner.suggestedAmount, context);
        if (evalResult.success && typeof evalResult.value === 'number' && evalResult.value > 0) {
          // 向上取整（需要至少这么多资源才刚好通过），再除以ratio
          const rawNeeded = Math.ceil(evalResult.value / burner.ratio);
          if (burner.resourceOperation === 'add') {
            suggestedValue = Math.max(1, rawNeeded);
            suggestedHint = `建议: ${suggestedValue} (刚好通过)`;
          } else {
            const capped = Math.min(Math.max(1, rawNeeded), currentResource);
            suggestedValue = capped;
            if (rawNeeded > currentResource) {
              suggestedHint = `建议: ${suggestedValue} (已达上限，仍无法通过)`;
            } else {
              suggestedHint = `建议: ${suggestedValue} (刚好通过)`;
            }
          }
        }
      }

      const isAddMode = burner.resourceOperation === 'add';
      const actionVerb = isAddMode ? '增加' : '消耗';
      const maxAttr = isAddMode ? '' : `max="${currentResource}"`;

      // 从 context 提取骰子结果和目标值，用于效果预览
      const rollTotal = (context['$roll.total'] ?? context['$roll'] ?? 0) as number;
      const attrValue = (context['$attr'] ?? 0) as number;

      const dialog = $(`
        <div class="acu-edit-overlay acu-burner-overlay">
          <div class="acu-edit-dialog ${currentThemeClass}" style="max-width:350px;">
            <div class="acu-edit-title">
              <i class="fa-solid ${escapeHtml(burner.ui?.icon || 'fa-fire')}" style="color:${escapeHtml(burner.ui?.color || 'var(--acu-accent)')}"></i>
              ${escapeHtml(actionVerb)} ${escapeHtml(burner.resourceName)}
            </div>
            <div class="acu-settings-content" style="padding:15px;">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
                <div style="flex:1;">
                  <label style="display:block;font-size:11px;color:var(--acu-text-sub);margin-bottom:4px;">${escapeHtml(actionVerb)}数量</label>
                  <input type="number" id="burner-amount" class="acu-input" value="${suggestedValue}" min="1" ${maxAttr} style="width:100%;">
                  ${suggestedHint ? `<div style="font-size:10px;color:var(--acu-accent);margin-top:2px;">${escapeHtml(suggestedHint)}</div>` : ''}
                </div>
                <div style="flex:1;">
                  <label style="display:block;font-size:11px;color:var(--acu-text-sub);margin-bottom:4px;">当前${isAddMode ? '数值' : '可用'}</label>
                  <div style="font-size:18px;font-weight:bold;color:var(--acu-success-text);">${currentResource}</div>
                </div>
              </div>
              <div id="burner-preview" style="padding:10px;background:var(--acu-card-bg);border-radius:6px;font-size:12px;">
                <div id="burner-before" style="color:var(--acu-text-sub);margin-bottom:6px;"></div>
                <div id="burner-after" style="font-weight:bold;"></div>
              </div>
            </div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn" id="burner-cancel"><i class="fa-solid fa-times"></i> 取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" id="burner-confirm"><i class="fa-solid fa-check"></i> 确认${escapeHtml(actionVerb)}</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(dialog);

      // 更新效果预览：显示燃运前后的骰子结果对比
      const updatePreview = () => {
        const amount = parseInt(dialog.find('#burner-amount').val() as string, 10) || 0;
        const effectValue = amount * burner.ratio;
        // 计算燃运后的目标值变化
        let newRoll = rollTotal;
        let newAttr = attrValue;
        if (burner.target === 'roll') {
          newRoll = burner.direction === 'decrease' ? rollTotal - effectValue : rollTotal + effectValue;
        } else if (burner.target === 'attribute') {
          newAttr = burner.direction === 'increase' ? attrValue + effectValue : attrValue - effectValue;
        }
        const beforePass = rollTotal <= attrValue;
        const afterPass = newRoll <= newAttr;
        const beforeColor = beforePass ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
        const afterColor = afterPass ? 'var(--acu-success-text)' : 'var(--acu-error-text)';
        dialog
          .find('#burner-before')
          .html(
            `当前: <span style="color:${beforeColor};font-weight:bold;">${rollTotal} &lt;= ${attrValue} → ${beforePass ? '成功' : '失败'}</span>`,
          );
        dialog
          .find('#burner-after')
          .html(
            `燃运后: <span style="color:${afterColor}">${newRoll} &lt;= ${newAttr} → ${afterPass ? '成功' : '失败'}</span>` +
              `<span style="color:var(--acu-text-sub);font-weight:normal;margin-left:8px;">(${actionVerb} ${amount} 点${burner.resourceName})</span>`,
          );
      };
      updatePreview();

      dialog.find('#burner-amount').on('input', updatePreview);

      // 取消按钮
      dialog.on('click', '#burner-cancel', () => {
        dialog.remove();
      });

      // 点击遮罩关闭
      dialog.on('click', '.acu-burner-overlay', e => {
        if ($(e.target).hasClass('acu-burner-overlay')) {
          dialog.remove();
        }
      });

      // 确认按钮
      dialog.on('click', '#burner-confirm', () => {
        const amount = parseInt(dialog.find('#burner-amount').val() as string, 10);

        if (isNaN(amount) || amount <= 0) {
          if (window.toastr) window.toastr.warning('请输入有效的正整数');
          return;
        }

        // subtract 模式检查资源上限，add 模式不限
        if (!isAddMode && amount > currentResource) {
          if (window.toastr)
            showActionableErrorToast(`资源不足: 需要 ${amount}，当前只有 ${currentResource}。`, {
              suggestion: 'resource',
            });
          return;
        }

        dialog.remove();

        const op: 'add' | 'subtract' = isAddMode ? 'add' : 'subtract';
        // 执行资源变更（使用原始角色名，让函数内部判断是否是主角）
        updateSingleAttribute(rawCharName, burner.resourceName, op, amount).then(result => {
          if (!result.success) {
            if (window.toastr)
              showActionableErrorToast(`${actionVerb}资源失败: ${result.error}`, {
                suggestion: '请确认角色表中的资源属性可写，并刷新属性数据后重试；如果仍失败，请查看控制台中的属性写入日志。',
              });
            return;
          }

          if (window.toastr) window.toastr.success(`已${actionVerb} ${amount} 点 ${burner.resourceName}`);

          // 刷新属性显示（使用原始角色名）
          buildAttrButtons(rawCharName);

          // 应用效果并重新计算结果
          applyBurnerEffect(burner, amount);
        });
      });

      // 聚焦输入框
      dialog.find('#burner-amount').trigger('focus').trigger('select');
    };

    // [新增] 显示效果确认对话框
    const showEffectConfirmDialog = (options: {
      preset: AdvancedDicePreset;
      outcomeLabel: string;
      branchReasonText?: string;
      effects: ComputedEffect[];
      onConfirm: () => void;
      onCancel: () => void;
    }) => {
      const { preset, outcomeLabel, branchReasonText, effects, onConfirm, onCancel } = options;
      const currentThemeClass = `acu-theme-${config.theme}`;
      const uiCfg = preset.effectConfirmUi || {};
      const dialogTitle = uiCfg.title || '确认效果执行';
      const effectListTitle = uiCfg.effectListTitle || '即将应用以下效果:';
      const branchReasonLabel = uiCfg.branchReasonLabel || '分支依据';

      // 移除已存在的对话框
      $('.acu-confirm-overlay').remove();

      const dialog = $(`
        <div class="acu-edit-overlay acu-confirm-overlay">
          <div class="acu-edit-dialog ${currentThemeClass}" style="max-width:350px;">
            <div class="acu-edit-title">
              <i class="fa-solid fa-clipboard-check" style="color:var(--acu-accent)"></i>
              ${escapeHtml(dialogTitle)}
            </div>
            <div class="acu-settings-content" style="padding:15px;">
              <div style="margin-bottom:12px;font-weight:bold;font-size:14px;text-align:center;color:var(--acu-text-main);">
                ${escapeHtml(outcomeLabel)}
              </div>
              ${
                branchReasonText
                  ? `<div style="margin-bottom:12px;padding:8px 10px;background:var(--acu-card-bg);border-radius:6px;font-size:12px;line-height:1.45;color:var(--acu-text-sub);"><span style="color:var(--acu-text-main);font-weight:bold;">${escapeHtml(branchReasonLabel)}:</span> ${escapeHtml(branchReasonText)}</div>`
                  : ''
              }

              <div style="background:var(--acu-card-bg);border-radius:6px;padding:10px;margin-bottom:15px;max-height:200px;overflow-y:auto;">
                <div style="font-size:12px;color:var(--acu-text-sub);margin-bottom:8px;">${escapeHtml(effectListTitle)}</div>
                ${effects
                  .map(
                    e => `
                  <div style="padding:8px 0;border-bottom:1px solid var(--acu-border);font-size:13px;display:grid;grid-template-columns:1fr auto;gap:6px 10px;align-items:start;">
                    <div style="font-weight:bold;color:var(--acu-text-main);min-width:0;">${escapeHtml(e.resolvedTarget || e.target)}</div>
                    <div style="color:${e.computedValue >= 0 ? 'var(--acu-success-text)' : 'var(--acu-error-text)'};font-weight:bold;text-align:right;white-space:nowrap;">
                      ${e.computedValue > 0 ? '+' : ''}${e.computedValue}
                    </div>
                    <div style="grid-column:1 / -1;font-size:11px;color:var(--acu-text-sub);line-height:1.45;">
                      算式: ${escapeHtml(e.formula)} ｜ 掷值: ${escapeHtml(String(e.rolledValue))}<br>
                      数值: ${e.beforeValue === null || e.beforeValue === undefined ? '未知' : escapeHtml(String(e.beforeValue))}
                      →
                      ${e.afterValue === null || e.afterValue === undefined ? '未知' : escapeHtml(String(e.afterValue))}
                      ${e.conditionSummary ? `<br>条件: ${escapeHtml(e.conditionSummary)}` : ''}
                    </div>
                  </div>
                `,
                  )
                  .join('')}
              </div>
            </div>
            <div class="acu-dialog-btns">
              <button class="acu-dialog-btn" id="confirm-cancel"><i class="fa-solid fa-times"></i> 取消</button>
              <button class="acu-dialog-btn acu-btn-confirm" id="confirm-ok"><i class="fa-solid fa-check"></i> 确认执行</button>
            </div>
          </div>
        </div>
      `);

      $('body').append(dialog);

      // 取消按钮
      dialog.on('click', '#confirm-cancel', () => {
        dialog.remove();
        onCancel();
      });

      // 点击遮罩关闭 (视为取消)
      dialog.on('click', '.acu-confirm-overlay', e => {
        if ($(e.target).hasClass('acu-confirm-overlay')) {
          dialog.remove();
          onCancel();
        }
      });

      // 确认按钮
      dialog.on('click', '#confirm-ok', () => {
        dialog.remove();
        onConfirm();
      });

      // 自动聚焦确认按钮,方便键盘操作
      dialog.find('#confirm-ok').focus();
    };

    /**
     * [新增] 从效果输入框读取并计算效果值
     * @param outcomeName 结果等级名称 (用于匹配输入框)
     * @param defaultFormula 默认公式
     * @returns ComputedEffect 数组
     */
    const resolveEffectConditionPreview = (
      effect: Effect,
      effectContext: PendingEffectContext['context'],
      outcomeName: string,
    ): Pick<ComputedEffect, 'conditionExpr' | 'resolvedConditionExpr' | 'conditionPassed' | 'conditionSummary'> => {
      if (!effect.condition || effect.condition.trim() === '') {
        return {
          conditionExpr: '',
          resolvedConditionExpr: '',
          conditionPassed: true,
          conditionSummary: `命中【${outcomeName}】分支后直接生效`,
        };
      }

      const rawExpr = effect.condition.trim();
      const condContext: Record<string, number> = {
        $roll: effectContext.roll,
        '$roll.total': effectContext.roll,
        $attr: effectContext.attributeValue,
        $mod: effectContext.modifier,
        $dc: effectContext.dc,
      };
      const condResult = evaluateCondition(rawExpr, condContext);
      const passed =
        condResult.success &&
        (typeof condResult.value === 'number' ? condResult.value !== 0 : Boolean(condResult.value));

      const resolvedExpr = rawExpr
        .replace(/\$roll\.total/g, String(effectContext.roll))
        .replace(/\$roll/g, String(effectContext.roll))
        .replace(/\$attr/g, String(effectContext.attributeValue))
        .replace(/\$mod/g, String(effectContext.modifier))
        .replace(/\$dc/g, String(effectContext.dc));

      const summary = `命中【${outcomeName}】分支，条件 ${resolvedExpr}（原式:${rawExpr}）${passed ? '成立' : '不成立'}`;
      return {
        conditionExpr: rawExpr,
        resolvedConditionExpr: resolvedExpr,
        conditionPassed: passed,
        conditionSummary: summary,
      };
    };

    const computeEffectsFromInputs = (
      outcomeName: string,
      effects: Effect[],
      effectContext: PendingEffectContext['context'],
    ): ComputedEffect[] => {
      const results: ComputedEffect[] = [];

      // 查找对应结果等级的效果输入框
      const $inputGroup = panel.find(`.acu-effect-value-input[data-outcome="${outcomeName}"]`);
      const inputValue = $inputGroup.val()?.toString().trim() || '';

      for (const effect of effects) {
        // 如果用户输入了值,使用用户输入;否则使用效果定义的默认值
        const formula = inputValue || String(effect.value || '0');
        const parsedValue = parseEffectValueInput(formula, `Confirm ${outcomeName}/${effect.id}`);
        let computedValue = parsedValue.finalValue;
        const rolledValue = parsedValue.rolledValue;
        const displayText = parsedValue.valid
          ? `${parsedValue.formulaText} → ${rolledValue}`
          : `${parsedValue.formulaText} → 解析失败(按0处理)`;

        // 根据操作类型调整符号
        if (effect.operation === 'subtract') {
          computedValue = -Math.abs(computedValue);
        }

        const conditionPreview = resolveEffectConditionPreview(effect, effectContext, outcomeName);

        results.push({
          effectId: effect.id,
          target: effect.target,
          computedValue,
          rolledValue,
          formula: parsedValue.formulaText,
          displayText,
          ...conditionPreview,
        });
      }

      return results;
    };

    /**
     * [新增] 处理效果确认流程
     * 检查是否有需要确认的效果,显示弹窗并在确认后执行
     */
    const handleEffectConfirmation = async (pendingCtx: PendingEffectContext): Promise<void> => {
      const { preset, matchedOutcome, context: effectContext } = pendingCtx;
      if (!matchedOutcome.effects || matchedOutcome.effects.length === 0) {
        return;
      }

      if (activeConfirmEffectRun && activeConfirmEffectRun.runId !== pendingCtx.runId) {
        const staleRun = activeConfirmEffectRun;
        setHistoryEffectStateByRun(staleRun, {
          effectStatus: 'cancelled',
          effectError: '确认弹窗被新的检定覆盖，自动取消',
          effectTrace: ['已取消：被新操作覆盖'],
        });
        const seq = emitEffectRun({
          runId: staleRun.runId,
          status: 'cancelled',
          characterName: staleRun.context.characterName,
          attributeName: staleRun.context.attributeName,
          historyIndex: staleRun.historyIndex,
          effectResults: [],
          effectTrace: ['已取消：被新操作覆盖'],
          chainMode: getSecondaryTriggerMode(staleRun.preset),
          error: '确认弹窗被新的检定覆盖，自动取消',
          timestamp: Date.now(),
        });
        setHistoryEffectStateByRun(staleRun, { effectEventSeq: seq });
      }
      activeConfirmEffectRun = pendingCtx;

      // 检查是否有需要确认的效果 (默认 needsConfirm=true)
      const needsConfirmEffects = matchedOutcome.effects.filter(e => e.needsConfirm !== false);
      if (needsConfirmEffects.length === 0) {
        // 所有效果都不需要确认,直接暂存等待 MESSAGE_SENT 执行
        return;
      }

      // 计算效果值
      const aliasCandidates = [...(preset.effectsConfig?.allowedTargets || []), effectContext.attributeName].filter(
        (name, idx, arr) => Boolean(name) && arr.indexOf(name) === idx,
      );
      const computedEffects = computeEffectsFromInputs(matchedOutcome.name, needsConfirmEffects, effectContext).map(
        eff => {
          const resolvedTarget = resolveAttributeAliasName(
            effectContext.characterName,
            eff.target,
            aliasCandidates,
          ).name;
          const beforeValue = getAttributeValue(effectContext.characterName, eff.target, aliasCandidates);
          const afterValue = beforeValue === null || beforeValue === undefined ? null : beforeValue + eff.computedValue;
          return {
            ...eff,
            resolvedTarget: resolvedTarget || undefined,
            beforeValue,
            afterValue,
          };
        },
      );
      if (computedEffects.length === 0) {
        return;
      }

      // 显示确认弹窗
      showEffectConfirmDialog({
        preset,
        outcomeLabel: `${effectContext.attributeName} 检定: ${matchedOutcome.name}`,
        branchReasonText: pendingCtx.branchReasonText,
        effects: computedEffects,
        onConfirm: async () => {
          const confirmedRun: PendingEffectContext = {
            ...pendingCtx,
            effectOverrides: computedEffects,
            timestamp: Date.now(),
          };

          enqueueEffectRun(confirmedRun);
          setHistoryEffectStateByRun(pendingCtx, {
            effectStatus: 'confirmed',
          });
          const seq = emitEffectRun({
            runId: pendingCtx.runId,
            status: 'confirmed',
            characterName: effectContext.characterName,
            attributeName: effectContext.attributeName,
            historyIndex: pendingCtx.historyIndex,
            effectResults: [],
            effectTrace: ['已确认，等待提交'],
            chainMode: getSecondaryTriggerMode(pendingCtx.preset),
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(pendingCtx, { effectEventSeq: seq });
          if (activeConfirmEffectRun?.runId === pendingCtx.runId) {
            activeConfirmEffectRun = null;
          }
          console.info(`[DICE] Effect run confirmed: ${pendingCtx.runId}`);

          // 确认后立即尝试执行（MESSAGE_SENT 可能已在弹窗显示前触发过，不会再次触发）
          if (confirmedRun.messageId) {
            await processPendingEffectRuns(confirmedRun.messageId);
          } else {
            console.info(`[DICE][META] confirm waiting MESSAGE_SENT for run=${confirmedRun.runId}`);
            await processPendingEffectRuns();
          }
        },
        onCancel: () => {
          setHistoryEffectStateByRun(pendingCtx, { effectStatus: 'cancelled' });
          const seq = emitEffectRun({
            runId: pendingCtx.runId,
            status: 'cancelled',
            characterName: effectContext.characterName,
            attributeName: effectContext.attributeName,
            historyIndex: pendingCtx.historyIndex,
            effectResults: [],
            effectTrace: ['已取消'],
            chainMode: getSecondaryTriggerMode(pendingCtx.preset),
            timestamp: Date.now(),
          });
          setHistoryEffectStateByRun(pendingCtx, { effectEventSeq: seq });
          if (activeConfirmEffectRun?.runId === pendingCtx.runId) {
            activeConfirmEffectRun = null;
          }
          console.info('[DICE] Effect execution cancelled by user');
        },
      });
    };

    /**
     * [新增] 二级效果触发点检测
     * 在效果执行完成后检查是否触发二级效果
     */
    const checkSecondaryEffects = async (
      preset: AdvancedDicePreset,
      effectResults: EffectResult[],
      context: { characterName: string; attributeName: string; attributeValue: number },
    ): Promise<EffectResult[]> => {
      return executeSecondaryEffectsChain(preset, effectResults, context);
    };

    // [新增] 应用消耗效果并更新 UI
    const applyBurnerEffect = (burner: ResourceBurner, amount: number) => {
      const effectValue = amount * burner.ratio;
      const sign = burner.direction === 'increase' ? 1 : -1;
      const totalChange = effectValue * sign;

      // 修改相应的输入框值或预设值
      // 注意: 这会改变下一次投骰的基础值，或者如果是 roll 修正则需要特殊处理
      // 这里我们选择直接修改输入框的值，并触发重新计算
      // 对于 target (roll), 我们无法直接修改已投出的结果，除非重新 evaluateOutcomes
      // 但 evaluateOutcomes 接受的是 outcomes 数组，不直接接受 rollTotal
      // 简单的做法是：修改 modifier 输入框 (对于 mod 修正) 或 target 输入框 (对于 dc 修正)
      // 对于 roll 修正，我们可以添加一个临时的 modifier

      // 为了简单可靠，我们先支持 mod 和 dc 的修改，因为它们对应输入框
      if (burner.target === 'mod') {
        const $modInput = panel.find('#dice-modifier');
        const currentMod = parseModifier($modInput.val().trim());
        const newMod = currentMod + totalChange;
        $modInput.val(newMod >= 0 ? `+${newMod}` : String(newMod));
        // 重新执行高级检定 (会重新投骰吗? 是的，performAdvancedCheck 会重新投骰)
        // 如果不想重新投骰，我们需要拆分 performAdvancedCheck
        // 但目前的架构是整体执行的。
        // 为了"改变结果"而不"重投"，我们需要一种机制来只更新结果判定逻辑
        // 这是一个架构限制。
        // 妥协方案: 消耗资源后，自动触发一次带修正的"重投" (即改变了修正值后的投骰)
        // 这符合"燃运"通常的逻辑：付出代价来获得更有利的结果
        performAdvancedCheck();
      } else if (burner.target === 'dc') {
        const $dcInput = panel.find('#dice-target');
        const currentDc = parseInt($dcInput.val().trim() || '0', 10);
        const newDc = currentDc + totalChange;
        $dcInput.val(newDc);
        performAdvancedCheck();
      } else if (burner.target === 'attribute') {
        // 修改属性值输入框
        const $attrInput = panel.find('#dice-attr-value');
        const currentAttr = parseInt($attrInput.val().trim() || '0', 10);
        const newAttr = currentAttr + totalChange;
        $attrInput.val(newAttr);
        performAdvancedCheck();
      } else if (burner.target === 'roll') {
        // 修改 roll 值通常意味着作为 modifier 加在最终结果上
        // 因为我们不能修改骰子本身的随机结果
        const $modInput = panel.find('#dice-modifier');
        const currentMod = parseModifier($modInput.val().trim());
        const newMod = currentMod + totalChange;
        $modInput.val(newMod >= 0 ? `+${newMod}` : String(newMod));
        performAdvancedCheck();
      }
    };

    // [新增] 高级检定执行函数
    const performAdvancedCheck = async function (options?: { isPushed?: boolean }) {
      if (!currentAdvancedPreset) return;

      const preset = currentAdvancedPreset;
      const initiatorName = resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // [辅助函数] 解析 defaultValue (支持表达式)
      const resolveDefaultValue = function (
        defaultValue: number | string | undefined,
        context: Record<string, number>,
      ): number {
        if (defaultValue === undefined) return 0;
        if (typeof defaultValue === 'number') return defaultValue;
        // 字符串表达式,使用 evaluateFormula 解析
        const result = evaluateFormula(defaultValue, context);
        if (result === 0 && defaultValue !== '0' && String(defaultValue) !== '0') {
          if (window.toastr) {
            window.toastr.warning(`表达式 "${defaultValue}" 求值失败,使用默认值 0`);
          }
        }
        return result || 0;
      };

      // 1. 解析属性值 (用户输入优先,留空用 defaultValue)
      let attrValue = 0;
      const attrInputVal = panel.find('#dice-attr-value').val().trim();
      if (attrInputVal !== '') {
        attrValue = parseInt(attrInputVal, 10) || 0;
      } else if (preset.attribute?.mode === 'fixed' && preset.attribute?.key) {
        // 从表格读取
        attrValue = getAttributeValue(initiatorName, preset.attribute.key) || 0;
      } else {
        attrValue = resolveDefaultValue(preset.attribute?.defaultValue, {});
      }

      // 2. 解析DC：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let dc =
        preset.dc?.mode === 'fixed' && preset.dc?.value !== undefined
          ? preset.dc.value
          : resolveDefaultValue(preset.dc?.defaultValue, { $attr: attrValue });
      if (!preset.dc?.hidden) {
        const dcInputVal = panel.find('#dice-target').val().trim();
        if (dcInputVal !== '') {
          dc = parseInt(dcInputVal, 10) || 0;
        } else if (preset.dc?.mode === 'fixed' && preset.dc?.value !== undefined) {
          dc = preset.dc.value;
        } else {
          dc = resolveDefaultValue(preset.dc?.defaultValue, { $attr: attrValue });
        }
      }

      // 3. 解析修正值：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let mod = resolveDefaultValue(preset.mod?.defaultValue, { $attr: attrValue });
      if (!preset.mod?.hidden) {
        const modStr = panel.find('#dice-modifier').val().trim();
        if (modStr !== '') {
          mod = parseModifier(modStr);
        } else {
          mod = resolveDefaultValue(preset.mod?.defaultValue, { $attr: attrValue });
        }
      }

      // 3.3 解析技能加值：显示字段用户输入优先；隐藏字段仍可用 defaultValue 作为固定常量
      let skillMod = preset.skillMod ? resolveDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue }) : 0;
      if (preset.skillMod && !preset.skillMod.hidden) {
        const skillModStr = panel.find('#dice-skill-mod').val().trim();
        if (skillModStr !== '') {
          skillMod = parseModifier(skillModStr);
        } else {
          skillMod = resolveDefaultValue(preset.skillMod?.defaultValue, { $attr: attrValue });
        }
      }

      // 3.5 计算属性调整值 (DND5e等规则使用)
      let attrMod = 0;
      if ('attribute' in preset && preset.attribute?.computeModifier) {
        attrMod = evaluateConditionNumber(preset.attribute.computeModifier, { $attr: attrValue }, 0);
      }

      // [新增] 收集自定义字段值
      const customValues: Record<string, number | string | boolean> = {};
      if ('customFields' in preset && Array.isArray(preset.customFields) && preset.customFields.length > 0) {
        const $customFields = panel.find('.acu-dice-custom-field');
        $customFields.each(function () {
          const $el = $(this);
          const id = $el.data('id');
          // 找到配置
          const fieldConfig = preset.customFields.find(f => f.id === id);
          if (!fieldConfig) return;

          let val: string | number | boolean;
          if (fieldConfig.type === 'toggle') {
            val = $el.prop('checked');
          } else if (fieldConfig.type === 'number') {
            const num = parseFloat($el.val() as string);
            val = isNaN(num) ? (fieldConfig.defaultValue as number) : num;
          } else if (fieldConfig.type === 'select') {
            // [修复] select 类型的值需要转换为数字（如果是数字字符串）
            const rawVal = $el.val() as string;
            const num = parseFloat(rawVal);
            val = isNaN(num) ? rawVal : num;
          } else {
            const rawVal = String($el.val() ?? '').trim();
            if (rawVal === '' && fieldConfig.defaultValue !== undefined && fieldConfig.defaultValue !== '') {
              val = fieldConfig.defaultValue as string | number | boolean;
            } else {
              val = rawVal;
            }
          }
          customValues['$' + id] = val; // 添加 $ 前缀以便在表达式中使用
        });
      }

      // [新增] 计算派生变量 (投骰前)
      const baseContext = {
        $attr: attrValue,
        $attrMod: attrMod,
        $skillMod: skillMod,
        $dc: dc,
        $mod: mod,
        ...customValues,
      };
      const derivedValues: Record<string, number> = {};
      if ('derivedVars' in preset && Array.isArray(preset.derivedVars) && preset.derivedVars.length > 0) {
        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = evaluateCondition(spec.expr, { ...baseContext, ...derivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 派生变量 ${varName} 计算失败:`, evalResult.error);
            derivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          derivedValues[varName] = numericValue;
        });
      }
      const extraValues = { ...customValues, ...derivedValues };

      let diceExpression = preset.diceExpression;
      if ('dicePatches' in preset && Array.isArray(preset.dicePatches) && preset.dicePatches.length > 0) {
        const patchContext = { ...baseContext, ...derivedValues };
        const replacePatchTemplate = (template: string): string => {
          const varPattern = /\$[a-zA-Z_]\w*/g;
          return template.replace(varPattern, match => {
            const value = patchContext[match];
            return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
          });
        };

        preset.dicePatches.forEach(patch => {
          if (!patch) return;
          if (patch.when) {
            const conditionResult = evaluateCondition(patch.when, patchContext);
            if (!conditionResult.success) {
              console.warn('[DICE] dicePatches 条件评估失败:', conditionResult.error);
              return;
            }
            const shouldApply =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            if (!shouldApply) return;
          }

          const resolvedTemplate = replacePatchTemplate(patch.template ?? '');
          switch (patch.op) {
            case 'append':
              diceExpression = `${diceExpression}${resolvedTemplate}`;
              break;
            case 'prepend':
              diceExpression = `${resolvedTemplate}${diceExpression}`;
              break;
            case 'replace':
              diceExpression = resolvedTemplate;
              break;
          }
        });
      }

      // 4. 投骰
      const rollResult = rollComplexDiceExpression(diceExpression);
      const rollTotal = rollResult.total;
      if (Number.isNaN(rollTotal)) {
        console.warn('[DICE] 高级预设骰子语法错误:', diceExpression);
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpression}`, {
            suggestion: '请检查高级预设中的骰子表达式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      // [新增] 投骰后重新计算派生变量（支持依赖 $roll.total 的派生变量，如 chaos = 6 - $roll.total）
      const postRollDerivedValues: Record<string, number> = {};
      if ('derivedVars' in preset && Array.isArray(preset.derivedVars) && preset.derivedVars.length > 0) {
        const postRollContext = {
          $roll: rollResult,
          '$roll.total': rollTotal, // 显式添加 $roll.total 作为独立变量
          ...baseContext,
          ...customValues,
        };
        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = evaluateCondition(spec.expr, { ...postRollContext, ...postRollDerivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 派生变量 ${varName} (投骰后) 计算失败:`, evalResult.error);
            postRollDerivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          postRollDerivedValues[varName] = numericValue;
        });
      }

      // 5. 判定成功
      const isPushed = options?.isPushed ?? false;
      const context = {
        $roll: rollResult, // 传递整个对象
        '$roll.total': rollTotal, // 显式添加 $roll.total
        $isPushed: isPushed ? 1 : 0, // 孤注一掷标记 (1=是,0=否)
        ...baseContext,
        ...postRollDerivedValues, // 使用投骰后计算的派生变量
      };

      // 判定结果: 使用 outcomes 系统
      let outcomeText: string;
      let resultType: string;
      let isSuccess = false;
      let matchedOutcome: OutcomeLevel | undefined;
      let conditionExpr = '';
      let displayExprResult = true; // displayExpr 的计算结果，用于判断"成立/不成立"
      let displayExprValue: string | number = '';
      let branchReasonText = '';

      if ('outcomes' in preset && Array.isArray(preset.outcomes) && preset.outcomes.length > 0) {
        // 新系统: 使用 evaluateOutcomes
        matchedOutcome = evaluateOutcomes(preset.outcomes, context);
        const policyResult = applyAdvancedPresetOutcomePolicy(preset, matchedOutcome, context);
        matchedOutcome = policyResult.outcome;

        outcomeText = matchedOutcome.name || '判定完成';
        // 使用 displayExpr（如果有）或 condition 作为显示表达式
        // [修复] 当触发 unmet 时，显示用户要求的等级的条件（如"极难成功"的条件）
        // 这样用户能看到"你需要达到这个条件才算成功"
        const displaySourceOutcome = getAdvancedPresetDisplayOutcome(policyResult);
        const displayExpr = displaySourceOutcome.displayExpr ?? displaySourceOutcome.condition;

        // [修改] 替换所有上下文变量 (包括自定义变量)
        conditionExpr = displayExpr;
        // 先替换 $roll.hasTag() 方法调用 (必须在 $roll 之前)
        if (context.$roll && typeof context.$roll === 'object') {
          const roll = context.$roll as RollResult;
          conditionExpr = conditionExpr.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
            return (roll.tags ?? []).includes(tag) ? '成立' : '不成立';
          });
        }
        // 再替换标准变量 (注意: $roll.total 必须在 $roll 之前替换)
        conditionExpr = conditionExpr
          .replace(/\$roll\.total/g, String(rollTotal))
          .replace(/\$roll/g, String(rollTotal))
          .replace(/\$attrMod/g, String(attrMod))
          .replace(/\$skillMod/g, String(skillMod))
          .replace(/\$attr/g, String(attrValue))
          .replace(/\$dc/g, String(dc))
          .replace(/\$mod/g, String(mod));

        // 再替换自定义变量
        Object.keys(extraValues).forEach(key => {
          // 使用正则替换所有出现的变量 (注意转义 $ 符号)
          const safeKey = key.replace('$', '\\$');
          const regex = new RegExp(safeKey, 'g');
          conditionExpr = conditionExpr.replace(regex, String(extraValues[key]));
        });

        // [新增] 清理零值显示：隐藏 "+ 0" 模式，使公式更简洁
        // 例如 "3 + 2 + 13 + 0 >= 10" -> "3 + 2 + 13 >= 10"
        conditionExpr = conditionExpr
          .replace(/\s*\+\s*0(?=\s*[+\->=<]|\s*$)/g, '') // 移除 "+ 0" (后面跟运算符或结尾)
          .replace(/^\s*0\s*\+\s*/g, ''); // 移除开头的 "0 +"

        // 计算 displayExpr 的布尔值（用于判断"成立/不成立"）
        const displayExprEvalResult = evaluateCondition(displayExpr, context);
        const rawDisplayExprValue = displayExprEvalResult.value;
        displayExprValue =
          typeof rawDisplayExprValue === 'number' && Number.isFinite(rawDisplayExprValue)
            ? rawDisplayExprValue
            : conditionExpr;
        displayExprResult =
          displayExprEvalResult.success &&
          (typeof displayExprEvalResult.value === 'number'
            ? displayExprEvalResult.value !== 0
            : Boolean(displayExprEvalResult.value));
        branchReasonText = `命中【${matchedOutcome.name}】分支，分支判定式 ${conditionExpr || displayExpr}，结果${displayExprResult ? '成立' : '不成立'}`;
        // 根据 priority 推断 resultType 和 isSuccess (用于 CSS 类名兼容)
        if (matchedOutcome.priority <= 10) {
          resultType = 'critSuccess';
          isSuccess = true;
        } else if (matchedOutcome.priority <= 30) {
          resultType = 'extremeSuccess';
          isSuccess = true;
        } else if (matchedOutcome.priority < 50) {
          resultType = 'success';
          isSuccess = true;
        } else if (matchedOutcome.priority === 50) {
          resultType = 'warning';
          isSuccess = false;
        } else if (matchedOutcome.priority < 90) {
          resultType = 'failure';
          isSuccess = false;
        } else {
          resultType = 'critFailure';
          isSuccess = false;
        }
      } else {
        // 兜底: 无法判定
        outcomeText = '未知';
        resultType = 'warning';
        branchReasonText = '未命中可识别分支，按默认路径处理';
        console.warn('[DICE] 预设缺少 outcomes');
      }

      // 5. 格式化输出
      const finalValue = rollTotal + attrValue + skillMod + mod;

      // 生成徽章样式 (优先使用 outcome.style.color,否则使用 CSS 类名)
      const badgeClass = getResultBadgeClass(resultType);
      const diceCfg = getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 构建显示表达式
      // 简单条件: 显示 conditionExpr (如 21 <= 64)
      // 复杂条件: 显示空字符串
      // 隐藏检定结果时: 显示空字符串
      const exprDisplay = isComplexCondition(conditionExpr) ? '' : conditionExpr;
      const displayExpr = hideDiceResultFromUser ? '' : exprDisplay;

      // 将按钮内容替换为结果显示
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          <span class="acu-dice-result-target" style="font-size: 11px;">${escapeHtml(displayExpr)}</span>
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performAdvancedCheck();
      });

      // [新增] 渲染资源消耗器按钮 (燃运等)
      if (preset.resourceBurners && preset.resourceBurners.length > 0) {
        // 构建上下文：包含基础属性、派生变量、投骰结果
        const burnerContext = {
          ...context, // 复用已构建的 context (包含 $roll, $roll.total, $attr 等)
        };

        const burnersHtml = renderResourceBurnerButtons(preset, burnerContext, matchedOutcome, attrName);
        if (burnersHtml) {
          // 插入到结果显示区域
          const $burners = $(burnersHtml);
          $rollBtn.find('.acu-dice-result-display').append($burners);

          // 绑定资源消耗按钮点击事件
          $burners.find('.acu-dice-burner-btn').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const burnerId = $(this).data('id');
            const burner = preset.resourceBurners?.find(b => b.id === burnerId);
            if (burner) {
              handleResourceBurnerClick(burner, burnerContext);
            }
          });
        }
      }

      // [新增] 渲染孤注一掷按钮 (Pushed Roll) — 基于 outcome ID 而非 isSuccess 二元值
      if (
        preset.pushedRoll?.enabled &&
        !isPushed && // 已经是孤注一掷则不可再push
        matchedOutcome &&
        !matchesCheckSelector(attrName, {
          namePatterns: { include: preset.pushedRoll.excludePatterns ?? [] },
        }) // 排除特定属性名
      ) {
        const outcomeId = matchedOutcome.id;
        // 判定优先级: blockedOutcomes > pushableOutcomes > legacy fallback (!isSuccess)
        const blockedOutcomes =
          preset.pushedRoll.blockedOutcomes ?? (preset.pushedRoll.blockOnCritFailure !== false ? ['crit_failure'] : []);
        const isBlocked = blockedOutcomes.includes(outcomeId);
        const isPushable = preset.pushedRoll.pushableOutcomes
          ? preset.pushedRoll.pushableOutcomes.includes(outcomeId)
          : !isSuccess; // legacy fallback
        if (isPushable && !isBlocked) {
          const $pushBtn = $(`
           <button type="button" class="acu-dice-burner-btn" aria-label="孤注一掷" title="孤注一掷：重掷一次，失败后果更严重">
             <i class="fa-solid fa-skull"></i>
           </button>
         `);
          // 优先插入到 burners 容器中（与燃运按钮并排），否则创建一个
          let $burnersContainer = $rollBtn.find('.acu-dice-burners');
          if (!$burnersContainer.length) {
            $burnersContainer = $('<span class="acu-dice-burners"></span>');
            $rollBtn.find('.acu-dice-result-display').append($burnersContainer);
          }
          $burnersContainer.append($pushBtn);
          $pushBtn.on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            performAdvancedCheck({ isPushed: true });
          });
        }
      }

      // 生成输出文本 (使用模板系统)
      // judgeResultText 基于 displayExpr 的计算结果，表示显示的算式是否在数学上成立
      const judgeResultText = displayExprResult ? '成立' : '不成立';
      const template =
        'outputTemplate' in preset && preset.outputTemplate ? preset.outputTemplate : DEFAULT_OUTPUT_TEMPLATE;
      // 计算pushed标注: 按 outcome ID 查找 outcomeLabels，fallback 到 '*' 默认值
      const pushedLabel =
        isPushed && matchedOutcome
          ? (preset.pushedRoll?.outcomeLabels?.[matchedOutcome.id] ?? preset.pushedRoll?.outcomeLabels?.['*'] ?? '')
          : '';
      const outcomeTextRaw = (pushedLabel ? pushedLabel + '\n' : '') + (matchedOutcome?.outputText ?? '');
      // 格式化attrMod为带符号字符串 (如 +3 或 -1)
      const attrModStr = attrMod >= 0 ? `+${attrMod}` : String(attrMod);
      // 格式化skillMod为带符号字符串
      const skillModStr = skillMod >= 0 ? `+${skillMod}` : String(skillMod);

      // [新增] 条件文本变量：当值为0时隐藏整个片段（包括标签）
      // skillModText: 当skillMod非0时显示 "+技能加值+N"，否则为空
      const skillModText = skillMod !== 0 ? `+技能加值${skillModStr}` : '';
      // modText: 当mod非0时显示 "+额外加值+N"，否则为空
      const modText = mod !== 0 ? `+额外加值${mod >= 0 ? '+' + mod : mod}` : '';
      // attrModText: 当attrMod非0时显示 "(调整值+N)"，否则为空
      const attrModText = attrMod !== 0 ? `(调整值${attrModStr})` : '';
      const checkValueText = buildCheckValueText({
        preset,
        characterName: initiatorName,
        actionName: attrName,
        attrValue,
        attrMod,
        skillMod,
        mode: 'normal',
      });

      // [新增] 将派生变量转换为 outputContext 格式（去掉 $ 前缀）
      const derivedOutputVars: Record<string, number> = {};
      Object.entries(postRollDerivedValues).forEach(([key, value]) => {
        const cleanKey = key.startsWith('$') ? key.slice(1) : key;
        derivedOutputVars[cleanKey] = value;
      });
      const customOutputVars: Record<string, string | number | boolean> = {};
      Object.entries(customValues).forEach(([key, value]) => {
        const cleanKey = key.startsWith('$') ? key.slice(1) : key;
        customOutputVars[cleanKey] = value;
      });

      // [新增] 计算后果效果变量
      const effectVars = computePendingEffectVariables(matchedOutcome?.effects);

      const outputContext = {
        initiator: initiatorName,
        attrName: `【${attrName}】`,
        attrValue: attrValue,
        attrMod: attrModStr,
        displayValue: displayExprValue,
        skillMod: skillModStr,
        // [新增] 条件文本变量（零值时隐藏整个片段）
        skillModText: skillModText,
        modText: modText,
        attrModText: attrModText,
        checkValueText,
        formula: diceExpression,
        roll: rollTotal,
        'roll.total': rollTotal, // [新增] 支持 $roll.total 语法
        dc: dc,
        mod: mod,
        attr: attrValue,
        conditionExpr: conditionExpr,
        judgeResult: judgeResultText,
        outcomeName: outcomeText,
        outcomeText: outcomeTextRaw,
        ...customOutputVars,
        ...derivedOutputVars, // [新增] 添加派生变量（如 chaos）
        ...effectVars, // [新增] 添加后果效果变量
      };
      // [修复] 先独立渲染 outcomeText，避免其中变量（如 $growthGain）残留
      outputContext.outcomeText = formatOutputTemplate(String(outputContext.outcomeText || ''), outputContext);
      const diceResultText = formatOutputTemplate(template, outputContext);
      smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: dc,
        outcomeText,
        attrName,
        criteria: 'advanced',
        isAutoTarget: false,
        formula: diceExpression,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName} (值=${attrValue})`,
          `公式: ${diceExpression}`,
          `掷骰: ${rollTotal}`,
          `目标: ${dc}`,
          `修正: attrMod=${attrModStr}, skillMod=${skillModStr}, mod=${mod >= 0 ? '+' + mod : mod}`,
          `判定: ${judgeResultText || outcomeText}`,
          `结果: ${outcomeText}`,
        ],
        ...(isPushed ? { isPushed: true } : {}),
      };
      checkHistory.push(checkResultWithTimestamp);
      if (checkHistory.length > MAX_HISTORY) {
        checkHistory.shift();
      }

      // 触发事件
      emitEvent('check', checkResultWithTimestamp);

      // 暂存后果
      // [修复] 检查属性名是否匹配 effectsConfig.triggerPatterns
      const shouldTriggerEffects =
        preset.effectsConfig &&
        matchedOutcome &&
        matchedOutcome.effects &&
        matchedOutcome.effects.length > 0 &&
        matchesCheckSelector(attrName, {
          namePatterns: { include: preset.effectsConfig.triggerPatterns },
        });

      if (shouldTriggerEffects) {
        const historyIndex = checkHistory.length - 1;
        const runId = `effect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const effectContext = {
          characterName: initiatorName,
          attributeName: attrName,
          attributeValue: attrValue,
          roll: rollResult.total,
          modifier: mod,
          dc,
        };

        const pendingCtx: PendingEffectContext = {
          runId,
          historyIndex,
          preset,
          matchedOutcome,
          context: effectContext,
          branchReasonText,
          sourceMetaText: diceResultText,
          timestamp: Date.now(),
        };

        setHistoryEffectState(historyIndex, {
          effectStatus: 'planned',
          effectRunId: runId,
          effectResults: [],
          effectError: undefined,
          effectTrace: undefined,
        });
        const plannedSeq = emitEffectRun({
          runId,
          status: 'planned',
          characterName: initiatorName,
          attributeName: attrName,
          historyIndex,
          effectResults: [],
          effectTrace: ['等待确认'],
          chainMode: getSecondaryTriggerMode(preset),
          timestamp: Date.now(),
        });
        setHistoryEffectState(historyIndex, { effectEventSeq: plannedSeq });

        // [新增] 检查是否有需要确认的效果
        const hasConfirmableEffects = matchedOutcome.effects.some(e => e.needsConfirm !== false);

        if (hasConfirmableEffects) {
          // 有需要确认的效果,显示确认弹窗 (异步处理)
          handleEffectConfirmation(pendingCtx);
          console.info(
            `[DICE] ${matchedOutcome.effects.length} effects pending user confirmation for ${initiatorName}`,
          );
        } else {
          // 所有效果都不需要确认,直接进入待执行队列
          enqueueEffectRun(pendingCtx);
          setHistoryEffectState(historyIndex, {
            effectStatus: 'confirmed',
          });
          const confirmedSeq = emitEffectRun({
            runId,
            status: 'confirmed',
            characterName: initiatorName,
            attributeName: attrName,
            historyIndex,
            effectResults: [],
            effectTrace: ['自动确认，等待提交'],
            chainMode: getSecondaryTriggerMode(preset),
            timestamp: Date.now(),
          });
          setHistoryEffectState(historyIndex, { effectEventSeq: confirmedSeq });
          console.info(`[DICE] Queued ${matchedOutcome.effects.length} auto-execute effects for ${initiatorName}`);
        }
      }

      if (preset.currentAttrAutoUpdate && preset.currentAttrAutoUpdate.enabled !== false) {
        const autoUpdate = preset.currentAttrAutoUpdate;
        const when = autoUpdate.when || 'always';
        const shouldApply =
          when === 'always' || (when === 'success' && isSuccess) || (when === 'failure' && !isSuccess);
        if (shouldApply) {
          const autoContext: Record<string, string | number | boolean> = {
            $roll: rollTotal,
            '$roll.total': rollTotal,
            $attr: attrValue,
            $dc: dc,
            $mod: mod,
            $success: isSuccess ? 1 : 0,
            ...customValues,
          };
          const resolvedExpr = resolveExpressionWithContext(autoUpdate.valueExpr, autoContext);
          const changeValue = parseModifier(resolvedExpr);
          const aliasCandidates = autoUpdate.aliasCandidates || [];
          const resolvedAlias = resolveAttributeAliasName(initiatorName, attrName, aliasCandidates).name;
          const targetAttr = resolvedAlias || attrName;
          const beforeValueRaw = getAttributeValue(initiatorName, attrName, aliasCandidates);
          const beforeValue =
            beforeValueRaw === null || beforeValueRaw === undefined ? (autoUpdate.initValue ?? 0) : beforeValueRaw;

          let previewAfterValue = beforeValue;
          if (autoUpdate.operation === 'add') {
            previewAfterValue = beforeValue + changeValue;
          } else if (autoUpdate.operation === 'subtract') {
            previewAfterValue = beforeValue - changeValue;
          } else {
            previewAfterValue = changeValue;
          }
          const minValue = autoUpdate.min ?? 0;
          const maxValue = autoUpdate.max ?? Infinity;
          previewAfterValue = Math.max(minValue, Math.min(maxValue, previewAfterValue));
          const previewDelta = previewAfterValue - beforeValue;

          const computedAutoEffect: ComputedEffect = {
            effectId: `auto_${autoUpdate.operation}`,
            target: attrName,
            resolvedTarget: targetAttr,
            computedValue: previewDelta,
            rolledValue: changeValue,
            formula: resolvedExpr || '0',
            displayText: `${resolvedExpr || '0'} → ${changeValue}`,
            beforeValue,
            afterValue: previewAfterValue,
            conditionSummary: `命中【${matchedOutcome?.name || outcomeText}】分支后触发自动填表`,
          };

          const confirmed = await new Promise<boolean>(resolve => {
            showEffectConfirmDialog({
              preset,
              outcomeLabel: `${attrName} 检定: ${matchedOutcome?.name || outcomeText}`,
              branchReasonText,
              effects: [computedAutoEffect],
              onConfirm: () => resolve(true),
              onCancel: () => resolve(false),
            });
          });

          if (confirmed) {
            const updateResult = await updateSingleAttribute(
              initiatorName,
              attrName,
              autoUpdate.operation,
              changeValue,
              {
                initValue: autoUpdate.initValue,
                min: autoUpdate.min,
                max: autoUpdate.max,
                aliasCandidates,
              },
            );
            if (updateResult.success) {
              const finalAttr = updateResult.resolvedAttrName || attrName;
              const delta = updateResult.newValue - updateResult.oldValue;
              const changeLabel =
                String(autoUpdate.changeLabel || '').trim() ||
                (autoUpdate.operation === 'add' ? '增加' : autoUpdate.operation === 'subtract' ? '减少' : '设为');
              const exprRaw = String(resolvedExpr || '').trim();
              const rolledText = String(changeValue);
              const exprNormalized = exprRaw.replace(/\s+/g, '');
              const exprWithRoll =
                exprRaw && exprNormalized !== rolledText ? `${exprRaw}=${rolledText}` : exprRaw || rolledText;

              const settledContext: Record<string, string | number | undefined> = {
                attr: `【${finalAttr}】`,
                attrPlain: finalAttr,
                old: updateResult.oldValue,
                new: updateResult.newValue,
                delta,
                expr: exprRaw || rolledText,
                rolled: changeValue,
                operation: autoUpdate.operation,
                changeLabel,
              };

              const settledTemplate = String(autoUpdate.outputTextTemplate || '').trim();
              const settledLine =
                settledTemplate !== ''
                  ? formatOutputTemplate(settledTemplate, settledContext).trim()
                  : `已填表：${finalAttr}从${updateResult.oldValue}变为${updateResult.newValue}，变化${changeLabel}${exprWithRoll}`;

              const autoRunId = `autoupdate_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
              const injected = injectEffectLinesIntoTextarea(autoRunId, [settledLine]);
              if (!injected) {
                smartInsertToTextarea(settledLine, 'dice');
              }

              // 同步更新当前面板显示（属性输入框 + 快捷属性按钮）
              const currentAttrName = String(panel.find('#dice-attr-name').val() || '').trim();
              if (currentAttrName === attrName || currentAttrName === finalAttr) {
                panel.find('#dice-attr-value').val(String(updateResult.newValue)).trigger('change');
              }
              buildAttrButtons(initiatorName);

              if (window.toastr) {
                window.toastr.success(
                  `已完成填表更新 ${finalAttr}: ${updateResult.oldValue} -> ${updateResult.newValue}`,
                );
              }
            } else if (window.toastr) {
              window.toastr.warning(`自动更新属性失败: ${updateResult.error || '未知错误'}`);
            }
          } else if (window.toastr) {
            window.toastr.info('已取消本次自动填表');
          }
        }
      }

      if (onResult) {
        onResult(checkResult);
      }
    };

    // [新增] 自定义模式掷骰逻辑
    const performCustomRoll = function () {
      const $btn = panel.find('#dice-roll-btn');

      // 读取自定义模式字段
      const diceExpr = panel.find('#custom-dice-expr').val().trim() || '1d100';
      const judgeMode = panel.find('#custom-judge-mode').val() as string;
      const targetValueStr = panel.find('#custom-target-value').val().trim();
      const initiatorName = resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';

      // 解析目标值
      const expectedValue = calculateDiceExpectedValue(diceExpr);
      const autoTargetValue = Number.isFinite(expectedValue) ? Math.floor(expectedValue) : null;
      const targetValue = targetValueStr !== '' ? parseInt(targetValueStr, 10) : autoTargetValue;
      const hasJudgement = judgeMode !== 'none' && targetValue !== null && !isNaN(targetValue);

      // 执行掷骰 - 使用 rollComplexDiceExpression 支持复合表达式如 2d6+33
      const rollResult = rollComplexDiceExpression(diceExpr);
      if (isNaN(rollResult.total)) {
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${diceExpr}`, {
            suggestion: '请检查骰子输入框或当前预设公式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }

      const rollTotal = rollResult.total;

      // 判定结果
      let isSuccess = false;
      let judgeResultText = '';

      if (hasJudgement) {
        switch (judgeMode) {
          case '>=':
            isSuccess = rollTotal >= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<=':
            isSuccess = rollTotal <= targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '>':
            isSuccess = rollTotal > targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          case '<':
            isSuccess = rollTotal < targetValue;
            judgeResultText = isSuccess ? '成功' : '失败';
            break;
          default:
            judgeResultText = '';
        }
      }

      // 生成输出文本 - 使用与内置预设一致的 meta 标签格式
      const displayInitiator = replaceUserPlaceholders(initiatorName);
      const displayAttrName = attrName || '自由检定';
      let outputText: string;

      if (hasJudgement) {
        const conditionExpr = `${rollTotal} ${judgeMode} ${targetValue}`;
        const judgeResultCN = isSuccess ? '成立' : '不成立';
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}，判定 ${conditionExpr}？${judgeResultCN}，判定为【${judgeResultText}】\n</meta:检定结果>`;
      } else {
        // 无判定模式
        outputText = `<meta:检定结果>\n元叙事：${displayInitiator} 发起了 【${displayAttrName}】 检定，${diceExpr}=${rollTotal}\n</meta:检定结果>`;
      }

      // 插入到输入框
      smartInsertToTextarea(outputText, 'dice');

      // 生成结果显示
      const badgeClass = hasJudgement
        ? isSuccess
          ? 'acu-dice-result-badge success'
          : 'acu-dice-result-badge failure'
        : '';
      const diceCfg = getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : rollTotal;
      const displayOutcome = hideDiceResultFromUser ? '' : judgeResultText;

      // 更新按钮显示结果
      $btn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${hasJudgement && displayOutcome ? `<span class="${badgeClass}">${displayOutcome}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performCustomRoll();
      });

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: rollTotal,
        target: targetValue ?? 0,
        outcomeText: judgeResultText,
        attrName,
        criteria: 'custom',
        isAutoTarget: false,
        formula: diceExpr,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${diceExpr}`,
          `掷骰: ${rollTotal}`,
          hasJudgement ? `判定: ${rollTotal} ${judgeMode} ${targetValue}` : '判定: 无',
          hasJudgement ? `结果: ${judgeResultText}` : '结果: 仅掷骰',
        ],
      };
      checkHistory.push(checkResultWithTimestamp);
      if (checkHistory.length > MAX_HISTORY) {
        checkHistory.shift();
      }

      // 触发事件
      emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    let lastDiceRollAt = 0;
    // 投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performDiceRoll = function () {
      const $btn = panel.find('#dice-roll-btn');
      const now = Date.now();
      if (now - lastDiceRollAt < 100) return;
      lastDiceRollAt = now;
      if ($btn.prop('disabled')) return;

      // 锁定按钮防止连点
      $btn.prop('disabled', true).addClass('disabled');
      setTimeout(() => {
        $btn.prop('disabled', false).removeClass('disabled');
      }, 100);

      // [新增] 如果使用高级预设,调用专用检定函数
      if (currentAdvancedPreset) {
        performAdvancedCheck();
        return;
      }

      // [新增] 如果处于自定义模式,使用自定义掷骰逻辑
      if (panel.find('#acu-dice-custom-mode-fields').is(':visible')) {
        performCustomRoll();
        return;
      }

      const formula = panel.find('#dice-formula').val().trim() || '1d100';
      const modStr = panel.find('#dice-modifier').val().trim() || '0';
      const mod = parseModifier(modStr);
      const attrName = panel.find('#dice-attr-name').val().trim() || '自由检定';
      const criteria = panel.find('#dice-success-criteria').val() || 'lte';
      const difficulty = panel.find('#dice-difficulty').val() || 'normal';

      // 判断规则类型
      const isDND = criteria === 'gte';

      // 获取骰子配置（根据规则类型读取不同配置）
      const diceCfg = getDiceConfig();
      const hardDiv = diceCfg.difficultSuccessDiv || 2;
      const extremeDiv = diceCfg.hardSuccessDiv || 5;
      // COC: 大成功 ≤ critSuccessMax, 大失败 ≥ critFailMin
      // DND: 大成功 ≥ dndCritSuccess, 大失败 ≤ dndCritFail
      const critSuccessMax = isDND ? diceCfg.dndCritFail || 1 : diceCfg.critSuccessMax || 5;
      const critFailMin = isDND ? diceCfg.dndCritSuccess || 20 : diceCfg.critFailMin || 96;

      // 目标值计算（COC 和 DND 不同）
      let targetInputVal = panel.find('#dice-target').val().trim();
      let attrInputVal = panel.find('#dice-attr-value').val().trim();
      let attrValue = attrInputVal !== '' ? parseInt(attrInputVal, 10) : 0;
      let target;
      let isAutoTarget = false;

      // 辅助函数：根据骰子公式计算最大值的一半
      const getDefaultTarget = formulaStr => {
        const match = formulaStr.match(/(\d+)d(\d+)/i);
        if (match) {
          const maxRoll = parseInt(match[1], 10) * parseInt(match[2], 10);
          return Math.round(maxRoll / 2);
        }
        return 50;
      };

      if (targetInputVal !== '') {
        // 用户手动输入了目标值/DC
        const parsedTarget = parseInt(targetInputVal, 10);
        target = !Number.isNaN(parsedTarget) ? parsedTarget : getDefaultTarget(formula);
      } else if (isDND) {
        // DND 模式：留空时 DC = 10（中等难度）
        target = 10;
        isAutoTarget = true;
      } else {
        // COC 模式：留空时目标值 = 属性值，若属性值也空则取骰子最大值的一半
        if (attrValue > 0) {
          target = attrValue;
          isAutoTarget = true;
        } else {
          target = getDefaultTarget(formula);
          isAutoTarget = true;
        }
      }

      const result = rollDice(formula);
      const finalValue = result.total + mod;

      // 根据规则和难度等级计算
      let requiredTarget = target;
      let difficultyLabel = '';
      let difficultyDiv = 1;

      // DND 模式忽略难度等级
      if (!isDND) {
        switch (difficulty) {
          case 'hard':
            requiredTarget = Math.floor(target / hardDiv);
            difficultyLabel = '困难';
            difficultyDiv = hardDiv;
            break;
          case 'extreme':
            requiredTarget = Math.floor(target / extremeDiv);
            difficultyLabel = '极难';
            difficultyDiv = extremeDiv;
            break;
          case 'critical':
            requiredTarget = critSuccessMax;
            difficultyLabel = '大成功';
            break;
          default:
            difficultyLabel = '';
            break;
        }
      }

      // 判定结果
      let isCritSuccess = false;
      let isCritFailure = false;
      let isSuccess = false;
      let outcomeText = '';
      let outcomeClass = '';

      // 大成功/大失败判定（最高优先级）
      if (isDND) {
        // DND: 大成功 ≥ 20，大失败 ≤ 1
        isCritSuccess = finalValue >= critFailMin; // 复用 critFailMin 作为 DND 大成功阈值
        isCritFailure = finalValue <= critSuccessMax; // 复用 critSuccessMax 作为 DND 大失败阈值
      } else {
        // COC: 大成功 ≤ 5，大失败 ≥ 96
        isCritSuccess = finalValue <= critSuccessMax;
        isCritFailure = finalValue >= critFailMin;
      }

      // 根据规则判断成功/失败
      if (isDND) {
        isSuccess = finalValue >= requiredTarget;
      } else {
        isSuccess = finalValue <= requiredTarget;
      }

      // 确定最终结果文本
      if (isCritSuccess) {
        outcomeText = '大成功！';
        outcomeClass = 'success';
        isSuccess = true;
      } else if (isCritFailure) {
        outcomeText = '大失败！';
        outcomeClass = 'failure';
        isSuccess = false;
      } else if (isSuccess) {
        if (isDND) {
          outcomeText = '成功';
        } else if (difficulty === 'hard') {
          outcomeText = '困难成功';
        } else if (difficulty === 'extreme') {
          outcomeText = '极难成功';
        } else {
          // 普通难度下，检查是否达成更高成就
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            outcomeText = '极难成功';
          } else if (finalValue <= hardTarget) {
            outcomeText = '困难成功';
          } else {
            outcomeText = '成功';
          }
        }
        outcomeClass = 'success';
      } else {
        outcomeText = '失败';
        outcomeClass = 'failure';
      }

      const criteriaSymbol = isDND ? '≥' : '≤';
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      const displayValue = hideDiceResultFromUser ? '？？' : finalValue;
      const displayOutcomeText = hideDiceResultFromUser ? '' : outcomeText;

      // 确定结果类型和样式
      let resultType;
      if (isCritSuccess) {
        resultType = 'critSuccess';
      } else if (isCritFailure) {
        resultType = 'critFailure';
      } else if (isSuccess) {
        if (difficulty === 'extreme' || (difficulty === 'normal' && finalValue <= Math.floor(target / extremeDiv))) {
          resultType = 'extremeSuccess';
        } else if (difficulty === 'hard' || (difficulty === 'normal' && finalValue <= Math.floor(target / hardDiv))) {
          resultType = 'success';
        } else {
          resultType = 'warning';
        }
      } else {
        resultType = 'failure';
      }

      const badgeClass = getResultBadgeClass(resultType);

      // 构建显示用的条件表达式（隐藏时为空）
      const displayConditionExpr = hideDiceResultFromUser ? '' : conditionExpr;

      // 将按钮内容替换为结果显示（居中布局，旋转箭头在结果后面）
      const $rollBtn = panel.find('#dice-roll-btn');
      $rollBtn.html(`
        <div class="acu-dice-result-display">
          <span class="acu-dice-result-value">${displayValue}</span>
          ${displayConditionExpr ? `<span class="acu-dice-result-target">${displayConditionExpr}</span>` : ''}
          ${displayOutcomeText ? `<span class="${badgeClass}">${displayOutcomeText}</span>` : ''}
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮点击事件（使用事件委托，因为按钮内容会动态更新）
      $rollBtn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        // 直接调用投骰逻辑函数
        performDiceRoll();
      });

      // 生成 Prompt 文本
      const initiatorName = resolveCanonicalCharacterName(panel.find('#dice-initiator-name').val().trim() || '<user>');

      // 构建简单条件表达式（用于界面显示）
      let conditionExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        } else {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          conditionExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          conditionExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        conditionExpr = `${finalValue}≥${requiredTarget}`;
      } else {
        conditionExpr = `${finalValue}≤${requiredTarget}`;
      }

      // 构建详细判定表达式（用于输出文本）
      let judgeExpr = '';
      if (isCritSuccess) {
        if (isDND) {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        } else {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        }
      } else if (isCritFailure) {
        if (isDND) {
          judgeExpr = `${finalValue}≤${critSuccessMax}`;
        } else {
          judgeExpr = `${finalValue}≥${critFailMin}`;
        }
      } else if (isDND) {
        // DND 模式
        if (isSuccess) {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}≥${requiredTarget}`;
        } else {
          judgeExpr = `需${criteriaSymbol}${requiredTarget}，${finalValue}<${requiredTarget}`;
        }
      } else if (difficulty === 'critical') {
        // COC 难度设为大成功但没达成
        judgeExpr = `需≤${critSuccessMax}，${finalValue}>${critSuccessMax}`;
      } else if (difficulty !== 'normal') {
        // COC 困难或极难
        if (isSuccess) {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}≤${requiredTarget}`;
        } else {
          judgeExpr = `需≤${target}/${difficultyDiv}，${finalValue}>${requiredTarget}`;
        }
      } else {
        // COC 普通难度
        if (isSuccess) {
          const extremeTarget = Math.floor(target / extremeDiv);
          const hardTarget = Math.floor(target / hardDiv);
          if (finalValue <= extremeTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${extremeDiv}`;
          } else if (finalValue <= hardTarget) {
            judgeExpr = `需≤${target}，${finalValue}≤${target}/${hardDiv}`;
          } else {
            judgeExpr = `需≤${target}，${finalValue}≤${target}`;
          }
        } else {
          judgeExpr = `需≤${target}，${finalValue}>${target}`;
        }
      }

      // 构建统一格式的检定结果文本
      const metaContent = `元叙事：${initiatorName}发起了【${attrName}】检定，掷出${finalValue}，${judgeExpr}，【${outcomeText}】`;
      const diceResultText = `<meta:检定结果>\n${metaContent}\n</meta:检定结果>`;
      smartInsertToTextarea(diceResultText, 'dice');

      // 构建检定结果对象
      const checkResult: AcuDice.CheckResult = {
        success: isSuccess,
        total: finalValue,
        target,
        outcomeText,
        attrName,
        criteria,
        isAutoTarget,
        formula,
      };

      // 添加到历史记录
      const detailId = `check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const checkResultWithTimestamp = {
        ...checkResult,
        timestamp: Date.now(),
        detailId,
        initiatorName,
        historyType: 'check' as const,
        detailLines: [
          `发起者: ${initiatorName}`,
          `属性: ${attrName}`,
          `公式: ${formula}`,
          `掷骰+修正: ${result.total} ${mod >= 0 ? '+' : ''}${mod} = ${finalValue}`,
          `目标: ${requiredTarget} (${isAutoTarget ? '自动计算' : '手动输入'})`,
          `成功标准: ${criteria === 'gte' ? '>=' : '<='}${requiredTarget}`,
          difficultyLabel ? `难度: ${difficultyLabel}` : '难度: 普通',
          `判定详情: ${judgeExpr}`,
          `结果: ${outcomeText}`,
        ],
      };
      checkHistory.push(checkResultWithTimestamp);
      if (checkHistory.length > MAX_HISTORY) {
        checkHistory.shift();
      }

      // 触发事件
      emitEvent('check', checkResultWithTimestamp);

      if (onResult) {
        onResult(checkResult);
      }
    };

    // 绑定按钮点击事件
    panel.find('#dice-roll-btn').click(function () {
      performDiceRoll();
    });

    // 切换到对抗检定（标题栏图标）
    panel.find('#dice-switch-contest-top').click(function () {
      const targetInput = panel.find('#dice-target').val().trim();
      const attrValueInput = panel.find('#dice-attr-value').val().trim();
      const currentDice = panel.find('#dice-formula').val() || '1d100';
      const initiatorNameVal = panel.find('#dice-initiator-name').val().trim();
      closePanel();
      showContestPanel({
        // 只有用户实际输入了非默认值才传递，否则留空让 placeholder 生效
        initiatorName: initiatorNameVal && initiatorNameVal !== '<user>' ? initiatorNameVal : '',
        initiatorValue: attrValueInput !== '' ? parseInt(attrValueInput, 10) : undefined,
        diceType: currentDice,
      });
    });
    panel.find('#dice-history-btn').click(function (e) {
      e.stopPropagation();
      showGlobalDiceHistoryDialog();
    });
    // 关闭
    const closePanel = () => {
      overlay.remove();
      panel.remove();
    };
    panel.on('click', e => {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-dice-close').click(closePanel);
    // 齿轮设置按钮点击 - 调用高级检定管理
    panel.find('.acu-dice-config-btn').click(function (e) {
      e.stopPropagation();
      showAdvancedPresetManager({ fromDicePanel: true });
    });
  };

  // 判定成功等级（供对抗检定面板和 API contest() 共用）
  const getSuccessLevel = function (roll: number, target: number, sides: number) {
    if (sides === 100) {
      if (roll <= 5) return { level: 3, name: '大成功', color: 'var(--acu-crit-success-text)' };
      if (roll >= 96) return { level: -1, name: '大失败', color: 'var(--acu-crit-failure-text)' };
      if (roll <= Math.floor(target / 5))
        return { level: 2, name: '极难成功', color: 'var(--acu-extreme-success-text)' };
      if (roll <= Math.floor(target / 2)) return { level: 1, name: '困难成功', color: 'var(--acu-success-text)' };
      if (roll <= target) return { level: 0, name: '普通成功', color: 'var(--acu-warning-text)' };
      return { level: -1, name: '失败', color: 'var(--acu-failure-text)' };
    } else {
      if (roll === 20) return { level: 3, name: '大成功', color: 'var(--acu-crit-success-text)' };
      if (roll === 1) return { level: -1, name: '大失败', color: 'var(--acu-crit-failure-text)' };
      if (roll >= target) return { level: 0, name: '成功', color: 'var(--acu-success-text)' };
      return { level: -1, name: '失败', color: 'var(--acu-failure-text)' };
    }
  };

  // [新增] 显示对抗检定面板
  const showContestPanel = (options = {}) => {
    const { $ } = getCore();
    $('.acu-dice-panel, .acu-dice-overlay, .acu-contest-panel, .acu-contest-overlay').remove();

    const config = getConfig();
    const diceCfg = getDiceConfig();

    // 读取保存的骰子类型，必须是有效公式
    let savedDiceType = diceCfg.lastDiceType || '1d100';
    if (Number.isNaN(rollComplexDiceExpression(savedDiceType).total)) {
      savedDiceType = '1d100';
    }

    // 修复：正确接收所有传入参数
    const opponentName = options.opponentName || '';
    const diceType = options.diceType || savedDiceType;
    const passedInitiatorName = options.initiatorName || '';
    const passedInitiatorValue = options.initiatorValue;
    const passedOpponentValue = options.opponentValue;

    const rawData = getCachedRawData() || getTableData();
    let playerAttrs = [];
    let opponentAttrs = [];

    // [新增] 构建角色下拉列表（主角真名 + 重要角色表）
    const characterList = getDiceQuickSelectCharacterList(rawData as DiceRawData | null | undefined);
    // [新增] 构建属性下拉列表
    let contestAttrList = [];
    playerAttrs = getFullAttributesForCharacter(passedInitiatorName || '<user>');
    playerAttrs.forEach(attr => {
      if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
    });
    opponentAttrs = opponentName ? getFullAttributesForCharacter(opponentName) : [];
    opponentAttrs.forEach(attr => {
      if (!contestAttrList.includes(attr.name)) contestAttrList.push(attr.name);
    });

    const buildAttrButtons = (attrs, targetType) => {
      let html = '';
      // 现有属性按钮
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        html +=
          '<button type="button" class="acu-contest-attr-btn" data-val="' +
          attr.value +
          '" data-aname="' +
          escapeHtml(attr.name) +
          '" data-type="' +
          targetType +
          '">' +
          escapeHtml(attr.name) +
          ': ' +
          attr.value +
          '</button>';
      }
      // 生成属性按钮（始终显示）
      html +=
        '<button type="button" class="acu-contest-gen-attr-btn" data-type="' +
        targetType +
        '" aria-label="生成属性" title="生成属性"><i class="fa-solid fa-dice"></i></button>';
      // 清空属性按钮
      html +=
        '<button type="button" class="acu-contest-clear-attr-btn" data-type="' +
        targetType +
        '" aria-label="清空规则属性" title="清空规则属性"><i class="fa-solid fa-trash-alt"></i></button>';
      return html;
    };

    // [修复] 获取当前活跃预设，用于正确同步按钮状态
    const contestAvailablePresets = AdvancedDicePresetManager.getAllPresets()
      .filter(p => p.visible !== false)
      .filter(p => AdvancedDicePresetManager.supportsContest(p))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentActivePreset = AdvancedDicePresetManager.getActivePreset();
    const activePresetId =
      currentActivePreset && AdvancedDicePresetManager.supportsContest(currentActivePreset)
        ? currentActivePreset.id
        : null;

    const overlay = $('<div class="acu-contest-overlay"></div>');
    const panelHtml =
      '<div class="acu-contest-panel acu-theme-' +
      config.theme +
      '">' +
      '<div class="acu-dice-panel-header">' +
      '<div class="acu-dice-panel-title"><i class="fa-solid fa-people-arrows"></i> 对抗检定</div>' +
      '<div class="acu-dice-panel-actions">' +
      getTutorialButtonHtml('contestDice', '查看对抗检定教程') +
      '<button type="button" id="contest-switch-normal" class="acu-dice-panel-action-btn" aria-label="切换到普通检定" title="切换到普通检定"><i class="fa-solid fa-dice-d20"></i></button>' +
      '<button type="button" id="contest-history-btn" class="acu-dice-panel-action-btn" aria-label="检定历史" title="检定历史"><i class="fa-solid fa-history"></i></button>' +
      '<button type="button" class="acu-contest-config-btn acu-dice-panel-action-btn" aria-label="掷骰规则设置" title="掷骰规则设置"><i class="fa-solid fa-cog"></i></button>' +
      '<button type="button" class="acu-contest-close acu-dice-panel-action-btn" aria-label="关闭对抗检定面板" title="关闭"><i class="fa-solid fa-times"></i></button>' +
      '</div>' +
      '</div>' +
      '<div class="acu-dice-panel-body">' +
      '<div id="contest-dice-presets-section">' +
      // [修复] 添加"检定规则"标题，与普通检定一致
      '<div class="acu-dice-section-title"><span><i class="fa-solid fa-sliders"></i> 检定规则</span></div>' +
      '<div class="acu-dice-presets">' +
      '<button type="button" class="acu-dice-quick-preset-btn" data-dice="custom" style="order: -999;">自定义</button>' +
      contestAvailablePresets
        .map(
          p =>
            '<button type="button" class="acu-dice-quick-preset-btn' +
            // [修复] 使用activePresetId而不是diceExpression来判断active状态
            (p.id === activePresetId ? ' active' : '') +
            '" data-dice="' +
            escapeHtml(p.diceExpression || '1d100') +
            '" data-criteria="' +
            escapeHtml(p.successCriteria || 'lte') +
            '" data-preset-id="' +
            escapeHtml(p.id) +
            '">' +
            escapeHtml(p.name) +
            '</button>',
        )
        .join('') +
      '</div>' +
      '</div>' +
      '<input type="hidden" id="contest-dice-type" value="' +
      diceType +
      '">' +
      '<div class="acu-dice-section-title" id="contest-init-char-buttons-section"><span><i class="fa-solid fa-user"></i> 发起方</span><div id="contest-init-char-buttons" class="acu-dice-quick-inline"></div></div>' +
      '<div id="contest-init-params-section">' +
      '<div id="contest-init-primary-row" class="acu-dice-form-row cols-2">' +
      '<div><div class="acu-dice-form-label">名字</div><input type="text" class="acu-dice-input" id="contest-init-display" value="' +
      escapeHtml(passedInitiatorName) +
      '" placeholder="<user>"></div>' +
      '<div><div class="acu-dice-form-label"><span class="contest-attr-name-text">属性名</span><button type="button" class="acu-random-skill-btn" id="contest-init-random-skill" title="随机技能"><i class="fa-solid fa-dice"></i></button></div><input type="text" class="acu-dice-input" id="contest-init-name" value="" placeholder="自由检定"></div>' +
      '</div>' +
      // [调整] 发起方骰子语法 (自定义模式时显示，半宽)
      '<div id="contest-init-dice-syntax-row" class="acu-dice-form-row cols-2" style="display: none;">' +
      '<div><div class="acu-dice-form-label">骰子语法</div><input type="text" id="contest-custom-dice-init" class="acu-dice-input" value="" placeholder="留空=1d100, 1d20+5..."></div>' +
      '<div></div>' +
      '</div>' +
      '<div id="contest-init-values-row" class="acu-dice-form-row cols-3">' +
      '<div id="contest-init-attr-wrapper"><div class="acu-dice-form-label" id="contest-init-attr-label">属性值</div><input type="text" class="acu-dice-input" id="contest-init-value" value="' +
      (passedInitiatorValue !== undefined ? passedInitiatorValue : '') +
      '" placeholder="留空=50%最大值"></div>' +
      '<div id="contest-init-skill-mod-wrapper" style="display:none;"><div class="acu-dice-form-label" id="contest-init-skill-mod-label">技能加值</div><input type="text" class="acu-dice-input" id="contest-init-skill-mod" placeholder="留空=0"></div>' +
      '<div id="contest-init-mod-wrapper"><div class="acu-dice-form-label" id="contest-init-mod-label">修正值</div><input type="text" class="acu-dice-input" id="contest-init-mod" placeholder="留空=0"></div>' +
      '<div id="contest-init-target-wrapper"><div class="acu-dice-form-label" id="contest-init-target-label">目标值</div><input type="text" class="acu-dice-input" id="contest-init-target" value="" placeholder="自动"></div>' +
      '</div>' +
      '</div>' +
      '<div id="contest-init-custom-fields"></div>' +
      '<div id="init-attr-buttons" class="acu-dice-quick-compact">' +
      buildAttrButtons(playerAttrs, 'init') +
      '</div>' +
      '<div class="acu-dice-section-title" id="contest-opp-char-buttons-section"><span><i class="fa-solid fa-user"></i> 对抗方</span><div id="contest-opp-char-buttons" class="acu-dice-quick-inline"></div></div>' +
      '<div id="contest-opp-params-section">' +
      '<div id="contest-opp-primary-row" class="acu-dice-form-row cols-2">' +
      '<div><div class="acu-dice-form-label">名字</div><input type="text" class="acu-dice-input" id="contest-opponent-display" value="' +
      escapeHtml(opponentName) +
      '" placeholder="对手"></div>' +
      '<div><div class="acu-dice-form-label"><span class="contest-attr-name-text">属性名</span><button type="button" class="acu-random-skill-btn" id="contest-opp-random-skill" title="随机技能"><i class="fa-solid fa-dice"></i></button></div><input type="text" class="acu-dice-input" id="contest-opp-name" value="" placeholder="同发起方"></div>' +
      '</div>' +
      // [调整] 对抗方骰子语法 (自定义模式时显示，半宽)
      '<div id="contest-opp-dice-syntax-row" class="acu-dice-form-row cols-2" style="display: none;">' +
      '<div><div class="acu-dice-form-label">骰子语法</div><input type="text" id="contest-custom-dice-opp" class="acu-dice-input" value="" placeholder="留空=同发起方"></div>' +
      '<div></div>' +
      '</div>' +
      '<div id="contest-opp-values-row" class="acu-dice-form-row cols-3">' +
      '<div id="contest-opp-attr-wrapper"><div class="acu-dice-form-label" id="contest-opp-attr-label">属性值</div><input type="text" class="acu-dice-input" id="contest-opp-value" value="' +
      (passedOpponentValue !== undefined ? passedOpponentValue : '') +
      '" placeholder="留空=50%最大值"></div>' +
      '<div id="contest-opp-skill-mod-wrapper" style="display:none;"><div class="acu-dice-form-label" id="contest-opp-skill-mod-label">技能加值</div><input type="text" class="acu-dice-input" id="contest-opp-skill-mod" placeholder="留空=0"></div>' +
      '<div id="contest-opp-mod-wrapper"><div class="acu-dice-form-label" id="contest-opp-mod-label">修正值</div><input type="text" class="acu-dice-input" id="contest-opp-mod" placeholder="留空=0"></div>' +
      '<div id="contest-opp-target-wrapper"><div class="acu-dice-form-label" id="contest-opp-target-label">目标值</div><input type="text" class="acu-dice-input" id="contest-opp-target" value="" placeholder="自动"></div>' +
      '</div>' +
      '</div>' +
      '<div id="contest-opp-custom-fields"></div>' +
      '<div id="opp-attr-buttons" class="acu-dice-quick-compact">' +
      buildAttrButtons(opponentAttrs, 'opp') +
      '</div>' +
      // [新增] 判定规则 (自定义模式时显示，只占一半宽度)
      '<div id="contest-custom-judge-row" class="acu-dice-form-row cols-2" style="display: none; margin-top: 8px;">' +
      '<div><div class="acu-dice-form-label">判定规则</div><select id="contest-custom-judge-rule" class="acu-dice-select">' +
      '<option value="higher">值大者胜</option>' +
      '<option value="lower">值小者胜</option>' +
      '<option value="rank">成功等级比较</option>' +
      '<option value="none">仅显示结果</option>' +
      '</select></div>' +
      '<div><div class="acu-dice-form-label">平手规则</div><select id="contest-custom-tie-rule" class="acu-dice-select">' +
      '<option value="initiator_lose">发起者失败</option>' +
      '<option value="tie" selected>平手</option>' +
      '<option value="initiator_win">发起者胜利</option>' +
      '</select></div>' +
      '</div>' +
      '<div id="contest-result-display" class="acu-contest-result-display">' +
      '<div class="acu-contest-result-inner">' +
      '<div id="contest-result-init" class="acu-contest-result-side"></div>' +
      '<span class="acu-contest-vs">VS</span>' +
      '<div id="contest-result-opp" class="acu-contest-result-side right"></div>' +
      '</div>' +
      '</div>' +
      '<button type="button" id="contest-roll-btn" class="acu-dice-roll-btn"><i class="fa-solid fa-dice"></i> 开始对抗！</button>' +
      '</div>' +
      '</div>';

    const panel = $(panelHtml);
    overlay.append(panel);
    $('body').append(overlay);
    bindTutorialButtonsIn(panel);

    // [新增] 构建角色快捷按钮 - 复用普通检定的样式规格
    const buildCharBtns = targetType => {
      const containerId = targetType === 'init' ? '#contest-init-char-buttons' : '#contest-opp-char-buttons';
      const $container = panel.find(containerId);
      let html = '';
      characterList.forEach(name => {
        const resolvedName = resolveCanonicalCharacterName(String(name));
        const displayName = replaceUserPlaceholders(String(resolvedName));
        const shortName = displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName;
        html +=
          '<button type="button" class="acu-dice-char-btn" data-char="' +
          escapeHtml(String(resolvedName)) +
          '" data-type="' +
          targetType +
          '" title="' +
          escapeHtml(displayName) +
          '">' +
          escapeHtml(shortName) +
          '</button>';
      });
      $container.html(html);
      $container.find('.acu-dice-char-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        const charName = $(this).data('char');
        const type = $(this).data('type');
        if (type === 'init') {
          panel.find('#contest-init-display').val(charName).trigger('change');
        } else {
          panel.find('#contest-opponent-display').val(charName).trigger('change');
        }
      });
    };

    // [新增] 重建属性快捷按钮
    const rebuildAttrBtns = (attrs, targetType) => {
      const containerId = targetType === 'init' ? '#init-attr-buttons' : '#opp-attr-buttons';
      const $container = panel.find(containerId);

      // 始终显示容器（即使没有属性数据，也要显示生成按钮）
      $container.show();

      let html = '';

      // 现有属性按钮
      if (attrs.length > 0) {
        attrs.forEach(attr => {
          html +=
            '<button type="button" class="acu-contest-attr-btn" data-val="' +
            attr.value +
            '" data-aname="' +
            escapeHtml(attr.name) +
            '" data-source="' +
            escapeHtml(attr.source || 'generic') +
            '" data-type="' +
            targetType +
            '">' +
            escapeHtml(attr.name) +
            ':' +
            attr.value +
            '</button>';
        });
      }

      // 生成属性按钮
      html +=
        '<button type="button" class="acu-contest-gen-attr-btn" data-type="' +
        targetType +
        '" aria-label="生成属性" title="生成属性"><i class="fa-solid fa-dice"></i></button>';

      // 清空属性按钮
      html +=
        '<button type="button" class="acu-contest-clear-attr-btn" data-type="' +
        targetType +
        '" aria-label="清空规则属性" title="清空规则属性"><i class="fa-solid fa-trash-alt"></i></button>';

      $container.html(html);

      // 绑定属性按钮点击事件
      $container.find('.acu-contest-attr-btn').click(function () {
        const val = $(this).attr('data-val');
        const aname = $(this).attr('data-aname');
        const source = String($(this).attr('data-source') || 'generic') as CharacterAttributeSource;
        const type = $(this).attr('data-type');

        if (type === 'init') {
          const targetInput = getContestAttrTargetInput('init', aname || '', source);
          panel.find(targetInput).val(val);
          panel.find('#contest-init-name').val(aname);
          panel.find(targetInput).trigger('change');
        } else {
          const targetInput = getContestAttrTargetInput('opp', aname || '', source);
          panel.find(targetInput).val(val);
          panel.find('#contest-opp-name').val(aname);
          panel.find(targetInput).trigger('change');
        }
      });

      // 绑定生成属性按钮点击事件
      $container.find('.acu-contest-gen-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const type = $btn.attr('data-type');

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // [修复] 临时禁用更新处理器，防止闪烁
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 对抗属性生成中，跳过自动刷新');
        };

        try {
          // 获取角色名
          let charName;
          if (type === 'init') {
            charName = panel.find('#contest-init-display').val().trim() || '<user>';
          } else {
            charName = panel.find('#contest-opponent-display').val().trim();
          }

          if (!charName) {
            if (window.toastr) window.toastr.warning('请先选择角色');
            return;
          }

          console.log('[DICE]ACU 对抗面板生成属性 for:', charName, 'type:', type);

          // 生成属性（使用激活的预设）
          const generated = generateRPGAttributes();

          // 兼容旧格式和新格式
          const baseAttrs = generated.base || generated;
          const specialAttrs = generated.special || {};

          // [修复] 分别写入基础属性和特有属性到对应的列
          const result = await writeAttributesToCharacter(charName, baseAttrs, false, specialAttrs);

          if (result.success) {
            // 刷新该方属性按钮
            const refreshedAttrs = getFullAttributesForCharacter(charName);
            rebuildAttrBtns(refreshedAttrs, type);
          }
        } catch (err) {
          console.error('[DICE]ACU 对抗面板生成属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('生成属性失败，未能把随机属性写回对抗角色表。', {
              suggestion: '请确认对应角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // [修复] 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });

      // 绑定清空属性按钮点击事件
      $container.find('.acu-contest-clear-attr-btn').click(async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        const type = $btn.attr('data-type');

        // 获取角色名
        let charName;
        if (type === 'init') {
          charName = panel.find('#contest-init-display').val().trim() || '<user>';
        } else {
          charName = panel.find('#contest-opponent-display').val().trim();
        }

        if (!charName) {
          if (window.toastr) window.toastr.warning('请先选择角色');
          return;
        }

        // 禁用按钮防止重复点击
        $btn.prop('disabled', true).css('opacity', '0.5');
        const originalHtml = $btn.html();
        $btn.html('<i class="fa-solid fa-spinner fa-spin"></i>');

        // 临时禁用更新处理器
        const originalHandler = UpdateController.handleUpdate;
        UpdateController.handleUpdate = () => {
          console.log('[DICE]ACU 清空属性中，跳过自动刷新');
        };

        try {
          console.log('[DICE]ACU 对抗面板清空属性 for:', charName, 'type:', type);

          const result = await clearPresetAttributesForCharacter(charName);

          if (result.success) {
            // 刷新该方属性按钮
            const refreshedAttrs = getFullAttributesForCharacter(charName);
            rebuildAttrBtns(refreshedAttrs, type);
          }
        } catch (err) {
          console.error('[DICE]ACU 对抗面板清空属性失败:', err);
          if (window.toastr)
            showActionableErrorToast('清空属性失败，未能清空对抗角色的属性列。', {
              suggestion: '请确认对应角色存在、属性列可写，并刷新表格数据后重试。',
            });
        } finally {
          // 恢复更新处理器
          UpdateController.handleUpdate = originalHandler;
          $btn.prop('disabled', false).css('opacity', '1').html(originalHtml);
        }
      });
    };

    // 初始化角色快捷按钮
    buildCharBtns('init');
    buildCharBtns('opp');
    // [新增] 发起方随机技能按钮
    panel.find('#contest-init-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-init-name').val(randomSkill).trigger('change');
    });

    // [新增] 对抗方随机技能按钮
    panel.find('#contest-opp-random-skill').click(function (e) {
      e.preventDefault();
      e.stopPropagation();
      const skillPool = getRandomSkillPool();
      var randomSkill = skillPool[Math.floor(Math.random() * skillPool.length)];
      panel.find('#contest-opp-name').val(randomSkill).trigger('change');
    });
    // 始终调用 rebuildAttrBtns 来绑定事件（即使属性为空也需要生成/清空按钮可用）
    const initAttrs = getFullAttributesForCharacter(passedInitiatorName || characterList[0] || '<user>');
    rebuildAttrBtns(initAttrs, 'init');
    const oppAttrs = getFullAttributesForCharacter(opponentName || '');
    rebuildAttrBtns(oppAttrs, 'opp');

    // 初始化下拉菜单
    initCustomDropdown(panel.find('#contest-init-display'), characterList);
    initCustomDropdown(panel.find('#contest-opponent-display'), characterList);
    initCustomDropdown(panel.find('#contest-init-name'), contestAttrList);
    initCustomDropdown(panel.find('#contest-opp-name'), contestAttrList);
    addClearButton(
      panel,
      '#contest-init-display, #contest-init-name, #contest-init-value, #contest-init-skill-mod, #contest-init-mod, #contest-init-target, #contest-opponent-display, #contest-opp-name, #contest-opp-value, #contest-opp-skill-mod, #contest-opp-mod, #contest-opp-target, #contest-custom-dice-init, #contest-custom-dice-opp',
    );

    // [新增] 高级预设选择器（对抗检定）
    let currentContestAdvancedPreset: AdvancedDicePreset | LegacyAdvancedDicePreset | null = null;

    const getContestAttrTargetInput = (
      party: 'init' | 'opp',
      attrName: string,
      attrSource?: CharacterAttributeSource,
    ): string => {
      const target = resolveQuickSelectTarget(attrName, attrSource, currentContestAdvancedPreset, 'contest');
      if (target === 'skillMod') {
        return party === 'init' ? '#contest-init-skill-mod' : '#contest-opp-skill-mod';
      }
      if (target === 'mod') {
        return party === 'init' ? '#contest-init-mod' : '#contest-opp-mod';
      }
      return party === 'init' ? '#contest-init-value' : '#contest-opp-value';
    };

    const applyContestAdvancedPreset = (presetId: string | null) => {
      // 获取关键DOM元素 - 使用新的wrapper ID
      const $initValuesRow = panel.find('#contest-init-values-row');
      const $oppValuesRow = panel.find('#contest-opp-values-row');
      const $initPrimaryRow = panel.find('#contest-init-primary-row');
      const $oppPrimaryRow = panel.find('#contest-opp-primary-row');
      const $initCustomFields = panel.find('#contest-init-custom-fields');
      const $oppCustomFields = panel.find('#contest-opp-custom-fields');

      const $initAttrWrapper = panel.find('#contest-init-attr-wrapper');
      const $initSkillModWrapper = panel.find('#contest-init-skill-mod-wrapper');
      const $initModWrapper = panel.find('#contest-init-mod-wrapper');
      const $initTargetWrapper = panel.find('#contest-init-target-wrapper');
      const $oppAttrWrapper = panel.find('#contest-opp-attr-wrapper');
      const $oppSkillModWrapper = panel.find('#contest-opp-skill-mod-wrapper');
      const $oppModWrapper = panel.find('#contest-opp-mod-wrapper');
      const $oppTargetWrapper = panel.find('#contest-opp-target-wrapper');

      const $initAttrLabel = panel.find('#contest-init-attr-label');
      const $initSkillModLabel = panel.find('#contest-init-skill-mod-label');
      const $oppAttrLabel = panel.find('#contest-opp-attr-label');
      const $oppSkillModLabel = panel.find('#contest-opp-skill-mod-label');
      const $initTargetLabel = panel.find('#contest-init-target-label');
      const $oppTargetLabel = panel.find('#contest-opp-target-label');
      const $initModLabel = panel.find('#contest-init-mod-label');
      const $oppModLabel = panel.find('#contest-opp-mod-label');

      const $initAttrInput = panel.find('#contest-init-value');
      const $oppAttrInput = panel.find('#contest-opp-value');
      const $initSkillModInput = panel.find('#contest-init-skill-mod');
      const $oppSkillModInput = panel.find('#contest-opp-skill-mod');
      const $initModInput = panel.find('#contest-init-mod');
      const $oppModInput = panel.find('#contest-opp-mod');

      // 辅助函数：更新值行的列数
      const updateRowColumns = ($row: JQuery, visibleCount: number) => {
        $row.removeClass('cols-2 cols-3');
        if (visibleCount <= 2) {
          $row.addClass('cols-2');
        } else {
          $row.addClass('cols-3');
        }
      };

      const buildContestCustomFieldCell = (
        field: Record<string, unknown>,
        party: 'init' | 'opp',
        extraClass = '',
      ): JQuery => {
        const fieldId = String(field.id || '');
        const fieldLabel = String(field.label || fieldId);
        const fieldType = String(field.type || 'text');
        let html = `<div class="${extraClass}">`;

        if (fieldType !== 'toggle') {
          html += `<div class="acu-dice-form-label">${escapeHtml(fieldLabel)}</div>`;
        } else {
          html += '<div class="acu-dice-form-label">&nbsp;</div>';
        }

        if (fieldType === 'select' && Array.isArray(field.options)) {
          html += `<select class="acu-dice-select acu-dice-custom-field-contest" data-id="${escapeHtml(fieldId)}" data-party="${party}">`;
          field.options.forEach(option => {
            const opt = option as Record<string, unknown>;
            const optValue = opt.value;
            const isSelected = optValue === field.defaultValue ? 'selected' : '';
            html += `<option value="${escapeHtml(String(optValue ?? ''))}" ${isSelected}>${escapeHtml(String(opt.label ?? optValue ?? ''))}</option>`;
          });
          html += '</select>';
        } else if (fieldType === 'toggle') {
          const isChecked = field.defaultValue ? 'checked' : '';
          html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
            <input type="checkbox" class="acu-dice-custom-field-contest" data-id="${escapeHtml(fieldId)}" data-party="${party}" ${isChecked} style="margin-right: 8px;">
            ${escapeHtml(fieldLabel)}
          </label>`;
        } else {
          const inputType = fieldType === 'number' ? 'number' : 'text';
          const defaultVal = field.defaultValue;
          const placeholderText =
            String(field.placeholder || '') ||
            (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
          html += `<input type="${inputType}" class="acu-dice-input acu-dice-custom-field-contest" data-id="${escapeHtml(fieldId)}" data-party="${party}" placeholder="${escapeHtml(placeholderText)}">`;
        }

        html += '</div>';
        return $(html);
      };

      // 辅助函数：渲染customFields
      const renderCustomFields = (
        $container: JQuery,
        party: 'init' | 'opp',
        preset: AdvancedDicePreset | LegacyAdvancedDicePreset,
      ) => {
        $container.empty();

        if (!('customFields' in preset) || !Array.isArray(preset.customFields) || preset.customFields.length === 0) {
          return;
        }

        // 应用 contestOverride 配置，过滤隐藏字段
        const visibleFields = preset.customFields.map(f => ({ ...f, ...f.contestOverride })).filter(f => !f.hidden);
        if (visibleFields.length === 0) return;

        const gridItems: string[] = visibleFields.map(field =>
          buildContestCustomFieldCell(field, party).prop('outerHTML'),
        );

        // 智能排版渲染网格
        // 布局规律：最后一行优先放3个字段，前面的行放2个字段
        // - 4个字段：2+2
        // - 5个字段：2+3
        // - 6个字段：3+3
        // - 7个字段：2+2+3
        // - 8个字段：2+3+3
        // - 9个字段：3+3+3
        const computeRowLayout = (total: number): number[] => {
          if (total <= 0) return [];
          if (total <= 2) return [2]; // 最少2列，避免 cols-1
          if (total === 3) return [3];
          if (total === 4) return [2, 2];
          if (total === 5) return [2, 3];
          if (total === 6) return [3, 3];
          // 7+ 字段：递归计算，最后一行放3个，剩余的递归处理
          return [...computeRowLayout(total - 3), 3];
        };

        const rowLayout = computeRowLayout(gridItems.length);
        let itemIndex = 0;
        for (const colCount of rowLayout) {
          const $row = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
          for (let j = 0; j < colCount; j++) {
            if (itemIndex < gridItems.length) {
              $row.append(gridItems[itemIndex]);
              itemIndex++;
            } else {
              $row.append('<div></div>');
            }
          }
          $container.append($row);
        }
      };

      const restoreDefaults = () => {
        // 恢复标签
        $initAttrLabel.text('属性值');
        $oppAttrLabel.text('属性值');
        $initSkillModLabel.text('技能加值');
        $oppSkillModLabel.text('技能加值');
        $initTargetLabel.text('目标值');
        $oppTargetLabel.text('目标值');
        $initModLabel.text('修正值');
        $oppModLabel.text('修正值');

        // 恢复"属性名"标签
        panel.find('.contest-attr-name-text').text('属性名');

        // 恢复所有字段显示
        $initAttrWrapper.show();
        $oppAttrWrapper.show();
        $initSkillModWrapper.hide();
        $oppSkillModWrapper.hide();
        $initTargetWrapper.show();
        $oppTargetWrapper.show();
        $initModWrapper.show();
        $oppModWrapper.show();

        // 恢复默认placeholder
        $initAttrInput.attr('placeholder', '留空=50%最大值');
        $oppAttrInput.attr('placeholder', '留空=50%最大值');
        $initSkillModInput.attr('placeholder', '留空=0');
        $oppSkillModInput.attr('placeholder', '留空=0');
        $initModInput.attr('placeholder', '留空=0');
        $oppModInput.attr('placeholder', '留空=0');

        // 重建值行结构（移除可能嵌入的customFields）
        const rebuildDefaultRow = (
          $row: JQuery,
          $attrWrapper: JQuery,
          $skillWrapper: JQuery,
          $modWrapper: JQuery,
          $targetWrapper: JQuery,
        ) => {
          // 移除所有非原始wrapper的元素
          $row.children().not($attrWrapper).not($skillWrapper).not($modWrapper).not($targetWrapper).remove();
          // 确保原始wrapper在行中且顺序正确
          if ($attrWrapper.parent()[0] !== $row[0]) $attrWrapper.detach().appendTo($row);
          if ($skillWrapper.parent()[0] !== $row[0]) $skillWrapper.detach().appendTo($row);
          if ($modWrapper.parent()[0] !== $row[0]) $modWrapper.detach().appendTo($row);
          if ($targetWrapper.parent()[0] !== $row[0]) $targetWrapper.detach().appendTo($row);
          // 恢复正确顺序
          $row.append($attrWrapper.detach());
          $row.append($skillWrapper.detach());
          $row.append($modWrapper.detach());
          $row.append($targetWrapper.detach());
        };

        rebuildDefaultRow($initValuesRow, $initAttrWrapper, $initSkillModWrapper, $initModWrapper, $initTargetWrapper);
        rebuildDefaultRow($oppValuesRow, $oppAttrWrapper, $oppSkillModWrapper, $oppModWrapper, $oppTargetWrapper);

        // 恢复3列布局
        updateRowColumns($initValuesRow, 3);
        updateRowColumns($oppValuesRow, 3);

        // 清空customFields
        $initPrimaryRow.find('.acu-contest-inline-custom').remove();
        $oppPrimaryRow.find('.acu-contest-inline-custom').remove();
        updateRowColumns($initPrimaryRow, 2);
        updateRowColumns($oppPrimaryRow, 2);
        $initCustomFields.empty();
        $oppCustomFields.empty();
      };

      if (!presetId) {
        currentContestAdvancedPreset = null;
        restoreDefaults();
        return;
      }

      const preset = AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
      if (!preset) {
        console.warn('[DICE] 对抗检定未找到预设:', presetId);
        restoreDefaults();
        return;
      }

      currentContestAdvancedPreset = preset;

      // [修复] 先恢复默认结构，确保从整合布局切换时字段不会丢失
      restoreDefaults();

      // 获取标签和placeholder配置
      const attrLabel = preset.attribute?.label || '属性值';
      const skillModLabel = preset.skillMod?.label || '技能加值';
      const dcLabel = preset.dc?.label || '目标值';
      const modLabel = preset.mod?.label || '修正值';
      const attrPlaceholder = preset.attribute?.placeholder || '留空=50%最大值';
      const skillModPlaceholder = preset.skillMod?.placeholder || '留空=0';
      const modPlaceholder = preset.mod?.placeholder || '留空=0';

      // 更新标签
      $initAttrLabel.text(attrLabel);
      $oppAttrLabel.text(attrLabel);
      $initSkillModLabel.text(skillModLabel);
      $oppSkillModLabel.text(skillModLabel);
      $initTargetLabel.text(dcLabel);
      $oppTargetLabel.text(dcLabel);
      $initModLabel.text(modLabel);
      $oppModLabel.text(modLabel);

      // 更新"属性名"标签（如Fate使用"技能/风格"）
      panel.find('.contest-attr-name-text').text(preset.attributeName?.label || '属性名');

      // 更新placeholder
      $initAttrInput.attr('placeholder', attrPlaceholder);
      $oppAttrInput.attr('placeholder', attrPlaceholder);
      $initSkillModInput.attr('placeholder', skillModPlaceholder);
      $oppSkillModInput.attr('placeholder', skillModPlaceholder);
      $initModInput.attr('placeholder', modPlaceholder);
      $oppModInput.attr('placeholder', modPlaceholder);

      // 计算可见字段数量
      const hideDcInContest = preset.contestRule?.hideDc === true || preset.dc?.hidden === true;
      const hideModInContest = preset.contestRule?.hideMod === true || preset.mod?.hidden === true;
      const hideSkillModInContest =
        !preset.skillMod || preset.contestRule?.hideSkillMod === true || preset.skillMod.hidden === true;

      // 属性值始终显示
      $initAttrWrapper.show();
      $oppAttrWrapper.show();

      // 控制技能加值显隐
      if (hideSkillModInContest) {
        $initSkillModWrapper.hide();
        $oppSkillModWrapper.hide();
      } else {
        $initSkillModWrapper.show();
        $oppSkillModWrapper.show();
      }

      // 控制目标值显隐
      if (hideDcInContest) {
        $initTargetWrapper.hide();
        $oppTargetWrapper.hide();
      } else {
        $initTargetWrapper.show();
        $oppTargetWrapper.show();
      }

      // 控制修正值显隐
      if (hideModInContest) {
        $initModWrapper.hide();
        $oppModWrapper.hide();
      } else {
        $initModWrapper.show();
        $oppModWrapper.show();
      }

      // [优化] 智能布局：将基础字段和customFields整合计算
      // 收集可见的customFields数量（应用 contestOverride）
      const visibleContestFields =
        'customFields' in preset && Array.isArray(preset.customFields)
          ? preset.customFields.map(f => ({ ...f, ...f.contestOverride })).filter(f => !f.hidden)
          : [];
      const customFieldCount = visibleContestFields.length;

      // 计算基础可见字段数
      let baseVisibleCount = 1; // 属性值始终可见
      if (!hideSkillModInContest) baseVisibleCount++;
      if (!hideModInContest) baseVisibleCount++;
      if (!hideDcInContest) baseVisibleCount++;

      // 决定布局策略
      const totalFields = baseVisibleCount + customFieldCount;

      const useThreeByThreeWithPrimaryRow = customFieldCount === 1 && baseVisibleCount === 3;

      if (useThreeByThreeWithPrimaryRow) {
        const customField = visibleContestFields[0];
        const renderPrimaryInlineField = ($row: JQuery, party: 'init' | 'opp') => {
          $row.find('.acu-contest-inline-custom').remove();
          updateRowColumns($row, 3);
          $row.append(buildContestCustomFieldCell(customField, party, 'acu-contest-inline-custom'));
        };

        renderPrimaryInlineField($initPrimaryRow, 'init');
        renderPrimaryInlineField($oppPrimaryRow, 'opp');
        updateRowColumns($initValuesRow, 3);
        updateRowColumns($oppValuesRow, 3);
        $initCustomFields.empty();
        $oppCustomFields.empty();
      } else {
        $initPrimaryRow.find('.acu-contest-inline-custom').remove();
        $oppPrimaryRow.find('.acu-contest-inline-custom').remove();
        updateRowColumns($initPrimaryRow, 2);
        updateRowColumns($oppPrimaryRow, 2);

        // 如果总字段数 <= 4，尝试将所有内容整合布局
        // 对于 COC7: 1 (技能值) + 3 (奖励骰/惩罚骰/最低成功等级) = 4，使用整合布局
        // 对于 FATE: 2 (技能等级/修正值) + 0 = 2，使用整合布局
        // 对于 DND5e: 3 (属性值/修正值/DC) + 1 (优势/劣势) = 4，使用整合布局
        if (totalFields <= 4 && customFieldCount > 0 && baseVisibleCount < 3) {
          // 将 customFields 嵌入到值行中
          // 首先清空单独的 customFields 容器
          $initCustomFields.empty();
          $oppCustomFields.empty();

          // 重建值行内容，包含 customFields
          const buildIntegratedRow = ($row: JQuery, party: 'init' | 'opp') => {
            // 保留属性值 wrapper
            const $attrWrapper = party === 'init' ? $initAttrWrapper : $oppAttrWrapper;
            const $modWrapper = party === 'init' ? $initModWrapper : $oppModWrapper;
            const $targetWrapper = party === 'init' ? $initTargetWrapper : $oppTargetWrapper;

            // 收集当前可见的元素
            const visibleItems: JQuery[] = [];

            // 先从任意父容器中分离基础 wrapper，避免被后续 empty() 误删
            const $skillWrapper = party === 'init' ? $initSkillModWrapper : $oppSkillModWrapper;

            [$attrWrapper, $skillWrapper, $modWrapper, $targetWrapper].forEach($base => {
              if ($base.length > 0 && $base.parent().length > 0) {
                $base.detach();
              }
            });

            // 属性值始终可见
            visibleItems.push($attrWrapper);

            // 技能加值（如果可见）
            if (!hideSkillModInContest) {
              visibleItems.push($skillWrapper);
            }

            // 修正值（如果可见）
            if (!hideModInContest) {
              visibleItems.push($modWrapper);
            }

            // 目标值（如果可见）
            if (!hideDcInContest) {
              visibleItems.push($targetWrapper);
            }

            // 添加 customFields（应用 contestOverride）
            if ('customFields' in preset && Array.isArray(preset.customFields)) {
              const visibleFields = preset.customFields
                .map(f => ({ ...f, ...f.contestOverride }))
                .filter(f => !f.hidden);
              visibleFields.forEach(field => {
                let html = '<div>';

                // 标签
                if (field.type !== 'toggle') {
                  html += `<div class="acu-dice-form-label">${escapeHtml(field.label || field.id)}</div>`;
                } else {
                  html += '<div class="acu-dice-form-label">&nbsp;</div>';
                }

                // 控件
                if (field.type === 'select' && field.options) {
                  html += `<select class="acu-dice-select acu-dice-custom-field-contest" data-id="${escapeHtml(field.id)}" data-party="${party}">`;
                  field.options.forEach(opt => {
                    const isSelected = opt.value === field.defaultValue ? 'selected' : '';
                    html += `<option value="${escapeHtml(String(opt.value))}" ${isSelected}>${escapeHtml(opt.label)}</option>`;
                  });
                  html += '</select>';
                } else if (field.type === 'toggle') {
                  const isChecked = field.defaultValue ? 'checked' : '';
                  html += `<label style="display: flex; align-items: center; cursor: pointer; height: 32px;">
                  <input type="checkbox" class="acu-dice-custom-field-contest" data-id="${escapeHtml(field.id)}" data-party="${party}" ${isChecked} style="margin-right: 8px;">
                  ${escapeHtml(field.label || field.id)}
                </label>`;
                } else {
                  const type = field.type === 'number' ? 'number' : 'text';
                  // [修复] 使用 placeholder 而不是 value 显示默认值
                  const defaultVal = field.defaultValue;
                  const placeholderText =
                    field.placeholder || (defaultVal !== undefined && defaultVal !== '' ? `留空=${defaultVal}` : '');
                  html += `<input type="${type}" class="acu-dice-input acu-dice-custom-field-contest" data-id="${escapeHtml(field.id)}" data-party="${party}"
                  placeholder="${escapeHtml(placeholderText)}">`;
                }

                html += '</div>';
                visibleItems.push($(html) as JQuery);
              });
            }

            // 清空行和 customFields 容器
            $row.empty();
            const $customContainer = party === 'init' ? $initCustomFields : $oppCustomFields;
            $customContainer.empty();

            // 智能排版：根据字段数量决定布局方式
            // 布局规律：最后一行优先放3个字段，前面的行放2个字段
            // - 4个字段：2+2
            // - 5个字段：2+3
            // - 6个字段：3+3
            // - 7个字段：2+2+3
            // - 8个字段：2+3+3
            // - 9个字段：3+3+3
            const computeRowLayout = (total: number): number[] => {
              if (total <= 0) return [];
              if (total <= 2) return [2]; // 最少2列，避免 cols-1
              if (total === 3) return [3];
              if (total === 4) return [2, 2];
              if (total === 5) return [2, 3];
              if (total === 6) return [3, 3];
              // 7+ 字段：递归计算，最后一行放3个，剩余的递归处理
              return [...computeRowLayout(total - 3), 3];
            };

            const appendItemTo = ($target: JQuery, $item: JQuery) => {
              if ($item.parent().length > 0) {
                $item.detach().appendTo($target);
              } else {
                $target.append($item);
              }
            };

            const rowLayout = computeRowLayout(visibleItems.length);
            let itemIndex = 0;

            // 第一行放在 $row 中
            if (rowLayout.length > 0) {
              const firstRowCols = rowLayout[0];
              for (let j = 0; j < firstRowCols; j++) {
                if (itemIndex < visibleItems.length) {
                  appendItemTo($row, visibleItems[itemIndex]);
                  itemIndex++;
                } else {
                  $row.append('<div></div>');
                }
              }
              updateRowColumns($row, firstRowCols);

              // 剩余行放在 $customContainer 中
              for (let rowIdx = 1; rowIdx < rowLayout.length; rowIdx++) {
                const colCount = rowLayout[rowIdx];
                const $gridRow = $(`<div class="acu-dice-form-row cols-${colCount}"></div>`);
                for (let j = 0; j < colCount; j++) {
                  if (itemIndex < visibleItems.length) {
                    appendItemTo($gridRow, visibleItems[itemIndex]);
                    itemIndex++;
                  } else {
                    $gridRow.append('<div></div>');
                  }
                }
                $customContainer.append($gridRow);
              }
            }

            // 不可见基础字段也保留在值行中（隐藏），防止后续切换时 DOM 丢失
            if (hideSkillModInContest) {
              if ($skillWrapper.parent().length === 0 || $skillWrapper.parent()[0] !== $row[0]) {
                $skillWrapper.detach().appendTo($row);
              }
              $skillWrapper.hide();
            }
            if (hideModInContest) {
              if ($modWrapper.parent().length === 0 || $modWrapper.parent()[0] !== $row[0]) {
                $modWrapper.detach().appendTo($row);
              }
              $modWrapper.hide();
            }
            if (hideDcInContest) {
              if ($targetWrapper.parent().length === 0 || $targetWrapper.parent()[0] !== $row[0]) {
                $targetWrapper.detach().appendTo($row);
              }
              $targetWrapper.hide();
            }
          };

          buildIntegratedRow($initValuesRow, 'init');
          buildIntegratedRow($oppValuesRow, 'opp');
        } else {
          // 使用分离布局：基础字段在值行，customFields 在单独区域
          updateRowColumns($initValuesRow, baseVisibleCount);
          updateRowColumns($oppValuesRow, baseVisibleCount);

          // 渲染 customFields 到单独区域
          renderCustomFields($initCustomFields, 'init', preset);
          renderCustomFields($oppCustomFields, 'opp', preset);
        }
      }

      // 防御性兜底：切换预设后确保“修正值”输入框在应显示时不会丢失
      if (!hideSkillModInContest) {
        if ($initSkillModWrapper.parent().length === 0) {
          $initSkillModWrapper.appendTo($initValuesRow);
        }
        if ($oppSkillModWrapper.parent().length === 0) {
          $oppSkillModWrapper.appendTo($oppValuesRow);
        }
        $initSkillModWrapper.show();
        $oppSkillModWrapper.show();
      }

      if (!hideModInContest) {
        if ($initModWrapper.parent().length === 0) {
          $initModWrapper.appendTo($initValuesRow);
        }
        if ($oppModWrapper.parent().length === 0) {
          $oppModWrapper.appendTo($oppValuesRow);
        }
        $initModWrapper.show();
        $oppModWrapper.show();
      }

      // 更新骰子表达式
      panel.find('#contest-dice-type').val(preset.diceExpression);
      panel.find('#contest-custom-dice-init').val(preset.diceExpression);
      panel.find('#contest-custom-dice-opp').val('');
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      // [修复] 根据 presetId 激活正确的按钮，而不是总是激活 custom 按钮
      if (presetId) {
        panel.find(`.acu-dice-quick-preset-btn[data-preset-id="${presetId}"]`).addClass('active');
      }

      // [新增] 为动态生成的 customFields 输入框添加清除按钮
      addClearButton(
        $initCustomFields,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      addClearButton(
        $oppCustomFields,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      addClearButton(
        $initValuesRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      addClearButton(
        $oppValuesRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      addClearButton(
        $initPrimaryRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );
      addClearButton(
        $oppPrimaryRow,
        '.acu-dice-custom-field-contest[type="text"], .acu-dice-custom-field-contest[type="number"]',
      );

      console.log(
        '[DICE] 对抗检定应用高级预设:',
        preset.name,
        '总字段数:',
        totalFields,
        '基础字段:',
        baseVisibleCount,
        'customFields:',
        customFieldCount,
      );
    };

    // [统一UI] 初始化时根据活跃预设高亮对应按钮并应用配置
    const savedContestPreset = AdvancedDicePresetManager.getActivePreset();
    const savedSupportedContestPreset =
      savedContestPreset && AdvancedDicePresetManager.supportsContest(savedContestPreset) ? savedContestPreset : null;
    const defaultContestPresetId = contestAvailablePresets.length > 0 ? contestAvailablePresets[0].id : null;
    const savedPresetId = localStorage.getItem(STORAGE_KEY_LAST_PRESET);

    if (savedPresetId === '__custom__') {
      // [修复] 如果保存的是自定义模式，激活自定义按钮并显示自定义UI
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      panel.find('.acu-dice-quick-preset-btn[data-dice="custom"]').addClass('active');
      panel.find('#contest-init-dice-syntax-row').show();
      panel.find('#contest-opp-dice-syntax-row').show();
      panel.find('#contest-custom-judge-row').show();
      panel.find('#contest-init-values-row, #contest-opp-values-row').hide();
      panel.find('#contest-init-custom-fields, #contest-opp-custom-fields').hide();
      // [修复] 进入自定义模式时也重置对抗预设状态，避免后续切换字段丢失
      applyContestAdvancedPreset(null);
    } else if (savedSupportedContestPreset) {
      // 高亮对应的预设按钮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      const $matchedBtn = panel.find(`.acu-dice-quick-preset-btn[data-preset-id="${savedSupportedContestPreset.id}"]`);
      if ($matchedBtn.length) {
        $matchedBtn.addClass('active');
      }
      applyContestAdvancedPreset(savedSupportedContestPreset.id);
    } else if (defaultContestPresetId) {
      // 当前活跃预设不支持对抗时，自动回退到首个可用对抗预设
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      const $defaultBtn = panel.find(`.acu-dice-quick-preset-btn[data-preset-id="${defaultContestPresetId}"]`);
      if ($defaultBtn.length) {
        $defaultBtn.addClass('active');
        panel.find('#contest-dice-type').val(($defaultBtn.data('dice') as string) || '1d100');
      }
      applyContestAdvancedPreset(defaultContestPresetId);
    }

    // 发起方角色变化时更新属性
    panel.find('#contest-init-display').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim() || '<user>';
      const newAttrList = getAttributesForCharacter(charName);
      initCustomDropdown(panel.find('#contest-init-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
      const fullAttrs = getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'init');
    });

    // 对抗方角色变化时更新属性
    panel.find('#contest-opponent-display').on('change.acuattr input.acuattr', function () {
      const charName = $(this).val().trim();
      const newAttrList = getAttributesForCharacter(charName);
      initCustomDropdown(panel.find('#contest-opp-name'), newAttrList.length > 0 ? newAttrList : contestAttrList);
      const fullAttrs = getFullAttributesForCharacter(charName);
      rebuildAttrBtns(fullAttrs, 'opp');
    });

    // 发起方属性名变化时自动填入属性值
    panel.find('#contest-init-name').on('change.acuval', function () {
      const charName = panel.find('#contest-init-display').val().trim() || '<user>';
      const attrName = $(this).val().trim();
      const attrEntry = getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const targetInput = getContestAttrTargetInput('init', attrEntry.name, attrEntry.source);
        panel.find(targetInput).val(attrEntry.value).trigger('change');
      }
    });

    // 对抗方属性名变化时自动填入属性值
    panel.find('#contest-opp-name').on('change.acuval', function () {
      const charName = panel.find('#contest-opponent-display').val().trim();
      const attrName = $(this).val().trim();
      const attrEntry = getAttributeEntryForCharacter(charName, attrName);
      if (attrEntry) {
        const targetInput = getContestAttrTargetInput('opp', attrEntry.name, attrEntry.source);
        panel.find(targetInput).val(attrEntry.value).trigger('change');
      }
    });

    // 骰子预设切换
    panel.find('.acu-dice-quick-preset-btn').click(function () {
      const newDice = $(this).data('dice');
      // 自定义按钮有单独处理，这里跳过
      if (newDice === 'custom') return;

      // [新增] 检查预设是否支持对抗检定
      const presetId = $(this).data('preset-id') as string | undefined;
      if (presetId && !AdvancedDicePresetManager.supportsContest(presetId)) {
        const preset = AdvancedDicePresetManager.getAllPresets().find(p => p.id === presetId);
        toastr.warning(`${preset?.name || presetId} 规则不支持对抗检定`);
        return; // 不切换预设，保持当前状态
      }

      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      $(this).addClass('active');
      panel.find('#contest-dice-type').val(newDice);

      // [修复] 隐藏自定义模式字段区（使用新的元素ID）
      panel.find('#contest-init-dice-syntax-row').hide();
      panel.find('#contest-opp-dice-syntax-row').hide();
      panel.find('#contest-custom-judge-row').hide();
      panel.find('#contest-init-values-row, #contest-opp-values-row').show();
      panel.find('#contest-init-custom-fields, #contest-opp-custom-fields').show();

      // [统一UI] 如果按钮有 data-preset-id，直接应用高级预设配置
      if (presetId) {
        AdvancedDicePresetManager.setActivePreset(presetId);
        applyContestAdvancedPreset(presetId);
      } else {
        // 没有预设ID时清除高级预设
        AdvancedDicePresetManager.setActivePreset(null);
        applyContestAdvancedPreset(null);
      }

      // 保存骰子类型
      saveDiceConfig({ lastDiceType: newDice });
    });

    // 自定义骰子按钮点击事件
    panel.find('.acu-dice-quick-preset-btn[data-dice="custom"]').click(function () {
      // 立即高亮自定义按钮，取消其他按钮高亮
      panel.find('.acu-dice-quick-preset-btn').removeClass('active');
      $(this).addClass('active');

      // [修复] 保存自定义模式状态（与普通检定面板保持一致）
      AdvancedDicePresetManager.setActivePreset(null);
      localStorage.setItem(STORAGE_KEY_LAST_PRESET, '__custom__');

      // [修复] 重置对抗检定预设布局（自定义模式会隐藏区域，但不应留下上一次整合布局残留）
      applyContestAdvancedPreset(null);

      // [修复] 显示自定义模式字段区（使用新的元素ID）
      panel.find('#contest-init-dice-syntax-row').show();
      panel.find('#contest-opp-dice-syntax-row').show();
      panel.find('#contest-custom-judge-row').show();
      panel.find('#contest-init-values-row, #contest-opp-values-row').hide();
      panel.find('#contest-init-custom-fields, #contest-opp-custom-fields').hide();
    });

    // 掷骰函数 - 使用 rollComplexDiceExpression 支持复合表达式
    const rollDice = function (formula) {
      const rollResult = rollComplexDiceExpression(formula);
      const total = rollResult.total;
      if (Number.isNaN(total)) return { total: 0, rolls: [], sides: 100 };
      // 尝试从公式中提取基本信息用于显示
      const basicMatch = formula.match(/^(\d*)d(\d+|F)/i);
      const sidesStr = basicMatch ? basicMatch[2] : '100';
      const sides = sidesStr.toUpperCase() === 'F' ? 3 : parseInt(sidesStr, 10);
      return { total, rolls: [], sides };
    };

    const resolveContest = function (
      preset: AdvancedDicePreset,
      initOutcome: OutcomeLevel,
      oppOutcome: OutcomeLevel,
      initValue: number,
      oppValue: number,
      initAttr: number,
      oppAttr: number,
    ): 'initiator' | 'opponent' | 'tie' {
      const contestRule = preset.contestRule;

      if (!contestRule) {
        if (initValue > oppValue) return 'initiator';
        if (oppValue > initValue) return 'opponent';
        return 'tie';
      }

      let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
      const contestMode = contestRule.mode ?? 'custom'; // 默认自定义模式，保持旧行为

      switch (contestMode) {
        case 'rank': {
          const initRank = initOutcome.contestRank ?? 50;
          const oppRank = oppOutcome.contestRank ?? 50;
          if (initRank > oppRank) winner = 'initiator';
          else if (oppRank > initRank) winner = 'opponent';
          break;
        }
        case 'value':
        case 'margin': {
          // 余量模式裁决与 value 相同
          if (initValue > oppValue) winner = 'initiator';
          else if (oppValue > initValue) winner = 'opponent';
          break;
        }
        case 'custom': {
          if (contestRule.customExpr) {
            const context = {
              $initValue: initValue,
              $oppValue: oppValue,
              $initRank: initOutcome.contestRank ?? 50,
              $oppRank: oppOutcome.contestRank ?? 50,
            };
            const conditionResult: { success: boolean; value?: number | boolean; error?: string } = evaluateCondition(
              contestRule.customExpr,
              context,
            );
            if (conditionResult.success) {
              const isMatch =
                typeof conditionResult.value === 'number'
                  ? conditionResult.value !== 0
                  : Boolean(conditionResult.value);
              winner = isMatch ? 'initiator' : 'opponent';
            } else {
              console.warn('[DICE] 对抗判定自定义表达式失败:', conditionResult.error);
            }
          }
          break;
        }
      }

      const tieBreakers =
        Array.isArray(contestRule.tieBreakers) && contestRule.tieBreakers.length > 0
          ? contestRule.tieBreakers
          : contestRule.tieBreaker
            ? [contestRule.tieBreaker]
            : [];

      if (winner === 'tie' && tieBreakers.length > 0) {
        // 链式平局处理：按顺序尝试直到分出胜负
        for (const tieBreaker of tieBreakers) {
          if (winner !== 'tie') break;
          switch (tieBreaker) {
            case 'higher_attr':
              if (initAttr > oppAttr) winner = 'initiator';
              else if (oppAttr > initAttr) winner = 'opponent';
              break;
            case 'initiator_wins':
              winner = 'initiator';
              break;
            case 'reroll':
              // 重投由外层触发，此处保持平局继续后续规则
              break;
          }
        }
      }

      return winner;
    };

    // [新增] 自定义模式对抗掷骰逻辑
    const performCustomContestRoll = function () {
      const $btn = panel.find('#contest-roll-btn');

      // 读取自定义模式字段
      const initDiceExpr = panel.find('#contest-custom-dice-init').val().trim() || '1d100';
      const oppDiceExpr = panel.find('#contest-custom-dice-opp').val().trim() || initDiceExpr;
      const judgeRule = panel.find('#contest-custom-judge-rule').val() as string;
      const tieRule = (panel.find('#contest-custom-tie-rule').val() as string) ?? 'tie';

      // 读取双方信息
      try {
        const rawDataForAlias = getCachedRawData() || getTableData();
        if (rawDataForAlias) {
          NameAliasRegistry.rebuild(processJsonData(rawDataForAlias || {}));
        }
      } catch (error) {
        console.warn('[DICE] 对抗别名映射刷新失败:', error);
      }
      const initNameRaw = panel.find('#contest-init-display').val().trim() || '<user>';
      const initName = resolveCanonicalCharacterName(initNameRaw);
      const initAttrName = panel.find('#contest-init-name').val().trim() || '自由检定';
      const oppNameRaw = panel.find('#contest-opponent-display').val().trim() || '对手';
      const oppName = resolveCanonicalCharacterName(oppNameRaw);
      const oppAttrName = panel.find('#contest-opp-name').val().trim() || initAttrName;

      // 掷骰
      const initRoll = rollComplexDiceExpression(initDiceExpr);
      const oppRoll = rollComplexDiceExpression(oppDiceExpr);

      if (isNaN(initRoll.total) || isNaN(oppRoll.total)) {
        if (window.toastr) {
          const errorExpr = isNaN(initRoll.total) ? initDiceExpr : oppDiceExpr;
          showActionableErrorToast(`骰子语法错误: ${errorExpr}`, {
            suggestion: '请检查对抗检定双方的骰子表达式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        }
        return;
      }

      const initTotal = initRoll.total;
      const oppTotal = oppRoll.total;

      // 判定胜负
      let winner: 'initiator' | 'opponent' | 'tie' = 'tie';
      switch (judgeRule) {
        case 'higher':
          if (initTotal > oppTotal) winner = 'initiator';
          else if (oppTotal > initTotal) winner = 'opponent';
          else {
            // 平手情况，使用 tieRule
            if (tieRule === 'initiator_win') winner = 'initiator';
            else if (tieRule === 'initiator_lose') winner = 'opponent';
            // tieRule === 'tie' 时保持 winner = 'tie'
          }
          break;
        case 'lower':
          if (initTotal < oppTotal) winner = 'initiator';
          else if (oppTotal < initTotal) winner = 'opponent';
          else {
            if (tieRule === 'initiator_win') winner = 'initiator';
            else if (tieRule === 'initiator_lose') winner = 'opponent';
          }
          break;
        case 'rank':
          if (initTotal > oppTotal) winner = 'initiator';
          else if (oppTotal > initTotal) winner = 'opponent';
          else {
            if (tieRule === 'initiator_win') winner = 'initiator';
            else if (tieRule === 'initiator_lose') winner = 'opponent';
          }
          break;
        case 'none':
          break;
      }

      const winnerText =
        winner === 'initiator'
          ? `${replaceUserPlaceholders(initName)} 获胜`
          : winner === 'opponent'
            ? `${replaceUserPlaceholders(oppName)} 获胜`
            : judgeRule === 'none'
              ? '无判定'
              : '平局';

      const contestTitle = initAttrName === oppAttrName ? initAttrName : `${initAttrName} vs ${oppAttrName}`;
      const compareSymbol = judgeRule === 'lower' ? '<' : '>';
      let compareExpr = `${initTotal} ${compareSymbol} ${oppTotal}`;
      if (winner === 'tie' || judgeRule === 'none') {
        compareExpr = `${initTotal} = ${oppTotal}`;
      }

      // 生成输出文本（单行，避免冗余换行）
      const outputText = `<meta:检定结果>【${contestTitle}】对抗检定：${replaceUserPlaceholders(initName)}(${initDiceExpr})=${initTotal}，${replaceUserPlaceholders(oppName)}(${oppDiceExpr})=${oppTotal}，判定 ${compareExpr}，${winnerText}</meta:检定结果>`;

      // 插入到输入框
      smartInsertToTextarea(outputText, 'dice');

      // 更新结果显示
      const diceCfg = getDiceConfig();
      const hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;

      const initDisplayRoll = hideDiceResultFromUser ? '？？' : initTotal;
      const oppDisplayRoll = hideDiceResultFromUser ? '？？' : oppTotal;
      const showOutcome = judgeRule !== 'none' && !hideDiceResultFromUser;
      const initOutcomeText = showOutcome ? (winner === 'tie' ? '平局' : winner === 'initiator' ? '胜' : '负') : '';
      const oppOutcomeText = showOutcome ? (winner === 'tie' ? '平局' : winner === 'opponent' ? '胜' : '负') : '';

      panel.find('#contest-result-init').html(`
        <div class="acu-contest-result-name">${escapeHtml(replaceUserPlaceholders(initName))}</div>
        <div class="acu-contest-result-roll">${initDisplayRoll}</div>
        ${showOutcome ? `<div class="acu-contest-result-outcome">${initOutcomeText}</div>` : ''}
      `);

      panel.find('#contest-result-opp').html(`
        <div class="acu-contest-result-name">${escapeHtml(replaceUserPlaceholders(oppName))}</div>
        <div class="acu-contest-result-roll">${oppDisplayRoll}</div>
        ${showOutcome ? `<div class="acu-contest-result-outcome">${oppOutcomeText}</div>` : ''}
      `);

      // 高亮胜者
      panel.find('#contest-result-init').removeClass('winner loser');
      panel.find('#contest-result-opp').removeClass('winner loser');
      if (!hideDiceResultFromUser && judgeRule !== 'none') {
        if (winner === 'initiator') {
          panel.find('#contest-result-init').addClass('winner');
          panel.find('#contest-result-opp').addClass('loser');
        } else if (winner === 'opponent') {
          panel.find('#contest-result-init').addClass('loser');
          panel.find('#contest-result-opp').addClass('winner');
        }
      }

      // 显示结果区
      panel.find('#contest-result-display').show();

      // 更新按钮显示重投
      $btn.html(`
        <div class="acu-dice-result-display">
          <span>${hideDiceResultFromUser ? '？？' : winnerText}</span>
          <button type="button" class="dice-retry-btn acu-dice-retry-btn" aria-label="重新投骰" title="重新投骰">
            <i class="fa-solid fa-rotate-right"></i>
          </button>
        </div>
      `);

      // 绑定重投按钮
      $btn.off('click', '.dice-retry-btn').on('click', '.dice-retry-btn', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performCustomContestRoll();
      });

      const winnerSide: 'left' | 'right' | 'tie' =
        winner === 'initiator' ? 'left' : winner === 'opponent' ? 'right' : 'tie';
      const customContestResult: AcuDice.ContestResult = {
        left: {
          name: initName,
          attribute: initAttrName,
          roll: initTotal,
          target: 0,
          successLevel: winner === 'initiator' ? 1 : winner === 'tie' ? 0 : -1,
        },
        right: {
          name: oppName,
          attribute: oppAttrName,
          roll: oppTotal,
          target: 0,
          successLevel: winner === 'opponent' ? 1 : winner === 'tie' ? 0 : -1,
        },
        winner: winnerSide,
        message: winnerText,
      };

      const customContestWithTimestamp = {
        ...customContestResult,
        timestamp: Date.now(),
        detailId: `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        detailLines: [
          `发起方: ${initName} / 对抗方: ${oppName}`,
          `属性: ${initAttrName} vs ${oppAttrName}`,
          `公式: ${initDiceExpr} vs ${oppDiceExpr}`,
          `掷骰: ${initTotal} vs ${oppTotal}`,
          `判定规则: ${judgeRule}`,
          `平手规则: ${tieRule}`,
          `判定表达式: ${compareExpr}`,
          `结果: ${winnerText}`,
        ],
      };
      contestHistory.push(customContestWithTimestamp);
      if (contestHistory.length > MAX_HISTORY) {
        contestHistory.shift();
      }
      emitEvent('contest', customContestWithTimestamp);
    };

    let lastContestRollAt = 0;
    // 对抗检定投骰逻辑函数（可被按钮点击和重投按钮调用）
    const performContestRoll = function () {
      const $btn = panel.find('#contest-roll-btn');
      const $row = panel.find('.acu-contest-result-row');
      const now = Date.now();
      if (now - lastContestRollAt < 100) return;
      lastContestRollAt = now;

      // 锁定按钮和结果行防止连点
      if ($btn.prop('disabled') || $row.hasClass('disabled')) return;

      const lockUI = () => {
        $btn.prop('disabled', true).addClass('disabled');
        $row.addClass('disabled').css('pointer-events', 'none');
      };
      const unlockUI = () => {
        $btn.prop('disabled', false).removeClass('disabled');
        $row.removeClass('disabled').css('pointer-events', '');
      };

      lockUI();
      setTimeout(unlockUI, 100);

      // [修复] 如果处于自定义模式,使用自定义对抗掷骰逻辑
      // 检查骰子语法行是否可见来判断是否为自定义模式
      if (panel.find('#contest-init-dice-syntax-row').is(':visible')) {
        performCustomContestRoll();
        return;
      }

      var formula = panel.find('#contest-dice-type').val() || '1d100';
      const activePreset = currentContestAdvancedPreset || AdvancedDicePresetManager.getActivePreset();
      const hasAdvancedPreset =
        !!activePreset &&
        'outcomes' in activePreset &&
        Array.isArray(activePreset.outcomes) &&
        activePreset.outcomes.length > 0;

      try {
        const rawDataForAlias = getCachedRawData() || getTableData();
        if (rawDataForAlias) {
          NameAliasRegistry.rebuild(processJsonData(rawDataForAlias || {}));
        }
      } catch (error) {
        console.warn('[DICE] 对抗别名映射刷新失败:', error);
      }

      var initNameRaw = (panel.find('#contest-init-display').val() || '').toString().trim() || '<user>';
      var initName = resolveCanonicalCharacterName(initNameRaw);
      var initAttrName = (panel.find('#contest-init-name').val() || '').toString().trim() || '自由检定';
      // 辅助函数：根据骰子公式计算最大值的一半
      var getHalfMax = function (formulaStr) {
        var m = formulaStr.match(/(\d+)d(\d+)/i);
        if (m) return Math.round((parseInt(m[1], 10) * parseInt(m[2], 10)) / 2);
        return 50;
      };
      const resolveDefaultValue = function (
        defaultValue: number | string | undefined,
        context: Record<string, number>,
      ): number {
        if (defaultValue === undefined) return 0;
        if (typeof defaultValue === 'number') return defaultValue;
        const result = evaluateFormula(defaultValue, context);
        if (result === 0 && defaultValue !== '0' && String(defaultValue) !== '0') {
          if (window.toastr) {
            window.toastr.warning(`表达式 "${defaultValue}" 求值失败,使用默认值 0`);
          }
        }
        return result || 0;
      };

      // 解析修正值，支持纯数字和骰子表达式
      const parseModifier = function (modStr: string): number {
        if (!modStr || modStr.trim() === '') return 0;
        const trimmed = modStr.trim();

        // 尝试直接解析为数字
        const numValue = parseFloat(trimmed);
        if (!isNaN(numValue) && isFinite(numValue) && trimmed.match(/^-?\d+(\.\d+)?$/)) {
          return numValue;
        }

        const rollResult = rollComplexDiceExpression(trimmed);
        if (!Number.isNaN(rollResult.total)) return rollResult.total;
        return 0;
      };

      var initValueInput = (panel.find('#contest-init-value').val() || '').toString().trim();
      var initValue;
      if (initValueInput === '') {
        // 属性值留空：高级预设使用默认值，否则使用骰子最大值的一半
        if (hasAdvancedPreset && activePreset && 'attribute' in activePreset) {
          initValue = resolveDefaultValue(activePreset.attribute?.defaultValue, {});
        } else {
          initValue = getHalfMax(formula);
        }
      } else {
        initValue = parseInt(initValueInput, 10) || getHalfMax(formula);
      }
      var initTargetInput = (panel.find('#contest-init-target').val() || '').toString().trim();
      var initTarget;
      if (initTargetInput !== '') {
        initTarget = parseInt(initTargetInput, 10);
      } else {
        // 目标值留空：高级预设使用默认值，否则使用属性值（若属性值也是默认的，则两者相等）
        if (hasAdvancedPreset && activePreset && 'dc' in activePreset) {
          initTarget = resolveDefaultValue(activePreset.dc?.defaultValue, { $attr: initValue });
        } else {
          initTarget = initValue;
        }
      }

      var oppNameRaw = (panel.find('#contest-opponent-display').val() || '').toString().trim() || '对手';
      var oppName = resolveCanonicalCharacterName(oppNameRaw);
      var oppAttrName = (panel.find('#contest-opp-name').val() || '').toString().trim() || initAttrName;
      var oppValueInput = (panel.find('#contest-opp-value').val() || '').toString().trim();
      var oppValue;
      if (oppValueInput === '') {
        // 属性值留空：高级预设使用默认值，否则使用骰子最大值的一半
        if (hasAdvancedPreset && activePreset && 'attribute' in activePreset) {
          oppValue = resolveDefaultValue(activePreset.attribute?.defaultValue, {});
        } else {
          oppValue = getHalfMax(formula);
        }
      } else {
        oppValue = parseInt(oppValueInput, 10) || getHalfMax(formula);
      }
      var oppTargetInput = (panel.find('#contest-opp-target').val() || '').toString().trim();
      var oppTarget;
      if (oppTargetInput !== '') {
        oppTarget = parseInt(oppTargetInput, 10);
      } else {
        // 目标值留空：高级预设使用默认值，否则使用属性值
        if (hasAdvancedPreset && activePreset && 'dc' in activePreset) {
          oppTarget = resolveDefaultValue(activePreset.dc?.defaultValue, { $attr: oppValue });
        } else {
          oppTarget = oppValue;
        }
      }

      var initModInput = (panel.find('#contest-init-mod').val() || '').toString().trim();
      var oppModInput = (panel.find('#contest-opp-mod').val() || '').toString().trim();
      var initSkillModInput = (panel.find('#contest-init-skill-mod').val() || '').toString().trim();
      var oppSkillModInput = (panel.find('#contest-opp-skill-mod').val() || '').toString().trim();
      var initMod = initModInput !== '' ? parseModifier(initModInput) : 0;
      var oppMod = oppModInput !== '' ? parseModifier(oppModInput) : 0;

      // 解析技能加值（若预设启用 skillMod）
      var initSkillMod = 0;
      var oppSkillMod = 0;

      const allPresets = AdvancedDicePresetManager.getAllPresets();
      const fallbackPresetId = /d100/i.test(formula) ? 'coc7_check' : 'dnd5e_check';
      const fallbackPreset = allPresets.find(p => p.id === fallbackPresetId);
      const preset =
        activePreset &&
        'outcomes' in activePreset &&
        Array.isArray(activePreset.outcomes) &&
        activePreset.outcomes.length > 0
          ? activePreset
          : fallbackPreset;

      if (!preset || !Array.isArray(preset.outcomes) || preset.outcomes.length === 0) {
        console.warn('[DICE] 对抗检定未找到可用预设或 outcomes');
        return;
      }

      if (preset.mod?.hidden) {
        initMod = 0;
        oppMod = 0;
      }

      if (preset.dc?.hidden) {
        initTarget = resolveDefaultValue(preset.dc?.defaultValue, { $attr: initValue });
        oppTarget = resolveDefaultValue(preset.dc?.defaultValue, { $attr: oppValue });
      }

      const hideSkillModInContest =
        !preset.skillMod || preset.contestRule?.hideSkillMod === true || preset.skillMod.hidden === true;
      if (!hideSkillModInContest && preset.skillMod) {
        if (initSkillModInput !== '') {
          initSkillMod = parseModifier(initSkillModInput);
        } else {
          initSkillMod = resolveDefaultValue(preset.skillMod.defaultValue, { $attr: initValue });
        }

        if (oppSkillModInput !== '') {
          oppSkillMod = parseModifier(oppSkillModInput);
        } else {
          oppSkillMod = resolveDefaultValue(preset.skillMod.defaultValue, { $attr: oppValue });
        }
      }

      // [新增] 收集双方的 customFields
      const collectContestCustomFields = (party: 'init' | 'opp'): Record<string, number | string | boolean> => {
        const customValues: Record<string, number | string | boolean> = {};
        if (!('customFields' in preset) || !Array.isArray(preset.customFields) || preset.customFields.length === 0) {
          return customValues;
        }

        const $customFields = panel.find(`.acu-dice-custom-field-contest[data-party="${party}"]`);
        $customFields.each(function () {
          const $el = $(this);
          const id = $el.data('id');
          const fieldConfig = preset.customFields.find(f => f.id === id);
          if (!fieldConfig) return;

          let val: string | number | boolean;
          if (fieldConfig.type === 'toggle') {
            val = $el.prop('checked');
          } else if (fieldConfig.type === 'number') {
            const num = parseFloat($el.val() as string);
            val = isNaN(num) ? (fieldConfig.defaultValue as number) : num;
          } else if (fieldConfig.type === 'select') {
            const rawVal = $el.val() as string;
            const num = parseFloat(rawVal);
            val = isNaN(num) ? rawVal : num;
          } else {
            const rawVal = String($el.val() ?? '').trim();
            if (rawVal === '' && fieldConfig.defaultValue !== undefined && fieldConfig.defaultValue !== '') {
              val = fieldConfig.defaultValue as string | number | boolean;
            } else {
              val = rawVal;
            }
          }
          customValues['$' + id] = val;
        });
        return customValues;
      };

      // [新增] 计算派生变量
      const computeDerivedVars = (
        customValues: Record<string, number | string | boolean>,
        attrValue: number,
        modValue: number,
        dcValue: number,
      ): Record<string, number> => {
        const derivedValues: Record<string, number> = {};
        if (!('derivedVars' in preset) || !Array.isArray(preset.derivedVars) || preset.derivedVars.length === 0) {
          return derivedValues;
        }

        const baseContext = {
          $attr: attrValue,
          $dc: dcValue,
          $mod: modValue,
          ...customValues,
        };

        preset.derivedVars.forEach(spec => {
          const id = spec?.id?.trim();
          if (!id) return;
          const varName = id.startsWith('$') ? id : `$${id}`;
          const evalResult = evaluateCondition(spec.expr, { ...baseContext, ...derivedValues });
          if (!evalResult.success) {
            console.warn(`[DICE] 对抗检定派生变量 ${varName} 计算失败:`, evalResult.error);
            derivedValues[varName] = 0;
            return;
          }
          const rawValue = evalResult.value;
          const numericValue = typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : rawValue ? 1 : 0;
          derivedValues[varName] = numericValue;
        });
        return derivedValues;
      };

      // [新增] 应用 dicePatches
      const applyDicePatches = (
        baseFormula: string,
        customValues: Record<string, number | string | boolean>,
        derivedValues: Record<string, number>,
        attrValue: number,
        modValue: number,
        dcValue: number,
      ): string => {
        if (!('dicePatches' in preset) || !Array.isArray(preset.dicePatches) || preset.dicePatches.length === 0) {
          return baseFormula;
        }

        const patchContext = {
          $attr: attrValue,
          $dc: dcValue,
          $mod: modValue,
          ...customValues,
          ...derivedValues,
        };

        const replacePatchTemplate = (template: string): string => {
          const varPattern = /\$[a-zA-Z_]\w*/g;
          return template.replace(varPattern, match => {
            const value = patchContext[match];
            return typeof value === 'number' && Number.isFinite(value) ? String(value) : '0';
          });
        };

        let diceExpression = baseFormula;
        preset.dicePatches.forEach(patch => {
          if (!patch) return;
          if (patch.when) {
            const conditionResult = evaluateCondition(patch.when, patchContext);
            if (!conditionResult.success) {
              console.warn('[DICE] 对抗检定 dicePatches 条件评估失败:', conditionResult.error);
              return;
            }
            const shouldApply =
              typeof conditionResult.value === 'number' ? conditionResult.value !== 0 : Boolean(conditionResult.value);
            if (!shouldApply) return;
          }

          const resolvedTemplate = replacePatchTemplate(patch.template ?? '');
          switch (patch.op) {
            case 'append':
              diceExpression = `${diceExpression}${resolvedTemplate}`;
              break;
            case 'prepend':
              diceExpression = `${resolvedTemplate}${diceExpression}`;
              break;
            case 'replace':
              diceExpression = resolvedTemplate;
              break;
          }
        });
        return diceExpression;
      };

      // 收集发起方 customFields 并计算公式
      const initCustomValues = collectContestCustomFields('init');
      const initDerivedValues = computeDerivedVars(initCustomValues, initValue, initMod, initTarget);
      const initFormula = applyDicePatches(
        formula,
        initCustomValues,
        initDerivedValues,
        initValue,
        initMod,
        initTarget,
      );

      // 收集对抗方 customFields 并计算公式
      const oppCustomValues = collectContestCustomFields('opp');
      const oppDerivedValues = computeDerivedVars(oppCustomValues, oppValue, oppMod, oppTarget);
      const oppFormula = applyDicePatches(formula, oppCustomValues, oppDerivedValues, oppValue, oppMod, oppTarget);

      // 投骰（使用各自的公式）
      const initResult = rollComplexDiceExpression(initFormula);
      const oppResult = rollComplexDiceExpression(oppFormula);
      if (Number.isNaN(initResult.total) || Number.isNaN(oppResult.total)) {
        const errorFormula = Number.isNaN(initResult.total) ? initFormula : oppFormula;
        console.warn('[DICE] 对抗检定骰子语法错误:', errorFormula);
        if (window.toastr)
          showActionableErrorToast(`骰子语法错误: ${errorFormula}`, {
            suggestion: '请检查对抗检定预设公式，只使用形如 1d100、2d6+3 的合法写法。',
          });
        return;
      }
      const initRollTotal = initResult.total;
      const oppRollTotal = oppResult.total;

      console.log('[DICE] 对抗检定公式 - 发起方:', initFormula, '对抗方:', oppFormula);

      // 计算 attrMod（如果预设有 computeModifier）
      let initAttrMod = 0;
      let oppAttrMod = 0;
      if ('attribute' in preset && preset.attribute?.computeModifier) {
        const modFormula = preset.attribute.computeModifier;
        initAttrMod = evaluateConditionNumber(modFormula, { $attr: initValue }, 0);
        oppAttrMod = evaluateConditionNumber(modFormula, { $attr: oppValue }, 0);
      }

      const initContext = {
        $roll: initResult,
        $attr: initValue,
        $attrMod: initAttrMod,
        $skillMod: initSkillMod,
        $dc: initTarget,
        $mod: initMod,
        ...initCustomValues,
        ...initDerivedValues,
      };
      const oppContext = {
        $roll: oppResult,
        $attr: oppValue,
        $attrMod: oppAttrMod,
        $skillMod: oppSkillMod,
        $dc: oppTarget,
        $mod: oppMod,
        ...oppCustomValues,
        ...oppDerivedValues,
      };

      const initOutcomeResult = applyAdvancedPresetOutcomePolicy(
        preset,
        evaluateOutcomes(preset.outcomes, initContext),
        initContext,
      );
      const oppOutcomeResult = applyAdvancedPresetOutcomePolicy(
        preset,
        evaluateOutcomes(preset.outcomes, oppContext),
        oppContext,
      );
      const initOutcome = initOutcomeResult.outcome;
      const oppOutcome = oppOutcomeResult.outcome;
      const winnerSide = resolveContest(
        preset,
        initOutcome,
        oppOutcome,
        initRollTotal + initAttrMod + initSkillMod + initMod,
        oppRollTotal + oppAttrMod + oppSkillMod + oppMod,
        initValue,
        oppValue,
      );

      let winnerText = '平局';
      let winnerResultType = 'warning';
      if (winnerSide === 'initiator') {
        winnerText = initName + ' 胜利';
        winnerResultType = 'success';
      } else if (winnerSide === 'opponent') {
        winnerText = oppName + ' 胜利';
        winnerResultType = 'failure';
      }

      var diceCfg = getDiceConfig();
      var hideDiceResultFromUser =
        diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
      var displayInitValue = hideDiceResultFromUser ? '？？' : initRollTotal;
      var displayOppValue = hideDiceResultFromUser ? '？？' : oppRollTotal;
      var displayInitSuccessName = hideDiceResultFromUser ? '' : initOutcome.name;
      var displayOppSuccessName = hideDiceResultFromUser ? '' : oppOutcome.name;
      var displayWinner = hideDiceResultFromUser ? '' : winnerText;

      const getResultTypeFromOutcome = (outcome: OutcomeLevel) => {
        if (outcome.priority <= 10) return 'critSuccess';
        if (outcome.priority <= 30) return 'extremeSuccess';
        if (outcome.priority < 50) return 'success';
        if (outcome.priority === 50) return 'warning';
        if (outcome.priority < 90) return 'failure';
        return 'critFailure';
      };

      const initResultType = getResultTypeFromOutcome(initOutcome);
      const oppResultType = getResultTypeFromOutcome(oppOutcome);

      const initBadgeClass = getResultBadgeClass(initResultType);
      const oppBadgeClass = getResultBadgeClass(oppResultType);
      // 胜者文字颜色类名
      const winnerColorClass =
        winnerResultType === 'success'
          ? 'acu-contest-winner-success'
          : winnerResultType === 'warning'
            ? 'acu-contest-winner-warning'
            : 'acu-contest-winner-failure';

      // 显示结果展示区域
      const $resultDisplay = panel.find('#contest-result-display');
      const $resultInit = panel.find('#contest-result-init');
      const $resultOpp = panel.find('#contest-result-opp');

      // 显示发起方结果
      $resultInit.html(
        '<span class="acu-contest-result-name">' +
          escapeHtml(initName) +
          '</span>' +
          '<span class="acu-contest-result-value">' +
          displayInitValue +
          '</span>' +
          (displayInitSuccessName ? '<span class="' + initBadgeClass + '">' + displayInitSuccessName + '</span>' : ''),
      );

      // 显示对抗方结果
      $resultOpp.html(
        (displayOppSuccessName ? '<span class="' + oppBadgeClass + '">' + displayOppSuccessName + '</span>' : '') +
          '<span class="acu-contest-result-value">' +
          displayOppValue +
          '</span>' +
          '<span class="acu-contest-result-name">' +
          escapeHtml(oppName) +
          '</span>',
      );

      // 将结果显示区域改为两行布局：第一行显示双方信息，第二行显示最终结果和重roll按钮
      $resultDisplay.html(
        '<div class="acu-contest-result-container" title="点击重新投骰">' +
          // 第一行：双方名字、点数、检定结果
          '<div class="acu-contest-result-row">' +
          '<div class="acu-contest-result-inner">' +
          '<div id="contest-result-init" class="acu-contest-result-side">' +
          '<span class="acu-contest-result-name">' +
          escapeHtml(initName) +
          '</span>' +
          '<span class="acu-contest-result-value">' +
          displayInitValue +
          '</span>' +
          (displayInitSuccessName ? '<span class="' + initBadgeClass + '">' + displayInitSuccessName + '</span>' : '') +
          '</div>' +
          '<span class="acu-contest-vs">VS</span>' +
          '<div id="contest-result-opp" class="acu-contest-result-side right">' +
          (displayOppSuccessName ? '<span class="' + oppBadgeClass + '">' + displayOppSuccessName + '</span>' : '') +
          '<span class="acu-contest-result-value">' +
          displayOppValue +
          '</span>' +
          '<span class="acu-contest-result-name">' +
          escapeHtml(oppName) +
          '</span>' +
          '</div>' +
          '</div>' +
          '</div>' +
          // 第二行：最终结果 + 重roll箭头
          '<div class="acu-contest-result-winner-row">' +
          '<span class="acu-contest-winner-text ' +
          winnerColorClass +
          '">' +
          displayWinner +
          '</span>' +
          '<i class="fa-solid fa-rotate-right acu-contest-reroll-icon"></i>' +
          '</div>' +
          '</div>',
      );
      $resultDisplay.show();

      // 绑定整行点击事件进行重投
      $resultDisplay.off('click').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        performContestRoll();
      });

      // 隐藏原按钮
      const $contestBtn = panel.find('#contest-roll-btn');
      $contestBtn.hide();

      // 构建对抗检定结果文本 (使用模板系统)
      const template = preset.contestOutputTemplate || DEFAULT_CONTEST_OUTPUT_TEMPLATE;
      // 使用 displayExpr（如果有）或 condition 作为显示表达式
      const initDisplayOutcome = getAdvancedPresetDisplayOutcome(initOutcomeResult);
      const oppDisplayOutcome = getAdvancedPresetDisplayOutcome(oppOutcomeResult);
      const initDisplayExpr = initDisplayOutcome.displayExpr ?? initDisplayOutcome.condition;
      const oppDisplayExpr = oppDisplayOutcome.displayExpr ?? oppDisplayOutcome.condition;
      // 先处理 $roll.hasTag() 方法调用
      let initConditionExpr = initDisplayExpr.replace(
        /\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi,
        (_match, tag) => {
          return (initResult.tags ?? []).includes(tag) ? '成立' : '不成立';
        },
      );
      initConditionExpr = initConditionExpr
        .replace(/\$roll\.total/g, String(initRollTotal)) // 先替换 $roll.total
        .replace(/\$roll/g, String(initRollTotal))
        .replace(/\$attrMod/g, String(initAttrMod))
        .replace(/\$skillMod/g, String(initSkillMod))
        .replace(/\$attr/g, String(initValue))
        .replace(/\$dc/g, String(initTarget))
        .replace(/\$mod/g, String(initMod));
      let oppConditionExpr = oppDisplayExpr.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
        return (oppResult.tags ?? []).includes(tag) ? '成立' : '不成立';
      });
      oppConditionExpr = oppConditionExpr
        .replace(/\$roll\.total/g, String(oppRollTotal)) // 先替换 $roll.total
        .replace(/\$roll/g, String(oppRollTotal))
        .replace(/\$attrMod/g, String(oppAttrMod))
        .replace(/\$skillMod/g, String(oppSkillMod))
        .replace(/\$attr/g, String(oppValue))
        .replace(/\$dc/g, String(oppTarget))
        .replace(/\$mod/g, String(oppMod));
      // 计算 displayExpr 的布尔值来决定"成立/不成立"
      // 注意：复用前面已定义的 initContext 和 oppContext
      const initDisplayExprResult = evaluateCondition(initDisplayExpr, initContext);
      const oppDisplayExprResult = evaluateCondition(oppDisplayExpr, oppContext);
      const initJudgeResult =
        initDisplayExprResult.success &&
        (typeof initDisplayExprResult.value === 'number'
          ? initDisplayExprResult.value !== 0
          : Boolean(initDisplayExprResult.value))
          ? '成立'
          : '不成立';
      const oppJudgeResult =
        oppDisplayExprResult.success &&
        (typeof oppDisplayExprResult.value === 'number'
          ? oppDisplayExprResult.value !== 0
          : Boolean(oppDisplayExprResult.value))
          ? '成立'
          : '不成立';
      const initOutcomeText = initOutcome.outputText || initOutcome.name || '判定完成';
      const oppOutcomeText = oppOutcome.outputText || oppOutcome.name || '判定完成';
      // 计算总值（投骰 + 属性调整值 + 技能加值 + 额外修正）和差值
      const initTotal = initRollTotal + initAttrMod + initSkillMod + initMod;
      const oppTotal = oppRollTotal + oppAttrMod + oppSkillMod + oppMod;
      const margin = initTotal - oppTotal;

      // [新增] 条件文本变量：当值为0时隐藏整个片段（包括标签）
      // 发起方
      const initAttrModStr = initAttrMod >= 0 ? `+${initAttrMod}` : String(initAttrMod);
      const initSkillModStr = initSkillMod >= 0 ? `+${initSkillMod}` : String(initSkillMod);
      const initAttrModText = initAttrMod !== 0 ? `，调整值${initAttrModStr}` : '';
      const initSkillModText = initSkillMod !== 0 ? `+技能加值${initSkillModStr}` : '';
      const initModText = initMod !== 0 ? `+额外加值${initMod >= 0 ? '+' + initMod : initMod}` : '';
      // 对抗方
      const oppAttrModStr = oppAttrMod >= 0 ? `+${oppAttrMod}` : String(oppAttrMod);
      const oppSkillModStr = oppSkillMod >= 0 ? `+${oppSkillMod}` : String(oppSkillMod);
      const oppAttrModText = oppAttrMod !== 0 ? `，调整值${oppAttrModStr}` : '';
      const oppSkillModText = oppSkillMod !== 0 ? `+技能加值${oppSkillModStr}` : '';
      const oppModText = oppMod !== 0 ? `+额外加值${oppMod >= 0 ? '+' + oppMod : oppMod}` : '';
      const initCheckValueText = buildCheckValueText({
        preset,
        characterName: initName,
        actionName: initAttrName,
        attrValue: initValue,
        attrMod: initAttrMod,
        skillMod: initSkillMod,
        mode: 'contest',
      });
      const oppCheckValueText = buildCheckValueText({
        preset,
        characterName: oppName,
        actionName: oppAttrName,
        attrValue: oppValue,
        attrMod: oppAttrMod,
        skillMod: oppSkillMod,
        mode: 'contest',
      });

      const contestOutputContext = {
        initiator: initName,
        opponent: oppName,
        initAttrName: initAttrName,
        oppAttrName: oppAttrName,
        initRoll: initRollTotal,
        oppRoll: oppRollTotal,
        initDisplayValue: initTotal,
        oppDisplayValue: oppTotal,
        initTarget: initTarget,
        oppTarget: oppTarget,
        initSuccessName: initOutcome.name,
        oppSuccessName: oppOutcome.name,
        winner: winnerText, // "XXX 胜利" 或 "平局"
        outcomeText: initOutcomeText,
        outcomeName: initOutcome.name,
        conditionExpr: initConditionExpr,
        judgeResult: initJudgeResult,
        formula: initFormula,
        initFormula: initFormula,
        oppFormula: oppFormula,
        roll: initRollTotal,
        dc: initTarget,
        mod: initMod,
        attr: initValue,
        attrName: `【${initAttrName}】`,
        initOutcomeText: initOutcomeText,
        oppOutcomeText: oppOutcomeText,
        initConditionExpr: initConditionExpr,
        oppConditionExpr: oppConditionExpr,
        initJudgeResult: initJudgeResult,
        oppJudgeResult: oppJudgeResult,
        // 属性调整值（用于 DND 等系统）
        initAttrMod: initAttrMod,
        oppAttrMod: oppAttrMod,
        // 技能加值（用于 DND 等系统）
        initSkillMod: initSkillMod,
        oppSkillMod: oppSkillMod,
        initMod: initMod,
        oppMod: oppMod,
        // [新增] 条件文本变量（零值时隐藏整个片段）
        initAttrModText: initAttrModText,
        oppAttrModText: oppAttrModText,
        initSkillModText: initSkillModText,
        oppSkillModText: oppSkillModText,
        initModText: initModText,
        oppModText: oppModText,
        initCheckValueText: initCheckValueText,
        oppCheckValueText: oppCheckValueText,
        // 总值和差值（用于 DND/Fate 等系统）
        initTotal: initTotal,
        oppTotal: oppTotal,
        margin: margin,
        shifts: margin, // Fate 术语别名
        // [新增] 双方原始属性值（技能等级）
        initAttr: initValue,
        oppAttr: oppValue,
      };
      const contestResultText = formatOutputTemplate(template, contestOutputContext);
      smartInsertToTextarea(contestResultText, 'dice');

      // 构建对抗检定结果对象
      const getOutcomeLevel = (outcome: OutcomeLevel) => {
        if (outcome.priority <= 10) return 3;
        if (outcome.priority <= 30) return 2;
        if (outcome.priority < 50) return 1;
        if (outcome.priority === 50) return 0;
        return -1;
      };
      const contestResult: AcuDice.ContestResult = {
        left: {
          name: initName,
          attribute: initAttrName,
          roll: initRollTotal,
          target: initTarget,
          successLevel: getOutcomeLevel(initOutcome),
        },
        right: {
          name: oppName,
          attribute: oppAttrName,
          roll: oppRollTotal,
          target: oppTarget,
          successLevel: getOutcomeLevel(oppOutcome),
        },
        winner: winnerSide === 'initiator' ? 'left' : winnerSide === 'opponent' ? 'right' : 'tie',
        message: winnerText,
      };

      // 添加到历史记录
      const contestDetailId = `contest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const contestResultWithTimestamp = {
        ...contestResult,
        timestamp: Date.now(),
        detailId: contestDetailId,
        historyType: 'contest' as const,
        detailLines: [
          `发起方: ${initName} / 对抗方: ${oppName}`,
          `属性: ${initAttrName} vs ${oppAttrName}`,
          `公式: ${initFormula} vs ${oppFormula}`,
          `掷骰: ${initRollTotal} vs ${oppRollTotal}`,
          `总值: ${initTotal} vs ${oppTotal}`,
          `判定: ${initConditionExpr} | ${oppConditionExpr}`,
          `结果: ${winnerText}`,
        ],
      };
      contestHistory.push(contestResultWithTimestamp);
      if (contestHistory.length > MAX_HISTORY) {
        contestHistory.shift();
      }

      // 触发事件
      emitEvent('contest', contestResultWithTimestamp);
    };

    // 绑定对抗检定按钮点击事件
    panel.find('#contest-roll-btn').click(function () {
      performContestRoll();
    });

    // [新增] 切换到普通检定
    panel.find('#contest-switch-normal').click(function () {
      var initValueInput = panel.find('#contest-init-value').val().trim();
      var currentInitName = panel.find('#contest-init-name').val() || '';
      var currentDice = panel.find('#contest-dice-type').val() || '1d100';
      var initiatorNameVal = panel.find('#contest-init-display').val().trim();
      closePanel();
      showDicePanel({
        // 只有用户实际输入了值才传递，否则传 null 让普通检定面板显示 placeholder
        attrValue: initValueInput !== '' ? parseInt(initValueInput, 10) : null,
        targetValue: null,
        targetName: currentInitName,
        diceType: currentDice,
        initiatorName: initiatorNameVal,
      });
    });
    panel.find('#contest-history-btn').click(function (e) {
      e.stopPropagation();
      showGlobalDiceHistoryDialog();
    });
    // 齿轮设置按钮点击 - 调用统一设置面板
    // 对抗检定根据当前骰子类型判断规则：1d20 -> DND, 其他 -> COC
    panel.find('.acu-contest-config-btn').click(function (e) {
      e.stopPropagation();
      // [废弃] 旧的规则设置弹窗调用已替换为高级检定管理
      // const currentDice = panel.find('#contest-dice-type').val() || '1d100';
      // const isDND = currentDice === '1d20';
      // showDiceSettingsPanel(isDND);
      showAdvancedPresetManager({ fromDicePanel: true });
    });
    var closePanel = function () {
      overlay.remove();
      panel.remove();
    };
    panel.on('click', function (e) {
      e.stopPropagation();
    });
    overlay.click(closePanel);
    panel.find('.acu-contest-close').click(closePanel);
  };

  const parseInSceneStatus = (value, headerName) => {
    const val = String(value || '')
      .trim()
      .toLowerCase();
    const header = String(headerName || '').toLowerCase();
    if (!val) return false;

    if (header.includes('离场')) {
      return val === '否' || val === 'false' || val === 'no';
    }

    return val.startsWith('在场') || val === 'true' || val === '是' || val === 'yes';
  };

  const buildMapViewModel = async () => {
    const rawData = getCachedRawData() || getTableData();
    const allTables = processJsonData(rawData || {});
    NameAliasRegistry.rebuild(allTables);
    if (!rawData || Object.keys(allTables).length === 0) return null;

    const globalResult = DashboardDataParser.findTable(allTables, 'global');
    const locationResult = DashboardDataParser.findTable(allTables, 'location');
    const npcResult = DashboardDataParser.findTable(allTables, 'npc');
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    const elementResult = (() => {
      const keywords = ['地图元素', '元素表', '地图要素', '机关', '线索'];
      for (const tableName in allTables) {
        if (keywords.some(keyword => tableName.includes(keyword))) {
          return {
            data: allTables[tableName],
            name: tableName,
            key: allTables[tableName].key,
          };
        }
      }
      return null;
    })();

    const globalHeaders = globalResult?.data?.headers || [];
    const globalRows = globalResult?.data?.rows || [];
    const globalRow = globalRows[0] || [];
    const globalConfig = globalResult?.config || getDashboardModuleConfig('global') || DASHBOARD_TABLE_CONFIG.global;
    const detailIdx = DashboardDataParser.findColumnIndex(globalHeaders, 'detailLocation', globalConfig);
    const regionIdx = DashboardDataParser.findColumnIndex(globalHeaders, 'currentLocation', globalConfig);
    const detailLocation = detailIdx >= 0 ? String(globalRow[detailIdx] || '').trim() : '';
    const currentRegion = regionIdx >= 0 ? String(globalRow[regionIdx] || '').trim() : '';

    if (!locationResult?.data) return null;

    const findColumnIndex = (headers, keywords, fallbackIndex = null) => {
      for (let i = 0; i < headers.length; i++) {
        const h = String(headers[i] || '').toLowerCase();
        if (keywords.some(keyword => h.includes(keyword.toLowerCase()))) return i;
      }
      return fallbackIndex ?? -1;
    };

    const locations = new Map();
    const locationHeaders = locationResult.data.headers || [];
    const locationRows = locationResult.data.rows || [];
    const locationConfig =
      locationResult.config || getDashboardModuleConfig('location') || DASHBOARD_TABLE_CONFIG.location;
    const locationNameIdx = DashboardDataParser.findColumnIndex(locationHeaders, 'name', locationConfig);
    const locationRegionIdx = findColumnIndex(locationHeaders, ['次要地区', '次要区域', '区域', '地区'], null);
    const locationTypeIdx = findColumnIndex(locationHeaders, ['地点类型', '地点类别', '类型'], null);
    const locationDescIdx = DashboardDataParser.findColumnIndex(locationHeaders, 'description', locationConfig);
    const locationImportanceIdx = findColumnIndex(locationHeaders, ['重要度', '重要性'], null);
    const locationExploreIdx = findColumnIndex(locationHeaders, ['探索状态', '探索进度', '状态'], null);

    // 先收集所有地点名，用于批量emoji分配（去重）
    const allLocationNames: string[] = [];
    locationRows.forEach(row => {
      const name = String(row[locationNameIdx] || '')
        .trim()
        .replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (name) allLocationNames.push(name);
    });
    const emojiMap = resolveBatchLocationEmojis(allLocationNames);

    locationRows.forEach((row, idx) => {
      const name = String(row[locationNameIdx] || '')
        .trim()
        .replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (!name) return;
      const region = locationRegionIdx >= 0 ? String(row[locationRegionIdx] || '').trim() : '';

      const location = {
        name,
        region,
        locationType: locationTypeIdx >= 0 ? row[locationTypeIdx] || '' : '',
        description: locationDescIdx >= 0 ? row[locationDescIdx] || '' : '',
        importance: locationImportanceIdx >= 0 ? row[locationImportanceIdx] || '' : '',
        exploreStatus: locationExploreIdx >= 0 ? row[locationExploreIdx] || '' : '',
        emoji: emojiMap.get(name) ?? null,
        tableName: locationResult.name || '',
        tableKey: locationResult.key || '',
        rowIndex: idx,
      };
      locations.set(name, location);
    });

    const elements = new Map();
    const addElement = (locationName, element) => {
      if (!elements.has(locationName)) {
        elements.set(locationName, []);
      }
      elements.get(locationName).push(element);
    };

    if (elementResult?.data) {
      const elementHeaders = elementResult.data.headers || [];
      const elementRows = elementResult.data.rows || [];
      const elementNameIdx = findColumnIndex(elementHeaders, ['元素名称', '名称', '元素名'], 1);
      const elementTypeIdx = findColumnIndex(elementHeaders, ['元素类型', '类型', '元素分类'], 2);
      const elementLocationIdx = findColumnIndex(elementHeaders, ['所在地点', '位置', '地点'], 3);
      const elementDescIdx = findColumnIndex(elementHeaders, ['元素描述', '描述', '说明'], null);
      const elementStatusIdx = findColumnIndex(elementHeaders, ['状态', '交互状态'], null);
      const elementInteractIdx = findColumnIndex(elementHeaders, ['交互选项', '交互', '互动', '可交互'], null);

      elementRows.forEach((row, idx) => {
        const name = String(row[elementNameIdx] || '').trim();
        if (!name) return;
        const locationName = String(row[elementLocationIdx] || '').trim();
        if (!locationName) return;
        if (currentRegion && locations.size > 0 && !locations.has(locationName)) return;

        const rawInteractions = elementInteractIdx >= 0 ? row[elementInteractIdx] : '';
        const interactions = String(rawInteractions || '')
          .split(/[,，、;；]/)
          .map(item => item.trim())
          .filter(Boolean);
        const typeValue = elementTypeIdx >= 0 ? row[elementTypeIdx] || '' : '';
        const element = {
          name,
          type: typeValue,
          location: locationName,
          description: elementDescIdx >= 0 ? row[elementDescIdx] || '' : '',
          status: elementStatusIdx >= 0 ? row[elementStatusIdx] || '' : '',
          interactions,
          emoji: getElementEmoji(name, typeValue),
          tableName: elementResult.name || '',
          tableKey: elementResult.key || '',
          rowIndex: idx,
        };
        addElement(locationName, element);
      });
    }

    const characters = new Map();
    const resolveMapAvatarLookupName = (name: unknown): string => {
      const rawName = String(name || '').trim();
      if (!rawName) return '';
      return resolveUserGraphName(NameAliasRegistry.resolve(rawName));
    };

    const addCharacter = async character => {
      const avatarLookupName = resolveMapAvatarLookupName(character.name) || character.name;
      const avatarUrl = await AvatarManager.getAsync(avatarLookupName);
      const full = {
        ...character,
        avatarLookupName,
        avatarUrl,
        avatarOffsetX: AvatarManager.getOffsetX(avatarLookupName),
        avatarOffsetY: AvatarManager.getOffsetY(avatarLookupName),
        avatarScale: AvatarManager.getScale(avatarLookupName),
      };
      if (!characters.has(full.location)) {
        characters.set(full.location, []);
      }
      characters.get(full.location).push(full);
    };

    let playerLocation = '';

    if (playerResult?.data) {
      const playerConfig = playerResult.config || getDashboardModuleConfig('player') || DASHBOARD_TABLE_CONFIG.player;
      const playerHeaders = playerResult.data.headers || [];
      const playerRows = playerResult.data.rows || [];
      const playerRow = playerRows[0] || [];
      const playerNameIdx = DashboardDataParser.findColumnIndex(playerHeaders, 'name', playerConfig);
      const playerPosIdx = DashboardDataParser.findColumnIndex(playerHeaders, 'position', playerConfig);
      const playerNameRaw = playerNameIdx >= 0 ? playerRow[playerNameIdx] : getPlayerName();
      const playerPosRaw = playerPosIdx >= 0 ? playerRow[playerPosIdx] : '';
      const playerName = getDisplayName(String(playerNameRaw || '').trim());
      playerLocation = String(playerPosRaw || '').trim();

      if (!playerLocation && detailLocation) {
        playerLocation = detailLocation;
      }

      if (playerName && playerLocation) {
        await addCharacter({
          name: playerName,
          location: playerLocation,
          isPlayer: true,
          isInScene: true,
          tableKey: playerResult.key || '',
          rowIndex: 0,
        });
      }
    }

    if (npcResult?.data) {
      const npcConfig = npcResult.config || getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
      const npcHeaders = npcResult.data.headers || [];
      const npcRows = npcResult.data.rows || [];
      const npcNameIdx = DashboardDataParser.findColumnIndex(npcHeaders, 'name', npcConfig);
      const npcPosIdx = DashboardDataParser.findColumnIndex(npcHeaders, 'position', npcConfig);
      const npcInSceneIdx = DashboardDataParser.findColumnIndex(npcHeaders, 'inScene', npcConfig);

      for (let idx = 0; idx < npcRows.length; idx++) {
        const row = npcRows[idx];
        const npcName = getDisplayName(String(row[npcNameIdx] || '').trim());
        if (!npcName) continue;
        const locationName = String(row[npcPosIdx] || '').trim();
        if (!locationName) continue;
        if (currentRegion && locations.size > 0 && !locations.has(locationName)) continue;
        const inSceneValue = npcInSceneIdx >= 0 ? row[npcInSceneIdx] : '';
        const inSceneHeader = npcHeaders[npcInSceneIdx] || '';
        const isInScene = parseInSceneStatus(inSceneValue, inSceneHeader);

        await addCharacter({
          name: npcName,
          location: locationName,
          isPlayer: false,
          isInScene,
          tableKey: npcResult.key || '',
          rowIndex: idx,
        });
      }
    }

    const locationIterator = locations.values();
    const firstLocation = locationIterator.next().value;

    const allRegions = [...new Set(Array.from(locations.values()).map(l => l.region || '其他'))].sort();
    // 确保"其他"标签页始终在最后
    const otherIndex = allRegions.indexOf('其他');
    if (otherIndex > -1) {
      allRegions.splice(otherIndex, 1);
      allRegions.push('其他');
    }

    const getHotLocationsInRegion = region => {
      const regionName = region || '其他';
      return Array.from(locations.values())
        .filter(l => (l.region || '其他') === regionName)
        .sort((a, b) => {
          const scoreA = (characters.get(a.name)?.length || 0) + (elements.get(a.name)?.length || 0);
          const scoreB = (characters.get(b.name)?.length || 0) + (elements.get(b.name)?.length || 0);
          return scoreB - scoreA;
        });
    };

    const focusLocation = (() => {
      if (detailLocation && locations.has(detailLocation)) return detailLocation;
      if (playerLocation && locations.has(playerLocation)) return playerLocation;
      const fallbackRegion = allRegions[0];
      if (fallbackRegion) {
        const regionLocations = getHotLocationsInRegion(fallbackRegion);
        if (regionLocations.length > 0) return regionLocations[0].name;
      }
      return firstLocation ? firstLocation.name : '';
    })();

    return {
      currentRegion: currentRegion || locations.get(playerLocation)?.region || '其他',
      detailLocation,
      focusLocation,
      playerLocation,
      locations,
      elements,
      characters,
      allRegions,
    };
  };

  // 防止地图弹窗重复打开
  let isMapOpening = false;

  const showMapVisualization = async () => {
    const { $ } = getCore();

    // 防止重复打开
    if (isMapOpening) return;
    isMapOpening = true;

    // 确保移除所有旧的overlay
    $('.acu-map-overlay').remove();

    let viewModel = await buildMapViewModel();
    if (!viewModel) {
      isMapOpening = false;
      if (window.toastr) window.toastr.warning('未找到地图数据');
      return;
    }

    const config = getConfig();

    // 会话级缓存：记录用户在每个地区选中的地点
    const tabSelectionCache = new Map<string, string>();

    // 热度排序辅助函数：返回指定地区按热度降序排列的地点数组
    const getHotLocationsInRegion = (region: string) => {
      const regionName = region || '其他';
      return Array.from(viewModel.locations.values())
        .filter(l => (l.region || '其他') === regionName)
        .sort((a, b) => {
          const scoreA =
            (viewModel.characters.get(a.name)?.length || 0) + (viewModel.elements.get(a.name)?.length || 0);
          const scoreB =
            (viewModel.characters.get(b.name)?.length || 0) + (viewModel.elements.get(b.name)?.length || 0);
          return scoreB - scoreA;
        });
    };

    // 复用"回到当前地点"的逻辑来确定初始焦点和地区
    const detailLocation = viewModel.detailLocation || '';
    const playerLocation = viewModel.playerLocation || '';
    let focusLocation = '';
    let selectedRegion = viewModel.currentRegion;

    // 优先级: 当前详细地点 > 玩家所在地点 > viewModel.focusLocation
    if (detailLocation && viewModel.locations.has(detailLocation)) {
      focusLocation = detailLocation;
      const targetLocation = viewModel.locations.get(detailLocation);
      selectedRegion = targetLocation?.region || viewModel.currentRegion || '其他';
    } else if (playerLocation && viewModel.locations.has(playerLocation)) {
      focusLocation = playerLocation;
      const targetLocation = viewModel.locations.get(playerLocation);
      selectedRegion = targetLocation?.region || viewModel.currentRegion || '其他';
    } else if (viewModel.focusLocation && viewModel.locations.has(viewModel.focusLocation)) {
      focusLocation = viewModel.focusLocation;
      const targetLocation = viewModel.locations.get(focusLocation);
      selectedRegion = targetLocation?.region || viewModel.currentRegion || '其他';
    }

    if (focusLocation) {
      Store.set(STORAGE_KEY_MAP_FOCUS, focusLocation);
      // 将初始地点写入对应地区的缓存，这样用户切走再切回来时能保持选中
      tabSelectionCache.set(selectedRegion, focusLocation);
    }

    const overlay = $(`
            <div class="acu-map-overlay acu-theme-${config.theme} ${config.showHorizontalScrollbar === true ? 'acu-show-horizontal-scrollbar' : ''}">
                <div class="acu-map-container">
                    <div class="acu-panel-header">
                        <div class="acu-map-title">
                            <i class="fa-solid fa-map-location-dot"></i>
                            <span class="acu-map-region-name">地图</span>
                        </div>
                        <div class="acu-map-region-tabs"></div>
                        <div class="acu-map-actions">
                            ${getTutorialButtonHtml('map', '查看地图教程')}
                            <button class="acu-map-back-btn" type="button" title="回到当前地点" aria-label="回到当前地点"><i class="fa-solid fa-location-crosshairs"></i></button>
                            <button class="acu-close-btn acu-map-close" type="button" title="关闭地图" aria-label="关闭地图"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-map-body">
                        <div class="acu-map-focus-area"></div>
                        <div class="acu-map-thumbnails"></div>
                    </div>
                </div>
            </div>
        `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    const overlayEl = overlay[0];
    overlayEl.style.setProperty('position', 'fixed', 'important');
    overlayEl.style.setProperty('top', '0', 'important');
    overlayEl.style.setProperty('left', '0', 'important');
    overlayEl.style.setProperty('right', '0', 'important');
    overlayEl.style.setProperty('bottom', '0', 'important');
    overlayEl.style.setProperty('width', '100vw', 'important');
    overlayEl.style.setProperty('height', '100vh', 'important');
    overlayEl.style.setProperty('display', 'flex', 'important');
    overlayEl.style.setProperty('justify-content', 'center', 'important');
    overlayEl.style.setProperty('align-items', 'center', 'important');
    overlayEl.style.setProperty('z-index', '31100', 'important');

    // selectedRegion 已在上方确定，无需重新赋值
    const $focusArea = overlay.find('.acu-map-focus-area');
    const $thumbnails = overlay.find('.acu-map-thumbnails');
    const $regionTabs = overlay.find('.acu-map-region-tabs');

    // 图标渲染：支持 fa:xxx / ti:xxx 简写和原生emoji
    const renderIconContent = (icon: string): string => {
      if (icon.startsWith('fa:')) {
        const name = icon.slice(3);
        return `<i class="fa-solid fa-${name} acu-theme-icon"></i>`;
      }
      if (icon.startsWith('ti:')) {
        const name = icon.slice(3);
        return `<i class="ti ti-${name} acu-theme-icon"></i>`;
      }
      return icon;
    };

    const renderElementChip = element => {
      const name = element.name || element.type || '元素';
      const iconContext = createGlobalInteractionCustomTableNameIconContext(element.tableName, name);
      const fallbackEmojiContent = element.emoji ? renderIconContent(element.emoji) : '';
      const emojiContent = iconContext
        ? renderCustomTableNameIconContent(fallbackEmojiContent, iconContext)
        : fallbackEmojiContent;
      const emoji = element.emoji || iconContext ? `<span class="acu-map-chip-emoji">${emojiContent}</span>` : '';
      return `
                 <div class="acu-map-element-chip acu-dash-preview-trigger" data-table-key="${escapeHtml(
                   element.tableKey || '',
                 )}" data-row-index="${element.rowIndex}">
                     ${emoji}
                     <span class="acu-map-chip-name" title="${escapeHtml(name)}">${escapeHtml(name)}</span>
                 </div>
             `;
    };

    const renderFocusArea = (model, locationName) => {
      const location = model.locations.get(locationName);
      if (!location) {
        return '<div class="acu-map-loading acu-map-loading-wide"><div class="acu-map-spinner"></div></div>';
      }

      const characters = model.characters.get(locationName) || [];
      const elements = model.elements.get(locationName) || [];

      // 分割角色和元素到左右两侧
      const leftChars = characters.slice(0, Math.ceil(characters.length / 2));
      const rightChars = characters.slice(Math.ceil(characters.length / 2));
      const leftElems = elements.slice(0, Math.ceil(elements.length / 2));
      const rightElems = elements.slice(Math.ceil(elements.length / 2));

      const renderAvatarHtml = char => {
        const displayName = replaceUserPlaceholders(char.name);
        // 角色节点始终走 AvatarManager，地图人物面禁止接入自定义表名图标。
        const avatarStyle = escapeHtml(
          buildAvatarBackgroundStyle(char.avatarUrl, char.avatarOffsetX, char.avatarOffsetY, char.avatarScale),
        );
        const hasAvatar = Boolean(avatarStyle);
        return `
            <div class="acu-map-avatar acu-dash-preview-trigger" data-table-key="${escapeHtml(
              char.tableKey || '',
            )}" data-row-index="${char.rowIndex}">
                <div class="acu-map-avatar-circle" style="${avatarStyle}">
                    ${hasAvatar ? '' : `<span>${escapeHtml(displayName.charAt(0))}</span>`}
                </div>
                <div class="acu-map-avatar-name" title="${escapeHtml(displayName)}">${escapeHtml(
                  displayName.length > 4 ? displayName.substring(0, 4) + '..' : displayName,
                )}</div>
            </div>
        `;
      };

      const leftAvatarsHtml = leftChars.length ? leftChars.map(renderAvatarHtml).join('') : '';
      const rightAvatarsHtml = rightChars.length ? rightChars.map(renderAvatarHtml).join('') : '';
      const leftElemsHtml = leftElems.length ? leftElems.map(e => renderElementChip(e)).join('') : '';
      const rightElemsHtml = rightElems.length ? rightElems.map(e => renderElementChip(e)).join('') : '';

      const locationIconContext = createGlobalInteractionCustomTableNameIconContext(location.tableName, location.name);
      const locationEmojiHtml = location.emoji
        ? renderCustomTableNameIconContent(renderIconContent(location.emoji), locationIconContext)
        : null;
      const locationTextHtml = renderCustomTableNameIconContent(
        escapeHtml(location.name.charAt(0) || '□'),
        locationIconContext,
      );
      const emojiHtml = locationEmojiHtml
        ? `<div class="acu-map-location-emoji">${locationEmojiHtml}</div>`
        : `<div class="acu-map-location-text">${locationTextHtml}</div>`;

      return `
        <div class="acu-map-wing left">
            <div class="acu-map-avatar-group acu-group-left">${leftAvatarsHtml || ''}</div>
            <div class="acu-map-element-group acu-group-left">${leftElemsHtml || ''}</div>
        </div>
        <div class="acu-map-stage-center acu-dash-preview-trigger" data-table-key="${escapeHtml(
          location.tableKey,
        )}" data-row-index="${location.rowIndex}">
            ${emojiHtml}
            <div class="acu-map-location-name" title="${escapeHtml(location.name)}">${escapeHtml(location.name)}</div>
        </div>
        <div class="acu-map-wing right">
            <div class="acu-map-avatar-group acu-group-right">${rightAvatarsHtml || ''}</div>
            <div class="acu-map-element-group acu-group-right">${rightElemsHtml || ''}</div>
        </div>
        <div class="acu-map-mobile-stack">
            <div class="acu-map-mobile-avatars">${leftAvatarsHtml || ''}${rightAvatarsHtml || ''}</div>
            <div class="acu-map-mobile-elements">${leftElemsHtml || ''}${rightElemsHtml || ''}</div>
        </div>
    `;
    };

    const renderThumbnailLocation = (model, location, isActive) => {
      const charCount = (model.characters.get(location.name) || []).length;
      const elementCount = (model.elements.get(location.name) || []).length;
      const totalCount = charCount + elementCount;
      const locationIconContext = createGlobalInteractionCustomTableNameIconContext(location.tableName, location.name);
      const emoji = location.emoji
        ? `<div class="acu-map-thumbnail-emoji">${renderCustomTableNameIconContent(renderIconContent(location.emoji), locationIconContext)}</div>`
        : `<div class="acu-map-thumbnail-placeholder">${renderCustomTableNameIconContent(escapeHtml(location.name.charAt(0) || '□'), locationIconContext)}</div>`;
      const badgeHtml = totalCount > 0 ? `<div class="acu-map-thumbnail-badge">${totalCount}</div>` : '';
      return `
        <div class="acu-map-thumbnail ${isActive ? 'active' : ''}" data-location="${escapeHtml(location.name)}" role="button" tabindex="0" aria-pressed="${isActive ? 'true' : 'false'}" aria-label="查看地点：${escapeHtml(location.name)}">
            ${badgeHtml}
            ${emoji}
            <div class="acu-map-thumbnail-name" title="${escapeHtml(location.name)}">${escapeHtml(
              location.name.length > 6 ? location.name.substring(0, 6) + '..' : location.name,
            )}</div>
        </div>
    `;
    };

    const renderRegionTabs = (regions, currentRegion) => {
      if (regions.length <= 1) return '';
      return regions
        .map(
          r =>
            `<button class="acu-map-region-tab ${r === currentRegion ? 'active' : ''}" type="button" data-region="${escapeHtml(
              r,
            )}" aria-pressed="${r === currentRegion ? 'true' : 'false'}">${escapeHtml(r)}</button>`,
        )
        .join('');
    };

    const refreshPanel = () => {
      $focusArea.html(renderFocusArea(viewModel, focusLocation));

      const regionLocations = Array.from(viewModel.locations.values())
        .filter(l => (l.region || '其他') === selectedRegion)
        .sort((a, b) => {
          // 按交互热度排序: 角色数 + 元素数（降序）
          const scoreA =
            (viewModel.characters.get(a.name)?.length || 0) + (viewModel.elements.get(a.name)?.length || 0);
          const scoreB =
            (viewModel.characters.get(b.name)?.length || 0) + (viewModel.elements.get(b.name)?.length || 0);
          return scoreB - scoreA;
        });

      const thumbnails = regionLocations
        .map(location => renderThumbnailLocation(viewModel, location, location.name === focusLocation))
        .join('');
      $thumbnails.html(thumbnails || '<div class="acu-map-empty">该地区暂无其他地点</div>');

      $regionTabs.html(renderRegionTabs(viewModel.allRegions, selectedRegion));
      hydrateCustomTableNameIconsIn(overlay);

      window.requestAnimationFrame(() => {
        const activeTab = $regionTabs.find('.acu-map-region-tab.active')[0] as HTMLElement | undefined;
        activeTab?.scrollIntoView({ block: 'nearest', inline: 'center' });
      });
    };

    const setFocusLocation = name => {
      if (!name) return;
      focusLocation = name;
      Store.set(STORAGE_KEY_MAP_FOCUS, focusLocation);
      // 将用户选择写入当前地区的缓存
      tabSelectionCache.set(selectedRegion, focusLocation);
      refreshPanel();
    };

    refreshPanel();

    // [新增] 存储刷新回调，供外部删除操作调用
    overlay.data('refreshMapData', async () => {
      const newViewModel = await buildMapViewModel();
      if (newViewModel) {
        viewModel = newViewModel;

        // [修复] 检查当前焦点地点是否仍然存在，不存在则回退
        if (!viewModel.locations.has(focusLocation)) {
          // [优化] 优先回退到当前次要地区的第一个详细地点
          const detailLocation = viewModel.detailLocation || '';
          const playerLocation = viewModel.playerLocation || '';

          let newFocus = '';
          let newRegion = selectedRegion;

          // 优先级1: 当前次要地区的第一个可用地点
          const regionLocs = Array.from(viewModel.locations.values()).filter(
            l => (l.region || '其他') === selectedRegion,
          );
          if (regionLocs.length > 0) {
            newFocus = regionLocs[0].name;
          } else if (detailLocation && viewModel.locations.has(detailLocation)) {
            // 优先级2: detailLocation（当前次要地区不存在时）
            newFocus = detailLocation;
            const loc = viewModel.locations.get(detailLocation);
            newRegion = loc?.region || newRegion;
          } else if (playerLocation && viewModel.locations.has(playerLocation)) {
            // 优先级3: playerLocation
            newFocus = playerLocation;
            const loc = viewModel.locations.get(playerLocation);
            newRegion = loc?.region || newRegion;
          } else if (viewModel.focusLocation && viewModel.locations.has(viewModel.focusLocation)) {
            // 优先级4: focusLocation
            newFocus = viewModel.focusLocation;
            const loc = viewModel.locations.get(newFocus);
            newRegion = loc?.region || newRegion;
          } else {
            // 兜底：任意第一个地点
            const firstLoc = Array.from(viewModel.locations.values())[0];
            if (firstLoc) {
              newFocus = firstLoc.name;
              newRegion = firstLoc.region || '其他';
            }
          }

          if (newFocus) {
            focusLocation = newFocus;
            selectedRegion = newRegion;
            // 同步更新Store，防止下次打开地图时跳回已删除地点
            Store.set(STORAGE_KEY_MAP_FOCUS, focusLocation);
            // 更新tab缓存
            tabSelectionCache.set(selectedRegion, focusLocation);
          }
        }

        refreshPanel();
      }
    });

    // [修复] 直接绑定关闭按钮事件（而非事件委托，避免被其他事件干扰）
    const $closeBtn = overlay.find('.acu-map-close');
    $closeBtn.on('click', e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      overlay.remove();
    });
    overlay.on('click', '.acu-map-region-tab', function () {
      const newRegion = $(this).data('region');
      if (newRegion === selectedRegion) return;
      selectedRegion = newRegion;

      // 检查当前 focusLocation 是否在新地区内
      const regionLocations = Array.from(viewModel.locations.values()).filter(
        l => (l.region || '其他') === selectedRegion,
      );
      const currentInNewRegion = regionLocations.find(l => l.name === focusLocation);

      if (!currentInNewRegion && regionLocations.length > 0) {
        // 优先级: 缓存的选中地点 > 热度最高的地点
        const cachedLocation = tabSelectionCache.get(selectedRegion);
        const cachedInRegion = cachedLocation && regionLocations.find(l => l.name === cachedLocation);

        if (cachedInRegion) {
          // 使用缓存的选中地点
          focusLocation = cachedLocation;
        } else {
          // 使用热度最高的地点（已按热度排序）
          const hotLocations = getHotLocationsInRegion(selectedRegion);
          focusLocation = hotLocations.length > 0 ? hotLocations[0].name : regionLocations[0].name;
        }
        Store.set(STORAGE_KEY_MAP_FOCUS, focusLocation);
      }

      refreshPanel();
    });
    setupOverlayClose(overlay, 'acu-map-overlay', () => {
      overlay.remove();
    });

    overlay.on('click', '.acu-map-thumbnail', function () {
      const locationName = $(this).data('location');
      if (locationName) setFocusLocation(locationName);
    });

    overlay.on('keydown', '.acu-map-thumbnail', function (this: HTMLElement, e: JQuery.KeyDownEvent) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const locationName = $(this).data('location');
      if (locationName) setFocusLocation(locationName);
    });

    overlay.on('click', '.acu-map-back-btn', () => {
      const fallbackFocus = viewModel.focusLocation;
      const detailLocation = viewModel.detailLocation || '';
      const playerLocation = viewModel.playerLocation || '';

      let target = '';
      if (detailLocation && viewModel.locations.has(detailLocation)) {
        target = detailLocation;
      } else if (playerLocation && viewModel.locations.has(playerLocation)) {
        target = playerLocation;
      } else if (fallbackFocus && viewModel.locations.has(fallbackFocus)) {
        target = fallbackFocus;
      }

      if (!target) return;

      // 找到目标地点所属的地区，同时切换
      const targetLocation = viewModel.locations.get(target);
      const targetRegion = targetLocation?.region || viewModel.currentRegion || '其他';
      if (targetRegion !== selectedRegion) {
        selectedRegion = targetRegion;
      }

      focusLocation = target;
      Store.set(STORAGE_KEY_MAP_FOCUS, focusLocation);
      refreshPanel();
    });

    // 弹窗创建完成，重置锁（允许关闭后重新打开）
    isMapOpening = false;

    // 地图打开时只加载一次数据，不需要持续轮询
    // 用户无法在地图弹窗打开时修改表格数据
  };

  type RelationGraphCell = string | number | null | undefined;
  type RelationGraphRow = RelationGraphCell[];

  interface RelationGraphTableInput {
    headers?: RelationGraphCell[];
    rows?: RelationGraphRow[];
    key?: string;
  }

  interface RelationshipGraphSourceTableMatch {
    tableName: string;
    table: RelationGraphTableInput;
  }

  interface RelationshipGraphBuildOptions {
    tableName?: string;
  }

  interface RelationshipGraphRenderOptions {
    includePlayerRelations?: boolean;
  }

  interface RelationGraphNode {
    name: string;
    isPlayer: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    tableKey: string;
    rowIndex?: number;
    isInScene?: boolean;
    fixed?: boolean;
  }

  interface RelationGraphEdge {
    source: string;
    target: string;
    labelsFromSource: string[];
    labelsFromTarget: string[];
  }

  interface ParsedRelationshipItem {
    name: string;
    relation: string;
  }

  interface RelationGraphColumnMatch {
    index: number;
    isConfigured: boolean;
  }

  const RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS = ['人际关系', 'relation_state', 'relation_text'];

  const findRelationGraphColumnIndex = (headers: RelationGraphCell[], keywords: string[]): number => {
    for (let i = 0; i < headers.length; i++) {
      const header = String(headers[i] || '').toLowerCase();
      if (keywords.some(keyword => header.includes(keyword.toLowerCase()))) {
        return i;
      }
    }
    return -1;
  };

  const findRelationGraphRelationColumnMatch = (
    headers: RelationGraphCell[],
    configuredKeywords: string[],
  ): RelationGraphColumnMatch => {
    const configuredIndex = findRelationGraphColumnIndex(headers, configuredKeywords);
    if (configuredIndex >= 0) {
      return { index: configuredIndex, isConfigured: true };
    }

    return {
      index: findRelationGraphColumnIndex(headers, RELATION_GRAPH_FALLBACK_RELATION_COLUMN_KEYWORDS),
      isConfigured: false,
    };
  };

  const findRelationshipGraphSourceTables = (
    allTables: Record<string, RelationGraphTableInput>,
    tableKeywords: string[],
  ): RelationshipGraphSourceTableMatch[] => {
    const matches: RelationshipGraphSourceTableMatch[] = [];
    const matchedTableNames = new Set<string>();

    for (const keyword of tableKeywords) {
      for (const tableName in allTables) {
        if (tableName.includes(keyword) && !matchedTableNames.has(tableName)) {
          matchedTableNames.add(tableName);
          matches.push({ tableName, table: allTables[tableName] });
        }
      }
    }
    return matches;
  };

  const buildRelationshipGraphTableFromPreset = (
    allTables: Record<string, RelationGraphTableInput>,
    sources: DashboardRelationshipGraphSourceConfig[],
    options: RelationshipGraphBuildOptions = {},
  ): RelationGraphTableInput | null => {
    const rows: RelationGraphRow[] = [];
    const headers: RelationGraphCell[] = ['row_id', '姓名', '人际关系', '在场状态'];
    const usedSources: string[] = [];
    const matchedTableKeys = new Set<string>();
    const targetTableName = String(options.tableName || '').trim();

    sources.forEach((source, sourceIndex) => {
      const sourceTableResults = findRelationshipGraphSourceTables(allTables, source.tableKeywords);
      if (sourceTableResults.length === 0) {
        console.info(
          withTableTemplateCheckHint(
            `[DICE]人物关系图预设: 来源${sourceIndex + 1}未找到表格 (关键词: ${source.tableKeywords.join(', ')})`,
          ),
        );
        return;
      }

      const tableResults = targetTableName
        ? sourceTableResults.filter(tableResult => tableResult.tableName === targetTableName)
        : sourceTableResults;

      tableResults.forEach(tableResult => {
        const sourceHeaders = (tableResult.table.headers || []).map(header => String(header || ''));
        const configuredNameIdx = findRelationGraphColumnIndex(sourceHeaders, source.nameColumn);
        const nameIdx = configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(sourceHeaders, -1);
        const relationColumnMatch = findRelationGraphRelationColumnMatch(sourceHeaders, source.relationColumn);
        const relationIdx = relationColumnMatch.index;
        if (nameIdx < 0 || relationIdx < 0) {
          console.warn(
            withTableTemplateCheckHint(
              `[DICE]人物关系图预设: 表格"${tableResult.tableName}"缺少名称列或关系列 (名称关键词: ${source.nameColumn.join(', ')}; 关系关键词: ${source.relationColumn.join(', ')})`,
            ),
          );
          return;
        }

        const inSceneIdx = sourceHeaders.findIndex(header => header.includes('在场'));
        const sourceRows = tableResult.table.rows || [];
        sourceRows.forEach((row, rowIndex) => {
          const name = String(row[nameIdx] || '').trim();
          const relationValue = String(row[relationIdx] || '').trim();
          if (!name || !relationValue) return;

          const relationText =
            source.mode === 'fixedTarget' && relationColumnMatch.isConfigured
              ? `${source.target && source.target !== 'player' ? source.target : USER_NODE_KEY}:${relationValue}`
              : relationValue;

          rows.push([row[0] ?? rowIndex + 1, name, relationText, inSceneIdx >= 0 ? row[inSceneIdx] : '']);
        });
        if (tableResult.table.key) matchedTableKeys.add(tableResult.table.key);
        usedSources.push(`${tableResult.tableName}.${sourceHeaders[relationIdx] || '关系列'}`);
      });
    });

    if (rows.length === 0) {
      console.warn('[DICE]人物关系图预设: 未从配置来源中解析到关系数据');
      return null;
    }

    console.info(`[DICE]人物关系图预设: 已合并来源 ${usedSources.join('、')}，共${rows.length}行`);
    return {
      headers,
      rows,
      key: matchedTableKeys.size === 1 ? Array.from(matchedTableKeys)[0] : '',
    };
  };

  const isDashboardRoleInSceneValue = (value, header = ''): boolean => {
    const normalized = String(value || '')
      .trim()
      .toLowerCase();
    if (!normalized) return false;

    const normalizedHeader = String(header || '').toLowerCase();
    if (normalizedHeader.includes('离场')) {
      return (
        normalized === '否' ||
        normalized === 'false' ||
        normalized === 'no' ||
        normalized === '0' ||
        normalized.includes('未离场') ||
        normalized.includes('不离场')
      );
    }

    if (normalized === 'true' || normalized === 'yes' || normalized === '是' || normalized === '1') return true;
    if (normalized.includes('不在场') || normalized.includes('离场')) return false;
    return normalized.startsWith('在场') || normalized.includes('在场');
  };

  const pushDashboardNpcEntry = (entries, entry): void => {
    const name = String(entry.name || '').trim();
    if (!name) return;
    if (entries.some(existing => characterNamesMatch(existing.name, name))) return;
    entries.push({ ...entry, name });
  };

  const findDashboardNpcNameColumnIndex = (headers, source): number => {
    if (source?.nameColumn) {
      const configuredNameIdx = findRelationGraphColumnIndex(headers, source.nameColumn);
      return configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(headers, -1);
    }

    const npcConfig = getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
    const configuredNameIdx = DashboardDataParser.findColumnIndex(headers, 'name', npcConfig);
    return configuredNameIdx >= 0 ? configuredNameIdx : findNameColumnIndex(headers, -1);
  };

  const collectDashboardNpcEntriesFromTableResult = (entries, tableResult, source = null): number => {
    const table = tableResult?.table || tableResult?.data;
    if (!table) return 0;

    const tableName = String(tableResult.tableName || tableResult.name || '');
    const tableKey = String(table.key || tableResult.key || '');
    const headers = (table.headers || []).map(header => String(header || ''));
    const rows = table.rows || [];
    const nameIdx = findDashboardNpcNameColumnIndex(headers, source);

    if (nameIdx < 0) {
      console.warn(withTableTemplateCheckHint(`[DICE]仪表盘角色区: 表格"${tableName || '未知'}"缺少名称列`));
      return 0;
    }

    if (source?.relationColumn && findRelationGraphRelationColumnMatch(headers, source.relationColumn).index < 0) {
      console.warn(withTableTemplateCheckHint(`[DICE]仪表盘角色区: 表格"${tableName || '未知'}"缺少关系列`));
      return 0;
    }

    const npcConfig = getDashboardModuleConfig('npc') || DASHBOARD_TABLE_CONFIG.npc;
    const statusIdx = DashboardDataParser.findColumnIndex(headers, 'status', npcConfig);
    const positionIdx = DashboardDataParser.findColumnIndex(headers, 'position', npcConfig);
    let inSceneIdx = DashboardDataParser.findColumnIndex(headers, 'inScene', npcConfig);
    if (inSceneIdx < 0 || inSceneIdx >= headers.length) {
      inSceneIdx = headers.findIndex(header => header.includes('在场') || header.includes('离场'));
    }

    const beforeCount = entries.length;
    rows.forEach((row, rowIndex) => {
      const rawName = String(row?.[nameIdx] || '').trim();
      if (!rawName) return;
      pushDashboardNpcEntry(entries, {
        name: rawName,
        status: statusIdx >= 0 && statusIdx < row.length ? row[statusIdx] || '' : '',
        position: positionIdx >= 0 && positionIdx < row.length ? row[positionIdx] || '' : '',
        isInScene:
          inSceneIdx >= 0 && inSceneIdx < row.length
            ? isDashboardRoleInSceneValue(row[inSceneIdx], headers[inSceneIdx])
            : false,
        index: rowIndex,
        tableKey,
        tableName,
      });
    });

    return entries.length - beforeCount;
  };

  const collectDashboardNpcEntriesFromTableResults = tableResults => {
    const entries = [];
    tableResults.forEach(tableResult => collectDashboardNpcEntriesFromTableResult(entries, tableResult));
    return entries;
  };

  const collectDashboardNpcEntriesFromRelationshipSources = (
    allTables: Record<string, RelationGraphTableInput>,
    sources: DashboardRelationshipGraphSourceConfig[],
  ) => {
    const entries = [];
    const matchedTableKeys = new Set<string>();
    const usedSources: string[] = [];

    sources.forEach((source, sourceIndex) => {
      const sourceTableResults = findRelationshipGraphSourceTables(allTables, source.tableKeywords);
      if (sourceTableResults.length === 0) {
        console.info(
          withTableTemplateCheckHint(
            `[DICE]仪表盘角色区: 来源${sourceIndex + 1}未找到表格 (关键词: ${source.tableKeywords.join(', ')})`,
          ),
        );
        return;
      }

      sourceTableResults.forEach(tableResult => {
        const tableKey = String(tableResult.table.key || tableResult.tableName || '');
        if (tableKey && matchedTableKeys.has(tableKey)) return;

        const addedCount = collectDashboardNpcEntriesFromTableResult(entries, tableResult, source);
        if (addedCount > 0) {
          if (tableKey) matchedTableKeys.add(tableKey);
          usedSources.push(tableResult.tableName);
        }
      });
    });

    if (entries.length > 0) {
      console.info(`[DICE]仪表盘角色区: 已合并来源 ${usedSources.join('、')}，共${entries.length}名角色`);
    }
    return entries;
  };

  const getDashboardNpcListData = (allTables: Record<string, RelationGraphTableInput>) => {
    const npcTableResults = DashboardDataParser.findTables(allTables, 'npc');
    const graphSources = getActiveDashboardRelationshipGraphSources();
    const graphEntries =
      graphSources.length > 0 ? collectDashboardNpcEntriesFromRelationshipSources(allTables, graphSources) : [];
    const entries =
      graphEntries.length > 0 ? graphEntries : collectDashboardNpcEntriesFromTableResults(npcTableResults);
    const primaryEntry = entries[0];
    const primaryTable = npcTableResults[0];

    return {
      entries,
      tableName: primaryEntry?.tableName || primaryTable?.name || '重要角色表',
      tableKey: primaryEntry?.tableKey || primaryTable?.key || '',
      hasTable: entries.length > 0 || npcTableResults.length > 0,
    };
  };

  interface AvatarManagerNode {
    name: string;
    isPlayer: boolean;
    rowIndex?: number;
    tableKey?: string;
  }

  type AvatarManagerViewMode = 'chat' | 'global';

  interface AvatarManagerOptions {
    initialView?: AvatarManagerViewMode;
  }

  const collectCurrentChatAvatarNodes = (allTables: Record<string, RelationGraphTableInput>): AvatarManagerNode[] => {
    const npcListData = getDashboardNpcListData(allTables);
    const playerResult = DashboardDataParser.findTable(allTables, 'player');
    const nodeArr: AvatarManagerNode[] = [];

    if (playerResult?.data?.rows?.[0]) {
      const playerNameIdx = findNameColumnIndex(playerResult.data.headers || []);
      const playerName = playerResult.data.rows[0][playerNameIdx];
      if (playerName && typeof playerName === 'string' && playerName.trim()) {
        nodeArr.push({ name: playerName.trim(), isPlayer: true });
      }
    }

    npcListData.entries.forEach(npc => {
      const npcName = String(npc.name || '').trim();
      if (npcName) {
        nodeArr.push({ name: npcName, isPlayer: false, rowIndex: npc.index, tableKey: npc.tableKey });
      }
    });

    return nodeArr;
  };

  const getCurrentChatAvatarNodes = (): AvatarManagerNode[] => {
    const rawData = getCachedRawData() || getTableData();
    const allTables = processJsonData(rawData);
    if (!allTables || allTables.length === 0) return [];
    return collectCurrentChatAvatarNodes(allTables as Record<string, RelationGraphTableInput>);
  };

  interface RelationGraphLayoutPosition {
    x: number;
    y: number;
  }

  type RelationGraphLayoutCache = Record<string, RelationGraphLayoutPosition>;
  type RelationGraphLayoutLoadResult = 'none' | 'partial' | 'full';

  // 人物关系图可视化
  const showRelationshipGraph = (npcTable: RelationGraphTableInput, options: RelationshipGraphRenderOptions = {}) => {
    console.info('[DICE]开始抓取人物关系表数据...');
    const { $ } = getCore();
    $('.acu-relation-graph-overlay').remove();

    const config = getConfig();

    const headers = (npcTable.headers || []).map(header => String(header || ''));
    const rows = npcTable.rows || [];

    const nameIdx = findNameColumnIndex(headers);
    const relationIdx = headers.findIndex(h => h && h.includes('人际关系'));
    const npcTableKey = npcTable.key || '';

    console.info(`[DICE]人物关系表查找: 表格"${npcTableKey || '未知'}"，共${rows.length}行数据`);

    if (relationIdx < 0) {
      console.warn('[DICE]人物关系表查找: 未找到"人际关系"列');
      warnTableTemplateIssue('未找到"人际关系"列');
      return;
    }

    const nodes = new Map<string, RelationGraphNode>();
    const edges: RelationGraphEdge[] = [];

    const resolveName = (name: RelationGraphCell): string => resolveUserGraphName(String(name || ''));

    const rawData = getCachedRawData() || getTableData();
    // 重建别名注册表
    NameAliasRegistry.rebuild(processJsonData(rawData || {}));
    let playerName = '主角';
    if (rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name?.includes('主角') && sheet.content?.[1]) {
          const headers = sheet.content[0] || [];
          playerName = getRowDisplayName(sheet.content[1], headers) || '主角';
          break;
        }
      }
    }
    const resolvedPlayerName = resolveName(playerName);
    const playerTableKey = (() => {
      for (const k in rawData) {
        if (rawData[k]?.name?.includes('主角')) return k;
      }
      return '';
    })();
    nodes.set(resolvedPlayerName, {
      name: resolvedPlayerName,
      isPlayer: true,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 0,
      tableKey: playerTableKey,
      rowIndex: 0,
    });

    // 查找"在场状态"列索引（模糊匹配）
    const inSceneColIdx = headers.findIndex(h => h && h.includes('在场'));

    rows.forEach((row, idx) => {
      const rawNpcName = row[nameIdx];
      if (!rawNpcName) return;

      const npcName = resolveName(rawNpcName);

      // 判断是否在场：支持多种格式
      let isInScene = false;
      if (inSceneColIdx > 0) {
        const inSceneVal = String(row[inSceneColIdx] || '')
          .trim()
          .toLowerCase();
        const header = String(headers[inSceneColIdx] || '').toLowerCase();

        if (header.includes('离场')) {
          isInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
        } else {
          isInScene =
            inSceneVal.startsWith('在场') || inSceneVal === 'true' || inSceneVal === '是' || inSceneVal === 'yes';
        }
      }

      if (!nodes.has(npcName)) {
        nodes.set(npcName, {
          name: npcName,
          isPlayer: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          radius: 0,
          tableKey: npcTableKey,
          rowIndex: idx,
          isInScene: isInScene,
        });
      }

      const relationStr = row[relationIdx] || '';
      const relations = parseRelationshipString(String(relationStr || '')) as ParsedRelationshipItem[];

      relations.forEach(rel => {
        if (!rel.name) return;
        const resolvedRelName = resolveName(rel.name);

        if (resolvedRelName === npcName) return;

        if (!nodes.has(resolvedRelName)) {
          // 查找该人物在NPC表中的行索引
          let relRowIndex = -1;
          let relIsInScene = false;
          for (let ri = 0; ri < rows.length; ri++) {
            if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
              relRowIndex = ri;
              // 同时读取该角色的在场状态
              if (inSceneColIdx > 0) {
                const inSceneVal = String(rows[ri][inSceneColIdx] || '')
                  .trim()
                  .toLowerCase();
                const header = String(headers[inSceneColIdx] || '').toLowerCase();

                if (header.includes('离场')) {
                  relIsInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
                } else {
                  relIsInScene =
                    inSceneVal.startsWith('在场') ||
                    inSceneVal === 'true' ||
                    inSceneVal === '是' ||
                    inSceneVal === 'yes';
                }
              }
              break;
            }
          }
          nodes.set(resolvedRelName, {
            name: resolvedRelName,
            isPlayer: resolvedRelName === resolvedPlayerName,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            radius: 0,
            tableKey: relRowIndex >= 0 ? npcTableKey : '',
            rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
            isInScene: relIsInScene,
          });
        }

        // 清洗关系词：移除冗余前缀/后缀，分割多关系词
        const cleanRelation = (rawRel: RelationGraphCell): string[] => {
          if (!rawRel) return [];
          const parts = String(rawRel)
            .split(/[,，、;；\/\|]+|\s*[和与&]\s*|\s{2,}|\n/)
            .map(s => s.trim())
            .filter(s => s && s.length < 30); // 放宽初筛限制，后续智能提取

          // 常见关系词库（用于从长文本中智能提取）
          const commonRelations = [
            '恋人',
            '情侣',
            '夫妻',
            '伴侣',
            '爱人',
            '男友',
            '女友',
            '前男友',
            '前女友',
            '朋友',
            '好友',
            '挚友',
            '密友',
            '闺蜜',
            '死党',
            '知己',
            '损友',
            '同学',
            '校友',
            '同窗',
            '学长',
            '学姐',
            '学弟',
            '学妹',
            '前辈',
            '后辈',
            '同事',
            '上司',
            '下属',
            '老板',
            '员工',
            '搭档',
            '队友',
            '战友',
            '伙伴',
            '师父',
            '师傅',
            '徒弟',
            '弟子',
            '老师',
            '学生',
            '导师',
            '门生',
            '父亲',
            '母亲',
            '儿子',
            '女儿',
            '兄弟',
            '姐妹',
            '哥哥',
            '姐姐',
            '弟弟',
            '妹妹',
            '爷爷',
            '奶奶',
            '外公',
            '外婆',
            '叔叔',
            '阿姨',
            '舅舅',
            '姑姑',
            '表哥',
            '表姐',
            '表弟',
            '表妹',
            '堂兄',
            '堂弟',
            '堂姐',
            '堂妹',
            '家人',
            '亲人',
            '亲戚',
            '血亲',
            '义父',
            '义母',
            '义兄',
            '义妹',
            '敌人',
            '仇人',
            '对手',
            '劲敌',
            '宿敌',
            '情敌',
            '死敌',
            '冤家',
            '邻居',
            '室友',
            '房东',
            '租客',
            '客户',
            '商人',
            '雇主',
            '雇员',
            '信徒',
            '教徒',
            '追随者',
            '崇拜者',
            '粉丝',
            '陌生人',
            '熟人',
            '路人',
            '过客',
          ];

          return parts
            .map(p => {
              // [新增] 移除所有中英文括号及其内容
              p = p.replace(/[（(][^）)]*[）)]/g, '').trim();
              // === 特殊前缀处理：XX的目标/对象 → 保留XX ===
              const specialSuffixMatch = p.match(/^(.+)的(目标|对象)$/);
              if (specialSuffixMatch) {
                p = specialSuffixMatch[1]; // "执念的目标" → "执念"
              } else {
                // === 普通情况：XX的YY → 保留YY ===
                p = p.replace(/^[\u4e00-\u9fa5]{2,4}的(?=[\u4e00-\u9fa5]{1,4}$)/, '');
              }

              // === 移除冗余前缀 ===
              p = p.replace(/^(?:属于|作为|身为|是其?|为其?|乃)/, '');
              p = p.replace(/^(?:曾经是?|以前是?|原本是?|前)/, '前');
              p = p.replace(/^(?:互为|彼此是?|相互是?)/, '');

              // === 移除冗余后缀 ===
              p = p.replace(/关系$/, '');
              p = p.replace(/对象$/, '');
              p = p.replace(/目标$/, '');

              // === 特殊短语替换 ===
              p = p.replace(/^关系复杂$/, '复杂');
              p = p.replace(/^关系不明$/, '不明');
              p = p.replace(/^关系微妙$/, '微妙');
              p = p.replace(/^关系紧张$/, '紧张');
              p = p.replace(/^关系亲密$/, '亲密');
              p = p.replace(/^关系疏远$/, '疏远');
              p = p.replace(/^(?:不认识|不熟悉|陌生人?)$/, '陌生');
              p = p.replace(/^(?:认识|熟人)$/, '熟人');
              p = p.replace(/^(?:好朋友|挚友|密友|至交)$/, '挚友');
              p = p.replace(/^(?:男朋友|男友)$/, '男友');
              p = p.replace(/^(?:女朋友|女友)$/, '女友');
              p = p.replace(/^(?:前男友|前男朋友)$/, '前男友');
              p = p.replace(/^(?:前女友|前女朋友)$/, '前女友');
              p = p.replace(/^(?:暗恋对象|暗恋)$/, '暗恋');
              p = p.replace(/^(?:单相思|单恋)$/, '单恋');
              p = p.replace(/^(?:青梅竹马|儿时玩伴|发小)$/, '青梅竹马');
              p = p.replace(/^(?:同班同学|同级同学)$/, '同学');
              p = p.replace(/^(?:工作伙伴|合作伙伴|搭档)$/, '搭档');

              p = p.trim();

              // === [新增] 智能提取：如果处理后仍然过长，尝试从末尾提取常见关系词 ===
              if (p.length > 8) {
                // 尝试匹配末尾的常见关系词
                for (const rel of commonRelations) {
                  if (p.endsWith(rel)) {
                    return rel;
                  }
                }
                // 如果没匹配到，尝试提取最后2-4个字
                const lastChars = p.slice(-4);
                for (const rel of commonRelations) {
                  if (lastChars.includes(rel)) {
                    return rel;
                  }
                }
                // 兜底：取最后3个字
                return p.slice(-3);
              }

              return p;
            })
            .filter(s => s && s.length > 0 && s.length <= 8);
        };

        const cleanedLabels = cleanRelation(rel.relation);
        if (cleanedLabels.length === 0) cleanedLabels.push('');

        // 查找已存在的边（无论方向）
        const existingEdge = edges.find(
          e =>
            (e.source === npcName && e.target === resolvedRelName) ||
            (e.source === resolvedRelName && e.target === npcName),
        );

        if (!existingEdge) {
          // 创建新边，使用新的数据结构
          edges.push({
            source: npcName,
            target: resolvedRelName,
            // 新结构：分别存储两个方向的标签
            labelsFromSource: cleanedLabels.slice(0, 2), // source→target 方向，最多2个
            labelsFromTarget: [], // target→source 方向
          });
        } else {
          // 边已存在，追加标签到正确的方向
          if (existingEdge.source === npcName) {
            // 当前npc是source，追加到 labelsFromSource
            const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
            // 去重并限制最多2个
            existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
          } else {
            // 当前npc是target，追加到 labelsFromTarget
            const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
            existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
          }
        }
      });
    });

    // [新增] 同时抓取主角信息表的人际关系数据
    if (options.includePlayerRelations !== false && rawData) {
      for (const key in rawData) {
        const sheet = rawData[key];
        if (sheet?.name === '主角信息' && sheet.content?.[1]) {
          const playerHeaders = sheet.content[0] || [];
          const playerRow = sheet.content[1];
          const playerRelIdx = playerHeaders.findIndex(h => h && h.includes('人际关系'));
          if (playerRelIdx > 0 && playerRow[playerRelIdx]) {
            const playerRelations = parseRelationshipString(
              String(playerRow[playerRelIdx] || ''),
            ) as ParsedRelationshipItem[];
            console.info(`[DICE]主角信息表人际关系: 发现${playerRelations.length}条关系`);

            playerRelations.forEach(rel => {
              if (!rel.name) return;
              const resolvedRelName = resolveName(rel.name);
              if (resolvedRelName === resolvedPlayerName) return;

              if (!nodes.has(resolvedRelName)) {
                // 尝试在NPC表中查找该人物的额外信息
                let relRowIndex = -1;
                let relIsInScene = false;
                for (let ri = 0; ri < rows.length; ri++) {
                  if (resolveName(rows[ri][nameIdx]) === resolvedRelName) {
                    relRowIndex = ri;
                    if (inSceneColIdx > 0) {
                      const inSceneVal = String(rows[ri][inSceneColIdx] || '')
                        .trim()
                        .toLowerCase();
                      const header = String(headers[inSceneColIdx] || '').toLowerCase();
                      if (header.includes('离场')) {
                        relIsInScene = inSceneVal === '否' || inSceneVal === 'false' || inSceneVal === 'no';
                      } else {
                        relIsInScene =
                          inSceneVal.startsWith('在场') ||
                          inSceneVal === 'true' ||
                          inSceneVal === '是' ||
                          inSceneVal === 'yes';
                      }
                    }
                    break;
                  }
                }
                nodes.set(resolvedRelName, {
                  name: resolvedRelName,
                  isPlayer: false,
                  x: 0,
                  y: 0,
                  vx: 0,
                  vy: 0,
                  radius: 0,
                  tableKey: relRowIndex >= 0 ? npcTableKey : '',
                  rowIndex: relRowIndex >= 0 ? relRowIndex : undefined,
                  isInScene: relIsInScene,
                });
              }

              // 清洗关系标签（主角信息表格式通常已规范）
              const rawLabel = String(rel.relation || '').trim();
              const cleanedLabels = rawLabel
                ? rawLabel
                    .split(/[,，、\/\|]+/)
                    .map(s => s.trim())
                    .filter(s => s && s.length > 0 && s.length <= 8)
                    .slice(0, 2)
                : [''];
              if (cleanedLabels.length === 0) cleanedLabels.push('');

              // 查找已存在的边（与NPC表处理逻辑一致）
              const existingEdge = edges.find(
                e =>
                  (e.source === resolvedPlayerName && e.target === resolvedRelName) ||
                  (e.source === resolvedRelName && e.target === resolvedPlayerName),
              );

              if (!existingEdge) {
                edges.push({
                  source: resolvedPlayerName,
                  target: resolvedRelName,
                  labelsFromSource: cleanedLabels.slice(0, 2),
                  labelsFromTarget: [],
                });
              } else {
                // 边已存在（可能NPC表已创建该边），追加主角视角的标签
                if (existingEdge.source === resolvedPlayerName) {
                  const combined = [...(existingEdge.labelsFromSource || []), ...cleanedLabels];
                  existingEdge.labelsFromSource = [...new Set(combined)].slice(0, 2);
                } else {
                  const combined = [...(existingEdge.labelsFromTarget || []), ...cleanedLabels];
                  existingEdge.labelsFromTarget = [...new Set(combined)].slice(0, 2);
                }
              }
            });
          }
          break;
        }
      }
    }

    const nodeArr = Array.from(nodes.values());
    console.info(`[DICE]人物关系表数据抓取完成，共${nodeArr.length}个节点，${edges.length}条边`);
    const centerX = 400,
      centerY = 300;

    // [新增] 统计每个节点的关系数量
    const connectionCount = new Map<string, number>();
    nodeArr.forEach(node => connectionCount.set(node.name, 0));
    edges.forEach(edge => {
      connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
      connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
    });

    // [新增] 根据屏幕尺寸和关系数量计算节点半径
    const isMobileView = window.innerWidth <= 768;
    const baseRadius = isMobileView ? 22 : 28;
    const maxRadius = isMobileView ? 38 : 50;
    const playerBaseRadius = isMobileView ? 28 : 35;
    const radiusPerConnection = isMobileView ? 2.5 : 3.5;

    // 新增：节点大小和过滤状态（必须在 getNodeRadius 之前声明）
    let nodeSizeMultiplier = 1.0; // 节点大小倍数，默认1.0
    let filterInScene = false; // 是否只显示主角+在场角色
    let filterDirectOnly = false; // 是否只显示与中心角色直接相关的
    let centerNodeName = resolvedPlayerName; // 当前中心节点（默认为主角）

    const getNodeRadius = (nodeName: string, isPlayer: boolean): number => {
      const base = isPlayer ? playerBaseRadius : baseRadius;
      const count = connectionCount.get(nodeName) || 0;
      const calculated = Math.min(maxRadius, base + Math.sqrt(count) * radiusPerConnection);
      // 应用全局大小倍数
      return calculated * nodeSizeMultiplier;
    };

    // 将半径信息存入节点
    nodeArr.forEach(node => {
      node.radius = getNodeRadius(node.name, node.isPlayer);
    });

    // 过滤节点逻辑（支持两个筛选条件的交集）
    const getFilteredNodes = (): RelationGraphNode[] => {
      // 两个都关闭时显示全部
      if (!filterInScene && !filterDirectOnly) return nodeArr;

      // 计算中心角色直接相关的节点集合（如果需要）
      let directNodes: Set<string> | null = null;
      if (filterDirectOnly) {
        directNodes = new Set([centerNodeName]);
        edges.forEach(edge => {
          if (edge.source === centerNodeName) directNodes!.add(edge.target);
          if (edge.target === centerNodeName) directNodes!.add(edge.source);
        });
      }

      return nodeArr.filter(n => {
        // 检查在场条件
        const passInScene = !filterInScene || n.isInScene || n.isPlayer;
        // 检查主角相关条件
        const passDirectOnly = !filterDirectOnly || directNodes!.has(n.name);
        // 两个条件取交集
        return passInScene && passDirectOnly;
      });
    };

    // [Modified] 力导向布局实现
    // ---------------------------------------------------------
    // 物理参数常量 (已调整以增加间距)
    const kRepulsion = 20000; // 斥力常数 (库仑定律) - 大幅增大以推开节点
    const kSpring = 0.02; // 弹力常数 (胡克定律) - 减小以避免拉得太紧
    const kGravity = 0.01; // 中心引力 - 减小以允许图表扩展遍布画面
    const idealLen = 250; // 理想边长 - 增大以拉开连线距离
    const iterations = 300; // 预计算迭代次数
    const timeStep = 0.5; // 模拟时间步长
    const damping = 0.8; // 速度阻尼 (摩擦力)

    // 布局缓存管理
    const LAYOUT_CACHE_KEY = 'acu-relation-graph-layout-cache';

    // 生成布局缓存键（基于节点名单）
    const getLayoutCacheKey = () => {
      const nodeNames = nodeArr
        .map(n => n.name)
        .sort()
        .join('|');
      return `${LAYOUT_CACHE_KEY}-${nodeNames}`;
    };

    // 保存布局到缓存
    const saveLayoutCache = () => {
      try {
        const cacheKey = getLayoutCacheKey();
        const layoutData: RelationGraphLayoutCache = {};
        nodeArr.forEach(node => {
          layoutData[node.name] = { x: node.x, y: node.y };
        });
        localStorage.setItem(cacheKey, JSON.stringify(layoutData));
      } catch (e) {
        console.warn('[DICE]关系图 保存布局缓存失败:', e);
      }
    };

    const parseLayoutCache = (cached: string): RelationGraphLayoutCache | null => {
      const parsed = JSON.parse(cached) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

      const layoutData: RelationGraphLayoutCache = {};
      Object.entries(parsed as Record<string, unknown>).forEach(([name, value]) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return;
        const position = value as Record<string, unknown>;
        const x = Number(position.x);
        const y = Number(position.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        layoutData[name] = { x, y };
      });

      return Object.keys(layoutData).length > 0 ? layoutData : null;
    };

    const readLayoutCache = (cacheKey: string): RelationGraphLayoutCache | null => {
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;
      return parseLayoutCache(cached);
    };

    const findReusableLayoutCache = (): RelationGraphLayoutCache | null => {
      const currentCacheKey = getLayoutCacheKey();
      const currentLayout = readLayoutCache(currentCacheKey);
      if (currentLayout) return currentLayout;

      let bestLayout: RelationGraphLayoutCache | null = null;
      let bestMatchCount = 0;
      const nodeNames = new Set(nodeArr.map(node => node.name));

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || key === currentCacheKey || !key.startsWith(`${LAYOUT_CACHE_KEY}-`)) continue;

        const layoutData = readLayoutCache(key);
        if (!layoutData) continue;

        const matchCount = Object.keys(layoutData).filter(name => nodeNames.has(name)).length;
        if (matchCount > bestMatchCount) {
          bestMatchCount = matchCount;
          bestLayout = layoutData;
        }
      }

      return bestMatchCount > 0 ? bestLayout : null;
    };

    const applyLayoutCache = (layoutData: RelationGraphLayoutCache): RelationGraphLayoutLoadResult => {
      let appliedCount = 0;

      nodeArr.forEach(node => {
        const cached = layoutData[node.name];
        if (!cached) {
          node.fixed = false;
          return;
        }

        node.x = cached.x;
        node.y = cached.y;
        node.vx = 0;
        node.vy = 0;
        node.fixed = true;
        appliedCount++;
      });

      if (appliedCount === 0) return 'none';
      return appliedCount === nodeArr.length ? 'full' : 'partial';
    };

    // 从缓存加载布局
    const loadLayoutCache = (): RelationGraphLayoutLoadResult => {
      try {
        const layoutData = findReusableLayoutCache();
        if (!layoutData) return 'none';
        return applyLayoutCache(layoutData);
      } catch (e) {
        console.warn('[DICE]关系图 加载布局缓存失败:', e);
        return 'none';
      }
    };

    // 清除布局缓存
    const clearLayoutCache = () => {
      try {
        const cacheKey = getLayoutCacheKey();
        localStorage.removeItem(cacheKey);
      } catch (e) {
        console.warn('[DICE]关系图 清除布局缓存失败:', e);
      }
    };

    const isFixedLayoutNode = (node: RelationGraphNode, preserveFixedNodes: boolean): boolean => {
      return node.name === centerNodeName || (preserveFixedNodes && node.fixed === true);
    };

    // 力导向布局物理模拟函数
    const runForceDirectedLayout = (preserveFixedNodes = false) => {
      // 初始化位置：在中心附近随机散布，开始模拟
      nodeArr.forEach(node => {
        if (!preserveFixedNodes) node.fixed = false;
        if (preserveFixedNodes && node.fixed === true) {
          node.vx = 0;
          node.vy = 0;
          return;
        }

        if (node.name === centerNodeName) {
          node.x = centerX;
          node.y = centerY;
          node.vx = 0;
          node.vy = 0;
        } else {
          // 在中心 100px 范围内随机散布
          const angle = Math.random() * 2 * Math.PI;
          const dist = 50 + Math.random() * 100;
          node.x = centerX + Math.cos(angle) * dist;
          node.y = centerY + Math.sin(angle) * dist;
          node.vx = 0;
          node.vy = 0;
        }
      });

      // 建立映射以便 O(1) 查找节点
      const nodeMap = new Map<string, RelationGraphNode>();
      nodeArr.forEach(n => nodeMap.set(n.name, n));

      // 预计算模拟 (迭代运行物理引擎)
      for (let iter = 0; iter < iterations; iter++) {
        // 1. 斥力 (节点 vs 节点)
        for (let i = 0; i < nodeArr.length; i++) {
          const u = nodeArr[i];
          for (let j = i + 1; j < nodeArr.length; j++) {
            const v = nodeArr[j];
            const dx = v.x - u.x;
            const dy = v.y - u.y;
            let distSq = dx * dx + dy * dy;
            if (distSq < 1) distSq = 1; // 防止除以零

            const dist = Math.sqrt(distSq);
            const force = kRepulsion / distSq;

            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            if (!isFixedLayoutNode(u, preserveFixedNodes)) {
              u.vx -= fx;
              u.vy -= fy;
            }
            if (!isFixedLayoutNode(v, preserveFixedNodes)) {
              v.vx += fx;
              v.vy += fy;
            }
          }
        }

        // 2. 引力 (边连接)
        edges.forEach(edge => {
          const u = nodeMap.get(edge.source);
          const v = nodeMap.get(edge.target);
          if (!u || !v) return;

          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // 弹簧力: F = k * (当前距离 - 理想距离)
          const force = (dist - idealLen) * kSpring;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (!isFixedLayoutNode(u, preserveFixedNodes)) {
            u.vx += fx;
            u.vy += fy;
          }
          if (!isFixedLayoutNode(v, preserveFixedNodes)) {
            v.vx -= fx;
            v.vy -= fy;
          }
        });

        // 3. 中心重力 (轻微拉向中心)
        nodeArr.forEach(node => {
          if (isFixedLayoutNode(node, preserveFixedNodes)) return;
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * kGravity;
          node.vy += dy * kGravity;
        });

        // 4. 更新位置
        // 限制最大速度以防爆炸
        const maxSpeed = 50 * (1 - iter / iterations); // 随迭代冷却最大速度

        nodeArr.forEach(node => {
          if (isFixedLayoutNode(node, preserveFixedNodes)) return; // 中心节点和已缓存节点固定不动

          // 阻尼
          node.vx *= damping;
          node.vy *= damping;

          // 限制速度
          const vMag = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          if (vMag > maxSpeed) {
            node.vx = (node.vx / vMag) * maxSpeed;
            node.vy = (node.vy / vMag) * maxSpeed;
          }

          node.x += node.vx * timeStep;
          node.y += node.vy * timeStep;
        });
      }

      // 物理模拟完成后保存布局
      saveLayoutCache();
    };

    // 运行初始布局（优先使用缓存）
    const layoutLoadResult = loadLayoutCache();
    if (layoutLoadResult !== 'full') {
      // 缓存不存在或不匹配，运行物理模拟
      runForceDirectedLayout(layoutLoadResult === 'partial');
    }

    // 视图状态
    let scale = 1;
    let panX = 0;
    let panY = 0;
    const minScale = 0.3;
    const maxScale = 4;
    let moveModeEnabled = false;

    const overlay = $(`
            <div class="acu-relation-graph-overlay acu-theme-${config.theme}">
                <div class="acu-relation-graph-container">
                    <div class="acu-panel-header">
                        <div class="acu-graph-title">
                            <span class="acu-graph-heading">
                                <i class="fa-solid fa-project-diagram"></i>
                                <span class="acu-graph-heading-text">人物关系图</span>
                            </span>
                            <div class="acu-graph-center-dropdown" id="graph-center-dropdown">
                                <button class="acu-graph-center-trigger" type="button" title="选择中心角色" aria-label="选择中心角色" aria-haspopup="listbox" aria-expanded="false">
                                    <span class="acu-center-label">${escapeHtml(replaceUserPlaceholders(centerNodeName))}</span>
                                    <i class="fa-solid fa-caret-down"></i>
                                </button>
                                <div class="acu-graph-center-menu" role="listbox">
                                    ${nodeArr.map(n => `<div class="acu-center-option${n.name === centerNodeName ? ' active' : ''}" role="option" aria-selected="${n.name === centerNodeName ? 'true' : 'false'}" data-value="${escapeHtml(n.name)}">${escapeHtml(replaceUserPlaceholders(n.name))}</div>`).join('')}
                                </div>
                            </div>
                            <span class="acu-graph-filter-controls" id="graph-filter-controls">
                                <button class="acu-graph-btn acu-filter-toggle acu-graph-filter-btn" id="filter-in-scene" type="button" title="只显示在场角色" aria-label="只显示在场角色" aria-pressed="false"><i class="fa-solid fa-map-marker-alt"></i></button>
                                <button class="acu-graph-btn acu-filter-toggle acu-graph-filter-btn" id="filter-direct-only" type="button" title="只显示与中心角色直接相关" aria-label="只显示与中心角色直接相关" aria-pressed="false"><i class="fa-solid fa-link"></i></button>
                                <button class="acu-graph-btn acu-filter-toggle acu-graph-filter-btn" id="graph-move-mode" type="button" title="移动模式：拖动头像调整位置" aria-label="移动模式：拖动头像调整位置" aria-pressed="false"><i class="fa-solid fa-up-down-left-right"></i></button>
                            </span>
                        </div>
                        <div class="acu-graph-actions">
                            ${getTutorialButtonHtml('relationshipGraph', '查看人物关系图教程', 'acu-graph-btn')}
                            <button class="acu-graph-btn" id="graph-relayout" type="button" title="重新布局（清除缓存并重新计算节点位置）" aria-label="重新布局"><i class="fa-solid fa-sync"></i></button>
                            <button class="acu-graph-btn" id="graph-manage-avatar" type="button" title="管理头像" aria-label="管理头像"><i class="fa-solid fa-user-circle"></i></button>
                            <button class="acu-graph-btn acu-graph-close" type="button" title="关闭" aria-label="关闭人物关系图"><i class="fa-solid fa-times"></i></button>
                        </div>
                    </div>
                    <div class="acu-graph-canvas-wrapper">
                        <svg class="acu-graph-svg" viewBox="0 0 800 600">
                            <defs>
                                <marker id="arrowhead-end" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="0 0, 6 2.5, 0 5" />
                                </marker>
                                <marker id="arrowhead-start" markerWidth="6" markerHeight="5" refX="1" refY="2.5" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="6 0, 0 2.5, 6 5" />
                                </marker>
                                <marker id="arrowhead-end-hl" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="0 0, 7 3, 0 6" />
                                </marker>
                                <marker id="arrowhead-start-hl" markerWidth="7" markerHeight="6" refX="1" refY="3" orient="auto" markerUnits="strokeWidth">
                                    <polygon points="7 0, 0 3, 7 6" />
                                </marker>
                            </defs>
                            <g class="acu-graph-transform">
                                <g class="acu-graph-edges"></g>
                                <g class="acu-graph-nodes"></g>
                            </g>
                        </svg>
                        <div class="acu-node-size-slider-container">
                            <div class="acu-slider-header">
                                <span class="acu-slider-label">节点大小</span>
                                <span id="slider-size-display" class="acu-slider-value">${Math.round(nodeSizeMultiplier * 100)}%</span>
                            </div>
                            <input type="range" id="node-size-slider" min="0.5" max="2.0" step="0.1" value="${nodeSizeMultiplier}" class="acu-range-input" />
                        </div>
                    </div>
                    <div class="acu-graph-legend">
                        <div class="acu-graph-view-controls">
                            <button class="acu-graph-btn acu-graph-reset-btn" id="graph-zoom-reset" type="button" title="重置视图和节点大小" aria-label="重置视图和节点大小"><i class="fa-solid fa-compress-arrows-alt"></i><span>重置</span></button>
                            <div class="acu-node-size-stepper-wrapper acu-node-size-wrapper">
                                <span class="acu-graph-node-size-label">节点:</span>
                                <div class="acu-stepper acu-stepper-container" data-id="graph-node-size" data-min="50" data-max="200" data-step="10">
                                    <button class="acu-stepper-btn acu-stepper-dec" type="button" aria-label="缩小节点"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value acu-stepper-value-display" id="node-size-display">${Math.round(nodeSizeMultiplier * 100)}%</span>
                                    <button class="acu-stepper-btn acu-stepper-inc" type="button" aria-label="放大节点"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <span class="acu-zoom-display acu-zoom-info">
                                <span>视图:</span>
                                <span>${Math.round(scale * 100)}%</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `);

    $('body').append(overlay);
    bindTutorialButtonsIn(overlay);

    const $svg = overlay.find('.acu-graph-svg');
    const $transform = overlay.find('.acu-graph-transform');
    const $edgesGroup = overlay.find('.acu-graph-edges');
    const $nodesGroup = overlay.find('.acu-graph-nodes');
    const $zoomDisplay = overlay.find('.acu-zoom-display span:last-child');
    const $nodeSizeDisplay = overlay.find('#node-size-display');
    const $wrapper = overlay.find('.acu-graph-canvas-wrapper');
    const $moveModeBtn = overlay.find('#graph-move-mode');

    const updateTransform = () => {
      $transform.attr('transform', `translate(${panX}, ${panY}) scale(${scale})`);
      $zoomDisplay.text(`${Math.round(scale * 100)}%`);
    };

    const updateNodeSizeDisplay = () => {
      if ($nodeSizeDisplay.length) {
        $nodeSizeDisplay.text(`${Math.round(nodeSizeMultiplier * 100)}%`);
      }
    };

    const updateMoveModeStyles = () => {
      $moveModeBtn.toggleClass('active', moveModeEnabled);
      $moveModeBtn.attr('aria-pressed', moveModeEnabled ? 'true' : 'false');
      $wrapper.toggleClass('acu-graph-move-mode', moveModeEnabled);
      $svg.toggleClass('acu-graph-move-mode', moveModeEnabled);
    };

    const zoomTo = (newScale: number, centerX = 400, centerY = 300) => {
      const oldScale = scale;
      scale = Math.max(minScale, Math.min(maxScale, newScale));
      const scaleChange = scale / oldScale;
      panX = centerX - (centerX - panX) * scaleChange;
      panY = centerY - (centerY - panY) * scaleChange;
      updateTransform();
    };

    let graphRenderQueued = false;
    const nodeAvatarCache = new Map<string, string>();
    const nodeAvatarRequests = new Set<string>();

    const requestGraphRender = () => {
      if (graphRenderQueued) return;
      graphRenderQueued = true;
      window.requestAnimationFrame(() => {
        graphRenderQueued = false;
        render();
      });
    };

    const getCachedNodeAvatar = (nodeName: string): string => {
      const cachedAvatar = nodeAvatarCache.get(nodeName);
      if (cachedAvatar !== undefined) return cachedAvatar;

      const syncAvatar = AvatarManager.get(nodeName) || '';
      nodeAvatarCache.set(nodeName, syncAvatar);

      if (!nodeAvatarRequests.has(nodeName)) {
        nodeAvatarRequests.add(nodeName);
        void AvatarManager.getAsync(nodeName)
          .then(avatar => {
            const nextAvatar = avatar || '';
            const previousAvatar = nodeAvatarCache.get(nodeName) || '';
            nodeAvatarCache.set(nodeName, nextAvatar);
            nodeAvatarRequests.delete(nodeName);
            if (nextAvatar !== previousAvatar) requestGraphRender();
          })
          .catch(error => {
            nodeAvatarRequests.delete(nodeName);
            console.warn('[DICE]关系图 头像加载失败:', nodeName, error);
          });
      }

      return syncAvatar;
    };

    const render = () => {
      // 获取过滤后的节点
      const filteredNodes = getFilteredNodes();
      const filteredNodeNames = new Set(filteredNodes.map(n => n.name));

      // 过滤边：只保留连接两个可见节点的边
      const filteredEdges = edges.filter(
        edge => filteredNodeNames.has(edge.source) && filteredNodeNames.has(edge.target),
      );

      let edgesHtml = '';
      filteredEdges.forEach((edge, edgeIdx) => {
        const source = nodes.get(edge.source);
        const target = nodes.get(edge.target);
        if (!source || !target) return;

        // 计算方向向量和中点
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / len; // 单位向量
        const ny = dy / len;

        // 垂直于连线的向量（用于标签偏移）
        const px = -ny;
        const py = nx;

        // 判断箭头类型
        const hasFromSource =
          edge.labelsFromSource && edge.labelsFromSource.length > 0 && edge.labelsFromSource.some(l => l);
        const hasFromTarget =
          edge.labelsFromTarget && edge.labelsFromTarget.length > 0 && edge.labelsFromTarget.some(l => l);

        // 缩短线条，避免箭头与节点重叠（增加额外间距）
        const sourceRadius = source.radius || 28;
        const targetRadius = target.radius || 28;
        const arrowGap = 10; // 箭头与节点之间的额外间距（考虑大节点）
        const x1 = source.x + nx * (sourceRadius + arrowGap);
        const y1 = source.y + ny * (sourceRadius + arrowGap);
        const x2 = target.x - nx * (targetRadius + arrowGap);
        const y2 = target.y - ny * (targetRadius + arrowGap);

        // 智能去重：跨方向移除重复标签
        let srcLabels = (edge.labelsFromSource || []).filter(l => l);
        let tgtLabels = (edge.labelsFromTarget || []).filter(l => l);

        // 找出两边都有的标签（共同标签）
        const srcSet = new Set(srcLabels);
        const tgtSet = new Set(tgtLabels);
        const commonLabels = [...srcSet].filter(l => tgtSet.has(l));

        // 从两边移除共同标签，它们将显示在中间
        const srcUnique = srcLabels.filter(l => !commonLabels.includes(l));
        const tgtUnique = tgtLabels.filter(l => !commonLabels.includes(l));

        // 设置箭头标记
        let markerStart = '';
        let markerEnd = '';
        if (hasFromSource) markerEnd = 'url(#arrowhead-end)';
        if (hasFromTarget) markerStart = 'url(#arrowhead-start)';

        edgesHtml += `<line class="acu-graph-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                    ${markerEnd ? `marker-end="${markerEnd}"` : ''}
                    ${markerStart ? `marker-start="${markerStart}"` : ''}
                    data-edge-idx="${edgeIdx}" />`;

        // 渲染标签
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        // 计算标签位置（根据连线长度动态调整，更紧凑）
        const lineLen = Math.sqrt(dx * dx + dy * dy);

        // 判断是否是"双向且内容完全一致"的情况
        const isBidirectional = hasFromSource && hasFromTarget;
        const isBidirectionalSame =
          isBidirectional && commonLabels.length > 0 && srcUnique.length === 0 && tgtUnique.length === 0;

        // 只有双向且完全一致时，标签才显示在正中间
        if (isBidirectionalSame) {
          // 双向相同：标签显示在正中间
          // [修复] 移动 renderRelationIcon 和 addRelationIcon 到这里也能使用
          const renderRelationIconInline = (iconStr: string): string => {
            if (iconStr.startsWith('fa:')) {
              return `<i class="fa-solid fa-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            } else if (iconStr.startsWith('ti:')) {
              return `<i class="ti ti-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            }
            return iconStr;
          };

          const addRelationIconInline = (lbl: string): string => {
            if (!lbl) return '';
            for (const group of RELATION_ICON_MAP) {
              for (const kw of group.keywords) {
                if (lbl.includes(kw)) {
                  return lbl + renderRelationIconInline(group.icon);
                }
              }
            }
            return lbl;
          };

          commonLabels.slice(0, 2).forEach((lbl, i) => {
            if (!lbl) return;
            const offsetDir = i === 0 ? 1 : -1;
            const offsetDist = 6 + i * 10;
            const lx = midX + px * offsetDir * offsetDist;
            const ly = midY + py * offsetDir * offsetDist;
            // [修复] 添加图标支持
            const content = addRelationIconInline(lbl);
            if (content.includes('<i ')) {
              // 使用foreignObject渲染HTML内容
              edgesHtml += `<foreignObject x="${lx - 50}" y="${ly - 10}" width="100" height="20" style="overflow:visible;">
                <div xmlns="http://www.w3.org/1999/xhtml" class="acu-graph-edge-label-html" data-edge-idx="${edgeIdx}" style="
                  display:flex;align-items:center;justify-content:center;
                  font-size:11px;color:var(--acu-text-sub);white-space:nowrap;
                  pointer-events:none;
                ">${content}</div>
              </foreignObject>`;
            } else {
              edgesHtml += `<text class="acu-graph-edge-label" x="${lx}" y="${ly}" data-edge-idx="${edgeIdx}">${escapeHtml(lbl)}</text>`;
            }
          });
        } else {
          // 单向或双向不同：分区域显示
          // 偏移量：从中点向source/target方向偏移，但不要太靠近节点
          // 使用连线长度的25%，但限制在合理范围内
          const safeOffset = Math.max(30, Math.min(lineLen * 0.25, 60));

          // 渲染关系图标为HTML
          const renderRelationIcon = (iconStr: string): string => {
            if (iconStr.startsWith('fa:')) {
              return `<i class="fa-solid fa-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            } else if (iconStr.startsWith('ti:')) {
              return `<i class="ti ti-${iconStr.slice(3)}" style="font-size:10px;margin-left:2px;opacity:0.8;"></i>`;
            }
            return iconStr;
          };

          // 给关系词添加图标
          const addRelationIcon = (lbl: string): string => {
            if (!lbl) return '';
            for (const group of RELATION_ICON_MAP) {
              for (const kw of group.keywords) {
                if (lbl.includes(kw)) {
                  return lbl + renderRelationIcon(group.icon);
                }
              }
            }
            return lbl;
          };

          // 截断过长标签的辅助函数（在添加图标之前截断）
          const truncateLabel = (lbl: string, maxLen = 4): string => {
            if (!lbl) return '';
            const truncated = lbl.length > maxLen ? lbl.substring(0, maxLen) + '..' : lbl;
            return addRelationIcon(truncated);
          };

          // 生成带图标的标签HTML（使用foreignObject以支持HTML内容）
          const createLabelHtml = (lbl: string, x: number, y: number, edgeIdx: number, maxLen = 5): string => {
            const content = truncateLabel(lbl, maxLen);
            // 检测是否包含HTML标签（图标）
            if (content.includes('<i ')) {
              // 使用foreignObject渲染HTML内容
              return `<foreignObject x="${x - 50}" y="${y - 10}" width="100" height="20" style="overflow:visible;">
                <div xmlns="http://www.w3.org/1999/xhtml" class="acu-graph-edge-label-html" data-edge-idx="${edgeIdx}" style="
                  display:flex;align-items:center;justify-content:center;
                  font-size:11px;color:var(--acu-text-sub);white-space:nowrap;
                  pointer-events:none;
                ">${content}</div>
              </foreignObject>`;
            }
            // 纯文本使用原生text元素
            return `<text class="acu-graph-edge-label" x="${x}" y="${y}" data-edge-idx="${edgeIdx}">${escapeHtml(content)}</text>`;
          };

          // 1. 共同标签（显示在正中间，垂直于连线一上一下）
          if (commonLabels.length > 0) {
            commonLabels.slice(0, 1).forEach((lbl, i) => {
              if (!lbl) return;
              // 单个共同标签放在线的上方
              const lx = midX + px * 8;
              const ly = midY + py * 8 - 3;
              edgesHtml += createLabelHtml(lbl, lx, ly, edgeIdx, 5);
            });
          }

          // 2. Source侧标签（靠近source，垂直于连线排列）
          if (srcUnique.length > 0 || (hasFromSource && !hasFromTarget && commonLabels.length === 0)) {
            const labelsToShow = srcUnique.length > 0 ? srcUnique : srcLabels;
            // 基准点：从中点向source方向偏移
            const labelBaseX = midX - nx * safeOffset;
            const labelBaseY = midY - ny * safeOffset;

            labelsToShow.slice(0, 2).forEach((lbl, i) => {
              if (!lbl) return;
              // 垂直于连线方向排列：第一个在线上方，第二个在线下方
              const perpOffset = (i === 0 ? 1 : -1) * 10;
              const lx = labelBaseX + px * perpOffset;
              const ly = labelBaseY + py * perpOffset;
              edgesHtml += createLabelHtml(lbl, lx, ly, edgeIdx, 5);
            });
          }

          // 3. Target侧标签（靠近target，垂直于连线排列）
          if (tgtUnique.length > 0 || (hasFromTarget && !hasFromSource && commonLabels.length === 0)) {
            const labelsToShow = tgtUnique.length > 0 ? tgtUnique : tgtLabels;
            // 基准点：从中点向target方向偏移
            const labelBaseX = midX + nx * safeOffset;
            const labelBaseY = midY + ny * safeOffset;

            labelsToShow.slice(0, 2).forEach((lbl, i) => {
              if (!lbl) return;
              // 垂直于连线方向排列
              const perpOffset = (i === 0 ? -1 : 1) * 10;
              const lx = labelBaseX + px * perpOffset;
              const ly = labelBaseY + py * perpOffset;
              edgesHtml += createLabelHtml(lbl, lx, ly, edgeIdx, 5);
            });
          }
        }
      });
      $edgesGroup.html(edgesHtml);

      // [修复] 异步获取头像后再渲染节点（使用过滤后的节点）
      let nodesHtml = '';
      for (const node of filteredNodes) {
        // 拖动时使用缓存头像，避免线和文字先重绘、头像等待异步读取后才跟上
        const nodeAvatar = getCachedNodeAvatar(node.name);
        const isPlayer = node.isPlayer;

        // 在场标记：右下角小圆点（随节点大小缩放，Discord风格）
        const indicatorRadius = node.radius * 0.22;
        const indicatorOffset = node.radius * 0.62;
        const inSceneIndicator = node.isInScene
          ? `<circle class="acu-node-inscene-indicator" cx="${indicatorOffset}" cy="${indicatorOffset}" r="${indicatorRadius}" style="fill:var(--acu-accent);stroke:var(--acu-bg-panel);stroke-width:3;" />`
          : '';

        const nodeDisplayName = replaceUserPlaceholders(node.name);
        nodesHtml += `
                <g class="acu-graph-node acu-dash-preview-trigger" data-name="${escapeHtml(node.name)}" data-table-key="${node.tableKey || ''}" data-row-index="${node.rowIndex !== undefined ? node.rowIndex : ''}" transform="translate(${node.x}, ${node.y})">
                    <circle class="acu-node-bg" r="${node.radius}" />
                    ${
                      nodeAvatar
                        ? (() => {
                            const offsetX = AvatarManager.getOffsetX(node.name);
                            const offsetY = AvatarManager.getOffsetY(node.name);
                            const scaleVal = AvatarManager.getScale(node.name);
                            const size = (node.radius - 2) * 2;
                            const shadowWidth = 4; // 预留box-shadow的空间
                            const foSize = size + shadowWidth * 2;
                            const foOffset = foSize / 2;
                            const avatarStyle = escapeHtml(
                              buildAvatarBackgroundStyle(nodeAvatar, offsetX, offsetY, scaleVal),
                            );
                            if (!avatarStyle) {
                              return `<text class="acu-node-char" dy="0.35em">${escapeHtml(nodeDisplayName.charAt(0))}</text>`;
                            }
                            return `<foreignObject x="${-foOffset}" y="${-foOffset}" width="${foSize}" height="${foSize}">
                            <div class="acu-node-avatar" xmlns="http://www.w3.org/1999/xhtml" style="
                                width: ${size}px;
                                height: ${size}px;
                                margin: ${shadowWidth}px;
                                border-radius: 50%;
                                ${avatarStyle}
                                background-repeat: no-repeat;
                            "></div>
                        </foreignObject>`;
                          })()
                        : `<text class="acu-node-char" dy="0.35em">${escapeHtml(nodeDisplayName.charAt(0))}</text>`
                    }
                    ${inSceneIndicator}
                    ${node.name === centerNodeName ? `<circle class="acu-node-center-indicator" r="${node.radius + 5}" />` : ''}
                    <text class="acu-node-label" dy="${node.radius + 14}">${escapeHtml(nodeDisplayName)}</text>
                </g>
            `;
      }
      $nodesGroup.html(nodesHtml);
    };

    // [新增] 悬浮高亮交互函数
    const highlightNode = (nodeName: string) => {
      $svg.addClass('highlighting');

      // 高亮当前节点
      $nodesGroup.find('.acu-graph-node').each(function () {
        if ($(this).data('name') === nodeName) {
          $(this).addClass('highlighted');
        }
      });

      // 找出所有与该节点相连的边和对端节点
      const connectedNodes = new Set([nodeName]);

      // 使用所有边（不仅仅是过滤后的），以便高亮显示所有相关连接
      edges.forEach(edge => {
        if (edge.source === nodeName || edge.target === nodeName) {
          const otherNode = edge.source === nodeName ? edge.target : edge.source;
          connectedNodes.add(otherNode);
        }
      });

      // 高亮相连的节点
      $nodesGroup.find('.acu-graph-node').each(function () {
        if (connectedNodes.has($(this).data('name'))) {
          $(this).addClass('highlighted');
        }
      });

      // 高亮相关的边和标签
      const connectedEdgeIndices = new Set<number>();
      edges.forEach((edge, idx) => {
        if (edge.source === nodeName || edge.target === nodeName) {
          connectedEdgeIndices.add(idx);
        }
      });

      $edgesGroup.find('.acu-graph-edge').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('highlighted');
          if ($(this).attr('marker-end')) {
            $(this).attr('marker-end', 'url(#arrowhead-end-hl)');
          }
          if ($(this).attr('marker-start')) {
            $(this).attr('marker-start', 'url(#arrowhead-start-hl)');
          }
        }
      });

      $edgesGroup.find('.acu-graph-edge-label').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('acu-graph-label-highlighted');
        }
      });

      $edgesGroup.find('.acu-graph-edge-label-html').each(function () {
        const edgeIdx = parseInt($(this).attr('data-edge-idx'), 10);
        if (connectedEdgeIndices.has(edgeIdx)) {
          $(this).addClass('acu-graph-label-highlighted');
        }
      });
    };

    const clearHighlight = () => {
      $svg.removeClass('highlighting');
      $nodesGroup.find('.highlighted').removeClass('highlighted');
      $edgesGroup.find('.highlighted').removeClass('highlighted');
      $edgesGroup.find('.acu-graph-label-highlighted').removeClass('acu-graph-label-highlighted');
      $edgesGroup.find('.acu-graph-edge').each(function () {
        if ($(this).attr('marker-end')) {
          $(this).attr('marker-end', 'url(#arrowhead-end)');
        }
        if ($(this).attr('marker-start')) {
          $(this).attr('marker-start', 'url(#arrowhead-start)');
        }
      });
    };

    // [修复] 节点交互 - PC悬浮高亮 + 移动端长按高亮 + 单击预览
    // 使用pointer媒体查询检测：fine表示精确指针设备(鼠标)，coarse表示粗略指针(触摸)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isTouchDevice = !hasFinePointer;

    // 全局状态
    let currentHighlightedNode = null; // 当前高亮的节点名
    let longPressTimer = null;

    if (isTouchDevice) {
      // ========== 移动端逻辑 ==========
      let currentHighlightedNode = null;

      $nodesGroup.on('pointerdown', '.acu-graph-node', function (e) {
        if (moveModeEnabled) return;
        const $node = $(this);
        const nodeName = $node.data('name');
        const startX = e.clientX;
        const startY = e.clientY;
        const startTime = Date.now();
        let hasMoved = false;
        let longPressTriggered = false;

        // 如果已有高亮，这次点击只用于清除
        if (currentHighlightedNode) {
          clearHighlight();
          currentHighlightedNode = null;
          // 直接return，不绑定后续事件
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 长按计时器
        const longPressTimer = setTimeout(() => {
          if (!hasMoved && nodeName) {
            longPressTriggered = true;
            currentHighlightedNode = nodeName;
            highlightNode(nodeName);
            if (navigator.vibrate) navigator.vibrate(30);
          }
        }, 300);

        const onMove = moveE => {
          const dx = Math.abs(moveE.clientX - startX);
          const dy = Math.abs(moveE.clientY - startY);
          if (dx > 8 || dy > 8) {
            hasMoved = true;
            clearTimeout(longPressTimer);
          }
        };

        const onUp = () => {
          $(document).off('pointermove.mobilenode pointerup.mobilenode pointercancel.mobilenode');
          clearTimeout(longPressTimer);

          const elapsed = Date.now() - startTime;

          // 长按已触发 → 什么都不做（高亮保持）
          if (longPressTriggered) {
            return;
          }

          // 移动了 → 什么都不做
          if (hasMoved) {
            return;
          }

          // 快速点击（<300ms）且没移动 → 显示详情
          if (elapsed < 300) {
            const nodeName = $node.data('name');
            // 使用别名系统找到主名称，以定位正确的表格行
            const primaryName = AvatarManager.getPrimaryName(nodeName);
            const tableKey = $node.data('table-key');
            let rowIndex = $node.data('row-index');

            // 如果当前节点没有tableKey（只出现在别人关系中的角色），尝试通过主名称查找
            if (!tableKey || rowIndex === '' || rowIndex === undefined) {
              // 尝试查找NPC表中是否有该角色
              const rawData = getCachedRawData() || getTableData();
              if (rawData) {
                for (const key in rawData) {
                  const table = rawData[key];
                  if (!table?.content || !isCharacterTable(String(table.name || ''))) continue;
                  const headers = table.content[0] || [];
                  const nameIdx = headers.findIndex(
                    h => h && (h.includes('姓名') || h.includes('名称') || h.includes('名字')),
                  );
                  if (nameIdx < 0) continue;
                  for (let i = 1; i < table.content.length; i++) {
                    const rowName = String(table.content[i][nameIdx] || '').trim();
                    if (rowName === primaryName || AvatarManager.getPrimaryName(rowName) === primaryName) {
                      // 找到了，触发预览
                      const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
                        .data('table-key', key)
                        .data('row-index', i - 1);
                      $('body').append(tempNode);
                      tempNode.trigger('click.acu_dash_preview');
                      tempNode.remove();
                      return;
                    }
                  }
                }
              }
              // 没有找到该角色的卡片
              if (window.toastr) {
                window.toastr.info(`「${primaryName}」暂无详细资料`, '', { timeOut: 2000 });
              }
              return;
            }

            // 有tableKey，正常触发预览
            const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
              .data('table-key', tableKey)
              .data('row-index', parseInt(rowIndex, 10));
            $('body').append(tempNode);
            tempNode.trigger('click.acu_dash_preview');
            tempNode.remove();
          }
        };

        $(document).on('pointermove.mobilenode', onMove);
        $(document).on('pointerup.mobilenode pointercancel.mobilenode', onUp);
      });

      // 点击画布空白处清除高亮
      $wrapper.on('pointerup.mobileclear', function (e) {
        if (moveModeEnabled) return;
        if (currentHighlightedNode && !$(e.target).closest('.acu-graph-node').length) {
          clearHighlight();
          currentHighlightedNode = null;
        }
      });
    } else {
      // ========== PC端逻辑 ==========

      $nodesGroup.on('pointerenter.pchover', '.acu-graph-node', function () {
        if (moveModeEnabled) return;
        const nodeName = $(this).data('name');
        if (nodeName) {
          highlightNode(nodeName);
        }
      });

      $nodesGroup.on('pointerleave.pchover', '.acu-graph-node', function () {
        if (moveModeEnabled) return;
        clearHighlight();
      });

      // PC端点击显示详情
      $nodesGroup.on('click.pcclick', '.acu-graph-node', function (e) {
        if (moveModeEnabled) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        e.stopPropagation();
        const $node = $(this);
        const nodeName = $node.data('name');
        // 使用别名系统找到主名称
        const primaryName = AvatarManager.getPrimaryName(nodeName);
        const tableKey = $node.data('table-key');
        let rowIndex = $node.data('row-index');

        // 如果当前节点没有tableKey（只出现在别人关系中的角色），尝试通过主名称查找
        if (!tableKey || rowIndex === '' || rowIndex === undefined) {
          const rawData = getCachedRawData() || getTableData();
          if (rawData) {
            for (const key in rawData) {
              const table = rawData[key];
              if (!table?.content || !isCharacterTable(String(table.name || ''))) continue;
              const headers = table.content[0] || [];
              const nameIdx = headers.findIndex(
                h => h && (h.includes('姓名') || h.includes('名称') || h.includes('名字')),
              );
              if (nameIdx < 0) continue;
              for (let i = 1; i < table.content.length; i++) {
                const rowName = String(table.content[i][nameIdx] || '').trim();
                if (rowName === primaryName || AvatarManager.getPrimaryName(rowName) === primaryName) {
                  const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
                    .data('table-key', key)
                    .data('row-index', i - 1);
                  $('body').append(tempNode);
                  tempNode.trigger('click.acu_dash_preview');
                  tempNode.remove();
                  return;
                }
              }
            }
          }
          if (window.toastr) {
            window.toastr.info(`「${primaryName}」暂无详细资料`, '', { timeOut: 2000 });
          }
          return;
        }

        // 有tableKey，正常触发预览
        const tempNode = $('<div class="acu-dash-preview-trigger" style="display:none;"></div>')
          .data('table-key', tableKey)
          .data('row-index', parseInt(rowIndex, 10));
        $('body').append(tempNode);
        tempNode.trigger('click.acu_dash_preview');
        tempNode.remove();
      });
    }

    // 初始渲染
    render();
    updateTransform();

    // 画布平移和缩放 - 使用 Pointer Events API
    let isPanning = false;
    let panStartX = 0,
      panStartY = 0;
    let panStartPanX = 0,
      panStartPanY = 0;
    let lastPinchDist = 0;
    let activePointerId: number | null = null;
    let isNodeDragging = false;
    let draggingNodeName: string | null = null;

    const wrapperEl = $wrapper[0];
    const svgEl = $svg[0];

    const clientPointToGraphPoint = (clientX: number, clientY: number): RelationGraphLayoutPosition => {
      const rect = svgEl.getBoundingClientRect();
      const svgX = rect.width > 0 ? ((clientX - rect.left) / rect.width) * 800 : 0;
      const svgY = rect.height > 0 ? ((clientY - rect.top) / rect.height) * 600 : 0;
      return {
        x: (svgX - panX) / scale,
        y: (svgY - panY) / scale,
      };
    };

    const startNodeDrag = (e: PointerEvent, nodeName: string) => {
      const node = nodes.get(nodeName);
      if (!node) return;

      e.preventDefault();
      e.stopPropagation();
      clearHighlight();

      wrapperEl.setPointerCapture(e.pointerId);
      activePointerId = e.pointerId;
      isNodeDragging = true;
      draggingNodeName = nodeName;
      node.vx = 0;
      node.vy = 0;
      node.fixed = true;
      $wrapper.addClass('acu-graph-node-dragging');
      svgEl.style.cursor = 'grabbing';
    };

    const finishNodeDrag = (pointerId: number, shouldSave: boolean) => {
      if (pointerId !== activePointerId) return;

      if (wrapperEl.hasPointerCapture(pointerId)) {
        wrapperEl.releasePointerCapture(pointerId);
      }

      if (shouldSave && draggingNodeName) {
        saveLayoutCache();
      }

      isNodeDragging = false;
      draggingNodeName = null;
      activePointerId = null;
      $wrapper.removeClass('acu-graph-node-dragging');
      svgEl.style.cursor = '';
    };

    // Pointer Down - 开始拖拽
    wrapperEl.onpointerdown = function (e) {
      if (e.button !== 0) return;
      const $targetNode = $(e.target).closest('.acu-graph-node');
      if ($targetNode.length) {
        if (moveModeEnabled) {
          const nodeName = String($targetNode.data('name') || '');
          if (nodeName) startNodeDrag(e, nodeName);
        }
        return;
      }
      if (moveModeEnabled) return;
      // [修复] 如果点击的是滑条容器，不启动画布拖拽
      if ($(e.target).closest('.acu-node-size-slider-container').length) return;
      e.preventDefault();
      wrapperEl.setPointerCapture(e.pointerId);
      activePointerId = e.pointerId;
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panStartPanX = panX;
      panStartPanY = panY;
      svgEl.style.cursor = 'grabbing';
    };

    // Pointer Move - 拖拽中
    wrapperEl.onpointermove = function (e) {
      if (isNodeDragging && e.pointerId === activePointerId && draggingNodeName) {
        const node = nodes.get(draggingNodeName);
        if (!node) return;
        const point = clientPointToGraphPoint(e.clientX, e.clientY);
        node.x = point.x;
        node.y = point.y;
        node.vx = 0;
        node.vy = 0;
        node.fixed = true;
        requestGraphRender();
        return;
      }

      if (!isPanning || e.pointerId !== activePointerId) return;
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      const rect = svgEl.getBoundingClientRect();
      panX = panStartPanX + (dx / rect.width) * 800;
      panY = panStartPanY + (dy / rect.height) * 600;
      updateTransform();
    };

    // Pointer Up - 结束拖拽
    wrapperEl.onpointerup = function (e) {
      if (isNodeDragging) {
        finishNodeDrag(e.pointerId, true);
        return;
      }

      if (e.pointerId === activePointerId) {
        wrapperEl.releasePointerCapture(e.pointerId);
        isPanning = false;
        activePointerId = null;
        svgEl.style.cursor = '';
      }
    };

    // Pointer Cancel - 取消
    wrapperEl.onpointercancel = function (e) {
      if (isNodeDragging) {
        finishNodeDrag(e.pointerId, true);
        return;
      }

      if (e.pointerId === activePointerId) {
        isPanning = false;
        activePointerId = null;
        svgEl.style.cursor = '';
      }
    };

    // 滚轮缩放
    wrapperEl.onwheel = function (e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      zoomTo(scale + delta);
    };

    // 移动端双指缩放
    wrapperEl.addEventListener(
      'touchstart',
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          isPanning = false;
          lastPinchDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
        }
      },
      { passive: false },
    );

    wrapperEl.addEventListener(
      'touchmove',
      function (e) {
        if (e.touches.length === 2) {
          e.preventDefault();
          const newDist = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY,
          );
          if (lastPinchDist > 0) {
            zoomTo(scale * (newDist / lastPinchDist));
          }
          lastPinchDist = newDist;
        }
      },
      { passive: false },
    );

    wrapperEl.addEventListener('touchend', function (e) {
      if (e.touches.length < 2) lastPinchDist = 0;
    });

    // 清理函数
    const cleanupEvents = () => {
      wrapperEl.onpointerdown = null;
      wrapperEl.onpointermove = null;
      wrapperEl.onpointerup = null;
      wrapperEl.onpointercancel = null;
      wrapperEl.onwheel = null;
      // 清理滑条相关事件和定时器
      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
        sliderHideTimer = null;
      }
      $(document).off('click.slider-hide');
    };

    // 节点大小滑条控制
    const $nodeSizeSlider = overlay.find('#node-size-slider');
    const $sliderSizeDisplay = overlay.find('#slider-size-display');
    const $sliderContainer = overlay.find('.acu-node-size-slider-container');
    const $nodeSizeDisplayTrigger = overlay.find('#node-size-display-trigger');
    const $legend = overlay.find('.acu-graph-legend');

    let sliderVisible = false;
    let sliderHideTimer: ReturnType<typeof setTimeout> | null = null;
    const SLIDER_AUTO_HIDE_DELAY = 4000; // 4秒无操作自动隐藏

    // 显示滑条
    const showSlider = () => {
      if (sliderVisible) return;

      // 清除之前的隐藏定时器
      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
        sliderHideTimer = null;
      }

      sliderVisible = true;

      // 计算位置：在"节点"文字上方（因为滑条容器在wrapper内，而trigger在legend中，legend在wrapper下方）
      // 使用getBoundingClientRect获取相对于viewport的位置
      const triggerRect = $nodeSizeDisplayTrigger[0].getBoundingClientRect();
      const wrapperRect = $wrapper[0].getBoundingClientRect();

      // 修复：滑条应该显示在wrapper底部附近，在trigger上方
      const sliderHeight = 60; // 估算滑条高度
      const top = wrapperRect.height - sliderHeight - 10; // 在wrapper底部上方
      const left = triggerRect.left - wrapperRect.left;

      $sliderContainer.css({
        display: 'block',
        top: `${top}px`,
        left: `${left}px`,
      });

      // 设置自动隐藏定时器
      resetSliderHideTimer();
    };

    // 隐藏滑条
    const hideSlider = () => {
      if (!sliderVisible) return;

      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
        sliderHideTimer = null;
      }

      sliderVisible = false;
      $sliderContainer.hide();
    };

    // 重置自动隐藏定时器
    const resetSliderHideTimer = () => {
      if (sliderHideTimer) {
        clearTimeout(sliderHideTimer);
      }
      sliderHideTimer = setTimeout(() => {
        hideSlider();
      }, SLIDER_AUTO_HIDE_DELAY);
    };

    // 点击"节点"文字切换滑条显示/隐藏（使用事件委托确保可靠触发）
    overlay.on('click', '#node-size-display-trigger, #node-size-display-trigger *', function (e) {
      e.stopPropagation();
      if (sliderVisible) {
        hideSlider();
      } else {
        showSlider();
      }
    });

    // 滑条操作时重置自动隐藏定时器
    $nodeSizeSlider.on('input mousedown touchstart', function (e) {
      e.stopPropagation();
      if (sliderVisible) {
        resetSliderHideTimer();
      }
    });

    // 滑条容器内操作时阻止事件冒泡
    $sliderContainer.on('pointerdown mousedown touchstart', function (e) {
      e.stopPropagation();
    });

    // 点击滑条外部区域时隐藏滑条
    $(document).on('click.slider-hide', function (e) {
      if (
        sliderVisible &&
        !$sliderContainer.is(e.target) &&
        $sliderContainer.has(e.target).length === 0 &&
        !$nodeSizeDisplayTrigger.is(e.target) &&
        $nodeSizeDisplayTrigger.has(e.target).length === 0
      ) {
        hideSlider();
      }
    });

    $nodeSizeSlider.on('input', function () {
      nodeSizeMultiplier = parseFloat($(this).val());
      $sliderSizeDisplay.text(Math.round(nodeSizeMultiplier * 100) + '%');
      updateNodeSizeDisplay();

      // 重新计算节点半径并渲染
      nodeArr.forEach(node => {
        node.radius = getNodeRadius(node.name, node.isPlayer);
      });
      render();

      // 重置自动隐藏定时器
      resetSliderHideTimer();
    });

    // 过滤 toggle 按钮
    const $filterInSceneBtn = overlay.find('#filter-in-scene');
    const $filterDirectOnlyBtn = overlay.find('#filter-direct-only');

    updateMoveModeStyles();

    const updateFilterToggleStyles = () => {
      $filterInSceneBtn.toggleClass('active', filterInScene);
      $filterDirectOnlyBtn.toggleClass('active', filterDirectOnly);
      $filterInSceneBtn.attr('aria-pressed', filterInScene ? 'true' : 'false');
      $filterDirectOnlyBtn.attr('aria-pressed', filterDirectOnly ? 'true' : 'false');
    };

    // 初始化按钮样式
    updateFilterToggleStyles();

    $filterInSceneBtn.click(function (e) {
      e.stopPropagation();
      filterInScene = !filterInScene;
      updateFilterToggleStyles();
      render();
    });

    $filterDirectOnlyBtn.click(function (e) {
      e.stopPropagation();
      filterDirectOnly = !filterDirectOnly;
      updateFilterToggleStyles();
      render();
    });

    $moveModeBtn.on('click', function (e) {
      e.stopPropagation();
      moveModeEnabled = !moveModeEnabled;
      clearHighlight();
      updateMoveModeStyles();
      if (window.toastr) {
        window.toastr.info(moveModeEnabled ? '移动模式已开启：拖动头像调整位置' : '移动模式已关闭', '', {
          timeOut: 1600,
        });
      }
    });

    // [新增] 自定义中心角色下拉选择器
    const $centerDropdown = overlay.find('#graph-center-dropdown');
    const $centerTrigger = $centerDropdown.find('.acu-graph-center-trigger');
    const $centerMenu = $centerDropdown.find('.acu-graph-center-menu');
    const $centerLabel = $centerDropdown.find('.acu-center-label');
    const syncCenterDropdownState = () => {
      $centerTrigger.attr('aria-expanded', $centerDropdown.hasClass('open') ? 'true' : 'false');
    };

    // 点击触发器 toggle 菜单
    $centerTrigger.on('click', function (e) {
      e.stopPropagation();
      $centerDropdown.toggleClass('open');
      syncCenterDropdownState();
    });

    // 点击选项
    $centerMenu.on('click', '.acu-center-option', function (e) {
      e.stopPropagation();
      const newCenter = $(this).data('value') as string;
      $centerDropdown.removeClass('open');
      syncCenterDropdownState();
      if (newCenter && newCenter !== centerNodeName && nodes.has(newCenter)) {
        centerNodeName = newCenter;
        // 更新下拉显示
        $centerLabel.text(replaceUserPlaceholders(newCenter));
        $centerMenu.find('.acu-center-option').removeClass('active');
        $centerMenu.find('.acu-center-option').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');
        // 清除布局缓存并重新布局
        clearLayoutCache();
        nodeArr.forEach(node => {
          node.radius = getNodeRadius(node.name, node.isPlayer);
        });
        runForceDirectedLayout();
        render();
        const displayName = replaceUserPlaceholders(newCenter);
        if (window.toastr) window.toastr.info(`已将「${displayName}」设为中心`, '', { timeOut: 1500 });
      }
    });

    // 点击外部关闭菜单
    overlay.on('click.center-dropdown', function () {
      $centerDropdown.removeClass('open');
      syncCenterDropdownState();
    });

    // 重置视图（缩放、位置 + 节点布局 + 节点大小 + 中心角色）
    overlay.find('#graph-zoom-reset').click(() => {
      // 重置缩放和平移
      scale = 1;
      panX = 0;
      panY = 0;
      updateTransform();

      // 重置中心角色为主角
      centerNodeName = resolvedPlayerName;
      $centerLabel.text(replaceUserPlaceholders(resolvedPlayerName));
      $centerMenu.find('.acu-center-option').removeClass('active');
      $centerMenu.find('.acu-center-option').attr('aria-selected', 'false');
      $centerMenu
        .find(`.acu-center-option[data-value="${resolvedPlayerName}"]`)
        .addClass('active')
        .attr('aria-selected', 'true');

      // 重置节点大小
      nodeSizeMultiplier = 1.0;
      $nodeSizeSlider.val(1.0);
      $sliderSizeDisplay.text('100%');
      updateNodeSizeDisplay();

      // 重置stepper显示值
      const $nodeSizeStepper = overlay.find('.acu-stepper[data-id="graph-node-size"]');
      if ($nodeSizeStepper.length) {
        $nodeSizeStepper.find('.acu-stepper-value').text('100%');
      }

      // 重新计算节点半径
      nodeArr.forEach(node => {
        node.radius = getNodeRadius(node.name, node.isPlayer);
      });

      // 重新加载布局（优先使用缓存）
      const resetLayoutLoadResult = loadLayoutCache();
      if (resetLayoutLoadResult !== 'full') {
        // 缓存不存在或不匹配，运行物理模拟
        runForceDirectedLayout(resetLayoutLoadResult === 'partial');
      }
      render();
    });

    // Stepper 步进器事件处理 - 节点大小控制
    const $nodeSizeStepper = overlay.find('.acu-stepper[data-id="graph-node-size"]');
    if ($nodeSizeStepper.length) {
      const min = parseInt($nodeSizeStepper.data('min')); // 50
      const max = parseInt($nodeSizeStepper.data('max')); // 200
      const step = parseInt($nodeSizeStepper.data('step')); // 10
      const $value = $nodeSizeStepper.find('.acu-stepper-value');

      const updateNodeSizeValue = (newPercent: number) => {
        newPercent = Math.max(min, Math.min(max, newPercent));
        nodeSizeMultiplier = newPercent / 100; // 转换为倍数 (0.5-2.0)
        $value.text(`${newPercent}%`);
        updateNodeSizeDisplay();

        // 重新计算节点半径并渲染
        nodeArr.forEach(node => {
          node.radius = getNodeRadius(node.name, node.isPlayer);
        });
        render();
      };

      const getCurrentPercent = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || 100;
      };

      $nodeSizeStepper.find('.acu-stepper-dec').on('click', function () {
        updateNodeSizeValue(getCurrentPercent() - step);
      });

      $nodeSizeStepper.find('.acu-stepper-inc').on('click', function () {
        updateNodeSizeValue(getCurrentPercent() + step);
      });
    }

    // 重新布局按钮
    overlay.find('#graph-relayout').click(() => {
      // 清除缓存
      clearLayoutCache();

      // 重新计算节点半径
      nodeArr.forEach(node => {
        node.radius = getNodeRadius(node.name, node.isPlayer);
      });

      // 重新运行物理模拟
      runForceDirectedLayout();
      render();
    });

    overlay.find('#graph-manage-avatar').click(() => {
      // 使用过滤后的节点数组，但头像管理应该显示所有节点
      showAvatarManager(nodeArr, () => {
        nodeAvatarCache.clear();
        nodeAvatarRequests.clear();
        // 重新计算节点半径（因为大小可能改变了）
        nodeArr.forEach(node => {
          node.radius = getNodeRadius(node.name, node.isPlayer);
        });
        render();
      });
    });

    const closeGraph = () => {
      cleanupEvents();
      overlay.remove();
    };
    overlay.find('.acu-graph-close').click(closeGraph);
    setupOverlayClose(overlay, 'acu-relation-graph-overlay', closeGraph);
  };
export {
  ACTION_BUTTONS,
  ACTION_ICON_MAP,
  CustomTableNameIconImageDB,
  DASHBOARD_DEFAULT_PRESET_ID,
  DASHBOARD_PRESET_MODULE_KEYS,
  DASHBOARD_RELATIONSHIP_GRAPH_MODULE_KEY,
  DASHBOARD_TABLE_CONFIG,
  DEFAULT_CONFIG,
  DEFAULT_GM_CONFIG,
  DashboardDataParser,
  DashboardPresetManager,
  FONTS,
  JSONC_FILE_ACCEPT,
  Store,
  THEMES,
  UpdateController,
  applyStoredPanelHeight,
  areAllTablesReversed,
  buildCheckValueText,
  buildGlobalInteractionGroups,
  buildRelationshipGraphTableFromPreset,
  canWriteMvuPanel,
  cleanupGlobalInteractionFloatingMenus,
  clearAllPanelStates,
  clearGlobalInteractionOutsideCapture,
  clearModalStack,
  cloneDashboardPresetModules,
  collectCurrentChatAvatarNodes,
  collectHostAndLocalNodes,
  createAutoRegexTransformKey,
  createDashboardPresetEditorTemplate,
  createElementFromHtml,
  createGlobalInteractionSections,
  debugGlobalInteraction,
  dedupeInteractionActions,
  downloadAiPromptFile,
  downloadJsonFile,
  downloadJsoncFile,
  executeTableInteractionAction,
  extractNumericValue,
  generateRPGAttributes,
  getActiveDashboardRelationshipGraphSources,
  getActivePanelHeightKey,
  getActiveTabState,
  getAttributeEntryForCharacter,
  getAttributeValue,
  getBadgeStyle,
  getCheckSuggestionItemsFromTable,
  getCollapsedState,
  getCore,
  getCurrentChatAvatarNodes,
  getCurrentContextFingerprint,
  getDashboardModuleConfig,
  getDashboardNpcListData,
  getDatabaseManualUpdateErrorMessage,
  getFullAttributesForCharacter,
  getHiddenTables,
  getIconForTableName,
  getInteractOptionsForRow,
  getJsonLikeErrorMessage,
  getNamedCheckParamText,
  getNavigationFontMetrics,
  getOptionItemsFromTable,
  getOptionsCollapsedState,
  getPanelDragStartHeight,
  getPendingDeletions,
  getRandomSkillPool,
  getSavedTableOrder,
  getStoredPanelHeight,
  getSuccessLevel,
  getTableHeights,
  getTableStyles,
  getTavernHostDocument,
  getTavernHostWindow,
  isCheckSuggestionTableName,
  isCustomTableNameIconImageUrlValid,
  isNumericCell,
  isOptionTableName,
  isRecord,
  isRecordValue,
  isSameAttributeAlias,
  isTableReversed,
  isTwoDimensionalArray,
  loadSnapshot,
  normalizeCollapseStyle,
  normalizeInteractionLabel,
  openDatabaseInterface,
  openDatabaseVisualizerInterface,
  parseAttributeString,
  parseDashboardPresetJson,
  parseJsoncDocument,
  parseJsoncRecord,
  parseJsoncValue,
  pickTextFile,
  popModal,
  pushModal,
  readTextFile,
  rememberAutoRegexTransform,
  renderCheckSuggestionOptionButtonHtml,
  renderDataCardCellContent,
  renderOptionButtonHtml,
  resetPanelRequestedHeight,
  resolveCustomTableNameIcon,
  resolveDashboardCustomTableNameIconContextInfo,
  resolveGlobalInteractionSectionMeta,
  resolveQuickSelectTarget,
  runDatabaseManualUpdate,
  saveActiveTabState,
  saveCollapsedState,
  saveCurrentDatabaseSnapshotAsReviewBaseline,
  saveHiddenTables,
  saveOptionsCollapsedState,
  savePanelRequestedHeight,
  saveSnapshot,
  saveTableHeights,
  saveTableOrder,
  saveTableStyles,
  setAllTablesReverse,
  setPanelRequestedHeight,
  shouldShowReverseButton,
  shouldSkipAutoRegexTransform,
  showContestPanel,
  showCustomTableNameIconManager,
  showDatabaseManualUpdateFailure,
  showDicePanel,
  showDiceSystemConfirmDialog,
  showDiceSystemInputDialog,
  showMapVisualization,
  showRelationshipGraph,
  toggleTableReverse,
  updateSaveButtonState,
  updateSingleAttribute,
  validateJsoncEditorConfig,}; // __wireDashboardDeps 已由头部 export function 导出
export type {
  AvatarManagerNode,
  CustomTableNameIconContext,
  GlobalInteractionAction,
  GlobalInteractionGroup,
  GlobalInteractionRow,
  GlobalInteractionSection,
  GlobalInteractionSectionKind,
  NavigationItem,
  RelationGraphTableInput,
  SpecialNavigationItem,};
