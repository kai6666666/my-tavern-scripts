// @ts-nocheck
/**
 * clear-composer-if-current-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createClearComposerIfCurrentText(deps: any) {
  const clearComposerIfCurrentText = (sentText: string) => {
    const textarea = deps.getComposerTextarea();
    if (!textarea) return;
    const currentText = deps.syncTextareaDiceCacheFromVisibleText(textarea, deps.readTextareaVisibleValue(textarea)).trim();
    if (currentText !== String(sentText ?? '').trim()) return;

    const { $ } = deps.getCore();
    const $ta = $(textarea);
    deps.setTextareaValueAndNotify(textarea, '');
    deps.clearTextareaDiceCache(textarea);
    $ta.removeData('acu-original-action-text');
    textarea._acuOriginalActionText = null;
  };
  return clearComposerIfCurrentText;
}
