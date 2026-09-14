// @ts-nocheck
/**
 * extract-advanced-preset-json-candidates.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createExtractAdvancedPresetJsonCandidates(deps: any) {
  const extractAdvancedPresetJsonCandidates = (sourceText: string): string[] => {
    const candidates: string[] = [];
    const text = sourceText.trim();
    const fencePattern = /```(?:jsonc?|JSONC?|javascript|ts|typescript)?\s*([\s\S]*?)```/g;
    let match: RegExpExecArray | null = fencePattern.exec(text);
    while (match) {
      if (match[1]?.trim()) candidates.push(match[1].trim());
      match = fencePattern.exec(text);
    }

    candidates.push(text);

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      const sliced = text.slice(firstBrace, lastBrace + 1).trim();
      if (sliced && !candidates.includes(sliced)) candidates.push(sliced);
    }

    return candidates;
  };
  return extractAdvancedPresetJsonCandidates;
}
