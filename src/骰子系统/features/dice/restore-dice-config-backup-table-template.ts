// @ts-nocheck
/**
 * restore-dice-config-backup-table-template.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreDiceConfigBackupTableTemplate(deps: any) {
  const restoreDiceConfigBackupTableTemplate = async (
    templateValue: unknown,
    stats: DiceConfigBackupApplyStats,
    onImportAttempt?: () => void,
  ): Promise<void> => {
    if (templateValue === undefined) {
      stats.skipped += 1;
      stats.warnings.push('当前数据库表格模板: 备份文件中没有模板内容，已跳过。');
      return;
    }
    if (!deps.isDiceConfigBackupRecord(templateValue)) {
      stats.skipped += 1;
      stats.warnings.push('当前数据库表格模板: 模板资源结构无效，已跳过。');
      return;
    }

    const api = deps.getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.importTemplateFromData !== 'function') {
      throw new Error('数据库模板导入 API 不可用，无法恢复表格模板。');
    }

    const template = deps.cloneDiceConfigBackupValue(templateValue);
    onImportAttempt?.();
    const result = await Promise.resolve(api.importTemplateFromData(template, { scope: 'chat' }));
    if (deps.isDiceConfigBackupRecord(result) && result.success === false) {
      const message = typeof result.message === 'string' ? result.message : '数据库模板导入失败';
      throw new Error(message);
    }
    console.info('[DICE]配置备份已调用数据库本体 API 导入表格模板:', result);
    stats.added += 1;
  };
  return restoreDiceConfigBackupTableTemplate;
}
