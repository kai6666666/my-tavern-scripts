// @ts-nocheck
/**
 * inject-independent-options.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createInjectIndependentOptions(deps: any) {
  const injectIndependentOptions = htmlContent => {
    const { $ } = deps.getCore();
    $('.acu-embedded-options-container').remove();

    // 复用寻找最新 AI 消息的逻辑
    const getTargetContainer = () => {
      const $allMes = $('#chat .mes');
      const $aiMes = $allMes.filter(function () {
        const $this = $(this);
        if ($this.attr('is_user') === 'true' || $this.attr('is_system') === 'true' || $this.hasClass('sys_mes'))
          return false;
        // 增加 data-is-system 属性判断，兼容性更好
        if ($this.find('.name_text').text().trim() === 'System' || $this.attr('data-is-system') === 'true')
          return false;
        // [修复] 忽略没有文本内容的空消息壳子
        if ($this.find('.mes_text').length === 0) return false;
        if ($this.css('display') === 'none') return false;
        return true;
      });
      if ($aiMes.length === 0) return null;

      const $targetMes = $aiMes.last();
      const $targetText = $targetMes.find('.mes_text');
      const $targetBlock = $targetMes.find('.mes_block');
      if ($targetText.length) return $targetText;
      if ($targetBlock.length) return $targetBlock;
      return $targetMes;
    };

    const $target = getTargetContainer();
    if ($target && $target.length) {
      const optConfig = deps.getConfig();
      const $container = $(
        `<div class="acu-embedded-options-container acu-theme-${optConfig.theme}" style="--acu-opt-font-size:${optConfig.optionFontSize || 12}px;"></div>`,
      );
      $container.html(htmlContent);
      // [修复] 插入到 mes_text 的后面（作为兄弟元素），而不是内部
      // 这样 SillyTavern 重写 mes_text 内容时不会销毁我们的容器
      $target.after($container);
    }
  };
  return injectIndependentOptions;
}
