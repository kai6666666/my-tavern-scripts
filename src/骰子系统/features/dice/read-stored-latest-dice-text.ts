// @ts-nocheck
/**
 * read-stored-latest-dice-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadStoredLatestDiceText(deps: any) {
  const readStoredLatestDiceText = (textarea: AcuDiceTextareaElement): string => {
    if (typeof textarea._acuOriginalDiceText === 'string') return textarea._acuOriginalDiceText;
    try {
      const { $ } = deps.getCore();
      const storedText = $(textarea).data('acu-original-dice-text');
      return typeof storedText === 'string' ? storedText : '';
    } catch (_error) {
      return '';
    }
  };
  return readStoredLatestDiceText;
}
