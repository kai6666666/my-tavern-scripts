// @ts-nocheck
/**
 * clear-textarea-dice-cache.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearTextareaDiceCache(deps: any) {
  const clearTextareaDiceCache = (textarea: AcuDiceTextareaElement) => {
    try {
      const { $ } = deps.getCore();
      $(textarea).removeData('acu-original-dice-text');
      $(textarea).removeData('acu-original-textarea-text');
    } catch (_error) {
      // ignore cache cleanup failures; DOM fields are cleared below
    }
    textarea._acuOriginalDiceText = null;
    textarea._acuOriginalTextareaText = null;
    textarea._acuHasDiceData = false;
  };
  return clearTextareaDiceCache;
}
