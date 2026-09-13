// @ts-nocheck
/**
 * restore-dice-config-backup-table-template-rollback-snapshot.ts
 * Feature-Sliced 模块（工厂版，DI 注入依赖）。
 */
export function createRestoreDiceConfigBackupTableTemplateRollbackSnapshot(deps: any) {
  const restoreDiceConfigBackupTableTemplateRollbackSnapshot = async (snapshot: unknown): Promise<string[]> => {
    const warnings: string[] = [];
    const template =
      deps.isDiceConfigBackupRecord(snapshot) && 'template' in snapshot
        ? (snapshot as DiceConfigBackupTableTemplateRollbackSnapshot).template
        : snapshot;
    if (!deps.isDiceConfigBackupRecord(template)) {
      warnings.push('当前数据库表格模板: 恢复前没有可用模板快照，无法自动撤回已导入的模板。');
      return warnings;
    }
    const api = deps.getDiceConfigBackupTableTemplateApi();
    if (!api || typeof api.importTemplateFromData !== 'function') {
      warnings.push('当前数据库表格模板: 数据库模板导入 API 不可用，无法自动回滚模板。');
      return warnings;
    }
    try {
      const result = await Promise.resolve(api.importTemplateFromData(deps.cloneDiceConfigBackupValue(template), { scope: 'chat' }));
      if (deps.isDiceConfigBackupRecord(result) && result.success === false) {
        const message = typeof result.message === 'string' ? result.message : '未知错误';
        warnings.push(`当前数据库表格模板: 回滚失败：${message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      warnings.push(`当前数据库表格模板: 回滚异常：${message}`);
    }
    warnings.forEach(warning => console.warn('[DICE]配置备份回滚数据库表格模板提示:', warning));
    return warnings;
  };
  return restoreDiceConfigBackupTableTemplateRollbackSnapshot;
}
