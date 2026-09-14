// @ts-nocheck
/**
 * get-latest-assistant-message-element.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createGetLatestAssistantMessageElement(deps: any) {
  const getLatestAssistantMessageElement = (): JQuery<HTMLElement> => {
    const { $ } = deps.getCore();
    return $('#chat .mes')
      .filter(function () {
        const $message = $(this);
        if ($message.attr('is_user') === 'true' || $message.attr('is_system') === 'true') return false;
        if ($message.hasClass('sys_mes') || $message.attr('data-is-system') === 'true') return false;
        if ($message.find('.name_text').text().trim() === 'System') return false;
        if ($message.find('.mes_text').length === 0) return false;
        if ($message.css('display') === 'none') return false;
        return true;
      })
      .last() as JQuery<HTMLElement>;
  };
  return getLatestAssistantMessageElement;
}
