// @ts-nocheck
/**
 * resolve-textarea-text-with-hidden-dice.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createResolveTextareaTextWithHiddenDice(deps: any) {
  const resolveTextareaTextWithHiddenDice = (
    textarea: AcuDiceTextareaElement,
    visibleText = deps.readTextareaVisibleValue(textarea),
  ): string =>
    deps.composeTextareaTextWithHiddenDice(visibleText, deps.readStoredTextareaDiceText(textarea), deps.readStoredLatestDiceText(textarea));

  return resolveTextareaTextWithHiddenDice;
}
