// @ts-nocheck
/**
 * render-dice-config-backup-restore-body.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceConfigBackupRestoreBody(deps: any) {
  const renderDiceConfigBackupRestoreBody = (backup: DiceConfigBackupDocument, warnings: readonly string[]): string => {
    const moduleIds = deps.getDiceConfigBackupAvailableModuleIds(backup);
    const allWarnings = deps.getDiceConfigBackupRestoreWarnings(backup, warnings, moduleIds);
    const storageKeyCount = moduleIds.reduce(
      (count, moduleId) => count + Object.keys(backup.modules[moduleId]?.storage || {}).length,
      0,
    );
    const resourceCount = moduleIds.reduce(
      (count, moduleId) => count + deps.getDiceConfigBackupModuleResourceCount(backup.modules[moduleId], moduleId),
      0,
    );
    const itemCountText =
      storageKeyCount > 0 && resourceCount > 0
        ? `${storageKeyCount} + ${resourceCount}`
        : String(storageKeyCount + resourceCount);
    return `
      <div class="acu-config-backup-content">
        ${deps.renderDiceConfigBackupPrivacyNotice('restore')}
        <div class="acu-config-backup-summary-grid">
          <div class="acu-config-backup-summary-card"><div class="acu-config-backup-summary-label">导出时间</div><div class="acu-config-backup-summary-value">${deps.escapeHtml(backup.exportedAt || '未知')}</div></div>
          <div class="acu-config-backup-summary-card"><div class="acu-config-backup-summary-label">模块</div><div class="acu-config-backup-summary-value">${moduleIds.length} 个</div></div>
          <div class="acu-config-backup-summary-card"><div class="acu-config-backup-summary-label">配置/自定义项</div><div class="acu-config-backup-summary-value">${deps.escapeHtml(itemCountText)} 项</div></div>
        </div>
        ${deps.renderDiceConfigBackupWarningSlot(allWarnings)}
        <div class="acu-config-backup-section-head">
          <div class="acu-config-backup-section-title">选择要恢复的配置模块</div>
          <div class="acu-config-backup-selection-actions">
            <button type="button" class="acu-config-backup-select-all acu-setting-action-btn acu-config-backup-mini-btn">全选</button>
            <button type="button" class="acu-config-backup-invert acu-setting-action-btn acu-config-backup-mini-btn">反选</button>
            <button type="button" class="acu-config-backup-clear acu-setting-action-btn acu-config-backup-mini-btn">清空选择</button>
          </div>
        </div>
        <div class="acu-config-backup-module-list">
          ${deps.renderDiceConfigBackupModuleRows(moduleIds, backup)}
        </div>
      </div>`;
  };
  return renderDiceConfigBackupRestoreBody;
}
