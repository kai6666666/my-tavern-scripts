// @ts-nocheck
/**
 * parse-advanced-preset-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseAdvancedPresetText(deps: any) {
  const parseAdvancedPresetText = (
    sourceText: string,
    options: { idOverride?: string; nameOverride?: string; descriptionOverride?: string } = {},
  ): AdvancedPresetParseResult => {
    const parsed = deps.parseAdvancedPresetSourceText(sourceText);
    const document = deps.unwrapAdvancedPresetDocument(parsed);
    const normalized = deps.normalizeAdvancedPresetData(document.presetData, options);
    const warnings = deps.validateAdvancedPreset(normalized.preset, document.tests, {
      requireMetaWrapper: document.sourceFormat === deps.ADVANCED_PRESET_AGENT_FORMAT,
    });
    return {
      preset: normalized.preset,
      tests: document.tests,
      notes: document.notes,
      sourceFormat: document.sourceFormat,
      importedVersion: normalized.importedVersion,
      needsUpdate: normalized.needsUpdate,
      warnings,
    };
  };
  return parseAdvancedPresetText;
}
