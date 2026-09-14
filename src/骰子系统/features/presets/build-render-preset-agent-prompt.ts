// @ts-nocheck
/**
 * build-render-preset-agent-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { renderPresetAgentPromptTemplate } from '../../docs/render-preset-agent-prompt.md?raw';
export function createBuildRenderPresetAgentPrompt(deps: any) {
  const buildRenderPresetAgentPrompt = (): string => renderPresetAgentPromptTemplate;

  const buildTableTemplateRequirementPresetAgentPrompt = (): string => tableTemplateRequirementPresetAgentPromptTemplate;
  return buildRenderPresetAgentPrompt;
}
