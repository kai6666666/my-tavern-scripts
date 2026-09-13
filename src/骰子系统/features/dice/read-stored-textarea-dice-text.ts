// @ts-nocheck
/**
 * read-stored-textarea-dice-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadStoredTextareaDiceText(deps: any) {
  const readStoredTextareaDiceText = (textarea: AcuDiceTextareaElement): string => {
    if (typeof textarea._acuOriginalTextareaText === 'string') return textarea._acuOriginalTextareaText;
    try {
      const { $ } = deps.getCore();
      const storedText = $(textarea).data('acu-original-textarea-text');
      return typeof storedText === 'string' ? storedText : '';
    } catch (_error) {
      return '';
    }
  };
  return readStoredTextareaDiceText;
}
