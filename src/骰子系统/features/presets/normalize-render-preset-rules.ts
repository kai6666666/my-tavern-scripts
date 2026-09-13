// @ts-nocheck
/**
 * normalize-render-preset-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeRenderPresetRules(deps: any) {
  const normalizeRenderPresetRules = (rawRules: unknown): RenderPresetRules => {
    const raw = deps.isRecordValue(rawRules) ? rawRules : {};
    const columnDisplay = deps.isRecordValue(raw.columnDisplay) ? raw.columnDisplay : {};
    const relationship = deps.isRecordValue(raw.relationship) ? raw.relationship : {};
    const attributes = deps.isRecordValue(raw.attributes) ? raw.attributes : {};
    const shortTags = deps.isRecordValue(raw.shortTags) ? raw.shortTags : {};
    const badges = deps.isRecordValue(raw.badges) ? raw.badges : {};
    const quickCheck = deps.isRecordValue(raw.quickCheck) ? raw.quickCheck : {};
    const dialogueIndent = deps.isRecordValue(raw.dialogueIndent) ? raw.dialogueIndent : {};

    const shortTextMaxLength = Math.max(
      1,
      Math.min(
        24,
        Math.floor(Number(badges.shortTextMaxLength) || deps.DEFAULT_RENDER_PRESET_RULES.badges.shortTextMaxLength),
      ),
    );
    const shortTagMaxLength = Math.max(
      1,
      Math.min(24, Math.floor(Number(shortTags.maxLength) || deps.DEFAULT_RENDER_PRESET_RULES.shortTags.maxLength)),
    );

    return {
      columnDisplay: {
        stripBracketContent:
          typeof columnDisplay.stripBracketContent === 'boolean'
            ? columnDisplay.stripBracketContent
            : deps.DEFAULT_RENDER_PRESET_RULES.columnDisplay.stripBracketContent,
        aliases: deps.normalizeRenderPresetAliasMap(
          columnDisplay.aliases,
          deps.DEFAULT_RENDER_PRESET_RULES.columnDisplay.aliases,
        ),
      },
      invalidValues: deps.normalizeRenderPresetStringList(raw.invalidValues, deps.DEFAULT_RENDER_PRESET_RULES.invalidValues),
      identityHeaderKeywords: deps.normalizeRenderPresetStringList(
        raw.identityHeaderKeywords,
        deps.DEFAULT_RENDER_PRESET_RULES.identityHeaderKeywords,
      ),
      relationship: {
        enabled:
          typeof relationship.enabled === 'boolean'
            ? relationship.enabled
            : deps.DEFAULT_RENDER_PRESET_RULES.relationship.enabled,
        headerKeywords: deps.normalizeRenderPresetStringList(
          relationship.headerKeywords,
          deps.DEFAULT_RENDER_PRESET_RULES.relationship.headerKeywords,
        ),
        autoDetectMultipleParen:
          typeof relationship.autoDetectMultipleParen === 'boolean'
            ? relationship.autoDetectMultipleParen
            : deps.DEFAULT_RENDER_PRESET_RULES.relationship.autoDetectMultipleParen,
      },
      attributes: {
        enabled:
          typeof attributes.enabled === 'boolean' ? attributes.enabled : deps.DEFAULT_RENDER_PRESET_RULES.attributes.enabled,
        parseJsonObject:
          typeof attributes.parseJsonObject === 'boolean'
            ? attributes.parseJsonObject
            : deps.DEFAULT_RENDER_PRESET_RULES.attributes.parseJsonObject,
        parseKeyValuePairs:
          typeof attributes.parseKeyValuePairs === 'boolean'
            ? attributes.parseKeyValuePairs
            : deps.DEFAULT_RENDER_PRESET_RULES.attributes.parseKeyValuePairs,
      },
      shortTags: {
        enabled:
          typeof shortTags.enabled === 'boolean' ? shortTags.enabled : deps.DEFAULT_RENDER_PRESET_RULES.shortTags.enabled,
        maxLength: shortTagMaxLength,
      },
      badges: {
        enabled: typeof badges.enabled === 'boolean' ? badges.enabled : deps.DEFAULT_RENDER_PRESET_RULES.badges.enabled,
        shortTextMaxLength,
        numericPattern:
          typeof badges.numericPattern === 'boolean'
            ? badges.numericPattern
            : deps.DEFAULT_RENDER_PRESET_RULES.badges.numericPattern,
        statusValues: deps.normalizeRenderPresetStringList(
          badges.statusValues,
          deps.DEFAULT_RENDER_PRESET_RULES.badges.statusValues,
        ),
      },
      quickCheck: {
        enabled:
          typeof quickCheck.enabled === 'boolean' ? quickCheck.enabled : deps.DEFAULT_RENDER_PRESET_RULES.quickCheck.enabled,
        excludeKeywords: deps.normalizeRenderPresetStringList(
          quickCheck.excludeKeywords,
          deps.DEFAULT_RENDER_PRESET_RULES.quickCheck.excludeKeywords,
        ),
      },
      dialogueIndent: {
        whitelist: deps.normalizeRenderPresetTagFilterList(
          dialogueIndent.whitelist,
          deps.DEFAULT_RENDER_PRESET_RULES.dialogueIndent.whitelist,
        ),
        blacklist: deps.normalizeRenderPresetTagFilterList(
          dialogueIndent.blacklist,
          deps.DEFAULT_RENDER_PRESET_RULES.dialogueIndent.blacklist,
        ),
      },
    };
  };
  return normalizeRenderPresetRules;
}
