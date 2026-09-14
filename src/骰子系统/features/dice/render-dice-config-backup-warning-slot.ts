// @ts-nocheck
/**
 * render-dice-config-backup-warning-slot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRenderDiceConfigBackupWarningSlot(deps: any) {
  const renderDiceConfigBackupWarningSlot = (warnings: readonly string[]): string =>
    `<div class="acu-config-backup-warning-slot">${deps.renderDiceConfigBackupWarningList(warnings)}</div>`;
  return renderDiceConfigBackupWarningSlot;
}
