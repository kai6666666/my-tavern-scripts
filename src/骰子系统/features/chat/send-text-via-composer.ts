// @ts-nocheck
/**
 * send-text-via-composer.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSendTextViaComposer(deps: any) {
  const sendTextViaComposer = async (messageText: string): Promise<'composer' | null> => {
    const textarea = deps.getComposerTextarea();
    if (!textarea) return null;

    deps.setTextareaValueAndNotify(textarea, messageText);
    await new Promise(resolve => setTimeout(resolve, 50));

    const sendButton = deps.findComposerSendButton();
    if (sendButton) {
      sendButton.click();
      return 'composer';
    }

    const eventWindow = textarea.ownerDocument.defaultView || window;
    const enterEvent = new eventWindow.KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(enterEvent);
    return 'composer';
  };
  return sendTextViaComposer;
}
