// @ts-nocheck
/**
 * notify-textarea-value-changed.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createNotifyTextareaValueChanged(deps: any) {
  const notifyTextareaValueChanged = (textarea: HTMLTextAreaElement) => {
    const EventCtor = textarea.ownerDocument.defaultView?.Event || Event;
    textarea.dispatchEvent(new EventCtor('input', { bubbles: true }));
    textarea.dispatchEvent(new EventCtor('change', { bubbles: true }));
  };
  return notifyTextareaValueChanged;
}
