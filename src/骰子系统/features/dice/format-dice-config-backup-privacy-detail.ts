// @ts-nocheck
/**
 * format-dice-config-backup-privacy-detail.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createFormatDiceConfigBackupPrivacyDetail(deps: any) {
  const formatDiceConfigBackupPrivacyDetail = (
    mode: 'export' | 'restore',
    moduleIds: readonly DiceConfigBackupModuleId[],
    backup?: DiceConfigBackupDocument,
  ): string => {
    const actionText =
      mode === 'export'
        ? '备份文件适合自己迁移配置；如果要公开分享，请先检查 JSON 内容，确认没有私密角色、世界观、偏好或外链资源。'
        : '外来备份会合并或覆盖本地配置，可能启用对方的正则、验证规则、预设、外链头像或图标。只恢复可信来源。';
    const sourceText =
      mode === 'restore' && backup
        ? [
            `导出时间: ${backup.exportedAt || '未知'}`,
            `脚本版本: ${backup.scriptVersion || '未知'}`,
            `预设格式: ${backup.presetFormatVersion || '未知'}`,
          ]
        : [];

    return [
      actionText,
      '当前选择的模块可能包含:',
      ...deps.formatDiceConfigBackupSelectedModuleRiskLines(moduleIds),
      ...sourceText,
    ].join('\n');
  };
  return formatDiceConfigBackupPrivacyDetail;
}
