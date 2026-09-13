// @ts-nocheck
/**
 * legacy-default-quick-check-exclude-keywords.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createLegacyDefaultQuickCheckExcludeKeywords(deps: any) {
  const LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS = deps.getDEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS().filter(
    keyword => keyword !== '概览',
  );
  return LEGACY_DEFAULT_QUICK_CHECK_EXCLUDE_KEYWORDS;
}
