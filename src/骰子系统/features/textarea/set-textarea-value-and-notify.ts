// @ts-nocheck
/**
 * set-textarea-value-and-notify.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSetTextareaValueAndNotify(deps: any) {
  const setTextareaValueAndNotify = (textarea: HTMLTextAreaElement, value: string) => {
    textarea.value = value;
    deps.notifyTextareaValueChanged(textarea);
  };
  return setTextareaValueAndNotify;
}
