// @ts-nocheck
/**
 * build-gacha-catalog-agent-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { gachaCatalogAgentPromptTemplate } from '../../docs/gacha-catalog-agent-prompt.md?raw';
export function createBuildGachaCatalogAgentPrompt(deps: any) {
  const buildGachaCatalogAgentPrompt = (): string => gachaCatalogAgentPromptTemplate;
  return buildGachaCatalogAgentPrompt;
}
