// @ts-nocheck
/**
 * parse-advanced-preset-source-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createParseAdvancedPresetSourceText(deps: any) {
  const parseAdvancedPresetSourceText = (sourceText: string): unknown => {
    const errors: string[] = [];
    for (const candidate of deps.extractAdvancedPresetJsonCandidates(sourceText)) {
      try {
        return deps.parseAdvancedPresetJsonCandidate(candidate);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
      }
    }
    throw new Error(`无法解析 JSON/JSONC：${errors[0] || '未找到有效对象'}`);
  };
  return parseAdvancedPresetSourceText;
}
