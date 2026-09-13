// @ts-nocheck
/**
 * build-gacha-catalog-agent-prompt-filename.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildGachaCatalogAgentPromptFilename(deps: any) {
  const buildGachaCatalogAgentPromptFilename = (poolName: string): string => {
    const safeName =
      poolName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'gacha_catalog';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_gacha_catalog_ai_prompt_${safeName}_${datePart}.md`;
  };
  return buildGachaCatalogAgentPromptFilename;
}
