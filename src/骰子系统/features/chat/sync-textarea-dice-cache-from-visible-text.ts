// @ts-nocheck
/**
 * sync-textarea-dice-cache-from-visible-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSyncTextareaDiceCacheFromVisibleText(deps: any) {
  const syncTextareaDiceCacheFromVisibleText = (
    textarea: AcuDiceTextareaElement,
    visibleText = deps.readTextareaVisibleValue(textarea),
  ): string => {
    const visibleValue = String(visibleText ?? '');
    if (!visibleValue.includes(deps.DICE_RESULT_PLACEHOLDER)) {
      const visibleMetaBlocks = deps.extractMetaCheckResultBlocks(visibleValue);
      if (visibleMetaBlocks.length > 0) {
        deps.storeTextareaDiceCache(textarea, visibleValue, visibleMetaBlocks[visibleMetaBlocks.length - 1]);
      } else if (textarea._acuHasDiceData) {
        deps.clearTextareaDiceCache(textarea);
      }
      return visibleValue;
    }

    const realText = deps.resolveTextareaTextWithHiddenDice(textarea, visibleValue);
    const metaBlocks = deps.extractMetaCheckResultBlocks(realText);
    if (metaBlocks.length > 0) {
      deps.storeTextareaDiceCache(textarea, realText, metaBlocks[metaBlocks.length - 1]);
    }
    return realText;
  };
  return syncTextareaDiceCacheFromVisibleText;
}
