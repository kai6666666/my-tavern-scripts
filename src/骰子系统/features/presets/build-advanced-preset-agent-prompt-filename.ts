// @ts-nocheck
/**
 * build-advanced-preset-agent-prompt-filename.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBuildAdvancedPresetAgentPromptFilename(deps: any) {
  const buildAdvancedPresetAgentPromptFilename = (presetName: string): string => {
    const safeName =
      presetName
        .trim()
        .replace(/[\\/:*?"<>|]+/g, '_')
        .replace(/\s+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 60) || 'preset';
    const datePart = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    return `acu_advanced_preset_ai_prompt_${safeName}_${datePart}.md`;
  };
  return buildAdvancedPresetAgentPromptFilename;
}
