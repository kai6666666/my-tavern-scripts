// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=11「RenderPresetManager - 表格和变量渲染预设管理」
// 原行范围：3636-4291（含 banner 3633-4291）；拆分批次 7；外部 closure 依赖：9（isRecordValue@29 / DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS@10 / PRESET_FORMAT_VERSION@3 / parseJsoncRecord@29 / Store@29 / STORAGE_KEY_BLACKLIST@10 / isSameKeywordSet@10 / LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS@10 / getJsonLikeErrorMessage@29）
// 接线说明：DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS/STORAGE_KEY_BLACKLIST/isSameKeywordSet/LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS 已拆至 misc/quick-check-exclude-keywords.ts、
//   PRESET_FORMAT_VERSION 已拆至 engine/preset-constants.ts、showActionableErrorToast 来自 ../ui/actionable-error-toast（均不引用本文件，无循环），直接 import；
//   isRecordValue/parseJsoncRecord/Store/getJsonLikeErrorMessage@29 定义于 index.ts IIFE 内无法 export，采用运行时注入：
//   index.ts IIFE 末尾调用 __wireRenderPresetManagerDeps({...}) 注入；
//   未注入时模块级引用为 null（全部仅在运行时方法内调用，注入先于任何调用，与 IIFE 内原时序等价）。

import { DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, STORAGE_KEY_BLACKLIST, isSameKeywordSet } from '../misc/quick-check-exclude-keywords';
import { PRESET_FORMAT_VERSION } from '../engine/preset-constants';
import { showActionableErrorToast } from '../ui/actionable-error-toast';

let isRecordValue = null;
let parseJsoncRecord = null;
let Store = null;
let getJsonLikeErrorMessage = null;

