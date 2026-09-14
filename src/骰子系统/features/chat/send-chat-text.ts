// @ts-nocheck
/**
 * send-chat-text.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createSendChatTextAndTrigger(deps: any) {
  const sendChatTextAndTrigger = async (messageText: string): Promise<'api' | 'slash' | 'composer' | null> => {
    const text = String(messageText ?? '').trim();
    if (!text) return null;

    let createChatMessagesFn = deps.findRuntimeFunction('createChatMessages');
    if (createChatMessagesFn) {
      try {
        await createChatMessagesFn([{ role: 'user', message: text }], { refresh: 'affected' });
      } catch (err) {
        console.warn('[DICE]ACU createChatMessages 直接发送失败，尝试 Slash 发送', err);
        createChatMessagesFn = null;
      }

      if (createChatMessagesFn) {
        try {
          const triggered = await deps.triggerGenerationAfterDirectSend();
          if (!triggered) console.warn('[DICE]ACU 已直接写入用户消息，但未找到 /trigger 入口');
        } catch (err) {
          console.warn('[DICE]ACU 消息已直接写入，但 /trigger 触发失败', err);
        }
        return 'api';
      }
    }

    let triggerSlashFn = deps.findRuntimeFunction('triggerSlash');
    if (triggerSlashFn) {
      try {
        await triggerSlashFn(`/send raw=true ${deps.quoteSlashArgument(text)}`);
      } catch (err) {
        console.warn('[DICE]ACU triggerSlash 发送失败，尝试 SillyTavern 原生接口', err);
        triggerSlashFn = null;
      }

      if (triggerSlashFn) {
        try {
          await triggerSlashFn('/trigger');
        } catch (err) {
          console.warn('[DICE]ACU triggerSlash 已发送消息，但 /trigger 触发失败', err);
        }
        return 'slash';
      }
    }

    const runSlash = deps.findSillyTavernSlashRunner();
    if (runSlash) {
      try {
        const sendResult = await runSlash(`/send raw=true ${deps.quoteSlashArgument(text)}`);
        if (!sendResult?.isError && !sendResult?.isAborted) {
          try {
            await runSlash('/trigger');
          } catch (triggerError) {
            console.warn('[DICE]ACU ST接口已发送消息，但 /trigger 触发失败', triggerError);
          }
          return 'slash';
        }
        console.warn('[DICE]ACU ST接口 send 失败:', sendResult);
      } catch (err) {
        console.warn('[DICE]ACU ST接口失败，尝试按钮模拟', err);
      }
    }

    return deps.sendTextViaComposer(text);
  };
  return sendChatTextAndTrigger;
}
