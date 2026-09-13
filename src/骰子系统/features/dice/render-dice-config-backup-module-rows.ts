// @ts-nocheck
/**
 * render-dice-config-backup-module-rows.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceConfigBackupModuleRows(deps: any) {
  const renderDiceConfigBackupModuleRows = (
    moduleIds: readonly DiceConfigBackupModuleId[],
    backup?: DiceConfigBackupDocument,
  ): string => {
    if (moduleIds.length === 0) {
      return '<div class="acu-config-backup-empty">没有可用模块</div>';
    }
    return moduleIds
      .map(moduleId => {
        const definition = deps.getDiceConfigBackupModuleDefinition(moduleId);
        if (!definition) return '';
        const payload = backup?.modules[moduleId];
        const storageCount = payload ? Object.keys(payload.storage).length : definition.storageKeys.length;
        const resourceCount = deps.getDiceConfigBackupModuleResourceCount(payload, moduleId);
        const countText = deps.getDiceConfigBackupModuleCountText(moduleId, storageCount, resourceCount, Boolean(payload));
        const deprecatedBadgeHtml =
          definition.deprecated && definition.deprecatedReason
            ? deps.renderDeprecatedBadge(definition.deprecatedReason)
            : '';
        const warningHtml =
          payload?.warnings && payload.warnings.length > 0
            ? `<div class="acu-config-backup-module-warning">${payload.warnings
                .map(warning => `<div><i class="fa-solid fa-triangle-exclamation"></i> ${deps.escapeHtml(warning)}</div>`)
                .join('')}</div>`
            : '';
        return `
          <label class="acu-config-backup-module-row">
            <input type="checkbox" class="acu-config-backup-module-checkbox" value="${deps.escapeHtml(moduleId)}" checked>
            <span class="acu-config-backup-module-main">
              <span class="acu-config-backup-module-title-row">
                <strong class="acu-config-backup-module-name">${deps.escapeHtml(definition.name)}</strong>
                ${deprecatedBadgeHtml}
                <span class="acu-config-backup-module-count">${deps.escapeHtml(countText)}</span>
              </span>
              <span class="acu-config-backup-module-desc">${deps.escapeHtml(definition.description)}</span>
              ${warningHtml}
            </span>
          </label>`;
      })
      .join('');
  };
  return renderDiceConfigBackupModuleRows;
}
