// @ts-nocheck
/**
 * store-textarea-dice-cache.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createStoreTextareaDiceCache(deps: any) {
  const storeTextareaDiceCache = (textarea: AcuDiceTextareaElement, realText: string, latestDiceText?: string) => {
    const metaBlocks = deps.extractMetaCheckResultBlocks(realText);
    const latestText = latestDiceText || metaBlocks[metaBlocks.length - 1] || '';
    if (!realText || metaBlocks.length === 0) {
      deps.clearTextareaDiceCache(textarea);
      return;
    }

    try {
      const { $ } = deps.getCore();
      $(textarea).data('acu-original-textarea-text', realText);
      $(textarea).data('acu-original-dice-text', latestText);
    } catch (_error) {
      // DOM fields below are the hot path for the value getter
    }
    textarea._acuOriginalTextareaText = realText;
    textarea._acuOriginalDiceText = latestText;
    textarea._acuHasDiceData = true;
  };
  return storeTextareaDiceCache;
}
