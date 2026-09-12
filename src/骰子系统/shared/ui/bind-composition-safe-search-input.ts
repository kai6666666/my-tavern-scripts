// @ts-nocheck
/**
 * bind-composition-safe-search-input.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBindCompositionSafeSearchInput(deps: any) {
  const bindCompositionSafeSearchInput = (
    binding: CompositionSafeSearchBinding,
    options: CompositionSafeSearchOptions,
  ) => {
    const { root, selector, namespace } = binding;
    const suffix = namespace ? `.${namespace}` : '';
    const eventNames = `compositionstart${suffix} compositionend${suffix} input${suffix}`;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const emitCommit = (input: HTMLInputElement, immediate = false) => {
      const value = String(input.value || '');
      const selectionStart = input.selectionStart ?? value.length;
      const selectionEnd = input.selectionEnd ?? value.length;
      const payload: CompositionSafeSearchPayload = {
        input,
        value,
        selectionStart,
        selectionEnd,
      };
      clearTimer();
      if (immediate || options.delay <= 0) {
        options.onCommit(payload);
        return;
      }
      timer = setTimeout(() => {
        timer = null;
        options.onCommit(payload);
      }, options.delay);
    };

    const bindEvent = (eventName: string, handler: (this: HTMLInputElement) => void) => {
      if (selector) {
        root.on(`${eventName}${suffix}`, selector, function () {
          handler.call(this as HTMLInputElement);
        });
        return;
      }
      root.on(`${eventName}${suffix}`, function () {
        handler.call(this as HTMLInputElement);
      });
    };

    if (selector) {
      root.off(eventNames, selector);
    } else {
      root.off(eventNames);
    }

    bindEvent('compositionstart', function () {
      this.dataset.acuComposing = 'true';
      clearTimer();
    });
    bindEvent('compositionend', function () {
      this.dataset.acuComposing = 'false';
      emitCommit(this, true);
    });
    bindEvent('input', function () {
      if (this.dataset.acuComposing === 'true') return;
      emitCommit(this);
    });
  };
  return bindCompositionSafeSearchInput;
}