export function __wireRenderPresetManagerDeps(deps) {
  isRecordValue = deps.isRecordValue;
  parseJsoncRecord = deps.parseJsoncRecord;
  Store = deps.Store;
  getJsonLikeErrorMessage = deps.getJsonLikeErrorMessage;
}
  // ========================================
  // RenderPresetManager - 表格和变量渲染预设管理
  // ========================================
  const RENDER_PRESET_FORMAT = 'acu_render_preset_v1' as const;
  const RENDER_DEFAULT_PRESET_ID = '__builtin_render_default__';
  const RENDER_LEGACY_BLACKLIST_PRESET_ID = 'render_legacy_blacklist_migration';
  const STORAGE_KEY_RENDER_PRESETS = 'acu_render_presets_v1';
  const STORAGE_KEY_ACTIVE_RENDER_PRESET = 'acu_active_render_preset_v1';
  const STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED = 'acu_render_preset_blacklist_migrated_v1';

  interface RenderPresetColumnDisplayRules {
    stripBracketContent: boolean;
    aliases: Record<string, string>;
  }

  interface RenderPresetRelationshipRules {
    enabled: boolean;
    headerKeywords: string[];
    autoDetectMultipleParen: boolean;
  }

  interface RenderPresetAttributeRules {
    enabled: boolean;
    parseJsonObject: boolean;
    parseKeyValuePairs: boolean;
  }

  interface RenderPresetShortTagRules {
    enabled: boolean;
    maxLength: number;
  }

  interface RenderPresetBadgeRules {
    enabled: boolean;
    shortTextMaxLength: number;
    numericPattern: boolean;
    statusValues: string[];
  }

  interface RenderPresetQuickCheckRules {
    enabled: boolean;
    excludeKeywords: string[];
  }

  interface RenderPresetDialogueIndentRules {
    whitelist: string[];
    blacklist: string[];
  }

  interface RenderPresetRules {
    columnDisplay: RenderPresetColumnDisplayRules;
    invalidValues: string[];
    identityHeaderKeywords: string[];
    relationship: RenderPresetRelationshipRules;
    attributes: RenderPresetAttributeRules;
    shortTags: RenderPresetShortTagRules;
    badges: RenderPresetBadgeRules;
    quickCheck: RenderPresetQuickCheckRules;
    dialogueIndent: RenderPresetDialogueIndentRules;
  }

  interface RenderPreset {
    format: typeof RENDER_PRESET_FORMAT;
    version: string;
    id: string;
    name: string;
    builtin?: boolean;
    description?: string;
    rules: RenderPresetRules;
    createdAt?: string;
    updatedAt?: string;
  }

  const normalizeRenderPresetStringList = (value: unknown, fallback: readonly string[] = []): string[] => {
    const rawItems = Array.isArray(value) ? value : fallback;
    const seen = new Set<string>();
    const result: string[] = [];
    rawItems.forEach(item => {
      const text = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!text || seen.has(text)) return;
      seen.add(text);
      result.push(text);
    });
    return result;
  };

  const normalizeRenderPresetTagFilterList = (value: unknown, fallback: readonly string[] = []): string[] => {
    const rawItems = typeof value === 'string' ? value.split(/[,，;；\n]/) : Array.isArray(value) ? value : fallback;
    const seen = new Set<string>();
    const result: string[] = [];
    rawItems.forEach(item => {
      let text = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!text) return;
      if (text.startsWith('<') && text.endsWith('>')) {
        text = text
          .slice(1, -1)
          .replace(/^\/\s*/, '')
          .replace(/\/\s*$/, '')
          .trim();
        text = text.split(/\s+/)[0] || '';
      }
      if (!text) return;
      const dedupeKey = text.toLocaleLowerCase();
      if (seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      result.push(text);
    });
    return result;
  };

  const normalizeRenderPresetAliasMap = (value: unknown, fallback: Record<string, string>): Record<string, string> => {
    const source = isRecordValue(value) ? value : fallback;
    const aliases: Record<string, string> = {};
    Object.entries(source).forEach(([rawKey, rawValue]) => {
      const key = String(rawKey || '').trim();
      const alias = typeof rawValue === 'string' || typeof rawValue === 'number' ? String(rawValue).trim() : '';
      if (key && alias) aliases[key] = alias;
    });
    return aliases;
  };

  const cloneRenderPresetRules = (rules: RenderPresetRules): RenderPresetRules =>
    JSON.parse(JSON.stringify(rules)) as RenderPresetRules;

  const DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST = [
    'summary',
    'tucao',
    'JSONPatch',
    'Analysis',
    'UpdateVariable',
    'StatusBlock',
    'StatusPlaceHolderImpl',
    'options',
    'meta:检定结果',
    '摘要',
    'image',
    'script',
    'placeholder',
    'think',
    'thought',
    'thinking',
  ] as const;

  const DEFAULT_RENDER_PRESET_RULES: RenderPresetRules = {
    columnDisplay: {
      stripBracketContent: true,
      aliases: {
        一句话介绍: '介绍',
        外貌特征: '外貌',
      },
    },
    invalidValues: ['-', '--', '—', 'null', 'none', '无', '空', 'n/a', 'undefined', '/', 'nil'],
    identityHeaderKeywords: ['身份'],
    relationship: {
      enabled: true,
      headerKeywords: ['关系', '人际'],
      autoDetectMultipleParen: true,
    },
    attributes: {
      enabled: true,
      parseJsonObject: true,
      parseKeyValuePairs: true,
    },
    shortTags: {
      enabled: true,
      maxLength: 6,
    },
    badges: {
      enabled: true,
      shortTextMaxLength: 6,
      numericPattern: true,
      statusValues: ['是', '否', '有', '无', '死亡', '存活'],
    },
    quickCheck: {
      enabled: true,
      excludeKeywords: [...DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS],
    },
    dialogueIndent: {
      whitelist: ['*'],
      blacklist: [...DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST],
    },
  };

  const normalizeRenderPresetRules = (rawRules: unknown): RenderPresetRules => {
    const raw = isRecordValue(rawRules) ? rawRules : {};
    const columnDisplay = isRecordValue(raw.columnDisplay) ? raw.columnDisplay : {};
    const relationship = isRecordValue(raw.relationship) ? raw.relationship : {};
    const attributes = isRecordValue(raw.attributes) ? raw.attributes : {};
    const shortTags = isRecordValue(raw.shortTags) ? raw.shortTags : {};
    const badges = isRecordValue(raw.badges) ? raw.badges : {};
    const quickCheck = isRecordValue(raw.quickCheck) ? raw.quickCheck : {};
    const dialogueIndent = isRecordValue(raw.dialogueIndent) ? raw.dialogueIndent : {};

    const shortTextMaxLength = Math.max(
      1,
      Math.min(
        24,
        Math.floor(Number(badges.shortTextMaxLength) || DEFAULT_RENDER_PRESET_RULES.badges.shortTextMaxLength),
      ),
    );
    const shortTagMaxLength = Math.max(
      1,
      Math.min(24, Math.floor(Number(shortTags.maxLength) || DEFAULT_RENDER_PRESET_RULES.shortTags.maxLength)),
    );

    return {
      columnDisplay: {
        stripBracketContent:
          typeof columnDisplay.stripBracketContent === 'boolean'
            ? columnDisplay.stripBracketContent
            : DEFAULT_RENDER_PRESET_RULES.columnDisplay.stripBracketContent,
        aliases: normalizeRenderPresetAliasMap(
          columnDisplay.aliases,
          DEFAULT_RENDER_PRESET_RULES.columnDisplay.aliases,
        ),
      },
      invalidValues: normalizeRenderPresetStringList(raw.invalidValues, DEFAULT_RENDER_PRESET_RULES.invalidValues),
      identityHeaderKeywords: normalizeRenderPresetStringList(
        raw.identityHeaderKeywords,
        DEFAULT_RENDER_PRESET_RULES.identityHeaderKeywords,
      ),
      relationship: {
        enabled:
          typeof relationship.enabled === 'boolean'
            ? relationship.enabled
            : DEFAULT_RENDER_PRESET_RULES.relationship.enabled,
        headerKeywords: normalizeRenderPresetStringList(
          relationship.headerKeywords,
          DEFAULT_RENDER_PRESET_RULES.relationship.headerKeywords,
        ),
        autoDetectMultipleParen:
          typeof relationship.autoDetectMultipleParen === 'boolean'
            ? relationship.autoDetectMultipleParen
            : DEFAULT_RENDER_PRESET_RULES.relationship.autoDetectMultipleParen,
      },
      attributes: {
        enabled:
          typeof attributes.enabled === 'boolean' ? attributes.enabled : DEFAULT_RENDER_PRESET_RULES.attributes.enabled,
        parseJsonObject:
          typeof attributes.parseJsonObject === 'boolean'
            ? attributes.parseJsonObject
            : DEFAULT_RENDER_PRESET_RULES.attributes.parseJsonObject,
        parseKeyValuePairs:
          typeof attributes.parseKeyValuePairs === 'boolean'
            ? attributes.parseKeyValuePairs
            : DEFAULT_RENDER_PRESET_RULES.attributes.parseKeyValuePairs,
      },
      shortTags: {
        enabled:
          typeof shortTags.enabled === 'boolean' ? shortTags.enabled : DEFAULT_RENDER_PRESET_RULES.shortTags.enabled,
        maxLength: shortTagMaxLength,
      },
      badges: {
        enabled: typeof badges.enabled === 'boolean' ? badges.enabled : DEFAULT_RENDER_PRESET_RULES.badges.enabled,
        shortTextMaxLength,
        numericPattern:
          typeof badges.numericPattern === 'boolean'
            ? badges.numericPattern
            : DEFAULT_RENDER_PRESET_RULES.badges.numericPattern,
        statusValues: normalizeRenderPresetStringList(
          badges.statusValues,
          DEFAULT_RENDER_PRESET_RULES.badges.statusValues,
        ),
      },
      quickCheck: {
        enabled:
          typeof quickCheck.enabled === 'boolean' ? quickCheck.enabled : DEFAULT_RENDER_PRESET_RULES.quickCheck.enabled,
        excludeKeywords: normalizeRenderPresetStringList(
          quickCheck.excludeKeywords,
          DEFAULT_RENDER_PRESET_RULES.quickCheck.excludeKeywords,
        ),
      },
      dialogueIndent: {
        whitelist: normalizeRenderPresetTagFilterList(
          dialogueIndent.whitelist,
          DEFAULT_RENDER_PRESET_RULES.dialogueIndent.whitelist,
        ),
        blacklist: normalizeRenderPresetTagFilterList(
          dialogueIndent.blacklist,
          DEFAULT_RENDER_PRESET_RULES.dialogueIndent.blacklist,
        ),
      },
    };
  };

  const createBuiltinRenderPreset = (): RenderPreset => ({
    format: RENDER_PRESET_FORMAT,
    version: PRESET_FORMAT_VERSION,
    id: RENDER_DEFAULT_PRESET_ID,
    name: '默认渲染预设',
    builtin: true,
    description: '内置默认渲染规则，包含列名显示、属性键值对、关系、短标签、快捷检定过滤和正文头像渲染标签过滤等规则',
    rules: cloneRenderPresetRules(DEFAULT_RENDER_PRESET_RULES),
  });

  const parseRenderPresetJson = (jsonText: string): { name: string; description: string; rules: RenderPresetRules } => {
    const parsed = parseJsoncRecord(jsonText, '渲染预设');

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format && format !== RENDER_PRESET_FORMAT) {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    const rawRules = 'rules' in parsed ? parsed.rules : parsed;
    const rules = normalizeRenderPresetRules(rawRules);
    const name = typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : '导入的渲染预设';
    const description = typeof parsed.description === 'string' ? parsed.description.trim() : '';
    return { name, description, rules };
  };

  const createRenderPresetEditorTemplate = (): string => `{
  // 渲染预设只改变“怎么显示”，不会修改数据库里的真实列名和真实内容。
  // 影响范围：主表格卡片、收藏夹卡片、仪表盘预览、MVU 数值面板的快捷检定按钮。
  // 这里可以直接填写 rules 对象；导入完整预设文件时也支持 format / name / description / rules 包装。

  // columnDisplay：控制列名显示。
  // 例：真实列名是“一句话介绍（给 AI 看）”，显示时会先去掉括号内容，再按 aliases 改成“介绍”。
  "columnDisplay": {
    // true：移除列名里 ()、（） 、[]、【】 及其中内容。
    // 只影响显示名，不影响表头、锁定 key、搜索和写入。
    "stripBracketContent": true,

    // aliases：列名显示别名。左边是真实列名或清理括号后的列名，右边是你想显示给用户看的名字。
    // 例：“外貌特征”显示为“外貌”；真实表头仍然叫“外貌特征”。
    "aliases": {
      "一句话介绍": "介绍",
      "外貌特征": "外貌"
    }
  },

  // invalidValues：这些值会被当作“空内容”处理。
  // 在表格卡片里会隐藏这一行；在关系和短标签拆分里会被过滤掉。
  "invalidValues": ["-", "--", "—", "null", "none", "无", "空", "n/a", "undefined", "/", "nil"],

  // identityHeaderKeywords：身份字段例外。
  // 列名包含这些词时，不拆“属性:数值”、不拆“人名:关系”、不拆分号标签，尽量保留普通文本或标签。
  // 例：“身份”列里的“侦探;调查员”不会被拆成两个短标签。
  "identityHeaderKeywords": ["身份"],

  // relationship：控制“人名:关系”这类内容的显示方式。
  // 推荐格式是“张三:朋友;李四:竞争”，会显示成两条关系：张三=朋友、李四=竞争；界面上不再重复显示原列名。
  "relationship": {
    // false：完全关闭关系拆分，回退为普通文本。
    "enabled": true,

    // headerKeywords：按“列名”判断是否属于关系列。
    // 例：列名是“人际关系”“NPC关系”时，会尝试把这一列里的“张三:朋友;李四:竞争”拆成多条关系显示。
    "headerKeywords": ["关系", "人际"],

    // autoDetectMultipleParen：按“内容”兜底判断。
    // true 时：即使列名是“备注”这类普通名字，只要内容里有多个旧式“人名(关系)”，也会自动拆成多条关系显示。
    // 注意：冒号格式“张三:朋友;李四:竞争”建议放在列名包含 headerKeywords 的关系列里。
    "autoDetectMultipleParen": true
  },

  // attributes：控制属性键值对渲染。
  // 会把“力量:80; 敏捷:70”或 {"力量":80,"敏捷":70} 拆成两行，显示“属性名 + 数值”，并隐藏原列名。
  // 拆出的数值属性会按 quickCheck 规则决定是否显示快捷检定按钮。
  "attributes": {
    // false：完全关闭属性拆分，回退为普通文本。
    "enabled": true,

    // true：支持 JSON 对象格式，如 {"力量":80,"敏捷":70}。
    "parseJsonObject": true,

    // true：支持 属性名:数值 / 属性名：数值，也支持分号、逗号、空格分隔。
    "parseKeyValuePairs": true
  },

  // shortTags：控制短标签渲染。
  // 例：“受伤;潜行;警觉”会显示成三个标签。
  // 如果任意一项超过 maxLength，会回退为普通文本，避免长句被切成一堆标签。
  "shortTags": {
    "enabled": true,
    "maxLength": 6
  },

  // badges（小标签）：控制普通短文本是否显示成紧凑的小标签。
  // 短文本、百分比、Lv.N、状态词可以沿用当前小标签样式。
  "badges": {
    "enabled": true,

    // 长度不超过这个值的普通文本可以显示为标签。
    "shortTextMaxLength": 6,

    // true：百分比、分数、Lv.N 这类数值短文本也可以显示为小标签。
    "numericPattern": true,

    // 常见状态词。可以增删，比如加入“昏迷”“中毒”“失踪”。
    "statusValues": ["是", "否", "有", "无", "死亡", "存活"]
  },

  // quickCheck：控制快捷检定按钮。
  // 启用时，表格里的纯数值、属性键值对数值、MVU 数值面板包含数字时会渲染快捷检定用骰子图标。
  "quickCheck": {
    // false：所有渲染位置都不显示快捷检定按钮。
    "enabled": true,

    // excludeKeywords：列名或属性名包含这些词时，不显示快捷检定按钮。
    // 用来排除“描述”“身份”“外貌”等虽然可能含数字、但不适合检定的字段。
    "excludeKeywords": ${JSON.stringify(DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS, null, 6).replace(/\n/g, '\n    ')}
  },

  // dialogueIndent：控制“正文头像渲染”只在哪些消息标签内生效。
  // 白名单和黑名单是“且”的关系：文本必须命中白名单，且不能处在黑名单标签内。
  // 黑名单优先。例：whitelist=["content"] 且 blacklist=["tag1"] 时，
  // <content><tag1>...</tag1><tag2>...</tag2></content> 只会尝试渲染 tag2 里的正文头像。
  "dialogueIndent": {
    // whitelist：为空或包含 "*" 时，不限制标签范围，维持默认全局识别。
    // 如果只想处理 <content></content> 内的正文，可改成 ["content"]。
    // 也支持逗号分隔字符串，如 "content, tag2, tag3"。
    "whitelist": ["*"],

    // blacklist：处在这些标签内的内容永远不做正文头像渲染。
    // 用来排除摘要、分析、变量更新、检定结果、选项、图片等系统内容。
    "blacklist": ${JSON.stringify(DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST, null, 6).replace(/\n/g, '\n    ')}
  }
}`;

  const RenderPresetManager = (() => {
    let _cache: RenderPreset[] | null = null;

    const getBuiltinPreset = (): RenderPreset => createBuiltinRenderPreset();
    const getStoredPresets = (): RenderPreset[] => Store.get(STORAGE_KEY_RENDER_PRESETS, []);
    const saveStoredPresets = (presets: RenderPreset[]) => {
      Store.set(STORAGE_KEY_RENDER_PRESETS, presets);
      _cache = null;
    };

    const normalizeStoredPreset = (preset: unknown): RenderPreset | null => {
      if (!isRecordValue(preset)) return null;
      const id = typeof preset.id === 'string' ? preset.id.trim() : '';
      const name = typeof preset.name === 'string' ? preset.name.trim() : '';
      if (!id || !name) return null;
      return {
        format: RENDER_PRESET_FORMAT,
        version: typeof preset.version === 'string' ? preset.version : PRESET_FORMAT_VERSION,
        id,
        name,
        builtin: preset.builtin === true,
        description: typeof preset.description === 'string' ? preset.description : '',
        rules: normalizeRenderPresetRules(preset.rules),
        createdAt: typeof preset.createdAt === 'string' ? preset.createdAt : undefined,
        updatedAt: typeof preset.updatedAt === 'string' ? preset.updatedAt : undefined,
      };
    };

    const getNormalizedStoredPresets = (): RenderPreset[] =>
      getStoredPresets()
        .map(normalizeStoredPreset)
        .filter((preset): preset is RenderPreset => Boolean(preset))
        .map(preset => ({ ...preset, builtin: false }));

    const migrateLegacyBlacklistIfNeeded = (): void => {
      if (Store.get(STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, false) === true) return;
      const legacy = Store.get(STORAGE_KEY_BLACKLIST, null);
      Store.set(STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED, true);
      if (!Array.isArray(legacy)) return;

      const legacyList = normalizeRenderPresetStringList(legacy);
      const sameAsDefault =
        isSameKeywordSet(legacyList, DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS) ||
        isSameKeywordSet(legacyList, LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS);
      if (sameAsDefault) return;

      const stored = getNormalizedStoredPresets();
      if (stored.some(preset => preset.id === RENDER_LEGACY_BLACKLIST_PRESET_ID)) return;
      const shouldBackfillOverview =
        !legacyList.includes('概览') &&
        LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS.every(keyword => legacyList.includes(keyword));
      const migratedRules = cloneRenderPresetRules(DEFAULT_RENDER_PRESET_RULES);
      migratedRules.quickCheck.excludeKeywords = shouldBackfillOverview ? [...legacyList, '概览'] : legacyList;
      const migratedPreset: RenderPreset = {
        format: RENDER_PRESET_FORMAT,
        version: PRESET_FORMAT_VERSION,
        id: RENDER_LEGACY_BLACKLIST_PRESET_ID,
        name: '从变量过滤黑名单迁移',
        builtin: false,
        description: '自动迁移旧版变量过滤黑名单生成的渲染预设',
        rules: migratedRules,
        createdAt: new Date().toISOString(),
      };
      saveStoredPresets([...stored, migratedPreset]);
      Store.set(STORAGE_KEY_ACTIVE_RENDER_PRESET, migratedPreset.id);
    };

    const getQuickCheckCompareName = (key: string): string => {
      const parts = key
        .split(/>| > /)
        .map(part => part.trim())
        .filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : key;
    };

    return {
      getAllPresets(): RenderPreset[] {
        migrateLegacyBlacklistIfNeeded();
        if (_cache) return _cache;
        _cache = [getBuiltinPreset(), ...getNormalizedStoredPresets()];
        return _cache;
      },

      getPresetById(id: string): RenderPreset | null {
        return this.getAllPresets().find(preset => preset.id === id) || null;
      },

      getActivePresetId(): string {
        const stored = Store.get(STORAGE_KEY_ACTIVE_RENDER_PRESET, RENDER_DEFAULT_PRESET_ID);
        if (typeof stored !== 'string' || !this.getPresetById(stored)) {
          Store.set(STORAGE_KEY_ACTIVE_RENDER_PRESET, RENDER_DEFAULT_PRESET_ID);
          return RENDER_DEFAULT_PRESET_ID;
        }
        return stored;
      },

      getActivePreset(): RenderPreset {
        return this.getPresetById(this.getActivePresetId()) || getBuiltinPreset();
      },

      setActivePresetId(id: string): boolean {
        const preset = this.getPresetById(id);
        if (!preset) return false;
        Store.set(STORAGE_KEY_ACTIVE_RENDER_PRESET, id);
        return true;
      },

      createPreset(preset: { name: string; description?: string; rules: RenderPresetRules }): RenderPreset {
        const stored = getNormalizedStoredPresets();
        const newPreset: RenderPreset = {
          format: RENDER_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          id: `render_${Date.now()}`,
          name: preset.name,
          description: preset.description || '',
          builtin: false,
          rules: normalizeRenderPresetRules(preset.rules),
          createdAt: new Date().toISOString(),
        };
        saveStoredPresets([...stored, newPreset]);
        return newPreset;
      },

      updatePreset(id: string, updates: { name: string; description?: string; rules: RenderPresetRules }): boolean {
        const stored = getNormalizedStoredPresets();
        const index = stored.findIndex(preset => preset.id === id);
        if (index < 0) return false;
        stored[index] = {
          ...stored[index],
          name: updates.name,
          description: updates.description || '',
          rules: normalizeRenderPresetRules(updates.rules),
          version: PRESET_FORMAT_VERSION,
          updatedAt: new Date().toISOString(),
        };
        saveStoredPresets(stored);
        return true;
      },

      deletePreset(id: string): boolean {
        if (id === RENDER_DEFAULT_PRESET_ID) return false;
        const stored = getNormalizedStoredPresets();
        const filtered = stored.filter(preset => preset.id !== id);
        if (filtered.length === stored.length) return false;
        saveStoredPresets(filtered);
        if (this.getActivePresetId() === id) {
          this.setActivePresetId(RENDER_DEFAULT_PRESET_ID);
        }
        return true;
      },

      exportPreset(id: string): string | null {
        const preset = this.getPresetById(id);
        if (!preset) return null;
        const exported = {
          format: RENDER_PRESET_FORMAT,
          version: PRESET_FORMAT_VERSION,
          name: preset.name,
          description: preset.description || '',
          rules: cloneRenderPresetRules(preset.rules),
        };
        return JSON.stringify(exported, null, 2);
      },

      importPreset(jsonText: string): RenderPreset | null {
        try {
          const parsed = parseRenderPresetJson(jsonText);
          return this.createPreset({
            name: parsed.name,
            description: parsed.description,
            rules: parsed.rules,
          });
        } catch (error) {
          console.error('[DICE]RenderPresetManager 导入失败:', error);
          if (window.toastr)
            showActionableErrorToast('渲染预设导入失败: ' + getJsonLikeErrorMessage(error), {
              suggestion: 'importExport',
            });
          return null;
        }
      },

      getColumnDisplayName(headerName: string): string {
        const preset = this.getActivePreset();
        const rawHeader = String(headerName || '').trim();
        const stripped = preset.rules.columnDisplay.stripBracketContent
          ? rawHeader.replace(/[\(（\[【][^)）\]】]*[\)）\]】]/g, '').trim()
          : rawHeader;
        return (
          preset.rules.columnDisplay.aliases[stripped] || preset.rules.columnDisplay.aliases[rawHeader] || stripped
        );
      },

      isInvalidValue(value: string): boolean {
        const lowered = String(value || '')
          .trim()
          .toLowerCase();
        if (!lowered) return false;
        return this.getActivePreset().rules.invalidValues.some(item => lowered === item.toLowerCase());
      },

      isIdentityHeader(headerName: string): boolean {
        const header = String(headerName || '').toLowerCase();
        return this.getActivePreset().rules.identityHeaderKeywords.some(keyword =>
          header.includes(keyword.toLowerCase()),
        );
      },

      isRelationshipCell(value: string, headerName: string): boolean {
        const rules = this.getActivePreset().rules.relationship;
        if (!rules.enabled) return false;
        const header = String(headerName || '').toLowerCase();
        if (rules.headerKeywords.some(keyword => header.includes(keyword.toLowerCase()))) return true;
        return (
          rules.autoDetectMultipleParen &&
          /^[^(（;；]+[(（][^)）]+[)）](?:[;；][^(（;；]+[(（][^)）]+[)）])+$/.test(String(value || '').trim())
        );
      },

      shouldShowQuickCheck(key: string): boolean {
        const rules = this.getActivePreset().rules.quickCheck;
        if (!rules.enabled) return false;
        const compareName = getQuickCheckCompareName(String(key || ''));
        if (!compareName) return false;
        return !rules.excludeKeywords.some(keyword => compareName.includes(keyword));
      },

      getDialogueIndentTagFilter(): RenderPresetDialogueIndentRules {
        const rules = this.getActivePreset().rules.dialogueIndent;
        return {
          whitelist: [...rules.whitelist],
          blacklist: [...rules.blacklist],
        };
      },

      clearCache(): void {
        _cache = null;
      },
    };
  })();
export {
  RENDER_PRESET_FORMAT,
  RENDER_DEFAULT_PRESET_ID,
  RENDER_LEGACY_BLACKLIST_PRESET_ID,
  STORAGE_KEY_RENDER_PRESETS,
  STORAGE_KEY_ACTIVE_RENDER_PRESET,
  STORAGE_KEY_RENDER_PRESET_BLACKLIST_MIGRATED,
  normalizeRenderPresetStringList,
  normalizeRenderPresetTagFilterList,
  normalizeRenderPresetAliasMap,
  cloneRenderPresetRules,
  DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST,
  DEFAULT_RENDER_PRESET_RULES,
  normalizeRenderPresetRules,
  createBuiltinRenderPreset,
  parseRenderPresetJson,
  createRenderPresetEditorTemplate,
  RenderPresetManager,
}; // __wireRenderPresetManagerDeps 已由头部 export function 导出
export type {
  RenderPresetColumnDisplayRules,
  RenderPresetRelationshipRules,
  RenderPresetAttributeRules,
  RenderPresetShortTagRules,
  RenderPresetBadgeRules,
  RenderPresetQuickCheckRules,
  RenderPresetDialogueIndentRules,
  RenderPresetRules,
  RenderPreset,
};
