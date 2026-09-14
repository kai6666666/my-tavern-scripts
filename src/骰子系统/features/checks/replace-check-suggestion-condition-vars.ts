// @ts-nocheck
/**
 * replace-check-suggestion-condition-vars.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { RollResult } from '../../shared/types';
export function createReplaceCheckSuggestionConditionVars(deps: any) {
  const replaceCheckSuggestionConditionVars = (
    expression: string,
    context: Record<string, string | number | boolean | RollResult>,
    rollResult: RollResult,
  ): string => {
    let result = expression.replace(/\$roll\.hasTag\s*\(\s*['"]([^'"]+)['"]\s*\)/gi, (_match, tag) => {
      return (rollResult.tags ?? []).includes(tag) ? '成立' : '不成立';
    });
    result = result.replace(/\$roll\.total/g, String(rollResult.total)).replace(/\$roll/g, String(rollResult.total));
    const keys = Object.keys(context)
      .filter(key => key !== '$roll' && key !== '$roll.total')
      .sort((a, b) => b.length - a.length);
    keys.forEach(key => {
      const value = context[key];
      if (typeof value === 'object') return;
      const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp(safeKey, 'g'), String(value));
    });
    return result.replace(/\s*\+\s*0(?=\s*[+\->=<]|\s*$)/g, '').replace(/^\s*0\s*\+\s*/g, '');
  };
  return replaceCheckSuggestionConditionVars;
}
