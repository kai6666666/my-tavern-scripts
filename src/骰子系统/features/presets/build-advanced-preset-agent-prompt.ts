// @ts-nocheck
/**
 * build-advanced-preset-agent-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { advancedPresetAgentPromptTemplate } from '../../docs/advanced-preset-agent-prompt.md?raw';
export function createBuildAdvancedPresetAgentPrompt(deps: any) {
  const buildAdvancedPresetAgentPrompt = (): string => advancedPresetAgentPromptTemplate;
  return buildAdvancedPresetAgentPrompt;
}
