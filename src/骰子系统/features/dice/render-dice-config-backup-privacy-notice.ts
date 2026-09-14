// @ts-nocheck
/**
 * render-dice-config-backup-privacy-notice.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceConfigBackupPrivacyNotice(deps: any) {
  const renderDiceConfigBackupPrivacyNotice = (mode: 'export' | 'restore'): string => {
    const title = mode === 'export' ? '公开分享前请检查备份文件' : '恢复前请确认备份来源可信';
    const message =
      mode === 'export'
        ? '备份文件可能包含{{user}}别名等隐私内容。'
        : '外来备份会合并或覆盖本地配置，可能启用对方的表格正则、验证规则、各类骰子系统预设、头像部分可能访问外链资源。';
    return `
      <div class="acu-config-backup-privacy-notice">
        <i class="fa-solid fa-user-shield acu-config-backup-privacy-icon"></i>
        <span class="acu-config-backup-privacy-text">
          <strong>${deps.escapeHtml(title)}</strong>
          <span>${deps.escapeHtml(message)}</span>
        </span>
      </div>`;
  };
  return renderDiceConfigBackupPrivacyNotice;
}
