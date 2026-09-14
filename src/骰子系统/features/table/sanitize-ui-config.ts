// @ts-nocheck
/**
 * sanitize-ui-config.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSanitizeUiConfig(deps: any) {
  const sanitizeUiConfig = config => {
    const nextConfig = { ...config };
    delete nextConfig[deps.getLEGACY_DB_THEME_SYNC_CONFIG_KEY()];
    nextConfig.dialogueIndentEnabled = nextConfig.dialogueIndentEnabled === true;
    nextConfig.collapseStyle = deps.normalizeCollapseStyle(nextConfig.collapseStyle);
    return nextConfig;
  };
  return sanitizeUiConfig;
}
