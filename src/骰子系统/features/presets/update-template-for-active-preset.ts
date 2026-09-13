// @ts-nocheck
/**
 * update-template-for-active-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { DEFAULT_SPECIAL_ATTR_TEMPLATE, DEFAULT_VIRTUAL_PRESET } from '../../shared/defaults-config';
import { Store } from '../../shared/storage/store';
export function createUpdateTemplateForActivePreset(deps: any) {
  const updateTemplateForActivePreset = (presetId: string | null): void => {
    const debugPrefix = '[DICE][属性规则同步]';
    console.info(`${debugPrefix} updateTemplateForActivePreset 被调用`, { presetId });

    // 1. 获取预设对象（默认规则使用虚拟预设，确保统一处理路径）
    type AttributePreset = (typeof deps.BUILTIN_ATTRIBUTE_PRESETS)[number];
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
      const found = deps.AttributePresetManager.getAllPresets().find((p: AttributePreset) => p.id === presetId);
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
    const attrs = deps.generateRPGAttributes(presetId === null || presetId === '__default__' ? null : preset);
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
    const dbApi = deps.getCore().getDB();
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
    const attributeScaleStr = deps.generateAttributeScale(baseRangeMin, baseRangeMax);

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
      const nextNote = deps.replaceTag(originalNote, '属性规则', attributeRulesContent);
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

    const activeCheckPresetId = Store.get(deps.STORAGE_KEY_ACTIVE_ADVANCED_PRESET, null) as string | null;
    const checkRuleModified = deps.syncCheckRuleTagsInTemplate(template, activeCheckPresetId, debugPrefix);
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
  return updateTemplateForActivePreset;
}
