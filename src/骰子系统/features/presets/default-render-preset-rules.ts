// @ts-nocheck
/**
 * default-render-preset-rules.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createDefaultRenderPresetRules(deps: any) {
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
      excludeKeywords: [...deps.DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS],
    },
    dialogueIndent: {
      whitelist: ['*'],
      blacklist: [...deps.DEFAULT_DIALOGUE_INDENT_TAG_BLACKLIST],
    },
  };
  return DEFAULT_RENDER_PRESET_RULES;
}
