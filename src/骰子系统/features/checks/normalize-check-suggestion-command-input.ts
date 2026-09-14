// @ts-nocheck
/**
 * normalize-check-suggestion-command-input.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNormalizeCheckSuggestionCommandInput(deps: any) {
  const normalizeCheckSuggestionCommandInput = (rawCommand: string): string => {
    let command = String(rawCommand || '')
      .replace(/^[\s"'`“”‘’「」『』]+|[\s"'`“”‘’「」『』]+$/g, '')
      .replace(/[，,；;]\s*/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    command = command
      .replace(/^对抗(?:检定)?\s*[:：]\s*/, '对抗 ')
      .replace(/^对抗检定\s+/, '对抗 ')
      .replace(/^普通检定\s*[:：]\s*/, '检定 ')
      .replace(/^普通检定\s+/, '检定 ')
      .replace(/^检定\s*[:：]\s*/, '检定 ');

    if (command.startsWith('检定 ')) {
      return `检定 ${deps.normalizeLeadingCheckSuggestionSideShorthand(command.replace(/^检定\s+/, ''))}`.trim();
    }

    if (command.startsWith('对抗 ')) {
      const contestBody = command
        .replace(/^对抗\s+/, '')
        .replace(/\s*[VvＶｖ][SsＳｓ]\s*/g, ' vs ')
        .replace(/\s+(?:对|对抗)\s+/g, ' vs ')
        .replace(/\s+/g, ' ')
        .trim();
      const normalizedSides = contestBody
        .split(/\s+vs\s+/i)
        .map(deps.normalizeLeadingCheckSuggestionSideShorthand)
        .join(' vs ');
      return `对抗 ${normalizedSides}`.trim();
    }

    return command;
  };
  return normalizeCheckSuggestionCommandInput;
}
