// @ts-nocheck
/**
 * builtin-regex-rules.ts
 * Feature-Sliced 模块（数据常量）。
 */

export const BUILTIN_REGEX_RULES: RegexTransformationRule[] = [
    // 清除极端词
    {
      id: 'builtin_clear_extreme_words',
      name: '清除极端词',
      description: '清除AI常用的极端程度副词和形容词',
      operation: 'replace',
      pattern: '极度|激烈的|剧烈的|强烈|深刻|极其|极高的|完全|未知',
      flags: { global: false, caseInsensitive: false, multiline: false },
      replacement: '',
      scope: { type: 'global' },
      enabled: true,
      priority: 50,
      executeMode: 'auto',
      security: { maxMatchTime: 100, maxMatches: 1000, maxInputLength: 10000 },
    },
    // 去八股
    {
      id: 'builtin_remove_cliche',
      name: '去八股',
      description: '移除AI常见的八股文风格表达',
      operation: 'replace',
      pattern:
        '一(丝+)|(、?)不容置疑([的地]?)|(、?)(不易|难以)(觉察|察觉)([的地]?)|(微|几)不可(查|察|闻)([的地]?)|，([^，]*?)指(关节|节|尖)(.*?)白|，([^，]*?)(一抹|弧度)(.*?)([^，]*?)(?=[。，])|支配|掌控|崩溃',
      flags: { global: false, caseInsensitive: false, multiline: false },
      replacement: '',
      scope: { type: 'global' },
      enabled: true,
      priority: 50,
      executeMode: 'auto',
      security: { maxMatchTime: 100, maxMatches: 1000, maxInputLength: 10000 },
    },
    // 去除特殊属性中的负面情绪
    {
      id: 'builtin_remove_negative_traits',
      name: '去除特殊属性中的负面情绪',
      description: '删除主角信息表与重要人物表中过于陈腐的性格标签',
      operation: 'replace',
      pattern:
        '[^;：:\\s]*(绝望|崩溃|崩坏|恐惧|NTR|羞耻|快感|顺从|侵犯|服从|逻辑|决绝|臣服|屈服|敏感|洗脑)[^;：:\\s]*[:：]\\d+;?\\s?',
      flags: { global: false, caseInsensitive: false, multiline: false },
      replacement: '',
      scope: { type: 'table', tableNames: ['主角信息', '重要人物表', '重要角色表'] },
      enabled: true,
      priority: 50,
      executeMode: 'auto',
      security: { maxMatchTime: 100, maxMatches: 1000, maxInputLength: 10000 },
    },
  ];
