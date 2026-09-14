// @ts-nocheck
/**
 * extract-check-suggestion-target.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExtractCheckSuggestionTarget(deps: any) {
  const extractCheckSuggestionTarget = (
    text: string,
  ): { rest: string; targetValue: number | null; criteria: CheckSuggestionCriteria } => {
    const match = text.match(/(<=|≤|>=|≥|<|>|=)\s*(\d{1,4})/);
    if (!match || match.index === undefined) return { rest: text, targetValue: null, criteria: 'lte' };
    const operator = match[1];
    const targetValue = parseInt(match[2], 10);
    const criteria: CheckSuggestionCriteria = operator === '>=' || operator === '≥' || operator === '>' ? 'gte' : 'lte';
    return {
      rest: `${text.slice(0, match.index)} ${text.slice(match.index + match[0].length)}`.replace(/\s+/g, ' ').trim(),
      targetValue: Number.isNaN(targetValue) ? null : targetValue,
      criteria,
    };
  };
  return extractCheckSuggestionTarget;
}
