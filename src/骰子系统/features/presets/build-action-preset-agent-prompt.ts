// @ts-nocheck
/**
 * build-action-preset-agent-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
import { actionPresetAgentPromptTemplate } from '../../docs/action-preset-agent-prompt.md?raw';
export function createBuildActionPresetAgentPrompt(deps: any) {
  const buildActionPresetAgentPrompt = (): string => actionPresetAgentPromptTemplate;

  const buildRenderPresetAgentPrompt = (): string => renderPresetAgentPromptTemplate;
  return buildActionPresetAgentPrompt;
}
