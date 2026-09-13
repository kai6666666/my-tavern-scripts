// @ts-nocheck
/**
 * render-dice-config-backup-export-body.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceConfigBackupExportBody(deps: any) {
  const renderDiceConfigBackupExportBody = (): string => `
    <div class="acu-config-backup-content">
      ${deps.renderDiceConfigBackupPrivacyNotice('export')}
      <div class="acu-config-backup-section-head">
        <div class="acu-config-backup-section-title">选择要导出的配置模块</div>
        <div class="acu-config-backup-selection-actions">
          <button type="button" class="acu-config-backup-select-all acu-setting-action-btn acu-config-backup-mini-btn">全选</button>
          <button type="button" class="acu-config-backup-invert acu-setting-action-btn acu-config-backup-mini-btn">反选</button>
          <button type="button" class="acu-config-backup-clear acu-setting-action-btn acu-config-backup-mini-btn">清空选择</button>
        </div>
      </div>
      <div class="acu-config-backup-module-list">
        ${deps.renderDiceConfigBackupModuleRows(deps.getDICE_CONFIG_BACKUP_MODULES().map(module => module.id))}
      </div>
    </div>`;
  return renderDiceConfigBackupExportBody;
}
