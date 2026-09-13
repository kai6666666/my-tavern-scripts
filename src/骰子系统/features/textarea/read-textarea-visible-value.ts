// @ts-nocheck
/**
 * read-textarea-visible-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createReadTextareaVisibleValue(deps: any) {
  const readTextareaVisibleValue = (textarea: HTMLTextAreaElement): string => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
    if (originalDescriptor?.get) return String(originalDescriptor.get.call(textarea) ?? '');
    return String((textarea as AcuDiceTextareaElement & { _value?: string })._value ?? '');
  };
  return readTextareaVisibleValue;
}
