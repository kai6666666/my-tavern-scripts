// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=25「预设切换时更新表格模板」
// 原行范围：15617-16297（含 banner 15606-16297）；拆分批次 5；外部 closure 依赖：7（AdvancedDicePresetManager@24 / AttributePresetManager@23 / generateRPGAttributes@29 / getCore@29 / Store@29 / STORAGE_KEY_ACTIVE_ATTR_PRESET@3 / STORAGE_KEY_ACTIVE_ADVANCED_PRESET@24）
// 接线说明：AdvancedDicePresetManager@24 定义于 index.ts IIFE 内（章节24，未拆分）；AttributePresetManager@23 与本批次同拆至 attribute-rule-preset.ts（两文件互引，直接 import 会形成循环），
//   均采用运行时注入：index.ts IIFE 末尾调用 __wirePresetSwitchTableTemplateDeps({ AdvancedDicePresetManager, AttributePresetManager, generateRPGAttributes, getCore, Store, STORAGE_KEY_ACTIVE_ATTR_PRESET, STORAGE_KEY_ACTIVE_ADVANCED_PRESET }) 注入；
//   未注入时模块级引用为 null（方法仅在运行时调用，注入先于任何调用，与 IIFE 内原时序等价）。
// 类型（AdvancedDicePreset/CheckSuggestionGuide 来自同批拆出的 advanced-dice-preset.ts、BUILTIN_ATTRIBUTE_PRESETS 仅作 typeof 类型查询来自 attribute-rule-preset.ts），import type 引入（esbuild 剥离，无运行时依赖，无循环）。

import type { AdvancedDicePreset, CheckSuggestionGuide } from './advanced-dice-preset';
import type { BUILTIN_ATTRIBUTE_PRESETS } from './attribute-rule-preset';

let AdvancedDicePresetManager = null;
let AttributePresetManager = null;
let generateRPGAttributes = null;
let getCore = null;
let Store = null;
let STORAGE_KEY_ACTIVE_ATTR_PRESET = null;
let STORAGE_KEY_ACTIVE_ADVANCED_PRESET = null;

