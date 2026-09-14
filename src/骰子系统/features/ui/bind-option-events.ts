// @ts-nocheck
/**
 * bind-option-events.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createBindOptionEvents(deps: any) {
  const bindOptionEvents = () => {
    const { $ } = deps.getCore();
    $('body')
      .off('click.acu_check_suggestion')
      .on('click.acu_check_suggestion', '.acu-check-suggestion-btn', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const config = deps.getConfig();
        const displayText = deps.safeDecodeURIComponent($(this).attr('data-display') || '');
        const commandText = deps.safeDecodeURIComponent($(this).attr('data-command') || '');
        const executed = deps.executeCheckSuggestionCommand(displayText, commandText);
        if (!executed) return;

        if (config.clickOptionToAutoSend === false) {
          $('#send_textarea').focus();
          return;
        }

        const messageText = deps.getResolvedComposerText();
        const sendMode = await deps.sendChatTextAndTrigger(messageText);
        if (sendMode && sendMode !== 'composer') {
          deps.clearComposerIfCurrentText(messageText);
        } else if (!sendMode) {
          $('#send_textarea').focus();
        }
      });

    // 移除旧的直接绑定，改用 Body 委托，提升性能并防止动态元素事件丢失
    $('body')
      .off('click.acu_opt')
      .on('click.acu_opt', '.acu-opt-btn', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        const config = deps.getConfig();
        const val = deps.safeDecodeURIComponent($(this).data('val'));

        // 情况1: 没勾选自动发送 -> 填入输入框
        if (!config.clickOptionToAutoSend) {
          deps.smartInsertToTextarea(val, 'action');
          $('#send_textarea').focus();
          return;
        }

        // 情况2: 自动发送。统一兼容全局函数、TavernHelper 包装对象、ST Slash API 和按钮兜底。
        const sendMode = await deps.sendChatTextAndTrigger(val);
        if (!sendMode) {
          deps.smartInsertToTextarea(val, 'action');
          $('#send_textarea').focus();
        }
      });
  };
  return bindOptionEvents;
}
