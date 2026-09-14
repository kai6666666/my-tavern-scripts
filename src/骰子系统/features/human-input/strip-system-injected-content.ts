// @ts-nocheck
/**
 * strip-system-injected-content.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStripSystemInjectedContent(deps: any) {
  const stripSystemInjectedContent = (text: unknown, systemActionText?: unknown): string => {
    const normalized = deps.normalizeTrackedText(text);
    const explicitHumanInput = deps.extractExplicitHumanInputText(normalized);
    let result = explicitHumanInput || normalized;
    deps.getHUMAN_INPUT_TAG_BLOCK_PATTERNS().forEach(pattern => {
      result = result.replace(pattern, ' ');
    });
    if (!explicitHumanInput) {
      result = result.replace(deps.getHUMAN_INPUT_ACTION_PATTERN(), ' ');
      result = deps.stripKnownSystemActionText(result, systemActionText);
    }
    result = result.replace(/\[投骰结果已隐藏\]/g, ' ');
    return deps.normalizeTrackedText(result);
  };
  return stripSystemInjectedContent;
}
