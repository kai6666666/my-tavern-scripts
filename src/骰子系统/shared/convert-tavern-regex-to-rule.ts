// @ts-nocheck
/**
 * convert-tavern-regex-to-rule.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { parseTavernFindRegex } from './misc-utils';
export function createConvertTavernRegexToRule(deps: any) {
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
  return convertTavernRegexToRule;
}