export function __wirePresetSwitchTableTemplateDeps(deps) {
  AdvancedDicePresetManager = deps.AdvancedDicePresetManager;
  AttributePresetManager = deps.AttributePresetManager;
  generateRPGAttributes = deps.generateRPGAttributes;
  getCore = deps.getCore;
  Store = deps.Store;
  STORAGE_KEY_ACTIVE_ATTR_PRESET = deps.STORAGE_KEY_ACTIVE_ATTR_PRESET;
  STORAGE_KEY_ACTIVE_ADVANCED_PRESET = deps.STORAGE_KEY_ACTIVE_ADVANCED_PRESET;
}
  // ========================================
  // 预设切换时更新表格模板
  // ========================================

  /**
   * 根据数值范围动态生成属性标尺描述（包含基准说明）
   * 将范围按比例划分为6个区间：能力缺失/弱项/平均/精英/极限/破格
   * @param min 范围最小值
   * @param max 范围最大值
   * @returns 完整的属性标尺描述字符串（包含标尺和基准说明）
   */
  const generateAttributeScale = (min: number, max: number): string => {
    const range = max - min;

    // 计算各区间的边界值（向下取整）
    const threshold1 = Math.floor(min + range * 0.1); // 能力缺失上限
    const threshold2 = Math.floor(min + range * 0.4); // 弱项上限
    const threshold3 = Math.floor(min + range * 0.6); // 平均上限
    const threshold4 = Math.floor(min + range * 0.8); // 精英上限
    const threshold5 = Math.floor(min + range * 0.9); // 极限上限

    // 生成标尺字符串，处理边界情况（避免出现 "3-3" 这样的区间）
    const formatRange = (start: number, end: number): string => {
      if (start === end) return `${start}`;
      return `${start}-${end}`;
    };

    const scales = [
      `${formatRange(min, threshold1)}:能力缺失`,
      `${formatRange(threshold1 + 1, threshold2)}:弱项`,
      `${formatRange(threshold2 + 1, threshold3)}:平均`,
      `${formatRange(threshold3 + 1, threshold4)}:精英`,
      `${formatRange(threshold4 + 1, threshold5)}:极限`,
      `${formatRange(threshold5 + 1, max)}:破格`,
    ];

    const scaleStr = scales.join(' | ');

    // 计算基准说明中的动态数值
    // "聚集在40-60" → 平均区间
    // "90+呈断崖式稀缺" → 极限区间起点
    // "重伤→0-10" → 能力缺失区间
    // "肾上腺素→80" → 精英区间的高端值
    const avgStart = threshold2 + 1;
    const avgEnd = threshold3;
    const rareThreshold = threshold5 + 1; // 破格区间起点
    const debuffRange = formatRange(min, threshold1); // 能力缺失区间
    const buffRange = formatRange(threshold4 + 1, threshold5); // 精英区间上限

    const baseDescription = `基准: 数值呈指数增长；分布呈长尾状(绝大多数聚集在${avgStart}-${avgEnd}，${rareThreshold}+呈断崖式稀缺)，依角色[身份背景]生成，当前值受[当前状态]修正。如:重伤→${debuffRange}; 肾上腺素→${buffRange}`;

    return `${scaleStr}。${baseDescription}`;
  };

  // 默认规则的特有属性模板内容（用于恢复）
  const DEFAULT_SPECIAL_ATTR_TEMPLATE = {
    // 主角信息表和重要人物表统一的默认内容
    range: [0, 100] as [number, number],
    // 默认示例（分号分隔格式）
    example: '爆裂魔法:85; 时间回溯:70; 超电磁炮:90',
  };

  // 默认规则的虚拟预设定义（六维属性百分制）
  const DEFAULT_VIRTUAL_PRESET = {
    id: '__default__',
    name: '六维属性百分制',
    baseAttributes: ['力量', '敏捷', '体质', '智力', '感知', '魅力'].map(name => ({
      name,
      formula: '3d6*5',
      range: [5, 95] as [number, number],
      modifier: '1d10-5',
    })),
    specialAttributes: [] as { name: string; formula: string; range: [number, number]; modifier: string }[],
  };

  /**
   * 替换标签内容的通用函数（支持多行内容）
   * @param text 原始文本
   * @param tag 标签名（中文标签如 "属性规则"）
   * @param content 新内容
   */
  const replaceTag = (text: string, tag: string, content: string): string => {
    // 使用 [\s\S]* 匹配任意字符（包括换行）
    const regex = new RegExp(`<${tag}>[\\s\\S]*?</${tag}>`, 'g');
    return text.replace(regex, `<${tag}>\n${content}\n</${tag}>`);
  };

  const getCheckSuggestionPresetById = (presetId: string | null | undefined): AdvancedDicePreset | null => {
    const presets = AdvancedDicePresetManager.getAllPresets() as AdvancedDicePreset[];
    const fallback = presets.find(preset => preset.id === 'coc7_check') || null;
    if (!presetId) return AdvancedDicePresetManager.getActivePreset() || fallback;
    return presets.find(preset => preset.id === presetId) || fallback;
  };

  const buildAutoCheckSuggestionGuide = (preset: AdvancedDicePreset): Required<CheckSuggestionGuide> => {
    const supportsContest = AdvancedDicePresetManager.supportsContest(preset);
    const diceExpression = preset.diceExpression || '1d100';
    const hasDc = !preset.dc?.hidden;
    const hasMod = !!preset.mod && !preset.mod.hidden;
    const hasSkillMod = !!preset.skillMod && !preset.skillMod.hidden;
    const customParamText =
      preset.customFields
        ?.filter(field => !field.hidden)
        .map(field => `${field.id}=<${field.label || field.id}>`)
        .join(' ') || '';
    const paramPieces = [
      hasDc ? 'dc=<目标值>' : '',
      hasMod ? 'mod=<修正值>' : '',
      hasSkillMod ? 'skillMod=<技能加值或属性名>' : '',
      customParamText,
    ]
      .filter(Boolean)
      .join(' ');
    const suffix = paramPieces ? ` ${paramPieces}` : '';

    return {
      rule:
        `使用当前检定预设「${preset.name}」：掷骰公式为 ${diceExpression}，按该预设的 outcomes、判定策略与输出模板裁决结果。` +
        '属性名必须来自下方角色属性清单并原样引用；需要额外参数时使用 key=value。',
      dsl:
        `普通检定：检定 <角色> <属性>${suffix}\n` +
        (supportsContest ? `对抗检定：对抗 <发起者> <属性> vs <对手> <属性>${suffix}\n` : '') +
        '固定成功：必成\n固定失败：必败\n无需检定：无',
      examples:
        `1. 展示文本：<角色>尝试完成一个关键行动。\n   骰子命令：检定 <角色> <属性>${suffix}\n` +
        (supportsContest
          ? `2. 展示文本：<角色>与<对手>在同一目标上相互较量。\n   骰子命令：对抗 <角色> <属性> vs <对手> <属性>\n`
          : '') +
        '3. 展示文本：行动结果已经明确，不需要投骰。\n   骰子命令：无',
    };
  };

  const buildCheckSuggestionGuide = (preset: AdvancedDicePreset): string => {
    const autoGuide = buildAutoCheckSuggestionGuide(preset);
    const manualGuide = preset.checkSuggestionGuide || {};
    const rule = String(manualGuide.rule || autoGuide.rule).trim();
    const dsl = String(manualGuide.dsl || autoGuide.dsl).trim();
    const examples = String(manualGuide.examples || autoGuide.examples).trim();
    return `【检定规则】
${rule}

【DSL 命令】
${dsl}

【格式示例】
${examples}`;
  };

  interface AttributeRuleAttributeConfig {
    name: string;
    formula: string;
    range: [number, number];
    modifier?: string;
  }

  interface AttributeRulePresetConfig {
    id: string;
    name: string;
    baseAttributes?: AttributeRuleAttributeConfig[];
    specialAttributes?: AttributeRuleAttributeConfig[];
  }

  interface GeneratedAttributeRules {
    base?: Record<string, number>;
    special?: Record<string, number>;
  }

  type RuleTemplateSourceData = { note?: unknown };
  type RuleTemplateSheet = { name?: unknown; sourceData?: RuleTemplateSourceData };
  type RuleTemplateRecord = Record<string, unknown>;

  const getAttributeRulePresetById = (presetId: string | null | undefined): AttributeRulePresetConfig => {
    if (presetId === null || presetId === undefined || presetId === '__default__') {
      return DEFAULT_VIRTUAL_PRESET;
    }
    const found = (AttributePresetManager.getAllPresets() as AttributeRulePresetConfig[]).find(
      preset => preset.id === presetId,
    );
    return found || DEFAULT_VIRTUAL_PRESET;
  };

  const getAttributeRangeBounds = (
    attributes: AttributeRuleAttributeConfig[] | undefined,
    fallback: [number, number],
  ): [number, number] => {
    if (!attributes || attributes.length === 0) return fallback;
    const ranges = attributes.map(attr => attr.range);
    return [Math.min(...ranges.map(range => range[0])), Math.max(...ranges.map(range => range[1]))];
  };

  const buildAttributeRulesContent = (
    presetId: string | null | undefined,
  ): {
    preset: AttributeRulePresetConfig;
    content: string;
    debug: Record<string, string | number>;
  } => {
    const preset = getAttributeRulePresetById(presetId);
    const attrs = generateRPGAttributes(preset.id === '__default__' ? null : preset) as GeneratedAttributeRules;
    const baseEntries = Object.entries(attrs.base || {});
    const specialEntries = Object.entries(attrs.special || {});
    const [baseRangeMin, baseRangeMax] = getAttributeRangeBounds(preset.baseAttributes, [0, 100]);
    const [specialRangeMin, specialRangeMax] = getAttributeRangeBounds(preset.specialAttributes, [0, 100]);
    const attributeScaleStr = generateAttributeScale(baseRangeMin, baseRangeMax);
    const baseRangeStr = `[${baseRangeMin},${baseRangeMax}]`;
    const specialRangeStr =
      specialEntries.length > 0
        ? `[${specialRangeMin},${specialRangeMax}]`
        : `[${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[0]},${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[1]}]`;
    const baseExampleStr =
      baseEntries.length > 0
        ? baseEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : '力量:35; 敏捷:50; 体质:52; 智力:35; 感知:40; 魅力:64';
    const specialExampleStr =
      specialEntries.length > 0
        ? specialEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : DEFAULT_SPECIAL_ATTR_TEMPLATE.example;

    return {
      preset,
      content: `基础属性: "{基础属性}:{数值}"，数值范围${baseRangeStr}
示例: "${baseExampleStr}"

特有属性: 角色的特殊能力与技能，体现世界观特色与个体差异。
格式: "{特有属性}:{数值}"，数值范围${specialRangeStr}
示例: "${specialExampleStr}"

【属性标尺】
${attributeScaleStr}`,
      debug: {
        baseRangeStr,
        specialRangeStr,
        baseExampleStr,
        specialExampleStr,
        attributeScaleStr,
      },
    };
  };

  const isRuleTemplateSheetWithNote = (value: unknown): value is RuleTemplateSheet => {
    if (!value || typeof value !== 'object') return false;
    const record = value as Record<string, unknown>;
    const sourceData = record.sourceData;
    if (!sourceData || typeof sourceData !== 'object') return false;
    return typeof (sourceData as Record<string, unknown>).note === 'string';
  };

  const getRuleTagSnippet = (note: string, tag: string): string => {
    const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matched = note.match(new RegExp(`<${safeTag}>[\\s\\S]*?</${safeTag}>`));
    return (matched?.[0] || '').slice(0, 500);
  };

  const replaceRuleTagInTemplate = (
    template: RuleTemplateRecord,
    tag: string,
    content: string,
    debugPrefix: string,
  ): boolean => {
    let modified = false;
    const ruleSheets = Object.entries(template).filter((entry): entry is [string, RuleTemplateSheet] => {
      const [, sheet] = entry;
      if (!isRuleTemplateSheetWithNote(sheet)) return false;
      return sheet.sourceData?.note?.includes(`<${tag}>`) === true;
    });
    console.info(`${debugPrefix} ${tag} 可同步表扫描`, {
      totalSheets: Object.keys(template).length,
      matchedCount: ruleSheets.length,
      matchedSheets: ruleSheets.map(([sheetKey, sheet]) => ({
        sheetKey,
        sheetName: String(sheet.name || ''),
      })),
    });

    ruleSheets.forEach(([sheetKey, sheet]) => {
      const sourceData = sheet.sourceData;
      if (!sourceData || typeof sourceData.note !== 'string') return;
      const originalNote = sourceData.note;
      const nextNote = replaceTag(originalNote, tag, content);
      const changed = nextNote !== originalNote;
      console.info(`${debugPrefix} ${tag} note 替换结果`, {
        sheetKey,
        sheetName: String(sheet.name || ''),
        changed,
        beforeSnippet: getRuleTagSnippet(originalNote, tag),
        afterSnippet: getRuleTagSnippet(nextNote, tag),
      });
      if (changed) {
        sourceData.note = nextNote;
        modified = true;
      }
    });

    return modified;
  };

  const syncAttributeRuleTagsInTemplate = (
    template: RuleTemplateRecord,
    presetId: string | null | undefined,
    debugPrefix: string,
  ): boolean => {
    const built = buildAttributeRulesContent(presetId);
    console.info(`${debugPrefix} 已生成当前属性规则内容`, {
      requestedPresetId: presetId,
      resolvedPresetId: built.preset.id,
      presetName: built.preset.name,
      ...built.debug,
    });
    return replaceRuleTagInTemplate(template, '属性规则', built.content, debugPrefix);
  };

  const syncCheckRuleTagsInTemplate = (
    template: RuleTemplateRecord,
    presetId: string | null | undefined,
    debugPrefix: string,
  ): boolean => {
    const preset = getCheckSuggestionPresetById(presetId);
    if (!preset) {
      console.warn(`${debugPrefix} 找不到可用检定预设，跳过检定规则同步`);
      return false;
    }
    console.info(`${debugPrefix} 已生成当前检定规则内容`, {
      requestedPresetId: presetId,
      resolvedPresetId: preset.id,
      presetName: preset.name,
    });
    return replaceRuleTagInTemplate(template, '检定规则', buildCheckSuggestionGuide(preset), debugPrefix);
  };

  const updateTemplateForActiveCheckPreset = (presetId: string | null): void => {
    const debugPrefix = '[DICE][检定规则同步]';
    const preset = getCheckSuggestionPresetById(presetId);
    console.info(`${debugPrefix} updateTemplateForActiveCheckPreset 被调用`, {
      requestedPresetId: presetId,
      resolvedPresetId: preset?.id || null,
      presetName: preset?.name || '',
    });
    if (!preset) {
      console.warn(`${debugPrefix} 找不到可用检定预设，跳过同步`);
      return;
    }

    type TemplateSourceDataDebug = { note?: unknown };
    type TemplateSheetDebug = { name?: unknown; sourceData?: TemplateSourceDataDebug };
    type TemplateRecordDebug = Record<string, unknown>;
    type TemplateImportResultDebug = {
      success?: boolean;
      message?: string;
      scope?: string;
      presetName?: string;
    };

    const dbApi = getCore().getDB();
    console.info(`${debugPrefix} 数据库 API 状态`, {
      hasDbApi: !!dbApi,
      getTableTemplateType: typeof dbApi?.getTableTemplate,
      importTemplateFromDataType: typeof dbApi?.importTemplateFromData,
    });
    if (!dbApi || typeof dbApi.getTableTemplate !== 'function') {
      console.warn(`${debugPrefix} 数据库 API 不可用，跳过更新`);
      return;
    }

    const rawTemplate = dbApi.getTableTemplate();
    const template = rawTemplate && typeof rawTemplate === 'object' ? (rawTemplate as TemplateRecordDebug) : null;
    if (!template) {
      console.warn(`${debugPrefix} 无法获取可修改的表格模板对象，跳过更新`, {
        rawType: typeof rawTemplate,
      });
      return;
    }

    const guideContent = buildCheckSuggestionGuide(preset);
    let modified = false;
    const isTemplateSheetWithNote = (value: unknown): value is TemplateSheetDebug => {
      if (!value || typeof value !== 'object') return false;
      const record = value as Record<string, unknown>;
      const sourceData = record.sourceData;
      if (!sourceData || typeof sourceData !== 'object') return false;
      return typeof (sourceData as Record<string, unknown>).note === 'string';
    };
    const getCheckRuleSnippet = (note: string): string => {
      const matched = note.match(/<检定规则>[\s\S]*?<\/检定规则>/);
      return (matched?.[0] || '').slice(0, 500);
    };

    const checkRuleSheets = Object.entries(template).filter((entry): entry is [string, TemplateSheetDebug] => {
      const [, sheet] = entry;
      if (!isTemplateSheetWithNote(sheet)) return false;
      return sheet.sourceData?.note?.includes('<检定规则>') === true;
    });
    console.info(`${debugPrefix} 可同步表扫描`, {
      totalSheets: Object.keys(template).length,
      matchedCount: checkRuleSheets.length,
      matchedSheets: checkRuleSheets.map(([sheetKey, sheet]) => ({
        sheetKey,
        sheetName: String(sheet.name || ''),
      })),
    });
    if (checkRuleSheets.length === 0) {
      console.warn(`${debugPrefix} 没有找到包含 <检定规则> 标签的表，跳过 note 同步`);
      return;
    }

    checkRuleSheets.forEach(([sheetKey, sheet]) => {
      const sourceData = sheet.sourceData;
      if (!sourceData || typeof sourceData.note !== 'string') return;
      const originalNote = sourceData.note;
      const nextNote = replaceTag(originalNote, '检定规则', guideContent);
      const changed = nextNote !== originalNote;
      console.info(`${debugPrefix} note 替换结果`, {
        sheetKey,
        sheetName: String(sheet.name || ''),
        changed,
        beforeSnippet: getCheckRuleSnippet(originalNote),
        afterSnippet: getCheckRuleSnippet(nextNote),
      });
      if (changed) {
        sourceData.note = nextNote;
        modified = true;
      }
    });

    const activeAttributePresetId = Store.get(STORAGE_KEY_ACTIVE_ATTR_PRESET, null) as string | null;
    const attributeRuleModified = syncAttributeRuleTagsInTemplate(template, activeAttributePresetId, debugPrefix);
    modified = modified || attributeRuleModified;

    console.info(`${debugPrefix} 模板修改汇总`, { modified, presetId: preset.id });
    if (modified && typeof dbApi.importTemplateFromData === 'function') {
      console.info(`${debugPrefix} 准备保存模板`, { presetId: preset.id, scope: 'chat' });
      dbApi
        .importTemplateFromData(template, { scope: 'chat' })
        .then((result: TemplateImportResultDebug) => {
          console.info(`${debugPrefix} importTemplateFromData 返回`, {
            presetId: preset.id,
            result,
          });
          if (result.success) {
            console.log('[DICE] updateTemplateForActiveCheckPreset 已更新表格模板，预设:', preset.id);
          } else {
            console.error('[DICE] updateTemplateForActiveCheckPreset 保存模板失败:', result.message);
          }
        })
        .catch((err: Error) => {
          console.error(`${debugPrefix} importTemplateFromData 异常`, err);
        });
    } else if (!modified) {
      console.info(`${debugPrefix} 未保存：没有检测到 note 变化`, { presetId: preset.id });
    } else {
      console.warn(`${debugPrefix} importTemplateFromData 不可用，跳过保存`);
    }
  };

  /**
   * 根据激活的属性预设更新表格模板中的示例和范围
   * @param presetId 预设ID，null 表示使用默认逻辑
   */
  const updateTemplateForActivePreset = (presetId: string | null): void => {
    const debugPrefix = '[DICE][属性规则同步]';
    console.info(`${debugPrefix} updateTemplateForActivePreset 被调用`, { presetId });

    // 1. 获取预设对象（默认规则使用虚拟预设，确保统一处理路径）
    type AttributePreset = (typeof BUILTIN_ATTRIBUTE_PRESETS)[number];
    type TemplateSourceDataDebug = { note?: unknown };
    type TemplateSheetDebug = { name?: unknown; sourceData?: TemplateSourceDataDebug };
    type TemplateRecordDebug = Record<string, unknown>;
    type TemplateImportResultDebug = {
      success?: boolean;
      message?: string;
      scope?: string;
      presetName?: string;
    };
    let preset: AttributePreset;
    if (presetId === null || presetId === '__default__') {
      // 使用虚拟默认预设
      preset = DEFAULT_VIRTUAL_PRESET as AttributePreset;
    } else {
      const found = AttributePresetManager.getAllPresets().find((p: AttributePreset) => p.id === presetId);
      preset = found || (DEFAULT_VIRTUAL_PRESET as AttributePreset);
    }
    console.info(`${debugPrefix} 属性预设解析完成`, {
      requestedPresetId: presetId,
      resolvedPresetId: preset.id,
      presetName: preset.name,
      baseAttributeCount: preset.baseAttributes?.length || 0,
      specialAttributeCount: preset.specialAttributes?.length || 0,
    });

    // 2. 生成随机属性值
    // 注意：对于默认规则，传入 null 以使用 generateRPGAttributes 的内置默认逻辑
    const attrs = generateRPGAttributes(presetId === null || presetId === '__default__' ? null : preset);
    // attrs = { base: {...}, special: {...} }

    // 3. 计算数值范围（统一从 preset 对象读取）
    let baseRangeMin = 0;
    let baseRangeMax = 100;
    let specialRangeMin = 0;
    let specialRangeMax = 100;

    // 基础属性范围：取所有 baseAttributes.range 的 min/max
    if (preset.baseAttributes && preset.baseAttributes.length > 0) {
      const baseRanges = preset.baseAttributes.map(attr => attr.range);
      baseRangeMin = Math.min(...baseRanges.map(r => r[0]));
      baseRangeMax = Math.max(...baseRanges.map(r => r[1]));
    }
    // 特有属性范围：取所有 specialAttributes.range 的 min/max
    if (preset.specialAttributes && preset.specialAttributes.length > 0) {
      const specialRanges = preset.specialAttributes.map(attr => attr.range);
      specialRangeMin = Math.min(...specialRanges.map(r => r[0]));
      specialRangeMax = Math.max(...specialRanges.map(r => r[1]));
    }

    // 4. 获取生成的属性数据
    const baseEntries = Object.entries(attrs.base as Record<string, number>);
    const specialEntries = Object.entries(attrs.special as Record<string, number>);

    // 5. 获取数据库 API 并读取模板
    const dbApi = getCore().getDB();
    console.info(`${debugPrefix} 数据库 API 状态`, {
      hasDbApi: !!dbApi,
      getTableTemplateType: typeof dbApi?.getTableTemplate,
      importTemplateFromDataType: typeof dbApi?.importTemplateFromData,
    });
    if (!dbApi || typeof dbApi.getTableTemplate !== 'function') {
      console.warn(`${debugPrefix} 数据库 API 不可用，跳过更新`);
      return;
    }

    const rawTemplate = dbApi.getTableTemplate();
    const templateRecord = rawTemplate && typeof rawTemplate === 'object' ? (rawTemplate as TemplateRecordDebug) : null;
    const templateKeys = templateRecord ? Object.keys(templateRecord) : [];
    console.info(`${debugPrefix} getTableTemplate 返回`, {
      rawType: typeof rawTemplate,
      isArray: Array.isArray(rawTemplate),
      keyCount: templateKeys.length,
      firstKeys: templateKeys.slice(0, 12),
      stringPreview: typeof rawTemplate === 'string' ? rawTemplate.slice(0, 180) : '',
    });
    const template = templateRecord;
    if (!template) {
      console.warn(`${debugPrefix} 无法获取可修改的表格模板对象，跳过更新`, {
        rawType: typeof rawTemplate,
      });
      return;
    }

    // 6. 生成属性标尺（基于基础属性范围，不含重复的基准说明）
    const attributeScaleStr = generateAttributeScale(baseRangeMin, baseRangeMax);

    // 7. 构建完整的 <属性规则> 内容块
    const baseRangeStr = `[${baseRangeMin},${baseRangeMax}]`;
    const specialRangeStr =
      specialEntries.length > 0
        ? `[${specialRangeMin},${specialRangeMax}]`
        : `[${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[0]},${DEFAULT_SPECIAL_ATTR_TEMPLATE.range[1]}]`;

    // 基础属性示例（分号分隔格式）
    const baseExampleStr =
      baseEntries.length > 0
        ? baseEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : '力量:35; 敏捷:50; 体质:52; 智力:35; 感知:40; 魅力:64';

    // 特有属性示例（分号分隔格式）
    const specialExampleStr =
      specialEntries.length > 0
        ? specialEntries.map(([name, value]) => `${name}:${value}`).join('; ')
        : DEFAULT_SPECIAL_ATTR_TEMPLATE.example;

    // 构建完整的属性规则内容
    const attributeRulesContent = `基础属性: "{基础属性}:{数值}"，数值范围${baseRangeStr}
示例: "${baseExampleStr}"

特有属性: 角色的特殊能力与技能，体现世界观特色与个体差异。
格式: "{特有属性}:{数值}"，数值范围${specialRangeStr}
示例: "${specialExampleStr}"

【属性标尺】
${attributeScaleStr}`;
    console.info(`${debugPrefix} 已生成新的属性规则内容`, {
      baseRangeStr,
      specialRangeStr,
      baseExampleStr,
      specialExampleStr,
      attributeScaleStr,
    });

    let modified = false;
    const isTemplateSheetWithNote = (value: unknown): value is TemplateSheetDebug => {
      if (!value || typeof value !== 'object') return false;
      const record = value as Record<string, unknown>;
      const sourceData = record.sourceData;
      if (!sourceData || typeof sourceData !== 'object') return false;
      return typeof (sourceData as Record<string, unknown>).note === 'string';
    };
    const getAttributeRuleSnippet = (note: string): string => {
      const matched = note.match(/<属性规则>[\s\S]*?<\/属性规则>/);
      return (matched?.[0] || '').slice(0, 500);
    };
    const describeTemplateSheet = (sheetKey: string, sheet: TemplateSheetDebug | undefined): void => {
      const note = sheet?.sourceData?.note;
      console.info(`${debugPrefix} 目标表检查`, {
        sheetKey,
        hasSheet: !!sheet,
        sheetName: String(sheet?.name || ''),
        hasSourceData: !!sheet?.sourceData,
        noteType: typeof note,
        noteLength: typeof note === 'string' ? note.length : 0,
        hasAttributeRuleTag: typeof note === 'string' ? note.includes('<属性规则>') : false,
        currentAttributeRuleSnippet: typeof note === 'string' ? getAttributeRuleSnippet(note) : '',
      });
    };
    const replaceAttributeRuleInSheet = (sheetKey: string, sheet: TemplateSheetDebug | undefined): void => {
      const sourceData = sheet?.sourceData;
      if (!sourceData || typeof sourceData.note !== 'string') {
        console.warn(`${debugPrefix} 跳过 ${sheetKey}: note 不存在或不是字符串`, {
          hasSheet: !!sheet,
          noteType: typeof sourceData?.note,
        });
        return;
      }

      const originalNote = sourceData.note;
      const nextNote = replaceTag(originalNote, '属性规则', attributeRulesContent);
      const changed = nextNote !== originalNote;
      console.info(`${debugPrefix} note 替换结果`, {
        sheetKey,
        changed,
        beforeSnippet: getAttributeRuleSnippet(originalNote),
        afterSnippet: getAttributeRuleSnippet(nextNote),
      });

      if (changed) {
        sourceData.note = nextNote;
        modified = true;
      }
    };

    // 7.5 扫描所有带 <属性规则> 标签的表；用户自定义角色表只要加入标签，也会自动同步。
    const attributeRuleSheets = Object.entries(template).filter((entry): entry is [string, TemplateSheetDebug] => {
      const [, sheet] = entry;
      if (!isTemplateSheetWithNote(sheet)) return false;
      return sheet.sourceData?.note?.includes('<属性规则>') === true;
    });
    console.info(`${debugPrefix} 可同步表扫描`, {
      totalSheets: templateKeys.length,
      matchedCount: attributeRuleSheets.length,
      matchedSheets: attributeRuleSheets.map(([sheetKey, sheet]) => ({
        sheetKey,
        sheetName: String(sheet.name || ''),
      })),
    });
    if (attributeRuleSheets.length === 0) {
      console.warn(`${debugPrefix} 没有找到包含 <属性规则> 标签的表，跳过 note 同步`);
    }

    // 8. 替换所有带 <属性规则> 标签的 note。
    attributeRuleSheets.forEach(([sheetKey, sheet]) => {
      describeTemplateSheet(sheetKey, sheet);
      replaceAttributeRuleInSheet(sheetKey, sheet);
    });

    const activeCheckPresetId = Store.get(STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null) as string | null;
    const checkRuleModified = syncCheckRuleTagsInTemplate(template, activeCheckPresetId, debugPrefix);
    modified = modified || checkRuleModified;
    console.info(`${debugPrefix} 模板修改汇总`, { modified, presetId });

    // 9. 使用数据库 API 保存模板
    if (modified && typeof dbApi.importTemplateFromData === 'function') {
      console.info(`${debugPrefix} 准备保存模板`, { presetId, scope: 'chat' });
      dbApi
        .importTemplateFromData(template, { scope: 'chat' })
        .then((result: TemplateImportResultDebug) => {
          console.info(`${debugPrefix} importTemplateFromData 返回`, {
            presetId,
            result,
          });
          if (result.success) {
            console.log('[DICE] updateTemplateForActivePreset 已更新表格模板，预设:', presetId);
          } else {
            console.error('[DICE] updateTemplateForActivePreset 保存模板失败:', result.message);
          }
        })
        .catch((err: Error) => {
          console.error(`${debugPrefix} importTemplateFromData 异常`, err);
        });
    } else if (!modified) {
      console.log('[DICE] updateTemplateForActivePreset 无需更新（模板内容未变化），预设:', presetId);
      console.info(`${debugPrefix} 未保存：没有检测到 note 变化`, { presetId });
    } else {
      console.warn(`${debugPrefix} importTemplateFromData 不可用，跳过保存`);
    }
  };
export {
  generateAttributeScale,
  DEFAULT_SPECIAL_ATTR_TEMPLATE,
  DEFAULT_VIRTUAL_PRESET,
  replaceTag,
  getCheckSuggestionPresetById,
  buildAutoCheckSuggestionGuide,
  buildCheckSuggestionGuide,
  getAttributeRulePresetById,
  getAttributeRangeBounds,
  buildAttributeRulesContent,
  isRuleTemplateSheetWithNote,
  getRuleTagSnippet,
  replaceRuleTagInTemplate,
  syncAttributeRuleTagsInTemplate,
  syncCheckRuleTagsInTemplate,
  updateTemplateForActiveCheckPreset,
  updateTemplateForActivePreset,
};
export type {
  AttributeRuleAttributeConfig,
  AttributeRulePresetConfig,
  GeneratedAttributeRules,
  RuleTemplateSourceData,
  RuleTemplateSheet,
  RuleTemplateRecord,
};
