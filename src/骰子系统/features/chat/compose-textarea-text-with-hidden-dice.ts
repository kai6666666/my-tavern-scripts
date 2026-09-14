// @ts-nocheck
/**
 * compose-textarea-text-with-hidden-dice.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createComposeTextareaTextWithHiddenDice(deps: any) {
  const composeTextareaTextWithHiddenDice = (
    visibleText: unknown,
    storedTextareaText: unknown,
    storedLatestDiceText: unknown,
  ): string => {
    const visibleValue = String(visibleText ?? '');
    if (!visibleValue.includes(deps.DICE_RESULT_PLACEHOLDER)) return visibleValue;

    const storedBlocks = deps.extractMetaCheckResultBlocks(storedTextareaText);
    const latestBlocks = deps.extractMetaCheckResultBlocks(storedLatestDiceText);
    const replacementBlocks = storedBlocks.length > 0 ? storedBlocks : latestBlocks;
    const latestText = typeof storedLatestDiceText === 'string' ? storedLatestDiceText : '';
    let replacementIndex = 0;

    return visibleValue.replace(deps.createDiceResultPlaceholderRegex(), () => {
      const replacement =
        replacementBlocks[replacementIndex] ||
        replacementBlocks[replacementBlocks.length - 1] ||
        latestText ||
        '';
      replacementIndex++;
      return replacement;
    });
  };
  return composeTextareaTextWithHiddenDice;
}
