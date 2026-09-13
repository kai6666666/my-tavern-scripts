// @ts-nocheck
/**
 * render-dice-config-backup-warning-list.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceConfigBackupWarningList(deps: any) {
  const renderDiceConfigBackupWarningList = (warnings: readonly string[]): string => {
    if (warnings.length === 0) return '';
    return `
      <div class="acu-config-backup-warning-list">
        ${warnings.map(warning => `<div><i class="fa-solid fa-triangle-exclamation"></i> ${deps.escapeHtml(warning)}</div>`).join('')}
      </div>`;
  };
  return renderDiceConfigBackupWarningList;
}
