// @ts-nocheck
/**
 * normalize-gacha-custom-fields.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import type { GachaCustomFields } from '../../entities/gacha-items';
export function createNormalizeGachaCustomFields(deps: any) {
  const normalizeGachaCustomFields = (raw: unknown): GachaCustomFields | undefined => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
    const customFields: GachaCustomFields = {};
    for (const [rawKey, rawValue] of Object.entries(raw as Record<string, unknown>)) {
      if (Object.keys(customFields).length >= deps.getGACHA_CUSTOM_FIELD_MAX_COUNT()) break;
      if (typeof rawValue !== 'string') continue;
      const key = deps.truncateGachaText(rawKey.trim(), deps.getGACHA_CUSTOM_FIELD_KEY_MAX_LENGTH());
      if (!key || deps.getGACHA_CUSTOM_FIELD_RESERVED_KEYS().has(key)) continue;
      const value = deps.truncateGachaText(rawValue.trim(), deps.getGACHA_CUSTOM_FIELD_VALUE_MAX_LENGTH());
      if (!value) continue;
      customFields[key] = value;
    }
    return Object.keys(customFields).length ? customFields : undefined;
  };
  return normalizeGachaCustomFields;
}
