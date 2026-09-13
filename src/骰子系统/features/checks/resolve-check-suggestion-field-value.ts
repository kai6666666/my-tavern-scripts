// @ts-nocheck
/**
 * resolve-check-suggestion-field-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { CustomFieldConfig } from '../../shared/types';
export function createResolveCheckSuggestionFieldValue(deps: any) {
  const resolveCheckSuggestionFieldValue = (
    field: CustomFieldConfig,
    params: CheckSuggestionParams,
    characterName: string,
  ): string | number | boolean => {
    const rawValue = params[field.id];
    if (rawValue === undefined || rawValue === '') return field.defaultValue;
    if (field.type === 'number') {
      return deps.resolveCheckSuggestionNumberParam(rawValue, characterName, Number(field.defaultValue) || 0);
    }
    if (field.type === 'toggle') {
      if (typeof rawValue === 'boolean') return rawValue;
      return /^(true|是|启用|开启|1)$/i.test(String(rawValue));
    }
    if (field.type === 'select') {
      if (typeof rawValue === 'number' || typeof rawValue === 'boolean') return rawValue;
      const parsed = deps.parseCheckSuggestionPrimitiveValue(String(rawValue));
      return parsed;
    }
    return rawValue;
  };
  return resolveCheckSuggestionFieldValue;
}
