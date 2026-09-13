// @ts-nocheck
/**
 * restore-dice-result-before-send.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreDiceResultBeforeSend(deps: any) {
  const restoreDiceResultBeforeSend = () => {
    const { $ } = deps.getCore();
    const diceCfg = deps.getDiceConfig();
    const hideInput = diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
    if (hideInput) return;
    const $ta = $('#send_textarea');
    if (!$ta.length) return;

    const textarea = $ta[0] as AcuDiceTextareaElement;
    const currentVisibleVal = deps.readTextareaVisibleValue(textarea);

    // 如果有占位符且有保存的原始文本，替换为真实结果
    if (currentVisibleVal.includes(deps.DICE_RESULT_PLACEHOLDER)) {
      const restoredVal = deps.resolveTextareaTextWithHiddenDice(textarea, currentVisibleVal);
      $ta.val(restoredVal);
      // 发送后不需要再保存，因为消息已经发送
      deps.clearTextareaDiceCache(textarea);
    }
  };
  return restoreDiceResultBeforeSend;
}
