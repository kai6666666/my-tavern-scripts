// @ts-nocheck
/**
 * intercept-textarea-value.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInterceptTextareaValue(deps: any) {
  const interceptTextareaValue = () => {
    const { $ } = deps.getCore();
    const $ta = $('#send_textarea');
    if (!$ta.length) return;

    const textarea = $ta[0] as AcuDiceTextareaElement;
    if (!textarea || textarea._acuValueIntercepted) return;

    // 标记已拦截，避免重复拦截
    textarea._acuValueIntercepted = true;

    // 保存原始的 value 属性描述符
    const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
    const originalValue = textarea.value;

    // 拦截 value 属性的 getter
    Object.defineProperty(textarea, 'value', {
      get: function (this: HTMLTextAreaElement) {
        // 先获取原始值
        let val: string;
        if (originalDescriptor && originalDescriptor.get) {
          val = originalDescriptor.get.call(this);
        } else {
          val = (this as AcuDiceTextareaElement & { _value?: string })._value || originalValue || '';
        }

        // [性能优化] 快速路径：如果没有骰子数据标记，直接返回
        // 使用 DOM 属性而非 jQuery data，避免每次 getter 都调用 jQuery
        // 解决输入 ) 等字符时卡顿的问题
        const acuTextarea = this as AcuDiceTextareaElement;
        if (!acuTextarea._acuHasDiceData) {
          return val;
        }

        // 检查是否有占位符需要替换，并保留用户在占位符前后继续输入的内容
        if (val && typeof val === 'string' && val.includes(deps.DICE_RESULT_PLACEHOLDER)) {
          return deps.resolveTextareaTextWithHiddenDice(acuTextarea, val);
        }
        return val;
      },
      set: function (this: HTMLTextAreaElement, val: string) {
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.call(this, val);
        } else {
          (this as AcuDiceTextareaElement & { _value?: string })._value = val;
        }
        deps.scheduleViewportBoundsRefresh();
      },
      configurable: true,
    });
  };
  return interceptTextareaValue;
}
