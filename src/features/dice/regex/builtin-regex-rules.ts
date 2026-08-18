// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=8「内置表格正则规则 (Phase 2.2)」
// 原行范围：3091-3148（含 banner 3088-3148）；拆分批次 3；外部 closure 依赖：0
// 接线说明：RegexTransformationRule 类型来自同批次拆出的 regex-types.ts，import type 引入（esbuild 剥离，无运行时依赖）。

import type { RegexTransformationRule } from './regex-types';
  // ========================================
  // 内置表格正则规则 (Phase 2.2)
  // ========================================
  const BUILTIN_REGEX_RULES: RegexTransformationRule[] = [
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
  const DEPRECATED_BUILTIN_REGEX_RULE_IDS = new Set(['builtin_replace_user']);
  const isDeprecatedBuiltinRegexRule = (rule: { id?: string; builtin?: boolean } | null | undefined): boolean =>
    Boolean(rule?.builtin === true && rule.id && DEPRECATED_BUILTIN_REGEX_RULE_IDS.has(rule.id));
  const filterDeprecatedBuiltinRegexRules = <T extends { id?: string; builtin?: boolean }>(
    rules: readonly T[] | null | undefined,
  ): T[] => {
    if (!Array.isArray(rules)) return [];
    return rules.filter(rule => !isDeprecatedBuiltinRegexRule(rule));
  };
export {
  BUILTIN_REGEX_RULES,
  DEPRECATED_BUILTIN_REGEX_RULE_IDS,
  isDeprecatedBuiltinRegexRule,
  filterDeprecatedBuiltinRegexRules,
};
