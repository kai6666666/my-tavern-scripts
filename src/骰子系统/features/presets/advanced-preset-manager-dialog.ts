// @ts-nocheck
/**
 * advanced-preset-manager-dialog.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowAdvancedPresetManager(deps: any) {
  const showAdvancedPresetManager = (options: { fromDicePanel?: boolean } = {}) => {
    const { $ } = deps.getCore();
    $('.acu-edit-overlay').remove();
    const fromDicePanel = options.fromDicePanel === true;
    if (fromDicePanel) {
      deps.clearModalStack();
    }
    deps.pushModal('showAdvancedPresetManager', () => showAdvancedPresetManager(options));

    const config = deps.getConfig();
    const diceCfg = deps.getDiceConfig();

    const overlay = $(`
      <div class="acu-edit-overlay">
        <div class="acu-edit-dialog acu-dice-settings-dialog acu-theme-${config.theme}">
          <div class="acu-dice-settings-header">
            <h3><i class="fa-solid fa-dice-d20"></i> 检定设置</h3>
            <div class="acu-dice-settings-actions">
              ${deps.getTutorialButtonHtml('diceSettings', '查看检定设置教程', 'acu-help-btn')}
              <button type="button" class="acu-close-btn" aria-label="关闭检定设置" title="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
          </div>

           <div class="acu-dice-settings-body">
            <div class="acu-dice-settings-section">
              <div class="acu-setting-row" id="dice-settings-preset-row">
                  <div class="acu-setting-info">
                      <span class="acu-setting-label"><i class="fa-solid fa-sliders"></i> 检定预设</span>
                  </div>
                  <button type="button" id="acu-open-preset-list" class="acu-setting-action-btn acu-dice-settings-action">
                      <i class="fa-solid fa-cog"></i> 管理
                  </button>
              </div>
              <div class="acu-setting-row" id="dice-settings-attr-preset-row">
                  <div class="acu-setting-info">
                      <span class="acu-setting-label"><i class="fa-solid fa-gem"></i> 属性预设</span>
                  </div>
                  <button type="button" id="acu-open-attr-preset" class="acu-setting-action-btn acu-dice-settings-action">
                      <i class="fa-solid fa-cog"></i> 管理
                  </button>
              </div>
              <div class="acu-setting-row" id="dice-settings-crazy-mode-row">
                  <div class="acu-setting-info">
                      <span class="acu-setting-label"><i class="fa-solid fa-fire"></i> 疯狂模式</span>
                  </div>
                  <select id="cfg-crazy-mode" class="acu-setting-select acu-dice-settings-select">
                      <option value="0">○ 关闭</option>
                      <option value="25">◔ 低</option>
                      <option value="50">◑ 中</option>
                      <option value="75">◕ 高</option>
                      <option value="100">● 极限</option>
                  </select>
              </div>
            </div>
              <div id="dice-result-display-settings" class="acu-dice-settings-section">
                <div class="acu-setting-row acu-setting-row-toggle">
                    <div class="acu-setting-info">
                        <span class="acu-setting-label">隐藏输入栏中的检定结果</span>
                    </div>
                    <label class="acu-toggle">
                        <input type="checkbox" id="cfg-hide-dice-result" ${diceCfg.hideDiceResultFromUser ? 'checked' : ''}>
                        <span class="acu-toggle-slider"></span>
                    </label>
                </div>
                <div class="acu-setting-row acu-setting-row-toggle">
                    <div class="acu-setting-info">
                        <span class="acu-setting-label">覆盖上一次检定结果</span>
                    </div>
                    <label class="acu-toggle">
                        <input type="checkbox" id="cfg-overwrite-last-dice-result" ${diceCfg.overwriteLastDiceResult !== false ? 'checked' : ''}>
                        <span class="acu-toggle-slider"></span>
                    </label>
                </div>
                 <div class="acu-setting-row acu-setting-row-toggle">
                    <div class="acu-setting-info">
                        <span class="acu-setting-label">隐藏聊天记录中的检定结果</span>
                    </div>
                    <label class="acu-toggle">
                        <input type="checkbox" id="cfg-hide-dice-result-chat" ${diceCfg.hideDiceResultInChat ? 'checked' : ''}>
                        <span class="acu-toggle-slider"></span>
                    </label>
                </div>
            </div>
           </div>
         </div>
      </div>
    `);

    $('body').append(overlay);
    deps.bindTutorialButtonsIn(overlay);

    // 关闭按钮
    overlay.find('.acu-close-btn').on('click', () => {
      overlay.remove();
      deps.popModal();
    });

    overlay.find('#acu-open-preset-list').on('click', () => {
      overlay.remove();
      deps.showPresetListDialog({ fromDicePanel });
    });

    overlay.find('#acu-open-attr-preset').on('click', () => {
      overlay.remove();
      deps.showAttributePresetManager();
    });

    // 疯狂模式设置
    const initCrazyModeUI = () => {
      const crazyConfig = deps.getCrazyModeConfig();
      // 根据enabled和crazyLevel设置下拉框的值
      const selectValue = crazyConfig.enabled ? crazyConfig.crazyLevel : 0;
      overlay.find('#cfg-crazy-mode').val(selectValue);

      // 下拉选择事件
      overlay.find('#cfg-crazy-mode').on('change', function () {
        const value = parseInt($(this).val() as string, 10);
        if (value === 0) {
          deps.saveCrazyModeConfig({ enabled: false, crazyLevel: 50 });
        } else {
          deps.saveCrazyModeConfig({ enabled: true, crazyLevel: value });
        }
      });
    };
    initCrazyModeUI();

    // 隐藏设置开关
    overlay.find('#cfg-hide-dice-result').on('change', function () {
      const hide = $(this).is(':checked');
      deps.saveDiceConfig({ hideDiceResultFromUser: hide });
      console.info('[DICE]应用投骰结果隐藏/显示设置(输入栏)...', hide);
      deps.hideDiceResultsInUserMessages();
    });

    overlay.find('#cfg-overwrite-last-dice-result').on('change', function () {
      const overwrite = $(this).is(':checked');
      deps.saveDiceConfig({ overwriteLastDiceResult: overwrite });
      console.info('[DICE]应用投骰结果覆盖设置...', overwrite);
    });

    overlay.find('#cfg-hide-dice-result-chat').on('change', function () {
      const hide = $(this).is(':checked');
      deps.saveDiceConfig({ hideDiceResultInChat: hide });
      console.info('[DICE]应用投骰结果隐藏/显示设置(聊天记录)...', hide);
      // 这里不需要立即重新渲染聊天，因为只有新生成的才会受影响，
      // 或者如果需要立即生效可能需要重新处理dom，但通常只需保存配置
    });

    // 点击遮罩关闭
    deps.setupOverlayClose(overlay, 'acu-edit-overlay', () => {
      overlay.remove();
      deps.popModal();
    });
  };
  return showAdvancedPresetManager;
}
