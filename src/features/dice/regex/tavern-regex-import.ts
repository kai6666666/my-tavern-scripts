// @ts-nocheck
// 来源：src/features/dice/index.ts 章节 idx=7「酒馆原生正则格式兼容 (Tavern Regex Import)」
// 原行范围：3014-3086（含 banner 3006-3086）；拆分批次 3；外部 closure 依赖：0
// 接线说明：RegexFlags / RegexTransformationRule 类型来自同批次拆出的 regex-types.ts，import type 引入（esbuild 剥离，无运行时依赖）。

import type { RegexFlags, RegexTransformationRule } from './regex-types';
  // ========================================
  // 酒馆原生正则格式兼容 (Tavern Regex Import)
  // ========================================

  /**
   * 酒馆原生正则格式
   * @see https://docs.sillytavern.app/usage/core-concepts/regex/
   */
  interface TavernRegex {
    id?: string;
    scriptName: string;
    findRegex: string;
    replaceString: string;
    trimStrings?: string[];
    placement?: number[];
    disabled?: boolean;
    markdownOnly?: boolean;
    promptOnly?: boolean;
    runOnEdit?: boolean;
    substituteRegex?: number;
    minDepth?: number | null;
    maxDepth?: number | null;
  }

  /**
   * 解析酒馆正则的 findRegex 字段
   * 格式: /pattern/flags
   */
  function parseTavernFindRegex(findRegex: string): { pattern: string; flags: RegexFlags } {
    // 匹配 /pattern/flags 格式，使用惰性匹配和末尾锚定
    const match = findRegex.match(/^\/(.+)\/([gimsuy]*)$/s);
    if (match) {
      const [, pattern, flagStr] = match;
      return {
        pattern,
        flags: {
          global: flagStr.includes('g'),
          caseInsensitive: flagStr.includes('i'),
          multiline: flagStr.includes('m'),
          unicode: flagStr.includes('u'),
          sticky: flagStr.includes('y'),
        },
      };
    }
    // 非标准格式，直接作为pattern，默认全局匹配
    return { pattern: findRegex, flags: { global: true } };
  }

  /**
   * 将酒馆正则格式转换为本系统的 RegexTransformationRule
   */
  function convertTavernRegexToRule(tavernRegex: TavernRegex): RegexTransformationRule {
    const { pattern, flags } = parseTavernFindRegex(tavernRegex.findRegex);

    // 构建额外信息描述，保留酒馆正则的原始配置供参考
    const extraInfo: string[] = [];
    if (tavernRegex.placement?.length) extraInfo.push(`placement: [${tavernRegex.placement.join(',')}]`);
    if (tavernRegex.markdownOnly) extraInfo.push('markdownOnly');
    if (tavernRegex.promptOnly) extraInfo.push('promptOnly');
    if (tavernRegex.minDepth != null) extraInfo.push(`minDepth: ${tavernRegex.minDepth}`);
    if (tavernRegex.maxDepth != null) extraInfo.push(`maxDepth: ${tavernRegex.maxDepth}`);

    const description = extraInfo.length > 0 ? `[从酒馆正则导入] ${extraInfo.join(', ')}` : '[从酒馆正则导入]';

    return {
      id: `tavern_import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: tavernRegex.scriptName,
      description,
      operation: 'replace',
      pattern,
      flags,
      replacement: tavernRegex.replaceString || '',
      scope: { type: 'global' },
      enabled: !tavernRegex.disabled,
      priority: 50,
      executeMode: tavernRegex.runOnEdit ? 'auto' : 'manual',
      security: { maxMatchTime: 100, maxMatches: 1000, maxInputLength: 10000 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
export { parseTavernFindRegex, convertTavernRegexToRule };
export type { TavernRegex };
