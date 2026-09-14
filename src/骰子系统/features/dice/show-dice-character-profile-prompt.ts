// @ts-nocheck
/**
 * show-dice-character-profile-prompt.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createShowDiceCharacterProfilePrompt(deps: any) {
  const showDiceCharacterProfilePrompt = (detection: DiceCharacterProfileDetection): Promise<'apply' | 'save' | 'skip'> => {
    const { $ } = deps.getCore();
    const config = deps.getConfig();
    const profile = detection.profile;
    return new Promise(resolve => {
      $('.acu-profile-prompt-overlay').remove();
      const overlay = $(`
        <div class="acu-profile-prompt-overlay acu-theme-${deps.escapeHtml(config.theme)}" tabindex="-1">
          <div class="acu-profile-prompt-dialog" role="dialog" aria-modal="true">
            <div class="acu-profile-prompt-header">
              <span class="acu-profile-prompt-title"><i class="fa-solid fa-layer-group"></i> 角色卡内置配置方案</span>
              <button type="button" class="acu-profile-prompt-close" title="关闭" aria-label="关闭"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="acu-profile-prompt-body">
              <div class="acu-profile-prompt-name">${deps.escapeHtml(profile.name)}</div>
              <div class="acu-profile-prompt-text">检测到当前角色卡携带骰子系统配置方案。它已保存到方案库；应用后会修改当前骰子系统配置。</div>
              <div class="acu-profile-prompt-meta">
                <span>${deps.escapeHtml(profile.source.characterName || '当前角色卡')}</span>
                <span>${deps.escapeHtml(deps.getDiceProfileModuleNames(profile.moduleIds))}</span>
              </div>
            </div>
            <div class="acu-profile-prompt-footer">
              <button type="button" class="acu-setting-action-btn acu-profile-prompt-skip">跳过</button>
              <button type="button" class="acu-setting-action-btn acu-profile-prompt-save">仅保存到库</button>
              <button type="button" class="acu-setting-action-btn acu-config-backup-primary-btn acu-profile-prompt-apply">应用</button>
            </div>
          </div>
        </div>
      `);
      const finish = (action: 'apply' | 'save' | 'skip') => {
        overlay.remove();
        resolve(action);
      };
      $('body').append(overlay);
      deps.setupOverlayClose(overlay, 'acu-profile-prompt-overlay', () => finish('skip'));
      overlay.on('click', '.acu-profile-prompt-close, .acu-profile-prompt-skip', () => finish('skip'));
      overlay.on('click', '.acu-profile-prompt-save', () => finish('save'));
      overlay.on('click', '.acu-profile-prompt-apply', () => finish('apply'));
    });
  };
  return showDiceCharacterProfilePrompt;
}
