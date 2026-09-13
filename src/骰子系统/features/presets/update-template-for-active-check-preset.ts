// @ts-nocheck
/**
 * update-template-for-active-check-preset.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { Store } from '../../shared/storage/store';
export function createUpdateTemplateForActiveCheckPreset(deps: any) {
  const updateTemplateForActiveCheckPreset = (presetId: string | null): void => {
    const debugPrefix = '[DICE][检定规则同步]';
    const preset = deps.getCheckSuggestionPresetById(presetId);
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
    const template = rawTemplate && typeof rawTemplate === 'object' ? (rawTemplate as TemplateRecordDebug) : null;
    if (!template) {
      console.warn(`${debugPrefix} 无法获取可修改的表格模板对象，跳过更新`, {
        rawType: typeof rawTemplate,
      });
      return;
    }

    const guideContent = deps.buildCheckSuggestionGuide(preset);
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
      const nextNote = deps.replaceTag(originalNote, '检定规则', guideContent);
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

    const activeAttributePresetId = Store.get(deps.STORAGE_KEY_ACTIVE_ATTR_PRESET, null) as string | null;
    const attributeRuleModified = deps.syncAttributeRuleTagsInTemplate(template, activeAttributePresetId, debugPrefix);
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
  return updateTemplateForActiveCheckPreset;
}
