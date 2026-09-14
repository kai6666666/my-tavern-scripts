// @ts-nocheck
/**
 * render-dice-profile-apply-confirm-detail-html.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceProfileApplyConfirmDetailHtml(deps: any) {
  const renderDiceProfileApplyConfirmDetailHtml = (
    moduleIds: readonly DiceConfigBackupModuleId[],
    warnings: readonly string[],
  ): string => {
    const moduleChipsHtml =
      moduleIds.length > 0
        ? moduleIds
            .map(moduleId => {
              const name = deps.getDiceConfigBackupModuleDefinition(moduleId)?.name || moduleId;
              return `<span class="acu-profile-apply-module-chip">${deps.escapeHtml(name)}</span>`;
            })
            .join('')
        : '<span class="acu-profile-apply-empty">没有可应用的模块</span>';
    const warningsHtml =
      warnings.length > 0
        ? `<div class="acu-profile-apply-row acu-profile-apply-warnings">
            <div class="acu-profile-apply-label">
              <i class="fa-solid fa-triangle-exclamation"></i>
              注意
            </div>
            <div class="acu-profile-apply-warning-list">
              ${warnings.map(warning => `<div class="acu-profile-apply-warning">${deps.escapeHtml(warning)}</div>`).join('')}
            </div>
          </div>`
        : '';

    return `
      <div class="acu-profile-apply-confirm">
        <div class="acu-profile-apply-impact-list">
          <div class="acu-profile-apply-impact">
            <i class="fa-solid fa-rotate-left"></i>
            <span><strong>写入前会保存快照</strong>，方便回退。</span>
          </div>
          <div class="acu-profile-apply-impact">
            <i class="fa-solid fa-sliders"></i>
            <span><strong>只改选中模块</strong>，未包含模块保持不变。</span>
          </div>
          <div class="acu-profile-apply-impact">
            <i class="fa-solid fa-code-merge"></i>
            <span><strong>同名项会更新</strong>，同名或同 ID 自定义项按恢复规则合并。</span>
          </div>
        </div>
        <div class="acu-profile-apply-row">
          <div class="acu-profile-apply-label">
            <i class="fa-solid fa-list-check"></i>
            ${moduleIds.length} 个模块
          </div>
          <div class="acu-profile-apply-module-chips">${moduleChipsHtml}</div>
        </div>
        ${warningsHtml}
      </div>
    `;
  };
  return renderDiceProfileApplyConfirmDetailHtml;
}
