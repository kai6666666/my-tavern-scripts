// @ts-nocheck
/**
 * dice-settings-panel.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowDiceSettingsPanel(deps: any) {
  const showDiceSettingsPanel = (isDND = false) => {
    const { $ } = deps.getCore();
    $('.acu-dice-config-overlay').remove();

    const config = deps.getConfig();
    const diceCfg = deps.getDiceConfig();

    const ruleTitle = isDND ? 'DND 规则设置' : 'COC 规则设置';
    const resetText = isDND ? '恢复 DND 默认' : '恢复 COC 默认';

    // 默认值定义
    const defaults = isDND
      ? { critSuccess: 20, critFail: 1 }
      : { critSuccess: 5, critFail: 96, hardDiv: 2, extremeDiv: 5 };

    // 当前值：只有用户明确设置过才显示，否则留空用 placeholder
    const currentCritSuccess = isDND
      ? diceCfg.dndCritSuccess !== undefined && diceCfg.dndCritSuccess !== defaults.critSuccess
        ? diceCfg.dndCritSuccess
        : ''
      : diceCfg.critSuccessMax !== undefined && diceCfg.critSuccessMax !== defaults.critSuccess
        ? diceCfg.critSuccessMax
        : '';
    const currentCritFail = isDND
      ? diceCfg.dndCritFail !== undefined && diceCfg.dndCritFail !== defaults.critFail
        ? diceCfg.dndCritFail
        : ''
      : diceCfg.critFailMin !== undefined && diceCfg.critFailMin !== defaults.critFail
        ? diceCfg.critFailMin
        : '';
    const currentHardDiv =
      !isDND && diceCfg.difficultSuccessDiv !== undefined && diceCfg.difficultSuccessDiv !== defaults.hardDiv
        ? diceCfg.difficultSuccessDiv
        : '';
    const currentExtremeDiv =
      !isDND && diceCfg.hardSuccessDiv !== undefined && diceCfg.hardSuccessDiv !== defaults.extremeDiv
        ? diceCfg.hardSuccessDiv
        : '';

    const tieRule = diceCfg.contestTieRule || 'initiator_lose';
    const hideDiceResultFromUser =
      diceCfg.hideDiceResultFromUser !== undefined ? diceCfg.hideDiceResultFromUser : false;
    const hideDiceResultInChat = diceCfg.hideDiceResultInChat !== undefined ? diceCfg.hideDiceResultInChat : false;
    const overwriteLastDiceResult = diceCfg.overwriteLastDiceResult !== false;

    const cocExtraHtml = isDND
      ? ''
      : `
            <div class="acu-dice-cfg-row">
                <div class="acu-dice-cfg-item">
                    <label>困难 (÷)</label>
                    <div class="acu-stepper" data-id="cfg-hard-div" data-min="2" data-max="5" data-step="1">
                        <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                        <span class="acu-stepper-value">${currentHardDiv || defaults.hardDiv}</span>
                        <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <div class="acu-dice-cfg-item">
                    <label>极难 (÷)</label>
                    <div class="acu-stepper" data-id="cfg-extreme-div" data-min="3" data-max="10" data-step="1">
                        <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                        <span class="acu-stepper-value">${currentExtremeDiv || defaults.extremeDiv}</span>
                        <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
            </div>
        `;

    const panelHtml = `
            <div class="acu-dice-config-overlay">
                <div class="acu-dice-config-dialog acu-theme-${config.theme}">
                    <div class="acu-dice-cfg-header">
                        <span><i class="fa-solid fa-cog"></i> ${ruleTitle}</span>
                        <button class="acu-config-close"><i class="fa-solid fa-times"></i></button>
                    </div>
                    <div class="acu-dice-cfg-body">
                        <div class="acu-dice-cfg-row">
                            <div class="acu-dice-cfg-item">
                                <label>大成功阈值</label>
                                <div class="acu-stepper" data-id="cfg-crit-success" data-min="1" data-max="100" data-step="1">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${currentCritSuccess || defaults.critSuccess}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="acu-dice-cfg-item">
                                <label>大失败阈值</label>
                                <div class="acu-stepper" data-id="cfg-crit-fail" data-min="1" data-max="100" data-step="1">
                                    <button class="acu-stepper-btn acu-stepper-dec"><i class="fa-solid fa-minus"></i></button>
                                    <span class="acu-stepper-value">${currentCritFail || defaults.critFail}</span>
                                    <button class="acu-stepper-btn acu-stepper-inc"><i class="fa-solid fa-plus"></i></button>
                                </div>
                            </div>
                        </div>
                        ${cocExtraHtml}
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item">
                                <label>对抗平手规则</label>
                                <select id="cfg-tie-rule">
                                    <option value="initiator_lose" ${tieRule === 'initiator_lose' ? 'selected' : ''}>发起方判负 (默认)</option>
                                    <option value="tie" ${tieRule === 'tie' ? 'selected' : ''}>双方平手</option>
                                    <option value="initiator_win" ${tieRule === 'initiator_win' ? 'selected' : ''}>发起方判胜</option>
                                </select>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item acu-cfg-toggle-item">
                                <label>隐藏输入栏中的检定结果</label>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-hide-dice-result" ${hideDiceResultFromUser ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item acu-cfg-toggle-item">
                                <label>覆盖上一次检定结果</label>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-overwrite-last-dice-result" ${overwriteLastDiceResult ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-row acu-cfg-full-row">
                            <div class="acu-dice-cfg-item acu-cfg-toggle-item">
                                <label>隐藏聊天记录中的检定结果</label>
                                <label class="acu-toggle">
                                    <input type="checkbox" id="cfg-hide-dice-result-chat" ${hideDiceResultInChat ? 'checked' : ''}>
                                    <span class="acu-toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        <div class="acu-dice-cfg-actions">
                            <button type="button" id="cfg-reset-dice">${resetText}</button>
                            <button type="button" id="cfg-save-dice">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    const $panel = $(panelHtml);
    $('body').append($panel);

    $panel.css({
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      'z-index': '31300',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center',
      padding: '20px',
      'box-sizing': 'border-box',
    });

    const closePanel = () => $panel.remove();
    $panel.find('.acu-config-close').click(closePanel);
    deps.setupOverlayClose($panel, 'acu-dice-config-overlay', closePanel);

    // === Stepper 步进器事件 ===
    $panel.find('.acu-stepper').each(function () {
      const $stepper = $(this);
      const id = $stepper.data('id');
      const min = parseInt($stepper.data('min'));
      const max = parseInt($stepper.data('max'));
      const step = parseInt($stepper.data('step'));
      const $value = $stepper.find('.acu-stepper-value');

      const updateValue = newVal => {
        newVal = Math.max(min, Math.min(max, newVal));
        $value.text(newVal);
      };

      const getCurrentValue = () => {
        const text = $value.text().replace(/[^\d]/g, '');
        return parseInt(text) || min;
      };

      $stepper.find('.acu-stepper-dec').on('click', function () {
        updateValue(getCurrentValue() - step);
      });

      $stepper.find('.acu-stepper-inc').on('click', function () {
        updateValue(getCurrentValue() + step);
      });
    });

    $panel.find('#cfg-save-dice').click(function () {
      const newCfg = { contestTieRule: $('#cfg-tie-rule').val() };

      // 从stepper读取值
      const getStepperValue = id => {
        const $stepper = $panel.find(`.acu-stepper[data-id="${id}"]`);
        if ($stepper.length) {
          const text = $stepper.find('.acu-stepper-value').text().replace(/[^\d]/g, '');
          return text !== '' ? parseInt(text, 10) : null;
        }
        return null;
      };

      const critSuccessVal = getStepperValue('cfg-crit-success');
      const critFailVal = getStepperValue('cfg-crit-fail');

      if (isDND) {
        newCfg.dndCritSuccess = critSuccessVal !== null ? critSuccessVal : defaults.critSuccess;
        newCfg.dndCritFail = critFailVal !== null ? critFailVal : defaults.critFail;
      } else {
        newCfg.critSuccessMax = critSuccessVal !== null ? critSuccessVal : defaults.critSuccess;
        newCfg.critFailMin = critFailVal !== null ? critFailVal : defaults.critFail;

        const hardDivVal = getStepperValue('cfg-hard-div');
        const extremeDivVal = getStepperValue('cfg-extreme-div');
        newCfg.difficultSuccessDiv = hardDivVal !== null ? hardDivVal : defaults.hardDiv;
        newCfg.hardSuccessDiv = extremeDivVal !== null ? extremeDivVal : defaults.extremeDiv;
      }

      // 保存"隐藏输入栏中的检定结果"设置
      newCfg.hideDiceResultFromUser = $('#cfg-hide-dice-result').is(':checked');
      // 保存"覆盖上一次检定结果"设置
      newCfg.overwriteLastDiceResult = $('#cfg-overwrite-last-dice-result').is(':checked');
      // 保存"隐藏聊天记录中的检定结果"设置
      newCfg.hideDiceResultInChat = $('#cfg-hide-dice-result-chat').is(':checked');

      deps.saveDiceConfig(newCfg);
      // 保存后立即应用隐藏逻辑
      console.info('[DICE]应用投骰结果隐藏/显示设置...');
      deps.hideDiceResultsInUserMessages();
      closePanel();
    });

    $panel.find('#cfg-reset-dice').click(function () {
      // 重置stepper到默认值
      const resetStepper = (id, defaultValue) => {
        const $stepper = $panel.find(`.acu-stepper[data-id="${id}"]`);
        if ($stepper.length) {
          $stepper.find('.acu-stepper-value').text(defaultValue);
        }
      };

      resetStepper('cfg-crit-success', defaults.critSuccess);
      resetStepper('cfg-crit-fail', defaults.critFail);
      if (!isDND) {
        resetStepper('cfg-hard-div', defaults.hardDiv);
        resetStepper('cfg-extreme-div', defaults.extremeDiv);
      }
    });
  };
  return showDiceSettingsPanel;
}
