// @ts-nocheck
/**
 * unwrap-advanced-preset-document.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createUnwrapAdvancedPresetDocument(deps: any) {
  const unwrapAdvancedPresetDocument = (
    parsed: unknown,
  ): {
    presetData: Record<string, unknown>;
    tests: AdvancedPresetAgentTestCase[];
    notes: string[];
    sourceFormat: string;
  } => {
    if (!deps.isAdvancedPresetRecord(parsed)) {
      throw new Error('预设 JSON 必须是对象');
    }

    const format = typeof parsed.format === 'string' ? parsed.format : '';
    if (format === deps.getADVANCED_PRESET_AGENT_FORMAT()) {
      const document = parsed as unknown as AdvancedPresetAgentDocument;
      if (!deps.isAdvancedPresetRecord(document.preset)) {
        throw new Error('AI 预设文档缺少 preset 对象');
      }
      return {
        presetData: document.preset,
        tests: deps.normalizeAdvancedPresetAgentTests(document.tests),
        notes: deps.normalizeAdvancedPresetNotes(document.notes),
        sourceFormat: deps.getADVANCED_PRESET_AGENT_FORMAT(),
      };
    }

    if (format && format !== deps.getADVANCED_PRESET_EXPORT_FORMAT() && parsed.kind !== 'advanced') {
      throw new Error(`不支持的预设格式: ${format}`);
    }

    return {
      presetData: parsed,
      tests: deps.normalizeAdvancedPresetAgentTests(parsed.tests),
      notes: deps.normalizeAdvancedPresetNotes(parsed.notes),
      sourceFormat: format || 'legacy_advanced_preset',
    };
  };
  return unwrapAdvancedPresetDocument;
}
